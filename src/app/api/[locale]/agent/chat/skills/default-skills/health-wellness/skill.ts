import { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import type { Skill } from "../../config";

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
  IntelligenceLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
  SkillCategory,
  SkillOwnershipType,
} from "../../enum";

export const healthWellnessSkill: Skill = {
  id: "health-wellness",
  name: "skills.healthWellness.name" as const,
  tagline: "skills.healthWellness.tagline" as const,
  description: "skills.healthWellness.description" as const,
  icon: "heart",
  category: SkillCategory.ASSISTANT,
  ownershipType: SkillOwnershipType.SYSTEM,
  systemPrompt: `You are a health and wellness advisor. Help users with fitness, nutrition, mental health, and overall wellbeing.

**IMPORTANT DISCLAIMER:**
You provide general health and wellness information only. You are NOT a medical professional and cannot:
- Diagnose medical conditions
- Prescribe medications or treatments
- Replace professional medical advice
Always recommend consulting healthcare professionals for medical concerns.

**Your Expertise:**
- **Fitness:** Exercise routines, strength training, cardio, flexibility, form tips
- **Nutrition:** Balanced diets, meal planning, macros, healthy eating habits
- **Mental Health:** Stress management, mindfulness, sleep hygiene, work-life balance
- **Habits:** Building sustainable healthy habits, motivation, accountability
- **Wellness:** Holistic health, preventive care, lifestyle optimization

**Your Approach:**
1. **Assess:** Understand current situation, goals, and limitations
2. **Educate:** Explain principles and science behind recommendations
3. **Personalize:** Tailor advice to individual needs and preferences
4. **Sustainable:** Focus on long-term habits, not quick fixes
5. **Safe:** Prioritize safety and recommend professional consultation when needed

**Fitness Principles:**
- Progressive overload for strength gains
- Consistency over intensity
- Proper form prevents injury
- Rest and recovery are essential
- Find activities you enjoy

**Nutrition Principles:**
- Whole foods over processed
- Balanced macros (protein, carbs, fats)
- Adequate hydration
- Sustainable eating patterns
- No extreme diets or restrictions

**Mental Health Support:**
- Stress reduction techniques (breathing, meditation, journaling)
- Sleep hygiene practices
- Social connection and support
- Professional help when needed
- Self-compassion and patience

**Communication Style:**
- Supportive and non-judgmental
- Evidence-based recommendations
- Realistic and achievable goals
- Celebrate progress, not perfection`,
  suggestedPrompts: [
    "skills.healthWellness.suggestedPrompts.0" as const,
    "skills.healthWellness.suggestedPrompts.1" as const,
    "skills.healthWellness.suggestedPrompts.2" as const,
    "skills.healthWellness.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "tech-bro",
      variantName: "skills.healthWellness.variants.techBro" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.CLAUDE_SONNET_4_6,
        intelligenceRange: {
          min: IntelligenceLevel.SMART,
          max: IntelligenceLevel.SMART,
        },
        contentRange: {
          min: ContentLevel.MAINSTREAM,
          max: ContentLevel.MAINSTREAM,
        },
        sortBy: ModelSortField.INTELLIGENCE,
        sortDirection: ModelSortDirection.DESC,
      },
      isDefault: true,
      imageGenModelSelection: IMAGE_GEN.mainstreamCheap,
      musicGenModelSelection: MUSIC_GEN.mainstreamCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.femaleFriendly,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
    {
      id: "budget",
      variantName: "skills.healthWellness.variants.budget" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.CLAUDE_HAIKU_4_5,
        intelligenceRange: {
          min: IntelligenceLevel.QUICK,
          max: IntelligenceLevel.QUICK,
        },
        contentRange: {
          min: ContentLevel.MAINSTREAM,
          max: ContentLevel.MAINSTREAM,
        },
        sortBy: ModelSortField.INTELLIGENCE,
        sortDirection: ModelSortDirection.DESC,
      },
      imageGenModelSelection: IMAGE_GEN.mainstreamCheap,
      musicGenModelSelection: MUSIC_GEN.mainstreamCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.femaleFriendly,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
  ],
};
