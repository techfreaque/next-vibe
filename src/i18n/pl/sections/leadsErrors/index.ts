import type { leadsErrorsTranslations as EnglishLeadsErrorsTranslations } from "../../../en/sections/leadsErrors";
import { batchTranslations } from "./batch";
import { campaignsTranslations } from "./campaigns";
import { constantsTranslations } from "./constants";
import { leadsTranslations } from "./leads";
import { leadsEngagementTranslations } from "./leadsEngagement";
import { leadsExportTranslations } from "./leadsExport";
import { leadsImportTranslations } from "./leadsImport";
import { leadsStatsTranslations } from "./leadsStats";
import { leadsTrackingTranslations } from "./leadsTracking";
import { leadsUnsubscribeTranslations } from "./leadsUnsubscribe";
import { testEmailTranslations } from "./testEmail";
import { validationTranslations } from "./validation";

export const leadsErrorsTranslations: typeof EnglishLeadsErrorsTranslations = {
  batch: batchTranslations,
  campaigns: campaignsTranslations,
  constants: constantsTranslations,
  leads: leadsTranslations,
  leadsEngagement: leadsEngagementTranslations,
  leadsExport: leadsExportTranslations,
  leadsImport: leadsImportTranslations,
  leadsStats: leadsStatsTranslations,
  leadsTracking: leadsTrackingTranslations,
  leadsUnsubscribe: leadsUnsubscribeTranslations,
  testEmail: testEmailTranslations,
  validation: validationTranslations,
};
