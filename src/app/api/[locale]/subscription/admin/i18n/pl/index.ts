export const translations = {
  category: "Subskrypcje",
  tags: {
    admin: "Admin",
    stats: "Statystyki",
    list: "Lista",
    purchases: "Zakupy",
    referrals: "Polecenia",
  },
  stats: {
    get: {
      title: "Statystyki subskrypcji",
      description: "Przychody, subskrypcje, kredyty i polecenia",
      form: {
        title: "Dashboard statystyk",
        description: "Zagregowane metryki",
      },
      timePeriodOptions: {
        title: "Okres",
        description: "Konfiguracja zakresu",
      },
      timePeriod: { label: "Okres", description: "Interwał grupowania" },
      dateRangePreset: {
        label: "Zakres dat",
        description: "Predefiniowany zakres",
      },
      response: {
        revenueStats: {
          title: "Przychody",
          description: "Metryki przychodów",
          mrr: { label: "MRR" },
          arr: { label: "ARR" },
          totalRevenue: { label: "Łączny przychód" },
          avgOrderValue: { label: "Śr. zamówienie" },
        },
        subscriptionStats: {
          title: "Subskrypcje",
          description: "Liczba subskrypcji",
          activeCount: { label: "Aktywne" },
          trialingCount: { label: "Okres próbny" },
          canceledCount: { label: "Anulowane" },
          churnRate: { label: "Wskaźnik rezygnacji" },
        },
        intervalStats: {
          title: "Okresy rozliczeniowe",
          description: "Miesięcznie vs rocznie",
          monthlyCount: { label: "Miesięcznie" },
          yearlyCount: { label: "Rocznie" },
          yearlyRevenuePct: { label: "% przychodu rocznego" },
        },
        creditStats: {
          title: "Kredyty",
          description: "Metryki kredytów",
          totalPurchased: { label: "Kupione" },
          totalSpent: { label: "Wydane" },
          packsSold: { label: "Sprzedane pakiety" },
          avgPackSize: { label: "Śr. rozmiar" },
        },
        referralStats: {
          title: "Polecenia",
          description: "Program poleceń",
          totalReferrals: { label: "Łącznie" },
          conversionRate: { label: "Konwersja" },
          totalEarned: { label: "Zarobione" },
          pendingPayouts: { label: "Oczekujące" },
        },
        growthMetrics: {
          title: "Wzrost",
          description: "Trendy przychodów i subskrypcji",
          revenueChart: {
            label: "Przychody w czasie",
            description: "Trend przychodów",
          },
          subscriptionChart: {
            label: "Wzrost subskrypcji",
            description: "Aktywne subskrypcje",
          },
        },
        businessInsights: {
          title: "Wnioski",
          description: "Wygenerowane metryki",
          generatedAt: { label: "Wygenerowano" },
        },
      },
      errors: {
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagane logowanie",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Wymagany dostęp administratora",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się wygenerować statystyk",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        conflict: { title: "Konflikt", description: "Konflikt danych" },
        network: {
          title: "Błąd sieci",
          description: "Nie udało się połączyć",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Statystyki niedostępne",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: { title: "Sukces", description: "Statystyki wygenerowane" },
    },
    widget: { refresh: "Odśwież" },
  },
  list: {
    get: {
      title: "Lista subskrypcji",
      description: "Przeglądaj wszystkie subskrypcje",
      form: {
        title: "Zarządzanie subskrypcjami",
        description: "Filtruj i przeglądaj",
      },
      searchFilters: {
        title: "Szukaj i filtruj",
        description: "Filtruj subskrypcje",
      },
      search: {
        label: "Szukaj",
        description: "Szukaj po emailu lub nazwie",
        placeholder: "Szukaj subskrypcji...",
      },
      status: {
        label: "Status",
        description: "Filtruj po statusie",
        placeholder: "Wybierz status...",
      },
      interval: {
        label: "Okres",
        description: "Filtruj po okresie",
        placeholder: "Dowolny",
      },
      provider: {
        label: "Dostawca",
        description: "Filtruj po dostawcy",
        placeholder: "Dowolny",
      },
      dateFrom: { label: "Od", description: "Data początkowa" },
      dateTo: { label: "Do", description: "Data końcowa" },
      sortingOptions: {
        title: "Sortowanie",
        description: "Konfiguracja sortowania",
      },
      sortBy: {
        label: "Sortuj po",
        description: "Pole sortowania",
        placeholder: "Wybierz pole...",
      },
      sortOrder: {
        label: "Kolejność",
        description: "Kierunek sortowania",
        placeholder: "Wybierz...",
      },
      response: {
        title: "Subskrypcje",
        description: "Pasujące subskrypcje",
        subscriptions: {
          id: "ID",
          userEmail: "Email",
          userName: "Nazwa",
          planId: "Plan",
          billingInterval: "Okres",
          status: "Status",
          createdAt: "Rozpoczęta",
          currentPeriodEnd: "Koniec okresu",
          cancelAtPeriodEnd: "Anuluj na koniec",
          canceledAt: "Anulowana",
          cancellationReason: "Powód anulowania",
          provider: "Dostawca",
          providerSubscriptionId: "ID dostawcy",
        },
        totalCount: "Łącznie",
        pageCount: "Stron",
      },
      page: { label: "Strona" },
      limit: { label: "Na stronę" },
      errors: {
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagane logowanie",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Wymagany dostęp administratora",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się pobrać subskrypcji",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Nieoczekiwany błąd",
        },
        conflict: { title: "Konflikt", description: "Konflikt danych" },
        network: {
          title: "Błąd sieci",
          description: "Nie udało się połączyć",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Brak subskrypcji",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Niezapisane zmiany",
        },
      },
      success: { title: "Sukces", description: "Subskrypcje pobrane" },
    },
    widget: {
      noSubscriptions: "Nie znaleziono subskrypcji.",
      noMatchingSubscriptions: "Żadne subskrypcje nie pasują do filtrów.",
      searchPlaceholder: "Szukaj po emailu lub nazwie...",
      refresh: "Odśwież",
    },
  },
  purchases: {
    get: {
      title: "Zakupy kredytów",
      description: "Historia zakupów pakietów kredytowych",
      form: {
        title: "Historia zakupów",
        description: "Przeglądaj pakiety kredytowe",
      },
      searchFilters: {
        title: "Szukaj i filtruj",
        description: "Filtruj zakupy",
      },
      search: {
        label: "Szukaj",
        description: "Szukaj po emailu",
        placeholder: "Szukaj zakupów...",
      },
      packType: {
        label: "Typ pakietu",
        description: "Filtruj po typie",
        placeholder: "Dowolny",
      },
      source: {
        label: "Źródło",
        description: "Filtruj po źródle",
        placeholder: "Dowolne",
      },
      dateFrom: { label: "Od", description: "Data początkowa" },
      dateTo: { label: "Do", description: "Data końcowa" },
      sortingOptions: {
        title: "Sortowanie",
        description: "Konfiguracja sortowania",
      },
      sortBy: {
        label: "Sortuj po",
        description: "Pole sortowania",
        placeholder: "Wybierz pole...",
      },
      sortOrder: {
        label: "Kolejność",
        description: "Kierunek sortowania",
        placeholder: "Wybierz...",
      },
      response: {
        title: "Zakupy",
        description: "Historia zakupów pakietów",
        purchases: {
          id: "ID",
          userEmail: "Email",
          userName: "Nazwa",
          packType: "Typ",
          source: "Źródło",
          originalAmount: "Ilość",
          remaining: "Pozostało",
          expiresAt: "Wygasa",
          createdAt: "Zakupiono",
        },
        totalCount: "Łącznie",
        pageCount: "Stron",
      },
      page: { label: "Strona" },
      limit: { label: "Na stronę" },
      errors: {
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagane logowanie",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Wymagany dostęp administratora",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się pobrać zakupów",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Nieoczekiwany błąd",
        },
        conflict: { title: "Konflikt", description: "Konflikt danych" },
        network: {
          title: "Błąd sieci",
          description: "Nie udało się połączyć",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Brak zakupów",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Niezapisane zmiany",
        },
      },
      success: { title: "Sukces", description: "Zakupy pobrane" },
    },
    widget: {
      noPurchases: "Nie znaleziono zakupów kredytowych.",
      noMatchingPurchases: "Żadne zakupy nie pasują do filtrów.",
      searchPlaceholder: "Szukaj po emailu...",
      refresh: "Odśwież",
      expired: "Wygasło",
      neverExpires: "Bezterminowo",
    },
  },
  referrals: {
    get: {
      title: "Dashboard poleceń",
      description: "Kody poleceń, zarobki i wypłaty",
      form: {
        title: "Zarządzanie poleceniami",
        description: "Zarządzaj programem poleceń",
      },
      searchFilters: {
        title: "Szukaj i filtruj",
        description: "Filtruj dane poleceń",
      },
      search: {
        label: "Szukaj",
        description: "Szukaj po emailu",
        placeholder: "Szukaj poleceń...",
      },
      payoutStatus: {
        label: "Status wypłaty",
        description: "Filtruj po statusie",
        placeholder: "Dowolny",
      },
      dateFrom: { label: "Od", description: "Data początkowa" },
      dateTo: { label: "Do", description: "Data końcowa" },
      sortingOptions: {
        title: "Sortowanie",
        description: "Konfiguracja sortowania",
      },
      sortBy: {
        label: "Sortuj po",
        description: "Pole sortowania",
        placeholder: "Wybierz pole...",
      },
      sortOrder: {
        label: "Kolejność",
        description: "Kierunek sortowania",
        placeholder: "Wybierz...",
      },
      response: {
        title: "Polecenia",
        description: "Dane programu poleceń",
        summary: {
          title: "Podsumowanie",
          description: "Statystyki poleceń",
          totalCodes: { label: "Kody" },
          totalSignups: { label: "Rejestracje" },
          totalEarned: { label: "Zarobione" },
          totalPaidOut: { label: "Wypłacone" },
          pendingPayouts: { label: "Oczekujące" },
        },
        codes: {
          code: "Kod",
          ownerEmail: "Właściciel",
          ownerName: "Nazwa",
          currentUses: "Kliknięcia",
          totalSignups: "Rejestracje",
          totalEarned: "Zarobione",
          isActive: "Aktywny",
          createdAt: "Utworzony",
        },
        payoutRequests: {
          id: "ID",
          userEmail: "Użytkownik",
          amountCents: "Kwota",
          currency: "Waluta",
          status: "Status",
          walletAddress: "Portfel",
          adminNotes: "Notatki",
          rejectionReason: "Powód odrzucenia",
          createdAt: "Zgłoszone",
          processedAt: "Przetworzone",
        },
        totalCount: "Łącznie",
        pageCount: "Stron",
      },
      page: { label: "Strona" },
      limit: { label: "Na stronę" },
      errors: {
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagane logowanie",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Wymagany dostęp administratora",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się pobrać danych poleceń",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Nieoczekiwany błąd",
        },
        conflict: { title: "Konflikt", description: "Konflikt danych" },
        network: {
          title: "Błąd sieci",
          description: "Nie udało się połączyć",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Brak danych poleceń",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Niezapisane zmiany",
        },
      },
      success: { title: "Sukces", description: "Dane poleceń pobrane" },
    },
    post: {
      title: "Akcja wypłaty",
      description: "Zatwierdź, odrzuć lub zrealizuj wypłatę",
      form: {
        title: "Akcja wypłaty",
        description: "Przetwórz wypłatę",
      },
      requestId: {
        label: "ID zgłoszenia",
        description: "Wypłata do przetworzenia",
        placeholder: "Wprowadź ID...",
      },
      action: {
        label: "Akcja",
        description: "Akcja do wykonania",
        placeholder: "Wybierz akcję...",
      },
      adminNotes: {
        label: "Notatki admina",
        description: "Opcjonalne notatki",
        placeholder: "Notatki...",
      },
      rejectionReason: {
        label: "Powód odrzucenia",
        description: "Wymagany przy odrzuceniu",
        placeholder: "Podaj powód...",
      },
      response: {
        title: "Wynik",
        description: "Wynik akcji",
        success: "Sukces",
        message: "Wiadomość",
      },
      errors: {
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagane logowanie",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Wymagany dostęp administratora",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się przetworzyć wypłaty",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Nieoczekiwany błąd",
        },
        conflict: {
          title: "Konflikt",
          description: "Wypłata już przetworzona",
        },
        network: {
          title: "Błąd sieci",
          description: "Nie udało się połączyć",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Nie znaleziono wypłaty",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Niezapisane zmiany",
        },
      },
      success: { title: "Sukces", description: "Wypłata przetworzona" },
    },
    widget: {
      noReferrals: "Nie znaleziono kodów poleceń.",
      noPayouts: "Brak zgłoszeń wypłat.",
      approve: "Zatwierdź",
      reject: "Odrzuć",
      complete: "Zrealizuj",
      sectionCodes: "Kody poleceń",
      sectionPayouts: "Zgłoszenia wypłat",
      refresh: "Odśwież",
    },
  },
  enums: {
    subscriptionStatusFilter: {
      all: "Wszystkie",
      active: "Aktywne",
      trialing: "Okres próbny",
      pastDue: "Przeterminowane",
      canceled: "Anulowane",
      unpaid: "Nieopłacone",
      paused: "Wstrzymane",
    },
    billingIntervalFilter: {
      any: "Dowolny",
      monthly: "Miesięcznie",
      yearly: "Rocznie",
    },
    providerFilter: {
      any: "Dowolny",
      stripe: "Stripe",
      nowpayments: "NowPayments",
    },
    subscriptionSortField: {
      createdAt: "Data utworzenia",
      status: "Status",
      interval: "Okres",
      userEmail: "Email",
    },
    sortOrder: { asc: "Rosnąco", desc: "Malejąco" },
    creditPackTypeFilter: {
      any: "Dowolny",
      subscription: "Subskrypcja",
      permanent: "Stały",
      bonus: "Bonus",
      earned: "Zarobiony",
    },
    creditPackSourceFilter: {
      any: "Dowolne",
      stripePurchase: "Zakup Stripe",
      stripeSubscription: "Z subskrypcji",
      adminGrant: "Przyznanie admina",
      referralEarning: "Z polecenia",
    },
    purchaseSortField: {
      createdAt: "Data utworzenia",
      amount: "Kwota",
      type: "Typ",
      userEmail: "Email",
    },
    payoutStatusFilter: {
      all: "Wszystkie",
      pending: "Oczekujące",
      approved: "Zatwierdzone",
      rejected: "Odrzucone",
      processing: "W trakcie",
      completed: "Zrealizowane",
      failed: "Nieudane",
    },
    referralSortField: {
      createdAt: "Data utworzenia",
      earnings: "Zarobki",
      signups: "Rejestracje",
    },
    payoutAction: {
      approve: "Zatwierdź",
      reject: "Odrzuć",
      complete: "Zrealizuj",
    },
  },
};
