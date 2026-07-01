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
}

const EXPORT_CLASS_RE = /^export\s+(?:abstract\s+)?class\s+([A-Za-z_]\w*)/;
const EXPORT_FUNCTION_RE = /^export\s+(?:async\s+)?function\s+([A-Za-z_]\w*)/;
const EXPORT_CONST_RE = /^export\s+const\s+([A-Za-z_]\w*)\s*[:=]/;
const EXPORT_TYPE_RE = /^export\s+(?:type|interface)\s+([A-Za-z_]\w*)/;
// Static method inside a class body: `  static foo(` / `  static async foo(`
const STATIC_METHOD_RE =
  /^\s+(?:public\s+|private\s+|protected\s+)?static\s+(?:async\s+)?([A-Za-z_]\w*)\s*[(<]/;
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
    }
    if (currentClass) {
      const sm = STATIC_METHOD_RE.exec(line);
      if (sm && sm[1] && sm[1] !== "constructor") {
        out.push({
          name: sm[1],
          kind: "static-method",
          owner: currentClass,
          file,
          line: ln,
        });
      }
    }

    // Crude brace tracking to know when a class body closes.
    for (const ch of line) {
      if (ch === "{") {
        braceDepth++;
      } else if (ch === "}") {
        braceDepth--;
        if (currentClass && braceDepth === classBraceDepth) {
          currentClass = null;
          classBraceDepth = -1;
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
}

const WORD_RE = /[A-Za-z_]\w*/g;
const MEMBER_RE = /([A-Z][A-Za-z0-9_]*)\.([A-Za-z_]\w*)/g;

/** Build a corpus-wide usage index in one pass over file sources. */
export function buildUsageIndex(
  sources: ReadonlyMap<string, string>,
): UsageIndex {
  const fileMentions = new Map<string, Set<string>>();
  const memberMentions = new Map<string, Set<string>>();

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
  }

  return { fileMentions, memberMentions };
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
    files = index.memberMentions.get(`${sym.owner}.${sym.name}`);
  } else {
    files = index.fileMentions.get(sym.name);
  }
  const usedInFiles = files
    ? [...files].filter((f) => f !== sym.file).toSorted()
    : [];
  return { ...sym, usedInFiles, usageCount: usedInFiles.length };
}
