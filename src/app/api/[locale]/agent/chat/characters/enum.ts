/**
 * Character Enums
 * Centralized enum definitions for character system using localized enum pattern
 */

import {
  Brain,
  Code,
  Eye,
  FileText,
  Image,
  Lightbulb,
  MessageSquare,
  ShieldOff,
  Sparkles,
  Theater,
  Zap,
} from "next-vibe-ui/ui/icons";

import type { IconKey } from "@/app/api/[locale]/system/unified-interface/react/icons";
import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";
import type { TranslationKey } from "@/i18n/core/static-types";
import type { IconComponent } from "@/packages/next-vibe-ui/web/lib/helper";

import { ModelUtility, type ModelUtilityValue } from "../../models/enum";

/**
 * Character Category Enum
 * User-facing task categories for characters
 */
export const {
  enum: CharacterCategory,
  options: CharacterCategoryOptions,
  Value: CharacterCategoryValue,
} = createEnumOptions({
  COMPANION: "app.api.agent.chat.characters.enums.category.companion",
  ASSISTANT: "app.api.agent.chat.characters.enums.category.assistant",
  CODING: "app.api.agent.chat.characters.enums.category.coding",
  CREATIVE: "app.api.agent.chat.characters.enums.category.creative",
  WRITING: "app.api.agent.chat.characters.enums.category.writing",
  ANALYSIS: "app.api.agent.chat.characters.enums.category.analysis",
  ROLEPLAY: "app.api.agent.chat.characters.enums.category.roleplay",
  EDUCATION: "app.api.agent.chat.characters.enums.category.education",
  CONTROVERSIAL: "app.api.agent.chat.characters.enums.category.controversial",
  CUSTOM: "app.api.agent.chat.characters.enums.category.custom",
});

/**
 * Database enum array for Drizzle
 */
export const CharacterCategoryDB = [
  CharacterCategory.COMPANION,
  CharacterCategory.ASSISTANT,
  CharacterCategory.CODING,
  CharacterCategory.CREATIVE,
  CharacterCategory.WRITING,
  CharacterCategory.ANALYSIS,
  CharacterCategory.ROLEPLAY,
  CharacterCategory.EDUCATION,
  CharacterCategory.CONTROVERSIAL,
  CharacterCategory.CUSTOM,
] as const;

/**
 * Character Source Enum
 * Where the character comes from
 */
export const {
  enum: CharacterSource,
  options: CharacterSourceOptions,
  Value: CharacterSourceValue,
} = createEnumOptions({
  BUILT_IN: "app.api.agent.chat.characters.enums.source.builtIn",
  MY: "app.api.agent.chat.characters.enums.source.my",
  COMMUNITY: "app.api.agent.chat.characters.enums.source.community",
});

/**
 * Database enum array for Drizzle
 */
export const CharacterSourceDB = [
  CharacterSource.BUILT_IN,
  CharacterSource.MY,
  CharacterSource.COMMUNITY,
] as const;

/**
 * Character Ownership Type Enum
 * Who owns/controls the character
 */
export const {
  enum: CharacterOwnershipType,
  options: CharacterOwnershipTypeOptions,
  Value: CharacterOwnershipTypeValue,
} = createEnumOptions({
  SYSTEM: "app.api.agent.chat.characters.enums.ownershipType.system",
  USER: "app.api.agent.chat.characters.enums.ownershipType.user",
  PUBLIC: "app.api.agent.chat.characters.enums.ownershipType.public",
});

/**
 * Database enum array for Drizzle
 */
export const CharacterOwnershipTypeDB = [
  CharacterOwnershipType.SYSTEM,
  CharacterOwnershipType.USER,
  CharacterOwnershipType.PUBLIC,
] as const;
