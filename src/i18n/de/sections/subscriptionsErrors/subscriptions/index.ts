import type { subscriptionsTranslations as EnglishSubscriptionsTranslations } from "../../../../en/sections/subscriptionsErrors/subscriptions";
import { deleteTranslations } from "./delete";
import { getTranslations } from "./get";
import { postTranslations } from "./post";
import { putTranslations } from "./put";

export const subscriptionsTranslations: typeof EnglishSubscriptionsTranslations =
  {
    delete: deleteTranslations,
    get: getTranslations,
    post: postTranslations,
    put: putTranslations,
  };
