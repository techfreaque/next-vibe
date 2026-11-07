/**
 * Static demo-chat message builders for the story pages.
 *
 * Tool calls are stored exactly like the AI stream stores them in
 * `ChatMessage.metadata.toolCall`: `toolName` is a registered alias and
 * `args`/`result` are the endpoint's request/response data. Both are typed
 * against the endpoint definition, so the real tool widget renders populated
 * and any schema drift breaks the build instead of the demo.
 */

import { ChatModelId } from "next-vibe/agent/ai-stream/models";
import type { ChatMessage, ToolCall } from "next-vibe/agent/chat/db";
import { ChatMessageRole } from "next-vibe/agent/chat/enum";
import type { WidgetData } from "next-vibe/core/utils/json";
import { WidgetDataSchema } from "next-vibe/core/utils/json";
import {
  CallbackMode,
  EXECUTE_TOOL_ALIAS,
} from "next-vibe/execute-tool/constants";
import type executeToolDefinitions from "next-vibe/execute-tool/definition";

import type { pathToAliasMap } from "@/generated/endpoints/alias-map";

/** Any name the tool-call renderer can resolve to a registered endpoint. */
export type RegisteredToolName = keyof typeof pathToAliasMap;

/** Structural slice of an endpoint definition: its request/response data types. */
interface DemoToolEndpoint {
  readonly types: {
    readonly RequestOutput: WidgetData;
    readonly ResponseOutput: WidgetData;
  };
}

type ExecuteToolEndpoint = typeof executeToolDefinitions.POST;

interface DemoMsgBase {
  id: string;
  threadId: string;
  sequenceId: string;
}

export function baseMockMsg(overrides: {
  id: string;
  threadId: string;
  role: ChatMessage["role"];
  content: string | null;
  parentId: string | null;
  depth: number;
  sequenceId: string | null;
  isAI: boolean;
  model: ChatMessage["model"];
  metadata: ChatMessage["metadata"];
}): ChatMessage {
  const now = new Date();
  return {
    authorId: null,
    authorName: null,
    skill: null,
    errorType: null,
    errorMessage: null,
    errorCode: null,
    upvotes: 0,
    downvotes: 0,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function mkUserMsg(params: {
  id: string;
  threadId: string;
  content: string;
}): ChatMessage {
  return baseMockMsg({
    ...params,
    role: ChatMessageRole.USER,
    parentId: null,
    depth: 0,
    sequenceId: null,
    isAI: false,
    model: null,
    metadata: {},
  });
}

export function mkAssistantMsg(
  id: string,
  threadId: string,
  sequenceId: string,
  content: string,
  extra?: Partial<ChatMessage["metadata"]> & { model?: ChatMessage["model"] },
): ChatMessage {
  const { model: modelOverride, ...metaExtra } = extra ?? {};
  return baseMockMsg({
    id,
    threadId,
    role: ChatMessageRole.ASSISTANT,
    content,
    parentId: "user",
    depth: 1,
    sequenceId,
    isAI: true,
    model: modelOverride ?? ChatModelId.CLAUDE_OPUS_5_5,
    metadata: { ...metaExtra },
  });
}

/**
 * Tool-call payloads live in a JSONB column: Dates become ISO strings and
 * undefined keys vanish. Round-trip demo payloads the same way so widgets get
 * exactly the shape they get from a real thread.
 */
function asStored(value: WidgetData): WidgetData {
  const parsed = WidgetDataSchema.safeParse(JSON.parse(JSON.stringify(value)));
  return parsed.success ? parsed.data : value;
}

function mkRawToolMsg(
  base: DemoMsgBase,
  toolCall: {
    toolCallId: string;
    toolName: RegisteredToolName;
    args: WidgetData;
    result: WidgetData;
    executionTime: number;
    callbackMode?: ToolCall["callbackMode"];
  },
): ChatMessage {
  return baseMockMsg({
    id: base.id,
    threadId: base.threadId,
    role: ChatMessageRole.TOOL,
    content: null,
    parentId: "user",
    depth: 1,
    sequenceId: base.sequenceId,
    isAI: true,
    model: ChatModelId.CLAUDE_OPUS_5_5,
    metadata: {
      toolCall: {
        ...toolCall,
        args: asStored(toolCall.args),
        result: asStored(toolCall.result),
        status: "completed",
      },
    },
  });
}

/**
 * A direct (pinned) tool call: `toolName` is the endpoint alias,
 * args/result typed against `TEndpoint`'s request/response schema.
 */
export function mkDemoToolMsg<TEndpoint extends DemoToolEndpoint>(
  params: DemoMsgBase & {
    toolCallId: string;
    toolName: RegisteredToolName;
    args: TEndpoint["types"]["RequestOutput"];
    result: TEndpoint["types"]["ResponseOutput"];
    executionTime: number;
  },
): ChatMessage {
  const { id, threadId, sequenceId, ...toolCall } = params;
  return mkRawToolMsg({ id, threadId, sequenceId }, toolCall);
}

/**
 * A tool reached through `execute-tool` (non-pinned tools): stored as
 * `toolName: "execute-tool"`, `args: { toolName, input }`, `result: { result }`
 * — the renderer unwraps it and shows `TInner`'s widget.
 */
export function mkDemoExecuteToolMsg<TInner extends DemoToolEndpoint>(
  params: DemoMsgBase & {
    toolCallId: string;
    innerToolName: RegisteredToolName;
    input: TInner["types"]["RequestOutput"] & { [key: string]: WidgetData };
    result: TInner["types"]["ResponseOutput"];
    executionTime: number;
  },
): ChatMessage {
  const args: ExecuteToolEndpoint["types"]["RequestOutput"] = {
    toolName: params.innerToolName,
    input: params.input,
    callbackMode: CallbackMode.WAIT,
  };
  const result: ExecuteToolEndpoint["types"]["ResponseOutput"] = {
    result: params.result,
  };
  return mkRawToolMsg(
    {
      id: params.id,
      threadId: params.threadId,
      sequenceId: params.sequenceId,
    },
    {
      toolCallId: params.toolCallId,
      toolName: EXECUTE_TOOL_ALIAS,
      args,
      result,
      executionTime: params.executionTime,
      callbackMode: CallbackMode.WAIT,
    },
  );
}
