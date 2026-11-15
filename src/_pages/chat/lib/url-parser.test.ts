import { describe, expect, it } from "bun:test";

import { NEW_MESSAGE_ID } from "next-vibe/agent/chat/enum";
import { DefaultFolderId } from "next-vibe/core/execution-context";

import { parseChatUrl } from "./url-parser";

const FOLDER = "7997bf61-dfc8-4651-b84b-b1e4e5921595";
const THREAD = "53cbc505-767d-43de-91a3-50615b9dd080";

describe("parseChatUrl", () => {
  it("drops a non-UUID folder segment instead of passing it to the DB", () => {
    expect(parseChatUrl(["shared", "1"])).toEqual({
      initialRootFolderId: DefaultFolderId.SHARED,
      initialSubFolderId: null,
      initialThreadId: null,
    });
    expect(parseChatUrl(["private", "abc", "new"]).initialSubFolderId).toBe(
      null,
    );
    expect(parseChatUrl(["private", "abc", THREAD])).toEqual({
      initialRootFolderId: DefaultFolderId.PRIVATE,
      initialSubFolderId: null,
      initialThreadId: THREAD,
    });
  });

  it("keeps UUID folders and threads", () => {
    // /root/<uuid> parses as a thread; the page disambiguates via the DB
    expect(parseChatUrl(["shared", FOLDER]).initialThreadId).toBe(FOLDER);
    expect(parseChatUrl(["private", FOLDER, "new"])).toEqual({
      initialRootFolderId: DefaultFolderId.PRIVATE,
      initialSubFolderId: FOLDER,
      initialThreadId: NEW_MESSAGE_ID,
    });
    expect(parseChatUrl(["private", FOLDER, THREAD])).toEqual({
      initialRootFolderId: DefaultFolderId.PRIVATE,
      initialSubFolderId: FOLDER,
      initialThreadId: THREAD,
    });
    expect(parseChatUrl(["private", "shared"]).initialSubFolderId).toBe(null);
  });
});
