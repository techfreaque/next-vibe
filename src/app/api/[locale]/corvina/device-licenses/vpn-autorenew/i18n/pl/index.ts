export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Licencje urządzeń",
  },
  put: {
    title: "Zarządzaj auto-odnowieniem VPN",
    description:
      "Włącza lub wyłącza automatyczne odnawianie VPN dla licencji urządzenia i konfiguruje okres odnowienia.",
    logicalId: {
      label: "Identyfikator logiczny",
      description:
        "Identyfikator logiczny urządzenia, dla którego aktualizowane jest auto-odnawianie VPN.",
      placeholder: "device-logical-id",
    },
    orgResourceId: {
      label: "ID zasobu organizacji",
      description:
        "Organizacja, w której ma zostać przeprowadzona aktualizacja.",
      placeholder: "org.resource.id",
    },
    numOfSeconds: {
      label: "Czas trwania (sekundy)",
      description: "Liczba sekund dla każdego okresu odnowienia VPN.",
      placeholder: "2592000",
    },
    autorenew: {
      label: "Auto-odnawianie włączone",
      description: "Czy VPN będzie automatycznie odnawiany po wygaśnięciu.",
    },
    response: {
      id: "ID",
      logicalId: "Identyfikator logiczny",
      serialNumber: "Numer seryjny",
      clientName: "Nazwa klienta",
      orgResourceId: "ID zasobu organizacji",
      activationKey: "Klucz aktywacji",
      fromDateVpn: "VPN od",
      toDateVpn: "VPN do",
      activationDate: "Data aktywacji",
      vpnValidityMonths: "Ważność VPN (miesiące)",
      numOfSecondsAutoRenewVpn: "Auto-odnawianie (sekundy)",
      used: "Użyty",
      deleted: "Usunięty",
    },
    widget: {
      title: "Auto-odnawianie VPN",
      back: "Wstecz",
    },
    submitButton: {
      label: "Aktualizuj auto-odnawianie",
      loadingText: "Aktualizowanie...",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description:
          "Żądanie jest nieprawidłowe. Sprawdź logicalId i numOfSeconds.",
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
        title: "Brak dostępu",
        description: "Brak uprawnień do zarządzania VPN urządzenia.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono licencji urządzenia.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina zgłosiła konflikt.",
      },
      server: {
        title: "Błąd serwera",
        description: "Corvina zwróciła błąd wewnętrzny serwera.",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd.",
      },
    },
    success: {
      title: "Auto-odnawianie zaktualizowane",
      description: "Ustawienia auto-odnawiania VPN zaktualizowane pomyślnie.",
    },
  },
};
