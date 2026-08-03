/**
 * CLI Execution Target
 *
 * Distinguishes the three execution contexts for CLI commands:
 * - DEV:    Atlas dev instance (port 5432, `vibe dev`, no flags)
 * - LOCAL:  Hermes instance (port 5433, `vibe start` / `--hermes`)
 * - REMOTE: Remote instance via HTTP (`--remote [instanceId]`)
 */

export const CliTarget = {
  /** Atlas dev instance - default DB port, no flags */
  DEV: "atlas",
  /** Hermes instance - preview DB port, `vibe start` / `--hermes` */
  LOCAL: "hermes",
  /** Execute on a remote instance looked up by instanceId from the active DB's remote_connections */
  REMOTE: "remote",
} as const;

export type CliTargetValue = (typeof CliTarget)[keyof typeof CliTarget];

/**
 * Names of the CLI: every alias installed as a globally available binary.
 * The first entry is the default — the name used for the install directory,
 * the CLI's own help/usage output, and every hint printed in code.
 *
 * Forks that vendor this framework alongside the original override the array
 * so both can sit on one machine without either overwriting the other's
 * global binary.
 */
export const CLI_BINARY_NAMES = ["vibe", "v"] as const;

export type CliBinaryName = (typeof CLI_BINARY_NAMES)[number];

/** The default alias — used for hints, usage strings, and the install directory name. */
export const CLI_BINARY_NAME: CliBinaryName = CLI_BINARY_NAMES[0];
