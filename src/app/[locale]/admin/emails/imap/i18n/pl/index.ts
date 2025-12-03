import { translations as uiTranslations } from "@/app/api/[locale]/emails/imap-client/_components/i18n/pl";
import { translations as accountsApiTranslations } from "../../accounts/i18n/pl";
import { translations as configApiTranslations } from "../../config/i18n/pl";
import { translations as foldersApiTranslations } from "../../folders/i18n/pl";
import { translations as overviewApiTranslations } from "../../overview/i18n/pl";
import { translations as syncApiTranslations } from "../../sync/i18n/pl";

// Spread UI translations at the top level for component access (e.g., "imap.account.fields.name")
// Nest API translations under "api" namespace to avoid conflicts
export const translations = {
  ...uiTranslations,
  api: {
    accounts: accountsApiTranslations,
    config: configApiTranslations,
    folders: foldersApiTranslations,
    overview: overviewApiTranslations,
    sync: syncApiTranslations,
  },
} as const;
