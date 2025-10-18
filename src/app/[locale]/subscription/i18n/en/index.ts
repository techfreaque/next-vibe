import { translations as billingTranslations } from "./billing";
import { translations as checkoutTranslations } from "./checkout";
import { translations as paymentTranslations } from "./payment";
import { translations as premiumTranslations } from "./premium";
import { translations as paymentErrorsTranslations } from "./paymentErrors";
import { translations as subscriptionTranslations } from "./subscription";
import { translations as subscriptionErrorsTranslations } from "./subscriptionErrors";
import { translations as subscriptionsTranslations } from "./subscriptions";
import { translations as subscriptionsErrorsTranslations } from "./subscriptionsErrors";

export const translations = {
  billing: billingTranslations,
  checkout: checkoutTranslations,
  payment: paymentTranslations,
  paymentErrors: paymentErrorsTranslations,
  premium: premiumTranslations,
  subscription: subscriptionTranslations,
  subscriptionErrors: subscriptionErrorsTranslations,
  subscriptions: subscriptionsTranslations,
  subscriptionsErrors: subscriptionsErrorsTranslations,
};
