/**
 * Bridged attachment descriptions are cached per attachment and reused on
 * later turns (regression: the same audio was re-described every turn, the
 * new description contradicted the model's earlier answer, and each turn
 * paid for another bridge call).
 */

import { describe, expect, it } from "bun:test";
import {
  DefaultFolderId,
  rootlessToolExecutionContext,
} from "next-vibe/core/execution-context";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import type { ChatMessage } from "../../../chat/db";
import { ChatMessageRole } from "../../../chat/enum";
import { getChatModelById } from "../../models";
import { ChatModelId } from "../../models-definitions";
import type { MessageVariant } from "../core/modality-resolver";
import {
  attachmentIdOfPart,
  attachmentPartOptions,
  cachedAttachmentDescription,
} from "./bridged-attachment";
import { toAiSdkMessages } from "./convert";

function variant(content: string, attachmentId?: string): MessageVariant {
  return {
    modality: "text",
    content,
    modelId: ChatModelId.DEEPSEEK_V4_1_FLASH,
    createdAt: "2026-11-16T00:00:00.000Z",
    bridgeType: "stt",
    ...(attachmentId ? { attachmentId } : {}),
  };
}

function userMessage(
  attachments: NonNullable<ChatMessage["metadata"]>["attachments"],
  variants: MessageVariant[],
): ChatMessage {
  return {
    id: "00000000-0000-4000-8000-0000000000a1",
    threadId: "00000000-0000-4000-8000-0000000000a0",
    role: ChatMessageRole.USER,
    content: "Describe the attachments.",
    parentId: null,
    sequenceId: null,
    authorId: null,
    authorName: null,
    isAI: false,
    model: null,
    skill: null,
    errorType: null,
    errorMessage: null,
    errorCode: null,
    metadata: { attachments, variants },
    upvotes: 0,
    downvotes: 0,
    createdAt: new Date(1_700_000_000_000),
    updatedAt: new Date(1_700_000_000_000),
  };
}

const audio = {
  id: "att-audio",
  url: "https://example.invalid/never-fetched.mp3",
  filename: "song.mp3",
  mimeType: "audio/mpeg",
  size: 10,
};
const video = {
  id: "att-video",
  url: "https://example.invalid/never-fetched.mp4",
  filename: "clip.mp4",
  mimeType: "video/mp4",
  size: 10,
};

describe("cachedAttachmentDescription", () => {
  it("picks the variant tagged with the attachment id", () => {
    const variants = [variant("audio text", "att-audio"), variant("video text", "att-video")];
    expect(cachedAttachmentDescription(variants, "att-video", 2)).toBe("video text");
    expect(cachedAttachmentDescription(variants, "att-other", 2)).toBeNull();
  });

  it("uses an untagged legacy variant only for a single attachment", () => {
    const variants = [variant("legacy text")];
    expect(cachedAttachmentDescription(variants, "att-audio", 1)).toBe("legacy text");
    expect(cachedAttachmentDescription(variants, "att-audio", 2)).toBeNull();
  });

  it("round-trips the attachment id through part options", () => {
    expect(
      attachmentIdOfPart({ providerOptions: attachmentPartOptions("att-x") }),
    ).toBe("att-x");
    expect(attachmentIdOfPart({})).toBeUndefined();
  });
});

describe("toAiSdkMessages reuses cached bridge descriptions", () => {
  it("injects each attachment's own description and never refetches the file", async () => {
    const textOnly = getChatModelById(ChatModelId.DEEPSEEK_V4_1_FLASH);
    expect(textOnly.inputs.includes("audio")).toBe(false);
    const result = await toAiSdkMessages(
      [
        userMessage(
          [audio, video],
          [variant("lo-fi hip-hop, 88 BPM", "att-audio"), variant("a spinning cube", "att-video")],
        ),
      ],
      createEndpointLogger(false, defaultLocale),
      "UTC",
      DefaultFolderId.PRIVATE,
      textOnly,
      false,
      rootlessToolExecutionContext(),
    );
    const serialized = JSON.stringify(result);
    expect(serialized).toContain(
      "[audio attachment - system-injected audio description (you cannot see the raw file)]:\\nlo-fi hip-hop, 88 BPM",
    );
    expect(serialized).toContain(
      "[video attachment - system-injected vision description (you cannot see the raw file)]:\\na spinning cube",
    );
    expect(serialized).not.toContain('"type":"file"');
  });
});
