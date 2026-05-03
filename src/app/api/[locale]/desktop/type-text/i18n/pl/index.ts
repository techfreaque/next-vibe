import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Wpisz tekst",
  dynamicTitle: "Wpisz: {{text}}",
  description: "Wpisz tekst do aktywnego okna za pomocą symulacji klawiatury",
  form: {
    label: "Wpisz tekst",
    description: "Wyślij naciśnięcia klawiszy do aktywnego okna",
    fields: {
      text: {
        label: "Tekst",
        description: "Tekst do wpisania w aktywnym oknie",
        placeholder: "Witaj, Świecie!",
      },
      delay: {
        label: "Opóźnienie (ms)",
        description:
          "Opóźnienie między naciśnięciami klawiszy w milisekundach (domyślnie: 12)",
        placeholder: "12",
      },
      windowId: {
        label: "ID okna",
        description:
          "Skoncentruj to okno przed wpisaniem tekstu (UUID z list-windows)",
        placeholder: "{uuid}",
      },
      windowTitle: {
        label: "Tytuł okna",
        description: "Skoncentruj okno zawierające ten tytuł przed wpisaniem",
        placeholder: "Kate",
      },
    },
  },
  response: {
    success: "Tekst wpisany pomyślnie",
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
      description: "Wystąpił błąd sieci podczas wpisywania tekstu",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do wpisywania tekstu na pulpicie",
    },
    forbidden: {
      title: "Zabronione",
      description: "Wpisywanie tekstu na pulpicie jest zabronione",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Żądany zasób nie został znaleziony",
    },
    serverError: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera podczas wpisywania tekstu",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas wpisywania tekstu",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które mogą zostać utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas wpisywania tekstu",
    },
    notImplemented: {
      title: "Nie zaimplementowano",
      description: "Ta funkcja nie jest dostępna w Twoim systemie operacyjnym",
    },
  },
  success: {
    title: "Tekst wpisany",
    description: "Tekst został pomyślnie wpisany",
  },
  category: "Desktop",
  tags: {
    desktopAutomation: "Automatyzacja pulpitu",
    inputAutomation: "Automatyzacja wprowadzania",
  },
};
