/**
 * Help List Repository
 * Discovers and lists all available CLI commands with their metadata
 * Uses shared help service for unified command discovery
 */

import type { CountryLanguage } from "@/i18n/core/config";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  fail,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { simpleT } from "@/i18n/core/shared";

import type { EndpointLogger } from "../../unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { definitionsRegistry } from "../../unified-interface/shared/endpoints/definitions/registry";
import { Platform } from "../../unified-interface/shared/types/platform";
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
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): ResponseType<HelpListResponseOutput> {
    logger.info("Discovering available commands");

    try {
      // Use unified endpoint listing service (filtered by user permissions from JWT)
      const endpoints = definitionsRegistry.getEndpointsForUser(
        Platform.CLI,
        user,
        logger,
      );

      // Sort endpoints by category and toolName
      const sortedEndpoints = endpoints.toSorted((a, b) => {
        const catA = a.category || "";
        const catB = b.category || "";
        const catCompare = catA.localeCompare(catB);
        if (catCompare !== 0) {
          return catCompare;
        }
        const toolNameA = a.path.join("_");
        const toolNameB = b.path.join("_");
        return toolNameA.localeCompare(toolNameB);
      });

      // Format commands for API response
      const { t } = simpleT(locale);
      const formattedCommands = sortedEndpoints.map((ep) => {
        const toolName = ep.path.join("_");
        const translatedDescription =
          data.showDescriptions && ep.description
            ? t(ep.description)
            : toolName;
        return {
          alias: toolName,
          message: translatedDescription,
          description:
            data.showDescriptions && ep.description
              ? translatedDescription
              : undefined,
          category: ep.category ? t(ep.category) : "",
          aliases:
            data.showAliases && ep.aliases ? ep.aliases.join(", ") : undefined,
          // Add display name for GROUPED_LIST
          rule: toolName,
        };
      });

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
        message: "app.api.system.help.list.post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }
}

export const helpListRepository = new HelpListRepository();
