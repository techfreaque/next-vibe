import { translations as agentTranslations } from "../../agent/i18n/pl";
import { translations as contactTranslations } from "../../contact/i18n/pl";
import { translations as emailsTranslations } from "../../emails/i18n/pl";
import { translations as importTranslations } from "../../import/i18n/pl";
import { translations as leadsTranslations } from "../../leads/i18n/pl";
import { translations as manifestTranslations } from "../../manifest/i18n/pl";
import { translations as newsletterTranslations } from "../../newsletter/i18n/pl";
import { translations as paymentTranslations } from "../../payment/i18n/pl";
import { translations as sharedTranslations } from "../../shared/i18n/pl";
import { translations as smsTranslations } from "../../sms/i18n/pl";
import { translations as stripeTranslations } from "../../stripe/i18n/pl";
import { translations as subscriptionTranslations } from "../../subscription/i18n/pl";
import { translations as systemTranslations } from "../../system/i18n/pl";
import { translations as userTranslations } from "../../user/i18n/pl";
import { translations as usersTranslations } from "../../users/i18n/pl";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  agent: agentTranslations,
  contact: contactTranslations,
  emails: emailsTranslations,
  import: importTranslations,
  leads: leadsTranslations,
  manifest: manifestTranslations,
  newsletter: newsletterTranslations,
  payment: paymentTranslations,
  shared: sharedTranslations,
  sms: smsTranslations,
  stripe: stripeTranslations,
  subscription: subscriptionTranslations,
  system: systemTranslations,
  user: userTranslations,
  users: usersTranslations,
};
