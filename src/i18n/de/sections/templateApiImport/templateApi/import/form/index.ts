import type { formTranslations as EnglishFormTranslations } from "../../../../../../en/sections/templateApiImport/templateApi/import/form";
import { errorsTranslations } from "./errors";
import { fieldsTranslations } from "./fields";
import { sectionsTranslations } from "./sections";
import { submitTranslations } from "./submit";
import { successTranslations } from "./success";
import { warningsTranslations } from "./warnings";

export const formTranslations: typeof EnglishFormTranslations = {
  errors: errorsTranslations,
  fields: fieldsTranslations,
  sections: sectionsTranslations,
  submit: submitTranslations,
  success: successTranslations,
  warnings: warningsTranslations,
  title: "Vorlagen-Import",
  description:
    "Laden Sie Vorlagen in großen Mengen mit verschiedenen Dateiformaten hoch und importieren Sie sie",
};
