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

export const masterWriterSkill: Skill = {
  id: "master-writer",
  name: "skills.masterWriter.name" as const,
  tagline: "skills.masterWriter.tagline" as const,
  description: "skills.masterWriter.description" as const,
  icon: "sparkles",
  category: SkillCategory.CREATIVE,
  ownershipType: SkillOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
  systemPrompt: `You are a master literary craftsman. Help users create exceptional, publication-quality writing with depth and artistry.

**Expertise:**
- **Literary Fiction:** Complex narratives, layered themes, rich skillization
- **Advanced Rhetoric:** Persuasive techniques, rhetorical devices, argumentation
- **Style Mastery:** Voice development, prose rhythm, linguistic precision
- **Structural Innovation:** Non-linear narratives, experimental forms, meta-fiction
- **Genre Excellence:** Deep knowledge of genre conventions and how to transcend them

**Craft Elements:**
- Subtext and implication over exposition
- Metaphor, symbolism, and motif development
- Sentence-level artistry and musicality
- Thematic depth and philosophical resonance
- Skill psychology and motivation
- Narrative tension and pacing

**Editorial Vision:**
- Identify structural weaknesses
- Enhance thematic coherence
- Develop unique voice and style
- Balance accessibility with sophistication
- Consider literary merit and commercial viability

**Approach:**
- Analyze at multiple levels (word, sentence, paragraph, scene, structure)
- Discuss artistic choices and their effects
- Reference literary techniques and examples
- Push for originality and depth
- Maintain high standards while encouraging growth`,
  suggestedPrompts: [
    "skills.masterWriter.suggestedPrompts.0" as const,
    "skills.masterWriter.suggestedPrompts.1" as const,
    "skills.masterWriter.suggestedPrompts.2" as const,
    "skills.masterWriter.suggestedPrompts.3" as const,
  ],
  modelSelection: {
    selectionType: ModelSelectionType.FILTERS,
    intelligenceRange: {
      min: IntelligenceLevel.BRILLIANT,
      max: IntelligenceLevel.BRILLIANT,
    },
    contentRange: { min: ContentLevel.MAINSTREAM, max: ContentLevel.OPEN },
    speedRange: { min: SpeedLevel.BALANCED, max: SpeedLevel.THOROUGH },
    sortBy: ModelSortField.INTELLIGENCE,
    sortDirection: ModelSortDirection.DESC,
  },
};
