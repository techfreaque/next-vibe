import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Ścieżka JSON",
    description:
      "Ścieżka JSON - wyodrębnia wartość przez notację kropkową (przestarzałe, zwraca pustą tablicę)",
    fields: {
      source: { label: "Źródło", description: "Wejściowa seria czasowa" },
      path: {
        label: "Ścieżka",
        description: "Ścieżka w notacji kropkowej (nie jest już obsługiwane)",
      },
      resolution: {
        label: "Rozdzielczość",
        description: "Ramy czasowe obliczeń",
      },
      range: { label: "Zakres", description: "Zakres czasu do obliczenia" },
      lookback: {
        label: "Cofnięcie",
        description: "Dodatkowe słupki przed początkiem zakresu do rozgrzewki",
      },
      result: { label: "Wynik", description: "Wyjściowa seria czasowa" },
      meta: { label: "Meta", description: "Metadane wykonania węzła" },
    },
    success: {
      title: "Ścieżka JSON wykonana",
      description: "Seria wynikowa zwrócona",
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Wymagany dostęp administratora",
      },
      server: {
        title: "Błąd serwera",
        description: "Obliczenie ścieżki JSON nie powiodło się",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      validation: {
        title: "Walidacja nie powiodła się",
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
