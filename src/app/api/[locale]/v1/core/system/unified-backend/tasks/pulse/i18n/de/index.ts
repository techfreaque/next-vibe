import { translations as executeTranslations } from "../../execute/i18n/de";
import { translations as statusTranslations } from "../../status/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  execute: {
    category: executeTranslations.category,
    tags: executeTranslations.tags,
    post: executeTranslations.post,
  },
  status: {
    category: statusTranslations.category,
    tags: statusTranslations.tags,
    get: statusTranslations.get,
  },
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
