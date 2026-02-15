import { translations as checkoutTranslations } from "../../../payment/checkout/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Import checkout translations
  checkout: checkoutTranslations,

  // Main subscription domain
  category: "Subskrypcja",

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
    description: "Pobierz szczegóły bieżącej subskrypcji",
    form: {
      title: "Szczegóły subskrypcji",
      description: "Zobacz informacje o Twojej bieżącej subskrypcji",
    },
  },

  // POST endpoint
  post: {
    title: "Utwórz subskrypcję",
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
    success: {
      title: "Subskrypcja zaktualizowana",
      description: "Twoja subskrypcja została pomyślnie zaktualizowana",
    },
  },

  // DELETE endpoint
  delete: {
    title: "Anuluj subskrypcję",
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
    database_error: "Wystąpił błąd bazy danych",
    create_crashed: "Utworzenie subskrypcji nie powiodło się",
    cancel_failed: "Nie udało się anulować subskrypcji",
    user_not_found: "Nie znaleziono użytkownika",
    stripe_customer_creation_failed: "Nie udało się utworzyć klienta Stripe",
    not_implemented_on_native:
      "{{method}} nie jest zaimplementowana na platformie natywnej. Użyj wersji webowej dla tej operacji.",
    no_provider_id: "Nie znaleziono identyfikatora dostawcy płatności",
  },

  sync: {
    failed: "Nie udało się zsynchronizować subskrypcji",
    stripe_error: "Błąd synchronizacji Stripe",
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
      title: "Witamy w {{planName}}, {{firstName}}!",
      subject:
        "Twoja subskrypcja {{appName}} jest aktywna - Nieograniczona AI czeka",
      previewText:
        "Twoja subskrypcja {{planName}} jest teraz aktywna! Ciesz się nieograniczonym dostępem do 38 modeli AI.",
      welcomeMessage: "Twoja subskrypcja {{planName}} jest teraz aktywna!",
      description:
        "Dziękujemy za upgrade do {{appName}}! Masz teraz pełny dostęp do wszystkich 38 modeli AI bez dziennych limitów. Zacznij rozmawiać z Claude Sonnet 4.5, GPT-5.2 Pro, Gemini 3 Pro i wszystkimi naszymi niecenzurowanymi modelami bez ograniczeń.",
      nextSteps: {
        title: "Wszystko gotowe!",
        description:
          "Twoja subskrypcja jest aktywna i gotowa do użycia. Wskocz od razu i odkryj nieograniczone rozmowy z AI.",
        cta: "Zacznij rozmawiać już teraz",
      },
      support: {
        title: "Potrzebujesz pomocy?",
        description:
          "Nasz zespół wsparcia jest tutaj, aby pomóc Ci z wszelkimi pytaniami dotyczącymi subskrypcji.",
        cta: "Uzyskaj pomoc",
      },
      footer: {
        message: "Dziękujemy za wspieranie niecenzurowanej AI!",
        signoff: "Witamy w nieograniczonych rozmowach,\nZespół {{appName}}",
      },
    },
    admin_notification: {
      title: "Nowa subskrypcja",
      subject: "Nowa subskrypcja - {{planName}}",
      preview: "Nowa subskrypcja: {{firstName}} zasubskrybował {{planName}}",
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

  // Enum translations
  enums: {
    plan: {
      subscription: "Subskrypcja",
      starter: "Starter",
      professional: "Professional",
      premium: "Premium",
      enterprise: "Enterprise",
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
