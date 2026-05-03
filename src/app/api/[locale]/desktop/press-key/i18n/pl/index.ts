import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Naciśnij klawisz",
  dynamicTitle: "Klawisz: {{key}}",
  description: "Naciśnij klawisz lub kombinację klawiszy za pomocą xdotool",
  form: {
    label: "Naciśnij klawisz",
    description:
      "Wyślij zdarzenie naciśnięcia klawisza do pulpitu (składnia xdotool)",
    fields: {
      key: {
        label: "Klawisz",
        description:
          "Nazwa klawisza lub kombinacja w składni xdotool (np. Return, ctrl+c, alt+F4)",
        placeholder: "Return",
      },
      repeat: {
        label: "Liczba powtórzeń",
        description: "Liczba naciśnięć klawisza (domyślnie: 1)",
        placeholder: "1",
      },
      delay: {
        label: "Opóźnienie (ms)",
        description:
          "Opóźnienie między kolejnymi naciśnięciami w milisekundach (domyślnie: 0)",
        placeholder: "0",
      },
      windowId: {
        label: "ID okna",
        description: "Skoncentruj to okno przed naciśnięciem klawisza",
        placeholder: "{uuid}",
      },
      windowTitle: {
        label: "Tytuł okna",
        description:
          "Skoncentruj okno z tym tytułem przed naciśnięciem klawisza",
        placeholder: "Kate",
      },
    },
  },
  response: {
    success: "Klawisz naciśnięty pomyślnie",
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
      description: "Wystąpił błąd sieci podczas naciskania klawisza",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do naciskania klawiszy na pulpicie",
    },
    forbidden: {
      title: "Zabronione",
      description: "Naciskanie klawiszy na pulpicie jest zabronione",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Żądany zasób nie został znaleziony",
    },
    serverError: {
      title: "Błąd serwera",
      description:
        "Wystąpił wewnętrzny błąd serwera podczas naciskania klawisza",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas naciskania klawisza",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które mogą zostać utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas naciskania klawisza",
    },
    notImplemented: {
      title: "Nie zaimplementowano",
      description: "Ta funkcja nie jest dostępna w Twoim systemie operacyjnym",
    },
  },
  success: {
    title: "Klawisz naciśnięty",
    description: "Klawisz został pomyślnie naciśnięty",
  },
  category: "Desktop",
  tags: {
    desktopAutomation: "Automatyzacja pulpitu",
    inputAutomation: "Automatyzacja wprowadzania",
  },
};
