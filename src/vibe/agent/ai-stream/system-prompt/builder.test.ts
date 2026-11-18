import { describe, expect, it } from "bun:test";
import {
  DefaultFolderId,
  rootlessToolExecutionContext,
} from "next-vibe/core/execution-context";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import { buildSystemPrompt, type SystemPromptParams } from "./builder";

const params: SystemPromptParams = {
  toolExecutionContext: rootlessToolExecutionContext(),
  skillId: null,
  user: { isPublic: true, leadId: crypto.randomUUID(), roles: [] },
  logger: createEndpointLogger(false, defaultLocale),
  locale: defaultLocale,
  rootFolderId: DefaultFolderId.INCOGNITO,
  subFolderId: null,
  callMode: false,
  subAgentDepth: 0,
  threadId: crypto.randomUUID(),
  incognitoThreadTitle: "New Chat",
  mediaCapabilities: {
    nativeOutputs: ["text", "image"],
    imageGenModelName: "FLUX.2",
    musicGenModelName: null,
    videoGenModelName: null,
    imageGenIsSameAsChatModel: false,
    musicGenIsSameAsChatModel: false,
    videoGenIsSameAsChatModel: false,
    videoGenCapabilities: null,
  },
};

describe("system prompt tool availability", () => {
  it("asks a tool-free image model for native output without advertising tools", async () => {
    const { systemPrompt, trailingSystemMessage } = await buildSystemPrompt({
      ...params,
      toolsDisabled: true,
    });

    expect(systemPrompt).toContain("Native output formats: image");
    expect(systemPrompt).not.toContain("generate_image");
    expect(systemPrompt).not.toContain("tool-help");
    expect(systemPrompt).not.toContain("## Web");
    expect(trailingSystemMessage).not.toContain("rename-thread");
  });

  it("advertises configured tools and renaming when tools are available", async () => {
    const { systemPrompt, trailingSystemMessage } = await buildSystemPrompt(params);

    expect(systemPrompt).toContain("generate_image");
    expect(systemPrompt).toContain("tool-help");
    expect(systemPrompt).toContain("## Web");
    expect(trailingSystemMessage).toContain("rename-thread");
  });
});
