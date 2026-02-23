/**
 * Kagi Search Repository
 * Static implementation with FastGPT API support
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { agentEnv } from "@/app/api/[locale]/agent/env";
import { PROVIDER_SETUP_INSTRUCTIONS } from "@/app/api/[locale]/agent/env-availability";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type {
  KagiSearchGetRequestOutput,
  KagiSearchGetResponseOutput,
} from "./definition";
import type { scopedTranslation } from "./i18n";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

/**
 * Kagi FastGPT API Response Types
 */
interface KagiFastGPTReference {
  title: string;
  url: string;
  snippet?: string;
}

interface KagiFastGPTResponse {
  meta: {
    id: string;
    node: string;
    ms: number;
    api_balance: number | null;
  };
  data: {
    output: string;
    tokens: number;
    references: KagiFastGPTReference[];
  } | null;
  error?: Array<{
    code: number;
    msg: string;
  }>;
}

/**
 * Normalized Search Reference
 */
export interface SearchReference {
  title: string;
  url: string;
  snippet?: string;
}

/**
 * Kagi Search Repository Implementation
 */
export class KagiSearchRepository {
  private static readonly TIMEOUT = 30000; // 30 seconds for FastGPT
  private static readonly MAX_QUERY_LENGTH = 400;

  /**
   * Search with Kagi FastGPT
   */
  static async search(
    data: KagiSearchGetRequestOutput,
    logger: EndpointLogger,
    t: ModuleT,
  ): Promise<ResponseType<KagiSearchGetResponseOutput>> {
    const { fail, success, ErrorResponseTypes } =
      await import("next-vibe/shared/types/response.schema");

    // Guard: key not configured
    if (!agentEnv.KAGI_API_KEY) {
      const { envKey, url, label } = PROVIDER_SETUP_INSTRUCTIONS.kagiSearch;
      return fail({
        message: t("get.errors.notConfigured.title", { label, envKey, url }),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    try {
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

      const result = await this.fetchFastGPT(data.query);

      return success({
        success: true,
        output: result.output,
        references: result.references,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      logger.error("Kagi Search error", {
        error: errorMessage,
        query: data.query,
      });

      if (error instanceof Error && error.name === "AbortError") {
        return fail({
          message: t("get.errors.timeout.title"),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }

      return fail({
        message: t("get.errors.searchFailed.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Fetch results from Kagi FastGPT API
   */
  private static async fetchFastGPT(
    query: string,
  ): Promise<{ output: string; references: SearchReference[] }> {
    const url = "https://kagi.com/api/v0/fastgpt";

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, this.TIMEOUT);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bot ${agentEnv.KAGI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = (await response.json()) as KagiFastGPTResponse;
        const errorMsg = errorData.error?.[0]?.msg ?? `HTTP ${response.status}`;
        // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Internal helper throws, caught by caller
        throw new Error(`Kagi API error: ${errorMsg}`);
      }

      const data = (await response.json()) as KagiFastGPTResponse;

      if (data.error && data.error.length > 0) {
        // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Internal helper throws, caught by caller
        throw new Error(`Kagi API error: ${data.error[0]?.msg}`);
      }

      if (!data.data) {
        // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Internal helper throws, caught by caller
        throw new Error("No data returned from Kagi API");
      }

      return {
        output: data.data.output,
        references: data.data.references.map((ref) => ({
          title: this.sanitizeText(ref.title),
          url: ref.url,
          snippet: ref.snippet ? this.sanitizeText(ref.snippet) : undefined,
        })),
      };
    } catch (error) {
      clearTimeout(timeoutId);
      // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Re-throw to propagate error to caller
      throw error;
    }
  }

  /**
   * Sanitize text by removing HTML tags and normalizing whitespace
   */
  private static sanitizeText(text: string): string {
    return text
      .replaceAll(/<[^>]*>/g, "")
      .replaceAll(/\s+/g, " ")
      .trim();
  }
}
