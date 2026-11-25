import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    vibeSense: "vibe-sense",
  },
  enums: {
    outcome: {
      started: "Rozpoczęte",
      paid: "Opłacone",
      abandoned: "Porzucone lub odrzucone",
    },
  },
  post: {
    title: "Checkouty",
    titleShort: "Checkouty",
    description:
      "Otwarte checkouty pakietów i nowych subskrypcji w okresie, według wyniku. Porzucony znaczy: sesja wygasła po 24 h lub płatność odrzucono. Bez odnowień i kont adminów.",
    fields: {
      resolution: {
        label: "Rozdzielczość",
        description: "Ramy czasowe obliczeń",
      },
      range: {
        label: "Zakres",
        description: "Zakres czasu do zapytania",
      },
      lookback: {
        label: "Cofnięcie",
        description: "Dodatkowe słupki przed początkiem zakresu",
      },
      result: {
        label: "Checkouty",
        description: "Wyjściowa seria czasowa",
      },
      meta: {
        label: "Meta",
        description: "Metadane wykonania węzła",
      },
      outcome: {
        label: "Wynik",
        description: "Rozpoczęte (wszystkie), opłacone lub porzucone/odrzucone",
      },
    },
    success: {
      title: "Obliczono checkouty",
      description: "Zwrócono serię checkoutów",
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
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt",
      },
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
