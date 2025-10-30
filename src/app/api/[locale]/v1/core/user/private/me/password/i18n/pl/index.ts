import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Zmień Hasło",
  description: "Bezpiecznie zaktualizuj hasło do swojego konta",
  tag: "zmiana-hasła",
  debug: {
    updatingPassword: "Aktualizowanie hasła",
    errorUpdatingPassword: "Błąd podczas aktualizacji hasła",
    settingPassword: "Ustawianie hasła",
    errorSettingPassword: "Błąd podczas ustawiania hasła",
  },
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
    passwords_do_not_match: "Hasła nie pasują do siebie",
    user_not_found: "Użytkownik nie znaleziony",
    incorrect_password: "Nieprawidłowe hasło",
    update_failed: "Nie udało się zaktualizować hasła",
    token_creation_failed: "Nie udało się utworzyć tokenu hasła",
    two_factor_code_required: "Wymagany kod uwierzytelniania dwuskładnikowego",
    invalid_two_factor_code: "Nieprawidłowy kod uwierzytelniania dwuskładnikowego",
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
    updated: "Hasło zaktualizowane pomyślnie",
    securityTip: "Aby zwiększyć bezpieczeństwo, włącz uwierzytelnianie dwuskładnikowe",
    nextSteps: {
      logoutOther: "Wszystkie inne sesje zostały wylogowane ze względów bezpieczeństwa",
      enable2fa: "Rozważ włączenie uwierzytelniania dwuskładnikowego dla lepszego bezpieczeństwa",
    },
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
