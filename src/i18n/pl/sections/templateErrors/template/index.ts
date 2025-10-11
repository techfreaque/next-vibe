import type { templateTranslations as EnglishTemplateTranslations } from "../../../../en/sections/templateErrors/template";
import { deleteTranslations } from "./delete";
import { getTranslations } from "./get";
import { postTranslations } from "./post";
import { putTranslations } from "./put";

export const templateTranslations: typeof EnglishTemplateTranslations = {
  delete: deleteTranslations,
  get: getTranslations,
  post: postTranslations,
  put: putTranslations,
};
