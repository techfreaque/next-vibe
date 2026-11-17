/**
 * Garbled-output guard for OpenRouter chat completions (fetch layer).
 *
 * Some OpenRouter hosts return broken output (see garbled-detector.ts). We do
 * not block hosts; we detect and recover per request:
 *
 *   1. HOLD: the start of every streamed response is held back until about
 *      {@link INITIAL_HOLD_CHARS} chars of answer/reasoning text were judged
 *      clean (or a tool call / finish / usage chunk arrives, or the hold is
 *      older than {@link MAX_INITIAL_HOLD_MS}). After that the stream flows
 *      with only the last {@link TRAILING_HOLD_CHARS} chars held back, so a
 *      broken tail is caught before it is forwarded.
 *   2. RECOVER: on a garbled verdict the attempt is aborted and re-sent ONCE
 *      with `provider.ignore += [host]` (the host name from the chunk's
 *      `provider` field; OpenRouter accepts that display name).
 *        - Nothing visible forwarded yet: the retry's stream simply continues
 *          the response. The caller never notices.
 *        - Text was already forwarded and the caller consumes the in-band
 *          replace marker (the chat loop, `replaceAfterRelease`): a marker
 *          chunk ({@link GARBLED_RETRY_MARKER_KEY}) precedes the retry so the
 *          caller drops the partial text and shows the retry's answer instead.
 *        - Otherwise (the /v1 API already sent it to the client, or a tool
 *          call already went out): no recovery, the stream passes through.
 *   3. BILLING: the aborted attempt's usage chunk never reaches the SDK, so
 *      only the retry is billed. The aborted partial generation is absorbed.
 *
 * Non-streaming requests (the /v1 generate path) are judged on the full body
 * and retried the same way.
 */

import "server-only";

import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import {
  buildGarbledPromptContext,
  GarbledOutputDetector,
  type GarbledVerdict,
} from "./garbled-detector";
import {
  isChatCompletionBody,
  type JsonRecord,
  withIgnoredProvider,
} from "./routing";

/** Chars of text judged before anything is forwarded. */
export const INITIAL_HOLD_CHARS = 240;
/** Chars always held back behind the stream head after the initial hold. */
export const TRAILING_HOLD_CHARS = 64;
/** A slow host never holds the start back longer than this. */
export const MAX_INITIAL_HOLD_MS = 4000;

/**
 * Request header a caller sets ("1") to opt in to the replace marker. The
 * OpenRouter fetch wrapper strips it before the request leaves.
 */
export const GARBLED_REPLACE_HEADER = "x-unbottled-garbled-replace";

/** Field of the synthetic chunk that tells the chat loop to drop the partial answer. */
export const GARBLED_RETRY_MARKER_KEY = "unbottled_garbled_retry";

export type FetchFn = (
  url: string | Request | URL,
  init?: RequestInit,
) => Promise<Response>;

export interface GarbledGuardOptions {
  readonly fetchImpl: FetchFn;
  readonly logger: EndpointLogger;
  /** Body → wire string (stable key order for fixtures). */
  readonly serialize: (body: JsonRecord) => string;
  /** The consumer handles the in-band replace marker (chat loop only). */
  readonly replaceAfterRelease: boolean;
}

const textPartSchema = z
  .object({
    text: z.string().nullish(),
    summary: z.string().nullish(),
    type: z.string().nullish(),
  })
  .loose();

const chunkSchema = z
  .object({
    provider: z.string().optional(),
    usage: z.looseObject({}).nullish(),
    error: z.looseObject({}).optional(),
    choices: z
      .array(
        z
          .object({
            finish_reason: z.string().nullish(),
            delta: z
              .object({
                content: z.string().nullish(),
                reasoning: z.string().nullish(),
                reasoning_details: z.array(textPartSchema).nullish(),
                tool_calls: z.array(z.looseObject({})).nullish(),
              })
              .loose()
              .nullish(),
            message: z
              .object({
                content: z.string().nullish(),
                reasoning: z.string().nullish(),
              })
              .loose()
              .nullish(),
          })
          .loose(),
      )
      .optional(),
  })
  .loose();

interface ChunkInfo {
  readonly provider: string | undefined;
  readonly text: string;
  readonly reasoning: string;
  readonly toolCall: boolean;
  /** finish_reason / usage / error / [DONE]: release everything held. */
  readonly terminal: boolean;
}

const EMPTY_INFO: ChunkInfo = {
  provider: undefined,
  text: "",
  reasoning: "",
  toolCall: false,
  terminal: false,
};

function parseJsonChunk(data: string): z.infer<typeof chunkSchema> | undefined {
  try {
    const parsed = chunkSchema.safeParse(JSON.parse(data));
    return parsed.success ? parsed.data : undefined;
  } catch {
    return undefined;
  }
}

/** Pull the judged text out of one raw SSE event block. */
export function parseSseEvent(raw: string): ChunkInfo {
  let info = EMPTY_INFO;
  for (const line of raw.split(/\r?\n/)) {
    if (!line.startsWith("data:")) {
      continue;
    }
    const data = line.slice(5).trim();
    if (data === "[DONE]") {
      info = { ...info, terminal: true };
      continue;
    }
    const chunk = parseJsonChunk(data);
    if (!chunk) {
      continue;
    }
    const choice = chunk.choices?.[0];
    const delta = choice?.delta;
    const reasoningDetails = (delta?.reasoning_details ?? [])
      .map((d) => d.text ?? d.summary ?? "")
      .join("");
    info = {
      provider: chunk.provider ?? info.provider,
      text: info.text + (delta?.content ?? ""),
      reasoning:
        info.reasoning +
        (reasoningDetails !== "" ? reasoningDetails : (delta?.reasoning ?? "")),
      toolCall: info.toolCall || (delta?.tool_calls?.length ?? 0) > 0,
      terminal:
        info.terminal ||
        (choice?.finish_reason ?? null) !== null ||
        (chunk.usage ?? null) !== null ||
        chunk.error !== undefined,
    };
  }
  return info;
}

/** All message text of a chat body (system, user, assistant, tool). */
export function promptTextOf(body: JsonRecord): string {
  const messages = body["messages"];
  if (!Array.isArray(messages)) {
    return "";
  }
  const out: string[] = [];
  for (const message of messages) {
    if (
      typeof message !== "object" ||
      message === null ||
      Array.isArray(message)
    ) {
      continue;
    }
    const content = message["content"];
    if (typeof content === "string") {
      out.push(content);
    } else if (Array.isArray(content)) {
      for (const part of content) {
        if (
          typeof part === "object" &&
          part !== null &&
          !Array.isArray(part) &&
          typeof part["text"] === "string"
        ) {
          out.push(part["text"]);
        }
      }
    }
  }
  return out.join("\n");
}

/** Split an SSE byte stream into raw event blocks (each ends with a blank line). */
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
    if (buffer !== "") {
      yield buffer;
    }
  } finally {
    // Early exit (garbled attempt dropped / consumer cancelled): release the
    // upstream body. Rejects when the attempt was already aborted - harmless.
    reader.cancel().catch(() => undefined);
  }
}

function sseData(payload: JsonRecord): string {
  return `data: ${JSON.stringify(payload)}\n\n`;
}

function markerEvent(rule: string, host: string): string {
  return sseData({
    choices: [],
    [GARBLED_RETRY_MARKER_KEY]: { rule, host },
  });
}

/**
 * The synthetic replace-marker chunk, as it arrives in the AI SDK's `raw`
 * stream part (`includeRawChunks`). `safeParse(part.rawValue).success`.
 */
export const garbledRetryMarkerSchema = z.looseObject({
  [GARBLED_RETRY_MARKER_KEY]: z.object({ rule: z.string(), host: z.string() }),
});

function linkedAbort(signal: AbortSignal | null | undefined): AbortController {
  const controller = new AbortController();
  if (signal) {
    if (signal.aborted) {
      controller.abort(signal.reason);
    } else {
      signal.addEventListener("abort", () => controller.abort(signal.reason), {
        once: true,
      });
    }
  }
  return controller;
}

function logGarbled(
  logger: EndpointLogger,
  message: string,
  verdict: GarbledVerdict,
  meta: { host: string | undefined; model: string; stage: string },
): void {
  if (!verdict.garbled) {
    return;
  }
  logger.warn(message, {
    rule: verdict.rule,
    sample: verdict.sample,
    host: meta.host ?? null,
    model: meta.model,
    stage: meta.stage,
  });
}

async function retryOnOtherHost(
  url: string | Request | URL,
  init: RequestInit | undefined,
  body: JsonRecord,
  host: string,
  opts: GarbledGuardOptions,
): Promise<Response> {
  return opts.fetchImpl(url, {
    ...init,
    body: opts.serialize(withIgnoredProvider(body, host)),
  });
}

/** Stream the retry's events (judged for logging only: one retry, no loop). */
async function* retryEvents(
  response: Response,
  detector: GarbledOutputDetector,
  opts: GarbledGuardOptions,
  model: string,
): AsyncGenerator<string> {
  if (!response.ok || !response.body) {
    const detail = await response.text().catch(() => "");
    yield sseData({
      error: {
        code: response.status,
        message: `Retry after garbled output failed: ${detail.slice(0, 500)}`,
      },
    });
    return;
  }
  let reported = false;
  for await (const raw of readSseEvents(response.body)) {
    if (!reported) {
      const info = parseSseEvent(raw);
      const verdict = info.reasoning
        ? detector.push("reasoning", info.reasoning)
        : detector.push("text", info.text);
      if (verdict.garbled) {
        reported = true;
        logGarbled(
          opts.logger,
          "[OpenRouter] Retry host ALSO returned garbled output - passing it through",
          verdict,
          { host: info.provider, model, stage: "retry" },
        );
      }
    }
    yield raw;
  }
}

interface HeldEvent {
  readonly raw: string;
  readonly chars: number;
}

async function* guardStream(
  first: ReadableStream<Uint8Array>,
  attempt: AbortController,
  url: string | Request | URL,
  init: RequestInit | undefined,
  body: JsonRecord,
  opts: GarbledGuardOptions,
): AsyncGenerator<string> {
  const prompt = buildGarbledPromptContext(promptTextOf(body));
  const detector = new GarbledOutputDetector(prompt);
  const model = typeof body["model"] === "string" ? body["model"] : "";
  let held: HeldEvent[] = [];
  let heldChars = 0;
  let holdStartedAt: number | undefined;
  let initialHoldDone = false;
  let textForwarded = false;
  let toolCallForwarded = false;
  let monitoring = true;
  let host: string | undefined;

  function* release(all: boolean): Generator<string> {
    while (held.length > 0) {
      const next = held[0];
      if (!next || (!all && heldChars - next.chars < TRAILING_HOLD_CHARS)) {
        return;
      }
      held = held.slice(1);
      heldChars -= next.chars;
      if (next.chars > 0) {
        textForwarded = true;
      }
      yield next.raw;
    }
  }

  for await (const raw of readSseEvents(first)) {
    const info = parseSseEvent(raw);
    host = info.provider ?? host;
    if (!monitoring) {
      yield raw;
      continue;
    }

    let verdict: GarbledVerdict = info.reasoning
      ? detector.push("reasoning", info.reasoning)
      : { garbled: false };
    if (!verdict.garbled && info.text) {
      verdict = detector.push("text", info.text);
    }

    if (verdict.garbled) {
      const canRetry =
        host !== undefined &&
        !toolCallForwarded &&
        (!textForwarded || opts.replaceAfterRelease);
      if (host !== undefined && canRetry) {
        logGarbled(
          opts.logger,
          "[OpenRouter] Garbled output detected - retrying on another host",
          verdict,
          { host, model, stage: textForwarded ? "after-release" : "held" },
        );
        attempt.abort();
        held = [];
        if (textForwarded) {
          yield markerEvent(verdict.rule, host);
        }
        const retry = await retryOnOtherHost(url, init, body, host, opts);
        yield* retryEvents(
          retry,
          new GarbledOutputDetector(prompt),
          opts,
          model,
        );
        return;
      }
      logGarbled(
        opts.logger,
        "[OpenRouter] Garbled output detected - cannot recover, passing through",
        verdict,
        {
          host,
          model,
          stage: toolCallForwarded
            ? "after-tool-call"
            : textForwarded
              ? "after-release"
              : "no-host",
        },
      );
      monitoring = false;
      yield* release(true);
      yield raw;
      continue;
    }

    const chars = info.text.length + info.reasoning.length;
    held.push({ raw, chars });
    heldChars += chars;
    if (chars > 0 && holdStartedAt === undefined) {
      holdStartedAt = Date.now();
    }

    if (info.toolCall || info.terminal) {
      yield* release(true);
      if (info.toolCall) {
        toolCallForwarded = true;
      }
      continue;
    }

    if (!initialHoldDone) {
      const heldTooLong =
        holdStartedAt !== undefined &&
        Date.now() - holdStartedAt > MAX_INITIAL_HOLD_MS;
      if (heldChars < INITIAL_HOLD_CHARS && !heldTooLong) {
        continue;
      }
      initialHoldDone = true;
    }
    yield* release(false);
  }
  yield* release(true);
}

/**
 * Fetch an OpenRouter chat completion through the garbled-output guard.
 * Non-chat bodies pass straight through.
 */
export async function fetchWithGarbledGuard(
  url: string | Request | URL,
  init: RequestInit | undefined,
  body: JsonRecord,
  opts: GarbledGuardOptions,
): Promise<Response> {
  if (!isChatCompletionBody(body)) {
    return opts.fetchImpl(url, { ...init, body: opts.serialize(body) });
  }
  const attempt = linkedAbort(init?.signal);
  const first = await opts.fetchImpl(url, {
    ...init,
    body: opts.serialize(body),
    signal: attempt.signal,
  });
  if (!first.ok || !first.body) {
    return first;
  }

  if (body["stream"] !== true) {
    return guardJson(first, url, init, body, opts);
  }

  const events = guardStream(first.body, attempt, url, init, body, opts);
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async pull(controller): Promise<void> {
      const next = await events.next();
      if (next.done) {
        controller.close();
        return;
      }
      controller.enqueue(encoder.encode(next.value));
    },
    async cancel(): Promise<void> {
      attempt.abort();
      await events.return(undefined);
    },
  });
  return new Response(stream, {
    status: first.status,
    statusText: first.statusText,
    headers: first.headers,
  });
}

/** Non-streaming: judge the whole answer, retry once on another host. */
async function guardJson(
  first: Response,
  url: string | Request | URL,
  init: RequestInit | undefined,
  body: JsonRecord,
  opts: GarbledGuardOptions,
): Promise<Response> {
  const text = await first.text();
  const rebuilt = (): Response =>
    new Response(text, {
      status: first.status,
      statusText: first.statusText,
      headers: first.headers,
    });
  const chunk = parseJsonChunk(text);
  const message = chunk?.choices?.[0]?.message;
  const host = chunk?.provider;
  if (!message || host === undefined) {
    return rebuilt();
  }
  const detector = new GarbledOutputDetector(
    buildGarbledPromptContext(promptTextOf(body)),
  );
  let verdict = detector.push("reasoning", message.reasoning ?? "");
  if (!verdict.garbled) {
    // Judge the full answer, not just its last window.
    const content = message.content ?? "";
    for (let at = 0; at < content.length && !verdict.garbled; at += 200) {
      verdict = detector.push("text", content.slice(at, at + 200));
    }
  }
  if (!verdict.garbled) {
    return rebuilt();
  }
  const model = typeof body["model"] === "string" ? body["model"] : "";
  logGarbled(
    opts.logger,
    "[OpenRouter] Garbled output detected - retrying on another host",
    verdict,
    { host, model, stage: "non-stream" },
  );
  const retry = await retryOnOtherHost(url, init, body, host, opts);
  return retry.ok ? retry : rebuilt();
}
