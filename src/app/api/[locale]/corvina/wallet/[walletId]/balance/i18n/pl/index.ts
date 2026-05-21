export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    wallet: "Portfel",
  },
  get: {
    title: "Saldo portfela",
    description: "Pobiera aktualne saldo portfela Corvina.",
    walletId: {
      label: "ID portfela",
      description: "Unikalny identyfikator portfela.",
    },
    response: {
      balance: "Saldo",
    },
    widget: {
      title: "Saldo portfela",
      back: "Wstecz",
      units: "kredytów",
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
        description: "Klucz API nie ma dostępu do tego portfela.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono portfela o podanym ID.",
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
      description: "Saldo portfela pobrane pomyślnie.",
    },
  },
};
