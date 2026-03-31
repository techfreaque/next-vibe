-- Migration: Replace legacy voice enum with model-based voice/STT/vision/translation IDs
-- Adds voiceId (TtsModelId), sttModelId, visionBridgeModelId, translationModelId, defaultChatMode
-- to chat_favorites, chat_settings, and custom_skills.
-- Drops the old MALE/FEMALE string columns: favorites.voice, settings.tts_voice, skills.voice.

-- ============================================================
-- chat_favorites
-- ============================================================

ALTER TABLE "chat_favorites" ADD COLUMN "voice_id" text;--> statement-breakpoint
ALTER TABLE "chat_favorites" ADD COLUMN "stt_model_id" text;--> statement-breakpoint
ALTER TABLE "chat_favorites" ADD COLUMN "vision_bridge_model_id" text;--> statement-breakpoint
ALTER TABLE "chat_favorites" ADD COLUMN "translation_model_id" text;--> statement-breakpoint
ALTER TABLE "chat_favorites" ADD COLUMN "default_chat_mode" text;--> statement-breakpoint

-- Migrate MALE → openai-onyx, FEMALE → openai-nova
UPDATE "chat_favorites" SET "voice_id" = CASE "voice"
  WHEN 'MALE'   THEN 'openai-onyx'
  WHEN 'FEMALE' THEN 'openai-nova'
  ELSE NULL
END WHERE "voice" IS NOT NULL;--> statement-breakpoint

-- Add CHECK constraints now that data is clean
ALTER TABLE "chat_favorites"
  ADD CONSTRAINT "chat_favorites_voice_id_check"
  CHECK ("voice_id" IN (
    'openai-alloy','openai-nova','openai-onyx','openai-echo','openai-shimmer','openai-fable',
    'elevenlabs-rachel','elevenlabs-josh','elevenlabs-bella','elevenlabs-adam'
  ));--> statement-breakpoint

ALTER TABLE "chat_favorites"
  ADD CONSTRAINT "chat_favorites_default_chat_mode_check"
  CHECK ("default_chat_mode" IN ('text','voice','call'));--> statement-breakpoint

ALTER TABLE "chat_favorites" DROP COLUMN "voice";--> statement-breakpoint

-- ============================================================
-- chat_settings
-- ============================================================

ALTER TABLE "chat_settings" ADD COLUMN "voice_id" text;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN "stt_model_id" text;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN "vision_bridge_model_id" text;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN "translation_model_id" text;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN "default_chat_mode" text;--> statement-breakpoint

-- Migrate MALE → openai-onyx, FEMALE → openai-nova
UPDATE "chat_settings" SET "voice_id" = CASE "tts_voice"
  WHEN 'MALE'   THEN 'openai-onyx'
  WHEN 'FEMALE' THEN 'openai-nova'
  ELSE NULL
END WHERE "tts_voice" IS NOT NULL;--> statement-breakpoint

ALTER TABLE "chat_settings"
  ADD CONSTRAINT "chat_settings_voice_id_check"
  CHECK ("voice_id" IN (
    'openai-alloy','openai-nova','openai-onyx','openai-echo','openai-shimmer','openai-fable',
    'elevenlabs-rachel','elevenlabs-josh','elevenlabs-bella','elevenlabs-adam'
  ));--> statement-breakpoint

ALTER TABLE "chat_settings"
  ADD CONSTRAINT "chat_settings_default_chat_mode_check"
  CHECK ("default_chat_mode" IN ('text','voice','call'));--> statement-breakpoint

ALTER TABLE "chat_settings" DROP COLUMN "tts_voice";--> statement-breakpoint

-- ============================================================
-- custom_skills
-- ============================================================

ALTER TABLE "custom_skills" ADD COLUMN "voice_id" text;--> statement-breakpoint
ALTER TABLE "custom_skills" ADD COLUMN "stt_model_id" text;--> statement-breakpoint
ALTER TABLE "custom_skills" ADD COLUMN "vision_bridge_model_id" text;--> statement-breakpoint
ALTER TABLE "custom_skills" ADD COLUMN "translation_model_id" text;--> statement-breakpoint
ALTER TABLE "custom_skills" ADD COLUMN "default_chat_mode" text;--> statement-breakpoint

-- Migrate MALE → openai-onyx, FEMALE → openai-nova
UPDATE "custom_skills" SET "voice_id" = CASE "voice"
  WHEN 'MALE'   THEN 'openai-onyx'
  WHEN 'FEMALE' THEN 'openai-nova'
  ELSE NULL
END WHERE "voice" IS NOT NULL;--> statement-breakpoint

ALTER TABLE "custom_skills"
  ADD CONSTRAINT "custom_skills_voice_id_check"
  CHECK ("voice_id" IN (
    'openai-alloy','openai-nova','openai-onyx','openai-echo','openai-shimmer','openai-fable',
    'elevenlabs-rachel','elevenlabs-josh','elevenlabs-bella','elevenlabs-adam'
  ));--> statement-breakpoint

ALTER TABLE "custom_skills"
  ADD CONSTRAINT "custom_skills_default_chat_mode_check"
  CHECK ("default_chat_mode" IN ('text','voice','call'));--> statement-breakpoint

ALTER TABLE "custom_skills" DROP COLUMN "voice";
