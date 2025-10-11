import type { pricingTranslations as EnglishPricingTranslations } from "../../../en/sections/pricing";
import { buttonsTranslations } from "./buttons";
import { comparisonTranslations } from "./comparison";
import { currentPlanTranslations } from "./currentPlan";
import { downgradeTranslations } from "./downgrade";
import { plansTranslations } from "./plans";
import { subscribeTranslations } from "./subscribe";
import { subscriptionBannerTranslations } from "./subscriptionBanner";
import { upgradeTranslations } from "./upgrade";

export const pricingTranslations: typeof EnglishPricingTranslations = {
  buttons: buttonsTranslations,
  comparison: comparisonTranslations,
  currentPlan: currentPlanTranslations,
  downgrade: downgradeTranslations,
  plans: plansTranslations,
  subscribe: subscribeTranslations,
  subscriptionBanner: subscriptionBannerTranslations,
  upgrade: upgradeTranslations,
};
