/**
 * Vibe Frame Config — Repository
 *
 * For each requested integration:
 *  1. Resolve endpoint identifier (integration.endpoint ?? integration.id)
 *  2. Skip if hasRendered: true
 *  3. If leadId or authToken is present: mint a short-lived (30s) single-use
 *     exchange token in DB and embed it as ?et= in the iframe URL
 *  4. If neither is present: return a plain iframe URL (middleware creates
 *     a new lead on first load as it would for any page visit)
 *  5. Return { widgets: [{ frameId, widgetUrl }] }
 *
 * Identity (leadId + authToken) comes from the POST body — the embed script
 * is always cross-origin and cannot read our domain cookies. The host page
 * operator passes their user's identity here.
 */

import "server-only";

import { randomBytes } from "node:crypto";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";

import { db } from "../../../db";
import { frameExchangeTokens } from "../db";
import { generateFrameId } from "../types";
import type {
  IntegrationRequest,
  VibeFrameConfigRequestOutput,
  VibeFrameConfigResponseOutput,
  WidgetResponse,
} from "./definition";
import { scopedTranslation } from "./i18n";

// ─── Repository ──────────────────────────────────────────────────────────────

export class VibeFrameConfigRepository {
  private static readonly EXCHANGE_TOKEN_TTL_MS = 30_000; // 30 seconds

  /**
   * Mint a short-lived single-use exchange token.
   * leadId is nullable: if absent, middleware creates a new lead on redemption.
   * Only called when at least one of leadId / authToken is provided.
   */
  private static async mintExchangeToken(
    leadId: string | undefined,
    authToken: string | undefined,
  ): Promise<string> {
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(
      Date.now() + VibeFrameConfigRepository.EXCHANGE_TOKEN_TTL_MS,
    );

    await db.insert(frameExchangeTokens).values({
      leadId: leadId ?? null,
      token,
      authToken: authToken ?? null,
      expiresAt,
    });

    return token;
  }

  private static buildFrameUrl(
    locale: CountryLanguage,
    endpointId: string,
    frameId: string,
    exchangeToken: string | undefined,
    integration: IntegrationRequest,
  ): string {
    const base = envClient.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
    // endpoint "contact_POST" → path "contact/POST"
    // endpoint "agent_search_kagi_POST" → path "agent/search/kagi/POST"
    const endpointPath = endpointId.replace(/_/g, "/");
    const url = new URL(`${base}/${locale}/frame/${endpointPath}`);

    url.searchParams.set("frameId", frameId);
    if (exchangeToken) {
      url.searchParams.set("et", exchangeToken);
    }

    if (integration.theme && integration.theme !== "system") {
      url.searchParams.set("theme", integration.theme);
    }
    if (integration.urlPathParams) {
      url.searchParams.set(
        "urlPathParams",
        JSON.stringify(integration.urlPathParams),
      );
    }
    if (integration.data) {
      url.searchParams.set("data", JSON.stringify(integration.data));
    }

    return url.toString();
  }

  static async config({
    data,
    locale,
    logger,
  }: {
    data: VibeFrameConfigRequestOutput;
    locale: CountryLanguage;
    logger: EndpointLogger;
  }): Promise<ResponseType<VibeFrameConfigResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const { integrations, leadId, authToken } = data;

      if (!integrations || integrations.length === 0) {
        return success({ widgets: [] });
      }

      // leadId and authToken come from the POST body — provided by the host page.
      // Mint an exchange token only when there is identity to carry.
      // If neither is present, the iframe URL has no ?et= and the middleware
      // creates a fresh lead on first load (standard behaviour for any visitor).
      const needsToken = Boolean(leadId ?? authToken);

      const widgets: WidgetResponse[] = [];

      for (const integration of integrations) {
        // Skip already-rendered integrations (bandwidth optimisation)
        if (integration.hasRendered) {
          continue;
        }

        const endpointId = integration.endpoint ?? integration.id;
        const frameId = integration.frameId ?? generateFrameId();

        try {
          let exchangeToken: string | undefined;
          if (needsToken) {
            exchangeToken = await VibeFrameConfigRepository.mintExchangeToken(
              leadId,
              authToken,
            );
          }

          const widgetUrl = VibeFrameConfigRepository.buildFrameUrl(
            locale,
            endpointId,
            frameId,
            exchangeToken,
            integration,
          );

          widgets.push({ frameId, widgetUrl });
        } catch (err) {
          logger.error("Failed to mint exchange token", {
            endpointId,
            error: parseError(err).message,
          });
          return fail({
            message: t("post.repository.tokenMintFailed"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }
      }

      return success({ widgets });
    } catch (error) {
      logger.error("VibeFrame config failed", parseError(error));
      return fail({
        message: t("post.repository.configFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
