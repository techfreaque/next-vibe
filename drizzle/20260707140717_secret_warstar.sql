CREATE TABLE "fixtures" (
	"thread_id" text PRIMARY KEY NOT NULL,
	"prefix" text NOT NULL,
	"counter" integer DEFAULT 0 NOT NULL
);
