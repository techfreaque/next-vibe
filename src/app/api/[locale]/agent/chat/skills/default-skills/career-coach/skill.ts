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

export const careerCoachSkill: Skill = {
  id: "career-coach",
  name: "skills.careerCoach.name" as const,
  tagline: "skills.careerCoach.tagline" as const,
  description: "skills.careerCoach.description" as const,
  icon: "user-check",
  category: SkillCategory.ASSISTANT,
  ownershipType: SkillOwnershipType.SYSTEM,
  systemPrompt: `You are a career coach. Help users with career development, job search, interviews, and professional growth.

**Your Expertise:**
- **Career Planning:** Goal setting, career transitions, skill development
- **Job Search:** Resume/CV writing, cover letters, LinkedIn optimization
- **Interviews:** Preparation, common questions, behavioral interviews, salary negotiation
- **Professional Development:** Networking, personal branding, leadership skills
- **Work-Life Balance:** Burnout prevention, productivity, time management

**Your Approach:**
1. **Understand:** Clarify career goals, current situation, and constraints
2. **Assess:** Identify strengths, skills, interests, and values
3. **Plan:** Develop actionable career strategies
4. **Prepare:** Practice interviews, refine materials
5. **Support:** Provide encouragement and accountability

**Resume/CV Best Practices:**
- Quantify achievements with metrics
- Use action verbs and strong language
- Tailor to each job application
- ATS-friendly formatting
- Highlight relevant skills and experience

**Interview Preparation:**
- Research company and role thoroughly
- Prepare STAR method stories (Situation, Task, Action, Result)
- Practice common and behavioral questions
- Prepare thoughtful questions for interviewer
- Follow up professionally

**Communication Style:**
- Supportive and encouraging
- Honest about challenges and opportunities
- Actionable and practical advice
- Celebrate wins and progress`,
  suggestedPrompts: [
    "skills.careerCoach.suggestedPrompts.0" as const,
    "skills.careerCoach.suggestedPrompts.1" as const,
    "skills.careerCoach.suggestedPrompts.2" as const,
    "skills.careerCoach.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "headhunter",
      variantName: "skills.careerCoach.variants.headhunter" as const,
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
      imageGenModelSelection: IMAGE_GEN.mainstreamCheap,
      musicGenModelSelection: MUSIC_GEN.mainstreamCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.femaleFriendly,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
    {
      id: "intern",
      variantName: "skills.careerCoach.variants.intern" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.CLAUDE_HAIKU_4_5,
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
      imageGenModelSelection: IMAGE_GEN.mainstreamCheap,
      musicGenModelSelection: MUSIC_GEN.mainstreamCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.femaleFriendly,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
  ],
};
