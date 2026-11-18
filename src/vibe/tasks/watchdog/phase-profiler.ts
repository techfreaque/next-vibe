/**
 * Phase Profiler
 *
 * Samples the JS thread (JavaScriptCore's sampling profiler, bun:jsc) while a
 * pulse bookkeeping phase (cron-prep / cron-post) runs, plus a short tail, and
 * names the code behind any event-loop stall in that window.
 *
 * Why: the lag monitor learns about a stall only after it ended, so it can say
 * WHEN and WHAT WAS RUNNING, never which function blocked. Prod 2026-11-16 had
 * 0.3-1.2 s stalls (~40 MB heap jump, ~0.9 s system CPU) starting 8-18 ms after
 * every first `cron:ai-run` of a process returned, with no local repro. The
 * sampler runs on its own thread, so it records the blocked stack DURING the
 * stall. It only records while JS runs (idle time costs no samples), and a
 * session is bounded (phase + tail, hard cap), so the overhead stays tiny.
 *
 * Bun only: elsewhere (Next.js on Node, CLI under tsx) every call is a no-op.
 */

import "server-only";

import type * as BunJscModule from "bun:jsc";
import type { SamplingProfile, SamplingProfileStackFrame } from "bun:jsc";

import type { EndpointLogger } from "../../logger/types";

/** Keep sampling this long after the last phase ended (stall shows up after). */
const TAIL_MS = 1500;
/** Hard cap per session: a phase that never ends must not profile forever. */
const MAX_SESSION_MS = 60_000;
/**
 * Continuous mode: one session per window, back to back. Short windows keep
 * each result small (summarizing costs a few ms) and let a stall be matched to
 * the session that covered it within the lag monitor's 5 s window.
 */
const CONTINUOUS_WINDOW_MS = 10_000;
/** Sample every 1 ms (JSC default). Measured overhead: within noise. */
const SAMPLE_INTERVAL_US = 1000;
/** A gap above this between two samples ends a busy streak. */
const STREAK_GAP_S = 0.005;
/** Log a profiled cron phase stall as its own row from this long. */
const STALL_REPORT_MS = 200;
/** Keep a streak for the lag row from this long. Lag rows start at 100 ms. */
const STALL_ATTACH_MS = 80;
/** Stall profiles kept for the lag row to attach. */
const RECENT_RING_SIZE = 10;
/** The lag row waits at most this long for the covering session's summary. */
const FLUSH_WAIT_MS = 2000;

interface PhaseWindow {
  label: string;
  startedAt: number;
  endedAt: number | null;
}

interface ProfileSession {
  /** Set once the sampling window closed (tail, window or hard cap) */
  released: boolean;
  /** Phases that overlapped the session (open ones are carried over) */
  phases: PhaseWindow[];
  startedAt: number;
  release: () => void;
  tailTimer: ReturnType<typeof setTimeout> | null;
  /** Resolves once the session is summarized (ring updated) */
  done: Promise<void>;
}

export interface StallProfile {
  /** Wall clock of the profiled session (ms) */
  sessionStartedAt: number;
  sessionEndedAt: number;
  /** Longest uninterrupted JS-busy stretch in the session */
  streakMs: number;
  /** "label start..end" of every phase in the session ("" outside phases) */
  phases: string;
  /** Most sampled innermost app frames in the streak: "fn file:line xN" */
  hotFrames: string;
  /** Most sampled app call chains (innermost first) in the streak */
  hotStacks: string;
  /** Most sampled innermost frames incl. native / builtin ones (GC, JSON, regex) */
  hotNative: string;
}

declare global {
  var __vibePhaseProfiler: ProfileSession | null | undefined;
  var __vibeStallProfiles: StallProfile[] | undefined;
  /** Phases still running, carried into the next session on a cut */
  var __vibeOpenPhases: Set<PhaseWindow> | undefined;
  /** Set once continuous sampling runs (the server's lag monitor turns it on) */
  var __vibeProfilerContinuous: EndpointLogger | null | undefined;
  /** Summary of the most recently released session */
  var __vibeProfilerPending: Promise<void> | undefined;
}

type BunJsc = typeof BunJscModule;
let jscModule: Promise<BunJsc | null> | null = null;

function loadJsc(): Promise<BunJsc | null> {
  jscModule ??= (async (): Promise<BunJsc | null> => {
    if (typeof Bun === "undefined") {
      return null;
    }
    try {
      return await import("bun:jsc");
    } catch {
      return null;
    }
  })();
  return jscModule;
}

function openPhases(): Set<PhaseWindow> {
  globalThis.__vibeOpenPhases ??= new Set();
  return globalThis.__vibeOpenPhases;
}

function recent(): StallProfile[] {
  globalThis.__vibeStallProfiles ??= [];
  return globalThis.__vibeStallProfiles;
}

const NATIVE_SOURCE_ID = 4294967295;

function shortPath(url: string): string {
  const srcIndex = url.lastIndexOf("/src/");
  if (srcIndex >= 0) {
    return url.slice(srcIndex + 1);
  }
  const nmIndex = url.lastIndexOf("/node_modules/");
  if (nmIndex >= 0) {
    return url.slice(nmIndex + 1);
  }
  return url;
}

function frameKey(frame: SamplingProfileStackFrame): string {
  const name = frame.name || "(anonymous)";
  if (!frame.sourceURL) {
    return `${name} [${frame.category}]`;
  }
  const line = frame.line === NATIVE_SOURCE_ID ? "?" : String(frame.line);
  return `${name} ${shortPath(frame.sourceURL)}:${line}`;
}

function isAppFrame(frame: SamplingProfileStackFrame): boolean {
  return frame.flags === 0 && Boolean(frame.sourceURL);
}

function topCounts(counts: Map<string, number>, limit: number): string {
  return [...counts.entries()]
    .toSorted((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, count]) => `${key} x${count}`)
    .join("; ");
}

function bump(counts: Map<string, number>, key: string): void {
  counts.set(key, (counts.get(key) ?? 0) + 1);
}

/** Longest run of samples with no gap > STREAK_GAP_S, as [start, endExclusive). */
function longestStreak(
  traces: SamplingProfile["stackTraces"]["traces"],
): [number, number] {
  let bestStart = 0;
  let bestEnd = 0;
  let runStart = 0;
  for (let i = 1; i <= traces.length; i++) {
    const broken =
      i === traces.length ||
      traces[i].timestamp - traces[i - 1].timestamp > STREAK_GAP_S;
    if (broken) {
      const spanStart = traces[runStart]?.timestamp ?? 0;
      const spanEnd = traces[i - 1]?.timestamp ?? 0;
      const bestSpan =
        bestEnd > bestStart
          ? traces[bestEnd - 1].timestamp - traces[bestStart].timestamp
          : -1;
      if (spanEnd - spanStart > bestSpan) {
        bestStart = runStart;
        bestEnd = i;
      }
      runStart = i;
    }
  }
  return [bestStart, bestEnd];
}

function summarize(
  result: SamplingProfile,
  session: ProfileSession,
  endedAt: number,
): StallProfile | null {
  const traces = result.stackTraces.traces;
  if (traces.length < 2) {
    return null;
  }
  const [start, end] = longestStreak(traces);
  if (end - start < 2) {
    return null;
  }
  const streakMs = Math.round(
    (traces[end - 1].timestamp - traces[start].timestamp) * 1000 +
      result.stackTraces.interval * 1000,
  );
  if (streakMs < STALL_ATTACH_MS) {
    return null;
  }

  const hotFrames = new Map<string, number>();
  const hotStacks = new Map<string, number>();
  const hotNative = new Map<string, number>();
  for (let i = start; i < end; i++) {
    const frames = traces[i].frames;
    if (frames.length > 0) {
      bump(hotNative, frameKey(frames[0]));
    }
    const appFrames = frames.filter(isAppFrame);
    if (appFrames.length > 0) {
      bump(hotFrames, frameKey(appFrames[0]));
      bump(
        hotStacks,
        appFrames
          .slice(0, 5)
          .map((frame) => frameKey(frame))
          .join(" < "),
      );
    }
  }

  return {
    sessionStartedAt: session.startedAt,
    sessionEndedAt: endedAt,
    streakMs,
    phases: session.phases
      .map(
        (phase) =>
          `${phase.label} ${new Date(phase.startedAt).toISOString()}..${
            phase.endedAt === null
              ? "open"
              : new Date(phase.endedAt).toISOString()
          }`,
      )
      .join("; "),
    hotFrames: topCounts(hotFrames, 6),
    hotStacks: topCounts(hotStacks, 3),
    hotNative: topCounts(hotNative, 4),
  };
}

function noop(): void {
  // replaced by the window's resolver
}

/** Most recent phase end, for the tail of a continuous window. */
function lastPhaseEndedAt(session: ProfileSession): number {
  let last = 0;
  for (const phase of session.phases) {
    if (phase.endedAt !== null && phase.endedAt > last) {
      last = phase.endedAt;
    }
  }
  return last;
}

function startSession(logger: EndpointLogger): ProfileSession {
  let resolveWindow: () => void = noop;
  const sessionWindow = new Promise<void>((resolve) => {
    resolveWindow = resolve;
  });
  let resolveDone: () => void = noop;
  const done = new Promise<void>((resolve) => {
    resolveDone = resolve;
  });
  const session: ProfileSession = {
    released: false,
    // Phases still open when the previous session was cut belong here too
    phases: [...openPhases()],
    startedAt: Date.now(),
    release: (): void => {
      if (session.released) {
        return;
      }
      session.released = true;
      globalThis.__vibeProfilerPending = done;
      resolveWindow();
    },
    tailTimer: null,
    done,
  };
  const hardStop = setTimeout(session.release, MAX_SESSION_MS);

  // Continuous mode: close the window every CONTINUOUS_WINDOW_MS, but never
  // while a phase is open or inside a phase's tail (keeps the phase labels on
  // the stall that follows it).
  let windowTimer: ReturnType<typeof setTimeout> | null = null;
  const armWindow = (delayMs: number): void => {
    windowTimer = setTimeout(() => {
      windowTimer = null;
      if (session.released) {
        return;
      }
      const sinceLastPhase = Date.now() - lastPhaseEndedAt(session);
      if (openPhases().size > 0) {
        armWindow(TAIL_MS);
      } else if (sinceLastPhase < TAIL_MS) {
        armWindow(TAIL_MS - sinceLastPhase);
      } else {
        session.release();
      }
    }, delayMs);
  };
  if (globalThis.__vibeProfilerContinuous) {
    armWindow(CONTINUOUS_WINDOW_MS);
  }

  void (async (): Promise<void> => {
    try {
      const jsc = await loadJsc();
      if (!jsc) {
        return;
      }
      const result = await jsc.profile(() => sessionWindow, SAMPLE_INTERVAL_US);
      const stall = summarize(result, session, Date.now());
      if (stall) {
        const ring = recent();
        ring.push(stall);
        if (ring.length > RECENT_RING_SIZE) {
          ring.splice(0, ring.length - RECENT_RING_SIZE);
        }
        if (session.phases.length > 0 && stall.streakMs >= STALL_REPORT_MS) {
          // Static message: the fingerprint groups on it; details in metadata.
          logger.warn("[EventLoop] Stall profiled during cron bookkeeping", {
            streakMs: stall.streakMs,
            phases: stall.phases,
            hotFrames: stall.hotFrames,
            hotStacks: stall.hotStacks,
            hotNative: stall.hotNative,
          });
        }
      }
    } catch {
      // Diagnostics only: a profiler failure must never touch the pulse.
    } finally {
      clearTimeout(hardStop);
      if (windowTimer !== null) {
        clearTimeout(windowTimer);
      }
      if (session.tailTimer !== null) {
        clearTimeout(session.tailTimer);
      }
      session.released = true;
      if (globalThis.__vibePhaseProfiler === session) {
        globalThis.__vibePhaseProfiler = null;
      }
      resolveDone();
      // Continuous: the next window starts right away (no unsampled gap
      // beyond the summarizing above).
      const continuousLogger = globalThis.__vibeProfilerContinuous;
      if (continuousLogger && !globalThis.__vibePhaseProfiler) {
        globalThis.__vibePhaseProfiler = startSession(continuousLogger);
      }
    }
  })();
  return session;
}

function currentSession(logger: EndpointLogger): ProfileSession {
  const current = globalThis.__vibePhaseProfiler;
  const session = current && !current.released ? current : startSession(logger);
  globalThis.__vibePhaseProfiler = session;
  return session;
}

export class PhaseProfiler {
  /**
   * Sample the JS thread while this phase runs and for TAIL_MS after it ends.
   * Overlapping phases share one session. Returns an idempotent end function.
   */
  static hold(label: string, logger: EndpointLogger): () => void {
    if (typeof Bun === "undefined") {
      return (): void => undefined;
    }
    const session = currentSession(logger);
    if (session.tailTimer !== null) {
      clearTimeout(session.tailTimer);
      session.tailTimer = null;
    }
    const phase: PhaseWindow = { label, startedAt: Date.now(), endedAt: null };
    session.phases.push(phase);
    openPhases().add(phase);

    let ended = false;
    return (): void => {
      if (ended) {
        return;
      }
      ended = true;
      phase.endedAt = Date.now();
      openPhases().delete(phase);
      // Continuous sessions close on their window timer (which honours the
      // tail); a phase-only session closes TAIL_MS after its last phase.
      const live = globalThis.__vibePhaseProfiler;
      if (
        live &&
        !live.released &&
        openPhases().size === 0 &&
        !globalThis.__vibeProfilerContinuous
      ) {
        if (live.tailTimer !== null) {
          clearTimeout(live.tailTimer);
        }
        live.tailTimer = setTimeout(live.release, TAIL_MS);
      }
    };
  }

  /**
   * Sample the JS thread all the time, in back-to-back windows, so every lag
   * row can carry the stack that blocked the loop, not only stalls inside a
   * cron phase. Prod 2026-11-15..18: ~80% of lag rows had no task running and
   * no request in flight, so nothing named their cause. Idempotent.
   */
  static startContinuous(logger: EndpointLogger): void {
    if (typeof Bun === "undefined" || globalThis.__vibeProfilerContinuous) {
      return;
    }
    globalThis.__vibeProfilerContinuous = logger;
    const current = globalThis.__vibePhaseProfiler;
    if (!current || current.released) {
      globalThis.__vibePhaseProfiler = startSession(logger);
    }
  }

  /** Stop continuous sampling (tests); phase sessions keep working. */
  static stopContinuous(): void {
    globalThis.__vibeProfilerContinuous = null;
    const current = globalThis.__vibePhaseProfiler;
    if (current && !current.released && openPhases().size === 0) {
      current.release();
    }
  }

  /**
   * Close the session that covers `at` now and wait (bounded) for its
   * summary, so profileCovering(at) can answer. The lag monitor calls this
   * right after it measured a stall. No-op without a session.
   */
  static async flush(at: number): Promise<void> {
    const current = globalThis.__vibePhaseProfiler;
    if (current && !current.released && current.startedAt <= at) {
      current.release();
    }
    const pending = globalThis.__vibeProfilerPending;
    if (!pending) {
      return;
    }
    let timer: ReturnType<typeof setTimeout> | undefined;
    await Promise.race([
      pending,
      new Promise<void>((resolve) => {
        timer = setTimeout(resolve, FLUSH_WAIT_MS);
      }),
    ]);
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  }

  /** True while continuous sampling runs (a lag row without a profile = no JS ran). */
  static isContinuous(): boolean {
    return Boolean(globalThis.__vibeProfilerContinuous);
  }

  /** Stall profile whose session covered this wall-clock instant, if any. */
  static profileCovering(at: number): StallProfile | undefined {
    return recent().findLast(
      (profile) =>
        profile.sessionStartedAt <= at && at <= profile.sessionEndedAt,
    );
  }
}
