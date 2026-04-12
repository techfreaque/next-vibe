/**
 * Skills Database Schema
 * Database tables for custom user skills
 */

import { relations } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import {
  CHAT_MODE_IDS,
  type ChatMode,
} from "@/app/api/[locale]/agent/models/enum";
import { chatModelSelectionSchema } from "@/app/api/[locale]/agent/ai-stream/models";
import type { ChatModelSelection } from "@/app/api/[locale]/agent/ai-stream/models";
import {
  audioVisionModelSelectionSchema,
  imageVisionModelSelectionSchema,
  videoVisionModelSelectionSchema,
} from "@/app/api/[locale]/agent/ai-stream/vision-models";
import type {
  AudioVisionModelSelection,
  ImageVisionModelSelection,
  VideoVisionModelSelection,
} from "@/app/api/[locale]/agent/ai-stream/vision-models";
import { imageGenModelSelectionSchema } from "@/app/api/[locale]/agent/image-generation/models";
import type { ImageGenModelSelection } from "@/app/api/[locale]/agent/image-generation/models";
import { musicGenModelSelectionSchema } from "@/app/api/[locale]/agent/music-generation/models";
import type { MusicGenModelSelection } from "@/app/api/[locale]/agent/music-generation/models";
import { sttModelSelectionSchema } from "@/app/api/[locale]/agent/speech-to-text/models";
import type { SttModelSelection } from "@/app/api/[locale]/agent/speech-to-text/models";
import { voiceModelSelectionSchema } from "@/app/api/[locale]/agent/text-to-speech/models";
import type { VoiceModelSelection } from "@/app/api/[locale]/agent/text-to-speech/models";
import { videoGenModelSelectionSchema } from "@/app/api/[locale]/agent/video-generation/models";
import { iconSchema } from "@/app/api/[locale]/shared/types/common.schema";
import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { users } from "@/app/api/[locale]/user/db";

import type { VideoGenModelId } from "../../video-generation/models";
import type { ToolConfigItem } from "../settings/definition";
import type {
  SkillCategoryValue,
  SkillOwnershipTypeValue,
  SkillStatusValue,
  SkillTrustLevelValue,
  SkillTypeValue,
} from "./enum";
import { SkillTrustLevel, SkillTrustLevelDB } from "./enum";

/**
 * Custom Skills Table
 * Stores user-created skills (system prompts, preferences)
 * Default skills are defined in config file and not stored in DB
 */
export const customSkills = pgTable(
  "custom_skills",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Human-readable slug (globally unique, set on create, immutable)
    slug: text("slug").notNull().default(""),

    // Owner
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Skill details
    name: text("name").notNull(),
    description: text("description").notNull(),
    tagline: text("tagline").notNull(),
    icon: text("icon").$type<IconKey>().notNull(),
    systemPrompt: text("system_prompt"),

    // Categorization
    category: text("category").$type<typeof SkillCategoryValue>().notNull(),

    // Voice model selection (null = cascade to user settings → system default)
    voiceModelSelection: jsonb(
      "voice_model_selection",
    ).$type<VoiceModelSelection>(),

    // STT model selection (null = cascade to user settings → system default)
    sttModelSelection: jsonb("stt_model_selection").$type<SttModelSelection>(),

    // Vision model selections per modality (null = cascade to user settings → system default)
    imageVisionModelSelection: jsonb(
      "image_vision_model_selection",
    ).$type<ImageVisionModelSelection>(),
    videoVisionModelSelection: jsonb(
      "video_vision_model_selection",
    ).$type<VideoVisionModelSelection>(),
    audioVisionModelSelection: jsonb(
      "audio_vision_model_selection",
    ).$type<AudioVisionModelSelection>(),

    // Default chat mode for this skill (null = cascade to user settings → "text")
    defaultChatMode: text("default_chat_mode").$type<ChatMode>(),

    // Image/music/video gen model selections (null = cascade to user settings → system default)
    imageGenModelSelection: jsonb(
      "image_gen_model_selection",
    ).$type<ImageGenModelSelection>(),
    musicGenModelSelection: jsonb(
      "music_gen_model_selection",
    ).$type<MusicGenModelSelection>(),
    videoGenModelId: text("video_gen_model_id").$type<VideoGenModelId>(),

    // Model selection (discriminated union from API)
    // Kept for backward compat - always synced from the default variant's modelSelection
    modelSelection: jsonb("model_selection")
      .$type<ChatModelSelection>()
      .notNull(),

    // Named variants with per-variant model selections (null = legacy single-variant skill)
    variants: jsonb("variants").$type<SkillVariantData[]>(),

    // Ownership type (determines visibility: USER=private, PUBLIC=shared, SYSTEM=built-in)
    ownershipType: text("ownership_type")
      .$type<typeof SkillOwnershipTypeValue>()
      .notNull(),

    // Auto-compacting token threshold (null = use global/settings default)
    compactTrigger: integer("compact_trigger"),

    // Memory budget in chars (null = inherit from user settings; overrides user default for this skill)
    memoryLimit: integer("memory_limit"),

    // Tool configuration - null = inherit from settings (default)
    availableTools: jsonb("active_tools").$type<ToolConfigItem[] | null>(),
    pinnedTools: jsonb("visible_tools").$type<ToolConfigItem[] | null>(),
    // Tools blocked at skill level regardless of favorites/user settings
    deniedTools: jsonb("denied_tools").$type<ToolConfigItem[] | null>(),

    // Runtime behavior type (PERSONA | SPECIALIST | TOOL_BUNDLE)
    skillType: text("skill_type").$type<typeof SkillTypeValue>(),

    // Publishing status (DRAFT | PUBLISHED | UNLISTED)
    status: text("status").$type<typeof SkillStatusValue>(),

    // Companion soul fragment - prepended to sub-agent system prompt on ai-run
    companionPrompt: text("companion_prompt"),

    // Community store metrics (for published skills)
    voteCount: integer("vote_count").notNull().default(0),
    reportCount: integer("report_count").notNull().default(0),
    // Trust level: COMMUNITY (default) → VERIFIED (auto-upgraded at vote threshold)
    trustLevel: text("trust_level", { enum: SkillTrustLevelDB })
      .notNull()
      .default(SkillTrustLevel.COMMUNITY)
      .$type<typeof SkillTrustLevelValue>(),

    // Creator long-form content (markdown, no length limit)
    longContent: text("long_content"),

    // Lightweight versioning - set when status transitions to PUBLISHED
    publishedAt: timestamp("published_at"),
    changeNote: text("change_note"),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: unique("custom_skills_slug_idx").on(table.slug),
  }),
);

/**
 * Skill Votes Table
 * One vote per user per skill (unique constraint enforces idempotency)
 */
export const skillVotes = pgTable(
  "skill_votes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    skillId: uuid("skill_id")
      .notNull()
      .references(() => customSkills.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    skillUserIdx: uniqueIndex("skill_votes_skill_user_idx").on(
      table.skillId,
      table.userId,
    ),
  }),
);

export const selectSkillVoteSchema = createSelectSchema(skillVotes);
export const insertSkillVoteSchema = createInsertSchema(skillVotes);
export type SkillVote = typeof skillVotes.$inferSelect;
export type NewSkillVote = typeof skillVotes.$inferInsert;

/**
 * Skill Reports Table
 * One report per user per skill (unique constraint enforces idempotency)
 */
export const skillReports = pgTable(
  "skill_reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    skillId: uuid("skill_id")
      .notNull()
      .references(() => customSkills.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    reason: text("reason").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    skillUserIdx: uniqueIndex("skill_reports_skill_user_idx").on(
      table.skillId,
      table.userId,
    ),
  }),
);

export const selectSkillReportSchema = createSelectSchema(skillReports);
export const insertSkillReportSchema = createInsertSchema(skillReports);
export type SkillReport = typeof skillReports.$inferSelect;
export type NewSkillReport = typeof skillReports.$inferInsert;

/**
 * Relations
 */
export const customSkillsRelations = relations(
  customSkills,
  ({ one, many }) => ({
    user: one(users, {
      fields: [customSkills.userId],
      references: [users.id],
    }),
    votes: many(skillVotes),
    reports: many(skillReports),
  }),
);

export const skillVotesRelations = relations(skillVotes, ({ one }) => ({
  skill: one(customSkills, {
    fields: [skillVotes.skillId],
    references: [customSkills.id],
  }),
  user: one(users, {
    fields: [skillVotes.userId],
    references: [users.id],
  }),
}));

export const skillReportsRelations = relations(skillReports, ({ one }) => ({
  skill: one(customSkills, {
    fields: [skillReports.skillId],
    references: [customSkills.id],
  }),
  user: one(users, {
    fields: [skillReports.userId],
    references: [users.id],
  }),
}));

/**
 * Schema for selecting custom skills
 */
export const selectCustomSkillSchema = createSelectSchema(customSkills, {
  icon: iconSchema,
});

/**
 * Schema for inserting custom skills
 */
export const insertCustomSkillSchema = createInsertSchema(customSkills, {
  icon: iconSchema,
});

/**
 * Type for custom skill model - uses Drizzle's $inferSelect to respect .$type annotations
 */
export type CustomSkill = typeof customSkills.$inferSelect;

/**
 * Type for new custom skill model - uses Drizzle's $inferInsert to respect .$type annotations
 */
export type NewCustomSkill = typeof customSkills.$inferInsert;

// ============================================================
// SKILL VARIANT SCHEMA
// Cross-domain aggregate: all model selections for one skill variant
// ============================================================

export const skillVariantSchema = z.object({
  id: z.string(),
  displayName: z.string().max(50).optional(),
  modelSelection: chatModelSelectionSchema,
  imageGenModelSelection: imageGenModelSelectionSchema.optional(),
  musicGenModelSelection: musicGenModelSelectionSchema.optional(),
  videoGenModelSelection: videoGenModelSelectionSchema.optional(),
  voiceModelSelection: voiceModelSelectionSchema.optional(),
  sttModelSelection: sttModelSelectionSchema.optional(),
  imageVisionModelSelection: imageVisionModelSelectionSchema.optional(),
  videoVisionModelSelection: videoVisionModelSelectionSchema.optional(),
  audioVisionModelSelection: audioVisionModelSelectionSchema.optional(),
  defaultChatMode: z.enum(CHAT_MODE_IDS).optional(),
  isDefault: z.boolean().optional(),
});

export type SkillVariantData = z.infer<typeof skillVariantSchema>;
