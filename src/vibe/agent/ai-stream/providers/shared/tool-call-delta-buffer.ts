/**
 * Streamed tool-call buffer (fetch layer, OpenAI-style SSE).
 *
 * The AI SDK chat providers (OpenRouter, OpenAI-compatible) finalize a tool
 * call the moment its accumulated `arguments` string parses as JSON, and
 * ignore every later delta for that call. Prod 2026-11-26/27: Kimi K3 on the
 * Wafer host (OpenRouter) produced 120+ calls whose recorded arguments were
 * exactly `{"toolName": "<tool>"}`, the nested `input` missing, across
 * rename-thread, cortex-write, cortex-read, cortex-search and web-search.
 * A host that sends a complete JSON object first and the rest afterwards
 * (a prematurely closed object, or the whole call repeated) loses the real
 * arguments that way.
 *
 * This transform holds every `tool_calls` delta back and emits each call
 * ONCE, with its complete accumulated arguments, right before the chunk that
 * carries the finish reason (or at the end of the stream). Text, reasoning,
 * usage and finish chunks pass through unchanged. Nothing in the app streams
 * partial tool input, so holding the deltas costs no visible latency.
 *
 * On the way it:
 *   - repairs a prematurely closed object (`{"a":1}, "b":2}`) and a repeated
 *     object (`{...}{...}`), logging which repair was applied,
 *   - drops a call that never got a function name (the SDK throws
 *     "Expected 'function.name' to be a string." and the whole turn fails),
 *     logging its argument keys,
 *   - records per-call wire evidence (delta count, where the arguments first
 *     parsed, final size, repair) that the chat loop attaches to an
 *     "Invalid model tool arguments" log for the same call id,
 *   - optionally re-sends the request ONCE when the upstream ends the stream
 *     with a "malformed tool call" error part (NanoGPT: "Partial response
 *     received, but the final tool call was malformed and was not
 *     executed."). Held tool deltas make that safe: the SDK never saw the
 *     broken call. Visible text already forwarded is replaced through the
 *     in-band replace marker the chat loop consumes.
 */

import "server-only";

import type { JSONValue } from "ai";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import { providerErrorTranslationKey } from "../../repository/errors/provider-error-key";
import {
  GARBLED_RETRY_MARKER_KEY,
  MALFORMED_TOOL_CALL_RETRY_RULE,
  PROVIDER_BUSY_RETRY_RULE,
  UPSTREAM_BODY_READ_RETRY_RULE,
} from "../openrouter/garbled-guard";

/** Pause before re-sending an attempt the upstream reported busy. */
export const BUSY_RETRY_DELAY_MS = 1500;

/** Wire facts about one streamed tool call (no argument content). */
export interface ToolCallWireEvidence {
  readonly provider: string;
  readonly host: string | null;
  readonly deltaCount: number;
  /** Length at which the accumulated arguments first parsed as JSON. */
  readonly firstParsableChars: number | null;
  readonly finalChars: number;
  readonly repair:
    | "none"
    | "premature-close"
    | "repeated-object"
    | "unparsable"
    | "empty";
}

const MAX_EVIDENCE_ENTRIES = 500;
const wireEvidence = new Map<string, ToolCallWireEvidence>();

function rememberEvidence(id: string, evidence: ToolCallWireEvidence): void {
  wireEvidence.delete(id);
  wireEvidence.set(id, evidence);
  while (wireEvidence.size > MAX_EVIDENCE_ENTRIES) {
    const oldest = wireEvidence.keys().next().value;
    if (oldest === undefined) {
      break;
    }
    wireEvidence.delete(oldest);
  }
}

/** Wire evidence for a provider tool-call id (consumed on read). */
export function takeToolCallWireEvidence(
  toolCallId: string,
): ToolCallWireEvidence | undefined {
  const evidence = wireEvidence.get(toolCallId);
  if (evidence) {
    wireEvidence.delete(toolCallId);
  }
  return evidence;
}

const toolCallDeltaSchema = z.looseObject({
  index: z.number().nullish(),
  id: z.string().nullish(),
  type: z.string().nullish(),
  function: z
    .looseObject({
      name: z.string().nullish(),
      arguments: z.string().nullish(),
    })
    .nullish(),
});

const chunkSchema = z.looseObject({
  id: z.string().nullish(),
  object: z.string().nullish(),
  created: z.number().nullish(),
  model: z.string().nullish(),
  provider: z.string().nullish(),
  error: z.looseObject({ message: z.string().nullish() }).nullish(),
  choices: z
    .array(
      z.looseObject({
        index: z.number().nullish(),
        finish_reason: z.string().nullish(),
        delta: z
          .looseObject({
            content: z.string().nullish(),
            reasoning: z.string().nullish(),
            reasoning_content: z.string().nullish(),
            tool_calls: z.array(toolCallDeltaSchema).nullish(),
          })
          .nullish(),
      }),
    )
    .nullish(),
});

type Chunk = z.infer<typeof chunkSchema>;
type ToolCallDelta = z.infer<typeof toolCallDeltaSchema>;

interface PendingCall {
  index: number;
  id: string | null;
  name: string | null;
  arguments: string;
  deltaCount: number;
  firstParsableChars: number | null;
  /** Provider extras on the first delta (e.g. Gemini thought signatures). */
  extra: { [key: string]: JSONValue };
}

function parsesAsJson(text: string): boolean {
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
}

function topLevelKeyCount(text: string): number {
  const parsed = z.record(z.string(), z.json()).safeParse(JSON.parse(text));
  return parsed.success ? Object.keys(parsed.data).length : 0;
}

const MAX_SPLIT_CANDIDATES = 64;

/**
 * Repair arguments that are not one JSON value. Only two shapes are touched,
 * both seen from streaming hosts: an object closed too early whose remaining
 * members follow (`{"a":1}, "b":{...}}`), and a complete object followed by
 * another complete object (the call sent twice). Anything else is returned
 * unchanged and reported as unparsable.
 */
export function repairToolArguments(raw: string): {
  text: string;
  repair: ToolCallWireEvidence["repair"];
} {
  const trimmed = raw.trim();
  if (trimmed === "") {
    return { text: raw, repair: "empty" };
  }
  if (parsesAsJson(trimmed)) {
    return { text: raw, repair: "none" };
  }
  let candidates = 0;
  for (
    let at = trimmed.indexOf("}");
    at >= 0;
    at = trimmed.indexOf("}", at + 1)
  ) {
    candidates += 1;
    if (candidates > MAX_SPLIT_CANDIDATES) {
      break;
    }
    const head = trimmed.slice(0, at + 1);
    if (!head.startsWith("{") || !parsesAsJson(head)) {
      continue;
    }
    const rest = trimmed.slice(at + 1).trimStart();
    if (rest.startsWith(",")) {
      const joined = `${trimmed.slice(0, at)}${rest}`;
      if (parsesAsJson(joined)) {
        return { text: joined, repair: "premature-close" };
      }
    }
    if (rest.startsWith("{")) {
      const tail = repairToolArguments(rest);
      if (tail.repair === "none" || tail.repair === "repeated-object") {
        const best =
          topLevelKeyCount(tail.text) >= topLevelKeyCount(head)
            ? tail.text
            : head;
        return { text: best, repair: "repeated-object" };
      }
    }
  }
  return { text: raw, repair: "unparsable" };
}

interface SseEvent {
  readonly raw: string;
  /** JSON payload of the event's data line, when it parsed. */
  readonly chunk: Chunk | null;
  readonly done: boolean;
}

function parseEvent(raw: string): SseEvent {
  const dataLines = raw
    .split(/\r?\n/)
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trimStart());
  if (dataLines.length !== 1) {
    return { raw, chunk: null, done: false };
  }
  const data = dataLines[0] ?? "";
  if (data === "[DONE]") {
    return { raw, chunk: null, done: true };
  }
  try {
    const parsed = chunkSchema.safeParse(JSON.parse(data));
    return { raw, chunk: parsed.success ? parsed.data : null, done: false };
  } catch {
    return { raw, chunk: null, done: false };
  }
}

async function* readSseEvents(
  body: ReadableStream<Uint8Array>,
): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      buffer += decoder.decode(value, { stream: true });
      let boundary = /\r?\n\r?\n/.exec(buffer);
      while (boundary) {
        const end = boundary.index + boundary[0].length;
        yield buffer.slice(0, end);
        buffer = buffer.slice(end);
        boundary = /\r?\n\r?\n/.exec(buffer);
      }
    }
    buffer += decoder.decode();
    if (buffer.trim() !== "") {
      yield buffer;
    }
  } finally {
    reader.cancel().catch(() => undefined);
  }
}

function sseData(
  payload: Chunk | { [key: string]: JSONValue | undefined },
): string {
  return `data: ${JSON.stringify(payload)}\n\n`;
}

export interface ToolCallBufferOptions {
  /** Provider label for logs and evidence ("openrouter", "nano-gpt"). */
  readonly provider: string;
  readonly logger: EndpointLogger;
  /**
   * Re-send the same request once after a malformed-tool-call error part.
   * Absent = no retry. `replaceVisible` = the consumer understands the
   * replace marker (chat loop); without it a retry only happens while no
   * visible text was forwarded.
   */
  readonly retry?: {
    readonly resend: () => Promise<Response>;
    readonly replaceVisible: boolean;
    /** The caller's signal: an aborted request is never re-sent. */
    readonly signal?: AbortSignal | null;
  };
}

function nonEmpty(text: string | null | undefined): boolean {
  return typeof text === "string" && text !== "";
}

/**
 * Wrap an SSE chat-completion body: hold tool-call deltas until the finish
 * chunk, emit each call once with repaired arguments. See the file header.
 */
export function bufferToolCallDeltas(
  body: ReadableStream<Uint8Array>,
  opts: ToolCallBufferOptions,
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const events = transformEvents(body, opts);
  return new ReadableStream<Uint8Array>({
    async pull(controller): Promise<void> {
      const next = await events.next();
      if (next.done) {
        controller.close();
        return;
      }
      controller.enqueue(encoder.encode(next.value));
    },
    async cancel(): Promise<void> {
      await events.return(undefined);
    },
  });
}

async function* transformEvents(
  first: ReadableStream<Uint8Array>,
  opts: ToolCallBufferOptions,
): AsyncGenerator<string> {
  let pending = new Map<number, PendingCall>();
  let lastIndex: number | null = null;
  let host: string | null = null;
  let model: string | null = null;
  let template: Chunk | null = null;
  let visibleForwarded = false;
  let retried = false;
  let source = readSseEvents(first);

  function absorb(delta: ToolCallDelta): void {
    const index =
      typeof delta.index === "number" ? delta.index : (lastIndex ?? 0);
    lastIndex = index;
    const current = pending.get(index) ?? {
      index,
      id: null,
      name: null,
      arguments: "",
      deltaCount: 0,
      firstParsableChars: null,
      extra: {},
    };
    if (current.deltaCount === 0) {
      for (const [key, value] of Object.entries(delta)) {
        if (!["index", "id", "type", "function"].includes(key)) {
          const json = z.json().safeParse(value);
          if (json.success) {
            current.extra[key] = json.data;
          }
        }
      }
    }
    current.deltaCount += 1;
    current.id ??= nonEmpty(delta.id) ? (delta.id ?? null) : null;
    current.name ??= nonEmpty(delta.function?.name)
      ? (delta.function?.name ?? null)
      : null;
    current.arguments += delta.function?.arguments ?? "";
    if (
      current.firstParsableChars === null &&
      current.arguments.trimEnd().endsWith("}") &&
      parsesAsJson(current.arguments)
    ) {
      current.firstParsableChars = current.arguments.length;
    }
    pending.set(index, current);
  }

  function* flush(): Generator<string> {
    if (pending.size === 0) {
      return;
    }
    const calls = [...pending.values()].toSorted((a, b) => a.index - b.index);
    pending = new Map();
    lastIndex = null;
    const toolCalls: Array<{
      [key: string]: JSONValue;
    }> = [];
    for (const call of calls) {
      const { text, repair } = repairToolArguments(call.arguments);
      const evidence: ToolCallWireEvidence = {
        provider: opts.provider,
        host,
        deltaCount: call.deltaCount,
        firstParsableChars: call.firstParsableChars,
        finalChars: call.arguments.length,
        repair,
      };
      if (call.id) {
        rememberEvidence(call.id, evidence);
      }
      if (!call.name) {
        opts.logger.warn(
          `[${opts.provider}] Streamed tool call without a function name dropped`,
          {
            ...evidence,
            model,
            argumentKeys: argumentKeys(text),
          },
        );
        continue;
      }
      if (repair === "premature-close" || repair === "repeated-object") {
        opts.logger.warn(
          `[${opts.provider}] Repaired streamed tool-call arguments`,
          { ...evidence, model, toolName: call.name },
        );
      } else if (
        repair === "none" &&
        call.firstParsableChars !== null &&
        call.firstParsableChars < call.arguments.trimEnd().length
      ) {
        opts.logger.info(
          `[${opts.provider}] Tool-call arguments parsed before the call finished streaming`,
          { ...evidence, model, toolName: call.name },
        );
      } else if (repair === "unparsable") {
        opts.logger.warn(
          `[${opts.provider}] Streamed tool-call arguments are not valid JSON`,
          { ...evidence, model, toolName: call.name },
        );
      }
      toolCalls.push({
        ...call.extra,
        index: toolCalls.length,
        id: call.id ?? `call_${crypto.randomUUID()}`,
        type: "function",
        function: { name: call.name, arguments: text },
      });
    }
    if (toolCalls.length === 0) {
      return;
    }
    // Only fields the upstream sent: provider schemas reject nulls here.
    yield sseData({
      ...(template?.id ? { id: template.id } : {}),
      object: template?.object ?? "chat.completion.chunk",
      ...(typeof template?.created === "number"
        ? { created: template.created }
        : {}),
      ...(template?.model ? { model: template.model } : {}),
      ...(host ? { provider: host } : {}),
      choices: [
        {
          index: 0,
          delta: { role: "assistant", tool_calls: toolCalls },
          finish_reason: null,
        },
      ],
    });
  }

  try {
    while (true) {
      const next = await source.next().catch((error: Error) => error);
      if (next instanceof Error) {
        // The upstream closed the socket mid-body ("terminated", "other side
        // closed": prod 2026-11-26/27 NanoGPT GLM 5.3, the turn failed with
        // "Failed to process successful response"). Re-send once.
        const retry = opts.retry;
        const canRetry =
          retry !== undefined &&
          !retried &&
          retry.signal?.aborted !== true &&
          (!visibleForwarded || retry.replaceVisible);
        (canRetry ? opts.logger.info : opts.logger.warn).bind(opts.logger)(
          `[${opts.provider}] Upstream response body read failed`,
          {
            model,
            host,
            errorName: next.name,
            errorMessage: next.message.slice(0, 200),
            visibleForwarded,
            heldToolCalls: pending.size,
            retrying: canRetry,
            alreadyRetried: retried,
          },
        );
        if (!canRetry || !retry) {
          return Promise.reject(next);
        }
        retried = true;
        const response = await retry.resend().catch((error: Error) => error);
        if (!(response instanceof Response) || !response.ok || !response.body) {
          if (response instanceof Response) {
            await response.body?.cancel().catch(() => undefined);
          }
          return Promise.reject(next);
        }
        pending = new Map();
        lastIndex = null;
        source = readSseEvents(response.body);
        if (visibleForwarded) {
          yield sseData({
            choices: [],
            [GARBLED_RETRY_MARKER_KEY]: {
              rule: UPSTREAM_BODY_READ_RETRY_RULE,
              host: host ?? opts.provider,
            },
          });
        }
        continue;
      }
      if (next.done) {
        break;
      }
      const event = parseEvent(next.value);
      if (event.done) {
        yield* flush();
        yield event.raw;
        continue;
      }
      const chunk = event.chunk;
      if (!chunk) {
        yield event.raw;
        continue;
      }
      template ??= chunk;
      host = chunk.provider ?? host;
      model = chunk.model ?? model;

      const errorMessage = chunk.error?.message ?? null;
      if (errorMessage !== null) {
        const errorKey = providerErrorTranslationKey(errorMessage);
        const malformed = errorKey === "errors.malformedToolCall";
        // Busy/overloaded/timed out mid-stream: the AI SDK only retries the
        // initial request, so without this the turn ended in an error
        // bubble (prod 2026-11-25..27: NanoGPT GLM 5.3, DeepSeek V4.1,
        // Artemis 31B). One delayed re-send, same rules as malformed.
        const busy = errorKey === "errors.providerBusy";
        const retry = opts.retry;
        const canRetry =
          (malformed || busy) &&
          retry !== undefined &&
          !retried &&
          retry.signal?.aborted !== true &&
          (!visibleForwarded || retry.replaceVisible);
        if (malformed || busy) {
          // Recovered attempts are info (the retry's outcome is logged by
          // the chat loop); an unrecoverable one stays a warning.
          (canRetry ? opts.logger.info : opts.logger.warn).bind(opts.logger)(
            malformed
              ? `[${opts.provider}] Upstream reported a malformed tool call`
              : `[${opts.provider}] Upstream reported busy mid-stream`,
            {
              model,
              host,
              heldToolCalls: pending.size,
              heldArgumentChars: [...pending.values()].reduce(
                (sum, call) => sum + call.arguments.length,
                0,
              ),
              visibleForwarded,
              retrying: canRetry,
              alreadyRetried: retried,
              ...(busy ? { upstreamMessage: errorMessage.slice(0, 200) } : {}),
            },
          );
        }
        if (canRetry && retry) {
          retried = true;
          if (busy) {
            await new Promise((resolve) => {
              setTimeout(resolve, BUSY_RETRY_DELAY_MS);
            });
          }
          const response = await retry.resend().catch((error: Error) => error);
          if (response instanceof Response && response.ok && response.body) {
            pending = new Map();
            lastIndex = null;
            await source.return(undefined);
            source = readSseEvents(response.body);
            if (visibleForwarded) {
              yield sseData({
                choices: [],
                [GARBLED_RETRY_MARKER_KEY]: {
                  rule: malformed
                    ? MALFORMED_TOOL_CALL_RETRY_RULE
                    : PROVIDER_BUSY_RETRY_RULE,
                  host: host ?? opts.provider,
                },
              });
            }
            continue;
          }
          if (response instanceof Response) {
            await response.body?.cancel().catch(() => undefined);
          }
          opts.logger.warn(
            `[${opts.provider}] Mid-stream retry could not start`,
            {
              model,
              status: response instanceof Response ? response.status : null,
              error: response instanceof Response ? null : response.message,
            },
          );
        }
        // The SDK never executes a call after an error part; partial calls
        // the error interrupted are dropped with it.
        pending = new Map();
        lastIndex = null;
        yield event.raw;
        continue;
      }

      const choices = chunk.choices ?? [];
      const choice = choices[0];
      const toolDeltas = choice?.delta?.tool_calls ?? [];
      if (
        choice?.delta &&
        (nonEmpty(choice.delta.content) ||
          nonEmpty(choice.delta.reasoning) ||
          nonEmpty(choice.delta.reasoning_content))
      ) {
        visibleForwarded = true;
      }
      if (toolDeltas.length === 0) {
        if (nonEmpty(choice?.finish_reason)) {
          yield* flush();
        }
        yield event.raw;
        continue;
      }
      for (const delta of toolDeltas) {
        absorb(delta);
      }
      // Same delta without its tool calls (undefined keys are not serialized).
      const restDelta = { ...choice?.delta, tool_calls: undefined };
      const finishing = nonEmpty(choice?.finish_reason);
      const keepsContent =
        nonEmpty(restDelta.content) ||
        nonEmpty(restDelta.reasoning) ||
        nonEmpty(restDelta.reasoning_content) ||
        chunk.usage !== undefined;
      if (finishing) {
        // Content in the finish chunk goes first, then the calls, then finish.
        if (keepsContent) {
          yield sseData({
            ...chunk,
            choices: [{ ...choice, delta: restDelta, finish_reason: null }],
            usage: undefined,
          });
        }
        yield* flush();
        yield sseData({
          ...chunk,
          choices: [{ ...choice, delta: {} }],
        });
        continue;
      }
      if (keepsContent) {
        yield sseData({
          ...chunk,
          choices: [{ ...choice, delta: restDelta }],
        });
      }
    }
    yield* flush();
  } finally {
    await source.return(undefined);
  }
}

function argumentKeys(text: string): string[] {
  try {
    const parsed = z.record(z.string(), z.json()).safeParse(JSON.parse(text));
    return parsed.success ? Object.keys(parsed.data).slice(0, 10) : [];
  } catch {
    return [];
  }
}

/**
 * Apply {@link bufferToolCallDeltas} to a streamed chat-completion response.
 * Errors, JSON bodies and non-SSE responses pass through untouched.
 */
export function withBufferedToolCalls(
  response: Response,
  opts: ToolCallBufferOptions,
): Response {
  const contentType = response.headers.get("content-type") ?? "";
  if (
    !response.ok ||
    !response.body ||
    !contentType.includes("text/event-stream")
  ) {
    return response;
  }
  return new Response(bufferToolCallDeltas(response.body, opts), {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}
