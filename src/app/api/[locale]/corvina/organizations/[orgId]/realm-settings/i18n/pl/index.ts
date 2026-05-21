export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizacje",
    realmSettings: "Ustawienia realm",
  },
  get: {
    title: "Pobierz ustawienia realm",
    description:
      "Pobiera ustawienia głębokości konfiguracji realm organizacji.",
    orgId: {
      label: "ID organizacji",
      description: "Liczbowy identyfikator organizacji Corvina.",
    },
    response: {
      configDealerMaxDepth: "Maks. głębokość dealera",
      configHostnameMaxDepth: "Maks. głębokość hostname",
      configOwnResourcesMaxDepth: "Maks. głębokość własnych zasobów",
      configIotMaxDepth: "Maks. głębokość IoT",
      configVpnMaxDepth: "Maks. głębokość VPN",
      configStoreMaxDepth: "Maks. głębokość sklepu",
      configIpFilteringMaxDepth: "Maks. głębokość filtrowania IP",
      configPrivateAccessMaxDepth: "Maks. głębokość prywatnego dostępu",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie było nieprawidłowe.",
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
        description: "Brak dostępu do ustawień realm.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Organizacja o tym ID nie istnieje.",
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
        description: "Występują niezapisane zmiany.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd.",
      },
    },
    success: {
      title: "Sukces",
      description: "Ustawienia realm pobrane pomyślnie.",
    },
  },
  put: {
    title: "Aktualizuj ustawienia realm",
    description:
      "Aktualizuje ustawienia głębokości konfiguracji realm organizacji.",
    orgId: {
      label: "ID organizacji",
      description: "Liczbowy identyfikator organizacji Corvina.",
    },
    configDealerMaxDepth: {
      label: "Maks. głębokość dealera",
      description: "Maksymalna głębokość hierarchii dealerów.",
    },
    configHostnameMaxDepth: {
      label: "Maks. głębokość hostname",
      description: "Maksymalna głębokość hierarchii hostname.",
    },
    configOwnResourcesMaxDepth: {
      label: "Maks. głębokość własnych zasobów",
      description: "Maksymalna głębokość własnych zasobów.",
    },
    configIotMaxDepth: {
      label: "Maks. głębokość IoT",
      description: "Maksymalna głębokość urządzeń IoT.",
    },
    configVpnMaxDepth: {
      label: "Maks. głębokość VPN",
      description: "Maksymalna głębokość konfiguracji VPN.",
    },
    configStoreMaxDepth: {
      label: "Maks. głębokość sklepu",
      description: "Maksymalna głębokość hierarchii sklepu.",
    },
    configIpFilteringMaxDepth: {
      label: "Maks. głębokość filtrowania IP",
      description: "Maksymalna głębokość reguł filtrowania IP.",
    },
    configPrivateAccessMaxDepth: {
      label: "Maks. głębokość prywatnego dostępu",
      description: "Maksymalna głębokość prywatnego dostępu.",
    },
    response: {
      configDealerMaxDepth: "Maks. głębokość dealera",
      configHostnameMaxDepth: "Maks. głębokość hostname",
      configOwnResourcesMaxDepth: "Maks. głębokość własnych zasobów",
      configIotMaxDepth: "Maks. głębokość IoT",
      configVpnMaxDepth: "Maks. głębokość VPN",
      configStoreMaxDepth: "Maks. głębokość sklepu",
      configIpFilteringMaxDepth: "Maks. głębokość filtrowania IP",
      configPrivateAccessMaxDepth: "Maks. głębokość prywatnego dostępu",
    },
    submitButton: { label: "Zapisz ustawienia", loadingText: "Zapisywanie…" },
    errors: {
      validation: {
        title: "Nieprawidłowa aktualizacja",
        description: "Corvina odrzuciła aktualizację.",
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
        description: "Brak dostępu do zapisu ustawień realm.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Organizacja o tym ID nie istnieje.",
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
        description: "Występują niezapisane zmiany.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd.",
      },
    },
    success: {
      title: "Zapisano",
      description: "Ustawienia realm zaktualizowane pomyślnie.",
    },
  },
};
