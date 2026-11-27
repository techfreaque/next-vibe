import { describe, expect, it } from "bun:test";

import { findUnreadableAttachment } from "./attachment-readability";

class MissingFileSlice extends Blob {
  override arrayBuffer(): Promise<ArrayBuffer> {
    return Promise.reject(
      new DOMException("File no longer exists", "NotFoundError"),
    );
  }
}

class MissingFile extends File {
  override slice(): Blob {
    return new MissingFileSlice();
  }
}

describe("findUnreadableAttachment", () => {
  it("accepts files that are still readable, including empty files", async () => {
    const files = [new File(["input"], "draft.txt"), new File([], "empty.txt")];
    expect(await findUnreadableAttachment(files)).toBeNull();
  });

  it("identifies the failed file without collecting its name or contents", async () => {
    const files = [
      new File(["input"], "draft.txt"),
      new MissingFile(["input"], "deleted.txt"),
    ];
    const result = await findUnreadableAttachment(files);
    expect(result).toEqual({ index: 1, bytes: 5, errorName: "NotFoundError" });
  });
});
