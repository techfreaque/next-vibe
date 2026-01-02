import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    find_failed: "Nie udało się znaleźć ról użytkownika",
    batch_find_failed: "Nie udało się znaleźć ról użytkowników wsadowo",
    not_found: "Rola użytkownika nie znaleziona",
    lookup_failed: "Nie udało się pobrać roli użytkownika",
    add_failed: "Nie udało się dodać roli do użytkownika",
    no_data_returned: "Brak danych zwróconych z bazy danych",
    remove_failed: "Nie udało się usunąć roli od użytkownika",
    check_failed: "Sprawdzenie czy użytkownik ma rolę nie powiodło się",
    delete_failed: "Nie udało się usunąć ról użytkownika",
    endpoint_not_created: "Endpoint ról użytkownika nie został jeszcze utworzony",
  },
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
      cliOff: "CLI Wyłączone",
      cliAuthBypass: "Obejście autoryzacji CLI",
      aiToolOff: "Narzędzie AI Wyłączone",
      webOff: "Web Wyłączone",
      mcpOff: "MCP Wyłączone",
      productionOff: "Produkcja Wyłączona",
    },
  },
};
