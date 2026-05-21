export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", wallet: "Portfel" },
  post: {
    title: "Zasil portfel",
    description: "Przenosi kredyty z subskrypcji do portfela.",
    walletId: {
      label: "ID docelowego portfela",
      description: "Portfel, który ma zostać zasilony.",
      placeholder: "moj-portfel-01",
    },
    orderId: {
      label: "ID zamówienia",
      description: "Unikalny identyfikator tego zlecenia transferu.",
      placeholder: "zamowienie-12345",
    },
    ordinal: {
      label: "Numer porządkowy",
      description: "Numer sekwencji zamówienia (opcjonalny).",
      placeholder: "1",
    },
    authorizedBy: {
      label: "Autoryzowane przez",
      description: "Kto autoryzował ten transfer.",
      placeholder: "admin@przyklad.pl",
    },
    amount: {
      label: "Kwota",
      description: "Liczba kredytów do przeniesienia.",
      placeholder: "100",
    },
    sourceOrgResourceId: {
      label: "ID org. źródłowej",
      description: "ID zasobu organizacji źródłowej.",
      placeholder: "org.zasob.id",
    },
    sourceWalletId: {
      label: "ID portfela źródłowego",
      description:
        "Portfel, z którego mają być pobrane środki (jeśli dotyczy).",
      placeholder: "portfel-zrodlowy-01",
    },
    transferDescription: {
      label: "Opis",
      description: "Opcjonalny opis tego transferu.",
      placeholder: "Miesięczne doładowanie subskrypcji",
    },
    transactionSubjectType: {
      label: "Typ przedmiotu",
      description: "Typ przedmiotu transakcji.",
      placeholder: "subskrypcja",
    },
    transactionSubjectRef: {
      label: "Odniesienie do przedmiotu",
      description: "Odniesienie do przedmiotu transakcji.",
      placeholder: "sub-123",
    },
    transactionSubjectQuantity: {
      label: "Ilość przedmiotu",
      description: "Ilość przedmiotu transakcji.",
      placeholder: "1",
    },
    nextRenewalDate: {
      label: "Data następnego odnowienia",
      description: "Data kolejnego odnowienia.",
      placeholder: "2025-12-31",
    },
    submitButton: { label: "Zasil portfel", loadingText: "Przetwarzanie..." },
    response: {
      id: "ID transakcji",
      errorCode: "Kod błędu",
      executionResult: "Wynik",
      failureReason: "Przyczyna niepowodzenia",
      createdAt: "Utworzono",
      issuedBy: "Wystawione przez",
      targetWalletId: "Portfel docelowy",
      txDescription: "Opis",
      orderId: "ID zamówienia",
      ordinal: "Numer porządkowy",
      authorizedBy: "Autoryzowane przez",
      amount: "Kwota",
      sourceOrgResourceId: "Org. źródłowa",
      sourceWalletId: "Portfel źródłowy",
    },
    widget: {
      title: "Zasil portfel",
      back: "Wstecz",
      resultTitle: "Transfer zakończony",
      success: "Kredyty zostały pomyślnie przeniesione.",
      failed: "Transfer nie powiódł się.",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie transferu jest nieprawidłowe.",
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
        description: "Brak uprawnień do zasilenia tego portfela.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Portfel nie został znaleziony.",
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
      title: "Kredyty przeniesione",
      description: "Kredyty zostały pomyślnie przeniesione do portfela.",
    },
  },
};
