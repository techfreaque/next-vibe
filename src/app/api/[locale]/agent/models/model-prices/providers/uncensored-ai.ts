/**
 * Uncensored AI price fetcher.
 *
 * Scrapes pricing info from the JS bundle at https://uncensored.ai/api
 * The page is JS-rendered (React SPA), so we extract data from the
 * compiled JavaScript bundle instead of HTML.
 *
 * Current pricing (as of 2026-04):
 *   Model: uncensored-lm (UncensoredAI v1.2)
 *   Context: 32,768 tokens
 *   Pricing: $0.05 per inference (flat rate, 1 credit = $0.05)
 */

import "server-only";

import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { chatModelDefinitions, ChatModelId } from "../../../ai-stream/models";
import { ApiProvider } from "../../models";
import type { ModalityUpdate, ProviderPriceResult } from "./base";
import { PriceFetcher } from "./base";

const API_PAGE_URL = "https://uncensored.ai/api";

export class UncensoredAiPriceFetcher extends PriceFetcher {
  readonly providerName = "uncensored-ai";

  async fetch(logger: EndpointLogger): Promise<ProviderPriceResult> {
    const updates: ProviderPriceResult["updates"] = [];
    const failures: ProviderPriceResult["failures"] = [];

    let usdPerInference: number | undefined;
    let contextLength: number | undefined;

    try {
      // Fetch the HTML page to find the JS bundle URL
      const pageResponse = await fetch(API_PAGE_URL, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "text/html",
        },
      });

      if (!pageResponse.ok) {
        return {
          provider: this.providerName,
          modelsFound: 0,
          modelsUpdated: 0,
          updates,
          failures,
          error: `Page responded with ${pageResponse.status}`,
        };
      }

      const html = await pageResponse.text();

      // Find the main JS bundle URL (e.g. /assets/index-DmXNnsy_.js)
      const bundleMatch = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
      if (!bundleMatch) {
        return {
          provider: this.providerName,
          modelsFound: 0,
          modelsUpdated: 0,
          updates,
          failures,
          error: "Could not find JS bundle URL in page HTML",
        };
      }

      const bundleUrl = `https://uncensored.ai${bundleMatch[1]}`;
      const bundleResponse = await fetch(bundleUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible)" },
      });

      if (!bundleResponse.ok) {
        return {
          provider: this.providerName,
          modelsFound: 0,
          modelsUpdated: 0,
          updates,
          failures,
          error: `JS bundle responded with ${bundleResponse.status}`,
        };
      }

      const js = await bundleResponse.text();

      // Extract pricing: "$0.05 per inference" pattern
      const priceMatch = js.match(/\$(\d+\.?\d*)\s*per\s*inference/i);
      if (priceMatch) {
        usdPerInference = parseFloat(priceMatch[1]);
        logger.debug("UncensoredAI: scraped price", { usdPerInference });
      }

      // Extract context length: "32,768 tokens" or "32768 tokens"
      const contextMatch = js.match(/([\d,]+)\s*tokens/);
      if (contextMatch) {
        contextLength = parseInt(contextMatch[1].replace(/,/g, ""), 10);
        // Filter out obviously wrong matches (React internals have small numbers)
        if (contextLength < 1000) {
          contextLength = undefined;
        } else {
          logger.debug("UncensoredAI: scraped context length", {
            contextLength,
          });
        }
      }
    } catch (err) {
      return {
        provider: this.providerName,
        modelsFound: 0,
        modelsUpdated: 0,
        updates,
        failures,
        error: parseError(err).message,
      };
    }

    // Apply to all UncensoredAI models
    for (const def of Object.values(chatModelDefinitions)) {
      for (const providerConfig of def.providers) {
        if (providerConfig.apiProvider !== ApiProvider.UNCENSORED_AI) {
          continue;
        }
        if (!("creditCost" in providerConfig)) {
          continue;
        }

        if (usdPerInference === undefined) {
          failures.push({
            modelId: providerConfig.id,
            provider: ApiProvider.UNCENSORED_AI,
            reason:
              'Could not scrape "$X.XX per inference" from uncensored.ai JS bundle',
          });
          continue;
        }

        updates.push({
          modelId: providerConfig.id,
          name: def.name,
          provider: ApiProvider.UNCENSORED_AI,
          field: "creditCost",
          value: this.usdToCredits(usdPerInference),
          source: API_PAGE_URL,
          providerModel: providerConfig.providerModel,
        });
      }
    }

    // Emit deterministic modality: UncensoredAI is text-only chat
    const modalityUpdates: ModalityUpdate[] = [];
    for (const def of Object.values(chatModelDefinitions)) {
      for (const providerConfig of def.providers) {
        if (providerConfig.apiProvider !== ApiProvider.UNCENSORED_AI) {
          continue;
        }
        const enumEntry = Object.entries(ChatModelId).find(
          // oxlint-disable-next-line no-unused-vars
          ([_, value]) => value === providerConfig.id,
        );
        if (enumEntry) {
          modalityUpdates.push({
            modelId: providerConfig.id,
            name: def.name,
            provider: ApiProvider.UNCENSORED_AI,
            enumKey: enumEntry[0],
            inputs: ["text"],
            outputs: ["text"],
            source: "uncensored-ai-deterministic",
          });
        }
      }
    }

    return {
      provider: this.providerName,
      modelsFound: usdPerInference !== undefined ? 1 : 0,
      modelsUpdated: updates.length,
      updates,
      modalityUpdates,
      failures,
    };
  }
}
