/**
 * User enums
 * Defines the enums used in the user module
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";

/**
 * Theme enum using createEnumOptions pattern
 */
export const {
  enum: Theme,
  options: ThemeOptions,
  Value: ThemeValue,
} = createEnumOptions({
  LIGHT: "app.api.v1.core.user.theme.light",
  DARK: "app.api.v1.core.user.theme.dark",
  SYSTEM: "app.api.v1.core.user.theme.system",
});

/**
 * Profile visibility enum and options
 */
export const {
  enum: ProfileVisibility,
  options: ProfileVisibilityOptions,
  Value: ProfileVisibilityValue,
} = createEnumOptions({
  PUBLIC: "app.api.v1.core.user.profileVisibility.public",
  PRIVATE: "app.api.v1.core.user.profileVisibility.private",
  CONTACTS_ONLY: "app.api.v1.core.user.profileVisibility.contactsOnly",
});

/**
 * User detail level enum and options
 */
export const {
  enum: UserDetailLevel,
  options: UserDetailLevelOptions,
  Value: UserDetailLevelValue,
} = createEnumOptions({
  MINIMAL: "app.api.v1.core.user.userDetailLevel.minimal",
  STANDARD: "app.api.v1.core.user.userDetailLevel.standard",
  COMPLETE: "app.api.v1.core.user.userDetailLevel.complete",
});

/**
 * Language enum for user language preferences
 */
export const {
  enum: Language,
  options: LanguageOptions,
  Value: LanguageValue,
} = createEnumOptions({
  EN: "app.api.v1.core.user.language.en",
  DE: "app.api.v1.core.user.language.de",
  PL: "app.api.v1.core.user.language.pl",
});

export const UserDetailLevelDB = [
  UserDetailLevel.MINIMAL,
  UserDetailLevel.STANDARD,
  UserDetailLevel.COMPLETE,
] as const;
