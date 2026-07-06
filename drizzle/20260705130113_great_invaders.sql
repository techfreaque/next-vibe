DROP INDEX "remote_connections_one_inference_provider_per_user";--> statement-breakpoint
DROP INDEX "remote_connections_one_force_system_provider_per_user";--> statement-breakpoint
CREATE UNIQUE INDEX "remote_connections_one_inference_provider" ON "remote_connections" USING btree ("is_inference_provider") WHERE "remote_connections"."is_inference_provider" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "remote_connections_one_force_system_provider" ON "remote_connections" USING btree ("force_system_provider") WHERE "remote_connections"."force_system_provider" = true;