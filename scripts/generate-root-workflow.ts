#!/usr/bin/env tsx
/**
 * Generates .github/workflows/code-check.yml and .github/workflows/test.yml
 * from each template's .github/workflows/code-check.yml and shared/workflows/test-*.yml.
 * Run: npm run generate:ci  (or yarn generate:ci)
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { pathToFileURL } from 'url';
import YAML from 'yaml';
import {
  ROOT_STACKS,
  FULL_ROOT_STACKS,
  MONOREPO_PREFIX_STACKS,
  TEMPLATES_DIR,
  TEST_SOURCE,
  FULL_TEST_SOURCE,
  STACK_DEFINITIONS,
} from './lib/stacks.js';
import { ROOT, VERSIONS } from './lib/utils.js';
import { logger } from './lib/logger.js';

const STACKS = ROOT_STACKS;

interface WorkflowStep {
  uses?: string;
  id?: string;
  name?: string;
  run?: string;
  with?: Record<string, string | number | boolean>;
  'working-directory'?: string;
}

interface WorkflowJob {
  'runs-on'?: string;
  permissions?: Record<string, string>;
  outputs?: Record<string, string>;
  needs?: string;
  if?: string;
  defaults?: { run: { 'working-directory': string } };
  container?: Record<string, unknown>;
  services?: Record<string, unknown>;
  env?: Record<string, string>;
  steps?: WorkflowStep[];
}

interface Workflow {
  jobs?: Record<string, WorkflowJob>;
}

const readWorkflow = (dir: string): Workflow => {
  const path = join(ROOT, dir, '.github', 'workflows', 'code-check.yml');
  const raw = readFileSync(path, 'utf8');
  return YAML.parse(raw) as Workflow;
};

const readSharedWorkflow = (filename: string): Workflow => {
  const path = join(ROOT, 'shared', 'workflows', filename);
  const raw = readFileSync(path, 'utf8');
  return YAML.parse(raw) as Workflow;
};

/** 単体用ワークフロー（相対パス）をモノレポ用に変換。path / working-directory / go-version-file / global-json-file / key の hashFiles を dir でプレフィックス */
export const transformStepsForMonorepo = (
  steps: WorkflowStep[],
  dir: string,
): WorkflowStep[] => {
  const result: WorkflowStep[] = [];
  for (const step of steps) {
    if (step.uses && step.uses.includes('checkout')) continue;
    const s = { ...step, with: step.with ? { ...step.with } : undefined };
    if (s.with) {
      if (s.with.path) {
        const p = String(s.with.path);
        if (
          !p.startsWith('/') &&
          !p.startsWith('~') &&
          !p.startsWith(`${TEMPLATES_DIR}/`)
        ) {
          s.with.path = `${dir}/${s.with.path}`;
        }
      }
      if (s.with['working-directory']) s.with['working-directory'] = dir;
      if (s.with['go-version-file'])
        s.with['go-version-file'] = `${dir}/${s.with['go-version-file']}`;
      if (s.with['python-version-file'])
        s.with['python-version-file'] =
          `${dir}/${s.with['python-version-file']}`;
      if (s.with['global-json-file'])
        s.with['global-json-file'] = `${dir}/${s.with['global-json-file']}`;
      if (typeof s.with.key === 'string' && s.with.key.includes('hashFiles')) {
        s.with.key = s.with.key
          .replace(
            /hashFiles\('([^']*)',\s*'([^']*)'\)/g,
            (_, a, b) => `hashFiles('${dir}/${a}', '${dir}/${b}')`,
          )
          .replace(
            /hashFiles\('([^']*)'\)/g,
            (_, a) => `hashFiles('${dir}/${a}')`,
          );
      }
    }
    if (s.run) {
      // Extract major version for NodeSource setup script (e.g., "24" from "24.11.0")
      const majorVersion = VERSIONS.node.split('.')[0];
      s.run = s.run.replace(/\$\{NODE_VERSION\}/g, majorVersion);
      if (!s['working-directory']) s['working-directory'] = dir;
    }
    result.push(s);
  }
  result.unshift({ uses: 'actions/checkout@v4' });
  return result;
};

export const transformNodeOnlySteps = (
  steps: WorkflowStep[],
  dir: string,
): WorkflowStep[] => {
  const result: WorkflowStep[] = [];
  for (const step of steps) {
    if (step.uses && step.uses.includes('checkout')) continue;
    if (step.uses && step.uses.includes('setup-node')) {
      result.push({
        uses: 'actions/setup-node@v4',
        with: {
          'node-version': VERSIONS.node,
          cache: 'yarn',
          'cache-dependency-path': `${dir}/yarn.lock`,
        },
      });
      continue;
    }
    result.push(step);
  }
  result.unshift({ uses: 'actions/checkout@v4' });
  return result;
};

export const mergeFormatAndLintSteps = (
  formatJob: WorkflowJob | undefined,
  lintJob: WorkflowJob | undefined,
  dir: string,
): WorkflowStep[] => {
  const steps: WorkflowStep[] = [{ uses: 'actions/checkout@v4' }];
  const formatSteps = formatJob?.steps ?? [];
  const nodeRunParts: string[] = ['yarn install', 'yarn format'];
  for (const s of formatSteps) {
    if (s.run && s.run.includes('yarn lint')) nodeRunParts.push('yarn lint');
  }
  steps.push({
    uses: 'actions/setup-node@v4',
    with: {
      'node-version': VERSIONS.node,
    },
  });
  const lockPath = `${dir}/yarn.lock`;
  steps.push({
    uses: 'actions/cache@v4',
    with: {
      path: `${dir}/node_modules`,
      key:
        '${{ runner.os }}-yarn-' +
        dir +
        "-${{ hashFiles('" +
        lockPath +
        "') }}",
      'restore-keys': '${{ runner.os }}-yarn-' + dir + '-',
    },
  });
  steps.push({
    name: 'yarn format & lint',
    run: `cd ${dir} && ${nodeRunParts.join(' && ')}`,
  });
  steps.push({
    uses: 'ruby/setup-ruby@v1',
    with: {
      'ruby-version': VERSIONS.ruby,
      'working-directory': dir,
      'bundler-cache': true,
    },
  });
  const lintSteps = lintJob?.steps ?? [];
  for (const step of lintSteps) {
    if (step.uses) continue;
    if (step.run) {
      steps.push({
        name: step.name ?? step.run.split(/\s+/)[0],
        run: step.run,
        'working-directory': dir,
      });
    }
  }
  return steps;
};

const buildRootWorkflow = (): Record<string, WorkflowJob> => {
  const jobs: Record<string, WorkflowJob> = {};

  const ALL_STACKS = [...STACKS, ...FULL_ROOT_STACKS];
  const filtersBlock = ALL_STACKS.map(
    (s) => `${s.id}:\n  - '${s.pathFilter}'`,
  ).join('\n');

  jobs.changes = {
    'runs-on': 'ubuntu-latest',
    permissions: { contents: 'read', 'pull-requests': 'read' },
    outputs: Object.fromEntries(
      ALL_STACKS.map((s) => [s.id, '${{ steps.filter.outputs.' + s.id + ' }}']),
    ),
    steps: [
      { uses: 'actions/checkout@v4' },
      {
        uses: 'dorny/paths-filter@v3',
        id: 'filter',
        with: { filters: filtersBlock },
      },
    ],
  };

  jobs.generate_check = {
    'runs-on': 'ubuntu-latest',
    steps: [
      { uses: 'actions/checkout@v4' },
      {
        uses: 'actions/setup-node@v4',
        with: {
          'node-version': VERSIONS.node,
          cache: 'yarn',
          'cache-dependency-path': 'yarn.lock',
        },
      },
      { name: 'Install dependencies', run: 'yarn install' },
      { name: 'Lint', run: 'yarn lint' },
      { name: 'Run tests', run: 'yarn test' },
      { name: 'Run generate:all', run: 'yarn generate:all' },
      { name: 'Check for uncommitted changes', run: 'git diff --exit-code' },
    ],
  };

  for (const stack of ALL_STACKS) {
    const workflow = readWorkflow(stack.dir);
    const workflowJobs = workflow.jobs ?? {};
    const jobIds = Object.keys(workflowJobs);

    if (jobIds.length === 1 && workflowJobs[jobIds[0]].steps) {
      const rawSteps = workflowJobs[jobIds[0]].steps ?? [];
      const steps = MONOREPO_PREFIX_STACKS.includes(stack.id)
        ? transformStepsForMonorepo(rawSteps, stack.dir)
        : transformNodeOnlySteps(rawSteps, stack.dir);
      jobs[stack.id] = {
        needs: 'changes',
        if: `needs.changes.outputs.${stack.id} == 'true'`,
        'runs-on': 'ubuntu-latest',
        defaults: { run: { 'working-directory': stack.dir } },
        steps,
      };
    } else {
      const formatJob = workflowJobs.format;
      const lintJob = workflowJobs.lint;
      const steps = mergeFormatAndLintSteps(formatJob, lintJob, stack.dir);
      jobs[stack.id] = {
        needs: 'changes',
        if: `needs.changes.outputs.${stack.id} == 'true'`,
        'runs-on': 'ubuntu-latest',
        steps,
      };
    }
  }

  return jobs;
};

const buildTestWorkflow = (): Record<string, WorkflowJob> => {
  const jobs: Record<string, WorkflowJob> = {};

  const ALL_TEST_SOURCE = { ...TEST_SOURCE, ...FULL_TEST_SOURCE };
  const testStacks = [...STACKS, ...FULL_ROOT_STACKS].filter(
    (s) => ALL_TEST_SOURCE[s.dir],
  );
  const filtersBlock = testStacks
    .map((s) => `${s.id}:\n  - '${s.pathFilter}'`)
    .join('\n');

  jobs.changes = {
    'runs-on': 'ubuntu-latest',
    permissions: { contents: 'read', 'pull-requests': 'read' },
    outputs: Object.fromEntries(
      testStacks.map((s) => [s.id, '${{ steps.filter.outputs.' + s.id + ' }}']),
    ),
    steps: [
      { uses: 'actions/checkout@v4' },
      {
        uses: 'dorny/paths-filter@v3',
        id: 'filter',
        with: { filters: filtersBlock },
      },
    ],
  };

  for (const stack of testStacks) {
    const workflowFile = ALL_TEST_SOURCE[stack.dir];
    const workflow = readSharedWorkflow(workflowFile);
    const workflowJob = workflow.jobs?.test;
    if (!workflowJob) continue;

    const rawSteps = workflowJob.steps ?? [];
    const steps =
      stack.runtime === 'node'
        ? transformNodeOnlySteps(rawSteps, stack.dir)
        : transformStepsForMonorepo(rawSteps, stack.dir);

    const job: WorkflowJob = {
      needs: 'changes',
      if: `needs.changes.outputs.${stack.id} == 'true'`,
      'runs-on': 'ubuntu-latest',
      steps,
    };

    if (workflowJob.container) job.container = workflowJob.container;
    if (workflowJob.services) job.services = workflowJob.services;
    if (workflowJob.env) job.env = workflowJob.env;

    jobs[stack.id] = job;
  }

  return jobs;
};

const buildDevcontainerWorkflow = (): Record<string, WorkflowJob> => {
  const jobs: Record<string, WorkflowJob> = {};

  const ALL_DEVCONTAINER_STACKS = [
    ...STACK_DEFINITIONS.map((s) => ({ id: s.id, dir: s.dir })),
    ...FULL_ROOT_STACKS.map((s) => ({ id: s.id, dir: s.dir })),
  ];
  const filtersBlock = ALL_DEVCONTAINER_STACKS.map(
    (s) => `${s.id}:\n  - '${s.dir}/.devcontainer/**'`,
  ).join('\n');

  jobs.changes = {
    'runs-on': 'ubuntu-latest',
    permissions: { contents: 'read', 'pull-requests': 'read' },
    outputs: Object.fromEntries(
      ALL_DEVCONTAINER_STACKS.map((s) => [
        s.id,
        '${{ steps.filter.outputs.' + s.id + ' }}',
      ]),
    ),
    steps: [
      { uses: 'actions/checkout@v4' },
      {
        uses: 'dorny/paths-filter@v3',
        id: 'filter',
        with: { filters: filtersBlock },
      },
    ],
  };

  for (const stack of ALL_DEVCONTAINER_STACKS) {
    jobs[stack.id] = {
      needs: 'changes',
      if: `needs.changes.outputs.${stack.id} == 'true'`,
      'runs-on': 'ubuntu-latest',
      steps: [
        { uses: 'actions/checkout@v4' },
        {
          uses: 'hadolint/hadolint-action@v3.1.0',
          with: {
            dockerfile: `${stack.dir}/.devcontainer/Dockerfile`,
            'failure-threshold': 'error',
          },
        },
      ],
    };
  }

  return jobs;
};

export function run(): void {
  const header =
    "# Generated by yarn generate:ci - edit shared/workflows/ or template's .github/workflows/ instead.\n\n";

  // Generate code-check.yml
  const codeCheckTemplatePath = join(
    ROOT,
    'scripts',
    'templates',
    'code-check.yml',
  );
  const codeCheckTemplate = readFileSync(
    codeCheckTemplatePath,
    'utf8',
  ).trimEnd();
  const codeCheckJobs = buildRootWorkflow();
  const codeCheckJobsYaml = YAML.stringify(
    { jobs: codeCheckJobs },
    { lineWidth: 0 },
  );
  const codeCheckOutPath = join(ROOT, '.github', 'workflows', 'code-check.yml');
  writeFileSync(
    codeCheckOutPath,
    header + codeCheckTemplate + '\n' + codeCheckJobsYaml,
    'utf8',
  );
  logger.generated(codeCheckOutPath);

  // Generate test.yml
  const testTemplatePath = join(ROOT, 'scripts', 'templates', 'test.yml');
  const testTemplate = readFileSync(testTemplatePath, 'utf8').trimEnd();
  const testJobs = buildTestWorkflow();
  const testJobsYaml = YAML.stringify({ jobs: testJobs }, { lineWidth: 0 });
  const testOutPath = join(ROOT, '.github', 'workflows', 'test.yml');
  writeFileSync(
    testOutPath,
    header + testTemplate + '\n' + testJobsYaml,
    'utf8',
  );
  logger.generated(testOutPath);

  // Generate devcontainer-build.yml
  const devcontainerTemplatePath = join(
    ROOT,
    'scripts',
    'templates',
    'devcontainer-build.yml',
  );
  const devcontainerTemplate = readFileSync(
    devcontainerTemplatePath,
    'utf8',
  ).trimEnd();
  const devcontainerJobs = buildDevcontainerWorkflow();
  const devcontainerJobsYaml = YAML.stringify(
    { jobs: devcontainerJobs },
    { lineWidth: 0 },
  );
  const devcontainerOutPath = join(
    ROOT,
    '.github',
    'workflows',
    'devcontainer-build.yml',
  );
  writeFileSync(
    devcontainerOutPath,
    header + devcontainerTemplate + '\n' + devcontainerJobsYaml,
    'utf8',
  );
  logger.generated(devcontainerOutPath);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  run();
}
