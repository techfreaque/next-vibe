/**
 * Skills Database Schema
 * Database tables for custom user skills
 */

import { relations } from "drizzle-orm";
import {
  boolean,
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
import { iconSchema } from "next-vibe/core/definition/common.schema";
import { users } from "next-vibe/identity/user/db";
import type { IconKey } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icons";
import { z } from "zod";

import type { ChatModelSelection } from "../ai-stream/models";
import { chatModelSelectionSchema } from "../ai-stream/models";
import type {
  AudioVisionModelSelection,
  ImageVisionModelSelection,
  VideoVisionModelSelection,
} from "../ai-stream/vision-models";
import {
  audioVisionModelSelectionSchema,
  imageVisionModelSelectionSchema,
  videoVisionModelSelectionSchema,
} from "../ai-stream/vision-models";
import type { ToolConfigItem } from "../chat/settings/definition";
import type { ImageGenModelSelection } from "../image-generation/models";
import { imageGenModelSelectionSchema } from "../image-generation/models";
import type { MusicGenModelSelection } from "../music-generation/models";
import { musicGenModelSelectionSchema } from "../music-generation/models";
import type { SttModelSelection } from "../speech-to-text/models";
import { sttModelSelectionSchema } from "../speech-to-text/models";
import type { VoiceModelSelection } from "../text-to-speech/models";
import { voiceModelSelectionSchema } from "../text-to-speech/models";
import type { VideoGenModelSelection } from "../video-generation/models";
import type { VideoGenModelId } from "../video-generation/models";
import { videoGenModelSelectionSchema } from "../video-generation/models";
import type {
  SkillCategoryValue,
  SkillOwnershipTypeValue,
  SkillStatusValue,
  SkillTrustLevelValue,
  SkillTypeValue,
  SkillVoteDirectionValue,
} from "./enum";
import {
  SkillTrustLevel,
  SkillTrustLevelDB,
  SkillVoteDirection,
  SkillVoteDirectionDB,
} from "./enum";

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

    // Image/music/video gen model selections (null = cascade to user settings → system default)
    imageGenModelSelection: jsonb(
      "image_gen_model_selection",
    ).$type<ImageGenModelSelection>(),
    musicGenModelSelection: jsonb(
      "music_gen_model_selection",
    ).$type<MusicGenModelSelection>(),
    videoGenModelId: text("video_gen_model_id").$type<VideoGenModelId>(),

    // Named variants with per-variant model selections
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

    // Soft-delete for tombstone propagation across connected instances.
    isDeleted: boolean("is_deleted").default(false).notNull(),

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
    // Vote direction: UP (helpful) or DOWN (not helpful). Net score on the
    // skill = count(UP) - count(DOWN). Existing rows default to UP (back-compat
    // with the previous upvote-only model).
    direction: text("direction", { enum: SkillVoteDirectionDB })
      .notNull()
      .default(SkillVoteDirection.UP)
      .$type<typeof SkillVoteDirectionValue>(),
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

/**
 * One skill variant: a name + the full set of per-modality model selections.
 *
 * Declared EXPLICITLY (not `z.infer`) and the schema is annotated
 * `z.ZodType<SkillVariantData>`. This pins `z.output<skillVariantSchema>` to this
 * named type so consumers (e.g. `InferRequestOutput` when this field is part of a
 * request) resolve it as `SkillVariantData[]` shallowly instead of re-deriving the
 * nine nested discriminated-union model-selection types every time — which exceeds
 * TS's instantiation-depth limit and collapses event-payload Picks to `never`.
 *
 * A type alias, NOT an interface: this rides an endpoint payload, so it must be
 * assignable to `WidgetData`, whose record arm is `{ [key: string]: WidgetData }`.
 * TypeScript grants an implicit index signature to object type aliases but never
 * to interfaces, so an interface here is unassignable at every erased payload
 * boundary (e.g. a route's onRemoteEvent vs OnRemoteEventDispatchMap). The alias
 * pins the type exactly as an interface did — same depth guarantee.
 */
// eslint-disable-next-line typescript/consistent-type-definitions, @typescript-eslint/consistent-type-definitions -- Must be a type alias, not an interface: only aliases get the implicit index signature that makes this assignable to WidgetData on an endpoint payload. See above.
export type SkillVariantData = {
  id: string;
  displayName?: string;
  modelSelection: ChatModelSelection;
  imageGenModelSelection?: ImageGenModelSelection | null;
  musicGenModelSelection?: MusicGenModelSelection | null;
  videoGenModelSelection?: VideoGenModelSelection | null;
  voiceModelSelection?: VoiceModelSelection | null;
  sttModelSelection?: SttModelSelection | null;
  imageVisionModelSelection?: ImageVisionModelSelection | null;
  videoVisionModelSelection?: VideoVisionModelSelection | null;
  audioVisionModelSelection?: AudioVisionModelSelection | null;
  isDefault?: boolean;
};

export const skillVariantSchema: z.ZodType<SkillVariantData> = z.object({
  id: z
    .string()
    .regex(
      /^[a-z0-9-]+$/,
      "Variant ID must be a slug (lowercase letters, numbers, hyphens only)",
    ),
  displayName: z.string().max(50).optional(),
  modelSelection: chatModelSelectionSchema,
  imageGenModelSelection: imageGenModelSelectionSchema.nullable().optional(),
  musicGenModelSelection: musicGenModelSelectionSchema.nullable().optional(),
  videoGenModelSelection: videoGenModelSelectionSchema.nullable().optional(),
  voiceModelSelection: voiceModelSelectionSchema.nullable().optional(),
  sttModelSelection: sttModelSelectionSchema.nullable().optional(),
  imageVisionModelSelection: imageVisionModelSelectionSchema
    .nullable()
    .optional(),
  videoVisionModelSelection: videoVisionModelSelectionSchema
    .nullable()
    .optional(),
  audioVisionModelSelection: audioVisionModelSelectionSchema
    .nullable()
    .optional(),
  isDefault: z.boolean().optional(),
});

/**
 * Pre-typed array of skill variants. Annotated `z.ZodType<SkillVariantData[]>` so
 * `z.output` resolves to `SkillVariantData[]` in ONE shallow step. Definitions use
 * THIS (not `z.array(skillVariantSchema)`) for the `variants` request field, so
 * InferRequestOutput stays shallow and the event-payload Pick over the request
 * output doesn't re-derive the nested discriminated unions (which exceeds TS's
 * instantiation depth in inference contexts and collapses to never).
 */
export const skillVariantsSchema: z.ZodType<SkillVariantData[]> =
  z.array(skillVariantSchema);
