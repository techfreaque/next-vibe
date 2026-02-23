/**
 * Messaging Channel Enums
 * Enums for multi-channel messaging (SMS, WhatsApp, Telegram, Email)
 */
import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * Message Channel Enum
 * Discriminator for which channel a message was sent/received on
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
 * Messaging Channel Filter (includes ANY)
 */
export const {
  enum: MessageChannelFilter,
  options: MessageChannelFilterOptions,
  Value: MessageChannelFilterValue,
} = createEnumOptions(scopedTranslation, {
  ANY: "enums.channelFilter.any",
  EMAIL: "enums.channel.email",
  SMS: "enums.channel.sms",
  WHATSAPP: "enums.channel.whatsapp",
  TELEGRAM: "enums.channel.telegram",
});

/**
 * Messaging Provider Enum
 */
export const {
  enum: MessagingProvider,
  options: MessagingProviderOptions,
  Value: MessagingProviderValue,
} = createEnumOptions(scopedTranslation, {
  TWILIO: "enums.provider.twilio",
  AWS_SNS: "enums.provider.awsSns",
  MESSAGEBIRD: "enums.provider.messagebird",
  HTTP: "enums.provider.http",
  WHATSAPP_BUSINESS: "enums.provider.whatsappBusiness",
  TELEGRAM_BOT: "enums.provider.telegramBot",
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
} = createEnumOptions(scopedTranslation, {
  ACTIVE: "enums.accountStatus.active",
  INACTIVE: "enums.accountStatus.inactive",
  ERROR: "enums.accountStatus.error",
  TESTING: "enums.accountStatus.testing",
});

export const MessagingAccountStatusDB = [
  MessagingAccountStatus.ACTIVE,
  MessagingAccountStatus.INACTIVE,
  MessagingAccountStatus.ERROR,
  MessagingAccountStatus.TESTING,
] as const;
