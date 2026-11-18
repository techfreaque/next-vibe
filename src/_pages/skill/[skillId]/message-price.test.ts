import { describe, expect, test } from "bun:test";
import { ChatModelId, getChatModelById } from "next-vibe/agent/ai-stream/models";
import { calculateCreditCost } from "next-vibe/agent/models/models";

import { getSkillMessagePrice } from "./message-price";

describe("skill message price", () => {
  test("UncensoredLM shows the marked-up fixed charge used by billing", () => {
    const model = getChatModelById(ChatModelId.UNCENSORED_LM_V1_2);
    expect(model).not.toBeNull();
    if (!model) {
      return;
    }

    expect(getSkillMessagePrice(model, "en-US")).toEqual({
      credits: calculateCreditCost(model, 0, 0),
      creditLabel: "6.5",
      basis: null,
    });
    expect(getSkillMessagePrice(model, "de-DE").creditLabel).toBe("6,5");
  });

  test.each([ChatModelId.KIMI_K3, ChatModelId.GPT_6_1_TERRA])(
    "%s estimates the model page's reference turn using the billing formula",
    (id) => {
      const model = getChatModelById(id);
      expect(model).not.toBeNull();
      if (!model) {
        return;
      }

      const price = getSkillMessagePrice(model, "en-US");
      expect(price.credits).toBe(calculateCreditCost(model, 16_000, 1_500));
      expect(price.basis).toEqual({
        input: "16,000",
        output: "1,500",
        includesImage: false,
      });
    },
  );

  test("image-output chat estimates include a generated image at the image rate", () => {
    const model = getChatModelById(ChatModelId.GEMINI_NANO_BANANA_2_1);
    expect(model).not.toBeNull();
    if (!model) {
      return;
    }

    const price = getSkillMessagePrice(model, "en-US");
    expect(price.credits).toBe(calculateCreditCost(model, 16_000, 2_620, 0, 0, 1_120));
    expect(price.basis?.includesImage).toBe(true);
  });
});
