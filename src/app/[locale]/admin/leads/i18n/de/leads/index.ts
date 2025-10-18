import type { translations as enTranslations } from "../../en/leads";
import { translations as adminTranslations } from "./admin";
import { translations as campaignTranslations } from "./campaign";
import { translations as constantsTranslations } from "./constants";
import { translations as csvImportTranslations } from "./csvImport";
import { translations as editTranslations } from "./edit";
import { translations as emailsTranslations } from "./emails";
import { translations as engagementTranslations } from "./engagement";
import { translations as errorsTranslations } from "./errors";
import { translations as exportTranslations } from "./export";
import { translations as filterTranslations } from "./filter";
import { translations as importTranslations } from "./import";
import { translations as listTranslations } from "./list";
import { translations as paginationTranslations } from "./pagination";
import { translations as searchTranslations } from "./search";
import { translations as sortTranslations } from "./sort";
import { translations as sortingTranslations } from "./sorting";
import { translations as successTranslations } from "./success";
import { translations as trackingTranslations } from "./tracking";
import { translations as unsubscribeTranslations } from "./unsubscribe";

export const translations: typeof enTranslations = {
  admin: adminTranslations,
  campaign: campaignTranslations,
  constants: constantsTranslations,
  csvImport: csvImportTranslations,
  edit: editTranslations,
  emails: emailsTranslations,
  engagement: engagementTranslations,
  errors: errorsTranslations,
  export: exportTranslations,
  filter: filterTranslations,
  import: importTranslations,
  list: listTranslations,
  pagination: paginationTranslations,
  search: searchTranslations,
  sort: sortTranslations,
  sorting: sortingTranslations,
  success: successTranslations,
  tracking: trackingTranslations,
  unsubscribe: unsubscribeTranslations,
};
