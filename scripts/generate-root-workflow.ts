#!/usr/bin/env tsx
/**
 * Generates .github/workflows/code-check.yml from each template's
 * .github/workflows/code-check.yml (source of truth).
 * Run: npm run generate:ci  (or yarn generate:ci)
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import YAML from "yaml";

const ROOT: string = join(process.cwd());
const VERSIONS = JSON.parse(readFileSync(join(ROOT, "shared", "versions.json"), "utf8")) as {
  node: string;
  ruby: string;
};

interface Stack {
  id: string;
  dir: string;
  pathFilter: string;
}

const STACKS: Stack[] = [
  { id: "nextjs", dir: "templates/nextjs", pathFilter: "templates/nextjs/**" },
  { id: "nodejs", dir: "templates/nodejs", pathFilter: "templates/nodejs/**" },
  { id: "reactjs", dir: "templates/reactjs", pathFilter: "templates/reactjs/**" },
  { id: "rails", dir: "templates/rails", pathFilter: "templates/rails/**" },
  { id: "rails_api", dir: "templates/rails-api", pathFilter: "templates/rails-api/**" },
  { id: "sinatra", dir: "templates/sinatra", pathFilter: "templates/sinatra/**" },
  { id: "csharp", dir: "templates/csharp", pathFilter: "templates/csharp/**" },
  { id: "go", dir: "templates/go", pathFilter: "templates/go/**" },
];

interface WorkflowStep {
  uses?: string;
  id?: string;
  name?: string;
  run?: string;
  with?: Record<string, string | number | boolean>;
  "working-directory"?: string;
}

interface WorkflowJob {
  "runs-on"?: string;
  permissions?: Record<string, string>;
  outputs?: Record<string, string>;
  needs?: string;
  if?: string;
  defaults?: { run: { "working-directory": string } };
  steps?: WorkflowStep[];
}

interface Workflow {
  jobs?: Record<string, WorkflowJob>;
}

const readWorkflow = (dir: string): Workflow => {
  const path = join(ROOT, dir, ".github", "workflows", "code-check.yml");
  const raw = readFileSync(path, "utf8");
  return YAML.parse(raw) as Workflow;
};

const transformNodeOnlySteps = (steps: WorkflowStep[], dir: string): WorkflowStep[] => {
  const result: WorkflowStep[] = [];
  for (const step of steps) {
    if (step.uses && step.uses.includes("checkout")) continue;
    if (step.uses && step.uses.includes("setup-node")) {
      result.push({
        uses: "actions/setup-node@v4",
        with: {
          "node-version": VERSIONS.node,
          cache: "yarn",
          "cache-dependency-path": `${dir}/yarn.lock`,
        },
      });
      continue;
    }
    result.push(step);
  }
  result.unshift({ uses: "actions/checkout@v4" });
  return result;
};

const mergeFormatAndLintSteps = (
  formatJob: WorkflowJob | undefined,
  lintJob: WorkflowJob | undefined,
  dir: string,
): WorkflowStep[] => {
  const steps: WorkflowStep[] = [{ uses: "actions/checkout@v4" }];
  const formatSteps = formatJob?.steps ?? [];
  const nodeRunParts: string[] = ["yarn install", "yarn format"];
  for (const s of formatSteps) {
    if (s.run && s.run.includes("yarn lint")) nodeRunParts.push("yarn lint");
  }
  steps.push({
    uses: "actions/setup-node@v4",
    with: {
      "node-version": VERSIONS.node,
    },
  });
  const lockPath = `${dir}/yarn.lock`;
  steps.push({
    uses: "actions/cache@v4",
    with: {
      path: `${dir}/node_modules`,
      key: "${{ runner.os }}-yarn-" + dir + "-${{ hashFiles('" + lockPath + "') }}",
      "restore-keys": "${{ runner.os }}-yarn-" + dir + "-",
    },
  });
  steps.push({
    name: "yarn format & lint",
    run: `cd ${dir} && ${nodeRunParts.join(" && ")}`,
  });
  steps.push({
    uses: "ruby/setup-ruby@v1",
    with: {
      "ruby-version": VERSIONS.ruby,
      "working-directory": dir,
      "bundler-cache": true,
    },
  });
  const lintSteps = lintJob?.steps ?? [];
  for (const step of lintSteps) {
    if (step.uses) continue;
    if (step.run) {
      steps.push({
        name: step.name ?? step.run.split(/\s+/)[0],
        run: step.run,
        "working-directory": dir,
      });
    }
  }
  return steps;
};

const buildRootWorkflow = (): Record<string, WorkflowJob> => {
  const jobs: Record<string, WorkflowJob> = {};

  const filtersBlock = STACKS.map((s) => `${s.id}:\n  - '${s.pathFilter}'`).join("\n");

  jobs.changes = {
    "runs-on": "ubuntu-latest",
    permissions: { contents: "read", "pull-requests": "read" },
    outputs: Object.fromEntries(STACKS.map((s) => [s.id, "${{ steps.filter.outputs." + s.id + " }}"])),
    steps: [
      { uses: "actions/checkout@v4" },
      { uses: "dorny/paths-filter@v3", id: "filter", with: { filters: filtersBlock } },
    ],
  };

  jobs.generate_check = {
    "runs-on": "ubuntu-latest",
    steps: [
      { uses: "actions/checkout@v4" },
      {
        uses: "actions/setup-node@v4",
        with: { "node-version": VERSIONS.node, cache: "yarn", "cache-dependency-path": "yarn.lock" },
      },
      { name: "Install dependencies", run: "yarn install" },
      { name: "Run generate:all", run: "yarn generate:all" },
      { name: "Check for uncommitted changes", run: "git diff --exit-code" },
    ],
  };

  for (const stack of STACKS) {
    const workflow = readWorkflow(stack.dir);
    const workflowJobs = workflow.jobs ?? {};
    const jobIds = Object.keys(workflowJobs);

    if (jobIds.length === 1 && workflowJobs[jobIds[0]].steps) {
      const steps = transformNodeOnlySteps(workflowJobs[jobIds[0]].steps ?? [], stack.dir);
      jobs[stack.id] = {
        needs: "changes",
        if: `needs.changes.outputs.${stack.id} == 'true'`,
        "runs-on": "ubuntu-latest",
        defaults: { run: { "working-directory": stack.dir } },
        steps,
      };
    } else {
      const formatJob = workflowJobs.format;
      const lintJob = workflowJobs.lint;
      const steps = mergeFormatAndLintSteps(formatJob, lintJob, stack.dir);
      jobs[stack.id] = {
        needs: "changes",
        if: `needs.changes.outputs.${stack.id} == 'true'`,
        "runs-on": "ubuntu-latest",
        steps,
      };
    }
  }

  return jobs;
};

const templatePath = join(ROOT, "scripts", "templates", "code-check.yml");
const template = readFileSync(templatePath, "utf8").trimEnd();
const jobs = buildRootWorkflow();
const jobsYaml = YAML.stringify({ jobs }, { lineWidth: 0 });
const outPath = join(ROOT, ".github", "workflows", "code-check.yml");
const header = "# Generated by npm run generate:ci - edit each template's .github/workflows/code-check.yml instead.\n\n";
writeFileSync(outPath, header + template + "\n" + jobsYaml, "utf8");
console.log("Generated:", outPath);
