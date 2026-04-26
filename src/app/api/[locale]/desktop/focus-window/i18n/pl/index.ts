import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Aktywuj okno",
  description: "Przesuń okno na pierwszy plan i nadaj mu fokus",
  form: {
    label: "Aktywuj okno",
    description: "Aktywuj okno według jego ID, PID lub tytułu",
    fields: {
      windowId: {
        label: "ID okna",
        description:
          "ID okna X11 (szesnastkowe, np. 0x1234). Ma pierwszeństwo przed innymi opcjami.",
        placeholder: "0x1234",
      },
      pid: {
        label: "ID procesu",
        description: "Aktywuj okno należące do tego ID procesu",
        placeholder: "12345",
      },
      title: {
        label: "Tytuł okna",
        description:
          "Aktywuj okno, którego tytuł zawiera ten ciąg (z uwzględnieniem wielkości liter)",
        placeholder: "Firefox",
      },
    },
  },
  response: {
    success: "Okno aktywowane pomyślnie",
    error: "Komunikat błędu",
    executionId: "ID wykonania do śledzenia",
  },
  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Podaj co najmniej jedno z: ID okna, PID lub tytuł",
    },
    network: {
      title: "Błąd sieci",
      description: "Wystąpił błąd sieci podczas aktywowania okna",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do aktywowania okien",
    },
    forbidden: {
      title: "Zabronione",
      description: "Aktywowanie okien jest zabronione",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Wskazane okno nie zostało znalezione",
    },
    serverError: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera podczas aktywowania okna",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas aktywowania okna",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które mogą zostać utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas aktywowania okna",
    },
    notImplemented: {
      title: "Nie zaimplementowano",
      description: "Ta funkcja nie jest dostępna w Twoim systemie operacyjnym",
    },
  },
  success: {
    title: "Okno aktywowane",
    description: "Okno zostało pomyślnie przeniesione na pierwszy plan",
  },
  category: "Desktop",
  tags: {
    desktopAutomation: "Automatyzacja pulpitu",
    windowManagement: "Zarządzanie oknami",
  },
};
