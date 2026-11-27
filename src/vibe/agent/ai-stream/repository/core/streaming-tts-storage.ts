/**
 * Streaming TTS chunk storage.
 *
 * Providers hand back each chunk as a base64 data URL (100 to 400 KB per
 * chunk). Sent as is, the whole clip rode the audio-chunk WS event, which is
 * JSON parsed and stringified on every hop (emitter, /ws/broadcast, Redis
 * relay, hub fan-out) and merged into the client's messages cache: a single
 * 381 KB chunk stalled the prod event loop. The chunk is stored like every
 * other generated file and the event carries its portable URL; the client
 * plays either form (`audio.src`).
 */

import "server-only";

import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { StorageAdapter } from "../../../chat/storage/index";

/** Who may fetch the file: the user, or the lead for incognito threads. */
export interface TtsChunkOwner {
  userId?: string;
  leadId?: string;
}

/**
 * Return a storage URL for a data-URL audio chunk. Non-data URLs pass through.
 * On a failed upload the data URL is returned (and the failure logged), so
 * playback keeps working.
 */
export async function toStoredAudioUrl(params: {
  audioUrl: string;
  threadId: string | null;
  messageId: string | null;
  chunkIndex: number;
  owner: TtsChunkOwner;
  storage: Pick<StorageAdapter, "uploadFile">;
  logger: EndpointLogger;
}): Promise<string> {
  const { audioUrl, threadId, messageId, chunkIndex, owner, storage, logger } =
    params;
  if (!audioUrl.startsWith("data:")) {
    return audioUrl;
  }
  const commaIdx = audioUrl.indexOf(",");
  if (!threadId || commaIdx < 0) {
    logger.error(
      "[Streaming TTS] Audio chunk cannot be stored, sending it inline",
      {
        reason: threadId ? "malformed-data-url" : "no-thread-id",
        messageId,
        chunkIndex,
        inlineBytes: audioUrl.length,
      },
    );
    return audioUrl;
  }
  const mimeType = audioUrl.slice(5, commaIdx).split(";")[0] || "audio/mpeg";
  const ext =
    mimeType === "audio/mpeg" ? "mp3" : (mimeType.split("/")[1] ?? "mp3");
  try {
    const uploaded = await storage.uploadFile(
      Buffer.from(audioUrl.slice(commaIdx + 1), "base64"),
      {
        filename: `voice-reply-${chunkIndex}.${ext}`,
        mimeType,
        threadId,
        messageId: messageId ?? undefined,
        userId: owner.userId,
        leadId: owner.leadId,
      },
    );
    if (uploaded.url) {
      return uploaded.url;
    }
    logger.error(
      "[Streaming TTS] Storage returned no URL for audio chunk, sending it inline",
      { threadId, messageId, chunkIndex, inlineBytes: audioUrl.length },
    );
  } catch (error) {
    logger.error(
      "[Streaming TTS] Failed to store audio chunk, sending it inline",
      {
        error: parseError(error).message,
        threadId,
        messageId,
        chunkIndex,
        inlineBytes: audioUrl.length,
      },
    );
  }
  return audioUrl;
}
