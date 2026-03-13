/**
 * Unified Messenger Accounts Enums
 * Covers all channels: EMAIL (SMTP/API), SMS, WhatsApp, Telegram
 */
import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * Message Channel — canonical definition lives here
 */
export const {
  enum: MessageChannel,
  options: MessageChannelOptions,
  Value: MessageChannelValue,
} = createEnumOptions(scopedTranslation, {
  EMAIL: "enums.channel.email",
  SMS: "enums.channel.sms",
  WHATSAPP: "enums.channel.whatsapp",
  TELEGRAM: "enums.channel.telegram",
});

export const MessageChannelDB = [
  MessageChannel.EMAIL,
  MessageChannel.SMS,
  MessageChannel.WHATSAPP,
  MessageChannel.TELEGRAM,
] as const;

/**
 * Message Channel Filter (includes ANY)
 */
export const {
  enum: MessengerChannelFilter,
  options: MessengerChannelFilterOptions,
  Value: MessengerChannelFilterValue,
} = createEnumOptions(scopedTranslation, {
  ANY: "enums.channelFilter.any",
  EMAIL: "enums.channel.email",
  SMS: "enums.channel.sms",
  WHATSAPP: "enums.channel.whatsapp",
  TELEGRAM: "enums.channel.telegram",
});

export const MessengerChannelFilterDB = [
  MessengerChannelFilter.ANY,
  MessengerChannelFilter.EMAIL,
  MessengerChannelFilter.SMS,
  MessengerChannelFilter.WHATSAPP,
  MessengerChannelFilter.TELEGRAM,
] as const;

/**
 * Messenger Provider Enum
 * All providers across all channels
 */
export const {
  enum: MessengerProvider,
  options: MessengerProviderOptions,
  Value: MessengerProviderValue,
} = createEnumOptions(scopedTranslation, {
  // EMAIL providers
  SMTP: "enums.provider.smtp",
  RESEND: "enums.provider.resend",
  SES: "enums.provider.ses",
  MAILGUN: "enums.provider.mailgun",
  SENDGRID: "enums.provider.sendgrid",
  MAILJET: "enums.provider.mailjet",
  POSTMARK: "enums.provider.postmark",
  // SMS providers
  TWILIO: "enums.provider.twilio",
  AWS_SNS: "enums.provider.awsSns",
  MESSAGEBIRD: "enums.provider.messagebird",
  HTTP: "enums.provider.http",
  // WhatsApp providers
  WHATSAPP_BUSINESS: "enums.provider.whatsappBusiness",
  // Telegram providers
  TELEGRAM_BOT: "enums.provider.telegramBot",
});

export const MessengerProviderDB = [
  MessengerProvider.SMTP,
  MessengerProvider.RESEND,
  MessengerProvider.SES,
  MessengerProvider.MAILGUN,
  MessengerProvider.SENDGRID,
  MessengerProvider.MAILJET,
  MessengerProvider.POSTMARK,
  MessengerProvider.TWILIO,
  MessengerProvider.AWS_SNS,
  MessengerProvider.MESSAGEBIRD,
  MessengerProvider.HTTP,
  MessengerProvider.WHATSAPP_BUSINESS,
  MessengerProvider.TELEGRAM_BOT,
] as const;

/**
 * Messenger Provider Filter (includes ANY)
 */
export const {
  enum: MessengerProviderFilter,
  options: MessengerProviderFilterOptions,
  Value: MessengerProviderFilterValue,
} = createEnumOptions(scopedTranslation, {
  ANY: "enums.providerFilter.any",
  SMTP: "enums.provider.smtp",
  RESEND: "enums.provider.resend",
  SES: "enums.provider.ses",
  MAILGUN: "enums.provider.mailgun",
  SENDGRID: "enums.provider.sendgrid",
  MAILJET: "enums.provider.mailjet",
  POSTMARK: "enums.provider.postmark",
  TWILIO: "enums.provider.twilio",
  AWS_SNS: "enums.provider.awsSns",
  MESSAGEBIRD: "enums.provider.messagebird",
  HTTP: "enums.provider.http",
  WHATSAPP_BUSINESS: "enums.provider.whatsappBusiness",
  TELEGRAM_BOT: "enums.provider.telegramBot",
});

export const MessengerProviderFilterDB = [
  MessengerProviderFilter.ANY,
  MessengerProviderFilter.SMTP,
  MessengerProviderFilter.RESEND,
  MessengerProviderFilter.SES,
  MessengerProviderFilter.MAILGUN,
  MessengerProviderFilter.SENDGRID,
  MessengerProviderFilter.MAILJET,
  MessengerProviderFilter.POSTMARK,
  MessengerProviderFilter.TWILIO,
  MessengerProviderFilter.AWS_SNS,
  MessengerProviderFilter.MESSAGEBIRD,
  MessengerProviderFilter.HTTP,
  MessengerProviderFilter.WHATSAPP_BUSINESS,
  MessengerProviderFilter.TELEGRAM_BOT,
] as const;

/**
 * Messenger Account Status
 */
export const {
  enum: MessengerAccountStatus,
  options: MessengerAccountStatusOptions,
  Value: MessengerAccountStatusValue,
} = createEnumOptions(scopedTranslation, {
  ACTIVE: "enums.status.active",
  INACTIVE: "enums.status.inactive",
  ERROR: "enums.status.error",
  TESTING: "enums.status.testing",
});

export const MessengerAccountStatusDB = [
  MessengerAccountStatus.ACTIVE,
  MessengerAccountStatus.INACTIVE,
  MessengerAccountStatus.ERROR,
  MessengerAccountStatus.TESTING,
] as const;

/**
 * Messenger Account Status Filter (includes ANY)
 */
export const {
  enum: MessengerAccountStatusFilter,
  options: MessengerAccountStatusFilterOptions,
  Value: MessengerAccountStatusFilterValue,
} = createEnumOptions(scopedTranslation, {
  ANY: "enums.statusFilter.any",
  ACTIVE: "enums.status.active",
  INACTIVE: "enums.status.inactive",
  ERROR: "enums.status.error",
  TESTING: "enums.status.testing",
});

export const MessengerAccountStatusFilterDB = [
  MessengerAccountStatusFilter.ANY,
  MessengerAccountStatusFilter.ACTIVE,
  MessengerAccountStatusFilter.INACTIVE,
  MessengerAccountStatusFilter.ERROR,
  MessengerAccountStatusFilter.TESTING,
] as const;

/**
 * Messenger Health Status
 */
export const {
  enum: MessengerHealthStatus,
  options: MessengerHealthStatusOptions,
  Value: MessengerHealthStatusValue,
} = createEnumOptions(scopedTranslation, {
  HEALTHY: "enums.healthStatus.healthy",
  DEGRADED: "enums.healthStatus.degraded",
  UNHEALTHY: "enums.healthStatus.unhealthy",
  UNKNOWN: "enums.healthStatus.unknown",
});

export const MessengerHealthStatusDB = [
  MessengerHealthStatus.HEALTHY,
  MessengerHealthStatus.DEGRADED,
  MessengerHealthStatus.UNHEALTHY,
  MessengerHealthStatus.UNKNOWN,
] as const;

/**
 * Messenger Health Status Filter (includes ANY)
 */
export const {
  enum: MessengerHealthStatusFilter,
  options: MessengerHealthStatusFilterOptions,
  Value: MessengerHealthStatusFilterValue,
} = createEnumOptions(scopedTranslation, {
  ANY: "enums.healthStatusFilter.any",
  HEALTHY: "enums.healthStatus.healthy",
  DEGRADED: "enums.healthStatus.degraded",
  UNHEALTHY: "enums.healthStatus.unhealthy",
  UNKNOWN: "enums.healthStatus.unknown",
});

export const MessengerHealthStatusFilterDB = [
  MessengerHealthStatusFilter.ANY,
  MessengerHealthStatusFilter.HEALTHY,
  MessengerHealthStatusFilter.DEGRADED,
  MessengerHealthStatusFilter.UNHEALTHY,
  MessengerHealthStatusFilter.UNKNOWN,
] as const;

/**
 * Messenger Account Sort Field
 */
export const {
  enum: MessengerAccountSortField,
  options: MessengerAccountSortFieldOptions,
  Value: MessengerAccountSortFieldValue,
} = createEnumOptions(scopedTranslation, {
  NAME: "enums.sortField.name",
  CHANNEL: "enums.sortField.channel",
  PROVIDER: "enums.sortField.provider",
  STATUS: "enums.sortField.status",
  PRIORITY: "enums.sortField.priority",
  MESSAGES_SENT_TOTAL: "enums.sortField.messagesSentTotal",
  LAST_USED_AT: "enums.sortField.lastUsedAt",
  CREATED_AT: "enums.sortField.createdAt",
});

export const MessengerAccountSortFieldDB = [
  MessengerAccountSortField.NAME,
  MessengerAccountSortField.CHANNEL,
  MessengerAccountSortField.PROVIDER,
  MessengerAccountSortField.STATUS,
  MessengerAccountSortField.PRIORITY,
  MessengerAccountSortField.MESSAGES_SENT_TOTAL,
  MessengerAccountSortField.LAST_USED_AT,
  MessengerAccountSortField.CREATED_AT,
] as const;

/**
 * Sort Order
 */
export const {
  enum: MessengerSortOrder,
  options: MessengerSortOrderOptions,
  Value: MessengerSortOrderValue,
} = createEnumOptions(scopedTranslation, {
  ASC: "enums.sortOrder.asc",
  DESC: "enums.sortOrder.desc",
});

export const MessengerSortOrderDB = [
  MessengerSortOrder.ASC,
  MessengerSortOrder.DESC,
] as const;

/**
 * Provider → channel mapping (for UI filtering/validation)
 */
export const EMAIL_PROVIDERS = [
  MessengerProvider.SMTP,
  MessengerProvider.RESEND,
  MessengerProvider.SES,
  MessengerProvider.MAILGUN,
  MessengerProvider.SENDGRID,
  MessengerProvider.MAILJET,
  MessengerProvider.POSTMARK,
] as const;

export const SMS_PROVIDERS = [
  MessengerProvider.TWILIO,
  MessengerProvider.AWS_SNS,
  MessengerProvider.MESSAGEBIRD,
  MessengerProvider.HTTP,
] as const;

export const WHATSAPP_PROVIDERS = [
  MessengerProvider.WHATSAPP_BUSINESS,
] as const;

export const TELEGRAM_PROVIDERS = [MessengerProvider.TELEGRAM_BOT] as const;

/**
 * Maps each channel to its valid providers (for UI filtering)
 */
export const CHANNEL_TO_PROVIDERS: Record<string, readonly string[]> = {
  [MessageChannel.EMAIL]: EMAIL_PROVIDERS,
  [MessageChannel.SMS]: SMS_PROVIDERS,
  [MessageChannel.WHATSAPP]: WHATSAPP_PROVIDERS,
  [MessageChannel.TELEGRAM]: TELEGRAM_PROVIDERS,
};

/**
 * Campaign Type
 * Defines the type of campaign — applies to any channel
 */
export const {
  enum: CampaignType,
  options: CampaignTypeOptions,
  Value: CampaignTypeValue,
} = createEnumOptions(scopedTranslation, {
  LEAD_CAMPAIGN: "enums.campaignType.leadCampaign",
  NEWSLETTER: "enums.campaignType.newsletter",
  SIGNUP_NURTURE: "enums.campaignType.signupNurture",
  RETENTION: "enums.campaignType.retention",
  WINBACK: "enums.campaignType.winback",
  TRANSACTIONAL: "enums.campaignType.transactional",
  NOTIFICATION: "enums.campaignType.notification",
  SYSTEM: "enums.campaignType.system",
});

export const CampaignTypeDB = [
  CampaignType.LEAD_CAMPAIGN,
  CampaignType.NEWSLETTER,
  CampaignType.SIGNUP_NURTURE,
  CampaignType.RETENTION,
  CampaignType.WINBACK,
  CampaignType.TRANSACTIONAL,
  CampaignType.NOTIFICATION,
  CampaignType.SYSTEM,
] as const;

/**
 * Campaign Type Filter (includes ANY)
 */
export const {
  enum: CampaignTypeFilter,
  options: CampaignTypeFilterOptions,
  Value: CampaignTypeFilterValue,
} = createEnumOptions(scopedTranslation, {
  ANY: "enums.campaignTypeFilter.all",
  LEAD_CAMPAIGN: "enums.campaignType.leadCampaign",
  NEWSLETTER: "enums.campaignType.newsletter",
  SIGNUP_NURTURE: "enums.campaignType.signupNurture",
  RETENTION: "enums.campaignType.retention",
  WINBACK: "enums.campaignType.winback",
  TRANSACTIONAL: "enums.campaignType.transactional",
  NOTIFICATION: "enums.campaignType.notification",
  SYSTEM: "enums.campaignType.system",
});

export const CampaignTypeFilterDB = [
  CampaignTypeFilter.ANY,
  CampaignTypeFilter.LEAD_CAMPAIGN,
  CampaignTypeFilter.NEWSLETTER,
  CampaignTypeFilter.SIGNUP_NURTURE,
  CampaignTypeFilter.RETENTION,
  CampaignTypeFilter.WINBACK,
  CampaignTypeFilter.TRANSACTIONAL,
  CampaignTypeFilter.NOTIFICATION,
  CampaignTypeFilter.SYSTEM,
] as const;

export function mapCampaignTypeFilter(
  filter:
    | (typeof CampaignTypeFilter)[keyof typeof CampaignTypeFilter]
    | undefined,
): (typeof CampaignType)[keyof typeof CampaignType] | null {
  switch (filter) {
    case CampaignTypeFilter.LEAD_CAMPAIGN:
      return CampaignType.LEAD_CAMPAIGN;
    case CampaignTypeFilter.NEWSLETTER:
      return CampaignType.NEWSLETTER;
    case CampaignTypeFilter.SIGNUP_NURTURE:
      return CampaignType.SIGNUP_NURTURE;
    case CampaignTypeFilter.RETENTION:
      return CampaignType.RETENTION;
    case CampaignTypeFilter.WINBACK:
      return CampaignType.WINBACK;
    case CampaignTypeFilter.TRANSACTIONAL:
      return CampaignType.TRANSACTIONAL;
    case CampaignTypeFilter.NOTIFICATION:
      return CampaignType.NOTIFICATION;
    case CampaignTypeFilter.SYSTEM:
      return CampaignType.SYSTEM;
    case CampaignTypeFilter.ANY:
    case undefined:
      return null;
    default:
      return null;
  }
}

/**
 * Load Balancing Strategy
 */
export const {
  enum: LoadBalancingStrategy,
  options: LoadBalancingStrategyOptions,
  Value: LoadBalancingStrategyValue,
} = createEnumOptions(scopedTranslation, {
  ROUND_ROBIN: "enums.loadBalancingStrategy.roundRobin",
  WEIGHTED: "enums.loadBalancingStrategy.weighted",
  PRIORITY: "enums.loadBalancingStrategy.priority",
  LEAST_USED: "enums.loadBalancingStrategy.leastUsed",
});

export const LoadBalancingStrategyDB = [
  LoadBalancingStrategy.ROUND_ROBIN,
  LoadBalancingStrategy.WEIGHTED,
  LoadBalancingStrategy.PRIORITY,
  LoadBalancingStrategy.LEAST_USED,
] as const;

export function mapStatusFilter(
  filter:
    | (typeof MessengerAccountStatusFilter)[keyof typeof MessengerAccountStatusFilter]
    | undefined,
): (typeof MessengerAccountStatus)[keyof typeof MessengerAccountStatus] | null {
  switch (filter) {
    case MessengerAccountStatusFilter.ACTIVE:
      return MessengerAccountStatus.ACTIVE;
    case MessengerAccountStatusFilter.INACTIVE:
      return MessengerAccountStatus.INACTIVE;
    case MessengerAccountStatusFilter.ERROR:
      return MessengerAccountStatus.ERROR;
    case MessengerAccountStatusFilter.TESTING:
      return MessengerAccountStatus.TESTING;
    case MessengerAccountStatusFilter.ANY:
    default:
      return null;
  }
}
