/**
 * Persona Enums
 * Centralized enum definitions for persona system using localized enum pattern
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

/**
 * Persona Category Enum
 * User-facing task categories for personas
 */
export const {
  enum: PersonaCategory,
  options: PersonaCategoryOptions,
  Value: PersonaCategoryValue,
} = createEnumOptions({
  COMPANION: "app.api.agent.chat.personas.enums.category.companion",
  ASSISTANT: "app.api.agent.chat.personas.enums.category.assistant",
  CODING: "app.api.agent.chat.personas.enums.category.coding",
  CREATIVE: "app.api.agent.chat.personas.enums.category.creative",
  WRITING: "app.api.agent.chat.personas.enums.category.writing",
  ANALYSIS: "app.api.agent.chat.personas.enums.category.analysis",
  ROLEPLAY: "app.api.agent.chat.personas.enums.category.roleplay",
  EDUCATION: "app.api.agent.chat.personas.enums.category.education",
  CONTROVERSIAL: "app.api.agent.chat.personas.enums.category.controversial",
  CUSTOM: "app.api.agent.chat.personas.enums.category.custom",
});

/**
 * Database enum array for Drizzle
 */
export const PersonaCategoryDB = [
  PersonaCategory.COMPANION,
  PersonaCategory.ASSISTANT,
  PersonaCategory.CODING,
  PersonaCategory.CREATIVE,
  PersonaCategory.WRITING,
  PersonaCategory.ANALYSIS,
  PersonaCategory.ROLEPLAY,
  PersonaCategory.EDUCATION,
  PersonaCategory.CONTROVERSIAL,
  PersonaCategory.CUSTOM,
] as const;

/**
 * Persona Source Enum
 * Where the persona comes from
 */
export const {
  enum: PersonaSource,
  options: PersonaSourceOptions,
  Value: PersonaSourceValue,
} = createEnumOptions({
  BUILT_IN: "app.api.agent.chat.personas.enums.source.builtIn",
  MY: "app.api.agent.chat.personas.enums.source.my",
  COMMUNITY: "app.api.agent.chat.personas.enums.source.community",
});

/**
 * Database enum array for Drizzle
 */
export const PersonaSourceDB = [
  PersonaSource.BUILT_IN,
  PersonaSource.MY,
  PersonaSource.COMMUNITY,
] as const;

