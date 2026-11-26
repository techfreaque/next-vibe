/**
 * Pure selection logic for build-machine cleanup and prod server retention.
 * cleanup.ts and remote-retention.ts run the commands.
 */

/** The only image repository local cleanup ever touches. */
export const CLEANUP_IMAGE_REPO = "ghcr.io/techfreaque/next-vibe-app";

/** Tags protected during the low-disk check before a local build. */
export const PINNED_TAGS: readonly string[] = [
  "latest",
  "rollback",
  "prod-current-good",
];

/** Recent builds kept on prod servers and during the local pre-build check. */
export const KEEP_BUILDS = 3;

/** Age and size targets for unused local Docker build cache. */
export const BUILD_CACHE_KEEP_HOURS = 24;
export const BUILD_CACHE_KEEP_GB = 30;

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
export interface ExportEntry {
  name: string;
  isDirectory: boolean;
  isFile: boolean;
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
 * Picks refs for prod retention and the pre-build disk check: every tag of
 * a build older than the newest `keepBuilds`, unless it has a protected
 * tag or a container uses it. A build tagged only `<none>` is returned by id.
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
 * After a successful push, pick every local app tag except tags of the
 * just-built image and images referenced by containers. A registry-only push
 * has no local build to keep. An expected tag missing from the list means
 * the current image could not be identified safely.
 */
export function selectLocalImageRefsToRemove(params: {
  entries: LocalImageEntry[];
  currentTag: string | undefined;
  containerImageIds: readonly string[];
}): string[] | undefined {
  const { entries, currentTag, containerImageIds } = params;
  const appEntries = entries.filter(
    ({ repository, id }) => repository === CLEANUP_IMAGE_REPO && id,
  );
  const currentImageId = appEntries.find(({ tag }) => tag === currentTag)?.id;
  if (currentTag !== undefined && currentImageId === undefined) {
    return undefined;
  }
  const protectedIds = new Set(containerImageIds);
  if (currentImageId !== undefined) {
    protectedIds.add(currentImageId);
  }
  return appEntries
    .filter(
      ({ tag, id }) => tag && tag !== DANGLING_TAG && !protectedIds.has(id),
    )
    .map(({ repository, tag }) => `${repository}:${tag}`);
}

const EXPORT_MARKER_SUFFIXES = [".done", ".checked", ".gate-dirty"] as const;

/** Groups old full-SHA export dirs and sibling markers by commit. */
export function selectExportEntriesToPark(params: {
  entries: ExportEntry[];
  currentSha: string;
}): Map<string, string[]> {
  const exportsToPark = new Map<string, string[]>();
  for (const { name, isDirectory, isFile } of params.entries) {
    const markerSuffix = isFile
      ? EXPORT_MARKER_SUFFIXES.find((suffix) => name.endsWith(suffix))
      : undefined;
    const sha = markerSuffix ? name.slice(0, -markerSuffix.length) : name;
    if (
      !(isDirectory || markerSuffix !== undefined) ||
      !FULL_SHA.test(sha) ||
      sha === params.currentSha
    ) {
      continue;
    }
    const names = exportsToPark.get(sha) ?? [];
    names.push(name);
    exportsToPark.set(sha, names);
  }
  return exportsToPark;
}

// ============================================================================
// Prod server retention (Server 1 / Server 2), run by image-push over SSH.
// ============================================================================

/** Below this many free GB on a prod server, retention runs before a load. */
export const REMOTE_MIN_FREE_GB = 30;

/** Which HA node a retention run targets. */
export type RemoteNode = "s1" | "s2";

/**
 * Tags that are never removed on a prod server.
 * - s1: `latest` (the running image), `rollback`, `prod-current-good`.
 * - s2: the node's own tag (`unbottled`), `<tag>-rollback`, `<tag>-prev`,
 *   and ALWAYS `latest`: Server 2 co-hosts heilpraktiker, whose container
 *   runs ghcr.io/techfreaque/next-vibe-app:latest. That tag is never ours
 *   to drop, whatever SSH_SERVER2_IMAGE_TAG is set to.
 */
export function remotePinnedTags(
  node: RemoteNode,
  secondaryTag: string,
): string[] {
  if (node === "s1") {
    return ["latest", "rollback", "prod-current-good"];
  }
  const own = secondaryTag.trim();
  const ownTags = own
    ? [own, `${own}-rollback`, `${own}-prev`]
    : ["unbottled", "unbottled-rollback", "unbottled-prev"];
  return [...new Set(["latest", ...ownTags])];
}

/** Marker lines of the remote inventory script (see remoteInventoryScript). */
const INVENTORY_FREE = "VIBE_FREE_KB";
const INVENTORY_IMAGE = "VIBE_IMG";
const INVENTORY_CONTAINER = "VIBE_CTR";
const INVENTORY_END = "VIBE_INVENTORY_END";

/**
 * Shell script that prints, in one SSH round trip: free KB on the docker
 * root, every local image of `repository`, and the image id of every
 * container (running or stopped). The end marker is printed only when every
 * listing succeeded, so a partial answer is never acted on.
 * `repository` must be CLEANUP_IMAGE_REPO (no shell metacharacters).
 */
export function remoteInventoryScript(repository: string): string {
  if (repository !== CLEANUP_IMAGE_REPO) {
    return "exit 2";
  }
  return [
    `root=$(docker info -f '{{.DockerRootDir}}' 2>/dev/null); [ -n "$root" ] || root=/var/lib/docker`,
    `echo "${INVENTORY_FREE} $(df -Pk "$root" | awk 'NR==2{print $4}')"`,
    `docker images --no-trunc --format '${INVENTORY_IMAGE}|{{.Repository}}|{{.Tag}}|{{.ID}}|{{.CreatedAt}}' ${repository} || exit 3`,
    `ids=$(docker ps -aq --no-trunc) || exit 4`,
    `if [ -n "$ids" ]; then docker inspect -f '${INVENTORY_CONTAINER}|{{.Image}}' $ids || exit 4; fi`,
    `echo ${INVENTORY_END}`,
  ].join("\n");
}

/** What a prod server reported (see remoteInventoryScript). */
export interface RemoteInventory {
  /** Free GB (one decimal) on the docker root, undefined when unreadable. */
  freeGb: number | undefined;
  entries: LocalImageEntry[];
  containerImageIds: string[];
}

/**
 * Parses the inventory script's stdout. Returns undefined when the end
 * marker is missing (a listing failed or the output was cut off): the caller
 * then removes nothing.
 */
export function parseRemoteInventory(
  stdout: string,
): RemoteInventory | undefined {
  const lines = stdout.split("\n").map((line) => line.trim());
  if (!lines.includes(INVENTORY_END)) {
    return undefined;
  }
  let freeGb: number | undefined;
  const entries: LocalImageEntry[] = [];
  const containerImageIds: string[] = [];
  for (const line of lines) {
    if (line.startsWith(`${INVENTORY_FREE} `)) {
      const kb = Number(line.slice(INVENTORY_FREE.length + 1));
      freeGb =
        Number.isFinite(kb) && kb > 0
          ? Math.round((kb / 1024 ** 2) * 10) / 10
          : undefined;
      continue;
    }
    const [kind = "", ...rest] = line.split("|");
    if (kind === INVENTORY_IMAGE) {
      const [repository = "", tag = "", id = "", ...created] = rest;
      entries.push({ repository, tag, id, createdAt: created.join("|") });
    } else if (kind === INVENTORY_CONTAINER && rest[0]) {
      containerImageIds.push(rest[0]);
    }
  }
  return { freeGb, entries, containerImageIds };
}

/** A ref the retention script may pass to `docker rmi`. */
const SAFE_REF = new RegExp(
  `^(${CLEANUP_IMAGE_REPO.replace(/[.]/g, "\\.")}:[A-Za-z0-9_][A-Za-z0-9_.-]{0,127}|sha256:[0-9a-f]{64})$`,
);

/** Result line prefixes of remoteRetentionScript. */
export const RETENTION_OK = "VIBE_RMI_OK";
export const RETENTION_FAIL = "VIBE_RMI_FAIL";
export const RETENTION_PRUNED = "VIBE_PRUNED";

/**
 * Shell script that untags `refs` one by one with plain `docker rmi` (never
 * `-f`: docker refuses an image any container uses) and then prunes DANGLING
 * images only (`docker image prune -f`, never `-a`). Refs that are not a tag
 * of CLEANUP_IMAGE_REPO or a full image id are dropped, so nothing else on
 * the box can be named. Prints one OK/FAIL line per ref and the prune total.
 */
export function remoteRetentionScript(refs: readonly string[]): string {
  const safe = refs.filter((ref) => SAFE_REF.test(ref));
  const lines = safe.map(
    (ref) =>
      `if err=$(docker rmi '${ref}' 2>&1 >/dev/null); then echo "${RETENTION_OK} ${ref}"; else echo "${RETENTION_FAIL} ${ref} $(printf '%s' "$err" | head -1)"; fi`,
  );
  lines.push(
    `echo "${RETENTION_PRUNED} $(docker image prune -f 2>&1 | tail -1)"`,
  );
  return lines.join("\n");
}
