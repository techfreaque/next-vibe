import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: { who: { signedIn: "Zalogowani użytkownicy", guests: "Goście" } },
  post: {
    titleShort: "Użytkownicy AI",
    title: "Osoby korzystające z AI (zalogowani, goście)",
    description:
      "Unikalne osoby z co najmniej jednym obciążeniem kredytów w przedziale, łącznie z czatami incognito: zalogowane konta (bez adminów) albo urządzenia gości (bez botów). Liczba osób, nie kredytów.",
    fields: {
      resolution: {
        label: "Rozdzielczość",
        description: "Ramy czasowe obliczeń",
      },
      range: { label: "Zakres", description: "Zakres czasu do zapytania" },
      lookback: {
        label: "Cofnięcie",
        description: "Dodatkowe słupki przed początkiem zakresu",
      },
      who: {
        label: "Kto",
        description: "Zalogowane konta albo urządzenia gości",
      },
      result: {
        label: "Osoby",
        description: "Wyjściowa seria czasowa",
      },
      meta: { label: "Meta", description: "Metadane wykonania węzła" },
    },
    success: {
      title: "Seria obliczona",
      description: "Zwrócono szereg czasowy",
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
