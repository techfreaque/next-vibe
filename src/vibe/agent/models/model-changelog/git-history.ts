/**
 * Model Changelog - git walk. Reads every committed version of the model
 * registry files since TRACKING_START_COMMIT and turns them into dated events
 * via the pure extractor. Used by the `model-changelog` generator only: the
 * runtime reads the committed history.generated.ts, so production images
 * (built from `git archive`, no .git) never need git.
 */

import "server-only";

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

import {
  buildSnapshot,
  diffSnapshots,
  finalizeEvents,
  type ModelSnapshot,
  type RegistryFileText,
} from "./extract";
import type { ModelChangelogEvent, ModelChangelogModelType } from "./types";

/**
 * Commit the history starts from (exclusive): "flatten folder structure",
 * 2026-07-13, the first commit with today's registry paths. Models already in
 * the registry then have no "added" entry.
 */
export const TRACKING_START_COMMIT = "5ea48c1386";

/** Registry files (repo-relative) and the model type each one holds. */
export const MODEL_REGISTRY_FILES: ReadonlyArray<
  readonly [string, ModelChangelogModelType]
> = [
  ["src/vibe/agent/ai-stream/models-definitions.ts", "text"],
  ["src/vibe/agent/ai-stream/models.ts", "text"],
  ["src/vibe/agent/image-generation/models.ts", "image"],
  ["src/vibe/agent/video-generation/models.ts", "video"],
  ["src/vibe/agent/music-generation/models.ts", "audio"],
  ["src/vibe/agent/text-to-speech/models.ts", "tts"],
  ["src/vibe/agent/speech-to-text/models.ts", "stt"],
];

interface GitResult {
  ok: boolean;
  stdout: string;
}

function git(root: string, args: readonly string[]): GitResult {
  const result = spawnSync("git", [...args], {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
  });
  return {
    ok: result.status === 0,
    stdout: typeof result.stdout === "string" ? result.stdout : "",
  };
}

function readFilesAt(root: string, commit: string): RegistryFileText[] {
  const files: RegistryFileText[] = [];
  for (const [path, type] of MODEL_REGISTRY_FILES) {
    const shown = git(root, ["show", `${commit}:${path}`]);
    if (shown.ok) {
      files.push({ type, text: shown.stdout });
    }
  }
  return files;
}

/** Git metadata files whose mtime moves on every commit (generator inputs). */
export function gitRefInputs(root: string): string[] {
  const head = join(root, ".git", "HEAD");
  const inputs = [head, join(root, ".git", "packed-refs")];
  const branch = git(root, ["symbolic-ref", "-q", "HEAD"]);
  if (branch.ok && branch.stdout.trim().length > 0) {
    inputs.push(join(root, ".git", branch.stdout.trim()));
  }
  return inputs.filter((path) => existsSync(path));
}

export type ModelChangelogGitResult =
  | {
      available: true;
      events: ModelChangelogEvent[];
      commits: number;
      /** Commit date of TRACKING_START_COMMIT (YYYY-MM-DD) */
      trackingStart: string;
    }
  | { available: false };

/** Walk the committed registry history into newest-first events. */
export function collectModelChangelogFromGit(
  root: string,
): ModelChangelogGitResult {
  if (!existsSync(join(root, ".git"))) {
    return { available: false };
  }
  const startExists = git(root, [
    "cat-file",
    "-e",
    `${TRACKING_START_COMMIT}^{commit}`,
  ]);
  const startDate = git(root, [
    "log",
    "-1",
    "--format=%cs",
    TRACKING_START_COMMIT,
  ]);
  if (!startExists.ok || !startDate.ok) {
    return { available: false };
  }
  const log = git(root, [
    "log",
    "--reverse",
    "--format=%h %cs",
    `${TRACKING_START_COMMIT}..HEAD`,
    "--",
    ...MODEL_REGISTRY_FILES.map(([path]) => path),
  ]);
  if (!log.ok) {
    return { available: false };
  }
  const commits = log.stdout
    .split("\n")
    .map((line) => line.trim().split(" "))
    .filter((parts) => parts.length === 2);

  let previous: ModelSnapshot = buildSnapshot(
    readFilesAt(root, TRACKING_START_COMMIT),
  );
  const events: ModelChangelogEvent[] = [];
  for (const [commit, date] of commits) {
    const next = buildSnapshot(readFilesAt(root, commit));
    // A commit that fails to parse (0 models) would read as "everything removed".
    if (next.models.size > 0) {
      events.push(...diffSnapshots(previous, next, date, commit));
      previous = next;
    }
  }
  return {
    available: true,
    events: finalizeEvents(events),
    commits: commits.length,
    trackingStart: startDate.stdout.trim(),
  };
}
