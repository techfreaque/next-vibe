export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", alarms: "Alarmy" },
  post: {
    title: "Akcja na alarmie",
    description: "Potwierdź, zresetuj lub usuń pojedynczy alarm Corvina.",
    alarmId: {
      label: "ID alarmu",
      description: "ID alarmu, na którym ma być wykonana akcja.",
      placeholder: "np. alarm-001",
    },
    type: {
      label: "Akcja",
      description: "Akcja do wykonania na alarmie.",
    },
    comment: {
      label: "Komentarz",
      description: "Opcjonalny komentarz do akcji.",
      placeholder: "Dodaj notatkę…",
    },
    response: {
      success: "Wynik",
      message: "Komunikat",
    },
    widget: {
      successTitle: "Akcja wykonana",
      successDescription: "Akcja na alarmie została pomyślnie wykonana.",
      submitButton: "Wykonaj",
      submitLoading: "Wykonywanie…",
      back: "Wstecz",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Sprawdź ID alarmu i typ akcji.",
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
        description: "Brak uprawnień do tej akcji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Alarm nie istnieje.",
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
      description: "Akcja na alarmie wykonana.",
    },
  },
};
