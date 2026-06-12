import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Użytkownicy",
  title: "Witaj ponownie",
  titleShort: "Zaloguj",
  description:
    "Uzyskaj dostęp do niecenzurowanych modeli AI i historii rozmów.",
  tag: "Uwierzytelnianie",
  options: {
  category: "Użytkownicy",

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
    recommendations: {
      item: "Zalecana opcja logowania",
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
    socialLoginFaster:
      "Logowanie społecznościowe jest szybsze dla nowych użytkowników",
  },
},
  actions: {
    submit: "Zaloguj",
    submitting: "Logowanie...",
  },
  fields: {
    email: {
      label: "Twój e-mail",
      description: "E-mail, którego użyłeś do rejestracji.",
      placeholder: "Wpisz e-mail",
      validation: {
        required: "E-mail jest wymagany",
        invalid: "Wpisz prawidłowy adres e-mail",
      },
    },
    password: {
      label: "Twoje hasło",
      description: "Wpisz hasło, które ustaliłeś podczas rejestracji.",
      placeholder: "Wpisz hasło",
      help: "Wpisz hasło do swojego konta",
      validation: {
        required: "Hasło jest wymagane",
        minLength: "Hasło musi mieć co najmniej 8 znaków",
      },
    },
    rememberMe: {
      label: "Zapamiętaj mnie",
    },
  },
  groups: {
    credentials: {
      title: "Dane logowania",
      description: "Wprowadź informacje logowania",
    },
    options: {
      title: "Opcje logowania",
      description: "Dodatkowe preferencje logowania i ustawienia",
    },
    preferences: {
      title: "Preferencje logowania",
      description: "Dodatkowe opcje logowania",
    },
    advanced: {
      title: "Opcje zaawansowane",
      description: "Zaawansowane ustawienia logowania",
    },
  },
  footer: {
    forgotPassword: "Zapomniałeś hasła?",
    createAccount: "Nie masz konta? Zarejestruj się",
  },
  response: {
    title: "Odpowiedź logowania",
    description: "Dane odpowiedzi logowania",
    success: "Logowanie pomyślne",
    message: "Komunikat statusu",
    user: {
      title: "Szczegóły użytkownika",
      description: "Informacje o zalogowanym użytkowniku",
      id: "ID użytkownika",
      email: "Adres e-mail",
      firstName: "Imię",
      lastName: "Nazwisko",
      privateName: "Nazwa prywatna",
      publicName: "Nazwa publiczna",
      imageUrl: "Zdjęcie profilowe",
    },
    sessionInfo: {
      title: "Informacje o sesji",
      description: "Szczegóły sesji użytkownika",
      expiresAt: "Sesja wygasa",
      rememberMeActive: "Status zapamiętaj mnie",
      loginLocation: "Lokalizacja logowania",
    },
    nextSteps: {
      title: "Następne kroki",
      item: "Następne kroki",
    },
  },
  errors: {
    title: "Błąd logowania",
    account_locked: "Konto jest zablokowane",
    accountLocked: "Konto jest zablokowane",
    accountLockedDescription:
      "Twoje konto zostało zablokowane. Skontaktuj się z pomocą techniczną.",
    invalid_credentials: "Nieprawidłowy e-mail lub hasło",
    two_factor_required: "Wymagana dwuskładnikowa autoryzacja",
    auth_error: "Wystąpił błąd uwierzytelniania",
    user_not_found: "Użytkownik nie znaleziony",
    session_creation_failed: "Nie udało się utworzyć sesji",
    token_save_failed: "Nie udało się zapisać tokenu uwierzytelniania",
    validation: {
      title: "Walidacja nie powiodła się",
      description: "Sprawdź swoje dane wejściowe",
    },
    unauthorized: {
      title: "Logowanie nie powiodło się",
      description: "Nieprawidłowe dane logowania",
    },
    unknown: {
      title: "Błąd logowania",
      description: "Wystąpił błąd podczas logowania",
    },
    network: {
      title: "Błąd sieci",
      description: "Połączenie nie powiodło się",
    },
    forbidden: {
      title: "Dostęp zabroniony",
      description: "Logowanie nie jest dozwolone",
    },
    notFound: {
      title: "Użytkownik nie znaleziony",
      description: "Konto użytkownika nie zostało znalezione",
    },
    unsaved: {
      title: "Niezapisane zmiany",
      description: "Zmiany nie zostały zapisane",
    },
    conflict: {
      title: "Konflikt logowania",
      description: "Wykryto konflikt logowania",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera",
    },
  },
  success: {
    title: "Zalogowano pomyślnie",
    description: "Jesteś teraz zalogowany",
    message: "Witaj ponownie! Zalogowałeś się pomyślnie.",
  },
  token: {
    save: {
      failed: "Nie udało się zapisać tokenu uwierzytelniania",
      success: "Token uwierzytelniania został pomyślnie zapisany",
    },
  },
  process: {
    failed: "Proces logowania nie powiódł się",
  },
  enums: {
    socialProviders: {
      google: "Google",
      github: "GitHub",
      facebook: "Facebook",
    },
  },
  dev: {
    quickLogin: "Szybkie logowanie (Dev)",
  },
};
