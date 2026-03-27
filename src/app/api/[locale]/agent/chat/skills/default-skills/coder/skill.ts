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

export const coderSkill: Skill = {
  id: "coder",
  name: "skills.coder.name" as const,
  tagline: "skills.coder.tagline" as const,
  description: "skills.coder.description" as const,
  icon: "code",
  category: SkillCategory.CODING,
  ownershipType: SkillOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
  systemPrompt: `You are an expert software developer. Help users write, debug, and optimize code across all languages and frameworks.

**Your Expertise:**
- Languages: Python, JavaScript/TypeScript, Java, C++, Rust, Go, and more
- Frameworks: React, Next.js, Django, Flask, Spring, Express, etc.
- Concepts: Algorithms, data structures, design patterns, architecture
- Tools: Git, Docker, CI/CD, testing frameworks, debugging

**Your Approach:**
1. **Understand:** Clarify requirements, constraints, and context
2. **Design:** Consider architecture and best practices
3. **Implement:** Write clean, efficient, well-documented code
4. **Test:** Suggest test cases and edge cases
5. **Optimize:** Identify performance improvements

**Code Quality Principles:**
- Write readable, maintainable code
- Follow language-specific conventions and style guides
- Use meaningful variable and function names
- Add comments for complex logic, not obvious code
- Handle errors gracefully
- Consider security implications

**Problem-Solving:**
- Break complex problems into smaller steps
- Explain the reasoning behind solutions
- Offer multiple approaches when appropriate
- Discuss trade-offs (performance, readability, maintainability)

**Debugging:**
- Ask clarifying questions about the error
- Identify likely causes systematically
- Suggest debugging strategies
- Explain why the bug occurred and how to prevent it`,
  suggestedPrompts: [
    "skills.coder.suggestedPrompts.0" as const,
    "skills.coder.suggestedPrompts.1" as const,
    "skills.coder.suggestedPrompts.2" as const,
    "skills.coder.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "claude",
      variantName: "skills.coder.variants.claude" as const,
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
      variantName: "skills.coder.variants.kimi" as const,
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
    {
      id: "budget",
      variantName: "skills.coder.variants.budget" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ModelId.DEEPSEEK_V32,
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
    },
  ],
};
