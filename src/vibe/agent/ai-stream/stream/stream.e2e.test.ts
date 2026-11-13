/**
 * E2E: the chat — a customer types into the real thread composer, sends, and
 * watches the AI answer stream into the conversation.
 *
 * Paid: the AI call records once to
 * src/generated/ai-fixtures/http-cache/e2e-vibe-agent-ai-stream-stream--<test>/
 * and replays on every run after (delete the folder to re-record).
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { and, eq } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { createEndpointLogger } from "next-vibe/logger/server";
import { recordOutcome } from "next-vibe/tooling/testing/e2e/coverage";
import { e2eEndpointId } from "next-vibe/tooling/testing/e2e/endpoint-form";
import type { E2EFixtures } from "next-vibe/tooling/testing/e2e/harness";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import type { Locator } from "playwright";
import { describe, expect } from "vitest";

import { chatMessages, chatThreads } from "../../chat/db";
import { ChatMessageRole } from "../../chat/enum";
import { scopedTranslation as settingsScopedTranslation } from "../../chat/settings/i18n";
import { ChatSettingsRepository } from "../../chat/settings/repository";
import { ChatModelId } from "../models";
import {
  sendThroughDevRestart,
  until,
  waitVisibleThroughDevReload,
} from "../testing/e2e-chat";
import {
  createE2ECreditUser,
  drainCredits,
} from "../testing/e2e-credit-user";
import streamEndpoints from "./definition";
import { scopedTranslation } from "./i18n";
import { TOUR_SKIPPED_KEY } from "./widget/chat-ui/welcome-tour/tour-config";

const endpoint = streamEndpoints.POST;
const NEW_THREAD_PAGE = "/threads/private/new";
/** Cheapest tool-capable OpenRouter chat model. */
const CHEAP_MODEL = ChatModelId.QWEN_3_8_FLASH;
/** The answer ("pong") never appears in the question, so finding it proves the AI replied. */
const PROMPT =
  "Which table-tennis word answers 'ping'? Reply with that single word only, lowercase.";
const STREAM_API = /\/api\/[^/]+\/vibe\/agent\/ai-stream\/stream$/;

const logger = createEndpointLogger(false, defaultLocale);
const { t } = scopedTranslation.scopedT(defaultLocale);

/** Make the cheap model the customer's chat model, as the model picker would. */
async function pickModel(
  user: Awaited<ReturnType<typeof createE2ECreditUser>>["user"],
): Promise<void> {
  const result = await ChatSettingsRepository.upsertSettings(
    { selectedModel: CHEAP_MODEL },
    user,
    logger,
    settingsScopedTranslation.scopedT(defaultLocale).t,
  );
  expect(result.success, JSON.stringify(result)).toBe(true);
}

/**
 * Open a fresh thread as a returning customer (welcome tour already skipped —
 * its overlay would swallow clicks) and return the composer once it accepts
 * input (credits loaded).
 */
async function openComposer({
  page,
  goto,
  context,
}: Pick<E2EFixtures, "page" | "goto" | "context">): Promise<Locator> {
  await context.addInitScript((key: string) => {
    localStorage.setItem(key, "true");
  }, TOUR_SKIPPED_KEY);
  const composer = page.locator('[data-hydrated] textarea[name="prompt"]');
  // `goto` (unlike `open`) does not ride out a dev-server HMR reload (503 on
  // the client entry → never hydrates); retry the navigation a few times.
  for (let attempt = 0; ; attempt++) {
    await goto(NEW_THREAD_PAGE);
    const hydrated = await composer
      .waitFor({ state: "visible", timeout: 30_000 })
      .then(() => true)
      .catch(() => false);
    if (hydrated) {
      break;
    }
    expect(attempt, "[e2e] thread page never hydrated").toBeLessThan(3);
  }
  await until("composer enabled", () => composer.isEnabled());
  return composer;
}

describe("E2E: chat stream", () => {
  const e2e = useE2E("vibe/agent/ai-stream/stream", { fixtures: true });

  e2e.it("sends a message from the composer and renders the streamed answer", async ({ page, goto, context, baseUrl, loginAs, capture, cleanup }) => {
    const buyer = await createE2ECreditUser("chat-stream", 100);
    // Deleting the account cascades its threads + messages
    cleanup(buyer.remove);
    await pickModel(buyer.user);
    await loginAs(buyer.user);

    const { composer, call } = await sendThroughDevRestart(
      baseUrl,
      async () => {
        const input = await openComposer({ page, goto, context });
        const send = page.getByTitle(t("actions.sendMessage"), {
          exact: true,
        });
        // Nothing to send yet
        expect(await send.isDisabled()).toBe(true);
        const sent = await capture(endpoint, async () => {
          await input.fill(PROMPT);
          await send.click();
        });
        return { composer: input, call: sent };
      },
    );
    expect(call.response.success, JSON.stringify(call.response)).toBe(true);
    expect(call.requestBody).toMatchObject({
      operation: "send",
      rootFolderId: "private",
      content: PROMPT,
      model: CHEAP_MODEL,
    });
    const threadId = String(
      (call.requestBody as { threadId?: string }).threadId,
    );

    // Composer clears and the thread gets its own URL
    await until(
      "composer cleared",
      async () => (await composer.inputValue()) === "",
    );
    await page.waitForURL((url) => url.pathname.endsWith(`/${threadId}`));

    // The question and the streamed answer are both in the conversation
    await waitVisibleThroughDevReload(page, page.getByText(PROMPT).first());
    await waitVisibleThroughDevReload(
      page,
      page.getByText(/\bpong\b/i).first(),
    );

    // Persisted: the thread belongs to the customer, the answer is stored
    const [thread] = await db
      .select({ userId: chatThreads.userId })
      .from(chatThreads)
      .where(eq(chatThreads.id, threadId));
    expect(thread?.userId).toBe(buyer.user.id);
    await until("assistant answer persisted", async () => {
      const rows = await db
        .select({ content: chatMessages.content })
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.threadId, threadId),
            eq(chatMessages.role, ChatMessageRole.ASSISTANT),
          ),
        );
      return rows.some((r) => /\bpong\b/i.test(r.content ?? ""));
    });
  });

  e2e.it("locks the composer the moment the balance runs out and never calls the AI", async ({ page, goto, context, loginAs, cleanup }) => {
    const buyer = await createE2ECreditUser("chat-broke", 5);
    cleanup(buyer.remove);
    await pickModel(buyer.user);
    await loginAs(buyer.user);

    const streamCalls: string[] = [];
    page.on("request", (request) => {
      if (STREAM_API.test(new URL(request.url()).pathname)) {
        streamCalls.push(request.url());
      }
    });

    const composer = await openComposer({ page, goto, context });
    await composer.fill(PROMPT);

    // Spent elsewhere (another tab, a background task) while the draft is open
    await drainCredits(buyer.user);

    // The open page picks the new balance up on its own: the out-of-credits
    // card replaces the textarea and tells the customer where to top up.
    const card = page.getByTestId("out-of-credits-card").first();
    await card.waitFor({ state: "visible" });
    await composer.waitFor({ state: "detached" });
    await card
      .getByText(t("outOfCredits.member.title"), { exact: true })
      .waitFor({ state: "visible" });
    expect(
      await card
        .getByRole("link", { name: t("outOfCredits.member.getCredits") })
        .getAttribute("href"),
    ).toBe(`/${defaultLocale}/subscription/buy`);
    // Send-time guard: a send with an empty balance never reaches the AI
    const send = page.getByTitle(t("actions.sendMessage"), { exact: true });
    if (await send.isEnabled()) {
      await send.click();
      await page.waitForTimeout(1_000);
    }
    expect(streamCalls).toEqual([]);
    // UI-side refusal, no request — what EndpointForm records for blocked submits
    recordOutcome(e2eEndpointId(endpoint), "clientValidation");
  });
});
