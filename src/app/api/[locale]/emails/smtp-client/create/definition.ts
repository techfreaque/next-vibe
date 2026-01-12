/**
 * SMTP Account Create API Definition
 * Create new SMTP accounts
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  CountriesOptions,
  Languages,
  LanguagesOptions,
} from "@/i18n/core/config";

import {
  EmailCampaignStage,
  EmailCampaignStageOptions,
  EmailJourneyVariant,
  EmailJourneyVariantOptions,
} from "../../../leads/enum";
import { dateSchema } from "../../../shared/types/common.schema";
import { UserRole } from "../../../user/user-roles/enum";
import {
  CampaignType,
  CampaignTypeOptions,
  SmtpAccountStatus,
  SmtpHealthStatus,
  SmtpSecurityType,
  SmtpSecurityTypeOptions,
} from "../enum";

/**
 * POST endpoint definition - Create SMTP account
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["emails", "smtp-client", "create"],
  title: "app.api.emails.smtpClient.create.title",
  description: "app.api.emails.smtpClient.create.description",
  category: "app.api.emails.category",
  icon: "server",
  tags: ["app.api.emails.smtpClient.tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.emails.smtpClient.create.container.title",
      description: "app.api.emails.smtpClient.create.container.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === ACCOUNT INFORMATION ===
      accountInfo: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.emails.smtpClient.create.container.title",
          description: "app.api.emails.smtpClient.create.container.description",
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { request: "data" },
        {
          name: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.emails.smtpClient.create.name.label",
              description: "app.api.emails.smtpClient.create.name.description",
              placeholder: "app.api.emails.smtpClient.create.name.placeholder",
              columns: 12,
            },
            z.string().min(1),
          ),

          description: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXTAREA,
              label:
                "app.api.emails.smtpClient.create.accountDescription.label",
              description:
                "app.api.emails.smtpClient.create.accountDescription.description",
              placeholder:
                "app.api.emails.smtpClient.create.accountDescription.placeholder",
              columns: 12,
            },
            z.string().optional(),
          ),
        },
      ),

      // === SERVER CONFIGURATION ===
      serverConfig: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.emails.smtpClient.create.container.title",
          description: "app.api.emails.smtpClient.create.container.description",
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { request: "data" },
        {
          host: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.emails.smtpClient.create.host.label",
              description: "app.api.emails.smtpClient.create.host.description",
              placeholder: "app.api.emails.smtpClient.create.host.placeholder",
              columns: 12,
            },
            z.string().min(1),
          ),

          port: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.NUMBER,
              label: "app.api.emails.smtpClient.create.port.label",
              description: "app.api.emails.smtpClient.create.port.description",
              placeholder: "app.api.emails.smtpClient.create.port.placeholder",
              columns: 6,
            },
            z.coerce.number().min(1).max(65535),
          ),

          securityType: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label: "app.api.emails.smtpClient.create.securityType.label",
              description:
                "app.api.emails.smtpClient.create.securityType.description",
              placeholder:
                "app.api.emails.smtpClient.create.securityType.placeholder",
              columns: 6,
              options: SmtpSecurityTypeOptions,
            },
            z.enum(SmtpSecurityType),
          ),
        },
      ),

      // === AUTHENTICATION ===
      authentication: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.emails.smtpClient.create.container.title",
          description: "app.api.emails.smtpClient.create.container.description",
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { request: "data" },
        {
          username: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.emails.smtpClient.create.username.label",
              description:
                "app.api.emails.smtpClient.create.username.description",
              placeholder:
                "app.api.emails.smtpClient.create.username.placeholder",
              columns: 6,
            },
            z.string().min(1),
          ),

          password: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.PASSWORD,
              label: "app.api.emails.smtpClient.create.password.label",
              description:
                "app.api.emails.smtpClient.create.password.description",
              placeholder:
                "app.api.emails.smtpClient.create.password.placeholder",
              columns: 6,
            },
            z.string().min(1),
          ),
        },
      ),

      // === EMAIL CONFIGURATION ===
      emailConfig: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.emails.smtpClient.create.title",
          description: "app.api.emails.smtpClient.create.description",
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { request: "data" },
        {
          fromEmail: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.EMAIL,
              label: "app.api.emails.smtpClient.create.fromEmail.label",
              description:
                "app.api.emails.smtpClient.create.fromEmail.description",
              placeholder:
                "app.api.emails.smtpClient.create.fromEmail.placeholder",
              columns: 12,
            },
            z.email(),
          ),

          campaignTypes: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.MULTISELECT,
              label: "app.api.emails.smtpClient.create.campaignTypes.label",
              description:
                "app.api.emails.smtpClient.create.campaignTypes.description",
              placeholder:
                "app.api.emails.smtpClient.create.campaignTypes.placeholder",
              columns: 6,
              options: CampaignTypeOptions,
            },
            z.array(z.enum(CampaignType)).optional(),
          ),

          emailJourneyVariants: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.MULTISELECT,
              label:
                "app.api.emails.smtpClient.create.emailJourneyVariants.label",
              description:
                "app.api.emails.smtpClient.create.emailJourneyVariants.description",
              placeholder:
                "app.api.emails.smtpClient.create.emailJourneyVariants.placeholder",
              columns: 6,
              options: EmailJourneyVariantOptions,
            },
            z.array(z.enum(EmailJourneyVariant)).optional(),
          ),

          emailCampaignStages: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.MULTISELECT,
              label:
                "app.api.emails.smtpClient.create.emailCampaignStages.label",
              description:
                "app.api.emails.smtpClient.create.emailCampaignStages.description",
              placeholder:
                "app.api.emails.smtpClient.create.emailCampaignStages.placeholder",
              columns: 6,
              options: EmailCampaignStageOptions,
            },
            z.array(z.enum(EmailCampaignStage)).optional(),
          ),

          countries: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.MULTISELECT,
              label: "app.api.emails.smtpClient.create.countries.label",
              description:
                "app.api.emails.smtpClient.create.countries.description",
              placeholder:
                "app.api.emails.smtpClient.create.countries.placeholder",
              columns: 6,
              options: CountriesOptions,
            },
            z.array(z.enum(["GLOBAL", "DE", "PL", "US"])).optional(),
          ),

          languages: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.MULTISELECT,
              label: "app.api.emails.smtpClient.create.languages.label",
              description:
                "app.api.emails.smtpClient.create.languages.description",
              placeholder:
                "app.api.emails.smtpClient.create.languages.placeholder",
              columns: 6,
              options: LanguagesOptions,
            },
            z.array(z.enum(Languages)).optional(),
          ),
        },
      ),

      // === RESPONSE FIELDS ===
      account: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.emails.smtpClient.create.response.account.title",
          description:
            "app.api.emails.smtpClient.create.response.account.description",
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { response: true },
        {
          // === ACCOUNT SUMMARY ===
          accountSummary: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.emails.smtpClient.create.response.accountSummary.title",
              description:
                "app.api.emails.smtpClient.create.response.accountSummary.description",
              layoutType: LayoutType.GRID,
              columns: 12,
            },
            { response: true },
            {
              id: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.smtpClient.create.response.account.id",
                },
                z.uuid(),
              ),
              name: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.smtpClient.create.response.account.name",
                },
                z.string(),
              ),
              description: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.smtpClient.create.response.account.accountDescription",
                },
                z.string().optional(),
              ),
              status: responseField(
                {
                  type: WidgetType.BADGE,
                  text: "app.api.emails.smtpClient.create.response.account.status",
                },
                z.enum(SmtpAccountStatus),
              ),
            },
          ),

          // === CONNECTION DETAILS ===
          connectionDetails: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.emails.smtpClient.create.response.connectionDetails.title",
              description:
                "app.api.emails.smtpClient.create.response.connectionDetails.description",
              layoutType: LayoutType.GRID,
              columns: 12,
            },
            { response: true },
            {
              host: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.smtpClient.create.response.account.host",
                },
                z.string(),
              ),
              port: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.smtpClient.create.response.account.port",
                },
                z.coerce.number().int(),
              ),
              securityType: responseField(
                {
                  type: WidgetType.BADGE,
                  text: "app.api.emails.smtpClient.create.response.account.securityType",
                },
                z.enum(SmtpSecurityType),
              ),
              username: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.smtpClient.create.response.account.username",
                },
                z.string(),
              ),
              fromEmail: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.smtpClient.create.response.account.fromEmail",
                },
                z.email(),
              ),
              healthCheckStatus: responseField(
                {
                  type: WidgetType.BADGE,
                  text: "app.api.emails.smtpClient.create.response.account.healthCheckStatus",
                },
                z.enum(SmtpHealthStatus).nullable(),
              ),
              campaignTypes: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.smtpClient.create.response.account.campaignTypes",
                },
                z.array(z.enum(CampaignType)).optional(),
              ),
              emailJourneyVariants: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.smtpClient.create.response.account.emailJourneyVariants",
                },
                z.array(z.enum(EmailJourneyVariant)).optional(),
              ),
              emailCampaignStages: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.smtpClient.create.response.account.emailCampaignStages",
                },
                z.array(z.enum(EmailCampaignStage)).optional(),
              ),
              countries: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.smtpClient.create.response.account.countries",
                },
                z.array(z.enum(["GLOBAL", "DE", "PL", "US"])).optional(),
              ),
              languages: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.smtpClient.create.response.account.languages",
                },
                z.array(z.enum(["en", "de", "pl"])).optional(),
              ),
            },
          ),

          // === PERFORMANCE METRICS ===
          performanceMetrics: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.emails.smtpClient.create.response.performanceMetrics.title",
              description:
                "app.api.emails.smtpClient.create.response.performanceMetrics.description",
              layoutType: LayoutType.GRID,
              columns: 12,
            },
            { response: true },
            {
              priority: responseField(
                {
                  type: WidgetType.BADGE,
                  text: "app.api.emails.smtpClient.create.response.account.priority",
                },
                z.coerce.number().int().optional(),
              ),
              totalEmailsSent: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.smtpClient.create.response.account.totalEmailsSent",
                },
                z.coerce.number().int(),
              ),
              createdAt: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.smtpClient.create.response.account.createdAt",
                },
                dateSchema,
              ),
              updatedAt: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.smtpClient.create.response.account.updatedAt",
                },
                dateSchema,
              ),
            },
          ),
        },
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.emails.smtpClient.create.errors.validation.title",
      description:
        "app.api.emails.smtpClient.create.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.emails.smtpClient.create.errors.unauthorized.title",
      description:
        "app.api.emails.smtpClient.create.errors.unauthorized.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.emails.smtpClient.create.errors.conflict.title",
      description:
        "app.api.emails.smtpClient.create.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.emails.smtpClient.create.errors.server.title",
      description: "app.api.emails.smtpClient.create.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.emails.smtpClient.create.errors.unknown.title",
      description:
        "app.api.emails.smtpClient.create.errors.unknown.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.emails.smtpClient.create.errors.forbidden.title",
      description:
        "app.api.emails.smtpClient.create.errors.forbidden.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.emails.smtpClient.create.errors.network.title",
      description:
        "app.api.emails.smtpClient.create.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.emails.smtpClient.create.errors.notFound.title",
      description:
        "app.api.emails.smtpClient.create.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.emails.smtpClient.create.errors.unsavedChanges.title",
      description:
        "app.api.emails.smtpClient.create.errors.unsavedChanges.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.emails.smtpClient.create.success.title",
    description: "app.api.emails.smtpClient.create.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        accountInfo: {
          name: "Marketing Campaign SMTP",
          description: "Primary SMTP account for marketing email campaigns",
        },
        serverConfig: {
          host: "smtp.example.com",
          port: 587,
          securityType: SmtpSecurityType.STARTTLS,
        },
        authentication: {
          username: "campaigns@example.com",
          password: "secure_app_password",
        },
        emailConfig: {
          fromEmail: "campaigns@example.com",
        },
      },
      withIssues: {
        accountInfo: {
          name: "Test SMTP Account",
          description: "Testing SMTP configuration",
        },
        serverConfig: {
          host: "smtp.testserver.com",
          port: 587,
          securityType: SmtpSecurityType.STARTTLS,
        },
        authentication: {
          username: "test@testserver.com",
          password: "test_password",
        },
        emailConfig: {
          fromEmail: "test@testserver.com",
        },
      },
      gmail: {
        accountInfo: {
          name: "Gmail SMTP",
          description: "Gmail SMTP configuration for transactional emails",
        },
        serverConfig: {
          host: "smtp.gmail.com",
          port: 587,
          securityType: SmtpSecurityType.STARTTLS,
        },
        authentication: {
          username: "yourapp@gmail.com",
          password: "app-specific-password",
        },
        emailConfig: {
          fromEmail: "yourapp@gmail.com",
        },
      },
    },
    responses: {
      default: {
        account: {
          accountSummary: {
            id: "550e8400-e29b-41d4-a716-446655440001",
            name: "Marketing Campaign SMTP",
            description: "Primary SMTP account for marketing email campaigns",
            status: SmtpAccountStatus.ACTIVE,
          },
          connectionDetails: {
            host: "smtp.example.com",
            port: 587,
            securityType: SmtpSecurityType.STARTTLS,
            username: "campaigns@example.com",
            fromEmail: "campaigns@example.com",
            healthCheckStatus: SmtpHealthStatus.HEALTHY,
          },
          performanceMetrics: {
            priority: 10,
            totalEmailsSent: 0,
            createdAt: "2024-01-07T12:00:00.000Z",
            updatedAt: "2024-01-07T12:00:00.000Z",
          },
        },
      },
      withIssues: {
        account: {
          accountSummary: {
            id: "550e8400-e29b-41d4-a716-446655440002",
            name: "Test SMTP Account",
            description: "Testing SMTP configuration",
            status: SmtpAccountStatus.TESTING,
          },
          connectionDetails: {
            host: "smtp.testserver.com",
            port: 587,
            securityType: SmtpSecurityType.STARTTLS,
            username: "test@testserver.com",
            fromEmail: "test@testserver.com",
            healthCheckStatus: SmtpHealthStatus.UNHEALTHY,
          },
          performanceMetrics: {
            priority: 5,
            totalEmailsSent: 0,
            createdAt: "2024-01-07T12:05:00.000Z",
            updatedAt: "2024-01-07T12:05:00.000Z",
          },
        },
      },
      gmail: {
        account: {
          accountSummary: {
            id: "550e8400-e29b-41d4-a716-446655440003",
            name: "Gmail SMTP",
            description: "Gmail SMTP configuration for transactional emails",
            status: SmtpAccountStatus.ACTIVE,
          },
          connectionDetails: {
            host: "smtp.gmail.com",
            port: 587,
            securityType: SmtpSecurityType.STARTTLS,
            username: "yourapp@gmail.com",
            fromEmail: "yourapp@gmail.com",
            healthCheckStatus: SmtpHealthStatus.HEALTHY,
          },
          performanceMetrics: {
            priority: 8,
            totalEmailsSent: 0,
            createdAt: "2024-01-07T12:10:00.000Z",
            updatedAt: "2024-01-07T12:10:00.000Z",
          },
        },
      },
    },
  },
});

// Export types following migration guide pattern
export type SmtpAccountCreateRequestInput = typeof POST.types.RequestInput;
export type SmtpAccountCreateRequestOutput = typeof POST.types.RequestOutput;
export type SmtpAccountCreateResponseInput = typeof POST.types.ResponseInput;
export type SmtpAccountCreateResponseOutput = typeof POST.types.ResponseOutput;

// Export repository types for import standardization
// (Types already exported above, no need for duplicate exports)

const definitions = {
  POST,
};

export default definitions;
