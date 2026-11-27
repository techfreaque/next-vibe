import { closeSync, existsSync, fstatSync, openSync, readSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

import { isValidAgentName } from "../constants";

export const isValidName = isValidAgentName;

/**
 * Where a run keeps its transcript and its control-channel file. On disk under the home directory, never in the
 * system temp directory: that can be a RAM disk.
 */
export function stateDir(env: NodeJS.ProcessEnv = process.env): string {
  return env.PCV_SUBAGENTS_HOME || join(homedir(), ".cache", "pcv-subagents");
}

export const runningDir = (dir: string): string => join(dir, "running");
// Callers pass names accepted by isValidName.
export const runningFile = (dir: string, name: string): string =>
  join(runningDir(dir), `${name}.json`);
export const agentDir = (dir: string, name: string): string =>
  join(dir, "agents", name);

export function transcriptTail(
  dir: string,
  name: string,
  lines: number,
): string {
  if (lines <= 0 || !isValidName(name)) {
    return "";
  }
  const transcript = join(agentDir(dir, name), "transcript.md");
  if (!existsSync(transcript)) {
    return "";
  }
  const file = openSync(transcript, "r");
  try {
    const blocks: Buffer[] = [];
    let found = 0;
    let remaining = fstatSync(file).size;
    while (remaining > 0 && found <= lines) {
      const size = Math.min(8192, remaining);
      remaining -= size;
      const block = Buffer.allocUnsafe(size);
      const read = readSync(file, block, 0, size, remaining);
      for (let offset = 0; offset < read; offset++) {
        if (block[offset] === 10) {
          found++;
        }
      }
      blocks.push(block.subarray(0, read));
    }
    return Buffer.concat(blocks.toReversed())
      .toString("utf8")
      .replace(/\r?\n$/, "")
      .split(/\r?\n/)
      .slice(-lines)
      .join("\n");
  } finally {
    closeSync(file);
  }
}
