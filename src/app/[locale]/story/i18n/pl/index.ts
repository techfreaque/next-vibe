import { translations as componentsTranslations } from "../../_components/i18n/pl";
import { translations as newsletterTranslations } from "../../newsletter/i18n/pl";
import { translations as pricingTranslations } from "../../pricing/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...componentsTranslations,
  newsletter: newsletterTranslations,
  pricing: pricingTranslations,
};
