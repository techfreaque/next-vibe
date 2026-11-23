import { describe, expect, it } from "bun:test";

import { DEFAULT_CHAT_MODEL_ID } from "next-vibe/agent/ai-stream/constants";
import {
  ChatModelId,
  chatModelOptionsIndex,
} from "next-vibe/agent/ai-stream/models";
import { estimateReferenceChatTurnCredits } from "next-vibe/agent/models/models";

import { getSubscriptionTiers } from "@/products/repository-client";

import { getCreditExamples } from "./credit-examples";

describe("pricing credit examples", () => {
  it("starts with the default chat model and has no duplicates", () => {
    const examples = getCreditExamples(800);
    expect(examples.length).toBeGreaterThanOrEqual(3);
    expect(examples[0]?.modelId).toBe(DEFAULT_CHAT_MODEL_ID);
    const ids = examples.map((example) => example.modelId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses the same per-message estimate as the model pages", () => {
    const model = chatModelOptionsIndex[ChatModelId.UNCENSORED_LM_V1_2];
    expect(model).toBeDefined();
    if (!model) {
      return;
    }
    const credits = estimateReferenceChatTurnCredits(model);
    const example = getCreditExamples(1000).find(
      (entry) => entry.modelId === ChatModelId.UNCENSORED_LM_V1_2,
    );
    expect(example?.creditsPerMessage).toBe(credits);
    expect(example?.messages).toBe(Math.floor(1000 / credits));
  });

  it("gives every live tier more messages than the tier below it", () => {
    const tiers = getSubscriptionTiers("en-US");
    for (let i = 1; i < tiers.length; i++) {
      const lower = getCreditExamples(tiers[i - 1]!.credits);
      const higher = getCreditExamples(tiers[i]!.credits);
      lower.forEach((example, index) => {
        expect(higher[index]!.messages).toBeGreaterThanOrEqual(
          example.messages,
        );
      });
    }
  });
});
