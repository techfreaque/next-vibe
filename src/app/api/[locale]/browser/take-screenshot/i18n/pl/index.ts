import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Zrób zrzut ekranu",
  description: "Zrób zrzut ekranu strony lub określonego elementu",
  form: {
    label: "Zrób zrzut ekranu",
    description: "Przechwyć zrzut ekranu strony przeglądarki lub elementu",
    fields: {
      uid: {
        label: "UID elementu",
        description: "UID elementu do zrzutu ekranu (pomiń, aby zrobić zrzut ekranu całej strony)",
        placeholder: "Wprowadź UID elementu",
      },
      fullPage: {
        label: "Cała strona",
        description:
          "Jeśli ustawiono na true, zrobi zrzut ekranu całej strony zamiast aktualnie widocznego obszaru (niekompatybilne z uid)",
        placeholder: "false",
      },
      format: {
        label: "Format",
        description: "Typ formatu do zapisania zrzutu ekranu (domyślnie: png)",
        placeholder: "png",
        options: {
          png: "PNG",
          jpeg: "JPEG",
          webp: "WebP",
        },
      },
      quality: {
        label: "Jakość",
        description:
          "Jakość kompresji dla formatów JPEG i WebP (0-100). Wyższe wartości oznaczają lepszą jakość, ale większe rozmiary plików. Ignorowane dla formatu PNG.",
        placeholder: "80",
      },
      filePath: {
        label: "Ścieżka pliku",
        description:
          "Ścieżka bezwzględna lub względna do bieżącego katalogu roboczego, aby zapisać zrzut ekranu zamiast dołączać go do odpowiedzi",
        placeholder: "/ścieżka/do/zrzutu-ekranu.png",
      },
    },
  },
  response: {
    success: "Zrzut ekranu przechwycony pomyślnie",
    result: "Wynik przechwytywania zrzutu ekranu",
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
      description: "Wystąpił błąd sieci podczas przechwytywania zrzutu ekranu",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do przechwytywania zrzutów ekranu",
    },
    forbidden: {
      title: "Zabronione",
      description: "Przechwytywanie zrzutów ekranu jest zabronione",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Żądany zasób nie został znaleziony",
    },
    serverError: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera podczas przechwytywania zrzutu ekranu",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas przechwytywania zrzutu ekranu",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które mogą zostać utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas przechwytywania zrzutu ekranu",
    },
  },
  success: {
    title: "Zrzut ekranu przechwycony pomyślnie",
    description: "Zrzut ekranu został pomyślnie przechwycony",
  },
};
