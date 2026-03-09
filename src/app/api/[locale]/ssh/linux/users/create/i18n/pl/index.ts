export const translations = {
  category: "SSH",

  errors: {
    localModeOnly: {
      title: "Tylko w trybie lokalnym",
    },
    invalidUsername:
      "Nieprawidłowa nazwa: musi zaczynać się od litery, potem małe litery, cyfry lub myślniki (maks. 32 znaki)",
    userAlreadyExists: "Użytkownik o tej nazwie już istnieje",
    connectionNotFound: "Połączenie SSH nie znalezione",
    encryptionFailed:
      "Szyfrowanie nieudane — SSH_SECRET_KEY może być nieprawidłowy",
    connectTimeout: "Przekroczono limit czasu połączenia",
    sshAuthFailed: "Uwierzytelnianie SSH nieudane",
    sshConnectionFailed: "Połączenie SSH nieudane",
    fingerprintMismatch:
      "Odcisk palca hosta uległ zmianie. Możliwy atak MITM. Potwierdź, aby kontynuować.",
  },

  post: {
    title: "Utwórz użytkownika Linux",
    description:
      "Utwórz nowe konto użytkownika OS. Uruchamia useradd na docelowym hoście. Tylko dla administratorów.",
    fields: {
      connectionId: {
        label: "Połączenie SSH",
        description:
          "Na którym serwerze utworzyć użytkownika. Pozostaw puste, aby użyć domyślnego połączenia lub trybu lokalnego.",
        placeholder: "Wybierz połączenie…",
      },
      username: {
        label: "Nazwa użytkownika",
        description:
          "Musi zaczynać się od litery, potem małe litery, cyfry lub myślniki. Maks. 32 znaki.",
        placeholder: "alice",
      },
      groups: {
        label: "Dodatkowe grupy",
        description:
          "Opcjonalne dodatkowe grupy dla użytkownika (oddzielone przecinkami). Przykład: docker, www-data.",
        placeholder: "docker,www-data",
      },
      shell: {
        label: "Shell logowania",
        description: "Shell otwierany podczas interaktywnego logowania.",
      },
      homeDir: {
        label: "Katalog domowy",
        description:
          "Ścieżka katalogu domowego. Domyślnie /home/<nazwa>, jeśli pozostawione puste.",
        placeholder: "/home/alice",
      },
      sudoAccess: {
        label: "Przyznaj dostęp sudo",
        description:
          "Dodaj użytkownika do grupy sudo, aby mógł uruchamiać polecenia jako root. Używaj ostrożnie.",
      },
    },
    response: {
      ok: { title: "Sukces" },
      uid: { title: "UID" },
      gid: { title: "GID" },
      homeDirectory: { title: "Katalog domowy" },
      shell: { title: "Shell" },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź pola formularza i spróbuj ponownie",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagany dostęp administratora",
      },
      forbidden: {
        title: "Zabronione",
        description: "Tryb lokalny nie jest włączony na tym serwerze",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się utworzyć konta użytkownika",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Połączenie SSH nie znalezione",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Nazwa użytkownika już zajęta",
        description: "Użytkownik o tej nazwie już istnieje na serwerze",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć z serwerem",
      },
      timeout: {
        title: "Timeout",
        description: "Przekroczono limit czasu",
      },
    },
    success: {
      title: "Użytkownik utworzony",
      description: "Konto użytkownika OS utworzone pomyślnie",
    },
    submitButton: {
      text: "Utwórz użytkownika",
      loadingText: "Tworzenie…",
    },
  },
  widget: {
    title: "Utwórz użytkownika Linux",
    createButton: "Utwórz użytkownika",
    creating: "Tworzenie…",
    sudoWarning:
      "Przyznanie dostępu sudo daje użytkownikowi uprawnienia roota. Używaj tylko przy pełnym zaufaniu.",
  },
};
