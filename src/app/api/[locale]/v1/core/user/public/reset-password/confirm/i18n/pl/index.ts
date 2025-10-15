import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Potwierdź resetowanie hasła",
  description: "Potwierdź resetowanie hasła nowym hasłem",
  tag: "Resetowanie hasła",
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
    validation: {
      title: "Błąd walidacji",
      description: "Sprawdź swoje dane i spróbuj ponownie",
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
  },
};
