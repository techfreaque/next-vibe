/**
 * Simple config stub to avoid module resolution issues
 */

export interface CliConfig {
  apiBaseDir: string;
}

export function getConfig(): CliConfig {
  return {
    apiBaseDir: "src/app/api/[locale]",
  };
}
