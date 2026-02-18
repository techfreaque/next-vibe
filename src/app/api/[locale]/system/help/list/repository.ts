/**
 * Help List Repository
 * Discovers and lists all available CLI commands with their metadata
 * Uses shared help service for unified command discovery
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { definitionsRegistry } from "../../unified-interface/shared/endpoints/definitions/registry";
import type { EndpointLogger } from "../../unified-interface/shared/logger/endpoint";
import type { Platform } from "../../unified-interface/shared/types/platform";
import { getPreferredToolName } from "../../unified-interface/shared/utils/path";
import { getTranslatorFromEndpoint } from "../../unified-interface/unified-ui/widgets/_shared/field-helpers";
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
    platform: Platform,
  ): ResponseType<HelpListResponseOutput> {
    logger.debug("Discovering available commands", {
      category: data.category,
      format: data.format,
    });

    try {
      // Use unified endpoint listing service (filtered by user permissions from JWT)
      const endpoints = definitionsRegistry.getEndpointsForUser(platform, user);

      // Translate all endpoints first so we can sort and filter by translated values
      const translated = endpoints.map((ep) => {
        const { t } = getTranslatorFromEndpoint(ep)(locale);
        const displayName = getPreferredToolName(ep);
        const translatedCategory = ep.category ? t(ep.category) : "";
        const translatedDescription = ep.description
          ? t(ep.description)
          : displayName;

        return { ep, displayName, translatedCategory, translatedDescription };
      });

      // Apply category filter against translated category name (case-insensitive)
      const filtered = data.category
        ? translated.filter(({ translatedCategory, displayName }) => {
            const query = data.category!.toLowerCase();
            return (
              translatedCategory.toLowerCase().includes(query) ||
              displayName.toLowerCase().includes(query)
            );
          })
        : translated;

      // Sort by translated category then by display name
      const sorted = filtered.toSorted((a, b) => {
        const catCompare = a.translatedCategory.localeCompare(
          b.translatedCategory,
        );
        if (catCompare !== 0) {
          return catCompare;
        }
        return a.displayName.localeCompare(b.displayName);
      });

      // Format commands for response
      const formattedCommands = sorted.map(
        ({ ep, displayName, translatedCategory, translatedDescription }) => {
          // Secondary aliases (all aliases beyond the first)
          const secondaryAliases =
            data.showAliases && ep.aliases && ep.aliases.length > 1
              ? ep.aliases.slice(1).join(", ")
              : undefined;

          return {
            alias: displayName,
            message: translatedDescription,
            description: data.showDescriptions
              ? translatedDescription
              : undefined,
            category: translatedCategory,
            aliases: secondaryAliases,
            rule: displayName,
          };
        },
      );

      logger.debug("Command discovery completed", {
        total: endpoints.length,
        filtered: formattedCommands.length,
        category: data.category || "none",
        format: data.format,
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
