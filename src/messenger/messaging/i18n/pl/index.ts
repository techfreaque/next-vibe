import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Wiadomości",
  tag: "messaging",
  enums: {
    channel: {
      email: "E-mail",
      sms: "SMS",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
    },
    channelFilter: {
      any: "Wszystkie kanały",
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
      active: "Aktywny",
      inactive: "Nieaktywny",
      error: "Błąd",
      testing: "Testowanie",
    },
  },
  send: {
    errors: {
      accountNotFound:
        "Konto komunikacyjne {{accountId}} nie zostało znalezione",
      sendFailed: "Nie udało się wysłać wiadomości",
      unexpected: "Nieoczekiwany błąd podczas wysyłania wiadomości: {{error}}",
    },
  },
};
