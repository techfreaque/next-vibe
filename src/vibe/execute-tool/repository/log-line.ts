/**
 * One-line per-tool execution summary for the server surfaces.
 *
 * Only NEXT_API and AI reach this: they are the surfaces with no other UI for a
 * tool call. CLI renders its own output and MCP's client shows the result, so on
 * those platforms the function returns immediately. Its own module because it is
 * pure presentation for platforms a headless deployment does not have — and
 * because it is the only reason ./index.ts imports the logger colour palette.
 */

import "server-only";

import { bold, maybeColorize, semantic } from "../../logger/colors";
import type { EndpointLogger } from "../../logger/types";
import { Platform } from "../../platforms/platforms";

export function logToolLine(
  logger: EndpointLogger,
  toolName: string,
  mode: string | null,
  durationMs: number,
  result: { success: boolean; message?: string },
  platform: Platform,
): void {
  if (platform !== Platform.NEXT_API && platform !== Platform.AI) {
    return;
  }
  const ms = maybeColorize(`in ${durationMs}ms`, semantic.muted);
  const modeTag =
    mode && mode !== "wait" ? maybeColorize(` ${mode}`, semantic.muted) : "";
  if (result.success) {
    logger.vibe(
      `TOOL ${bold(toolName)}${modeTag} ${maybeColorize("→ ok", semantic.success)} ${ms}`,
    );
  } else {
    const msg = result.message ?? "error";
    logger.vibe(
      `TOOL ${bold(toolName)}${modeTag} ${maybeColorize(`→ ${msg}`, semantic.error)} ${ms}`,
    );
  }
}
