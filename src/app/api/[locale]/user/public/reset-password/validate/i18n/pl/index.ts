import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
      steps: ["Przejdź do ustawienia nowego hasła", "Wybierz silne, unikalne hasło"],
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
};
