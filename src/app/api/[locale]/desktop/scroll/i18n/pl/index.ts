import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Przewiń",
  description: "Przewiń w bieżącej lub podanej pozycji kursora",
  form: {
    label: "Przewiń",
    description: "Przewiń w górę, dół, lewo lub prawo w podanej pozycji",
    fields: {
      x: {
        label: "Współrzędna X",
        description:
          "Pozioma pozycja przewijania (bieżąca pozycja, jeśli pominięto)",
        placeholder: "100",
      },
      y: {
        label: "Współrzędna Y",
        description:
          "Pionowa pozycja przewijania (bieżąca pozycja, jeśli pominięto)",
        placeholder: "200",
      },
      direction: {
        label: "Kierunek",
        description: "Kierunek przewijania",
        placeholder: "dół",
        options: {
          up: "Góra",
          down: "Dół",
          left: "Lewo",
          right: "Prawo",
        },
      },
      amount: {
        label: "Ilość",
        description: "Liczba kroków przewijania (domyślnie: 3)",
        placeholder: "3",
      },
    },
  },
  response: {
    success: "Przewijanie wykonane pomyślnie",
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
      description: "Wystąpił błąd sieci podczas przewijania",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do przewijania na pulpicie",
    },
    forbidden: {
      title: "Zabronione",
      description: "Przewijanie na pulpicie jest zabronione",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Żądany zasób nie został znaleziony",
    },
    serverError: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera podczas przewijania",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas przewijania",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które mogą zostać utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas przewijania",
    },
    notImplemented: {
      title: "Nie zaimplementowano",
      description: "Ta funkcja nie jest dostępna w Twoim systemie operacyjnym",
    },
  },
  success: {
    title: "Przewinięto",
    description: "Przewijanie zostało wykonane pomyślnie",
  },
  category: "Desktop",
  tags: {
    desktopAutomation: "Automatyzacja pulpitu",
    inputAutomation: "Automatyzacja wprowadzania",
  },
};
