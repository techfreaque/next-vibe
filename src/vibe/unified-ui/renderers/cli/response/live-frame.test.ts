// oxlint-disable oxlint-plugin-restricted/no-unknown, oxlint-plugin-restricted/no-throw
/**
 * createLiveFrame — repaint mechanics for the CLI fast renderer.
 *
 * ROWS-*   : display-row counting is wrap- and ANSI-aware. Undercounting is what
 *            leaves orphaned fragments in the scrollback on every repaint, so
 *            this is the load-bearing calculation.
 * TTY-*    : a non-TTY stream never emits cursor escapes — `vibe check > f.txt`
 *            must produce a clean file.
 * PAINT-*  : each repaint erases exactly the rows the previous frame occupied.
 * CURSOR-* : the cursor is hidden while animating and always restored.
 *
 * The frame renderer is injected, so these tests cover terminal control only —
 * not React output.
 */

import { defaultLocale } from "../../../../core/i18n/core/config";
import { createEndpointLogger } from "../../../../logger/server";
import { Platform } from "../../../../platforms/platforms";
import { describe, expect, it } from "vitest";

import { countDisplayRows, createLiveFrame } from "./live-frame";

const ESC = String.fromCharCode(27);

/**
 * The exact bytes that rewind `rows` painted lines: step up over each one and
 * clear it, then pin column 0. Erasing per line rather than clearing to the end
 * of the display is what keeps a repaint from showing a blank frame first.
 */
function erase(rows: number): string {
  return `${`${ESC}[1A${ESC}[2K`.repeat(rows)}${ESC}[G`;
}


/** A stdout stand-in that records everything written to it. */
function makeStream(isTTY: boolean): {
  stream: NodeJS.WriteStream;
  written: () => string;
  /** Fires the stream's 'resize' handler, as a real TTY would on a window resize. */
  resize: () => void;
} {
  const chunks: string[] = [];
  let resizeHandler: (() => void) | null = null;
  const stream = {
    isTTY,
    columns: 80,
    rows: 24,
    write: (chunk: string): boolean => {
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
  };
  // The frame only touches isTTY/columns/rows/write/on/off; a full WriteStream
  // is not constructible in a unit test.
  const asStream: NodeJS.WriteStream = Object.assign(
    Object.create(null) as NodeJS.WriteStream,
    stream,
  );
  return {
    stream: asStream,
    written: (): string => chunks.join(""),
    resize: (): void => resizeHandler?.(),
  };
}

function makeFrame(
  isTTY: boolean,
  frames: string[],
): {
  frame: ReturnType<typeof createLiveFrame>;
  written: () => string;
  /** Exposed so a test can change `columns` before firing a resize. */
  stream: NodeJS.WriteStream;
  resize: () => void;
} {
  const { stream, written, resize } = makeStream(isTTY);
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
    renderFrame: (): Promise<string> => {
      const out = frames[Math.min(call, frames.length - 1)] ?? "";
      call += 1;
      return Promise.resolve(out);
    },
  });
  return { frame, written, resize, stream };
}

function makeEndpointStub(): Parameters<typeof createLiveFrame>[0]["endpoint"] {
  return Object.assign(
    Object.create(null) as Parameters<typeof createLiveFrame>[0]["endpoint"],
    { path: ["vibe", "tooling", "check"], method: "POST", fields: {} },
  );
}

/** Let the throttle timer fire and the async paint settle. */
async function waitForPaint(): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, 120);
  });
}

describe("countDisplayRows", () => {
  it("ROWS-1: counts plain lines", () => {
    expect(countDisplayRows("a\nb\nc", 80)).toBe(3);
  });

  it("ROWS-2: an empty line still occupies one row", () => {
    expect(countDisplayRows("a\n\nb", 80)).toBe(3);
  });

  it("ROWS-3: ANSI colour codes carry no display width", () => {
    expect(countDisplayRows(`${ESC}[31merror${ESC}[39m`, 80)).toBe(1);
  });

  it("ROWS-4: a line longer than the terminal wraps to several rows", () => {
    // Long file paths hit this constantly; counting them as 1 corrupts the erase.
    expect(countDisplayRows("x".repeat(100), 40)).toBe(3);
  });

  it("ROWS-5: wide glyphs count as two columns", () => {
    expect(countDisplayRows("１１１", 4)).toBe(2);
  });
});

describe("createLiveFrame", () => {
  it("TTY-1: a non-TTY stream is inert and writes no escapes", async () => {
    const { frame, written } = makeFrame(false, ["frame one"]);

    expect(frame.isLive).toBe(false);
    frame.update({ totalIssues: 1 });
    await waitForPaint();
    await frame.stop();

    expect(written()).not.toContain(ESC);
  });

  it("CURSOR-1: the cursor is hidden while painting and restored on stop", async () => {
    const { frame, written } = makeFrame(true, ["frame one"]);

    expect(frame.isLive).toBe(true);
    frame.update({ totalIssues: 1 });
    await waitForPaint();
    await frame.stop();

    const out = written();
    expect(out).toContain(`${ESC}[?25l`);
    expect(out).toContain(`${ESC}[?25h`);
    expect(out.lastIndexOf(`${ESC}[?25h`)).toBeGreaterThan(
      out.lastIndexOf(`${ESC}[?25l`),
    );
  });

  it("PAINT-1: the second repaint erases exactly the first frame's rows", async () => {
    const { frame, written } = makeFrame(true, [
      "line1\nline2",
      "line1\nline2\nline3",
    ]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();
    frame.update({ totalIssues: 2 });
    await waitForPaint();

    // The first frame occupied exactly 2 display rows, so the repaint rewinds 2
    // and writes the new frame straight over them. Rewinding 3 would eat the
    // line above the frame (the shell prompt).
    expect(written()).toContain(`${erase(2)}line1\nline2\nline3\n`);
    expect(written()).not.toContain(erase(3));
    await frame.stop();
  });

  it("PAINT-3: a frame that already ends in newlines still erases exactly", async () => {
    // The renderer emits a trailing newline for a bottom margin but not for a
    // bare row. Measuring the un-normalised string undercounts, which strands
    // the frame's TOP row in the scrollback on every repaint.
    const { frame, written } = makeFrame(true, [
      "line1\nline2\n\n",
      "line1\nline2\nline3",
    ]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();
    frame.update({ totalIssues: 2 });
    await waitForPaint();

    expect(written()).toContain(`${erase(2)}line1\nline2\nline3\n`);
    expect(written()).not.toContain(erase(3));
    await frame.stop();
  });

  it("PAINT-2: stop() erases the live region so the caller can print the result", async () => {
    const { frame, written } = makeFrame(true, ["line1\nline2"]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();
    const beforeStop = written();
    await frame.stop();
    const afterStop = written();

    // The transient frame is wound back; the authoritative output is printed by
    // formatResult afterwards, so exactly one result reaches the terminal.
    expect(afterStop.slice(beforeStop.length)).toContain(erase(2));
  });

  it("PAINT-4: a frame taller than the viewport is drawn in full, in place", async () => {
    // A 28-row install table on a 24-row terminal. Writing it scrolls, so its
    // top rows leave addressable space. It is still drawn WHOLE and stays in
    // the normal buffer, so scrolling behaves like static output; only the
    // rewind is capped, since cursor-up cannot reach past the viewport top.
    const tallFrame = [...Array(25).keys()]
      .map((i) => `row${String(i)}`)
      .join("\n");
    const { frame, written } = makeFrame(true, [
      tallFrame,
      "SECOND-FRAME-MARKER",
      "THIRD-FRAME-MARKER",
    ]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();
    frame.update({ totalIssues: 2 });
    await waitForPaint();
    frame.update({ totalIssues: 3 });
    await waitForPaint();

    const out = written();
    // Every row reaches the stream, first to last — nothing withheld.
    expect(out).toContain(tallFrame);
    expect(out).toContain("row0");
    expect(out).toContain("row24");
    // Updates after the oversized frame still repaint.
    expect(out).toContain("SECOND-FRAME-MARKER");
    expect(out).toContain("THIRD-FRAME-MARKER");
    // Rewind capped at viewport-1 (23): asking for all 25 would not erase the
    // scrolled-off rows, it would eat 25 rows of whatever is on screen now.
    expect(out).toContain(erase(23));
    expect(out).not.toContain(erase(25));
    // Never switches buffers — scrolling must stay normal.
    expect(out).not.toContain(`${ESC}[?1049h`);
    expect(out).not.toContain(`${ESC}[?1049l`);
    // The user's real screen is never cleared and scrollback never dropped.
    expect(out).not.toContain(`${ESC}[2J`);
    expect(out).not.toContain(`${ESC}[3J`);

    await frame.stop();
  });

  it("PAINT-5: an update that renders identically does not repaint", async () => {
    // Merged websocket events routinely produce a byte-identical frame — a
    // field changed that this widget does not show. Erasing and rewriting the
    // same bytes is pure flicker, so the write is skipped entirely.
    const { frame, written } = makeFrame(true, [
      "line1\nline2",
      "line1\nline2",
      "line1\nCHANGED",
    ]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();
    const afterFirst = written();

    frame.update({ totalIssues: 2 });
    await waitForPaint();
    expect(written()).toBe(afterFirst);

    // A frame that genuinely differs still paints, so the skip cannot wedge.
    frame.update({ totalIssues: 3 });
    await waitForPaint();
    expect(written().slice(afterFirst.length)).toBe(
      `${erase(2)}line1\nCHANGED\n`,
    );

    await frame.stop();
  });

  it("PAINT-6: growing past the viewport keeps repainting in the normal buffer", async () => {
    // The realistic path: a table starts small, is painted in place, then grows
    // past the viewport as rows are added. It must not switch buffers partway
    // through — that traps scrolling and strands the frame already on screen.
    const tall = [...Array(30).keys()].map((i) => `row${String(i)}`).join("\n");
    const { frame, written } = makeFrame(true, ["small1\nsmall2", tall]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();
    frame.update({ totalIssues: 2 });
    await waitForPaint();

    const out = written();
    // Two rows were painted in place, so exactly two are wound back before the
    // taller frame is written whole over them.
    expect(out).toContain(`${erase(2)}${tall}
`);
    expect(out).not.toContain(`${ESC}[?1049h`);

    await frame.stop();
  });

  it("RESIZE-2: a resize repaints on its own instead of waiting for an update", async () => {
    // An install can sit seconds between events. If the resize does not trigger
    // its own repaint the screen holds the mangled reflowed frame for all of
    // that time, which is what a resize visibly looked like.
    const { frame, written, resize } = makeFrame(true, [
      "line1\nline2",
      "line1\nline2",
    ]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();
    const afterFirst = written();

    resize();
    await waitForPaint();

    // Repainted with no new update, and the identical-frame skip did not
    // suppress it — the frame must be re-laid-out at the new width regardless.
    expect(written().length).toBeGreaterThan(afterFirst.length);
    expect(written().slice(afterFirst.length)).toContain("line1");

    await frame.stop();
  });

  it("RESIZE-3: the reflowed frame is rewound by its height at the NEW width", async () => {
    // The terminal reflows the painted frame itself and never reports the new
    // row count. We still hold the frame's text, so re-measuring it at the new
    // width gives the count it was just reflowed to. Zeroing the count instead
    // skips the erase and prints the next frame BELOW the reflowed one, leaving
    // a duplicate on screen.
    const wide = "x".repeat(100);
    const { frame, written, stream, resize } = makeFrame(true, [wide, "after"]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();
    // 100 chars at 80 columns is 2 rows; at 40 it reflows to 3.
    const afterFirst = written();
    stream.columns = 40;
    resize();
    await waitForPaint();

    expect(written().slice(afterFirst.length)).toContain(erase(3));

    await frame.stop();
  });

  it("RESIZE-1: the frame after a resize overwrites the reflowed region", async () => {
    // The terminal reflows already-painted rows on its own and never reports
    // the new row count. The frame's text is still known, so its reflowed
    // height is recomputed and used to rewind — the frame lands on top of the
    // old one rather than below it.
    const { frame, written, resize } = makeFrame(true, [
      "line1\nline2\nline3",
      "line1\nline2\nline3\nline4",
      "AFTER-RESIZE",
    ]);

    frame.update({ totalIssues: 1 });
    await waitForPaint();
    frame.update({ totalIssues: 2 });
    await waitForPaint();

    resize();

    frame.update({ totalIssues: 3 });
    await waitForPaint();

    const out = written();
    const idx = out.indexOf("AFTER-RESIZE");
    expect(idx).toBeGreaterThan(-1);
    // The post-resize frame must OVERWRITE the reflowed region, not be appended
    // under it. Skipping the erase here is what left a duplicate frame on
    // screen — the most visible symptom of a resize mid-run.
    expect(out.slice(0, idx)).toContain(erase(4));
    expect(out[idx - 1]).not.toBe("\n");

    await frame.stop();
  });
});
