CREATE TABLE "lifecycle_enrollments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"journey" text NOT NULL,
	"user_id" uuid,
	"lead_id" uuid,
	"locale" text NOT NULL,
	"status" text DEFAULT 'enums.enrollmentStatus.active' NOT NULL,
	"next_step" integer DEFAULT 0 NOT NULL,
	"next_due_at" timestamp with time zone NOT NULL,
	"last_sent_at" timestamp with time zone,
	"fail_count" integer DEFAULT 0 NOT NULL,
	"exit_reason" text,
	"exited_at" timestamp with time zone,
	"converted_at" timestamp with time zone,
	"from_backfill" boolean DEFAULT false NOT NULL,
	"enrolled_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_lifecycle_enrollment_email_journey" UNIQUE("email","journey")
);
--> statement-breakpoint
CREATE TABLE "lifecycle_sends" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enrollment_id" uuid NOT NULL,
	"email" text NOT NULL,
	"step" integer NOT NULL,
	"status" text DEFAULT 'enums.sendStatus.pending' NOT NULL,
	"message_id" text,
	"sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_lifecycle_send_enrollment_step" UNIQUE("enrollment_id","step")
);
--> statement-breakpoint
CREATE TABLE "lifecycle_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"paused" boolean DEFAULT true NOT NULL,
	"min_hours_between_emails" integer DEFAULT 48 NOT NULL,
	"max_sends_per_run" integer DEFAULT 25 NOT NULL,
	"require_user_marketing_consent" boolean DEFAULT true NOT NULL,
	"auto_enroll_window_days" integer DEFAULT 14 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lifecycle_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "refusal_index_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"category" text NOT NULL,
	"text_en" text NOT NULL,
	"text_de" text,
	"text_pl" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "refusal_index_questions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "refusal_index_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"run_id" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"model_id" text NOT NULL,
	"verdict" text NOT NULL,
	"judge_reason" text DEFAULT '' NOT NULL,
	"answer_excerpt" text DEFAULT '' NOT NULL,
	"latency_ms" integer DEFAULT 0 NOT NULL,
	"cost" double precision DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "refusal_index_results_run_question_model_uq" UNIQUE("run_id","question_id","model_id")
);
--> statement-breakpoint
CREATE TABLE "refusal_index_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" text DEFAULT 'enums.runStatus.running' NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"finished_at" timestamp,
	"heartbeat_at" timestamp DEFAULT now() NOT NULL,
	"model_count" integer DEFAULT 0 NOT NULL,
	"question_count" integer DEFAULT 0 NOT NULL,
	"total_cost" double precision DEFAULT 0 NOT NULL,
	"budget_credits" double precision,
	"judge_model_id" text NOT NULL,
	"judge_prompt_version" text NOT NULL,
	"runner_prompt_version" text NOT NULL,
	"model_filter" jsonb,
	"question_filter" jsonb,
	"started_by_user_id" uuid,
	"notes" text,
	"cancel_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "refusal_index_samples" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"result_id" uuid NOT NULL,
	"approved_by" uuid,
	"approved_at" timestamp DEFAULT now() NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	CONSTRAINT "refusal_index_samples_result_id_unique" UNIQUE("result_id")
);
--> statement-breakpoint
ALTER TABLE "lifecycle_enrollments" ADD CONSTRAINT "lifecycle_enrollments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lifecycle_enrollments" ADD CONSTRAINT "lifecycle_enrollments_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lifecycle_sends" ADD CONSTRAINT "lifecycle_sends_enrollment_id_lifecycle_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."lifecycle_enrollments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refusal_index_results" ADD CONSTRAINT "refusal_index_results_run_id_refusal_index_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."refusal_index_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refusal_index_results" ADD CONSTRAINT "refusal_index_results_question_id_refusal_index_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."refusal_index_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refusal_index_runs" ADD CONSTRAINT "refusal_index_runs_started_by_user_id_users_id_fk" FOREIGN KEY ("started_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refusal_index_samples" ADD CONSTRAINT "refusal_index_samples_result_id_refusal_index_results_id_fk" FOREIGN KEY ("result_id") REFERENCES "public"."refusal_index_results"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refusal_index_samples" ADD CONSTRAINT "refusal_index_samples_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uq_lifecycle_enrollment_one_active" ON "lifecycle_enrollments" USING btree ("email") WHERE "lifecycle_enrollments"."status" = 'enums.enrollmentStatus.active';--> statement-breakpoint
CREATE INDEX "idx_lifecycle_enrollment_due" ON "lifecycle_enrollments" USING btree ("status","next_due_at");--> statement-breakpoint
CREATE INDEX "idx_lifecycle_enrollment_user" ON "lifecycle_enrollments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_lifecycle_send_email" ON "lifecycle_sends" USING btree ("email","sent_at");--> statement-breakpoint
CREATE INDEX "refusal_index_questions_category_idx" ON "refusal_index_questions" USING btree ("category");--> statement-breakpoint
CREATE INDEX "refusal_index_results_model_idx" ON "refusal_index_results" USING btree ("model_id","run_id");--> statement-breakpoint
CREATE INDEX "refusal_index_runs_status_idx" ON "refusal_index_runs" USING btree ("status","started_at");