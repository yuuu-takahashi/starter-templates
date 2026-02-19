#!/usr/bin/env node
/**
 * Generates .github/workflows/code-check.yml from each template's
 * .github/workflows/code-check.yml (source of truth).
 * Run: npm run generate:ci  (or yarn generate:ci)
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import YAML from "yaml";

const ROOT = join(process.cwd());
const STACKS = [
  { id: "nextjs", dir: "nextjs", pathFilter: "nextjs/**" },
  { id: "nodejs", dir: "nodejs", pathFilter: "nodejs/**" },
  { id: "react", dir: "react", pathFilter: "react/**" },
  { id: "rails", dir: "rails", pathFilter: "rails/**" },
  { id: "rails_api", dir: "rails-api", pathFilter: "rails-api/**" },
  { id: "sinatra", dir: "sinatra", pathFilter: "sinatra/**" },
];

function readWorkflow(dir) {
  const path = join(ROOT, dir, ".github", "workflows", "code-check.yml");
  const raw = readFileSync(path, "utf8");
  return YAML.parse(raw);
}

function buildRootWorkflow() {
  const jobs = { changes: null };

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

  for (const stack of STACKS) {
    const workflow = readWorkflow(stack.dir);
    const workflowJobs = workflow.jobs || {};
    const jobIds = Object.keys(workflowJobs);

    if (jobIds.length === 1 && workflowJobs[jobIds[0]].steps) {
      const steps = transformNodeOnlySteps(workflowJobs[jobIds[0]].steps, stack.dir);
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
}

function transformNodeOnlySteps(steps, dir) {
  const result = [];
  for (const step of steps) {
    if (step.uses && step.uses.includes("checkout")) continue;
    if (step.uses && step.uses.includes("setup-node")) {
      result.push({
        uses: "actions/setup-node@v4",
        with: {
          "node-version": "22.x",
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
}

function mergeFormatAndLintSteps(formatJob, lintJob, dir) {
  const steps = [{ uses: "actions/checkout@v4" }];
  const formatSteps = formatJob?.steps || [];
  let nodeRunParts = ["yarn install", "yarn format"];
  for (const s of formatSteps) {
    if (s.run && s.run.includes("yarn lint")) nodeRunParts.push("yarn lint");
  }
  steps.push({
    uses: "actions/setup-node@v4",
    with: {
      "node-version": "22.x",
      cache: "yarn",
      "cache-dependency-path": `${dir}/yarn.lock`,
    },
  });
  steps.push({
    name: "yarn format & lint",
    run: `cd ${dir} && ${nodeRunParts.join(" && ")}`,
  });
  steps.push({
    uses: "ruby/setup-ruby@v1",
    with: {
      "working-directory": dir,
      "bundler-cache": true,
    },
  });
  const lintSteps = lintJob?.steps || [];
  for (const step of lintSteps) {
    if (step.uses) continue;
    if (step.run) {
      steps.push({
        name: step.name || step.run.split(/\s+/)[0],
        run: step.run,
        "working-directory": dir,
      });
    }
  }
  return steps;
}

function emitYaml(jobs) {
  const lines = [
    "name: Code Check",
    "",
    "on:",
    "  pull_request:",
    "  push:",
    "    branches: [main]",
    "",
    "defaults:",
    "  run:",
    "    shell: bash",
    "",
    "concurrency:",
    "  group: ${{ github.workflow }}-${{ github.head_ref || github.ref_name }}",
    "  cancel-in-progress: true",
    "",
    "jobs:",
    "  changes:",
    "    runs-on: ubuntu-latest",
    "    permissions:",
    "      contents: read",
    "      pull-requests: read",
    "    outputs:",
    ...STACKS.map((s) => `      ${s.id}: \${{ steps.filter.outputs.${s.id} }}`),
    "    steps:",
    "      - uses: actions/checkout@v4",
    "      - uses: dorny/paths-filter@v3",
    "        id: filter",
    "        with:",
    "          filters: |",
    ...STACKS.flatMap((s) => [`            ${s.id}:`, `              - '${s.pathFilter}'`]),
  ];

  for (const stack of STACKS) {
    const job = jobs[stack.id];
    lines.push("");
    lines.push(`  ${stack.id}:`);
    lines.push("    needs: changes");
    lines.push(`    if: needs.changes.outputs.${stack.id} == 'true'`);
    lines.push("    runs-on: ubuntu-latest");
    if (job.defaults) {
      lines.push("    defaults:");
      lines.push("      run:");
      lines.push(`        working-directory: ${stack.dir}`);
    }
    lines.push("    steps:");
    for (const step of job.steps) {
      if (step.uses) {
        lines.push(`      - uses: ${step.uses}`);
      } else {
        lines.push(`      - name: ${step.name || "run"}`);
      }
      if (step.name && step.uses) lines.push(`        name: ${step.name}`);
      if (step.id) lines.push(`        id: ${step.id}`);
      if (step.with && Object.keys(step.with).length > 0) {
        lines.push("        with:");
        for (const [k, v] of Object.entries(step.with)) {
          if (typeof v === "string" && v.includes("\n")) {
            lines.push(`          ${k}: |`);
            v.split("\n").forEach((l) => lines.push(`            ${l}`));
          } else {
            lines.push(`          ${k}: ${typeof v === "string" ? `"${v}"` : v}`);
          }
        }
      }
      if (step.run) lines.push(`        run: ${step.run}`);
      if (step["working-directory"]) lines.push(`        working-directory: ${step["working-directory"]}`);
    }
  }

  return lines.join("\n");
}

const jobs = buildRootWorkflow();
const yaml = emitYaml(jobs);
const outPath = join(ROOT, ".github", "workflows", "code-check.yml");
const header = "# Generated by npm run generate:ci - edit each template's .github/workflows/code-check.yml instead.\n\n";
writeFileSync(outPath, header + yaml, "utf8");
console.log("Generated:", outPath);
