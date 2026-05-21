export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    users: "Użytkownicy",
  },
  post: {
    title: "Utwórz użytkownika",
    description: "Tworzy nowego użytkownika w organizacji Corvina.",
    orgId: {
      label: "ID organizacji",
      description: "Liczbowy identyfikator organizacji Corvina.",
    },
    username: {
      label: "Nazwa użytkownika",
      description: "Unikalna nazwa użytkownika (min. 3 znaki).",
      placeholder: "jkowalski",
    },
    email: {
      label: "E-mail",
      description: "Adres e-mail użytkownika.",
      placeholder: "jkowalski@przyklad.pl",
    },
    firstName: {
      label: "Imię",
      description: "Imię użytkownika.",
      placeholder: "Jan",
    },
    lastName: {
      label: "Nazwisko",
      description: "Nazwisko użytkownika.",
      placeholder: "Kowalski",
    },
    password: {
      label: "Hasło",
      description:
        "Hasło początkowe (min. 8 znaków). Zostaw puste, aby pominąć.",
      placeholder: "••••••••",
    },
    temporaryPassword: {
      label: "Hasło tymczasowe",
      description: "Wymuś zmianę hasła przy pierwszym logowaniu.",
    },
    passwordChangeInvitation: {
      label: "Wyślij zaproszenie",
      description: "Wyślij zaproszenie e-mail do zmiany hasła.",
    },
    serviceAccount: {
      label: "Konto serwisowe",
      description: "Oznacz tego użytkownika jako nieludzkie konto serwisowe.",
    },
    emailVerified: {
      label: "E-mail zweryfikowany",
      description: "Oznacz adres e-mail jako już zweryfikowany.",
    },
    response: {
      id: "ID",
      username: "Nazwa użytkownika",
      email: "E-mail",
      firstName: "Imię",
      lastName: "Nazwisko",
      serviceAccount: "Konto serwisowe",
      mfaEnabled: "MFA",
      owner: "Właściciel",
    },
    submitButton: {
      label: "Utwórz użytkownika",
      loadingText: "Tworzenie…",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie do Corvina było nieprawidłowe.",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z API Corvina.",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Corvina odrzuciła klucz API.",
      },
      forbidden: {
        title: "Zabronione",
        description: "Klucz API nie ma uprawnień do tworzenia użytkowników.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Organizacja o tym ID nie istnieje.",
      },
      conflict: {
        title: "Konflikt",
        description: "Użytkownik o tej nazwie lub adresie e-mail już istnieje.",
      },
      server: {
        title: "Błąd serwera",
        description: "Corvina zwróciła wewnętrzny błąd serwera.",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Występują niezapisane zmiany.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd.",
      },
    },
    success: {
      title: "Utworzono",
      description: "Użytkownik utworzony pomyślnie.",
    },
  },
};
