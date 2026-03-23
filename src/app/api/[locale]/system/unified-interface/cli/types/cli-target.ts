/**
 * CLI Execution Target
 *
 * Distinguishes the three execution contexts for CLI commands:
 * - DEV:    Raw development (port 5432, `vibe dev`)
 * - LOCAL:  Preview / daily driver (port 5433, `vibe start` / `--target local`)
 * - REMOTE: Production/staging via HTTP (`--target remote`)
 */

export const CliTarget = {
  /** Raw development - default DB port, no preview mode */
  DEV: "dev",
  /** Preview / daily driver - preview DB port, `vibe start` / `--target local` */
  LOCAL: "local",
  /** Remote host via HTTP - `--target remote` */
  REMOTE: "remote",
} as const;

export type CliTargetValue = (typeof CliTarget)[keyof typeof CliTarget];
