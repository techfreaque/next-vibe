export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    wallet: "Portfel",
  },
  post: {
    title: "Utwórz portfel",
    description: "Tworzy nowy portfel na platformie Corvina.",
    id: {
      label: "ID portfela",
      description:
        "Opcjonalne własne ID portfela. Musi pasować do wzorca: małe litery, myślniki, znaki alfanumeryczne (np. moj-portfel-01).",
      placeholder: "moj-portfel-01",
    },
    type: {
      label: "Typ",
      description: "Typ portfela: GENERIC do ogólnego użytku, APP dla portfeli powiązanych z aplikacją.",
      placeholder: "Wybierz typ",
    },
    description: {
      label: "Opis",
      description: "Czytelny opis tego portfela.",
      placeholder: "Produkcyjny portfel płatności",
    },
    webhookUrl: {
      label: "URL webhooka",
      description: "URL do odbierania powiadomień o zdarzeniach portfela.",
      placeholder: "https://przyklad.pl/webhook",
    },
    submitButton: {
      label: "Utwórz portfel",
      loadingText: "Tworzenie...",
    },
    response: {
      id: "ID portfela",
      type: "Typ",
      description: "Opis",
      webhookUrl: "URL webhooka",
    },
    widget: {
      title: "Utwórz portfel",
      resultTitle: "Portfel utworzony",
      idLabel: "ID",
      typeLabel: "Typ",
      descriptionLabel: "Opis",
      webhookLabel: "URL webhooka",
      back: "Wstecz",
      noType: "Brak typu",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie utworzenia portfela jest nieprawidłowe.",
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
        description: "Klucz API nie ma uprawnień do tworzenia portfeli.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony.",
      },
      conflict: {
        title: "Konflikt",
        description: "Portfel z tym ID już istnieje.",
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
      title: "Portfel utworzony",
      description: "Portfel został pomyślnie utworzony.",
    },
  },
};
