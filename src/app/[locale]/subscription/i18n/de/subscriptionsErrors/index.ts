import type { translations as enTranslations } from "../../en/subscriptionsErrors";
import { translations as subscriptionsTranslations } from "./subscriptions";
import { translations as validationTranslations } from "./validation";

export const translations: typeof enTranslations = {
  subscriptions: subscriptionsTranslations,
  validation: validationTranslations,
};
