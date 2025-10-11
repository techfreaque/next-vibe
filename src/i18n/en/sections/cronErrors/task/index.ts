import { deleteTranslations } from "./delete";
import { getTranslations } from "./get";
import { patchTranslations } from "./patch";
import { putTranslations } from "./put";

export const taskTranslations = {
  delete: deleteTranslations,
  get: getTranslations,
  patch: patchTranslations,
  put: putTranslations,
};
