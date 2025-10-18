import type { translations as enTranslations } from "../../../en/leads/edit";
import { translations as formTranslations } from "./form";
import { translations as successTranslations } from "./success";

export const translations: typeof enTranslations = {
  form: formTranslations,
  success: successTranslations,
  title: "Edytuj Lead",
  description: "Zaktualizuj informacje o leadzie i status",
};
