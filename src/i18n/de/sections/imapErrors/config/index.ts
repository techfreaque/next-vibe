import type { configTranslations as EnglishConfigTranslations } from "../../../../en/sections/imapErrors/config";
import { getTranslations } from "./get";
import { putTranslations } from "./put";
import { resetTranslations } from "./reset";

export const configTranslations: typeof EnglishConfigTranslations = {
  get: getTranslations,
  put: putTranslations,
  reset: resetTranslations,
};
