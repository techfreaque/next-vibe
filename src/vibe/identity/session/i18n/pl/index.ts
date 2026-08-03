import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    sessionErrorReason: {
      noTokenInCookies: "Brak tokenu w ciasteczkach",
    },
  },
  errors: {
    session_not_found: "Nie znaleziono sesji dla tokenu {{token}}",
    session_token_missing: "Brak tokenu sesji ({{reason}})",
    session_lookup_failed: "Nie udało się pobrać sesji {{token}}: {{error}}",
    current_session_failed: "Nie udało się odczytać bieżącej sesji: {{error}}",
    expired_sessions_delete_failed: "Usuwanie wygasłych sesji nie powiodło się",
    session_creation_failed:
      "Nie udało się utworzyć sesji dla użytkownika {{userId}}",
    session_creation_database_error:
      "Błąd bazy danych przy tworzeniu sesji dla użytkownika {{userId}}: {{error}}",
    user_sessions_delete_failed:
      "Nie udało się usunąć sesji {{sessionId}}: {{error}}",
    expired: "Sesja wygasła {{expiresAt}}",
  },
  post: {
    title: "Tytuł",
    description: "Opis endpointu",
    form: {
      title: "Konfiguracja",
      description: "Skonfiguruj parametry",
    },
    response: {
      title: "Odpowiedź",
      description: "Dane odpowiedzi",
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
    },
    success: {
      title: "Sukces",
      description: "Operacja zakończona pomyślnie",
    },
  },
};
