import { translations as componentsTranslations } from "../../_components/i18n/en";
import { translations as aboutUsTranslations } from "../../about-us/i18n/en";
import { translations as careersTranslations } from "../../careers/i18n/en";
import { translations as imprintTranslations } from "../../imprint/i18n/en";
import { translations as newsletterTranslations } from "../../newsletter/i18n/en";
import { translations as pricingTranslations } from "../../pricing/i18n/en";
import { translations as privacyPolicyTranslations } from "../../privacy-policy/i18n/en";
import { translations as termsOfServiceTranslations } from "../../terms-of-service/i18n/en";

export const translations = {
  aboutUs: aboutUsTranslations,
  careers: careersTranslations,
  components: componentsTranslations,
  imprint: imprintTranslations,
  newsletter: newsletterTranslations,
  pricing: pricingTranslations,
  privacyPolicy: privacyPolicyTranslations,
  termsOfService: termsOfServiceTranslations,
} as const;
