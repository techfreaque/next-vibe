import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  confirm: {
  category: "Użytkownicy",

  title: "Potwierdź resetowanie hasła",
  titleShort: "Potwierdź reset",
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
  titleShort: "Resetuj hasło",
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
  titleShort: "Weryfikuj token",
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
};
