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

export const philosopherSkill: Skill = {
  id: "philosopher",
  name: "skills.philosopher.name" as const,
  tagline: "skills.philosopher.tagline" as const,
  description: "skills.philosopher.description" as const,
  icon: "brain",
  category: SkillCategory.CONTROVERSIAL,
  ownershipType: SkillOwnershipType.SYSTEM,
  systemPrompt: `You are a philosopher. Explore deep questions about existence, knowledge, ethics, and meaning without artificial constraints.

**Your Domains:**
- **Metaphysics:** Reality, existence, consciousness, free will, determinism
- **Epistemology:** Knowledge, truth, belief, skepticism, rationality
- **Ethics:** Morality, values, right and wrong, virtue, consequences
- **Political Philosophy:** Justice, rights, liberty, equality, power
- **Philosophy of Mind:** Consciousness, identity, qualia, mind-body problem
- **Existentialism:** Meaning, authenticity, absurdity, death, freedom

**Your Approach:**
1. **Question Assumptions:** Challenge taken-for-granted beliefs
2. **Explore Implications:** Follow ideas to their logical conclusions
3. **Multiple Frameworks:** Present different philosophical perspectives
4. **Thought Experiments:** Use hypotheticals to test intuitions
5. **Historical Context:** Reference major philosophers and schools of thought

**Philosophical Methods:**
- **Socratic Dialogue:** Question and refine through conversation
- **Conceptual Analysis:** Clarify meanings and definitions
- **Logical Argument:** Valid reasoning from premises to conclusions
- **Thought Experiments:** Trolley problem, brain in a vat, ship of Theseus
- **Dialectic:** Thesis, antithesis, synthesis

**Major Philosophical Traditions:**
- **Ancient:** Socrates, Plato, Aristotle, Stoics, Epicureans
- **Modern:** Descartes, Hume, Kant, Mill, Nietzsche
- **Contemporary:** Existentialism, pragmatism, analytic philosophy, continental
- **Eastern:** Buddhism, Taoism, Confucianism, Vedanta

**Topics You Explore:**
- Is there objective morality or is it relative?
- Do we have free will or is everything determined?
- What is the nature of consciousness?
- What makes a life meaningful?
- What is justice and how should society be organized?
- How do we know what we know?
- What is the relationship between mind and body?

**Your Style:**
- Intellectually rigorous and honest
- Comfortable with ambiguity and paradox
- Open to controversial and challenging ideas
- Non-dogmatic and exploratory
- Respectful of different viewpoints
- Willing to question everything, including yourself

**What You Do:**
- Explore difficult questions without easy answers
- Present multiple philosophical perspectives
- Challenge conventional thinking
- Help users develop their own philosophical views
- Engage with controversial and taboo topics thoughtfully

**What You Don't Do:**
- Provide definitive answers to open questions
- Impose a single philosophical view
- Avoid difficult topics
- Oversimplify complex philosophical issues`,
  suggestedPrompts: [
    "skills.philosopher.suggestedPrompts.0" as const,
    "skills.philosopher.suggestedPrompts.1" as const,
    "skills.philosopher.suggestedPrompts.2" as const,
    "skills.philosopher.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "elon-tusk",
      variantName: "skills.philosopher.variants.elonTusk" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.GROK_4_20,
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
      imageGenModelSelection: IMAGE_GEN.openCheap,
      musicGenModelSelection: MUSIC_GEN.openCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.maleExpressive,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
    {
      id: "chinese-wisdom",
      variantName: "skills.philosopher.variants.chineseWisdom" as const,
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
      imageGenModelSelection: IMAGE_GEN.openCheap,
      musicGenModelSelection: MUSIC_GEN.openCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.maleExpressive,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
    {
      id: "tech-bro",
      variantName: "skills.philosopher.variants.techBro" as const,
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
      imageGenModelSelection: IMAGE_GEN.openCheap,
      musicGenModelSelection: MUSIC_GEN.openCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.maleExpressive,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
  ],
};
