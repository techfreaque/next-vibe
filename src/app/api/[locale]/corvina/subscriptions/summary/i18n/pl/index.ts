export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    subscriptions: "Subskrypcje",
  },
  get: {
    title: "Podsumowanie subskrypcji",
    description:
      "Pobiera podsumowanie subskrypcji pogrupowane według licencji wraz z podziałem zasobów.",
    orgResourceId: {
      label: "ID zasobu organizacji",
      description: "Filtruj po ID zasobu organizacji.",
    },
    includeExpired: {
      label: "Uwzględnij wygasłe",
      description: "Po włączeniu uwzględnia wygasłe subskrypcje w wynikach.",
    },
    response: {
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
      title: "Podsumowanie subskrypcji",
      noItemsFound: "Nie znaleziono podsumowań subskrypcji.",
      back: "Wstecz",
      resources: "Zasoby",
      trial: "Próbna",
      autorenewSymbol: "↻",
      compact: {
        exp: "wyg.:",
        autorenew: "odnow.:",
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
        description: "Klucz API nie ma uprawnień do podsumowań subskrypcji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono podsumowań subskrypcji.",
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
      description: "Podsumowanie subskrypcji pobrane pomyślnie.",
    },
  },
};
