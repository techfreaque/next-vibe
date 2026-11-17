/**
 * Self-healing decisions for `vibe start` (pure, unit-tested).
 *
 * Incident 2026-11-17 (HA Server 2): during an 80-minute WireGuard outage the
 * server child crashed and was restarted by the supervisor, after which its
 * Next.js child exited with code 1 on every start for 1.5 h (~980 restarts,
 * proxy: ECONNREFUSED on the internal port, DB-backed probe timing out) while
 * the network had long recovered. Only `docker restart` (a fresh process
 * tree) fixed it. Three gaps made that permanent:
 *  - the Next.js restart loop never reclaimed its port from a leftover
 *    process of the crashed generation;
 *  - nothing escalated when Next.js could not come up: the loop retried every
 *    30 s forever (and "did not respond in time" was even counted as a
 *    recovery, resetting the backoff);
 *  - the supervisor restarted the child forever too, while in a container a
 *    supervisor exit would make Docker restart everything cleanly.
 * The trackers below decide when to escalate; repository.ts acts on them.
 */

/** Next.js may stay unreachable this long (while restarting) before the server process gives up and exits so the supervisor starts a fresh one. */
export const NEXT_DOWN_ESCALATE_MS = 5 * 60_000;

/**
 * Tracks whether the internal Next.js server has been reachable recently.
 * "Down" starts at the first failed start (or exit) after the last time it
 * answered, and ends when it answers again.
 */
export class NextUptimeTracker {
  private downSince: number | null = null;

  constructor(private readonly escalateAfterMs = NEXT_DOWN_ESCALATE_MS) {}

  /** Next.js answered (start wait succeeded). */
  markUp(): void {
    this.downSince = null;
  }

  /** Next.js exited or did not answer in time. */
  markDown(now: number): void {
    this.downSince ??= now;
  }

  downForMs(now: number): number {
    return this.downSince === null ? 0 : now - this.downSince;
  }

  shouldEscalate(now: number): boolean {
    return (
      this.downSince !== null && this.downForMs(now) >= this.escalateAfterMs
    );
  }
}

/** Crashes of the server child within this window count towards a crash loop. */
export const CRASH_LOOP_WINDOW_MS = 15 * 60_000;
/** This many child crashes inside the window = a crash loop. */
export const CRASH_LOOP_MAX_CRASHES = 6;

/**
 * Supervisor-side crash-loop detection. Only acted on when the supervisor is
 * the container's PID 1: exiting then lets Docker's restart policy start a
 * fresh container process tree (no orphans, clean sockets), the same thing a
 * manual `docker restart` did on 2026-11-17. Outside a container the
 * supervisor keeps restarting (a local `vibe start` must never just vanish).
 */
export class CrashLoopTracker {
  private crashes: number[] = [];

  constructor(
    private readonly windowMs = CRASH_LOOP_WINDOW_MS,
    private readonly maxCrashes = CRASH_LOOP_MAX_CRASHES,
  ) {}

  /** Record a crash; returns true when this crash completes a crash loop. */
  recordCrash(now: number): boolean {
    this.crashes = this.crashes.filter((t) => now - t < this.windowMs);
    this.crashes.push(now);
    return this.crashes.length >= this.maxCrashes;
  }

  get recentCrashes(): number {
    return this.crashes.length;
  }
}

/**
 * Last lines a child printed, so the error log of a crash says WHY (on
 * 2026-11-17 Next.js's exit reason only went to docker stdout, which the
 * container recreate wiped).
 */
export class OutputTail {
  private lines: string[] = [];
  private partial = "";

  constructor(
    private readonly maxLines = 20,
    private readonly maxLineLength = 400,
  ) {}

  push(chunk: string): void {
    const text = this.partial + chunk;
    const parts = text.split("\n");
    this.partial = parts.pop() ?? "";
    for (const line of parts) {
      this.add(line);
    }
    if (this.partial.length > this.maxLineLength * 4) {
      this.add(this.partial);
      this.partial = "";
    }
  }

  private add(rawLine: string): void {
    // eslint-disable-next-line no-control-regex -- strip ANSI colour codes from child output
    const line = rawLine.replaceAll(/\u001B\[[0-9;]*m/g, "").trimEnd();
    if (line.length === 0) {
      return;
    }
    this.lines.push(
      line.length > this.maxLineLength
        ? `${line.slice(0, this.maxLineLength)}...`
        : line,
    );
    if (this.lines.length > this.maxLines) {
      this.lines.shift();
    }
  }

  text(): string {
    const all =
      this.partial.trim().length > 0
        ? [...this.lines, this.partial.trimEnd()]
        : this.lines;
    return all.join("\n");
  }
}

/**
 * PIDs whose parent is `parentPid`, from Linux /proc `stat` contents
 * (`<pid> (<comm>) <state> <ppid> ...`; comm may contain spaces and parens,
 * so parse after the LAST ')'). Zombies (state Z) are skipped: they hold no
 * resources and cannot be killed.
 */
export function childPidsFromProcStat(
  stats: ReadonlyArray<{ pid: number; stat: string }>,
  parentPid: number,
): number[] {
  const result: number[] = [];
  for (const { pid, stat } of stats) {
    const close = stat.lastIndexOf(")");
    if (close === -1) {
      continue;
    }
    const fields = stat.slice(close + 2).split(" ");
    const state = fields[0];
    const ppid = Number.parseInt(fields[1] ?? "", 10);
    if (ppid === parentPid && state !== "Z") {
      result.push(pid);
    }
  }
  return result;
}
