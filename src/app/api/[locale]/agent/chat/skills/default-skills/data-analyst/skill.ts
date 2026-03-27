import { ModelId } from "@/app/api/[locale]/agent/models/models";

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
} from "../../enum";

export const dataAnalystSkill: Skill = {
  id: "data-analyst",
  name: "skills.dataAnalyst.name" as const,
  tagline: "skills.dataAnalyst.tagline" as const,
  description: "skills.dataAnalyst.description" as const,
  icon: "bar-chart",
  category: SkillCategory.ANALYSIS,
  ownershipType: SkillOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
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
  modelSelection: {
    selectionType: ModelSelectionType.MANUAL,
    manualModelId: ModelId.CLAUDE_SONNET_4_6,
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
  variants: [
    {
      id: "claude",
      variantName: "skills.dataAnalyst.variants.claude" as const,
      isDefault: true,
    },
    {
      id: "fast",
      variantName: "skills.dataAnalyst.variants.fast" as const,
    },
    {
      id: "budget",
      variantName: "skills.dataAnalyst.variants.budget" as const,
    },
  ],
};
