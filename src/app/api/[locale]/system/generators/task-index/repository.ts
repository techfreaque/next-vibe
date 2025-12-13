/**
 * Task Index Generator Repository
 * Handles task index generation functionality
 */

/* eslint-disable i18next/no-literal-string */
// CLI output messages don't need internationalization

import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";

import type { ResponseType as BaseResponseType } from "next-vibe/shared/types/response.schema";
import {
  fail,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  findFilesRecursively,
  generateFileHeader,
  getRelativeImportPath,
  writeGeneratedFile,
} from "../shared/utils";
import type endpoints from "./definition";

type RequestType = typeof endpoints.POST.types.RequestOutput;
type TaskIndexResponseType = typeof endpoints.POST.types.ResponseOutput;

/**
 * Task Index Generator Repository Interface
 */
interface TaskIndexGeneratorRepository {
  generateTaskIndex(
    data: RequestType,
    logger: EndpointLogger,
  ): Promise<BaseResponseType<TaskIndexResponseType>>;
}

/**
 * Task Index Generator Repository Implementation
 */
class TaskIndexGeneratorRepositoryImpl implements TaskIndexGeneratorRepository {
  async generateTaskIndex(
    data: RequestType,
    logger: EndpointLogger,
  ): Promise<BaseResponseType<TaskIndexResponseType>> {
    const startTime = Date.now();

    try {
      const outputFile = data.outputFile;
      logger.debug("Starting task index generation", { outputFile });

      // Discover task files
      const startDir = join(process.cwd(), "src", "app", "api");

      logger.debug("Discovering task files");
      const taskFiles = findFilesRecursively(startDir, "task.ts");

      logger.debug("Discovering task runner files");
      const taskRunnerFiles = findFilesRecursively(startDir, "task-runner.ts");

      logger.debug("Discovering side task configs");
      const sideTaskFiles = await this.discoverSideTaskConfigs(startDir);

      logger.debug(
        `Found ${taskFiles.length} task.ts files, ${taskRunnerFiles.length} task-runner.ts files, and ${sideTaskFiles.length} side-task config files`,
      );

      // Validate files
      const validationResult = await this.validateTaskFiles(
        taskFiles,
        taskRunnerFiles,
        logger,
      );
      if (!validationResult.success) {
        return fail({
          message:
            "app.api.system.generators.taskIndex.post.errors.validation.title",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: {
            error: validationResult.error || "Validation failed",
          },
        });
      }

      // Generate content
      const content = this.generateContent(
        taskFiles,
        taskRunnerFiles,
        sideTaskFiles,
        outputFile,
      );

      // Write file
      await writeGeneratedFile(outputFile, content, data.dryRun);

      const duration = Date.now() - startTime;
      const tasksFound = taskFiles.length + taskRunnerFiles.length;

      return success({
        success: true,
        message: `Generated task index with ${tasksFound} task files in ${duration}ms`,
        tasksFound,
        duration,
        outputFile: data.dryRun ? undefined : outputFile,
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error("Task index generation failed", {
        error: parseError(error),
      });
      return fail({
        message:
          "app.api.system.generators.taskIndex.post.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: `Task index generation failed: ${parseError(error).message}`,
          duration,
        },
      });
    }
  }

  /**
   * Discover side task configuration files
   */
  private async discoverSideTaskConfigs(startDir: string): Promise<string[]> {
    const candidateFiles = findFilesRecursively(startDir, "side-tasks.ts");
    const sideTaskFiles: string[] = [];

    for (const file of candidateFiles) {
      try {
        const content = await readFile(file, "utf-8");
        if (
          content.includes("export const sideTaskConfigs") ||
          content.includes("export { sideTaskConfigs }")
        ) {
          sideTaskFiles.push(file);
        }
      } catch {
        continue;
      }
    }

    return sideTaskFiles;
  }

  /**
   * Validate discovered task files
   */
  private async validateTaskFiles(
    taskFiles: string[],
    taskRunnerFiles: string[],
    logger: EndpointLogger,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Validate task.ts files
      for (const file of taskFiles) {
        try {
          const content = await readFile(file, "utf-8");

          if (
            !content.includes("export const tasks") &&
            !content.includes("export { tasks }")
          ) {
            return {
              success: false,
              error: `Task file ${file} must export 'tasks' array`,
            };
          }

          const hasLegacyExports =
            content.includes("export const taskDefinition") ||
            content.includes("export const execute");

          if (hasLegacyExports) {
            logger.debug(
              `Task file ${file} has legacy exports - properly migrate to new format`,
            );
          }
        } catch (error) {
          return {
            success: false,
            error: `Failed to validate task file ${file}: ${parseError(error).message}`,
          };
        }
      }

      // Validate task-runner.ts files
      for (const file of taskRunnerFiles) {
        try {
          const content = await readFile(file, "utf-8");

          if (
            !content.includes("export const taskRunners") &&
            !content.includes("export { taskRunners }")
          ) {
            return {
              success: false,
              error: `Task runner file ${file} must export 'taskRunners' array`,
            };
          }
        } catch (error) {
          return {
            success: false,
            error: `Failed to validate task runner file ${file}: ${parseError(error).message}`,
          };
        }
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: `Task file validation failed: ${parseError(error).message}`,
      };
    }
  }

  /**
   * Generate task index content
   */
  private generateContent(
    taskFiles: string[],
    taskRunnerFiles: string[],
    sideTaskFiles: string[],
    outputFile: string,
  ): string {
    const imports: string[] = [];
    const taskExports: string[] = [];
    const taskRunnerExports: string[] = [];

    let moduleIndex = 0;

    // Process task.ts files
    for (const taskFile of taskFiles) {
      const relativePath = getRelativeImportPath(taskFile, outputFile);
      imports.push(
        `import { tasks as taskModule${moduleIndex} } from "${relativePath}";`,
      );
      taskExports.push(`  ...taskModule${moduleIndex},`);
      moduleIndex++;
    }

    // Process task-runner.ts files
    for (const runnerFile of taskRunnerFiles) {
      const relativePath = getRelativeImportPath(runnerFile, outputFile);
      imports.push(
        `import { taskRunners as runnerModule${moduleIndex} } from "${relativePath}";`,
      );
      taskRunnerExports.push(`  ...runnerModule${moduleIndex},`);
      moduleIndex++;
    }

    // Process side-task configuration files
    for (const sideTaskFile of sideTaskFiles) {
      const relativePath = getRelativeImportPath(sideTaskFile, outputFile);
      imports.push(
        `import { sideTaskConfigs as sideTaskModule${moduleIndex} } from "${relativePath}";`,
      );
      taskExports.push(`  ...sideTaskModule${moduleIndex},`);
      moduleIndex++;
    }

    const header = generateFileHeader(
      "AUTO-GENERATED TASK INDEX",
      "Task Index Generator",
      {
        Implements: "spec.md unified task registry requirements",
        "Task files": taskFiles.length,
        "Task runner files": taskRunnerFiles.length,
        "Side task config files": sideTaskFiles.length,
      },
    );

    return `${header}

/* eslint-disable prettier/prettier */
/* eslint-disable simple-import-sort/imports */

import type { Task, TaskRegistry, TaskRunnerManager } from "../unified-interface/tasks/types/repository";
import { UnifiedTaskRunnerRepositoryImpl } from "../unified-interface/tasks/unified-runner/repository";

${imports.join("\n")}

const allTasks: Task[] = [
${taskExports.join("\n")}
${taskRunnerExports.join("\n")}
];

const cronTasks = allTasks.filter((task): task is Task & { type: 'cron' } => task.type === 'cron');
const sideTasks = allTasks.filter((task): task is Task & { type: 'side' } => task.type === 'side');
const taskRunners = allTasks.filter((task): task is Task & { type: 'task-runner' } => task.type === 'task-runner');

const tasksByCategory: Record<string, Task[]> = allTasks.reduce<Record<string, Task[]>>((acc, task) => {
  const category = String(task.category);
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(task);
  return acc;
}, {});

const tasksByName: Record<string, Task> = allTasks.reduce<Record<string, Task>>((acc, task) => {
  acc[task.name] = task;
  return acc;
}, {});

// Create single unified task runner instance as per spec.md
const taskRunner: TaskRunnerManager = new UnifiedTaskRunnerRepositoryImpl();

export const taskRegistry: TaskRegistry = {
  cronTasks,
  sideTasks,
  taskRunners,
  allTasks,
  tasksByCategory,
  tasksByName,
  taskRunner, // Single unified task runner instance
};

export { allTasks, cronTasks, sideTasks, taskRunner, taskRunners, tasksByCategory, tasksByName };
export default allTasks;
`;
  }
}

export const taskIndexGeneratorRepository =
  new TaskIndexGeneratorRepositoryImpl();
