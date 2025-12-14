import { translations as agentTranslations } from "../../agent/i18n/pl";
import { translations as contactTranslations } from "../../contact/i18n/pl";
import { translations as emailsTranslations } from "../../emails/i18n/pl";
import { translations as importTranslations } from "../../import/i18n/pl";
import { translations as leadsTranslations } from "../../leads/i18n/pl";
import { translations as manifestTranslations } from "../../manifest/i18n/pl";
import { translations as newsletterTranslations } from "../../newsletter/i18n/pl";
import { translations as paymentTranslations } from "../../payment/i18n/pl";
import { translations as stripeTranslations } from "../../payment/providers/stripe/i18n/pl";
import { translations as productsTranslations } from "../../products/i18n/pl";
import { translations as referralTranslations } from "../../referral/i18n/pl";
import { translations as sharedTranslations } from "../../shared/i18n/pl";
import { translations as sharedUtilsTranslations } from "../../shared/utils/i18n/pl";
import { translations as smsTranslations } from "../../sms/i18n/pl";
import { translations as subscriptionTranslations } from "../../subscription/i18n/pl";
import { translations as systemTranslations } from "../../system/i18n/pl";
import { translations as userTranslations } from "../../user/i18n/pl";
import { translations as usersTranslations } from "../../users/i18n/pl";

export const translations = {
  agent: agentTranslations,
  contact: contactTranslations,
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
