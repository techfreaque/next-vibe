/**
 * Skill Import Enums
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

/** Platforms a character can be imported from. */
export const {
  enum: SkillImportPlatform,
  options: SkillImportPlatformOptions,
  Value: SkillImportPlatformValue,
} = createEnumOptions(scopedTranslation, {
  CHARACTER_AI: "enums.platform.characterAi",
  TALKIE: "enums.platform.talkie",
});

export const SkillImportPlatformDB = [
  SkillImportPlatform.CHARACTER_AI,
  SkillImportPlatform.TALKIE,
] as const;

/**
 * Visibility of the imported character. Maps onto the existing skill
 * publishing states: PRIVATE = DRAFT, UNLISTED = UNLISTED, PUBLIC = PUBLISHED.
 */
export const {
  enum: SkillImportVisibility,
  options: SkillImportVisibilityOptions,
  Value: SkillImportVisibilityValue,
} = createEnumOptions(scopedTranslation, {
  PRIVATE: "enums.visibility.private",
  UNLISTED: "enums.visibility.unlisted",
  PUBLIC: "enums.visibility.public",
});

export const SkillImportVisibilityDB = [
  SkillImportVisibility.PRIVATE,
  SkillImportVisibility.UNLISTED,
  SkillImportVisibility.PUBLIC,
] as const;
