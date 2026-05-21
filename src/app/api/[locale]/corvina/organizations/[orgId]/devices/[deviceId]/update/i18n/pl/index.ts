export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", devices: "Urządzenia" },
  patch: {
    title: "Aktualizuj urządzenie",
    description:
      "Aktualizuje etykietę, opis lub numer seryjny urządzenia Corvina.",
    orgId: {
      label: "ID Organizacji",
      description: "Numeryczne ID organizacji Corvina.",
    },
    deviceId: {
      label: "HW ID urządzenia",
      description: "ID sprzętowe (hwId) urządzenia.",
    },
    label: {
      label: "Etykieta",
      description: "Czytelna etykieta urządzenia.",
      placeholder: "Moje urządzenie",
    },
    descriptionField: {
      label: "Opis",
      description: "Opcjonalny opis urządzenia.",
      placeholder: "Czujnik produkcyjny",
    },
    serialNumber: {
      label: "Numer seryjny",
      description: "Numer seryjny urządzenia.",
      placeholder: "SN-12345",
    },
    response: {
      id: "ID urządzenia",
      label: "Etykieta",
      hwId: "HW ID",
      orgResourceId: "ID zasobu organizacji",
    },
    widget: {
      successTitle: "Urządzenie zaktualizowane",
      successDescription: "Urządzenie zostało pomyślnie zaktualizowane.",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie było nieprawidłowe.",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z Corvina API.",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Sprawdź CORVINA_API_KEY.",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Brak dostępu do edycji urządzenia.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Urządzenie nie istnieje.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina zgłosiła konflikt.",
      },
      server: {
        title: "Błąd serwera",
        description: "Corvina zwróciła błąd serwera.",
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
    success: { title: "Sukces", description: "Urządzenie zaktualizowane." },
  },
};
