/**
 * Build Executor Service
 * Main orchestrator that coordinates all build services
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type {
  BuilderRequest,
  BuilderResponse,
  BuildProfile,
  BuildReport,
  BuildStepResult,
  BundleAnalysis,
  FileToCompile,
} from "../definition";
import { isBunBuildType } from "../definition";
import { BuildProfileEnum, StepStatusEnum } from "../enum";
import { bunCompiler } from "./bun-compiler";
import { bundleAnalyzer } from "./bundle-analyzer";
import { configLoader } from "./config-loader";
import { configValidator } from "./config-validator";
import { errorSuggester } from "./error-suggester";
import { fileCopier } from "./file-copier";
import { folderCleaner } from "./folder-cleaner";
import { npmPackageGenerator } from "./npm-package-generator";
import { outputFormatter } from "./output-formatter";
import { profileService } from "./profile-service";
import { reportGenerator } from "./report-generator";
import { viteCompiler } from "./vite-compiler";

// ============================================================================
// Interface
// ============================================================================

export interface IBuildExecutor {
  /**
   * Execute a build based on the provided configuration
   */
  execute(
    data: BuilderRequest,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<BuilderResponse>>;
}

// ============================================================================
// Implementation
// ============================================================================

export class BuildExecutor implements IBuildExecutor {
  async execute(
    data: BuilderRequest,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<BuilderResponse>> {
    const startTime = Date.now();
    const output: string[] = [];
    const filesBuilt: string[] = [];
    const filesCopied: string[] = [];
    const stepResults: BuildStepResult[] = [];
    const { t } = simpleT(locale);

    // Extract config from configObject (new structure)
    const configObject = data.configObject;
    const profile: BuildProfile =
      (configObject?.profile as BuildProfile) || "development";
    const useParallel = configObject?.parallel !== false;
    const dryRun = configObject?.dryRun;
    const verbose = configObject?.verbose;
    const analyze = configObject?.analyze;
    const minify = configObject?.minify;
    const report = configObject?.report;

    try {
      // Build header with profile info
      output.push(
        outputFormatter.formatHeader(
          `${t("app.api.system.builder.messages.buildStart")} [${profile.toUpperCase()}]`,
        ),
      );
      logger.info("Build started", {
        dryRun,
        verbose,
        profile,
        analyze,
      });

      // Load configuration
      const configResult = await configLoader.load(
        data.configPath,
        {
          foldersToClean: configObject?.foldersToClean,
          filesToCompile: configObject?.filesToCompile as
            | FileToCompile[]
            | undefined,
          filesOrFoldersToCopy: configObject?.filesOrFoldersToCopy ?? undefined,
          npmPackage: configObject?.npmPackage ?? undefined,
        },
        output,
        logger,
        t,
      );

      if (!configResult.success) {
        output.push(outputFormatter.formatError(configResult.message));
        return fail({
          message: configResult.message,
          errorType: configResult.errorType,
        });
      }

      // Apply profile-specific settings
      let buildConfig = profileService.applySettings(
        configResult.data,
        profile,
        {
          minify,
        },
      );

      // Validate configuration
      const validation = configValidator.validate(buildConfig, t);
      if (!validation.valid) {
        for (const error of validation.errors) {
          output.push(outputFormatter.formatError(error));
        }
        return fail({
          message: t("app.api.system.builder.errors.invalidBuildConfig"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }
      for (const warning of validation.warnings) {
        output.push(outputFormatter.formatWarning(warning));
      }

      // Dry run notice
      if (dryRun) {
        output.push(
          outputFormatter.formatWarning(
            t("app.api.system.builder.messages.dryRunMode"),
          ),
        );
      }

      // Execute pre-build hook
      if (buildConfig.hooks?.preBuild) {
        output.push(
          outputFormatter.formatStep(
            t("app.api.system.builder.messages.runningPreBuild"),
          ),
        );
        await buildConfig.hooks.preBuild({
          config: buildConfig,
          profile,
          outputDir: buildConfig.foldersToClean?.[0] || "dist",
          logger,
          addOutput: (msg) =>
            output.push(outputFormatter.formatItem("hook", msg)),
        });
      }

      // Step 1: Clean folders
      if (buildConfig.foldersToClean?.length) {
        const stepStart = Date.now();
        await folderCleaner.clean(
          buildConfig.foldersToClean,
          output,
          logger,
          t,
          dryRun,
        );
        stepResults.push({
          step: "clean",
          success: true,
          duration: Date.now() - stepStart,
          filesAffected: buildConfig.foldersToClean,
        });
      }

      // Step 2: Compile files with Vite
      if (buildConfig.filesToCompile?.length) {
        const stepStart = Date.now();
        const compileResult = await this.compileFiles(
          buildConfig.filesToCompile,
          output,
          filesBuilt,
          logger,
          t,
          dryRun,
          verbose,
          profile,
          buildConfig.hooks?.onFileCompiled,
          useParallel,
        );

        if (!compileResult.success) {
          output.push(outputFormatter.formatError(compileResult.message));
          return fail({
            message: compileResult.message,
            errorType: compileResult.errorType,
          });
        }

        stepResults.push({
          step: "compile",
          success: true,
          duration: Date.now() - stepStart,
          filesAffected: compileResult.data,
        });
      }

      // Step 3: Copy files/folders
      if (buildConfig.filesOrFoldersToCopy?.length) {
        const stepStart = Date.now();
        await fileCopier.copy(
          buildConfig.filesOrFoldersToCopy,
          output,
          filesCopied,
          logger,
          t,
          dryRun,
        );
        stepResults.push({
          step: "copy",
          success: true,
          duration: Date.now() - stepStart,
          filesAffected: filesCopied,
        });
      }

      // Step 5: Generate npm package.json
      let packageJsonContent: string | undefined;
      if (buildConfig.npmPackage) {
        const stepStart = Date.now();
        packageJsonContent = await npmPackageGenerator.generate(
          buildConfig.npmPackage,
          output,
          filesCopied,
          logger,
          t,
          dryRun,
        );
        stepResults.push({
          step: "package",
          success: true,
          duration: Date.now() - stepStart,
        });
      }

      // Step 6: Bundle analysis (if enabled)
      if (analyze && !dryRun) {
        const analysis = await bundleAnalyzer.analyze(
          buildConfig.foldersToClean?.[0] || "dist",
          output,
          t,
        );
        if (analysis.suggestions.length > 0) {
          output.push(
            outputFormatter.formatSection(
              t("app.api.system.builder.messages.optimizationTips"),
            ),
          );
          for (const suggestion of analysis.suggestions) {
            output.push(outputFormatter.formatItem("💡", suggestion));
          }
        }
      }

      // Execute post-build hook
      if (buildConfig.hooks?.postBuild) {
        output.push(
          outputFormatter.formatStep(
            t("app.api.system.builder.messages.runningPostBuild"),
          ),
        );
        await buildConfig.hooks.postBuild({
          config: buildConfig,
          profile,
          outputDir: buildConfig.foldersToClean?.[0] || "dist",
          logger,
          addOutput: (msg) =>
            output.push(outputFormatter.formatItem("hook", msg)),
        });
      }

      // Build summary
      const duration = Date.now() - startTime;
      reportGenerator.appendBuildSummary(
        output,
        stepResults,
        duration,
        filesBuilt,
        filesCopied,
        t,
        profile,
      );

      output.push(
        outputFormatter.formatSuccess(
          t("app.api.system.builder.messages.buildComplete"),
        ),
      );
      logger.info("Build complete", {
        duration,
        filesBuilt: filesBuilt.length,
        profile,
      });

      // Generate build report if requested
      let reportPath: string | undefined;
      if (report && !dryRun) {
        const bundleAnalysisResult = analyze
          ? await bundleAnalyzer.analyze(
              buildConfig.foldersToClean?.[0] || "dist",
              [],
              t,
            )
          : undefined;

        reportPath = await reportGenerator.generate(
          this.createBuildReport(
            duration,
            profile,
            stepResults,
            filesBuilt,
            filesCopied,
            bundleAnalysisResult,
          ),
          output,
          t,
        );
      }

      const response: BuilderResponse = {
        success: true,
        output: output.join("\n"),
        duration,
        filesBuilt: filesBuilt.length > 0 ? filesBuilt : null,
        filesCopied: filesCopied.length > 0 ? filesCopied : null,
        packageJson: packageJsonContent,
        profileUsed:
          profile === "production"
            ? BuildProfileEnum.PRODUCTION
            : BuildProfileEnum.DEVELOPMENT,
        reportPath,
        stepTimings:
          stepResults.length > 0
            ? stepResults.map((s) => ({
                step: s.step,
                duration: s.duration,
                status: s.success
                  ? StepStatusEnum.SUCCESS
                  : StepStatusEnum.FAILED,
                filesAffected: s.filesAffected?.length,
              }))
            : null,
      };
      return success(response);
    } catch (error) {
      const parsedError = parseError(error);
      const duration = Date.now() - startTime;

      // Add actionable error suggestions
      const suggestions = errorSuggester.getSuggestions(parsedError.message, t);
      output.push(
        outputFormatter.formatError(
          `${t("app.api.system.builder.messages.buildFailed")}: ${parsedError.message}`,
        ),
      );
      if (suggestions.length > 0) {
        output.push(
          outputFormatter.formatSection(
            t("app.api.system.builder.messages.suggestions"),
          ),
        );
        for (const suggestion of suggestions) {
          output.push(outputFormatter.formatItem("→", suggestion));
        }
      }

      logger.error("Build failed", { error: parsedError, duration });

      return fail({
        message: "app.api.system.builder.post.errors.buildFailed.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  /**
   * Compile files with caching support
   */
  private async compileFiles(
    files: FileToCompile[],
    output: string[],
    filesBuilt: string[],
    logger: EndpointLogger,
    t: (key: string, params?: Record<string, string | number>) => string,
    dryRun?: boolean,
    verbose?: boolean,
    profile: BuildProfile = "development",
    onFileCompiled?: (filePath: string, size: number) => void,
    parallel = true,
  ): Promise<ResponseType<string[]>> {
    output.push(
      outputFormatter.formatSection(
        t("app.api.system.builder.messages.compilingFiles"),
      ),
    );
    logger.info("Compiling files", {
      count: files.length,
      profile,
      parallel,
    });

    const compiled: string[] = [];

    if (parallel && files.length > 1) {
      // Parallel compilation
      output.push(
        outputFormatter.formatStep(
          t("app.api.system.builder.messages.parallelCompiling", {
            count: files.length,
          }),
        ),
      );
      const startTime = Date.now();

      const results = await Promise.all(
        files.map(async (fileConfig): Promise<ResponseType<string[]>> => {
          const result = await this.compileSingleFile(
            fileConfig,
            output,
            filesBuilt,
            logger,
            t,
            dryRun,
            verbose,
            profile,
          );

          return result;
        }),
      );

      // Check for any failures
      const firstFailure = results.find((r) => !r.success);
      if (firstFailure) {
        return firstFailure;
      }

      const duration = Date.now() - startTime;
      for (const result of results) {
        if (result.success) {
          compiled.push(...result.data);
        }
      }

      output.push(
        outputFormatter.formatStep(
          t("app.api.system.builder.messages.parallelComplete", {
            count: files.length,
            duration,
          }),
        ),
      );
    } else {
      // Sequential compilation
      for (const fileConfig of files) {
        const result = await this.compileSingleFile(
          fileConfig,
          output,
          filesBuilt,
          logger,
          t,
          dryRun,
          verbose,
          profile,
        );

        if (!result.success) {
          return result;
        }

        compiled.push(...result.data);
      }
    }

    // Call onFileCompiled hook if provided
    if (onFileCompiled && !dryRun) {
      for (const filePath of compiled) {
        const size = viteCompiler.getFileSize(filePath);
        if (size > 0) {
          onFileCompiled(filePath, size);
        }
      }
    }

    return success(compiled);
  }

  /**
   * Compile a single file using the appropriate compiler based on build type
   * Returns compiled files on success, throws on failure to propagate error
   */
  private async compileSingleFile(
    fileConfig: FileToCompile,
    output: string[],
    filesBuilt: string[],
    logger: EndpointLogger,
    t: (key: string, params?: Record<string, string | number>) => string,
    dryRun?: boolean,
    verbose?: boolean,
    profile: BuildProfile = "development",
  ): Promise<ResponseType<string[]>> {
    if (isBunBuildType(fileConfig.type)) {
      return bunCompiler.compileFile(
        fileConfig,
        output,
        filesBuilt,
        logger,
        t,
        dryRun,
        verbose,
        profile,
      );
    }

    // Vite build (react-tailwind, react, vanilla)
    return viteCompiler.compileFile(
      fileConfig,
      output,
      filesBuilt,
      logger,
      dryRun,
      verbose,
      profile,
    );
  }

  /**
   * Create a build report object
   */
  private createBuildReport(
    duration: number,
    profile: BuildProfile,
    steps: BuildStepResult[],
    filesBuilt: string[],
    filesCopied: string[],
    bundleAnalysis?: BundleAnalysis,
  ): BuildReport {
    return {
      timestamp: new Date().toISOString(),
      duration,
      profile,
      success: true,
      steps,
      files: { built: filesBuilt, copied: filesCopied },
      bundleAnalysis,
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        cwd: process.cwd(),
      },
    };
  }
}

// Singleton instance
export const buildExecutor = new BuildExecutor();
