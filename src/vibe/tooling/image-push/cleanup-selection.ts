/**
 * Local build-machine cleanup: pure selection logic.
 * Decides which local image refs and which `.tmp/image-build/<sha>/` export
 * dirs `vibe image-push` may drop after a deploy. No side effects here, so it
 * is unit-tested in cleanup-selection.test.ts; cleanup.ts runs the commands.
 */

/** The only image repository local cleanup ever touches. */
export const CLEANUP_IMAGE_REPO = "ghcr.io/techfreaque/next-vibe-app";

/** Tags that are never removed locally, whatever their age. */
export const PINNED_TAGS: readonly string[] = [
  "latest",
  "rollback",
  "prod-current-good",
];

/** Builds (distinct image ids) and export dirs kept after a deploy. */
export const KEEP_BUILDS = 3;

/** Build cache younger than this survives the prune (fast rebuilds). */
export const BUILD_CACHE_KEEP_HOURS = 48;

/** Below this many free GB on the docker root, prune before building. */
export const MIN_FREE_GB = 40;

/** One row of `docker images --no-trunc` for a repository. */
export interface LocalImageEntry {
  repository: string;
  tag: string;
  /** Full image id (`sha256:...`). */
  id: string;
  /** docker's CreatedAt, e.g. `2026-11-16 04:37:44 +0100 CET`. */
  createdAt: string;
}

/** One entry of `.tmp/image-build/`. */
export interface ExportDirEntry {
  name: string;
  isDirectory: boolean;
  /** mtime of the `<sha>.done` marker (or the dir itself when missing). */
  mtimeMs: number;
}

const DANGLING_TAG = "<none>";
const FULL_SHA = /^[0-9a-f]{40}$/;

/**
 * Parses docker's `CreatedAt` (`YYYY-MM-DD HH:MM:SS +ZZZZ NAME`) to epoch ms.
 * Returns NaN when the format is unexpected (the caller then keeps the image).
 */
export function parseDockerCreatedAt(value: string): number {
  const match =
    /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}) ([+-])(\d{2})(\d{2})/.exec(
      value.trim(),
    );
  if (!match) {
    return Number.NaN;
  }
  const [, date, time, sign, hours, minutes] = match;
  return Date.parse(`${date}T${time}${sign}${hours}:${minutes}`);
}

/**
 * Picks the local refs to remove: every tag of a build older than the newest
 * `keepBuilds` builds, unless the build carries a pinned/current tag or is
 * used by a container. A build only tagged `<none>` is returned by image id.
 * Rows of any other repository are ignored, and so is every build whose
 * creation time cannot be read.
 */
export function selectImageRefsToRemove(params: {
  repository: string;
  entries: LocalImageEntry[];
  keepBuilds: number;
  /** Pinned tags plus the tags of the build just deployed. */
  keepTags: readonly string[];
  /** Image ids referenced by any container (running or stopped). */
  containerImageIds: readonly string[];
}): string[] {
  const { repository, entries, keepBuilds, keepTags, containerImageIds } =
    params;
  if (repository !== CLEANUP_IMAGE_REPO) {
    return [];
  }

  const builds = new Map<string, { tags: string[]; createdMs: number }>();
  for (const entry of entries) {
    if (entry.repository !== repository || !entry.id) {
      continue;
    }
    const build = builds.get(entry.id) ?? {
      tags: [],
      createdMs: parseDockerCreatedAt(entry.createdAt),
    };
    build.tags.push(entry.tag);
    builds.set(entry.id, build);
  }

  // Builds with an unreadable creation time are kept below, but never take
  // one of the `keepBuilds` slots from a real recent build.
  const newestFirst = [...builds.entries()]
    .filter(([, b]) => !Number.isNaN(b.createdMs))
    .toSorted(([, a], [, b]) => b.createdMs - a.createdMs);
  const keptIds = new Set(
    newestFirst.slice(0, Math.max(0, keepBuilds)).map(([id]) => id),
  );

  const refs: string[] = [];
  for (const [id, build] of newestFirst) {
    const protectedBuild =
      keptIds.has(id) ||
      containerImageIds.includes(id) ||
      build.tags.some((tag) => keepTags.includes(tag));
    if (protectedBuild) {
      continue;
    }
    const named = build.tags.filter((tag) => tag !== DANGLING_TAG);
    if (named.length === 0) {
      refs.push(id);
      continue;
    }
    for (const tag of named) {
      refs.push(`${repository}:${tag}`);
    }
  }
  return refs;
}

/**
 * Picks the `.tmp/image-build/<sha>` export dirs to park: full-sha dirs older
 * than the newest `keep`, never the one just built. Anything else in the
 * folder (markers, stray files, odd names) is left alone.
 */
export function selectExportDirsToPark(params: {
  entries: ExportDirEntry[];
  keep: number;
  currentSha: string;
}): string[] {
  const { entries, keep, currentSha } = params;
  return entries
    .filter((entry) => entry.isDirectory && FULL_SHA.test(entry.name))
    .toSorted((a, b) => b.mtimeMs - a.mtimeMs)
    .slice(Math.max(0, keep))
    .filter((entry) => entry.name !== currentSha)
    .map((entry) => entry.name);
}
