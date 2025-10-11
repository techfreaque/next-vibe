import type { templateApiTranslations as EnglishTemplateApiTranslations } from "../../../../en/sections/templateErrors/templateApi";
import { deleteTranslations } from "./delete";
import { formTranslations } from "./form";

export const templateApiTranslations: typeof EnglishTemplateApiTranslations = {
  delete: deleteTranslations,
  form: formTranslations,
};
