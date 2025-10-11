import type { translations as enTranslations } from "../en";

/**
 * Template Item API translations for Polish
 */

export const translations: typeof enTranslations = {
  // Common category and tags
  category: "API Szablonów",
  tags: {
    template: "Szablon",
    get: "Pobierz",
    update: "Aktualizuj",
    delete: "Usuń",
  },

  // GET endpoint translations
  get: {
    title: "Pobierz Szablon",
    description: "Pobierz szablon według ID",
    form: {
      title: "Pobieranie Szablonu",
      description: "Podaj ID szablonu do pobrania",
    },
    id: {
      label: "ID Szablonu",
      description: "Unikalny identyfikator szablonu",
      placeholder: "Wprowadź ID szablonu",
    },
    response: {
      title: "Odpowiedź Szablonu",
      description: "Pobrane dane szablonu",
    },
    errors: {
      validation: {
        title: "Błąd Walidacji",
        description: "Podane ID szablonu jest nieprawidłowe",
      },
      notFound: {
        title: "Szablon Nie Znaleziony",
        description: "Nie znaleziono szablonu o podanym ID",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do dostępu do tego szablonu",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp do tego szablonu jest zabroniony",
      },
      server: {
        title: "Błąd Serwera",
        description: "Wystąpił błąd podczas pobierania szablonu",
      },
      network: {
        title: "Błąd Sieci",
        description: "Wystąpił błąd sieci podczas pobierania szablonu",
      },
      unknown: {
        title: "Nieznany Błąd",
        description: "Wystąpił nieznany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane Zmiany",
        description: "Istnieją niezapisane zmiany, które zostaną utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas pobierania szablonu",
      },
    },
    success: {
      title: "Szablon Pobrany",
      description: "Szablon został pomyślnie pobrany",
    },
  },

  // PUT endpoint translations
  put: {
    title: "Aktualizuj Szablon",
    description: "Aktualizuj istniejący szablon",
    form: {
      title: "Aktualizacja Szablonu",
      description: "Zmodyfikuj właściwości szablonu",
    },
    id: {
      label: "ID Szablonu",
      description: "Unikalny identyfikator szablonu do aktualizacji",
      placeholder: "Wprowadź ID szablonu",
    },
    name: {
      label: "Nazwa Szablonu",
      description: "Nazwa szablonu",
      placeholder: "Wprowadź nazwę szablonu",
    },
    templateDescription: {
      label: "Opis",
      help: "Opcjonalny opis szablonu",
      placeholder: "Wprowadź opis szablonu",
    },
    content: {
      label: "Zawartość Szablonu",
      description: "Zawartość/treść szablonu",
      placeholder: "Wprowadź zawartość szablonu",
    },
    status: {
      label: "Status",
      description: "Aktualny status szablonu",
      placeholder: "Wybierz status szablonu",
    },
    tags: {
      label: "Tagi",
      description: "Tagi do kategoryzacji szablonu",
      placeholder: "Wprowadź tagi szablonu",
    },
    response: {
      title: "Odpowiedź Aktualizacji",
      description: "Zaktualizowane dane szablonu",
    },
    errors: {
      validation: {
        title: "Błąd Walidacji",
        description: "Podane dane szablonu są nieprawidłowe",
      },
      network: {
        title: "Błąd Sieci",
        description: "Wystąpił błąd sieci podczas aktualizacji szablonu",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do aktualizacji tego szablonu",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp do aktualizacji tego szablonu jest zabroniony",
      },
      notFound: {
        title: "Szablon Nie Znaleziony",
        description: "Nie znaleziono szablonu o podanym ID do aktualizacji",
      },
      server: {
        title: "Błąd Serwera",
        description: "Wystąpił błąd podczas aktualizacji szablonu",
      },
      unknown: {
        title: "Nieznany Błąd",
        description: "Wystąpił nieznany błąd podczas aktualizacji",
      },
      unsavedChanges: {
        title: "Niezapisane Zmiany",
        description: "Istnieją niezapisane zmiany, które zostaną utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas aktualizacji szablonu",
      },
    },
    success: {
      title: "Szablon Zaktualizowany",
      description: "Szablon został pomyślnie zaktualizowany",
    },
  },

  // DELETE endpoint translations
  delete: {
    title: "Usuń Szablon",
    description: "Usuń istniejący szablon",
    form: {
      title: "Usuwanie Szablonu",
      description: "Potwierdź usunięcie szablonu",
    },
    id: {
      label: "ID Szablonu",
      description: "Unikalny identyfikator szablonu do usunięcia",
      placeholder: "Wprowadź ID szablonu",
    },
    response: {
      title: "Odpowiedź Usunięcia",
      description: "Potwierdzenie usunięcia szablonu",
    },
    errors: {
      validation: {
        title: "Błąd Walidacji",
        description: "Podane ID szablonu jest nieprawidłowe",
      },
      network: {
        title: "Błąd Sieci",
        description: "Wystąpił błąd sieci podczas usuwania szablonu",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do usunięcia tego szablonu",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp do usunięcia tego szablonu jest zabroniony",
      },
      notFound: {
        title: "Szablon Nie Znaleziony",
        description: "Nie znaleziono szablonu o podanym ID do usunięcia",
      },
      server: {
        title: "Błąd Serwera",
        description: "Wystąpił błąd podczas usuwania szablonu",
      },
      unknown: {
        title: "Nieznany Błąd",
        description: "Wystąpił nieznany błąd podczas usuwania",
      },
      unsavedChanges: {
        title: "Niezapisane Zmiany",
        description: "Istnieją niezapisane zmiany, które zostaną utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas usuwania szablonu",
      },
    },
    success: {
      title: "Szablon Usunięty",
      description: "Szablon został pomyślnie usunięty",
    },
  },
};
