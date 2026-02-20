export const translations = {
  post: {
    title: "Testuj połączenie SSH",
    description: "Testuj połączenie z serwerem SSH",
    fields: {
      connectionId: {
        label: "ID połączenia",
        description: "Połączenie SSH do testowania",
        placeholder: "",
      },
      acknowledgeNewFingerprint: {
        label: "Potwierdź nowy fingerprint",
        description: "Zaakceptuj zmianę fingerprintu",
        placeholder: "",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagany dostęp administratora",
      },
      forbidden: { title: "Zabronione", description: "Brak uprawnień" },
      server: { title: "Błąd serwera", description: "Test nie powiódł się" },
      notFound: {
        title: "Nie znaleziono",
        description: "Połączenie nie znalezione",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: { title: "Niezapisane zmiany" },
      conflict: {
        title: "Fingerprint zmieniony",
        description: "Fingerprint serwera zmienił się od ostatniego połączenia",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można dotrzeć do serwera SSH",
      },
      timeout: {
        title: "Timeout",
        description: "Połączenie przekroczyło limit czasu",
      },
    },
    success: {
      title: "Połączenie udane",
      description: "Test połączenia SSH przeszedł pomyślnie",
    },
  },
  widget: {
    title: "Testuj połączenie",
    testButton: "Testuj teraz",
    testing: "Testowanie...",
    successLabel: "Połączono",
    failedLabel: "Nieudane",
    latencyLabel: "Opóźnienie",
    fingerprintLabel: "Fingerprint",
  },
};
