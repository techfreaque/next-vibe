import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  success: {
    created: "Sesja portalu klienta utworzona pomyślnie",
  },
  post: {
    title: "Tytuł",
    description: "Opis endpointu",
    form: {
      title: "Konfiguracja portalu",
      description: "Skonfiguruj parametry portalu klienta",
    },
    returnUrl: {
      label: "URL powrotu",
      description: "URL przekierowania po sesji portalu",
      placeholder: "https://example.com/dashboard",
    },
    response: {
      success: "Sesja portalu utworzona pomyślnie",
      message: "Wiadomość o statusie",
      customerPortalUrl: "URL portalu klienta",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
    },
    success: {
      title: "Sukces",
      description: "Operacja zakończona pomyślnie",
    },
  },
};
