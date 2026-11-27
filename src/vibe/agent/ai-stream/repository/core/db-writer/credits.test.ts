/**
 * Fail-closed chat billing: a credit deduction that fails (even after one
 * retry) must stop the stream — never silently hand out a free turn.
 */

import { DefaultFolderId, rootlessToolExecutionContext } from "next-vibe/core/execution-context";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { ErrorResponseTypes, fail, success } from "next-vibe/core/route/response.schema";
import { createEndpointLogger } from "next-vibe/logger/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { CreditRepository } from "@/credits/repository";

import { createMessagesEmitter } from "../../../../chat/threads/[threadId]/messages/emitter";
import { ApiProvider, chargeForProviderCredits } from "../../../../models/models";
import { ChatModelId } from "../../../models";
import { scopedTranslation as streamTranslation } from "../../../stream/i18n";
import { settleInferenceRelay } from "../../relay/billing";
import { shapeRunResult } from "../../run-result";
import { MessageDbWriter } from "../message-db-writer";
import { deductAndEmitCredits } from "./credits";

const THREAD_ID = "00000000-0000-4000-8000-0000000000ca";
const user = {
  isPublic: true as const,
  leadId: "00000000-0000-4000-8000-0000000000cb",
  roles: [],
};

function makeWriter(isIncognito = false): MessageDbWriter {
  const logger = createEndpointLogger(false, defaultLocale);
  const ctx = rootlessToolExecutionContext();
  ctx.threadId = THREAD_ID;
  return new MessageDbWriter(
    isIncognito,
    logger,
    creditsScopedTranslation.scopedT(defaultLocale).t,
    defaultLocale,
    createMessagesEmitter(logger, user, {
      threadId: THREAD_ID,
      rootFolderId: DefaultFolderId.PRIVATE,
    }),
    () => undefined,
    ctx,
  );
}

const deductionFailed = fail({
  message: creditsScopedTranslation.scopedT(defaultLocale).t("errors.deductCreditsFailed"),
  errorType: ErrorResponseTypes.INTERNAL_ERROR,
});

describe("deductAndEmitCredits — fail closed", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("retries once, then marks billingFailed and stops the stream", async () => {
    const spy = vi
      .spyOn(CreditRepository, "deductCreditsForFeature")
      .mockResolvedValue(deductionFailed);
    const writer = makeWriter();
    let stops = 0;
    writer.onBillingFailed = (): void => {
      stops++;
    };

    await deductAndEmitCredits(writer, {
      user,
      amount: 3,
      feature: "test-tool",
      type: "tool",
      model: undefined,
    });

    expect(spy).toHaveBeenCalledTimes(2);
    expect(writer.billingFailed).toBe(true);
    expect(stops).toBe(1);
    expect(writer.totalCreditsDeducted).toBe(0);
  });

  it("a transient failure recovered by the retry bills normally", async () => {
    const spy = vi
      .spyOn(CreditRepository, "deductCreditsForFeature")
      .mockResolvedValueOnce(deductionFailed)
      .mockResolvedValueOnce(success());
    const writer = makeWriter();
    let stops = 0;
    writer.onBillingFailed = (): void => {
      stops++;
    };

    await deductAndEmitCredits(writer, {
      user,
      amount: 2,
      feature: "test-tool",
      type: "tool",
      model: undefined,
    });

    expect(spy).toHaveBeenCalledTimes(2);
    expect(writer.billingFailed).toBe(false);
    expect(stops).toBe(0);
    expect(writer.totalCreditsDeducted).toBe(2);
  });

  it("reports two compactions, a tool and a final model step in the same ai-run total", async () => {
    vi.spyOn(CreditRepository, "deductCreditsForModelUsage")
      .mockResolvedValueOnce(success({ deducted: 8 }))
      .mockResolvedValueOnce(success({ deducted: 10 }))
      .mockResolvedValueOnce(success({ deducted: 2, partialDeduction: true }));
    vi.spyOn(CreditRepository, "deductCreditsForFeature").mockResolvedValue(success());
    const writer = makeWriter(true);
    const warn = vi.spyOn(writer.deps.logger, "warn");
    const model = ChatModelId.GLM_5_3_UNCENSORED;
    for (const cost of [8, 10]) {
      await writer.emitCompactingDone({
        messageId: `fixture-compaction-${cost}`,
        threadId: THREAD_ID,
        content: "fixture summary",
        inputTokens: 10,
        outputTokens: 2,
        totalTokens: 12,
        uncachedInputTokens: 10,
        model,
        messagesToCompact: [],
        user,
        creditCost: cost,
      });
    }
    await deductAndEmitCredits(writer, {
      user,
      amount: 7,
      feature: "fixture-tool",
      type: "tool",
      model: undefined,
    });
    await deductAndEmitCredits(writer, {
      user,
      amount: 5,
      feature: model,
      type: "model",
      model,
      turnBudget: {
        startingCredits: 30,
        trackedModelSteps: 2,
        settlement: "completed-turn",
      },
    });
    expect(warn).toHaveBeenCalledWith(
      "[AI Stream] Model charge exceeded spendable balance",
      expect.objectContaining({
        requestedCredits: 5,
        deductedCredits: 2,
        shortfallCredits: 3,
        creditsDeductedBeforeCharge: 25,
        turnBudget: {
          startingCredits: 30,
          trackedModelSteps: 2,
          settlement: "completed-turn",
        },
        chargeExceedsTurnBudget: false,
        spentElsewhereDuringTurn: 3,
      }),
    );
    const result = await shapeRunResult({
      headlessResult: {
        lastAiMessageId: "fixture-answer",
        lastAiMessageContent: "answer",
        totalCreditsDeducted: writer.totalCreditsDeducted,
        pinnedToolCount: 0,
      },
      headlessThreadMode: "none",
      isIncognito: true,
      logger: createEndpointLogger(false, defaultLocale),
      t: streamTranslation.scopedT(defaultLocale).t,
      preCallResults: [],
    });
    expect(result).toMatchObject({ success: true, data: { text: "answer", creditCost: 27 } });
  });

  it("reports the caller's settled debit on an inference relay, including partial and failed deductions", async () => {
    const ledger = vi
      .spyOn(CreditRepository, "deductCreditsForModelUsage")
      .mockResolvedValueOnce(success({}))
      .mockResolvedValueOnce(success({ deducted: 3, partialDeduction: true }))
      .mockResolvedValueOnce(deductionFailed);
    const request = {
      user,
      model: ChatModelId.GLM_5_3_UNCENSORED,
      providerCredits: 10,
      listedCost: 5,
      instanceId: "fixture-peer",
      logger: createEndpointLogger(false, defaultLocale),
      locale: defaultLocale,
    };
    expect(await settleInferenceRelay(request)).toBe(chargeForProviderCredits(10));
    expect(await settleInferenceRelay(request)).toBe(3);
    expect(await settleInferenceRelay(request)).toBe(0);
    expect(ledger.mock.calls[0]?.[1]).toBe(chargeForProviderCredits(10));
  });

  it("zero-cost usage never touches billing", async () => {
    const spy = vi.spyOn(CreditRepository, "deductCreditsForFeature");
    const writer = makeWriter();
    await deductAndEmitCredits(writer, {
      user,
      amount: 0,
      feature: "test-tool",
      type: "tool",
      model: undefined,
    });
    expect(spy).not.toHaveBeenCalled();
    expect(writer.billingFailed).toBe(false);
  });

  it("passes the serving API to model billing", async () => {
    const spy = vi
      .spyOn(CreditRepository, "deductCreditsForModelUsage")
      .mockResolvedValue(success({}));
    const model = ChatModelId.GLM_5_3_UNCENSORED;

    await deductAndEmitCredits(makeWriter(), {
      user,
      amount: 2,
      feature: model,
      type: "model",
      model,
      apiProvider: ApiProvider.NANO_GPT,
    });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0]?.[7]).toBe(ApiProvider.NANO_GPT);
  });
});
