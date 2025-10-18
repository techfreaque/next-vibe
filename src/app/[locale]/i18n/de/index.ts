import type { translations as enTranslations } from "../en";
import { translations as notFoundTranslations } from "../../[...notFound]/i18n/de";
import { translations as adminTranslations } from "../../admin/i18n/de";
import { translations as chatTranslations } from "../../chat/i18n/de";
import { translations as siteTranslations } from "../../story/i18n/de";
import { translations as subscriptionTranslations } from "../../subscription/i18n/de";
import { translations as trackTranslations } from "../../track/i18n/de";
import { translations as userTranslations } from "../../user/i18n/de";

export const translations: typeof enTranslations = {
  site: siteTranslations,
  notFound: notFoundTranslations,
  admin: adminTranslations,
  chat: chatTranslations,
  track: trackTranslations,
  user: userTranslations,
  subscription: subscriptionTranslations,
};
