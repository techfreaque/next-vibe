/**
 * Live frame — repainting output region for the CLI fast renderer.
 *
 * The fast renderer (fast-ink-renderer/renderer.ts) is a one-shot
 * `data -> string` function: every reconciler mutation op is a deliberate no-op,
 * there is no diffing and no layout engine. So "realtime" here is not React
 * re-rendering in place — it is rendering a NEW complete frame per update and
 * repainting the terminal region the previous frame occupied.
 *
 * Erase strategy: walk the cursor up over the previous frame's DISPLAY ROW
 * count, clearing each line as we pass it, then write the new frame over the
 * top. Display rows != "\n" count — a long file path or a wide emoji wraps to
 * multiple terminal rows, and undercounting leaves orphaned fragments in the
 * scrollback on every repaint.
 *
 * Everything is drawn in the NORMAL buffer — never the alternate screen — so
 * scrolling through a run behaves exactly like static command output. A frame
 * is always written in full, whatever the terminal size; nothing is truncated
 * and animation is never abandoned.
 *
 * The one hard limit is the viewport: rows that scroll above its top can no
 * longer be addressed, since cursor-up cannot reach past row 0. So the rewind
 * is capped at the viewport height. A frame taller than the terminal therefore
 * repaints its visible part in place and leaves the rows above it in
 * scrollback, exactly as static output would.
 *
 * Non-TTY (pipes, CI, `vibe check > out.txt`, MCP) never repaints: cursor escape
 * codes in a redirected file are corruption, not animation.
 */

import type { CreateApiEndpointAny } from "../../../../core/definition/endpoint-base";
import type { CountryLanguage } from "../../../../core/i18n/core/config";
import type { WidgetData } from "../../../../core/utils/json";
import type { JwtPayloadType } from "../../../../identity/auth/types";
import type { Platform } from "../../../../platforms/platforms";
import type { EndpointLogger } from "../../../../logger/types";
import stringWidth from "string-width";
import stripAnsi from "strip-ansi";

/** Minimum gap between repaints. Updates inside the window coalesce. */
const REPAINT_THROTTLE_MS = 60;

const CURSOR_HIDE = "\x1b[?25l";
const CURSOR_SHOW = "\x1b[?25h";

/**
 * Erase the `rows` lines above the cursor, leaving it at column 0 of the first.
 *
 * Deliberately per-line (`\x1b[2K` on each) rather than one erase-to-end-of-
 * display (`\x1b[0J`). `\x1b[0J` blanks the whole region before the new bytes
 * land, so every repaint is a visible blank-then-redraw — that gap IS the
 * flicker, and it is far worse on Windows conhost than on VTE/iTerm. Clearing
 * only the lines we are about to overwrite means each row is replaced in place
 * and no empty frame is ever shown. This is what Ink's log-update does too.
 *
 * The cursor sits on the blank line BELOW the frame (the write ends in "\n"),
 * so each step must move up first and then clear: after `rows` iterations the
 * cursor is on the frame's first line with all of it erased. `\x1b[G` then
 * pins column 0, since `\x1b[2K` leaves the column where it found it.
 */
function eraseRows(rows: number): string {
  if (rows <= 0) {
    return "";
  }
  return `${"\x1b[1A\x1b[2K".repeat(rows)}\x1b[G`;
}

/**
 * How many terminal rows `frame` occupies once wrapped at `columns`.
 * ANSI colour codes carry no width, and an empty line still occupies one row.
 */
export function countDisplayRows(frame: string, columns: number): number {
  if (columns <= 0) {
    return frame.split("\n").length;
  }
  let rows = 0;
  for (const line of frame.split("\n")) {
    const width = stringWidth(stripAnsi(line));
    rows += width === 0 ? 1 : Math.ceil(width / columns);
  }
  return rows;
}

export interface LiveFrame {
  /** Repaint with new data. Throttled and coalesced; safe to call rapidly. */
  update: (data: WidgetData) => void;
  /**
   * Emit a permanent line above the live region (log output). The frame is
   * erased, the line is committed to scrollback, then the frame repaints below.
   */
  writeAbove: (line: string) => void;
  /**
   * Erase the live region and restore the cursor.
   *
   * Deliberately does NOT paint the final frame: the caller's existing
   * formatResult path renders the authoritative result immediately after. The
   * live region is transient scaffolding, so the final output is produced by
   * exactly one code path and cannot drift from the non-live case.
   */
  stop: () => Promise<void>;
  /** False when this frame is inert (non-TTY) — caller can skip event tapping. */
  readonly isLive: boolean;
}

/**
 * Create a live frame bound to one endpoint execution.
 * When stdout is not a TTY the returned frame is inert: update() is a no-op, so
 * the command behaves exactly as it did before live rendering existed.
 */
export function createLiveFrame({
  endpoint,
  locale,
  logger,
  user,
  stream = process.stdout,
  renderFrame,
  platform,
}: {
  endpoint: CreateApiEndpointAny;
  locale: CountryLanguage;
  logger: EndpointLogger;
  user: JwtPayloadType;
  stream?: NodeJS.WriteStream;
  /** Surface being rendered for, so an in-flight frame matches the final one. */
  platform: Platform;
  /**
   * Override the frame renderer. Production leaves this unset and the endpoint
   * widget is rendered; tests inject a stub so terminal-control behaviour can be
   * asserted without pulling in the Ink widget tree.
   */
  renderFrame?: (data: WidgetData) => Promise<string>;
}): LiveFrame {
  const isLive = stream.isTTY === true && (stream.columns ?? 0) > 0;

  let lastRows = 0;
  let cursorHidden = false;
  let pending: WidgetData | null = null;
  /** The in-flight repaint, so stop() can await it instead of polling a flag. */
  let inFlight: Promise<void> | null = null;
  let lastPaintAt = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let stopped = false;
  /**
   * The exact bytes last written, so an update that renders identically can
   * skip the repaint entirely. Merged websocket events frequently produce a
   * byte-identical frame (a field changed that this widget does not show), and
   * repainting for those is pure flicker with nothing to show for it.
   */
  let lastFrame = "";
  /**
   * The most recent data painted, so a resize can repaint immediately instead
   * of leaving a reflowed frame on screen until the next event happens to
   * arrive — which during a slow install can be many seconds.
   */
  let lastData: WidgetData | null = null;

  function restoreCursor(): void {
    if (cursorHidden) {
      stream.write(CURSOR_SHOW);
      cursorHidden = false;
    }
  }

  // A killed `vibe check` must not leave the terminal with an invisible cursor.
  const onExit = (): void => restoreCursor();
  const onSignal = (): void => {
    restoreCursor();
    process.exit(130);
  };
  // The terminal reflows already-painted rows to the new width on its own, and
  // never tells us the new row count — so `lastRows`, measured at the OLD
  // width, no longer describes what is on screen.
  //
  // We do still know the old frame's TEXT, so re-measuring it at the new width
  // gives the count the terminal just reflowed it to. That is the number of
  // rows to rewind. Simply zeroing `lastRows` (what this did before) skips the
  // erase entirely and prints the next frame BELOW the reflowed one, leaving a
  // duplicate on screen — which is what a resize visibly did.
  //
  // This assumes the terminal reflows on resize. Every modern one does (xterm,
  // VTE, iTerm, Windows Terminal/ConPTY); on one that does not, the old frame
  // keeps its original wrapping and the count is too small. That is strictly
  // better than the old behaviour, which was wrong on every terminal.
  const onResize = (): void => {
    lastRows =
      lastFrame === "" ? 0 : countDisplayRows(lastFrame, stream.columns ?? 80);
    // Force the next paint to write even if the bytes are unchanged: the frame
    // has to be re-laid-out at the new width regardless.
    lastFrame = "";
    // Repaint now rather than waiting for the next event. An install can sit
    // seconds between updates, and until one arrives the screen holds the
    // mangled reflowed frame — the resize itself has to fix it.
    if (pending === null && lastData !== null) {
      pending = lastData;
    }
    schedule();
  };
  if (isLive) {
    process.once("exit", onExit);
    process.once("SIGINT", onSignal);
    process.once("SIGTERM", onSignal);
    stream.on("resize", onResize);
  }

  function detachSignals(): void {
    if (isLive) {
      process.off("exit", onExit);
      process.off("SIGINT", onSignal);
      process.off("SIGTERM", onSignal);
      stream.off("resize", onResize);
    }
  }

  async function render(data: WidgetData): Promise<string> {
    if (renderFrame) {
      return await renderFrame(data);
    }
    // Lazily imported: the formatter pulls in the whole Ink widget tree, which
    // must not land on the CLI startup path (nor in a unit test that only cares
    // about terminal control).
    const { CliResultFormatter } = await import("./result-formatter");
    return await CliResultFormatter.renderWithEndpoint(
      data,
      endpoint,
      locale,
      logger,
      user,
      platform,
    );
  }

  async function paint(data: WidgetData): Promise<void> {
    const rendered = await render(data);
    const columns = stream.columns ?? 80;
    // Normalise trailing newlines before measuring. The renderer may or may not
    // end a frame with one (a trailing margin does, a bare row does not), and
    // measuring a string that differs from what we write by even one line makes
    // the next erase overshoot or undershoot — overshoot eats the shell prompt,
    // undershoot strands the top row in the scrollback.
    const frame = rendered.replace(/\n+$/, "");
    const rows = countDisplayRows(frame, columns);
    // Never rewind further than the viewport. Rows above the top have scrolled
    // out of addressable space — no escape sequence can reach them — so asking
    // for more cursor-up than that does not erase them, it just eats whatever
    // is on screen now. Everything stays in the normal buffer, so scrolling
    // through the run behaves exactly like static command output.
    const rewind = Math.min(lastRows, Math.max(0, (stream.rows ?? 24) - 1));

    // Nothing changed since the last write — repainting identical bytes is
    // flicker with no information gained.
    if (frame === lastFrame && lastRows > 0) {
      lastPaintAt = Date.now();
      return;
    }

    if (!cursorHidden) {
      stream.write(CURSOR_HIDE);
      cursorHidden = true;
    }
    // `frame` has no trailing newline, so it occupies exactly `rows` rows and the
    // single "\n" leaves the cursor on the blank line directly below it. Moving
    // up `rewind` therefore lands on the frame's FIRST line — not one above it.
    stream.write(`${eraseRows(rewind)}${frame}\n`);
    lastRows = rows;
    lastFrame = frame;
    lastPaintAt = Date.now();
  }

  function schedule(): void {
    if (timer !== null || stopped) {
      return;
    }
    const wait = Math.max(0, REPAINT_THROTTLE_MS - (Date.now() - lastPaintAt));
    // Not unref'd: the ambient setTimeout here is typed as the DOM one, and a
    // pending repaint is at most REPAINT_THROTTLE_MS anyway. stop() clears it,
    // so it can never outlive the command.
    timer = setTimeout(() => {
      timer = null;
      void flush();
    }, wait);
  }

  async function flush(): Promise<void> {
    if (inFlight !== null || pending === null || stopped) {
      return;
    }
    const data = pending;
    pending = null;
    const run = (async (): Promise<void> => {
      try {
        await paint(data);
      } catch (error) {
        // A failed live paint must never break the command — the authoritative
        // result is printed by the caller's normal formatResult path.
        logger.debug(`[LiveFrame] repaint skipped: ${String(error)}`);
      }
    })();
    inFlight = run;
    await run;
    inFlight = null;
    if (pending !== null) {
      schedule();
    }
  }

  return {
    isLive,

    update: (data: WidgetData): void => {
      if (!isLive || stopped) {
        return;
      }
      pending = data;
      lastData = data;
      schedule();
    },

    writeAbove: (line: string): void => {
      if (!isLive) {
        stream.write(`${line}\n`);
        return;
      }
      stream.write(`${eraseRows(lastRows)}${line}\n`);
      lastRows = 0;
      if (pending !== null) {
        schedule();
      }
    },

    stop: async (): Promise<void> => {
      stopped = true;
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      pending = null;
      // Wait out an in-flight repaint so its write cannot land after we erase
      // the region and leave a duplicate frame on screen.
      if (inFlight !== null) {
        await inFlight;
      }
      if (isLive && lastRows > 0) {
        stream.write(
          eraseRows(Math.min(lastRows, Math.max(0, (stream.rows ?? 24) - 1))),
        );
        lastRows = 0;
        lastFrame = "";
      }
      restoreCursor();
      detachSignals();
    },
  };
}
