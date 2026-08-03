import "server-only";

/**
 * Lightweight symbol extraction + usage analysis for `vibe deps`.
 *
 * The file-level graph answers "who imports this file". This module answers the
 * finer question the reorg needs: "which exported symbols / static methods are
 * actually used, and where" — so the tool can flag dead public surface
 * (unused exports, unused static repository methods) and single-use symbols that
 * signal a scope leak.
 *
 * Regex-based, not a full TS parser — fast and good enough for ranking. It can
 * over-count (a name reused in an unrelated file looks like a use) so results are
 * reported as signals to review, not hard guarantees. Conservative by design:
 * we'd rather under-report "unused" than wrongly delete something.
 */

/** A symbol exported by a file (or a static method on an exported class). */
export interface SymbolDef {
  name: string;
  kind: "class" | "function" | "const" | "type" | "static-method";
  /** Owning class for static-method, else undefined. */
  owner?: string;
  /** Graph key (src-relative posix) of the declaring file. */
  file: string;
  /** Line within the file (1-based) for reporting. */
  line: number;
  /**
   * For static-method: [openLine, closeLine] of the owning class body (1-based,
   * inclusive). Lets a caller tell an INTRA-class reference (→ can become
   * `private`) from an EXTRA-class same-file reference (→ `private` won't
   * compile; the fix is to inline the sibling wrapper, not narrow visibility).
   */
  ownerBody?: readonly [number, number];
}

const EXPORT_CLASS_RE = /^export\s+(?:abstract\s+)?class\s+([A-Za-z_]\w*)/;
const EXPORT_FUNCTION_RE = /^export\s+(?:async\s+)?function\s+([A-Za-z_]\w*)/;
const EXPORT_CONST_RE = /^export\s+const\s+([A-Za-z_]\w*)\s*[:=]/;
const EXPORT_TYPE_RE = /^export\s+(?:type|interface)\s+([A-Za-z_]\w*)/;
// Static method inside a class body: `  static foo(` / `  static async foo(`.
// Capture the access modifier so private/protected statics (internal helpers,
// never a cross-file "public surface") can be excluded from dead-symbol checks.
const STATIC_METHOD_RE =
  /^\s+(public\s+|private\s+|protected\s+)?static\s+(?:async\s+)?([A-Za-z_]\w*)\s*[(<]/;
const CLASS_OPEN_RE = /\bclass\s+([A-Za-z_]\w*)/;

/**
 * Extract exported symbols + static methods from one file's source.
 * `file` is the graph key for reporting.
 */
export function extractSymbols(file: string, source: string): SymbolDef[] {
  const out: SymbolDef[] = [];
  const lines = source.split("\n");
  let currentClass: string | null = null;
  let braceDepth = 0;
  let classBraceDepth = -1;
  let classOpenLine = -1;
  // Static-method symbols awaiting their owning class's close line, so we can
  // stamp each with the class body range once the `}` is seen.
  let pendingStatics: SymbolDef[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    const ln = i + 1;

    let m: RegExpExecArray | null;
    if ((m = EXPORT_CLASS_RE.exec(line)) && m[1]) {
      out.push({ name: m[1], kind: "class", file, line: ln });
    } else if ((m = EXPORT_FUNCTION_RE.exec(line)) && m[1]) {
      out.push({ name: m[1], kind: "function", file, line: ln });
    } else if ((m = EXPORT_CONST_RE.exec(line)) && m[1]) {
      out.push({ name: m[1], kind: "const", file, line: ln });
    } else if ((m = EXPORT_TYPE_RE.exec(line)) && m[1]) {
      out.push({ name: m[1], kind: "type", file, line: ln });
    }

    // Track class scope for static-method ownership.
    const classMatch = CLASS_OPEN_RE.exec(line);
    if (classMatch && classMatch[1] && line.includes("{")) {
      currentClass = classMatch[1];
      classBraceDepth = braceDepth;
      classOpenLine = ln;
    }
    if (currentClass) {
      const sm = STATIC_METHOD_RE.exec(line);
      const access = sm?.[1]?.trim();
      const methodName = sm?.[2];
      // Only PUBLIC (or unmarked) static methods are cross-file surface.
      // private/protected statics are internal helpers — never "dead public".
      if (
        methodName &&
        methodName !== "constructor" &&
        access !== "private" &&
        access !== "protected"
      ) {
        const sym: SymbolDef = {
          name: methodName,
          kind: "static-method",
          owner: currentClass,
          file,
          line: ln,
        };
        out.push(sym);
        pendingStatics.push(sym);
      }
    }

    // Crude brace tracking to know when a class body closes.
    for (const ch of line) {
      if (ch === "{") {
        braceDepth++;
      } else if (ch === "}") {
        braceDepth--;
        if (currentClass && braceDepth === classBraceDepth) {
          // Class body spans [classOpenLine, ln]. Stamp its static methods so a
          // consumer can distinguish intra-class from extra-class references.
          const body: readonly [number, number] = [classOpenLine, ln];
          for (const s of pendingStatics) {
            s.ownerBody = body;
          }
          pendingStatics = [];
          currentClass = null;
          classBraceDepth = -1;
          classOpenLine = -1;
        }
      }
    }
  }

  return out;
}

/**
 * Count usage references to a symbol across the whole corpus, excluding its own
 * declaring file. For static methods we look for `Owner.method` to avoid the huge
 * false-positive surface of a bare common method name.
 */
export interface UsageIndex {
  /** word → number of files that mention it (declaring file excluded per-query). */
  fileMentions: Map<string, Set<string>>;
  /** "Owner.method" → set of files that reference it. */
  memberMentions: Map<string, Set<string>>;
  /**
   * Class names reached DYNAMICALLY — pulled off a module object as
   * `<lowercaseVar>.ClassName` (e.g. `const mod = await import(...); mod.Foo`)
   * or destructured from one. Their static methods are then dispatched off the
   * loaded reference (`(await getX()).method()`) and NEVER appear as the static
   * `ClassName.method` string, so a member-mention scan would wrongly call them
   * dead. Any static method whose owner is here must be treated as reachable.
   */
  dynamicClassRefs: Set<string>;
  /** original identifier → every alias it's ever renamed to (`X as Y`). */
  aliasesOf: Map<string, Set<string>>;
}

const WORD_RE = /[A-Za-z_]\w*/g;
// Owner identifier may start lowercase too — some repository classes in this
// codebase are deliberately named like an instance (`contactClientRepository`,
// `cancelRepository`, `voteRepository`, `pathRepository`) even though they're
// exported classes with static methods. Requiring an uppercase first letter
// made every call site of such a class's static methods invisible to the
// usage index (`contactClientRepository.getSupportEmail(...)` never matched),
// so those methods always looked 100% dead regardless of real callers.
const MEMBER_RE = /([A-Za-z_]\w*)\.([A-Za-z_]\w*)/g;
// `<lowercaseVar>.ClassName` — a Capitalized member pulled off a lowercase
// module-like object. Distinct from MEMBER_RE (which keys ClassName.method).
const MODULE_MEMBER_RE = /\b([a-z_]\w*)\.([A-Z][A-Za-z0-9_]*)\b/g;
// `import { Owner as Alias } from "..."` — a renamed import. A caller then
// writes `Alias.method(...)`, which MEMBER_RE indexes under "Alias.method",
// never the declaring class's real "Owner.method" — so a static method whose
// only callers go through a renamed import always looked 100% dead. Scanning
// for the general `X as Y` shape (not scoped to import lines) is deliberately
// loose — a stray false alias only widens what counts as "used", it can never
// hide genuinely dead code, matching this tool's conservative bias.
const AS_ALIAS_RE = /\b([A-Za-z_]\w*)\s+as\s+([A-Za-z_]\w*)\b/g;

/** Build a corpus-wide usage index in one pass over file sources. */
export function buildUsageIndex(
  sources: ReadonlyMap<string, string>,
): UsageIndex {
  const fileMentions = new Map<string, Set<string>>();
  const memberMentions = new Map<string, Set<string>>();
  const dynamicClassRefs = new Set<string>();
  const aliasesOf = new Map<string, Set<string>>();

  for (const [file, src] of sources) {
    const seenWords = new Set<string>();
    let m: RegExpExecArray | null;
    WORD_RE.lastIndex = 0;
    while ((m = WORD_RE.exec(src)) !== null) {
      seenWords.add(m[0]);
    }
    for (const w of seenWords) {
      let set = fileMentions.get(w);
      if (!set) {
        set = new Set();
        fileMentions.set(w, set);
      }
      set.add(file);
    }

    MEMBER_RE.lastIndex = 0;
    while ((m = MEMBER_RE.exec(src)) !== null) {
      const key = `${m[1]}.${m[2]}`;
      let set = memberMentions.get(key);
      if (!set) {
        set = new Set();
        memberMentions.set(key, set);
      }
      set.add(file);
    }

    MODULE_MEMBER_RE.lastIndex = 0;
    while ((m = MODULE_MEMBER_RE.exec(src)) !== null) {
      // m[2] is a Capitalized identifier accessed off a lowercase var — treat
      // as a dynamically-reached class (e.g. `mod.CliResultFormatter`).
      dynamicClassRefs.add(m[2]);
    }

    AS_ALIAS_RE.lastIndex = 0;
    while ((m = AS_ALIAS_RE.exec(src)) !== null) {
      const original = m[1]!;
      const alias = m[2]!;
      let set = aliasesOf.get(original);
      if (!set) {
        set = new Set();
        aliasesOf.set(original, set);
      }
      set.add(alias);
    }
  }

  return { fileMentions, memberMentions, dynamicClassRefs, aliasesOf };
}

export interface SymbolUsage extends SymbolDef {
  /** Files referencing the symbol, excluding the declaring file. */
  usedInFiles: string[];
  usageCount: number;
}

/** Resolve usage for one symbol against the index. */
export function usageFor(sym: SymbolDef, index: UsageIndex): SymbolUsage {
  let files: Set<string> | undefined;
  if (sym.kind === "static-method" && sym.owner) {
    // A static method reached ONLY via a dynamically-loaded class reference
    // (`const mod = await import(...); mod.Owner.method()`) never writes the
    // literal `Owner.method`, so the member-mention scan sees zero uses. If the
    // owning class is referenced dynamically ANYWHERE, the method is reachable —
    // report the declaring file as a use so it is NOT flagged dead. This is the
    // static-method analogue of the namespace-import exclusion. (Prevents e.g.
    // CliResultFormatter.formatResult, dispatched via getResultFormatter(), from
    // being wrongly deleted.)
    if (index.dynamicClassRefs.has(sym.owner)) {
      return { ...sym, usedInFiles: [sym.file], usageCount: 1 };
    }
    files = index.memberMentions.get(`${sym.owner}.${sym.name}`);
    // A caller may reach the class through a renamed import
    // (`import { Owner as Alias } from "..."`, then `Alias.method(...)`) —
    // that call site is indexed under "Alias.method", never "Owner.method".
    // Union in every alias of this owner too.
    for (const alias of index.aliasesOf.get(sym.owner) ?? []) {
      const aliasFiles = index.memberMentions.get(`${alias}.${sym.name}`);
      if (aliasFiles) {
        files = files ? new Set([...files, ...aliasFiles]) : aliasFiles;
      }
    }
  } else {
    files = index.fileMentions.get(sym.name);
  }
  const usedInFiles = files
    ? [...files].filter((f) => f !== sym.file).toSorted()
    : [];
  return { ...sym, usedInFiles, usageCount: usedInFiles.length };
}
