ALTER TABLE "leads" ADD COLUMN "skill_id" text;--> statement-breakpoint
ALTER TABLE "user_referrals" ADD COLUMN "skill_creator_user_id" uuid;--> statement-breakpoint
ALTER TABLE "user_referrals" ADD CONSTRAINT "user_referrals_skill_creator_user_id_users_id_fk" FOREIGN KEY ("skill_creator_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;