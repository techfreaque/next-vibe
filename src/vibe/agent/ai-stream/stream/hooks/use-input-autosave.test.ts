import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from "bun:test";
import type { EndpointLogger, LoggerMetadata } from "next-vibe/logger/types";
import { largeStorage } from "next-vibe/ui/lib/storage";

import { loadDraftAttachments, saveDraftAttachments } from "./use-input-autosave";

const UNREADABLE_FILE_TYPE = "application/x-unreadable-fixture";

class FixtureFileReader extends EventTarget {
  result: string | null = null;
  error: DOMException | null = null;

  readAsDataURL(file: Blob): void {
    if (file.type === UNREADABLE_FILE_TYPE) {
      this.error = new DOMException(
        "Backing file no longer exists",
        "NotFoundError",
      );
      this.dispatchEvent(new Event("error"));
      return;
    }
    this.result = "data:text/plain;base64,c2F2ZWQ=";
    this.dispatchEvent(new Event("load"));
  }
}

describe("draft attachment autosave", () => {
  const key = "chat-draft:test";
  const originalReader = Object.getOwnPropertyDescriptor(globalThis, "FileReader");
  const logError = mock<(message: string, context?: LoggerMetadata) => void>();
  const logger: EndpointLogger = {
    debug: () => undefined,
    error: logError,
    info: () => undefined,
    vibe: () => undefined,
    warn: () => undefined,
    isDebugEnabled: false,
  };
  const records = new Map<string, string>();

  beforeEach(() => {
    records.clear();
    logError.mockClear();
    Object.defineProperty(globalThis, "FileReader", {
      configurable: true,
      value: FixtureFileReader,
    });
    spyOn(largeStorage, "setItem").mockImplementation((key, value) => {
      records.set(key, value);
      return Promise.resolve();
    });
    spyOn(largeStorage, "getItem").mockImplementation((key) =>
      Promise.resolve(records.get(key) ?? null),
    );
  });

  afterEach(() => {
    mock.restore();
    if (originalReader) {
      Object.defineProperty(globalThis, "FileReader", originalReader);
    } else {
      Reflect.deleteProperty(globalThis, "FileReader");
    }
  });

  it("persists readable peers and reports each unreadable attachment", async () => {
    await saveDraftAttachments(
      key,
      [
        new File(["lost"], "private.txt", { type: UNREADABLE_FILE_TYPE }),
        new File(["saved"], "kept.txt", { type: "text/plain" }),
      ],
      logger,
    );

    const saved = await loadDraftAttachments(key, logger);
    expect(saved.map((file) => file.name)).toEqual(["kept.txt"]);
    expect(await saved[0]?.text()).toBe("saved");
    expect(logError.mock.calls).toEqual([
      [
        "Chat draft attachment is unreadable",
        {
          stage: "file-read",
          errorName: "NotFoundError",
          attachmentIndex: 0,
          attachmentCount: 2,
        },
      ],
    ]);
  });

  it("keeps the previous snapshot if every current attachment is unreadable", async () => {
    await saveDraftAttachments(
      key,
      [new File(["saved"], "previous.txt")],
      logger,
    );
    await saveDraftAttachments(
      key,
      [new File(["lost"], "private.txt", { type: UNREADABLE_FILE_TYPE })],
      logger,
    );

    const saved = await loadDraftAttachments(key, logger);
    expect(saved.map((file) => file.name)).toEqual(["previous.txt"]);
    expect(logError).toHaveBeenCalledTimes(1);
  });
});
