ALTER TABLE "instance_identities" DROP CONSTRAINT "instance_identities_user_instance_unique";--> statement-breakpoint
DROP INDEX "instance_identities_one_default_per_user";--> statement-breakpoint
ALTER TABLE "instance_identities" DROP COLUMN "is_default";--> statement-breakpoint
ALTER TABLE "instance_identities" ADD CONSTRAINT "instance_identities_user_id_unique" UNIQUE("user_id");