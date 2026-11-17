import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Messagerie",
  tag: "messagerie",
  enums: {
    channel: {
      email: "E-mail",
      sms: "SMS",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
    },
    channelFilter: {
      any: "Tous les canaux",
    },
    provider: {
      twilio: "Twilio",
      awsSns: "AWS SNS",
      messagebird: "MessageBird",
      http: "HTTP",
      whatsappBusiness: "WhatsApp Business",
      telegramBot: "Bot Telegram",
    },
    accountStatus: {
      active: "Actif",
      inactive: "Inactif",
      error: "Erreur",
      testing: "En test",
    },
  },
  send: {
    errors: {
      accountNotFound: "Compte de messagerie {{accountId}} introuvable",
      sendFailed: "Échec de l'envoi du message",
      unexpected: "Erreur inattendue lors de l'envoi du message : {{error}}",
    },
  },
};
