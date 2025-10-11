import type { leadsTranslations as EnglishLeadsTranslations } from "../../../../en/sections/leadsErrors/leads";
import { getTranslations } from "./get";
import { patchTranslations } from "./patch";
import { postTranslations } from "./post";

export const leadsTranslations: typeof EnglishLeadsTranslations = {
  get: getTranslations,
  patch: patchTranslations,
  post: postTranslations,
};
