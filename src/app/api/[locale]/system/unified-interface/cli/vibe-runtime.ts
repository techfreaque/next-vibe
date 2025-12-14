#!/usr/bin/env bun

/**
 * Vibe CLI Main Entry Point
 * Command line interface that can execute any route.ts from generated index files
 */

import { Command } from "commander";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { enableDebug, enableMcpSilentMode } from "@/config/debug";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { createEndpointLogger } from "../shared/logger/endpoint";
import { type EnvironmentResult,loadEnvironment } from "./runtime/environment";
import {
  ErrorHandler,
  setupGlobalErrorHandlers,
} from "./runtime/execution-errors";
import {
  parseCliArguments,
  parseCliArgumentsSimple,
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
  userType?: string;
  locale: CountryLanguage;
  output?: string;
  verbose?: boolean;
  debug?: boolean;
  interactive?: boolean;
  dryRun?: boolean;
}

/**
 * CLI Constants to avoid literal strings
 */
const CLI_CONSTANTS = {
  CLI_NAME: "vibe" as const,
  CLI_VERSION: "2.0.0" as const,
  ADMIN_USER_TYPE: "ADMIN" as const,
  DEFAULT_OUTPUT: "pretty" as const,
  JSON_OUTPUT: "json" as const,
  COLON_CHAR: ":" as const,
  QUOTED_COLON_PATTERN: '"":' as const,
} as const;

import { cliEnv } from "./env";
import { cliEntryPoint } from "./runtime/entry-point";

const program = new Command();

const { t: earlyT } = simpleT(cliEnv.VIBE_CLI_LOCALE);

program
  .name(CLI_CONSTANTS.CLI_NAME)
  .description(
    earlyT("app.api.system.unifiedInterface.cli.vibe.help.description"),
  )
  .version(CLI_CONSTANTS.CLI_VERSION);

// Main command - execute any route with schema-driven UI

program
  .argument(
    "[command]",
    earlyT("app.api.system.unifiedInterface.cli.vibe.help.usage"),
  )
  .argument(
    "[args...]",
    earlyT("app.api.system.unifiedInterface.cli.vibe.help.commands"),
  )
  .option(
    // eslint-disable-next-line i18next/no-literal-string
    "-d, --data <json>",
    earlyT("app.api.system.unifiedInterface.cli.vibe.executeCommand"),
  )
  .option(
    // eslint-disable-next-line i18next/no-literal-string
    "-u, --user-type <type>",
    earlyT("app.api.system.unifiedInterface.cli.vibe.help.userType"),
    "ADMIN",
  )
  .option(
    // eslint-disable-next-line i18next/no-literal-string
    "-l, --locale <locale>",
    earlyT("app.api.system.unifiedInterface.cli.vibe.help.locale"),
    cliEnv.VIBE_CLI_LOCALE,
  )
  .option(
    // eslint-disable-next-line i18next/no-literal-string
    "-o, --output <format>",
    earlyT("app.api.system.unifiedInterface.cli.vibe.output"),
    CLI_CONSTANTS.DEFAULT_OUTPUT,
  )

  .option(
    "-v, --verbose", // eslint-disable-line i18next/no-literal-string
    earlyT("app.api.system.unifiedInterface.cli.vibe.help.verbose"),
    false,
  )
  .option(
    "-x, --debug", // eslint-disable-line i18next/no-literal-string
    earlyT("app.api.system.unifiedInterface.cli.vibe.help.verbose"),
    false,
  )
  .option(
    // eslint-disable-next-line i18next/no-literal-string
    "-i, --interactive",
    earlyT("app.api.system.unifiedInterface.cli.vibe.help.interactive"),
    false,
  )
  .option(
    "--dry-run",
    earlyT("app.api.system.unifiedInterface.cli.vibe.help.dryRun"),
    false,
  )
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
      }

      const debug = options.debug || options.verbose;
      const logger = createEndpointLogger(
        debug ?? false,
        Date.now(),
        options.locale,
      );
      const { t } = simpleT(options.locale);
      // Setup global error handlers
      setupGlobalErrorHandlers(logger);

      if (debug) {
        logger.debug("Command execution details", {
          command,
          args: (args || []).join(" "),
          verbose: debug ?? false,
          interactive: options.interactive ?? false,
          rawDataOption: options.data || "none",
        });
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

        // If no command provided, start interactive mode
        if (!command) {
          logger.info(t("app.api.system.unifiedInterface.cli.vibe.startingUp"));
          await cliEntryPoint.executeCommand(
            "interactive",
            {
              user: undefined, // Let route executor handle authentication via getCliUser()
              locale: options.locale,
              platform: cliPlatform,
              output: (options.output ?? CLI_CONSTANTS.DEFAULT_OUTPUT) as
                | "table"
                | "pretty"
                | "json",
              verbose: debug ?? false,
              interactive: options.interactive ?? false,
              dryRun: options.dryRun ?? false,
            },
            logger,
            t,
            options.locale,
          );
          return;
        }

        // Parse CLI arguments for dynamic field mapping
        const cmdWithParent = cmd as { parent?: { rawArgs?: string[] } };
        // If rawArgs is not available, use args directly as positional arguments
        const rawArgs = cmdWithParent.parent?.rawArgs;
        const parsedArgs = rawArgs
          ? parseCliArguments(args || [], rawArgs, logger)
          : parseCliArgumentsSimple(args || []);

        // Execute the command with schema-driven UI
        performanceMonitor.mark("parseStart");
        let parsedData: ParsedCliData | undefined = undefined;
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
        const result = await cliEntryPoint.executeCommand(
          command,
          {
            data: parsedData,
            cliArgs: {
              positionalArgs: parsedArgs.positionalArgs,
              namedArgs: parsedArgs.namedArgs,
            },
            user: undefined, // Let route executor handle authentication via getCliUser()
            locale: options.locale,
            platform: cliPlatform,
            output: (options.output ?? CLI_CONSTANTS.DEFAULT_OUTPUT) as
              | "table"
              | "pretty"
              | "json",
            verbose: debug ?? false,
            interactive: options.interactive ?? false,
            dryRun: options.dryRun ?? false,
          },
          logger,
          t,
          options.locale,
        );
        performanceMonitor.mark("routeEnd");

        performanceMonitor.mark("renderStart");
        if (result.formattedOutput && command !== "mcp") {
          process.stdout.write(`${result.formattedOutput}\n`);
        }
        performanceMonitor.mark("renderEnd");

        // Use the new resource manager for cleanup and exit
        await cliResourceManager.cleanupAndExit(
          logger,
          debug ?? false,
          options.locale,
          result,
        );
      } catch (error) {
        const handled = ErrorHandler.handleError(parseError(error), logger);

        logger.error(handled.message);

        if (debug) {
          logger.error(
            t(
              "app.api.system.unifiedInterface.cli.vibe.errors.executionFailed",
            ),
            error as Error,
          );
        }

        // Cleanup and exit with error code
        await cliResourceManager.cleanupAndExit(
          logger,
          debug ?? false,
          options.locale,
          {
            success: false,
            error: handled.message,
          },
        );
        process.exit(handled.exitCode);
      }
    },
  );

// Parse command line arguments
program.parse();

// If no arguments provided, show help
if (!process.argv.slice(2).length) {
  program.help();
}
