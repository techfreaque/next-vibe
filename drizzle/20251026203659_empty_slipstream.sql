CREATE TYPE "public"."country" AS ENUM('DE', 'PL', 'GLOBAL');--> statement-breakpoint
CREATE TYPE "public"."language" AS ENUM('de', 'pl', 'en');--> statement-breakpoint
CREATE TABLE "chat_folders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"root_folder_id" text DEFAULT 'private' NOT NULL,
	"name" text NOT NULL,
	"icon" text,
	"color" text,
	"parent_id" uuid,
	"expanded" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"moderator_ids" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thread_id" uuid NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"parent_id" uuid,
	"depth" integer DEFAULT 0 NOT NULL,
	"author_id" text,
	"author_name" text,
	"author_avatar" text,
	"author_color" text,
	"is_ai" boolean DEFAULT false NOT NULL,
	"model" text,
	"tone" text,
	"error_type" text,
	"error_message" text,
	"error_code" text,
	"edited" boolean DEFAULT false NOT NULL,
	"original_id" uuid,
	"tokens" integer,
	"collapsed" boolean DEFAULT false NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"upvotes" integer DEFAULT 0 NOT NULL,
	"downvotes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"search_vector" text
);
--> statement-breakpoint
CREATE TABLE "chat_threads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"root_folder_id" text NOT NULL,
	"folder_id" uuid,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"default_model" text,
	"default_tone" text,
	"system_prompt" text,
	"pinned" boolean DEFAULT false NOT NULL,
	"archived" boolean DEFAULT false NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"preview" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"moderator_ids" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"search_vector" text
);
--> statement-breakpoint
CREATE TABLE "custom_personas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"icon" text NOT NULL,
	"system_prompt" text NOT NULL,
	"category" text NOT NULL,
	"source" text DEFAULT 'my' NOT NULL,
	"preferred_model" text,
	"suggested_prompts" jsonb DEFAULT '[]'::jsonb,
	"is_public" boolean DEFAULT false NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"company" text,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"status" text DEFAULT 'NEW' NOT NULL,
	"user_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "credit_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"lead_id" uuid,
	"amount" integer NOT NULL,
	"balance_after" integer NOT NULL,
	"type" text NOT NULL,
	"model_id" text,
	"message_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_credits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"type" text NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "imap_configurations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"server_enabled" boolean DEFAULT true NOT NULL,
	"max_connections" integer DEFAULT 100 NOT NULL,
	"connection_timeout" integer DEFAULT 30000 NOT NULL,
	"pool_idle_timeout" integer DEFAULT 300000 NOT NULL,
	"keep_alive" boolean DEFAULT true NOT NULL,
	"sync_enabled" boolean DEFAULT true NOT NULL,
	"sync_interval" integer DEFAULT 300 NOT NULL,
	"batch_size" integer DEFAULT 50 NOT NULL,
	"max_messages" integer DEFAULT 1000 NOT NULL,
	"concurrent_accounts" integer DEFAULT 5 NOT NULL,
	"cache_enabled" boolean DEFAULT true NOT NULL,
	"cache_ttl" integer DEFAULT 300000 NOT NULL,
	"cache_max_size" integer DEFAULT 1000 NOT NULL,
	"memory_threshold" integer DEFAULT 80 NOT NULL,
	"max_retries" integer DEFAULT 3 NOT NULL,
	"retry_delay" integer DEFAULT 1000 NOT NULL,
	"circuit_breaker_threshold" integer DEFAULT 5 NOT NULL,
	"circuit_breaker_timeout" integer DEFAULT 60000 NOT NULL,
	"health_check_interval" integer DEFAULT 60000 NOT NULL,
	"metrics_enabled" boolean DEFAULT true NOT NULL,
	"logging_level" text DEFAULT 'INFO' NOT NULL,
	"rate_limit_enabled" boolean DEFAULT false NOT NULL,
	"rate_limit_requests" integer DEFAULT 100 NOT NULL,
	"rate_limit_window" integer DEFAULT 60000 NOT NULL,
	"debug_mode" boolean DEFAULT false NOT NULL,
	"test_mode" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "imap_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"host" text NOT NULL,
	"port" integer DEFAULT 993 NOT NULL,
	"secure" boolean DEFAULT true,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"auth_method" text DEFAULT 'PLAIN',
	"connection_timeout" integer DEFAULT 30000,
	"keep_alive" boolean DEFAULT true,
	"enabled" boolean DEFAULT true,
	"sync_interval" integer DEFAULT 60,
	"max_messages" integer DEFAULT 1000,
	"sync_folders" json DEFAULT '[]'::json,
	"user_id" uuid,
	"last_sync_at" timestamp,
	"sync_status" text DEFAULT 'PENDING',
	"sync_error" text,
	"is_connected" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "imap_accounts_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "imap_folders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"display_name" text,
	"path" text NOT NULL,
	"delimiter" text DEFAULT '/',
	"is_selectable" boolean DEFAULT true,
	"has_children" boolean DEFAULT false,
	"is_special_use" boolean DEFAULT false,
	"special_use_type" text,
	"uid_validity" integer,
	"uid_next" integer,
	"message_count" integer DEFAULT 0,
	"recent_count" integer DEFAULT 0,
	"unseen_count" integer DEFAULT 0,
	"account_id" uuid NOT NULL,
	"last_sync_at" timestamp,
	"sync_status" text DEFAULT 'PENDING',
	"sync_error" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "emails" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject" text NOT NULL,
	"recipient_email" text NOT NULL,
	"recipient_name" text,
	"sender_email" text NOT NULL,
	"sender_name" text,
	"type" text NOT NULL,
	"template_name" text,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"email_provider" text DEFAULT 'SMTP',
	"external_id" text,
	"sent_at" timestamp,
	"delivered_at" timestamp,
	"opened_at" timestamp,
	"clicked_at" timestamp,
	"bounced_at" timestamp,
	"unsubscribed_at" timestamp,
	"error" text,
	"retry_count" text DEFAULT '0',
	"processing_time_ms" integer,
	"delivery_time_ms" integer,
	"user_id" uuid,
	"lead_id" uuid,
	"smtp_account_id" uuid,
	"imap_uid" integer,
	"imap_message_id" text,
	"imap_folder_id" uuid,
	"imap_account_id" uuid,
	"body_text" text,
	"body_html" text,
	"headers" json DEFAULT '{}'::json,
	"is_read" boolean DEFAULT false,
	"is_flagged" boolean DEFAULT false,
	"is_deleted" boolean DEFAULT false,
	"is_draft" boolean DEFAULT false,
	"is_answered" boolean DEFAULT false,
	"in_reply_to" text,
	"references" text,
	"thread_id" text,
	"message_size" integer,
	"has_attachments" boolean DEFAULT false,
	"attachment_count" integer DEFAULT 0,
	"last_sync_at" timestamp,
	"sync_status" text DEFAULT 'PENDING',
	"sync_error" text,
	"metadata" json DEFAULT '{}'::json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "imap_server_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"max_concurrent_connections" integer DEFAULT 10 NOT NULL,
	"connection_timeout" integer DEFAULT 30000 NOT NULL,
	"keep_alive" boolean DEFAULT true NOT NULL,
	"pool_idle_timeout" integer DEFAULT 300000 NOT NULL,
	"sync_enabled" boolean DEFAULT true NOT NULL,
	"sync_interval" integer DEFAULT 60 NOT NULL,
	"batch_size" integer DEFAULT 100 NOT NULL,
	"max_messages" integer DEFAULT 1000 NOT NULL,
	"concurrent_accounts" integer DEFAULT 5 NOT NULL,
	"cache_enabled" boolean DEFAULT true NOT NULL,
	"cache_ttl" integer DEFAULT 300000 NOT NULL,
	"cache_max_size" integer DEFAULT 1000 NOT NULL,
	"memory_threshold" integer DEFAULT 80 NOT NULL,
	"circuit_breaker_enabled" boolean DEFAULT true NOT NULL,
	"circuit_breaker_threshold" integer DEFAULT 5 NOT NULL,
	"circuit_breaker_timeout" integer DEFAULT 60000 NOT NULL,
	"retry_max_attempts" integer DEFAULT 3 NOT NULL,
	"retry_delay" integer DEFAULT 5000 NOT NULL,
	"metrics_enabled" boolean DEFAULT true NOT NULL,
	"health_check_interval" integer DEFAULT 30000 NOT NULL,
	"alerting_enabled" boolean DEFAULT true NOT NULL,
	"rate_limiting_enabled" boolean DEFAULT true NOT NULL,
	"max_requests" integer DEFAULT 100 NOT NULL,
	"rate_limit_window" integer DEFAULT 60000 NOT NULL,
	"debug_mode" boolean DEFAULT false NOT NULL,
	"dry_run" boolean DEFAULT false NOT NULL,
	"log_level" text DEFAULT 'INFO' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "imap_sync_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"max_accounts_per_run" integer DEFAULT 5 NOT NULL,
	"max_messages_per_folder" integer DEFAULT 1000 NOT NULL,
	"batch_size" integer DEFAULT 100 NOT NULL,
	"enable_bidirectional_sync" boolean DEFAULT true NOT NULL,
	"sync_flags" boolean DEFAULT true NOT NULL,
	"sync_deleted" boolean DEFAULT false NOT NULL,
	"dry_run" boolean DEFAULT false NOT NULL,
	"force_sync" boolean DEFAULT false NOT NULL,
	"connection_timeout" integer DEFAULT 30000 NOT NULL,
	"max_retries" integer DEFAULT 3 NOT NULL,
	"retry_delay" integer DEFAULT 5000 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "smtp_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"host" text NOT NULL,
	"port" integer DEFAULT 587 NOT NULL,
	"security_type" text DEFAULT 'STARTTLS' NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"from_email" text NOT NULL,
	"connection_timeout" integer DEFAULT 30000,
	"max_connections" integer DEFAULT 5,
	"rate_limit_per_hour" integer DEFAULT 600,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"is_default" boolean DEFAULT false,
	"priority" integer DEFAULT 0,
	"last_health_check" timestamp,
	"health_check_status" text,
	"consecutive_failures" integer DEFAULT 0,
	"last_failure_at" timestamp,
	"last_failure_reason" text,
	"emails_sent_today" integer DEFAULT 0,
	"emails_sent_this_month" integer DEFAULT 0,
	"total_emails_sent" integer DEFAULT 0,
	"last_used_at" timestamp,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"campaign_types" jsonb DEFAULT '[]'::jsonb,
	"email_journey_variants" jsonb DEFAULT '[]'::jsonb,
	"email_campaign_stages" jsonb DEFAULT '[]'::jsonb,
	"countries" jsonb DEFAULT '[]'::jsonb,
	"languages" jsonb DEFAULT '[]'::jsonb,
	"is_exact_match" boolean DEFAULT false,
	"weight" integer DEFAULT 1,
	"is_failover" boolean DEFAULT false,
	"failover_priority" integer DEFAULT 0,
	"created_by" uuid,
	"updated_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "smtp_accounts_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "campaign_starter_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"environment" text NOT NULL,
	"dry_run" integer DEFAULT 0 NOT NULL,
	"min_age_hours" integer DEFAULT 0 NOT NULL,
	"enabled_days" jsonb NOT NULL,
	"enabled_hours" jsonb NOT NULL,
	"leads_per_week" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "campaign_starter_configs_environment_unique" UNIQUE("environment")
);
--> statement-breakpoint
CREATE TABLE "email_campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"stage" text NOT NULL,
	"journey_variant" text NOT NULL,
	"subject" text NOT NULL,
	"template_name" text NOT NULL,
	"scheduled_at" timestamp NOT NULL,
	"sent_at" timestamp,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"email_provider" text DEFAULT 'SMTP',
	"external_id" text,
	"smtp_account_id" uuid,
	"opened_at" timestamp,
	"clicked_at" timestamp,
	"unsubscribed_at" timestamp,
	"bounced_at" timestamp,
	"error" text,
	"retry_count" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_credits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"amount" integer DEFAULT 20 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_engagements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"campaign_id" uuid,
	"engagement_type" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"primary_lead_id" uuid NOT NULL,
	"linked_lead_id" uuid NOT NULL,
	"link_reason" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"linked_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text,
	"business_name" text NOT NULL,
	"contact_name" text,
	"phone" text,
	"website" text,
	"country" "country" NOT NULL,
	"language" "language" NOT NULL,
	"ip_address" text,
	"status" text DEFAULT 'NEW' NOT NULL,
	"source" text,
	"notes" text,
	"converted_user_id" uuid,
	"converted_at" timestamp,
	"signed_up_at" timestamp,
	"consultation_booked_at" timestamp,
	"subscription_confirmed_at" timestamp,
	"bounced_at" timestamp,
	"invalid_at" timestamp,
	"current_campaign_stage" text DEFAULT 'NOT_STARTED',
	"email_journey_variant" text,
	"campaign_started_at" timestamp,
	"emails_sent" integer DEFAULT 0 NOT NULL,
	"last_email_sent_at" timestamp,
	"unsubscribed_at" timestamp,
	"emails_opened" integer DEFAULT 0 NOT NULL,
	"emails_clicked" integer DEFAULT 0 NOT NULL,
	"last_engagement_at" timestamp,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "leads_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"lead_id" uuid NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"linked_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "csv_import_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"file_name" text NOT NULL,
	"file_content" text NOT NULL,
	"uploaded_by" uuid NOT NULL,
	"skip_duplicates" boolean DEFAULT true NOT NULL,
	"update_existing" boolean DEFAULT false NOT NULL,
	"default_country" text NOT NULL,
	"default_language" text NOT NULL,
	"default_status" text DEFAULT 'NEW' NOT NULL,
	"default_campaign_stage" text DEFAULT 'NOT_STARTED' NOT NULL,
	"default_source" text DEFAULT 'CSV_IMPORT' NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"total_rows" integer,
	"processed_rows" integer DEFAULT 0 NOT NULL,
	"successful_imports" integer DEFAULT 0 NOT NULL,
	"failed_imports" integer DEFAULT 0 NOT NULL,
	"duplicate_emails" integer DEFAULT 0 NOT NULL,
	"current_batch_start" integer DEFAULT 0 NOT NULL,
	"batch_size" integer DEFAULT 2000 NOT NULL,
	"import_errors" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"import_summary" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"error" text,
	"retry_count" integer DEFAULT 0 NOT NULL,
	"max_retries" integer DEFAULT 3 NOT NULL,
	"domain" text NOT NULL,
	"domain_config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "import_batches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"file_name" text NOT NULL,
	"uploaded_by" uuid NOT NULL,
	"total_rows" integer NOT NULL,
	"successful_imports" integer DEFAULT 0 NOT NULL,
	"failed_imports" integer DEFAULT 0 NOT NULL,
	"duplicate_emails" integer DEFAULT 0 NOT NULL,
	"import_errors" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"import_summary" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"domain" text NOT NULL,
	"domain_config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletter_campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"subject" text NOT NULL,
	"content" text NOT NULL,
	"sent_at" timestamp,
	"scheduled_for" timestamp,
	"recipient_count" text DEFAULT '0',
	"open_count" text DEFAULT '0',
	"click_count" text DEFAULT '0',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletter_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subscription_id" uuid NOT NULL,
	"campaign_id" uuid,
	"event_type" text NOT NULL,
	"event_data" jsonb,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"user_id" uuid,
	"status" text DEFAULT 'SUBSCRIBED' NOT NULL,
	"preferences" jsonb DEFAULT '[]',
	"subscription_date" timestamp with time zone DEFAULT now() NOT NULL,
	"unsubscribed_date" timestamp with time zone,
	"last_email_sent_date" timestamp with time zone,
	"bounce_count" text DEFAULT '0',
	"source" text DEFAULT 'website',
	"ip_address" text,
	"user_agent" text,
	"confirmed_at" timestamp with time zone,
	"confirmation_token" text,
	"marketing_consent" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "newsletter_subscriptions_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "payment_disputes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"transaction_id" uuid NOT NULL,
	"stripe_dispute_id" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" text NOT NULL,
	"status" text NOT NULL,
	"reason" text,
	"evidence_due_by" timestamp,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"stripe_invoice_id" text NOT NULL,
	"invoice_number" text,
	"amount" numeric(10, 2) NOT NULL,
	"currency" text NOT NULL,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"invoice_url" text,
	"invoice_pdf" text,
	"due_date" timestamp,
	"paid_at" timestamp,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_methods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"stripe_payment_method_id" text NOT NULL,
	"type" text NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"last4" text,
	"brand" text,
	"expiry_month" integer,
	"expiry_year" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_refunds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"transaction_id" uuid NOT NULL,
	"stripe_refund_id" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" text NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"reason" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"stripe_session_id" text,
	"stripe_payment_intent_id" text,
	"amount" numeric(10, 2) NOT NULL,
	"currency" text NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"provider" text DEFAULT 'STRIPE' NOT NULL,
	"mode" text DEFAULT 'PAYMENT' NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_webhooks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stripe_event_id" text NOT NULL,
	"event_type" text NOT NULL,
	"processed" boolean DEFAULT false NOT NULL,
	"data" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"processed_at" timestamp,
	CONSTRAINT "payment_webhooks_stripe_event_id_unique" UNIQUE("stripe_event_id")
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"status" text DEFAULT 'INCOMPLETE' NOT NULL,
	"plan_id" text NOT NULL,
	"billing_interval" text DEFAULT 'MONTHLY' NOT NULL,
	"current_period_start" timestamp with time zone,
	"current_period_end" timestamp with time zone,
	"cancel_at_period_end" boolean DEFAULT false NOT NULL,
	"canceled_at" timestamp with time zone,
	"ended_at" timestamp with time zone,
	"cancellation_reason" text,
	"trial_start" timestamp with time zone,
	"trial_end" timestamp with time zone,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"stripe_price_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);
--> statement-breakpoint
CREATE TABLE "cron_task_executions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"status" text NOT NULL,
	"started_at" timestamp NOT NULL,
	"completed_at" timestamp,
	"duration_ms" integer,
	"config" jsonb NOT NULL,
	"result" jsonb,
	"error" jsonb,
	"skipped_reason" text,
	"execution_environment" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cron_task_schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"task_name" text NOT NULL,
	"schedule" text NOT NULL,
	"timezone" text DEFAULT 'UTC' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_run_at" timestamp,
	"next_run_at" timestamp,
	"total_runs" integer DEFAULT 0 NOT NULL,
	"consecutive_failures" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cron_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"schedule" text,
	"schedule_function" text,
	"enabled" boolean DEFAULT true NOT NULL,
	"priority" text NOT NULL,
	"timeout" integer DEFAULT 300000,
	"retries" integer DEFAULT 3,
	"description" text,
	"version" text NOT NULL,
	"category" text NOT NULL,
	"tags" jsonb,
	"dependencies" jsonb,
	"default_config" jsonb NOT NULL,
	"monitoring" jsonb,
	"documentation" jsonb,
	"last_run" timestamp,
	"next_run" timestamp,
	"run_count" integer DEFAULT 0 NOT NULL,
	"success_count" integer DEFAULT 0 NOT NULL,
	"error_count" integer DEFAULT 0 NOT NULL,
	"average_execution_time" integer,
	"last_execution_duration" integer,
	"last_error" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cron_tasks_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "side_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"version" text DEFAULT '1.0.0' NOT NULL,
	"category" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"priority" text NOT NULL,
	"auto_restart" boolean DEFAULT true NOT NULL,
	"restart_delay" integer DEFAULT 5000,
	"max_restarts" integer DEFAULT 5,
	"health_check_interval" integer DEFAULT 30000,
	"process_id" text,
	"started_at" timestamp,
	"last_health_check" timestamp,
	"restart_count" integer DEFAULT 0 NOT NULL,
	"is_running" boolean DEFAULT false NOT NULL,
	"default_config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"environment" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"monitoring" jsonb,
	"documentation" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "side_tasks_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "task_runner_state" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_name" text NOT NULL,
	"task_type" text NOT NULL,
	"status" text NOT NULL,
	"started_at" timestamp NOT NULL,
	"environment" text NOT NULL,
	"runner_instance_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pulse_executions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pulse_id" text NOT NULL,
	"execution_id" text NOT NULL,
	"status" text NOT NULL,
	"health_status" text NOT NULL,
	"started_at" timestamp NOT NULL,
	"completed_at" timestamp,
	"duration_ms" integer,
	"total_tasks_discovered" integer DEFAULT 0 NOT NULL,
	"tasks_due" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"tasks_executed" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"tasks_succeeded" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"tasks_failed" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"tasks_skipped" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"total_execution_time_ms" integer,
	"result" jsonb,
	"errors" jsonb,
	"environment" text DEFAULT 'production',
	"triggered_by" text DEFAULT 'schedule',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pulse_health" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" text NOT NULL,
	"last_pulse_at" timestamp,
	"consecutive_failures" integer DEFAULT 0 NOT NULL,
	"avg_execution_time_ms" integer,
	"success_rate" integer,
	"total_executions" integer DEFAULT 0 NOT NULL,
	"total_successes" integer DEFAULT 0 NOT NULL,
	"total_failures" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb,
	"alerts_sent" integer DEFAULT 0 NOT NULL,
	"last_alert_at" timestamp,
	"is_maintenance_mode" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pulse_notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pulse_execution_id" uuid,
	"type" text NOT NULL,
	"severity" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"health_status" text NOT NULL,
	"consecutive_failures" integer DEFAULT 0,
	"recipients" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"channels" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sent" boolean DEFAULT false NOT NULL,
	"sent_at" timestamp,
	"error" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "side_task_executions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"task_name" text NOT NULL,
	"execution_id" text NOT NULL,
	"type" text NOT NULL,
	"status" text NOT NULL,
	"started_at" timestamp NOT NULL,
	"completed_at" timestamp,
	"duration_ms" integer,
	"process_id" text,
	"exit_code" integer,
	"signal" text,
	"result" jsonb,
	"error" jsonb,
	"error_stack" text,
	"triggered_by" text,
	"is_manual" boolean DEFAULT false NOT NULL,
	"restart_attempt" integer DEFAULT 0 NOT NULL,
	"environment" text DEFAULT 'production',
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "side_task_health_checks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"task_name" text NOT NULL,
	"is_healthy" boolean NOT NULL,
	"status" text NOT NULL,
	"message" text,
	"response_time_ms" integer,
	"memory_usage_mb" integer,
	"cpu_usage_percent" integer,
	"process_id" text,
	"is_running" boolean NOT NULL,
	"uptime" integer,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"role" text NOT NULL,
	"assigned_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"private_name" text NOT NULL,
	"public_name" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"marketing_consent" boolean DEFAULT false NOT NULL,
	"is_banned" boolean DEFAULT false NOT NULL,
	"banned_reason" text,
	"stripe_customer_id" text,
	"created_by" uuid,
	"updated_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_stripe_customer_id_unique" UNIQUE("stripe_customer_id")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "password_resets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "password_resets_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "password_resets_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "chat_folders" ADD CONSTRAINT "chat_folders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_folders" ADD CONSTRAINT "chat_folders_parent_id_chat_folders_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."chat_folders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_thread_id_chat_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."chat_threads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_parent_id_chat_messages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."chat_messages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_threads" ADD CONSTRAINT "chat_threads_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_threads" ADD CONSTRAINT "chat_threads_folder_id_chat_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."chat_folders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_personas" ADD CONSTRAINT "custom_personas_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_transactions" ADD CONSTRAINT "credit_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_transactions" ADD CONSTRAINT "credit_transactions_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_credits" ADD CONSTRAINT "user_credits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "imap_folders" ADD CONSTRAINT "imap_folders_account_id_imap_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."imap_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "smtp_accounts" ADD CONSTRAINT "smtp_accounts_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "smtp_accounts" ADD CONSTRAINT "smtp_accounts_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_campaigns" ADD CONSTRAINT "email_campaigns_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_credits" ADD CONSTRAINT "lead_credits_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_engagements" ADD CONSTRAINT "lead_engagements_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_engagements" ADD CONSTRAINT "lead_engagements_campaign_id_email_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."email_campaigns"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_links" ADD CONSTRAINT "lead_links_primary_lead_id_leads_id_fk" FOREIGN KEY ("primary_lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_links" ADD CONSTRAINT "lead_links_linked_lead_id_leads_id_fk" FOREIGN KEY ("linked_lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_converted_user_id_users_id_fk" FOREIGN KEY ("converted_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_leads" ADD CONSTRAINT "user_leads_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_leads" ADD CONSTRAINT "user_leads_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "csv_import_jobs" ADD CONSTRAINT "csv_import_jobs_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "import_batches" ADD CONSTRAINT "import_batches_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "newsletter_events" ADD CONSTRAINT "newsletter_events_subscription_id_newsletter_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."newsletter_subscriptions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "newsletter_events" ADD CONSTRAINT "newsletter_events_campaign_id_newsletter_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."newsletter_campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "newsletter_subscriptions" ADD CONSTRAINT "newsletter_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_disputes" ADD CONSTRAINT "payment_disputes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_disputes" ADD CONSTRAINT "payment_disputes_transaction_id_payment_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."payment_transactions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_invoices" ADD CONSTRAINT "payment_invoices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_refunds" ADD CONSTRAINT "payment_refunds_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_refunds" ADD CONSTRAINT "payment_refunds_transaction_id_payment_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."payment_transactions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cron_task_executions" ADD CONSTRAINT "cron_task_executions_task_id_cron_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."cron_tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cron_task_schedules" ADD CONSTRAINT "cron_task_schedules_task_id_cron_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."cron_tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pulse_notifications" ADD CONSTRAINT "pulse_notifications_pulse_execution_id_pulse_executions_id_fk" FOREIGN KEY ("pulse_execution_id") REFERENCES "public"."pulse_executions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "side_task_executions" ADD CONSTRAINT "side_task_executions_task_id_side_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."side_tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "side_task_health_checks" ADD CONSTRAINT "side_task_health_checks_task_id_side_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."side_tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_assigned_by_users_id_fk" FOREIGN KEY ("assigned_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_resets" ADD CONSTRAINT "password_resets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chat_folders_user_id_idx" ON "chat_folders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "chat_folders_root_folder_id_idx" ON "chat_folders" USING btree ("root_folder_id");--> statement-breakpoint
CREATE INDEX "chat_folders_parent_id_idx" ON "chat_folders" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "chat_folders_sort_order_idx" ON "chat_folders" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "chat_messages_search_vector_idx" ON "chat_messages" USING gin (to_tsvector('english', "content"));--> statement-breakpoint
CREATE INDEX "chat_messages_thread_id_idx" ON "chat_messages" USING btree ("thread_id");--> statement-breakpoint
CREATE INDEX "chat_messages_parent_id_idx" ON "chat_messages" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "chat_messages_role_idx" ON "chat_messages" USING btree ("role");--> statement-breakpoint
CREATE INDEX "chat_messages_created_at_idx" ON "chat_messages" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "chat_threads_search_vector_idx" ON "chat_threads" USING gin (to_tsvector('english', "title" || ' ' || COALESCE("preview", '') || ' ' || COALESCE("system_prompt", '')));--> statement-breakpoint
CREATE INDEX "chat_threads_user_id_idx" ON "chat_threads" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "chat_threads_root_folder_id_idx" ON "chat_threads" USING btree ("root_folder_id");--> statement-breakpoint
CREATE INDEX "chat_threads_folder_id_idx" ON "chat_threads" USING btree ("folder_id");--> statement-breakpoint
CREATE INDEX "chat_threads_status_idx" ON "chat_threads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "chat_threads_created_at_idx" ON "chat_threads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "chat_threads_updated_at_idx" ON "chat_threads" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "imap_accounts_email_idx" ON "imap_accounts" USING btree ("email");--> statement-breakpoint
CREATE INDEX "imap_accounts_user_id_idx" ON "imap_accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "imap_accounts_enabled_idx" ON "imap_accounts" USING btree ("enabled");--> statement-breakpoint
CREATE INDEX "imap_accounts_last_sync_idx" ON "imap_accounts" USING btree ("last_sync_at");--> statement-breakpoint
CREATE INDEX "imap_folders_account_id_idx" ON "imap_folders" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "imap_folders_path_idx" ON "imap_folders" USING btree ("path");--> statement-breakpoint
CREATE INDEX "imap_folders_name_idx" ON "imap_folders" USING btree ("name");--> statement-breakpoint
CREATE INDEX "imap_folders_special_use_idx" ON "imap_folders" USING btree ("special_use_type");--> statement-breakpoint
CREATE INDEX "imap_folders_last_sync_idx" ON "imap_folders" USING btree ("last_sync_at");--> statement-breakpoint
CREATE INDEX "emails_recipient_email_idx" ON "emails" USING btree ("recipient_email");--> statement-breakpoint
CREATE INDEX "emails_status_idx" ON "emails" USING btree ("status");--> statement-breakpoint
CREATE INDEX "emails_type_idx" ON "emails" USING btree ("type");--> statement-breakpoint
CREATE INDEX "emails_sent_at_idx" ON "emails" USING btree ("sent_at");--> statement-breakpoint
CREATE INDEX "emails_user_id_idx" ON "emails" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "emails_lead_id_idx" ON "emails" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "emails_created_at_idx" ON "emails" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "emails_imap_uid_idx" ON "emails" USING btree ("imap_uid");--> statement-breakpoint
CREATE INDEX "emails_imap_message_id_idx" ON "emails" USING btree ("imap_message_id");--> statement-breakpoint
CREATE INDEX "emails_imap_folder_id_idx" ON "emails" USING btree ("imap_folder_id");--> statement-breakpoint
CREATE INDEX "emails_smtp_account_id_idx" ON "emails" USING btree ("smtp_account_id");--> statement-breakpoint
CREATE INDEX "emails_imap_account_id_idx" ON "emails" USING btree ("imap_account_id");--> statement-breakpoint
CREATE INDEX "emails_is_read_idx" ON "emails" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX "emails_is_flagged_idx" ON "emails" USING btree ("is_flagged");--> statement-breakpoint
CREATE INDEX "emails_thread_id_idx" ON "emails" USING btree ("thread_id");--> statement-breakpoint
CREATE INDEX "emails_last_sync_at_idx" ON "emails" USING btree ("last_sync_at");--> statement-breakpoint
CREATE INDEX "smtp_accounts_status_idx" ON "smtp_accounts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "smtp_accounts_is_default_idx" ON "smtp_accounts" USING btree ("is_default");--> statement-breakpoint
CREATE INDEX "smtp_accounts_priority_idx" ON "smtp_accounts" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "smtp_accounts_from_email_idx" ON "smtp_accounts" USING btree ("from_email");--> statement-breakpoint
CREATE INDEX "smtp_accounts_created_by_idx" ON "smtp_accounts" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "smtp_accounts_last_health_check_idx" ON "smtp_accounts" USING btree ("last_health_check");--> statement-breakpoint
CREATE INDEX "smtp_accounts_last_used_at_idx" ON "smtp_accounts" USING btree ("last_used_at");