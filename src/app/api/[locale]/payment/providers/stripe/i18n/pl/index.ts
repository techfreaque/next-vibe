import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Integracja Stripe CLI",
  description: "Zarządzanie operacjami Stripe CLI i nasłuchiwaniem webhook-ów",
  category: "Integracja płatności",
  tags: {
    stripe: "Stripe",
    cli: "Linia poleceń",
    webhook: "Webhook",
  },

  operations: {
    check: "Sprawdź instalację",
    install: "Zainstaluj Stripe CLI",
    listen: "Uruchom nasłuchiwanie webhook-ów",
    login: "Zaloguj się do Stripe",
    status: "Sprawdź status",
  },

  form: {
    title: "Konfiguracja Stripe CLI",
    description: "Konfiguruj operacje Stripe CLI i ustawienia webhook-ów",
    fields: {
      operation: {
        label: "Typ operacji",
        description: "Wybierz operację Stripe CLI do wykonania",
        placeholder: "Wybierz operację...",
      },
      port: {
        label: "Numer portu",
        description: "Numer portu do przekazywania webhook-ów (1000-65535)",
        placeholder: "4242",
      },
      events: {
        label: "Zdarzenia webhook-ów",
        description: "Wybierz zdarzenia Stripe do nasłuchiwania",
        placeholder: "Wybierz zdarzenia do monitorowania...",
        paymentIntentSucceeded: "Płatność zakończona sukcesem",
        paymentIntentFailed: "Płatność nie powiodła się",
        subscriptionCreated: "Subskrypcja utworzona",
        subscriptionUpdated: "Subskrypcja zaktualizowana",
        invoicePaymentSucceeded: "Płatność faktury zakończona sukcesem",
        invoicePaymentFailed: "Płatność faktury nie powiodła się",
      },
      forwardTo: {
        label: "Przekaż do URL",
        description: "Lokalny endpoint do przekazywania zdarzeń webhook",
        placeholder: "localhost:3000/api/webhooks/stripe",
      },
      skipSslVerify: {
        label: "Pomiń weryfikację SSL",
        description: "Pomiń weryfikację certyfikatu SSL w rozwoju",
      },
    },
  },

  response: {
    success: "Operacja zakończona pomyślnie",
    installed: "Status instalacji Stripe CLI",
    version: "Zainstalowana wersja Stripe CLI",
    status: "Aktualny status operacji",
    output: "Wyjście polecenia i logi",
    instructions: "Następne kroki i instrukcje",
    webhookEndpoint: "URL endpoint-u webhook",
  },

  login: {
    instructions:
      "Aby uwierzytelnić się w Stripe, uruchom 'stripe login' w terminalu i postępuj zgodnie z instrukcjami, aby połączyć swoje konto Stripe.",
  },

  status: {
    authenticated: "Uwierzytelniony i gotowy",
    not_authenticated: "Nieuwierzytelniony - uruchom 'stripe login'",
    not_installed: "Stripe CLI nie jest zainstalowany",
  },

  errors: {
    validation: {
      title: "Nieprawidłowa konfiguracja",
      description: "Sprawdź konfigurację Stripe CLI i spróbuj ponownie",
    },
    network: {
      title: "Błąd sieci",
      description: "Nie można połączyć się z usługami Stripe",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do wykonania tej operacji",
    },
    forbidden: {
      title: "Dostęp zabroniony",
      description: "Ta operacja nie jest dozwolona dla Twojego konta",
    },
    notFound: {
      title: "Zasób nie znaleziony",
      description: "Żądany zasób Stripe nie został znaleziony",
    },
    serverError: {
      title: "Błąd serwera",
      description: "Wystąpił błąd podczas przetwarzania operacji Stripe",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieoczekiwany błąd z Stripe CLI",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany konfiguracji",
    },
    conflict: {
      title: "Konflikt operacji",
      description: "Inna operacja Stripe jest obecnie w toku",
    },
    execution_failed: "Operacja Stripe CLI nie mogła być prawidłowo wykonana",
    userNotFound: {
      title: "Nie znaleziono użytkownika",
      description: "Określony użytkownik nie został znaleziony",
    },
    customerCreationFailed: {
      title: "Tworzenie klienta nie powiodło się",
      description: "Nie udało się utworzyć klienta Stripe",
    },
    checkoutCreationFailed: {
      title: "Tworzenie checkout nie powiodło się",
      description: "Nie udało się utworzyć sesji checkout Stripe",
    },
    webhookVerificationFailed: {
      title: "Weryfikacja webhooka nie powiodła się",
      description: "Nie udało się zweryfikować podpisu webhooka",
    },
    subscriptionRetrievalFailed: {
      title: "Pobieranie subskrypcji nie powiodło się",
      description: "Nie udało się pobrać subskrypcji ze Stripe",
    },
    subscriptionCancellationFailed: {
      title: "Anulowanie subskrypcji nie powiodło się",
      description: "Nie udało się anulować subskrypcji w Stripe",
    },
    priceCreationFailed: {
      title: "Tworzenie ceny nie powiodło się",
      description: "Nie udało się utworzyć ceny w Stripe",
    },
  },

  success: {
    title: "Operacja pomyślna",
    description: "Operacja Stripe CLI zakończona pomyślnie",
  },

  installInstructions: {
    documentation:
      "Zainstaluj Stripe CLI zgodnie z oficjalną dokumentacją pod adresem: https://docs.stripe.com/stripe-cli",
    quickInstallation: "Szybkie opcje instalacji:",
    macOS: {
      title: "macOS (używając Homebrew):",
      command: "brew install stripe/stripe-cli/stripe",
    },
    linux: {
      title: "Linux (używając menedżera pakietów):",
      debian: {
        title: "Debian/Ubuntu",
      },
      fedora: {
        title: "CentOS/RHEL/Fedora",
      },
    },
    windows: {
      title: "Windows:",
      scoop: {
        title: "Używając Scoop",
      },
      github: {
        title: "Lub pobierz bezpośrednio z GitHub releases:",
        url: "https://github.com/stripe/stripe-cli/releases",
      },
    },
    authentication: {
      title: "Po instalacji uwierzytelnij się za pomocą:",
      command: "stripe login",
    },
  },
};
