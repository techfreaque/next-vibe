/**
 * Vibe Stage Repository
 *
 * Auto-stages the changes that are always safe to stage, and nothing else:
 *  1. Renames (moves) — detected via git's own similarity matcher (even for a
 *     plain `mv`), staged as real renames. Pure moves stage fully; a moved-and-
 *     edited file stages the rename plus only its import-only content, leaving
 *     any real edit unstaged.
 *  2. Generated/fixture deletions — removed from the index.
 *  3. Boilerplate candidates (route.ts, i18n/{en,de,pl}/index.ts) that pass the
 *     boilerplate oxlint plugin with 0 violations, and generated output.
 *  4. Import-only changes — static AND dynamic `import(...)` edits — staged in
 *     full, or partially (import hunks only) for files that also carry real code.
 *  5. definition.ts `path: [...]` line changes inside `createEndpoint()` — the
 *     path array is purely declarative metadata; changes here are always safe.
 *  6. camelCase identifier renames — a -/+ line pair identical except for
 *     camelCase identifier tokens. Case-convention changes never qualify.
 *
 * Diffs that add/remove suppression comments are never auto-staged.
 */

import "server-only";

import { spawn } from "node:child_process";
import { existsSync, promises as fsp } from "node:fs";
import { resolve as resolvePath } from "node:path";

import { hasCustomDirective } from "next-vibe/core/generators/shared/custom-directive";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";
import { ConfigRepositoryImpl } from "next-vibe/tooling/check/config/repository";

import type {
  VibeStageRequestOutput,
  VibeStageResponseOutput,
} from "./definition";
import type { CheckVibeStageT } from "./i18n";

// ============================================================
// Helpers
// ============================================================

/**
 * Maximum number of file-path arguments to pass in a single spawn() call.
 * Keeps total command-line length well under Windows' 32 767-character limit
 * and libuv's uv_spawn limit on all platforms.
 */
const ARG_CHUNK_SIZE = 150;

/** Split an array into chunks of at most `size` items. */
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/** Run a shell command and resolve with stdout. Rejects on non-zero exit. */
function runCommand(
  cmd: string,
  args: string[],
  cwd: string,
  env?: Record<string, string>,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, {
      cwd,
      env: env ? { ...process.env, ...env } : process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    proc.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    proc.on("close", (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(
          new Error(
            stderr.trim() || stdout.trim() || `exit code ${String(code)}`,
          ),
        );
      }
    });
    proc.on("error", reject);
  });
}

/** Run a shell command and return stdout regardless of exit code (oxlint exits non-zero on violations). */
function runCommandCapture(
  cmd: string,
  args: string[],
  cwd: string,
  env?: Record<string, string>,
): Promise<string> {
  return new Promise((resolve) => {
    const proc = spawn(cmd, args, {
      cwd,
      env: env ? { ...process.env, ...env } : process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    proc.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    proc.on("close", () => resolve(stdout));
    proc.on("error", () => resolve(""));
  });
}

const ROUTE_PATTERN = /(?:^|\/)route\.ts$/;
const DEFINITION_FILE_PATTERN = /(?:^|\/)definition\.ts$/;
const I18N_LANG_PATTERN = /\/i18n\/(?:en|de|pl)\/index\.ts$/;
const I18N_INDEX_PATTERN = /\/i18n\/index\.ts$/;
// All generator output now lives under the single top-level src/generated/
// (was system/generated + app-tanstack + app-native). One pattern covers them all.
const GENERATED_PATTERN = /^src\/generated\//;
const FIXTURES_PATTERN = /^src\/generated\/ai-fixtures\//;
// Legacy mirror locations — still matched until app-tanstack/app-native fold into
// src/generated/{tanstack,native}. Harmless once those dirs no longer exist.
const APP_TANSTACK_PATTERN = /^src\/(?:generated\/tanstack|app-tanstack)\//;
const APP_NATIVE_PATTERN = /^src\/(?:generated\/native|app-native)\//;

const SUPPRESSION_PATTERN =
  /eslint-disable|oxlint-disable|@ts-expect-error|@ts-ignore|@ts-nocheck/;

// Matches any import statement opener, including `import type`, `import * as`, side-effects, etc.
// Must match the raw (non-trimmed) diff line content (after stripping the +/- sigil).
const IMPORT_START_PATTERN =
  /^import\s*(?:type\s+)?(?:\{|"[^"]*"|'[^']*'|\*|\w)/;

// Matches the closing line of a multi-line import: `} from "..."` or `} from '...'`
// Also handles `} from "..."` with optional trailing semicolon/comment.
const IMPORT_CLOSE_PATTERN = /^}\s*from\s+["'`]/;

// Matches a dynamic `import("literal")` call line. The line must START with the
// call after an optional binding/return/await prefix — an `import()` used as a
// call ARGUMENT (`doThing(await import(...))`) or condition (`if (await import…`)
// does NOT match, so unsafe surrounding code is never mis-classified as import.
// Handles, all as single changed lines:
//   const mod = await import("./foo");
//   const { bar } = await import('./foo');
//   await import("./side-effect");
//   return import("./Icon") as Promise<IconModule>;   (return + as-cast)
//   import("./widget").then((m) => ({                 (multi-line .then opener)
// A trailing `as T` cast, `.method(...)` chain, and an unterminated opening
// `(`/`{`/`=>` (multi-line continuation) are all allowed.
const DYNAMIC_IMPORT_PATTERN =
  /^\s*(?:(?:export\s+)?(?:const|let|var)\s+[\w${},[\]\s:]+=\s*)?(?:return\s+)?(?:await\s+)?import\s*\(\s*["'`][^"'`]*["'`]\s*\)(?:\s+as\s+[\w.<>[\], ]+)?[\s\S]*?[;,{(]?\s*(?:=>\s*[({]?\s*)?$/;
// Bare assignment opener whose value continues on the NEXT line:
//   const listDef =
// Accepted only in an import context (its continuation is a dynamic import line).
const ASSIGN_OPENER_PATTERN =
  /^\s*(?:export\s+)?(?:const|let|var)\s+[\w${},[\]\s:]+=\s*$/;
// Comment-only line — always safe to stage inside an import group (formatters and
// code-mods move `// ...` banners around with the imports they annotate).
const COMMENT_LINE_PATTERN = /^\s*(?:\/\/|\/\*|\*)/;

// path: [...] opener — single-line complete or multi-line opener.
//   path: ["a", "b"],
//   path: [
const DEFINITION_PATH_OPENER_PATTERN = /^\s*path\s*:\s*\[/;
// Closing bracket of a multi-line path array:  ],  or  ]
const DEFINITION_PATH_CLOSER_PATTERN = /^\s*\]\s*,?\s*$/;
// A single path segment string inside the array:  "vibe",  or  "agent",
// Also matches dynamic param segments like  "[rootFolderId]",
const DEFINITION_PATH_MEMBER_PATTERN = /^\s*"[^"]*"\s*,?\s*$/;
// Closer of a multi-line dynamic-import destructure: `} = await import(...)`.
const DYNAMIC_IMPORT_CLOSE_PATTERN =
  /^[\s})\]]*=\s*(?:await\s+)?import\s*\(\s*["'`][^"'`]*["'`]\s*\)\s*[\w.()]*[;,]?\s*$/;

/**
 * Returns true if a raw diff content line (sigil already stripped, NOT trimmed)
 * belongs to an import statement. Tracks open-brace state across lines via `state`.
 *
 * Key design decisions:
 *  - Lines are NOT trimStart()'d — indentation is used by IMPORT_CLOSE_PATTERN and
 *    is present in real diff output.
 *  - When inside a multi-line `import { ... }` block, every line is accepted until
 *    `} from "..."` closes it — this covers identifiers, `type Foo,`, blank lines,
 *    trailing commas, and inline comments safely.
 *  - `inside` only becomes true after a confirmed `import {` opener that has no
 *    closing `}` on the same line — so false-positives require the unusual pattern
 *    of `} from "..."` appearing as a changed line in non-import code.
 */
function isImportLine(
  line: string,
  state: { inside: boolean; dynamic: boolean },
): boolean {
  // Blank lines between imports are always acceptable — formatters insert them
  // between import groups and they appear as changed lines in reorder diffs.
  if (line.trim() === "") {
    return true;
  }

  // Inside a multi-line dynamic-import destructure: `const {` … `} = await import(...)`.
  // Accept member/blank lines until the `= await import(...)` closer.
  if (state.dynamic) {
    if (DYNAMIC_IMPORT_CLOSE_PATTERN.test(line)) {
      state.dynamic = false;
      return true;
    }
    // Only bare destructure members (indented identifiers) are allowed inside.
    return isStrictImportMemberLine(line);
  }

  if (state.inside) {
    if (IMPORT_CLOSE_PATTERN.test(line.trimStart())) {
      state.inside = false;
      return true;
    }
    // Any line inside a `import { ... }` block is a valid import member line.
    return true;
  }

  // `} from "..."` can appear as the start of a hunk when the `import {` opener
  // didn't change — treat it as an import line without entering `inside` state.
  if (IMPORT_CLOSE_PATTERN.test(line.trimStart())) {
    return true;
  }

  // Comment lines accompany imports (banner comments, code-mod annotations).
  if (COMMENT_LINE_PATTERN.test(line)) {
    return true;
  }

  // Dynamic import (single line or multi-line .then/opener):
  //   const x = await import("..."); | return import("..") as T; | import("..").then((m) => ({
  if (DYNAMIC_IMPORT_PATTERN.test(line)) {
    return true;
  }

  // Bare assignment opener `const listDef =` whose value is a dynamic import on
  // the next line. Accept it (its continuation is verified independently); if it
  // were a non-import assignment, that continuation line would fail and reject
  // the whole group.
  if (ASSIGN_OPENER_PATTERN.test(line)) {
    return true;
  }

  // Opener of a multi-line dynamic-import destructure: `const {` with no `}` yet.
  // Enter `dynamic` state so following member lines are accepted up to the closer.
  if (/^\s*(?:export\s+)?(?:const|let|var)\s*\{[^}]*$/.test(line)) {
    state.dynamic = true;
    return true;
  }

  if (IMPORT_START_PATTERN.test(line)) {
    // Enter multi-line state when `{` is opened but not yet closed on this line.
    const afterImport = line.replace(/^import\s*(?:type\s+)?/, "");
    if (afterImport.includes("{") && !afterImport.includes("}")) {
      state.inside = true;
    }
    return true;
  }

  return false;
}

/**
 * Returns true if every changed line in the diff hunk belongs to an import statement.
 * `+` and `-` lines are evaluated with independent state so replacements work correctly.
 *
 * Mid-block hunks (where `import {` opener wasn't changed, only members/closer were):
 * If all changed lines of a given sigil end with `} from "..."` as the final changed line
 * of that sigil, we treat the whole group as import lines. This is safe because
 * `} from "..."` is unambiguous — it only appears as an import closer.
 */
function allLinesAreImports(changedLines: string[]): boolean {
  // Separate + and - lines for independent evaluation
  const removed = changedLines
    .filter((l) => l.startsWith("-"))
    .map((l) => l.slice(1));
  const added = changedLines
    .filter((l) => l.startsWith("+"))
    .map((l) => l.slice(1));

  return isLineGroupAllImports(removed) && isLineGroupAllImports(added);
}

/**
 * Evaluate a group of same-sigil lines (already stripped of their sigil).
 * Returns true if all lines in the group belong to import statements.
 */
function isLineGroupAllImports(lines: string[]): boolean {
  if (lines.length === 0) {
    return true;
  }

  const state = { inside: false, dynamic: false };

  // All-dynamic-import groups: every line is a single-line dynamic import (or blank).
  // Common when a code-mod adds/removes `const x = await import(...)` lines.
  if (
    lines.every((l) => l.trim() === "" || DYNAMIC_IMPORT_PATTERN.test(l)) &&
    lines.some((l) => l.trim() !== "")
  ) {
    return true;
  }

  const lastNonEmpty = [...lines].toReversed().find((l) => l.trim() !== "");

  // Mid-block detection (with closer): if the last non-empty line is `} from "..."`,
  // the entire group is a partial view into a multi-line import block.
  if (
    lastNonEmpty !== undefined &&
    IMPORT_CLOSE_PATTERN.test(lastNonEmpty.trimStart())
  ) {
    return lines.every((l) => isMidBlockImportLine(l));
  }

  // Mid-block detection (no closer): a group of pure import-member lines where
  // the closing `} from` line wasn't changed (e.g. removing a named export member).
  // Safe to accept if every line is blank or matches the strict import-member pattern.
  if (lines.every((l) => isStrictImportMemberLine(l))) {
    return true;
  }

  for (const line of lines) {
    if (!isImportLine(line, state)) {
      return false;
    }
  }

  return true;
}

/**
 * Permissive check for lines inside a known import block (mid-block hunk with closer).
 * Accepts indented lines, blank lines, `} from "..."`, and `import` openers.
 */
function isMidBlockImportLine(line: string): boolean {
  const trimmed = line.trimStart();
  if (trimmed === "") {
    return true;
  }
  if (IMPORT_CLOSE_PATTERN.test(trimmed)) {
    return true;
  }
  if (IMPORT_START_PATTERN.test(line)) {
    return true;
  }
  if (/^\s/.test(line)) {
    return true;
  }
  // Bare identifier / `type Foo` without indentation (some formatters omit it)
  if (/^(?:type\s+)?[\w$][\w$,\s]*,?\s*$/.test(trimmed)) {
    return true;
  }
  return false;
}

/**
 * Strict check for a line that is an import block member with no surrounding closer.
 * Only accepts: blank lines, indented lines that look like `Identifier,` or `type Foo,`.
 * Rejects anything containing `=`, `(`, `;` outside a string, etc.
 */
function isStrictImportMemberLine(line: string): boolean {
  const trimmed = line.trimStart();
  if (trimmed === "") {
    return true;
  }
  // Must be indented (import members are always indented in multi-line imports)
  if (!/^\s/.test(line)) {
    return false;
  }
  // Reject lines with assignment, function call, or statement terminators
  if (/[=(;]/.test(trimmed)) {
    return false;
  }
  // Accept: optional `type ` prefix, then identifier(s) with optional comma
  if (/^(?:type\s+)?[\w$][\w$\s,]*,?\s*$/.test(trimmed)) {
    return true;
  }
  return false;
}

/**
 * Returns true if every changed line in the hunk belongs to a `path: [...]`
 * field inside a createEndpoint() call in a definition.ts file.
 *
 * Handles all real diff shapes:
 *  1. Single-line ↔ multi-line replacement:
 *       -  path: ["agent", "chat"],
 *       +  path: [
 *       +    "vibe",
 *       +    "agent",
 *       +    "chat",
 *       +  ],
 *  2. Insertion into existing multi-line array (opener/closer unchanged):
 *       +    "vibe",
 *  3. Multi-line ↔ multi-line full replacement.
 *
 * + and - lines are evaluated independently (same as allLinesAreImports).
 * Only called when the file is a definition.ts.
 */
function allLinesAreDefinitionPath(changedLines: string[]): boolean {
  if (changedLines.length === 0) {
    return false;
  }
  const removed = changedLines
    .filter((l) => l.startsWith("-"))
    .map((l) => l.slice(1));
  const added = changedLines
    .filter((l) => l.startsWith("+"))
    .map((l) => l.slice(1));
  return isPathLineGroup(removed) && isPathLineGroup(added);
}

/**
 * Evaluate one side (all-removed or all-added) of a path hunk.
 * Returns true if every non-blank line belongs to a path: [...] expression.
 */
function isPathLineGroup(lines: string[]): boolean {
  if (lines.length === 0) {
    return true;
  }

  // Case: pure member insertion/deletion — lines are just path segment strings
  // with no opener/closer, e.g. `    "vibe",`. This happens when the path array
  // is already multi-line and only a segment is being added/removed.
  if (
    lines.every(
      (l) => l.trim() === "" || DEFINITION_PATH_MEMBER_PATTERN.test(l),
    ) &&
    lines.some((l) => l.trim() !== "")
  ) {
    return true;
  }

  // Case: includes opener (path: [...) and optionally closer and members.
  // Walk through lines tracking bracket state.
  let inside = false;
  let hasOpener = false;

  for (const line of lines) {
    if (line.trim() === "") {
      continue;
    }
    if (!inside && DEFINITION_PATH_OPENER_PATTERN.test(line)) {
      hasOpener = true;
      // Single-line complete form: path: ["a", "b"],  — opener and closer on same line
      if (/^\s*path\s*:\s*\[.*\]\s*,?\s*$/.test(line)) {
        // stays closed
      } else {
        inside = true;
      }
      continue;
    }
    if (inside && DEFINITION_PATH_CLOSER_PATTERN.test(line)) {
      inside = false;
      continue;
    }
    if (inside && DEFINITION_PATH_MEMBER_PATTERN.test(line)) {
      continue;
    }
    // Anything else is not a path line
    return false;
  }

  return hasOpener;
}

// ============================================================
// camelCase identifier renames
// ============================================================

/**
 * A camelCase identifier: leading lowercase letter, then letters/digits only.
 * A single all-lowercase word (`single`, `user`) IS camelCase — the convention
 * only forbids a separator or a leading capital, not a one-word name.
 *
 * Both sides of a rename must match this. That makes the rule case-to-case and
 * never cross-case: `user_name` → `userName` is rejected (the old side is
 * snake_case), as is `userName` → `UserName`. A convention switch is a real
 * refactor and stays unstaged for review; only camelCase → camelCase auto-stages.
 */
const CAMEL_CASE_PATTERN = /^[a-z][a-zA-Z0-9]*$/;

/**
 * Words that LOOK like camelCase but are not renameable identifiers — swapping
 * one for another changes behaviour, it doesn't rename anything. Without this,
 * `const` → `let`, `true` → `false`, and `string` → `number` would all read as
 * one-word "camelCase renames" and auto-stage real semantic edits.
 *
 * Contextual words (`type`, `from`, `get`, `as`) are included even though they
 * can be legitimate variable names: mis-skipping a rename costs nothing (the
 * file just stays unstaged), mis-staging a keyword swap costs review.
 */
const RESERVED_WORDS = new Set([
  // Declarations / control flow
  "const",
  "let",
  "var",
  "function",
  "class",
  "extends",
  "implements",
  "return",
  "if",
  "else",
  "for",
  "while",
  "do",
  "switch",
  "case",
  "default",
  "break",
  "continue",
  "try",
  "catch",
  "finally",
  "throw",
  "new",
  "delete",
  "typeof",
  "instanceof",
  "in",
  "of",
  "this",
  "super",
  "void",
  "yield",
  "async",
  "await",
  "static",
  "get",
  "set",
  // Module syntax
  "import",
  "export",
  "from",
  "as",
  // Literals
  "true",
  "false",
  "null",
  "undefined",
  // TypeScript syntax + primitive types
  "type",
  "interface",
  "enum",
  "namespace",
  "declare",
  "abstract",
  "readonly",
  "public",
  "private",
  "protected",
  "is",
  "keyof",
  "infer",
  "satisfies",
  "any",
  "unknown",
  "never",
  "string",
  "number",
  "boolean",
  "object",
  "symbol",
  "bigint",
]);

/** A camelCase name that is safe to treat as a renameable identifier. */
function isCamelCaseIdentifier(name: string): boolean {
  return CAMEL_CASE_PATTERN.test(name) && !RESERVED_WORDS.has(name);
}

interface LineToken {
  text: string;
  isIdentifier: boolean;
  /** Token sits between quotes — its text is data, not a reference. */
  inString: boolean;
}

const IDENT_START_CHAR = /[A-Za-z_$]/;
const IDENT_BODY_CHAR = /[A-Za-z0-9_$]/;

/**
 * Split one raw line into identifier tokens and single-character separators,
 * tracking quote state so a word inside a string literal is marked `inString`.
 *
 * A diff line is examined alone, so an unterminated quote (a template literal
 * spanning lines) just runs to end-of-line. That can only mark MORE tokens as
 * in-string than really are, which can only reject a hunk — never accept a bad
 * one, so the failure direction is the safe one.
 */
function tokenizeLine(line: string): LineToken[] {
  const tokens: LineToken[] = [];
  let quote: string | null = null;
  let i = 0;

  const readIdentifier = (start: number): number => {
    let end = start;
    while (end < line.length && IDENT_BODY_CHAR.test(line[end] ?? "")) {
      end++;
    }
    return end;
  };

  while (i < line.length) {
    const ch = line[i] ?? "";

    if (quote !== null) {
      // Escape sequence — consume both chars so `\"` never closes the string.
      if (ch === "\\") {
        tokens.push({
          text: line.slice(i, i + 2),
          isIdentifier: false,
          inString: true,
        });
        i += 2;
        continue;
      }
      if (ch === quote) {
        quote = null;
        tokens.push({ text: ch, isIdentifier: false, inString: false });
        i++;
        continue;
      }
      if (IDENT_START_CHAR.test(ch)) {
        const end = readIdentifier(i);
        tokens.push({
          text: line.slice(i, end),
          isIdentifier: true,
          inString: true,
        });
        i = end;
        continue;
      }
      tokens.push({ text: ch, isIdentifier: false, inString: true });
      i++;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      tokens.push({ text: ch, isIdentifier: false, inString: false });
      i++;
      continue;
    }

    if (IDENT_START_CHAR.test(ch)) {
      const end = readIdentifier(i);
      tokens.push({
        text: line.slice(i, end),
        isIdentifier: true,
        inString: false,
      });
      i = end;
      continue;
    }

    tokens.push({ text: ch, isIdentifier: false, inString: false });
    i++;
  }

  return tokens;
}

/**
 * True when `newLine` is `oldLine` with one or more camelCase identifiers
 * renamed, and nothing else touched.
 *
 * Every non-identifier token — punctuation, operators, indentation, numeric
 * literals — must be byte-identical, so the two lines have to share an exact
 * shape. Anything that reflows the line (a formatter re-wrap) breaks that shape
 * and is rejected rather than guessed at.
 *
 * Identifiers inside string literals are excluded: an i18n key, a route path or
 * a SQL fragment that changes is a data change with runtime meaning, not a
 * rename, even when it happens to be spelled in camelCase.
 */
function isCamelCaseRenameLinePair(oldLine: string, newLine: string): boolean {
  const oldTokens = tokenizeLine(oldLine);
  const newTokens = tokenizeLine(newLine);
  if (oldTokens.length !== newTokens.length) {
    return false;
  }

  let renames = 0;
  for (let i = 0; i < oldTokens.length; i++) {
    const o = oldTokens[i];
    const n = newTokens[i];
    if (!o || !n) {
      return false;
    }
    if (
      o.text === n.text &&
      o.isIdentifier === n.isIdentifier &&
      o.inString === n.inString
    ) {
      continue;
    }
    // A difference is only allowed between two bare camelCase identifiers.
    if (!o.isIdentifier || !n.isIdentifier || o.inString || n.inString) {
      return false;
    }
    if (!isCamelCaseIdentifier(o.text) || !isCamelCaseIdentifier(n.text)) {
      return false;
    }
    renames++;
  }

  // No differing token means the pair isn't a rename at all (whitespace-only or
  // an in-string edit that slipped through as equal) — don't claim it.
  return renames > 0;
}

/**
 * Returns true if the hunk is purely camelCase identifier renames.
 *
 * With `--unified=0` git emits a hunk's removals before its additions, so the
 * two blocks pair up by index. An unequal count means lines were added or
 * dropped, not renamed, and the hunk is rejected.
 *
 * Exported for unit testing.
 */
export function allLinesAreCamelCaseRenames(changedLines: string[]): boolean {
  const removed = changedLines
    .filter((l) => l.startsWith("-"))
    .map((l) => l.slice(1));
  const added = changedLines
    .filter((l) => l.startsWith("+"))
    .map((l) => l.slice(1));

  if (removed.length === 0 || removed.length !== added.length) {
    return false;
  }

  return removed.every((oldLine, i) =>
    isCamelCaseRenameLinePair(oldLine, added[i] ?? ""),
  );
}

function isBoilerplateCandidate(filePath: string): boolean {
  return (
    ROUTE_PATTERN.test(filePath) ||
    I18N_LANG_PATTERN.test(filePath) ||
    I18N_INDEX_PATTERN.test(filePath) ||
    GENERATED_PATTERN.test(filePath) ||
    FIXTURES_PATTERN.test(filePath)
  );
}

/**
 * Returns true if the file is in a generated-output directory (app-tanstack, app-native)
 * and does NOT have a "use custom" directive — meaning it is safe to auto-stage.
 */
function isAutoStagedGeneratedOutput(filePath: string, cwd: string): boolean {
  if (
    !APP_TANSTACK_PATTERN.test(filePath) &&
    !APP_NATIVE_PATTERN.test(filePath)
  ) {
    return false;
  }
  return !hasCustomDirective(resolvePath(cwd, filePath));
}

/** Parse a unified diff into header lines and hunk arrays. */
function parseDiff(
  diff: string,
): { headerLines: string[]; hunks: string[][]; isModeOnly: boolean } | null {
  const lines = diff.split("\n");
  const headerLines: string[] = [];
  let bodyStart = 0;
  let isModeOnly = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    if (
      line.startsWith("diff ") ||
      line.startsWith("index ") ||
      line.startsWith("--- ") ||
      line.startsWith("+++ ")
    ) {
      headerLines.push(line);
      bodyStart = i + 1;
    } else if (line.startsWith("old mode ") || line.startsWith("new mode ")) {
      // File permission change only — no content hunks follow.
      isModeOnly = true;
      bodyStart = i + 1;
    } else if (line.startsWith("@@")) {
      break;
    }
  }

  const hunks: string[][] = [];
  let currentHunk: string[] | null = null;

  for (let i = bodyStart; i < lines.length; i++) {
    const line = lines[i] ?? "";
    if (line.startsWith("@@")) {
      if (currentHunk) {
        hunks.push(currentHunk);
      }
      currentHunk = [line];
    } else if (currentHunk) {
      currentHunk.push(line);
    }
  }
  if (currentHunk) {
    hunks.push(currentHunk);
  }

  return { headerLines, hunks, isModeOnly };
}

/**
 * Run ONE `git diff --unified=0` for all tracked files (optionally scoped to
 * pathspecs) and split the combined output into a per-file map keyed by the new
 * path. One subprocess instead of one-per-file — the difference between seconds
 * and minutes on a large working tree.
 *
 * Splitting is by `diff --git a/… b/…` record boundaries; the new path is taken
 * from the `+++ b/…` line (falling back to the `diff --git` b-side) so renames
 * and quoted paths resolve to the same key analyzeFileDiff/apply use.
 */
async function batchUnstagedDiffs(
  cwd: string,
  pathspecs: string[],
): Promise<Map<string, string>> {
  const map = new Map<string, string>();

  // Chunk pathspecs to avoid ENAMETOOLONG when the working tree has many files.
  const chunks =
    pathspecs.length === 0
      ? [[]] // single empty call → full-tree diff
      : chunkArray(pathspecs, ARG_CHUNK_SIZE);

  for (const chunk of chunks) {
    const args = ["diff", "--unified=0", "--no-color", "--no-ext-diff"];
    if (chunk.length > 0) {
      args.push("--", ...chunk);
    }
    const combined = await runCommandCapture("git", args, cwd);
    if (!combined.trim()) {
      continue;
    }

    const lines = combined.split("\n");
    let current: string[] = [];
    let currentPath: string | null = null;

    const flush = (): void => {
      if (currentPath !== null && current.length > 0) {
        map.set(currentPath, current.join("\n"));
      }
    };

    for (const line of lines) {
      if (line.startsWith("diff --git ")) {
        flush();
        current = [line];
        // b-side of "diff --git a/<x> b/<y>" as a provisional key.
        const m = /^diff --git a\/(.+) b\/(.+)$/.exec(line);
        currentPath = m ? (m[2] ?? null) : null;
      } else {
        current.push(line);
        // Prefer the exact "+++ b/<path>" path when present (handles /dev/null etc.).
        if (line.startsWith("+++ b/")) {
          currentPath = line.slice("+++ b/".length);
        }
      }
    }
    flush();
  }

  return map;
}

/** Extract the @@ line target range start from a hunk header. */
function hunkNewStart(hunkHeader: string): number {
  // @@ -a,b +c,d @@ ...  →  c
  const m = /^@@ -\d+(?:,\d+)? \+(\d+)/.exec(hunkHeader);
  return m ? parseInt(m[1] ?? "0", 10) : -1;
}

/**
 * Net line delta a hunk introduces to the target file.
 * +N lines added, -M lines removed → delta = N - M.
 * Used to adjust subsequent hunk headers when building a partial patch.
 */
function hunkDelta(hunk: string[]): number {
  let added = 0;
  let removed = 0;
  for (const line of hunk.slice(1)) {
    if (line.startsWith("+") && !line.startsWith("+++")) {
      added++;
    } else if (line.startsWith("-") && !line.startsWith("---")) {
      removed++;
    }
  }
  return added - removed;
}

/**
 * Rewrite the @@ header of a hunk to use a new target start line.
 * Preserves the old-file side (-a,b) and the trailing context label unchanged.
 */
function rewriteHunkNewStart(hunkHeader: string, newStart: number): string {
  // @@ -a,b +c,d @@ label  →  @@ -a,b +newStart,d @@ label
  return hunkHeader.replace(
    /^(@@ -\d+(?:,\d+)? \+)\d+/,
    `$1${String(newStart)}`,
  );
}

/**
 * Parse unified diff output for a single file and classify unstaged changes.
 *
 * Strategy:
 *  1. u0Unstaged = `git diff --unified=0 -- file` (WC vs index) — the true unstaged
 *     hunks with line numbers relative to the current index. This is what we apply.
 *  2. Classify each unstaged hunk: import-only, path-only, rename-only, or mixed.
 *  3. If all hunks are safe (imports, definition path lines, or camelCase
 *     renames) → importOnly=true, full-file stage.
 *  4. If some are safe → build patch from safe hunks for partial stage.
 *
 * Using WC-vs-index (not WC-vs-HEAD) for the patch eliminates line-number mismatches
 * when `git apply --cached` is used — the index IS the base, so hunks apply cleanly.
 */
function analyzeFileDiff(
  u0Unstaged: string,
  opts: { isDefinitionFile?: boolean } = {},
): {
  importOnly: boolean;
  importHunksPatch: string | null;
} | null {
  if (!u0Unstaged.trim()) {
    return null;
  }

  // Reject diffs that add or remove suppression comment lines — those must be reviewed.
  if (diffHasSuppression(u0Unstaged)) {
    return null;
  }

  const u0Parsed = parseDiff(u0Unstaged);
  if (!u0Parsed) {
    return null;
  }

  // Mode-only diff (old mode → new mode, no content hunks): safe to stage — the
  // executable bit change is always a phantom diff from cross-platform checkouts.
  if (u0Parsed.hunks.length === 0 && u0Parsed.isModeOnly) {
    return { importOnly: true, importHunksPatch: null };
  }

  if (u0Parsed.hunks.length === 0) {
    return null;
  }

  // Classify each unstaged hunk: import-only, definition path-only, or mixed
  const safeHunkStarts = new Set<number>();
  let hasUnsafeHunk = false;

  for (const hunk of u0Parsed.hunks) {
    const start = hunkNewStart(hunk[0] ?? "");
    const changedLines = hunk
      .slice(1)
      .filter((l) => l.startsWith("+") || l.startsWith("-"));
    if (changedLines.length === 0) {
      continue;
    }
    if (allLinesAreImports(changedLines)) {
      safeHunkStarts.add(start);
    } else if (
      opts.isDefinitionFile &&
      allLinesAreDefinitionPath(changedLines)
    ) {
      safeHunkStarts.add(start);
    } else if (allLinesAreCamelCaseRenames(changedLines)) {
      safeHunkStarts.add(start);
    } else {
      hasUnsafeHunk = true;
    }
  }

  const importOnly = !hasUnsafeHunk && safeHunkStarts.size > 0;

  if (importOnly) {
    return { importOnly: true, importHunksPatch: null };
  }

  if (safeHunkStarts.size === 0) {
    return { importOnly: false, importHunksPatch: null };
  }

  // Build patch from safe (import-only or definition path) unstaged hunks.
  // Applied with --unidiff-zero (zero-context hunks ok) and without --3way
  // since the patch base IS the index — no drift to resolve.
  //
  // Line-number adjustment: skipped (unsafe) hunks shift subsequent hunk
  // positions. For each excluded hunk that precedes an included hunk, subtract
  // its net delta from the included hunk's target start so the patch applies
  // cleanly against the unmodified index.
  const adjustedHunks: string[][] = [];
  let skippedDelta = 0;

  for (const hunk of u0Parsed.hunks) {
    const start = hunkNewStart(hunk[0] ?? "");
    if (safeHunkStarts.has(start)) {
      const adjustedStart = start - skippedDelta;
      const header = rewriteHunkNewStart(hunk[0] ?? "", adjustedStart);
      adjustedHunks.push([header, ...hunk.slice(1)]);
    } else {
      // Accumulate delta from excluded hunks so subsequent import hunks are adjusted.
      skippedDelta += hunkDelta(hunk);
    }
  }

  const patchLines = [...u0Parsed.headerLines, ...adjustedHunks.flat(), ""];
  return { importOnly: false, importHunksPatch: patchLines.join("\n") };
}

/**
 * Apply a patch string to the index (staging area) via `git apply --cached`.
 * Returns true on success.
 */
async function applyPatchToIndex(
  patch: string,
  cwd: string,
): Promise<{ ok: boolean; error: string }> {
  return new Promise((resolve) => {
    const proc = spawn(
      "git",
      ["apply", "--cached", "--unidiff-zero", "--whitespace=nowarn", "-"],
      { cwd, stdio: ["pipe", "pipe", "pipe"] },
    );
    let stderr = "";
    proc.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    proc.stdin.write(patch);
    proc.stdin.end();
    proc.on("close", (code) =>
      resolve({ ok: code === 0, error: stderr.trim() }),
    );
    proc.on("error", (err: Error) =>
      resolve({ ok: false, error: err.message }),
    );
  });
}

/**
 * Returns true if the diff itself adds or removes suppression comment lines.
 * Suppressions in unchanged file context don't affect staging safety.
 */
function diffHasSuppression(diff: string): boolean {
  for (const line of diff.split("\n")) {
    if (
      (line.startsWith("+") || line.startsWith("-")) &&
      !line.startsWith("+++") &&
      !line.startsWith("---")
    ) {
      if (SUPPRESSION_PATTERN.test(line.slice(1))) {
        return true;
      }
    }
  }
  return false;
}

/**
 * One parsed entry from `git status --porcelain -z`.
 *  - index:    the X column (staged status) — " ", "M", "A", "D", "R", "?" …
 *  - worktree: the Y column (worktree status)
 *  - path:     destination path (for a git-detected rename this is the new path)
 *  - origPath: original path when git already reports a rename ("R"), else null
 */
interface GitStatusEntry {
  index: string;
  worktree: string;
  path: string;
  origPath: string | null;
}

/**
 * Parse `git status --porcelain -z` into structured entries.
 *
 * `-z` is used so paths with spaces/newlines parse unambiguously: records are
 * NUL-separated, and a rename record is TWO NUL-separated tokens (new, then old).
 */
async function getGitStatus(cwd: string): Promise<GitStatusEntry[]> {
  const output = await runCommand(
    "git",
    ["status", "--porcelain", "-z", "-u"],
    cwd,
  );
  const tokens = output.split("\0");
  const entries: GitStatusEntry[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const record = tokens[i];
    if (!record) {
      continue;
    }
    const index = record[0] ?? " ";
    const worktree = record[1] ?? " ";
    const path = record.slice(3);

    // A rename/copy record (index or worktree = R/C) is followed by the ORIGINAL
    // path in the very next NUL-separated token.
    let origPath: string | null = null;
    if (
      index === "R" ||
      index === "C" ||
      worktree === "R" ||
      worktree === "C"
    ) {
      origPath = tokens[i + 1] ?? null;
      i++;
    }

    entries.push({ index, worktree, path, origPath });
  }

  return entries;
}

/**
 * Files eligible for content-analysis staging: unstaged modifications and
 * untracked/added files. Renames already reconciled elsewhere.
 */
function collectContentFiles(entries: GitStatusEntry[]): string[] {
  const files: string[] = [];
  for (const e of entries) {
    // Untracked or worktree-modified/added → candidate for import-only analysis.
    if (
      e.worktree === "M" ||
      e.worktree === "A" ||
      e.worktree === "?" ||
      e.index === "A"
    ) {
      files.push(e.path);
    }
  }
  return files;
}

/** True for files whose deletion is always safe to auto-stage (generated/fixtures). */
function isAutoStageableDeletion(filePath: string): boolean {
  return GENERATED_PATTERN.test(filePath) || FIXTURES_PATTERN.test(filePath);
}

/** Read a blob's contents from a git tree-ish (e.g. "HEAD:path"). Null if absent. */
async function readGitBlob(ref: string, cwd: string): Promise<string | null> {
  try {
    return await runCommand("git", ["show", ref], cwd);
  } catch {
    return null;
  }
}

/** Read a working-tree file's contents. Null on error. */
async function readWorktreeFile(
  filePath: string,
  cwd: string,
): Promise<string | null> {
  try {
    return await fsp.readFile(resolvePath(cwd, filePath), "utf8");
  } catch {
    return null;
  }
}

/**
 * Similarity classification between an old (pre-move) blob and the new file's
 * current content — used to decide whether a delete+add pair is really a rename.
 *
 *  - "identical": byte-for-byte equal → pure move.
 *  - "import-safe": differ only in import statements (classified via the same
 *    hunk analysis used for in-place edits) → rename + safe partial content.
 *  - "different": substantive non-import changes, or too dissimilar → not paired.
 */
type RenameSimilarity = "identical" | "import-safe" | "different";

function classifyRenamePair(
  oldContent: string,
  newContent: string,
): RenameSimilarity {
  if (oldContent === newContent) {
    return "identical";
  }
  // Reject if the delta touches suppression comments.
  const oldLines = oldContent.split("\n");
  const newLines = newContent.split("\n");
  // Cheap similarity floor: if less than half the old lines survive, it's a
  // rewrite, not a move — don't pair it as a rename.
  const newSet = new Set(newLines);
  const surviving = oldLines.filter((l) => newSet.has(l)).length;
  if (oldLines.length > 0 && surviving / oldLines.length < 0.5) {
    return "different";
  }
  const changed = diffChangedLines(oldLines, newLines);
  if (changed.some((l) => SUPPRESSION_PATTERN.test(l.slice(1)))) {
    return "different";
  }
  return allLinesAreImports(changed) && changed.length > 0
    ? "import-safe"
    : "different";
}

/**
 * Minimal changed-line extraction between two versions of a file, formatted like
 * unified-diff sigil lines ("+added" / "-removed") for reuse with allLinesAreImports.
 * Uses an LCS-free line-set difference — adequate because classifyRenamePair only
 * needs to know WHICH lines differ, not their order.
 */
function diffChangedLines(oldLines: string[], newLines: string[]): string[] {
  const oldCount = new Map<string, number>();
  for (const l of oldLines) {
    oldCount.set(l, (oldCount.get(l) ?? 0) + 1);
  }
  const newCount = new Map<string, number>();
  for (const l of newLines) {
    newCount.set(l, (newCount.get(l) ?? 0) + 1);
  }
  const changed: string[] = [];
  for (const [line, n] of oldCount) {
    const kept = newCount.get(line) ?? 0;
    for (let i = 0; i < n - kept; i++) {
      changed.push(`-${line}`);
    }
  }
  for (const [line, n] of newCount) {
    const kept = oldCount.get(line) ?? 0;
    for (let i = 0; i < n - kept; i++) {
      changed.push(`+${line}`);
    }
  }
  return changed;
}

/**
 * Stage a rename old→new so git records it as R (rename), keeping any unsafe
 * worktree edits UNSTAGED.
 *
 * Mechanic: put the OLD file's original blob into the index at the NEW path and
 * remove OLD from the index. index-vs-HEAD then reads as a pure rename; the
 * worktree-vs-index delta (the content edits) stays unstaged for later selective
 * (import-only) staging.
 */
async function stageRename(
  oldPath: string,
  newPath: string,
  oldBlobSha: string,
  cwd: string,
): Promise<boolean> {
  try {
    // Remove old from index (whether it was tracked or already staged-deleted).
    await runCommand("git", ["rm", "--cached", "--quiet", "--", oldPath], cwd);
  } catch {
    // Old may already be absent from the index (e.g. deletion pre-staged) — ok.
  }
  try {
    // Point the index entry for new at old's original content → rename vs HEAD.
    await runCommand(
      "git",
      [
        "update-index",
        "--add",
        "--cacheinfo",
        `100644,${oldBlobSha},${newPath}`,
      ],
      cwd,
    );
    return true;
  } catch {
    return false;
  }
}

/** A reconciled rename: old path, new path, and how their contents relate. */
interface ReconciledRename {
  oldPath: string;
  newPath: string;
  similarity: RenameSimilarity;
}

/**
 * Pair deleted paths (worktree ` D` or already-staged `D `) with created paths
 * (untracked `??` or already-staged `A `) that share content, and stage each pair
 * as a rename BEFORE any content analysis runs.
 *
 * Content source per side:
 *  - old deleted file: its HEAD blob (the pre-move content).
 *  - new file: its current worktree content (falling back to the staged blob if
 *    the worktree copy is gone).
 *
 * Matching is greedy by best similarity: identical wins over import-safe. Only
 * "identical" and "import-safe" pairs are reconciled — anything more divergent is
 * left as separate delete/add for the caller to handle normally.
 */
async function reconcileRenames(
  cwd: string,
  dryRun: boolean,
  logger: EndpointLogger,
): Promise<ReconciledRename[]> {
  // Let git's own (fast, C-implemented, similarity-based) rename detector do the
  // pairing — it matches a worktree-deleted file to an untracked/added file even
  // when the content was edited, in a single call. We only decide staging safety.
  const pairs = await detectRenamePairs(cwd);
  if (pairs.length === 0) {
    return [];
  }

  const reconciled: ReconciledRename[] = [];

  for (const pair of pairs) {
    // "identical" (git similarity R100) → pure move: staging the rename fully
    // captures it. Otherwise the move carries content edits — only stage the
    // rename if those edits are import-safe; the edit itself is left unstaged
    // (Phase 3 partial-stages the import hunks).
    let similarity: RenameSimilarity = pair.identical
      ? "identical"
      : "different";

    if (!pair.identical) {
      const oldContent = await readGitBlob(pair.oldSha, cwd);
      const newContent = await readWorktreeFile(pair.newPath, cwd);
      if (oldContent === null || newContent === null) {
        continue;
      }
      similarity = classifyRenamePair(oldContent, newContent);
      if (similarity === "different") {
        // Edited move with unsafe changes — leave as separate delete/add.
        continue;
      }
    }

    if (!dryRun) {
      const ok = await stageRename(
        pair.oldPath,
        pair.newPath,
        pair.oldSha,
        cwd,
      );
      if (!ok) {
        logger.warn(
          `[VIBE-STAGE] Failed to stage rename ${pair.oldPath} -> ${pair.newPath}`,
        );
        continue;
      }
    }
    logger.debug(
      `[VIBE-STAGE] Rename (${similarity}) ${pair.oldPath} -> ${pair.newPath}`,
    );
    reconciled.push({
      oldPath: pair.oldPath,
      newPath: pair.newPath,
      similarity,
    });
  }

  return reconciled;
}

/** A rename pair detected by git: old→new plus old's HEAD blob SHA and exactness. */
interface RenamePair {
  oldPath: string;
  newPath: string;
  oldSha: string;
  identical: boolean;
}

/**
 * Detect rename pairs (moves) across the whole tree — including UNSTAGED manual
 * `mv`s (worktree-delete + untracked-create) — using git's own C-implemented,
 * similarity-based rename detector. Fast and authoritative.
 *
 * Why a temp index: `git status` only pairs a delete with an add when BOTH are
 * in the same view. A manual `mv` leaves one side in the worktree and the other
 * untracked, which git does NOT auto-pair. So we build a THROWAWAY index —
 * copy the real index, `git add -A` everything into the copy — then read renames
 * as index-vs-HEAD. The real index is never touched; the temp file is deleted.
 *
 * v2 rename record (fields space-separated, then TWO NUL-separated paths):
 *   `2 <XY> <sub> <mH> <mI> <mW> <hH> <hI> <Xscore> <newPath>\0<origPath>`
 * We read `<hH>` (HEAD blob SHA) as the pre-move content, the `Xscore` (e.g.
 * `R100`) to tell exact moves from edited ones, and the two paths.
 */
async function detectRenamePairs(cwd: string): Promise<RenamePair[]> {
  // Locate the real index and a sibling temp path inside the git dir.
  const gitDir = (
    await runCommand("git", ["rev-parse", "--absolute-git-dir"], cwd)
  ).trim();
  const realIndex = resolvePath(gitDir, "index");
  const tmpIndex = resolvePath(gitDir, "vibe-stage-rename-index");

  try {
    // Seed the temp index from the real one (if it exists), then stage everything
    // into the COPY so index-vs-HEAD carries both sides of each move.
    if (existsSync(realIndex)) {
      await fsp.copyFile(realIndex, tmpIndex);
    } else {
      await fsp.rm(tmpIndex, { force: true });
    }
    const env: Record<string, string> = { GIT_INDEX_FILE: tmpIndex };
    await runCommandCapture("git", ["add", "-A"], cwd, env);

    const out = await runCommandCapture(
      "git",
      ["status", "--porcelain=v2", "--find-renames=40%", "-z"],
      cwd,
      env,
    );
    const tokens = out.split("\0");
    const pairs: RenamePair[] = [];

    for (let i = 0; i < tokens.length; i++) {
      const record = tokens[i];
      if (record === undefined || record === "") {
        continue;
      }
      // Only "2 " records are renames/copies; each consumes the NEXT token (origPath).
      if (!record.startsWith("2 ")) {
        continue;
      }
      const origPath = tokens[i + 1];
      i++;
      if (origPath === undefined) {
        continue;
      }
      const fields = record.split(" ");
      // fields: [ "2", XY, sub, mH, mI, mW, hH, hI, Xscore, ...newPathParts ]
      const headSha = fields[6];
      const scoreField = fields[8] ?? "";
      // newPath is everything after the 9th field (paths may contain spaces).
      const newPath = fields.slice(9).join(" ");
      if (!headSha || newPath === "") {
        continue;
      }
      const identical = scoreField === "R100" || scoreField === "C100";
      pairs.push({ oldPath: origPath, newPath, oldSha: headSha, identical });
    }

    return pairs;
  } finally {
    await fsp.rm(tmpIndex, { force: true });
  }
}

interface OxlintDiagnostic {
  filename?: string;
}

/**
 * Run oxlint boilerplate plugin on candidate files.
 * Returns the set of file paths (relative) that have zero violations.
 */
async function checkBoilerplateCompliance(
  files: string[],
  cwd: string,
  logger: EndpointLogger,
): Promise<Set<string>> {
  if (files.length === 0) {
    return new Set<string>();
  }

  const tmpConfigPath = resolvePath(cwd, ".tmp", ".oxlintrc-boilerplate.json");
  const minimalConfig = JSON.stringify({
    plugins: [],
    jsPlugins: ["@next-vibe/checker/oxlint-plugins/boilerplate.ts"],
    rules: {
      "oxlint-plugin-boilerplate/route-pattern": "error",
      "oxlint-plugin-boilerplate/i18n-pattern": "error",
    },
  });

  await fsp.writeFile(tmpConfigPath, minimalConfig, "utf8");

  const cleanFiles = new Set<string>();

  try {
    const allDiagnostics: OxlintDiagnostic[] = [];

    // Chunk file list to avoid ENAMETOOLONG on large working trees.
    for (const chunk of chunkArray(files, ARG_CHUNK_SIZE)) {
      const args = ["--format", "json", "--config", tmpConfigPath, ...chunk];
      // oxlint exits non-zero when violations found - capture regardless
      const output = await runCommandCapture("oxlint", args, cwd);

      if (!output.trim()) {
        // No output = no violations in this chunk; chunk files are clean.
        continue;
      }

      let chunkDiagnostics: OxlintDiagnostic[] = [];
      try {
        chunkDiagnostics = JSON.parse(output) as OxlintDiagnostic[];
      } catch {
        logger.warn(
          `[VIBE-STAGE] Could not parse oxlint output: ${output.slice(0, 200)}`,
        );
        // Treat the whole chunk as potentially violating to be safe.
        for (const f of chunk) {
          allDiagnostics.push({ filename: f });
        }
        continue;
      }

      allDiagnostics.push(...chunkDiagnostics);
    }

    const filesWithViolations = new Set<string>();
    for (const diag of allDiagnostics) {
      if (diag.filename) {
        const rel = diag.filename.startsWith(cwd)
          ? diag.filename.slice(cwd.length + 1)
          : diag.filename;
        filesWithViolations.add(rel);
      }
    }

    for (const f of files) {
      if (!filesWithViolations.has(f)) {
        cleanFiles.add(f);
      }
    }
  } finally {
    try {
      await fsp.unlink(tmpConfigPath);
    } catch {
      // best-effort cleanup
    }
  }

  return cleanFiles;
}

// ============================================================
// Repository
// ============================================================

export class VibeStageRepository {
  static async execute(
    data: VibeStageRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
    t: CheckVibeStageT,
  ): Promise<ResponseType<VibeStageResponseOutput>> {
    const cwd = process.cwd();

    try {
      // Verify this is a git repo
      try {
        await runCommand("git", ["rev-parse", "--git-dir"], cwd);
      } catch {
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Ensure .tmp dir exists
      const tmpDir = resolvePath(cwd, ".tmp");
      if (!existsSync(tmpDir)) {
        await fsp.mkdir(tmpDir, { recursive: true });
      }

      // Structured status: both index (X) and worktree (Y) columns, rename origins.
      const status = await getGitStatus(cwd);
      logger.debug(`[VIBE-STAGE] ${String(status.length)} status entries`);

      // Optional path filters — a rename matches if EITHER side is under a filter.
      const rawPaths = data.paths;
      const pathFilters: string[] = rawPaths
        ? Array.isArray(rawPaths)
          ? rawPaths
          : [rawPaths]
        : [];
      const underFilter = (p: string): boolean =>
        pathFilters.length === 0 || pathFilters.some((f) => p.startsWith(f));

      const staged: string[] = [];
      const partiallyStaged: string[] = [];
      const skipped: string[] = [];
      const renamed: string[] = [];
      const deleted: string[] = [];

      // ── Phase 1: reconcile renames (moves) first, safely ──────────────────
      // Pair deletes (worktree OR already-staged) with creates (untracked OR
      // already-staged) by content; stage each as a real rename. Pure moves stage
      // fully; moved-and-edited files get the rename + import-only content only.
      const renames = (
        await reconcileRenames(cwd, data.dryRun ?? false, logger)
      ).filter((r) => underFilter(r.oldPath) || underFilter(r.newPath));

      const reconciledNewPaths = new Set(renames.map((r) => r.newPath));
      const reconciledOldPaths = new Set(renames.map((r) => r.oldPath));
      for (const r of renames) {
        renamed.push(`${r.oldPath} -> ${r.newPath}`);
      }

      // Renames git already detected as fully staged (R  old -> new, e.g. `git mv`)
      // are surfaced too, and their new path skipped from content analysis.
      for (const e of status) {
        if (
          e.index === "R" &&
          e.origPath !== null &&
          !reconciledNewPaths.has(e.path) &&
          (underFilter(e.origPath) || underFilter(e.path))
        ) {
          renamed.push(`${e.origPath} -> ${e.path}`);
          reconciledNewPaths.add(e.path);
        }
      }

      // ── Phase 2: auto-stage generated/fixture DELETIONS ───────────────────
      // Plain deletions (not part of a reconciled rename) of generated output and
      // fixtures are safe to remove from the index.
      const deletionsToStage = status
        .filter(
          (e) =>
            (e.worktree === "D" || e.index === "D") &&
            !reconciledOldPaths.has(e.path) &&
            isAutoStageableDeletion(e.path) &&
            underFilter(e.path),
        )
        .map((e) => e.path);

      if (!data.dryRun && deletionsToStage.length > 0) {
        // `git rm --cached` for still-tracked, plus index-remove for worktree-gone.
        // Chunked to avoid ENAMETOOLONG when many files are deleted at once.
        for (const chunk of chunkArray(deletionsToStage, ARG_CHUNK_SIZE)) {
          await runCommand(
            "git",
            ["rm", "--cached", "--quiet", "--ignore-unmatch", "--", ...chunk],
            cwd,
          );
        }
      }
      for (const d of deletionsToStage) {
        deleted.push(d);
      }

      // ── Phase 3: content analysis for the remaining files ─────────────────
      // Import-safe renames still need their content diff staged (import hunks
      // only). Pure-move ("identical") renames are already fully staged.
      const importSafeRenameNewPaths = renames
        .filter((r) => r.similarity === "import-safe")
        .map((r) => r.newPath);

      let allFiles = collectContentFiles(status).filter((f) => {
        if (!underFilter(f)) {
          return false;
        }
        // Skip new paths already fully handled as pure moves.
        if (
          reconciledNewPaths.has(f) &&
          !importSafeRenameNewPaths.includes(f)
        ) {
          return false;
        }
        return true;
      });
      // Include import-safe rename destinations for partial content staging.
      for (const p of importSafeRenameNewPaths) {
        if (!allFiles.includes(p) && underFilter(p)) {
          allFiles.push(p);
        }
      }

      if (
        allFiles.length === 0 &&
        renamed.length === 0 &&
        deleted.length === 0
      ) {
        return success({
          staged: [],
          partiallyStaged: [],
          skipped: [],
          renamed: [],
          deleted: [],
          message: t("response.noChanges"),
        });
      }

      // Analyze all files for import-only diffs. One batched `git diff` for the
      // whole set (scoped to allFiles as pathspecs) instead of one spawn per file.
      const diffMap = await batchUnstagedDiffs(cwd, allFiles);
      const diffAnalyses = allFiles.map((f) => ({
        file: f,
        analysis: analyzeFileDiff(diffMap.get(f) ?? "", {
          isDefinitionFile: DEFINITION_FILE_PATTERN.test(f),
        }),
      }));

      // Separate into: boilerplate candidates, import-only full files, partial import files
      const boilerplateCandidates: string[] = [];
      const importOnlyFiles: string[] = []; // non-boilerplate, all changes are imports
      const partialImportPatches: Map<string, string> = new Map(); // file → patch

      for (const { file, analysis } of diffAnalyses) {
        if (isBoilerplateCandidate(file)) {
          boilerplateCandidates.push(file);
        } else if (isAutoStagedGeneratedOutput(file, cwd)) {
          // app-tanstack / app-native without "use custom" → stage unconditionally
          importOnlyFiles.push(file);
        } else if (analysis?.importOnly) {
          importOnlyFiles.push(file);
        } else if (analysis?.importHunksPatch) {
          partialImportPatches.set(file, analysis.importHunksPatch);
        }
      }

      logger.debug(
        `[VIBE-STAGE] ${String(boilerplateCandidates.length)} boilerplate candidates, ` +
          `${String(importOnlyFiles.length)} import-only files, ` +
          `${String(partialImportPatches.size)} partial-import files`,
      );

      // Ensure config is ready so the boilerplate plugin can resolve
      if (boilerplateCandidates.length > 0) {
        await ConfigRepositoryImpl.ensureConfigReady(logger, locale, false);
      }

      // Check boilerplate compliance
      const cleanBoilerplate =
        boilerplateCandidates.length > 0
          ? await checkBoilerplateCompliance(boilerplateCandidates, cwd, logger)
          : new Set<string>();

      // Full-file staging: clean boilerplate + import-only files
      for (const candidate of boilerplateCandidates) {
        if (cleanBoilerplate.has(candidate)) {
          staged.push(candidate);
        } else {
          skipped.push(candidate);
        }
      }
      for (const f of importOnlyFiles) {
        staged.push(f);
      }

      // Partial staging: apply import-only hunks to index
      for (const [file, patch] of partialImportPatches) {
        if (!data.dryRun) {
          const { ok, error } = await applyPatchToIndex(patch, cwd);
          if (ok) {
            partiallyStaged.push(file);
            logger.debug(`[VIBE-STAGE] Partially staged (imports) ${file}`);
          } else {
            logger.warn(
              `[VIBE-STAGE] Failed to apply import patch for ${file}: ${error}`,
            );
            skipped.push(file);
          }
        } else {
          // dry run: just report what would be partially staged
          partiallyStaged.push(file);
        }
      }

      // git add full files unless dry run
      // Chunked to avoid ENAMETOOLONG when many files are staged at once.
      if (!data.dryRun && staged.length > 0) {
        for (const chunk of chunkArray(staged, ARG_CHUNK_SIZE)) {
          await runCommand("git", ["add", "--", ...chunk], cwd);
        }
        logger.debug(`[VIBE-STAGE] Staged ${String(staged.length)} files`);
      }

      const anyStaged =
        staged.length > 0 ||
        partiallyStaged.length > 0 ||
        renamed.length > 0 ||
        deleted.length > 0;

      const message =
        data.dryRun && anyStaged ? t("response.dryRunNote") : undefined;

      return success({
        staged,
        partiallyStaged,
        skipped,
        renamed,
        deleted,
        message,
      });
    } catch (err) {
      logger.error(`[VIBE-STAGE] Error: ${parseError(err)}`);
      return fail({
        message: t("errors.internal.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
