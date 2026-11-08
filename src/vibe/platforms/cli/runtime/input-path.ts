import { existsSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";

/**
 * The directory the CLI was invoked from, captured at load - before the
 * runtime can chdir to the project root.
 */
const INVOCATION_DIR = process.cwd();

/**
 * Resolve a file the user named on the command line.
 *
 * Explicit paths are project-root relative (the runtime may chdir there), which
 * silently misses a file that sits next to the shell. A relative path that does
 * not exist under the project root is therefore tried against the directory the
 * CLI was invoked from. Returns the absolute path either way, so a caller can
 * name it in its error.
 */
export function resolveInputPath(
  path: string,
  invocationDir: string = INVOCATION_DIR,
  projectRoot: string = process.cwd(),
): string {
  const fromRoot = resolve(projectRoot, path);
  if (isAbsolute(path) || existsSync(fromRoot)) {
    return fromRoot;
  }
  const fromInvocation = resolve(invocationDir, path);
  return existsSync(fromInvocation) ? fromInvocation : fromRoot;
}
