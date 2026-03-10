export const translations = {
  category: "Leady",
  tag: "Łączenie po IP",
  task: {
    description:
      "Skanuj anonimowe leady z tym samym adresem IP i łącz je jako tę samą osobę",
  },
  post: {
    title: "Łączenie po IP",
    description: "Łącz anonimowe leady dzielące ten sam adres IP",
    container: {
      title: "Łączenie po IP",
      description:
        "Znajduje anonimowe leady z pasującymi IP utworzone w oknie czasowym i łączy je",
    },
    fields: {
      dryRun: {
        label: "Próbny przebieg",
        description: "Uruchom bez wprowadzania zmian",
      },
      windowDays: {
        label: "Okno (dni)",
        description:
          "Dopasuj tylko leady utworzone w tej liczbie dni od siebie",
      },
    },
    response: {
      pairsFound: "Znalezione pary",
      pairsLinked: "Powiązane pary",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas łączenia po IP",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
    },
    success: {
      title: "Łączenie po IP zakończone",
      description: "Leady z pasującym IP zostały pomyślnie powiązane",
    },
  },
};
