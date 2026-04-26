CREATE TABLE "vfs_nodes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"path" text NOT NULL,
	"node_type" text NOT NULL,
	"content" text,
	"size" integer DEFAULT 0 NOT NULL,
	"view_type" text,
	"icon" text,
	"frontmatter" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "vfs_nodes" ADD CONSTRAINT "vfs_nodes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "vfs_nodes_user_path_idx" ON "vfs_nodes" USING btree ("user_id","path");--> statement-breakpoint
CREATE INDEX "vfs_nodes_user_id_idx" ON "vfs_nodes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "vfs_nodes_frontmatter_idx" ON "vfs_nodes" USING gin ("frontmatter");--> statement-breakpoint
CREATE INDEX "vfs_nodes_content_search_idx" ON "vfs_nodes" USING gin (to_tsvector('english', COALESCE("content", '') || ' ' || "path"));