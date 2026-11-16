/**
 * Reference media for third-party generation providers: own storage files go
 * out as data URIs (providers have no session), browser data URIs pass
 * through, and nothing is ever rebased onto our origin (prod 2026-11-16:
 * "https://unbottled.aidata:image/jpeg;base64,...").
 */

import { describe, expect, it } from "bun:test";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

const JPEG_DATA_URI = "data:image/jpeg;base64,/9j/4AAQSkZJRg==";

describe("parseBase64DataUri", () => {
  it("splits mime type and payload", async () => {
    const { parseBase64DataUri } = await import("./media-generation");
    expect(parseBase64DataUri(JPEG_DATA_URI)).toEqual({
      mimeType: "image/jpeg",
      base64: "/9j/4AAQSkZJRg==",
    });
    expect(
      parseBase64DataUri("data:image/png;name=a.png;base64,iVBORw0KGgo="),
    ).toEqual({ mimeType: "image/png", base64: "iVBORw0KGgo=" });
  });

  it("rejects non-base64 data URIs and URLs", async () => {
    const { parseBase64DataUri } = await import("./media-generation");
    expect(parseBase64DataUri("data:text/plain,hello")).toBeNull();
    expect(parseBase64DataUri("https://example.com/a.png")).toBeNull();
    expect(
      parseBase64DataUri(
        "/api/en-GLOBAL/vibe/agent/chat/threads/files/t1/f1.png",
      ),
    ).toBeNull();
  });
});

describe("resolveMediaReference (no storage access)", () => {
  it("passes data URIs and public URLs through, drops the rest", async () => {
    const { resolveMediaReference } = await import("./media-generation");
    const { createEndpointLogger } = await import("next-vibe/logger/server");
    const logger = createEndpointLogger(false, "en-GLOBAL");
    const user = {
      isPublic: true as const,
      leadId: "11111111-1111-4111-8111-111111111111",
      roles: [UserPermissionRole.PUBLIC],
    };

    expect(
      await resolveMediaReference(JPEG_DATA_URI, user, logger, "en-GLOBAL"),
    ).toBe(JPEG_DATA_URI);
    expect(
      await resolveMediaReference(
        "https://cdn.example.com/a.png",
        user,
        logger,
        "en-GLOBAL",
      ),
    ).toBe("https://cdn.example.com/a.png");
    expect(
      await resolveMediaReference(
        "data:text/plain,hello",
        user,
        logger,
        "en-GLOBAL",
      ),
    ).toBeNull();
    expect(
      await resolveMediaReference("/not/storage.png", user, logger, "en-GLOBAL"),
    ).toBeNull();
  });
});
