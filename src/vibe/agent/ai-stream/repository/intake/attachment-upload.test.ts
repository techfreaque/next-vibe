import { describe, expect, spyOn, test } from "bun:test";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import {
  type AttachmentUploadResult,
  chainAttachmentPersist,
  type StoredAttachment,
  toStoredAttachments,
} from "./attachment-upload";

const stored: StoredAttachment[] = [
  {
    id: "file-1",
    url: "/api/storage/thread-1/file-1.png",
    filename: "shot.png",
    mimeType: "image/png",
    size: 6,
  },
];

const files = [{ mimeType: "image/png", size: 6 }];

function deferred(): { promise: Promise<void>; resolve: () => void } {
  let resolve: () => void = () => undefined;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

describe("toStoredAttachments", () => {
  test("drops the inline base64 and every key outside the contract", () => {
    const result = toStoredAttachments([
      {
        id: "",
        url: "",
        filename: "shot.png",
        mimeType: "image/png",
        size: 6,
        data: "aGVsbG8h",
      },
    ]);
    expect(result).toEqual([
      { id: "", url: "", filename: "shot.png", mimeType: "image/png", size: 6 },
    ]);
    expect(JSON.stringify(result)).not.toContain("aGVsbG8h");
  });
});

describe("chainAttachmentPersist", () => {
  test("waits for the row insert even when the upload finished first", async () => {
    const logger = createEndpointLogger(false, defaultLocale);
    const row = deferred();
    const order: string[] = [];
    const outcome = chainAttachmentPersist({
      uploadPromise: Promise.resolve({ success: true, data: stored }),
      rowWritten: row.promise.then(() => {
        order.push("insert");
        return undefined;
      }),
      persist: async (attachments) => {
        order.push("persist");
        expect(attachments).toEqual(stored);
        return 1;
      },
      userMessageId: "msg-1",
      threadId: "thread-1",
      files,
      logger,
    });

    await Bun.sleep(5);
    expect(order).toEqual([]);
    row.resolve();
    expect(await outcome).toEqual({
      success: true,
      userMessageId: "msg-1",
      attachments: stored,
    });
    expect(order).toEqual(["insert", "persist"]);
  });

  test("a row update that matched nothing is an error, not a success", async () => {
    const logger = createEndpointLogger(false, defaultLocale);
    const errorSpy = spyOn(logger, "error").mockImplementation(
      () => undefined,
    );
    const outcome = await chainAttachmentPersist({
      uploadPromise: Promise.resolve({ success: true, data: stored }),
      rowWritten: Promise.resolve(),
      persist: async () => 0,
      userMessageId: "msg-2",
      threadId: "thread-2",
      files,
      logger,
    });
    expect(outcome).toEqual({ success: false, userMessageId: "msg-2" });
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy.mock.calls[0]?.[1]).toMatchObject({
      messageId: "msg-2",
      threadId: "thread-2",
      mimeTypes: ["image/png"],
      sizes: [6],
      storedFileIds: ["file-1"],
    });
  });

  test("an upload failure is logged with context and never persists", async () => {
    const logger = createEndpointLogger(false, defaultLocale);
    const errorSpy = spyOn(logger, "error").mockImplementation(
      () => undefined,
    );
    let persisted = false;
    const failed: AttachmentUploadResult = {
      success: false,
      message: "File type not allowed",
    };
    const outcome = await chainAttachmentPersist({
      uploadPromise: Promise.resolve(failed),
      rowWritten: Promise.resolve(),
      persist: async () => {
        persisted = true;
        return 1;
      },
      userMessageId: "msg-3",
      threadId: "thread-3",
      files,
      logger,
    });
    expect(outcome.success).toBe(false);
    expect(persisted).toBe(false);
    expect(errorSpy.mock.calls[0]?.[1]).toMatchObject({
      messageId: "msg-3",
      threadId: "thread-3",
      errorMessage: "File type not allowed",
    });
  });

  test("a storage throw resolves to a logged failure instead of rejecting", async () => {
    const logger = createEndpointLogger(false, defaultLocale);
    const errorSpy = spyOn(logger, "error").mockImplementation(
      () => undefined,
    );
    const outcome = await chainAttachmentPersist({
      uploadPromise: Promise.reject(new Error("S3 PutObject timed out")),
      rowWritten: Promise.resolve(),
      persist: async () => 1,
      userMessageId: "msg-4",
      threadId: "thread-4",
      files,
      logger,
    });
    expect(outcome).toEqual({ success: false, userMessageId: "msg-4" });
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy.mock.calls[0]?.[1]).toMatchObject({
      messageId: "msg-4",
      threadId: "thread-4",
    });
  });
});
