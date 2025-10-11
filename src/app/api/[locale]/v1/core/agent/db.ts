/**
 * Email Agent Database Schema
 * Database tables for email agent processing system
 */

import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { emails } from "../emails/messages/db";
import type {
  BounceCategory,
  EmailAgentActionType,
  EmailAgentToolType,
} from "./enum";
import {
  BounceCategoryDB,
  ConfirmationStatus,
  ConfirmationStatusDB,
  EmailAgentActionTypeDB,
  EmailAgentStatus,
  EmailAgentStatusDB,
  EmailAgentToolTypeDB,
  ProcessingPriority,
  ProcessingPriorityDB,
} from "./enum";

/**
 * Type definitions for JSON fields
 */
export interface HardRulesAction {
  type: keyof typeof EmailAgentActionType;
  reason: string;
  confidence: number;
  metadata?: Record<string, string>;
}

export interface HardRulesResult {
  processed: boolean;
  actions: HardRulesAction[];
  bounceDetected?: boolean;
  bounceCategory?: keyof typeof BounceCategory;
  spamDetected?: boolean;
  deliveryFailureReason?: string;
}

export interface AiRecommendedAction {
  type: keyof typeof EmailAgentActionType;
  priority: keyof typeof ProcessingPriority;
  reasoning: string;
  confidence: number;
}

export interface AiToolCall {
  toolType: keyof typeof EmailAgentToolType;
  parameters: Record<string, string>;
  requiresConfirmation: boolean;
  reasoning: string;
  confidence: number;
}

export interface AiProcessingResult {
  processed: boolean;
  systemPromptUsed: string;
  reasoning: string;
  confidence: number;
  recommendedActions: AiRecommendedAction[];
  toolCalls: AiToolCall[];
  chainAnalysis?: {
    contextUsed: boolean;
    chainSummary?: string;
    relationshipAnalysis?: string;
  };
}

/**
 * NOTE: Using text() instead of pgEnum() because translation keys exceed PostgreSQL's 63-byte enum label limit
 * Type safety is maintained through Zod validation in the schema
 */

/**
 * Email Agent Processing Table
 * Tracks processing status and results for each email
 */
export const emailAgentProcessing = pgTable(
  "email_agent_processing",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Email reference
    emailId: uuid("email_id")
      .notNull()
      .references(() => emails.id, { onDelete: "cascade" }),

    // Processing status
    status: text("status", { enum: EmailAgentStatusDB })
      .notNull()
      .default(EmailAgentStatus.PENDING),
    priority: text("priority", { enum: ProcessingPriorityDB })
      .notNull()
      .default(ProcessingPriority.NORMAL),

    // Processing stages
    hardRulesProcessedAt: timestamp("hard_rules_processed_at"),
    hardRulesResult: json("hard_rules_result").$type<HardRulesResult>(),

    aiProcessedAt: timestamp("ai_processed_at"),
    aiProcessingResult: json(
      "ai_processing_result",
    ).$type<AiProcessingResult>(),

    // Email chain context
    chainId: uuid("chain_id"), // Groups related emails
    chainContext: json("chain_context").$type<{
      messageCount: number;
      participants: string[];
      subject: string;
      dateRange: { start: string; end: string };
      lastActivity: string;
    }>(),

    // Bounce and spam detection
    bounceCategory: text("bounce_category", { enum: BounceCategoryDB }),
    spamDetected: boolean("spam_detected").default(false),
    deliveryFailureReason: text("delivery_failure_reason"),

    // Processing metadata
    processingAttempts: integer("processing_attempts").notNull().default(0),
    lastProcessedAt: timestamp("last_processed_at"),
    completedAt: timestamp("completed_at"),

    // Error tracking
    errors: json("errors").$type<string[]>().default([]),
    lastError: text("last_error"),
    lastErrorAt: timestamp("last_error_at"),

    // Audit fields
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    emailIdIdx: index("email_agent_processing_email_id_idx").on(table.emailId),
    statusIdx: index("email_agent_processing_status_idx").on(table.status),
    priorityIdx: index("email_agent_processing_priority_idx").on(
      table.priority,
    ),
    chainIdIdx: index("email_agent_processing_chain_id_idx").on(table.chainId),
    bounceCategoryIdx: index("email_agent_processing_bounce_category_idx").on(
      table.bounceCategory,
    ),
    spamDetectedIdx: index("email_agent_processing_spam_detected_idx").on(
      table.spamDetected,
    ),
    lastProcessedAtIdx: index(
      "email_agent_processing_last_processed_at_idx",
    ).on(table.lastProcessedAt),
    createdAtIdx: index("email_agent_processing_created_at_idx").on(
      table.createdAt,
    ),
  }),
);

/**
 * Human Confirmation Requests Table
 * Tracks actions requiring human approval
 */
export const humanConfirmationRequests = pgTable(
  "human_confirmation_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Email and processing reference
    emailId: uuid("email_id")
      .notNull()
      .references(() => emails.id, { onDelete: "cascade" }),
    processingId: uuid("processing_id")
      .notNull()
      .references(() => emailAgentProcessing.id, { onDelete: "cascade" }),

    // Action details
    actionType: text("action_type", { enum: EmailAgentActionTypeDB }).notNull(),
    toolCall: json("tool_call").$type<AiToolCall>(),

    // Request details
    reasoning: text("reasoning").notNull(),
    requestedAt: timestamp("requested_at").defaultNow().notNull(),
    expiresAt: timestamp("expires_at").notNull(),

    // Response details
    status: text("status", { enum: ConfirmationStatusDB })
      .notNull()
      .default(ConfirmationStatus.PENDING),
    respondedAt: timestamp("responded_at"),
    respondedBy: uuid("responded_by"), // Admin user ID
    response: text("response"), // Approval/rejection reason

    // Execution details
    executedAt: timestamp("executed_at"),
    executionResult: json("execution_result").$type<Record<string, string>>(),
    executionError: text("execution_error"),

    // Metadata
    metadata: json("metadata").$type<Record<string, string>>().default({}),

    // Audit fields
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    emailIdIdx: index("human_confirmation_requests_email_id_idx").on(
      table.emailId,
    ),
    processingIdIdx: index("human_confirmation_requests_processing_id_idx").on(
      table.processingId,
    ),
    statusIdx: index("human_confirmation_requests_status_idx").on(table.status),
    actionTypeIdx: index("human_confirmation_requests_action_type_idx").on(
      table.actionType,
    ),
    expiresAtIdx: index("human_confirmation_requests_expires_at_idx").on(
      table.expiresAt,
    ),
    requestedAtIdx: index("human_confirmation_requests_requested_at_idx").on(
      table.requestedAt,
    ),
    respondedByIdx: index("human_confirmation_requests_responded_by_idx").on(
      table.respondedBy,
    ),
  }),
);

/**
 * Relations
 */
export const emailAgentProcessingRelations = relations(
  emailAgentProcessing,
  ({ one, many }) => ({
    email: one(emails, {
      fields: [emailAgentProcessing.emailId],
      references: [emails.id],
    }),
    confirmationRequests: many(humanConfirmationRequests),
  }),
);

export const humanConfirmationRequestsRelations = relations(
  humanConfirmationRequests,
  ({ one }) => ({
    email: one(emails, {
      fields: [humanConfirmationRequests.emailId],
      references: [emails.id],
    }),
    processing: one(emailAgentProcessing, {
      fields: [humanConfirmationRequests.processingId],
      references: [emailAgentProcessing.id],
    }),
  }),
);

/**
 * Zod Schemas
 */
export const selectEmailAgentProcessingSchema =
  createSelectSchema(emailAgentProcessing);
export const insertEmailAgentProcessingSchema =
  createInsertSchema(emailAgentProcessing);
export const selectHumanConfirmationRequestSchema = createSelectSchema(
  humanConfirmationRequests,
);
export const insertHumanConfirmationRequestSchema = createInsertSchema(
  humanConfirmationRequests,
);

/**
 * Type exports
 */
export type EmailAgentProcessing = typeof emailAgentProcessing.$inferSelect;
export type NewEmailAgentProcessing = typeof emailAgentProcessing.$inferInsert;

export type HumanConfirmationRequest =
  typeof humanConfirmationRequests.$inferSelect;
export type NewHumanConfirmationRequest =
  typeof humanConfirmationRequests.$inferInsert;
