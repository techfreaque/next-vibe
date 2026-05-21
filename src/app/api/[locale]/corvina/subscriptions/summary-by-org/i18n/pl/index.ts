export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    subscriptions: "Subskrypcje",
  },
  get: {
    title: "Podsumowanie subskrypcji wg organizacji",
    description:
      "Pobiera stronicowaną listę podsumowań subskrypcji pogrupowanych według organizacji.",
    createdByOrgResourceId: {
      label: "ID zasobu nadrzędnej organizacji",
      description: "ID zasobu nadrzędnej organizacji (wymagane).",
    },
    page: {
      label: "Strona",
      description: "Numer strony (od zera).",
    },
    pageSize: {
      label: "Rozmiar strony",
      description: "Liczba wyników na stronie.",
    },
    expired: {
      label: "Wygasłe",
      description: "Gdy ustawione, filtruje według statusu wygaśnięcia.",
    },
    search: {
      label: "Szukaj",
      description: "Fraza wyszukiwania do filtrowania wyników.",
    },
    response: {
      total: "Łącznie",
      totalPages: "Stron łącznie",
      currentPage: "Bieżąca strona",
      items: {
        orgResourceId: "ID zasobu organizacji",
        licenseId: "ID licencji",
        productCode: "Kod produktu",
        productLabel: "Produkt",
        productType: "Typ",
        licenseCode: "Kod licencji",
        currency: "Waluta",
        price: "Cena",
        autorenew: "Automatyczne odnawianie",
        trial: "Wersja próbna",
        expirationDate: "Data wygaśnięcia",
        activationDate: "Data aktywacji",
        creationDate: "Data utworzenia",
        resources: {
          resourceType: "Typ zasobu",
          quantity: "Ilość",
          used: "Użyte",
          expired: "Wygasłe",
        },
      },
    },
    widget: {
      title: "Subskrypcje wg organizacji",
      noItemsFound: "Nie znaleziono podsumowań subskrypcji.",
      back: "Wstecz",
      trial: "Próbna",
      autorenewSymbol: "↻",
      compact: {
        exp: "wyg.:",
        separator: "·",
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
        description:
          "Klucz API nie ma uprawnień do podsumowań subskrypcji organizacji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description:
          "Nie znaleziono podsumowań subskrypcji dla podanej organizacji.",
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
      description: "Podsumowania subskrypcji wg organizacji pobrane pomyślnie.",
    },
  },
};
