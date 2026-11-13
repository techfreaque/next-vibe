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
import {
  createReadStream,
  existsSync,
  mkdirSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
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

    // Build a COMMIT, never the working tree: resolve the ref, export that
    // commit's tree with `git archive` into .tmp/image-build/<sha>/ and use it
    // as the docker build context. The working tree is only read, never
    // touched (no stash/checkout/reset), and nothing uncommitted or ignored
    // (.env, data.db, .vibe.session, local WIP) can reach the image.
    const commitResult = ImagePushRepository.resolveCommit(
      data.commit,
      logger,
      t,
    );
    if (!commitResult.success) {
      return commitResult;
    }
    const { sha, shortSha } = commitResult.data;

    ImagePushRepository.warnIfDirty(shortSha, logger, t);

    const exportResult = ImagePushRepository.exportCommit(
      sha,
      shortSha,
      logger,
      t,
    );
    if (!exportResult.success) {
      return exportResult;
    }
    const contextDir = exportResult.data;

    const tag = data.tag ?? shortSha;
    // First ref is the one `docker save`d for the ssh transfer; the short sha
    // is always tagged too so every pushed image maps back to its commit.
    const tags = [...new Set([tag, shortSha, "latest"])];
    const refs = tags.map((tagName) => `${image}:${tagName}`);
    // push=false means build-only: no registry push AND no ssh transfer or
    // deploy, even when SSH_SERVER is set in .env.
    const transferTarget = data.push ? sshTarget : undefined;

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
      join(contextDir, "Dockerfile"),
      ...refs.flatMap((ref) => ["-t", ref]),
      transferTarget || !data.push ? "--load" : "--push",
      contextDir,
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

    if (transferTarget) {
      const transferResult = await ImagePushRepository.transferViaSsh(
        refs,
        transferTarget,
        logger,
        t,
        imagePushEnv.SSH_SERVER_PWD,
      );
      if (!transferResult.success) {
        return transferResult;
      }

      // Second HA node: only with the default target (an explicit --sshTarget
      // is a one-off single-box push). The image is shipped BEFORE Server 1
      // deploys so the version-skew window between the boxes is just the two
      // recreates, but its tags only move in the node's own deploy script.
      const secondaryTarget =
        data.secondary && !data.sshTarget
          ? imagePushEnv.SSH_SERVER2
          : undefined;
      const secondaryTransfer = secondaryTarget
        ? imagePushEnv.SSH_SERVER2_RELAY_ADDR
          ? await ImagePushRepository.relayToSecondary(
              refs[0] ?? "",
              transferTarget,
              secondaryTarget,
              imagePushEnv.SSH_SERVER2_RELAY_ADDR,
              t,
            )
          : await ImagePushRepository.transferViaSsh(
              refs,
              secondaryTarget,
              logger,
              t,
              imagePushEnv.SSH_SERVER2_PWD,
              ImagePushRepository.secondaryLoadCmd(refs[0] ?? ""),
            )
        : undefined;

      const deployResult = await ImagePushRepository.runDeployScript(
        transferTarget,
        contextDir,
        shortSha,
        logger,
        t,
        {
          script: imagePushEnv.SSH_DEPLOY_SCRIPT,
          password: imagePushEnv.SSH_SERVER_PWD,
          envPrefix: "NO_GIT_RESET=1",
        },
      );
      if (!deployResult.success) {
        return deployResult;
      }
      // Server 1 now runs this commit: record it before the secondary roll so
      // a failing Server 2 never leaves the marker pointing at the old sha.
      if (imagePushEnv.SSH_DEPLOY_SCRIPT) {
        ImagePushRepository.recordDeployedSha(sha, shortSha, logger, t);
      }

      if (secondaryTarget && secondaryTransfer) {
        const secondaryResult = await ImagePushRepository.rollSecondary(
          transferTarget,
          secondaryTarget,
          secondaryTransfer,
          refs[0] ?? "",
          contextDir,
          shortSha,
          logger,
          t,
        );
        if (!secondaryResult.success) {
          return secondaryResult;
        }
        return success({
          success: true,
          output: t("post.repository.messages.secondarySuccess", {
            refs: refs.join(", "),
            target: transferTarget,
            secondary: secondaryTarget,
          }),
          resolvedImage: image,
          tags,
          duration: Date.now() - startTime,
        });
      }

      return success({
        success: true,
        output: t("post.repository.messages.sshTransferSuccess", {
          refs: refs.join(", "),
          target: transferTarget,
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
    password: string | undefined,
    remoteCmdOverride?: string,
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
    // Every other ref (the short commit sha when --tag overrides the first
    // one, plus :latest) is re-pointed at the loaded image after load.
    const extraRefs = [
      ...new Set([...refs.filter((r) => r !== shaRef), latestRef]),
    ];
    const remoteCmd =
      remoteCmdOverride ??
      `docker tag ${latestRef} ${rollbackRef} 2>/dev/null; ` +
        `docker rmi ${shaRef} 2>/dev/null; ` +
        `gunzip | docker load && ${extraRefs
          .map((ref) => `docker tag ${shaRef} ${ref}`)
          .join(" && ")}`;

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
      password,
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

  /**
   * Remote command for the SECOND HA node's transfer: load the image under its
   * sha ref only. Unlike Server 1 it never touches :latest / :rollback there
   * (Server 2 co-hosts another site that runs :latest); deploy-ha-node.sh moves
   * the node's own tag (SSH_SERVER2_IMAGE_TAG) once Server 1 is live.
   */
  private static secondaryLoadCmd(shaRef: string): string {
    const q = ImagePushRepository.shellQuote;
    return `docker rmi ${q(shaRef)} 2>/dev/null; gunzip | docker load`;
  }

  /**
   * Ships the image Server 1 already holds to Server 2 box-to-box over the
   * private WireGuard link, instead of uploading it a second time from this
   * machine. Datacenter to datacenter is ~30x faster than a home uplink
   * (564 MB in 20 s vs ~1 h for the 6.5 GB app image).
   *
   * Transport is plain SSH over WireGuard (`docker save | gzip | ssh`), using
   * Server 1's dedicated key /root/.ssh/ha-image-relay, which Server 2 pins to
   * `restrict,from="10.88.0.1",command="gunzip | docker load"`. Never use an
   * `nc -l` listener or any tunnel/relay binary (nc, socat, wstunnel, chisel,
   * ...) here: Hostinger's in-VM malware scanner flags such processes and
   * hard-stops the VPS (it did so to Server 1 on 2026-11-12 for wstunnel).
   * One-time setup per box pair: ha/README.md "Image relay".
   */
  private static async relayToSecondary(
    shaRef: string,
    primaryTarget: string,
    secondaryTarget: string,
    relayAddr: string,
    t: ImagePushT,
  ): Promise<ResponseType<void>> {
    const q = ImagePushRepository.shellQuote;
    const [relayHost = "", relayPort = "22"] = relayAddr.split(":");
    // Drop a stale image under the same ref first so `docker load` re-tags it.
    const cleared = await ImagePushRepository.runRemote(
      secondaryTarget,
      `docker rmi ${q(shaRef)} >/dev/null 2>&1; true`,
      undefined,
      imagePushEnv.SSH_SERVER2_PWD,
    );
    const relaySsh = [
      "ssh -i /root/.ssh/ha-image-relay",
      "-o BatchMode=yes -o IdentitiesOnly=yes",
      "-o StrictHostKeyChecking=accept-new",
      "-o UserKnownHostsFile=/root/.ssh/ha-image-relay.known_hosts",
      `-p ${q(relayPort)}`,
      q(`root@${relayHost}`),
    ].join(" ");
    const sender = await ImagePushRepository.runRemote(
      primaryTarget,
      `set -o pipefail; docker save ${q(shaRef)} | gzip -1 | ${relaySsh}`,
      undefined,
      imagePushEnv.SSH_SERVER_PWD,
    );
    const failed = [cleared, sender].find(
      (r) => r.error !== undefined || r.exitCode !== 0,
    );
    if (failed) {
      return fail({
        message: t("post.repository.messages.sshTransferFailed", {
          target: secondaryTarget,
          error:
            failed.error ??
            t("post.repository.messages.scriptRemoteExit", {
              code: failed.exitCode,
            }),
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
    return success(undefined);
  }

  /**
   * Rolls the second HA node after Server 1 is live: copies Server 1's .env
   * across, then runs SSH_SERVER2_DEPLOY_SCRIPT (synced from the commit), which
   * retags, recreates, health-checks and auto-rolls-back on its own.
   */
  private static async rollSecondary(
    primaryTarget: string,
    secondaryTarget: string,
    transfer: ResponseType<void>,
    shaRef: string,
    contextDir: string,
    shortSha: string,
    logger: EndpointLogger,
    t: ImagePushT,
  ): Promise<ResponseType<void>> {
    const secondaryFailed = (cause: ResponseType<void>): ResponseType<void> =>
      fail({
        message: t("post.repository.messages.secondaryFailed", {
          target: primaryTarget,
          secondary: secondaryTarget,
          error: cause.success ? "" : cause.message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        cause: cause.success ? undefined : cause,
      });

    if (!transfer.success) {
      return secondaryFailed(transfer);
    }
    logger.info(
      t("post.repository.messages.secondaryStart", {
        target: secondaryTarget,
      }),
    );

    const script = imagePushEnv.SSH_SERVER2_DEPLOY_SCRIPT;
    if (script) {
      const envResult = await ImagePushRepository.copyPrimaryEnv(
        primaryTarget,
        secondaryTarget,
        script,
        t,
      );
      if (!envResult.success) {
        return secondaryFailed(envResult);
      }
    }

    const deployResult = await ImagePushRepository.runDeployScript(
      secondaryTarget,
      contextDir,
      shortSha,
      logger,
      t,
      {
        script,
        password: imagePushEnv.SSH_SERVER2_PWD,
        envPrefix: `NO_GIT_RESET=1 HA_IMAGE_TAG=${ImagePushRepository.shellQuote(imagePushEnv.SSH_SERVER2_IMAGE_TAG)} HA_NEW_IMAGE_REF=${ImagePushRepository.shellQuote(shaRef)}`,
      },
    );
    return deployResult.success ? deployResult : secondaryFailed(deployResult);
  }

  /**
   * Streams Server 1's prod .env straight into `<project>/.env.from-s1` on
   * Server 2 (one OS pipeline: ssh S1 cat | ssh S2 cat >). The secrets pass
   * through this process's pipes only: never written locally, never logged.
   * deploy-ha-node.sh merges it with the node's own infra overrides.
   */
  private static async copyPrimaryEnv(
    primaryTarget: string,
    secondaryTarget: string,
    secondaryScript: string,
    t: ImagePushT,
  ): Promise<ResponseType<void>> {
    const q = ImagePushRepository.shellQuote;
    const scriptDir = secondaryScript.split("/").slice(0, -1).join("/") || "/";
    const projectDir = scriptDir.endsWith("/scripts")
      ? scriptDir.slice(0, -"/scripts".length)
      : scriptDir;
    const sshPart = (
      target: string,
      passwordVar: string,
      hasPassword: boolean,
      cmd: string,
    ): string => {
      const { username, host, port } =
        ImagePushRepository.parseSshTarget(target);
      const opts = `-oStrictHostKeyChecking=no -oPort=${q(String(port))} ${q(`${username}@${host}`)} ${q(cmd)}`;
      return hasPassword
        ? `SSHPASS="$${passwordVar}" sshpass -e ssh ${opts}`
        : `ssh ${opts}`;
    };
    const p1 = imagePushEnv.SSH_SERVER_PWD;
    const p2 = imagePushEnv.SSH_SERVER2_PWD;
    const pipeline =
      `set -o pipefail; ` +
      `${sshPart(primaryTarget, "HA_P1", Boolean(p1), `cat ${q(imagePushEnv.SSH_SERVER_ENV_PATH)}`)} | ` +
      `${sshPart(secondaryTarget, "HA_P2", Boolean(p2), `umask 077 && cat > ${q(`${projectDir}/.env.from-s1`)}`)}`;

    const exitCode = await new Promise<number>((resolve) => {
      const child = spawn("bash", ["-c", pipeline], {
        // stdout stays a pipe we never read; only stderr reaches the terminal.
        stdio: ["ignore", "ignore", "inherit"],
        env: { ...process.env, HA_P1: p1 ?? "", HA_P2: p2 ?? "" },
      });
      child.on("error", () => resolve(-1));
      child.on("close", (code) => resolve(code ?? -1));
    });
    if (exitCode !== 0) {
      return fail({
        message: t("post.repository.messages.envSyncFailed", {
          error: t("post.repository.messages.scriptRemoteExit", {
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
    password: string | undefined = imagePushEnv.SSH_SERVER_PWD,
  ): Promise<{ exitCode: number; error?: string }> {
    const { username, host, port } =
      ImagePushRepository.parseSshTarget(sshTarget);

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
   * Skipped when SSH_DEPLOY_SCRIPT is empty. The script is first synced from
   * the exported commit tree (see syncDeployScript), so the server always runs
   * the deploy script of the commit being deployed.
   */
  private static async runDeployScript(
    sshTarget: string,
    contextDir: string,
    shortSha: string,
    logger: EndpointLogger,
    t: ImagePushT,
    opts: {
      script: string;
      password: string | undefined;
      /** `KEY=value` pairs prepended to the remote `bash <script>` call. */
      envPrefix: string;
    },
  ): Promise<ResponseType<void>> {
    const { script, password, envPrefix } = opts;
    if (!script) {
      return success(undefined);
    }

    const syncResult = await ImagePushRepository.syncDeployScript(
      sshTarget,
      script,
      contextDir,
      shortSha,
      logger,
      t,
      password,
    );
    if (!syncResult.success) {
      return syncResult;
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
    const remoteCmd = `cd ${projectDir} && ${envPrefix} bash ${script} < /dev/null`;

    const result = await ImagePushRepository.runRemote(
      sshTarget,
      remoteCmd,
      undefined,
      password,
    );

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

  /**
   * Uploads the deploy script from the EXPORTED COMMIT TREE (never the working
   * tree) to the server before it runs. NO_GIT_RESET=1 means the server checkout
   * never updates, so without this any change to scripts/install-docker.sh in
   * the repo would silently never reach the server. The upload is atomic and
   * syntax-checked: written to `<script>.incoming`, `bash -n` checked, then
   * `mv`'d over the live script - a broken script never replaces the good one
   * and aborts the deploy. Only the script is synced: docker-compose.prod.yml on
   * the server has intentionally drifted and is left alone.
   */
  private static async syncDeployScript(
    sshTarget: string,
    script: string,
    contextDir: string,
    shortSha: string,
    logger: EndpointLogger,
    t: ImagePushT,
    password: string | undefined,
  ): Promise<ResponseType<void>> {
    const scriptName = script.split("/").pop() ?? script;
    const localPath = join(contextDir, "scripts", scriptName);
    const syncFailed = (error: string): ResponseType<void> => {
      logger.error("Deploy script sync failed", { sshTarget, script, error });
      return fail({
        message: t("post.repository.messages.scriptSyncFailed", {
          script,
          target: sshTarget,
          error,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    };

    if (!existsSync(localPath)) {
      return syncFailed(
        t("post.repository.messages.scriptMissing", {
          path: `scripts/${scriptName}`,
          sha: shortSha,
        }),
      );
    }

    const incoming = `${script}.incoming`;
    const remoteCmd =
      `cat > ${incoming} && ` +
      `{ bash -n ${incoming} || { rm -f ${incoming}; exit 3; }; } && ` +
      `mv ${incoming} ${script}`;
    const result = await ImagePushRepository.runRemote(
      sshTarget,
      remoteCmd,
      createReadStream(localPath),
      password,
    );

    if (result.error !== undefined || result.exitCode !== 0) {
      return syncFailed(
        result.error ??
          (result.exitCode === 3
            ? t("post.repository.messages.scriptSyntaxInvalid", {
                path: `scripts/${scriptName}`,
                sha: shortSha,
              })
            : t("post.repository.messages.scriptRemoteExit", {
                code: result.exitCode,
              })),
      );
    }

    logger.info(
      t("post.repository.messages.scriptSynced", {
        script,
        target: sshTarget,
        sha: shortSha,
      }),
    );
    return success(undefined);
  }

  /**
   * Writes the full sha of the commit that just went live to
   * `.tmp/last-deployed-sha`, so tooling (daily-deploy cron, changelog diffs)
   * knows what prod runs. Best effort: the deploy already succeeded, so a
   * write failure only warns.
   */
  private static recordDeployedSha(
    sha: string,
    shortSha: string,
    logger: EndpointLogger,
    t: ImagePushT,
  ): void {
    const tmpDir = join(process.cwd(), ".tmp");
    const path = join(tmpDir, "last-deployed-sha");
    try {
      mkdirSync(tmpDir, { recursive: true });
      writeFileSync(path, `${sha}\n`);
      logger.info(
        t("post.repository.messages.deployedShaRecorded", {
          sha: shortSha,
          path,
        }),
      );
    } catch (error) {
      logger.warn(
        t("post.repository.messages.deployedShaRecordFailed", {
          path,
          error: parseError(error).message,
        }),
      );
    }
  }

  /** Runs a read-only git command in the repo, returning trimmed stdout. */
  private static git(args: string[]): {
    ok: boolean;
    stdout: string;
    stderr: string;
  } {
    const result = spawnSync("git", args, {
      cwd: process.cwd(),
      encoding: "utf-8",
    });
    return {
      ok: result.status === 0 && !result.error,
      stdout: (result.stdout ?? "").trim(),
      stderr: (result.stderr ?? "").trim() || (result.error?.message ?? ""),
    };
  }

  /** Resolves a sha/tag/branch to a full + short commit sha (read-only git). */
  private static resolveCommit(
    ref: string,
    logger: EndpointLogger,
    t: ImagePushT,
  ): ResponseType<{ sha: string; shortSha: string }> {
    const resolved = ImagePushRepository.git([
      "rev-parse",
      "--verify",
      "--quiet",
      `${ref}^{commit}`,
    ]);
    if (!resolved.ok || !resolved.stdout) {
      logger.error("Failed to resolve commit", {
        ref,
        stderr: resolved.stderr,
      });
      return fail({
        message: resolved.stderr
          ? t("post.repository.messages.commitResolveFailedDetail", {
              ref,
              error: resolved.stderr,
            })
          : t("post.repository.messages.commitResolveFailed", { ref }),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }
    const sha = resolved.stdout;
    const short = ImagePushRepository.git(["rev-parse", "--short", sha]);
    const shortSha = short.ok && short.stdout ? short.stdout : sha.slice(0, 7);
    const subject = ImagePushRepository.git([
      "log",
      "-1",
      "--format=%s",
      sha,
    ]).stdout;
    logger.info(
      t("post.repository.messages.commitResolved", {
        sha: shortSha,
        ref,
        subject,
      }),
    );
    return success({ sha, shortSha });
  }

  /** Logs a warning when the working tree has changes that will NOT ship. */
  private static warnIfDirty(
    shortSha: string,
    logger: EndpointLogger,
    t: ImagePushT,
  ): void {
    const status = ImagePushRepository.git(["status", "--porcelain"]);
    if (!status.ok || !status.stdout) {
      return;
    }
    const count = status.stdout.split("\n").length;
    logger.warn(
      t("post.repository.messages.dirtyTreeWarning", {
        count,
        sha: shortSha,
      }),
    );
  }

  /**
   * Exports the commit's tree into `.tmp/image-build/<sha>/` via
   * `git archive <sha> | tar -x`. A finished export is marked by a sibling
   * `<sha>.done` file (outside the build context) and reused as-is; a partial
   * one (dir without marker) is moved to `.tmp/todelete/` and re-exported.
   * Returns the absolute context directory.
   */
  private static exportCommit(
    sha: string,
    shortSha: string,
    logger: EndpointLogger,
    t: ImagePushT,
  ): ResponseType<string> {
    const top = ImagePushRepository.git(["rev-parse", "--show-toplevel"]);
    const repoRoot = top.ok && top.stdout ? top.stdout : process.cwd();
    const buildRoot = join(repoRoot, ".tmp", "image-build");
    const dir = join(buildRoot, sha);
    const doneMarker = join(buildRoot, `${sha}.done`);

    if (existsSync(dir) && existsSync(doneMarker)) {
      logger.info(
        t("post.repository.messages.exportReused", { sha: shortSha, dir }),
      );
      return success(dir);
    }

    const exportFail = (error: string): ResponseType<string> => {
      logger.error("Commit export failed", { sha, dir, error });
      return fail({
        message: t("post.repository.messages.exportFailed", {
          sha: shortSha,
          error,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    };

    try {
      if (existsSync(dir)) {
        // Leftover from an interrupted export - never rm, park it instead.
        const parked = join(
          repoRoot,
          ".tmp",
          "todelete",
          `image-build-${sha}-${Date.now()}`,
        );
        mkdirSync(join(parked, ".."), { recursive: true });
        renameSync(dir, parked);
      }
      mkdirSync(dir, { recursive: true });
    } catch (error) {
      return exportFail(parseError(error).message);
    }

    logger.info(
      t("post.repository.messages.exportStart", { sha: shortSha, dir }),
    );

    // One OS-level pipeline (bash pipefail so a git-archive failure is not
    // masked by tar's exit 0). Wiring git's stdout into tar's stdin through
    // Node streams hit EPIPE under Bun on the ~400 MB archive. sha and dir
    // are passed as positional args, never interpolated into the script.
    const extract = spawnSync(
      "bash",
      [
        "-o",
        "pipefail",
        "-c",
        'git archive --format=tar "$1" | tar -x -C "$2"',
        "image-push-export",
        sha,
        dir,
      ],
      { stdio: ["ignore", "inherit", "inherit"], cwd: repoRoot },
    );
    if (extract.error) {
      return exportFail(extract.error.message);
    }
    if (extract.status !== 0) {
      return exportFail(
        `git archive | tar exited with code ${String(extract.status ?? -1)}`,
      );
    }
    if (!existsSync(join(dir, "Dockerfile"))) {
      return exportFail("Dockerfile missing from exported tree");
    }

    try {
      writeFileSync(doneMarker, `${new Date().toISOString()}\n`);
    } catch (error) {
      return exportFail(parseError(error).message);
    }
    return success(dir);
  }
}
