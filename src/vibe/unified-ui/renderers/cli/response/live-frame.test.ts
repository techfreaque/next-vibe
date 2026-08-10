// oxlint-disable oxlint-plugin-restricted/no-unknown, oxlint-plugin-restricted/no-throw
/**
 * createLiveFrame — terminal-control mechanics for the CLI live region.
 *
 * INLINE-*     : content that fits the viewport stays on the normal buffer,
 *                redrawn in place with cursor movement — no alternate screen.
 * FULLSCREEN-* : entering/leaving the alternate screen once content outgrows
 *                the viewport, and cursor state around it.
 * UPGRADE-*    : a frame that starts small and grows past the viewport mid-run.
 * WRAP-*       : display-width line wrapping, ANSI- and wide-glyph-aware.
 * SCROLL-*     : keyboard scroll input moves the visible fullscreen window and
 *                disengages/re-engages tail-following.
 * RESIZE-*     : a resize re-lays-out the current content without needing new data.
 * CAP-*        : inline rewinds never exceed the viewport height — cursor-up
 *                clamps at row 0, so an uncapped jump erases foreign lines.
 * TTY-*        : a non-TTY stream (or non-TTY stdin) never touches escapes or
 *                raw mode — `vibe check > out.txt` must produce a clean file.
 *
 * The frame renderer is injected, so these tests cover terminal control only —
 * not React output.
 */

import { defaultLocale } from "../../../../core/i18n/core/config";
import { createEndpointLogger } from "../../../../logger/server";
import { Platform } from "../../../../platforms/platforms";
import { describe, expect, it } from "vitest";

import { createLiveFrame, wrapLine } from "./live-frame";

const ESC = String.fromCharCode(27);
const ALT_ENTER = `${ESC}[?1049h`;
const ALT_EXIT = `${ESC}[?1049l`;
const CURSOR_HIDE = `${ESC}[?25l`;
const CURSOR_SHOW = `${ESC}[?25h`;
const HOME = `${ESC}[H`;
const ERASE_DOWN = `${ESC}[0J`;

/** A stdout stand-in that records everything written to it. */
function makeOutputStream(
  isTTY: boolean,
  { throwOnWriteAfter }: { throwOnWriteAfter?: number } = {},
): {
  stream: NodeJS.WriteStream;
  written: () => string;
  resize: () => void;
  setSize: (columns: number, rows: number) => void;
  writeCount: () => number;
} {
  const chunks: string[] = [];
  let writes = 0;
  let resizeHandler: (() => void) | null = null;
  // Plain mutable properties (not getters routed through Object.assign, which
  // would snapshot the value at copy time instead of staying live).
  const asStream = Object.assign(Object.create(null) as NodeJS.WriteStream, {
    isTTY,
    columns: 80,
    rows: 24,
    write: (chunk: string): boolean => {
      writes += 1;
      if (throwOnWriteAfter !== undefined && writes > throwOnWriteAfter) {
        throw new Error("simulated EPIPE");
      }
      chunks.push(chunk);
      return true;
    },
    on: (event: string, handler: () => void): void => {
      if (event === "resize") {
        resizeHandler = handler;
      }
    },
    off: (event: string): void => {
      if (event === "resize") {
        resizeHandler = null;
      }
    },
  });
  return {
    stream: asStream,
    written: (): string => chunks.join(""),
    resize: (): void => resizeHandler?.(),
    setSize: (columns: number, rows: number): void => {
      asStream.columns = columns;
      asStream.rows = rows;
    },
    writeCount: (): number => writes,
  };
}

/** A stdin stand-in that records raw-mode calls and lets a test inject keypresses. */
function makeInputStream(isTTY: boolean): {
  input: NodeJS.ReadStream;
  rawModeCalls: boolean[];
  resumed: () => boolean;
  sendKey: (bytes: string) => void;
} {
  let dataHandler: ((chunk: string) => void) | null = null;
  const rawModeCalls: boolean[] = [];
  let isResumed = false;
  const stream = {
    isTTY,
    setRawMode: (enabled: boolean): void => {
      rawModeCalls.push(enabled);
    },
    resume: (): void => {
      isResumed = true;
    },
    pause: (): void => {
      isResumed = false;
    },
    on: (event: string, handler: (chunk: string) => void): void => {
      if (event === "data") {
        dataHandler = handler;
      }
    },
    off: (event: string): void => {
      if (event === "data") {
        dataHandler = null;
      }
    },
  };
  const asInput: NodeJS.ReadStream = Object.assign(
    Object.create(null) as NodeJS.ReadStream,
    stream,
  );
  return {
    input: asInput,
    rawModeCalls,
    resumed: (): boolean => isResumed,
    sendKey: (bytes: string): void => dataHandler?.(bytes),
  };
}

function makeEndpointStub(): Parameters<typeof createLiveFrame>[0]["endpoint"] {
  return Object.assign(
    Object.create(null) as Parameters<typeof createLiveFrame>[0]["endpoint"],
    { path: ["vibe", "tooling", "check"], method: "POST", fields: {} },
  );
}

function makeFrame(
  outputTTY: boolean,
  frames: string[],
  { inputTTY = outputTTY, throwOnWriteAfter }: { inputTTY?: boolean; throwOnWriteAfter?: number } = {},
): {
  frame: ReturnType<typeof createLiveFrame>;
  written: () => string;
  resize: () => void;
  setSize: (columns: number, rows: number) => void;
  sendKey: (bytes: string) => void;
  rawModeCalls: boolean[];
  writeCount: () => number;
} {
  const { stream, written, resize, setSize, writeCount } = makeOutputStream(outputTTY, {
    throwOnWriteAfter,
  });
  const { input, rawModeCalls, sendKey } = makeInputStream(inputTTY);
  let call = 0;
  const frame = createLiveFrame({
    endpoint: makeEndpointStub(),
    platform: Platform.CLI,
    locale: defaultLocale,
    logger: createEndpointLogger(false, defaultLocale),
    user: {
      id: "11111111-1111-1111-1111-111111111111",
      leadId: "11111111-1111-1111-1111-111111111111",
      isPublic: false,
      roles: [],
    },
    stream,
    input,
    renderFrame: (): Promise<string> => {
      const out = frames[Math.min(call, frames.length - 1)] ?? "";
      call += 1;
      return Promise.resolve(out);
    },
  });
  return { frame, written, resize, setSize, sendKey, rawModeCalls, writeCount };
}

/** Let the throttle timer fire and the async paint settle. */
async function waitForPaint(): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, 120);
  });
}

/** 30 rows — taller than the default 24-row test viewport, so it goes fullscreen. */
const TALL_CONTENT = [...Array(30).keys()].map((i) => `row${String(i)}`).join("\n");

describe("wrapLine", () => {
  it("WRAP-1: a line that fits is returned untouched, ANSI intact", () => {
    const styled = `${ESC}[31merror${ESC}[39m`;
    expect(wrapLine(styled, 80)).toEqual([styled]);
  });

  it("WRAP-2: an overflowing line is chunked by display width", () => {
    expect(wrapLine("x".repeat(10), 4)).toEqual(["xxxx", "xxxx", "xx"]);
  });

  it("WRAP-3: wide glyphs count as two columns when chunking", () => {
    // ３ wide glyphs, 2 columns wide each; 4 columns fits exactly 2 of them.
    expect(wrapLine("１２３", 4)).toEqual(["１２", "３"]);
  });
});

describe("createLiveFrame", () => {
  it("TTY-1: a non-TTY output stream is inert and writes no escapes", async () => {
    const { frame, written, rawModeCalls } = makeFrame(false, ["frame one"]);

    expect(frame.isLive).toBe(false);
    frame.update({ totalIssues: 1 });
    await waitForPaint();
    await frame.stop();

    expect(written()).not.toContain(ESC);
    expect(rawModeCalls).toEqual([]);
  });

  it("TTY-2: a TTY output with non-TTY stdin still paints, but never touches raw mode", async () => {
    const { frame, written, rawModeCalls } = makeFrame(true, ["frame one"], {
      inputTTY: false,
    });

    frame.update({ totalIssues: 1 });
    await waitForPaint();
    await frame.stop();

    expect(written()).toContain(CURSOR_HIDE);
    expect(rawModeCalls).toEqual([]);
  });

  it("INLINE-1: content that fits the viewport stays on the normal buffer and hides the cursor", async () => {
    const { frame, written, rawModeCalls } = makeFrame(true, ["line1\nline2"]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();

    const out = written();
    expect(out).not.toContain(ALT_ENTER);
    expect(out).toContain(CURSOR_HIDE);
    expect(rawModeCalls).toEqual([true]);

    await frame.stop();
  });

  it("INLINE-PAINT-1: an inline repaint prints exactly the frame's own rows, not padded to a viewport", async () => {
    const { frame, written } = makeFrame(true, ["line1\nline2"]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();

    const out = written();
    expect(out).not.toContain(HOME);
    const body = out.slice(out.indexOf(ERASE_DOWN) + ERASE_DOWN.length);
    const rows = body.split("\r\n").slice(0, -1);
    expect(rows).toEqual([`line1${ESC}[K`, `line2${ESC}[K`]);

    await frame.stop();
  });

  it("INLINE-PAINT-2: an update that renders identically does not repaint", async () => {
    const { frame, written } = makeFrame(true, ["line1", "line1", "line2"]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();
    const afterFirst = written();

    frame.update({ totalIssues: 2 });
    await waitForPaint();
    expect(written()).toBe(afterFirst);

    frame.update({ totalIssues: 3 });
    await waitForPaint();
    expect(written().length).toBeGreaterThan(afterFirst.length);

    await frame.stop();
  });

  it("INLINE-PAINT-3: a repaint jumps up over exactly the previously-printed rows, then erases a shrunk trailing tail", async () => {
    const { frame, written } = makeFrame(true, ["line1\nline2\nline3", "line1"]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();
    const beforeSecond = written();

    frame.update({ totalIssues: 2 });
    await waitForPaint();

    const out = written().slice(beforeSecond.length);
    expect(out).toContain(`${ESC}[3A`); // jump back over the 3 previously-printed rows
    expect(out).toContain(ERASE_DOWN); // erase them — the new frame is only 1 row
    expect(out).toContain(`line1${ESC}[K`);

    await frame.stop();
  });

  it("INLINE-2: stop() erases the last inline frame, restores the cursor, and never touches the alternate screen", async () => {
    const { frame, written, rawModeCalls } = makeFrame(true, ["line1\nline2"]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();
    const beforeStop = written();
    await frame.stop();
    const afterStop = written().slice(beforeStop.length);

    expect(afterStop).not.toContain(ALT_EXIT);
    expect(afterStop).toContain(`${ESC}[2A`);
    expect(afterStop).toContain(ERASE_DOWN);
    expect(afterStop).toContain(CURSOR_SHOW);
    expect(rawModeCalls).toEqual([true, false]);
  });

  it("UPGRADE-1: content that grows past the viewport upgrades to the alternate screen", async () => {
    const { frame, written } = makeFrame(true, ["line1", TALL_CONTENT]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();
    expect(written()).not.toContain(ALT_ENTER);

    frame.update({ totalIssues: 2 });
    await waitForPaint();
    const out = written();
    expect(out).toContain(ALT_ENTER);

    await frame.stop();
  });

  it("DOWNGRADE-1: content that shrinks back within the viewport leaves the alternate screen and resumes inline", async () => {
    const { frame, written } = makeFrame(true, [TALL_CONTENT, "line1"]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();
    expect(written()).toContain(ALT_ENTER);

    frame.update({ totalIssues: 2 });
    await waitForPaint();

    const out = written();
    expect(out).toContain(ALT_EXIT);
    const afterExit = out.slice(out.lastIndexOf(ALT_EXIT) + ALT_EXIT.length);
    expect(afterExit).toContain(`line1${ESC}[K`);
    expect(afterExit).not.toContain(ALT_ENTER);

    await frame.stop();
  });

  it("DOWNGRADE-2: inline content printed before an upgrade is erased correctly when downgrading back", async () => {
    const { frame, written } = makeFrame(true, ["line1\nline2", TALL_CONTENT, "line1"]);

    frame.update({ totalIssues: 1 }); // inline: 2 rows printed on the real buffer
    await waitForPaint();
    expect(written()).not.toContain(ALT_ENTER);

    frame.update({ totalIssues: 2 }); // upgrades to fullscreen
    await waitForPaint();
    expect(written()).toContain(ALT_ENTER);

    frame.update({ totalIssues: 3 }); // downgrades back to inline
    await waitForPaint();

    const out = written();
    const afterExit = out.slice(out.lastIndexOf(ALT_EXIT) + ALT_EXIT.length);
    // Jumps back up over the 2 rows still sitting on the real buffer from
    // before the upgrade, not 0 — that row count must survive the upgrade.
    expect(afterExit).toContain(`${ESC}[2A`);
    expect(afterExit).toContain(ERASE_DOWN);
    expect(afterExit).toContain(`line1${ESC}[K`);

    await frame.stop();
  });

  it("FULLSCREEN-1: the first paint of oversized content enters the alternate screen and hides the cursor", async () => {
    const { frame, written, rawModeCalls } = makeFrame(true, [TALL_CONTENT]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();

    const out = written();
    expect(out.indexOf(ALT_ENTER)).toBeGreaterThanOrEqual(0);
    expect(out).toContain(CURSOR_HIDE);
    expect(rawModeCalls).toEqual([true]);

    await frame.stop();
  });

  it("FULLSCREEN-2: stop() leaves the alternate screen, restores the cursor, and disables raw mode", async () => {
    const { frame, written, rawModeCalls } = makeFrame(true, [TALL_CONTENT]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();
    const beforeStop = written();
    await frame.stop();
    const afterStop = written().slice(beforeStop.length);

    expect(afterStop).toContain(ALT_EXIT);
    expect(afterStop).toContain(CURSOR_SHOW);
    expect(rawModeCalls).toEqual([true, false]);
  });

  it("FULLSCREEN-PAINT-1: a repaint is HOME followed by exactly viewportRows rows", async () => {
    const { frame, written } = makeFrame(true, [TALL_CONTENT]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();

    const out = written();
    const body = out.slice(out.indexOf(HOME) + HOME.length);
    const rows = body.split("\r\n");
    expect(rows).toHaveLength(24);
    expect(rows[0]).toBe(`row6${ESC}[K`);
    expect(rows[23]).toBe(`row29${ESC}[K`);

    await frame.stop();
  });

  it("SCROLL-1: content taller than the viewport follows the tail by default", async () => {
    const { frame, written } = makeFrame(true, [TALL_CONTENT]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();

    const out = written();
    const body = out.slice(out.lastIndexOf(HOME) + HOME.length);
    const rows = body.split("\r\n");
    // 30 rows into a 24-row viewport, following the tail: rows 6..29 are shown.
    expect(rows[0]).toBe(`row6${ESC}[K`);
    expect(rows[23]).toBe(`row29${ESC}[K`);

    await frame.stop();
  });

  it("SCROLL-2: Up arrow disengages tail-following and scrolls the window up", async () => {
    const { frame, written, sendKey } = makeFrame(true, [TALL_CONTENT]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();
    const beforeScroll = written();

    sendKey(`${ESC}[A`);

    const out = written().slice(beforeScroll.length);
    const body = out.slice(out.indexOf(HOME) + HOME.length);
    const rows = body.split("\r\n");
    // Scrolled up by one row from the tail (was row6..row29).
    expect(rows[0]).toBe(`row5${ESC}[K`);
    expect(rows[23]).toBe(`row28${ESC}[K`);

    await frame.stop();
  });

  it("SCROLL-3: End re-engages tail-following after scrolling up", async () => {
    const { frame, written, sendKey } = makeFrame(true, [TALL_CONTENT]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();
    sendKey(`${ESC}[A`); // scroll up once

    sendKey(`${ESC}[F`); // End
    const out = written();
    const body = out.slice(out.lastIndexOf(HOME) + HOME.length);
    const rows = body.split("\r\n");
    expect(rows[23]).toBe(`row29${ESC}[K`);

    await frame.stop();
  });

  it("SCROLL-4: PageUp scrolls a full viewport, PageDown returns toward the tail", async () => {
    const veryTall = [...Array(60).keys()].map((i) => `row${String(i)}`).join("\n");
    const { frame, written, sendKey } = makeFrame(true, [veryTall]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();
    // Tail view shows row36..row59 (60 rows, 24-row viewport).
    sendKey(`${ESC}[5~`); // PageUp
    let out = written();
    let rows = out
      .slice(out.lastIndexOf(HOME) + HOME.length)
      .split("\r\n");
    expect(rows[0]).toBe(`row12${ESC}[K`);

    sendKey(`${ESC}[6~`); // PageDown
    out = written();
    rows = out.slice(out.lastIndexOf(HOME) + HOME.length).split("\r\n");
    expect(rows[0]).toBe(`row36${ESC}[K`);

    await frame.stop();
  });

  it("SCROLL-5: arrow keys are inert while still inline (content fits the viewport)", async () => {
    const { frame, written, sendKey } = makeFrame(true, ["line1\nline2"]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();
    const beforeKey = written();

    sendKey(`${ESC}[A`);

    expect(written()).toBe(beforeKey);

    await frame.stop();
  });

  it("RESIZE-1: a resize re-lays-out the current fullscreen content without new data", async () => {
    const { frame, written, resize, setSize } = makeFrame(true, [TALL_CONTENT]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();
    const beforeResize = written();

    setSize(80, 10);
    resize();

    const out = written().slice(beforeResize.length);
    const body = out.slice(out.indexOf(HOME) + HOME.length);
    expect(body.split("\r\n")).toHaveLength(10);

    await frame.stop();
  });

  it("RESIZE-2: a resize also re-lays-out inline content", async () => {
    const { frame, written, resize, setSize } = makeFrame(true, ["line1\nline2"]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();
    const beforeResize = written();

    setSize(40, 24);
    resize();

    const out = written().slice(beforeResize.length);
    expect(out).toContain(`${ESC}[2A`);
    expect(out).toContain(ERASE_DOWN);

    await frame.stop();
  });

  it("RESIZE-3: growing the viewport past the content height downgrades from fullscreen back to inline", async () => {
    const content26 = [...Array(26).keys()].map((i) => `row${String(i)}`).join("\n");
    const { frame, written, resize, setSize } = makeFrame(true, [content26]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();
    expect(written()).toContain(ALT_ENTER);

    setSize(80, 30);
    resize();

    const out = written();
    expect(out).toContain(ALT_EXIT);
    const afterExit = out.slice(out.lastIndexOf(ALT_EXIT) + ALT_EXIT.length);
    expect(afterExit).toContain(`row25${ESC}[K`);
    expect(afterExit).not.toContain(ALT_ENTER);

    await frame.stop();
  });

  it("RESIZE-4: a wrapped inline line is rewound by its height at the NEW width", async () => {
    // The terminal reflows the painted rows itself and never reports the new
    // row count. The frame's text is still known, so its reflowed height is
    // recomputed at the new width and used to rewind — jumping by the count
    // measured at the OLD width over- or undershoots and leaves a duplicate
    // frame (or eats foreign lines) on every resize.
    const wide = "x".repeat(100);
    const { frame, written, resize, setSize } = makeFrame(true, [wide]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();
    // 100 chars at 80 columns is 2 rows; at 40 it reflows to 3.
    const beforeResize = written();

    setSize(40, 24);
    resize();

    const out = written().slice(beforeResize.length);
    expect(out).toContain(`${ESC}[3A`);
    expect(out).not.toContain(`${ESC}[2A`);

    await frame.stop();
  });

  it("CAP-1: an inline repaint after a silent viewport shrink caps the rewind at the viewport height", async () => {
    // `stream.rows` can shrink before the resize event is delivered (the
    // property updates immediately; the handler fires on a later tick). An
    // uncapped jump of 10 on a 6-row terminal clamps the cursor at row 0 and
    // the erase-below eats the user's own scrollback lines.
    const ten = [...Array(10).keys()].map((i) => `line${String(i)}`).join("\n");
    const { frame, written, setSize } = makeFrame(true, [ten, "s1\ns2"]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();
    const beforeShrink = written();

    setSize(80, 6); // no resize event delivered yet
    frame.update({ totalIssues: 2 });
    await waitForPaint();

    const out = written().slice(beforeShrink.length);
    expect(out).toContain(`${ESC}[5A`); // viewport height 6 → rewind capped at 5
    expect(out).not.toContain(`${ESC}[10A`);

    await frame.stop();
  });

  it("CAP-2: stop()'s inline clear caps the rewind at the viewport height", async () => {
    const ten = [...Array(10).keys()].map((i) => `line${String(i)}`).join("\n");
    const { frame, written, setSize } = makeFrame(true, [ten]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();

    setSize(80, 6); // shrink without a resize event, then stop immediately
    const beforeStop = written();
    await frame.stop();

    const afterStop = written().slice(beforeStop.length);
    expect(afterStop).toContain(`${ESC}[5A`);
    expect(afterStop).not.toContain(`${ESC}[10A`);
    expect(afterStop).toContain(ERASE_DOWN);
  });

  it("WRITE-ABOVE-1: a permanent line is committed and re-engages tail-following", async () => {
    const { frame, written, sendKey } = makeFrame(true, [TALL_CONTENT]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();
    sendKey(`${ESC}[A`); // scroll up, disengage tail-following

    frame.writeAbove("=== install complete ===");

    const out = written();
    const body = out.slice(out.lastIndexOf(HOME) + HOME.length);
    const rows = body.split("\r\n");
    // Tail-following re-engaged: the visible window is still the tail of the
    // frame content, row6..row29 — the permanent line only added one more row
    // above what's shown, so scrollTop advances with it and the view is
    // unchanged.
    expect(rows[0]).toBe(`row6${ESC}[K`);
    expect(rows[23]).toBe(`row29${ESC}[K`);

    await frame.stop();
  });

  it("WRITE-ABOVE-2: inline mode commits the permanent line above the redrawn frame", async () => {
    const { frame, written } = makeFrame(true, ["line1\nline2"]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();
    const beforeWrite = written();

    frame.writeAbove("=== install complete ===");

    const out = written().slice(beforeWrite.length);
    expect(out).toContain("=== install complete ===\n");
    expect(out).not.toContain(ALT_ENTER);

    await frame.stop();
  });

  it("STOP-1: update() after stop() is a no-op", async () => {
    const { frame, written } = makeFrame(true, ["line1", "line2"]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();
    await frame.stop();
    const afterStop = written();

    frame.update({ totalIssues: 2 });
    await waitForPaint();
    expect(written()).toBe(afterStop);
  });

  it("BATCH-1: several key events buffered into one input chunk repaint only once", async () => {
    const { frame, sendKey, writeCount } = makeFrame(true, [TALL_CONTENT]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();
    const writesAfterFirstPaint = writeCount();

    // Three Up-arrow presses arriving as one buffered chunk, as key-repeat or
    // a fast terminal would deliver them.
    sendKey(`${ESC}[A${ESC}[A${ESC}[A`);

    // Exactly one repaint for the whole chunk, not one per key.
    expect(writeCount()).toBe(writesAfterFirstPaint + 1);

    await frame.stop();
  });

  it("SAFE-1: a write failure during a scroll repaint does not throw or wedge stop()", async () => {
    // The first paint takes 3 writes (alt-screen, cursor hide, frame body);
    // allow those, then fail every write after — as a broken pipe would
    // starting from any point in the run.
    const { frame, sendKey } = makeFrame(true, [TALL_CONTENT], { throwOnWriteAfter: 3 });

    frame.update({ totalIssues: 1 });
    await waitForPaint();

    expect(() => sendKey(`${ESC}[A`)).not.toThrow();
    await expect(frame.stop()).resolves.toBeUndefined();
  });
});
