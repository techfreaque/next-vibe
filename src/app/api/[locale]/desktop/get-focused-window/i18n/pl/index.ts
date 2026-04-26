import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Pobierz aktywne okno",
  description: "Pobierz informacje o aktualnie aktywnym oknie",
  form: {
    label: "Pobierz aktywne okno",
    description: "Pobierz ID okna, tytuł i PID aktywnego okna",
    fields: {},
  },
  response: {
    success: "Informacje o aktywnym oknie pobrane pomyślnie",
    windowId: "ID okna X11 aktywnego okna",
    windowTitle: "Tekst tytułu aktywnego okna",
    pid: "ID procesu aktywnego okna",
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
      description: "Wystąpił błąd sieci podczas pobierania aktywnego okna",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do pobierania informacji o oknach",
    },
    forbidden: {
      title: "Zabronione",
      description: "Pobieranie informacji o oknach jest zabronione",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Nie znaleziono aktywnego okna",
    },
    serverError: {
      title: "Błąd serwera",
      description:
        "Wystąpił wewnętrzny błąd serwera podczas pobierania aktywnego okna",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas pobierania aktywnego okna",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które mogą zostać utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas pobierania aktywnego okna",
    },
    notImplemented: {
      title: "Nie zaimplementowano",
      description: "Ta funkcja nie jest dostępna w Twoim systemie operacyjnym",
    },
  },
  success: {
    title: "Aktywne okno pobrane",
    description: "Informacje o aktywnym oknie zostały pomyślnie pobrane",
  },
  category: "Desktop",
  tags: {
    desktopAutomation: "Automatyzacja pulpitu",
    windowManagement: "Zarządzanie oknami",
  },
};
