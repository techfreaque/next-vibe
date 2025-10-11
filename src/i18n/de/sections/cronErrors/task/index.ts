import type { taskTranslations as EnglishTaskTranslations } from "../../../../en/sections/cronErrors/task";
import { deleteTranslations } from "./delete";
import { getTranslations } from "./get";
import { patchTranslations } from "./patch";
import { putTranslations } from "./put";

export const taskTranslations: typeof EnglishTaskTranslations = {
  delete: deleteTranslations,
  get: getTranslations,
  patch: patchTranslations,
  put: putTranslations,
};
