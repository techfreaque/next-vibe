/**
 * SMTP Account Edit API Definition
 * Edit existing SMTP accounts
 */

import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  scopedBackButton,
  scopedObjectFieldNew,
  scopedRequestField,
  scopedRequestResponseField,
  scopedRequestUrlPathParamsResponseField,
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
import { scopedTranslation } from "./i18n";
import { SmtpEditContainer } from "./widget";

/**
 * GET endpoint for retrieving SMTP account by ID
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["emails", "smtp-client", "edit", "[id]"],
  title: "get.title",
  description: "get.description",
  category: "app.endpointCategories.email",
  icon: "server",
  tags: ["tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "get.container.title",
    description: "get.container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "urlPathParams", response: true },
    children: {
      // === URL PARAMETER ===
      id: scopedRequestUrlPathParamsResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.id.label",
        description: "fields.id.description",
        columns: 12,
        schema: z.uuid(),
      }),

      name: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.account.name",
        schema: z.string(),
      }),
      description: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.account.fields.description",
        schema: z.string().optional(),
      }),
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
      status: scopedResponseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "response.account.status",
        schema: z.enum(SmtpAccountStatus),
      }),
      healthCheckStatus: scopedResponseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "response.account.healthCheckStatus",
        schema: z.enum(SmtpHealthStatus).nullable(),
      }),
      priority: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.account.priority",
        schema: z.coerce.number().int().optional(),
      }),
      totalEmailsSent: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.account.totalEmailsSent",
        schema: z.coerce.number().int(),
      }),
      lastUsedAt: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.account.lastUsedAt",
        schema: dateSchema.nullable(),
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
        schema: z.array(z.enum(Countries)).optional(),
      }),
      languages: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.account.languages",
        schema: z.array(z.enum(Languages)).optional(),
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
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.networkError.title",
      description: "errors.networkError.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "success.title",
    description: "success.description",
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
  scopedTranslation,
  method: Methods.PUT,
  path: ["emails", "smtp-client", "edit", "[id]"],
  title: "put.title",
  description: "put.description",
  category: "app.endpointCategories.email",
  icon: "server",
  tags: ["tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: SmtpEditContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      backButton: scopedBackButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),

      // === URL PARAMETER ===
      id: scopedRequestUrlPathParamsResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.id.label",
        description: "fields.id.description",
        columns: 12,
        schema: z.uuid(),
      }),

      name: scopedRequestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.name.label",
        description: "fields.name.description",
        placeholder: "fields.name.placeholder",
        columns: 6,
        schema: z.string().min(1).optional(),
      }),

      description: scopedRequestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "fields.description.label",
        description: "fields.description.description",
        placeholder: "fields.description.placeholder",
        columns: 12,
        schema: z.string().optional(),
      }),

      host: scopedRequestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.host.label",
        description: "fields.host.description",
        placeholder: "fields.host.placeholder",
        columns: 6,
        schema: z.string().min(1).optional(),
      }),

      port: scopedRequestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.port.label",
        description: "fields.port.description",
        placeholder: "fields.port.placeholder",
        columns: 6,
        schema: z.coerce.number().min(1).max(65535).optional(),
      }),

      securityType: scopedRequestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.securityType.label",
        description: "fields.securityType.description",
        placeholder: "fields.securityType.placeholder",
        columns: 6,
        options: SmtpSecurityTypeOptions,
        schema: z.enum(SmtpSecurityType).optional(),
      }),

      username: scopedRequestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.username.label",
        description: "fields.username.description",
        placeholder: "fields.username.placeholder",
        columns: 6,
        schema: z.string().min(1).optional(),
      }),

      password: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "fields.password.label",
        description: "fields.password.description",
        placeholder: "fields.password.placeholder",
        columns: 6,
        // Password is optional - leave empty to keep current password, or enter new one to change it
        schema: z.string().optional(),
      }),

      fromEmail: scopedRequestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "fields.fromEmail.label",
        description: "fields.fromEmail.description",
        placeholder: "fields.fromEmail.placeholder",
        columns: 6,
        schema: z.email().optional(),
      }),

      priority: scopedRequestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.priority.label",
        description: "fields.priority.description",
        placeholder: "fields.priority.placeholder",
        columns: 6,
        schema: z.coerce.number().int().min(1).max(100).optional(),
      }),

      campaignTypes: scopedRequestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "fields.campaignTypes.label",
        description: "fields.campaignTypes.description",
        placeholder: "fields.campaignTypes.placeholder",
        columns: 6,
        options: CampaignTypeOptions,
        schema: z.array(z.enum(CampaignType)).optional(),
      }),

      emailJourneyVariants: scopedRequestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "fields.emailJourneyVariants.label",
        description: "fields.emailJourneyVariants.description",
        placeholder: "fields.emailJourneyVariants.placeholder",
        columns: 6,
        options: EmailJourneyVariantOptions,
        schema: z.array(z.enum(EmailJourneyVariant)).optional(),
      }),

      emailCampaignStages: scopedRequestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "fields.emailCampaignStages.label",
        description: "fields.emailCampaignStages.description",
        placeholder: "fields.emailCampaignStages.placeholder",
        columns: 6,
        options: EmailCampaignStageOptions,
        schema: z.array(z.enum(EmailCampaignStage)).optional(),
      }),

      countries: scopedRequestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "fields.countries.label",
        description: "fields.countries.description",
        placeholder: "fields.countries.placeholder",
        columns: 6,
        options: CountriesOptions,
        schema: z.array(z.enum(["GLOBAL", "DE", "PL", "US"])).optional(),
      }),

      languages: scopedRequestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "fields.languages.label",
        description: "fields.languages.description",
        placeholder: "fields.languages.placeholder",
        columns: 6,
        options: LanguagesOptions,
        schema: z.array(z.enum(Languages)).optional(),
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
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.networkError.title",
      description: "errors.networkError.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "success.title",
    description: "success.description",
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
