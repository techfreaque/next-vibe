/**
 * Live frame — a live-updating region for the CLI fast renderer, in one of
 * two modes depending on how tall the content actually is.
 *
 * The fast renderer (fast-ink-renderer/renderer.ts) is a one-shot
 * `data -> string` function: every reconciler mutation op is a deliberate no-op,
 * there is no diffing and no layout engine. So "realtime" here is not React
 * re-rendering in place — it is rendering a NEW complete frame per update and
 * repainting the terminal from that frame.
 *
 * INLINE mode (the default): the frame fits inside the current viewport. We
 * stay on the real, normal-buffer terminal — no alternate screen — and redraw
 * in place with plain cursor movement: jump up to the top of the last frame,
 * erase to end of screen, print the new one. This keeps every intermediate
 * frame in the terminal's REAL scrollback (nothing is thrown away), and,
 * critically, leaves the mouse alone: native click-drag text selection still
 * works while the command is running, because we never touch mouse reporting
 * or an alternate buffer the terminal has to swap back out of.
 *
 * FULLSCREEN mode: the frame has grown taller than the viewport. A frame that
 * tall cannot be addressed from the normal buffer once its top rows have
 * scrolled past row 0 — no escape sequence reaches them, full stop. The only
 * way to let a user scroll UP and see rows that keep updating (not just
 * frozen scrollback) is to own the whole buffer ourselves, in the ALTERNATE
 * screen: keep every line ever painted in memory, and redraw whichever
 * `viewportRows`-tall window into that memory the user has scrolled to.
 *
 * The mode is re-decided on every paint: a frame that overflows the viewport
 * upgrades to fullscreen, and one that later fits again — it shrank, or the
 * terminal was resized larger — downgrades back to inline. Whatever was
 * already printed inline before an upgrade stays sitting on the real buffer,
 * hidden behind the alternate screen; a later downgrade reveals it again and
 * redraws over it in place, exactly like any other inline repaint. Anything
 * committed via writeAbove while fullscreen never reached the real buffer, so
 * it does not survive a downgrade — the same as an ordinary alternate-screen
 * exit discarding it.
 *
 * Consequence for fullscreen: leaving the alternate screen (stop(), or a
 * downgrade) restores whatever was on the terminal before this frame started
 * — there is no erase math to get wrong, the terminal did it for us.
 * Consequence for inline: stop() erases the last frame itself, so the two
 * modes leave the terminal in the same state — ready for the caller's normal
 * `formatResult` print to land as the sole, authoritative output.
 *
 * Scrolling (fullscreen only — an inline frame shows everything at once, so
 * there is nothing to scroll) is driven by arrow keys / Page Up / Page Down /
 * Home / End (raw stdin). Content follows the tail automatically until the
 * user scrolls up; scrolling back to the bottom (or pressing End) re-engages
 * auto-follow.
 *
 * Deliberately NOT mouse-driven: SGR mouse reporting would let a wheel tick
 * scroll the frame, but turning it on hijacks every mouse event for the
 * app's own use, including click-drag — which is how a terminal's native
 * text selection works. That traded "copy the output" for "scroll with the
 * wheel" on a frame whose whole reason to exist is to be read (and copied)
 * WHILE the command is still running. Keyboard scrolling costs nothing here.
 *
 * Non-TTY (pipes, CI, `vibe check > out.txt`, MCP) never touches escapes or
 * stdin: cursor escape codes in a redirected file are corruption, not
 * animation.
 */

import stringWidth from "string-width";
import stripAnsi from "strip-ansi";

import type { CreateApiEndpointAny } from "../../../../core/definition/endpoint-base";
import type { CountryLanguage } from "../../../../core/i18n/core/config";
import type { WidgetData } from "../../../../core/utils/json";
import type { JwtPayloadType } from "../../../../identity/auth/types";
import type { EndpointLogger } from "../../../../logger/types";
import type { Platform } from "../../../../platforms/platforms";

/** Minimum gap between repaints. Updates inside the window coalesce. */
const REPAINT_THROTTLE_MS = 60;

const CURSOR_HIDE = "\x1b[?25l";
const CURSOR_SHOW = "\x1b[?25h";
const ALT_SCREEN_ENTER = "\x1b[?1049h";
const ALT_SCREEN_EXIT = "\x1b[?1049l";
const HOME = "\x1b[H";

/**
 * Split one logical line into rows no wider than `columns` display columns.
 *
 * The common case (line already fits) returns it untouched, ANSI intact. Only
 * a genuinely overflowing line is stripped and re-chunked by display width —
 * styling on the resulting continuation segments is lost. That is a real
 * fidelity trade, made deliberately: re-deriving which ANSI codes are "open"
 * at an arbitrary column of an arbitrary escape sequence is not worth doing
 * for wrapped overflow text in a scrollback viewer.
 */
export function wrapLine(line: string, columns: number): string[] {
  if (columns <= 0 || stringWidth(stripAnsi(line)) <= columns) {
    return [line];
  }
  const plain = stripAnsi(line);
  const rows: string[] = [];
  let current = "";
  let width = 0;
  for (const ch of plain) {
    const w = stringWidth(ch) || 1;
    if (width > 0 && width + w > columns) {
      rows.push(current);
      current = "";
      width = 0;
    }
    current += ch;
    width += w;
  }
  rows.push(current);
  return rows;
}

/** Flatten every logical line in `lines` into wrapped display rows. */
function buildVisualRows(lines: string[], columns: number): string[] {
  const rows: string[] = [];
  for (const line of lines) {
    rows.push(...wrapLine(line, columns));
  }
  return rows;
}

export interface LiveFrame {
  /** Repaint with new data. Throttled and coalesced; safe to call rapidly. */
  update: (data: WidgetData) => void;
  /**
   * Commit a permanent line to the top of the scroll history. Unlike the live
   * frame content (replaced wholesale on every update), this line is never
   * rewritten again.
   */
  writeAbove: (line: string) => void;
  /**
   * Leave the live region and restore the terminal to what it showed before
   * this frame started.
   *
   * Deliberately does NOT paint the final frame: the caller's existing
   * formatResult path renders the authoritative result immediately after,
   * onto the real (normal-buffer) terminal. The live region is transient
   * scaffolding, so the final output is produced by exactly one code path and
   * cannot drift from the non-live case.
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
  input = process.stdin,
  renderFrame,
  platform,
}: {
  endpoint: CreateApiEndpointAny;
  locale: CountryLanguage;
  logger: EndpointLogger;
  user: JwtPayloadType;
  stream?: NodeJS.WriteStream;
  /** Keyboard/mouse source. Overridable so tests never touch the real TTY. */
  input?: NodeJS.ReadStream;
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
  /** Scrolling needs raw keyboard/mouse input, which only a TTY stdin gives us. */
  const canScroll = isLive && input.isTTY === true;

  /** Permanent lines committed via writeAbove — never rewritten. */
  const log: string[] = [];
  /** The current frame's lines, replaced wholesale on every update. */
  let frameLines: string[] = [];
  let lastFrame = "";
  /**
   * Bumped whenever `log` or `frameLines` changes, so `draw()` can skip
   * rebuilding the wrapped-row array on a pure scroll/resize repaint. Without
   * this, holding Page Down over a large frame re-wraps every line on every
   * single tick for no reason — only the slice shown actually changes.
   */
  let contentVersion = 0;
  let visualRowsCache: {
    columns: number;
    version: number;
    rows: string[];
  } | null = null;

  /** First visible visual row when not following the tail. */
  let scrollTop = 0;
  /** True until the user scrolls up; re-engages when they scroll back to the bottom. */
  let followTail = true;
  /** From the most recent paint, so key handlers can clamp without re-measuring. */
  let lastVisualRowCount = 0;
  let lastViewportRows = 0;

  let cursorHidden = false;
  /** True once the alternate screen is entered — fullscreen mode is active. */
  let screenEntered = false;
  /**
   * Inline-mode row count from the last paint — how many lines to jump up
   * before erasing and redrawing. 0 in fullscreen mode (unused there) and
   * before the first inline paint.
   */
  let inlineRowCount = 0;
  let rawModeEntered = false;
  let pending: WidgetData | null = null;
  /** The in-flight repaint, so stop() can await it instead of polling a flag. */
  let inFlight: Promise<void> | null = null;
  let lastPaintAt = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let stopped = false;

  function maxScrollTop(): number {
    return Math.max(0, lastVisualRowCount - lastViewportRows);
  }

  /**
   * Never rewind further than the viewport allows. Rows above its top have
   * scrolled out of addressable space — no escape sequence can reach them —
   * so asking for more cursor-up than that does not erase them: the cursor
   * clamps at row 0 and the following erase-to-end-of-screen eats whatever
   * FOREIGN content is on screen there (after a shrinking resize, that is
   * the user's own prompt and scrollback lines).
   */
  function cappedInlineRewind(): number {
    return Math.min(inlineRowCount, Math.max(0, (stream.rows ?? 24) - 1));
  }

  /**
   * Runs from stop() and from the exit/SIGINT/SIGTERM handlers — a broken
   * pipe (EPIPE) here is a classic real-world crash for CLI tools, and
   * cleanup must not throw regardless of which handler triggered it, so each
   * step is independently guarded rather than wrapping the whole function:
   * one failing write must not skip disabling raw mode.
   */
  function restoreTerminal(): void {
    if (screenEntered) {
      try {
        stream.write(ALT_SCREEN_EXIT);
      } catch (error) {
        logger.debug(`[LiveFrame] terminal restore skipped: ${String(error)}`);
      }
      screenEntered = false;
    }
    if (cursorHidden) {
      try {
        stream.write(CURSOR_SHOW);
      } catch (error) {
        logger.debug(`[LiveFrame] terminal restore skipped: ${String(error)}`);
      }
      cursorHidden = false;
    }
    if (rawModeEntered) {
      try {
        input.setRawMode?.(false);
        input.pause?.();
      } catch (error) {
        logger.debug(`[LiveFrame] terminal restore skipped: ${String(error)}`);
      }
      rawModeEntered = false;
    }
  }

  // A killed live command must not leave the terminal in the alternate screen
  // with raw mode still enabled.
  const onExit = (): void => restoreTerminal();
  const onSignal = (): void => {
    restoreTerminal();
    process.exit(130);
  };
  const onResize = (): void => {
    // The terminal reflows the rows already painted inline to the new width on
    // its own, and never tells us the new row count — so `inlineRowCount`,
    // measured at the OLD width, no longer describes what is on screen: a
    // wrapped line reflows to a different number of rows, and rewinding by the
    // stale count over- or undershoots (eating foreign lines, or leaving a
    // duplicate frame behind).
    //
    // We do still know the old frame's TEXT, so re-measuring it at the new
    // width gives the count the terminal just reflowed it to. This assumes the
    // terminal reflows on resize. Every modern one does (xterm, VTE, iTerm,
    // Windows Terminal/ConPTY); on one that does not, the old frame keeps its
    // original wrapping and the count is unchanged anyway.
    if (!screenEntered && inlineRowCount > 0) {
      inlineRowCount = buildVisualRows(frameLines, stream.columns ?? 80).length;
    }
    // A resize needs an immediate re-layout of whatever is already on screen,
    // not the throttled update pipeline — there may be no new WidgetData at
    // all, so routing through `pending` would silently drop the redraw.
    // `cursorHidden` marks "we've painted at least once" in either mode.
    if (cursorHidden) {
      safeDraw();
    }
  };
  if (isLive) {
    process.once("exit", onExit);
    // Raw mode disables signal generation on most platforms, so Ctrl+C is
    // handled as a `\x03` byte in onInput instead — but not reliably on every
    // platform/terminal (Windows conhost in particular can still deliver
    // SIGINT even in raw mode), so both paths are wired and either can fire.
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
    if (canScroll) {
      input.off("data", onInput);
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

  /**
   * Redraw in place on the real (normal-buffer) terminal: jump up to the top
   * of the last inline paint, erase to end of screen (handles a frame that
   * shrank — the fewer new rows would otherwise leave old trailing rows
   * behind), then print the new one. `\r` first guarantees column 0 before
   * the vertical jump, regardless of where the cursor was left.
   */
  function drawInline(frameRows: string[]): void {
    if (!cursorHidden) {
      stream.write(CURSOR_HIDE);
      cursorHidden = true;
    }
    const rewind = cappedInlineRewind();
    const up = rewind > 0 ? `\x1b[${String(rewind)}A` : "";
    const body = frameRows.map((row) => `${row}\x1b[K\r\n`).join("");
    stream.write(`\r${up}\x1b[0J${body}`);
    inlineRowCount = frameRows.length;
  }

  /** Full-screen scrollable redraw — see the file header for why this exists. */
  function drawFullscreen(columns: number, viewportRows: number): void {
    let visualRows: string[];
    if (
      visualRowsCache !== null &&
      visualRowsCache.columns === columns &&
      visualRowsCache.version === contentVersion
    ) {
      visualRows = visualRowsCache.rows;
    } else {
      visualRows = buildVisualRows([...log, ...frameLines], columns);
      visualRowsCache = { columns, version: contentVersion, rows: visualRows };
    }

    lastVisualRowCount = visualRows.length;
    lastViewportRows = viewportRows;

    if (followTail) {
      scrollTop = maxScrollTop();
    } else {
      scrollTop = Math.min(scrollTop, maxScrollTop());
    }

    if (!cursorHidden) {
      stream.write(CURSOR_HIDE);
      cursorHidden = true;
    }

    const visible: string[] = [];
    for (let i = 0; i < viewportRows; i += 1) {
      visible.push(visualRows[scrollTop + i] ?? "");
    }
    // HOME + per-row clear-to-end-of-line makes the paint a pure function of
    // (model, scroll, viewport) — no erase math, no reflow tracking. Joined
    // without a trailing newline, so the cursor never passes the last row and
    // the alternate screen itself can never scroll out from under us.
    stream.write(`${HOME}${visible.map((row) => `${row}\x1b[K`).join("\r\n")}`);
  }

  /**
   * Picks the mode for this paint. `screenEntered` doubles as the "fullscreen
   * is active" flag, re-evaluated on every paint against the CURRENT frame
   * size and viewport — a frame that outgrows the viewport upgrades to the
   * alternate screen, and one that later fits again (it shrank, or the
   * terminal was resized larger) downgrades back to inline. `inlineRowCount`
   * is deliberately never reset on upgrade: it is exactly how many rows are
   * still sitting on the real buffer, and a later downgrade needs that count
   * to erase them correctly instead of stacking new content underneath.
   */
  function draw(): void {
    const columns = stream.columns ?? 80;
    const viewportRows = stream.rows ?? 24;
    const frameRows = buildVisualRows(frameLines, columns);
    const fits = frameRows.length <= viewportRows;

    if (screenEntered && fits) {
      // Shrunk back within the viewport — leave the alternate screen and
      // resume inline redraw on the real buffer. Anything committed via
      // writeAbove while fullscreen never reached the real buffer, so it is
      // not carried over — the same as an ordinary alternate-screen exit.
      stream.write(ALT_SCREEN_EXIT);
      screenEntered = false;
      log.length = 0;
      scrollTop = 0;
      followTail = true;
      contentVersion += 1;
      drawInline(frameRows);
      return;
    }

    if (!screenEntered && !fits) {
      // Outgrown the viewport — hand off to the alternate screen. What was
      // already printed inline stays behind in the real scrollback; the
      // alternate screen starts fresh from here.
      stream.write(ALT_SCREEN_ENTER);
      screenEntered = true;
      contentVersion += 1;
      drawFullscreen(columns, viewportRows);
      return;
    }

    if (screenEntered) {
      drawFullscreen(columns, viewportRows);
      return;
    }
    drawInline(frameRows);
  }

  /**
   * draw(), guarded. Scroll/resize/writeAbove call this synchronously from
   * event handlers rather than through the throttled update pipeline — a
   * transient write failure there (EPIPE, terminal closed mid-scroll) must
   * not throw out of an event handler and crash the process. paintData()'s
   * own draw() call is already inside flush()'s try/catch, so it stays as-is.
   */
  function safeDraw(): void {
    try {
      draw();
    } catch (error) {
      logger.debug(`[LiveFrame] repaint skipped: ${String(error)}`);
    }
  }

  function schedulePaint(): void {
    if (!isLive || stopped) {
      return;
    }
    if (timer !== null) {
      return;
    }
    const wait = Math.max(0, REPAINT_THROTTLE_MS - (Date.now() - lastPaintAt));
    // Not unref'd: a pending repaint is at most REPAINT_THROTTLE_MS anyway, and
    // stop() clears it, so it can never outlive the command.
    timer = setTimeout(() => {
      timer = null;
      void flush();
    }, wait);
  }

  async function paintData(data: WidgetData): Promise<void> {
    const rendered = await render(data);
    const next = rendered.replace(/\n+$/, "");
    // `cursorHidden` is true once the first paint (either mode) has happened.
    if (next === lastFrame && cursorHidden) {
      // Nothing changed since the last write — merged websocket events
      // routinely produce a byte-identical frame for fields this widget does
      // not show. Recomputing and redrawing gains nothing.
      lastPaintAt = Date.now();
      return;
    }
    lastFrame = next;
    frameLines = next.length > 0 ? next.split("\n") : [];
    contentVersion += 1;
    draw();
    lastPaintAt = Date.now();
  }

  async function flush(): Promise<void> {
    if (inFlight !== null || stopped) {
      return;
    }
    if (pending === null) {
      return;
    }
    const data = pending;
    pending = null;
    const run = (async (): Promise<void> => {
      try {
        await paintData(data);
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
      schedulePaint();
    }
  }

  /**
   * Mutates scroll state only — does not draw. Callers batch these across a
   * whole input chunk and draw once, so a burst of buffered key events (fast
   * key-repeat) repaints once instead of once per event.
   */
  function scrollBy(rows: number): void {
    followTail = false;
    scrollTop = Math.max(0, Math.min(scrollTop + rows, maxScrollTop()));
    if (scrollTop >= maxScrollTop()) {
      followTail = true;
    }
  }

  const KEY_SEQUENCE =
    // oxlint-disable-next-line no-control-regex -- scroll keys ARE raw terminal escape sequences
    /\x1b\[A|\x1b\[B|\x1b\[5~|\x1b\[6~|\x1b\[H|\x1b\[1~|\x1bOH|\x1b\[F|\x1b\[4~|\x1bOF|\x03/g;

  function onInput(chunk: Buffer | string): void {
    try {
      const text = typeof chunk === "string" ? chunk : chunk.toString("utf8");
      let dirty = false;
      for (const match of text.matchAll(KEY_SEQUENCE)) {
        const token = match[0];
        if (token === "\x03") {
          onSignal();
          return;
        }
        // Scrolling only means anything once the frame has outgrown the
        // viewport and moved to the alternate screen — an inline frame shows
        // everything at once, so these keys are inert until then.
        if (!screenEntered) {
          continue;
        }
        switch (token) {
          case "\x1b[A": {
            scrollBy(-1);
            dirty = true;
            break;
          }
          case "\x1b[B": {
            scrollBy(1);
            dirty = true;
            break;
          }
          case "\x1b[5~": {
            scrollBy(-lastViewportRows);
            dirty = true;
            break;
          }
          case "\x1b[6~": {
            scrollBy(lastViewportRows);
            dirty = true;
            break;
          }
          case "\x1b[H":
          case "\x1b[1~":
          case "\x1bOH": {
            followTail = false;
            scrollTop = 0;
            dirty = true;
            break;
          }
          case "\x1b[F":
          case "\x1b[4~":
          case "\x1bOF": {
            followTail = true;
            dirty = true;
            break;
          }
          default:
            break;
        }
      }
      if (dirty && screenEntered) {
        safeDraw();
      }
    } catch (error) {
      logger.debug(`[LiveFrame] input handling skipped: ${String(error)}`);
    }
  }

  if (canScroll) {
    input.setRawMode?.(true);
    input.resume?.();
    input.on("data", onInput);
    rawModeEntered = true;
  }

  return {
    isLive,

    update: (data: WidgetData): void => {
      if (!isLive || stopped) {
        return;
      }
      pending = data;
      schedulePaint();
    },

    writeAbove: (line: string): void => {
      if (!isLive) {
        stream.write(`${line}\n`);
        return;
      }
      if (screenEntered) {
        log.push(line);
        contentVersion += 1;
        followTail = true;
        safeDraw();
        return;
      }
      // Inline mode: erase the current frame so the permanent line lands
      // above it in the real scrollback rather than inside it, write the
      // line, then let the normal draw() pipeline repaint the frame fresh
      // underneath.
      try {
        if (!cursorHidden) {
          stream.write(CURSOR_HIDE);
          cursorHidden = true;
        }
        const rewind = cappedInlineRewind();
        const up = rewind > 0 ? `\x1b[${String(rewind)}A` : "";
        stream.write(`\r${up}\x1b[0J${line}\n`);
        inlineRowCount = 0;
      } catch (error) {
        logger.debug(`[LiveFrame] writeAbove skipped: ${String(error)}`);
      }
      safeDraw();
    },

    stop: async (): Promise<void> => {
      stopped = true;
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      pending = null;
      // Wait out an in-flight repaint so its write cannot land after we leave
      // the alternate screen.
      if (inFlight !== null) {
        await inFlight;
      }
      // Inline mode never owned an alternate screen to discard, so — unlike
      // fullscreen — its last frame is still sitting in the real scrollback.
      // Erase it here so the caller's authoritative formatResult print is the
      // only thing left behind, same as fullscreen's implicit discard.
      if (!screenEntered && inlineRowCount > 0) {
        try {
          const rewind = cappedInlineRewind();
          const up = rewind > 0 ? `\x1b[${String(rewind)}A` : "";
          stream.write(`\r${up}\x1b[0J`);
        } catch (error) {
          logger.debug(`[LiveFrame] inline clear skipped: ${String(error)}`);
        }
        inlineRowCount = 0;
      }
      restoreTerminal();
      detachSignals();
    },
  };
}
