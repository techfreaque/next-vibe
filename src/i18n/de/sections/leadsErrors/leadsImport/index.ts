import type { leadsImportTranslations as EnglishLeadsImportTranslations } from "../../../../en/sections/leadsErrors/leadsImport";
import { deleteTranslations } from "./delete";
import { getTranslations } from "./get";
import { patchTranslations } from "./patch";
import { postTranslations } from "./post";
import { retryTranslations } from "./retry";
import { stopTranslations } from "./stop";

export const leadsImportTranslations: typeof EnglishLeadsImportTranslations = {
  delete: deleteTranslations,
  get: getTranslations,
  patch: patchTranslations,
  post: postTranslations,
  retry: retryTranslations,
  stop: stopTranslations,
};
