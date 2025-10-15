import { translations as aiStreamTranslations } from "../../ai-stream/i18n/de";
import { translations as foldersTranslations } from "../../folders/i18n/de";
import { translations as threadsTranslations } from "../../threads/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    threads: "Threads",
    folders: "Ordner",
    messages: "Nachrichten",
  },
  aiStream: aiStreamTranslations,
  folders: foldersTranslations,
  threads: threadsTranslations,
};
