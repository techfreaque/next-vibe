/** Provider USD per one million tokens. Cache reads and writes replace ordinary input. */
export interface TokenRates {
  inputTokenCost?: number;
  outputTokenCost?: number;
  cacheReadTokenCost?: number;
  cacheWriteTokenCost?: number;
  cacheWrite1hTokenCost?: number;
}

export type TokenTariff = TokenRates &
  ({ minPromptTokens: number } | { utcStart: number; utcEnd: number });

export interface TieredTokenRates extends TokenRates {
  longContextPricing?: TokenRates & { minPromptTokens: number };
  pricingTiers?: readonly TokenTariff[];
}

export function tokenTariffs(model: TieredTokenRates): readonly TokenTariff[] {
  return (
    model.pricingTiers ??
    (model.longContextPricing ? [model.longContextPricing] : [])
  );
}

function maximumRates(options: readonly TokenRates[]): TokenRates {
  const highest = (value: (rates: TokenRates) => number | undefined): number =>
    Math.max(...options.map((rates) => value(rates) ?? 0));
  return {
    inputTokenCost: highest((r) => r.inputTokenCost),
    outputTokenCost: highest((r) => r.outputTokenCost),
    cacheReadTokenCost: highest(
      (r) => r.cacheReadTokenCost ?? r.inputTokenCost,
    ),
    cacheWriteTokenCost: highest(
      (r) => r.cacheWriteTokenCost ?? r.inputTokenCost,
    ),
    cacheWrite1hTokenCost: highest(
      (r) =>
        r.cacheWrite1hTokenCost ??
        Math.max(r.cacheWriteTokenCost ?? 0, 2 * (r.inputTokenCost ?? 0)),
    ),
  };
}

/** UTC HHMM intervals include their start and exclude their end, including across midnight. */
export function activeTokenRates(
  model: TieredTokenRates,
  promptTokens?: number,
  startedAt?: number,
): TokenRates {
  const tiers = tokenTariffs(model);
  if (!tiers.length) {
    return model;
  }
  const date = new Date(startedAt ?? NaN);
  const hhmm = date.getUTCHours() * 100 + date.getUTCMinutes();
  let selected: TokenTariff | undefined;
  let threshold = -1;
  const possible: TokenRates[] = [];
  for (const tier of tiers) {
    if ("minPromptTokens" in tier) {
      if (promptTokens === undefined || !Number.isFinite(promptTokens)) {
        possible.push(tier);
      } else if (
        promptTokens >= tier.minPromptTokens &&
        tier.minPromptTokens > threshold
      ) {
        selected = tier;
        threshold = tier.minPromptTokens;
      }
    } else if (!Number.isFinite(hhmm)) {
      possible.push(tier);
    } else if (
      tier.utcStart < tier.utcEnd
        ? hhmm >= tier.utcStart && hhmm < tier.utcEnd
        : hhmm >= tier.utcStart || hhmm < tier.utcEnd
    ) {
      selected = tier;
    }
  }
  const known = selected ?? model;
  return possible.length ? maximumRates([known, ...possible]) : known;
}
