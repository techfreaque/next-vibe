/**
 * E2E: ai-run — a one-shot agent run from its tool page: type a prompt into
 * the chat-style composer, send, get the answer back in the run's thread.
 *
 * Paid: the AI call records once to
 * src/generated/ai-fixtures/http-cache/e2e-vibe-agent-ai-stream-run--<test>/
 * and replays on every run after (delete the folder to re-record).
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { eq } from "drizzle-orm";
import type { Locator } from "playwright";
import { describe, expect } from "vitest";

import { DefaultFolderId } from "next-vibe/core/execution-context";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import type { E2EFixtures } from "next-vibe/tooling/testing/e2e/harness";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";

import { chatThreads } from "../../chat/db";
import { ChatModelId } from "../models";
import { scopedTranslation } from "../stream/i18n";
import {
  sendThroughDevRestart,
  waitVisibleThroughDevReload,
} from "../testing/e2e-chat";
import {
  createE2ECreditUser,
  drainCredits,
} from "../testing/e2e-credit-user";
import runEndpoints from "./definition";

const endpoint = runEndpoints.POST;
/** Cheapest tool-capable OpenRouter chat model. */
const CHEAP_MODEL = ChatModelId.QWEN_3_7_FLASH;
/** The answer ("pong") never appears in the question, so finding it proves the AI replied. */
const PROMPT =
  "Which table-tennis word answers 'ping'? Reply with that single word only, lowercase.";

const { t } = scopedTranslation.scopedT(defaultLocale);

/**
 * Open /tools/ai-run with the model preset (a shared run link) and return the
 * composer once it is interactive. `open` waits for a `[data-field]` this
 * hand-built composer does not render, so navigate with `goto` and retry
 * through dev-server HMR reloads.
 */
async function openRunComposer({
  page,
  goto,
}: Pick<E2EFixtures, "page" | "goto">): Promise<Locator> {
  // The composer sits outside a <Form> (noFormElement), so hydration is
  // signalled by the page's other forms carrying `[data-hydrated]`.
  const hydrated = page.locator("[data-hydrated]").first();
  // A second, hidden composer instance is mounted too — target the visible one
  const composer = page.locator('textarea[name="prompt"]:visible');
  const query = new URLSearchParams({ model: CHEAP_MODEL }).toString();
  for (let attempt = 0; ; attempt++) {
    await goto(`/tools/ai-run?${query}`);
    const ready = await hydrated
      .waitFor({ state: "attached", timeout: 30_000 })
      .then(() => composer.waitFor({ state: "visible", timeout: 30_000 }))
      .then(() => true)
      .catch(() => false);
    if (ready) {
      break;
    }
    expect(attempt, "[e2e] ai-run page never hydrated").toBeLessThan(3);
  }
  return composer;
}

/** The visible composer's send button (see the hidden-instance note above). */
function sendButton(page: E2EFixtures["page"]): Locator {
  return page.locator(`button[title="${t("actions.sendMessage")}"]:visible`);
}

describe("E2E: ai-run", () => {
  const e2e = useE2E("vibe/agent/ai-stream/run", { fixtures: true });

  e2e.it("runs a one-shot prompt and shows the answer in the run's thread", async ({ page, goto, baseUrl, loginAs, capture, cleanup }) => {
    const buyer = await createE2ECreditUser("ai-run", 100);
    // Deleting the account cascades the run's thread + messages
    cleanup(buyer.remove);
    await loginAs(buyer.user);

    const { call } = await sendThroughDevRestart(baseUrl, async () => {
      const composer = await openRunComposer({ page, goto });
      const send = sendButton(page);
      expect(await send.isDisabled()).toBe(true);
      const sent = await capture(endpoint, async () => {
        await composer.fill(PROMPT);
        await send.click();
      });
      return { call: sent };
    });
    expect(call.response.success, JSON.stringify(call.response)).toBe(true);
    expect(call.requestBody).toMatchObject({
      prompt: PROMPT,
      model: CHEAP_MODEL,
    });
    if (!call.response.success) return;
    const run = call.response.data;
    expect(run.text ?? "").toMatch(/\bpong\b/i);
    expect(run.threadId).toBeTruthy();

    // The answer renders in the run's thread view (if a dev-server reload kills
    // the view, the run's own thread page must show it instead)
    await waitVisibleThroughDevReload(
      page,
      page.getByText(/\bpong\b/i).first(),
      () =>
        goto(`/threads/${DefaultFolderId.BACKGROUND}/${String(run.threadId)}`),
    );

    // Persisted in the customer's background folder
    const [thread] = await db
      .select({
        userId: chatThreads.userId,
        rootFolderId: chatThreads.rootFolderId,
      })
      .from(chatThreads)
      .where(eq(chatThreads.id, String(run.threadId)));
    expect(thread?.userId).toBe(buyer.user.id);
    expect(thread?.rootFolderId).toBe(DefaultFolderId.BACKGROUND);
  });

  e2e.it("refuses a run the balance cannot cover and says why", async ({ page, goto, baseUrl, loginAs, capture, cleanup }) => {
    const buyer = await createE2ECreditUser("ai-run-broke", 0);
    cleanup(buyer.remove);
    await loginAs(buyer.user);

    const { call } = await sendThroughDevRestart(baseUrl, async () => {
      const composer = await openRunComposer({ page, goto });
      // Spend everything — after the page loaded, since the visit itself can
      // attach a fresh lead (and its monthly allowance) to the session
      await drainCredits(buyer.user);
      const sent = await capture(endpoint, async () => {
        await composer.fill(PROMPT);
        await sendButton(page).click();
      });
      return { call: sent };
    });
    expect(call.response.success).toBe(false);
    if (call.response.success) return;
    expect(call.status, JSON.stringify([call.response, call.requestBody])).toBe(403);
    // The refusal is shown to the customer, not swallowed
    await page
      .getByRole("alert")
      .filter({ hasText: call.response.message })
      .first()
      .waitFor({ state: "visible" });
  });
});
