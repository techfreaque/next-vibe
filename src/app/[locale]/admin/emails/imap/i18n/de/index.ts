import { translations as accountsApiTranslations } from "../../accounts/i18n/de";
import { translations as configApiTranslations } from "../../config/i18n/de";
import { translations as foldersApiTranslations } from "../../folders/i18n/de";
import { translations as overviewApiTranslations } from "../../overview/i18n/de";
import { translations as syncApiTranslations } from "../../sync/i18n/de";

export const translations = {
  api: {
    accounts: accountsApiTranslations,
    config: configApiTranslations,
    folders: foldersApiTranslations,
    overview: overviewApiTranslations,
    sync: syncApiTranslations,
  },
} as const;
