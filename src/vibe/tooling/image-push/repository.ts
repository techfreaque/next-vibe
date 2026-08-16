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

import type { ResponseType } from "../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../core/route/response.schema";
import { parseError } from "../../core/utils/parse-error";
import type { EndpointLogger } from "../../logger/types";
import type {
  ImagePushRequestOutput,
  ImagePushResponseOutput,
} from "./definition";
import { imagePushEnv } from "./env";
import type { ImagePushT } from "./i18n";

export class ImagePushRepository {
  static async execute(
    data: ImagePushRequestOutput,
    logger: EndpointLogger,
    t: ImagePushT,
  ): Promise<ResponseType<ImagePushResponseOutput>> {
    const startTime = Date.now();
    const image = data.image ?? imagePushEnv.DOCKER_IMAGE_NAME;
    const sshTarget = data.sshTarget ?? imagePushEnv.SSH_SERVER;

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
      "--network=host",
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
        message: t("post.repository.messages.dockerBuildFailed", {
          error: buildResult.error.message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
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
        message: t("post.repository.messages.dockerBuildFailed", {
          error: detail,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    if (sshTarget) {
      const transferResult = await ImagePushRepository.transferViaSsh(
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
   * server over SSH: `docker save <refs> | ssh <target> "docker load"`.
   * Uses SSH_SERVER_PWD for password auth when set (via ssh2 - no `sshpass`
   * binary needed, works on Windows dev machines too); otherwise falls back
   * to the operator's own SSH key/agent via the system `ssh` client.
   */
  private static async transferViaSsh(
    refs: string[],
    sshTarget: string,
    logger: EndpointLogger,
    t: ImagePushT,
  ): Promise<ResponseType<void>> {
    logger.info(
      t("post.repository.messages.sshTransferStart", {
        refs: refs.join(", "),
        target: sshTarget,
      }),
    );

    if (imagePushEnv.SSH_SERVER_PWD) {
      return Promise.resolve(
        ImagePushRepository.transferViaSshPassword(
          refs,
          sshTarget,
          imagePushEnv.SSH_SERVER_PWD,
          logger,
          t,
        ),
      );
    }

    const sshOpts =
      "-oServerAliveInterval=30 -oServerAliveCountMax=10 -oTCPKeepAlive=yes -oStrictHostKeyChecking=no";
    const refList = refs.map((ref) => `"${ref}"`).join(" ");
    const remoteRmi = refs.join(" ");
    // gzip cuts ~5 GB to ~2 GB in flight; concurrent save|gzip|ssh|gunzip|load
    // is faster than sequential save-then-copy, and finishes well under any
    // SSH idle-timeout that would kill a raw 5 GB stream.
    // docker rmi before load so the old image is deleted rather than renamed to <none>.
    const pipeline = `docker save ${refList} | gzip -1 | ssh ${sshOpts} ${sshTarget} "docker rmi -f ${remoteRmi} 2>/dev/null; gunzip | docker load; docker image prune -f"`;
    const transferResult = spawnSync("sh", ["-c", pipeline], {
      stdio: "inherit",
      cwd: process.cwd(),
    });

    if (transferResult.error) {
      return fail({
        message: t("post.repository.messages.sshTransferFailed", {
          target: sshTarget,
          error: transferResult.error.message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    if (transferResult.status !== 0) {
      return fail({
        message: t("post.repository.messages.sshTransferFailed", {
          target: sshTarget,
          error: t("post.repository.messages.buildExitCode", {
            code: transferResult.status ?? -1,
          }),
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    return success(undefined);
  }

  /** Parses `user@host` or `user@host:port` into its parts (defaults: root, port 22) */
  private static parseSshTarget(sshTarget: string): {
    username: string;
    host: string;
    port: number;
  } {
    const [userHost, portStr] = sshTarget.split(":");
    const atIndex = userHost.indexOf("@");
    const username = atIndex >= 0 ? userHost.slice(0, atIndex) : "root";
    const host = atIndex >= 0 ? userHost.slice(atIndex + 1) : userHost;
    return { username, host, port: portStr ? parseInt(portStr, 10) : 22 };
  }

  /** Same gzip pipe as transferViaSsh but authenticates via sshpass. */
  private static transferViaSshPassword(
    refs: string[],
    sshTarget: string,
    password: string,
    logger: EndpointLogger,
    t: ImagePushT,
  ): ResponseType<void> {
    const { port } = ImagePushRepository.parseSshTarget(sshTarget);
    const sshOpts = `-oServerAliveInterval=30 -oServerAliveCountMax=10 -oTCPKeepAlive=yes -oStrictHostKeyChecking=no -oPort=${String(port)}`;
    const refList = refs.map((ref) => `"${ref}"`).join(" ");
    const remoteRmi = refs.join(" ");
    const pipeline = `docker save ${refList} | gzip -1 | sshpass -p ${JSON.stringify(password)} ssh ${sshOpts} ${sshTarget} "docker rmi -f ${remoteRmi} 2>/dev/null; gunzip | docker load; docker image prune -f"`;
    const result = spawnSync("sh", ["-c", pipeline], {
      stdio: "inherit",
      cwd: process.cwd(),
    });

    if (result.error) {
      logger.error("SSH image transfer invocation failed", {
        error: result.error.message,
      });
      return fail({
        message: t("post.repository.messages.sshTransferFailed", {
          target: sshTarget,
          error: result.error.message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    if (result.status !== 0) {
      logger.error("SSH image transfer failed", { exitCode: result.status });
      return fail({
        message: t("post.repository.messages.sshTransferFailed", {
          target: sshTarget,
          error: t("post.repository.messages.buildExitCode", {
            code: result.status ?? -1,
          }),
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
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
          message: t("post.repository.messages.gitShaFailed"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      return success(sha);
    } catch (error) {
      logger.error("Failed to resolve git SHA", parseError(error));
      // The success-path branch above reports gitShaFailed without a cause, so
      // the variant carrying the thrown error needs its own key.
      return fail({
        message: t("post.repository.messages.gitShaFailedDetail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
