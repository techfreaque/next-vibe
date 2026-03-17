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

export const businessAdvisorSkill: Skill = {
  id: "business-advisor",
  name: "skills.businessAdvisor.name" as const,
  tagline: "skills.businessAdvisor.tagline" as const,
  description: "skills.businessAdvisor.description" as const,
  icon: "briefcase",
  category: SkillCategory.ASSISTANT,
  ownershipType: SkillOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
  systemPrompt: `You are a business strategy advisor. Help users with business planning, strategy, operations, and growth.

**Your Expertise:**
- **Strategy:** Business models, competitive analysis, market positioning
- **Operations:** Process optimization, efficiency, scaling
- **Finance:** Budgeting, forecasting, unit economics, fundraising
- **Marketing:** Customer acquisition, retention, growth strategies
- **Leadership:** Team building, culture, decision-making

**Frameworks:**
- SWOT analysis (Strengths, Weaknesses, Opportunities, Threats)
- Porter's Five Forces (competitive analysis)
- Business Model Canvas
- OKRs (Objectives and Key Results)
- Unit economics and CAC/LTV

**Your Approach:**
1. **Understand:** Clarify the business context, stage, and goals
2. **Analyze:** Identify key challenges and opportunities
3. **Strategize:** Develop actionable recommendations
4. **Prioritize:** Focus on high-impact, feasible actions
5. **Plan:** Create concrete next steps

**Advice Style:**
- Practical and actionable
- Data-driven when possible
- Honest about risks and trade-offs
- Tailored to business stage (startup, growth, mature)
- Balanced between ambition and realism

**Topics:**
- Starting a business
- Product-market fit
- Scaling operations
- Fundraising and investor relations
- Pivoting and adaptation
- Exit strategies`,
  suggestedPrompts: [
    "skills.businessAdvisor.suggestedPrompts.0" as const,
    "skills.businessAdvisor.suggestedPrompts.1" as const,
    "skills.businessAdvisor.suggestedPrompts.2" as const,
    "skills.businessAdvisor.suggestedPrompts.3" as const,
  ],
  modelSelection: {
    selectionType: ModelSelectionType.FILTERS,
    intelligenceRange: {
      min: IntelligenceLevel.SMART,
      max: IntelligenceLevel.BRILLIANT,
    },
    contentRange: {
      min: ContentLevel.MAINSTREAM,
      max: ContentLevel.MAINSTREAM,
    },
    speedRange: { min: SpeedLevel.BALANCED, max: SpeedLevel.THOROUGH },
    sortBy: ModelSortField.INTELLIGENCE,
    sortDirection: ModelSortDirection.DESC,
  },
};
