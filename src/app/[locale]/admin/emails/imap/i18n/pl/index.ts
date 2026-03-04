import { translations as accountsApiTranslations } from "../../accounts/i18n/pl";
import { translations as configApiTranslations } from "../../config/i18n/pl";
import { translations as foldersApiTranslations } from "../../folders/i18n/pl";
import { translations as overviewApiTranslations } from "../../overview/i18n/pl";
import { translations as syncApiTranslations } from "../../sync/i18n/pl";

export const translations = {
  api: {
    accounts: accountsApiTranslations,
    config: configApiTranslations,
    folders: foldersApiTranslations,
    overview: overviewApiTranslations,
    sync: syncApiTranslations,
  },
} as const;
