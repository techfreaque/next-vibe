import { describe, expect, it } from "bun:test";

import type { FolderContentsResponseOutput } from "../folder-contents/[rootFolderId]/definition";
import { markBootSeedUsed, pickBootSeed } from "./context";

/** Each call is a distinct page-load payload (identity is what counts). */
function snapshot(): FolderContentsResponseOutput {
  return {
    rootFolderPermissions: { canCreateThread: true, canCreateFolder: true },
    items: [],
  };
}

describe("boot payload seeding", () => {
  it("seeds a page-load snapshot until a consumer committed it", () => {
    const pageLoad = snapshot();
    // Hydration render and StrictMode double render both get it.
    expect(pickBootSeed(pageLoad)).toBe(pageLoad);
    expect(pickBootSeed(pageLoad)).toBe(pageLoad);
    markBootSeedUsed(pickBootSeed(pageLoad));
    // A remount after the list was garbage-collected must fetch fresh
    // instead of reviving rows deleted since page load.
    expect(pickBootSeed(pageLoad)).toBeUndefined();
  });

  it("keeps separate page loads independent", () => {
    const first = snapshot();
    const second = snapshot();
    markBootSeedUsed(first);
    expect(pickBootSeed(first)).toBeUndefined();
    expect(pickBootSeed(second)).toBe(second);
  });

  it("works for any boot payload type (messages, feed, folders)", () => {
    const messagesPayload = { messages: [{ id: "m1" }] };
    expect(pickBootSeed(messagesPayload)?.messages[0]?.id).toBe("m1");
    markBootSeedUsed(messagesPayload);
    expect(pickBootSeed(messagesPayload)).toBeUndefined();
  });

  it("returns nothing for a missing payload", () => {
    expect(pickBootSeed(null)).toBeUndefined();
    expect(pickBootSeed(undefined)).toBeUndefined();
    markBootSeedUsed(undefined);
  });
});
