import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/imapErrors/folders/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    not_found: {
      title: "Folder nie znaleziony",
      description: "Żądany folder nie mógł zostać znaleziony.",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił błąd podczas pobierania folderów.",
    },
  },
};
