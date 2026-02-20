import { translations as accountsCreateTranslations } from "../../accounts/create/i18n/pl";
import { translations as accountsEditTranslations } from "../../accounts/edit/[id]/i18n/pl";
import { translations as accountsListTranslations } from "../../accounts/list/i18n/pl";
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
  accounts: {
    create: accountsCreateTranslations,
    edit: { id: accountsEditTranslations },
    list: accountsListTranslations,
  },
};
