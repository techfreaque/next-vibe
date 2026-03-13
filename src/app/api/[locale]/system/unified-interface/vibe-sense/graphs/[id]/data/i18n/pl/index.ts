import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  get: {
    title: "Szczegoly grafu",
    description: "Wyswietl wykres grafu z wskaznikami i sygnalami",
    fields: {
      id: { label: "ID grafu", description: "UUID grafu" },
      resolution: {
        label: "Rozdzielczosc",
        description: "Rozmiar kubeka dla szeregów czasowych",
      },
      cursor: {
        label: "Kursor",
        description: "Najstarszy zaladowany znacznik czasu do paginacji",
      },
    },
    response: {
      graph: {
        id: "ID",
        slug: "Slug",
        name: "Nazwa",
        description: "Opis",
        ownerType: "Typ wlasciciela",
        isActive: "Aktywny",
        createdAt: "Utworzono",
        config: "Konfiguracja",
      },
      series: {
        nodeId: "ID wezla",
        timestamp: "Znacznik czasu",
        value: "Wartosc",
      },
      signals: {
        nodeId: "ID wezla",
        timestamp: "Znacznik czasu",
        fired: "Wystrzelony",
      },
    },
    widget: {
      loading: "Ladowanie grafu...",
      back: "Wstecz",
      active: "Aktywny",
      inactive: "Nieaktywny",
      nodes: "wezly",
      trigger: "Uruchom",
      backtest: "Backtest",
      edit: "Edytuj",
      archive: "Archiwizuj",
      promote: "Promote",
      signal: "Sygnal",
      noData: "Brak danych w tym zakresie",
      loadingEarlierData: "Ladowanie starszych danych\u2026",
    },
    success: {
      title: "Graf zaladowany",
      description: "Graf pomyslnie pobrany",
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: { title: "Zabroniony", description: "Odmowa dostepu" },
      server: {
        title: "Blad serwera",
        description: "Nie udalo sie zaladowac grafu",
      },
      unknown: {
        title: "Nieznany blad",
        description: "Wystapil nieoczekiwany blad",
      },
      validation: {
        title: "Walidacja nie powiodla sie",
        description: "Nieprawidlowe ID",
      },
      notFound: { title: "Nie znaleziono", description: "Graf nie znaleziony" },
      conflict: { title: "Konflikt", description: "Konflikt zasobow" },
      network: {
        title: "Blad sieci",
        description: "Zadanie sieciowe nie powiodlo sie",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Najpierw zapisz zmiany",
      },
    },
  },
};
