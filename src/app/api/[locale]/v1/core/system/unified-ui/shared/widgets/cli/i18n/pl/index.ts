import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Tytuł",
    description: "Opis endpointu",
    form: {
      title: "Konfiguracja",
      description: "Skonfiguruj parametry",
    },
    response: {
      title: "Odpowiedź",
      description: "Dane odpowiedzi",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
    },
    success: {
      title: "Sukces",
      description: "Operacja zakończona pomyślnie",
    },
  },
  helpHandler: {
    noDescription: "Brak opisu",
    flagDataDesc: "Dane JSON dla żądania",
    flagUserTypeDesc: "Typ użytkownika (ADMIN, CUSTOMER, PUBLIC)",
    flagLocaleDesc: "Ustawienia regionalne dla żądania",
    flagOutputDesc: "Format wyjściowy (json, pretty)",
    flagVerboseDesc: "Pokaż szczegółowe dane wyjściowe",
    flagDryRunDesc: "Pokaż, co zostałoby wykonane bez uruchamiania",
    usageLabel: "Użycie",
    availableCommandsLabel: "Dostępne polecenia",
    globalOptionsLabel: "Opcje globalne",
    examplesLabel: "Przykłady",
  },
};
