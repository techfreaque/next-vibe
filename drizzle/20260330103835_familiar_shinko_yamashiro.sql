-- Rename voice_id → voice_model_selection if voice_id exists (dev/intermediate state)
-- Rename voice → voice_model_selection if voice exists (preview/prod state)
-- For chat_settings: neither column existed, so we only ADD COLUMN IF NOT EXISTS
DO $$
BEGIN
  -- chat_favorites
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='chat_favorites' AND column_name='voice_id') THEN
    ALTER TABLE "chat_favorites" RENAME COLUMN "voice_id" TO "voice_model_selection";
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='chat_favorites' AND column_name='voice') THEN
    ALTER TABLE "chat_favorites" RENAME COLUMN "voice" TO "voice_model_selection";
  END IF;

  -- custom_skills
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='custom_skills' AND column_name='voice_id') THEN
    ALTER TABLE "custom_skills" RENAME COLUMN "voice_id" TO "voice_model_selection";
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='custom_skills' AND column_name='voice') THEN
    ALTER TABLE "custom_skills" RENAME COLUMN "voice" TO "voice_model_selection";
  END IF;

  -- chat_settings: voice_id rename if exists (dev intermediate state)
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='chat_settings' AND column_name='voice_id') THEN
    ALTER TABLE "chat_settings" RENAME COLUMN "voice_id" TO "voice_model_selection";
  END IF;
END $$;
--> statement-breakpoint

-- Change type from text to jsonb for tables that had a text voice column (preview/prod)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='chat_favorites' AND column_name='voice_model_selection' AND data_type='text'
  ) THEN
    ALTER TABLE "chat_favorites" ALTER COLUMN "voice_model_selection" TYPE jsonb USING
      CASE "voice_model_selection"
        WHEN 'MALE'   THEN '{"selectionType":"MANUAL","manualModelId":"openai-onyx"}'::jsonb
        WHEN 'FEMALE' THEN '{"selectionType":"MANUAL","manualModelId":"openai-nova"}'::jsonb
        ELSE CASE WHEN "voice_model_selection" IS NOT NULL
          THEN jsonb_build_object('selectionType', 'MANUAL', 'manualModelId', "voice_model_selection")
          ELSE NULL
        END
      END;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='custom_skills' AND column_name='voice_model_selection' AND data_type='text'
  ) THEN
    ALTER TABLE "custom_skills" ALTER COLUMN "voice_model_selection" TYPE jsonb USING
      CASE "voice_model_selection"
        WHEN 'MALE'   THEN '{"selectionType":"MANUAL","manualModelId":"openai-onyx"}'::jsonb
        WHEN 'FEMALE' THEN '{"selectionType":"MANUAL","manualModelId":"openai-nova"}'::jsonb
        ELSE CASE WHEN "voice_model_selection" IS NOT NULL
          THEN jsonb_build_object('selectionType', 'MANUAL', 'manualModelId', "voice_model_selection")
          ELSE NULL
        END
      END;
  END IF;
END $$;
--> statement-breakpoint

ALTER TABLE "chat_threads" ADD COLUMN IF NOT EXISTS "chat_mode" text DEFAULT 'text' NOT NULL;--> statement-breakpoint
ALTER TABLE "chat_favorites" ADD COLUMN IF NOT EXISTS "stt_model_selection" jsonb;--> statement-breakpoint
ALTER TABLE "chat_favorites" ADD COLUMN IF NOT EXISTS "vision_bridge_model_selection" jsonb;--> statement-breakpoint
ALTER TABLE "chat_favorites" ADD COLUMN IF NOT EXISTS "translation_model_id" text;--> statement-breakpoint
ALTER TABLE "chat_favorites" ADD COLUMN IF NOT EXISTS "default_chat_mode" text;--> statement-breakpoint
ALTER TABLE "chat_favorites" ADD COLUMN IF NOT EXISTS "image_gen_model_selection" jsonb;--> statement-breakpoint
ALTER TABLE "chat_favorites" ADD COLUMN IF NOT EXISTS "music_gen_model_selection" jsonb;--> statement-breakpoint
ALTER TABLE "chat_favorites" ADD COLUMN IF NOT EXISTS "video_gen_model_id" text;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN IF NOT EXISTS "voice_model_selection" jsonb;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN IF NOT EXISTS "stt_model_selection" jsonb;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN IF NOT EXISTS "vision_bridge_model_selection" jsonb;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN IF NOT EXISTS "translation_model_id" text;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN IF NOT EXISTS "default_chat_mode" text;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN IF NOT EXISTS "image_gen_model_selection" jsonb;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN IF NOT EXISTS "music_gen_model_selection" jsonb;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN IF NOT EXISTS "video_gen_model_id" text;--> statement-breakpoint
ALTER TABLE "custom_skills" ADD COLUMN IF NOT EXISTS "stt_model_selection" jsonb;--> statement-breakpoint
ALTER TABLE "custom_skills" ADD COLUMN IF NOT EXISTS "vision_bridge_model_selection" jsonb;--> statement-breakpoint
ALTER TABLE "custom_skills" ADD COLUMN IF NOT EXISTS "translation_model_id" text;--> statement-breakpoint
ALTER TABLE "custom_skills" ADD COLUMN IF NOT EXISTS "default_chat_mode" text;--> statement-breakpoint
ALTER TABLE "custom_skills" ADD COLUMN IF NOT EXISTS "image_gen_model_selection" jsonb;--> statement-breakpoint
ALTER TABLE "custom_skills" ADD COLUMN IF NOT EXISTS "music_gen_model_selection" jsonb;--> statement-breakpoint
ALTER TABLE "custom_skills" ADD COLUMN IF NOT EXISTS "video_gen_model_id" text;--> statement-breakpoint
