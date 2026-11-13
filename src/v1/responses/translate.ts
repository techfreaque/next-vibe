/**
 * OpenAI Responses API <-> shared /v1 execution. Pure translation, no I/O:
 * request -> model messages + tools, result -> Response object, neutral stream
 * events -> Responses SSE (the event sequence Codex CLI consumes).
 */

import type { ModelMessage } from "ai";

import type {
  V1ContentEvent,
  V1StreamEncoder,
  V1Totals,
} from "../shared/execution";
import { estimateTokens } from "../shared/tokens";
import type {
  InferenceOutputPart,
  InferenceTool,
  InferenceToolChoice,
  JsonValue,
  OpenAiFinishReason,
  ReasoningReplay,
} from "../shared/inference";
import {
  imagePartFromUrl,
  orderToolResults,
  parseArgumentsLenient,
  pushAssistantPart,
  pushSystemText,
  pushToolResult,
  pushUserParts,
  reasoningPart,
  toolOutput,
  type UserPart,
} from "../shared/model-messages";
import {
  decodeReasoningReplay,
  encodeReasoningReplay,
} from "../shared/reasoning-replay";
import type {
  ResponsesInputItem,
  ResponsesReasoningItem,
  ResponsesTool,
  ResponsesToolChoice,
  ResponsesToolOutput,
  V1ResponsesPostRequestOutput,
} from "./definition";

/** How a declared tool maps back to a Responses output item. */
export type ResponsesToolKind = "function" | "custom" | "local_shell";

export const LOCAL_SHELL_TOOL_NAME = "local_shell";

export interface ResponsesToolSet {
  tools: InferenceTool[];
  kinds: Map<string, ResponsesToolKind>;
}

/** Function, custom (freeform) and local_shell tools; hosted tools are skipped. */
export function convertResponsesTools(
  tools: ResponsesTool[] | null | undefined,
): ResponsesToolSet {
  const out: InferenceTool[] = [];
  const kinds = new Map<string, ResponsesToolKind>();
  for (const spec of tools ?? []) {
    if (spec.type === "function" && "name" in spec) {
      out.push({
        name: spec.name,
        description: spec.description ?? undefined,
        parameters: spec.parameters ?? undefined,
      });
      kinds.set(spec.name, "function");
    } else if (spec.type === "custom" && "name" in spec) {
      const format =
        "format" in spec && spec.format?.definition
          ? `\n\nThe "input" string must follow this ${spec.format.syntax ?? ""} grammar:\n${spec.format.definition}`
          : "";
      out.push({
        name: spec.name,
        description:
          `${spec.description ?? ""}\n\nPass the raw tool input as the "input" string.${format}`.trim(),
        parameters: {
          type: "object",
          properties: {
            input: { type: "string", description: "Raw tool input" },
          },
          required: ["input"],
        },
      });
      kinds.set(spec.name, "custom");
    } else if (spec.type === "local_shell") {
      out.push({
        name: LOCAL_SHELL_TOOL_NAME,
        description:
          'Run a command in the user\'s local shell and get its output. command is the argv array, e.g. ["bash", "-lc", "ls -la"].',
        parameters: {
          type: "object",
          properties: {
            command: { type: "array", items: { type: "string" } },
            workdir: { type: "string" },
            timeout_ms: { type: "number" },
          },
          required: ["command"],
        },
      });
      kinds.set(LOCAL_SHELL_TOOL_NAME, "local_shell");
    }
  }
  return { tools: out, kinds };
}

export function convertResponsesToolChoice(
  choice: ResponsesToolChoice | null | undefined,
): InferenceToolChoice | undefined {
  if (choice === null || choice === undefined) {
    return undefined;
  }
  if (typeof choice === "string") {
    return choice;
  }
  if (
    (choice.type === "function" || choice.type === "custom") &&
    "name" in choice
  ) {
    return { toolName: choice.name };
  }
  if (choice.type === "local_shell") {
    return { toolName: LOCAL_SHELL_TOOL_NAME };
  }
  // allowed_tools / hosted tool choices: let the model decide.
  return "auto";
}

function outputPieces(
  output: ResponsesToolOutput,
): Array<{ text: string } | { imageUrl: string }> {
  if (typeof output === "string") {
    return [{ text: output }];
  }
  const pieces: Array<{ text: string } | { imageUrl: string }> = [];
  for (const part of output) {
    if ("text" in part) {
      pieces.push({ text: part.text });
    } else if ("image_url" in part && part.image_url) {
      pieces.push({ imageUrl: part.image_url });
    }
  }
  return pieces;
}

function piecesChars(pieces: Array<{ text: string } | { imageUrl: string }>): {
  chars: number;
  images: number;
} {
  let chars = 0;
  let images = 0;
  for (const piece of pieces) {
    if ("text" in piece) {
      chars += piece.text.length;
    } else {
      images += 1;
    }
  }
  return { chars, images };
}

function isReasoningItem(
  item: ResponsesInputItem,
): item is ResponsesReasoningItem {
  return "type" in item && item.type === "reasoning";
}

export type ConvertedInput =
  | { ok: true; messages: ModelMessage[]; estimatedInputTokens: number }
  | { ok: false; param: string };

/** instructions + input items -> model messages (stateless, full history). */
export function convertResponsesInput(
  data: Pick<V1ResponsesPostRequestOutput, "input" | "instructions" | "text">,
): ConvertedInput {
  const out: ModelMessage[] = [];
  let chars = 0;
  let images = 0;
  const toolNames = new Map<string, string>();

  if (data.instructions) {
    chars += data.instructions.length;
    pushSystemText(out, data.instructions);
  }
  const format = data.text?.format;
  if (format?.type === "json_schema" && format.schema) {
    const schemaText = `Answer with a single JSON value only (no prose, no code fence) that matches this JSON Schema${format.name ? ` "${format.name}"` : ""}:\n${JSON.stringify(format.schema)}`;
    chars += schemaText.length;
    pushSystemText(out, schemaText);
  } else if (format?.type === "json_object") {
    pushSystemText(out, "Answer with a single JSON object only.");
  }

  const items: ResponsesInputItem[] =
    typeof data.input === "string"
      ? [{ role: "user", content: data.input }]
      : data.input;

  for (const [index, item] of items.entries()) {
    if ("role" in item) {
      const parts =
        typeof item.content === "string"
          ? [{ type: "input_text" as const, text: item.content }]
          : item.content;
      if (item.role === "system" || item.role === "developer") {
        const text = parts.map((p) => ("text" in p ? p.text : "")).join("\n");
        chars += text.length;
        pushSystemText(out, text);
        continue;
      }
      if (item.role === "assistant") {
        for (const part of parts) {
          const text =
            "text" in part ? part.text : "refusal" in part ? part.refusal : "";
          if (text) {
            chars += text.length;
            pushAssistantPart(out, { type: "text", text });
          }
        }
        continue;
      }
      const userParts: UserPart[] = [];
      for (const part of parts) {
        if ("text" in part) {
          chars += part.text.length;
          userParts.push({ type: "text", text: part.text });
        } else if ("image_url" in part && part.image_url) {
          const image = imagePartFromUrl(part.image_url);
          if (!image) {
            return { ok: false, param: `input[${index}].content` };
          }
          images += 1;
          userParts.push(image);
        }
      }
      pushUserParts(out, userParts);
      continue;
    }

    if (item.type === "function_call" && "arguments" in item) {
      toolNames.set(item.call_id, item.name);
      chars += item.name.length + item.arguments.length;
      pushAssistantPart(out, {
        type: "tool-call",
        toolCallId: item.call_id,
        toolName: item.name,
        input: parseArgumentsLenient(item.arguments),
      });
    } else if (item.type === "custom_tool_call" && "input" in item) {
      toolNames.set(item.call_id, item.name);
      chars += item.name.length + item.input.length;
      pushAssistantPart(out, {
        type: "tool-call",
        toolCallId: item.call_id,
        toolName: item.name,
        input: { input: item.input },
      });
    } else if (item.type === "local_shell_call" && "action" in item) {
      const callId = item.call_id ?? item.id;
      if (!callId) {
        return { ok: false, param: `input[${index}].call_id` };
      }
      toolNames.set(callId, LOCAL_SHELL_TOOL_NAME);
      const input: Record<string, JsonValue> = { command: item.action.command };
      if (item.action.working_directory) {
        input["workdir"] = item.action.working_directory;
      }
      if (item.action.timeout_ms) {
        input["timeout_ms"] = item.action.timeout_ms;
      }
      chars += JSON.stringify(input).length;
      pushAssistantPart(out, {
        type: "tool-call",
        toolCallId: callId,
        toolName: LOCAL_SHELL_TOOL_NAME,
        input,
      });
    } else if (
      (item.type === "function_call_output" ||
        item.type === "custom_tool_call_output" ||
        item.type === "local_shell_call_output") &&
      "output" in item
    ) {
      const callId =
        "call_id" in item && item.call_id
          ? item.call_id
          : "id" in item && item.id
            ? item.id
            : undefined;
      if (!callId) {
        return { ok: false, param: `input[${index}].call_id` };
      }
      const pieces = outputPieces(item.output);
      const counted = piecesChars(pieces);
      chars += counted.chars;
      images += counted.images;
      pushToolResult(out, {
        type: "tool-result",
        toolCallId: callId,
        toolName: toolNames.get(callId) ?? "tool",
        output: toolOutput(pieces, false),
      });
    } else if (isReasoningItem(item)) {
      const decoded = decodeReasoningReplay(item.encrypted_content);
      const text =
        decoded?.text ??
        [...(item.content ?? []), ...(item.summary ?? [])]
          .map((p) => ("text" in p ? p.text : ""))
          .filter(Boolean)
          .join("\n\n");
      if (text || decoded?.replay) {
        chars += text.length;
        pushAssistantPart(out, reasoningPart(text, decoded?.replay));
      }
    }
    // Any other item type (web_search_call, compaction, ...) carries nothing
    // a non-OpenAI model can use: skipped.
  }

  return {
    ok: true,
    messages: orderToolResults(out),
    estimatedInputTokens: estimateTokens(chars, images),
  };
}

// ---------------------------------------------------------------- output

function hexId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().replaceAll("-", "")}`;
}

export function newResponseId(): string {
  return hexId("resp");
}

// eslint-disable-next-line typescript/consistent-type-definitions, @typescript-eslint/consistent-type-definitions -- Must be a type alias: only aliases get the implicit index signature that makes it assignable to WidgetData.
export type ResponsesOutputItem = {
  [key: string]: JsonValue;
};

function messageItem(
  id: string,
  text: string,
  status: string,
): ResponsesOutputItem {
  return {
    id,
    type: "message",
    status,
    role: "assistant",
    content:
      status === "in_progress"
        ? []
        : [{ type: "output_text", text, annotations: [], logprobs: [] }],
  };
}

function reasoningItem(
  id: string,
  text: string,
  replay: ReasoningReplay | undefined,
): ResponsesOutputItem {
  return {
    id,
    type: "reasoning",
    summary: text ? [{ type: "summary_text", text }] : [],
    encrypted_content: encodeReasoningReplay(text, replay),
  };
}

/** A finished model tool call as the Responses item its tool kind expects. */
export function toolCallItem(
  itemId: string,
  callId: string,
  name: string,
  args: string,
  kind: ResponsesToolKind,
): ResponsesOutputItem {
  if (kind === "custom") {
    const parsed = parseArgumentsLenient(args);
    const input =
      typeof parsed === "object" &&
      parsed !== null &&
      !Array.isArray(parsed) &&
      typeof parsed["input"] === "string"
        ? parsed["input"]
        : typeof parsed === "string"
          ? parsed
          : args;
    return {
      id: itemId,
      type: "custom_tool_call",
      status: "completed",
      call_id: callId,
      name,
      input,
    };
  }
  if (kind === "local_shell") {
    const parsed = parseArgumentsLenient(args);
    const fields =
      typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)
        ? parsed
        : {};
    const rawCommand = fields["command"];
    const command = Array.isArray(rawCommand)
      ? rawCommand.map((part) => String(part))
      : typeof rawCommand === "string"
        ? ["bash", "-lc", rawCommand]
        : [];
    const workdir = fields["workdir"];
    const timeout = fields["timeout_ms"];
    return {
      id: itemId,
      type: "local_shell_call",
      status: "completed",
      call_id: callId,
      action: {
        type: "exec",
        command,
        timeout_ms: typeof timeout === "number" ? timeout : null,
        working_directory: typeof workdir === "string" ? workdir : null,
        env: {},
        user: null,
      },
    };
  }
  return {
    id: itemId,
    type: "function_call",
    status: "completed",
    call_id: callId,
    name,
    arguments: args === "" ? "{}" : args,
  };
}

function itemIdPrefix(kind: ResponsesToolKind): string {
  return kind === "custom" ? "ctc" : kind === "local_shell" ? "lsh" : "fc";
}

export function responsesUsage(totals: V1Totals): ResponsesOutputItem {
  return {
    input_tokens: totals.inputTokens,
    input_tokens_details: { cached_tokens: totals.cachedInputTokens },
    output_tokens: totals.outputTokens,
    output_tokens_details: { reasoning_tokens: totals.reasoningTokens },
    total_tokens: totals.inputTokens + totals.outputTokens,
    credits_charged: totals.credits,
  };
}

/** Request settings echoed on every Response object. */
export interface ResponseEcho {
  id: string;
  createdAt: number;
  model: string;
  instructions: string | null;
  toolChoice: JsonValue;
  tools: JsonValue;
  parallelToolCalls: boolean;
  temperature: number | null;
  topP: number | null;
  maxOutputTokens: number | null;
  reasoning: JsonValue;
  store: boolean;
}

export function responseObject(
  echo: ResponseEcho,
  status: "in_progress" | "completed" | "incomplete" | "failed",
  output: ResponsesOutputItem[],
  extra: {
    usage?: ResponsesOutputItem;
    error?: { code: string; message: string };
  } = {},
): ResponsesOutputItem {
  return {
    id: echo.id,
    object: "response",
    created_at: echo.createdAt,
    status,
    background: false,
    error: extra.error ?? null,
    incomplete_details:
      status === "incomplete" ? { reason: "max_output_tokens" } : null,
    instructions: echo.instructions,
    max_output_tokens: echo.maxOutputTokens,
    model: echo.model,
    output,
    parallel_tool_calls: echo.parallelToolCalls,
    previous_response_id: null,
    reasoning: echo.reasoning,
    store: echo.store,
    temperature: echo.temperature,
    text: { format: { type: "text" } },
    tool_choice: echo.toolChoice,
    tools: echo.tools,
    top_p: echo.topP,
    truncation: "disabled",
    usage: extra.usage ?? null,
    metadata: {},
  };
}

/** Output items of a finished non-streaming run, in model order. */
export function outputItemsFromParts(
  parts: InferenceOutputPart[],
  kinds: Map<string, ResponsesToolKind>,
): ResponsesOutputItem[] {
  const items: ResponsesOutputItem[] = [];
  for (const part of parts) {
    if (part.type === "text") {
      items.push(messageItem(hexId("msg"), part.text, "completed"));
    } else if (part.type === "reasoning") {
      items.push(reasoningItem(hexId("rs"), part.text, part.replay));
    } else {
      const kind = kinds.get(part.name) ?? "function";
      items.push(
        toolCallItem(
          hexId(itemIdPrefix(kind)),
          part.id,
          part.name,
          part.arguments,
          kind,
        ),
      );
    }
  }
  return items;
}

export function finalStatus(
  finishReason: OpenAiFinishReason,
): "completed" | "incomplete" {
  return finishReason === "length" ? "incomplete" : "completed";
}

interface OpenBlock {
  kind: "text" | "reasoning";
  id: string;
  index: number;
  text: string;
}

interface OpenCall {
  itemId: string;
  index: number;
  callId: string;
  name: string;
  kind: ResponsesToolKind;
  args: string;
}

/**
 * Responses SSE: response.created -> per item output_item.added / deltas /
 * output_item.done -> response.completed (or .incomplete / .failed). Every
 * event carries type + sequence_number, as the OpenAI SDKs expect.
 */
export function responsesStreamEncoder(
  echo: ResponseEcho,
  kinds: Map<string, ResponsesToolKind>,
): V1StreamEncoder {
  let sequence = 0;
  let nextIndex = 0;
  let open: OpenBlock | undefined;
  const calls = new Map<string, OpenCall>();
  const done = new Map<number, ResponsesOutputItem>();

  const emit = (type: string, payload: ResponsesOutputItem): string =>
    `event: ${type}\ndata: ${JSON.stringify({ type, sequence_number: sequence++, ...payload })}\n\n`;

  const outputSoFar = (): ResponsesOutputItem[] =>
    [...done.entries()].toSorted((a, b) => a[0] - b[0]).map(([, item]) => item);

  const closeOpen = (replay?: ReasoningReplay): string => {
    if (!open) {
      return "";
    }
    const block = open;
    open = undefined;
    if (block.kind === "text") {
      const item = messageItem(block.id, block.text, "completed");
      done.set(block.index, item);
      return (
        emit("response.output_text.done", {
          item_id: block.id,
          output_index: block.index,
          content_index: 0,
          text: block.text,
          logprobs: [],
        }) +
        emit("response.content_part.done", {
          item_id: block.id,
          output_index: block.index,
          content_index: 0,
          part: { type: "output_text", text: block.text, annotations: [] },
        }) +
        emit("response.output_item.done", {
          output_index: block.index,
          item,
        })
      );
    }
    const item = reasoningItem(block.id, block.text, replay);
    done.set(block.index, item);
    return (
      emit("response.reasoning_summary_text.done", {
        item_id: block.id,
        output_index: block.index,
        summary_index: 0,
        text: block.text,
      }) +
      emit("response.reasoning_summary_part.done", {
        item_id: block.id,
        output_index: block.index,
        summary_index: 0,
        part: { type: "summary_text", text: block.text },
      }) +
      emit("response.output_item.done", { output_index: block.index, item })
    );
  };

  const openBlock = (kind: "text" | "reasoning"): string => {
    const id = hexId(kind === "text" ? "msg" : "rs");
    const index = nextIndex++;
    open = { kind, id, index, text: "" };
    if (kind === "text") {
      return (
        emit("response.output_item.added", {
          output_index: index,
          item: messageItem(id, "", "in_progress"),
        }) +
        emit("response.content_part.added", {
          item_id: id,
          output_index: index,
          content_index: 0,
          part: { type: "output_text", text: "", annotations: [] },
        })
      );
    }
    return (
      emit("response.output_item.added", {
        output_index: index,
        item: { id, type: "reasoning", summary: [] },
      }) +
      emit("response.reasoning_summary_part.added", {
        item_id: id,
        output_index: index,
        summary_index: 0,
        part: { type: "summary_text", text: "" },
      })
    );
  };

  const closeCall = (call: OpenCall): string => {
    calls.delete(call.callId);
    const item = toolCallItem(
      call.itemId,
      call.callId,
      call.name,
      call.args,
      call.kind,
    );
    done.set(call.index, item);
    if (call.kind === "function") {
      return (
        emit("response.function_call_arguments.done", {
          item_id: call.itemId,
          output_index: call.index,
          arguments: item["arguments"] ?? call.args,
        }) +
        emit("response.output_item.done", { output_index: call.index, item })
      );
    }
    // custom / local_shell items are announced whole, once their input is complete
    return (
      emit("response.output_item.added", { output_index: call.index, item }) +
      emit("response.output_item.done", { output_index: call.index, item })
    );
  };

  const closeAll = (): string => {
    let out = closeOpen();
    for (const call of calls.values()) {
      out += closeCall(call);
    }
    return out;
  };

  const handle = (event: V1ContentEvent): string => {
    if (event.type === "text" || event.type === "reasoning") {
      let out = "";
      if (open?.kind !== (event.type === "text" ? "text" : "reasoning")) {
        out +=
          closeOpen() + openBlock(event.type === "text" ? "text" : "reasoning");
      }
      const block = open;
      if (!block) {
        return out;
      }
      block.text += event.text;
      return (
        out +
        (block.kind === "text"
          ? emit("response.output_text.delta", {
              item_id: block.id,
              output_index: block.index,
              content_index: 0,
              delta: event.text,
              logprobs: [],
            })
          : emit("response.reasoning_summary_text.delta", {
              item_id: block.id,
              output_index: block.index,
              summary_index: 0,
              delta: event.text,
            }))
      );
    }
    if (event.type === "reasoning-end") {
      return open?.kind === "reasoning" ? closeOpen(event.replay) : "";
    }
    if (event.type === "tool-call-start") {
      const out = closeOpen();
      const kind = kinds.get(event.name) ?? "function";
      const call: OpenCall = {
        itemId: hexId(itemIdPrefix(kind)),
        index: nextIndex++,
        callId: event.id,
        name: event.name,
        kind,
        args: "",
      };
      calls.set(event.id, call);
      return kind === "function"
        ? out +
            emit("response.output_item.added", {
              output_index: call.index,
              item: {
                id: call.itemId,
                type: "function_call",
                status: "in_progress",
                call_id: call.callId,
                name: call.name,
                arguments: "",
              },
            })
        : out;
    }
    if (event.type === "tool-call-delta") {
      const call = calls.get(event.id);
      if (!call) {
        return "";
      }
      call.args += event.argumentsDelta;
      return call.kind === "function"
        ? emit("response.function_call_arguments.delta", {
            item_id: call.itemId,
            output_index: call.index,
            delta: event.argumentsDelta,
          })
        : "";
    }
    const call = calls.get(event.id);
    return call ? closeCall(call) : "";
  };

  return {
    start: () => {
      const initial = responseObject(echo, "in_progress", []);
      return (
        emit("response.created", { response: initial }) +
        emit("response.in_progress", { response: initial })
      );
    },
    event: handle,
    finish: (finishReason, totals) => {
      const out = closeAll();
      const status = finalStatus(finishReason);
      return (
        out +
        emit(
          status === "completed" ? "response.completed" : "response.incomplete",
          {
            response: responseObject(echo, status, outputSoFar(), {
              usage: responsesUsage(totals),
            }),
          },
        )
      );
    },
    fail: (message, totals) => {
      const out = closeAll();
      return (
        out +
        emit("response.failed", {
          response: responseObject(echo, "failed", outputSoFar(), {
            usage: responsesUsage(totals),
            error: { code: "server_error", message },
          }),
        })
      );
    },
    heartbeat: () =>
      emit("response.in_progress", {
        response: responseObject(echo, "in_progress", []),
      }),
  };
}
