import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "NOT",
    description:
      "Odwraca strumień sygnałów - aktywny staje się nieaktywny i odwrotnie",
    fields: {
      signal: {
        label: "Sygnał",
        description: "Wejściowy strumień sygnałów do odwrócenia",
      },
      result: {
        label: "Wynik",
        description: "Odwrócone wyjściowe zdarzenia sygnałów",
      },
    },
    success: {
      title: "NOT oceniony",
      description: "Odwrócone zdarzenia sygnałów zwrócone",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: {
        title: "Zabronione",
        description: "Wymagany dostęp administratora",
      },
      server: {
        title: "Błąd serwera",
        description: "Ocena NOT nie powiodła się",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      notFound: { title: "Nie znaleziono", description: "Nie znaleziono" },
      conflict: { title: "Konflikt", description: "Konflikt" },
      network: {
        title: "Błąd sieci",
        description: "Żądanie sieciowe nie powiodło się",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Najpierw zapisz zmiany",
      },
    },
  },
};
