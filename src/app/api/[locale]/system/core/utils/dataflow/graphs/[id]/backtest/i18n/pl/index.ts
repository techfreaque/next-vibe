import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  enums: {
    resolution: {
      "1m": "1 minuta",
      "3m": "3 minuty",
      "5m": "5 minut",
      "15m": "15 minut",
      "30m": "30 minut",
      "1h": "1 godzina",
      "4h": "4 godziny",
      "1d": "1 dzień",
      "1w": "1 tydzień",
      "1M": "1 miesiąc",
    },
  },
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Uruchom backtest",
    titleShort: "Backtest",
    description: "Uruchom backtest na historycznym zakresie (akcje symulowane)",
    fields: {
      id: { label: "ID grafu", description: "UUID grafu" },
      rangeFrom: { label: "Od", description: "Początek zakresu backtestu" },
      rangeTo: { label: "Do", description: "Koniec zakresu backtestu" },
      resolution: {
        label: "Rozdzielczość",
        description: "Ramy czasowe do ewaluacji",
      },
    },
    response: {
      runId: "ID uruchomienia",
      eligible: "Kwalifikujący się",
      ineligibleNodes: "Niekwalifikujące się węzły",
    },
    widget: {
      eligible: "Kwalifikujący się",
      notEligible: "Niekwalifikujący się",
      runLabel: "Uruchomienie:",
      ineligibleNodesLabel: "Niekwalifikujące się węzły:",
      ineligibleNodesHint:
        "These nodes cannot be backtested (missing persisted data, incompatible resolution, or script-only logic).",
    },
    success: {
      title: "Backtest zakończony",
      description: "Backtest uruchomiony pomyślnie",
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
        description: "Backtest nie powiódł się",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry",
      },
      notFound: { title: "Nie znaleziono", description: "Graf nie znaleziony" },
      conflict: { title: "Konflikt", description: "Konflikt zasobów" },
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
