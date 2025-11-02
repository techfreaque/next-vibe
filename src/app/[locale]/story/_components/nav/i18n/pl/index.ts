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
  features: "Funkcje",
  forum: "Forum",
  contact: "Kontakt",
  getStarted: "Zacznij za darmo",
  signIn: "Zaloguj się",
  goToApp: "Otwórz aplikację",
  services: {
    title: "Platforma",
    features: {
      title: "Funkcje",
      description: "Możliwości czatu AI + forum",
    },
    process: {
      title: "Jak to działa",
      description: "Zacznij w 4 prostych krokach",
    },
    aiModels: {
      title: "Modele AI",
      description: "40+ niecenzurowanych modeli AI",
    },
    folders: {
      title: "Poziomy prywatności",
      description: "Prywatne, Incognito, Współdzielone, Publiczne",
    },
    personas: {
      title: "Persony AI",
      description: "Własne i społecznościowe persony",
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
