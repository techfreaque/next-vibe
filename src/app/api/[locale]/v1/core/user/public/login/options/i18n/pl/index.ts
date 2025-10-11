import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Opcje Logowania",
  description: "Opcje konfiguracji logowania",
  tag: "opcje-logowania",
  container: {
    title: "Konfiguracja Logowania",
    description: "Skonfiguruj ustawienia i opcje logowania",
  },
  fields: {
    email: {
      label: "Adres E-mail",
      description: "Wprowadź swój adres e-mail",
      placeholder: "twoj@email.com",
    },
    allowPasswordAuth: {
      label: "Zezwól na Uwierzytelnienie Hasłem",
      description: "Włącz uwierzytelnienie oparte na haśle",
    },
    allowSocialAuth: {
      label: "Zezwól na Uwierzytelnienie Społecznościowe",
      description: "Włącz uwierzytelnienie przez dostawców społecznościowych",
    },
    maxAttempts: {
      label: "Maksymalna Liczba Prób Logowania",
      description: "Maksymalna liczba dozwolonych prób logowania",
    },
    requireTwoFactor: {
      label: "Wymagaj Uwierzytelnienie Dwuskładnikowe",
      description: "Wymagaj 2FA do logowania użytkownika",
    },
    socialProviders: {
      label: "Dostawcy Społecznościowi",
      description: "Dostępni dostawcy uwierzytelnienia społecznościowego",
    },
    socialProvider: {
      title: "Dostawca Społecznościowy",
      description: "Konfiguracja dostawcy uwierzytelnienia społecznościowego",
      enabled: {
        label: "Włączony",
        description: "Czy ten dostawca jest włączony",
      },
      name: {
        label: "Nazwa Dostawcy",
        description: "Nazwa dostawcy społecznościowego",
      },
      providers: {
        label: "Opcje Dostawcy",
        description: "Dostępne opcje dostawcy społecznościowego",
      },
    },
  },
  response: {
    title: "Odpowiedź Opcji Logowania",
    description: "Dostępne opcje konfiguracji logowania",
  },
  errors: {
    validation: {
      title: "Błąd Walidacji",
      description: "Nieprawidłowe parametry żądania",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Wymagane uwierzytelnienie",
    },
    server: {
      title: "Błąd Serwera",
      description: "Wystąpił wewnętrzny błąd serwera",
    },
    unknown: {
      title: "Nieznany Błąd",
      description: "Wystąpił nieznany błąd",
    },
    network: {
      title: "Błąd Sieci",
      description: "Wystąpił błąd sieci",
    },
    forbidden: {
      title: "Zabronione",
      description: "Dostęp zabroniony",
    },
    notFound: {
      title: "Nie Znaleziono",
      description: "Zasób nie został znaleziony",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt danych",
    },
    unsavedChanges: {
      title: "Niezapisane Zmiany",
      description: "Zmiany nie zostały zapisane",
    },
  },
  success: {
    title: "Sukces",
    description: "Opcje logowania pobrane pomyślnie",
  },
  post: {
    title: "Opcje Logowania",
    description: "Pobierz dostępne opcje logowania",
    response: {
      title: "Odpowiedź Opcji Logowania",
      description: "Dostępne opcje konfiguracji logowania",
    },
    errors: {
      validation: {
        title: "Błąd Walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane uwierzytelnienie",
      },
      server: {
        title: "Błąd Serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany Błąd",
        description: "Wystąpił nieznany błąd",
      },
    },
    success: {
      description: "Opcje logowania pobrane pomyślnie",
    },
  },
  enums: {
    socialProviders: {
      google: "Google",
      github: "GitHub",
      facebook: "Facebook",
    },
  },
};
