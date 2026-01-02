/**
 * Help Repository
 * Provides help information about CLI commands
 * Uses shared help service for unified command discovery
 */

/* eslint-disable i18next/no-literal-string */
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes, fail, success } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { definitionsRegistry } from "../../system/unified-interface/shared/endpoints/definitions/registry";
import type { EndpointLogger } from "../../system/unified-interface/shared/logger/endpoint";
import type { Platform } from "../../system/unified-interface/shared/types/platform";
import { endpointToToolName } from "../../system/unified-interface/shared/utils/path";
import type { CreateApiEndpointAny } from "../unified-interface/shared/types/endpoint";
import { getTranslatorFromEndpoint } from "../unified-interface/shared/widgets/utils/field-helpers";
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
      const commands = definitionsRegistry.getEndpointsForUser(platform, user, logger);

      if (data.command) {
        // Show help for specific command
        const command = commands.find((cmd) => {
          const toolName = endpointToToolName(cmd);
          return toolName === data.command || cmd.aliases?.includes(data.command || "");
        });

        if (!command) {
          return fail({
            message: "app.api.system.help.post.errors.notFound.title",
            errorType: ErrorResponseTypes.NOT_FOUND,
            messageParams: { command: data.command },
          });
        }

        const response = this.formatCommandHelp(command);
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
  private formatCommandHelp(command: CreateApiEndpointAny): HelpResponseOutput {
    const toolName = endpointToToolName(command);
    return {
      header: {
        title: `${toolName} - ${command.description || "No description available"}`,
        description: command.description,
      },
      usage: {
        patterns: [`vibe ${toolName} [options]`],
      },
      commonCommands: {
        items: [], // Empty for specific command help
      },
      details: {
        category: command.category,
        path: command.path.join("/"),
        method: command.method,
        aliases:
          command.aliases && command.aliases.length > 0 ? command.aliases.join(", ") : undefined,
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
            description: "Enable verbose output",
          },
          {
            flag: "--help",
            description: "Show this help",
          },
        ],
      },
      examples: {
        items: [
          {
            command: `vibe ${toolName}`,
            description: "Run command with default options",
          },
          {
            command: `vibe ${toolName} --help`,
            description: "Show command help",
          },
        ],
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
    // Helper to get display name (first alias or tool name)
    const getDisplayName = (cmd: CreateApiEndpointAny): string =>
      cmd.aliases && cmd.aliases.length > 0 ? cmd.aliases[0] : endpointToToolName(cmd);

    // Prioritize important commands
    const priorityCommands = ["check", "list", "help", "builder"];
    const sortedCommands = commands.toSorted((a, b) => {
      const aName = getDisplayName(a);
      const bName = getDisplayName(b);
      const aPriority = priorityCommands.indexOf(aName);
      const bPriority = priorityCommands.indexOf(bName);

      // If both are priority, sort by priority order
      if (aPriority !== -1 && bPriority !== -1) {
        return aPriority - bPriority;
      }
      // If only a is priority, put it first
      if (aPriority !== -1) {
        return -1;
      }
      // If only b is priority, put it first
      if (bPriority !== -1) {
        return 1;
      }
      // Otherwise sort alphabetically
      return aName.localeCompare(bName);
    });

    // Get top 5 most common/important commands with translated descriptions
    const commonCommands = sortedCommands.slice(0, 5).map((cmd) => {
      const { t } = getTranslatorFromEndpoint(cmd)(locale);
      return {
        command: getDisplayName(cmd),
        description: cmd.description ? t(cmd.description) : "No description available",
      };
    });

    // Get example commands (first 3) with translated descriptions
    const exampleCommands = sortedCommands.slice(0, 3).map((cmd) => {
      const { t } = getTranslatorFromEndpoint(cmd)(locale);
      const displayName = getDisplayName(cmd);
      return {
        command: `vibe ${displayName}`,
        description: cmd.description ? t(cmd.description) : `Run ${displayName}`,
      };
    });

    return {
      header: {
        title: "Vibe CLI - Code Quality & Build Tool",
        description:
          "Fast, parallel code quality checks (Oxlint + ESLint + TypeScript) and build tooling for TypeScript/React projects",
      },
      usage: {
        patterns: ["vibe <command> [options]", "vibe <command> --help"],
      },
      commonCommands: {
        items: commonCommands,
      },
      details: {
        // Empty for general help
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
            description: "Enable verbose output",
          },
          {
            flag: "-l, --locale <locale>",
            description: "Set locale (en-GLOBAL|de-DE|pl-PL)",
          },
          {
            flag: "--help",
            description: "Show this help",
          },
        ],
      },
      examples: {
        items: exampleCommands,
      },
    };
  }
}

export const helpRepository = new HelpRepository();
