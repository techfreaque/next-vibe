export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    users: "Użytkownicy",
  },
  get: {
    title: "Pobierz użytkownika",
    description: "Pobiera dane pojedynczego użytkownika organizacji Corvina.",
    orgId: {
      label: "ID organizacji",
      description: "Liczbowy identyfikator organizacji Corvina.",
    },
    userId: {
      label: "ID użytkownika",
      description: "Liczbowy identyfikator użytkownika Corvina.",
    },
    response: {
      id: "ID",
      username: "Nazwa użytkownika",
      email: "E-mail",
      firstName: "Imię",
      lastName: "Nazwisko",
      country: "Kraj",
      serviceAccount: "Konto serwisowe",
      mfaEnabled: "MFA włączone",
      owner: "Właściciel",
      groupPoliciesEnabled: "Zasady grupy",
      userImpersonation: "Personifikacja",
    },
    widget: {
      edit: "Edytuj",
      delete: "Usuń",
      sections: {
        identity: "Tożsamość",
        flags: "Uprawnienia",
      },
      labels: {
        username: "Nazwa użytkownika",
        email: "E-mail",
        name: "Imię i nazwisko",
        country: "Kraj",
        owner: "Właściciel",
      },
      badges: {
        serviceAccount: "Konto serwisowe",
        mfaEnabled: "MFA włączone",
        mfaDisabled: "Bez MFA",
        groupPolicies: "Zasady grupy",
        impersonation: "Personifikacja",
      },
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
        description: "Klucz API nie ma dostępu do tego użytkownika.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Użytkownik o tym ID nie istnieje.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina zgłosiła konflikt.",
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
      title: "Sukces",
      description: "Użytkownik pobrany pomyślnie.",
    },
  },
  put: {
    title: "Aktualizuj użytkownika",
    description: "Aktualizuje istniejącego użytkownika organizacji Corvina.",
    orgId: {
      label: "ID organizacji",
      description: "Liczbowy identyfikator organizacji Corvina.",
    },
    userId: {
      label: "ID użytkownika",
      description: "Liczbowy identyfikator użytkownika do aktualizacji.",
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
    country: {
      label: "Kraj",
      description: "Kod kraju użytkownika.",
      placeholder: "PL",
    },
    defaultHomePage: {
      label: "Domyślna strona startowa",
      description: "URL domyślnej strony startowej użytkownika.",
      placeholder: "/dashboard",
    },
    groupPoliciesEnabled: {
      label: "Zasady grupy aktywne",
      description: "Włącz egzekwowanie zasad grupowych dla tego użytkownika.",
    },
    userImpersonation: {
      label: "Personifikacja użytkownika",
      description: "Zezwól temu użytkownikowi na podszywanie się pod innych.",
    },
    submitButton: {
      label: "Zapisz zmiany",
      loadingText: "Zapisywanie…",
    },
    errors: {
      validation: {
        title: "Nieprawidłowa aktualizacja",
        description: "Corvina odrzuciła ładunek aktualizacji.",
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
        description: "Klucz API nie ma dostępu do zapisu tego użytkownika.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Użytkownik o tym ID nie istnieje.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina zgłosiła konflikt dla tej aktualizacji.",
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
      title: "Zapisano",
      description: "Użytkownik zaktualizowany pomyślnie.",
    },
  },
  delete: {
    title: "Usuń użytkownika",
    description: "Trwale usuwa użytkownika organizacji Corvina.",
    orgId: {
      label: "ID organizacji",
      description: "Liczbowy identyfikator organizacji Corvina.",
    },
    userId: {
      label: "ID użytkownika",
      description: "Liczbowy identyfikator użytkownika do usunięcia.",
    },
    widget: {
      warning: "Ta operacja jest nieodwracalna.",
      confirmButton: "Usuń użytkownika",
      cancelButton: "Anuluj",
      deletedTitle: "Użytkownik usunięty",
      deletedDescription: "Użytkownik został trwale usunięty.",
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
        description:
          "Klucz API nie ma uprawnień do usunięcia tego użytkownika.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Użytkownik o tym ID nie istnieje.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina zgłosiła konflikt.",
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
      title: "Usunięto",
      description: "Użytkownik usunięty pomyślnie.",
    },
  },
};
