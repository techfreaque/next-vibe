import { translations as accountsTranslations } from "../../accounts/i18n/de";
import { translations as createTranslations } from "../../create/i18n/de";
import { translations as editTranslations } from "../../edit/i18n/de";

export const translations = {
  pages: {
    accounts: accountsTranslations,
    create: createTranslations,
    edit: editTranslations,
  },
} as const;
