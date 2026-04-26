import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Kliknij",
  description:
    "Przesuń mysz do bezwzględnych współrzędnych i wykonaj kliknięcie",
  form: {
    label: "Kliknij",
    description: "Przesuń mysz do podanych współrzędnych i kliknij",
    fields: {
      x: {
        label: "Współrzędna X",
        description:
          "Pozioma współrzędna ekranu w pikselach (od lewej krawędzi)",
        placeholder: "100",
      },
      y: {
        label: "Współrzędna Y",
        description:
          "Pionowa współrzędna ekranu w pikselach (od górnej krawędzi)",
        placeholder: "200",
      },
      button: {
        label: "Przycisk myszy",
        description: "Przycisk myszy do kliknięcia (lewy, środkowy, prawy)",
        placeholder: "lewy",
        options: {
          left: "Lewy",
          middle: "Środkowy",
          right: "Prawy",
        },
      },
      doubleClick: {
        label: "Podwójne kliknięcie",
        description: "Wykonaj podwójne kliknięcie zamiast pojedynczego",
        placeholder: "false",
      },
    },
  },
  response: {
    success: "Kliknięcie wykonane pomyślnie",
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
      description: "Wystąpił błąd sieci podczas wykonywania kliknięcia",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do wykonywania kliknięć na pulpicie",
    },
    forbidden: {
      title: "Zabronione",
      description: "Wykonywanie kliknięć na pulpicie jest zabronione",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Żądany zasób nie został znaleziony",
    },
    serverError: {
      title: "Błąd serwera",
      description:
        "Wystąpił wewnętrzny błąd serwera podczas wykonywania kliknięcia",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas wykonywania kliknięcia",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które mogą zostać utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas wykonywania kliknięcia",
    },
    notImplemented: {
      title: "Nie zaimplementowano",
      description: "Ta funkcja nie jest dostępna w Twoim systemie operacyjnym",
    },
  },
  success: {
    title: "Kliknięcie wykonane",
    description: "Kliknięcie myszą zostało wykonane pomyślnie",
  },
  category: "Desktop",
  tags: {
    desktopAutomation: "Automatyzacja pulpitu",
    inputAutomation: "Automatyzacja wprowadzania",
  },
};
