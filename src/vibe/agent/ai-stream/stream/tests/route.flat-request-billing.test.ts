import { afterEach, expect, it } from "bun:test";
import { tool } from "ai";
import { and, eq } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { createEndpointLogger } from "next-vibe/logger/server";
import { z } from "zod";

import { creditTransactions, creditWallets } from "@/credits/db";
import { scopedTranslation as creditsTranslation } from "@/credits/i18n";
import { CreditRepository } from "@/credits/repository";

import { DefaultFolderId } from "../../../../core/execution-context";
import { chatMessages } from "../../../chat/db";
import { ChatMessageRole } from "../../../chat/enum";
import { sumGroupCreditCost } from "../../../chat/threads/[threadId]/messages/widget/message-grouping";
import { NO_SKILL_ID } from "../../../skills/constants";
import { ChatModelId } from "../../models";
import { AiStreamRepository } from "../../repository";
import { createE2ECreditUser, drainCredits } from "../../testing/e2e-credit-user";
import { isFixtureReplayOnly } from "../../testing/fetch-cache";
import { seedFixtureThread } from "../../testing/fixture-seed";
import { fixtures } from "../../testing/fixtures.db";
import { scopedTranslation } from "../i18n";

const cleanups: Array<() => Promise<void>> = [];

afterEach(async () => {
  for (const cleanup of cleanups.splice(0).reverse()) {
    await cleanup();
  }
});

async function runTurn(balance: number): Promise<{
  debits: number[];
  requests: number | undefined;
  groupCost: number | null;
  finalAnswer: string | null | undefined;
  stoppedForCredits: boolean;
}> {
  expect(isFixtureReplayOnly(undefined)).toBe(true);
  const logger = createEndpointLogger(false, defaultLocale);
  const { t } = scopedTranslation.scopedT(defaultLocale);
  const { t: creditsT } = creditsTranslation.scopedT(defaultLocale);
  const buyer = await createE2ECreditUser("flat-request-billing", 0);
  cleanups.push(buyer.remove);
  await drainCredits(buyer.user);
  const funded = await CreditRepository.addUserCredits(
    buyer.user.id,
    balance,
    "permanent",
    logger,
    creditsT,
  );
  expect(funded.success).toBe(true);

  const threadId = crypto.randomUUID();
  cleanups.push(async () => {
    await db.delete(fixtures).where(eq(fixtures.threadId, threadId));
  });
  await seedFixtureThread(threadId, "flat-request-billing", false);

  const model = ChatModelId.UNCENSORED_LM_V1_2;
  const result = await AiStreamRepository.createAiStream({
    awaitResult: true,
    locale: defaultLocale,
    logger,
    user: buyer.user,
    request: undefined,
    t,
    subAgentDepth: 0,
    turnStepLimitOverride: 4,
    excludeMemories: true,
    skipUncensoredConsentGate: true,
    fixtureScopeId: threadId,
    toolsOverride: {
      fixture_lookup: tool({
        inputSchema: z.object({}),
        execute: () => Promise.resolve("fixture tool result"),
      }),
    },
    data: {
      operation: "send",
      rootFolderId: DefaultFolderId.PRIVATE,
      threadId,
      userMessageId: crypto.randomUUID(),
      parentMessageId: null,
      content: "Use the fixture lookup and report the result.",
      role: ChatMessageRole.USER,
      model,
      skill: NO_SKILL_ID,
      favoriteConfig: null,
      toolConfirmations: null,
      messageHistory: [],
      voiceMode: { enabled: false },
      audioInput: { file: null },
      resumeToken: null,
      timezone: "UTC",
      attachments: null,
      executionContext: { mode: "local" },
    },
  });
  expect(result.success).toBe(true);

  const [ledger, fixture, messages] = await Promise.all([
    db
      .select({ amount: creditTransactions.amount })
      .from(creditTransactions)
      .innerJoin(creditWallets, eq(creditTransactions.walletId, creditWallets.id))
      .where(
        and(
          eq(creditWallets.userId, buyer.user.id),
          eq(creditTransactions.modelId, model),
        ),
      ),
    db.select().from(fixtures).where(eq(fixtures.threadId, threadId)),
    db.select().from(chatMessages).where(eq(chatMessages.threadId, threadId)),
  ]);

  return {
    debits: ledger.map(({ amount }) => amount),
    requests: fixture[0]?.counter,
    groupCost: sumGroupCreditCost(messages),
    finalAnswer: result.success ? result.data.lastAiMessageContent : undefined,
    stoppedForCredits: messages.some(
      ({ metadata }) => metadata?.streamError?.status === 402,
    ),
  };
}

it("settles two uncensored.ai requests for 13 credits in the ledger and footer", async () => {
  const turn = await runTurn(13);
  expect(turn.requests).toBe(2);
  expect(turn.debits).toEqual([-13]);
  expect(turn.groupCost).toBe(13);
  expect(turn.finalAnswer).toContain("The lookup is complete.");
  expect(turn.stoppedForCredits).toBe(false);
}, 30_000);

it("stops before a second request when the wallet can only pay for one", async () => {
  const turn = await runTurn(7);
  expect(turn.requests).toBe(1);
  expect(turn.debits).toEqual([-6.5]);
  expect(turn.groupCost).toBe(6.5);
  expect(turn.stoppedForCredits).toBe(true);
}, 30_000);
