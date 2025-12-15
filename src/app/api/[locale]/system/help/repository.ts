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

import { definitionsRegistry } from "../../system/unified-interface/shared/endpoints/definitions/registry";
import type { EndpointLogger } from "../../system/unified-interface/shared/logger/endpoint";
import type { Platform } from "../../system/unified-interface/shared/types/platform";
import { endpointToToolName } from "../../system/unified-interface/shared/utils/path";
import type { CreateApiEndpointAny } from "../unified-interface/shared/types/endpoint";
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
  ): ResponseType<HelpResponseOutput> {
    logger.info("Generating help information", {
      command: data.command || "all",
    });

    try {
      // Discover commands (filtered by user permissions from JWT)
      const commands = definitionsRegistry.getEndpointsForUser(
        platform,
        user,
        logger,
      );

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

        const response = this.formatCommandHelp(command);
        logger.info("Command help generated successfully");
        return success(response);
      }

      // Show general help with usage information
      const response = this.formatGeneralHelp();
      logger.info("General help generated successfully");
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
  private formatGeneralHelp(): HelpResponseOutput {
    return {
      header: {
        title: "Vibe CLI - Next-generation API execution tool",
        description:
          "Command-line interface for Next-Vibe API with real-time execution",
      },
      usage: {
        patterns: ["vibe <command> [options]", "vibe <command> --help"],
      },
      commonCommands: {
        items: [
          { command: "list", description: "List all available commands" },
          {
            command: "help <cmd>",
            description: "Show help for a specific command",
          },
          { command: "check", description: "Run code quality checks" },
          { command: "db:migrate", description: "Run database migrations" },
          { command: "test", description: "Run test suite" },
        ],
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
        items: [
          { command: "vibe list", description: "List all commands" },
          { command: "vibe check src/", description: "Run checks" },
          { command: "vibe db:migrate", description: "Run migrations" },
          { command: "vibe help check", description: "Get command help" },
        ],
      },
    };
  }
}

export const helpRepository = new HelpRepository();
