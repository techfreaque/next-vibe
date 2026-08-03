import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Stripe CLI",
  titleShort: "Stripe CLI",
  description: "Odbieraj webhooki Stripe lokalnie",
  category: "Integracja płatności",
  tags: {
    stripe: "Stripe",
    cli: "Linia poleceń",
    webhook: "Webhook",
  },

  form: {
    title: "Stripe CLI",
    description: "Przekazuj zdarzenia webhook Stripe do lokalnego serwera",
    fields: {
      port: {
        label: "Port",
        description:
          "Lokalny port do przekazywania webhook-ów (domyślnie: 3000)",
        placeholder: "3000",
      },
    },
  },

  status: {
    authenticated: "Uwierzytelniony i gotowy",
    not_authenticated: "Nieuwierzytelniony — uruchom 'stripe login'",
    not_installed: "Stripe CLI nie jest zainstalowany. {{instructions}}",
  },

  errors: {
    validation: {
      title: "Nieprawidłowa konfiguracja",
      description: "Sprawdź konfigurację Stripe CLI i spróbuj ponownie",
    },
    network: {
      title: "Błąd sieci",
      description: "Nie można połączyć się ze Stripe",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Brak uprawnień do tej operacji",
    },
    forbidden: {
      title: "Dostęp zabroniony",
      description: "Ta operacja nie jest dozwolona dla Twojego konta",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Stripe CLI nie jest zainstalowany",
    },
    serverError: {
      detail: "Nasłuch Stripe CLI nie powiódł się: {{error}}",
      title: "Błąd serwera",
      description: "Błąd podczas uruchamiania listenera Stripe",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieoczekiwany błąd",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany konfiguracji",
    },
    conflict: {
      title: "Konflikt operacji",
      description: "Inna operacja Stripe jest już w toku",
    },
    execution_failed: "Operacja Stripe CLI nie powiodła się",
    userNotFound: {
      detail: "Nie znaleziono konta dla użytkownika {{userId}}",
      title: "Nie znaleziono użytkownika",
      description: "Określony użytkownik nie został znaleziony",
    },
    customerCreationFailed: {
      detail:
        "Nie udało się utworzyć konta klienta Stripe: {{error}} (użytkownik {{userId}})",
      title: "Tworzenie klienta nie powiodło się",
      description: "Nie udało się utworzyć klienta Stripe",
    },
    customerRetrievalFailed: {
      detail:
        "Nie udało się pobrać danych klienta Stripe: {{error}} (użytkownik {{userId}})",
      title: "Pobieranie klienta nie powiodło się",
      description: "Nie udało się pobrać informacji o kliencie Stripe",
    },
    checkoutCreationFailed: {
      detail: "Nie udało się rozpocząć płatności: {{error}}",
      title: "Tworzenie checkout nie powiodło się",
      description: "Nie udało się utworzyć sesji checkout Stripe",
    },
    webhookVerificationFailed: {
      detail: "Nie udało się zweryfikować webhooka Stripe: {{error}}",
      title: "Weryfikacja webhooka nie powiodła się",
      description: "Nie udało się zweryfikować podpisu webhooka",
    },
    subscriptionRetrievalFailed: {
      detail: "Nie udało się pobrać subskrypcji ze Stripe: {{error}}",
      title: "Pobieranie subskrypcji nie powiodło się",
      description: "Nie udało się pobrać subskrypcji ze Stripe",
    },
    subscriptionCancellationFailed: {
      detail: "Nie udało się anulować subskrypcji: {{error}}",
      title: "Anulowanie subskrypcji nie powiodło się",
      description: "Nie udało się anulować subskrypcji w Stripe",
    },
    priceCreationFailed: {
      detail:
        "Nie udało się utworzyć ceny w Stripe: {{error}} (produkt {{productId}})",
      title: "Tworzenie ceny nie powiodło się",
      description: "Nie udało się utworzyć ceny w Stripe",
    },
    notConfigured: {
      title: "Stripe nie jest skonfigurowany",
      description: "Ustaw STRIPE_SECRET_KEY w pliku .env",
    },
    stripeCliNotInstalled: "Stripe CLI nie jest zainstalowany",
    listenerFailed: "Nie udało się uruchomić nasłuchiwacza webhook Stripe",
  },

  success: {
    title: "Listener uruchomiony",
    description: "Stripe CLI nasłuchuje webhook-ów",
  },
};
