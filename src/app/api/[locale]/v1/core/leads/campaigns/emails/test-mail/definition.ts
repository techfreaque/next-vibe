/**
 * Test Email API Route Definition
 * Defines endpoint for sending test emails with custom lead data
 */

// dateSchema and undefinedSchema replaced with z.date() and z.never() respectively
import { z } from "zod";

import { EndpointErrorTypes, Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import { Countries, Languages } from "@/i18n/core/config";
import type { TranslationKey } from "@/i18n/core/static-types";

import { CampaignType } from "../../../../emails/smtp-client/enum";
import { UserRole } from "../../../../user/user-roles/enum";
import {
  EmailCampaignStage,
  EmailJourneyVariant,
  LeadSource,
  LeadStatus,
} from "../../../enum";

/**
 * Test Email Request Schema
 * Includes all lead data fields that can be customized for testing
 */
const testEmailRequestSchema = z.object({
  // SMTP Account Selection Criteria (single values for test emails)
  campaignType: z.string().optional(),
  emailJourneyVariant: z.string().optional(),
  emailCampaignStage: z.string().optional(),

  // Test recipient
  testEmail: z
    .string()
    .email(
      "leadsErrors.testEmail.validation.testEmail.invalid" satisfies TranslationKey,
    )
    .transform((val) => val.toLowerCase().trim()),

  // Lead data for template rendering
  leadData: z.object({
    businessName: z
      .string()
      .min(
        1,
        "leadsErrors.testEmail.validation.leadData.businessName.required" satisfies TranslationKey,
      )
      .max(
        255,
        "leadsErrors.testEmail.validation.leadData.businessName.tooLong" satisfies TranslationKey,
      )
      .transform((val) => val.trim()),
    contactName: z
      .string()
      .max(
        255,
        "leadsErrors.testEmail.validation.leadData.contactName.tooLong" satisfies TranslationKey,
      )
      .transform((val) => val?.trim() || null)
      .optional()
      .nullable(),

    website: z
      .string()
      .url(
        "leadsErrors.testEmail.validation.leadData.website.invalid" satisfies TranslationKey,
      )
      .transform((val) => val?.trim() || null)
      .optional()
      .nullable()
      .or(z.literal("")),
    country: z.string(),
    language: z.string(),
    status: z.string(),
    source: z.string().optional().nullable(),
    notes: z
      .string()
      .max(
        1000,
        "leadsErrors.testEmail.validation.leadData.notes.tooLong" satisfies TranslationKey,
      )
      .transform((val) => val?.trim() || null)
      .optional()
      .nullable(),
  }),
});

/**
 * Test Email Response Schema
 */
const testEmailResponseSchema = z.object({
  success: z.boolean(),
  messageId: z.string().optional(),
  testEmail: z.email(),
  subject: z.string(),
  sentAt: z.date(),
});

/**
 * Send Test Email Endpoint (POST)
 */
const sendTestEmailEndpoint = createEndpoint({
  title: "app.api.v1.core.leads.campaigns.emails.testMail.post.title",
  description: "app.api.v1.core.leads.campaigns.emails.testMail.post.description",
  method: Methods.POST,
  path: ["v1", "core", "leads", "campaigns", "emails", "test-mail"],
  requestSchema: testEmailRequestSchema,
  responseSchema: testEmailResponseSchema,
  requestUrlSchema: z.never(),
  examples: {},
  fieldDescriptions: {
    campaignType:
      "Campaign type to filter SMTP accounts by (lead_campaign, newsletter, etc.)",
    emailJourneyVariant: "Email journey variant to filter SMTP accounts by",
    emailCampaignStage: "Email campaign stage to filter SMTP accounts by",
    testEmail: "The email address to send the test email to",
    leadData: "Sample lead data to populate the email template with",
  },
  apiQueryOptions: {
    queryKey: ["test-email-send"],
    staleTime: 0,
    retry: 1,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  },
  allowedRoles: [UserRole.ADMIN],
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "leadsErrors.testEmail.error.validation.title",
      description: "leadsErrors.testEmail.error.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "leadsErrors.testEmail.error.unauthorized.title",
      description: "leadsErrors.testEmail.error.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "leadsErrors.testEmail.error.server.title",
      description: "leadsErrors.testEmail.error.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "leadsErrors.testEmail.error.unknown.title",
      description: "leadsErrors.testEmail.error.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "leadsErrors.testEmail.error.network.title",
      description: "leadsErrors.testEmail.error.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "leadsErrors.testEmail.error.forbidden.title",
      description: "leadsErrors.testEmail.error.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "leadsErrors.testEmail.error.notFound.title",
      description: "leadsErrors.testEmail.error.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "leadsErrors.testEmail.error.unsavedChanges.title",
      description: "leadsErrors.testEmail.error.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "leadsErrors.testEmail.error.conflict.title",
      description: "leadsErrors.testEmail.error.conflict.description",
    },
  },
  successTypes: {
    title: "leadsErrors.testEmail.success.title",
    description: "leadsErrors.testEmail.success.description",
  },
});

/**
 * Export endpoint definitions
 */
const testEmailEndpoints = {
  POST: sendTestEmailEndpoint.POST,
};

export default testEmailEndpoints;

/**
 * Type exports for convenience
 */
export type TestEmailRequestType = z.infer<typeof testEmailRequestSchema>;
export type TestEmailResponseType = z.infer<typeof testEmailResponseSchema>;
