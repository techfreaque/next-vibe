/**
 * One generation per identical request at a time, per thread.
 *
 * Prod 2026-11-16: in one turn the model called `generate_image` directly AND
 * `execute-tool(generate_image)` with the same model and prompt; both ran in
 * parallel and the user paid 2 x 2.6 credits for two copies of one image. A
 * second identical request that arrives while the first is still generating
 * now joins it: same image, billed once (the joined result reports 0 credits).
 *
 * Scope is deliberately narrow: same thread, same caller, same model, prompt,
 * size, ratio and reference, and only while the first is IN FLIGHT. A later
 * "again" (new request after the first finished) still generates a new image.
 */

import type { ResponseType } from "next-vibe/core/route/response.schema";

import type { ImageGenerationPostResponseOutput } from "./definition";

type GenerationResult = ResponseType<ImageGenerationPostResponseOutput>;

const inFlight = new Map<string, Promise<GenerationResult>>();

export function imageGenerationKey(parts: {
  threadId: string | undefined;
  callerId: string;
  model: string;
  prompt: string;
  size: string;
  aspectRatio: string | undefined;
  inputMediaUrl: string | undefined;
}): string | null {
  if (!parts.threadId) {
    // Standalone calls (tool page, CLI, MCP) are explicit user actions.
    return null;
  }
  return JSON.stringify([
    parts.threadId,
    parts.callerId,
    parts.model,
    parts.prompt.trim(),
    parts.size,
    parts.aspectRatio ?? null,
    parts.inputMediaUrl ?? null,
  ]);
}

/**
 * Run `generate` unless an identical generation is in flight; then await
 * that one instead. `onJoin` maps the shared result for the joining caller.
 */
export async function runOncePerKey(
  key: string | null,
  generate: () => Promise<GenerationResult>,
  onJoin: (shared: GenerationResult) => GenerationResult,
): Promise<GenerationResult> {
  if (key === null) {
    return generate();
  }
  const existing = inFlight.get(key);
  if (existing) {
    return onJoin(await existing);
  }
  const running = generate();
  inFlight.set(key, running);
  try {
    return await running;
  } finally {
    inFlight.delete(key);
  }
}
