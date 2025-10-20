import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  help: "Pomoc",
  logout: "Wyloguj",
  enableLightMode: "Włącz tryb jasny",
  enableDarkMode: "Włącz tryb ciemny",
  notifications: "Powiadomienia",
  company: "Firma",
  about: {
    title: "O nas",
    description: "Dowiedz się więcej o naszej firmie",
  },
  careers: {
    title: "Kariera",
    description: "Dołącz do naszego zespołu",
  },
  user: {
    dashboard: "Panel",
    completeOnboarding: "Ukończ wdrożenie",
    login: "Zaloguj się",
    signup: "Zarejestruj się",
  },
  home: "Strona główna",
  pricing: "Cennik",
  services: {
    title: "Usługi",
    features: {
      title: "Funkcje",
      description: "Poznaj nasze potężne funkcje",
    },
    process: {
      title: "Nasz proces",
      description: "Jak z Tobą pracujemy",
    },
    premiumContent: {
      title: "Treści premium",
      description: "Dostęp do ekskluzywnych treści",
    },
    contact: {
      title: "Kontakt",
      description: "Skontaktuj się z naszym zespołem",
    },
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
