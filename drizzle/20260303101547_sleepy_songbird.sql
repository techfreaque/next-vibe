CREATE TABLE IF NOT EXISTS "user_remote_connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"instance_id" text DEFAULT 'hermes' NOT NULL,
	"friendly_name" text DEFAULT 'hermes' NOT NULL,
	"remote_url" text NOT NULL,
	"token" text NOT NULL,
	"lead_id" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_synced_at" timestamp,
	"capabilities" jsonb,
	"capabilities_hash" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_remote_connections_user_instance_unique" UNIQUE("user_id","instance_id")
);
--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='chat_threads' AND column_name='is_streaming') THEN ALTER TABLE "chat_threads" ADD COLUMN "is_streaming" boolean DEFAULT false NOT NULL; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='user_remote_connections_user_id_users_id_fk') THEN ALTER TABLE "user_remote_connections" ADD CONSTRAINT "user_remote_connections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action; END IF; END $$;