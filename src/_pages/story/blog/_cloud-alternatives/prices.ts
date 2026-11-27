/**
 * Server-side loader for the price comparison table: our live per-token price
 * for each model in PRICE_GROUPS, read from the registry (cheapest live route,
 * markup included). Page modules import this in their tanstackLoader only.
 */

import type { ChatModelId } from "next-vibe/agent/ai-stream/models";
import { getEnvAvailability } from "next-vibe/agent/env-availability";

import { getModelFacts } from "@/_pages/models/_shared/model-facts";
import { CREDIT_VALUE_USD } from "@/products/constants";

import { PRICE_GROUPS } from "./data";

export interface OurTokenPrice {
  model: ChatModelId;
  name: string;
  slug: string;
  /** USD per 1M input tokens, markup included. */
  input: number;
  /** USD per 1M output tokens, markup included. */
  output: number;
}

/** Our price per model in PRICE_GROUPS; models not live here are skipped. */
export async function loadOurTokenPrices(): Promise<OurTokenPrice[]> {
  const availability = await getEnvAvailability();
  return PRICE_GROUPS.flatMap(({ model }) => {
    const facts = getModelFacts(model, availability);
    if (facts === null || facts.isLegacy || facts.tokenPrice === null) {
      return [];
    }
    return [
      {
        model,
        name: facts.name.trim(),
        slug: facts.slug,
        input: facts.tokenPrice.inputCredits * CREDIT_VALUE_USD,
        output: facts.tokenPrice.outputCredits * CREDIT_VALUE_USD,
      },
    ];
  });
}
