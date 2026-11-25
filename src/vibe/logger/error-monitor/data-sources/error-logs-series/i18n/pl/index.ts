import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    metric: {
      occurrences: "Wystąpienia",
      distinct: "Widziane klasy błędów",
      new: "Nowe klasy błędów",
      openBacklog: "Otwarte zaległości (teraz nierozwiązane)",
    },
    level: {
      all: "Błędy i ostrzeżenia",
      error: "Tylko błędy",
      warn: "Tylko ostrzeżenia",
    },
  },
  post: {
    title: "Seria logów błędów",
    titleShort: "Logi błędów",
    description:
      "Wolumen błędów w czasie. Wystąpienia i widziane klasy pochodzą z licznika dziennego (przedziały dzienne, historia od 22.11.2026). Nowe klasy liczą pierwsze wystąpienia. Otwarte zaległości to bieżąca liczba nierozwiązanych klas, zapisywana przy każdym uruchomieniu grafu.",
    fields: {
      resolution: {
        label: "Rozdzielczość",
        description:
          "Ramy czasowe obliczeń (wystąpienia i klasy najwyżej dziennie)",
      },
      range: {
        label: "Zakres",
        description: "Zakres czasu do zapytania",
      },
      lookback: {
        label: "Cofnięcie",
        description: "Dodatkowe słupki przed początkiem zakresu",
      },
      metric: {
        label: "Metryka",
        description:
          "Co liczyć: wystąpienia, widziane klasy błędów, nowe klasy lub otwarte zaległości",
      },
      level: {
        label: "Poziom",
        description: "Błędy, ostrzeżenia lub oba",
      },
      result: {
        label: "Liczba logów błędów",
        description: "Wyjściowy szereg czasowy",
      },
      meta: {
        label: "Meta",
        description: "Metadane wykonania węzła",
      },
    },
    success: {
      title: "Seria logów błędów obliczona",
      description: "Zwrócono serię logów błędów",
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
        description: "Zapytanie nie powiodło się",
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
