/**
 * execute-tool request-envelope normalization.
 *
 * execute-tool's envelope carries two words no target tool declares — the
 * "<instanceId>__<toolName>" routing prefix and `callbackMode` — and both name a
 * call that runs somewhere else or at some other time. Parsing them is therefore
 * a dispatch concern, not an execution one, so it lives here rather than inline
 * in ./index.ts: a deployment with no remote instances and no callback modes has
 * nothing to parse (every name is local and unprefixed) and declines this module.
 *
 * Pure and synchronous — normalization only. Every gate that can REJECT a call
 * stays in ./guards.
 */

import "server-only";

import type { WidgetData } from "../../core/utils/json";
import type { JwtPayloadType } from "../../identity/auth/types";
import type { EndpointLogger } from "../../logger/types";
import { CallbackMode, CallbackModeDB } from "../constants";
import type { RouteExecuteRequestOutput } from "../definition";

export interface ParsedEnvelope {
  /** Post-prefix tool name — never carries an instance prefix. */
  toolName: string;
  /** Target instance, from the prefix or the explicit prop. */
  instanceId: string | undefined;
  /** The envelope after public-caller forcing and callbackMode hoisting. */
  data: RouteExecuteRequestOutput;
  /** The target tool's input, stripped of execute-tool's own contract words. */
  input: RouteExecuteRequestOutput["input"];
}

/**
 * Normalize the incoming envelope: public-caller forcing, instance-prefix split,
 * and the misplaced-callbackMode hoist. Ordering between the three is
 * load-bearing and matches the original inline sequence.
 */
export function parseDispatchEnvelope(params: {
  data: RouteExecuteRequestOutput;
  user: JwtPayloadType;
  logger: EndpointLogger;
}): ParsedEnvelope {
  const { user, logger } = params;
  let { data } = params;

  // Public callers: force WAIT mode, block remote execution
  if (user.isPublic) {
    data = {
      ...data,
      callbackMode: CallbackMode.WAIT,
      instanceId: undefined,
    };
  }

  // Split prefixed tool ID: "hermes__ssh_exec_POST" → instanceId="hermes", toolName="ssh_exec_POST"
  // Prefixed form takes precedence over explicit instanceId prop
  let toolName = data.toolName;
  let instanceId = data.instanceId;
  const separatorIdx = toolName.indexOf("__");
  if (separatorIdx !== -1) {
    instanceId = toolName.slice(0, separatorIdx);
    toolName = toolName.slice(separatorIdx + 2);
  }

  let { input } = data;

  // Misplaced callbackMode hoist: models regularly put callbackMode INSIDE
  // the target tool's input ({toolName: "generate_image", input: {prompt,
  // callbackMode: "detach"}, callbackMode: "wait"}). callbackMode is
  // execute-tool's OWN contract word — no target tool declares it — so the
  // intent is unambiguous: hoist it to the envelope (input's value wins
  // over an absent or default-"wait" envelope value) and strip it from the
  // input so target-schema validation never sees it. Skip nested
  // execute-tool inputs — there the inner envelope owns its callbackMode.
  if (
    toolName !== "execute-tool" &&
    input !== null &&
    typeof input === "object" &&
    !Array.isArray(input) &&
    "callbackMode" in input
  ) {
    const misplaced = CallbackModeDB.find(
      (m) => m === String(input["callbackMode"]),
    );
    const cleanInput: Record<string, WidgetData> = { ...input };
    delete cleanInput["callbackMode"];
    input = cleanInput;
    if (
      misplaced &&
      (data.callbackMode === undefined ||
        data.callbackMode === null ||
        data.callbackMode === CallbackMode.WAIT)
    ) {
      logger.debug(
        "[RouteExecute] Hoisted misplaced callbackMode from input to envelope",
        { toolName, misplaced, envelopeMode: data.callbackMode ?? null },
      );
      data = { ...data, callbackMode: misplaced, input };
    } else {
      data = { ...data, input };
    }
  }

  return { toolName, instanceId, data, input };
}
