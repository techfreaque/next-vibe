/**
 * User enums
 * Defines the enums used in the user module
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

/**
 * Theme enum using createEnumOptions pattern
 */
export const {
  enum: Theme,
  options: ThemeOptions,
  Value: ThemeValue,
} = createEnumOptions({
  LIGHT: "app.api.user.theme.light",
  DARK: "app.api.user.theme.dark",
  SYSTEM: "app.api.user.theme.system",
});

/**
 * Profile visibility enum and options
 */
export const {
  enum: ProfileVisibility,
  options: ProfileVisibilityOptions,
  Value: ProfileVisibilityValue,
} = createEnumOptions({
  PUBLIC: "app.api.user.profileVisibility.public",
  PRIVATE: "app.api.user.profileVisibility.private",
  CONTACTS_ONLY: "app.api.user.profileVisibility.contactsOnly",
});

/**
 * User detail level enum and options
 */
export const {
  enum: UserDetailLevel,
  options: UserDetailLevelOptions,
  Value: UserDetailLevelValue,
} = createEnumOptions({
  MINIMAL: "app.api.user.userDetailLevel.minimal",
  STANDARD: "app.api.user.userDetailLevel.standard",
  COMPLETE: "app.api.user.userDetailLevel.complete",
});

/**
 * Language enum for user language preferences
 */
export const {
  enum: Language,
  options: LanguageOptions,
  Value: LanguageValue,
} = createEnumOptions({
  EN: "app.api.user.language.en",
  DE: "app.api.user.language.de",
  PL: "app.api.user.language.pl",
});

export const UserDetailLevelDB = [
  UserDetailLevel.MINIMAL,
  UserDetailLevel.STANDARD,
  UserDetailLevel.COMPLETE,
] as const;
