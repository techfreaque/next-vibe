export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    licenses: "Licencje",
  },
  get: {
    title: "Pobierz licencję",
    description: "Pobiera pojedynczą licencję po identyfikatorze.",
    licenseId: {
      label: "ID licencji",
      description: "Numeryczny identyfikator licencji.",
    },
    response: {
      licenseId: "ID licencji",
      productCode: "Kod produktu",
      productLabel: "Produkt",
      productType: "Typ",
      productTrial: "Wersja próbna",
      creationDate: "Utworzono",
      expirationDate: "Wygasa",
      activationDate: "Aktywowano",
      used: "W użyciu",
      code: "Kod licencji",
      externalRef: "Odniesienie zewnętrzne",
      price: "Cena",
      currency: "Waluta",
      autorenew: "Automatyczne odnowienie",
      orgResourceId: "ID zasobu organizacji",
    },
    widget: {
      title: "Szczegóły licencji",
      expiringSoon: "Wygasa wkrótce",
      expired: "Wygasła",
      active: "Aktywna",
      trial: "Próbna",
      noExpiry: "Bez wygaśnięcia",
      actions: {
        update: "Edytuj",
        renew: "Odnów",
        delete: "Usuń",
        back: "Wróć",
      },
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie do Corvina było błędne.",
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
        title: "Brak dostępu",
        description: "Klucz API nie ma dostępu do tej licencji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie istnieje licencja o podanym ID.",
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
        description: "Istnieją niezapisane zmiany.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd.",
      },
    },
    success: {
      title: "Sukces",
      description: "Licencja pobrana pomyślnie.",
    },
  },
  put: {
    title: "Aktualizuj licencję",
    description:
      "Aktualizuje automatyczne odnowienie i datę wygaśnięcia licencji.",
    licenseId: {
      label: "ID licencji",
      description: "Numeryczny identyfikator licencji.",
    },
    autorenew: {
      label: "Automatyczne odnowienie",
      description: "Włącz lub wyłącz automatyczne odnowienie.",
    },
    expirationDate: {
      label: "Data wygaśnięcia",
      description:
        "Nowa data wygaśnięcia w milisekundach epoch (null, aby wyczyścić).",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie do Corvina było błędne.",
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
        title: "Brak dostępu",
        description: "Klucz API nie ma uprawnień do aktualizacji licencji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie istnieje licencja o podanym ID.",
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
        description: "Istnieją niezapisane zmiany.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd.",
      },
    },
    success: {
      title: "Zaktualizowano",
      description: "Licencja zaktualizowana pomyślnie.",
    },
    submitButton: {
      label: "Zapisz zmiany",
      loadingText: "Zapisywanie...",
    },
  },
  delete: {
    title: "Usuń licencję",
    description: "Trwale usuwa licencję po identyfikatorze.",
    licenseId: {
      label: "ID licencji",
      description: "Numeryczny identyfikator licencji do usunięcia.",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie do Corvina było błędne.",
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
        title: "Brak dostępu",
        description: "Klucz API nie ma uprawnień do usuwania licencji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie istnieje licencja o podanym ID.",
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
        description: "Istnieją niezapisane zmiany.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd.",
      },
    },
    success: {
      title: "Usunięto",
      description: "Licencja usunięta pomyślnie.",
    },
    submitButton: {
      label: "Usuń licencję",
      loadingText: "Usuwanie...",
    },
  },
  post: {
    title: "Odnów licencję",
    description: "Odnawia licencję po identyfikatorze.",
    licenseId: {
      label: "ID licencji",
      description: "Numeryczny identyfikator licencji do odnowienia.",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie do Corvina było błędne.",
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
        title: "Brak dostępu",
        description: "Klucz API nie ma uprawnień do odnawiania licencji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie istnieje licencja o podanym ID.",
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
        description: "Istnieją niezapisane zmiany.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd.",
      },
    },
    success: {
      title: "Odnowiono",
      description: "Licencja odnowiona pomyślnie.",
    },
    submitButton: {
      label: "Odnów licencję",
      loadingText: "Odnawianie...",
    },
  },
};
