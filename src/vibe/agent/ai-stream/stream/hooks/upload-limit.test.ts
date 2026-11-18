import { describe, expect, it } from "bun:test";
import {
  isContentLengthTooLarge,
  MAX_REQUEST_BODY_BYTES,
  MAX_UPLOAD_BYTES,
} from "next-vibe/core/route/body-limit";

import { getUploadTooLargeMessage } from "./upload-limit";

const MB = 1024 * 1024;

describe("stream upload size guard", () => {
  it("lets normal attachments through", () => {
    expect(
      getUploadTooLargeMessage(
        { attachments: [{ size: 5 * MB }, { size: 10 * MB }] },
        "en-GLOBAL",
      ),
    ).toBeNull();
    expect(
      getUploadTooLargeMessage({ attachments: null }, "en-GLOBAL"),
    ).toBeNull();
    expect(
      getUploadTooLargeMessage(
        { attachments: [{ size: MAX_UPLOAD_BYTES }] },
        "en-GLOBAL",
      ),
    ).toBeNull();
  });

  // Prod 2026-11-18: a 47 MB multipart body was truncated by the proxy and
  // surfaced as "rootFolderId: Invalid option ..." validation noise.
  it("blocks a 47 MB upload with a clear message", () => {
    const message = getUploadTooLargeMessage(
      { attachments: [{ size: 47_489_432 }] },
      "en-GLOBAL",
    );
    expect(message).toContain("45.3 MB");
    expect(message).toContain("30 MB");
    expect(message).not.toContain("rootFolderId");
  });

  it("sums attachments and the audio input", () => {
    expect(
      getUploadTooLargeMessage(
        {
          attachments: [{ size: 20 * MB }],
          audioInput: { file: { size: 15 * MB } },
        },
        "en-GLOBAL",
      ),
    ).not.toBeNull();
    expect(
      getUploadTooLargeMessage({ audioInput: { file: null } }, "en-GLOBAL"),
    ).toBeNull();
  });

  it("detects oversized Content-Length on the server side", () => {
    expect(isContentLengthTooLarge(null)).toBe(false);
    expect(isContentLengthTooLarge("garbage")).toBe(false);
    expect(isContentLengthTooLarge(String(MAX_REQUEST_BODY_BYTES))).toBe(false);
    expect(isContentLengthTooLarge("47489432")).toBe(true);
    expect(isContentLengthTooLarge("138159436")).toBe(true);
  });
});
