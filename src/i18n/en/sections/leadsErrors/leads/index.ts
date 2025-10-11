import { getTranslations } from "./get";
import { patchTranslations } from "./patch";
import { postTranslations } from "./post";

export const leadsTranslations = {
  get: getTranslations,
  patch: patchTranslations,
  post: postTranslations,
};
