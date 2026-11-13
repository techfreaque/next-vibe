/**
 * Opaque reasoning replay token. Some providers need a reasoning block's
 * provider metadata (signatures, encrypted reasoning) sent back on the next
 * turn. Stateless clients carry it for us: Responses API clients in
 * `reasoning.encrypted_content`, Anthropic clients in a thinking block's
 * `signature`. Both send it back verbatim; we restore it as the reasoning
 * part's providerOptions.
 */

import { z } from "zod";

import type { ReasoningReplay } from "./inference";

const PREFIX = "unb1.";

const payloadSchema = z.object({
  /** reasoning text (Responses only: clients may drop summaries) */
  t: z.string().optional(),
  /** provider metadata of the block */
  m: z.record(z.string(), z.record(z.string(), z.json())).optional(),
});

export interface DecodedReplay {
  text: string | undefined;
  replay: ReasoningReplay | undefined;
}

export function encodeReasoningReplay(
  text: string | undefined,
  replay: ReasoningReplay | undefined,
): string {
  const payload: z.infer<typeof payloadSchema> = {};
  if (text) {
    payload.t = text;
  }
  if (replay && Object.keys(replay).length > 0) {
    // JSON round trip drops undefined values provider metadata may carry.
    const metadata = payloadSchema.shape.m.safeParse(
      JSON.parse(JSON.stringify(replay)),
    );
    if (metadata.success) {
      payload.m = metadata.data;
    }
  }
  return `${PREFIX}${Buffer.from(JSON.stringify(payload), "utf8").toString("base64url")}`;
}

/** undefined when the token is not ours (e.g. a real Anthropic signature). */
export function decodeReasoningReplay(
  token: string | null | undefined,
): DecodedReplay | undefined {
  if (!token?.startsWith(PREFIX)) {
    return undefined;
  }
  try {
    const parsed = payloadSchema.safeParse(
      JSON.parse(
        Buffer.from(token.slice(PREFIX.length), "base64url").toString("utf8"),
      ),
    );
    if (!parsed.success) {
      return undefined;
    }
    return { text: parsed.data.t, replay: parsed.data.m };
  } catch {
    return undefined;
  }
}
