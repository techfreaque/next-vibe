/**
 * Release Tool Enums
 */

import { scopedTranslation } from "next-vibe/tooling/release/i18n";
import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

/**
 * Package manager display enum (for UI dropdowns / labels)
 * Use `PackageManager` from `./definition` for runtime values.
 */
export const {
  enum: PackageManagerDisplay,
  options: PackageManagerDisplayOptions,
} = createEnumOptions(scopedTranslation, {
  BUN: "enums.packageManager.bun",
  NPM: "enums.packageManager.npm",
  YARN: "enums.packageManager.yarn",
  PNPM: "enums.packageManager.pnpm",
  DENO: "enums.packageManager.deno",
} as const);
