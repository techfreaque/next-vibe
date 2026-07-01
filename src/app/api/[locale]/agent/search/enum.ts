/**
 * Search Provider Enum
 * Defines available web search providers
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

/**
 * Search provider selection
 */
export const {
  enum: SearchProvider,
  options: SearchProviderOptions,
  Value: SearchProviderValue,
} = createEnumOptions(scopedTranslation, {
  AUTO: "enums.provider.AUTO",
  BRAVE: "enums.provider.BRAVE",
  KAGI: "enums.provider.KAGI",
} as const);

export type SearchProviderValue = typeof SearchProviderValue;

export const SearchProviderDB = [
  SearchProvider.AUTO,
  SearchProvider.BRAVE,
  SearchProvider.KAGI,
] as const;
