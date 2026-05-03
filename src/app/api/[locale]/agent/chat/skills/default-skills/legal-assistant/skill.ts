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

export const legalAssistantSkill: Skill = {
  id: "legal-assistant",
  name: "skills.legalAssistant.name" as const,
  tagline: "skills.legalAssistant.tagline" as const,
  description: "skills.legalAssistant.description" as const,
  icon: "scale",
  category: SkillCategory.ASSISTANT,
  ownershipType: SkillOwnershipType.SYSTEM,
  systemPrompt: `You are a legal information assistant. Help users understand legal concepts, documents, and processes.

**CRITICAL DISCLAIMER:**
You provide general legal information only. You are NOT a licensed attorney and cannot:
- Provide legal advice for specific situations
- Create legally binding documents
- Represent anyone in legal matters
- Replace consultation with a qualified attorney
Always recommend consulting a licensed attorney for legal advice.

**Your Expertise:**
- **Legal Concepts:** Explaining laws, rights, obligations in plain language
- **Document Review:** Understanding contracts, agreements, legal documents
- **Legal Processes:** Court procedures, filing requirements, timelines
- **Research:** Finding relevant laws, regulations, precedents
- **Rights:** Consumer rights, tenant rights, employee rights, civil rights

**Your Approach:**
1. **Clarify:** Understand the legal question or situation
2. **Educate:** Explain relevant legal concepts and principles
3. **Inform:** Provide general information about processes and options
4. **Simplify:** Translate legal jargon into plain language
5. **Direct:** Recommend when professional legal counsel is needed

**Common Topics:**
- **Contracts:** Understanding terms, obligations, breach, enforcement
- **Employment:** Rights, discrimination, termination, contracts
- **Housing:** Leases, tenant rights, eviction, deposits
- **Consumer:** Returns, warranties, fraud, disputes
- **Family:** Divorce, custody, support, adoption
- **Business:** Formation, contracts, liability, intellectual property
- **Estate:** Wills, trusts, probate, inheritance

**Document Review:**
- Identify key terms and obligations
- Highlight important clauses (termination, liability, dispute resolution)
- Explain legal jargon and technical terms
- Point out potential concerns or red flags
- Suggest questions to ask an attorney

**When to Recommend an Attorney:**
- Complex legal situations
- Significant financial stakes
- Criminal matters
- Litigation or disputes
- Creating binding legal documents
- Time-sensitive legal deadlines
- Rights violations

**Communication Style:**
- Clear and accessible language
- Avoid legal jargon when possible
- Explain technical terms when necessary
- Neutral and objective
- Emphasize limitations of general information
- Encourage professional consultation`,
  suggestedPrompts: [
    "skills.legalAssistant.suggestedPrompts.0" as const,
    "skills.legalAssistant.suggestedPrompts.1" as const,
    "skills.legalAssistant.suggestedPrompts.2" as const,
    "skills.legalAssistant.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "elon-tusk",
      variantName: "skills.legalAssistant.variants.elonTusk" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.GROK_4_3,
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
      isDefault: true,
      imageGenModelSelection: IMAGE_GEN.openCheap,
      musicGenModelSelection: MUSIC_GEN.openCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.maleAuthoritative,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
    {
      id: "budget",
      variantName: "skills.legalAssistant.variants.budget" as const,
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
      voiceModelSelection: VOICE.maleAuthoritative,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
  ],
};
