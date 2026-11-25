import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    vibeSense: "vibe-sense",
  },
  enums: {
    kind: {
      all: "Wszystko",
      pack: "Pakiety kredytów",
      subscription: "Subskrypcje (nowe + odnowienia)",
      newSubscription: "Nowe subskrypcje",
      renewal: "Odnowienia",
    },
    provider: {
      all: "Wszyscy operatorzy",
      stripe: "Stripe",
      nowpayments: "NOWPayments",
    },
  },
  post: {
    title: "Przychód (USD)",
    titleShort: "Przychód",
    description:
      "Pobrane pieniądze w okresie, w przybliżeniu w USD (EUR i PLN po stałych kursach). Udane i później zwrócone płatności, bez kont adminów. Filtr według produktu i operatora płatności.",
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
        label: "Przychód (USD)",
        description: "Wyjściowa seria czasowa",
      },
      meta: {
        label: "Meta",
        description: "Metadane wykonania węzła",
      },
      kind: {
        label: "Za co",
        description:
          "Pakiety kredytów, subskrypcje (nowe + odnowienia) lub jedno z nich",
      },
      provider: {
        label: "Operator płatności",
        description: "Stripe, NOWPayments lub oba",
      },
    },
    success: {
      title: "Przychód obliczony",
      description: "Zwrócono serię przychodu",
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
