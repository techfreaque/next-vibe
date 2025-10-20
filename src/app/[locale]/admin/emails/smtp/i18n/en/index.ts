import { translations as uiTranslations } from "../../_components/i18n/en";
import { translations as accountsTranslations } from "../../accounts/i18n/en";
import { translations as createTranslations } from "../../create/i18n/en";
import { translations as editTranslations } from "../../edit/i18n/en";

// Spread UI translations at the top level for component access (e.g., "smtp.admin.fields.name")
// Nest page-specific translations under "pages" namespace to avoid conflicts
export const translations = {
  ...uiTranslations,
  pages: {
    accounts: accountsTranslations,
    create: createTranslations,
    edit: editTranslations,
  },
};
