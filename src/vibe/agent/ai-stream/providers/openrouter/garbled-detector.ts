/**
 * Garbled-output detector for OpenRouter streams.
 *
 * Some OpenRouter hosts (fp4/fp8 quantized, broken chat templates) return
 * output that is clearly not the model talking: leaked chat-template tokens
 * (DeepSeek's `<｜DSML｜ invoke ...>` tool markup as plain text), replacement
 * characters, raw control characters, a phrase looping forever, or token salad
 * where single words glue three or more writing systems together.
 *
 * The detector is CONSERVATIVE by construction. A false positive costs a whole
 * answer (the attempt is thrown away and re-run on another host), a false
 * negative only leaves today's behavior. Every rule therefore needs a strong,
 * near-unambiguous signal and is switched off when the prompt itself contains
 * the same pattern (the user asked about it, pasted it, or wants it echoed).
 * Code, math, non-Latin languages, mixed CJK/Latin prose, translation lists and
 * base64 never trip a rule (see garbled-detector.test.ts).
 *
 * Stateful per response: feed deltas per channel (answer text, reasoning) with
 * {@link GarbledOutputDetector.push}; each call judges the channel's recent
 * tail window, so the cost per delta is bounded.
 */

import "server-only";

/** Rule that fired. Logged; also the reason on the retry log line. */
export type GarbledRule =
  | "special-token"
  | "replacement-chars"
  | "control-chars"
  | "repetition-loop"
  | "token-salad";

export type GarbledVerdict =
  | { readonly garbled: false }
  | {
      readonly garbled: true;
      readonly rule: GarbledRule;
      /** Short excerpt around the hit for logs (never shown to users). */
      readonly sample: string;
    };

export type GarbledChannel = "text" | "reasoning";

/** Window of recent output each rule looks at. */
export const GARBLED_WINDOW_CHARS = 600;

/** Chat-template special tokens with fullwidth bars: `<｜DSML｜`, `<｜tool▁calls▁begin｜>`, `<｜end▁of▁sentence｜>`. */
const SPECIAL_TOKEN_RE =
  /<\/?｜[\p{L}▁ _-]{1,40}｜|｜[\p{L}_-]{1,20}▁[\p{L}▁_-]{1,40}｜/u;
const REPLACEMENT_CHAR_THRESHOLD = 3;
// C0 controls except \t \n \r and ESC (ANSI color codes are legit output).
const CONTROL_CHAR_RE =
  // oxlint-disable-next-line no-control-regex -- detecting raw control chars is the point
  /[\u0000-\u0008\u000B\u000C\u000E-\u001A\u001C-\u001F]/gu;
const CONTROL_CHAR_THRESHOLD = 4;
/** A 3-40 char unit repeated back to back at least 10 more times. */
const REPETITION_RE = /([\s\S]{3,40}?)\1{9,}/u;
const REPETITION_MIN_RUN_CHARS = 240;
/** Byte-array / hex-dump units ("0xff, ") are data, not a loop. */
const HEX_UNIT_RE = /^(?:0x)?[0-9a-f]+[,;]?$/i;
const SALAD_MIN_CHIMERAS = 3;
const SALAD_MIN_SCRIPTS = 3;

type ScriptGroup =
  | "latin"
  | "cyrillic"
  | "greek"
  | "arabic"
  | "hebrew"
  | "cjk"
  | "hangul"
  | "devanagari"
  | "bengali"
  | "tamil"
  | "telugu"
  | "thai"
  | "armenian"
  | "georgian"
  | "ethiopic"
  | "other";

const SCRIPT_TESTS: readonly (readonly [ScriptGroup, RegExp])[] = [
  ["latin", /\p{Script=Latin}/u],
  ["cyrillic", /\p{Script=Cyrillic}/u],
  ["greek", /\p{Script=Greek}/u],
  ["arabic", /\p{Script=Arabic}/u],
  ["hebrew", /\p{Script=Hebrew}/u],
  [
    "cjk",
    /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Bopomofo}]/u,
  ],
  ["hangul", /\p{Script=Hangul}/u],
  ["devanagari", /\p{Script=Devanagari}/u],
  ["bengali", /\p{Script=Bengali}/u],
  ["tamil", /\p{Script=Tamil}/u],
  ["telugu", /\p{Script=Telugu}/u],
  ["thai", /\p{Script=Thai}/u],
  ["armenian", /\p{Script=Armenian}/u],
  ["georgian", /\p{Script=Georgian}/u],
  ["ethiopic", /\p{Script=Ethiopic}/u],
];

/**
 * Script combinations that legitimately share one unbroken word: CJK and
 * Korean text glue Latin terms on without spaces ("用React构建",
 * "Reactを使う", "React를"), math glues Greek onto Latin ("Δx", "αβ").
 */
const BENIGN_MIXES: readonly ReadonlySet<ScriptGroup>[] = [
  new Set<ScriptGroup>(["latin", "cjk", "hangul"]),
  new Set<ScriptGroup>(["latin", "greek"]),
];

function scriptOf(char: string): ScriptGroup {
  for (const [group, re] of SCRIPT_TESTS) {
    if (re.test(char)) {
      return group;
    }
  }
  return "other";
}

/** Unbroken letter runs (marks included); digits, punctuation, hyphens split. */
const LETTER_RUN_RE = /[\p{L}\p{M}]+/gu;

function runScripts(run: string): Set<ScriptGroup> {
  const groups = new Set<ScriptGroup>();
  for (const char of run) {
    if (/\p{L}/u.test(char)) {
      groups.add(scriptOf(char));
    }
  }
  return groups;
}

function isChimera(groups: Set<ScriptGroup>): boolean {
  if (groups.size < 2) {
    return false;
  }
  return !BENIGN_MIXES.some((benign) =>
    [...groups].every((g) => benign.has(g)),
  );
}

/** Letter runs that glue 2+ writing systems together in a non-benign way. */
function chimeraRuns(text: string): string[] {
  return (text.match(LETTER_RUN_RE) ?? []).filter((run) =>
    isChimera(runScripts(run)),
  );
}

function windowScripts(text: string): Set<ScriptGroup> {
  const groups = new Set<ScriptGroup>();
  for (const run of text.match(LETTER_RUN_RE) ?? []) {
    for (const group of runScripts(run)) {
      groups.add(group);
    }
  }
  groups.delete("other");
  return groups;
}

function excerpt(text: string, index: number): string {
  const start = Math.max(0, index - 40);
  return text.slice(start, start + 120);
}

/** What the prompt already contains: rules matching it are switched off. */
export interface GarbledPromptContext {
  /** All message text of the request, lowercased. */
  readonly lowerText: string;
  readonly hasFullwidthBar: boolean;
  readonly hasReplacementChar: boolean;
  readonly hasControlChars: boolean;
  readonly hasChimeras: boolean;
}

export function buildGarbledPromptContext(
  promptText: string,
): GarbledPromptContext {
  return {
    lowerText: promptText.toLowerCase(),
    hasFullwidthBar: promptText.includes("｜"),
    hasReplacementChar: promptText.includes("�"),
    hasControlChars: new RegExp(CONTROL_CHAR_RE.source, "u").test(promptText),
    hasChimeras: chimeraRuns(promptText).length > 0,
  };
}

const CLEAN: GarbledVerdict = { garbled: false };

/**
 * Judge one window of output. Pure; `insideCodeFence` = the window sits in an
 * open ``` block (repetition is legit there: byte arrays, test tables).
 */
export function judgeGarbledWindow(
  text: string,
  prompt: GarbledPromptContext,
  insideCodeFence: boolean,
  /** Skip the costly whole-text rules (repetition, token salad). */
  cheapOnly = false,
): GarbledVerdict {
  if (!prompt.hasFullwidthBar) {
    const special = SPECIAL_TOKEN_RE.exec(text);
    if (special) {
      return {
        garbled: true,
        rule: "special-token",
        sample: excerpt(text, special.index),
      };
    }
  }

  if (!prompt.hasReplacementChar) {
    let count = 0;
    let first = -1;
    for (let i = 0; i < text.length; i++) {
      if (text.charCodeAt(i) === 0xfffd) {
        count++;
        if (first < 0) {
          first = i;
        }
      }
    }
    if (count >= REPLACEMENT_CHAR_THRESHOLD) {
      return {
        garbled: true,
        rule: "replacement-chars",
        sample: excerpt(text, first),
      };
    }
  }

  if (!prompt.hasControlChars) {
    const controls = text.match(CONTROL_CHAR_RE);
    if (controls && controls.length >= CONTROL_CHAR_THRESHOLD) {
      return {
        garbled: true,
        rule: "control-chars",
        sample: excerpt(text, text.search(CONTROL_CHAR_RE)),
      };
    }
  }

  if (cheapOnly) {
    return CLEAN;
  }

  if (!insideCodeFence && !text.includes("```")) {
    const loop = REPETITION_RE.exec(text);
    if (loop?.[1] !== undefined) {
      const unit = loop[1];
      const trimmed = unit.trim().toLowerCase();
      const letters = new Set(trimmed.match(/\p{L}/gu) ?? []);
      if (
        loop[0].length >= REPETITION_MIN_RUN_CHARS &&
        trimmed.length >= 3 &&
        letters.size >= 2 &&
        // A looping phrase has words; space-free runs are data (base64).
        /\s/u.test(unit) &&
        // Markdown table rows may legitimately repeat.
        !unit.includes("|") &&
        !HEX_UNIT_RE.test(trimmed) &&
        !prompt.lowerText.includes(trimmed)
      ) {
        return {
          garbled: true,
          rule: "repetition-loop",
          sample: excerpt(text, loop.index),
        };
      }
    }
  }

  if (!prompt.hasChimeras) {
    const chimeras = chimeraRuns(text);
    if (
      chimeras.length >= SALAD_MIN_CHIMERAS &&
      windowScripts(text).size >= SALAD_MIN_SCRIPTS
    ) {
      const first = chimeras[0] ?? "";
      return {
        garbled: true,
        rule: "token-salad",
        sample: excerpt(text, Math.max(0, text.indexOf(first))),
      };
    }
  }

  return CLEAN;
}

interface ChannelState {
  tail: string;
  fenceCount: number;
  /** Trailing backticks not yet part of a counted ``` fence. */
  backtickRun: number;
  /** Chars pushed since the costly rules last ran. */
  sinceFullCheck: number;
}

/** The costly rules run at most once per this many new chars. */
const FULL_CHECK_EVERY_CHARS = 24;

/** Streaming wrapper: one instance per upstream response. */
export class GarbledOutputDetector {
  private readonly channels: Record<GarbledChannel, ChannelState> = {
    text: { tail: "", fenceCount: 0, backtickRun: 0, sinceFullCheck: 0 },
    reasoning: { tail: "", fenceCount: 0, backtickRun: 0, sinceFullCheck: 0 },
  };

  constructor(private readonly prompt: GarbledPromptContext) {}

  push(channel: GarbledChannel, delta: string): GarbledVerdict {
    if (!delta) {
      return CLEAN;
    }
    const state = this.channels[channel];
    // Count ``` fences left to right across delta boundaries.
    for (let i = 0; i < delta.length; i++) {
      if (delta.charCodeAt(i) === 0x60) {
        state.backtickRun++;
        if (state.backtickRun === 3) {
          state.fenceCount++;
          state.backtickRun = 0;
        }
      } else {
        state.backtickRun = 0;
      }
    }
    state.tail = (state.tail + delta).slice(-GARBLED_WINDOW_CHARS);
    state.sinceFullCheck += delta.length;
    const full = state.sinceFullCheck >= FULL_CHECK_EVERY_CHARS;
    if (full) {
      state.sinceFullCheck = 0;
    }
    return judgeGarbledWindow(
      state.tail,
      this.prompt,
      state.fenceCount % 2 === 1,
      !full,
    );
  }
}
