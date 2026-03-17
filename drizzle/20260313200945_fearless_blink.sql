CREATE TABLE "instance_identities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"instance_id" text NOT NULL,
	"friendly_name" text NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "instance_identities_user_instance_unique" UNIQUE("user_id","instance_id")
);
--> statement-breakpoint
CREATE TABLE "remote_connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"instance_id" text NOT NULL,
	"friendly_name" text NOT NULL,
	"remote_url" text NOT NULL,
	"token" text,
	"lead_id" text,
	"local_url" text,
	"remote_instance_id" text,
	"remote_friendly_name" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"last_synced_at" timestamp,
	"capabilities" jsonb,
	"capabilities_version" text,
	"memories_hash" text,
	"remote_memories_hash" text,
	"task_cursor" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "remote_connections_user_instance_unique" UNIQUE("user_id","instance_id")
);
--> statement-breakpoint
ALTER TABLE "instance_identities" ADD CONSTRAINT "instance_identities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "remote_connections" ADD CONSTRAINT "remote_connections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
-- Data migration: copy self-identity records (token='self') to instance_identities
INSERT INTO "instance_identities" ("user_id", "instance_id", "friendly_name", "is_default", "created_at", "updated_at")
SELECT "user_id", "instance_id", "friendly_name", "is_default", "created_at", "updated_at"
FROM "user_remote_connections"
WHERE "token" = 'self'
ON CONFLICT ("user_id", "instance_id") DO NOTHING;--> statement-breakpoint
-- Data migration: copy real connections (token != 'self' and not null) to remote_connections
INSERT INTO "remote_connections" ("user_id", "instance_id", "friendly_name", "remote_url", "token", "lead_id", "local_url", "remote_instance_id", "is_active", "is_default", "last_synced_at", "capabilities", "capabilities_version", "memories_hash", "remote_memories_hash", "task_cursor", "created_at", "updated_at")
SELECT "user_id", "instance_id", "friendly_name", "remote_url", "token", "lead_id", "local_url", "remote_instance_id", "is_active", "is_default", "last_synced_at", "capabilities", "capabilities_version", "memories_hash", "remote_memories_hash", "task_cursor", "created_at", "updated_at"
FROM "user_remote_connections"
WHERE "token" IS NOT NULL AND "token" != 'self'
ON CONFLICT ("user_id", "instance_id") DO NOTHING;