import type { translations as enTranslations } from "../en";
import { translations as componentsTranslations } from "../../_components/i18n/pl";

export const translations: typeof enTranslations = {
  _components: componentsTranslations,
  title: "Żądanie resetowania hasła",
  description: "Żądanie resetowania hasła",
  tag: "Reset hasła",
  email: {
    title: "Zresetuj swoje hasło {{appName}}",
    subject: "Żądanie resetowania hasła - {{appName}}",
    previewText:
      "Zresetuj swoje hasło, aby odzyskać dostęp do swojego konta {{appName}} i kontynuować rozmowy z 38 modelami AI.",
    greeting: "Witaj,",
    requestInfo:
      "Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta {{appName}}.",
    instructions:
      "Kliknij przycisk poniżej, aby utworzyć nowe hasło. Ten link jest ważny przez 24 godziny i może być użyty tylko raz.",
    buttonText: "Zresetuj moje hasło",
    expirationInfo:
      "Ten bezpieczny link wygasa za 24 godziny dla Twojego bezpieczeństwa.",
    securityInfo:
      "Dla Twojego bezpieczeństwa, to resetowanie hasła zostało zażądane z {{ipAddress}} dnia {{requestTime}}.",
    didntRequest: "Nie żądałeś tego?",
    didntRequestInfo:
      "Jeśli nie żądałeś resetowania hasła, możesz bezpiecznie zignorować ten e-mail. Twoje hasło pozostanie niezmienione, a Twoje konto jest bezpieczne.",
    needHelp: "Potrzebujesz pomocy?",
    needHelpInfo:
      "Jeśli masz problemy z resetowaniem hasła lub dostępem do swojego konta, nasz zespół wsparcia jest tutaj, aby pomóc.",
    supportButton: "Skontaktuj się ze wsparciem",
    signoff: "Bądź bezpieczny,\nZespół {{appName}}",
    footer: "To jest automatyczne powiadomienie bezpieczeństwa z {{appName}}",
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
      expiresAt: "24 godziny od teraz",
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
};
