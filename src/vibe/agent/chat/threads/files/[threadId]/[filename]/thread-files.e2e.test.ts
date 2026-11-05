/**
 * E2E: chat file serving — real browser against the running server.
 * Requires a server (Atlas dev by default): `vibe dev`.
 *
 * An uploaded attachment is rendered in the thread by its storage URL; the
 * browser fetches the bytes from this endpoint, which checks the viewer may
 * see the thread.
 */

import { describe, expect } from "vitest";

import { DefaultFolderId } from "next-vibe/core/execution-context";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";

import {
  chatReady,
  createE2EUser,
  deleteE2EUser,
  seedMessage,
  seedThread,
  seedThreadFile,
  signInAs,
  suppressWelcomeTour,
  TINY_PNG,
} from "../../../../testing/e2e-seed";
import threadFileEndpoints from "./definition";

const endpoint = threadFileEndpoints.GET;
const IMAGE_MIME = "image/png";

describe("E2E: chat file serving", () => {
  const e2e = useE2E("agent/chat/threads/files");

  e2e.it("the owner's thread shows an uploaded image, served with its real type and bytes", async (fixtures) => {
    const { capture, page, context, uniqueEmail, cleanup } = fixtures;
    const owner = await createE2EUser(uniqueEmail("files-owner"));
    cleanup(() => deleteE2EUser(owner));
    const threadId = await seedThread(owner, {
      rootFolderId: DefaultFolderId.PRIVATE,
      title: `E2E Files ${Date.now()}`,
    });
    const file = await seedThreadFile(owner, threadId, {
      name: "e2e-pixel.png",
      mimeType: IMAGE_MIME,
      bytes: TINY_PNG,
    });
    cleanup(file.remove);
    await seedMessage(owner, threadId, "Here is the image", { attachment: file });
    await signInAs(fixtures, owner);
    await suppressWelcomeTour(context);

    const served = await capture(endpoint, () =>
      fixtures.gotoReady(`/threads/${DefaultFolderId.PRIVATE}/${threadId}`, chatReady(page)),
    );

    expect(served.status).toBe(200);
    expect(served.contentType).toBe(IMAGE_MIME);
    expect(served.bytes).toBe(TINY_PNG.length);
    // Per-viewer access check — a shared cache must never keep it
    expect(file.url).toContain(`/${threadId}/${file.filename}`);
    await page.locator(`img[src="${file.url}"]`).first().waitFor();
  });

  e2e.it("a stranger opening someone else's file link gets nothing", async (fixtures) => {
    const { capture, page, uniqueEmail, cleanup } = fixtures;
    const owner = await createE2EUser(uniqueEmail("files-owner2"));
    cleanup(() => deleteE2EUser(owner));
    const stranger = await createE2EUser(uniqueEmail("files-stranger"));
    cleanup(() => deleteE2EUser(stranger));
    const threadId = await seedThread(owner, {
      rootFolderId: DefaultFolderId.PRIVATE,
      title: `E2E Files private ${Date.now()}`,
    });
    const file = await seedThreadFile(owner, threadId, {
      name: "secret.png",
      mimeType: IMAGE_MIME,
      bytes: TINY_PNG,
    });
    cleanup(file.remove);
    await signInAs(fixtures, stranger);

    const denied = await capture(endpoint, async () => {
      await page.goto(file.url);
    });

    expect(denied.status).toBe(404);
    expect(denied.response.success).toBe(false);
    expect(denied.bytes).toBeLessThan(500);
  });
});
