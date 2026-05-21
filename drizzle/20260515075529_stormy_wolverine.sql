CREATE TABLE "corvina_device_subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"logical_id" text NOT NULL,
	"org_resource_id" text NOT NULL,
	"client_email" text,
	"trial_start_date" timestamp,
	"subscription_end_date" timestamp,
	"reminder_sent_at" timestamp,
	"reminder_cycle_key" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "corvina_device_subscriptions_logical_id_unique" UNIQUE("logical_id")
);
--> statement-breakpoint
CREATE TABLE "corvina_purchase_inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"logical_id" text NOT NULL,
	"org_resource_id" text,
	"device_label" text,
	"contact_name" text NOT NULL,
	"contact_email" text NOT NULL,
	"contact_phone" text,
	"message" text,
	"requested_months" integer,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
