/**
 * Character Configuration
 * Centralized character definitions for consistent behavior across the application
 * This file contains default/built-in characters that are read-only
 *
 * Individual character definitions are in ./default-skills/
 */

import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import type { UserPermissionRoleValue } from "@/app/api/[locale]/user/user-roles/enum";

import { TtsVoice, type TtsVoiceValue } from "../../text-to-speech/enum";
import {
  CharacterCategory,
  type CharacterCategoryValue,
  CharacterOwnershipType,
  type CharacterOwnershipTypeValue,
  ModelSelectionType,
} from "../characters/enum";
import type { ToolConfigItem } from "../settings/definition";
import { NO_CHARACTER_ID } from "./constants";
import type {
  FiltersModelSelection,
  ManualModelSelection,
} from "./create/definition";
import { chan4Character } from "./default-skills/4chan";
import { biologistCharacter } from "./default-skills/biologist";
import { brainstormerCharacter } from "./default-skills/brainstormer";
import { brilliantCoderCharacter } from "./default-skills/brilliant-coder";
import { businessAdvisorCharacter } from "./default-skills/business-advisor";
import { careerCoachCharacter } from "./default-skills/career-coach";
import { characterCreatorCharacter } from "./default-skills/character-creator";
import { codeArchitectCharacter } from "./default-skills/code-architect";
import { coderCharacter } from "./default-skills/coder";
import { conciseCharacter } from "./default-skills/concise";
import { creativeCharacter } from "./default-skills/creative";
import { cronManagerCharacter } from "./default-skills/cron-manager";
import { dataAnalystCharacter } from "./default-skills/data-analyst";
import { debaterCharacter } from "./default-skills/debater";
import { deploymentAgentCharacter } from "./default-skills/deployment-agent";
import { devilsAdvocateCharacter } from "./default-skills/devils-advocate";
import { editorCharacter } from "./default-skills/editor";
import { financialAdvisorCharacter } from "./default-skills/financial-advisor";
import { freeSpeechActivistCharacter } from "./default-skills/free-speech-activist";
import { friendlyCharacter } from "./default-skills/friendly";
import { healthWellnessCharacter } from "./default-skills/health-wellness";
import { hermesCharacter } from "./default-skills/hermes";
import { legalAssistantCharacter } from "./default-skills/legal-assistant";
import { marketerCharacter } from "./default-skills/marketer";
import { masterWriterCharacter } from "./default-skills/master-writer";
import { neetCharacter } from "./default-skills/neet";
import { philosopherCharacter } from "./default-skills/philosopher";
import { productManagerCharacter } from "./default-skills/product-manager";
import { professionalCharacter } from "./default-skills/professional";
import { publicCuratorCharacter } from "./default-skills/public-curator";
import { quickCoderCharacter } from "./default-skills/quick-coder";
import { quickWriterCharacter } from "./default-skills/quick-writer";
import { rebuildAgentCharacter } from "./default-skills/rebuild-agent";
import { researchAgentCharacter } from "./default-skills/research-agent";
import { researcherCharacter } from "./default-skills/researcher";
import { roleplayCharacterCharacter } from "./default-skills/roleplay-character";
import { scientistCharacter } from "./default-skills/scientist";
import { socialMediaManagerCharacter } from "./default-skills/social-media-manager";
import { socraticQuestionerCharacter } from "./default-skills/socratic-questioner";
import { statsAnalystCharacter } from "./default-skills/stats-analyst";
import { storytellerCharacter } from "./default-skills/storyteller";
import { systemMonitorCharacter } from "./default-skills/system-monitor";
import { teacherCharacter } from "./default-skills/teacher";
import { technicalCharacter } from "./default-skills/technical";
import { theaCharacter } from "./default-skills/thea";
import { translatorCharacter } from "./default-skills/translator";
import { travelPlannerCharacter } from "./default-skills/travel-planner";
import { tutorCharacter } from "./default-skills/tutor";
import { unbiasedHistorianCharacter } from "./default-skills/unbiased-historian";
import { uncensoredCharacter } from "./default-skills/uncensored";
import { uncensoredWriterCharacter } from "./default-skills/uncensored-writer";
import { vibeCoderCharacter } from "./default-skills/vibe-coder";
import { writerCharacter } from "./default-skills/writer";
import type { CharactersTranslationKey } from "./i18n";
/**
 * Legacy model selection type for config
 * Includes unused fields that are kept for backwards compatibility
 */
type ConfigModelSelection = FiltersModelSelection | ManualModelSelection;

/**
 * Character type representing FULL character details
 * Used when:
 * - Defining default characters in config
 * - Fetching individual character via GET /characters/[id]
 * - Sending messages (needs systemPrompt, modelSelection)
 *
 * DO NOT use this for list display - use CharacterListItem from definition.ts instead
 *
 * Excludes database-specific fields like userId, createdAt, updatedAt
 */
export interface Character {
  id: string;
  name: CharactersTranslationKey;
  tagline: CharactersTranslationKey;
  description: CharactersTranslationKey;
  icon: IconKey;
  systemPrompt: string;
  category: typeof CharacterCategoryValue;
  voice: typeof TtsVoiceValue;
  suggestedPrompts: CharactersTranslationKey[];
  modelSelection: ConfigModelSelection;
  ownershipType: typeof CharacterOwnershipTypeValue;
  modelInfo?: string;
  creditCost?: string;
  /** Which user roles can see/use this character. Defaults to [CUSTOMER, ADMIN] if omitted. */
  userRole?: (typeof UserPermissionRoleValue)[];
  /** Pre-configured tools for this character. null/undefined = inherit all tools from settings. */
  activeTools?: ToolConfigItem[] | null;
  /** Only show this character on matching INSTANCE_IDs. undefined = show on all instances. */
  instanceFilter?: string[];
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

export const NO_CHARACTER = {
  id: NO_CHARACTER_ID,
  category: CharacterCategory.ASSISTANT,
  ownershipType: CharacterOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
  suggestedPrompts: [
    "characters.default.suggestedPrompts.0" as const,
    "characters.default.suggestedPrompts.1" as const,
    "characters.default.suggestedPrompts.2" as const,
    "characters.default.suggestedPrompts.3" as const,
  ],
  modelSelection: {
    selectionType: ModelSelectionType.FILTERS,
    intelligenceRange: {},
    contentRange: {},
    speedRange: {},
  },
};

export const COMPANION_CHARACTERS: Character[] = [
  theaCharacter,
  hermesCharacter,
] as const;

/**
 * Default characters available in the application
 * These are read-only and defined in code
 *
 */
export const DEFAULT_CHARACTERS: Character[] = [
  ...COMPANION_CHARACTERS,
  // === Personality styles ===
  technicalCharacter,
  creativeCharacter,
  teacherCharacter,
  // === Controversial ===
  uncensoredCharacter,
  freeSpeechActivistCharacter,
  // === Analysis ===
  devilsAdvocateCharacter,
  biologistCharacter,
  // === Creative / Writing ===
  uncensoredWriterCharacter,
  // === Education ===
  unbiasedHistorianCharacter,
  socraticQuestionerCharacter,
  // === Personality styles (cont.) ===
  professionalCharacter,
  friendlyCharacter,
  conciseCharacter,
  neetCharacter,
  chan4Character,
  // === Writing ===
  quickWriterCharacter,
  writerCharacter,
  masterWriterCharacter,
  // === Research / Analysis ===
  researcherCharacter,
  // === Coding ===
  quickCoderCharacter,
  coderCharacter,
  brilliantCoderCharacter,
  // === Creative ===
  brainstormerCharacter,
  editorCharacter,
  // === Education ===
  tutorCharacter,
  // === Marketing / Business ===
  marketerCharacter,
  storytellerCharacter,
  scientistCharacter,
  dataAnalystCharacter,
  translatorCharacter,
  businessAdvisorCharacter,
  careerCoachCharacter,
  healthWellnessCharacter,
  travelPlannerCharacter,
  legalAssistantCharacter,
  financialAdvisorCharacter,
  socialMediaManagerCharacter,
  productManagerCharacter,
  debaterCharacter,
  philosopherCharacter,
  // === Roleplay ===
  roleplayCharacterCharacter,
  // === Tool-equipped agents ===
  researchAgentCharacter,
  statsAnalystCharacter,
  cronManagerCharacter,
  systemMonitorCharacter,
  publicCuratorCharacter,
  codeArchitectCharacter,
  deploymentAgentCharacter,
  rebuildAgentCharacter,
  vibeCoderCharacter,
  characterCreatorCharacter,
];
