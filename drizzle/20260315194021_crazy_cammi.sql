CREATE TABLE "skill_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"skill_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"reason" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skill_votes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"skill_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat_favorites" ADD COLUMN "sub_agent_favorite_id" uuid;--> statement-breakpoint
ALTER TABLE "custom_skills" ADD COLUMN "vote_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "custom_skills" ADD COLUMN "report_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "custom_skills" ADD COLUMN "trust_level" text DEFAULT 'enums.trustLevel.community' NOT NULL;--> statement-breakpoint
ALTER TABLE "skill_reports" ADD CONSTRAINT "skill_reports_skill_id_custom_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."custom_skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill_reports" ADD CONSTRAINT "skill_reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill_votes" ADD CONSTRAINT "skill_votes_skill_id_custom_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."custom_skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill_votes" ADD CONSTRAINT "skill_votes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "skill_reports_skill_user_idx" ON "skill_reports" USING btree ("skill_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "skill_votes_skill_user_idx" ON "skill_votes" USING btree ("skill_id","user_id");