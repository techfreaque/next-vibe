import { afterEach, expect, it, mock, spyOn } from "bun:test";
import { streamText } from "ai";
import {
  DefaultFolderId,
  rootlessToolExecutionContext,
} from "next-vibe/core/execution-context";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { JWTPublicPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";

import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";

import { ThreadStreamingState } from "../../../chat/enum";
import { ChatModelId, getChatModelById } from "../../models";
import { createNanoGPT } from "../../providers/nano-gpt";
import { scopedTranslation } from "../../stream/i18n";
import * as stream from "../core/stream";
import { complete } from "./finalize";
import { StreamLoop } from "./loop";

afterEach(() => mock.restore());

it.each([
  ["content filter", "content_filter", false, null, "errors.contentFiltered"],
  ["provider failure with a balance cap", "stop", true, "Failed to process successful response 200", "errors.streamError"],
  ["balance cap exhaustion", "length", true, null, "errors.creditBudgetReached"],
] as const)("shows one error for %s with no text", async (_name, finishReason, creditBudgetCapped, providerError, errorKey) => {
  const logger = createEndpointLogger(false, defaultLocale);
  const { t } = scopedTranslation.scopedT(defaultLocale);
  const threadId = crypto.randomUUID();
  const model = ChatModelId.GROK_4_7;
  const user: JWTPublicPayloadType = {
    isPublic: true,
    leadId: crypto.randomUUID(),
    roles: [UserPermissionRole.PUBLIC],
  };
  const toolExecutionContext = rootlessToolExecutionContext();
  toolExecutionContext.threadId = threadId;
  toolExecutionContext.rootFolderId = DefaultFolderId.INCOGNITO;
  const ctx = new stream.ToolExecutionContextImpl({
    sequenceId: crypto.randomUUID(),
    initialParentId: null,
    initialAssistantMessageId: crypto.randomUUID(),
    isIncognito: true,
    logger,
    creditsT: creditsScopedTranslation.scopedT(defaultLocale).t,
    locale: defaultLocale,
    wsEmit: () => ({ delivered: false, relayed: false, dropped: true }),
    emitTitle: () => undefined,
    streamRunId: undefined,
    toolExecutionContext,
  });
  ctx.creditBudgetCapped = creditBudgetCapped;
  ctx.lastProviderErrorText = providerError;
  spyOn(stream, "clearStreamingState").mockResolvedValue({
    state: ThreadStreamingState.IDLE,
    updatedAt: new Date(),
  });
  const reportedError = spyOn(ctx.dbWriter, "emitErrorMessage").mockResolvedValue(
    undefined,
  );
  const done = spyOn(ctx.dbWriter, "emitContentDoneRaw");
  spyOn(ctx.dbWriter, "deductAndEmitCredits").mockResolvedValue(undefined);
  const chunk = {
    id: "filter-fixture",
    choices: [{ index: 0, delta: {}, finish_reason: finishReason }],
    usage: { prompt_tokens: 10, completion_tokens: 3 },
  };
  const provider = createNanoGPT(
    logger,
    Object.assign(
      async () =>
        new Response(`data: ${JSON.stringify(chunk)}\n\ndata: [DONE]\n\n`),
      { preconnect: fetch.preconnect },
    ),
  );
  const providerModel = provider.chat("fixture");
  const loop = new StreamLoop({
    provider,
    modelConfig: getChatModelById(model),
    messages: [],
    streamAbortController: new AbortController(),
    systemPrompt: "",
    tools: undefined,
    toolsConfig: new Map(),
    activeToolNames: null,
    ctx,
    threadId,
    model,
    skill: "fixture",
    isIncognito: true,
    userId: undefined,
    emittedToolResultIds: undefined,
    ttsHandler: null,
    user,
    locale: defaultLocale,
    logger,
    t,
    toolExecutionContext,
    creditBalance: 100,
    modelCost: 1,
    midStreamCompactingThreshold: 1,
    midStreamCompactingParams: {
      model,
      skill: "fixture",
      threadId,
      isIncognito: true,
      userId: undefined,
      user,
      providerModel,
      t,
    },
  });

  await complete(loop, streamText({ model: providerModel, prompt: "fixture" }));

  expect(reportedError).toHaveBeenCalledTimes(1);
  expect(reportedError).toHaveBeenCalledWith(
    expect.objectContaining({ content: t(errorKey) }),
  );
  expect(done).toHaveBeenCalledTimes(1);
});
