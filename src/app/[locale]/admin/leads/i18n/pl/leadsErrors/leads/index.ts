import type { translations as enTranslations } from "../../../en/leadsErrors/leads";
import { translations as getTranslations } from "./get";
import { translations as patchTranslations } from "./patch";
import { translations as postTranslations } from "./post";

export const translations: typeof enTranslations = {
  get: getTranslations,
  patch: patchTranslations,
  post: postTranslations,
};
