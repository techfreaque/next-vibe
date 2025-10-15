import { translations as executeTranslations } from "../../execute/i18n/pl";
import { translations as statusTranslations } from "../../status/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  execute: executeTranslations,
  status: statusTranslations,
  success: {
    title: "Sukces",
    description: "Puls wykonany pomyślnie",
    content: "Sukces",
  },
  container: {
    title: "Kontener pulsu",
    description: "Opis kontenera pulsu",
  },
};
