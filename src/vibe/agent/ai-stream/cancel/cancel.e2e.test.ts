/**
 * E2E: stop an AI response — real browser against the running server.
 * Requires a server (Atlas dev by default): `vibe dev`.
 *
 * The composer's stop button cancels the thread's running stream; the same
 * endpoint is a tool page where a thread is picked from the customer's list.
 */

import { describe, expect } from "vitest";

import { DefaultFolderId } from "next-vibe/core/execution-context";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { endpointToUrlSegment } from "next-vibe/core/core-utils/path";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";

import { ThreadStreamingState } from "../../chat/enum";
import {
  chatReady,
  createE2EUser,
  deleteE2EUser,
  getThreadStreamingState,
  seedThread,
  signInAs,
  suppressWelcomeTour,
} from "../../chat/testing/e2e-seed";
import { scopedTranslation as streamScopedTranslation } from "../stream/i18n";
import cancelEndpoints from "./definition";

const endpoint = cancelEndpoints.POST;

describe("E2E: stop an AI response", () => {
  const e2e = useE2E("agent/ai-stream/cancel");
  const { t: tStream } = streamScopedTranslation.scopedT(defaultLocale);

  e2e.it("the stop button cancels the thread's running response", async (fixtures) => {
    const { capture, page, context, uniqueEmail, cleanup } = fixtures;
    const owner = await createE2EUser(uniqueEmail("cancel"));
    cleanup(() => deleteE2EUser(owner));
    const threadId = await seedThread(owner, {
      rootFolderId: DefaultFolderId.PRIVATE,
      title: `E2E Cancel ${Date.now()}`,
      streamingState: ThreadStreamingState.STREAMING,
    });
    await signInAs(fixtures, owner);
    await suppressWelcomeTour(context);
    await fixtures.gotoReady(`/threads/${DefaultFolderId.PRIVATE}/${threadId}`, chatReady(page));

    const stop = page.getByRole("button", { name: tStream("actions.stopGeneration") });
    const call = await capture(endpoint, () => stop.click());

    expect(call.requestBody).toEqual({ threadId });
    expect(call.response.success, JSON.stringify(call.response)).toBe(true);
    if (!call.response.success) return;
    expect(call.response.data.cancelled).toBe(true);
    expect(await getThreadStreamingState(threadId)).not.toBe(ThreadStreamingState.STREAMING);
  });

  e2e.it("cancels a thread picked from the customer's thread list", async (fixtures) => {
    const { open, uniqueEmail, cleanup } = fixtures;
    const owner = await createE2EUser(uniqueEmail("cancel-pick"));
    cleanup(() => deleteE2EUser(owner));
    const threadId = await seedThread(owner, {
      rootFolderId: DefaultFolderId.PRIVATE,
      title: `E2E Cancel Pick ${Date.now()}`,
      streamingState: ThreadStreamingState.STREAMING,
    });
    await signInAs(fixtures, owner);

    const form = await open(endpoint);
    await form.fill({ threadId });
    const result = await form.submit();

    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success, JSON.stringify(result.response)).toBe(true);
    if (!result.response.success) return;
    expect(result.response.data.cancelled).toBe(true);
  });

  e2e.it("blocks submitting without a thread", async (fixtures) => {
    const { open, uniqueEmail, cleanup } = fixtures;
    const owner = await createE2EUser(uniqueEmail("cancel-empty"));
    cleanup(() => deleteE2EUser(owner));
    await signInAs(fixtures, owner);

    const form = await open(endpoint);
    const result = await form.submit();

    expect(result.sent).toBe(false);
    if (result.sent) return;
    expect(Object.keys(result.fieldErrors)).toEqual(["threadId"]);
  });

  e2e.it("refuses to cancel someone else's thread", async (fixtures) => {
    const { capture, goto, page, uniqueEmail, cleanup } = fixtures;
    const owner = await createE2EUser(uniqueEmail("cancel-owner"));
    cleanup(() => deleteE2EUser(owner));
    const stranger = await createE2EUser(uniqueEmail("cancel-stranger"));
    cleanup(() => deleteE2EUser(stranger));
    const threadId = await seedThread(owner, {
      rootFolderId: DefaultFolderId.PRIVATE,
      title: `E2E Cancel Foreign ${Date.now()}`,
      streamingState: ThreadStreamingState.STREAMING,
    });
    await signInAs(fixtures, stranger);

    // A pasted thread id (deep link) — the stranger's own picker would never
    // list it. A prefilled picker renders no input, so submit the form directly.
    await goto(`/tools/${endpointToUrlSegment(endpoint)}?threadId=${threadId}`);
    const submit = page.locator('[data-testid="endpoint-submit"]:visible').first();
    const result = await capture(endpoint, () => submit.click());

    expect(result.requestBody).toEqual({ threadId });
    expect(result.status).toBe(403);
    expect(result.response.success).toBe(false);
    // Refused before any state change: never flipped to aborting by a stranger
    expect(await getThreadStreamingState(threadId)).not.toBe(ThreadStreamingState.ABORTING);
  });
});
