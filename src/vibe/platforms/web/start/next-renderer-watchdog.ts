import type { ChildProcess } from "node:child_process";

import { parseError } from "../../../core/utils/parse-error";
import type { EndpointLogger } from "../../../logger/types";

const PROBE_INTERVAL_MS = 10_000;
const PROBE_TIMEOUT_MS = 5_000;
const MISSES_BEFORE_RESTART = 3;
const MAX_BUN_TIMER_LAG_MS = 2_000;

interface NextRendererWatchdogOptions {
  child: Pick<ChildProcess, "pid" | "killed">;
  signalChild: (signal: NodeJS.Signals) => boolean;
  nextPort: number;
  startupGraceMs: number;
  isCurrent: () => boolean;
  summarizeInFlight: () => string;
  logger: EndpointLogger;
  intervalMs?: number;
  probeTimeoutMs?: number;
}

async function probeRenderer(
  port: number,
  timeoutMs: number,
): Promise<boolean> {
  try {
    // oxlint-disable-next-line restricted/no-raw-fetch -- probe the private renderer port independently of the Bun proxy
    const response = await fetch(`http://127.0.0.1:${port}/robots.txt`, {
      method: "GET",
      redirect: "manual",
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (response.status !== 200) {
      await response.body?.cancel();
      return false;
    }
    await response.text();
    return true;
  } catch {
    return false;
  }
}

export class NextRendererWatchdog {
  private readonly timer: ReturnType<typeof setInterval>;
  private readonly intervalMs: number;
  private readonly probeTimeoutMs: number;
  private readonly graceUntil: number;
  private lastTickAt = performance.now();
  private probing = false;
  private ready: boolean | undefined;
  private stopped = false;
  private misses = 0;
  private killedByWatchdog = false;

  constructor(private readonly options: NextRendererWatchdogOptions) {
    this.intervalMs = options.intervalMs ?? PROBE_INTERVAL_MS;
    this.probeTimeoutMs = options.probeTimeoutMs ?? PROBE_TIMEOUT_MS;
    this.graceUntil = this.lastTickAt + options.startupGraceMs;
    this.timer = setInterval(() => {
      void this.check();
    }, this.intervalMs);
  }

  markStarted(): void {
    this.ready ??= true;
  }

  isReady(): boolean {
    return this.ready === true && this.canCheck();
  }

  wasKilled(): boolean {
    return this.killedByWatchdog;
  }

  stop(): void {
    this.stopped = true;
    clearInterval(this.timer);
  }

  private canCheck(): boolean {
    return (
      !this.stopped && !this.options.child.killed && this.options.isCurrent()
    );
  }

  private async check(): Promise<void> {
    const now = performance.now();
    const timerLagMs = now - this.lastTickAt - this.intervalMs;
    this.lastTickAt = now;
    if (timerLagMs > MAX_BUN_TIMER_LAG_MS) {
      this.misses = 0;
      return;
    }
    if (now < this.graceUntil || this.probing || !this.canCheck()) {
      return;
    }

    this.probing = true;
    const ready = await probeRenderer(
      this.options.nextPort,
      this.probeTimeoutMs,
    );
    this.probing = false;
    if (!this.canCheck()) {
      return;
    }
    // A late timeout can be caused by Bun's own event loop stalling.
    if (
      !ready &&
      performance.now() - now > this.probeTimeoutMs + MAX_BUN_TIMER_LAG_MS
    ) {
      this.misses = 0;
      return;
    }

    this.ready = ready;
    this.misses = ready ? 0 : this.misses + 1;
    if (this.misses < MISSES_BEFORE_RESTART) {
      return;
    }

    const { child, logger, nextPort } = this.options;
    logger.error(
      "[Start] Next.js renderer missed three probes. Restarting child.",
      {
        pid: child.pid,
        nextPort,
        inFlightPaths: this.options.summarizeInFlight(),
      },
    );
    try {
      // A stalled JS loop cannot run Next's SIGTERM drain handler.
      this.killedByWatchdog = this.options.signalChild("SIGKILL");
    } catch (error) {
      logger.error("[Start] Failed to kill the unresponsive Next.js child", {
        pid: child.pid,
        error: parseError(error).message,
      });
    }
    if (this.killedByWatchdog) {
      this.stop();
    }
  }
}
