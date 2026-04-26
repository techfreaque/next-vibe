import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Lista monitorów",
  description:
    "Lista wszystkich podłączonych monitorów z rozdzielczością, pozycją i indeksem",
  form: {
    label: "Lista monitorów",
    description:
      "Wylicz wszystkie podłączone wyświetlacze. Używaj nazw monitorów do docelowych zrzutów ekranu.",
    fields: {},
  },
  response: {
    success: "Monitory zostały pomyślnie wylistowane",
    monitors: "Tablica podłączonych monitorów",
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
      description: "Wystąpił błąd sieci podczas listowania monitorów",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do listowania monitorów",
    },
    forbidden: {
      title: "Zabronione",
      description: "Listowanie monitorów jest zabronione",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Żądany zasób nie został znaleziony",
    },
    serverError: {
      title: "Błąd serwera",
      description:
        "Wystąpił wewnętrzny błąd serwera podczas listowania monitorów",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas listowania monitorów",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które mogą zostać utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas listowania monitorów",
    },
    notImplemented: {
      title: "Nie zaimplementowano",
      description:
        "Listowanie monitorów nie jest dostępne w Twoim systemie operacyjnym",
    },
  },
  success: {
    title: "Monitory wylistowane",
    description: "Wszystkie podłączone monitory zostały pomyślnie wylistowane",
  },
  category: "Desktop",
  tags: {
    desktopAutomation: "Automatyzacja pulpitu",
    captureAutomation: "Automatyzacja przechwytywania",
  },
};
