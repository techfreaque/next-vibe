export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    licenses: "Licencje",
  },
  post: {
    title: "Utwórz licencję próbną",
    description: "Tworzy licencję próbną dla podanego urządzenia.",
    deviceLicense: {
      label: "Klucz licencji urządzenia",
      description:
        "Klucz licencji urządzenia, dla którego zostanie aktywowana wersja próbna.",
      placeholder: "XXXX-YYYY-ZZZZ-AAAA",
    },
    targetOrganization: {
      label: "Organizacja docelowa",
      description:
        "ID zasobu organizacji, która otrzymuje licencję próbną (opcjonalne).",
      placeholder: "exorde.connex.connectika",
    },
    ownerOrganization: {
      label: "Organizacja właściciel",
      description:
        "ID zasobu organizacji będącej właścicielem licencji próbnej (opcjonalne).",
      placeholder: "exorde.connex.connectika",
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
      title: "Utwórz licencję próbną",
      back: "Wróć",
      resultTitle: "Licencja próbna utworzona",
    },
    submitButton: {
      label: "Utwórz wersję próbną",
      loadingText: "Tworzenie...",
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
          "Klucz API nie ma uprawnień do tworzenia licencji próbnych.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono licencji urządzenia.",
      },
      conflict: {
        title: "Konflikt",
        description: "Licencja próbna dla tego urządzenia już istnieje.",
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
      title: "Licencja próbna utworzona",
      description: "Licencja próbna została pomyślnie utworzona.",
    },
  },
};
