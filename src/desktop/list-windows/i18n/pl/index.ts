import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Lista okien",
  description: "Lista wszystkich otwartych okien na pulpicie",
  form: {
    label: "Lista okien",
    description:
      "Pobierz listę wszystkich otwartych okien z ID, tytułami i pozycjami",
    fields: {},
  },
  response: {
    success: "Lista okien pobrana pomyślnie",
    windows: "Lista otwartych okien",
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
      description: "Wystąpił błąd sieci podczas listowania okien",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do listowania okien",
    },
    forbidden: {
      title: "Zabronione",
      description: "Listowanie okien jest zabronione",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Nie znaleziono żadnych okien",
    },
    serverError: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera podczas listowania okien",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas listowania okien",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które mogą zostać utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas listowania okien",
    },
    notImplemented: {
      title: "Nie zaimplementowano",
      description: "Ta funkcja nie jest dostępna w Twoim systemie operacyjnym",
    },
  },
  success: {
    title: "Okna wylistowane",
    description: "Lista okien została pobrana pomyślnie",
  },
  category: "Desktop",
  tags: {
    desktopAutomation: "Automatyzacja pulpitu",
    windowManagement: "Zarządzanie oknami",
  },
};
