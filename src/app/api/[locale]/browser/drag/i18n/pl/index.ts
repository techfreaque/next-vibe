/**
 * Drag Tool translations (Polish)
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Przeciągnij element",
  description: "Przeciągnij element na inny element",

  form: {
    label: "Przeciągnij element",
    description: "Przeciągnij jeden element na inny element",
    fields: {
      from_uid: {
        label: "UID elementu źródłowego",
        description: "UID elementu do przeciągnięcia",
        placeholder: "Wprowadź UID elementu źródłowego",
      },
      to_uid: {
        label: "UID elementu docelowego",
        description: "UID elementu docelowego",
        placeholder: "Wprowadź UID elementu docelowego",
      },
    },
  },

  response: {
    success: "Operacja przeciągnięcia pomyślna",
    result: "Wynik operacji przeciągnięcia",
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
      description: "Wystąpił błąd sieci podczas operacji przeciągania",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do wykonywania operacji przeciągania",
    },
    forbidden: {
      title: "Zabronione",
      description: "Operacja przeciągania jest zabroniona",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Żądany element nie został znaleziony",
    },
    serverError: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera podczas operacji przeciągania",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas operacji przeciągania",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które mogą zostać utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas operacji przeciągania",
    },
  },

  success: {
    title: "Operacja przeciągania pomyślna",
    description: "Element został pomyślnie przeciągnięty",
  },
};
