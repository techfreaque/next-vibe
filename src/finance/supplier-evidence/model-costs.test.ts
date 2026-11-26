import { describe, expect, it } from "vitest";

import {
  CreditFundingType,
  type CreditFundingTypeDBValue,
} from "@/credits/enum";

import type { ConsumptionGroup } from "../consumption";
import { aggregateModelCosts } from "./model-costs";

describe("model usage margins", () => {
  const usage = (
    funding: CreditFundingTypeDBValue,
    credits: number,
    costUsd: number,
    packId: string | null = null,
  ): { group: ConsumptionGroup; provider: string; costUsd: number } => ({
    provider: "openrouter",
    costUsd,
    group: {
      bucket: "2026-11-01T00:00:00.000Z",
      modelId: "sample-model",
      apiProvider: "openrouter",
      funding,
      credits,
      packId,
      recordedCostUsd: costUsd,
      uncostedCredits: 0,
    },
  });

  it("values paid usage once and includes gifted and free costs in estimated margin", () => {
    const [result] = aggregateModelCosts(
      [
        usage(CreditFundingType.PURCHASED, 100, 3, "pack-a"),
        usage(CreditFundingType.FREE_ALLOWANCE, 30, 1.5),
        usage(CreditFundingType.FREE_BONUS, 25, 2),
      ],
      new Map([["pack-a", 0.1]]),
    );

    expect(result).toMatchObject({
      paidUsageValueUsd: 10,
      paidUsd: 3,
      freeUsd: 1.5,
      giftedUsd: 2,
      estimatedUsd: 6.5,
      marginUsd: 3.5,
      missingPaidPriceCredits: 0,
    });
  });

  it("leaves missing purchase value or uncertain funding visible", () => {
    const [result] = aggregateModelCosts(
      [
        usage(CreditFundingType.SUBSCRIPTION, 100, 3, "unverified-price"),
        usage(CreditFundingType.FREE_UNKNOWN, 30, 1.5),
      ],
      new Map(),
    );

    expect(result).toMatchObject({
      paidUsageValueUsd: 0,
      missingPaidPriceCredits: 100,
      unknownFundingCredits: 30,
      unknownUsd: 1.5,
      marginUsd: null,
    });
  });
});
