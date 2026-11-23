import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Import checkout translations
  checkout: {
    // Main checkout titles and descriptions
    title: "Utwórz płatność subskrypcji",
    description: "Utwórz sesję płatności Stripe dla subskrypcji",
    category: "Subskrypcja",

    // Tags
    tags: {
      subscription: "subskrypcja",
      checkout: "płatność",
      stripe: "stripe",
    },

    // Form configuration
    form: {
      title: "Konfiguracja płatności",
      description: "Skonfiguruj parametry sesji płatności",
      fields: {
        planId: {
          label: "Plan subskrypcji",
          description: "Wybierz plan subskrypcji",
          placeholder: "Wybierz plan",
        },
        billingInterval: {
          label: "Okres rozliczeniowy",
          description: "Wybierz częstotliwość rozliczeń",
          placeholder: "Wybierz okres rozliczeniowy",
        },
        provider: {
          label: "Dostawca płatności",
          description: "Wybierz sposób płatności",
          placeholder: "Wybierz dostawcę płatności",
        },
        metadata: {
          label: "Metadane",
          description: "Dodatkowe metadane dla sesji płatności",
          placeholder: "Wprowadź metadane jako JSON",
        },
      },
    },

    // Response fields
    response: {
      success: "Sesja płatności utworzona pomyślnie",
      sessionId: "ID sesji Stripe",
      checkoutUrl: "URL płatności",
      message: "Wiadomość o statusie",
    },

    // Error types
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      network: {
        title: "Błąd sieci",
        description: "Błąd połączenia sieciowego",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony",
      },
      serverError: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
    },

    // Success types
    success: {
      title: "Sukces",
      description: "Sesja płatności utworzona pomyślnie",
    },

    // POST endpoint specific translations
    post: {
      title: "Utwórz sesję płatności",
      description: "Utwórz nową sesję płatności subskrypcji",
      form: {
        title: "Konfiguracja sesji płatności",
        description: "Skonfiguruj parametry sesji płatności",
      },
      response: {
        title: "Odpowiedź płatności",
        description: "Dane odpowiedzi sesji płatności",
      },
      errors: {
        alreadySubscribed: {
          title: "Już subskrybowany",
          description: "Masz już aktywną subskrypcję",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry płatności",
          reason: {
            enterpriseCustomPricing:
              "Plan ENTERPRISE wymaga indywidualnej wyceny",
          },
        },
        network: {
          title: "Błąd sieci",
          description: "Błąd połączenia sieciowego",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagana autoryzacja",
        },
        forbidden: {
          title: "Zabronione",
          description: "Dostęp zabroniony",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Sesja płatności nie została znaleziona",
        },
        server: {
          title: "Błąd serwera",
          description: "Wystąpił wewnętrzny błąd serwera",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieznany błąd",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
        conflict: {
          title: "Konflikt",
          description: "Wystąpił konflikt danych",
        },
      },
      success: {
        title: "Sukces",
        description: "Sesja płatności utworzona pomyślnie",
      },
    },

    // General error message
    error: "Wystąpił błąd podczas płatności",

    // Subscription plan labels
    plans: {
      starter: {
        title: "Starter",
      },
    },

    // Billing interval labels
    billing: {
      monthly: "Miesięcznie",
      yearly: "Rocznie",
    },
  },

  // Main subscription domain
  category: "Rozliczenia",

  // Tags
  tags: {
    subscription: "subskrypcja",
    billing: "rozliczenia",
    get: "pobierz",
    create: "utwórz",
    update: "aktualizuj",
    cancel: "anuluj",
  },

  // Subscription plans
  plans: {
    starter: {
      title: "Plan Starter",
    },
    professional: {
      title: "Plan Professional",
    },
    premium: {
      title: "Plan Premium",
    },
    enterprise: {
      title: "Plan Enterprise",
    },
  },

  // Billing intervals
  billing: {
    monthly: "Miesięcznie",
    yearly: "Rocznie",
  },

  // GET endpoint
  get: {
    title: "Pobierz subskrypcję",
    titleShort: "Moja subskrypcja",
    description: "Pobierz szczegóły bieżącej subskrypcji",
    form: {
      title: "Szczegóły subskrypcji",
      description: "Zobacz informacje o Twojej bieżącej subskrypcji",
    },
  },

  // POST endpoint
  post: {
    title: "Utwórz subskrypcję",
    titleShort: "Utwórz sesję",
    description: "Utwórz nową subskrypcję",
    form: {
      title: "Tworzenie subskrypcji",
      description: "Utwórz nową subskrypcję z wybranym planem",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe dane",
        description: "Sprawdź dane subskrypcji i spróbuj ponownie",
      },
      network: {
        title: "Błąd połączenia",
        description: "Sprawdź połączenie internetowe",
      },
      unauthorized: {
        title: "Wymagane logowanie",
        description: "Zaloguj się, aby utworzyć subskrypcję",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz uprawnień do tworzenia subskrypcji",
      },
      notFound: {
        title: "Nie znaleziono planu",
        description: "Wybrany plan subskrypcji nie został znaleziony",
      },
      server: {
        title: "Coś poszło nie tak",
        description: "Nie udało się utworzyć subskrypcji. Spróbuj ponownie",
      },
      unknown: {
        title: "Nieoczekiwany błąd",
        description: "Coś nieoczekiwanego się wydarzyło. Spróbuj ponownie",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz zmiany, które nie zostały zapisane",
      },
      conflict: {
        title: "Subskrypcja istnieje",
        description: "Masz już aktywną subskrypcję",
      },
    },
    success: {
      title: "Subskrypcja utworzona",
      description: "Twoja subskrypcja została pomyślnie aktywowana",
    },
  },

  // PUT endpoint
  put: {
    title: "Aktualizuj subskrypcję",
    titleShort: "Zmień sub.",
    description: "Aktualizuj istniejącą subskrypcję",
    form: {
      title: "Aktualizacja subskrypcji",
      description: "Zaktualizuj swój plan subskrypcji lub okres rozliczeniowy",
    },
    errors: {
      validation: {
        title: "Nieprawidłowa aktualizacja",
        description: "Sprawdź zmiany i spróbuj ponownie",
      },
      network: {
        title: "Błąd połączenia",
        description: "Nie udało się zapisać zmian. Spróbuj ponownie",
      },
      unauthorized: {
        title: "Wymagane logowanie",
        description: "Zaloguj się, aby zaktualizować subskrypcję",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz uprawnień do aktualizacji tej subskrypcji",
      },
      notFound: {
        title: "Nie znaleziono subskrypcji",
        description: "Nie mogliśmy znaleźć Twojej subskrypcji",
      },
      server: {
        title: "Aktualizacja nie powiodła się",
        description: "Nie udało się zapisać zmian. Spróbuj ponownie",
      },
      unknown: {
        title: "Nieoczekiwany błąd",
        description: "Coś nieoczekiwanego się wydarzyło. Spróbuj ponownie",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz zmiany, które nie zostały zapisane",
      },
      conflict: {
        title: "Konflikt aktualizacji",
        description:
          "Twoja subskrypcja się zmieniła. Odśwież stronę i spróbuj ponownie",
      },
    },
    submit: {
      label: "Zaktualizuj subskrypcję",
      loading: "Aktualizowanie...",
    },
    success: {
      title: "Subskrypcja zaktualizowana",
      description: "Twoja subskrypcja została pomyślnie zaktualizowana",
    },
  },

  // DELETE endpoint
  delete: {
    title: "Anuluj subskrypcję",
    titleShort: "Anuluj sub.",
    warning:
      "Anulowanie subskrypcji zakończy dostęp na koniec okresu rozliczeniowego.",
    description: "Anuluj swoją subskrypcję",
    form: {
      title: "Anulowanie subskrypcji",
      description: "Anuluj swoją subskrypcję z opcjonalnymi ustawieniami",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Sprawdź dane anulowania i spróbuj ponownie",
      },
      network: {
        title: "Błąd połączenia",
        description: "Nie udało się przetworzyć anulowania. Spróbuj ponownie",
      },
      unauthorized: {
        title: "Wymagane logowanie",
        description: "Zaloguj się, aby anulować subskrypcję",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz uprawnień do anulowania tej subskrypcji",
      },
      notFound: {
        title: "Nie znaleziono subskrypcji",
        description: "Nie mogliśmy znaleźć Twojej subskrypcji",
      },
      server: {
        title: "Anulowanie nie powiodło się",
        description: "Nie udało się anulować subskrypcji. Spróbuj ponownie",
      },
      unknown: {
        title: "Nieoczekiwany błąd",
        description: "Coś nieoczekiwanego się wydarzyło. Spróbuj ponownie",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz zmiany, które nie zostały zapisane",
      },
      conflict: {
        title: "Konflikt anulowania",
        description:
          "Status subskrypcji się zmienił. Odśwież stronę i spróbuj ponownie",
      },
    },
    submit: {
      label: "Anuluj subskrypcję",
      loading: "Anulowanie...",
    },
    success: {
      title: "Subskrypcja anulowana",
      description: "Twoja subskrypcja została pomyślnie anulowana",
    },
  },

  // Form fields
  form: {
    fields: {
      planId: {
        label: "Plan subskrypcji",
        description: "Wybierz swój plan subskrypcji",
        placeholder: "Wybierz plan",
      },
      billingInterval: {
        label: "Okres rozliczeniowy",
        description: "Wybierz częstotliwość rozliczeń",
        placeholder: "Wybierz okres rozliczeniowy",
      },
      provider: {
        label: "Dostawca płatności",
        description: "Wybierz dostawcę płatności",
      },
      catalogProductId: {
        label: "Produkt z katalogu",
        description: "Powiąż tę subskrypcję z produktem z katalogu",
      },
      cancelAtPeriodEnd: {
        label: "Anuluj na koniec okresu",
        description: "Anuluj subskrypcję na koniec bieżącego okresu",
      },
      reason: {
        label: "Powód anulowania",
        description: "Podaj powód anulowania",
        placeholder: "Wprowadź powód anulowania",
      },
    },
  },

  // Response fields
  response: {
    checkoutUrl: "URL płatności",
    sessionId: "ID sesji",
    hasSubscription: "Aktywna subskrypcja",
    id: "ID subskrypcji",
    userId: "ID użytkownika",
    status: "Status subskrypcji",
    planId: "ID planu",
    billingInterval: "Okres rozliczeniowy",
    currentPeriodStart: "Początek bieżącego okresu",
    currentPeriodEnd: "Koniec bieżącego okresu",
    cancelAtPeriodEnd: "Anuluj na koniec okresu",
    cancelAt: "Anulacja o",
    canceledAt: "Anulowano o",
    endedAt: "Zakończono o",
    trialStart: "Początek okresu próbnego",
    trialEnd: "Koniec okresu próbnego",
    success: "Operacja pomyślna",
    message: "Wiadomość o statusie",
    subscriptionId: "ID subskrypcji",
    stripeCustomerId: "ID klienta Stripe",
    updatedFields: "Zaktualizowane pola",
    endsAt: "Kończy się o",
    createdAt: "Utworzono o",
    updatedAt: "Zaktualizowano o",
    provider: "Dostawca płatności",
    providerSubscriptionId: "ID subskrypcji dostawcy",
  },

  // Error types
  errors: {
    tierChange: {
      notActive: "Twój plan nie jest aktywny. Zacznij nowy plan.",
      cryptoNotSupported:
        "Planów opłaconych kryptowalutą nie da się zmienić w trakcie okresu. Wybierz nowy plan, gdy ten się skończy.",
      paymentRequired:
        "Bank chce potwierdzenia ulepszenia. Otwórz fakturę, żeby je dokończyć: {{url}}",
      failed: "Zmiana planu nie powiodła się: {{error}}",
      upgraded:
        "Ulepszono do {{plan}}. Dodaliśmy {{credits}} kredytów na ten okres.",
      changed: "Zmieniono na {{plan}}.",
      downgraded:
        "Przejście na {{plan}} od następnego odnowienia. Do tego czasu zachowujesz obecne kredyty.",
      unchanged: "Masz już ten plan.",
    },
    validation: {
      title: "Błąd walidacji",
      description: "Nieprawidłowe parametry subskrypcji",
    },
    network: {
      title: "Błąd sieci",
      description: "Błąd połączenia sieciowego",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Wymagana autoryzacja",
    },
    forbidden: {
      title: "Zabronione",
      description: "Dostęp zabroniony",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Subskrypcja nie została znaleziona",
    },
    not_found: "Subskrypcja nie została znaleziona",
    not_found_description: "Żądana subskrypcja nie została znaleziona",
    server: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera",
    },
    serverError: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt danych",
    },
    use_checkout_flow: "Proszę użyć procesu płatności, aby kupić subskrypcję",
    use_checkout_flow_description:
      "Bezpośrednie tworzenie subskrypcji nie jest dozwolone. Proszę użyć procesu płatności.",
    sync_failed: "Nie udało się zsynchronizować subskrypcji z bazą danych",
    database_error: "Wystąpił błąd bazy danych: {{error}}",
    create_crashed: "Utworzenie subskrypcji nie powiodło się",
    cancel_failed: "Nie udało się anulować subskrypcji: {{error}}",
    user_not_found: "Nie znaleziono użytkownika",
    stripe_customer_creation_failed: "Nie udało się utworzyć klienta Stripe",
    not_implemented_on_native:
      "{{method}} nie jest zaimplementowana na platformie natywnej. Użyj wersji webowej dla tej operacji.",
    no_provider_id: "Nie znaleziono identyfikatora dostawcy płatności",
  },

  sync: {
    failed: "Nie udało się zsynchronizować subskrypcji: {{error}}",
    stripe_error: "Błąd synchronizacji Stripe: {{error}}",
    success: "Subskrypcja zsynchronizowana pomyślnie",
  },

  // Cancel operation
  cancel: {
    success: "Subskrypcja została pomyślnie anulowana",
  },

  // Success types
  success: {
    title: "Sukces",
    description: "Operacja zakończona pomyślnie",
  },

  // Status translations
  status: {
    incomplete: "Niekompletny",
    incomplete_expired: "Niekompletny wygasły",
    trialing: "Okres próbny",
    active: "Aktywny",
    pastDue: "Zaległy",
    canceled: "Anulowany",
    unpaid: "Nieopłacony",
    paused: "Wstrzymany",
  },

  // Email translations
  email: {
    success: {
      headline: "Jesteś w środku. Bez filtrów, bez wykładów.",
      subject: "Twoja subskrypcja {{appName}} jest aktywna",
      previewText:
        "{{privateName}}, jesteś live. {{subscriptionCredits}} kredytów/miesiąc, {{modelCount}} modeli, zero ograniczeń.",
      activeBadge: "Aktywna",
      greeting: "Hej {{privateName}},",
      intro:
        "Twoja subskrypcja {{appName}} jest potwierdzona i gotowa. Masz {{subscriptionCredits}} kredytów co miesiąc na wszystkie modele. Bez dziennych limitów, bez filtrów treści, bez tłumaczenia się.",
      models: {
        title: "{{modelCount}} modeli, 3 kategorie",
        mainstream: "Główny nurt",
        open: "Open Source",
        uncensored: "Niecenzurowane",
      },
      included: {
        title: "Co dostajesz każdego miesiąca:",
        credits:
          "{{subscriptionCredits}} kredytów miesięcznie (automatyczne odnowienie)",
        models: "Dostęp do wszystkich {{modelCount}} modeli AI",
        nolimits: "Bez dziennych limitów. Używasz kredytów, kiedy chcesz",
        uncensored: "Niecenzurowane modele bez filtrów treści",
        packs: "Kupuj dodatkowe pakiety creditów, które nigdy nie wygasają",
        cancel: "Anuluj w dowolnym momencie, bez pytań",
      },
      cta: "Zacznij rozmawiać",
      packs: {
        title: "Potrzebujesz więcej kredytów?",
        description:
          "Kredyty kończą się przed odnowieniem? Doładuj kiedy chcesz: {{packPrice}} za {{packCredits}} kredytów. Pakiety nigdy nie wygasają i dochodzą do miesięcznych kredytów.",
        cta: "Kup pakiet kredytów",
      },
      manage: "Zarządzaj lub anuluj subskrypcję w dowolnym momencie w",
      manageLink: "ustawieniach konta",
      signoff: "Miłych rozmów,\nZespół {{appName}}",
    },
    admin_notification: {
      title: "Nowa subskrypcja",
      subject: "Nowa subskrypcja: {{planName}}",
      preview: "Nowa subskrypcja: {{userName}} zasubskrybował {{planName}}",
      message: "Nowy użytkownik zasubskrybował {{appName}}.",
      details: "Szczegóły subskrypcji",
      user_name: "Nazwa użytkownika",
      user_email: "E-mail użytkownika",
      plan: "Plan",
      status: "Status",
      contact_user: "Skontaktuj się z użytkownikiem",
      footer: "To jest automatyczne powiadomienie z {{appName}}",
    },
  },

  // Email template metadata (for preview registry)
  emailTemplates: {
    success: {
      name: "E-mail potwierdzający subskrypcję",
      description: "E-mail potwierdzający wysyłany po aktywacji subskrypcji",
      category: "subskrypcja",
      preview: {
        privateName: {
          label: "Nazwa użytkownika",
          description: "Wyświetlana nazwa użytkownika",
        },
        userId: {
          label: "ID użytkownika",
          description: "Unikalny identyfikator użytkownika",
        },
        leadId: {
          label: "ID leada",
          description: "Powiązany identyfikator leada",
        },
        planName: {
          label: "Nazwa planu",
          description: "Nazwa planu subskrypcji",
        },
      },
    },
    adminNotification: {
      name: "Powiadomienie admina o subskrypcji",
      description: "Wewnętrzne powiadomienie do adminów o nowych subskrypcjach",
      category: "admin",
      preview: {
        privateName: {
          label: "Nazwa użytkownika",
        },
        publicName: {
          label: "Nazwa publiczna",
        },
        email: {
          label: "E-mail użytkownika",
        },
        planName: {
          label: "Nazwa planu",
        },
        statusName: {
          label: "Status subskrypcji",
        },
      },
    },
  },

  // Widget-specific keys (cancel confirmation dialog, etc.)
  widget: {
    back: "Wróć",
    confirm: {
      title: "Anulować subskrypcję?",
      description:
        "Dostęp zostanie zakończony na koniec okresu rozliczeniowego. Tej operacji nie można cofnąć.",
      cancel: "Zachowaj subskrypcję",
      proceed: "Tak, anuluj",
    },
  },

  // Widget display keys
  title: "Twoja subskrypcja",
  description: "Zarządzaj swoją subskrypcją i rozliczeniami",
  notAvailable: "N/D",
  canceledOn: "Anulowano",
  endedOn: "Zakończono",
  billingInterval: "Okres rozliczeniowy",
  currentPeriodStart: "Początek bieżącego okresu",
  endsOn: "Kończy się",
  nextBillingDate: "Następna data rozliczenia",
  cancellation: {
    title: "Zaplanowane anulowanie subskrypcji",
    description:
      "Twoja subskrypcja zostanie anulowana {{date}}. Do tego czasu zachowasz dostęp.",
  },
  canceled: {
    title: "Subskrypcja zakończona",
    description:
      "Twoja subskrypcja dobiegła końca. Odnów ją, aby odzyskać dostęp do wszystkich funkcji.",
  },
  noSubscription: {
    title: "Brak subskrypcji",
    description:
      "Subskrybuj i odbieraj co miesiąc kredyty oraz dostęp do wszystkich modeli.",
    cta: "Zobacz plany",
  },
  manage: {
    nowpayments: {
      info: "Skontaktuj się z pomocą techniczną, aby zarządzać subskrypcją NowPayments.",
      button: "Zarządzaj subskrypcją",
    },
    stripe: {
      button: "Zarządzaj subskrypcją",
    },
    portal: {
      error: "Nie udało się otworzyć portalu klienta. Spróbuj ponownie.",
    },
  },

  // Enum translations
  enums: {
    plan: {
      subscription: "Starter",
      plus: "Plus",
      pro: "Pro",
      ultra: "Ultra",
    },
    status: {
      incomplete: "Niekompletny",
      incompleteExpired: "Niekompletny wygasły",
      trialing: "Okres próbny",
      active: "Aktywny",
      pastDue: "Przeterminowany",
      canceled: "Anulowany",
      unpaid: "Nieopłacony",
      paused: "Wstrzymany",
      canceling: "Anulowanie",
    },
    billing: {
      monthly: "Miesięczny",
      yearly: "Roczny",
    },
    cancellation: {
      tooExpensive: "Za drogi",
      missingFeatures: "Brakujące funkcje",
      switchingService: "Zmiana usługi",
      temporaryPause: "Tymczasowa przerwa",
      other: "Inne",
    },
    paymentProvider: {
      nowpayments: "NowPayments",
      stripe: "Stripe",
    },
  },

  // Buy / pricing page translations
  quickCheckout: {
    pack: {
      title: "{{credits}} kredytów",
      note: "Jednorazowe doładowanie. Nigdy nie wygasają.",
      aria: "Kup {{credits}} kredytów za {{price}}, jednorazowo",
    },
    plan: {
      title: "{{credits}} kredytów / mies.",
      note: "{{plan}}. Anulujesz, kiedy chcesz.",
      perMonth: "/mies.",
      aria: "Włącz {{plan}}: {{credits}} kredytów co miesiąc za {{price}}",
    },
    upgrade: {
      title: "Przejdź na {{plan}}",
      note: "{{credits}} kredytów / mies.",
      aria: "Przejdź na {{plan}}: {{credits}} kredytów co miesiąc za {{price}}",
      confirm:
        "Teraz płacisz różnicę za resztę tego okresu. Dodatkowe kredyty wpadają od razu.",
      confirmButton: "Przejdź teraz",
      cancel: "Anuluj",
      working: "Zmieniam...",
    },
    opening: "Otwieram płatność...",
    secure: "Karta, PayPal, Apple Pay, Google Pay przez Stripe.",
    allPlans: "Wszystkie plany i krypto",
    moreOptions: "Krypto i inne opcje",
    error: "Nie udało się otworzyć płatności. Spróbuj ponownie.",
  },
  tiers: {
    examples: {
      heading: "Co dają {{credits}} kredytów miesięcznie",
      subheading:
        "Liczba wiadomości miesięcznie z kilkoma popularnymi modelami.",
      perMessage: "ok. {{credits}} kredytów za wiadomość",
      messages: "ok. {{amount}} wiadomości",
      note: "Szacunek dla typowej wiadomości: {{input}} tokenów na wejściu (dotychczasowa rozmowa) i {{output}} na wyjściu. Krótkie rozmowy kosztują mniej, długie rozmowy i pliki więcej.",
    },
    faq: {
      heading: "Pytania przed zakupem",
      credit: {
        question: "Ile jest wart kredyt?",
        answer:
          "Jeden kredyt to {{unitPrice}}. Lekkie modele kosztują mniej niż kredyt za wiadomość, najlepsze kilka. Przykłady powyżej liczą prawdziwe ceny modeli.",
      },
      unused: {
        question: "Co z niewykorzystanymi kredytami?",
        answer:
          "Kredyty z planu działają w Twoim miesiącu rozliczeniowym i odnawiają się przy przedłużeniu. Pakiety kredytów nigdy nie wygasają.",
      },
      cancel: {
        question: "Czy mogę zrezygnować?",
        answer:
          "Tak, w każdej chwili, właśnie tutaj. Plan i kredyty zostają do końca opłaconego okresu.",
      },
      free: {
        question: "Co zostaje za darmo?",
        answer:
          "Goście dostają {{freeCreditsGuest}} kredytów miesięcznie. Darmowe konto dostaje {{freeCreditsSignedIn}}, a z potwierdzonym newsletterem {{freeCreditsMax}}. Bez karty.",
      },
      api: {
        question: "Czy plan odblokowuje API?",
        answer:
          "Tak. Każdy plan i każdy pakiet kredytów odblokowuje klucze API dla klientów zgodnych z OpenAI i Anthropic. Darmowe kredyty nie.",
      },
      pay: {
        question: "Jak mogę zapłacić?",
        answer:
          "Kartą lub PayPalem przez Stripe albo kryptowalutą przez NOWPayments.",
      },
      more: "Więcej odpowiedzi w centrum pomocy",
    },
    heading: "Wybierz plan",
    subheading:
      "Świeże kredyty co miesiąc i dostęp do {{modelCount}} modeli AI. Anulujesz, kiedy chcesz.",
    changeHeading: "Zmień plan",
    changeSubheading: "Masz plan {{plan}}: {{credits}} kredytów miesięcznie.",
    recommended: "Polecany",
    current: "Twój plan",
    perMonth: "/ mies.",
    perYear: "/ rok",
    creditsPerMonth: "kredytów / mies.",
    yearlyEquivalent: "{{monthlyPrice}} / mies. przy płatności rocznej",
    picked: "{{plan}}: {{credits}} kredytów co miesiąc",
    pickedNote:
      "Dostęp do {{modelCount}} modeli AI. Kredyty odnawiane co miesiąc. Anulujesz, kiedy chcesz.",
    cta: {
      start: "Włącz {{plan}}",
      upgrade: "Przejdź na {{plan}}",
      downgrade: "Przejdź na {{plan}} przy odnowieniu",
      intervalYearly: "Przejdź na płatność roczną",
      intervalMonthly: "Przejdź na {{plan}} miesięcznie",
      current: "Twój obecny plan",
    },
    signInHint: "Załóż darmowe konto, żeby włączyć plan.",
    cryptoHint:
      "Płacisz krypto? Plus, Pro i Ultra co miesiąc lub rocznie, Starter rocznie.",
    confirm: {
      upgradeTitle: "Przejść na {{plan}}?",
      upgradeBody:
        "Teraz płacisz różnicę za resztę tego okresu, a dodatkowe kredyty wpadają od razu. Od następnego odnowienia: {{price}} miesięcznie za {{credits}} kredytów.",
      upgradeButton: "Zapłać i przejdź",
      downgradeTitle: "Przejść na {{plan}}?",
      downgradeBody:
        "Zmiana wchodzi przy następnym odnowieniu, {{date}}. Do tego czasu zostajesz przy obecnym planie i kredytach. Potem: {{price}} miesięcznie za {{credits}} kredytów.",
      downgradeButton: "Zmień przy odnowieniu",
      intervalTitle: "Zmienić rozliczenie?",
      intervalBody:
        "Okres rozliczeniowy zaczyna się dziś od nowa, a Stripe rozlicza proporcjonalną różnicę. Nowy plan: {{plan}}, {{price}}{{period}}, {{credits}} kredytów miesięcznie.",
      intervalButton: "Zmień rozliczenie",
      cancel: "Nie teraz",
      working: "Zmieniam...",
    },
    packsLocked: {
      title: "Pakiety kredytów: {{price}} za {{credits}} kredytów",
      body: "Pakiety doładowują aktywny plan. Najpierw włącz plan, potem dokupuj pakiety, kiedy zabraknie. Nigdy nie wygasają.",
    },
    topUp: {
      heading: "Doładuj",
      subheading:
        "Kredyty kończą się przed odnowieniem? Pakiety dochodzą do planu i nigdy nie wygasają.",
    },
  },
  buy: {
    provider: {
      stripe: "Karta, PayPal i portfele",
      stripeDescription: "Karta, PayPal, Apple Pay, Google Pay przez Stripe",
      nowpayments: "Krypto (NowPayments)",
      nowpaymentsDescription: "Zapłać Bitcoinem, Ethereum i innymi",
      cryptoMonthlyDisabled:
        "Starter za krypto tylko rocznie. Plus, Pro i Ultra opłacisz krypto także co miesiąc.",
    },
    login: "Zaloguj się",
    signup: "Zarejestruj się za darmo",
  },

  // Page metadata
  meta: {
    subscription: {
      title: "Subskrypcja",
      description: "Zarządzaj swoją subskrypcją i rozliczeniami",
    },
    buyCredits: {
      title: "Kup kredyty",
      description: "Kup dodatkowe kredyty na swoje konto",
    },
    history: {
      title: "Historia rozliczeń",
      description: "Zobacz historię rozliczeń i transakcji",
    },
    overview: {
      title: "Przegląd subskrypcji",
      description: "Zobacz status i szczegóły swojej subskrypcji",
    },
  },
};
