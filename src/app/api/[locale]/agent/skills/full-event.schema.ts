/**
 * Skills Cross-Instance Event Schema
 *
 * The full custom-skill row carried by the server `skill-created-full` /
 * `skill-updated-full` remote events (where the client `skill-created`/
 * `-updated` display payload is too lossy to rebuild a row on a peer).
 * Client-safe — no server-only imports (no db/drizzle) — so the CRUD op
 * definitions can declare it as a `payloadType`, and the server-only
 * sync-provider reuses it.
 */

import { iconSchema } from "next-vibe/core/definition/common.schema";
import { z } from "zod";

import { chatModelSelectionSchema } from "@/app/api/[locale]/agent/ai-stream/models";
import {
  audioVisionModelSelectionSchema,
  imageVisionModelSelectionSchema,
  videoVisionModelSelectionSchema,
} from "@/app/api/[locale]/agent/ai-stream/vision-models";
import { imageGenModelSelectionSchema } from "@/app/api/[locale]/agent/image-generation/models";
import { musicGenModelSelectionSchema } from "@/app/api/[locale]/agent/music-generation/models";
import { sttModelSelectionSchema } from "@/app/api/[locale]/agent/speech-to-text/models";
import { voiceModelSelectionSchema } from "@/app/api/[locale]/agent/text-to-speech/models";
import { videoGenModelSelectionSchema } from "@/app/api/[locale]/agent/video-generation/models";

import {
  SkillCategory,
  SkillOwnershipType,
  SkillStatus,
  SkillTrustLevelDB,
  SkillType,
} from "./enum";

const toolRefSchema = z.object({
  toolId: z.string(),
  requiresConfirmation: z.boolean(),
});

/**
 * One skill variant, serialized for cross-instance events. Mirrors the
 * `skillVariantSchema` in `./db` (client-safe — only model selection schemas)
 * but kept inline here so this module stays free of any db/drizzle import.
 */
const skillVariantSchema = z.object({
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

/** One custom-skill row, serialized for cross-instance events. */
export const syncedSkillSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  tagline: z.string(),
  icon: iconSchema,
  systemPrompt: z.string().nullable(),
  category: z.enum([
    SkillCategory.COMPANION,
    SkillCategory.ASSISTANT,
    SkillCategory.CODING,
    SkillCategory.CREATIVE,
    SkillCategory.WRITING,
    SkillCategory.ANALYSIS,
    SkillCategory.ROLEPLAY,
    SkillCategory.EDUCATION,
    SkillCategory.CONTROVERSIAL,
    SkillCategory.BACKGROUND,
  ]),
  ownershipType: z.enum([
    SkillOwnershipType.SYSTEM,
    SkillOwnershipType.USER,
    SkillOwnershipType.PUBLIC,
  ]),
  // Model selections
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
  imageGenModelSelection: imageGenModelSelectionSchema.nullable().optional(),
  musicGenModelSelection: musicGenModelSelectionSchema.nullable().optional(),
  videoGenModelId: z.string().nullable().optional(),
  // Variants
  variants: z.array(skillVariantSchema).nullable().optional(),
  // Behavior
  compactTrigger: z.number().int().nullable().optional(),
  memoryLimit: z.number().int().nullable().optional(),
  availableTools: z.array(toolRefSchema).nullable().optional(),
  pinnedTools: z.array(toolRefSchema).nullable().optional(),
  deniedTools: z.array(toolRefSchema).nullable().optional(),
  skillType: z
    .enum([SkillType.PERSONA, SkillType.SPECIALIST, SkillType.TOOL_BUNDLE])
    .nullable()
    .optional(),
  status: z
    .enum([SkillStatus.DRAFT, SkillStatus.PUBLISHED, SkillStatus.UNLISTED])
    .nullable()
    .optional(),
  companionPrompt: z.string().nullable().optional(),
  trustLevel: z.enum(SkillTrustLevelDB).optional(),
  longContent: z.string().nullable().optional(),
  publishedAt: z.string().nullable().optional(),
  changeNote: z.string().nullable().optional(),
  // Timestamps
  updatedAt: z.string(),
  isDeleted: z.boolean().optional(),
});

export type SyncedSkill = z.infer<typeof syncedSkillSchema>;

/** Payload of the skill-created-full / skill-updated-full remote events. */
export const skillFullEventSchema = z.object({
  skills: z.array(syncedSkillSchema),
});
