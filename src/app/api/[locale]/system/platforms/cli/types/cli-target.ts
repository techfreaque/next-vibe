/**
 * CLI Execution Target
 *
 * Distinguishes the three execution contexts for CLI commands:
 * - DEV:    Atlas dev instance (port 5432, `vibe dev`, no flags)
 * - LOCAL:  Hermes instance (port 5433, `vibe start` / `--hermes`)
 * - REMOTE: Thea prod instance via HTTP (`--thea`)
 */

export const CliTarget = {
  /** Atlas dev instance - default DB port, no flags */
  DEV: "atlas",
  /** Hermes instance - preview DB port, `vibe start` / `--hermes` */
  LOCAL: "hermes",
  /** Thea prod instance via HTTP - `--thea` */
  REMOTE: "thea",
} as const;

export type CliTargetValue = (typeof CliTarget)[keyof typeof CliTarget];
