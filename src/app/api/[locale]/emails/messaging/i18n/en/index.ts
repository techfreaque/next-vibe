import { translations as accountsCreateTranslations } from "../../accounts/create/i18n/en";
import { translations as accountsEditTranslations } from "../../accounts/edit/[id]/i18n/en";
import { translations as accountsListTranslations } from "../../accounts/list/i18n/en";

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
  accounts: {
    create: accountsCreateTranslations,
    edit: { id: accountsEditTranslations },
    list: accountsListTranslations,
  },
};
