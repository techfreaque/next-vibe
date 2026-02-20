import { translations as accountsCreateTranslations } from "../../accounts/create/i18n/de";
import { translations as accountsEditTranslations } from "../../accounts/edit/[id]/i18n/de";
import { translations as accountsListTranslations } from "../../accounts/list/i18n/de";
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
  accounts: {
    create: accountsCreateTranslations,
    edit: { id: accountsEditTranslations },
    list: accountsListTranslations,
  },
};
