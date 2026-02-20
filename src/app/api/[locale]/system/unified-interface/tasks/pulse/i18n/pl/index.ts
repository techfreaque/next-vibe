import { translations as executeTranslations } from "../../execute/i18n/pl";
import { translations as historyTranslations } from "../../history/i18n/pl";
import { translations as statusTranslations } from "../../status/i18n/pl";
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
  history: historyTranslations,
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
