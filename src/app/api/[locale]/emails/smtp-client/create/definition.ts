/**
 * SMTP Account Create API Definition
 * Create new SMTP accounts
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  scopedBackButton,
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
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
import { scopedTranslation } from "./i18n";
import { SmtpCreateContainer } from "./widget";

/**
 * POST endpoint definition - Create SMTP account
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["emails", "smtp-client", "create"],
  title: "title",
  description: "description",
  category: "category",
  icon: "server",
  tags: ["tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: SmtpCreateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: scopedBackButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),

      // === ACCOUNT INFORMATION ===
      accountInfo: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "container.title",
        description: "container.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { request: "data" },
        children: {
          name: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "name.label",
            description: "name.description",
            placeholder: "name.placeholder",
            columns: 12,
            schema: z.string().min(1),
          }),

          description: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXTAREA,
            label: "accountDescription.label",
            description: "accountDescription.description",
            placeholder: "accountDescription.placeholder",
            columns: 12,
            schema: z.string().optional(),
          }),
        },
      }),

      // === SERVER CONFIGURATION ===
      serverConfig: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "container.title",
        description: "container.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { request: "data" },
        children: {
          host: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "host.label",
            description: "host.description",
            placeholder: "host.placeholder",
            columns: 12,
            schema: z.string().min(1),
          }),

          port: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "port.label",
            description: "port.description",
            placeholder: "port.placeholder",
            columns: 6,
            schema: z.coerce.number().min(1).max(65535),
          }),

          securityType: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "securityType.label",
            description: "securityType.description",
            placeholder: "securityType.placeholder",
            columns: 6,
            options: SmtpSecurityTypeOptions,
            schema: z.enum(SmtpSecurityType),
          }),
        },
      }),

      // === AUTHENTICATION ===
      authentication: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "container.title",
        description: "container.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { request: "data" },
        children: {
          username: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "username.label",
            description: "username.description",
            placeholder: "username.placeholder",
            columns: 6,
            schema: z.string().min(1),
          }),

          password: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.PASSWORD,
            label: "password.label",
            description: "password.description",
            placeholder: "password.placeholder",
            columns: 6,
            schema: z.string().min(1),
          }),
        },
      }),

      // === EMAIL CONFIGURATION ===
      emailConfig: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "title",
        description: "description",
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { request: "data" },
        children: {
          fromEmail: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.EMAIL,
            label: "fromEmail.label",
            description: "fromEmail.description",
            placeholder: "fromEmail.placeholder",
            columns: 12,
            schema: z.email(),
          }),

          campaignTypes: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.MULTISELECT,
            label: "campaignTypes.label",
            description: "campaignTypes.description",
            placeholder: "campaignTypes.placeholder",
            columns: 6,
            options: CampaignTypeOptions,
            schema: z.array(z.enum(CampaignType)).optional(),
          }),

          emailJourneyVariants: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.MULTISELECT,
            label: "emailJourneyVariants.label",
            description: "emailJourneyVariants.description",
            placeholder: "emailJourneyVariants.placeholder",
            columns: 6,
            options: EmailJourneyVariantOptions,
            schema: z.array(z.enum(EmailJourneyVariant)).optional(),
          }),

          emailCampaignStages: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.MULTISELECT,
            label: "emailCampaignStages.label",
            description: "emailCampaignStages.description",
            placeholder: "emailCampaignStages.placeholder",
            columns: 6,
            options: EmailCampaignStageOptions,
            schema: z.array(z.enum(EmailCampaignStage)).optional(),
          }),

          countries: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.MULTISELECT,
            label: "countries.label",
            description: "countries.description",
            placeholder: "countries.placeholder",
            columns: 6,
            options: CountriesOptions,
            schema: z.array(z.enum(["GLOBAL", "DE", "PL", "US"])).optional(),
          }),

          languages: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.MULTISELECT,
            label: "languages.label",
            description: "languages.description",
            placeholder: "languages.placeholder",
            columns: 6,
            options: LanguagesOptions,
            schema: z.array(z.enum(Languages)).optional(),
          }),
        },
      }),

      // === RESPONSE FIELDS ===
      account: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.account.title",
        description: "response.account.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          // === ACCOUNT SUMMARY ===
          accountSummary: scopedObjectFieldNew(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "response.accountSummary.title",
            description: "response.accountSummary.description",
            layoutType: LayoutType.GRID,
            columns: 12,
            usage: { response: true },
            children: {
              id: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.account.id",
                schema: z.uuid(),
              }),
              name: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.account.name",
                schema: z.string(),
              }),
              description: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.account.accountDescription",
                schema: z.string().optional(),
              }),
              status: scopedResponseField(scopedTranslation, {
                type: WidgetType.BADGE,
                text: "response.account.status",
                schema: z.enum(SmtpAccountStatus),
              }),
            },
          }),

          // === CONNECTION DETAILS ===
          connectionDetails: scopedObjectFieldNew(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "response.connectionDetails.title",
            description: "response.connectionDetails.description",
            layoutType: LayoutType.GRID,
            columns: 12,
            usage: { response: true },
            children: {
              host: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.account.host",
                schema: z.string(),
              }),
              port: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.account.port",
                schema: z.coerce.number().int(),
              }),
              securityType: scopedResponseField(scopedTranslation, {
                type: WidgetType.BADGE,
                text: "response.account.securityType",
                schema: z.enum(SmtpSecurityType),
              }),
              username: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.account.username",
                schema: z.string(),
              }),
              fromEmail: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.account.fromEmail",
                schema: z.email(),
              }),
              healthCheckStatus: scopedResponseField(scopedTranslation, {
                type: WidgetType.BADGE,
                text: "response.account.healthCheckStatus",
                schema: z.enum(SmtpHealthStatus).nullable(),
              }),
              campaignTypes: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.account.campaignTypes",
                schema: z.array(z.enum(CampaignType)).optional(),
              }),
              emailJourneyVariants: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.account.emailJourneyVariants",
                schema: z.array(z.enum(EmailJourneyVariant)).optional(),
              }),
              emailCampaignStages: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.account.emailCampaignStages",
                schema: z.array(z.enum(EmailCampaignStage)).optional(),
              }),
              countries: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.account.countries",
                schema: z
                  .array(z.enum(["GLOBAL", "DE", "PL", "US"]))
                  .optional(),
              }),
              languages: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.account.languages",
                schema: z.array(z.enum(["en", "de", "pl"])).optional(),
              }),
            },
          }),

          // === PERFORMANCE METRICS ===
          performanceMetrics: scopedObjectFieldNew(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "response.performanceMetrics.title",
            description: "response.performanceMetrics.description",
            layoutType: LayoutType.GRID,
            columns: 12,
            usage: { response: true },
            children: {
              priority: scopedResponseField(scopedTranslation, {
                type: WidgetType.BADGE,
                text: "response.account.priority",
                schema: z.coerce.number().int().optional(),
              }),
              totalEmailsSent: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.account.totalEmailsSent",
                schema: z.coerce.number().int(),
              }),
              createdAt: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.account.createdAt",
                schema: dateSchema,
              }),
              updatedAt: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.account.updatedAt",
                schema: dateSchema,
              }),
            },
          }),
        },
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "success.title",
    description: "success.description",
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
