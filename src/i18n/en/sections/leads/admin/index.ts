import { abTestingTranslations } from "./abTesting";
import { actionsTranslations } from "./actions";
import { adminErrorsTranslations } from "./adminErrors";
import { batchTranslations } from "./batch";
import { campaignsTranslations } from "./campaigns";
import { campaignStarterTranslations } from "./campaignStarter";
import { emailsTranslations } from "./emails";
import { filtersTranslations } from "./filters";
import { formattingTranslations } from "./formatting";
import { importTranslations } from "./import";
import { resultsTranslations } from "./results";
import { sortTranslations } from "./sort";
import { sourceTranslations } from "./source";
import { stageTranslations } from "./stage";
import { statsTranslations } from "./stats";
import { statusTranslations } from "./status";
import { tableTranslations } from "./table";
import { tabsTranslations } from "./tabs";

export const adminTranslations = {
  abTesting: abTestingTranslations,
  actions: actionsTranslations,
  adminErrors: adminErrorsTranslations,
  batch: batchTranslations,
  campaigns: campaignsTranslations,
  campaignStarter: campaignStarterTranslations,
  emails: emailsTranslations,
  filters: filtersTranslations,
  formatting: formattingTranslations,
  import: importTranslations,
  results: resultsTranslations,
  sort: sortTranslations,
  source: sourceTranslations,
  stage: stageTranslations,
  stats: statsTranslations,
  status: statusTranslations,
  table: tableTranslations,
  tabs: tabsTranslations,
  title: "Lead Management",
  description:
    "Manage leads, import from CSV, and track email campaign performance",
  export: "Export Leads",
  loading: "Loading...",
};
