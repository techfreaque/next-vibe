export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    subscriptions: "Subskrypcje",
  },
  get: {
    title: "Sprawdź dostępność subskrypcji",
    description:
      "Sprawdza, czy dany zasób jest dostępny w ramach bieżącego limitu subskrypcji.",
    resource: {
      label: "Zasób",
      description: "Typ zasobu do sprawdzenia (wymagane).",
    },
    orgResourceId: {
      label: "ID zasobu organizacji",
      description: "Ogranicz sprawdzenie do konkretnej organizacji.",
    },
    quantity: {
      label: "Ilość",
      description: "Liczba jednostek do sprawdzenia dostępności.",
    },
    response: {
      resourceType: "Typ zasobu",
      available: "Dostępne",
      availableAmount: "Dostępna ilość",
      inDebtSince: "Zadłużenie od",
    },
    widget: {
      title: "Dostępność subskrypcji",
      back: "Wstecz",
      available: "Dostępne",
      unavailable: "Niedostępne",
      units: "jednostek dostępnych",
      inDebt: "Zadłużenie od",
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
        description: "Klucz API nie ma uprawnień do sprawdzania dostępności.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono subskrypcji dla podanego zasobu.",
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
      description: "Dostępność sprawdzona pomyślnie.",
    },
  },
};
