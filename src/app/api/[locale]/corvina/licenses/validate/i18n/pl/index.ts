export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    licenses: "Licencje",
  },
  get: {
    title: "Sprawdź licencję",
    description: "Weryfikuje kod licencji i zwraca jej szczegóły.",
    licenseCode: {
      label: "Kod licencji",
      description: "Kod licencji do weryfikacji (np. XXXX-YYYY-ZZZZ-AAAA).",
      placeholder: "XXXX-YYYY-ZZZZ-AAAA",
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
      title: "Sprawdź licencję",
      back: "Wróć",
      valid: "Ważna",
      invalid: "Nieważna",
      noResult: "Wpisz kod licencji, aby go sprawdzić.",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Format kodu licencji jest nieprawidłowy.",
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
        description: "Brak uprawnień do weryfikacji licencji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono licencji o podanym kodzie.",
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
      title: "Licencja ważna",
      description: "Kod licencji jest prawidłowy.",
    },
  },
};
