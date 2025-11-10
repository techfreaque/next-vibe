/**
 * Help List Repository
 * Discovers and lists all available CLI commands with their metadata
 * Uses shared help service for unified command discovery
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  fail,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger } from "../../unified-interface/shared/logger/endpoint";
import { helpService } from "../../unified-interface/shared/server-only/help/service";
import type {
  HelpListRequestOutput,
  HelpListResponseOutput,
} from "./definition";

/**
 * Help List Repository
 */
class HelpListRepository {
  /**
   * Execute the help list command
   */
  execute(
    data: HelpListRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): ResponseType<HelpListResponseOutput> {
    logger.info("Discovering available commands");

    try {
      // Use shared help service for command discovery
      const commands = helpService.discoverCommands(logger, {
        category: data.category,
        locale,
      });

      // Sort commands by category and alias
      const sortedCommands = commands.toSorted((a, b) => {
        const catCompare = a.category.localeCompare(b.category);
        if (catCompare !== 0) {
          return catCompare;
        }
        return a.alias.localeCompare(b.alias);
      });

      // Format commands for API response
      const formattedCommands = sortedCommands.map((cmd) => ({
        alias: cmd.alias,
        message:
          data.showDescriptions && cmd.description
            ? cmd.description
            : cmd.alias,
        description:
          data.showDescriptions && cmd.description
            ? cmd.description
            : undefined,
        category: cmd.category,
        aliases:
          data.showAliases && cmd.aliases ? cmd.aliases.join(", ") : undefined,
        // Add display name for GROUPED_LIST
        rule: cmd.alias,
      }));

      logger.info("Command discovery completed", {
        totalCommands: formattedCommands.length,
        filteredBy: data.category || "none",
      });

      const response: HelpListResponseOutput = {
        commands: formattedCommands,
      };

      return success(response);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to discover commands", parsedError);
      return fail({
          message: "app.api.v1.core.system.help.list.post.errors.server.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
                  messageParams: { error: parsedError.message },
      });
    }
  }
}

export const helpListRepository = new HelpListRepository();
