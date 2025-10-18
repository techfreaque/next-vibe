import { translations as componentsTranslations } from "../../_components/i18n/de";
import { translations as aboutUsTranslations } from "../../about-us/i18n/de";
import { translations as careersTranslations } from "../../careers/i18n/de";
import { translations as imprintTranslations } from "../../imprint/i18n/de";
import { translations as newsletterTranslations } from "../../newsletter/i18n/de";
import { translations as pricingTranslations } from "../../pricing/i18n/de";
import { translations as privacyPolicyTranslations } from "../../privacy-policy/i18n/de";
import { translations as termsOfServiceTranslations } from "../../terms-of-service/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  aboutUs: aboutUsTranslations,
  careers: careersTranslations,
  components: componentsTranslations,
  imprint: imprintTranslations,
  newsletter: newsletterTranslations,
  pricing: pricingTranslations,
  privacyPolicy: privacyPolicyTranslations,
  termsOfService: termsOfServiceTranslations,
};
