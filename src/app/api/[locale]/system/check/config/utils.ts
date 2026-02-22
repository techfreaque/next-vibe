/**
 * Check Configuration Utilities
 *
 * Shared utilities for code quality configuration:
 * - Ignore pattern conversion (oxlint vs eslint format)
 * - ESLint stub creation for oxlint-handled rules
 */

// ============================================================
// Types
// ============================================================

/** ESLint stub plugin structure */
export interface EslintStubPlugin {
  rules: Record<
    string,
    {
      create: () => Record<string, never>;
      meta: { docs: { description: string } };
    }
  >;
}

/** Ignore pattern formats */
export interface IgnoreFormats {
  /** Raw patterns for oxlint (directories, files, globs) */
  oxlintIgnores: string[];
  /** Glob patterns for ESLint flat config */
  eslintIgnores: string[];
}
