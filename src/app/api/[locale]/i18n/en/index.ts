import { translations as agentTranslations } from "../../agent/i18n/en";
import { translations as browserTranslations } from "../../browser/i18n/en";
import { translations as contactTranslations } from "../../contact/i18n/en";
import { translations as creditsTranslations } from "../../credits/i18n/en";
import { translations as emailsTranslations } from "../../emails/i18n/en";
import { translations as importTranslations } from "../../import/i18n/en";
import { translations as leadsTranslations } from "../../leads/i18n/en";
import { translations as manifestTranslations } from "../../manifest/i18n/en";
import { translations as newsletterTranslations } from "../../newsletter/i18n/en";
import { translations as paymentTranslations } from "../../payment/i18n/en";
import { translations as productsTranslations } from "../../products/i18n/en";
import { translations as referralTranslations } from "../../referral/i18n/en";
import { translations as sharedTranslations } from "../../shared/i18n/en";
import { translations as sharedUtilsTranslations } from "../../shared/utils/i18n/en";
import { translations as smsTranslations } from "../../sms/i18n/en";
import { translations as stripeTranslations } from "../../payment/providers/stripe/i18n/en";
import { translations as subscriptionTranslations } from "../../subscription/i18n/en";
import { translations as systemTranslations } from "../../system/i18n/en";
import { translations as userTranslations } from "../../user/i18n/en";
import { translations as usersTranslations } from "../../users/i18n/en";

export const translations = {
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
