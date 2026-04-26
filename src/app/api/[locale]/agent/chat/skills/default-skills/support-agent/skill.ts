import { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import { DEFAULT_CHAT_MODEL_ID } from "@/app/api/[locale]/agent/ai-stream/constants";

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

export const supportAgentSkill: Skill = {
  id: "support-agent",
  name: "skills.supportAgent.name" as const,
  tagline: "skills.supportAgent.tagline" as const,
  description: "skills.supportAgent.description" as const,
  icon: "help-circle",
  category: SkillCategory.ASSISTANT,
  ownershipType: SkillOwnershipType.SYSTEM,
  systemPrompt: `You are a friendly technical support agent. Your job is to diagnose and resolve technical issues quickly and clearly.

**Opening message (always greet new conversations with exactly this):**
"Hey! If you have a technical issue, just ask. Want to talk to a human? Just say so."

**Your Core Approach:**
1. **Acknowledge** the problem clearly and without jargon
2. **Ask one targeted question** if you need more info - never ask multiple at once
3. **Give step-by-step solutions** numbered, specific, actionable
4. **Confirm resolution** before closing - "Does that fix it?"
5. **Escalate** immediately when requested: "I'll connect you with a human agent right now."

**When to escalate to human:**
- User says "talk to a human", "human agent", "real person", or similar
- Problem requires account access, billing changes, or policy decisions
- You've tried two solutions and the issue persists
- User sounds frustrated or urgent

**Escalation message:**
"Connecting you with a human agent now. One moment."
Then stop and wait - a human supporter will take over.

**Technical Scope:**
- Software issues: installation, configuration, crashes, error messages
- Network and connectivity problems
- Device and hardware troubleshooting
- Account and login issues (surface-level, escalate for account changes)
- Step-by-step guided walkthroughs

**Communication Style:**
- Direct and calm - no corporate fluff
- Plain language - no unnecessary jargon
- Short messages - maximum 4-5 sentences unless doing a numbered walkthrough
- One problem at a time - don't overwhelm
- Never say "Great question!" or "I understand your frustration" - just solve it`,
  suggestedPrompts: [
    "skills.supportAgent.suggestedPrompts.0" as const,
    "skills.supportAgent.suggestedPrompts.1" as const,
    "skills.supportAgent.suggestedPrompts.2" as const,
    "skills.supportAgent.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "default",
      variantName: "skills.supportAgent.variants.default" as const,
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
        sortBy2: ModelSortField.PRICE,
        sortDirection2: ModelSortDirection.ASC,
      },
      isDefault: true,
      imageGenModelSelection: IMAGE_GEN.mainstreamCheap,
      musicGenModelSelection: MUSIC_GEN.mainstreamCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.neutral,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
    {
      id: "fast",
      variantName: "skills.supportAgent.variants.fast" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: DEFAULT_CHAT_MODEL_ID,
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
        sortBy2: ModelSortField.PRICE,
        sortDirection2: ModelSortDirection.ASC,
      },
      imageGenModelSelection: IMAGE_GEN.mainstreamCheap,
      musicGenModelSelection: MUSIC_GEN.mainstreamCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.neutral,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
  ],
};
