/**
 * Local build-machine cleanup for `vibe image-push`.
 * Keeps the machine that BUILDS the image bounded: one 6 GB tag per deploy
 * plus an ever-growing BuildKit cache filled the dev box's root partition
 * (266 GB of cache, ~40 old tags) and took Hermes' Postgres down with it.
 * Only this machine's docker and `.tmp/image-build/` are touched. Remote
 * servers get their own retention (remote-retention.ts, --remoteCleanup).
 * Best effort throughout: a failed cleanup step only warns, never fails the
 * deploy that already succeeded. Build artifacts are disposable: only the
 * current and previous export are kept, older exports and gate copies are
 * deleted outright (never parked).
 */

import "server-only";

import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, rmSync, statfsSync, statSync } from "node:fs";
import { join } from "node:path";

import { parseError } from "../../core/utils/parse-error";
import type { EndpointLogger } from "../../logger/types";
import {
  BUILD_CACHE_KEEP_GB,
  BUILD_CACHE_KEEP_HOURS,
  CLEANUP_IMAGE_REPO,
  KEEP_BUILDS,
  KEEP_EXPORTS,
  LOCAL_TRIMMED_REPOS,
  type LocalImageEntry,
  MIN_FREE_GB,
  PINNED_TAGS,
  selectExportEntriesToRemove,
  selectImageRefsToRemove,
  selectLocalImageRefsToRemove,
} from "./cleanup-selection";
import { IMAGE_BUILD_BUILDER } from "./constants";
import type { ImagePushT } from "./i18n";

const GB = 1024 ** 3;

export class ImagePushCleanup {
  /**
   * After a successful push, keep the current export and the just-built
   * local image, if loaded, plus any images used by containers.
   */
  static afterPush(
    params: {
      image: string;
      /** Commit tag of the loaded image, absent for registry-only pushes. */
      currentTag: string | undefined;
      buildRoot: string;
      repoRoot: string;
      currentSha: string;
    },
    logger: EndpointLogger,
    t: ImagePushT,
  ): void {
    ImagePushCleanup.removeOldImageTags(
      params.image,
      { phase: "afterPush", currentTag: params.currentTag },
      logger,
      t,
    );
    ImagePushCleanup.pruneBuildCache(logger, t);
    ImagePushCleanup.removeOldExports(
      params.buildRoot,
      params.repoRoot,
      params.currentSha,
      logger,
      t,
    );
  }

  /**
   * Pre-build check: when the docker root has less than MIN_FREE_GB free,
   * warn and (unless cleanup is off) prune old tags + stale build cache, so
   * the build does not fill the disk and starve the local dev databases.
   */
  static ensureFreeSpace(
    params: { image: string; cleanup: boolean },
    logger: EndpointLogger,
    t: ImagePushT,
  ): void {
    const path = ImagePushCleanup.dockerRootDir();
    const free = ImagePushCleanup.freeGb(path, logger, t);
    if (free === undefined || free >= MIN_FREE_GB) {
      return;
    }
    if (!params.cleanup) {
      logger.warn(
        t("post.repository.messages.diskLowNoCleanup", {
          free,
          path,
          min: MIN_FREE_GB,
        }),
      );
      return;
    }
    logger.warn(
      t("post.repository.messages.diskLow", { free, path, min: MIN_FREE_GB }),
    );
    ImagePushCleanup.removeOldImageTags(
      params.image,
      { phase: "beforeBuild" },
      logger,
      t,
    );
    ImagePushCleanup.pruneBuildCache(logger, t);
    const after = ImagePushCleanup.freeGb(path, logger, t);
    if (after !== undefined) {
      logger.info(
        t("post.repository.messages.diskAfterPrune", { free: after, path }),
      );
    }
  }

  private static docker(args: string[]): {
    ok: boolean;
    stdout: string;
    stderr: string;
  } {
    const result = spawnSync("docker", args, {
      encoding: "utf-8",
      maxBuffer: 64 * 1024 * 1024,
    });
    return {
      ok: result.status === 0 && !result.error,
      stdout: (result.stdout ?? "").trim(),
      stderr: (result.stderr ?? "").trim() || (result.error?.message ?? ""),
    };
  }

  private static dockerRootDir(): string {
    const info = ImagePushCleanup.docker([
      "info",
      "--format",
      "{{.DockerRootDir}}",
    ]);
    return info.ok && info.stdout ? info.stdout : "/var/lib/docker";
  }

  /** Free GB (one decimal) on the filesystem holding `path`. */
  private static freeGb(
    path: string,
    logger: EndpointLogger,
    t: ImagePushT,
  ): number | undefined {
    try {
      const stats = statfsSync(path);
      return Math.round(((stats.bavail * stats.bsize) / GB) * 10) / 10;
    } catch (error) {
      logger.warn(
        t("post.repository.messages.diskCheckFailed", {
          path,
          error: parseError(error).message,
        }),
      );
      return undefined;
    }
  }

  /**
   * Uses the existing low-disk retention before a build and the stricter
   * local policy after a push. Uses plain docker rmi and requires both the
   * image and container inventories before selecting refs.
   */
  private static removeOldImageTags(
    image: string,
    policy:
      | { phase: "beforeBuild" }
      | { phase: "afterPush"; currentTag: string | undefined },
    logger: EndpointLogger,
    t: ImagePushT,
  ): void {
    if (image !== CLEANUP_IMAGE_REPO) {
      logger.info(
        t("post.repository.messages.cleanupSkippedImage", {
          image,
          allowed: CLEANUP_IMAGE_REPO,
        }),
      );
      return;
    }

    const repositories =
      policy.phase === "afterPush" ? LOCAL_TRIMMED_REPOS : [CLEANUP_IMAGE_REPO];
    for (const repository of repositories) {
      ImagePushCleanup.removeOldTagsOf(repository, image, policy, logger, t);
    }
  }

  private static removeOldTagsOf(
    repository: string,
    image: string,
    policy:
      | { phase: "beforeBuild" }
      | { phase: "afterPush"; currentTag: string | undefined },
    logger: EndpointLogger,
    t: ImagePushT,
  ): void {
    const listed = ImagePushCleanup.docker([
      "images",
      "--no-trunc",
      "--format",
      "{{.Repository}}\t{{.Tag}}\t{{.ID}}\t{{.CreatedAt}}",
      repository,
    ]);
    const containers = ImagePushCleanup.containerImageIds();
    if (!listed.ok || containers === undefined) {
      logger.warn(
        t("post.repository.messages.cleanupListFailed", {
          image,
          error: listed.ok ? "docker ps" : listed.stderr,
        }),
      );
      return;
    }

    const entries: LocalImageEntry[] = listed.stdout
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [repo = "", tag = "", id = "", createdAt = ""] = line.split("\t");
        return { repository: repo, tag, id, createdAt };
      });
    const refs =
      policy.phase === "beforeBuild"
        ? selectImageRefsToRemove({
            repository: CLEANUP_IMAGE_REPO,
            entries,
            keepBuilds: KEEP_BUILDS,
            keepTags: PINNED_TAGS,
            containerImageIds: containers,
          })
        : selectLocalImageRefsToRemove({
            repository,
            entries,
            currentTag:
              repository === CLEANUP_IMAGE_REPO ? policy.currentTag : undefined,
            containerImageIds: containers,
          });
    if (refs === undefined) {
      logger.warn(
        t("post.repository.messages.cleanupCurrentMissing", { image }),
      );
      return;
    }

    const removed: string[] = [];
    for (const ref of refs) {
      const result = ImagePushCleanup.docker(["rmi", ref]);
      if (result.ok) {
        removed.push(ref);
      } else {
        logger.warn(
          t("post.repository.messages.cleanupTagFailed", {
            ref,
            error: result.stderr,
          }),
        );
      }
    }
    if (removed.length > 0) {
      logger.info(
        t("post.repository.messages.cleanupTagsRemoved", {
          count: removed.length,
          image: repository,
          tags: removed.join(", "),
        }),
      );
    }
  }

  /** Full image ids of every container (running or stopped). */
  private static containerImageIds(): string[] | undefined {
    const ids = ImagePushCleanup.docker(["ps", "-aq", "--no-trunc"]);
    if (!ids.ok) {
      return undefined;
    }
    const containerIds = ids.stdout.split("\n").filter(Boolean);
    if (containerIds.length === 0) {
      return [];
    }
    const images = ImagePushCleanup.docker([
      "inspect",
      "--format",
      "{{.Image}}",
      ...containerIds,
    ]);
    return images.ok ? images.stdout.split("\n").filter(Boolean) : undefined;
  }

  /**
   * Prune unused cache in two passes so the age filter cannot prevent Docker
   * from meeting the size target when recent cache alone exceeds it.
   */
  private static pruneBuildCache(logger: EndpointLogger, t: ImagePushT): void {
    const aged = ImagePushCleanup.pruneBuilder(
      ["--filter", `until=${String(BUILD_CACHE_KEEP_HOURS)}h`],
      logger,
      t,
    );
    if (aged !== undefined) {
      logger.info(
        t("post.repository.messages.cleanupCachePruned", {
          hours: BUILD_CACHE_KEEP_HOURS,
          reclaimed: aged,
        }),
      );
    }
    const excess = ImagePushCleanup.pruneBuilder(
      ["--max-used-space", `${String(BUILD_CACHE_KEEP_GB)}GB`],
      logger,
      t,
    );
    if (excess !== undefined) {
      logger.info(
        t("post.repository.messages.cleanupCacheCapped", {
          size: BUILD_CACHE_KEEP_GB,
          reclaimed: excess,
        }),
      );
    }
  }

  private static pruneBuilder(
    args: string[],
    logger: EndpointLogger,
    t: ImagePushT,
  ): string | undefined {
    const result = ImagePushCleanup.docker([
      "buildx",
      "prune",
      "--builder",
      IMAGE_BUILD_BUILDER,
      "--force",
      "--all",
      ...args,
    ]);
    if (!result.ok) {
      logger.warn(
        t("post.repository.messages.cleanupCacheFailed", {
          error: result.stderr,
        }),
      );
      return undefined;
    }
    return /Total:\s*(.+)$/m.exec(result.stdout)?.[1] ?? "0B";
  }

  /**
   * Deletes old commit export dirs and completion markers in
   * `.tmp/image-build/` (keeping the current and previous export), plus every
   * parked leftover under `.tmp/todelete/image-build*` beyond the newest
   * KEEP_EXPORTS entries per group. Build artifacts are disposable.
   */
  private static removeOldExports(
    buildRoot: string,
    repoRoot: string,
    currentSha: string,
    logger: EndpointLogger,
    t: ImagePushT,
  ): void {
    let removed = 0;
    let freedBytes = 0;
    const remove = (path: string): void => {
      try {
        freedBytes += ImagePushCleanup.sizeOf(path);
        rmSync(path, { recursive: true, force: true });
        removed += 1;
      } catch (error) {
        logger.warn(
          t("post.repository.messages.cleanupExportFailed", {
            dir: path,
            error: parseError(error).message,
          }),
        );
      }
    };

    if (existsSync(buildRoot)) {
      try {
        const entries = readdirSync(buildRoot, { withFileTypes: true }).map(
          (dirent) => ({
            name: dirent.name,
            isDirectory: dirent.isDirectory(),
            isFile: dirent.isFile(),
            mtimeMs: statSync(join(buildRoot, dirent.name)).mtimeMs,
          }),
        );
        const toRemove = selectExportEntriesToRemove({
          entries,
          currentSha,
          keep: KEEP_EXPORTS,
        });
        for (const names of toRemove.values()) {
          for (const name of names) {
            remove(join(buildRoot, name));
          }
        }
      } catch (error) {
        logger.warn(
          t("post.repository.messages.cleanupExportFailed", {
            dir: buildRoot,
            error: parseError(error).message,
          }),
        );
      }
    }

    // Leftovers parked by older versions and by the gate / re-export paths.
    const parkRoot = join(repoRoot, ".tmp", "todelete");
    if (existsSync(parkRoot)) {
      try {
        const names = readdirSync(parkRoot).filter(
          (name) =>
            name === "image-build" ||
            name === "image-build-gate" ||
            name.startsWith("image-build-"),
        );
        for (const name of names) {
          const full = join(parkRoot, name);
          if (name === "image-build" || name === "image-build-gate") {
            // Group dirs: keep the newest KEEP_EXPORTS children.
            const children = readdirSync(full)
              .map((child) => ({
                child,
                mtimeMs: statSync(join(full, child)).mtimeMs,
              }))
              .toSorted((a, b) => b.mtimeMs - a.mtimeMs)
              .slice(KEEP_EXPORTS);
            for (const { child } of children) {
              remove(join(full, child));
            }
          } else {
            remove(full);
          }
        }
      } catch (error) {
        logger.warn(
          t("post.repository.messages.cleanupExportFailed", {
            dir: parkRoot,
            error: parseError(error).message,
          }),
        );
      }
    }

    if (removed > 0) {
      logger.info(
        t("post.repository.messages.cleanupExportsParked", {
          count: removed,
          dir: `${buildRoot} (~${String(Math.round(freedBytes / GB))} GB freed)`,
        }),
      );
    }
  }

  /** Approximate size in bytes via `du -sk`; 0 when unreadable. */
  private static sizeOf(path: string): number {
    const result = spawnSync("du", ["-sk", path], { encoding: "utf8" });
    const kb = Number((result.stdout ?? "").split(/\s/)[0]);
    return Number.isFinite(kb) ? kb * 1024 : 0;
  }
}
