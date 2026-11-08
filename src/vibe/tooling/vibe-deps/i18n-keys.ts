import "server-only";

/**
 * Unused scoped-i18n keys for `vibe deps --mode=unused-i18n`.
 *
 * Keys come from every scoped `i18n/en/index.ts` (EN is the source of truth —
 * de/pl are typed against it). A key counts as used when ANY non-i18n source
 * file contains it as a string literal, or references a protecting prefix:
 *   - a template literal whose static head ends in "." (t(`a.b.${x}`) → a.b.*)
 *   - a plain literal ending in "." ("a.b." + x → a.b.*)
 *   - a literal naming a dotted ancestor ("a.b" → a.b.*, handed to a helper)
 *   - a literal naming a child of a leaf ("a.list.0" → array leaf a.list)
 * Only DOTTED prefixes protect a subtree: `a.b${x}` protects no subtree — but
 * a whole template with in-segment holes matches its own shape:
 * t(`a.item${i}Label`) keeps a.item0Label, a.item1Label, …
 *
 * Regex/scanner-based like symbols.ts: references are matched project-wide,
 * not per scope, so it under-reports by design — a reported key has no
 * literal anywhere, which is the signal worth reviewing.
 */

export interface I18nKeyDef {
  /** dotted path inside the scope, e.g. "get.form.title" */
  key: string;
  /** 1-based line of the key in the en file */
  line: number;
}

export interface I18nReferenceIndex {
  literals: Set<string>;
  prefixes: Set<string>;
  /** Every dotted ancestor of a literal: "a.b" for "a.b.0" (array / object leaves). */
  ancestors: Set<string>;
  /**
   * Whole templates with in-segment holes, by first segment:
   * t(`a.item${i}Label`) → /^a\.item[\w$-]*Label$/ under "a".
   */
  patterns: Map<string, RegExp[]>;
}

const KEY_SHAPE = /^[\w$-]+(?:\.[\w$-]+)*\.?$/;

// ── en file → leaf keys ─────────────────────────────────────────────────────

class Scanner {
  pos = 0;
  constructor(private readonly src: string) {}

  get done(): boolean {
    return this.pos >= this.src.length;
  }

  peek(): string {
    return this.src[this.pos] ?? "";
  }

  at(text: string): boolean {
    return this.src.startsWith(text, this.pos);
  }

  lineAt(pos: number): number {
    let line = 1;
    for (let i = 0; i < pos && i < this.src.length; i++) {
      if (this.src[i] === "\n") {
        line++;
      }
    }
    return line;
  }

  skipTrivia(): void {
    while (!this.done) {
      const c = this.peek();
      if (c === " " || c === "\n" || c === "\t" || c === "\r") {
        this.pos++;
      } else if (this.src.startsWith("//", this.pos)) {
        const end = this.src.indexOf("\n", this.pos);
        this.pos = end === -1 ? this.src.length : end + 1;
      } else if (this.src.startsWith("/*", this.pos)) {
        const end = this.src.indexOf("*/", this.pos + 2);
        this.pos = end === -1 ? this.src.length : end + 2;
      } else {
        return;
      }
    }
  }

  /** Reads a quoted string starting at the opening quote; returns its raw body. */
  readQuoted(): string {
    const quote = this.peek();
    const start = ++this.pos;
    while (!this.done && this.peek() !== quote) {
      this.pos += this.peek() === "\\" ? 2 : 1;
    }
    const body = this.src.slice(start, this.pos);
    this.pos++;
    return body;
  }

  /** Skips a template literal (incl. nested `${}` expressions). */
  skipTemplate(): void {
    this.pos++;
    while (!this.done && this.peek() !== "`") {
      if (this.peek() === "\\") {
        this.pos += 2;
      } else if (this.src.startsWith("${", this.pos)) {
        this.pos += 2;
        this.skipUntil(new Set(["}"]));
        this.pos++;
      } else {
        this.pos++;
      }
    }
    this.pos++;
  }

  /** Skips an expression until one of `stops` at nesting depth 0 (not consumed). */
  skipUntil(stops: ReadonlySet<string>): void {
    let depth = 0;
    while (!this.done) {
      this.skipTrivia();
      const c = this.peek();
      if (depth === 0 && stops.has(c)) {
        return;
      }
      if (c === '"' || c === "'") {
        this.readQuoted();
      } else if (c === "`") {
        this.skipTemplate();
      } else {
        if (c === "{" || c === "(" || c === "[") {
          depth++;
        } else if (c === "}" || c === ")" || c === "]") {
          depth--;
        }
        this.pos++;
      }
    }
  }

  readIdentifier(): string {
    const match = /^[\w$-]+/.exec(this.src.slice(this.pos, this.pos + 200));
    const word = match?.[0] ?? "";
    this.pos += word.length;
    return word;
  }
}

/** Collects leaf keys of the object literal starting at the scanner's `{`. */
function walkObject(s: Scanner, prefix: string, out: I18nKeyDef[]): void {
  // at "{"
  s.pos++;
  for (;;) {
    s.skipTrivia();
    if (s.done) {
      return;
    }
    const c = s.peek();
    if (c === "}") {
      s.pos++;
      return;
    }
    if (c === ",") {
      s.pos++;
      continue;
    }
    if (s.at("...")) {
      // Spread: its keys are unknown here → never reported
      s.skipUntil(new Set([",", "}"]));
      continue;
    }
    const keyPos = s.pos;
    let name: string;
    if (c === '"' || c === "'") {
      name = s.readQuoted();
    } else if (c === "[") {
      // Computed key — unknowable statically
      s.skipUntil(new Set([",", "}"]));
      continue;
    } else {
      name = s.readIdentifier();
      if (!name) {
        // Unexpected token: bail out of this object safely
        s.skipUntil(new Set(["}"]));
        continue;
      }
    }
    s.skipTrivia();
    const key = prefix ? `${prefix}.${name}` : name;
    if (s.peek() === ":") {
      s.pos++;
      s.skipTrivia();
      if (s.peek() === "{") {
        walkObject(s, key, out);
        continue;
      }
      out.push({ key, line: s.lineAt(keyPos) });
      s.skipUntil(new Set([",", "}"]));
      continue;
    }
    // Shorthand `{ name }` or method `name() {}` → a leaf
    out.push({ key, line: s.lineAt(keyPos) });
    s.skipUntil(new Set([",", "}"]));
  }
}

export function extractTranslationKeys(source: string): I18nKeyDef[] {
  const decl = /export\s+const\s+translations\b[^=]*=\s*/.exec(source);
  if (!decl) {
    return [];
  }
  const s = new Scanner(source);
  s.pos = decl.index + decl[0].length;
  s.skipTrivia();
  while (s.peek() === "(") {
    s.pos++;
    s.skipTrivia();
  }
  if (s.peek() !== "{") {
    return [];
  }
  const out: I18nKeyDef[] = [];
  walkObject(s, "", out);
  return out;
}

// ── sources → referenced literals / prefixes ────────────────────────────────

const QUOTED_RE = /"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'/g;
// Static head of a template literal + whether an interpolation follows it
const TEMPLATE_RE = /`((?:[^`\\$]|\\.|\$(?!\{))*)(\$\{)?/g;
// A whole template literal (no nested backticks) and its `${…}` holes
const WHOLE_TEMPLATE_RE = /`((?:[^`\\]|\\.)*)`/g;
const HOLE_RE = /\$\{[^{}`]*\}/g;
const KEY_PART = /^[\w$.-]*$/;

function addTemplatePattern(index: I18nReferenceIndex, body: string): void {
  const parts = body.split(HOLE_RE);
  const head = parts[0] ?? "";
  if (
    parts.length < 2 ||
    !head.includes(".") ||
    !parts.every((p) => KEY_PART.test(p))
  ) {
    return;
  }
  const escaped = parts.map((p) => p.replaceAll(/[.$]/g, (c) => `\\${c}`));
  const pattern = new RegExp(`^${escaped.join("[\\w$-]*")}$`);
  const segment = head.slice(0, head.indexOf("."));
  const list = index.patterns.get(segment) ?? [];
  list.push(pattern);
  index.patterns.set(segment, list);
}

function addLiteral(index: I18nReferenceIndex, value: string): void {
  if (!KEY_SHAPE.test(value)) {
    return;
  }
  if (value.endsWith(".")) {
    index.prefixes.add(value);
    return;
  }
  index.literals.add(value);
  for (let dot = value.lastIndexOf("."); dot > 0;) {
    const ancestor = value.slice(0, dot);
    if (index.ancestors.has(ancestor)) {
      break;
    }
    index.ancestors.add(ancestor);
    dot = value.lastIndexOf(".", dot - 1);
  }
}

export function collectI18nReferences(
  sources: Iterable<string>,
): I18nReferenceIndex {
  const index: I18nReferenceIndex = {
    literals: new Set(),
    prefixes: new Set(),
    ancestors: new Set(),
    patterns: new Map(),
  };
  for (const source of sources) {
    for (const match of source.matchAll(QUOTED_RE)) {
      addLiteral(index, match[1] ?? match[2] ?? "");
    }
    for (const match of source.matchAll(TEMPLATE_RE)) {
      const head = match[1] ?? "";
      if (match[2] === undefined) {
        addLiteral(index, head);
      } else if (head.endsWith(".") && KEY_SHAPE.test(head)) {
        index.prefixes.add(head);
      }
    }
    for (const match of source.matchAll(WHOLE_TEMPLATE_RE)) {
      addTemplatePattern(index, match[1] ?? "");
    }
  }
  return index;
}

export function isI18nKeyReferenced(
  key: string,
  index: I18nReferenceIndex,
): boolean {
  // Exact, or an array/object leaf addressed by child ("a.list.0")
  // (t(`a.list.${i}.name`) addresses array leaf a.list via its prefix)
  if (
    index.literals.has(key) ||
    index.ancestors.has(key) ||
    index.prefixes.has(`${key}.`)
  ) {
    return true;
  }
  for (
    let dot = key.indexOf(".");
    dot !== -1;
    dot = key.indexOf(".", dot + 1)
  ) {
    if (index.prefixes.has(key.slice(0, dot + 1))) {
      return true;
    }
    // Dotted ancestor named whole ("a.b" for a.b.c) — passed to a helper
    const ancestor = key.slice(0, dot);
    if (ancestor.includes(".") && index.literals.has(ancestor)) {
      return true;
    }
  }
  const segment = key.slice(0, Math.max(0, key.indexOf(".")));
  return (index.patterns.get(segment) ?? []).some((p) => p.test(key));
}
