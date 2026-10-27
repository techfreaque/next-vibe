/**
 * Build & Push Image Repository
 * Builds the production Docker image via buildx and either pushes it to a
 * registry or transfers it directly to a server over SSH (docker save | ssh
 * | docker load) - no registry, no credentials beyond the operator's own SSH
 * access. Meant to run on a machine with real RAM headroom (a dev machine or
 * CI) - never on the deploy server itself, which is why it exists.
 */

import "server-only";

import { spawn, spawnSync } from "node:child_process";
import type { Readable } from "node:stream";
import { createGzip } from "node:zlib";

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

      const deployResult = await ImagePushRepository.runDeployScript(
        sshTarget,
        logger,
        t,
      );
      if (!deployResult.success) {
        return deployResult;
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
   * server over SSH: `docker save <ref> | gzip | ssh <target> "docker load"`.
   * The pipe runs in-process (Node zlib + streams) - no `sh`, `gzip` or
   * `sshpass` binaries needed, so it works the same on Windows and Linux.
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

    // Save only the SHA-tagged ref - docker save with multiple tags of the same
    // image produces one archive but the tag metadata can get lost on load.
    // We retag as :latest explicitly after load so docker compose picks it up.
    const shaRef = refs[0] ?? "";
    const latestRef =
      refs.find((r) => r.endsWith(":latest")) ??
      `${shaRef.split(":")[0]}:latest`;
    // docker rmi before load so the old image is deleted rather than renamed to <none>.
    const remoteCmd = `docker rmi -f ${refs.join(" ")} 2>/dev/null; gunzip | docker load && docker tag ${shaRef} ${latestRef}`;

    const save = spawn("docker", ["save", shaRef], {
      stdio: ["ignore", "pipe", "inherit"],
      cwd: process.cwd(),
    });
    const saveExit = new Promise<number>((resolve) => {
      save.on("error", () => resolve(-1));
      save.on("close", (code) => resolve(code ?? -1));
    });
    // gzip cuts ~5 GB to ~2 GB in flight; concurrent save|gzip|ssh|gunzip|load
    // is faster than sequential save-then-copy.
    const gzipped = save.stdout.pipe(createGzip({ level: 1 }));

    const remoteResult = await ImagePushRepository.runRemote(
      sshTarget,
      remoteCmd,
      gzipped,
    );
    const saveCode = await saveExit;

    let error = remoteResult.error;
    if (error === undefined && saveCode !== 0) {
      error = t("post.repository.messages.buildExitCode", { code: saveCode });
    }
    if (error === undefined && remoteResult.exitCode !== 0) {
      error = t("post.repository.messages.buildExitCode", {
        code: remoteResult.exitCode,
      });
    }

    if (error !== undefined) {
      logger.error("SSH image transfer failed", {
        saveExitCode: saveCode,
        remoteExitCode: remoteResult.exitCode,
      });
      return fail({
        message: t("post.repository.messages.sshTransferFailed", {
          target: sshTarget,
          error,
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
    const [userHost = "", portStr] = sshTarget.split(":");
    const atIndex = userHost.indexOf("@");
    const username = atIndex >= 0 ? userHost.slice(0, atIndex) : "root";
    const host = atIndex >= 0 ? userHost.slice(atIndex + 1) : userHost;
    return { username, host, port: portStr ? parseInt(portStr, 10) : 22 };
  }

  /**
   * Runs a command on the SSH target, streaming its output to this terminal
   * and optionally piping `stdin` into it. Authenticates with SSH_SERVER_PWD
   * via ssh2 when set, otherwise uses the system `ssh` client (key/agent auth).
   */
  private static async runRemote(
    sshTarget: string,
    remoteCmd: string,
    stdin?: Readable,
  ): Promise<{ exitCode: number; error?: string }> {
    const { username, host, port } =
      ImagePushRepository.parseSshTarget(sshTarget);
    const password = imagePushEnv.SSH_SERVER_PWD;

    if (!password) {
      return new Promise((resolve) => {
        const child = spawn(
          "ssh",
          [
            "-oServerAliveInterval=30",
            "-oServerAliveCountMax=10",
            "-oTCPKeepAlive=yes",
            "-oStrictHostKeyChecking=no",
            `-oPort=${String(port)}`,
            `${username}@${host}`,
            remoteCmd,
          ],
          {
            stdio: [stdin ? "pipe" : "inherit", "inherit", "inherit"],
            cwd: process.cwd(),
          },
        );
        if (stdin && child.stdin) {
          stdin.pipe(child.stdin);
        }
        child.on("error", (err) =>
          resolve({ exitCode: -1, error: err.message }),
        );
        child.on("close", (code) => resolve({ exitCode: code ?? -1 }));
      });
    }

    // Dynamic import keeps ssh2 out of Turbopack's static NFT trace.
    const { Client } = await import(/* turbopackIgnore: true */ "ssh2");
    return new Promise((resolve) => {
      const client = new Client();
      let settled = false;
      const settle = (result: { exitCode: number; error?: string }): void => {
        if (settled) {
          return;
        }
        settled = true;
        client.end();
        resolve(result);
      };

      client.on("error", (err) => settle({ exitCode: -1, error: err.message }));
      client.on("ready", () => {
        client.exec(remoteCmd, (err, channel) => {
          if (err) {
            settle({ exitCode: -1, error: err.message });
            return;
          }
          channel.pipe(process.stdout, { end: false });
          channel.stderr.pipe(process.stderr, { end: false });
          channel.on("exit", (code: number | null) => {
            settle({ exitCode: code ?? -1 });
          });
          channel.on("close", () => settle({ exitCode: -1 }));
          if (stdin) {
            stdin.pipe(channel);
          } else {
            channel.end();
          }
        });
      });
      client.connect({
        host,
        port,
        username,
        password,
        keepaliveInterval: 30_000,
        keepaliveCountMax: 10,
      });
    });
  }

  /**
   * Runs the deploy script on the SSH target after the image is available there.
   * Skipped when SSH_DEPLOY_SCRIPT is empty.
   */
  private static async runDeployScript(
    sshTarget: string,
    logger: EndpointLogger,
    t: ImagePushT,
  ): Promise<ResponseType<void>> {
    const script = imagePushEnv.SSH_DEPLOY_SCRIPT;
    if (!script) {
      return success(undefined);
    }

    logger.info("Running deploy script on remote server", {
      sshTarget,
      script,
    });

    // Run the deploy script. Strip git lines (the image is the deploy unit, not
    // the checkout) and run from the project root so docker compose -f resolves.
    // The stripped script runs from a temp file, NOT piped into `bash` - piped,
    // bash reads the script from stdin and the first stdin-forwarding command in
    // it (`docker compose exec -T`) swallows the rest, so bash exits 0 having
    // skipped the pull, migrations and container swap.
    const scriptDir = script.split("/").slice(0, -1).join("/") || "/";
    const projectDir = scriptDir.endsWith("/scripts")
      ? scriptDir.slice(0, -"/scripts".length)
      : scriptDir;
    const remoteCmd = `cd ${projectDir} && f=$(mktemp) && grep -v "^git " ${script} > "$f"; bash "$f" < /dev/null; rc=$?; rm -f "$f"; exit $rc`;

    const result = await ImagePushRepository.runRemote(sshTarget, remoteCmd);

    if (result.error !== undefined || result.exitCode !== 0) {
      logger.error("Deploy script failed", {
        exitCode: result.exitCode,
        error: result.error,
      });
      return fail({
        message: t("post.repository.messages.sshTransferFailed", {
          target: sshTarget,
          error:
            result.error ??
            t("post.repository.messages.buildExitCode", {
              code: result.exitCode,
            }),
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    logger.info("Deploy script completed successfully", { sshTarget });
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
