import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Role użytkowników",
    description: "Endpoint ról użytkowników",
    form: {
      title: "Konfiguracja ról użytkowników",
      description: "Skonfiguruj parametry ról użytkowników",
    },
    response: {
      title: "Odpowiedź",
      description: "Dane odpowiedzi ról użytkowników",
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
      database_connection_failed: {
        title: "Błąd połączenia z bazą danych",
        description: "Nie udało się połączyć z bazą danych",
      },
    },
    success: {
      title: "Sukces",
      description: "Operacja zakończona pomyślnie",
    },
  },
  enums: {
    userRole: {
      public: "Publiczny",
      customer: "Klient",
      partnerAdmin: "Administrator partnera",
      partnerEmployee: "Pracownik partnera",
      admin: "Administrator",
      cliOnly: "Tylko CLI",
      cliWeb: "CLI Web",
      webOnly: "Tylko Web",
    },
  },
};
