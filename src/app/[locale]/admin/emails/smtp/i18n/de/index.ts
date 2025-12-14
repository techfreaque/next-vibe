import { translations as uiTranslations } from "@/app/api/[locale]/emails/smtp-client/_components/i18n/de";

import { translations as accountsTranslations } from "../../accounts/i18n/de";
import { translations as createTranslations } from "../../create/i18n/de";
import { translations as editTranslations } from "../../edit/i18n/de";

// Spread UI translations at the top level for component access (e.g., "smtp.admin.fields.name")
// Nest page-specific translations under "pages" namespace to avoid conflicts
export const translations = {
  ...uiTranslations,
  pages: {
    accounts: accountsTranslations,
    create: createTranslations,
    edit: editTranslations,
  },
} as const;
