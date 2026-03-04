import { translations as accountsTranslations } from "../../accounts/i18n/pl";
import { translations as createTranslations } from "../../create/i18n/pl";
import { translations as editTranslations } from "../../edit/i18n/pl";

export const translations = {
  pages: {
    accounts: accountsTranslations,
    create: createTranslations,
    edit: editTranslations,
  },
} as const;
