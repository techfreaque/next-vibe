/**
 * User enums
 * Defines the enums used in the user module
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * Theme enum using createEnumOptions pattern
 */
export const {
  enum: Theme,
  options: ThemeOptions,
  Value: ThemeValue,
} = createEnumOptions(scopedTranslation, {
  LIGHT: "theme.light",
  DARK: "theme.dark",
  SYSTEM: "theme.system",
});

/**
 * Profile visibility enum and options
 */
export const {
  enum: ProfileVisibility,
  options: ProfileVisibilityOptions,
  Value: ProfileVisibilityValue,
} = createEnumOptions(scopedTranslation, {
  PUBLIC: "profileVisibility.public",
  PRIVATE: "profileVisibility.private",
  CONTACTS_ONLY: "profileVisibility.contactsOnly",
});

/**
 * User detail level enum and options
 */
export const {
  enum: UserDetailLevel,
  options: UserDetailLevelOptions,
  Value: UserDetailLevelValue,
} = createEnumOptions(scopedTranslation, {
  MINIMAL: "userDetailLevel.minimal",
  STANDARD: "userDetailLevel.standard",
  COMPLETE: "userDetailLevel.complete",
});

/**
 * Language enum for user language preferences
 */
export const {
  enum: Language,
  options: LanguageOptions,
  Value: LanguageValue,
} = createEnumOptions(scopedTranslation, {
  EN: "language.en",
  DE: "language.de",
  PL: "language.pl",
});

export const UserDetailLevelDB = [
  UserDetailLevel.MINIMAL,
  UserDetailLevel.STANDARD,
  UserDetailLevel.COMPLETE,
] as const;
