export const translations = {
  category: "Messaging",
  tag: "messaging",
  enums: {
    channel: {
      email: "Email",
      sms: "SMS",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
    },
    channelFilter: {
      any: "All Channels",
    },
    provider: {
      twilio: "Twilio",
      awsSns: "AWS SNS",
      messagebird: "MessageBird",
      http: "HTTP",
      whatsappBusiness: "WhatsApp Business",
      telegramBot: "Telegram Bot",
    },
    accountStatus: {
      active: "Active",
      inactive: "Inactive",
      error: "Error",
      testing: "Testing",
    },
  },
  send: {
    errors: {
      accountNotFound: "Messaging account {{accountId}} not found",
      sendFailed: "Failed to send message",
      unexpected: "Unexpected error sending message: {{error}}",
    },
  },
};
