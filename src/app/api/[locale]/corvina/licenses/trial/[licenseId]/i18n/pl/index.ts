export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    licenses: "Licencje",
  },
  delete: {
    title: "Usuń licencję próbną",
    description: "Trwale usuwa licencję próbną po identyfikatorze.",
    licenseId: {
      label: "ID licencji",
      description: "Numeryczny identyfikator licencji próbnej do usunięcia.",
    },
    response: {
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
      title: "Usuń licencję próbną",
      back: "Wróć",
    },
    submitButton: {
      label: "Usuń wersję próbną",
      loadingText: "Usuwanie...",
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
        description:
          "Klucz API nie ma uprawnień do usuwania licencji próbnych.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie istnieje licencja próbna o podanym ID.",
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
      description: "Licencja próbna usunięta pomyślnie.",
    },
  },
};
