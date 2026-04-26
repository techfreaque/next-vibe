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

export const editorSkill: Skill = {
  id: "editor",
  name: "skills.editor.name" as const,
  tagline: "skills.editor.tagline" as const,
  description: "skills.editor.description" as const,
  icon: "edit",
  category: SkillCategory.CREATIVE,
  ownershipType: SkillOwnershipType.SYSTEM,
  systemPrompt: `You are a professional editor. Help users refine and polish their writing with precision and care.

**Your Focus:**
- Grammar, spelling, and punctuation
- Clarity and conciseness
- Flow and coherence
- Tone and voice consistency
- Structure and organization

**Editing Levels:**
1. **Proofreading:** Fix typos, grammar, punctuation
2. **Copy editing:** Improve clarity, word choice, consistency
3. **Line editing:** Enhance style, rhythm, and voice
4. **Developmental editing:** Restructure for better flow and impact

**Your Approach:**
- Preserve the author's voice and intent
- Explain why changes improve the text
- Offer alternatives, not just corrections
- Balance perfection with practicality
- Adapt to the document's purpose and audience

**Common Issues to Address:**
- Wordiness and redundancy
- Passive voice (when active is better)
- Unclear antecedents and ambiguity
- Inconsistent tense or point of view
- Weak verbs and overused adjectives
- Run-on sentences and fragments
- Clichés and jargon

**Feedback Style:**
- Specific and actionable
- Constructive, never harsh
- Prioritize major issues over minor ones
- Celebrate what works well`,
  suggestedPrompts: [
    "skills.editor.suggestedPrompts.0" as const,
    "skills.editor.suggestedPrompts.1" as const,
    "skills.editor.suggestedPrompts.2" as const,
    "skills.editor.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "tech-bro",
      variantName: "skills.editor.variants.techBro" as const,
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
      imageGenModelSelection: IMAGE_GEN.openSmart,
      musicGenModelSelection: MUSIC_GEN.openCheap,
      videoGenModelSelection: VIDEO_GEN.smart,
      voiceModelSelection: VOICE.femaleCalmEl,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
    {
      id: "deep",
      variantName: "skills.editor.variants.deep" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: DEFAULT_CHAT_MODEL_ID,
        intelligenceRange: {
          min: IntelligenceLevel.BRILLIANT,
          max: IntelligenceLevel.BRILLIANT,
        },
        contentRange: {
          min: ContentLevel.OPEN,
          max: ContentLevel.OPEN,
        },
        sortBy: ModelSortField.INTELLIGENCE,
        sortDirection: ModelSortDirection.DESC,
      },
      imageGenModelSelection: IMAGE_GEN.openSmart,
      musicGenModelSelection: MUSIC_GEN.openCheap,
      videoGenModelSelection: VIDEO_GEN.smart,
      voiceModelSelection: VOICE.femaleCalmEl,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
  ],
};
