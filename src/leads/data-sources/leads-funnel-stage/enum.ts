/**
 * Lead Funnel Stage - Enums
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

/** Funnel stages of a lead cohort, in funnel order. */
export const {
  enum: LeadFunnelStage,
  options: LeadFunnelStageOptions,
  Value: LeadFunnelStageValue,
} = createEnumOptions(scopedTranslation, {
  LEADS: "enums.stage.leads",
  HUMANS: "enums.stage.humans",
  FIRST_CHATS: "enums.stage.firstChats",
  SIGNUPS: "enums.stage.signups",
  EMAIL_CONFIRMED: "enums.stage.emailConfirmed",
  PAYERS: "enums.stage.payers",
});

export const LeadFunnelStageDB = [
  LeadFunnelStage.LEADS,
  LeadFunnelStage.HUMANS,
  LeadFunnelStage.FIRST_CHATS,
  LeadFunnelStage.SIGNUPS,
  LeadFunnelStage.EMAIL_CONFIRMED,
  LeadFunnelStage.PAYERS,
] as const;
