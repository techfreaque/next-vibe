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
 * Name of the CLI: the globally installed binary, the directory it is installed
 * into, and the name the CLI reports in its own help output.
 *
 * Forks that vendor this framework alongside the original override the value so
 * both can sit on one machine without either overwriting the other's global
 * binary.
 */
export const CLI_BINARY_NAME = "vibe" as const;
