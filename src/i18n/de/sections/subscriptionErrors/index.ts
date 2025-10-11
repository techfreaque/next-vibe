import type { subscriptionErrorsTranslations as EnglishSubscriptionErrorsTranslations } from "../../../en/sections/subscriptionErrors";
import { checkoutTranslations } from "./checkout";
import { subscriptionTranslations } from "./subscription";

export const subscriptionErrorsTranslations: typeof EnglishSubscriptionErrorsTranslations =
  {
    checkout: checkoutTranslations,
    subscription: subscriptionTranslations,
  };
