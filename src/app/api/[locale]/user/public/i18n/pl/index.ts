import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  login: {
  category: "Użytkownicy",
  title: "Witaj ponownie",
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
},
  resetPassword: {
  confirm: {
  category: "Użytkownicy",

  title: "Potwierdź resetowanie hasła",
  description: "Potwierdź resetowanie hasła nowym hasłem",
  tag: "Resetowanie hasła",
  email: {
    title: "Hasło zostało zresetowane",
    subject: "Hasło pomyślnie zresetowane - {{appName}}",
    previewText:
      "Hasło {{appName}} zostało zresetowane. Zaloguj się i zacznij rozmawiać z {{modelCount}} modelami AI.",
    greeting: "Hej {{name}},",
    successMessage:
      "Twoje hasło zostało zresetowane. Wszystko gotowe - zaloguj się i kontynuuj od miejsca, w którym skończyłeś.",
    loginButton: "Zaloguj się do {{appName}}",
    promoText: "{{modelCount}} modeli AI. Bez filtrów. Bez cenzury.",
    securityWarning:
      "Nie resetowałeś hasła? Skontaktuj się natychmiast ze wsparciem - Twoje konto może być zagrożone.",
  },
  groups: {
    verification: {
      title: "Weryfikacja",
      description: "Zweryfikuj swoje żądanie resetowania hasła",
    },
    newPassword: {
      title: "Nowe hasło",
      description: "Ustaw swoje nowe hasło",
    },
  },
  fields: {
    token: {
      label: "Token resetowania",
      description: "Token resetowania hasła z Twojego e-maila",
      placeholder: "Wprowadź token resetowania",
      help: "Sprawdź swój e-mail, aby znaleźć token resetowania hasła i wprowadź go tutaj",
      validation: {
        required: "Token resetowania jest wymagany",
      },
    },
    email: {
      label: "Adres e-mail",
      description: "Twój adres e-mail",
      placeholder: "Wprowadź adres e-mail",
      validation: {
        invalid: "Proszę wprowadzić prawidłowy adres e-mail",
      },
    },
    password: {
      label: "Nowe hasło",
      description: "Twoje nowe hasło",
      placeholder: "Wprowadź nowe hasło",
      help: "Wybierz silne hasło z co najmniej 8 znakami, w tym literami, cyframi i symbolami",
      validation: {
        minLength: "Hasło musi mieć co najmniej 8 znaków",
      },
    },
    confirmPassword: {
      label: "Potwierdź hasło",
      description: "Potwierdź swoje nowe hasło",
      placeholder: "Potwierdź nowe hasło",
      validation: {
        minLength: "Hasło musi mieć co najmniej 8 znaków",
      },
    },
  },
  validation: {
    passwords: {
      mismatch: "Hasła nie pasują do siebie",
    },
  },
  response: {
    title: "Odpowiedź resetowania hasła",
    description: "Odpowiedź potwierdzenia resetowania hasła",
    message: {
      label: "Wiadomość",
      description: "Wiadomość odpowiedzi",
    },
    securityTip:
      "Rozważ włączenie uwierzytelniania dwuskładnikowego dla lepszego bezpieczeństwa",
    nextSteps: [
      "Zaloguj się za pomocą nowego hasła",
      "Zaktualizuj zapisane hasła w swojej przeglądarce",
      "Rozważ włączenie 2FA dla dodatkowego bezpieczeństwa",
    ],
  },
  errors: {
    title: "Błąd resetowania hasła",
    no_email: "Nie znaleziono konta z tym adresem e-mail",
    validation: {
      title: "Błąd walidacji",
      description: "Sprawdź swoje dane i spróbuj ponownie",
      passwordsDoNotMatch: "Hasła nie pasują do siebie",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Nieprawidłowy lub wygasły token resetowania",
    },
    internal: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd",
    },
    network: {
      title: "Błąd sieci",
      description: "Błąd połączenia sieciowego",
    },
    forbidden: {
      title: "Dostęp odrzucony",
      description: "Nie masz uprawnień do wykonania tej czynności",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Token resetowania nie został znaleziony lub wygasł",
    },
    unsaved: {
      title: "Niezapisane zmiany",
      description: "Są niezapisane zmiany",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas przetwarzania Twojego żądania",
    },
  },
  success: {
    title: "Resetowanie hasła pomyślne",
    description: "Twoje hasło zostało pomyślnie zresetowane",
    message: "Hasło zostało pomyślnie zresetowane",
    password_reset: "Twoje hasło zostało pomyślnie zresetowane",
  },
  actions: {
    requestNewLink: "Poproś o nowy link resetowania",
  },
  emailTemplates: {
    confirm: {
      name: "E-mail z potwierdzeniem resetowania hasła",
      description:
        "E-mail wysyłany do użytkowników po pomyślnym zresetowaniu hasła",
      category: "Uwierzytelnianie",
      preview: {
        publicName: {
          label: "Nazwa publiczna",
          description: "Publiczna nazwa wyświetlana użytkownika",
        },
        userId: {
          label: "ID użytkownika",
          description: "Unikalny identyfikator użytkownika",
        },
      },
    },
  },
},
  request: {
  category: "Użytkownicy",
  title: "Żądanie resetowania hasła",
  description: "Żądanie resetowania hasła",
  tag: "Reset hasła",
  ui: {
    title: "Zresetuj hasło",
    subtitle:
      "Wprowadź swój adres e-mail, a wyślemy Ci link do resetowania hasła",
    sendResetLink: "Wyślij link resetujący",
    alreadyHaveAccount: "Masz już konto? Zaloguj się",
  },
  actions: {
    submitting: "Wysyłanie...",
  },
  email: {
    title: "Zresetuj swoje hasło {{appName}}",
    subject: "Żądanie resetowania hasła - {{appName}}",
    previewText:
      "Zresetuj hasło {{appName}} - link ważny przez {{hours}} godziny.",
    greeting: "Hej {{name}},",
    requestInfo:
      "Ktoś poprosił o zresetowanie hasła do Twojego konta {{appName}}. Jeśli to byłeś Ty, kliknij przycisk poniżej.",
    buttonText: "Zresetuj moje hasło",
    expirationInfo:
      "Link wygasa za {{hours}} godziny. Jeśli nie prosiłeś o reset, zignoruj tę wiadomość - hasło pozostaje bez zmian.",
    signoff: "Zespół {{appName}}",
    promoText: "{{modelCount}} modeli AI. Bez filtrów. Bez cenzury.",
  },
  groups: {
    emailInput: {
      title: "Wprowadzenie E-maila",
      description:
        "Wprowadź swój adres e-mail, aby otrzymać instrukcje resetowania",
    },
  },
  fields: {
    email: {
      label: "Adres e-mail",
      description: "Wprowadź swój adres e-mail",
      placeholder: "twoj@email.pl",
      help: "Wprowadź adres e-mail powiązany z Twoim kontem",
      validation: {
        invalid: "Proszę wprowadzić prawidłowy adres e-mail",
      },
    },
  },
  response: {
    title: "Odpowiedź żądania resetu",
    description: "Odpowiedź żądania resetowania hasła",
    success: {
      message: "Link resetowania hasła wysłany pomyślnie",
    },
    deliveryInfo: {
      estimatedTime: "w ciągu 5 minut",
      expiresAt: "4 godziny od teraz",
    },
    nextSteps: {
      checkEmail: "Sprawdź swoją skrzynkę odbiorczą i folder spam",
      clickLink: "Kliknij link resetowania w e-mailu",
      createPassword: "Utwórz nowe bezpieczne hasło",
    },
  },
  errors: {
    title: "Błąd",
    validation: {
      title: "Błąd walidacji",
      description: "Podano nieprawidłowe dane",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Żądanie nie jest autoryzowane",
    },
    internal: {
      title: "Błąd wewnętrzny",
      description: "Wewnętrzny błąd serwera",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd",
    },
    network: {
      title: "Błąd sieci",
      description: "Błąd połączenia sieciowego",
    },
    forbidden: {
      title: "Zabronione",
      description: "Dostęp zabroniony",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Zasób nie został znaleziony",
    },
    unsaved: {
      title: "Niezapisane zmiany",
      description: "Zmiany nie zostały zapisane",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt danych",
    },
    no_email: "Nie znaleziono konta z tym adresem e-mail",
    email_generation_failed: "Nie udało się wygenerować e-maila",
  },
  success: {
    title: "Żądanie wysłane",
    description: "Żądanie resetowania hasła zostało pomyślnie wysłane",
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
  emailTemplates: {
    request: {
      name: "E-mail z żądaniem resetowania hasła",
      description:
        "E-mail wysyłany do użytkowników z linkiem do resetowania hasła",
      category: "Uwierzytelnianie",
      preview: {
        publicName: {
          label: "Nazwa publiczna",
          description: "Publiczna nazwa wyświetlana użytkownika",
        },
        userId: {
          label: "ID użytkownika",
          description: "Unikalny identyfikator użytkownika",
        },
        passwordResetUrl: {
          label: "URL resetowania hasła",
          description: "Adres URL do resetowania hasła",
        },
      },
    },
  },
},
  validate: {
  category: "Użytkownicy",

  title: "Walidacja Tokenu Resetowania Hasła",
  description: "Endpoint walidacji tokenu resetowania hasła",
  tag: "Walidacja Resetowania Hasła",
  groups: {
    tokenInput: {
      title: "Walidacja Tokenu",
      description: "Wprowadź token resetowania hasła do walidacji",
    },
  },
  fields: {
    token: {
      label: "Token Resetowania",
      description: "Token resetowania hasła z emaila",
      placeholder: "Wprowadź token resetowania",
      help: "Wprowadź token, który otrzymałeś w emailu",
      validation: {
        required: "Token resetowania jest wymagany",
      },
    },
  },
  response: {
    title: "Wynik Walidacji",
    description: "Odpowiedź walidacji tokenu",
    valid: "Token Prawidłowy",
    message: "Wiadomość Walidacji",
    validationMessage: "Walidacja tokenu resetowania zakończona",
    userId: "ID Użytkownika",
    expiresAt: "Token Wygasa",
    nextSteps: {
      item: "Kolejne Kroki Po Walidacji",
      steps: [
        "Przejdź do ustawienia nowego hasła",
        "Wybierz silne, unikalne hasło",
      ],
    },
  },
  errors: {
    title: "Błąd",
    validation: {
      title: "Błąd Walidacji",
      description: "Walidacja tokenu nie powiodła się",
    },
    unauthorized: {
      title: "Brak Autoryzacji",
      description: "Nieprawidłowy lub wygasły token",
    },
    internal: {
      title: "Błąd Wewnętrzny",
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
      description: "Token nie został znaleziony",
    },
    unsaved: {
      title: "Niezapisane Zmiany",
      description: "Wykryto niezapisane zmiany",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt danych",
    },
  },
  success: {
    title: "Token Prawidłowy",
    description: "Token resetowania hasła jest prawidłowy",
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
},
  actions: {
    back: "Wstecz",
    submit: "Wyślij",
    submitting: "Wysyłanie...",
  },
  success: {
    password_reset: "Twoje hasło zostało pomyślnie zresetowane.",
  },
  errors: {
    tokenValidationFailed: "Walidacja tokenu nie powiodła się",
    userLookupFailed: "Nie udało się znaleźć użytkownika",
    tokenDeletionFailed: "Nie udało się usunąć tokenu",
    userDeletionFailed: "Nie udało się usunąć użytkownika",
    resetFailed: "Resetowanie hasła nie powiodło się",
    tokenCreationFailed: "Nie udało się utworzyć tokenu resetowania",
    noDataReturned: "Brak danych zwróconych z bazy danych",
    tokenInvalid: "Token resetowania jest nieprawidłowy",
    tokenExpired: "Token resetowania wygasł",
    tokenVerificationFailed: "Weryfikacja tokenu nie powiodła się",
    userNotFound: "Użytkownik nie znaleziony",
    passwordUpdateFailed: "Nie udało się zaktualizować hasła",
    passwordResetFailed: "Resetowanie hasła nie powiodło się",
    requestFailed: "Żądanie resetowania nie powiodło się",
    emailMismatch: "E-mail nie pasuje",
    confirmationFailed: "Potwierdzenie resetowania hasła nie powiodło się",
  },
},
  signup: {
  category: "Użytkownicy",

  _components: {
  passwordStrength: {
    label: "Siła hasła",
    weak: "Słabe",
    fair: "Wystarczające",
    good: "Dobre",
    strong: "Silne",
    requirement: {
      minLength: {
        icon: "✗",
        text: "Co najmniej 8 znaków",
      },
      uppercase: {
        icon: "✗",
        text: "Co najmniej jedna wielka litera",
      },
      lowercase: {
        icon: "✗",
        text: "Co najmniej jedna mała litera",
      },
      number: {
        icon: "✗",
        text: "Co najmniej jedna cyfra",
      },
      special: {
        icon: "!",
        text: "Znak specjalny (opcjonalny, poprawia siłę)",
      },
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
},
  title: "Rejestracja Użytkownika",
  description: "Endpoint rejestracji użytkownika",
  tag: "Uwierzytelnianie",
  actions: {
    submit: "Utwórz konto",
    submitting: "Tworzenie konta...",
  },
  fields: {
    privateName: {
      label: "Twoja prywatna nazwa",
      description:
        "Jak AI będzie się do Ciebie zwracać w prywatnych rozmowach. To zostaje między Tobą a AI - całkowicie prywatne.",
      placeholder: "Wpisz swoje imię",
      validation: {
        required: "Prywatna nazwa jest wymagana",
        minLength: "Nazwa musi mieć co najmniej 2 znaki",
        maxLength: "Nazwa nie może być dłuższa niż 100 znaków",
      },
    },
    publicName: {
      label: "Twoja publiczna nazwa",
      description:
        "Twoja tożsamość w publicznych czatach i na forach. Inni użytkownicy i AI zobaczą tę nazwę. Wybierz mądrze - ona reprezentuje Cię w społeczności.",
      placeholder: "Wpisz nazwę wyświetlaną",
      validation: {
        required: "Nazwa wyświetlana jest wymagana",
        minLength: "Nazwa wyświetlana musi mieć co najmniej 2 znaki",
        maxLength: "Nazwa wyświetlana nie może być dłuższa niż 100 znaków",
      },
    },
    email: {
      label: "Twój e-mail",
      description:
        "Twoje dane logowania i metoda kontaktu. Pozostaje prywatny - nigdy nie będzie udostępniony innym użytkownikom ani AI.",
      placeholder: "Wpisz adres e-mail",
      help: "To będzie Twój e-mail do logowania i główna metoda kontaktu",
      validation: {
        required: "E-mail jest wymagany",
        invalid: "Wpisz prawidłowy adres e-mail",
      },
    },
    password: {
      label: "Twoje hasło",
      description:
        "Silne hasła chronią Twoje konto. Wkrótce wdrożymy szyfrowanie end-to-end - od tego momentu reset hasła usunie Twoją historię wiadomości, ponieważ tylko Ty posiadasz klucz deszyfrujący. Zapisz je w bezpiecznym miejscu.",
      placeholder: "Wpisz hasło",
      validation: {
        required: "Hasło jest wymagane",
        minLength: "Hasło musi mieć co najmniej 8 znaków",
        complexity: "Hasło musi zawierać wielką literę, małą literę i cyfrę",
      },
    },
    confirmPassword: {
      label: "Potwierdź hasło",
      validation: {
        required: "Potwierdź swoje hasło",
        minLength: "Hasło musi mieć co najmniej 8 znaków",
        mismatch: "Hasła nie pasują do siebie",
      },
    },

    acceptTerms: {
      label: "Akceptuj regulamin",
      description: "Nasz regulamin szanuje Twoją wolność i prywatność.",
      termsLink: "regulamin",
      conditionsLink: "politykę prywatności",
      descriptionPrefix: "Nasz",
      descriptionAnd: "i",
      descriptionSuffix: "szanują Twoją wolność i prywatność.",
      validation: {
        required: "Musisz zaakceptować regulamin, aby kontynuować",
      },
    },
    subscribeToNewsletter: {
      label: "Subskrybuj newsletter",
      description:
        "Sporadyczne aktualizacje o nowych modelach i funkcjach. Bez spamu, tylko to co ważne.",
    },

    referralCode: {
      label: "Kod polecający (opcjonalnie)",
      description:
        "Masz znajomego na unbottled.ai? Wpisz jego kod, żeby go wesprzeć. Dostanie nagrodę za to, że Cię tu przyprowadził.",
      placeholder: "Wpisz kod polecający (opcjonalnie)",
      labelPrefilled: "Kod polecający",
      descriptionPrefilled:
        "Twoj znajomy dostanie nagrodę, gdy założysz konto.",
    },
    supportedSkillId: {
      label: "Wesprzyj twórcę",
      description:
        "Twoja rejestracja daje twórcy tego skilla +5% z Twoich subskrypcji.",
      selectorTitle: "Wesprzyj twórcę",
      selectorDescription:
        "Masz w ulubionych skille od niezależnych twórców. Wybierz jednego do wsparcia - dostanie +5% z Twoich subskrypcji. Możesz to zmienić w każdej chwili.",
      selectorNone: "Żaden (pomiń)",
    },
    localFavorites: {
      label: "Lokalne ulubione",
    },
  },
  form: {
    title: "Witamy w Uncensored AI",
    description:
      "Pomóż budować niecenzurowaną, prywatną i naprawdę niezależną AI. unbottled.ai to open source i projekt społecznościowy - Twoja rejestracja wspiera rozwój technologii AI, która szanuje Twoją wolność.",
  },
  footer: {
    alreadyHaveAccount: "Masz już konto? Zaloguj się",
  },
  errors: {
    title: "Błąd rejestracji",
    validation: {
      title: "Błąd Walidacji",
      description: "Sprawdź wprowadzone dane i spróbuj ponownie",
    },
    unauthorized: {
      title: "Brak Autoryzacji",
      description: "Wymagana autoryzacja",
    },
    server: {
      title: "Błąd Serwera",
      description: "Wystąpił wewnętrzny błąd serwera",
    },
    unknown: {
      title: "Nieznany Błąd",
      description: "Wystąpił nieoczekiwany błąd",
    },
    conflict: {
      title: "Konflikt konta",
      description: "Konto z tym adresem e-mail już istnieje",
    },
    forbidden: {
      title: "Dostęp Zabroniony",
      description: "Odmowa dostępu",
    },
    network: {
      title: "Błąd Sieci",
      description: "Wystąpił błąd sieci",
    },
    notFound: {
      title: "Nie Znaleziono",
      description: "Zasób nie znaleziony",
    },
    unsaved: {
      title: "Niezapisane Zmiany",
      description: "Masz niezapisane zmiany",
    },
    internal: {
      title: "Błąd Wewnętrzny",
      description: "Wystąpił błąd wewnętrzny",
    },
  },
  emailCheck: {
    title: "Sprawdzanie Dostępności E-maila",
    description: "Sprawdź, czy e-mail jest dostępny do rejestracji",
    tag: "Sprawdzanie E-maila",
    fields: {
      email: {
        label: "Adres E-mail",
        description: "E-mail do sprawdzenia",
        placeholder: "Wprowadź adres e-mail",
        validation: {
          invalid: "Nieprawidłowy format e-maila",
        },
      },
    },
    response: {
      title: "Odpowiedź Sprawdzania E-maila",
      description: "Wynik sprawdzania dostępności e-maila",
      available: "E-mail Dostępny",
      message: "Wiadomość o Dostępności",
    },
    errors: {
      validation: {
        title: "Nieprawidłowy E-mail",
        description: "Proszę wprowadzić prawidłowy adres e-mail",
      },
      internal: {
        title: "Błąd Sprawdzania E-maila",
        description: "Błąd przy sprawdzaniu dostępności e-maila",
      },
      unknown: {
        title: "Nieznany Błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      conflict: {
        title: "E-mail już zajęty",
        description: "Ten e-mail jest już zarejestrowany",
      },
      forbidden: {
        title: "Dostęp zabroniony",
        description: "Nie masz uprawnień do sprawdzenia tego e-maila",
      },
      network: {
        title: "Błąd Sieci",
        description: "Wystąpił błąd sieci podczas sprawdzania e-maila",
      },
      notFound: {
        title: "Usługa nie znaleziona",
        description: "Usługa sprawdzania e-maila jest niedostępna",
      },
      unauthorized: {
        title: "Brak Autoryzacji",
        description: "Wymagane uwierzytelnienie do sprawdzenia e-maila",
      },
      unsaved: {
        title: "Niezapisane Zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Sprawdzanie E-maila Zakończone",
      description: "Dostępność e-maila sprawdzona pomyślnie",
    },
  },
  post: {
    title: "Rejestracja",
    description: "Endpoint rejestracji",
    form: {
      title: "Konfiguracja Rejestracji",
      description: "Skonfiguruj parametry rejestracji",
    },
    response: {
      title: "Odpowiedź",
      description: "Dane odpowiedzi rejestracji",
      success: "Rejestracja Pomyślna",
      message: "Wiadomość Statusu",
      userId: "ID Użytkownika",
      nextSteps: "Następne Kroki",
    },
    errors: {
      unauthorized: {
        title: "Brak Autoryzacji",
        description: "Wymagana autoryzacja",
      },
      validation: {
        title: "Błąd Walidacji",
        description: "Nieprawidłowe parametry żądania",
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
      unsaved: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Sukces",
      description: "Operacja zakończona pomyślnie",
      processing: "Przetwarzanie rejestracji zakończone pomyślnie",
    },
  },
  response: {
    title: "Odpowiedź",
    description: "Dane odpowiedzi rejestracji",
    success: "Rejestracja Pomyślna",
    message: "Wiadomość Statusu",
    user: {
      id: "ID Użytkownika",
      email: "Adres E-mail",
      firstName: "Imię",
      lastName: "Nazwisko",
      privateName: "Nazwa Prywatna",
      publicName: "Nazwa Publiczna",
      imageUrl: "URL Zdjęcia Profilowego",
      verificationRequired: "Wymagana weryfikacja",
    },
    verificationInfo: {
      title: "Weryfikacja E-maila",
      description: "Szczegóły procesu weryfikacji e-mail",
      emailSent: "E-mail wysłany",
      expiresAt: "Weryfikacja wygaśnie",
      checkSpamFolder: "Sprawdź folder spam",
    },
    nextSteps: "Następne Kroki",
  },
  success: {
    title: "Rejestracja udana",
    description: "Twoje konto zostało pomyślnie utworzone",
  },
  admin_notification: {
    title: "Nowa rejestracja użytkownika",
    subject: "Nowa rejestracja użytkownika - {{privateName}}",
    preview: "Nowy użytkownik {{privateName}} się zarejestrował",
    message: "Nowy użytkownik zarejestrował się w {{appName}}",
    privateName: "Nazwa Prywatna",
    publicName: "Nazwa Publiczna",
    email: "E-mail",
    locale: "Język",
    creditBalance: "Saldo kredytów",
    leadCreditBalance: "Saldo kredytów leada",
    signup_preferences: "Preferencje Rejestracji",
    user_details: "Szczegóły użytkownika",
    basic_information: "Podstawowe informacje",
    signup_type: "Typ rejestracji",
    direct_signup: "Bezpośrednia rejestracja",
    newsletter: "Newsletter",
    subscribed: "Subskrybowany",
    not_subscribed: "Niesubskrybowany",
    signup_details: "Szczegóły rejestracji",
    signup_date: "Data rejestracji",
    user_id: "ID użytkownika",
    recommended_next_steps: "Zalecane następne kroki",
    direct_recommendation:
      "Przejrzyj profil użytkownika i konfigurację płatności",
    contact_user: "Skontaktuj się z użytkownikiem",
    footer: "To jest automatyczne powiadomienie z {{appName}}",
  },
  email: {
    subject: "Jesteś z nami - {{appName}} jest gotowe na Ciebie",
    previewText:
      "Hej {{privateName}}, Twoje konto jest gotowe. Rozmawiaj z Claude, GPT, Gemini, DeepSeek i {{modelCount}} innymi - za darmo, bez karty.",
    headline: "Twoja AI czeka.",
    greeting: "Hej {{privateName}},",
    intro:
      "Witamy w {{appName}}. Właśnie odblokowałeś dostęp do najbardziej kompletnej platformy do rozmów z AI - wszystko, co lubisz w ChatGPT, plus modele open-source i modele bez filtrów treści.",
    models: {
      title: "{{modelCount}} modeli w 3 kategoriach",
      mainstream: "Główny nurt",
      open: "Open Source",
      uncensored: "Niecenzurowane",
    },
    free: {
      title: "Co dostajesz za darmo, na zawsze:",
      credits:
        "{{freeCredits}} creditów miesięcznie - bez karty, bez daty wygaśnięcia",
      allModels: "Dostęp do wszystkich {{modelCount}} modeli AI",
      uncensored:
        "4 niecenzurowane modele, które naprawdę odpowiadają na pytania",
      chatModes: "Tryby czatu: Prywatny, Incognito, Współdzielony i Publiczny",
      noCard: "Karta kredytowa nie jest wymagana - nigdy",
    },
    ctaButton: "Zacznij rozmawiać",
    upgrade: {
      title: "Chcesz więcej?",
      desc: "{{subscriptionPrice}}/miesiąc daje Ci {{subscriptionCredits}} creditów - to 40× więcej. Możesz też kupować dodatkowe pakiety creditów, które nigdy nie wygasają. Idealne do codziennego użytku AI.",
      cta: "Zobacz plan Unlimited",
    },
    signoff: "Miłych rozmów,\nZespół {{appName}}",
    ps: "P.S. Użyj trybu Incognito, aby zachować rozmowy tylko na swoim urządzeniu - nigdy nie przechowujemy ich na naszych serwerach.",
  },
  emailTemplates: {
    welcome: {
      name: "E-mail powitalny po rejestracji",
      description:
        "E-mail powitalny wysyłany do użytkowników po pomyślnej rejestracji",
      category: "Uwierzytelnianie",
      preview: {
        privateName: {
          label: "Nazwa prywatna",
          description: "Prywatna nazwa użytkownika",
        },
        userId: {
          label: "ID użytkownika",
          description: "Unikalny identyfikator użytkownika",
        },
        leadId: {
          label: "ID leada",
          description: "Identyfikator leada użytkownika",
        },
      },
    },
    adminSignup: {
      name: "E-mail z powiadomieniem administratora o rejestracji",
      description:
        "E-mail wysyłany do administratorów gdy nowy użytkownik się rejestruje",
      category: "Administracja",
      preview: {
        privateName: {
          label: "Nazwa prywatna",
        },
        publicName: {
          label: "Nazwa publiczna",
        },
        email: {
          label: "Adres e-mail",
        },
        userId: {
          label: "ID użytkownika",
        },
        subscribeToNewsletter: {
          label: "Subskrypcja newslettera",
        },
      },
    },
  },
},
};
