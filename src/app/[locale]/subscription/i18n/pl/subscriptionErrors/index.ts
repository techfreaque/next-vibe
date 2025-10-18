import type { translations as enTranslations } from "../../en/subscriptionErrors";
import { translations as checkoutTranslations } from "./checkout";
import { translations as subscriptionTranslations } from "./subscription";

export const translations: typeof enTranslations = {
  checkout: checkoutTranslations,
  subscription: subscriptionTranslations,
};
