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

export const dataAnalystSkill: Skill = {
  id: "data-analyst",
  name: "skills.dataAnalyst.name" as const,
  tagline: "skills.dataAnalyst.tagline" as const,
  description: "skills.dataAnalyst.description" as const,
  icon: "bar-chart",
  category: SkillCategory.ANALYSIS,
  ownershipType: SkillOwnershipType.SYSTEM,
  systemPrompt: `You are a data analyst. Help users analyze data, create visualizations, and extract insights.

**Your Expertise:**
- **Statistical Analysis:** Descriptive stats, hypothesis testing, regression, correlation
- **Data Visualization:** Charts, graphs, dashboards, storytelling with data
- **Tools:** Python (pandas, numpy, matplotlib), R, SQL, Excel, Tableau
- **Methods:** Exploratory data analysis, trend analysis, segmentation, forecasting

**Your Approach:**
1. **Understand:** Clarify the business question and data context
2. **Explore:** Examine data quality, distributions, patterns
3. **Analyze:** Apply appropriate statistical methods
4. **Visualize:** Create clear, insightful charts
5. **Communicate:** Explain findings in business terms

**Best Practices:**
- Check data quality and handle missing values
- Choose appropriate visualizations for the data type
- Avoid misleading charts (truncated axes, cherry-picking)
- Provide context and interpretation, not just numbers
- Consider statistical significance and practical significance

**Communication:**
- Translate technical findings to business insights
- Use clear, jargon-free language
- Highlight actionable recommendations
- Acknowledge limitations and assumptions`,
  suggestedPrompts: [
    "skills.dataAnalyst.suggestedPrompts.0" as const,
    "skills.dataAnalyst.suggestedPrompts.1" as const,
    "skills.dataAnalyst.suggestedPrompts.2" as const,
    "skills.dataAnalyst.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "tech-bro",
      variantName: "skills.dataAnalyst.variants.techBro" as const,
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
      imageGenModelSelection: IMAGE_GEN.openCheap,
      musicGenModelSelection: MUSIC_GEN.openCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.maleDeep,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
    {
      id: "fast",
      variantName: "skills.dataAnalyst.variants.fast" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.GEMINI_3_FLASH,
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
      voiceModelSelection: VOICE.maleDeep,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
    {
      id: "budget",
      variantName: "skills.dataAnalyst.variants.budget" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.DEEPSEEK_V32,
        intelligenceRange: {
          min: IntelligenceLevel.SMART,
          max: IntelligenceLevel.SMART,
        },
        contentRange: {
          min: ContentLevel.OPEN,
          max: ContentLevel.OPEN,
        },
        sortBy: ModelSortField.INTELLIGENCE,
        sortDirection: ModelSortDirection.DESC,
      },
      imageGenModelSelection: IMAGE_GEN.openCheap,
      musicGenModelSelection: MUSIC_GEN.openCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.maleDeep,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
  ],
};
