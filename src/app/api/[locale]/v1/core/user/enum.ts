/**
 * User enums
 * Defines the enums used in the user module
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";

/**
 * Preferred contact method enum
 */
export const {
  enum: PreferredContactMethod,
  options: PreferredContactMethodOptions,
  Value: PreferredContactMethodValue,
} = createEnumOptions({
  EMAIL: "app.api.v1.core.user.contactMethods.email",
  PHONE: "app.api.v1.core.user.contactMethods.phone",
  SMS: "app.api.v1.core.user.contactMethods.sms",
  WHATSAPP: "app.api.v1.core.user.contactMethods.whatsapp",
});

// Create DB enum array for Drizzle
export const PreferredContactMethodDB = [
  PreferredContactMethod.EMAIL,
  PreferredContactMethod.PHONE,
  PreferredContactMethod.SMS,
  PreferredContactMethod.WHATSAPP,
] as const;

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

// Create DB enum array for Drizzle
export const LanguageDB = [Language.EN, Language.DE, Language.PL] as const;

/**
 * Timezone enum for user timezone preferences
 */
export const {
  enum: Timezone,
  options: TimezoneOptions,
  Value: TimezoneValue,
} = createEnumOptions({
  UTC: "app.api.v1.core.user.timezone.utc",
  AMERICA_NEW_YORK: "app.api.v1.core.user.timezone.america_new_york",
  AMERICA_LOS_ANGELES: "app.api.v1.core.user.timezone.america_los_angeles",
  EUROPE_LONDON: "app.api.v1.core.user.timezone.europe_london",
  EUROPE_BERLIN: "app.api.v1.core.user.timezone.europe_berlin",
  EUROPE_WARSAW: "app.api.v1.core.user.timezone.europe_warsaw",
  ASIA_TOKYO: "app.api.v1.core.user.timezone.asia_tokyo",
  AUSTRALIA_SYDNEY: "app.api.v1.core.user.timezone.australia_sydney",
});

// Create DB enum array for Drizzle
export const ThemeDB = [Theme.LIGHT, Theme.DARK, Theme.SYSTEM] as const;

export const ProfileVisibilityDB = [
  ProfileVisibility.PUBLIC,
  ProfileVisibility.PRIVATE,
  ProfileVisibility.CONTACTS_ONLY,
] as const;

export const UserDetailLevelDB = [
  UserDetailLevel.MINIMAL,
  UserDetailLevel.STANDARD,
  UserDetailLevel.COMPLETE,
] as const;

export const TimezoneDB = [
  Timezone.UTC,
  Timezone.AMERICA_NEW_YORK,
  Timezone.AMERICA_LOS_ANGELES,
  Timezone.EUROPE_LONDON,
  Timezone.EUROPE_BERLIN,
  Timezone.EUROPE_WARSAW,
  Timezone.ASIA_TOKYO,
  Timezone.AUSTRALIA_SYDNEY,
] as const;
