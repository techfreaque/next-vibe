/**
 * Unified Web Search Repository
 * Dispatches to the user's preferred search provider and normalizes the response
 */

import "server-only";

import { eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import type { CountryLanguage } from "@/i18n/core/config";

import { chatSettings } from "@/app/api/[locale]/agent/chat/settings/db";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import type { SearchProviderValue } from "../enum";
import { resolveSearchProvider, type WebSearchResponse } from "../provider";
import type { WebSearchGetRequestOutput } from "./definition";
import type { WebSearchT } from "./i18n";

/**
 * Unified Web Search Repository
 */
export class WebSearchRepository {
  private static readonly MAX_QUERY_LENGTH = 400;

  /**
   * Fetch the user's preferred search provider from chat settings.
   * Returns null for public users or if no preference is set.
   */
  private static async getUserSearchProvider(
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<SearchProviderValue | null> {
    if (user.isPublic) {
      return null;
    }

    try {
      const result = await db
        .select({ searchProvider: chatSettings.searchProvider })
        .from(chatSettings)
        .where(eq(chatSettings.userId, user.id))
        .limit(1);

      return (result[0]?.searchProvider as SearchProviderValue | null) ?? null;
    } catch (error) {
      logger.warn("Failed to fetch user search provider preference", {
        userId: user.id,
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }

  /**
   * Search the web using the resolved provider
   */
  static async search(
    data: WebSearchGetRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: WebSearchT,
    locale: CountryLanguage,
  ): Promise<ResponseType<WebSearchResponse>> {
    // Validate query
    if (
      !data.query ||
      typeof data.query !== "string" ||
      data.query.trim() === ""
    ) {
      return fail({
        message: t("get.errors.queryEmpty.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    if (data.query.length > this.MAX_QUERY_LENGTH) {
      return fail({
        message: t("get.errors.queryTooLong.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
        messageParams: { maxLength: this.MAX_QUERY_LENGTH },
      });
    }

    // Resolve provider: explicit request > user preference > auto-detect (Brave)
    const explicitProvider =
      data.provider !== "auto" ? (data.provider as SearchProviderValue) : null;

    const userPreference = explicitProvider
      ? null
      : await this.getUserSearchProvider(user, logger);

    const preferredProvider = explicitProvider ?? userPreference ?? null;
    const providerConfig = resolveSearchProvider(preferredProvider);

    if (!providerConfig) {
      if (explicitProvider) {
        return fail({
          message: t("get.errors.providerUnavailable.title"),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }
      return fail({
        message: t("get.errors.noProvider.title"),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    logger.info("Web search dispatching", {
      provider: providerConfig.id,
      query: data.query.slice(0, 50),
    });

    return providerConfig.search(
      data.query,
      {
        maxResults: data.maxResults,
        includeNews: data.includeNews,
        freshness: data.freshness,
      },
      logger,
      locale,
    );
  }
}
