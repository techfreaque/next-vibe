/**
 * Generators setup — brings generated code up to date on install.
 *
 * A fresh clone (or one that skipped a `vibe gen` after pulling) otherwise runs
 * against whatever generated output happened to be committed. Running the
 * generators as part of setup makes "install" mean the tree is actually
 * consistent, not just that the binary exists.
 *
 * Runs first by luck of the sort order — the registry is keyed by file path, and
 * `core/…` sorts before `platforms/…`. That happens to be the order you want,
 * since every other setup reads generated code. It is not load-bearing: nothing
 * here depends on another setup having run.
 *
 * Discovered by the `setup-index` generator, which this generator run also
 * rewrites — safe because the registry is committed, so it always exists before
 * the import that reads it.
 */

import "server-only";

import chalk from "chalk";
import type { SetupResult } from "../setup/types";
import type { EndpointLogger } from "../../logger/types";

import { GeneratorRunner } from "./repository";

/** A label, not a sentence — it is printed after a tick. */
export const description = "generated code";

export async function install(logger: EndpointLogger): Promise<SetupResult> {
  // The gen-state cache asks whether the INPUTS changed — the wrong question
  // for setup, which runs precisely when the framework itself did. Updated emit
  // logic produces different output from identical inputs, and the cache would
  // call that unchanged and keep the old file. `vibe gen` stays cached for the
  // inner loop; setup rebuilds.
  const result = await GeneratorRunner.runGenerators({ logger, force: true });

  if (result.failed.length > 0) {
    return {
      changed: [],
      summary: `${result.failed.length} generator(s) failed`,
      failed: result.failed
        .map((entry) => `${entry.key}: ${entry.error}`)
        .join("; "),
    };
  }

  logger.info(
    `${chalk.green("✓")} ${description}\n    ${chalk.cyan(
      `${result.ran.length} generated, ${result.skipped.length} unchanged`,
    )}`,
  );

  return {
    changed: result.ran,
    summary: `${result.ran.length} generator(s) ran, ${result.skipped.length} unchanged`,
  };
}

/**
 * Deliberately a no-op.
 *
 * Generated code is committed source that the rest of the project imports —
 * deleting it would leave a tree that cannot typecheck or build. Uninstalling
 * the CLI must not do that. This is the one setup whose artifacts outlive it.
 */
export function uninstall(logger: EndpointLogger): Promise<SetupResult> {
  logger.info(
    `${chalk.dim("·")} ${chalk.dim(`${description} — kept (committed source)`)}`,
  );
  return Promise.resolve({
    changed: [],
    summary: "kept — generated code is committed source",
  });
}
