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
    success: {
      badge: "Sukces",
    },
    message: {
      content: "Wiadomość statusu",
    },
    forUser: {
      content: "Adres e-mail",
    },
    loginMethods: {
      title: "Metody Logowania",
      description: "Dostępne metody uwierzytelnienia",
      password: {
        title: "Logowanie hasłem",
        description: "Standardowe uwierzytelnienie hasłem",
        enabled: {
          badge: "Włączone",
        },
      },
      social: {
        title: "Logowanie społecznościowe",
        description: "Opcje uwierzytelnienia społecznościowego",
        enabled: {
          badge: "Włączone",
        },
        providers: {
          item: {
            title: "Dostawca Społecznościowy",
            description: "Dostawca uwierzytelnienia społecznościowego",
          },
          name: {
            content: "Nazwa dostawcy",
          },
          id: {
            content: "ID dostawcy",
          },
          enabled: {
            badge: "Dostępny",
          },
          description: "Opis dostawcy",
        },
      },
    },
    security: {
      title: "Ustawienia bezpieczeństwa",
      description: "Podsumowanie wymagań bezpieczeństwa",
      maxAttempts: {
        content: "Maksymalna liczba prób logowania",
      },
      requireTwoFactor: {
        badge: "Wymagane 2FA",
      },
    },
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
  messages: {
    successMessage: "Opcje logowania pobrane pomyślnie",
    passwordAuthDescription: "Zaloguj się za pomocą adresu e-mail i hasła",
    socialAuthDescription: "Zaloguj się za pomocą kont społecznościowych",
    continueWithProvider: "Kontynuuj z {{provider}}",
    twoFactorRequired: "Zwiększone bezpieczeństwo: wymagane 2FA",
    standardSecurity: "Standardowe wymagania bezpieczeństwa",
    tryPasswordFirst: "Wypróbuj najpierw logowanie hasłem",
    useSocialLogin: "Użyj logowania społecznościowego",
    socialLoginFaster: "Logowanie społecznościowe jest szybsze dla nowych użytkowników",
  },
};
