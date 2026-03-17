ALTER TABLE IF EXISTS "user_remote_connections" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE IF EXISTS "user_remote_connections" CASCADE;--> statement-breakpoint
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'custom_characters') THEN ALTER TABLE "custom_characters" RENAME TO "custom_skills"; END IF; END $$;--> statement-breakpoint
ALTER TABLE IF EXISTS "custom_skills" DROP CONSTRAINT IF EXISTS "custom_characters_user_id_users_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "error_logs_source_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "error_logs_endpoint_idx";--> statement-breakpoint
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'error_logs' AND column_name = 'level') THEN ALTER TABLE "error_logs" ALTER COLUMN "level" SET DEFAULT 'error'; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN IF (SELECT column_default FROM information_schema.columns WHERE table_name = 'error_logs' AND column_name = 'metadata') IS DISTINCT FROM '''[]''::jsonb' THEN ALTER TABLE "error_logs" ALTER COLUMN "metadata" SET DEFAULT '[]'::jsonb; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'error_logs' AND column_name = 'first_seen') THEN ALTER TABLE "error_logs" ADD COLUMN "first_seen" timestamp DEFAULT now() NOT NULL; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'custom_skills_user_id_users_id_fk') THEN ALTER TABLE "custom_skills" ADD CONSTRAINT "custom_skills_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cron_tasks' AND column_name = 'last_execution_error') THEN ALTER TABLE "cron_tasks" DROP COLUMN "last_execution_error"; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'error_logs' AND column_name = 'source') THEN ALTER TABLE "error_logs" DROP COLUMN "source"; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'error_logs' AND column_name = 'endpoint') THEN ALTER TABLE "error_logs" DROP COLUMN "endpoint"; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'error_logs' AND column_name = 'error_code') THEN ALTER TABLE "error_logs" DROP COLUMN "error_code"; END IF; END $$;
