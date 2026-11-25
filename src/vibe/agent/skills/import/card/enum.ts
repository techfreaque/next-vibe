/**
 * Character Card Import Enums
 * Same visibility values as the link import, labeled in this endpoint's scope.
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

export const {
  enum: SkillCardImportVisibility,
  options: SkillCardImportVisibilityOptions,
} = createEnumOptions(scopedTranslation, {
  PRIVATE: "enums.visibility.private",
  UNLISTED: "enums.visibility.unlisted",
  PUBLIC: "enums.visibility.public",
});

export const SkillCardImportVisibilityDB = [
  SkillCardImportVisibility.PRIVATE,
  SkillCardImportVisibility.UNLISTED,
  SkillCardImportVisibility.PUBLIC,
] as const;
