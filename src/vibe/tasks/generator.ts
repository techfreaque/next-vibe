/**
 * Task Index Generator (domain-co-located).
 *
 * Scans task.ts / task-runner.ts across the API tree and emits src/generated/tasks/index.ts.
 * Byte-identical to the former tooling/generators/task-index. File lists come from the
 * shared GeneratorContext (scanned once); this generator does no scanning of its own.
 */

import "server-only";

import { readFile } from "node:fs/promises";

import type {
  GeneratorContext,
  GeneratorResult,
} from "next-vibe/core/generators/shared/shared-inputs";
import {
  generateFileHeader,
  getRelativeImportPath,
  writeGeneratedFile,
} from "next-vibe/core/generators/shared/utils";

import { GENERATED_DIR } from "@/env/paths";

const OUTPUT_FILE = `${GENERATED_DIR}/tasks/index.ts`;

/**
 * Validate that every task/runner file exports the expected symbol. Throws a plain
 * Error on the first invalid file (the orchestrator turns it into a failed result).
 */
async function validateTaskFiles(
  taskFiles: string[],
  taskRunnerFiles: string[],
): Promise<string | null> {
  for (const file of taskFiles) {
    const content = await readFile(file, "utf-8");
    if (
      !content.includes("export const tasks") &&
      !content.includes("export { tasks }")
    ) {
      return `Task file ${file} must export 'tasks' array`;
    }
  }
  for (const file of taskRunnerFiles) {
    const content = await readFile(file, "utf-8");
    if (
      !content.includes("export const taskRunners") &&
      !content.includes("export { taskRunners }")
    ) {
      return `Task runner file ${file} must export 'taskRunners' array`;
    }
  }
  return null;
}

/**
 * Build the tasks-index.ts content. Byte-identical to the legacy generator:
 * module indices are assigned in the (sorted) discovery order shared by ctx.files.
 */
function generateContent(
  taskFiles: string[],
  taskRunnerFiles: string[],
  outputFile: string,
): string {
  const imports: string[] = [];
  const taskExports: string[] = [];
  const taskRunnerExports: string[] = [];

  let moduleIndex = 0;

  for (const taskFile of taskFiles) {
    const relativePath = getRelativeImportPath(taskFile, outputFile);
    imports.push(
      `import { tasks as taskModule${moduleIndex} } from "${relativePath}";`,
    );
    taskExports.push(`  ...taskModule${moduleIndex},`);
    moduleIndex++;
  }

  for (const runnerFile of taskRunnerFiles) {
    const relativePath = getRelativeImportPath(runnerFile, outputFile);
    imports.push(
      `import { taskRunners as runnerModule${moduleIndex} } from "${relativePath}";`,
    );
    taskRunnerExports.push(`  ...runnerModule${moduleIndex},`);
    moduleIndex++;
  }

  const header = generateFileHeader(
    "AUTO-GENERATED TASK INDEX",
    "Task Index Generator",
    {
      Implements: "spec.md unified task registry requirements",
      "Task files": taskFiles.length,
      "Task runner files": taskRunnerFiles.length,
    },
  );

  return `${header}

/* eslint-disable prettier/prettier */
/* eslint-disable simple-import-sort/imports */

import type { Task, TaskRegistry } from "next-vibe/tasks/unified-runner/types";

${imports.join("\n")}

const allTasks: Task[] = [
${taskExports.join("\n")}
${taskRunnerExports.join("\n")}
];

const cronTasks = allTasks.filter(
  (task): task is Task & { type: "cron" } => task.type === "cron",
);
const taskRunners = allTasks.filter(
  (task): task is Task & { type: "task-runner" } => task.type === "task-runner",
);

const tasksByCategory: Record<string, Task[]> = allTasks.reduce<
  Record<string, Task[]>
>((acc, task) => {
  const category = String(task.category);
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(task);
  return acc;
}, {});

const tasksByName: Record<string, Task> = allTasks.reduce<Record<string, Task>>(
  (acc, task) => {
    acc[task.name] = task;
    return acc;
  },
  {},
);

export const taskRegistry: TaskRegistry = {
  cronTasks,
  taskRunners,
  allTasks,
  tasksByCategory,
  tasksByName,
};

export { allTasks, cronTasks, taskRunners, tasksByCategory, tasksByName };
export default allTasks;
`;
}

/** Generate the task index. Consumes shared file lists; writes one file. */
export async function generate(
  ctx: GeneratorContext,
): Promise<GeneratorResult> {
  const taskFiles = ctx.files.task;
  const taskRunnerFiles = ctx.files.taskRunner;

  const validationError = await validateTaskFiles(taskFiles, taskRunnerFiles);
  if (validationError) {
    return {
      summary: "task index (failed validation)",
      failed: `Task file validation failed: ${validationError}`,
    };
  }

  const content = generateContent(taskFiles, taskRunnerFiles, OUTPUT_FILE);
  await writeGeneratedFile(OUTPUT_FILE, content);

  return {
    summary: `task index (${taskFiles.length} tasks, ${taskRunnerFiles.length} runners)`,
    counts: { tasks: taskFiles.length, runners: taskRunnerFiles.length },
  };
}
