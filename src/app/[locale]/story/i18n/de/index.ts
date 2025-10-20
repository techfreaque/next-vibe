import { translations as componentsTranslations } from "../../_components/i18n/de";
import { translations as imprintTranslations } from "../../imprint/i18n/de";
import { translations as newsletterTranslations } from "../../newsletter/i18n/de";
import { translations as pricingTranslations } from "../../pricing/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  _components: componentsTranslations,
  imprint: imprintTranslations,
  newsletter: newsletterTranslations,
  pricing: pricingTranslations,
};
