import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    vibeSense: "vibe-sense",
  },
  post: {
    title: "Nieudane odnowienia",
    titleShort: "Nieudane odnow.",
    description:
      "Subskrypcje z nieudaną płatnością za odnowienie w okresie (jedna na subskrypcję). Bez niedokończonych checkoutów i kont adminów.",
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
        label: "Nieudane odnowienia",
        description: "Wyjściowa seria czasowa",
      },
      meta: {
        label: "Meta",
        description: "Metadane wykonania węzła",
      },
    },
    success: {
      title: "Obliczono nieudane odnowienia",
      description: "Zwrócono serię nieudanych odnowień",
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
