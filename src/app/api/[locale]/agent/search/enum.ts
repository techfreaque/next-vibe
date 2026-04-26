/**
 * Search Provider Enum
 * Defines available web search providers
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * Search provider selection
 */
export const {
  enum: SearchProvider,
  options: SearchProviderOptions,
  Value: SearchProviderValue,
} = createEnumOptions(scopedTranslation, {
  BRAVE: "enums.provider.BRAVE",
  KAGI: "enums.provider.KAGI",
} as const);

export type SearchProviderValue = typeof SearchProviderValue;

export const SearchProviderDB = [
  SearchProvider.BRAVE,
  SearchProvider.KAGI,
] as const;
