/**
 * E2E: system prompt debug tool page — real browser against the running server.
 * The cortex query embedding (userMessage) records once into
 * src/generated/ai-fixtures/http-cache/e2e-vibe-agent-ai-stream-system-prompt-debug-<test>/
 * and replays on every later run (delete the folder to re-record).
 */

import { describe, expect } from "vitest";

import { DefaultFolderId } from "next-vibe/core/execution-context";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";

import { createE2ECreditUser } from "../../testing/e2e-credit-user";
import debugEndpoints from "./definition";
import { scopedTranslation } from "./i18n";

const endpoint = debugEndpoints.GET;

describe("E2E: system prompt debug", () => {
  const e2e = useE2E("vibe/agent/ai-stream/system-prompt/debug", {
    fixtures: true,
  });
  const { t } = scopedTranslation.scopedT(defaultLocale);

  e2e.it("builds the prompt for a picked folder and message and shows it", async ({ open, page, loginAs, cleanup }) => {
    const buyer = await createE2ECreditUser("prompt-debug", 0);
    cleanup(buyer.remove);
    await loginAs(buyer.user);

    const form = await open(endpoint);
    // Empty state until a context is built
    await page.getByText(t("get.widget.emptyTitle")).waitFor({ state: "visible" });

    await form.fill({
      rootFolderId: DefaultFolderId.PRIVATE,
      userMessage: "What did we discuss last time?",
    });

    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success, JSON.stringify(result.response).slice(0, 500)).toBe(true);
    if (!result.response.success) return;
    const { data } = result.response;
    expect(data.systemPrompt.length).toBeGreaterThan(100);
    // Logged-in user + message → the cortex embedding search ran
    expect(data.cortexDiagnostics?.embeddingGenerated).toBe(true);

    // Metrics + the prompt itself are rendered
    await page.getByText(t("get.widget.chars")).waitFor({ state: "visible" });
    const firstLine = data.systemPrompt.split("\n").find((l) => l.trim().length > 10)?.trim() ?? "";
    await page.locator("pre").filter({ hasText: firstLine.slice(0, 40) }).first().waitFor({ state: "visible" });
  });

  e2e.it("refuses a thread the caller cannot read", async ({ open, loginAs, cleanup }) => {
    const buyer = await createE2ECreditUser("prompt-debug-thread", 0);
    cleanup(buyer.remove);
    await loginAs(buyer.user);

    // Not the caller's thread (no such thread) — must not leak anything
    const form = await open(endpoint, {
      query: { threadId: crypto.randomUUID() },
    });
    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.status).toBe(404);
    expect(result.response.success).toBe(false);
    await form.alert.waitFor({ state: "visible" });
  });

  e2e.it("blocks a sub-folder id that is not a UUID before sending", async ({ open }) => {
    const form = await open(endpoint);
    await form.fill({ subFolderId: "not-a-uuid" });

    const result = await form.submit();
    expect(result.sent).toBe(false);
    if (result.sent) return;
    expect(Object.keys(result.fieldErrors)).toEqual(["subFolderId"]);
  });
});
