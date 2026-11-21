/**
 * Maps the journey-variant / stage filter enums (with ALL) to stored values.
 * Shared by campaign-stats and campaign-queue so drill-downs match exactly.
 */

import {
  EmailCampaignStage,
  EmailCampaignStageFilter,
  EmailJourneyVariant,
  EmailJourneyVariantFilter,
} from "next-vibe/identity/lead/enum";

export function journeyVariantFromFilter(
  value:
    | (typeof EmailJourneyVariantFilter)[keyof typeof EmailJourneyVariantFilter]
    | undefined,
): (typeof EmailJourneyVariant)[keyof typeof EmailJourneyVariant] | null {
  switch (value) {
    case EmailJourneyVariantFilter.UNCENSORED_CONVERT:
      return EmailJourneyVariant.UNCENSORED_CONVERT;
    case EmailJourneyVariantFilter.SIDE_HUSTLE:
      return EmailJourneyVariant.SIDE_HUSTLE;
    case EmailJourneyVariantFilter.QUIET_RECOMMENDATION:
      return EmailJourneyVariant.QUIET_RECOMMENDATION;
    case EmailJourneyVariantFilter.SIGNUP_NURTURE:
      return EmailJourneyVariant.SIGNUP_NURTURE;
    case EmailJourneyVariantFilter.RETENTION:
      return EmailJourneyVariant.RETENTION;
    case EmailJourneyVariantFilter.WINBACK:
      return EmailJourneyVariant.WINBACK;
    case EmailJourneyVariantFilter.NEWSLETTER_MAY_2026:
      return EmailJourneyVariant.NEWSLETTER_MAY_2026;
    case EmailJourneyVariantFilter.NEWSLETTER_NOV_2026:
      return EmailJourneyVariant.NEWSLETTER_NOV_2026;
    case EmailJourneyVariantFilter.ALL:
    case undefined:
      return null;
  }
}

export function stageFromFilter(
  value:
    | (typeof EmailCampaignStageFilter)[keyof typeof EmailCampaignStageFilter]
    | undefined,
): (typeof EmailCampaignStage)[keyof typeof EmailCampaignStage] | null {
  switch (value) {
    case EmailCampaignStageFilter.NOT_STARTED:
      return EmailCampaignStage.NOT_STARTED;
    case EmailCampaignStageFilter.INITIAL:
      return EmailCampaignStage.INITIAL;
    case EmailCampaignStageFilter.FOLLOWUP_1:
      return EmailCampaignStage.FOLLOWUP_1;
    case EmailCampaignStageFilter.FOLLOWUP_2:
      return EmailCampaignStage.FOLLOWUP_2;
    case EmailCampaignStageFilter.FOLLOWUP_3:
      return EmailCampaignStage.FOLLOWUP_3;
    case EmailCampaignStageFilter.NURTURE:
      return EmailCampaignStage.NURTURE;
    case EmailCampaignStageFilter.REACTIVATION:
      return EmailCampaignStage.REACTIVATION;
    case EmailCampaignStageFilter.ALL:
    case undefined:
      return null;
  }
}
