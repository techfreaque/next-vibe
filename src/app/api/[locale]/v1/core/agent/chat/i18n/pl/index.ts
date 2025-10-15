import { translations as aiStreamTranslations } from "../../ai-stream/i18n/pl";
import { translations as foldersTranslations } from "../../folders/i18n/pl";
import { translations as threadsTranslations } from "../../threads/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Czat",
  tags: {
    threads: "Wątki",
    folders: "Foldery",
    messages: "Wiadomości",
  },
  aiStream: aiStreamTranslations,
  folders: foldersTranslations,
  threads: threadsTranslations,
};
