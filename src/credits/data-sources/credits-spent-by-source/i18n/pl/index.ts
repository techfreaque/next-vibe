import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    source: {
      public: "Publiczne (goście)",
      usersFree: "Użytkownicy za darmo",
      paid: "Płatne",
      gifted: "Podarowane",
      internal: "Wewnętrzne (admini)",
      unattributed: "Nieprzypisane (historia)",
    },
  },
  post: {
    titleShort: "Zużycie wg źródła",
    title: "Wydane kredyty wg źródła",
    description:
      "Wydane kredyty podzielone według tego, kto je wydał i jakie kredyty za to zapłaciły: publiczne (goście), darmowe użytkowników, płatne, podarowane, wewnętrzne, nieprzypisane. Źródła sumują się do całego zużycia.",
    fields: {
      resolution: { label: "Rozdzielczość", description: "Przedział obliczeń" },
      range: { label: "Zakres", description: "Zakres czasu zapytania" },
      lookback: {
        label: "Wstecz",
        description: "Dodatkowe słupki przed początkiem zakresu",
      },
      source: {
        label: "Źródło",
        description:
          "Które kredyty liczyć: publiczni goście, darmowe kredyty zalogowanych, płatne (subskrypcja + pakiety), podarowane (przyznane przez admina), wewnętrzne (konta adminów) lub nieprzypisana historia",
      },
      result: {
        label: "Wydane kredyty",
        description: "Wyjściowy szereg czasowy",
      },
      meta: { label: "Meta", description: "Metadane wykonania węzła" },
    },
    success: {
      title: "Kredyty wg źródła obliczone",
      description: "Zwrócono szereg kredytów wg źródła",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane logowanie",
      },
      forbidden: {
        title: "Zabronione",
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
        title: "Walidacja nieudana",
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
