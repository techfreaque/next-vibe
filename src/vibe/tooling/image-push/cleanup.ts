/**
 * Local build-machine cleanup for `vibe image-push`.
 * Keeps the machine that BUILDS the image bounded: one 6 GB tag per deploy
 * plus an ever-growing BuildKit cache filled the dev box's root partition
 * (266 GB of cache, ~40 old tags) and took Hermes' Postgres down with it.
 * Only this machine's docker and `.tmp/image-build/` are touched. Remote
 * servers keep their own rollback rules (install-docker.sh, deploy-ha-node.sh).
 * Best effort throughout: a failed cleanup step only warns, never fails the
 * deploy that already succeeded. Nothing is ever `rm`ed: export dirs move to
 * `.tmp/todelete/image-build/`.
 */

import "server-only";

import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  statfsSync,
  statSync,
} from "node:fs";
import { join } from "node:path";

import { parseError } from "../../core/utils/parse-error";
import type { EndpointLogger } from "../../logger/types";
import {
  BUILD_CACHE_KEEP_HOURS,
  CLEANUP_IMAGE_REPO,
  type ExportDirEntry,
  KEEP_BUILDS,
  type LocalImageEntry,
  MIN_FREE_GB,
  PINNED_TAGS,
  selectExportDirsToPark,
  selectImageRefsToRemove,
} from "./cleanup-selection";
import type { ImagePushT } from "./i18n";

const GB = 1024 ** 3;

export class ImagePushCleanup {
  /**
   * Post-deploy cleanup: old local tags of the app image, build cache older
   * than BUILD_CACHE_KEEP_HOURS, and export dirs beyond the newest KEEP_BUILDS.
   */
  static afterDeploy(
    params: {
      image: string;
      /** Tags of the build just deployed (always kept). */
      currentTags: string[];
      buildRoot: string;
      repoRoot: string;
      currentSha: string;
    },
    logger: EndpointLogger,
    t: ImagePushT,
  ): void {
    ImagePushCleanup.removeOldImageTags(
      params.image,
      params.currentTags,
      logger,
      t,
    );
    ImagePushCleanup.pruneBuildCache(logger, t);
    ImagePushCleanup.parkOldExports(
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
    ImagePushCleanup.removeOldImageTags(params.image, [], logger, t);
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
   * Untags builds of CLEANUP_IMAGE_REPO older than the newest KEEP_BUILDS.
   * Never `-f`: docker itself refuses to drop an image a container uses, on
   * top of the container check in the selection. Aborts (removes nothing)
   * when the image or container list cannot be read.
   */
  private static removeOldImageTags(
    image: string,
    currentTags: string[],
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

    const listed = ImagePushCleanup.docker([
      "images",
      "--no-trunc",
      "--format",
      "{{.Repository}}\t{{.Tag}}\t{{.ID}}\t{{.CreatedAt}}",
      CLEANUP_IMAGE_REPO,
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
        const [repository = "", tag = "", id = "", createdAt = ""] =
          line.split("\t");
        return { repository, tag, id, createdAt };
      });
    const refs = selectImageRefsToRemove({
      repository: CLEANUP_IMAGE_REPO,
      entries,
      keepBuilds: KEEP_BUILDS,
      keepTags: [...PINNED_TAGS, ...currentTags],
      containerImageIds: containers,
    });

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
          image,
          keep: KEEP_BUILDS,
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

  /** Drops build cache older than BUILD_CACHE_KEEP_HOURS; keeps recent layers. */
  private static pruneBuildCache(logger: EndpointLogger, t: ImagePushT): void {
    const result = ImagePushCleanup.docker([
      "builder",
      "prune",
      "-f",
      "--filter",
      `until=${String(BUILD_CACHE_KEEP_HOURS)}h`,
    ]);
    if (!result.ok) {
      logger.warn(
        t("post.repository.messages.cleanupCacheFailed", {
          error: result.stderr,
        }),
      );
      return;
    }
    const reclaimed = /Total:\s*(.+)$/m.exec(result.stdout)?.[1] ?? "0B";
    logger.info(
      t("post.repository.messages.cleanupCachePruned", {
        hours: BUILD_CACHE_KEEP_HOURS,
        reclaimed,
      }),
    );
  }

  /**
   * Moves `.tmp/image-build/<sha>/` (+ its `<sha>.done` marker) beyond the
   * newest KEEP_BUILDS to `.tmp/todelete/image-build/`. Never deletes.
   */
  private static parkOldExports(
    buildRoot: string,
    repoRoot: string,
    currentSha: string,
    logger: EndpointLogger,
    t: ImagePushT,
  ): void {
    if (!existsSync(buildRoot)) {
      return;
    }
    const parkRoot = join(repoRoot, ".tmp", "todelete", "image-build");
    let entries: ExportDirEntry[];
    try {
      entries = readdirSync(buildRoot, { withFileTypes: true }).map(
        (dirent) => {
          const marker = join(buildRoot, `${dirent.name}.done`);
          const statPath = existsSync(marker)
            ? marker
            : join(buildRoot, dirent.name);
          return {
            name: dirent.name,
            isDirectory: dirent.isDirectory(),
            mtimeMs: statSync(statPath).mtimeMs,
          };
        },
      );
      mkdirSync(parkRoot, { recursive: true });
    } catch (error) {
      logger.warn(
        t("post.repository.messages.cleanupExportFailed", {
          dir: buildRoot,
          error: parseError(error).message,
        }),
      );
      return;
    }

    const names = selectExportDirsToPark({
      entries,
      keep: KEEP_BUILDS,
      currentSha,
    });
    let parked = 0;
    for (const name of names) {
      const source = join(buildRoot, name);
      const taken = existsSync(join(parkRoot, name));
      const destName = taken ? `${name}-${String(Date.now())}` : name;
      try {
        renameSync(source, join(parkRoot, destName));
        const marker = join(buildRoot, `${name}.done`);
        if (existsSync(marker)) {
          renameSync(marker, join(parkRoot, `${destName}.done`));
        }
        parked += 1;
      } catch (error) {
        logger.warn(
          t("post.repository.messages.cleanupExportFailed", {
            dir: source,
            error: parseError(error).message,
          }),
        );
      }
    }
    if (parked > 0) {
      logger.info(
        t("post.repository.messages.cleanupExportsParked", {
          count: parked,
          dir: parkRoot,
        }),
      );
    }
  }
}
