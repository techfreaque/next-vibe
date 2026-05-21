export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    wallet: "Portfel",
  },
  post: {
    title: "Przelew środków",
    description:
      "Przenosi środki między dwoma portfelami na platformie Corvina.",
    sourceWalletId: {
      label: "ID portfela źródłowego",
      description: "Portfel, z którego zostaną pobrane środki.",
      placeholder: "portfel-zrodlowy-01",
    },
    targetWalletId: {
      label: "ID portfela docelowego",
      description: "Portfel, na który trafią środki.",
      placeholder: "portfel-docelowy-01",
    },
    amount: {
      label: "Kwota",
      description: "Liczba kredytów do przelania.",
      placeholder: "100",
    },
    orderId: {
      label: "ID zamówienia",
      description: "Unikalny identyfikator tego przelewu.",
      placeholder: "zamowienie-12345",
    },
    ordinal: {
      label: "Numer kolejny",
      description: "Numer sekwencyjny zamówienia (opcjonalny).",
      placeholder: "1",
    },
    authorizedBy: {
      label: "Autoryzowane przez",
      description: "Kto autoryzował ten przelew.",
      placeholder: "admin@example.com",
    },
    sourceOrgResourceId: {
      label: "ID organizacji źródłowej",
      description: "ID zasobu organizacji źródłowej.",
      placeholder: "org.zasob.id",
    },
    transferDescription: {
      label: "Opis",
      description: "Opcjonalny opis przelewu.",
      placeholder: "Bilansowanie portfeli",
    },
    submitButton: {
      label: "Przelej środki",
      loadingText: "Przelewanie...",
    },
    response: {
      id: "ID transakcji",
      errorCode: "Kod błędu",
      executionResult: "Wynik",
      failureReason: "Przyczyna błędu",
      createdAt: "Utworzono",
      issuedBy: "Wystawione przez",
      sourceWalletId: "Portfel źródłowy",
      targetWalletId: "Portfel docelowy",
      amount: "Kwota",
      orderId: "ID zamówienia",
      ordinal: "Numer kolejny",
      authorizedBy: "Autoryzowane przez",
      sourceOrgResourceId: "Org źródłowa",
    },
    widget: {
      title: "Przelew środków",
      back: "Wstecz",
      resultTitle: "Przelew zakończony",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie przelewu jest nieprawidłowe.",
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
        description: "Brak uprawnień do transferu między tymi portfelami.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Jeden z portfeli nie został znaleziony.",
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
      title: "Przelew zakończony",
      description: "Środki zostały pomyślnie przelane.",
    },
  },
};
