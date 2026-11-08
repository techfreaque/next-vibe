/**
 * Fail-closed chat billing: a credit deduction that fails (even after one
 * retry) must stop the stream — never silently hand out a free turn.
 */

import { afterEach, describe, expect, it, vi } from "vitest";

import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { CreditRepository } from "@/credits/repository";
import {
  DefaultFolderId,
  rootlessToolExecutionContext,
} from "next-vibe/core/execution-context";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { createEndpointLogger } from "next-vibe/logger/server";

import { createMessagesEmitter } from "../../../../chat/threads/[threadId]/messages/emitter";
import { MessageDbWriter } from "../message-db-writer";
import { deductAndEmitCredits } from "./credits";

const THREAD_ID = "00000000-0000-4000-8000-0000000000ca";
const user = {
  isPublic: true as const,
  leadId: "00000000-0000-4000-8000-0000000000cb",
  roles: [],
};

function makeWriter(): MessageDbWriter {
  const logger = createEndpointLogger(false, defaultLocale);
  const ctx = rootlessToolExecutionContext();
  ctx.threadId = THREAD_ID;
  return new MessageDbWriter(
    false,
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
  message: "credits.errors.deductCreditsFailed",
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
});
