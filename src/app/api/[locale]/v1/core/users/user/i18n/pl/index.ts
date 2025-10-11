import { translations as idTranslations } from "../../[id]/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Użytkownicy",
  tag: "Zarządzanie użytkownikami",
  errors: {
    not_found: {
      title: "Użytkownik nie znaleziony",
      description: "Żądany użytkownik nie mógł zostać znaleziony",
    },
    internal: {
      title: "Błąd wewnętrzny",
      description:
        "Wystąpił błąd wewnętrzny podczas przetwarzania żądania użytkownika",
    },
  },
  id: idTranslations,
};
