import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "studio",
  post: {
    title: "Studio Bazy Danych",
    description:
      "Otwórz studio bazy danych do wizualnego zarządzania bazą danych",
    form: {
      title: "Konfiguracja Studio",
      description: "Skonfiguruj parametry studio bazy danych",
    },
    response: {
      title: "Odpowiedź Studio",
      description: "Wyniki uruchomienia studio bazy danych",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja do studio bazy danych",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry studio",
      },
      server: {
        title: "Błąd serwera",
        description: "Wewnętrzny błąd serwera podczas uruchamiania studio",
      },
      internal: {
        title: "Błąd wewnętrzny",
        description: "Uruchomienie studio bazy danych nie powiodło się",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas uruchamiania studio",
      },
      network: {
        title: "Błąd sieci",
        description: "Błąd sieci podczas uruchamiania studio",
      },
      forbidden: {
        title: "Zabronione",
        description: "Niewystarczające uprawnienia do studio bazy danych",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasoby studio nie zostały znalezione",
      },
      conflict: {
        title: "Konflikt",
        description: "Wykryto konflikt portu studio",
      },
    },
    success: {
      title: "Studio uruchomione",
      description: "Studio bazy danych uruchomione pomyślnie",
    },
  },
  fields: {
    port: {
      title: "Port",
      description: "Numer portu dla studio bazy danych (1024-65535)",
    },
    openBrowser: {
      title: "Otwórz przeglądarkę",
      description: "Automatycznie otwórz studio w przeglądarce",
    },
    success: {
      title: "Status sukcesu",
    },
    url: {
      title: "URL Studio",
    },
    portUsed: {
      title: "Rzeczywiście używany port",
    },
    output: {
      title: "Wyjście uruchomienia",
    },
    duration: {
      title: "Czas trwania uruchomienia",
    },
  },
};
