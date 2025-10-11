import { translations as agentTranslations } from "../../agent/i18n/de";
import { translations as businessDataTranslations } from "../../business-data/i18n/de";
import { translations as consultationTranslations } from "../../consultation/i18n/de";
import { translations as contactTranslations } from "../../contact/i18n/de";
import { translations as emailsTranslations } from "../../emails/i18n/de";
import { translations as leadsTranslations } from "../../leads/i18n/de";
import { translations as manifestTranslations } from "../../manifest/i18n/de";
import { translations as newsletterTranslations } from "../../newsletter/i18n/de";
import { translations as onboardingTranslations } from "../../onboarding/i18n/de";
import { translations as paymentTranslations } from "../../payment/i18n/de";
import { translations as stripeTranslations } from "../../stripe/i18n/de";
import { translations as subscriptionTranslations } from "../../subscription/i18n/de";
import { translations as systemTranslations } from "../../system/i18n/de";
import { translations as templateApiTranslations } from "../../template-api/i18n/de";
import { translations as userTranslations } from "../../user/i18n/de";
import { translations as usersTranslations } from "../../users/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  contact: contactTranslations,
  consultation: consultationTranslations,
  emails: emailsTranslations,
  leads: leadsTranslations,
  manifest: manifestTranslations,
  newsletter: newsletterTranslations,
  payment: paymentTranslations,
  stripe: stripeTranslations,
  subscription: subscriptionTranslations,
  system: systemTranslations,
  user: userTranslations,
  users: usersTranslations,
  templateApi: templateApiTranslations,
  agent: agentTranslations,
  businessData: businessDataTranslations,
  onboarding: onboardingTranslations,
};
