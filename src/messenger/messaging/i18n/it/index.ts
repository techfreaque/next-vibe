import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Messaggistica",
  tag: "Messaggi di messaggi",
  enums: {
    channel: {
      email: "Email",
      sms: "SMS",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
    },
    channelFilter: {
      any: "Tutti i canali",
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
      active: "Attivo",
      inactive: "Inattivo",
      error: "Errore",
      testing: "Testing",
    },
  },
  send: {
    errors: {
      accountNotFound: "Conto di messaggistica {{accountId}} non trovato",
      sendFailed: "Non ha inviato un messaggio",
      unexpected: "Errore inaspettato invia messaggio: {{error}}",
    },
  },
};
