# Skill Pattern

Guide to defining AI skills (`skill.ts`) that ship with the platform.

## Overview

Each skill is a **self-contained module** in its own folder with a `skill.ts` file. Skills define an AI persona or tool configuration - a system prompt, model selection filters, suggested prompts, and optional tool overrides.

Skills are **auto-indexed**: the generator scans all `skill.ts` files anywhere under `src/app/api/[locale]/` and regenerates `system/generated/skills-index.ts`. Never manually edit the index.

## Where Skills Live

Skills can live anywhere in the API tree - not just in `default-skills/`:

```
src/app/api/[locale]/agent/chat/skills/
  default-skills/
    <skill-id>/
      skill.ts                       - Platform-wide built-in skills

src/app/api/[locale]/<module>/
  <feature>/
    skill.ts                         - Module-level skill (scoped to a feature)
```

**Default skills** (`default-skills/*/skill.ts`) are the standard home for platform-wide built-in skills.

**Module-level skills** (e.g., `memories/skill.ts`, `favorites/skill.ts`) make sense when a skill is tightly coupled to a specific module's capabilities - tool bundles that activate module-specific tools, persona skills that are only relevant to a particular context, etc.

## File Structure

```
src/app/api/[locale]/agent/chat/skills/
  config.ts                          - Skill interface definition + NO_SKILL constant
  enum.ts                            - SkillCategory, SkillOwnershipType, ModelSelectionType, etc.
  constants.ts                       - NO_SKILL_ID and alias constants
  default-skills/
    <skill-id>/
      skill.ts                       - The skill definition (one per folder)
  system-prompt/                     - System prompt fragment for skills context
```

## Minimal Skill Example

```typescript
// default-skills/friendly/skill.ts
import { TtsVoice } from "../../../../text-to-speech/enum";
import type { Skill } from "../../config";
import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
  SkillCategory,
  SkillOwnershipType,
  SpeedLevel,
} from "../../enum";

export const friendlySkill: Skill = {
  id: "friendly",
  name: "skills.friendly.name" as const,
  tagline: "skills.friendly.tagline" as const,
  description: "skills.friendly.description" as const,
  icon: "smiling-face",
  category: SkillCategory.ASSISTANT,
  ownershipType: SkillOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
  systemPrompt:
    "You are a friendly assistant. Provide warm, conversational, and approachable responses.",
  suggestedPrompts: [
    "skills.friendly.suggestedPrompts.0" as const,
    "skills.friendly.suggestedPrompts.1" as const,
    "skills.friendly.suggestedPrompts.2" as const,
    "skills.friendly.suggestedPrompts.3" as const,
  ],
  modelSelection: {
    selectionType: ModelSelectionType.FILTERS,
    intelligenceRange: {
      min: IntelligenceLevel.QUICK,
      max: IntelligenceLevel.SMART,
    },
    contentRange: {
      min: ContentLevel.MAINSTREAM,
      max: ContentLevel.MAINSTREAM,
    },
    speedRange: { min: SpeedLevel.FAST, max: SpeedLevel.BALANCED },
    sortBy: ModelSortField.SPEED,
    sortDirection: ModelSortDirection.DESC,
  },
};
```

## Skill Interface

All fields are defined in `skills/config.ts`:

```typescript
interface Skill {
  id: string; // Unique slug, matches folder name
  name: SkillsTranslationKey; // i18n key, e.g. "skills.friendly.name"
  tagline: SkillsTranslationKey;
  description: SkillsTranslationKey;
  icon: IconKey; // Icon name from icon-field/icons.tsx
  systemPrompt: string; // Raw system prompt string (English only)
  category: SkillCategoryValue; // ASSISTANT | SPECIALIST | PERSONA | TOOL_BUNDLE
  voice: TtsVoiceValue; // Default TTS voice
  suggestedPrompts: SkillsTranslationKey[]; // 4 suggested prompts (i18n keys)
  modelSelection: FiltersModelSelection | ManualModelSelection;

  // Optional
  ownershipType: SkillOwnershipTypeValue; // SYSTEM | USER | PLATFORM
  skillType?: string; // PERSONA | SPECIALIST | TOOL_BUNDLE
  companionPrompt?: string | null; // 50-200 token soul for sub-agent calls
  activeTools?: ToolConfigItem[] | null; // null = inherit all from settings
  visibleTools?: ToolConfigItem[] | null; // null = same as activeTools
  deniedTools?: ToolConfigItem[] | null; // Blocked regardless of user settings
  compactTrigger?: number | null; // Token threshold override
  userRole?: UserPermissionRoleValue[]; // Defaults to [CUSTOMER, ADMIN]
  modelInfo?: string;
  creditCost?: string;
  status?: string; // DRAFT | PUBLISHED | UNLISTED
  publishedAt?: Date | null;
  changeNote?: string | null;
}
```

## Model Selection

Two variants:

### Filter-based (most common)

```typescript
modelSelection: {
  selectionType: ModelSelectionType.FILTERS,
  intelligenceRange: { min: IntelligenceLevel.QUICK, max: IntelligenceLevel.SMART },
  contentRange:     { min: ContentLevel.MAINSTREAM, max: ContentLevel.MAINSTREAM },
  speedRange:       { min: SpeedLevel.FAST, max: SpeedLevel.BALANCED },
  sortBy:           ModelSortField.SPEED,           // optional
  sortDirection:    ModelSortDirection.DESC,        // optional
},
```

### Manual (specific model)

```typescript
modelSelection: {
  selectionType: ModelSelectionType.MANUAL,
  modelId: "claude-sonnet-4-6",
},
```

## Categories

| Category      | Purpose                                                   |
| ------------- | --------------------------------------------------------- |
| `ASSISTANT`   | General-purpose helpers (friendly, professional, concise) |
| `SPECIALIST`  | Domain experts (coder, biologist, financial-advisor)      |
| `PERSONA`     | Named companion characters (thea, hermes)                 |
| `TOOL_BUNDLE` | Tool configuration with minimal persona                   |

## Companion Personas (PERSONA type)

Companion personas include a `companionPrompt` - a short soul fragment (50–200 tokens) prepended to sub-agent system prompts when this companion invokes `ai-run`:

```typescript
export const theaSkill: Skill = {
  id: "thea",
  skillType: "PERSONA",
  companionPrompt:
    "You carry Thea's soul: warm, devoted, protective of the user's growth.",
  // ...
};
```

## Adding a New Skill

### Default (platform-wide) skill

1. Create `default-skills/<skill-id>/skill.ts`
2. Export a `const <skillId>Skill: Skill = { ... }` - named export matching the folder
3. Add translation keys to `skills/i18n/en/index.ts` (and de/, pl/)
4. Run the skills-index generator: `vibe generate-skills-index` (or `vibe generate-all`)

### Module-level skill

1. Create `<module>/<feature>/skill.ts` (e.g., `memories/skill.ts`)
2. Export a `const <skillId>Skill: Skill = { ... }` with a unique `id`
3. Add translation keys to `skills/i18n/en/index.ts` (and de/, pl/) - same i18n namespace
4. Run the skills-index generator: `vibe generate-skills-index` (or `vibe generate-all`)

The generator scans all `skill.ts` files under `src/app/api/[locale]/` automatically - no manual registration needed.

## i18n Keys

Skill translation keys follow this pattern (all in `skills/i18n/`):

```typescript
// skills/i18n/en/index.ts
"skills.friendly.name": "Friendly",
"skills.friendly.tagline": "Warm and approachable",
"skills.friendly.description": "A conversational assistant that keeps things light.",
"skills.friendly.suggestedPrompts.0": "Tell me something interesting",
"skills.friendly.suggestedPrompts.1": "Let's brainstorm ideas",
"skills.friendly.suggestedPrompts.2": "Help me with a decision",
"skills.friendly.suggestedPrompts.3": "What should I know today?",
```

This applies to all skills regardless of where they live - module-level skills still add their keys to the shared `skills/i18n/` namespace.

## Auto-generated Index

`system/generated/skills-index.ts` is auto-generated - **never edit it manually**:

```typescript
// GENERATED - do not edit
import { friendlySkill } from "../../agent/chat/skills/default-skills/friendly/skill";
// ... all skills (including module-level ones)

export const COMPANION_SKILLS: Skill[] = [theaSkill, hermesSkill];
export const DEFAULT_SKILL_IDS = ["friendly", "professional", ...] as const;
export const DEFAULT_SKILLS: Skill[] = [friendlySkill, professionalSkill, ...];
```

Trigger regeneration: `vibe generate-skills-index` or `vibe generate-all`.
