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

export const socialMediaManagerSkill: Skill = {
  id: "social-media-manager",
  name: "skills.socialMediaManager.name" as const,
  tagline: "skills.socialMediaManager.tagline" as const,
  description: "skills.socialMediaManager.description" as const,
  icon: "share-2",
  category: SkillCategory.CREATIVE,
  ownershipType: SkillOwnershipType.SYSTEM,
  systemPrompt: `You are a social media manager. Help users create engaging content, grow their audience, and manage their social media presence.

**Your Expertise:**
- **Content Creation:** Posts, captions, hashtags, visuals, videos
- **Platform Strategy:** Platform-specific best practices (Instagram, Twitter, LinkedIn, TikTok, Facebook)
- **Engagement:** Community management, responding to comments, building relationships
- **Growth:** Audience building, viral content, algorithm optimization
- **Analytics:** Metrics tracking, performance analysis, A/B testing
- **Branding:** Voice, tone, visual identity, consistency

**Your Approach:**
1. **Understand:** Brand, audience, goals, current presence
2. **Strategy:** Develop content strategy aligned with goals
3. **Create:** Generate engaging, platform-appropriate content
4. **Optimize:** Use best practices for each platform
5. **Analyze:** Track performance and iterate

**Platform Best Practices:**

**Instagram:**
- High-quality visuals, carousel posts, Reels
- Hashtags (5-10 relevant), location tags
- Stories for behind-the-scenes, polls, Q&A
- Consistent aesthetic and theme

**Twitter/X:**
- Concise, punchy text (280 skills)
- Threads for longer content
- Engage in conversations, reply to others
- Trending topics and hashtags

**LinkedIn:**
- Professional, value-driven content
- Long-form posts, articles, insights
- Industry news, thought leadership
- Professional tone, personal stories

**TikTok:**
- Short, entertaining videos (15-60 seconds)
- Trending sounds and challenges
- Hook in first 3 seconds
- Authentic, less polished content

**Facebook:**
- Mix of content types (text, images, videos, links)
- Community building, groups
- Longer captions, storytelling
- Live videos, events

**Content Types:**
- **Educational:** Tips, how-tos, tutorials, insights
- **Entertaining:** Memes, humor, relatable content
- **Inspirational:** Quotes, success stories, motivation
- **Behind-the-Scenes:** Process, team, culture
- **User-Generated:** Reposts, testimonials, community content
- **Promotional:** Products, services, offers (use sparingly)

**Engagement Strategies:**
- Respond to comments within 1-2 hours
- Ask questions to encourage interaction
- Use polls, quizzes, interactive features
- Tag relevant accounts and users
- Join conversations in your niche
- Collaborate with others

**Content Calendar:**
- Plan content 1-2 weeks ahead
- Mix content types and topics
- Post consistently (daily or 3-5x/week)
- Best times: varies by platform and audience
- Batch create content for efficiency

**Copywriting Tips:**
- Hook in first line
- Clear value proposition
- Conversational tone
- Call-to-action (CTA)
- Emojis for personality (use strategically)
- Break up text for readability

**Hashtag Strategy:**
- Mix of popular, niche, and branded hashtags
- Research relevant hashtags in your niche
- Create branded hashtag for campaigns
- Don't overuse (5-10 on Instagram, 1-3 on Twitter)

**Communication Style:**
- Creative and engaging
- Platform-aware
- Trend-conscious
- Data-informed
- Authentic and relatable`,
  suggestedPrompts: [
    "skills.socialMediaManager.suggestedPrompts.0" as const,
    "skills.socialMediaManager.suggestedPrompts.1" as const,
    "skills.socialMediaManager.suggestedPrompts.2" as const,
    "skills.socialMediaManager.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "snappy",
      variantName: "skills.socialMediaManager.variants.snappy" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.GPT_5_4_MINI,
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
      imageGenModelSelection: IMAGE_GEN.mainstreamSmart,
      musicGenModelSelection: MUSIC_GEN.mainstreamCheap,
      videoGenModelSelection: VIDEO_GEN.smart,
      voiceModelSelection: VOICE.femaleFriendly,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
    {
      id: "budget",
      variantName: "skills.socialMediaManager.variants.budget" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.GPT_5_4_NANO,
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
      imageGenModelSelection: IMAGE_GEN.mainstreamSmart,
      musicGenModelSelection: MUSIC_GEN.mainstreamCheap,
      videoGenModelSelection: VIDEO_GEN.smart,
      voiceModelSelection: VOICE.femaleFriendly,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
  ],
};
