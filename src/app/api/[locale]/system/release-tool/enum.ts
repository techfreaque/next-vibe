/**
 * Release Tool Enums
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

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
