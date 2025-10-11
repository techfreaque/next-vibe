import { translations as agentTranslations } from "../../agent/i18n/pl";
import { translations as businessDataTranslations } from "../../business-data/i18n/pl";
import { translations as consultationTranslations } from "../../consultation/i18n/pl";
import { translations as contactTranslations } from "../../contact/i18n/pl";
import { translations as emailsTranslations } from "../../emails/i18n/pl";
import { translations as leadsTranslations } from "../../leads/i18n/pl";
import { translations as manifestTranslations } from "../../manifest/i18n/pl";
import { translations as newsletterTranslations } from "../../newsletter/i18n/pl";
import { translations as onboardingTranslations } from "../../onboarding/i18n/pl";
import { translations as paymentTranslations } from "../../payment/i18n/pl";
import { translations as stripeTranslations } from "../../stripe/i18n/pl";
import { translations as subscriptionTranslations } from "../../subscription/i18n/pl";
import { translations as systemTranslations } from "../../system/i18n/pl";
import { translations as templateApiTranslations } from "../../template-api/i18n/pl";
import { translations as userTranslations } from "../../user/i18n/pl";
import { translations as usersTranslations } from "../../users/i18n/pl";
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
