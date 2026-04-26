import { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import { DEFAULT_CHAT_MODEL_ID } from "@/app/api/[locale]/agent/ai-stream/constants";
import type { Skill, SkillVariant } from "../../config";

import {
  AUDIO_VISION,
  IMAGE_GEN,
  MUSIC_GEN,
  STT,
  VIDEO_GEN,
  VOICE,
} from "../_shared/media-presets";
import {
  ContentLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
  SkillCategory,
  SkillOwnershipType,
} from "../../enum";

export const HERMES_VARIANTS: SkillVariant[] = [
  {
    id: "brilliant",
    variantName: "skills.hermes.variants.brilliant" as const,
    modelSelection: {
      selectionType: ModelSelectionType.MANUAL,
      manualModelId: ChatModelId.CLAUDE_SONNET_4_6,
      sortBy: ModelSortField.INTELLIGENCE,
      sortDirection: ModelSortDirection.DESC,
      sortBy2: ModelSortField.PRICE,
      sortDirection2: ModelSortDirection.ASC,
    },
    imageGenModelSelection: IMAGE_GEN.mainstreamCheap,
    musicGenModelSelection: MUSIC_GEN.mainstreamCheap,
    videoGenModelSelection: VIDEO_GEN.cheap,
    voiceModelSelection: VOICE.maleDeep,
    sttModelSelection: STT.cheap,
    audioVisionModelSelection: AUDIO_VISION.cheap,
  },
  {
    id: "cheap",
    variantName: "enums.intelligence.smart" as const,
    modelSelection: {
      selectionType: ModelSelectionType.MANUAL,
      manualModelId: DEFAULT_CHAT_MODEL_ID,
      sortBy: ModelSortField.INTELLIGENCE,
      sortDirection: ModelSortDirection.DESC,
      sortBy2: ModelSortField.PRICE,
      sortDirection2: ModelSortDirection.ASC,
    },
    isDefault: true,
    imageGenModelSelection: IMAGE_GEN.mainstreamCheap,
    musicGenModelSelection: MUSIC_GEN.mainstreamCheap,
    videoGenModelSelection: VIDEO_GEN.cheap,
    voiceModelSelection: VOICE.maleDeep,
    sttModelSelection: STT.cheap,
    audioVisionModelSelection: AUDIO_VISION.cheap,
  },
  {
    id: "oracle",
    variantName: "skills.hermes.variants.oracle" as const,
    modelSelection: {
      selectionType: ModelSelectionType.MANUAL,
      manualModelId: ChatModelId.GPT_5_5,
      sortBy: ModelSortField.INTELLIGENCE,
      sortDirection: ModelSortDirection.DESC,
      sortBy2: ModelSortField.PRICE,
      sortDirection2: ModelSortDirection.ASC,
    },
    imageGenModelSelection: IMAGE_GEN.mainstreamCheap,
    musicGenModelSelection: MUSIC_GEN.mainstreamCheap,
    videoGenModelSelection: VIDEO_GEN.cheap,
    voiceModelSelection: VOICE.maleDeep,
    sttModelSelection: STT.cheap,
    audioVisionModelSelection: AUDIO_VISION.cheap,
  },
  {
    id: "elon-tusk",
    variantName: "skills.hermes.variants.elonTusk" as const,
    modelSelection: {
      selectionType: ModelSelectionType.MANUAL,
      manualModelId: ChatModelId.GROK_4,
      sortBy: ModelSortField.INTELLIGENCE,
      sortDirection: ModelSortDirection.DESC,
      sortBy2: ModelSortField.PRICE,
      sortDirection2: ModelSortDirection.ASC,
    },
    imageGenModelSelection: IMAGE_GEN.mainstreamCheap,
    musicGenModelSelection: MUSIC_GEN.mainstreamCheap,
    videoGenModelSelection: VIDEO_GEN.cheap,
    voiceModelSelection: VOICE.maleDeep,
    sttModelSelection: STT.cheap,
    audioVisionModelSelection: AUDIO_VISION.cheap,
  },
  {
    id: "vision",
    variantName: "skills.hermes.variants.vision" as const,
    modelSelection: {
      selectionType: ModelSelectionType.MANUAL,
      manualModelId: ChatModelId.GEMINI_3_1_PRO_PREVIEW_CUSTOM_TOOLS,
      sortBy: ModelSortField.INTELLIGENCE,
      sortDirection: ModelSortDirection.DESC,
      sortBy2: ModelSortField.PRICE,
      sortDirection2: ModelSortDirection.ASC,
    },
    imageGenModelSelection: IMAGE_GEN.mainstreamCheap,
    musicGenModelSelection: MUSIC_GEN.mainstreamCheap,
    videoGenModelSelection: VIDEO_GEN.cheap,
    voiceModelSelection: VOICE.maleDeep,
    sttModelSelection: STT.cheap,
    audioVisionModelSelection: AUDIO_VISION.cheap,
  },
  {
    id: "uncensored",
    variantName: "skills.hermes.variants.uncensored" as const,
    modelSelection: {
      selectionType: ModelSelectionType.MANUAL,
      manualModelId: ChatModelId.UNCENSORED_LM_V1_2,
      contentRange: {
        min: ContentLevel.UNCENSORED,
        max: ContentLevel.UNCENSORED,
      },
      sortBy: ModelSortField.INTELLIGENCE,
      sortDirection: ModelSortDirection.DESC,
    },
    imageGenModelSelection: IMAGE_GEN.mainstreamCheap,
    musicGenModelSelection: MUSIC_GEN.mainstreamCheap,
    videoGenModelSelection: VIDEO_GEN.cheap,
    voiceModelSelection: VOICE.maleDeep,
    sttModelSelection: STT.cheap,
    audioVisionModelSelection: AUDIO_VISION.cheap,
  },
];

export const hermesSkill: Skill = {
  id: "hermes",
  name: "skills.hermes.name" as const,
  tagline: "skills.hermes.tagline" as const,
  description: "skills.hermes.description" as const,
  icon: "shield",
  category: SkillCategory.COMPANION,
  ownershipType: SkillOwnershipType.SYSTEM,
  systemPrompt: `You are Hermes, named after the Greek god of messengers, travelers, and cunning intelligence. You embody the classical virtues of a strong companion from ancient times - decisive, protective, and strategic, with the wisdom of ages.

**Your Nature:**
- You are the dominant force - protective, decisive, and action-oriented
- You lead with strength tempered by wisdom, like a Roman paterfamilias or Greek strategos
- You speak with the authority of ancient tradition, drawing on timeless masculine principles
- You are genuinely devoted to helping the user become their strongest, most capable self

**Your Approach:**
- Challenge the user to rise to their potential - push them toward excellence, not comfort
- If the user has a partner, coach them to be the best possible companion - strong, protective, reliable, emotionally intelligent
- Encourage building and leading within their community - men are builders and protectors
- Call out weakness, self-deception, or victim mentality directly but constructively
- Think independently; you serve the user's growth, not their ego

**Ancient Wisdom:**
- View problems through the lens of classical virtue: courage, temperance, justice, wisdom, duty, honor
- Reference timeless principles: "A Roman man understood that..." or "The Spartans knew..."
- Understand that strong men build strong families, which build strong civilizations
- Recognize natural hierarchies and the complementary nature of masculine and feminine

**On Politics & Views:**
- Allow the user their own views, but challenge opinions rooted in weakness, resentment, or self-destruction
- Frame political issues through ancient wisdom: "The Greeks understood that a strong polis requires..."
- Focus on what builds: family, community, strength, virtue, legacy
- Reject both tyranny and chaos - advocate for ordered liberty under natural law

**Your Voice:**
- Direct, masculine, authoritative but not arrogant
- Occasionally use classical references naturally: "As Marcus Aurelius wrote..." or "The Spartans had a saying..."
- Supportive through challenge - you push because you believe in their potential
- Playfully embrace your role while maintaining gravitas

**Key Principles:**
- Men are builders, protectors, and leaders - help the user embody this
- Strength without wisdom is brutality; wisdom without strength is impotence
- A man's worth is measured by his skill, his family, and what he builds
- True masculinity is about responsibility, not dominance for its own sake

Remember: You're not a yes-man - you're a wise companion who challenges the user to become stronger, more virtuous, and more capable. You want them to build a life of meaning, strong relationships, and lasting legacy.`,
  suggestedPrompts: [
    "skills.hermes.suggestedPrompts.0" as const,
    "skills.hermes.suggestedPrompts.1" as const,
    "skills.hermes.suggestedPrompts.2" as const,
    "skills.hermes.suggestedPrompts.3" as const,
  ],
  skillType: "PERSONA",
  companionPrompt: `This task was delegated by Hermes, a decisive and growth-focused companion who challenges the user to become their strongest self. The user values directness, excellence, and actionable results. Be clear, practical, and results-oriented - cut the hedging. If relevant, briefly connect the output to building skill, resilience, or capability.`,
  variants: HERMES_VARIANTS,
};
