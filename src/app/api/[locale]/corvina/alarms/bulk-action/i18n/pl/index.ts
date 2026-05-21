export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", alarms: "Alarmy" },
  post: {
    title: "Masowa akcja na alarmach",
    description:
      "Potwierdź, zresetuj lub usuń wszystkie alarmy pasujące do filtru.",
    type: {
      label: "Akcja",
      description: "Masowa akcja do wykonania.",
    },
    filter: {
      label: "Filtr",
      description: "Wyrażenie OData do wyboru alarmów.",
      placeholder: "np. severity gt 3",
    },
    scopedOrganization: {
      label: "Organizacja",
      description: "Ogranicz akcję do konkretnego ID zasobu organizacji.",
      placeholder: "np. exorde.connex.acme",
    },
    deviceName: {
      label: "Nazwa urządzenia",
      description: "Ogranicz akcję do alarmów z tego urządzenia.",
      placeholder: "np. moje-urządzenie",
    },
    comment: {
      label: "Komentarz",
      description: "Opcjonalny komentarz do masowej akcji.",
      placeholder: "Dodaj notatkę…",
    },
    response: {
      success: "Wynik",
      message: "Komunikat",
    },
    widget: {
      successTitle: "Masowa akcja wykonana",
      successDescription:
        "Masowa akcja na alarmach została pomyślnie wykonana.",
      submitButton: "Wykonaj masową akcję",
      submitLoading: "Wykonywanie…",
      back: "Wstecz",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Sprawdź typ akcji i filtr.",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z Corvina Platform API.",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Sprawdź CORVINA_API_KEY.",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Brak uprawnień do masowych akcji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Endpoint masowej akcji nie istnieje.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina zgłosiła konflikt.",
      },
      server: {
        title: "Błąd serwera",
        description: "Corvina Platform API zwróciła błąd serwera.",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd.",
      },
    },
    success: {
      title: "Sukces",
      description: "Masowa akcja na alarmach wykonana.",
    },
  },
};
