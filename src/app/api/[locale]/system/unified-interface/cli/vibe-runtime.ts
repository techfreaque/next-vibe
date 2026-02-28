#!/usr/bin/env bun

/**
 * Vibe CLI Main Entry Point
 * Command line interface that can execute any route.ts from generated index files
 */

// Register Bun plugin for CLI widget overrides BEFORE any other imports.
import "./cli-widget-plugin";
// Side-effect: registers global error sink so all logger.error() calls persist to error_logs
import "../shared/logger/error-persist";

import { Command } from "commander";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { enableDebug, enableMcpSilentMode } from "@/config/debug";
import type { CountryLanguage } from "@/i18n/core/config";

import { createEndpointLogger } from "../shared/logger/endpoint";
import { Platform } from "../shared/types/platform";
import { scopedTranslation as cliScopedTranslation } from "./i18n";
import { type EnvironmentResult, loadEnvironment } from "./runtime/environment";
import {
  ErrorHandler,
  setupGlobalErrorHandlers,
} from "./runtime/execution-errors";
import {
  CliInputParser,
  type CliRequestData,
  type ParsedCliData,
} from "./runtime/parsing";

export const binaryStartTime = Date.now();

// Load environment first and capture platform
const environmentResult: EnvironmentResult = loadEnvironment();

/** The detected CLI platform (CLI for local dev, CLI_PACKAGE for npm package) */
export const cliPlatform = environmentResult.platform;

/** Whether running from npm package */
export const isCliPackage: boolean = environmentResult.isPackage;

/** Project root path if detected */
export const projectRoot: string | null = environmentResult.projectRoot;

/**
 * CLI Options interface for type safety
 */
interface CliOptions {
  data?: string;
  locale: CountryLanguage;
  output?: "json" | "pretty";
  verbose?: boolean;
  debug?: boolean;
  interactive?: boolean;
  dryRun?: boolean;
  platform?: Platform;
}

/**
 * CLI Constants to avoid literal strings
 */
const CLI_NAME = "vibe" as const;
const CLI_VERSION = "3.0.0" as const;
const DEFAULT_OUTPUT = "pretty" as const;

import { env } from "@/config/env";

import {
  type CliCompatiblePlatform,
  RouteDelegationHandler,
} from "./runtime/route-executor";

const program = new Command();

const { t: earlyT } = cliScopedTranslation.scopedT(env.VIBE_CLI_LOCALE);

program
  .name(CLI_NAME)
  .description(earlyT("vibe.help.description"))
  .version(CLI_VERSION);

// Main command - execute any route with schema-driven UI

program
  .argument("[command]", earlyT("vibe.help.usage"))
  .argument("[args...]", earlyT("vibe.help.commands"))
  .option("-d, --data <json>", earlyT("vibe.executeCommand"))
  .option(
    "-l, --locale <locale>",
    earlyT("vibe.help.locale"),
    env.VIBE_CLI_LOCALE,
  )
  .option("-o, --output <format>", earlyT("vibe.output"), DEFAULT_OUTPUT)

  .option(
    "-v, --verbose", // eslint-disable-line i18next/no-literal-string
    earlyT("vibe.help.verbose"),
    false,
  )
  .option(
    "-x, --debug", // eslint-disable-line i18next/no-literal-string
    earlyT("vibe.help.verbose"),
    false,
  )
  .option("-i, --interactive", earlyT("vibe.help.interactive"), false)
  .option("--dry-run", earlyT("vibe.help.dryRun"), false)
  .option("--preview", earlyT("vibe.help.preview"), false)
  .option(
    "--platform <platform>", // eslint-disable-line i18next/no-literal-string
    `Override detected platform. Valid values: ${Object.values(Platform).join(", ")}`, // eslint-disable-line i18next/no-literal-string
  )
  .helpOption(false) // Disable Commander's built-in -h/--help — we handle it ourselves
  .allowUnknownOption() // Allow dynamic CLI arguments
  .action(
    async (
      command: string,
      args: string[],
      options: CliOptions,
      cmd: Record<string, string | number | boolean>,
    ) => {
      // Enable MCP silent mode FIRST if this is an MCP command
      if (command === "mcp") {
        enableMcpSilentMode();

        // Change to PROJECT_ROOT immediately if set
        const projectRoot = process.env.PROJECT_ROOT;
        if (projectRoot) {
          process.chdir(projectRoot);
        }
      }

      // Resolve effective platform: CLI arg override (if valid CliCompatiblePlatform) else auto-detected
      const cliCompatibleValues: CliCompatiblePlatform[] = [
        Platform.CLI,
        Platform.CLI_PACKAGE,
        Platform.MCP,
      ];
      const platformOverride = options.platform
        ? (cliCompatibleValues.find((v) => v === options.platform) ?? null)
        : null;
      const effectivePlatform: CliCompatiblePlatform =
        platformOverride ?? cliPlatform;

      const debug = options.debug || options.verbose;
      const logger = createEndpointLogger(
        debug ?? false,
        Date.now(),
        options.locale,
      );
      const { t } = cliScopedTranslation.scopedT(options.locale);
      // Setup global error handlers
      setupGlobalErrorHandlers(logger);

      if (debug) {
        logger.debug(
          `[CLI] Executing command: ${command} ${(args || []).join(" ")} (verbose: ${debug}, interactive: ${options.interactive ?? false})`,
        );
        enableDebug();
      }

      // Initialize CLI resource manager and performance monitoring
      const { cliResourceManager } = await import("./runtime/debug");
      await cliResourceManager.initialize(logger, options.locale);
      const performanceMonitor = cliResourceManager.getPerformanceMonitor();

      try {
        // Initialize performance monitoring
        performanceMonitor.mark("initStart");

        performanceMonitor.mark("initEnd");

        // Interactive mode — launch interactive route navigator
        // Handles: `vibe -i`, `vibe help -i`, `vibe --interactive`
        if (
          options.interactive &&
          (!command ||
            command === "help" ||
            command === "h" ||
            command === "-i")
        ) {
          const { getCliUser } = await import("./auth/cli-user");
          const { HelpRepository } =
            await import("@/app/api/[locale]/system/help/repository");
          const userResult = await getCliUser(logger, options.locale);
          const user = userResult.success ? userResult.data : undefined;
          await HelpRepository.startInteractive(
            user,
            options.locale,
            effectivePlatform,
          );
          await cliResourceManager.cleanupAndExit(logger, debug ?? false, {
            success: true,
          });
          return;
        }

        // If no command provided or bare -h/--help, show help overview
        if (
          !command ||
          command === "-h" ||
          command === "--help" ||
          command === "-?"
        ) {
          performanceMonitor.mark("routeStart");
          const helpResult = await RouteDelegationHandler.executeRoute(
            "help",
            {
              data: undefined,
              urlPathParams: undefined,
              cliArgs: {
                positionalArgs: [],
                namedArgs: {},
              },
              locale: options.locale,
              platform: effectivePlatform,
              output: options.output ?? DEFAULT_OUTPUT,
              verbose: debug ?? false,
              interactive: options.interactive ?? false,
              dryRun: options.dryRun ?? false,
            },
            logger,
          );
          performanceMonitor.mark("routeEnd");

          performanceMonitor.mark("renderStart");
          if (helpResult.formattedOutput) {
            // Write output and wait for it to drain before exiting (important when piped)
            await new Promise<void>((resolve) => {
              process.stdout.write(`${helpResult.formattedOutput}\n`, () => {
                resolve();
              });
            });
          }
          performanceMonitor.mark("renderEnd");

          await cliResourceManager.cleanupAndExit(
            logger,
            debug ?? false,
            helpResult,
          );
          return;
        }

        // Handle -h / --help — redirect to `vibe help <command>`
        if (
          args?.includes("-h") ||
          args?.includes("--help") ||
          args?.includes("-?")
        ) {
          performanceMonitor.mark("routeStart");
          const helpResult = await RouteDelegationHandler.executeRoute(
            "help",
            {
              data: undefined,
              urlPathParams: undefined,
              cliArgs: {
                positionalArgs: [command],
                namedArgs: {},
              },
              locale: options.locale,
              platform: effectivePlatform,
              output: options.output ?? DEFAULT_OUTPUT,
              verbose: debug ?? false,
              interactive: options.interactive ?? false,
              dryRun: options.dryRun ?? false,
            },
            logger,
          );
          performanceMonitor.mark("routeEnd");

          performanceMonitor.mark("renderStart");
          if (helpResult.formattedOutput) {
            await new Promise<void>((resolve) => {
              process.stdout.write(`${helpResult.formattedOutput}\n`, () => {
                resolve();
              });
            });
          }
          performanceMonitor.mark("renderEnd");

          await cliResourceManager.cleanupAndExit(
            logger,
            debug ?? false,
            helpResult,
          );
          return;
        }

        // Parse CLI arguments for dynamic field mapping
        const cmdWithParent = cmd as { parent?: { rawArgs?: string[] } };
        // If rawArgs is not available, use args directly as positional arguments
        const rawArgs = cmdWithParent.parent?.rawArgs;
        const parsedArgs = rawArgs
          ? CliInputParser.parseCliArguments(args || [], rawArgs, logger)
          : CliInputParser.parseCliArgumentsSimple(args || []);
        // Raw tokens after the command name — stored for endpoint-aware re-parsing.
        // Find the command name itself (e.g. "check") in rawArgs, then take everything after it.
        // This correctly includes unknown flags like --fix that commander passes through in args[].
        const commandIndex = rawArgs
          ? rawArgs.findIndex((a) => a === command)
          : -1;
        const rawTokens =
          rawArgs && commandIndex >= 0
            ? rawArgs.slice(commandIndex + 1)
            : args || [];

        // Execute the command with schema-driven UI
        performanceMonitor.mark("parseStart");
        let parsedData: ParsedCliData | undefined;
        if (options.data) {
          try {
            // Clean up the data string - remove any potential corruption
            const cleanData = options.data.trim();
            // Try to parse JSON directly - let JSON.parse handle validation
            parsedData = JSON.parse(cleanData) as ParsedCliData;
          } catch (error) {
            if (debug) {
              logger.error("JSON parse error", error as Error, {
                originalData: options.data,
              });
            }
            // Use empty object as fallback
            parsedData = {};
          }
        }
        performanceMonitor.mark("parseEnd");

        performanceMonitor.mark("routeStart");
        const result = await RouteDelegationHandler.executeRoute(
          command,
          {
            data: parsedData as CliRequestData | undefined,
            urlPathParams: undefined,
            cliArgs: {
              positionalArgs: parsedArgs.positionalArgs,
              namedArgs: parsedArgs.namedArgs,
              rawTokens,
            },
            locale: options.locale,
            platform: effectivePlatform,
            output: options.output ?? DEFAULT_OUTPUT,
            verbose: debug ?? false,
            interactive: options.interactive ?? false,
            dryRun: options.dryRun ?? false,
          },
          logger,
        );
        performanceMonitor.mark("routeEnd");

        performanceMonitor.mark("renderStart");
        if (result.formattedOutput && command !== "mcp") {
          // Write output and wait for it to drain before exiting (important when piped)
          await new Promise<void>((resolve) => {
            process.stdout.write(`${result.formattedOutput}\n`, () => {
              resolve();
            });
          });
        }
        performanceMonitor.mark("renderEnd");

        // Use the new resource manager for cleanup and exit
        await cliResourceManager.cleanupAndExit(logger, debug ?? false, result);
      } catch (error) {
        const handled = ErrorHandler.handleError(parseError(error), logger);

        logger.error(handled.message);

        if (debug) {
          logger.error(t("vibe.errors.executionFailed"), parseError(error));
        }

        // Cleanup and exit with error code
        await cliResourceManager.cleanupAndExit(logger, debug ?? false, {
          success: false,
          error: t("vibe.errors.executionFailed"),
          errorParams: {
            error: handled.message,
          },
        });
        process.exit(handled.exitCode);
      }
    },
  );

// Parse command line arguments
program.parse();
