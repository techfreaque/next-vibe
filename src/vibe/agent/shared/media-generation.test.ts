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

describe("resolveMediaReference (Cortex upload paths)", () => {
  it("swaps a Cortex upload path, bare or with our origin, for the stored file", async () => {
    const { mock } = await import("bun:test");
    const calls: string[] = [];
    void mock.module("../cortex/mounts/uploads", () => ({
      resolveUploadAttachmentUrl: (_userId: string, path: string): string | null => {
        calls.push(path);
        return path.endsWith("-png.md") ? "https://cdn.example.com/stored.png" : null;
      },
    }));
    const { resolveMediaReference } = await import("./media-generation");
    const { createEndpointLogger } = await import("next-vibe/logger/server");
    const logger = createEndpointLogger(false, "en-GLOBAL");
    const user = {
      isPublic: false as const,
      id: "22222222-2222-4222-8222-222222222222",
      leadId: "11111111-1111-4111-8111-111111111111",
      roles: [UserPermissionRole.CUSTOMER],
    };
    // Prod 2026-11-25: image-to-image got this exact shape and 404ed.
    const prodShape =
      "https://unbottled.ai/uploads/images/zdj-cie-08291f9b-2020-4314-bf35-449c4213eaa1/remote-db0c7f6a-b04a-48ec-b7e0-82d04c5f5528-1-png.md";
    expect(await resolveMediaReference(prodShape, user, logger, "en-GLOBAL")).toBe(
      "https://cdn.example.com/stored.png",
    );
    expect(
      await resolveMediaReference(
        "/uploads/images/t-08291f9b-2020-4314-bf35-449c4213eaa1/a-png.md",
        user,
        logger,
        "en-GLOBAL",
      ),
    ).toBe("https://cdn.example.com/stored.png");
    // Unknown upload: the original URL is kept (provider reports the failure).
    expect(
      await resolveMediaReference(
        "https://cdn.example.com/uploads/other.png",
        user,
        logger,
        "en-GLOBAL",
      ),
    ).toBe("https://cdn.example.com/uploads/other.png");
    expect(calls).toHaveLength(3);
  });
});
