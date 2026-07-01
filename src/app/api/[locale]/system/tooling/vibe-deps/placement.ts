import "server-only";

/**
 * Placement model for `vibe deps`.
 *
 * GOVERNING RULE (Max): `vibe deps` is a TODO LIST — it NEVER blanket-ignores,
 * and it carries NO hand-maintained whitelist. Every verdict is COMPUTED from the
 * import graph, so it can't drift out of sync with the codebase.
 *
 * Two signals drive relocation:
 *
 *   1. Single-folder ownership (colocation). A file whose importers all live
 *      under ONE directory, yet the file itself lives somewhere else, belongs
 *      next to those importers. "Position should be where it's imported."
 *
 *   2. Cross-domain sharing (promote-to-vibe). A file reached from MULTIPLE
 *      top-level domains is shared code; the more domains reach it, the stronger
 *      the signal it should become a framework primitive under system/ (vibe).
 *
 * The only skip is the tool's own files (analysing itself is noise).
 */

/** Top-level src prefix that maps to the vibe framework folder. */
export const SYSTEM_ROOT = "src/app/api/[locale]/system/";

/** The locale-root that holds domains + system. */
export const LOCALE_ROOT = "src/app/api/[locale]/";

/** The tool's own files — the one true skip. */
export const SELF_ROOT = "src/app/api/[locale]/system/tooling/vibe-deps/";

/** The tool's own files — the single legitimate skip. */
export function isSelf(key: string): boolean {
  return key.startsWith(SELF_ROOT);
}

/** Is this key inside the system/ (framework) scope? */
export function isInSystem(key: string): boolean {
  return key.startsWith(SYSTEM_ROOT);
}

/**
 * Domain of a file = its owning top-level segment.
 *   - locale files: the first segment after [locale]/ (e.g. "agent", "system").
 *     Inside system/, the domain is "system/<area>" so framework areas don't all
 *     collapse into one bucket.
 *   - non-locale files: the first two path segments (e.g. "src/config").
 */
export function domainOf(key: string): string {
  if (key.startsWith(SYSTEM_ROOT)) {
    const rel = key.slice(SYSTEM_ROOT.length);
    return `system/${rel.split("/")[0] ?? rel}`;
  }
  if (key.startsWith(LOCALE_ROOT)) {
    const rel = key.slice(LOCALE_ROOT.length);
    return rel.split("/")[0] ?? rel;
  }
  const parts = key.split("/");
  return parts.slice(0, 2).join("/");
}

/** Directory of a file key (posix), no trailing slash. */
export function dirOf(key: string): string {
  const i = key.lastIndexOf("/");
  return i === -1 ? "" : key.slice(0, i);
}

/** True when `dir` is `file`'s directory or an ancestor of it. */
export function dirContains(dir: string, file: string): boolean {
  return file === dir || file.startsWith(`${dir}/`);
}

/**
 * Deepest directory that contains ALL of `files`. Empty string when they share
 * no common prefix (only "src" or nothing).
 */
export function commonDir(files: ReadonlyArray<string>): string {
  if (files.length === 0) {
    return "";
  }
  let parts = dirOf(files[0]!).split("/");
  for (const f of files.slice(1)) {
    const fp = dirOf(f).split("/");
    let i = 0;
    while (i < parts.length && i < fp.length && parts[i] === fp[i]) {
      i++;
    }
    parts = parts.slice(0, i);
    if (parts.length === 0) {
      return "";
    }
  }
  return parts.join("/");
}

/**
 * The architectural KIND of a file, inferred from its basename. Endpoints follow
 * a fixed vocabulary (definition/repository/route/widget/i18n/…), so a file's
 * basename tells us what layer it belongs to — and the mix of kinds that IMPORT
 * a file tells us what that file is "for".
 */
export type FileKind =
  | "route"
  | "repository"
  | "definition"
  | "widget"
  | "hooks"
  | "i18n"
  | "enum"
  | "types"
  | "constants"
  | "test"
  | "util"
  | "other";

/** Classify a file by basename into an architectural kind. */
export function fileKind(key: string): FileKind {
  const base = key.slice(key.lastIndexOf("/") + 1).replace(/\.(ts|tsx)$/, "");
  if (base.endsWith(".test") || base.endsWith(".spec")) {
    return "test";
  }
  if (base === "route" || base.startsWith("route.")) {
    return "route";
  }
  if (base === "repository" || base.startsWith("repository.")) {
    return "repository";
  }
  if (base === "definition" || base.startsWith("definition.")) {
    return "definition";
  }
  if (base === "widget" || base.startsWith("widget.")) {
    return "widget";
  }
  if (
    base === "hooks" ||
    base.startsWith("hooks.") ||
    base.startsWith("use-")
  ) {
    return "hooks";
  }
  if (key.includes("/i18n/") || base === "i18n") {
    return "i18n";
  }
  if (base === "enum" || base.endsWith("-enum") || base === "enums") {
    return "enum";
  }
  if (base === "types" || base.endsWith("-types") || base.endsWith(".types")) {
    return "types";
  }
  if (base === "constants" || base.endsWith("-constants")) {
    return "constants";
  }
  return base.includes("util") || key.includes("/utils/") ? "util" : "other";
}

/**
 * The layer a file most likely BELONGS to, inferred from what imports it. If a
 * file is imported mostly by route.ts files it's route-related; by widget.tsx →
 * unified-ui; by definition.ts → definition layer; etc. Returns the dominant
 * importer kind plus a per-kind tally for display.
 */
export interface UsageProfile {
  /** kind → how many importers of that kind. */
  byKind: Record<FileKind, number>;
  /** The single most common importer kind (the "used-by" signal). */
  dominant: FileKind;
  /** Human label for where it's used, e.g. "route+repository". */
  usedByLabel: string;
}

export function usageProfile(importers: ReadonlyArray<string>): UsageProfile {
  const byKind = {} as Record<FileKind, number>;
  for (const imp of importers) {
    const k = fileKind(imp);
    byKind[k] = (byKind[k] ?? 0) + 1;
  }
  const ranked = (Object.entries(byKind) as Array<[FileKind, number]>).toSorted(
    (a, b) => b[1] - a[1],
  );
  const dominant = ranked[0]?.[0] ?? "other";
  const usedByLabel =
    ranked
      .slice(0, 3)
      .filter(([, n]) => n > 0)
      .map(([k, n]) => `${k}:${String(n)}`)
      .join(" ") || "none";
  return { byKind, dominant, usedByLabel };
}

/** Per-file relocation verdict, fully computed from the graph. */
export interface PlacementVerdict {
  /** What kind of relocation signal, if any. */
  kind: "colocate" | "promote" | "unused" | "in-place";
  /** Suggested destination directory (colocate) or scope note (promote). */
  suggestedDir: string | null;
  /** Human note for the report. */
  note: string;
  /** How many distinct domains import this file (breadth of sharing). */
  domainSpread: number;
}

/**
 * Classify a file purely from its importer set.
 *
 * @param key         the file being judged (graph key)
 * @param importers   files that import it (graph keys)
 */
export function placementOf(
  key: string,
  importers: ReadonlyArray<string>,
): PlacementVerdict {
  const usable = importers.filter((i) => !isSelf(i));

  if (usable.length === 0) {
    return {
      kind: "unused",
      suggestedDir: null,
      note: "no importers — dead file or entrypoint",
      domainSpread: 0,
    };
  }

  const importerDomains = new Set(usable.map(domainOf));
  const domainSpread = importerDomains.size;
  const fileDir = dirOf(key);

  // Signal 1: single-folder ownership. All importers under one dir → the file
  // belongs under that dir. If it already lives there, it's in place.
  //
  // Guard: never colocate a framework (system/) file OUT into a domain. A system
  // file used only by one domain is a coupling smell, but the fix is to decouple
  // the domain, not to drag framework code into it — so it stays in-place here
  // and surfaces via cross-domain instead.
  const shared = commonDir(usable);
  if (shared && shared !== "src") {
    const wouldLeaveSystem = isInSystem(key) && !isInSystem(`${shared}/x`);
    if (dirContains(shared, key)) {
      // Already colocated under (or at) the sole consumer folder.
      if (domainSpread === 1) {
        return {
          kind: "in-place",
          suggestedDir: fileDir,
          note: "colocated with its only consumer folder",
          domainSpread,
        };
      }
    } else if (!wouldLeaveSystem) {
      return {
        kind: "colocate",
        suggestedDir: shared,
        note: `used only under ${shared} — move next to consumers`,
        domainSpread,
      };
    }
  }

  // Signal 2: cross-domain sharing. Reached from >1 domain → promote candidate.
  if (domainSpread > 1) {
    const fileDomain = domainOf(key);
    const alreadyVibe = isInSystem(key);
    return {
      kind: "promote",
      suggestedDir: alreadyVibe ? fileDir : "src/app/api/[locale]/system",
      note: alreadyVibe
        ? `shared across ${String(domainSpread)} domains (framework primitive)`
        : `shared across ${String(domainSpread)} domains from ${fileDomain} — promote into vibe`,
      domainSpread,
    };
  }

  return {
    kind: "in-place",
    suggestedDir: fileDir,
    note: "single-domain, colocated",
    domainSpread,
  };
}
