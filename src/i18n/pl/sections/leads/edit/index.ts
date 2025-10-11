import type { editTranslations as EnglishEditTranslations } from "../../../../en/sections/leads/edit";
import { formTranslations } from "./form";
import { successTranslations } from "./success";

export const editTranslations: typeof EnglishEditTranslations = {
  form: formTranslations,
  success: successTranslations,
  title: "Edytuj Lead",
  description: "Zaktualizuj informacje o leadzie i status",
};
