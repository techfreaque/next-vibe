import type { campaignsTranslations as EnglishCampaignsTranslations } from "../../../../en/sections/leadsErrors/campaigns";
import { commonTranslations } from "./common";
import { deleteTranslations } from "./delete";
import { getTranslations } from "./get";
import { manageTranslations } from "./manage";
import { postTranslations } from "./post";
import { putTranslations } from "./put";
import { statsTranslations } from "./stats";

export const campaignsTranslations: typeof EnglishCampaignsTranslations = {
  common: commonTranslations,
  delete: deleteTranslations,
  get: getTranslations,
  manage: manageTranslations,
  post: postTranslations,
  put: putTranslations,
  stats: statsTranslations,
};
