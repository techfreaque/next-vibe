/**
 * Lead Magnet Enums
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

export const {
  enum: LeadMagnetCaptureStatus,
  options: LeadMagnetCaptureStatusOptions,
  Value: LeadMagnetCaptureStatusValue,
} = createEnumOptions(scopedTranslation, {
  SUCCESS: "enums.captureStatus.success",
  FAILED: "enums.captureStatus.failed",
});

export const LeadMagnetCaptureStatusDB = [
  LeadMagnetCaptureStatus.SUCCESS,
  LeadMagnetCaptureStatus.FAILED,
] as const;

export const {
  enum: LeadMagnetProvider,
  options: LeadMagnetProviderOptions,
  Value: LeadMagnetProviderValue,
} = createEnumOptions(scopedTranslation, {
  GETRESPONSE: "enums.provider.getresponse",
  KLAVIYO: "enums.provider.klaviyo",
  EMARSYS: "enums.provider.emarsys",
  ACUMBAMAIL: "enums.provider.acumbamail",
  CLEVERREACH: "enums.provider.cleverreach",
  CONNECTIF: "enums.provider.connectif",
  DATANEXT: "enums.provider.datanext",
  EDRONE: "enums.provider.edrone",
  EXPERTSENDER: "enums.provider.expertsender",
  FRESHMAIL: "enums.provider.freshmail",
  MAILUP: "enums.provider.mailup",
  MAPP: "enums.provider.mapp",
  SAILTHRU: "enums.provider.sailthru",
  SALESMANAGO: "enums.provider.salesmanago",
  SHOPIFY: "enums.provider.shopify",
  SPOTLER: "enums.provider.spotler",
  YOULEAD: "enums.provider.youlead",
  ADOBECAMPAIGN: "enums.provider.adobecampaign",
  GOOGLE_SHEETS: "enums.provider.googleSheets",
  PLATFORM_EMAIL: "enums.provider.platformEmail",
});

export const LeadMagnetProviderDB = [
  "GETRESPONSE",
  "KLAVIYO",
  "EMARSYS",
  "ACUMBAMAIL",
  "CLEVERREACH",
  "CONNECTIF",
  "DATANEXT",
  "EDRONE",
  "EXPERTSENDER",
  "FRESHMAIL",
  "MAILUP",
  "MAPP",
  "SAILTHRU",
  "SALESMANAGO",
  "SHOPIFY",
  "SPOTLER",
  "YOULEAD",
  "ADOBECAMPAIGN",
  "GOOGLE_SHEETS",
  "PLATFORM_EMAIL",
] as const satisfies ReadonlyArray<keyof typeof LeadMagnetProvider>;
