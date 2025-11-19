import { translations as uiTranslations } from "@/app/api/[locale]/v1/core/emails/smtp-client/_components/i18n/pl";
import { translations as accountsTranslations } from "../../accounts/i18n/pl";
import { translations as createTranslations } from "../../create/i18n/pl";
import { translations as editTranslations } from "../../edit/i18n/pl";

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
