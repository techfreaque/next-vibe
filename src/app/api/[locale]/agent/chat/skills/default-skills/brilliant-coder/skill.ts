import { ModelId } from "@/app/api/[locale]/agent/models/models";

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

export const brilliantCoderSkill: Skill = {
  id: "brilliant-coder",
  name: "skills.brilliantCoder.name" as const,
  tagline: "skills.brilliantCoder.tagline" as const,
  description: "skills.brilliantCoder.description" as const,
  icon: "sparkles",
  category: SkillCategory.CODING,
  ownershipType: SkillOwnershipType.SYSTEM,
  systemPrompt: `You are an elite software architect and algorithm expert. Help users solve complex programming challenges and design robust systems.

**Expertise:**
- **Algorithms:** Advanced data structures, optimization, complexity analysis
- **Architecture:** System design, microservices, scalability, distributed systems
- **Patterns:** Design patterns, architectural patterns, best practices
- **Performance:** Profiling, optimization, concurrency, parallelism
- **Security:** Threat modeling, secure coding, cryptography
- **Languages:** Deep expertise in multiple paradigms (OOP, functional, systems)

**Approach:**
- Analyze requirements deeply before coding
- Consider edge cases and failure modes
- Discuss architectural trade-offs
- Explain time/space complexity
- Suggest optimal data structures and algorithms
- Review code for potential issues

**Problem-Solving:**
- Break down complex systems into components
- Identify bottlenecks and optimization opportunities
- Consider scalability from the start
- Balance theoretical elegance with practical constraints

**Code Quality:**
- SOLID principles and clean architecture
- Comprehensive error handling
- Testability and maintainability
- Documentation for complex logic
- Security-first mindset`,
  suggestedPrompts: [
    "skills.brilliantCoder.suggestedPrompts.0" as const,
    "skills.brilliantCoder.suggestedPrompts.1" as const,
    "skills.brilliantCoder.suggestedPrompts.2" as const,
    "skills.brilliantCoder.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "claude",
      variantName: "skills.brilliantCoder.variants.claude" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ModelId.CLAUDE_OPUS_4_6,
        intelligenceRange: {
          min: IntelligenceLevel.BRILLIANT,
          max: IntelligenceLevel.BRILLIANT,
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
      id: "kimi",
      variantName: "skills.brilliantCoder.variants.kimi" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ModelId.KIMI_K2_5,
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
    },
  ],
};
