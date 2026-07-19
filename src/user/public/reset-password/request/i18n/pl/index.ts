import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
};
