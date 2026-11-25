import { expect, it, mock } from "bun:test";

import { defaultLocale } from "../../../core/i18n/core/config";
import { createEndpointLogger } from "../../../logger/server";
import type { LoggerMetadata } from "../../../logger/types";
import { NextRendererWatchdog } from "./next-renderer-watchdog";

const logger = createEndpointLogger(false, defaultLocale);

async function waitFor(condition: () => boolean): Promise<void> {
  const deadline = performance.now() + 1500;
  while (!condition() && performance.now() < deadline) {
    await Bun.sleep(10);
  }
  expect(condition()).toBe(true);
}

it("honors startup grace, clears misses on recovery, then kills a child after three misses", async () => {
  const kill = mock((_signal?: NodeJS.Signals | number) => true);
  const error = mock((_message: string, ..._metadata: LoggerMetadata[]) => {});
  const probes: { method: string; path: string; at: number; ready: boolean }[] = [];
  let isReady = (): boolean => false;
  const renderer = Bun.serve({
    hostname: "127.0.0.1",
    port: 0,
    fetch: (req) => {
      probes.push({
        method: req.method,
        path: new URL(req.url).pathname,
        at: performance.now(),
        ready: isReady(),
      });
      return new Response("fixture", { status: probes.length === 3 ? 200 : 503 });
    },
  });
  const startupGraceMs = 175;
  const startedAt = performance.now();
  const watchdog = new NextRendererWatchdog({
    child: { killed: false, pid: 123 },
    signalChild: kill,
    nextPort: renderer.port ?? 0,
    startupGraceMs,
    isCurrent: () => true,
    summarizeInFlight: () => "GET /en-US/story (18ms)",
    logger: { ...logger, error },
    intervalMs: 60,
    probeTimeoutMs: 45,
  });
  isReady = () => watchdog.isReady();
  try {
    expect(isReady()).toBe(false);
    watchdog.markStarted();
    expect(isReady()).toBe(true);
    await waitFor(() => watchdog.wasKilled());
    expect(kill).toHaveBeenCalledTimes(1);
    expect(kill).toHaveBeenCalledWith("SIGKILL");
    expect(probes).toHaveLength(6);
    expect(probes.every((probe) => probe.method === "GET" && probe.path === "/robots.txt")).toBe(true);
    expect(probes[0]?.at).toBeGreaterThanOrEqual(startedAt + startupGraceMs);
    expect(probes.map((probe) => probe.ready)).toEqual([true, false, false, true, false, false]);
    expect(isReady()).toBe(false);
    expect(error).toHaveBeenCalledWith(
      "[Start] Next.js renderer missed three probes. Restarting child.",
      expect.objectContaining({ pid: 123, inFlightPaths: "GET /en-US/story (18ms)" }),
    );
  } finally {
    watchdog.stop();
    await renderer.stop(true);
  }
});

it("times out a renderer that accepts requests but stalls before answering", async () => {
  const kill = mock((_signal?: NodeJS.Signals | number) => true);
  let probes = 0;
  const renderer = Bun.serve({
    hostname: "127.0.0.1",
    port: 0,
    fetch: async () => {
      probes++;
      await Bun.sleep(500);
      return new Response("too late");
    },
  });
  const watchdog = new NextRendererWatchdog({
    child: { killed: false, pid: 123 },
    signalChild: kill,
    nextPort: renderer.port ?? 0,
    startupGraceMs: 0,
    isCurrent: () => true,
    summarizeInFlight: () => "none",
    logger: { ...logger, error: mock(() => undefined) },
    intervalMs: 60,
    probeTimeoutMs: 40,
  });
  try {
    watchdog.markStarted();
    await waitFor(() => watchdog.wasKilled());
    expect(probes).toBe(3);
    expect(watchdog.isReady()).toBe(false);
  } finally {
    watchdog.stop();
    await renderer.stop(true);
  }
});

it("ignores a pending miss from a replaced child", async () => {
  const kill = mock((_signal?: NodeJS.Signals | number) => true);
  let current = true;
  let probes = 0;
  const renderer = Bun.serve({
    hostname: "127.0.0.1",
    port: 0,
    fetch: (req) => {
      probes++;
      if (probes === 3) {
        current = false;
      }
      return new Response(new URL(req.url).pathname, { status: 503 });
    },
  });
  const watchdog = new NextRendererWatchdog({
    child: { killed: false, pid: 123 },
    signalChild: kill,
    nextPort: renderer.port ?? 0,
    startupGraceMs: 0,
    isCurrent: () => current,
    summarizeInFlight: () => "none",
    logger,
    intervalMs: 60,
    probeTimeoutMs: 45,
  });
  try {
    await waitFor(() => !current);
    await Bun.sleep(70);
    expect(kill).not.toHaveBeenCalled();
    expect(watchdog.isReady()).toBe(false);
  } finally {
    watchdog.stop();
    await renderer.stop(true);
  }
});
