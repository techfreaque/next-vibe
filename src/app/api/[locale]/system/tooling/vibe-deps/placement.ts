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

/**
 * A `src/generated/` file is DERIVED OUTPUT — the framework re-emits the imports
 * of convention-scanned files (route.ts / definition.ts / task.ts / seed.ts …)
 * into registries there. Those edges aren't AUTHORED dependencies: a route.ts is
 * not "used by src/generated", it is *discovered by location* and its handler
 * copied into the generated registry. So a generated importer must NOT decide
 * where a file "belongs" — otherwise every route.ts looks like it should
 * "colocate into src/generated" (nonsense: you can't move source into generated,
 * and the generator scans it in place). Filtered out of the consumer set below,
 * exactly like the tool's own files. Not a whitelist — a structural fact about
 * generated output.
 */
export function isGeneratedImporter(key: string): boolean {
  return key.includes("/generated/") || key.startsWith("src/generated/");
}

/**
 * `src/app` files (Next.js page.tsx / layout.tsx / loading.tsx) are the UI
 * *presentation* layer — they naturally consume API domains but are NOT a peer
 * API domain themselves. Counting them as a separate domain inflates promote
 * signals: e.g. `user/repository.ts` imported by `agent/` + `src/app/[locale]/`
 * would appear to span 3 domains and get flagged "promote into system/" even
 * though the page is just rendering the response. Filtered from domain-spread
 * calculations, same reasoning as isGeneratedImporter.
 */
export function isUiPageImporter(key: string): boolean {
  return (
    key.startsWith("src/app/") &&
    !key.startsWith("src/app/api/") &&
    !key.startsWith("src/app/packages/")
  );
}

/** Is this key inside the system/ (framework) scope? */
export function isInSystem(key: string): boolean {
  return key.startsWith(SYSTEM_ROOT);
}

/**
 * Domain of a file = its owning root segment.
 *
 * `system/` is treated as a ROOT, so each sub-area is its own domain:
 *   system/realtime  ≠  system/database  ≠  system/platforms  etc.
 *
 *   - system/ files:      `system/<area>`  (first segment inside system/)
 *   - other locale files: `<domain>`       (first segment after [locale]/)
 *   - non-locale files:   first two path segments (e.g. `src/config`)
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

/**
 * Parent domain for promote decisions — same as domainOf().
 *
 * Now that system/ is treated as a root (each sub-area is its own domain),
 * there is no coarser bucket needed: `system/realtime` and `system/database`
 * are distinct domains, just like `agent` and `leads` are distinct.
 *
 * A file is a promote/misplaced candidate iff its importers span ≥2 distinct
 * domains from this function, which now fires correctly for intra-system
 * cross-area coupling too.
 */
export function parentDomainOf(key: string): string {
  return domainOf(key);
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
  /** True when the file is already in system/ (a framework primitive in place). */
  alreadyVibe: boolean;
  /** Sorted list of parent domains that import this file. */
  importerDomainList: string[];
  /** The actual importer files (filtered — no generated, no self). */
  usableImporters: string[];
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
  // Drop the tool's own files, generated re-emitters, and Next.js UI page/layout
  // files (see isGeneratedImporter, isUiPageImporter) — none of these are
  // authored API consumers that should pull the file toward them.
  const usable = importers.filter(
    (i) => !isSelf(i) && !isGeneratedImporter(i) && !isUiPageImporter(i),
  );
  const sortedUsable = [...usable].toSorted();

  if (usable.length === 0) {
    return {
      kind: "unused",
      suggestedDir: null,
      note: "no importers — dead file or entrypoint",
      domainSpread: 0,
      alreadyVibe: isInSystem(key),
      importerDomainList: [],
      usableImporters: [],
    };
  }

  const importerDomains = new Set(usable.map(domainOf));
  const domainSpread = importerDomains.size;
  const fileDir = dirOf(key);
  const importerParentDomains = new Set(usable.map(parentDomainOf));
  const importerDomainList = [...importerParentDomains].toSorted();

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
          alreadyVibe: isInSystem(key),
          importerDomainList,
          usableImporters: sortedUsable,
        };
      }
    } else if (!wouldLeaveSystem) {
      return {
        kind: "colocate",
        suggestedDir: shared,
        note: `used only under ${shared}`,
        domainSpread,
        alreadyVibe: isInSystem(key),
        importerDomainList,
        usableImporters: sortedUsable,
      };
    }
  }

  // Signal 2: cross-domain sharing. Reached from multiple PARENT domains → promote
  // candidate. We use parentDomainOf() here — not domainOf() — so that:
  //   • all system/<area> sub-areas collapse to "system" (siblings, not separate domains)
  //   • a definition used only within remote-connection/* stays in-place
  // Only when importers span 2+ distinct parent domains is promote warranted.
  const fileParentDomain = parentDomainOf(key);
  const parentDomainSpread = importerParentDomains.size;

  if (parentDomainSpread > 1) {
    const alreadyVibe = isInSystem(key);
    return {
      kind: "promote",
      suggestedDir: alreadyVibe ? fileDir : "src/app/api/[locale]/system",
      note: alreadyVibe
        ? `wide coupling across ${String(parentDomainSpread)} domains`
        : `used by ${String(parentDomainSpread)} domains from ${fileParentDomain} — promote into system`,
      domainSpread,
      alreadyVibe,
      importerDomainList,
      usableImporters: sortedUsable,
    };
  }

  return {
    kind: "in-place",
    suggestedDir: fileDir,
    note: "single-domain, colocated",
    domainSpread,
    alreadyVibe: isInSystem(key),
    importerDomainList,
    usableImporters: sortedUsable,
  };
}
