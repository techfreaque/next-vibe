/**
 * User enums
 * Defines the enums used in the user module
 */

import { createEnumOptions } from "../../unified-ui/_shared/enum";

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

/**
 * User Note Type enum for CRM activity log
 */
export const {
  enum: UserNoteType,
  options: UserNoteTypeOptions,
  Value: UserNoteTypeValue,
} = createEnumOptions(scopedTranslation, {
  NOTE: "userNoteType.note",
  CALL: "userNoteType.call",
  EMAIL: "userNoteType.email",
  MEETING: "userNoteType.meeting",
  TASK: "userNoteType.task",
});

export const UserNoteTypeDB = [
  UserNoteType.NOTE,
  UserNoteType.CALL,
  UserNoteType.EMAIL,
  UserNoteType.MEETING,
  UserNoteType.TASK,
] as const;
