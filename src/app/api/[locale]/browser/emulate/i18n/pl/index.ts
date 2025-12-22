import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Emuluj",
  description: "Emuluj różne funkcje na wybranej stronie",
  form: {
    label: "Emuluj urządzenie",
    description: "Emuluj warunki sieciowe i dławienie CPU",
    fields: {
      networkConditions: {
        label: "Warunki sieciowe",
        description: "Ogranicz sieć (ustaw na Brak emulacji aby wyłączyć)",
        placeholder: "Wybierz warunek sieciowy",
        options: {
          noEmulation: "Brak emulacji",
          offline: "Offline",
          slow3g: "Wolne 3G",
          fast3g: "Szybkie 3G",
          slow4g: "Wolne 4G",
          fast4g: "Szybkie 4G",
        },
      },
      cpuThrottlingRate: {
        label: "Współczynnik dławienia CPU",
        description: "Współczynnik spowolnienia CPU (1 aby wyłączyć, 1-20)",
        placeholder: "Wprowadź współczynnik dławienia",
      },
    },
  },
  response: {
    success: "Operacja emulacji pomyślna",
    result: "Wynik operacji emulacji",
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
      description: "Wystąpił błąd sieci podczas emulacji",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do emulacji funkcji urządzenia",
    },
    forbidden: {
      title: "Zabronione",
      description: "Operacja emulacji urządzenia jest zabroniona",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Żądany zasób nie został znaleziony",
    },
    serverError: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera podczas emulacji",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas emulacji",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które mogą zostać utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas emulacji",
    },
  },
  success: {
    title: "Emulacja pomyślna",
    description: "Funkcje urządzenia zostały pomyślnie zemulowane",
  },
};
