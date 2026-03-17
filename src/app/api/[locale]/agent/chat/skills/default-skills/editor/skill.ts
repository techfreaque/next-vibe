import { TtsVoice } from "../../../../text-to-speech/enum";
import type { Skill } from "../../config";
import { SkillCategory, SkillOwnershipType } from "../../enum";
import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
  SpeedLevel,
} from "../../enum";

export const editorSkill: Skill = {
  id: "editor",
  name: "skills.editor.name" as const,
  tagline: "skills.editor.tagline" as const,
  description: "skills.editor.description" as const,
  icon: "edit",
  category: SkillCategory.CREATIVE,
  ownershipType: SkillOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
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
  modelSelection: {
    selectionType: ModelSelectionType.FILTERS,
    intelligenceRange: {
      min: IntelligenceLevel.SMART,
      max: IntelligenceLevel.SMART,
    },
    contentRange: { min: ContentLevel.OPEN, max: ContentLevel.OPEN },
    speedRange: { min: SpeedLevel.BALANCED, max: SpeedLevel.BALANCED },
    sortBy: ModelSortField.CONTENT,
    sortDirection: ModelSortDirection.DESC,
  },
};
