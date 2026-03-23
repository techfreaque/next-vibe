/**
 * Skill Configuration
 * Centralized skill definitions for consistent behavior across the application
 * This file contains default/built-in skills that are read-only
 *
 * Individual skill definitions are in ./default-skills/<name>/skill.ts
 * DEFAULT_SKILLS and COMPANION_SKILLS are auto-generated - see generators/skills-index
 */

import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import type { UserPermissionRoleValue } from "@/app/api/[locale]/user/user-roles/enum";

import { TtsVoice, type TtsVoiceValue } from "../../text-to-speech/enum";
import type { ToolConfigItem } from "../settings/definition";
import { NO_SKILL_ID } from "./constants";
import type {
  FiltersModelSelection,
  ManualModelSelection,
} from "./create/definition";
import {
  ModelSelectionType,
  SkillCategory,
  type SkillCategoryValue,
  SkillOwnershipType,
  type SkillOwnershipTypeValue,
} from "./enum";
import type { SkillsTranslationKey } from "./i18n";
export {
  COMPANION_SKILLS,
  DEFAULT_SKILLS,
} from "@/app/api/[locale]/system/generated/skills-index";
/**
 * Legacy model selection type for config
 * Includes unused fields that are kept for backwards compatibility
 */
type ConfigModelSelection = FiltersModelSelection | ManualModelSelection;

/**
 * Skill type representing FULL skill details
 * Used when:
 * - Defining default skills in config
 * - Fetching individual skill via GET /skills/[id]
 * - Sending messages (needs systemPrompt, modelSelection)
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
  voice: typeof TtsVoiceValue;
  suggestedPrompts: SkillsTranslationKey[];
  modelSelection: ConfigModelSelection;
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
 * Helper type to get clean model selection without legacy fields
 */
export type CleanModelSelection = FiltersModelSelection | ManualModelSelection;

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
  voice: TtsVoice.FEMALE,
  suggestedPrompts: [
    "skills.default.suggestedPrompts.0" as const,
    "skills.default.suggestedPrompts.1" as const,
    "skills.default.suggestedPrompts.2" as const,
    "skills.default.suggestedPrompts.3" as const,
  ],
  modelSelection: {
    selectionType: ModelSelectionType.FILTERS,
    intelligenceRange: {},
    contentRange: {},
    speedRange: {},
  },
};
