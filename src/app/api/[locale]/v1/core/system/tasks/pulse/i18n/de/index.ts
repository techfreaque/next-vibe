import { translations as executeTranslations } from "../../execute/i18n/de";
import { translations as statusTranslations } from "../../status/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  execute: executeTranslations,
  status: statusTranslations,
  success: {
    title: "Erfolg",
    description: "Puls erfolgreich ausgeführt",
    content: "Erfolg",
  },
  container: {
    title: "Puls-Container",
    description: "Puls-Container-Beschreibung",
  },
};
