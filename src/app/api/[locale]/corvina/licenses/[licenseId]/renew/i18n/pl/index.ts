export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    licenses: "Licencje",
  },
  post: {
    title: "Odnów licencję",
    description: "Odnawia licencję na podstawie ID.",
    licenseId: {
      label: "ID licencji",
      description: "Numeryczne ID licencji do odnowienia.",
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
      externalRef: "Zewnętrzna referencja",
      price: "Cena",
      currency: "Waluta",
      autorenew: "Auto-odnawianie",
      orgResourceId: "ID zasobu organizacji",
    },
    widget: {
      title: "Odnów licencję",
      back: "Wstecz",
    },
    submitButton: {
      label: "Odnów licencję",
      loadingText: "Odnawianie...",
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
        title: "Brak dostępu",
        description: "Klucz API nie ma uprawnień do odnawiania licencji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono licencji o podanym ID.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina zgłosiła konflikt.",
      },
      server: {
        title: "Błąd serwera",
        description: "Corvina zwróciła błąd wewnętrzny serwera.",
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
  },
};
