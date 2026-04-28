import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Przenieś okno na monitor",
  description: "Przenieś okno na wybrany monitor",
  form: {
    label: "Przenieś okno na monitor",
    description: "Przenieś okno przez ID, PID lub tytuł na docelowy monitor",
    fields: {
      windowId: {
        label: "ID okna",
        description:
          "Wewnętrzny UUID okna KWin (z list-windows). Ma pierwszeństwo przed PID i tytułem.",
        placeholder: "{uuid}",
      },
      pid: {
        label: "ID procesu",
        description: "Przenieś okno należące do tego procesu",
        placeholder: "12345",
      },
      title: {
        label: "Tytuł okna",
        description:
          "Przenieś okno, którego tytuł zawiera ten ciąg (bez rozróżniania wielkości liter)",
        placeholder: "Firefox",
      },
      monitorName: {
        label: "Nazwa monitora",
        description:
          "Nazwa docelowego monitora (np. DP-1, HDMI-A-1). Użyj list-monitors, aby zobaczyć dostępne.",
        placeholder: "DP-1",
      },
      monitorIndex: {
        label: "Indeks monitora",
        description:
          "Indeks docelowego monitora (od 0). Preferuj nazwę monitora.",
        placeholder: "0",
      },
    },
  },
  response: {
    success: "Czy przeniesienie się powiodło",
    movedTo: "Monitor, na który przeniesiono okno",
    windowTitle: "Tytuł przeniesionego okna",
    error: "Komunikat błędu w razie niepowodzenia",
    executionId: "Unikalny identyfikator wykonania",
  },
  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Podaj co najmniej jeden identyfikator okna i cel monitora",
    },
    network: {
      title: "Błąd sieci",
      description: "Wystąpił błąd sieciowy podczas przenoszenia okna",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Nie masz uprawnień do przenoszenia okien",
    },
    forbidden: {
      title: "Zabronione",
      description: "Przenoszenie okien jest zabronione",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Nie znaleziono podanego okna lub monitora",
    },
    serverError: {
      title: "Błąd serwera",
      description: "Wewnętrzny błąd serwera podczas przenoszenia okna",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Nieznany błąd podczas przenoszenia okna",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które mogą zostać utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas przenoszenia okna",
    },
  },
  success: {
    title: "Okno przeniesione",
    description: "Okno zostało pomyślnie przeniesione na docelowy monitor",
  },
  category: "Desktop",
  tags: {
    desktopAutomation: "Automatyzacja pulpitu",
    windowManagement: "Zarządzanie oknami",
  },
};
