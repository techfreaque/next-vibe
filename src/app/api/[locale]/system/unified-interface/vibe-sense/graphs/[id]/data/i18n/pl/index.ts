import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  get: {
    title: "Szczegoly grafu",
    description: "Wyswietl wykres grafu z wskaznikami i sygnalami",
    fields: { id: { label: "ID grafu", description: "UUID grafu" } },
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
      notFound: {
        title: "Nie znaleziono",
        description: "Graf nie znaleziony",
      },
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
  post: {
    title: "Dane grafu",
    description: "Pobierz dane szeregow czasowych grafu (wykonanie na zadanie)",
    fields: {
      id: { label: "ID grafu", description: "UUID grafu" },
      rangeFrom: { label: "Od", description: "Poczatek zakresu (data ISO)" },
      rangeTo: { label: "Do", description: "Koniec zakresu (data ISO)" },
    },
    response: {
      series: {
        nodeId: "ID wezla",
        points: {
          timestamp: "Znacznik czasu",
          value: "Wartosc",
        },
      },
      signals: {
        nodeId: "ID wezla",
        events: {
          timestamp: "Znacznik czasu",
          fired: "Wystrzelony",
        },
      },
    },
    widget: {
      loadButton: "Zaladuj dane",
      loadingButton: "Ladowanie...",
      noData: "Brak danych w tym zakresie",
    },
    success: {
      title: "Dane zaladowane",
      description: "Dane grafu pobrane pomyslnie",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: { title: "Zabronione", description: "Odmowa dostepu" },
      server: {
        title: "Blad serwera",
        description: "Nie udalo sie pobrac danych",
      },
      unknown: {
        title: "Nieznany blad",
        description: "Wystapil nieoczekiwany blad",
      },
      validation: {
        title: "Blad walidacji",
        description: "Nieprawidlowe parametry",
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
