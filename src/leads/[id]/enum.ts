import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

export const { enum: LeadJourneyEvent } = createEnumOptions(scopedTranslation, {
  CREATED: "journey.events.created",
  CAMPAIGN_STARTED: "journey.events.campaignStarted",
  EMAIL_SENT: "journey.events.emailSent",
  EMAIL_BOUNCED: "journey.events.emailBounced",
  BOUNCED: "journey.events.bounced",
  UNSUBSCRIBED: "journey.events.unsubscribed",
  INVALID: "journey.events.invalid",
  SIGNUP: "journey.events.signup",
  CONVERTED: "journey.events.converted",
  SUBSCRIPTION_CONFIRMED: "journey.events.subscriptionConfirmed",
  FIRST_TOUCH: "journey.events.firstTouch",
  LAST_TOUCH: "journey.events.lastTouch",
  FIRST_CHAT: "journey.events.firstChat",
  FIRST_PAYMENT: "journey.events.firstPayment",
  LEAD_LINK: "journey.events.leadLink",
  ACCOUNT_LINK: "journey.events.accountLink",
  REFERRAL: "journey.events.referral",
  INTERACTION: "journey.events.interaction",
  NEWSLETTER_SUBSCRIBED: "journey.events.newsletterSubscribed",
  NEWSLETTER_CONFIRMED: "journey.events.newsletterConfirmed",
  NEWSLETTER_UNSUBSCRIBED: "journey.events.newsletterUnsubscribed",
});

export const { enum: LeadLinkEvidence } = createEnumOptions(scopedTranslation, {
  ip_match: "journey.evidence.ipMatch",
  track_page: "journey.evidence.trackPage",
  referral: "journey.evidence.referral",
  manual: "journey.evidence.manual",
  test: "journey.evidence.test",
  login: "journey.evidence.login",
  signup: "journey.evidence.signup",
  merge: "journey.evidence.merge",
});

export const { enum: LeadAccountAssociation } = createEnumOptions(
  scopedTranslation,
  {
    LINK: "journey.recordedAccountLink",
    CONVERSION: "journey.recordedConversion",
    ATTRIBUTION: "journey.attributedAccount",
  },
);
