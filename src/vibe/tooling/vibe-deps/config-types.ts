/**
 * vibe-deps package-boundary configuration types.
 *
 * Declares the package roots and the legal dependency direction between them.
 * `vibe deps` uses this to detect:
 *   - out-of-package imports (a package file reaching into non-package app code)
 *   - cross-package imports that violate the declared `allow` direction
 *
 * The config lives at the repo root in `vibe-deps.config.ts` (loaded via
 * `require`, same convention as `check.config.ts`). When the file is absent the
 * repository falls back to a built-in default (see `repository.ts`).
 */

/** How loudly a class of violation is reported. */
export type VibeDepsSeverity = "off" | "warn" | "error";

/** Kinds of boundary violation the analyzer can surface. */
export type VibeDepsViolationKind =
  | "out-of-package" // package file imports non-package app code
  | "cross-package" // package imports another package it is not allowed to
  | "reverse-direction"; // a special case of cross-package: lower layer imports higher

/** A declared package and the source roots that belong to it. */
export interface VibeDepsPackage {
  /** Stable package name used in `allow` rules and report output. */
  name: string;
  /**
   * Project-root-relative posix prefixes owned by this package, e.g.
   * "src/vibe/ui/web". A file belongs to the package whose
   * longest matching root prefixes its graph key.
   */
  roots: ReadonlyArray<string>;
}

/**
 * Map of package name → the package names it is allowed to import.
 * Any cross-package edge not listed here is a violation. A package may always
 * import itself. Importing a package that allows nothing back, from one that is
 * higher in the layer order, is reported as `reverse-direction`.
 */
export type VibeDepsAllow = Readonly<Record<string, ReadonlyArray<string>>>;

export interface VibeDepsConfig {
  /** Declared packages, in layer order (lowest/most-foundational first). */
  packages: ReadonlyArray<VibeDepsPackage>;
  /** Legal cross-package import direction. */
  allow: VibeDepsAllow;
  /** Per-kind severity. `off` excludes that kind from violation reports. */
  severity: Readonly<Record<VibeDepsViolationKind, VibeDepsSeverity>>;
  /**
   * Path prefixes (src-relative posix) whose files are settled and should NOT be
   * flagged for relocation. These files still count as importers of others — an
   * ignored file reaching a candidate still contributes to that candidate's
   * usage/spread — they're just never themselves proposed to move. Use for areas
   * already in their correct home (e.g. the web UI primitive lib).
   */
  ignore?: ReadonlyArray<string>;
}
