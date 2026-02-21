/**
 * SMTP Account Edit API Definition
 * Edit existing SMTP accounts
 */

import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  objectField,
  requestField,
  requestResponseField,
  requestUrlPathParamsResponseField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  Countries,
  CountriesOptions,
  Languages,
  LanguagesOptions,
} from "@/i18n/core/config";

import {
  EmailCampaignStage,
  EmailCampaignStageOptions,
  EmailJourneyVariant,
  EmailJourneyVariantOptions,
} from "../../../../leads/enum";
import { UserRole } from "../../../../user/user-roles/enum";
import {
  CampaignType,
  CampaignTypeOptions,
  SmtpAccountStatus,
  SmtpHealthStatus,
  SmtpSecurityType,
  SmtpSecurityTypeOptions,
} from "../../enum";
import { SmtpEditContainer } from "./widget";

/**
 * GET endpoint for retrieving SMTP account by ID
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["emails", "smtp-client", "edit", "[id]"],
  title: "app.api.emails.smtpClient.edit.id.get.title",
  description: "app.api.emails.smtpClient.edit.id.get.description",
  category: "app.api.emails.category",
  icon: "server",
  tags: ["app.api.emails.smtpClient.tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.emails.smtpClient.edit.id.get.container.title",
      description:
        "app.api.emails.smtpClient.edit.id.get.container.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "urlPathParams", response: true },
    {
      // === URL PARAMETER ===
      id: requestUrlPathParamsResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.emails.smtpClient.edit.id.fields.id.label",
        description: "app.api.emails.smtpClient.edit.id.fields.id.description",
        columns: 12,
        schema: z.uuid(),
      }),

      name: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.smtpClient.edit.id.response.account.name",
        schema: z.string(),
      }),
      description: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.smtpClient.edit.id.response.account.fields.description",
        schema: z.string().optional(),
      }),
      host: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.smtpClient.edit.id.response.account.host",
        schema: z.string(),
      }),
      port: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.smtpClient.edit.id.response.account.port",
        schema: z.coerce.number().int(),
      }),
      securityType: responseField({
        type: WidgetType.BADGE,
        text: "app.api.emails.smtpClient.edit.id.response.account.securityType",
        schema: z.enum(SmtpSecurityType),
      }),
      username: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.smtpClient.edit.id.response.account.username",
        schema: z.string(),
      }),
      fromEmail: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.smtpClient.edit.id.response.account.fromEmail",
        schema: z.email(),
      }),
      status: responseField({
        type: WidgetType.BADGE,
        text: "app.api.emails.smtpClient.edit.id.response.account.status",
        schema: z.enum(SmtpAccountStatus),
      }),
      healthCheckStatus: responseField({
        type: WidgetType.BADGE,
        text: "app.api.emails.smtpClient.edit.id.response.account.healthCheckStatus",
        schema: z.enum(SmtpHealthStatus).nullable(),
      }),
      priority: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.smtpClient.edit.id.response.account.priority",
        schema: z.coerce.number().int().optional(),
      }),
      totalEmailsSent: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.smtpClient.edit.id.response.account.totalEmailsSent",
        schema: z.coerce.number().int(),
      }),
      lastUsedAt: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.smtpClient.edit.id.response.account.lastUsedAt",
        schema: dateSchema.nullable(),
      }),
      createdAt: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.smtpClient.edit.id.response.account.createdAt",
        schema: dateSchema,
      }),
      updatedAt: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.smtpClient.edit.id.response.account.updatedAt",
        schema: dateSchema,
      }),
      campaignTypes: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.smtpClient.edit.id.response.account.campaignTypes",
        schema: z.array(z.enum(CampaignType)).optional(),
      }),
      emailJourneyVariants: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.smtpClient.edit.id.response.account.emailJourneyVariants",
        schema: z.array(z.enum(EmailJourneyVariant)).optional(),
      }),
      emailCampaignStages: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.smtpClient.edit.id.response.account.emailCampaignStages",
        schema: z.array(z.enum(EmailCampaignStage)).optional(),
      }),
      countries: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.smtpClient.edit.id.response.account.countries",
        schema: z.array(z.enum(Countries)).optional(),
      }),
      languages: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.smtpClient.edit.id.response.account.languages",
        schema: z.array(z.enum(Languages)).optional(),
      }),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.emails.smtpClient.edit.id.errors.validation.title",
      description:
        "app.api.emails.smtpClient.edit.id.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.emails.smtpClient.edit.id.errors.unauthorized.title",
      description:
        "app.api.emails.smtpClient.edit.id.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.emails.smtpClient.edit.id.errors.forbidden.title",
      description:
        "app.api.emails.smtpClient.edit.id.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.emails.smtpClient.edit.id.errors.notFound.title",
      description:
        "app.api.emails.smtpClient.edit.id.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.emails.smtpClient.edit.id.errors.conflict.title",
      description:
        "app.api.emails.smtpClient.edit.id.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.emails.smtpClient.edit.id.errors.server.title",
      description:
        "app.api.emails.smtpClient.edit.id.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.emails.smtpClient.edit.id.errors.networkError.title",
      description:
        "app.api.emails.smtpClient.edit.id.errors.networkError.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.emails.smtpClient.edit.id.errors.unsavedChanges.title",
      description:
        "app.api.emails.smtpClient.edit.id.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.emails.smtpClient.edit.id.errors.unknown.title",
      description:
        "app.api.emails.smtpClient.edit.id.errors.unknown.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.emails.smtpClient.edit.id.success.title",
    description: "app.api.emails.smtpClient.edit.id.success.description",
  },

  // === EXAMPLES ===
  examples: {
    urlPathParams: {
      default: {
        id: "550e8400-e29b-41d4-a716-446655440001",
      },
    },
    responses: {
      default: {
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: "Campaign SMTP",
        description: "SMTP account for marketing campaigns",
        host: "smtp.example.com",
        port: 587,
        securityType: SmtpSecurityType.STARTTLS,
        username: "campaigns@example.com",
        fromEmail: "campaigns@example.com",
        status: SmtpAccountStatus.ACTIVE,
        healthCheckStatus: SmtpHealthStatus.HEALTHY,
        priority: 10,
        totalEmailsSent: 15000,
        lastUsedAt: "2024-01-07T11:45:00.000Z",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-07T10:00:00.000Z",
      },
    },
  },
});

/**
 * PUT endpoint for updating SMTP account
 */
const { PUT } = createEndpoint({
  method: Methods.PUT,
  path: ["emails", "smtp-client", "edit", "[id]"],
  title: "app.api.emails.smtpClient.edit.id.put.title",
  description: "app.api.emails.smtpClient.edit.id.put.description",
  category: "app.api.emails.category",
  icon: "server",
  tags: ["app.api.emails.smtpClient.tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: SmtpEditContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      backButton: backButton({ usage: { request: "data", response: true } }),

      // === URL PARAMETER ===
      id: requestUrlPathParamsResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.emails.smtpClient.edit.id.fields.id.label",
        description: "app.api.emails.smtpClient.edit.id.fields.id.description",
        columns: 12,
        schema: z.uuid(),
      }),

      name: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.emails.smtpClient.edit.id.fields.name.label",
        description:
          "app.api.emails.smtpClient.edit.id.fields.name.description",
        placeholder:
          "app.api.emails.smtpClient.edit.id.fields.name.placeholder",
        columns: 6,
        schema: z.string().min(1).optional(),
      }),

      description: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "app.api.emails.smtpClient.edit.id.fields.description.label",
        description:
          "app.api.emails.smtpClient.edit.id.fields.description.description",
        placeholder:
          "app.api.emails.smtpClient.edit.id.fields.description.placeholder",
        columns: 12,
        schema: z.string().optional(),
      }),

      host: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.emails.smtpClient.edit.id.fields.host.label",
        description:
          "app.api.emails.smtpClient.edit.id.fields.host.description",
        placeholder:
          "app.api.emails.smtpClient.edit.id.fields.host.placeholder",
        columns: 6,
        schema: z.string().min(1).optional(),
      }),

      port: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.emails.smtpClient.edit.id.fields.port.label",
        description:
          "app.api.emails.smtpClient.edit.id.fields.port.description",
        placeholder:
          "app.api.emails.smtpClient.edit.id.fields.port.placeholder",
        columns: 6,
        schema: z.coerce.number().min(1).max(65535).optional(),
      }),

      securityType: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.emails.smtpClient.edit.id.fields.securityType.label",
        description:
          "app.api.emails.smtpClient.edit.id.fields.securityType.description",
        placeholder:
          "app.api.emails.smtpClient.edit.id.fields.securityType.placeholder",
        columns: 6,
        options: SmtpSecurityTypeOptions,
        schema: z.enum(SmtpSecurityType).optional(),
      }),

      username: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.emails.smtpClient.edit.id.fields.username.label",
        description:
          "app.api.emails.smtpClient.edit.id.fields.username.description",
        placeholder:
          "app.api.emails.smtpClient.edit.id.fields.username.placeholder",
        columns: 6,
        schema: z.string().min(1).optional(),
      }),

      password: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "app.api.emails.smtpClient.edit.id.fields.password.label",
        description:
          "app.api.emails.smtpClient.edit.id.fields.password.description",
        placeholder:
          "app.api.emails.smtpClient.edit.id.fields.password.placeholder",
        columns: 6,
        // Password is optional - leave empty to keep current password, or enter new one to change it
        schema: z.string().optional(),
      }),

      fromEmail: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "app.api.emails.smtpClient.edit.id.fields.fromEmail.label",
        description:
          "app.api.emails.smtpClient.edit.id.fields.fromEmail.description",
        placeholder:
          "app.api.emails.smtpClient.edit.id.fields.fromEmail.placeholder",
        columns: 6,
        schema: z.email().optional(),
      }),

      priority: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.emails.smtpClient.edit.id.fields.priority.label",
        description:
          "app.api.emails.smtpClient.edit.id.fields.priority.description",
        placeholder:
          "app.api.emails.smtpClient.edit.id.fields.priority.placeholder",
        columns: 6,
        schema: z.coerce.number().int().min(1).max(100).optional(),
      }),

      campaignTypes: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "app.api.emails.smtpClient.edit.id.fields.campaignTypes.label",
        description:
          "app.api.emails.smtpClient.edit.id.fields.campaignTypes.description",
        placeholder:
          "app.api.emails.smtpClient.edit.id.fields.campaignTypes.placeholder",
        columns: 6,
        options: CampaignTypeOptions,
        schema: z.array(z.enum(CampaignType)).optional(),
      }),

      emailJourneyVariants: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label:
          "app.api.emails.smtpClient.edit.id.fields.emailJourneyVariants.label",
        description:
          "app.api.emails.smtpClient.edit.id.fields.emailJourneyVariants.description",
        placeholder:
          "app.api.emails.smtpClient.edit.id.fields.emailJourneyVariants.placeholder",
        columns: 6,
        options: EmailJourneyVariantOptions,
        schema: z.array(z.enum(EmailJourneyVariant)).optional(),
      }),

      emailCampaignStages: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label:
          "app.api.emails.smtpClient.edit.id.fields.emailCampaignStages.label",
        description:
          "app.api.emails.smtpClient.edit.id.fields.emailCampaignStages.description",
        placeholder:
          "app.api.emails.smtpClient.edit.id.fields.emailCampaignStages.placeholder",
        columns: 6,
        options: EmailCampaignStageOptions,
        schema: z.array(z.enum(EmailCampaignStage)).optional(),
      }),

      countries: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "app.api.emails.smtpClient.edit.id.fields.countries.label",
        description:
          "app.api.emails.smtpClient.edit.id.fields.countries.description",
        placeholder:
          "app.api.emails.smtpClient.edit.id.fields.countries.placeholder",
        columns: 6,
        options: CountriesOptions,
        schema: z.array(z.enum(["GLOBAL", "DE", "PL", "US"])).optional(),
      }),

      languages: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "app.api.emails.smtpClient.edit.id.fields.languages.label",
        description:
          "app.api.emails.smtpClient.edit.id.fields.languages.description",
        placeholder:
          "app.api.emails.smtpClient.edit.id.fields.languages.placeholder",
        columns: 6,
        options: LanguagesOptions,
        schema: z.array(z.enum(Languages)).optional(),
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.emails.smtpClient.edit.id.errors.validation.title",
      description:
        "app.api.emails.smtpClient.edit.id.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.emails.smtpClient.edit.id.errors.unauthorized.title",
      description:
        "app.api.emails.smtpClient.edit.id.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.emails.smtpClient.edit.id.errors.forbidden.title",
      description:
        "app.api.emails.smtpClient.edit.id.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.emails.smtpClient.edit.id.errors.notFound.title",
      description:
        "app.api.emails.smtpClient.edit.id.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.emails.smtpClient.edit.id.errors.conflict.title",
      description:
        "app.api.emails.smtpClient.edit.id.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.emails.smtpClient.edit.id.errors.server.title",
      description:
        "app.api.emails.smtpClient.edit.id.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.emails.smtpClient.edit.id.errors.networkError.title",
      description:
        "app.api.emails.smtpClient.edit.id.errors.networkError.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.emails.smtpClient.edit.id.errors.unsavedChanges.title",
      description:
        "app.api.emails.smtpClient.edit.id.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.emails.smtpClient.edit.id.errors.unknown.title",
      description:
        "app.api.emails.smtpClient.edit.id.errors.unknown.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.emails.smtpClient.edit.id.success.title",
    description: "app.api.emails.smtpClient.edit.id.success.description",
  },

  // === EXAMPLES ===
  examples: {
    urlPathParams: {
      default: {
        id: "550e8400-e29b-41d4-a716-446655440001",
      },
    },
    requests: {
      default: {
        name: "Updated Campaign SMTP",
        description: "Updated SMTP account for marketing campaigns",
        priority: 15,
      },
    },
    responses: {
      default: {
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: "Updated Campaign SMTP",
        description: "Updated SMTP account for marketing campaigns",
        host: "smtp.example.com",
        port: 587,
        securityType: SmtpSecurityType.STARTTLS,
        username: "campaigns@example.com",
        fromEmail: "campaigns@example.com",
        priority: 15,
        campaignTypes: [CampaignType.LEAD_CAMPAIGN],
        emailJourneyVariants: [EmailJourneyVariant.UNCENSORED_CONVERT],
        emailCampaignStages: [EmailCampaignStage.INITIAL],
        countries: ["GLOBAL"],
        languages: ["de", "en"],
      },
    },
  },
});

// Export types following migration guide pattern
export type SmtpAccountEditGETRequestInput = typeof GET.types.RequestInput;
export type SmtpAccountEditGETRequestOutput = typeof GET.types.RequestOutput;
export type SmtpAccountEditGETResponseInput = typeof GET.types.ResponseInput;
export type SmtpAccountEditGETResponseOutput = typeof GET.types.ResponseOutput;

export type SmtpAccountEditPUTRequestInput = typeof PUT.types.RequestInput;
export type SmtpAccountEditPUTRequestOutput = typeof PUT.types.RequestOutput;
export type SmtpAccountEditPUTResponseInput = typeof PUT.types.ResponseInput;
export type SmtpAccountEditPUTResponseOutput = typeof PUT.types.ResponseOutput;

// Legacy export types for compatibility
export type SmtpAccountEditRequestInput = SmtpAccountEditPUTRequestInput;
export type SmtpAccountEditRequestOutput = SmtpAccountEditPUTRequestOutput;
export type SmtpAccountEditResponseInput = SmtpAccountEditPUTResponseInput;
export type SmtpAccountEditResponseOutput = SmtpAccountEditPUTResponseOutput;

// Export repository types for import standardization
export type SmtpAccountEditGetRequestOutput = SmtpAccountEditGETRequestOutput;
export type SmtpAccountEditGetResponseOutput = SmtpAccountEditGETResponseOutput;
export type SmtpAccountEditPutRequestOutput = SmtpAccountEditPUTRequestOutput;
export type SmtpAccountEditPutResponseOutput = SmtpAccountEditPUTResponseOutput;

const smtpAccountEditEndpoints = { GET, PUT };

export default smtpAccountEditEndpoints;
