import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "मैसेजिंग",
  tag: "messaging",
  enums: {
    channel: {
      email: "ईमेल",
      sms: "SMS",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
    },
    channelFilter: {
      any: "सभी चैनल",
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
      active: "एक्टिव",
      inactive: "निष्क्रिय",
      error: "एरर",
      testing: "टेस्टिंग",
    },
  },
  send: {
    errors: {
      accountNotFound: "मैसेजिंग अकाउंट {{accountId}} नहीं मिला",
      sendFailed: "मैसेज भेजा नहीं जा सका",
      unexpected: "मैसेज भेजते समय अनपेक्षित एरर: {{error}}",
    },
  },
};
