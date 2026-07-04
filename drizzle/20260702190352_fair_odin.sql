CREATE TABLE "pending_call_results" (
	"call_id" text PRIMARY KEY NOT NULL,
	"status" text NOT NULL,
	"output" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
