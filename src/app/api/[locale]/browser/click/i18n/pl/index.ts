/**
 * Click Tool translations (Polish)
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Kliknij element",
  description: "Klika na podany element",

  form: {
    label: "Kliknij element",
    description: "Kliknij na określony element na stronie",
    fields: {
      uid: {
        label: "UID elementu",
        description: "UID elementu na stronie z migawki zawartości strony",
        placeholder: "Wprowadź UID elementu",
      },
      dblClick: {
        label: "Podwójne kliknięcie",
        description: "Ustaw na true dla podwójnych kliknięć. Domyślnie false",
      },
    },
  },

  response: {
    success: "Operacja kliknięcia pomyślna",
    result: "Wynik operacji kliknięcia",
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
      description: "Wystąpił błąd sieci podczas operacji kliknięcia",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do wykonywania operacji kliknięcia",
    },
    forbidden: {
      title: "Zabronione",
      description: "Operacja kliknięcia jest zabroniona",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Żądany element nie został znaleziony",
    },
    serverError: {
      title: "Błąd serwera",
      description:
        "Wystąpił wewnętrzny błąd serwera podczas operacji kliknięcia",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas operacji kliknięcia",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które mogą zostać utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas operacji kliknięcia",
    },
  },

  success: {
    title: "Operacja kliknięcia pomyślna",
    description: "Element został pomyślnie kliknięty",
  },
};
