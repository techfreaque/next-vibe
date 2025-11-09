/**
 * Help Repository
 * Provides help information about CLI commands
 * Uses shared help service for unified command discovery
 */

/* eslint-disable i18next/no-literal-string */
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger } from "../../system/unified-interface/shared/logger/endpoint";
import { helpService } from "../../system/unified-interface/shared/server-only/help/service";
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
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): ResponseType<HelpResponseOutput> {
    logger.info("Generating help information", {
      command: data.command || "all",
    });

    try {
      // Use shared help service for command discovery
      const commands = helpService.discoverCommands(logger, { locale });

      if (data.command) {
        // Show help for specific command
        const command = commands.find(
          (cmd) =>
            cmd.alias === data.command ||
            cmd.aliases?.includes(data.command || ""),
        );

        if (!command) {
          return createErrorResponse(
            "app.api.v1.core.system.help.post.errors.notFound.title",
            ErrorResponseTypes.NOT_FOUND,
            { command: data.command },
          );
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
      return createErrorResponse(
        "app.api.v1.core.system.help.post.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parsedError.message },
      );
    }
  }

  /**
   * Format help for a specific command
   */
  private formatCommandHelp(command: {
    alias: string;
    path: string;
    method: string;
    category: string;
    description?: string;
    aliases?: string[];
  }): HelpResponseOutput {
    return {
      header: {
        title: `${command.alias} - ${command.description || "No description available"}`,
        description: command.description,
      },
      usage: {
        patterns: [`vibe ${command.alias} [options]`],
      },
      commonCommands: {
        items: [], // Empty for specific command help
      },
      details: {
        category: command.category,
        path: command.path,
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
            command: `vibe ${command.alias}`,
            description: "Run command with default options",
          },
          {
            command: `vibe ${command.alias} --help`,
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
