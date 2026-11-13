import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
  tags: {
    models: "Modele",
  },

  get: {
    title: "Skan katalogu modeli",
    titleShort: "Skan katalogu",
    description:
      "Ostatnie porównanie list modeli wszystkich dostawców: nowe modele, których jeszcze nie oferujemy, zmiany cen, usunięte ID i zapowiedziane wyłączenia. Tylko odczyt.",
    success: {
      title: "Skan wczytany",
      description: "Wczytano ostatni skan katalogu modeli.",
    },
  },

  post: {
    title: "Uruchom skan katalogu modeli",
    titleShort: "Uruchom skan",
    description:
      "Pobiera teraz listy modeli i aktualne ceny od wszystkich dostawców, porównuje je z naszymi definicjami, zapisuje raport i wysyła go do skrzynek ops. Nigdy nie zmienia kodu.",
    fields: {
      force: {
        label: "Uruchom mimo świeżego skanu",
        description:
          "Pomija blokadę 5 dni. Bez tej opcji skan młodszy niż 5 dni wraca bez zmian.",
      },
      sendEmail: {
        label: "Wyślij raport mailem",
        description: "Wysyła raport na hi@ i thea@unbottled.ai.",
      },
    },
    success: {
      title: "Skan zakończony",
      description: "Zapisano skan katalogu modeli.",
    },
  },

  response: {
    scan: "Skan",
    report: "Raport",
    history: "Poprzednie skany",
    skipped: "Pominięto (świeży skan)",
    reportText: "Raport",
  },

  widget: {
    back: "Wróć",
    runNow: "Skanuj teraz",
    running: "Skanuję...",
    empty: {
      title: "Jeszcze nie było skanu",
      message:
        "Pierwszy skan ruszy zgodnie z harmonogramem. Uruchom go teraz i zobacz, co zmieniło się u dostawców.",
    },
    skipped:
      'Skan z ostatnich 5 dni już istnieje, więc niczego nie pobrano ponownie. Zaznacz "Uruchom mimo świeżego skanu", żeby wymusić nowy.',
    scannedAt: "Zeskanowano",
    newSince: "Nowe od",
    emailedTo: "Wysłano do",
    notEmailed: "Nie wysłano",
    emailError: "Wysyłka nie powiodła się",
    metrics: {
      newModels: "Nowe modele",
      uncensored: "Wyglądają na bez cenzury",
      priceChanges: "Zmiany cen",
      missing: "Zniknęły u dostawcy",
      deprecations: "Zapowiedziane wyłączenia",
      sourceErrors: "Błędne źródła",
    },
    sections: {
      newModels: "Nowe modele u dostawców",
      priceChanges: "Zmiany cen i kontekstu",
      missing: "Usunięte u dostawcy",
      deprecations: "Zapowiedziane wyłączenia",
      sources: "Źródła",
      history: "Poprzednie skany",
    },
    legacy: "legacy",
    suspect: "podejrzane, sprawdź fetcher",
    uncensored: "bez cenzury",
    ok: "ok",
    failed: "błąd",
    models: "modeli",
    perMillion: "za 1M",
    context: "kontekst",
    nothing: "Nic tu nie ma.",
  },

  task: {
    name: "Skan katalogu modeli",
    description:
      "Co 5 dni: porównuje listy modeli i ceny dostawców z naszym katalogiem, zapisuje i wysyła raport.",
  },

  errors: {
    scanFailed: "Skan katalogu modeli nie powiódł się: {{error}}",
    loadFailed: "Nie udało się wczytać skanu katalogu modeli: {{error}}",
    server: {
      title: "Błąd serwera",
      description: "Nie udało się dokończyć skanu. Sprawdź logi serwera.",
    },
    network: {
      title: "Błąd sieci",
      description: "Brak połączenia z serwerem.",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Coś poszło nie tak.",
    },
    validation: {
      title: "Nieprawidłowe dane",
      description: "Sprawdź opcje skanu.",
    },
    unauthorized: {
      title: "Nie zalogowano",
      description: "Zaloguj się jako admin, żeby zobaczyć skany katalogu.",
    },
    forbidden: {
      title: "Tylko dla adminów",
      description: "Skany katalogu widzą i uruchamiają tylko admini.",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Brak skanu katalogu.",
    },
    conflict: {
      title: "Konflikt",
      description: "Trwa inny skan. Spróbuj za chwilę.",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Najpierw zapisz lub odrzuć zmiany.",
    },
  },
};
