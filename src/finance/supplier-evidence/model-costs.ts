import { CreditFundingType } from "@/credits/enum";

import {
  type ConsumptionGroup,
  type PackPrices,
  PAID_FUNDING,
} from "../consumption";

export interface MonthlyModelEstimate {
  provider: string;
  modelId: string | null;
  estimatedUsd: number;
  missingExactCredits: number;
  paidUsd: number;
  freeUsd: number;
  giftedUsd: number;
  unknownUsd: number;
  unknownFundingCredits: number;
  paidUsageValueUsd: number;
  missingPaidPriceCredits: number;
  marginUsd: number | null;
}

export function aggregateModelCosts(
  attributedGroups: readonly {
    group: ConsumptionGroup;
    provider: string;
    costUsd: number;
  }[],
  prices: PackPrices,
): MonthlyModelEstimate[] {
  const totals = new Map<string, MonthlyModelEstimate>();
  for (const { group, provider, costUsd } of attributedGroups) {
    if (!Number.isFinite(costUsd) || group.credits <= 0) {
      continue;
    }
    const key = JSON.stringify([provider, group.modelId]);
    const row = totals.get(key) ?? {
      provider,
      modelId: group.modelId,
      estimatedUsd: 0,
      missingExactCredits: 0,
      paidUsd: 0,
      freeUsd: 0,
      giftedUsd: 0,
      unknownUsd: 0,
      unknownFundingCredits: 0,
      paidUsageValueUsd: 0,
      missingPaidPriceCredits: 0,
      marginUsd: null,
    };
    row.estimatedUsd += costUsd;
    row.missingExactCredits += group.uncostedCredits;
    if (PAID_FUNDING.has(group.funding)) {
      row.paidUsd += costUsd;
      const price = group.packId ? prices.get(group.packId) : undefined;
      if (price !== undefined) {
        row.paidUsageValueUsd += group.credits * price;
      } else {
        row.missingPaidPriceCredits += group.credits;
      }
    } else if (group.funding === CreditFundingType.FREE_ALLOWANCE) {
      row.freeUsd += costUsd;
    } else if (
      group.funding === CreditFundingType.ADMIN_GRANT ||
      group.funding === CreditFundingType.REFERRAL ||
      group.funding === CreditFundingType.FREE_BONUS
    ) {
      row.giftedUsd += costUsd;
    } else {
      row.unknownUsd += costUsd;
      row.unknownFundingCredits += group.credits;
    }
    totals.set(key, row);
  }
  return [...totals.values()]
    .map((row) => ({
      ...row,
      marginUsd:
        row.missingPaidPriceCredits > 0 || row.unknownFundingCredits > 0
          ? null
          : row.paidUsageValueUsd - row.estimatedUsd,
    }))
    .toSorted((a, b) => b.estimatedUsd - a.estimatedUsd);
}
