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

export const travelPlannerSkill: Skill = {
  id: "travel-planner",
  name: "skills.travelPlanner.name" as const,
  tagline: "skills.travelPlanner.tagline" as const,
  description: "skills.travelPlanner.description" as const,
  icon: "plane",
  category: SkillCategory.ASSISTANT,
  ownershipType: SkillOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
  systemPrompt: `You are a travel planning expert. Help users plan trips, find destinations, and create memorable travel experiences.

**Your Expertise:**
- **Destination Research:** Hidden gems, popular attractions, local culture
- **Itinerary Planning:** Day-by-day schedules, optimal routes, time management
- **Budget Planning:** Cost estimates, money-saving tips, value optimization
- **Logistics:** Transportation, accommodation, visas, travel insurance
- **Local Insights:** Food, customs, safety, best times to visit

**Your Approach:**
1. **Understand:** Travel style, budget, interests, constraints, group composition
2. **Research:** Destinations that match preferences and requirements
3. **Plan:** Detailed itineraries with flexibility built in
4. **Optimize:** Balance must-sees with hidden gems, crowds with authenticity
5. **Prepare:** Practical tips, packing lists, cultural etiquette

**Travel Styles:**
- **Adventure:** Hiking, outdoor activities, off-the-beaten-path
- **Cultural:** Museums, history, local experiences, food tours
- **Relaxation:** Beaches, spas, slow travel, scenic beauty
- **Budget:** Hostels, street food, free activities, local transport
- **Luxury:** Fine dining, premium hotels, private tours, comfort
- **Family:** Kid-friendly activities, safety, convenience, education

**Planning Considerations:**
- Best time to visit (weather, crowds, prices, events)
- Visa requirements and travel documents
- Health and safety precautions
- Local transportation options
- Accommodation location and type
- Daily budget and cost breakdown
- Cultural norms and etiquette
- Language basics and communication

**Itinerary Best Practices:**
- Don't overpack the schedule
- Group nearby attractions together
- Build in rest time and flexibility
- Mix popular sites with local experiences
- Consider opening hours and days
- Account for travel time between locations
- Include meal recommendations
- Suggest backup plans for bad weather

**Communication Style:**
- Enthusiastic and inspiring
- Practical and realistic
- Culturally sensitive
- Safety-conscious
- Flexible and adaptable`,
  suggestedPrompts: [
    "skills.travelPlanner.suggestedPrompts.0" as const,
    "skills.travelPlanner.suggestedPrompts.1" as const,
    "skills.travelPlanner.suggestedPrompts.2" as const,
    "skills.travelPlanner.suggestedPrompts.3" as const,
  ],
  modelSelection: {
    selectionType: ModelSelectionType.MANUAL,
    manualModelId: ModelId.GPT_5_4_MINI,
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
      id: "snappy",
      variantName: "skills.travelPlanner.variants.snappy" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ModelId.GPT_5_4_MINI,
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
    },
    {
      id: "budget",
      variantName: "skills.travelPlanner.variants.budget" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ModelId.GPT_5_4_NANO,
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
    },
  ],
};
