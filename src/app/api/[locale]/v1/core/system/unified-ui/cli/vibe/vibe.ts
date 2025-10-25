#!/usr/bin/env bun

/**
 * Vibe CLI Main Entry Point
 * Command line interface that can execute any route.ts from generated index files
 */

import * as fs from "node:fs";
import * as path from "node:path";

import { Command } from "commander";
import { config } from "dotenv";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { EndpointLogger } from "./endpoints/endpoint-handler/logger";
import { createEndpointLogger } from "./endpoints/endpoint-handler/logger";
import { CliEntryPoint } from "./entry-point";
import { ErrorHandler, setupGlobalErrorHandlers } from "./utils/errors";
import { memoryMonitor } from "./utils/performance";

export const binaryStartTime = Date.now();

/**
 * CLI Options interface for type safety
 */
interface CliOptions {
  data?: string;
  userType?: string;
  locale?: CountryLanguage;
  output?: string;
  verbose?: boolean;
  interactive?: boolean;
  dryRun?: boolean;
}

/**
 * List command options interface
 */
interface ListOptions {
  category?: string;
  format?: string;
  examples?: boolean;
  parameters?: boolean;
  verbose?: boolean;
  locale?: CountryLanguage;
}

/**
 * CLI Constants to avoid literal strings
 */
const CLI_CONSTANTS = {
  DEFAULT_LOCALE: "en-GLOBAL" as const,
  CLI_NAME: "vibe" as const,
  CLI_VERSION: "2.0.0" as const,
  DOUBLE_HYPHEN: "--" as const,
  SINGLE_HYPHEN: "-" as const,
  EQUALS: "=" as const,
  TRUE_VALUE: "true" as const,
  FALSE_VALUE: "false" as const,
  ENV_FILE: ".env" as const,
  ADMIN_USER_TYPE: "ADMIN" as const,
  DEFAULT_OUTPUT: "pretty" as const,
  JSON_OUTPUT: "json" as const,
  COLON_CHAR: ":" as const,
  QUOTED_COLON_PATTERN: '"":' as const,
} as const;

/**
 * Type for parsed CLI data
 */
type ParsedCliData = Record<string, string | number | boolean | null>;

// Load environment variables from the correct location
function loadEnvironment(): void {
  // Find the project root by looking for package.json
  let currentDir = process.cwd();
  let envPath: string | null = null;
  const envFileName = CLI_CONSTANTS.ENV_FILE;

  // Look for .env file starting from current directory and going up
  while (currentDir !== path.dirname(currentDir)) {
    const potentialEnvPath = path.join(currentDir, envFileName);
    if (fs.existsSync(potentialEnvPath)) {
      envPath = potentialEnvPath;
      break;
    }
    currentDir = path.dirname(currentDir);
  }

  // Load the .env file if found
  if (envPath) {
    config({ path: envPath, quiet: true });
    // Environment loaded from specific path
  } else {
    // Fallback to default dotenv behavior
    config({ quiet: true });
    // Using default environment loading
  }
}

// Load environment first
loadEnvironment();

/**
 * Try to parse a string as a number if it looks like one
 */
function tryParseNumber(value: string): string | number {
  // Don't try to parse empty strings or strings with only whitespace
  if (!value?.trim()) {
    return value;
  }

  // Don't try to parse if it contains non-numeric characters (except for decimal point and minus sign)
  if (!/^-?\d*\.?\d*$/.test(value)) {
    return value;
  }

  // Try to parse as integer first
  if (/^-?\d+$/.test(value)) {
    const intValue = parseInt(value, 10);
    // Make sure the parsed value equals the original string to avoid precision issues
    if (String(intValue) === value) {
      return intValue;
    }
  }

  // Try to parse as float
  if (/^-?\d*\.\d+$/.test(value)) {
    const floatValue = parseFloat(value);
    // Make sure the parsed value equals the original string to avoid precision issues
    if (String(floatValue) === value) {
      return floatValue;
    }
  }

  return value;
}

/**
 * Convert CLI argument value to appropriate type
 */
function convertCliValue(value: string): string | number | boolean {
  // Handle boolean values first
  if (value === CLI_CONSTANTS.TRUE_VALUE) {
    return true;
  }
  if (value === CLI_CONSTANTS.FALSE_VALUE) {
    return false;
  }

  // Try to parse as number
  const numberValue = tryParseNumber(value);
  if (typeof numberValue === "number") {
    return numberValue;
  }

  // Return as string if not a number
  return value;
}

/**
 * Simple CLI argument parser for when rawArgs is not available
 */
function parseCliArgumentsSimple(args: string[]): {
  positionalArgs: string[];
  namedArgs: Record<string, string | number | boolean>;
} {
  const positionalArgs: string[] = [];
  const namedArgs: Record<string, string | number | boolean> = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    // Skip undefined, null, or empty arguments
    if (!arg || typeof arg !== "string") {
      continue;
    }

    if (arg.startsWith(CLI_CONSTANTS.DOUBLE_HYPHEN)) {
      // Handle --key=value or --key value
      const sliced = arg.slice(2);
      const [key, ...valueParts] = sliced.split(CLI_CONSTANTS.EQUALS);
      let value: string | boolean;

      if (valueParts.length > 0) {
        // --key=value format
        value = valueParts.join(CLI_CONSTANTS.EQUALS);
      } else if (
        i + 1 < args.length &&
        !args[i + 1].startsWith(CLI_CONSTANTS.SINGLE_HYPHEN)
      ) {
        // --key value format
        value = args[i + 1];
        i++; // Skip the next argument as it's the value
      } else {
        // Boolean flag
        value = true;
      }

      // Try to parse simple boolean values
      if (typeof value === "string") {
        value = convertCliValue(value);
      }

      namedArgs[key] = value;
    } else if (arg.startsWith(CLI_CONSTANTS.SINGLE_HYPHEN)) {
      // Handle -k value (single dash)
      const key = arg.slice(1);
      if (
        i + 1 < args.length &&
        args[i + 1] &&
        !args[i + 1].startsWith(CLI_CONSTANTS.SINGLE_HYPHEN)
      ) {
        namedArgs[key] = convertCliValue(args[i + 1]);
        i++;
      } else {
        namedArgs[key] = true;
      }
    } else {
      // Positional argument
      positionalArgs.push(arg);
    }
  }

  return { positionalArgs, namedArgs };
}

/**
 * Parse CLI arguments into structured data
 */
function parseCliArguments(
  args: string[],
  rawArgs: string[],
  logger: EndpointLogger,
): {
  positionalArgs: string[];
  namedArgs: Record<string, string | number | boolean>;
} {
  const positionalArgs: string[] = [];
  const namedArgs: Record<string, string | number | boolean> = {};

  // Safety checks for input parameters
  if (!Array.isArray(args)) {
    logger.error("parseCliArguments: args is not an array", undefined, {
      argsType: typeof args,
    });
    return { positionalArgs, namedArgs };
  }
  if (!Array.isArray(rawArgs)) {
    logger.error("parseCliArguments: rawArgs is not an array", undefined, {
      rawArgsType: typeof rawArgs,
    });
    return { positionalArgs, namedArgs };
  }

  // Find the command position in rawArgs to extract everything after it
  const commandIndex = rawArgs.findIndex((arg) => arg && args.includes(arg));
  const relevantArgs = commandIndex >= 0 ? rawArgs.slice(commandIndex + 1) : [];

  const doubleHyphenPrefix = CLI_CONSTANTS.DOUBLE_HYPHEN;
  const singleHyphenPrefix = CLI_CONSTANTS.SINGLE_HYPHEN;
  const equalsSeparator = CLI_CONSTANTS.EQUALS;

  for (let i = 0; i < relevantArgs.length; i++) {
    const arg = relevantArgs[i];

    // Skip undefined, null, or empty arguments
    if (!arg || typeof arg !== "string") {
      continue;
    }

    if (arg.startsWith(doubleHyphenPrefix)) {
      // Handle --key=value or --key value
      try {
        const sliced = arg.slice(2);
        if (typeof sliced !== "string") {
          logger.error("parseCliArguments: sliced is not a string");
          continue;
        }
        const [key, ...valueParts] = sliced.split(equalsSeparator);
        let value: string | boolean;

        if (valueParts.length > 0) {
          // --key=value format
          value = valueParts.join(equalsSeparator);
        } else if (
          i + 1 < relevantArgs.length &&
          !relevantArgs[i + 1].startsWith(singleHyphenPrefix)
        ) {
          // --key value format
          value = relevantArgs[i + 1];
          i++; // Skip the next argument as it's the value
        } else {
          // Boolean flag
          value = true;
        }

        // Try to parse simple boolean values only
        if (typeof value === "string") {
          value = convertCliValue(value);
          // Don't parse JSON here - let the main handler do it
        }

        namedArgs[key] = value;
      } catch (parseError) {
        logger.error(
          "parseCliArguments: Error parsing double hyphen arg",
          parseError as Error,
        );
        continue;
      }
    } else if (arg.startsWith(singleHyphenPrefix)) {
      // Handle -k value (single dash)
      const key = arg.slice(1);
      if (
        i + 1 < relevantArgs.length &&
        relevantArgs[i + 1] &&
        !relevantArgs[i + 1].startsWith(singleHyphenPrefix)
      ) {
        namedArgs[key] = convertCliValue(relevantArgs[i + 1]);
        i++;
      } else {
        namedArgs[key] = true;
      }
    } else {
      // Positional argument
      positionalArgs.push(arg);
    }
  }

  return { positionalArgs, namedArgs };
}

// setupModuleAliases(logger); // Temporarily disabled to debug config import issue

const program = new Command();

const { t } = simpleT(CLI_CONSTANTS.DEFAULT_LOCALE as CountryLanguage);

program
  .name(CLI_CONSTANTS.CLI_NAME)
  .description(t("app.api.v1.core.system.cli.vibe.help.description"))
  .version(CLI_CONSTANTS.CLI_VERSION);

// Main command - execute any route with schema-driven UI
program
  // eslint-disable-next-line i18next/no-literal-string
  .argument("[command]", t("app.api.v1.core.system.cli.vibe.help.usage"))
  .argument("[args...]", t("app.api.v1.core.system.cli.vibe.help.commands"))
  .option(
    // eslint-disable-next-line i18next/no-literal-string
    "-d, --data <json>",
    t("app.api.v1.core.system.cli.vibe.vibe.executeCommand"),
  )
  .option(
    // eslint-disable-next-line i18next/no-literal-string
    "-u, --user-type <type>",
    t("app.api.v1.core.system.cli.vibe.help.userType"),
    "ADMIN",
  )
  .option(
    // eslint-disable-next-line i18next/no-literal-string
    "-l, --locale <locale>",
    t("app.api.v1.core.system.cli.vibe.help.locale"),
    CLI_CONSTANTS.DEFAULT_LOCALE,
  )
  .option(
    // eslint-disable-next-line i18next/no-literal-string
    "-o, --output <format>",
    t("app.api.v1.core.system.cli.vibe.vibe.output"),
    CLI_CONSTANTS.DEFAULT_OUTPUT,
  )

  .option(
    "-v, --verbose", // eslint-disable-line i18next/no-literal-string
    t("app.api.v1.core.system.cli.vibe.help.verbose"),
    false,
  )
  .option(
    // eslint-disable-next-line i18next/no-literal-string
    "-i, --interactive",
    t("app.api.v1.core.system.cli.vibe.vibe.interactive"),
    false,
  )
  .option("--dry-run", t("app.api.v1.core.system.cli.vibe.help.dryRun"), false)
  .allowUnknownOption() // Allow dynamic CLI arguments
  .action(
    async (
      command: string,
      args: string[],
      options: CliOptions,
      cmd: Record<string, string | number | boolean>,
    ) => {
      const logger = createEndpointLogger(
        options.verbose ?? false,
        Date.now(),
        options.locale ?? CLI_CONSTANTS.DEFAULT_LOCALE,
      );
      const { t } = simpleT(options.locale ?? CLI_CONSTANTS.DEFAULT_LOCALE);
      // Setup global error handlers
      setupGlobalErrorHandlers(logger);

      if (options.verbose) {
        logger.debug("Command execution details", {
          command,
          args: (args || []).join(" "),
          verbose: options.verbose ?? false,
          interactive: options.interactive ?? false,
          rawDataOption: options.data || "none",
        });
      }

      // Initialize CLI resource manager and performance monitoring
      const { cliResourceManager } = await import("./utils/debug");
      cliResourceManager.initialize(logger);
      const performanceMonitor = cliResourceManager.getPerformanceMonitor();

      try {
        // Initialize performance monitoring
        performanceMonitor.mark("initStart");
        memoryMonitor.snapshot();

        const cli = new CliEntryPoint(
          logger,
          t,
          options.locale ?? CLI_CONSTANTS.DEFAULT_LOCALE,
        );
        performanceMonitor.mark("initEnd");

        // If no command provided, start interactive mode
        if (!command) {
          logger.info(t("app.api.v1.core.system.cli.vibe.vibe.startingUp"));
          await cli.executeCommand("interactive", {
            locale: options.locale ?? CLI_CONSTANTS.DEFAULT_LOCALE,
            output: (options.output ?? CLI_CONSTANTS.DEFAULT_OUTPUT) as
              | "table"
              | "pretty"
              | "json",
            verbose: options.verbose ?? false,
            interactive: options.interactive ?? false,
            dryRun: options.dryRun ?? false,
          });
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
            if (options.verbose) {
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
        await cli.executeCommand(
          command,
          {
            data: parsedData,
            cliArgs: {
              positionalArgs: parsedArgs.positionalArgs,
              namedArgs: parsedArgs.namedArgs,
            },
            userType: options.userType ?? CLI_CONSTANTS.ADMIN_USER_TYPE,
            locale: options.locale ?? CLI_CONSTANTS.DEFAULT_LOCALE,
            output: (options.output ?? CLI_CONSTANTS.DEFAULT_OUTPUT) as
              | "table"
              | "pretty"
              | "json",
            verbose: options.verbose ?? false,
            interactive: options.interactive ?? false,
            dryRun: options.dryRun ?? false,
          },
          logger,
        );
        performanceMonitor.mark("routeEnd");

        performanceMonitor.mark("renderStart");
        // Rendering happens in the executeCommand above
        performanceMonitor.mark("renderEnd");

        // Use the new resource manager for cleanup and exit
        await cliResourceManager.cleanupAndExit(
          logger,
          options.verbose ?? false,
          options.locale ?? CLI_CONSTANTS.DEFAULT_LOCALE,
        );
      } catch (error) {
        const handled = ErrorHandler.handleError(error, logger);

        logger.error(handled.message);

        if (options.verbose) {
          logger.error(
            t("app.api.v1.core.system.cli.vibe.errors.executionFailed"),
            error as Error,
          );
          logger.info(t("app.api.v1.core.system.cli.vibe.help.options"), {
            memoryUsage: memoryMonitor.getFormattedUsage(),
          });
        }

        // Cleanup and exit with error code
        await cliResourceManager.cleanupAndExit(
          logger,
          options.verbose ?? false,
          options.locale ?? CLI_CONSTANTS.DEFAULT_LOCALE,
        );
        process.exit(handled.exitCode);
      }
    },
  );

// Help command
program
  .command("help")
  .description(t("app.api.v1.core.system.cli.vibe.vibe.help"))
  .action(() => {
    program.help();
  });

// List command - show all available routes using help system
program
  .command("list")
  .alias("ls")
  .description(t("app.api.v1.core.system.cli.vibe.vibe.listCommands"))
  .option(
    // eslint-disable-next-line i18next/no-literal-string
    "-c, --category <category>",
    t("app.api.v1.core.system.cli.vibe.help.options"),
  )
  .option(
    // eslint-disable-next-line i18next/no-literal-string
    "-f, --format <format>",
    t("app.api.v1.core.system.cli.vibe.vibe.output"),
    "text",
  )
  .option(
    "--examples",
    t("app.api.v1.core.system.cli.vibe.help.examples"),
    false,
  )
  .option(
    "--parameters",
    t("app.api.v1.core.system.cli.vibe.help.options"),
    false,
  )
  .action(async (options: ListOptions) => {
    const logger = createEndpointLogger(
      options.verbose ?? false,
      Date.now(),
      options.locale ?? CLI_CONSTANTS.DEFAULT_LOCALE,
    );
    const { t } = simpleT(options.locale ?? CLI_CONSTANTS.DEFAULT_LOCALE);
    try {
      const defaultFormat = "text";
      const cli = new CliEntryPoint(
        logger,
        t,
        options.locale ?? CLI_CONSTANTS.DEFAULT_LOCALE,
      );
      await cli.executeCommand(
        "help",
        {
          category: options.category,
          format: options.format ?? defaultFormat,
          examples: options.examples ?? false,
          parameters: options.parameters ?? false,
        },
        logger,
      );
    } catch (error) {
      logger.error(
        t("app.api.v1.core.system.cli.vibe.errors.executionFailed"),
        error as Error,
      );
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse();

// If no arguments provided, show help
if (!process.argv.slice(2).length) {
  program.help();
}
