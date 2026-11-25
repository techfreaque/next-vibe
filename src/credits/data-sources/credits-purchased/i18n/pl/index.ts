import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    kind: {
      paid: "Płatne (pakiety + subskrypcje)",
      packs: "Płatne pakiety",
      subscriptions: "Kredyty z subskrypcji",
      gifted: "Podarowane (admin)",
    },
  },
  post: {
    titleShort: "Wydane kredyty",
    title: "Wydane kredyty (płatne, podarowane)",
    description:
      "Kredyty dodane do portfeli w każdym przedziale, w kredytach (nie pieniądzach): płatne pakiety i kredyty z subskrypcji z prawdziwych płatności albo podarowane przez admina (testerzy, twórcy, rekompensaty).",
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
      kind: {
        label: "Rodzaj",
        description:
          "Co liczyć: płatne pakiety + subskrypcje, tylko pakiety, tylko subskrypcje albo podarowane przez admina",
      },
      result: {
        label: "Wydane kredyty",
        description: "Wyjściowa seria czasowa",
      },
      meta: { label: "Meta", description: "Metadane wykonania węzła" },
    },
    success: {
      title: "Zakupione kredyty obliczone",
      description: "Seria zakupionych kredytów zwrócona",
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
