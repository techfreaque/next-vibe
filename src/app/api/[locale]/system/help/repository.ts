/**
 * Help Repository
 * Provides help information about CLI commands
 * Uses shared help service for unified command discovery
 */

/* eslint-disable i18next/no-literal-string */
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { definitionsRegistry } from "../../system/unified-interface/shared/endpoints/definitions/registry";
import type { EndpointLogger } from "../../system/unified-interface/shared/logger/endpoint";
import type { Platform } from "../../system/unified-interface/shared/types/platform";
import {
  endpointToToolName,
  getPreferredToolName,
} from "../../system/unified-interface/shared/utils/path";
import type { CreateApiEndpointAny } from "../unified-interface/shared/types/endpoint-base";
import { getTranslatorFromEndpoint } from "../unified-interface/unified-ui/widgets/_shared/field-helpers";
import type { HelpRequestOutput, HelpResponseOutput } from "./definition";

/**
 * Help Repository
 */
class HelpRepository {
  /**
   * Execute the help command
   */
  execute(
    data: HelpRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    platform: Platform,
    locale: CountryLanguage,
  ): ResponseType<HelpResponseOutput> {
    logger.debug("Generating help information", {
      command: data.command || "all",
    });

    try {
      // Discover commands (filtered by user permissions from JWT)
      const commands = definitionsRegistry.getEndpointsForUser(platform, user);

      if (data.command) {
        // Show help for specific command
        const command = commands.find((cmd) => {
          const toolName = endpointToToolName(cmd);
          return (
            toolName === data.command ||
            cmd.aliases?.includes(data.command || "")
          );
        });

        if (!command) {
          return fail({
            message: "app.api.system.help.post.errors.notFound.title",
            errorType: ErrorResponseTypes.NOT_FOUND,
            messageParams: { command: data.command },
          });
        }

        const response = this.formatCommandHelp(command, locale);
        logger.debug("Command help generated successfully");
        return success(response);
      }

      // Show general help with usage information
      const response = this.formatGeneralHelp(commands, locale);
      logger.debug("General help generated successfully");
      return success(response);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to generate help information", parsedError);
      return fail({
        message: "app.api.system.help.post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  /**
   * Format help for a specific command
   */
  private formatCommandHelp(
    command: CreateApiEndpointAny,
    locale: CountryLanguage,
  ): HelpResponseOutput {
    const { t } = getTranslatorFromEndpoint(command)(locale);
    const preferredName = getPreferredToolName(command);
    const toolName = endpointToToolName(command);

    const title = command.title ? t(command.title) : preferredName;
    const description = command.description
      ? t(command.description)
      : undefined;

    // Build usage patterns - prefer alias, show full name as fallback
    const usagePatterns: string[] = [];
    if (command.aliases && command.aliases.length > 0) {
      usagePatterns.push(`vibe ${preferredName} [options]`);
      if (toolName !== preferredName) {
        usagePatterns.push(`vibe ${toolName} [options]  # full name`);
      }
    } else {
      usagePatterns.push(`vibe ${toolName} [options]`);
    }

    // Include firstCliArgKey hint in usage if defined
    if (command.cli?.firstCliArgKey) {
      usagePatterns.unshift(
        `vibe ${preferredName} <${command.cli.firstCliArgKey}> [options]`,
      );
    }

    // Build examples from the endpoint's examples if available, else generic ones
    const exampleItems: Array<{ command: string; description?: string }> = [];
    if (command.cli?.firstCliArgKey) {
      exampleItems.push({
        command: `vibe ${preferredName} src/`,
        description: `Pass value for --${command.cli.firstCliArgKey}`,
      });
    }
    exampleItems.push({
      command: `vibe ${preferredName} -v`,
      description: "Verbose output",
    });
    exampleItems.push({
      command: `vibe ${preferredName} -d '{"key":"value"}'`,
      description: "Pass data as JSON",
    });

    return {
      header: {
        title,
        description,
      },
      usage: {
        patterns: usagePatterns,
      },
      commonCommands: {
        items: [],
      },
      details: {
        category: command.category ? t(command.category) : undefined,
        path: command.path.join("/"),
        method: command.method,
        aliases:
          command.aliases && command.aliases.length > 0
            ? command.aliases.join(", ")
            : undefined,
      },
      options: {
        items: [
          {
            flag: "-d, --data <json>",
            description: "Pass JSON data to command",
          },
          {
            flag: "-o, --output <format>",
            description: "Output format (pretty|json)",
          },
          {
            flag: "-v, --verbose",
            description: "Enable verbose output and debug logs",
          },
          {
            flag: "--dry-run",
            description: "Show what would be sent without executing",
          },
        ],
      },
      examples: {
        items: exampleItems,
      },
    };
  }

  /**
   * Format general help with usage information
   */
  private formatGeneralHelp(
    commands: CreateApiEndpointAny[],
    locale: CountryLanguage,
  ): HelpResponseOutput {
    const getDisplayName = (cmd: CreateApiEndpointAny): string =>
      getPreferredToolName(cmd);

    // Prioritize important commands
    const priorityCommands = ["check", "list", "help", "sql", "builder"];
    const sortedCommands = commands.toSorted((a, b) => {
      const aName = getDisplayName(a);
      const bName = getDisplayName(b);
      const aPriority = priorityCommands.indexOf(aName);
      const bPriority = priorityCommands.indexOf(bName);

      if (aPriority !== -1 && bPriority !== -1) {
        return aPriority - bPriority;
      }
      if (aPriority !== -1) {
        return -1;
      }
      if (bPriority !== -1) {
        return 1;
      }
      return aName.localeCompare(bName);
    });

    // Top commands with translated descriptions
    const commonCommands = sortedCommands.slice(0, 6).map((cmd) => {
      const { t } = getTranslatorFromEndpoint(cmd)(locale);
      return {
        command: getDisplayName(cmd),
        description: cmd.description ? t(cmd.description) : getDisplayName(cmd),
      };
    });

    // Example invocations
    const exampleItems = [
      { command: "vibe list", description: "List all available commands" },
      { command: "vibe check src/", description: "Type/lint check a path" },
      { command: "vibe help check", description: "Get help for a command" },
      {
        command: 'vibe sql "SELECT * FROM users LIMIT 5"',
        description: "Run SQL",
      },
    ];

    return {
      header: {
        title: "Vibe CLI",
        description:
          "Every route.ts is a CLI command. Use `vibe list` to see all commands, `vibe help <command>` for details.",
      },
      usage: {
        patterns: [
          "vibe <command> [options]",
          "vibe <command> <firstArg> [--flag=value ...]",
          'vibe <command> -d \'{"key":"value"}\'',
        ],
      },
      commonCommands: {
        items: commonCommands,
      },
      details: {},
      options: {
        items: [
          {
            flag: "-d, --data <json>",
            description: "Pass JSON data to command",
          },
          {
            flag: "--<field>=<value>",
            description:
              "Pass individual fields (dot-notation for nested: --config.theme=dark)",
          },
          {
            flag: "-o, --output <format>",
            description: "Output format (pretty|json)",
          },
          {
            flag: "-v, --verbose",
            description: "Enable verbose output and debug logs",
          },
          {
            flag: "-l, --locale <locale>",
            description: "Set locale (en-GLOBAL|de-DE|pl-PL)",
          },
          {
            flag: "--dry-run",
            description: "Show what would be sent without executing",
          },
        ],
      },
      examples: {
        items: exampleItems,
      },
    };
  }
}

export const helpRepository = new HelpRepository();
