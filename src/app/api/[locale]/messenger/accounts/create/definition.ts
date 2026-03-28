/**
 * Unified Messenger Account Create API Definition
 */

import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
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
import { UserRole } from "../../../user/user-roles/enum";
import { CampaignType, CampaignTypeOptions } from "../enum";
import {
  MessengerAccountStatus,
  MessengerAccountStatusDB,
  MessengerAccountStatusOptions,
  MessengerProvider,
  MessengerProviderDB,
  MessengerProviderOptions,
} from "../enum";
import {
  EmailImapAuthMethodDB,
  EmailImapAuthMethodOptions,
  EmailSecurityType,
  EmailSecurityTypeDB,
  EmailSecurityTypeOptions,
} from "../../providers/email/enum";
import { scopedTranslation } from "./i18n";
import { MessengerAccountCreateContainer } from "./widget";
import {
  MessageChannel,
  MessageChannelDB,
  MessageChannelOptions,
} from "../enum";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["messenger", "accounts", "create"],
  title: "title",
  description: "description",
  category: "endpointCategories.messenger",
  icon: "message-circle",
  tags: ["tags.messaging"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: MessengerAccountCreateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // ── Identity ────────────────────────────────────────────────────────────
      name: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.name.label",
        description: "fields.name.description",
        placeholder: "fields.name.placeholder",
        columns: 6,
        schema: z.string().min(1),
      }),

      description: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "fields.description.label",
        description: "fields.description.description",
        placeholder: "fields.description.placeholder",
        columns: 12,
        schema: z.string().optional(),
      }),

      channel: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.channel.label",
        description: "fields.channel.description",
        columns: 6,
        options: MessageChannelOptions,
        schema: z.enum(MessageChannelDB),
      }),

      provider: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.provider.label",
        description: "fields.provider.description",
        columns: 6,
        options: MessengerProviderOptions,
        schema: z.enum(MessengerProviderDB),
      }),

      status: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.status.label",
        description: "fields.status.description",
        columns: 6,
        options: MessengerAccountStatusOptions,
        schema: z
          .enum(MessengerAccountStatusDB)
          .default(MessengerAccountStatus.INACTIVE),
      }),

      priority: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.priority.label",
        description: "fields.priority.description",
        columns: 6,
        schema: z.coerce.number().int().min(0).max(100).default(0),
      }),

      isDefault: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.isDefault.label",
        description: "fields.isDefault.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      // ── SMTP outbound credentials ───────────────────────────────────────────
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
        placeholder: "fields.smtpPort.placeholder",
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

      smtpFromName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.smtpFromName.label",
        description: "fields.smtpFromName.description",
        placeholder: "fields.smtpFromName.placeholder",
        columns: 6,
        schema: z.string().nullish(),
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

      // ── API credentials ──────────────────────────────────────────────────────
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

      // ── IMAP inbound (EMAIL channel only) ────────────────────────────────────
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
        placeholder: "fields.imapPort.placeholder",
        columns: 3,
        schema: z.coerce.number().int().optional(),
      }),

      imapSecure: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.imapSecure.label",
        description: "fields.imapSecure.description",
        columns: 3,
        schema: z.boolean().default(true),
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
        schema: z.boolean().default(false),
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

      // ── Email routing ────────────────────────────────────────────────────────
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
        schema: z.boolean().default(false),
      }),

      weight: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.weight.label",
        description: "fields.weight.description",
        columns: 4,
        schema: z.coerce.number().int().min(1).default(1),
      }),

      isFailover: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.isFailover.label",
        description: "fields.isFailover.description",
        columns: 4,
        schema: z.boolean().default(false),
      }),

      failoverPriority: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.failoverPriority.label",
        description: "fields.failoverPriority.description",
        columns: 4,
        schema: z.coerce.number().int().default(0),
      }),

      // ── Response ─────────────────────────────────────────────────────────────
      account: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.account.title",
        description: "response.account.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
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
          smtpFromEmail: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.account.smtpFromEmail",
            schema: z.string().nullable(),
          }),
          fromId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.account.fromId",
            schema: z.string().nullable(),
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
        },
      }),
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
    requests: {
      smtp: {
        name: "Primary SMTP",
        channel: MessageChannel.EMAIL,
        provider: MessengerProvider.SMTP,
        smtpHost: "smtp.example.com",
        smtpPort: 587,
        smtpSecurityType: EmailSecurityType.STARTTLS,
        smtpUsername: "user@example.com",
        smtpPassword: "secret",
        smtpFromEmail: "noreply@example.com",
        imapHost: "imap.example.com",
        imapPort: 993,
        imapSecure: true,
        imapUsername: "user@example.com",
        imapPassword: "secret",
        imapSyncEnabled: true,
      },
      twilio: {
        name: "Twilio SMS",
        channel: MessageChannel.SMS,
        provider: MessengerProvider.TWILIO,
        apiToken: "ACxxxxxxxxxxxx",
        apiSecret: "auth_token",
        fromId: "+1234567890",
      },
      resend: {
        name: "Resend Email",
        channel: MessageChannel.EMAIL,
        provider: MessengerProvider.RESEND,
        apiKey: "re_xxxxxxxxxxxx",
        smtpFromEmail: "noreply@example.com",
      },
    },
    responses: {
      default: {
        account: {
          id: "550e8400-e29b-41d4-a716-446655440001",
          name: "Primary SMTP",
          channel: MessageChannel.EMAIL,
          provider: MessengerProvider.SMTP,
          status: MessengerAccountStatus.INACTIVE,
          smtpFromEmail: "noreply@example.com",
          fromId: null,
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
      },
    },
  },
});

export type MessengerAccountCreatePOSTRequestInput =
  typeof POST.types.RequestInput;
export type MessengerAccountCreatePOSTRequestOutput =
  typeof POST.types.RequestOutput;
export type MessengerAccountCreatePOSTResponseInput =
  typeof POST.types.ResponseInput;
export type MessengerAccountCreatePOSTResponseOutput =
  typeof POST.types.ResponseOutput;

const messengerAccountCreateEndpoints = { POST };
export default messengerAccountCreateEndpoints;
