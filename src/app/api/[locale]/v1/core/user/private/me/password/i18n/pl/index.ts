import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Zmień Hasło",
  description: "Bezpiecznie zaktualizuj hasło do swojego konta",
  tag: "zmiana-hasła",
  groups: {
    currentCredentials: {
      title: "Obecne Hasło",
      description: "Zweryfikuj swoje obecne hasło, aby kontynuować",
    },
    newCredentials: {
      title: "Nowe Hasło",
      description: "Wybierz silne nowe hasło dla swojego konta",
    },
  },
  currentPassword: {
    label: "Obecne Hasło",
    description: "Wprowadź swoje obecne hasło",
    placeholder: "Wprowadź obecne hasło",
    help: "Wprowadź swoje obecne hasło, aby zweryfikować swoją tożsamość przed zmianą",
  },
  newPassword: {
    label: "Nowe Hasło",
    description: "Wprowadź nowe hasło (minimum 8 znaków)",
    placeholder: "Wprowadź nowe hasło",
    help: "Wybierz silne hasło z co najmniej 8 znakami, w tym literami, cyframi i symbolami",
  },
  confirmPassword: {
    label: "Potwierdź Hasło",
    description: "Potwierdź swoje nowe hasło",
    placeholder: "Potwierdź nowe hasło",
    help: "Ponownie wprowadź nowe hasło, aby upewnić się, że zostało wpisane poprawnie",
  },
  response: {
    title: "Odpowiedź Zmiany Hasła",
    description: "Odpowiedź na operację zmiany hasła",
    success: "Hasło zostało pomyślnie zaktualizowane",
    message: "Wiadomość o statusie",
    securityTip: "Wskazówka bezpieczeństwa",
    nextSteps: {
      item: "Następne kroki",
    },
  },
  validation: {
    currentPassword: {
      minLength: "Obecne hasło musi mieć co najmniej 8 znaków",
    },
    newPassword: {
      minLength: "Nowe hasło musi mieć co najmniej 8 znaków",
    },
    confirmPassword: {
      minLength: "Potwierdzenie hasła musi mieć co najmniej 8 znaków",
    },
    passwords: {
      mismatch: "Hasła nie są zgodne",
    },
  },
  errors: {
    invalid_request: {
      title: "Nieprawidłowe Żądanie",
      description: "Żądanie zmiany hasła jest nieprawidłowe",
    },
    validation: {
      title: "Błąd Walidacji",
      description: "Sprawdź swoje dane i spróbuj ponownie",
    },
    unauthorized: {
      title: "Brak Autoryzacji",
      description: "Musisz być zalogowany, aby zmienić hasło",
    },
    server: {
      title: "Błąd Serwera",
      description: "Nie udało się zaktualizować hasła z powodu błędu serwera",
    },
    unknown: {
      title: "Nieznany Błąd",
      description: "Wystąpił nieoczekiwany błąd podczas aktualizacji hasła",
    },
    network: {
      title: "Błąd Sieci",
      description: "Połączenie sieciowe nie powiodło się",
    },
    forbidden: {
      title: "Dostęp Zabroniony",
      description: "Nie masz uprawnień do wykonania tej czynności",
    },
    notFound: {
      title: "Użytkownik Nie Znaleziony",
      description: "Nie można znaleźć konta użytkownika",
    },
    unsavedChanges: {
      title: "Niezapisane Zmiany",
      description: "Masz niezapisane zmiany, które zostaną utracone",
    },
    conflict: {
      title: "Konflikt Danych",
      description: "Wystąpił konflikt podczas aktualizacji hasła",
    },
  },
  success: {
    title: "Hasło Zaktualizowane",
    description: "Twoje hasło zostało pomyślnie zaktualizowane",
  },
  update: {
    success: {
      title: "Hasło Zaktualizowane",
      description: "Twoje hasło zostało pomyślnie zaktualizowane",
    },
    errors: {
      unknown: {
        title: "Nieznany Błąd",
        description: "Wystąpił nieoczekiwany błąd podczas aktualizacji hasła",
      },
    },
  },
};
