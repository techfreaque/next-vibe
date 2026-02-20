/**
 * Messaging Channel Enums
 * Enums for multi-channel messaging (SMS, WhatsApp, Telegram, Email)
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

/**
 * Message Channel Enum
 * Discriminator for which channel a message was sent/received on
 */
export const {
  enum: MessageChannel,
  options: MessageChannelOptions,
  Value: MessageChannelValue,
} = createEnumOptions({
  EMAIL: "app.api.emails.messaging.enums.channel.email",
  SMS: "app.api.emails.messaging.enums.channel.sms",
  WHATSAPP: "app.api.emails.messaging.enums.channel.whatsapp",
  TELEGRAM: "app.api.emails.messaging.enums.channel.telegram",
});

export const MessageChannelDB = [
  MessageChannel.EMAIL,
  MessageChannel.SMS,
  MessageChannel.WHATSAPP,
  MessageChannel.TELEGRAM,
] as const;

/**
 * Messaging Channel Filter (includes ANY)
 */
export const {
  enum: MessageChannelFilter,
  options: MessageChannelFilterOptions,
  Value: MessageChannelFilterValue,
} = createEnumOptions({
  ANY: "app.api.emails.messaging.enums.channelFilter.any",
  EMAIL: "app.api.emails.messaging.enums.channel.email",
  SMS: "app.api.emails.messaging.enums.channel.sms",
  WHATSAPP: "app.api.emails.messaging.enums.channel.whatsapp",
  TELEGRAM: "app.api.emails.messaging.enums.channel.telegram",
});

/**
 * Messaging Provider Enum
 */
export const {
  enum: MessagingProvider,
  options: MessagingProviderOptions,
  Value: MessagingProviderValue,
} = createEnumOptions({
  TWILIO: "app.api.emails.messaging.enums.provider.twilio",
  AWS_SNS: "app.api.emails.messaging.enums.provider.awsSns",
  MESSAGEBIRD: "app.api.emails.messaging.enums.provider.messagebird",
  HTTP: "app.api.emails.messaging.enums.provider.http",
  WHATSAPP_BUSINESS: "app.api.emails.messaging.enums.provider.whatsappBusiness",
  TELEGRAM_BOT: "app.api.emails.messaging.enums.provider.telegramBot",
});

export const MessagingProviderDB = [
  MessagingProvider.TWILIO,
  MessagingProvider.AWS_SNS,
  MessagingProvider.MESSAGEBIRD,
  MessagingProvider.HTTP,
  MessagingProvider.WHATSAPP_BUSINESS,
  MessagingProvider.TELEGRAM_BOT,
] as const;

/**
 * Messaging Account Status Enum
 */
export const {
  enum: MessagingAccountStatus,
  options: MessagingAccountStatusOptions,
  Value: MessagingAccountStatusValue,
} = createEnumOptions({
  ACTIVE: "app.api.emails.messaging.enums.accountStatus.active",
  INACTIVE: "app.api.emails.messaging.enums.accountStatus.inactive",
  ERROR: "app.api.emails.messaging.enums.accountStatus.error",
  TESTING: "app.api.emails.messaging.enums.accountStatus.testing",
});

export const MessagingAccountStatusDB = [
  MessagingAccountStatus.ACTIVE,
  MessagingAccountStatus.INACTIVE,
  MessagingAccountStatus.ERROR,
  MessagingAccountStatus.TESTING,
] as const;
