import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Synchronizuj subskrypcje ze Stripe",
    titleShort: "Sync Stripe",
    description:
      "Pobiera ze Stripe status, okres rozliczeniowy i dane anulowania do naszych subskrypcji. Stare wpisy bez ID Stripe i z zakończonym okresem oznacza jako anulowane. Nie przyznaje ani nie odbiera kredytów. Domyślnie tryb próbny.",
    fields: {
      subscriptionId: {
        label: "Subskrypcja",
        description:
          "Nasze ID subskrypcji (UUID) albo ID subskrypcji Stripe (sub_...). Zostaw puste i włącz 'Wszystkie'.",
        placeholder: "sub_... lub UUID subskrypcji",
      },
      all: {
        label: "Wszystkie",
        description:
          "Sprawdź każdą subskrypcję, która nie jest jeszcze anulowana ani wygasła.",
      },
      dryRun: {
        label: "Tryb próbny",
        description: "Pokaż zmiany bez zapisywania czegokolwiek.",
      },
    },
    response: {
      dryRun: "Tryb próbny",
      scanned: "Sprawdzone",
      changed: "Zmienione",
      failed: "Błędy",
      items: "Subskrypcje",
      item: {
        subscriptionId: "Subskrypcja",
        userEmail: "Użytkownik",
        providerSubscriptionId: "ID Stripe",
        action: "Akcja",
        statusBefore: "Status przed",
        statusAfter: "Status po",
        periodEndBefore: "Koniec okresu przed",
        periodEndAfter: "Koniec okresu po",
        note: "Uwaga",
      },
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane logowanie",
      },
      validation: {
        title: "Brak celu",
        description: "Podaj ID subskrypcji, ID Stripe albo all=true.",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Wymagane uprawnienia administratora",
      },
      server: {
        title: "Synchronizacja nieudana",
        description: "Nie udało się zsynchronizować subskrypcji ze Stripe",
        detail: "Synchronizacja subskrypcji nieudana: {{error}}",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Nieoczekiwany błąd podczas synchronizacji",
      },
      conflict: {
        title: "Konflikt",
        description: "Subskrypcja zmieniła się w trakcie synchronizacji",
      },
      network: {
        title: "Błąd sieci",
        description: "Brak połączenia ze Stripe",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Brak subskrypcji o tym ID",
        detail: "Żadna subskrypcja nie pasuje do {{id}}",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Najpierw uruchom lub odrzuć oczekującą synchronizację",
      },
      notConfigured: "Stripe nie jest skonfigurowany na tej instancji.",
    },
    success: {
      title: "Synchronizacja gotowa",
      description: "Subskrypcje sprawdzone w Stripe",
    },
    notes: {
      keptCanceled:
        "Stripe podaje {{stripeStatus}}; zostaje anulowana (anulowanej nigdy nie cofamy).",
      missingInStripe:
        "Brak w Stripe; oznaczona jako anulowana, ID Stripe usunięte.",
      expiredLegacy:
        "Brak ID Stripe, okres skończył się {{date}}; oznaczona jako anulowana.",
      noStripeIdActivePeriod: "Brak ID Stripe, okres trwa; bez zmian.",
      notStripe: "Dostawca to nie Stripe; pominięto.",
      stripeError: "Błąd Stripe: {{error}}",
    },
    widget: {
      submit: "Uruchom synchronizację",
      submitting: "Synchronizuję...",
      preview: "Podgląd: nic nie zapisano",
      applied: "Zapisano",
      empty: "Nic do synchronizacji.",
      none: "brak",
    },
  },
  enums: {
    action: {
      updated: "Zaktualizowana",
      unchanged: "Zgodna",
      expired: "Wygasła",
      missingInStripe: "Brak w Stripe",
      skipped: "Pominięta",
      error: "Błąd",
    },
  },
};
