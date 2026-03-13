/**
 * Unified Messenger Account Edit API Definition (GET + PUT)
 */

import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  requestField,
  requestResponseField,
  requestUrlPathParamsResponseField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
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
} from "../../../../leads/enum";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import {
  CampaignType,
  CampaignTypeOptions,
} from "@/app/api/[locale]/messenger/accounts/enum";
import {
  MessengerAccountStatus,
  MessengerAccountStatusDB,
  MessengerAccountStatusOptions,
  MessengerHealthStatus,
  MessengerHealthStatusDB,
  MessengerProvider,
  MessengerProviderDB,
  MessengerProviderOptions,
} from "../../enum";
import {
  EmailImapAuthMethodDB,
  EmailImapAuthMethodOptions,
  EmailSecurityType,
  EmailSecurityTypeDB,
  EmailSecurityTypeOptions,
} from "../../../providers/email/enum";
import { scopedTranslation } from "./i18n";
import { MessengerAccountEditContainer } from "./widget";
import {
  MessageChannel,
  MessageChannelDB,
  MessageChannelOptions,
} from "../../enum";

// Shared response fields shape
const accountResponseFields = {
  id: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "response.account.id",
    schema: z.uuid(),
  }),
  name: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "response.account.name",
    schema: z.string(),
  }),
  description: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "response.account.name",
    schema: z.string().nullable(),
  }),
  channel: responseField(scopedTranslation, {
    type: WidgetType.BADGE,
    text: "response.account.channel",
    schema: z.enum(MessageChannelDB),
  }),
  provider: responseField(scopedTranslation, {
    type: WidgetType.BADGE,
    text: "response.account.provider",
    schema: z.enum(MessengerProviderDB),
  }),
  status: responseField(scopedTranslation, {
    type: WidgetType.BADGE,
    text: "response.account.status",
    schema: z.enum(MessengerAccountStatusDB),
  }),
  healthStatus: responseField(scopedTranslation, {
    type: WidgetType.BADGE,
    text: "response.account.healthStatus",
    schema: z.enum(MessengerHealthStatusDB).nullable(),
  }),
  isDefault: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "response.account.isDefault",
    schema: z.boolean(),
  }),
  priority: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "response.account.priority",
    schema: z.coerce.number().int(),
  }),
  smtpHost: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "response.account.smtpHost",
    schema: z.string().nullable(),
  }),
  smtpPort: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "response.account.smtpPort",
    schema: z.coerce.number().int().nullable(),
  }),
  smtpSecurityType: responseField(scopedTranslation, {
    type: WidgetType.BADGE,
    text: "response.account.smtpSecurityType",
    schema: z.enum(EmailSecurityTypeDB).nullable(),
  }),
  smtpUsername: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "response.account.smtpUsername",
    schema: z.string().nullable(),
  }),
  smtpFromEmail: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "response.account.smtpFromEmail",
    schema: z.string().nullable(),
  }),
  smtpConnectionTimeout: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "response.account.smtpFromEmail",
    schema: z.coerce.number().int().nullable(),
  }),
  smtpMaxConnections: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "response.account.smtpFromEmail",
    schema: z.coerce.number().int().nullable(),
  }),
  smtpRateLimitPerHour: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "response.account.smtpFromEmail",
    schema: z.coerce.number().int().nullable(),
  }),
  fromId: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "response.account.fromId",
    schema: z.string().nullable(),
  }),
  webhookUrl: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "response.account.fromId",
    schema: z.string().nullable(),
  }),
  imapHost: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "response.account.imapHost",
    schema: z.string().nullable(),
  }),
  imapPort: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "response.account.imapPort",
    schema: z.coerce.number().int().nullable(),
  }),
  imapSecure: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "response.account.imapPort",
    schema: z.boolean().nullable(),
  }),
  imapUsername: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "response.account.imapHost",
    schema: z.string().nullable(),
  }),
  imapAuthMethod: responseField(scopedTranslation, {
    type: WidgetType.BADGE,
    text: "response.account.imapHost",
    schema: z.enum(EmailImapAuthMethodDB).nullable(),
  }),
  imapSyncEnabled: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "response.account.imapSyncEnabled",
    schema: z.boolean(),
  }),
  imapSyncInterval: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "response.account.imapSyncEnabled",
    schema: z.coerce.number().int().nullable(),
  }),
  imapMaxMessages: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "response.account.imapSyncEnabled",
    schema: z.coerce.number().int().nullable(),
  }),
  imapLastSyncAt: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "response.account.imapLastSyncAt",
    schema: dateSchema.nullable(),
  }),
  messagesSentTotal: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "response.account.messagesSentTotal",
    schema: z.coerce.number().int(),
  }),
  lastUsedAt: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "response.account.lastUsedAt",
    schema: dateSchema.nullable(),
  }),
  createdAt: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "response.account.createdAt",
    schema: dateSchema,
  }),
  updatedAt: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "response.account.updatedAt",
    schema: dateSchema,
  }),
};

/**
 * GET — retrieve account by ID
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["messenger", "accounts", "edit", "[id]"],
  title: "get.title",
  description: "get.description",
  category: "app.endpointCategories.messenger",
  icon: "message-circle",
  tags: ["tags.messaging"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      id: requestUrlPathParamsResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.id.label",
        description: "fields.id.description",
        columns: 12,
        schema: z.uuid(),
      }),
      name: accountResponseFields.name,
      description: accountResponseFields.description,
      channel: accountResponseFields.channel,
      provider: accountResponseFields.provider,
      status: accountResponseFields.status,
      healthStatus: accountResponseFields.healthStatus,
      isDefault: accountResponseFields.isDefault,
      priority: accountResponseFields.priority,
      smtpHost: accountResponseFields.smtpHost,
      smtpPort: accountResponseFields.smtpPort,
      smtpSecurityType: accountResponseFields.smtpSecurityType,
      smtpUsername: accountResponseFields.smtpUsername,
      smtpFromEmail: accountResponseFields.smtpFromEmail,
      smtpConnectionTimeout: accountResponseFields.smtpConnectionTimeout,
      smtpMaxConnections: accountResponseFields.smtpMaxConnections,
      smtpRateLimitPerHour: accountResponseFields.smtpRateLimitPerHour,
      fromId: accountResponseFields.fromId,
      webhookUrl: accountResponseFields.webhookUrl,
      imapHost: accountResponseFields.imapHost,
      imapPort: accountResponseFields.imapPort,
      imapSecure: accountResponseFields.imapSecure,
      imapUsername: accountResponseFields.imapUsername,
      imapAuthMethod: accountResponseFields.imapAuthMethod,
      imapSyncEnabled: accountResponseFields.imapSyncEnabled,
      imapSyncInterval: accountResponseFields.imapSyncInterval,
      imapMaxMessages: accountResponseFields.imapMaxMessages,
      imapLastSyncAt: accountResponseFields.imapLastSyncAt,
      messagesSentTotal: accountResponseFields.messagesSentTotal,
      lastUsedAt: accountResponseFields.lastUsedAt,
      createdAt: accountResponseFields.createdAt,
      updatedAt: accountResponseFields.updatedAt,
    }, // end children
  }), // end customWidgetObject

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
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
  examples: {
    urlPathParams: { default: { id: "550e8400-e29b-41d4-a716-446655440001" } },
    responses: {
      default: {
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: "Primary SMTP",
        description: "Main outbound email account",
        channel: MessageChannel.EMAIL,
        provider: MessengerProvider.SMTP,
        status: MessengerAccountStatus.ACTIVE,
        healthStatus: MessengerHealthStatus.HEALTHY,
        isDefault: true,
        priority: 10,
        smtpHost: "smtp.example.com",
        smtpPort: 587,
        smtpSecurityType: EmailSecurityType.STARTTLS,
        smtpUsername: "user@example.com",
        smtpFromEmail: "noreply@example.com",
        smtpConnectionTimeout: 30000,
        smtpMaxConnections: 5,
        smtpRateLimitPerHour: 600,
        fromId: null,
        webhookUrl: null,
        imapHost: "imap.example.com",
        imapPort: 993,
        imapSecure: true,
        imapUsername: "user@example.com",
        imapAuthMethod: null,
        imapSyncEnabled: true,
        imapSyncInterval: 60,
        imapMaxMessages: 1000,
        imapLastSyncAt: null,
        messagesSentTotal: 15000,
        lastUsedAt: "2024-01-07T11:45:00.000Z",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-07T10:00:00.000Z",
      },
    },
  },
});

/**
 * PUT — update account
 */
const { PUT } = createEndpoint({
  scopedTranslation,
  method: Methods.PUT,
  path: ["messenger", "accounts", "edit", "[id]"],
  title: "put.title",
  description: "put.description",
  category: "app.endpointCategories.messenger",
  icon: "message-circle",
  tags: ["tags.messaging"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: MessengerAccountEditContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),

      id: requestUrlPathParamsResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.id.label",
        description: "fields.id.description",
        columns: 12,
        schema: z.uuid(),
      }),

      name: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.name.label",
        description: "fields.name.description",
        placeholder: "fields.name.placeholder",
        columns: 6,
        schema: z.string().min(1).optional(),
      }),

      description: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "fields.description.label",
        description: "fields.description.description",
        placeholder: "fields.description.placeholder",
        columns: 12,
        schema: z.string().nullable().optional(),
      }),

      channel: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.channel.label",
        description: "fields.channel.description",
        columns: 6,
        options: MessageChannelOptions,
        schema: z.enum(MessageChannelDB).nullish(),
      }),

      provider: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.provider.label",
        description: "fields.provider.description",
        columns: 6,
        options: MessengerProviderOptions,
        schema: z.enum(MessengerProviderDB).nullish(),
      }),

      status: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.status.label",
        description: "fields.status.description",
        columns: 6,
        options: MessengerAccountStatusOptions,
        schema: z.enum(MessengerAccountStatusDB).nullish(),
      }),

      priority: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.priority.label",
        description: "fields.priority.description",
        columns: 6,
        schema: z.coerce.number().int().min(0).max(100).optional(),
      }),

      isDefault: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.isDefault.label",
        description: "fields.isDefault.description",
        columns: 6,
        schema: z.boolean().optional(),
      }),

      // SMTP
      smtpHost: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.smtpHost.label",
        description: "fields.smtpHost.description",
        placeholder: "fields.smtpHost.placeholder",
        columns: 6,
        schema: z.string().nullish(),
      }),
      smtpPort: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.smtpPort.label",
        description: "fields.smtpPort.description",
        columns: 3,
        schema: z.coerce.number().int().min(0).max(65535).optional(),
      }),
      smtpSecurityType: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.smtpSecurityType.label",
        description: "fields.smtpSecurityType.description",
        columns: 3,
        options: EmailSecurityTypeOptions,
        schema: z.enum(EmailSecurityTypeDB).nullish(),
      }),
      smtpUsername: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.smtpUsername.label",
        description: "fields.smtpUsername.description",
        placeholder: "fields.smtpUsername.placeholder",
        columns: 6,
        schema: z.string().nullish(),
      }),
      smtpPassword: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "fields.smtpPassword.label",
        description: "fields.smtpPassword.description",
        placeholder: "fields.smtpPassword.placeholder",
        columns: 6,
        schema: z.string().nullish(),
      }),
      smtpFromEmail: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "fields.smtpFromEmail.label",
        description: "fields.smtpFromEmail.description",
        placeholder: "fields.smtpFromEmail.placeholder",
        columns: 6,
        schema: z.email().nullish(),
      }),
      smtpConnectionTimeout: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.smtpConnectionTimeout.label",
        description: "fields.smtpConnectionTimeout.description",
        columns: 4,
        schema: z.coerce.number().int().optional(),
      }),
      smtpMaxConnections: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.smtpMaxConnections.label",
        description: "fields.smtpMaxConnections.description",
        columns: 4,
        schema: z.coerce.number().int().optional(),
      }),
      smtpRateLimitPerHour: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.smtpRateLimitPerHour.label",
        description: "fields.smtpRateLimitPerHour.description",
        columns: 4,
        schema: z.coerce.number().int().optional(),
      }),

      // API credentials
      apiKey: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "fields.apiKey.label",
        description: "fields.apiKey.description",
        placeholder: "fields.apiKey.placeholder",
        columns: 12,
        schema: z.string().nullish(),
      }),
      apiToken: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "fields.apiToken.label",
        description: "fields.apiToken.description",
        placeholder: "fields.apiToken.placeholder",
        columns: 6,
        schema: z.string().nullish(),
      }),
      apiSecret: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "fields.apiSecret.label",
        description: "fields.apiSecret.description",
        placeholder: "fields.apiSecret.placeholder",
        columns: 6,
        schema: z.string().nullish(),
      }),
      fromId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.fromId.label",
        description: "fields.fromId.description",
        placeholder: "fields.fromId.placeholder",
        columns: 6,
        schema: z.string().nullish(),
      }),
      webhookUrl: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.webhookUrl.label",
        description: "fields.webhookUrl.description",
        placeholder: "fields.webhookUrl.placeholder",
        columns: 6,
        schema: z.url().nullish(),
      }),

      // IMAP
      imapHost: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.imapHost.label",
        description: "fields.imapHost.description",
        placeholder: "fields.imapHost.placeholder",
        columns: 6,
        schema: z.string().nullish(),
      }),
      imapPort: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.imapPort.label",
        description: "fields.imapPort.description",
        columns: 3,
        schema: z.coerce.number().int().optional(),
      }),
      imapSecure: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.imapSecure.label",
        description: "fields.imapSecure.description",
        columns: 3,
        schema: z.boolean().optional(),
      }),
      imapUsername: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.imapUsername.label",
        description: "fields.imapUsername.description",
        placeholder: "fields.imapUsername.placeholder",
        columns: 6,
        schema: z.string().nullish(),
      }),
      imapPassword: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "fields.imapPassword.label",
        description: "fields.imapPassword.description",
        placeholder: "fields.imapPassword.placeholder",
        columns: 6,
        schema: z.string().nullish(),
      }),
      imapAuthMethod: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.imapAuthMethod.label",
        description: "fields.imapAuthMethod.description",
        columns: 4,
        options: EmailImapAuthMethodOptions,
        schema: z.enum(EmailImapAuthMethodDB).nullish(),
      }),
      imapSyncEnabled: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.imapSyncEnabled.label",
        description: "fields.imapSyncEnabled.description",
        columns: 4,
        schema: z.boolean().optional(),
      }),
      imapSyncInterval: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.imapSyncInterval.label",
        description: "fields.imapSyncInterval.description",
        columns: 4,
        schema: z.coerce.number().int().optional(),
      }),
      imapMaxMessages: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.imapMaxMessages.label",
        description: "fields.imapMaxMessages.description",
        columns: 4,
        schema: z.coerce.number().int().optional(),
      }),

      // Email routing
      campaignTypes: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "fields.campaignTypes.label",
        description: "fields.campaignTypes.description",
        placeholder: "fields.campaignTypes.placeholder",
        columns: 6,
        options: CampaignTypeOptions,
        schema: z.array(z.enum(CampaignType)).optional(),
      }),
      emailJourneyVariants: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "fields.emailJourneyVariants.label",
        description: "fields.emailJourneyVariants.description",
        placeholder: "fields.emailJourneyVariants.placeholder",
        columns: 6,
        options: EmailJourneyVariantOptions,
        schema: z.array(z.enum(EmailJourneyVariant)).optional(),
      }),
      emailCampaignStages: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "fields.emailCampaignStages.label",
        description: "fields.emailCampaignStages.description",
        placeholder: "fields.emailCampaignStages.placeholder",
        columns: 6,
        options: EmailCampaignStageOptions,
        schema: z.array(z.enum(EmailCampaignStage)).optional(),
      }),
      countries: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "fields.countries.label",
        description: "fields.countries.description",
        placeholder: "fields.countries.placeholder",
        columns: 6,
        options: CountriesOptions,
        schema: z.array(z.enum(["GLOBAL", "DE", "PL", "US"])).optional(),
      }),
      languages: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "fields.languages.label",
        description: "fields.languages.description",
        placeholder: "fields.languages.placeholder",
        columns: 6,
        options: LanguagesOptions,
        schema: z.array(z.enum(Languages)).optional(),
      }),
      isExactMatch: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.isExactMatch.label",
        description: "fields.isExactMatch.description",
        columns: 4,
        schema: z.boolean().optional(),
      }),
      weight: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.weight.label",
        description: "fields.weight.description",
        columns: 4,
        schema: z.coerce.number().int().min(0).optional(),
      }),
      isFailover: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.isFailover.label",
        description: "fields.isFailover.description",
        columns: 4,
        schema: z.boolean().optional(),
      }),
      failoverPriority: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.failoverPriority.label",
        description: "fields.failoverPriority.description",
        columns: 4,
        schema: z.coerce.number().int().optional(),
      }),

      // Response-only fields
      healthStatus: accountResponseFields.healthStatus,
      imapLastSyncAt: accountResponseFields.imapLastSyncAt,
      messagesSentTotal: accountResponseFields.messagesSentTotal,
      lastUsedAt: accountResponseFields.lastUsedAt,
      createdAt: accountResponseFields.createdAt,
      updatedAt: accountResponseFields.updatedAt,
    }, // end children
  }), // end customWidgetObject

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
  successTypes: {
    title: "put.success.title",
    description: "put.success.description",
  },
  examples: {
    urlPathParams: { default: { id: "550e8400-e29b-41d4-a716-446655440001" } },
    requests: { default: { name: "Updated SMTP Account", priority: 15 } },
    responses: {
      default: {
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: "Updated SMTP Account",
        description: null,
        channel: MessageChannel.EMAIL,
        provider: MessengerProvider.SMTP,
        status: MessengerAccountStatus.ACTIVE,
        healthStatus: MessengerHealthStatus.HEALTHY,
        isDefault: true,
        priority: 15,
        imapLastSyncAt: null,
        messagesSentTotal: 15000,
        lastUsedAt: "2024-01-07T11:45:00.000Z",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-07T12:00:00.000Z",
      },
    },
  },
});

export type MessengerAccountEditGETRequestInput = typeof GET.types.RequestInput;
export type MessengerAccountEditGETRequestOutput =
  typeof GET.types.RequestOutput;
export type MessengerAccountEditGETResponseInput =
  typeof GET.types.ResponseInput;
export type MessengerAccountEditGETResponseOutput =
  typeof GET.types.ResponseOutput;

export type MessengerAccountEditPUTRequestInput = typeof PUT.types.RequestInput;
export type MessengerAccountEditPUTRequestOutput =
  typeof PUT.types.RequestOutput;
export type MessengerAccountEditPUTResponseInput =
  typeof PUT.types.ResponseInput;
export type MessengerAccountEditPUTResponseOutput =
  typeof PUT.types.ResponseOutput;

const messengerAccountEditEndpoints = { GET, PUT };
export default messengerAccountEditEndpoints;
