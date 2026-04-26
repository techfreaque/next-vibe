import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Pobierz drzewo dostępności",
  description:
    "Pobierz drzewo dostępności aktywnego okna lub określonej aplikacji",
  form: {
    label: "Pobierz drzewo dostępności",
    description: "Pobierz drzewo AT-SPI do inspekcji interfejsu pulpitu",
    fields: {
      appName: {
        label: "Nazwa aplikacji",
        description: "Nazwa procesu lub tytuł okna (pomiń dla aktywnego okna)",
        placeholder: "firefox",
      },
      maxDepth: {
        label: "Maks. głębokość",
        description:
          "Maksymalna głębokość drzewa do przeszukania (domyślnie: 5)",
        placeholder: "5",
      },
      includeActions: {
        label: "Uwzględnij akcje",
        description:
          "Pokaż dostępne akcje dla każdego węzła (kliknij, naciśnij, aktywuj...). Więcej szczegółów, większa odpowiedź.",
        placeholder: "false",
      },
    },
  },
  response: {
    success: "Drzewo dostępności pobrane pomyślnie",
    tree: "Drzewo dostępności jako tekst strukturalny",
    nodeCount: "Łączna liczba przeszukanych węzłów",
    truncated:
      "Czy zapytanie przekroczyło limit czasu i wynik może być niekompletny",
    error: "Komunikat błędu",
    executionId: "ID wykonania do śledzenia",
  },
  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Sprawdź wprowadzone dane i spróbuj ponownie",
    },
    network: {
      title: "Błąd sieci",
      description: "Wystąpił błąd sieci podczas pobierania drzewa dostępności",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do dostępu do drzewa dostępności",
    },
    forbidden: {
      title: "Zabronione",
      description: "Dostęp do drzewa dostępności jest zabroniony",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Docelowa aplikacja lub okno nie zostały znalezione",
    },
    serverError: {
      title: "Błąd serwera",
      description:
        "Wystąpił wewnętrzny błąd serwera podczas pobierania drzewa dostępności",
    },
    unknown: {
      title: "Nieznany błąd",
      description:
        "Wystąpił nieznany błąd podczas pobierania drzewa dostępności",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które mogą zostać utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas pobierania drzewa dostępności",
    },
    notImplemented: {
      title: "Nie zaimplementowano",
      description: "Ta funkcja nie jest dostępna w Twoim systemie operacyjnym",
    },
  },
  success: {
    title: "Drzewo dostępności pobrane",
    description: "Drzewo dostępności zostało pomyślnie pobrane",
  },
  category: "Desktop",
  tags: {
    desktopAutomation: "Automatyzacja pulpitu",
    accessibilityAutomation: "Automatyzacja dostępności",
  },
};
