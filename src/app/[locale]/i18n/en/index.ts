import { translations as notFoundTranslations } from "../../[...notFound]/i18n/en";
import { translations as adminTranslations } from "../../admin/i18n/en";
import { translations as chatTranslations } from "../../chat/i18n/en";
import { translations as siteTranslations } from "../../story/i18n/en";
import { translations as subscriptionTranslations } from "../../subscription/i18n/en";
import { translations as trackTranslations } from "../../track/i18n/en";
import { translations as userTranslations } from "../../user/i18n/en";

export const translations = {
  site: siteTranslations,
  notFound: notFoundTranslations,
  admin: adminTranslations,
  chat: chatTranslations,
  track: trackTranslations,
  user: userTranslations,
  subscription: subscriptionTranslations,
} as const;
