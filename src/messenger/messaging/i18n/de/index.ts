import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Messaging",
  tag: "messaging",
  enums: {
    channel: {
      email: "E-Mail",
      sms: "SMS",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
    },
    channelFilter: {
      any: "Alle Kanäle",
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
      active: "Aktiv",
      inactive: "Inaktiv",
      error: "Fehler",
      testing: "Test",
    },
  },
  send: {
    errors: {
      accountNotFound: "Messaging-Konto {{accountId}} nicht gefunden",
      sendFailed: "Nachricht konnte nicht gesendet werden",
      unexpected: "Unerwarteter Fehler beim Senden der Nachricht: {{error}}",
    },
  },
};
