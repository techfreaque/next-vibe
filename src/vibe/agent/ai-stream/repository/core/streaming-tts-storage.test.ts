/**
 * The audio-chunk WS event must carry a storage URL, never the base64 clip.
 */

import { describe, expect, it } from "bun:test";
import { createEndpointLogger } from "next-vibe/logger/server";

import type { StorageAdapter } from "../../../chat/storage/index";
import { toStoredAudioUrl } from "./streaming-tts-storage";

type UploadParams = Parameters<StorageAdapter["uploadFile"]>;

function fakeStorage(behavior: "ok" | "throw"): {
  storage: Pick<StorageAdapter, "uploadFile">;
  calls: UploadParams[];
} {
  const calls: UploadParams[] = [];
  return {
    calls,
    storage: {
      uploadFile: async (file, metadata) => {
        calls.push([file, metadata]);
        if (behavior === "throw") {
          throw new Error("s3 down");
        }
        return {
          url: `/api/en-US/vibe/agent/chat/threads/files/${metadata.threadId}/f1.mp3`,
          fileId: "f1",
          metadata: {
            id: "f1",
            filename: "f1.mp3",
            originalFilename: metadata.filename,
            mimeType: metadata.mimeType,
            size: 3,
            uploadedAt: new Date(),
            threadId: metadata.threadId,
          },
        };
      },
    },
  };
}

const logger = createEndpointLogger(false, "en-US");
const clip = Buffer.from("abc").toString("base64");
const dataUrl = `data:audio/mpeg;base64,${clip}`;

describe("toStoredAudioUrl", () => {
  it("TTS-STORE-1 uploads a data URL and returns the portable file URL", async () => {
    const { storage, calls } = fakeStorage("ok");
    const url = await toStoredAudioUrl({
      audioUrl: dataUrl,
      threadId: "t1",
      messageId: "m1",
      chunkIndex: 2,
      owner: { userId: "u1" },
      storage,
      logger,
    });
    expect(url).toBe("/api/en-US/vibe/agent/chat/threads/files/t1/f1.mp3");
    expect(calls.length).toBe(1);
    const [file, meta] = calls[0] ?? [];
    expect(Buffer.isBuffer(file) ? file.toString() : "").toBe("abc");
    expect(meta).toMatchObject({
      threadId: "t1",
      messageId: "m1",
      mimeType: "audio/mpeg",
      filename: "voice-reply-2.mp3",
      userId: "u1",
    });
  });

  it("TTS-STORE-2 incognito chunks belong to the lead", async () => {
    const { storage, calls } = fakeStorage("ok");
    await toStoredAudioUrl({
      audioUrl: "data:audio/wav;base64,AAAA",
      threadId: "t1",
      messageId: "m1",
      chunkIndex: 0,
      owner: { leadId: "l1" },
      storage,
      logger,
    });
    expect(calls[0]?.[1]).toMatchObject({
      leadId: "l1",
      userId: undefined,
      filename: "voice-reply-0.wav",
    });
  });

  it("TTS-STORE-3 keeps playback working when the upload fails", async () => {
    const { storage } = fakeStorage("throw");
    const url = await toStoredAudioUrl({
      audioUrl: dataUrl,
      threadId: "t1",
      messageId: "m1",
      chunkIndex: 0,
      owner: { userId: "u1" },
      storage,
      logger,
    });
    expect(url).toBe(dataUrl);
  });

  it("TTS-STORE-4 passes non-data URLs through without uploading", async () => {
    const { storage, calls } = fakeStorage("ok");
    const url = await toStoredAudioUrl({
      audioUrl: "https://provider.example/audio.mp3",
      threadId: "t1",
      messageId: "m1",
      chunkIndex: 0,
      owner: { userId: "u1" },
      storage,
      logger,
    });
    expect(url).toBe("https://provider.example/audio.mp3");
    expect(calls.length).toBe(0);
  });
});
