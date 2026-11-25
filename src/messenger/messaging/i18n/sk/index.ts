import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Správy",
  tag: "správy",
  enums: {
    channel: {
      email: "E-mail",
      sms: "SMS",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
    },
    channelFilter: {
      any: "Všetky kanály",
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
      active: "Aktívne",
      inactive: "Neaktívne",
      error: "Chyba",
      testing: "Testovanie",
    },
  },
  send: {
    errors: {
      accountNotFound: "Účet na odosielanie správ {{accountId}} sa nenašiel",
      sendFailed: "Nepodarilo sa poslať správu",
      unexpected: "Neočakávaná chyba pri odosielaní správy: {{error}}",
    },
  },
};
