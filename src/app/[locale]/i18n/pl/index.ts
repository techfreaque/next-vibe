import { translations as componentsTranslations } from "../../_components/i18n/pl";
import { translations as notFoundTranslations } from "../../[...notFound]/i18n/pl";
import { translations as adminTranslations } from "../../admin/i18n/pl";
import { translations as chatTranslations } from "../../chat/i18n/pl";
import { translations as siteTranslations } from "../../story/i18n/pl";
import { translations as subscriptionTranslations } from "../../subscription/i18n/pl";
import { translations as trackTranslations } from "../../track/i18n/pl";
import { translations as userTranslations } from "../../user/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...componentsTranslations,
  story: siteTranslations,
  notFound: notFoundTranslations,
  admin: adminTranslations,
  chat: chatTranslations,
  subscription: subscriptionTranslations,
  track: trackTranslations,
  user: userTranslations,
};
