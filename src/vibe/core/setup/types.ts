/**
 * The `setup.ts` contract.
 *
 * A module owning machine-local, generated-at-install artifacts declares a
 * `setup.ts` beside its code. The setup command runs every `install()`;
 * uninstall runs every `uninstall()`. See docs/patterns/setup.md.
 */

import type { EndpointLogger } from "../../logger/types";

/**
 * Filenames that declare a setup module: `setup.ts`, or `<name>.setup.ts`.
 *
 * The named form exists because the plain one allows exactly one setup per
 * directory, which forces a module that owns two unrelated artifacts to either
 * merge them into a single install() or invent a subdirectory to hold the second
 * file. `<name>.setup.ts` lets them sit beside the code they belong to and keeps
 * `<name>` in the registry key, so setup output still says which is which.
 */
const SETUP_FILE_RE = /^(?:[\w.-]+\.)?setup\.ts$/;

/** True for a filename following the setup convention. Basename only. */
export function isSetupFile(filename: string): boolean {
  return SETUP_FILE_RE.test(filename);
}

/**
 * Registry key for a setup file, given its project-root-relative path.
 *
 * `a/b/setup.ts` → `a/b` (the owning module), and `a/b/x.setup.ts` → `a/b/x`, so
 * two setups in one directory stay distinct.
 */
export function setupKeyFor(relPath: string): string {
  return relPath.replace(/\/setup\.ts$/, "").replace(/\.setup\.ts$/, "");
}

/** What a setup reports back after doing its work. */
export interface SetupResult {
  /** Absolute paths created, rewritten, or removed. Empty is a valid no-op. */
  changed: string[];
  /** One line for the CLI, e.g. "wrote 3 MCP config file(s)". */
  summary: string;
  /**
   * Set to a message when the setup hard-failed. The runner surfaces it as a
   * failed entry and carries on with the rest.
   *
   * Mirrors `GeneratorResult.failed`, and for the same reason: this codebase
   * does not throw (`restricted-syntax` enforces it), so a setup reports failure
   * by returning it. Nothing here is an endpoint, so there is no `ResponseType`
   * either — the endpoint in core/setup/install is what turns these into one.
   */
  failed?: string;
}

/**
 * The endpoint's logger, handed down so a setup narrates through the same sink
 * as everything else — `debug()` for the per-file detail that only matters when
 * something went wrong, `info()`/`vibe()` for what the user should see.
 *
 * It is the only parameter. A setup resolves everything else from the project
 * root itself, so there is no context to thread and nothing for a caller to get
 * wrong.
 */
type SetupFn = (logger: EndpointLogger) => Promise<SetupResult>;

/**
 * The shape every `setup.ts` must satisfy.
 *
 * Structural only — not exported. docs/patterns/setup.md has authors write plain
 * `install`/`uninstall` functions returning `SetupResult`; the module is matched
 * by shape, never by annotation. `SetupEntry` below is the exported surface.
 */
interface SetupModule {
  /**
   * Shown in setup output to say what this setup owns. A label, not a sentence.
   */
  description: string;
  install: SetupFn;
  uninstall: SetupFn;
}

/** One discovered `setup.ts`, as emitted by the `setup-index` generator. */
export interface SetupEntry extends SetupModule {
  /** Module path relative to the project root, e.g. "src/vibe/platforms/mcp". */
  key: string;
}
