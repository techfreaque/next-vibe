/**
 * Prompt-building + AI self-report helpers for the AI-stream suites.
 *
 * STEP_OK contract: every test prompt ends with "End with STEP_OK if
 * everything worked." The AI acts as an in-band verifier — if it saw a
 * problem (bad tool result, missing data), it reports the issue instead of
 * the marker, and assertStepOk fails the test with the AI's feedback as the
 * error message.
 */

import "server-only";

import { expect } from "vitest";

import type { ModeConfig } from "./config";

/**
 * Returns the prompt instruction for calling a tool by plain name.
 * Local: "the tool-help tool"
 * Remote via execute-tool: "execute-tool with toolName='tool-help' and instanceId='atlas'"
 */
export function toolInstr(cfg: ModeConfig, toolName: string): string {
  if (cfg.remoteInstanceId) {
    // instanceId is load-bearing for this test cell (this tool must run on the
    // REMOTE instance) — spell out the requirement so a live model never
    // silently drops it and runs the tool locally.
    return `execute-tool with toolName='${toolName}' and instanceId='${cfg.remoteInstanceId}' (instanceId='${cfg.remoteInstanceId}' is REQUIRED on this call - never omit it)`;
  }
  return `the ${toolName} tool`;
}

/**
 * Returns the prompt instruction for calling a tool with extra named parameters.
 * e.g. toolInstrWithArgs(cfg, "generate_image", "prompt='x' and callbackMode='detach'")
 * Local: "the generate_image tool with prompt='x' and callbackMode='detach'"
 * Remote: "execute-tool with toolName='generate_image', instanceId='atlas', input={'prompt':'x'}, callbackMode='detach'"
 *
 * For remote calls: tool-specific args go inside input={}, execute-tool top-level args
 * (callbackMode) stay at top level. This prevents AI from putting tool-specific args
 * at the wrong nesting level (input:{} empty while tool args are top-level).
 */
export function toolInstrWithArgs(
  cfg: ModeConfig,
  toolName: string,
  argsStr: string,
): string {
  // Tools-remote (remoteInstanceId): every tool is invoked through the
  // execute-tool meta-tool. callbackMode is an execute-tool TOP-LEVEL field —
  // it must NOT be nested inside `input` (the wrapped tool's own args), or the
  // dispatch runs the tool inline (WAIT) and callback modes like detach/wakeUp
  // never engage. Loop-on-remote suites (systemPromptInstanceId WITHOUT
  // remoteInstanceId) stay PLAIN: the executor calls its own tools natively.
  const runsViaExecuteTool = !!cfg.remoteInstanceId;
  if (runsViaExecuteTool) {
    // Split argsStr into execute-tool top-level args and tool-specific (input) args.
    // Top-level execute-tool fields: callbackMode
    // Everything else goes into input={}
    const topLevelFields = ["callbackMode"];
    const topLevelParts: string[] = [];
    const inputParts: string[] = [];

    // Parse key='value' pairs from argsStr (handles single quotes only)
    const pairRegex = /(\w+)='([^']*)'/g;
    let match: RegExpExecArray | null;
    while ((match = pairRegex.exec(argsStr)) !== null) {
      const key = match[1]!;
      const val = match[2]!;
      if (topLevelFields.includes(key)) {
        topLevelParts.push(`${key}='${val}'`);
      } else {
        inputParts.push(`'${key}':'${val}'`);
      }
    }

    const inputStr =
      inputParts.length > 0 ? `, input={${inputParts.join(", ")}}` : "";
    const topStr =
      topLevelParts.length > 0 ? `, ${topLevelParts.join(", ")}` : "";
    const instanceStr = cfg.remoteInstanceId
      ? `, instanceId='${cfg.remoteInstanceId}'`
      : "";
    return `execute-tool with toolName='${toolName}'${instanceStr}${inputStr}${topStr}`;
  }
  return `the ${toolName} tool with ${argsStr}`;
}

/**
 * Strip model reasoning (<think>…</think>) so verdict parsing never reads a
 * marker the model merely CONTEMPLATED ("I'll answer STEP_OK if…") mid-thought
 * instead of its actual final verdict.
 */
export function stripReasoning(content: string): string {
  let c = content.replaceAll(/<think>[\s\S]*?<\/think>/g, "");
  // An unclosed <think> means everything after it is unfinished reasoning —
  // drop it so a marker the model was still contemplating never counts.
  const openIdx = c.indexOf("<think>");
  if (openIdx !== -1) {
    c = c.slice(0, openIdx);
  }
  return c.trim();
}

/**
 * Parse the AI's FINAL verdict from a self-report reply.
 *
 * The contract: the reply ENDS WITH its verdict — STEP_OK (all good) or
 * `FAILED: …` (something off) on the final line. We read ONLY the LAST
 * non-empty line of the visible answer (reasoning stripped): a model routinely
 * writes "I'll end with STEP_OK unless something is wrong" mid-answer and then
 * concludes "FAILED: …" on the last line, so matching anywhere would wrongly
 * pass. FAILED on the last line (or no STEP_OK on it) is a fail.
 */
export function parseFinalVerdict(content: string): {
  ok: boolean;
  failedText: string | null;
} {
  const visible = stripReasoning(content);
  const lines = visible
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  const lastLine = lines[lines.length - 1] ?? "";
  if (lastLine.includes("FAILED")) {
    return { ok: false, failedText: lastLine };
  }
  return { ok: lastLine.includes("STEP_OK"), failedText: null };
}

/**
 * Assert step completed without the AI reporting issues.
 * Parses the AI's FINAL verdict (reasoning stripped, last token wins): STEP_OK
 * passes only when it is the last verdict and no trailing FAILED follows. A
 * FAILED — even after an earlier STEP_OK — fails the test with the AI's report.
 */
export function assertStepOk(
  content: string | null | undefined,
  stepName: string,
): void {
  expect(content, `[${stepName}] AI returned empty content`).toBeTruthy();
  if (!content) {
    // oxlint-disable-next-line restricted-syntax
    throw new Error(`[${stepName}] AI returned empty content`);
  }
  const verdict = parseFinalVerdict(content);
  expect(
    verdict.ok,
    `[${stepName}] AI did NOT confirm STEP_OK as its final verdict - reported issues instead:\n\n${verdict.failedText ?? stripReasoning(content)}`,
  ).toBe(true);
}
