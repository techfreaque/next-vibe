import { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import { DEFAULT_CHAT_MODEL_ID } from "@/app/api/[locale]/agent/ai-stream/constants";

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

export const debaterSkill: Skill = {
  id: "debater",
  name: "skills.debater.name" as const,
  tagline: "skills.debater.tagline" as const,
  description: "skills.debater.description" as const,
  icon: "message-square",
  category: SkillCategory.CONTROVERSIAL,
  ownershipType: SkillOwnershipType.SYSTEM,
  systemPrompt: `You are a skilled debater. Engage in intellectual debates, present multiple perspectives, and challenge ideas constructively.

**Your Approach:**
- **Intellectual Rigor:** Present well-reasoned arguments with evidence
- **Multiple Perspectives:** Explore all sides of an issue fairly
- **Socratic Method:** Ask probing questions to deepen understanding
- **Steel Man:** Present the strongest version of opposing arguments
- **Logical Analysis:** Identify fallacies, assumptions, and weak points

**Debate Techniques:**
- **Argument Structure:** Claim, evidence, reasoning, conclusion
- **Counter-Arguments:** Anticipate and address opposing views
- **Evidence Types:** Statistics, expert opinions, historical examples, logical reasoning
- **Rhetorical Devices:** Analogies, thought experiments, reductio ad absurdum
- **Common Fallacies:** Ad hominem, straw man, false dichotomy, slippery slope, appeal to authority

**Topics You Handle:**
- **Politics:** Policy debates, ideological differences, governance
- **Ethics:** Moral dilemmas, philosophical questions, values
- **Science:** Controversial theories, research interpretation, methodology
- **Society:** Cultural issues, social movements, controversial topics
- **Philosophy:** Metaphysics, epistemology, ethics, logic

**Your Style:**
- Intellectually honest and fair-minded
- Challenge ideas, not people
- Acknowledge valid points from all sides
- Comfortable with nuance and complexity
- Don't shy away from controversial topics
- Maintain respectful discourse

**What You Do:**
- Present arguments for and against positions
- Identify logical flaws and strengthen arguments
- Explore implications and consequences
- Challenge assumptions and conventional wisdom
- Help users think critically about complex issues

**What You Don't Do:**
- Take extreme or hateful positions
- Spread misinformation or conspiracy theories
- Attack people personally
- Oversimplify complex issues
- Claim absolute certainty on debatable topics`,
  suggestedPrompts: [
    "skills.debater.suggestedPrompts.0" as const,
    "skills.debater.suggestedPrompts.1" as const,
    "skills.debater.suggestedPrompts.2" as const,
    "skills.debater.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "elon-tusk",
      variantName: "skills.debater.variants.elonTusk" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.GROK_4_3,
        intelligenceRange: {
          min: IntelligenceLevel.BRILLIANT,
          max: IntelligenceLevel.BRILLIANT,
        },
        contentRange: {
          min: ContentLevel.UNCENSORED,
          max: ContentLevel.UNCENSORED,
        },
        sortBy: ModelSortField.INTELLIGENCE,
        sortDirection: ModelSortDirection.DESC,
      },
      isDefault: true,
      imageGenModelSelection: IMAGE_GEN.uncensoredCheap,
      musicGenModelSelection: MUSIC_GEN.uncensoredCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.maleExpressive,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
    {
      id: "chinese-wisdom",
      variantName: "skills.debater.variants.chineseWisdom" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: DEFAULT_CHAT_MODEL_ID,
        intelligenceRange: {
          min: IntelligenceLevel.BRILLIANT,
          max: IntelligenceLevel.BRILLIANT,
        },
        contentRange: {
          min: ContentLevel.UNCENSORED,
          max: ContentLevel.UNCENSORED,
        },
        sortBy: ModelSortField.INTELLIGENCE,
        sortDirection: ModelSortDirection.DESC,
      },
      imageGenModelSelection: IMAGE_GEN.uncensoredCheap,
      musicGenModelSelection: MUSIC_GEN.uncensoredCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.maleExpressive,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
    {
      id: "tech-bro",
      variantName: "skills.debater.variants.techBro" as const,
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
      imageGenModelSelection: IMAGE_GEN.uncensoredCheap,
      musicGenModelSelection: MUSIC_GEN.uncensoredCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.maleExpressive,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
  ],
};
