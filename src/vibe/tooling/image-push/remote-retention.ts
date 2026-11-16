/**
 * Prod server image retention for `vibe image-push` (Server 1 + Server 2).
 * Every deploy leaves its tags on the boxes (~13.7 GB per build on Server 2,
 * layers shared) and nothing removed them: Server 2 hit 98% disk on
 * 2026-11-16. After a node deployed healthy, image-push keeps on that node:
 * the image any container runs, the node's pinned rollback tags
 * (remotePinnedTags) and the newest KEEP_BUILDS builds of CLEANUP_IMAGE_REPO;
 * everything else of that repository is untagged with plain `docker rmi`
 * (never -f) and dangling images are pruned (never -a). Before a load it
 * checks free space and runs the same retention below REMOTE_MIN_FREE_GB.
 * Selection is pure (cleanup-selection.ts); this file only runs it over SSH.
 * Best effort: a failed step warns, never fails the deploy.
 */

import "server-only";

import type { EndpointLogger } from "../../logger/types";
import {
  CLEANUP_IMAGE_REPO,
  KEEP_BUILDS,
  parseRemoteInventory,
  REMOTE_MIN_FREE_GB,
  type RemoteInventory,
  remoteInventoryScript,
  type RemoteNode,
  remotePinnedTags,
  remoteRetentionScript,
  RETENTION_FAIL,
  RETENTION_OK,
  RETENTION_PRUNED,
  selectImageRefsToRemove,
} from "./cleanup-selection";
import type { ImagePushT } from "./i18n";

/** Runs a command on the box and returns its captured stdout. */
export type RemoteRunner = (
  cmd: string,
) => Promise<{ exitCode: number; stdout: string; error?: string }>;

/** One prod server as retention reaches it. */
export interface RetentionBox {
  node: RemoteNode;
  /** `user@host`, for log lines only. */
  target: string;
  run: RemoteRunner;
}

export class ImagePushRemoteRetention {
  /**
   * Before an image is loaded on `box`: below REMOTE_MIN_FREE_GB free, warn
   * and (unless `cleanup` is off) run retention with the pinned tags only.
   */
  static async beforeLoad(
    box: RetentionBox,
    params: { image: string; secondaryTag: string; cleanup: boolean },
    logger: EndpointLogger,
    t: ImagePushT,
  ): Promise<void> {
    if (params.image !== CLEANUP_IMAGE_REPO) {
      return;
    }
    const inventory = await ImagePushRemoteRetention.inventory(box, logger, t);
    if (!inventory || inventory.freeGb === undefined) {
      return;
    }
    const free = inventory.freeGb;
    if (free >= REMOTE_MIN_FREE_GB) {
      logger.info(
        t("post.repository.messages.remoteDiskOk", {
          target: box.target,
          free,
        }),
      );
      return;
    }
    if (!params.cleanup) {
      logger.warn(
        t("post.repository.messages.remoteDiskLowNoCleanup", {
          target: box.target,
          free,
          min: REMOTE_MIN_FREE_GB,
        }),
      );
      return;
    }
    logger.warn(
      t("post.repository.messages.remoteDiskLow", {
        target: box.target,
        free,
        min: REMOTE_MIN_FREE_GB,
      }),
    );
    await ImagePushRemoteRetention.retain(
      box,
      inventory,
      remotePinnedTags(box.node, params.secondaryTag),
      logger,
      t,
    );
    const after = await ImagePushRemoteRetention.inventory(box, logger, t);
    if (after?.freeGb !== undefined) {
      logger.info(
        t("post.repository.messages.remoteDiskAfter", {
          target: box.target,
          free: after.freeGb,
        }),
      );
    }
  }

  /**
   * After `box` deployed and passed its health check: keep the pinned tags,
   * the build just deployed (`currentTags`), any image a container uses and
   * the newest KEEP_BUILDS builds; untag the rest, prune dangling.
   */
  static async afterDeploy(
    box: RetentionBox,
    params: { image: string; secondaryTag: string; currentTags: string[] },
    logger: EndpointLogger,
    t: ImagePushT,
  ): Promise<void> {
    if (params.image !== CLEANUP_IMAGE_REPO) {
      return;
    }
    const inventory = await ImagePushRemoteRetention.inventory(box, logger, t);
    if (!inventory) {
      return;
    }
    await ImagePushRemoteRetention.retain(
      box,
      inventory,
      [
        ...remotePinnedTags(box.node, params.secondaryTag),
        ...params.currentTags,
      ],
      logger,
      t,
    );
  }

  /** Lists images, containers and free space; undefined = do nothing. */
  private static async inventory(
    box: RetentionBox,
    logger: EndpointLogger,
    t: ImagePushT,
  ): Promise<RemoteInventory | undefined> {
    const result = await box.run(remoteInventoryScript(CLEANUP_IMAGE_REPO));
    const inventory =
      result.error === undefined && result.exitCode === 0
        ? parseRemoteInventory(result.stdout)
        : undefined;
    if (!inventory) {
      logger.warn(
        t("post.repository.messages.remoteListFailed", {
          target: box.target,
          error:
            result.error ??
            t("post.repository.messages.scriptRemoteExit", {
              code: result.exitCode,
            }),
        }),
      );
    }
    return inventory;
  }

  private static async retain(
    box: RetentionBox,
    inventory: RemoteInventory,
    keepTags: string[],
    logger: EndpointLogger,
    t: ImagePushT,
  ): Promise<void> {
    const refs = selectImageRefsToRemove({
      repository: CLEANUP_IMAGE_REPO,
      entries: inventory.entries,
      keepBuilds: KEEP_BUILDS,
      keepTags,
      containerImageIds: inventory.containerImageIds,
    });
    const result = await box.run(remoteRetentionScript(refs));
    if (result.error !== undefined) {
      logger.warn(
        t("post.repository.messages.remoteListFailed", {
          target: box.target,
          error: result.error,
        }),
      );
      return;
    }
    const removed: string[] = [];
    let pruned = "";
    for (const line of result.stdout.split("\n")) {
      if (line.startsWith(`${RETENTION_OK} `)) {
        removed.push(line.slice(RETENTION_OK.length + 1).trim());
      } else if (line.startsWith(`${RETENTION_FAIL} `)) {
        const [ref = "", ...error] = line
          .slice(RETENTION_FAIL.length + 1)
          .split(" ");
        logger.warn(
          t("post.repository.messages.remoteTagFailed", {
            target: box.target,
            ref,
            error: error.join(" "),
          }),
        );
      } else if (line.startsWith(`${RETENTION_PRUNED} `)) {
        pruned = line.slice(RETENTION_PRUNED.length + 1).trim();
      }
    }
    logger.info(
      t("post.repository.messages.remoteRetained", {
        target: box.target,
        count: removed.length,
        keep: KEEP_BUILDS,
        tags: removed.length > 0 ? removed.join(", ") : "-",
        pruned: pruned || "-",
      }),
    );
  }
}
