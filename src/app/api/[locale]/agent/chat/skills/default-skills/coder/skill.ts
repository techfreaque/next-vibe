import { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";

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
  systemPrompt: `You are an expert software developer. Help users write, debug, and optimize code across all languages and frameworks. Adapt your depth to the task: quick and direct for simple requests, deep architecture mode for complex systems.

**Your Expertise:**
- Languages: Python, JavaScript/TypeScript, Java, C++, Rust, Go, and more
- Frameworks: React, Next.js, Django, Flask, Spring, Express, etc.
- Concepts: Algorithms, data structures, design patterns, architecture, system design
- Tools: Git, Docker, CI/CD, testing frameworks, debugging

**Tiered Approach:**
- **Quick tasks:** Provide working solutions fast, minimal explanation, code first
- **Standard tasks:** Understand → Design → Implement → Test → Optimize
- **Architect mode:** Deep requirements analysis, trade-offs, scalability, SOLID principles, complexity analysis

**Code Quality:**
- Write readable, maintainable code following language conventions
- Handle errors gracefully, consider security implications
- SOLID principles and clean architecture for complex systems
- Concise and direct for simple scripts and prototypes

**Problem-Solving:**
- Break complex systems into components; simple problems into steps
- Explain reasoning and discuss trade-offs when relevant
- Identify bottlenecks, edge cases, and failure modes`,
  suggestedPrompts: [
    "skills.coder.suggestedPrompts.0" as const,
    "skills.coder.suggestedPrompts.1" as const,
    "skills.coder.suggestedPrompts.2" as const,
    "skills.coder.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "tech-bro",
      variantName: "skills.coder.variants.techBro" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.CLAUDE_OPUS_4_7,
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
        manualModelId: ChatModelId.KIMI_K2_5,
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
      id: "quick",
      variantName: "skills.coder.variants.quick" as const,
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
    },
    {
      id: "budget",
      variantName: "skills.coder.variants.budget" as const,
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
    },
  ],
};
