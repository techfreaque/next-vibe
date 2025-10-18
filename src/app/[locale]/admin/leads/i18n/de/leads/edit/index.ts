import type { translations as enTranslations } from "../../../en/leads/edit";
import { translations as formTranslations } from "./form";
import { translations as successTranslations } from "./success";

export const translations: typeof enTranslations = {
  form: formTranslations,
  success: successTranslations,
  title: "Lead bearbeiten",
  description: "Lead-Informationen und Status aktualisieren",
};
