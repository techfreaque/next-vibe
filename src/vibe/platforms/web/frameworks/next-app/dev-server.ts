/**
 * Next.js dev server — the next half of the framework seam.
 *
 * Spawns `next dev` as a child process, rewrites its output to the public
 * port, tracks the child PID in the dev PID file, and owns the
 * profiling-artefact collection (.cpuprofile / Turbopack trace) that only
 * exists for Next. The orchestrator (../../dev/repository.ts) decides
 * ports/proxy/shutdown and reaches the child only through the returned
 * controller. A fork that wants only TanStack drops this directory.
 */

import type { ChildProcess } from "node:child_process";
import { existsSync } from "node:fs";

import { appendRawToServerLog } from "../../../../logger/file";
import { createNextjsFormatter } from "../../../../logger/formatters";
import type { EndpointLogger } from "../../../../logger/types";

import { addPidToFile, removePidFromFile } from "../../pid";

export interface NextDevController {
  /** The currently running child, if any. */
  current: () => ChildProcess | undefined;
}

/**
 * Spawn the Next.js dev server on `internalPort`.
 *
 * `publicPort` is the user-facing (proxy) port; in proxy mode child output has
 * the internal port rewritten to it. `onExit` fires when the child exits for
 * any reason other than an intentional shutdown (`isShuttingDown()` true).
 */
export function startNextDev({
  internalPort,
  publicPort,
  disableProxy,
  profile,
  activePidFile,
  isShuttingDown,
  onExit,
  logger,
}: {
  internalPort: number;
  publicPort: number;
  disableProxy: boolean;
  profile: boolean;
  activePidFile: string;
  isShuttingDown: () => boolean;
  onExit: (code: number | null) => void;
  logger: EndpointLogger;
}): NextDevController {
  let child: ChildProcess | undefined;

  const spawnNext = async (): Promise<void> => {
    if (isShuttingDown()) {
      return;
    }
    const { spawn } = await import("node:child_process");

    // Drop stale reference from previous run to allow GC
    child = undefined;

    const profilingEnv = profile
      ? {
          NEXT_TURBOPACK_TRACING: "1",
          NEXT_CPU_PROF: "1",
        }
      : {};

    const nextProcess = spawn(
      "bun",
      ["run", "next", "dev", "--port", String(internalPort)],
      {
        stdio: ["ignore", "pipe", "pipe"],
        env: {
          ...process.env,
          ...profilingEnv,
          // Cap V8 heap to force GC before memory balloons unboundedly.
          // 8GB is enough for dev; without this Node grows until OOM.
          NODE_OPTIONS: [process.env.NODE_OPTIONS, "--max-old-space-size=8192"]
            .filter(Boolean)
            .join(" "),
        },
        cwd: process.cwd(),
      },
    );
    child = nextProcess;

    // Track child PID in PID file so it gets killed on next startup too
    if (nextProcess.pid) {
      addPidToFile(activePidFile, nextProcess.pid);
    }

    const formatNextjs = createNextjsFormatter(internalPort, publicPort);
    if (!disableProxy) {
      const rewritePort = (chunk: Buffer): void => {
        const formatted = formatNextjs(
          chunk
            .toString()
            .replaceAll(String(internalPort), String(publicPort)),
        );
        process.stdout.write(formatted);
        void appendRawToServerLog(formatted);
      };
      nextProcess.stdout?.on("data", rewritePort);
      nextProcess.stderr?.on("data", rewritePort);
    } else {
      nextProcess.stdout?.on("data", (chunk: Buffer) => {
        const formatted = formatNextjs(chunk.toString());
        process.stdout.write(formatted);
        void appendRawToServerLog(formatted);
      });
      nextProcess.stderr?.on("data", (chunk: Buffer) => {
        const formatted = formatNextjs(chunk.toString());
        process.stderr.write(formatted);
        void appendRawToServerLog(formatted);
      });
    }

    nextProcess.on("exit", (code) => {
      // Remove child PID from PID file immediately on exit
      if (nextProcess.pid) {
        removePidFromFile(activePidFile, nextProcess.pid);
      }
      // Free streams to allow GC
      nextProcess.stdout?.destroy();
      nextProcess.stderr?.destroy();
      child = undefined;

      if (isShuttingDown()) {
        return; // Intentional shutdown
      }

      if (code === 0) {
        logger.info("Next.js exited cleanly");
        onExit(0);
        return;
      }

      process.stderr.write(
        // eslint-disable-next-line i18next/no-literal-string
        `\n❌ Next.js exited (code ${String(code)})\n`,
      );
      onExit(code);
    });
  };

  void spawnNext();

  return {
    current: (): ChildProcess | undefined => child,
  };
}

/**
 * Collect and open Next.js profiling artefacts after a profiled run:
 * the newest .cpuprofile (opened directly — VS Code renders it natively)
 * and the Turbopack trace viewer when a trace exists. Exits the process.
 */
export async function openNextProfiles(): Promise<never> {
  const { default: open } = await import("open");
  const { resolve } = await import("node:path");

  // 1. CPU profile → open directly (VS Code opens it natively on ctrl+click)
  const cpuProfiles = (await import("node:fs"))
    .readdirSync(process.cwd())
    .filter((f: string) => f.endsWith(".cpuprofile"));
  if (cpuProfiles.length > 0) {
    const latest = cpuProfiles.toSorted().at(-1)!;
    const latestPath = resolve(latest);
    // eslint-disable-next-line i18next/no-literal-string
    process.stdout.write(`🔥 Opening CPU profile: ${latest}\n`);
    await open(latestPath);
  } else {
    process.stdout.write(
      // eslint-disable-next-line i18next/no-literal-string
      "⚠️  No .cpuprofile found - try running with --profile again\n",
    );
  }

  // 2. Turbopack trace → open trace viewer (user drops file in)
  const tracePath = resolve(".next/dev/trace-turbopack");
  if (existsSync(tracePath)) {
    // eslint-disable-next-line i18next/no-literal-string
    process.stdout.write(`📊 Opening Turbopack trace viewer\n`);
    await open("https://trace.nextjs.org/");
  }

  // eslint-disable-next-line i18next/no-literal-string
  process.stdout.write("\n✅ Done. Goodbye!\n");
  process.exit(0);
}
