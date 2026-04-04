/**
 * Skill Configuration
 * Centralized skill definitions for consistent behavior across the application
 * This file contains default/built-in skills that are read-only
 *
 * Individual skill definitions are in ./default-skills/<name>/skill.ts
 * DEFAULT_SKILLS and COMPANION_SKILLS are auto-generated - see generators/skills-index
 */

import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import {
  UserPermissionRole,
  type UserPermissionRoleValue,
} from "@/app/api/[locale]/user/user-roles/enum";

import {
  COMPANION_SKILLS,
  DEFAULT_SKILLS,
} from "@/app/api/[locale]/system/generated/skills-index";
import type { ChatModelId } from "../../ai-stream/models";
import type {
  AudioVisionModelId,
  ImageVisionModelId,
  VideoVisionModelId,
} from "../../ai-stream/vision-models";
import type { ImageGenModelId } from "../../image-generation/models";
import type { ChatMode } from "../../models/enum";
import type { ChatModelSelection } from "../../ai-stream/models";
import type { MusicGenModelId } from "../../music-generation/models";
import type { SttModelId } from "../../speech-to-text/models";
import type { TtsModelId } from "../../text-to-speech/models";
import type { VideoGenModelId } from "../../video-generation/models";
import type { ToolConfigItem } from "../settings/definition";
import { NO_SKILL_ID } from "./constants";
import {
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
  SkillCategory,
  type SkillCategoryValue,
  SkillOwnershipType,
  type SkillOwnershipTypeValue,
} from "./enum";
import type { SkillsTranslationKey } from "./i18n";
export { COMPANION_SKILLS, DEFAULT_SKILLS };

/**
 * Returns how many default skills are accessible to a user with the given roles.
 * Mirrors the filtering logic in SkillsRepository.filterDefaultSkills().
 */
export function getAvailableSkillCount(
  userRoles: (typeof UserPermissionRoleValue)[],
): number {
  return DEFAULT_SKILLS.filter((skill) => {
    const allowedRoles = skill.userRole ?? [
      UserPermissionRole.PUBLIC,
      UserPermissionRole.CUSTOMER,
      UserPermissionRole.ADMIN,
    ];
    return userRoles.some((role) => allowedRoles.some((r) => r === role));
  }).length;
}

/**
 * A named variant of a skill with its own model selection.
 * Skills with variants are expanded into grouped rows in the skill list.
 */
export interface SkillVariant {
  /** Unique identifier within the skill, e.g. "brilliant", "uncensored" */
  id: string;
  /** Localized sub-label shown under the skill name, e.g. "skills.thea.variants.brilliant" */
  variantName: SkillsTranslationKey;
  /** Model selection for this variant - required, drives model resolution */
  modelSelection: ChatModelSelection;
  /** Which variant is the default when none is specified */
  isDefault?: boolean;
}

/**
 * Skill type representing FULL skill details
 * Used when:
 * - Defining default skills in config
 * - Fetching individual skill via GET /skills/[id]
 * - Sending messages (needs systemPrompt, variants)
 *
 * DO NOT use this for list display - use SkillListItem from definition.ts instead
 *
 * Excludes database-specific fields like userId, createdAt, updatedAt
 */
export interface Skill {
  id: string;
  name: SkillsTranslationKey;
  tagline: SkillsTranslationKey;
  description: SkillsTranslationKey;
  icon: IconKey;
  systemPrompt: string;
  category: typeof SkillCategoryValue;
  voiceId?: TtsModelId;
  sttModelId?: SttModelId;
  imageVisionModelId?: ImageVisionModelId;
  videoVisionModelId?: VideoVisionModelId;
  audioVisionModelId?: AudioVisionModelId;
  translationModelId?: ChatModelId;
  defaultChatMode?: ChatMode;
  imageGenModelId?: ImageGenModelId;
  musicGenModelId?: MusicGenModelId;
  videoGenModelId?: VideoGenModelId;
  suggestedPrompts: SkillsTranslationKey[];
  /** Named variants. Expanded as grouped rows in skill list. */
  variants: SkillVariant[];
  ownershipType: typeof SkillOwnershipTypeValue;
  modelInfo?: string;
  creditCost?: string;
  /** Which user roles can see/use this skill. Defaults to [CUSTOMER, ADMIN] if omitted. */
  userRole?: (typeof UserPermissionRoleValue)[];
  /** Pre-configured tools for this skill. null/undefined = inherit all tools from settings. */
  availableTools?: ToolConfigItem[] | null;
  /** Tools pinned into the AI context window. null/undefined = same as availableTools. */
  pinnedTools?: ToolConfigItem[] | null;
  /** Auto-compacting token threshold. null/undefined = use global default. */
  compactTrigger?: number | null;
  /** Runtime behavior type: PERSONA travels soul via companionPrompt, SPECIALIST is pure executor, TOOL_BUNDLE adds no prompt. */
  skillType?: string;
  /** Short soul fragment (50–200 tokens) prepended to sub-agent system prompt when this companion invokes ai-run. */
  companionPrompt?: string | null;
  /** Tools blocked at skill level regardless of favorites/user settings. */
  deniedTools?: ToolConfigItem[] | null;
  /** Publishing status: DRAFT (private), PUBLISHED (public store), UNLISTED (link-only). */
  status?: string;
  /** When this skill was last published. */
  publishedAt?: Date | null;
  /** Short description of the last change (for published skills). */
  changeNote?: string | null;
}

/**
 * Helper to create a tool config item (uses aliases for update-safe references)
 */
export function tool(
  toolId: string,
  requiresConfirmation = false,
): ToolConfigItem {
  return { toolId, requiresConfirmation };
}

export const NO_SKILL = {
  id: NO_SKILL_ID,
  category: SkillCategory.ASSISTANT,
  ownershipType: SkillOwnershipType.SYSTEM,
  voiceId: undefined,
  suggestedPrompts: [
    "skills.default.suggestedPrompts.0" as const,
    "skills.default.suggestedPrompts.1" as const,
    "skills.default.suggestedPrompts.2" as const,
    "skills.default.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: NO_SKILL_ID,
      variantName: "skills.default.variants.default" as const,
      isDefault: true,
      modelSelection: {
        selectionType: ModelSelectionType.FILTERS,
        sortBy: ModelSortField.INTELLIGENCE,
        sortDirection: ModelSortDirection.ASC,
        sortBy2: ModelSortField.PRICE,
        sortDirection2: ModelSortDirection.ASC,
      },
    },
  ],
};
