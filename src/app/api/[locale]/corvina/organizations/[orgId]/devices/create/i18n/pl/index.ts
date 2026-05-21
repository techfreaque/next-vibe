export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", devices: "Urządzenia" },
  post: {
    title: "Dodaj urządzenie",
    description: "Dodaje nowe urządzenie do organizacji Corvina.",
    orgId: {
      label: "ID Organizacji",
      description: "Numeryczne ID organizacji Corvina.",
    },
    name: {
      label: "Nazwa urządzenia",
      description: "Unikalna nazwa maszynowa.",
      placeholder: "moje-urzadzenie-01",
    },
    label: {
      label: "Etykieta",
      description: "Wyświetlana nazwa urządzenia.",
      placeholder: "Moje urządzenie",
    },
    response: { deviceId: "ID Urządzenia", name: "Nazwa", label: "Etykieta" },
    submitButton: { label: "Dodaj urządzenie", loadingText: "Dodawanie…" },
    backButton: { label: "Anuluj" },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Sprawdź format nazwy urządzenia.",
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
        description: "Brak dostępu do zapisu organizacji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Organizacja nie istnieje.",
      },
      conflict: {
        title: "Już istnieje",
        description: "Urządzenie o tej nazwie już istnieje.",
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
    widget: {
      added: "Urządzenie dodane",
      registeredSuccessfully: "Urządzenie zostało zarejestrowane.",
      backToDevices: "Wróć do urządzeń",
      deviceInfo: "Dane urządzenia",
    },
    success: {
      title: "Urządzenie dodane",
      description: "Urządzenie zostało pomyślnie utworzone.",
    },
  },
};
