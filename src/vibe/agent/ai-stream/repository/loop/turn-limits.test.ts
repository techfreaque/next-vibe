import { afterEach, expect, it, mock, spyOn } from "bun:test";
import { tool } from "ai";
import {
  DefaultFolderId,
  rootlessToolExecutionContext,
} from "next-vibe/core/execution-context";
import type { JWTPublicPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { z } from "zod";
import {
  ErrorResponseTypes,
  success,
} from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import executeToolDefinition from "next-vibe/execute-tool/definition";
import { RouteExecuteRepository } from "next-vibe/execute-tool/repository";
import { createToolFromEndpoint } from "next-vibe/platforms/ai/tools-loader";
import { Platform } from "next-vibe/platforms/platforms";

import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { getRouteHandler } from "@/generated/routes/handlers";

import { ChatMessageRole, ThreadStreamingState } from "../../../chat/enum";
import { messageMetadataSchema } from "../../../chat/message-schema";
import { DEFAULT_TURN_STEP_LIMIT } from "../../../chat/settings/constants";
import settingsDefinition from "../../../chat/settings/definition";
import { scopedTranslation as settingsTranslation } from "../../../chat/settings/i18n";
import { ChatModelId, getChatModelById } from "../../models";
import { createNanoGPT } from "../../providers/nano-gpt";
import streamDefinition from "../../stream/definition";
import { scopedTranslation } from "../../stream/i18n";
import { toAiSdkMessages } from "../context/convert";
import {
  AbortReason,
  StreamAbortError,
  StreamErrorType,
} from "../core/constants";
import { buildSseMessageRow } from "../core/db-writer/sse-row";
import * as stream from "../core/stream";
import { StreamLoop } from "./loop";

const locale = "en-US";
const { t } = scopedTranslation.scopedT(locale);

function makeToolLoop(params: {
  turnStepLimit?: number;
  creditBalance: number;
  recording?: Array<{ answer?: string; args: Record<string, WidgetData> }>;
  finalAnswerAfter?: number;
  toolFinishReason?: "stop" | "tool_calls";
  model?: ChatModelId;
  modelCost?: number;
}) {
  const logger = createEndpointLogger(false, locale);
  const threadId = crypto.randomUUID();
  const model = params.model ?? ChatModelId.GROK_4_7;
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
    creditsT: creditsScopedTranslation.scopedT(locale).t,
    locale,
    wsEmit: () => ({ delivered: false, relayed: false, dropped: true }),
    emitTitle: () => undefined,
    streamRunId: undefined,
    toolExecutionContext,
  });
  const settled = spyOn(stream, "clearStreamingState").mockResolvedValue({
    state: ThreadStreamingState.IDLE,
    updatedAt: new Date(),
  });
  const notice = spyOn(ctx.dbWriter, "emitErrorMessage").mockResolvedValue(
    undefined,
  );
  const deduction = spyOn(
    ctx.dbWriter,
    "deductAndEmitCredits",
  ).mockResolvedValue(undefined);

  let step = 0;
  const requestBodies: string[] = [];
  const replay = mock(
    async (
      _url: RequestInfo | URL,
      init?: RequestInit,
    ): Promise<Response> => {
      if (typeof init?.body === "string") {
        requestBodies.push(init.body);
      }
      step += 1;
      const recorded = params.recording?.[step - 1];
      const finished =
        params.finalAnswerAfter === step ||
        (params.recording !== undefined && !recorded);
      const id = `fixture-${step}`;
      const delta = finished
        ? { content: "Finished." }
        : {
            tool_calls: [
              {
                index: 0,
                id,
                type: "function",
                function: {
                  name: recorded ? "execute-tool" : "fixture_tool",
                  arguments: JSON.stringify(recorded?.args ?? {}),
                },
              },
            ],
          };
      const chunks = [
        ...(recorded?.answer
          ? [
              {
                id,
                choices: [
                  {
                    index: 0,
                    delta: { content: recorded.answer },
                    finish_reason: null,
                  },
                ],
              },
            ]
          : []),
        { id, choices: [{ index: 0, delta, finish_reason: null }] },
        {
          id,
          choices: [
            {
              index: 0,
              delta: {},
              finish_reason: finished
                ? "stop"
                : (params.toolFinishReason ?? "tool_calls"),
            },
          ],
          usage: { prompt_tokens: 200, completion_tokens: 2_500 },
        },
      ];
      return new Response(
        chunks.map((chunk) => `data: ${JSON.stringify(chunk)}\n\n`).join("") +
          "data: [DONE]\n\n",
      );
    },
  );
  const provider = createNanoGPT(
    logger,
    Object.assign(replay, { preconnect: fetch.preconnect }),
  );
  const execute = mock(async (): Promise<string> => "fixture result");
  const loop = new StreamLoop({
    provider,
    modelConfig: getChatModelById(model),
    messages: [{ role: "user", content: "Run the fixture tool." }],
    streamAbortController: stream.AbortControllerSetup.setupAbortController(),
    systemPrompt: "",
    tools: {
      fixture_tool: tool({ inputSchema: z.object({}), execute }),
    },
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
    locale,
    logger,
    t,
    toolExecutionContext,
    creditBalance: params.creditBalance,
    modelCost: params.modelCost ?? 1,
    turnStepLimit: params.turnStepLimit,
    midStreamCompactingThreshold: 0,
    midStreamCompactingParams: {
      model,
      skill: "fixture",
      threadId,
      isIncognito: true,
      userId: undefined,
      user,
      providerModel: provider.chat("fixture"),
      t,
    },
  });
  return { loop, replay, execute, notice, deduction, settled, requestBodies };
}

afterEach(() => mock.restore());

const rename = {
  toolName: "rename-thread",
  input: { title: "Weekend plans", description: "Comparing train routes." },
  callbackMode: "endLoop" as const,
};

function makeRenameReplay(
  recording: NonNullable<Parameters<typeof makeToolLoop>[0]["recording"]>,
) {
  const replay = makeToolLoop({ creditBalance: 100_000, recording });
  const p = replay.loop.p;
  p.user = {
    isPublic: false,
    id: crypto.randomUUID(),
    leadId: crypto.randomUUID(),
    roles: [UserPermissionRole.CUSTOMER],
  };
  p.tools = {
    "execute-tool": createToolFromEndpoint(executeToolDefinition.POST, {
      user: p.user,
      locale,
      logger: p.logger,
      toolExecutionContext: p.toolExecutionContext,
      requiresConfirmation: false,
    }),
  };
  const dispatch = spyOn(RouteExecuteRepository, "execute").mockResolvedValue(
    success({ result: { updatedTitle: "Weekend plans" } }),
  );
  const stored = spyOn(p.ctx.dbWriter, "emitToolResult");
  const warnings = spyOn(p.logger, "warn").mockImplementation(() => undefined);
  return { ...replay, dispatch, stored, warnings };
}

it("ends a visible answer plus a successful rename in one model step", async () => {
  const { loop, replay, dispatch } = makeRenameReplay([
    { answer: "Hello!", args: rename },
  ]);
  await loop.run();
  expect(replay).toHaveBeenCalledTimes(1);
  expect(dispatch.mock.calls.map(([data]) => data)).toEqual([rename]);
});

it.each([
  {
    toolName: "rename-thread",
    input: { name: "sample-secret" },
    endloop: true,
  },
  {
    toolName: "rename-thread",
    input: { name: "sample-secret" },
    callbackMode: "endLoop",
  },
])(
  "keeps the rejected input through storage and retry without repeating the answer",
  async (badArgs) => {
    const { loop, replay, dispatch, stored, requestBodies, warnings } =
      makeRenameReplay([{ answer: "Hello!", args: badArgs }, { args: rename }]);
    await loop.run();
    expect(replay).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledTimes(1);
    const first = stored.mock.calls[0]?.[0].toolCall;
    expect(first?.args).toEqual(badArgs);
    expect(first?.error?.errorType).toMatchObject({
      errorCode: 400,
      errorKey: "errorTypes.validation_error",
    });
    const badKey = "endloop" in badArgs ? "endloop" : "name";
    expect(first?.error?.message).toContain(badKey);
    const { messages: secondPrompt } = z
      .object({ messages: z.array(z.json()) })
      .parse(JSON.parse(requestBodies[1] ?? "{}"));
    expect(JSON.stringify(secondPrompt)).toContain("sample-secret");
    expect(JSON.stringify(secondPrompt)).toContain("Unknown key");
    const warning = warnings.mock.calls.find(
      ([message]) => message === "[AI Stream] Invalid model tool arguments",
    );
    expect(warning?.[1]).toMatchObject({
      model: loop.p.model,
      toolName: "execute-tool",
      targetToolName: "rename-thread",
    });
    expect(JSON.stringify(warning)).not.toContain("sample-secret");
  },
);

it("preserves a target validation error and lets the model correct an endLoop call", async () => {
  const missingTitle = { toolName: "rename-thread", callbackMode: "endLoop" };
  const { loop, replay, dispatch, stored } = makeRenameReplay([
    { answer: "Hello!", args: missingTitle },
    { args: rename },
  ]);
  const handler = await getRouteHandler("rename-thread");
  const validation = await handler?.({
    data: {},
    urlPathParams: {},
    user: loop.p.user,
    platform: Platform.AI,
    locale,
    logger: loop.p.logger,
    toolExecutionContext: loop.p.toolExecutionContext,
  });
  expect(validation).toMatchObject({
    success: false,
    errorType: ErrorResponseTypes.VALIDATION_ERROR,
  });
  if (!validation || !("success" in validation) || validation.success) {
    return;
  }
  expect(validation.message).toContain(
    "{ title: string, description?: string }",
  );
  dispatch.mockResolvedValueOnce(validation);
  await loop.run();
  expect(replay).toHaveBeenCalledTimes(2);
  expect(dispatch.mock.calls[0]?.[0].input).toEqual({});
  expect(stored.mock.calls[0]?.[0].toolCall).toMatchObject({
    args: missingTitle,
    error: { errorType: ErrorResponseTypes.VALIDATION_ERROR },
  });
  expect(stored.mock.calls[0]?.[0].toolCall.args).toEqual(missingTitle);
});

it("asks for an answer once if the successful rename was preceded only by thinking", async () => {
  const { loop, replay, requestBodies } = makeRenameReplay([
    { answer: "<think>Pick a title.</think>", args: rename },
  ]);
  await loop.run();
  expect(replay).toHaveBeenCalledTimes(2);
  expect(requestBodies[1]).toContain("you have not written");
});

it("does not schedule a wall-clock turn timeout and still follows parent aborts", () => {
  const timeout = spyOn(AbortSignal, "timeout");
  const parent = new AbortController();
  const controller = stream.AbortControllerSetup.setupAbortController(
    parent.signal,
  );

  expect(timeout).not.toHaveBeenCalled();
  expect(controller.signal.aborted).toBe(false);
  const reason = new StreamAbortError(AbortReason.USER_CANCELLED);
  parent.abort(reason);
  expect(controller.signal.reason).toBe(reason);
  expect(
    stream.AbortControllerSetup.setupAbortController(parent.signal).signal
      .reason,
  ).toBe(reason);
});

it.each([undefined, 5])(
  "pauses after all %s configured tool rounds",
  async (turnStepLimit) => {
    const limit = turnStepLimit ?? DEFAULT_TURN_STEP_LIMIT;
    const { loop, replay, execute, notice, deduction, settled } = makeToolLoop({
      turnStepLimit,
      creditBalance: 100_000,
    });

    await loop.run();

    expect(replay).toHaveBeenCalledTimes(limit);
    expect(execute).toHaveBeenCalledTimes(limit);
    expect(notice).toHaveBeenCalledTimes(1);
    expect(notice).toHaveBeenCalledWith(
      expect.objectContaining({
        errorType: StreamErrorType.TURN_STEP_LIMIT,
        turnStepLimit: limit,
        content: t("info.turnStepLimit", { steps: limit.toString() }),
      }),
    );
    expect(deduction).toHaveBeenCalledTimes(1);
    expect(settled).toHaveBeenCalledTimes(1);
  },
);

it("pauses when the provider marks a tool round as stop", async () => {
  const { loop, replay, notice } = makeToolLoop({
    turnStepLimit: 5,
    creditBalance: 100_000,
    toolFinishReason: "stop",
  });

  await loop.run();

  expect(replay).toHaveBeenCalledTimes(5);
  expect(notice).toHaveBeenCalledWith(
    expect.objectContaining({ errorType: StreamErrorType.TURN_STEP_LIMIT }),
  );
});

it("finishes normally when the last allowed step is a final answer", async () => {
  const { loop, replay, execute, notice } = makeToolLoop({
    turnStepLimit: 5,
    creditBalance: 100_000,
    finalAnswerAfter: 5,
  });

  await loop.run();

  expect(replay).toHaveBeenCalledTimes(5);
  expect(execute).toHaveBeenCalledTimes(4);
  expect(notice).not.toHaveBeenCalled();
});

it.each([
  [ChatModelId.GROK_4_7, 3, 1],
  [ChatModelId.UNCENSORED_LM_V1_2, 7, 6.5],
] as const)(
  "settles completed usage before an unaffordable round on %s",
  async (model, creditBalance, modelCost) => {
    const { loop, replay, execute, notice, deduction, settled } = makeToolLoop({
      turnStepLimit: 5,
      creditBalance,
      model,
      modelCost,
    });

    await loop.run();

    expect(replay).toHaveBeenCalledTimes(1);
    expect(execute).toHaveBeenCalledTimes(1);
    expect(loop.p.ctx.creditBudgetStopped).toBe(true);
    expect(notice).toHaveBeenCalledTimes(1);
    expect(notice).toHaveBeenCalledWith(
      expect.objectContaining({ content: t("errors.insufficientCredits") }),
    );
    expect(deduction).toHaveBeenCalledTimes(1);
    const [charge] = deduction.mock.calls[0];
    expect(charge.amount).toBeGreaterThan(0);
    expect(charge.amount).toBeLessThanOrEqual(creditBalance);
    expect(settled).toHaveBeenCalledTimes(1);
  },
);

it("validates limits in settings and both relay modes", () => {
  const settings = settingsDefinition.POST.requestSchema;
  const executionContexts =
    streamDefinition.POST.requestSchema.shape.executionContext;
  expect(settings.safeParse({}).success).toBe(true);
  for (const turnStepLimit of [4, 5.5, 501]) {
    expect(settings.safeParse({ turnStepLimit }).success).toBe(false);
    expect(
      executionContexts.safeParse({
        mode: "relay",
        instanceId: "peer",
        threadMirrorMode: "off",
        turnStepLimit,
      }).success,
    ).toBe(false);
  }
  for (const turnStepLimit of [5, 500]) {
    expect(settings.parse({ turnStepLimit }).turnStepLimit).toBe(turnStepLimit);
    expect(
      executionContexts.parse({
        mode: "inference-provider",
        instanceId: "peer",
        turnStepLimit,
      }),
    ).toMatchObject({ turnStepLimit });
    expect(
      executionContexts.parse({
        mode: "relay",
        instanceId: "peer",
        threadMirrorMode: "off",
        turnStepLimit,
      }),
    ).toMatchObject({ turnStepLimit });
  }
});

it("carries the completed tool result into a typed continuation", async () => {
  const threadId = crypto.randomUUID();
  const toolId = crypto.randomUUID();
  const pauseId = crypto.randomUUID();
  const prompt = await toAiSdkMessages(
    [
      buildSseMessageRow({
        id: toolId,
        threadId,
        role: ChatMessageRole.TOOL,
        metadata: {
          toolCall: {
            toolCallId: "fixture-call",
            toolName: "fixture_tool",
            args: {},
            result: { checkpoint: "finished the first part" },
          },
        },
      }),
      buildSseMessageRow({
        id: pauseId,
        threadId,
        parentId: toolId,
        role: ChatMessageRole.ERROR,
        errorType: StreamErrorType.TURN_STEP_LIMIT,
        metadata: { turnStepLimit: 5 },
        content: t("info.turnStepLimit", { steps: "5" }),
      }),
      buildSseMessageRow({
        id: crypto.randomUUID(),
        threadId,
        parentId: pauseId,
        role: ChatMessageRole.USER,
        content: "continue",
      }),
    ],
    createEndpointLogger(false, locale),
    "UTC",
    DefaultFolderId.INCOGNITO,
    undefined,
    false,
    rootlessToolExecutionContext(),
  );

  expect(prompt.find((message) => message.role === "tool")).toMatchObject({
    content: [{ type: "tool-result", toolCallId: "fixture-call" }],
  });
  expect(JSON.stringify(prompt)).toContain("finished the first part");
  expect(prompt.at(-1)).toMatchObject({
    role: "user",
    content: [{ type: "text", text: "continue" }],
  });
});

it("preserves the pause count on valid history and tolerates malformed metadata", () => {
  expect(messageMetadataSchema.parse({ turnStepLimit: 75 }).turnStepLimit).toBe(
    75,
  );
  expect(
    messageMetadataSchema.parse({ turnStepLimit: "75" }).turnStepLimit,
  ).toBeUndefined();
});

it.each([
  ["en-US", "continue"],
  ["de-DE", "Mach weiter"],
  ["pl-PL", "Kontynuuj"],
  ["fr-FR", "Continue"],
  ["it-IT", "Continua"],
  ["es-ES", "Continúa"],
  ["sk-SK", "pokračuj"],
] as const)(
  "renders the pause and settings keys in %s",
  (language, continueWord) => {
    const { t: streamT } = scopedTranslation.scopedT(language);
    const { t: settingsT } = settingsTranslation.scopedT(language);
    const notice = streamT("info.turnStepLimit", { steps: "75" });
    expect(notice).toContain("75");
    expect(notice).toContain(continueWord);
    expect(notice).not.toContain("{{");
    expect(streamT("info.raiseTurnStepLimit")).not.toContain("info.");
    expect(settingsT("post.turnStepLimit.label")).not.toContain("post.");
    if (language !== locale) {
      expect(notice).not.toBe(t("info.turnStepLimit", { steps: "75" }));
      expect(streamT("info.raiseTurnStepLimit")).not.toBe(
        t("info.raiseTurnStepLimit"),
      );
    }
  },
);