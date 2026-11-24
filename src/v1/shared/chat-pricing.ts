import { providerUsdToCredits } from "next-vibe/agent/models/models";
import {
  type TieredTokenRates,
  type TokenRates,
  tokenTariffs,
} from "next-vibe/agent/models/token-tariffs";

type CreditRates = Record<
  `${"input" | "output" | "cache_read" | "cache_write" | "cache_write_1h"}_credits_per_million_tokens`,
  number | null
>;
type CreditTier = CreditRates &
  ({ min_prompt_tokens: number } | { utc_start: number; utc_end: number });

function rate(usd: number | undefined): number | null {
  return usd === undefined ? null : providerUsdToCredits(usd);
}

/** Customer credits per million at the base context tier, before per-request rounding. */
function creditRates(model: TokenRates): CreditRates {
  return {
    input_credits_per_million_tokens: rate(model.inputTokenCost),
    output_credits_per_million_tokens: rate(model.outputTokenCost),
    cache_read_credits_per_million_tokens: rate(model.cacheReadTokenCost),
    cache_write_credits_per_million_tokens: rate(model.cacheWriteTokenCost),
    cache_write_1h_credits_per_million_tokens: rate(
      model.cacheWrite1hTokenCost,
    ),
  };
}

export function chatTokenPricing(
  model: TieredTokenRates,
): CreditRates & { tiers?: CreditTier[] } {
  const tiers = tokenTariffs(model);
  return {
    ...creditRates(model),
    ...(tiers.length
      ? {
          tiers: tiers.map((tier) => ({
            ...("minPromptTokens" in tier
              ? { min_prompt_tokens: tier.minPromptTokens }
              : { utc_start: tier.utcStart, utc_end: tier.utcEnd }),
            ...creditRates(tier),
          })),
        }
      : {}),
  };
}
