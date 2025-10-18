import type { translations as enTranslations } from "../../../en/leadsErrors/leadsImport";
import { translations as deleteTranslations } from "./delete";
import { translations as getTranslations } from "./get";
import { translations as patchTranslations } from "./patch";
import { translations as postTranslations } from "./post";
import { translations as retryTranslations } from "./retry";
import { translations as stopTranslations } from "./stop";

export const translations: typeof enTranslations = {
  delete: deleteTranslations,
  get: getTranslations,
  patch: patchTranslations,
  post: postTranslations,
  retry: retryTranslations,
  stop: stopTranslations,
};
