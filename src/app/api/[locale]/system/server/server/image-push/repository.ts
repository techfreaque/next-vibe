/**
 * Build & Push Image Repository
 * Builds the production Docker image via buildx and either pushes it to a
 * registry or transfers it directly to a server over SSH (docker save | ssh
 * | docker load) - no registry, no credentials beyond the operator's own SSH
 * access. Meant to run on a machine with real RAM headroom (a dev machine or
 * CI) - never on the deploy server itself, which is why it exists.
 */

import "server-only";

import { spawnSync } from "node:child_process";

import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import { env } from "@/config/env";

import type { ImagePushT } from "./i18n";
import type {
  ImagePushRequestOutput,
  ImagePushResponseOutput,
} from "./definition";

export class ImagePushRepository {
  static execute(
    data: ImagePushRequestOutput,
    logger: EndpointLogger,
    t: ImagePushT,
  ): ResponseType<ImagePushResponseOutput> {
    const startTime = Date.now();
    const image = data.image ?? env.DOCKER_IMAGE_NAME;
    const sshTarget = data.sshTarget;

    const shaResult = ImagePushRepository.resolveTag(data.tag, logger, t);
    if (!shaResult.success) {
      return shaResult;
    }
    const tag = shaResult.data;

    const tags = [...new Set([tag, "latest"])];
    const refs = tags.map((tagName) => `${image}:${tagName}`);

    logger.info(t("post.repository.messages.buildStart", { image, tag }));

    // ssh transfer needs the image loaded into this machine's local docker
    // (to `docker save` it), same as a build-only run - only a registry push
    // uses buildx's own --push.
    const args = [
      "buildx",
      "build",
      "--platform",
      data.platform,
      "-f",
      "Dockerfile",
      ...refs.flatMap((ref) => ["-t", ref]),
      sshTarget || !data.push ? "--load" : "--push",
      ".",
    ];

    const buildResult = spawnSync("docker", args, {
      stdio: "inherit",
      cwd: process.cwd(),
    });

    if (buildResult.error) {
      logger.error("Docker buildx invocation failed", {
        error: buildResult.error.message,
      });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: buildResult.error.message },
      });
    }

    if (buildResult.status !== 0) {
      const detail =
        buildResult.signal !== null
          ? t("post.repository.messages.buildKilled", {
              signal: buildResult.signal,
            })
          : t("post.repository.messages.buildExitCode", {
              code: buildResult.status ?? -1,
            });
      logger.error("Docker image build failed", {
        exitCode: buildResult.status,
        signal: buildResult.signal,
      });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: detail },
      });
    }

    if (sshTarget) {
      const transferResult = ImagePushRepository.transferViaSsh(
        refs,
        sshTarget,
        logger,
        t,
      );
      if (!transferResult.success) {
        return transferResult;
      }

      return success({
        success: true,
        output: t("post.repository.messages.sshTransferSuccess", {
          refs: refs.join(", "),
          target: sshTarget,
        }),
        resolvedImage: image,
        tags,
        duration: Date.now() - startTime,
      });
    }

    const output = data.push
      ? t("post.repository.messages.pushSuccess", { refs: refs.join(", ") })
      : t("post.repository.messages.buildSuccess", { refs: refs.join(", ") });

    return success({
      success: true,
      output,
      resolvedImage: image,
      tags,
      duration: Date.now() - startTime,
    });
  }

  /**
   * Transfers the already-built (docker --load'ed) image directly to a
   * server over SSH: `docker save <refs> | ssh <target> "docker load"`. Uses
   * the operator's own SSH key/config - the same trust boundary as running
   * ssh themselves, no separate credentials to manage.
   */
  private static transferViaSsh(
    refs: string[],
    sshTarget: string,
    logger: EndpointLogger,
    t: ImagePushT,
  ): ResponseType<void> {
    logger.info(
      t("post.repository.messages.sshTransferStart", {
        refs: refs.join(", "),
        target: sshTarget,
      }),
    );

    const refList = refs.map((ref) => `"${ref}"`).join(" ");
    const pipeline = `docker save ${refList} | ssh ${sshTarget} "docker load"`;

    const transferResult = spawnSync("sh", ["-c", pipeline], {
      stdio: "inherit",
      cwd: process.cwd(),
    });

    if (transferResult.error) {
      logger.error("SSH image transfer invocation failed", {
        error: transferResult.error.message,
      });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: t("post.repository.messages.sshTransferFailed", {
            target: sshTarget,
            error: transferResult.error.message,
          }),
        },
      });
    }

    if (transferResult.status !== 0) {
      const detail =
        transferResult.signal !== null
          ? t("post.repository.messages.buildKilled", {
              signal: transferResult.signal,
            })
          : t("post.repository.messages.buildExitCode", {
              code: transferResult.status ?? -1,
            });
      logger.error("SSH image transfer failed", {
        exitCode: transferResult.status,
        signal: transferResult.signal,
      });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: t("post.repository.messages.sshTransferFailed", {
            target: sshTarget,
            error: detail,
          }),
        },
      });
    }

    return success(undefined);
  }

  /** Uses the request tag override, or resolves the current short git commit SHA */
  private static resolveTag(
    tagOverride: string | undefined,
    logger: EndpointLogger,
    t: ImagePushT,
  ): ResponseType<string> {
    if (tagOverride) {
      return success(tagOverride);
    }

    try {
      const result = spawnSync("git", ["rev-parse", "--short", "HEAD"], {
        cwd: process.cwd(),
        encoding: "utf-8",
      });
      const sha = result.stdout.trim();
      if (result.status !== 0 || !sha) {
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: { error: t("post.repository.messages.gitShaFailed") },
        });
      }
      return success(sha);
    } catch (error) {
      logger.error("Failed to resolve git SHA", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}
