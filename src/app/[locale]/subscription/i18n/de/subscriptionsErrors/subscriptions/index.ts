import type { translations as enTranslations } from "../../../en/subscriptionsErrors/subscriptions";
import { translations as deleteTranslations } from "./delete";
import { translations as getTranslations } from "./get";
import { translations as postTranslations } from "./post";
import { translations as putTranslations } from "./put";

export const translations: typeof enTranslations = {
  delete: deleteTranslations,
  get: getTranslations,
  post: postTranslations,
  put: putTranslations,
};
