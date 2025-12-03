import { translations as agentTranslations } from "../../agent/i18n/de";
import { translations as browserTranslations } from "../../browser/i18n/de";
import { translations as contactTranslations } from "../../contact/i18n/de";
import { translations as creditsTranslations } from "../../credits/i18n/de";
import { translations as emailsTranslations } from "../../emails/i18n/de";
import { translations as importTranslations } from "../../import/i18n/de";
import { translations as leadsTranslations } from "../../leads/i18n/de";
import { translations as manifestTranslations } from "../../manifest/i18n/de";
import { translations as newsletterTranslations } from "../../newsletter/i18n/de";
import { translations as paymentTranslations } from "../../payment/i18n/de";
import { translations as productsTranslations } from "../../products/i18n/de";
import { translations as referralTranslations } from "../../referral/i18n/de";
import { translations as sharedTranslations } from "../../shared/i18n/de";
import { translations as sharedUtilsTranslations } from "../../shared/utils/i18n/de";
import { translations as smsTranslations } from "../../sms/i18n/de";
import { translations as stripeTranslations } from "../../payment/providers/stripe/i18n/de";
import { translations as subscriptionTranslations } from "../../subscription/i18n/de";
import { translations as systemTranslations } from "../../system/i18n/de";
import { translations as userTranslations } from "../../user/i18n/de";
import { translations as usersTranslations } from "../../users/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  agent: agentTranslations,
  browser: browserTranslations,
  contact: contactTranslations,
  credits: creditsTranslations,
  emails: emailsTranslations,
  import: importTranslations,
  leads: leadsTranslations,
  manifest: manifestTranslations,
  newsletter: newsletterTranslations,
  payment: paymentTranslations,
  products: productsTranslations,
  referral: referralTranslations,
  shared: {
    ...sharedTranslations,
    utils: sharedUtilsTranslations,
  },
  sms: smsTranslations,
  stripe: stripeTranslations,
  subscription: subscriptionTranslations,
  system: systemTranslations,
  user: userTranslations,
  users: usersTranslations,
};
