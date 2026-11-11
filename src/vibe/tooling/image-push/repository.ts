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
   *
   * When a password is set AND the `sshpass` + `gzip` binaries are available,
   * the whole thing runs as ONE shell pipeline via system binaries. This is the
   * only form that survives a multi-GB upload unattended: both ssh2 and a
   * plain-`ssh` child fed by Node's zlib stream stall ~5 min in on a multi-GB
   * push ("unexpected EOF" at the remote `gunzip`), because Node's stream
   * back-pressure over the child stdin pipe starves the upload. A pure
   * shell pipeline (`docker save | gzip -1 | sshpass -e ssh ... "gunzip |
   * docker load"`) keeps the bytes flowing through OS pipes end to end and
   * transfers reliably (proven by the manual deploy command).
   *
   * Falls back to the in-process pipe (Node zlib + streams via `runRemote`)
   * when `sshpass`/`gzip` are unavailable (e.g. Windows / no-sshpass hosts),
   * so those environments still work.
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
    const imageName = shaRef.split(":")[0] ?? "";
    const latestRef =
      refs.find((r) => r.endsWith(":latest")) ?? `${imageName}:latest`;
    const rollbackRef = `${imageName}:rollback`;
    // Rollback-safe swap (NEVER `docker rmi -f :latest` here - that was the
    // footgun that deleted the only rollback image and, with the deploy
    // script's `system prune -a`, left no way back):
    //   1. Point :rollback at whatever :latest currently is (the running image),
    //      so a bad deploy can be reverted by retagging :rollback -> :latest.
    //   2. Load the new image and move :latest onto its SHA.
    //   3. Drop ONLY the incoming SHA ref if it already existed (avoids a
    //      dangling <none>); leave :latest and :rollback intact.
    // The compose app service is recreated by the deploy script, not here, so
    // this step only manages tags and never touches the running container.
    const remoteCmd =
      `docker tag ${latestRef} ${rollbackRef} 2>/dev/null; ` +
      `docker rmi ${shaRef} 2>/dev/null; ` +
      `gunzip | docker load && docker tag ${shaRef} ${latestRef}`;

    const password = imagePushEnv.SSH_SERVER_PWD;
    // Only the shell pipeline survives a large unattended upload (see doc above).
    // It needs a password (for `sshpass -e`) plus the `sshpass` and `gzip`
    // binaries; otherwise fall back to the in-process pipe.
    if (password && ImagePushRepository.shellPipelineAvailable()) {
      return ImagePushRepository.transferViaShellPipeline(
        shaRef,
        refs,
        sshTarget,
        password,
        remoteCmd,
        logger,
        t,
      );
    }

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

  /** True when both `sshpass` and `gzip` system binaries are callable. */
  private static shellPipelineAvailable(): boolean {
    const hasSshpass =
      spawnSync("sshpass", ["-V"], { stdio: "ignore" }).status === 0;
    const hasGzip =
      spawnSync("gzip", ["--version"], { stdio: "ignore" }).status === 0;
    return hasSshpass && hasGzip;
  }

  /** Single-quotes a value for safe embedding in a POSIX `sh -c` string. */
  private static shellQuote(value: string): string {
    return `'${value.replace(/'/g, `'\\''`)}'`;
  }

  /**
   * Runs the transfer as one OS-level shell pipeline, replicating the proven
   * manual deploy command:
   *   docker save <sha> | gzip -1 | sshpass -e ssh <opts> <target> "<remoteCmd>"
   * The password is handed to `sshpass` through the SSHPASS env var only -
   * never in argv and never logged. Exit status is the pipeline's (ssh's),
   * so a remote failure surfaces as a non-zero code -> fail().
   */
  private static async transferViaShellPipeline(
    shaRef: string,
    refs: string[],
    sshTarget: string,
    password: string,
    remoteCmd: string,
    logger: EndpointLogger,
    t: ImagePushT,
  ): Promise<ResponseType<void>> {
    const { username, host, port } =
      ImagePushRepository.parseSshTarget(sshTarget);
    const q = ImagePushRepository.shellQuote;

    const sshOpts = [
      "-oStrictHostKeyChecking=no",
      "-oServerAliveInterval=30",
      "-oServerAliveCountMax=10000",
      "-oTCPKeepAlive=yes",
      `-oPort=${q(String(port))}`,
    ].join(" ");

    const pipeline =
      `docker save ${q(shaRef)} | gzip -1 | ` +
      `sshpass -e ssh ${sshOpts} ${q(`${username}@${host}`)} ${q(remoteCmd)}`;

    const exitCode = await new Promise<number>((resolve) => {
      const child = spawn("sh", ["-c", pipeline], {
        stdio: "inherit",
        cwd: process.cwd(),
        // SSHPASS reaches sshpass via the env only - never argv, never logs.
        env: { ...process.env, SSHPASS: password },
      });
      child.on("error", () => resolve(-1));
      child.on("close", (code) => resolve(code ?? -1));
    });

    if (exitCode !== 0) {
      logger.error("SSH image transfer failed", {
        refs,
        pipelineExitCode: exitCode,
      });
      return fail({
        message: t("post.repository.messages.sshTransferFailed", {
          target: sshTarget,
          error: t("post.repository.messages.buildExitCode", {
            code: exitCode,
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

    // Prefer the system `ssh` client for every call. ssh2's app-level keepalive
    // is reset only by INBOUND packets, so a multi-GB `docker save | ssh docker
    // load` upload (almost entirely outbound) trips keepaliveCountMax mid-stream
    // and the remote `gunzip` sees a truncated archive ("unexpected EOF"). The OS
    // ssh client streams large uploads reliably. `sshpass -e` feeds SSH_SERVER_PWD
    // through the SSHPASS env (never argv) when a password is set; the ssh2 library
    // below is only a fallback for when the `sshpass` binary is unavailable.
    const sshpassAvailable =
      !password ||
      spawnSync("sshpass", ["-V"], { stdio: "ignore" }).status === 0;

    if (sshpassAvailable) {
      const sshArgs = [
        "-oServerAliveInterval=30",
        "-oServerAliveCountMax=10000",
        "-oTCPKeepAlive=yes",
        "-oStrictHostKeyChecking=no",
        `-oPort=${String(port)}`,
        `${username}@${host}`,
        remoteCmd,
      ];
      return new Promise((resolve) => {
        const child = password
          ? spawn("sshpass", ["-e", "ssh", ...sshArgs], {
              stdio: [stdin ? "pipe" : "inherit", "inherit", "inherit"],
              cwd: process.cwd(),
              env: { ...process.env, SSHPASS: password },
            })
          : spawn("ssh", sshArgs, {
              stdio: [stdin ? "pipe" : "inherit", "inherit", "inherit"],
              cwd: process.cwd(),
            });
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
        // ssh2's keepalive counter is reset only by inbound SSH packets, not by
        // outbound upload bytes. A multi-GB `docker save | ssh docker load` push
        // sends for many minutes while receiving nothing, so a low countMax trips
        // mid-transfer and force-closes the connection -> remote `gunzip` sees a
        // truncated stream ("unexpected EOF"). 240 * 30s = 2h ceiling: generous
        // enough for any image transfer, still bounded for a genuinely dead link.
        keepaliveCountMax: 240,
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

    // Run the deploy script. The image is the deploy unit, not the checkout, so
    // we must NOT let the script git-reset the checkout: that reset reverts any
    // locally-patched scripts/install-docker.sh (e.g. the rollback-safe prune)
    // back to origin, which silently reintroduced the `docker system prune -a`
    // footgun that deletes the :rollback image on every deploy. The script
    // supports NO_GIT_RESET=1 to skip its whole git-fetch/reset `if` block, so we
    // set that env var. We do NOT grep the git lines out: they sit INSIDE an
    // `if ...; then ... fi` block, and deleting the body lines leaves a dangling
    // `fi` ("syntax error near unexpected token `fi'"). NO_GIT_RESET=1 skips the
    // whole block cleanly via the script's own guard, so no stripping is needed.
    // The script runs from a temp file, NOT piped into `bash` - piped, bash reads
    // the script from stdin and the first stdin-forwarding command in it
    // (`docker compose exec -T`) swallows the rest, so bash exits 0 having
    // skipped the pull, migrations and container swap.
    const scriptDir = script.split("/").slice(0, -1).join("/") || "/";
    const projectDir = scriptDir.endsWith("/scripts")
      ? scriptDir.slice(0, -"/scripts".length)
      : scriptDir;
    const remoteCmd = `cd ${projectDir} && NO_GIT_RESET=1 bash ${script} < /dev/null`;

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
