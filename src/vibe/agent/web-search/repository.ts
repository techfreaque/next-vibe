/**
 * Unified Web Search Repository
 * Dispatches to the user's preferred search provider and normalizes the response
 */

import "server-only";

import { eq } from "drizzle-orm";
import { chatSettings } from "../chat/settings/db";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { ToolExecutionContext } from "next-vibe/core/execution-context";
import type { WebSearchGetRequestOutput } from "./definition";
import { SearchProvider, type SearchProviderValue } from "./enum";
import type { WebSearchT } from "./i18n";
import { resolveSearchProvider, type WebSearchResponse } from "./provider";

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
    toolExecutionContext: ToolExecutionContext,
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
        message: t("get.errors.queryTooLong.title", {
          maxLength: this.MAX_QUERY_LENGTH,
        }),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    // Resolve provider: explicit request > user preference > Brave default
    const explicitProvider = data.provider ?? null;

    const userPreference = explicitProvider
      ? null
      : await this.getUserSearchProvider(user, logger);

    const preferredProvider = explicitProvider ?? userPreference ?? null;
    const providerConfig = resolveSearchProvider(preferredProvider);

    if (!providerConfig) {
      if (explicitProvider && explicitProvider !== SearchProvider.AUTO) {
        return fail({
          message: t("get.errors.providerUnavailable.title"),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }
      const isAdmin = !user.isPublic && user.roles.includes(UserRole.ADMIN);
      return fail({
        message: isAdmin
          ? t("get.errors.noProviderAdmin.title")
          : t("get.errors.noProviderUser.title"),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    logger.info("Web search dispatching", {
      provider: providerConfig.id,
      query: data.query.slice(0, 50),
    });

    const result = await providerConfig.search(
      data.query,
      {
        maxResults: data.maxResults,
        includeNews: data.includeNews,
        freshness: data.freshness,
      },
      logger,
      locale,
      user,
      toolExecutionContext,
    );

    return result;
  }
}
