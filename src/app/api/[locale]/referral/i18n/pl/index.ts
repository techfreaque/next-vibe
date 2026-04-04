import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Main referral domain
  category: "Polecenie",

  // Tags
  tags: {
    referral: "polecenie",
    codes: "kody",
    earnings: "zarobki",
    get: "pobierz",
    create: "utwórz",
    list: "lista",
  },

  // GET endpoint (get referral code)
  get: {
    title: "Pobierz kod polecający",
    description: "Pobierz szczegóły kodu polecającego",
    form: {
      title: "Szczegóły kodu polecającego",
      description: "Wyświetl informacje o kodzie polecającym",
      limit: {
        label: "Limit",
        description: "Maksymalna liczba wyników do zwrócenia",
      },
      offset: {
        label: "Przesunięcie",
        description: "Liczba wyników do pominięcia",
      },
    },
    response: {
      earnings: {
        id: "ID",
        earnerUserId: "ID użytkownika zarabiającego",
        sourceUserId: "ID użytkownika źródłowego",
        transactionId: "ID transakcji",
        level: "Poziom",
        amountCents: "Kwota (centy)",
        currency: "Waluta",
        status: "Status",
        createdAt: "Utworzono",
      },
      totalCount: "Łączna liczba",
    },
  },

  // POST endpoint (create referral code)
  post: {
    title: "Utwórz kod polecający",
    description: "Utwórz nowy kod polecający",
    form: {
      title: "Utwórz kod polecający",
      description: "Wygeneruj nowy kod polecający do udostępnienia",
    },
    submit: {
      label: "Utwórz kod",
      loading: "Tworzenie...",
    },
  },

  // PUT endpoint (update referral code)
  put: {
    title: "Aktualizuj kod polecający",
    description: "Aktualizuj ustawienia kodu polecającego",
    form: {
      title: "Aktualizuj kod polecający",
      description: "Zmodyfikuj właściwości kodu polecającego",
    },
  },

  // DELETE endpoint (deactivate referral code)
  delete: {
    title: "Dezaktywuj kod polecający",
    description: "Dezaktywuj kod polecający",
    form: {
      title: "Dezaktywuj kod polecający",
      description: "Wyłącz ten kod polecający",
    },
  },

  // Link to Lead endpoint
  linkToLead: {
    post: {
      title: "Połącz polecenie z leadem",
      description: "Połącz kod polecający z leadem przed rejestracją",
      form: {
        title: "Połącz kod polecający",
        description: "Powiąż kod polecający z Twoją sesją",
      },
    },
    success: {
      title: "Polecenie połączone",
      description: "Kod polecający pomyślnie połączony z Twoją sesją",
    },
  },

  // Codes List endpoint
  codes: {
    list: {
      get: {
        title: "Lista kodów polecających",
        description: "Pobierz wszystkie swoje kody polecające ze statystykami",
        form: {
          title: "Twoje kody polecające",
          description: "Wyświetl i zarządzaj swoimi kodami polecającymi",
        },
        response: {
          codes: {
            id: "ID",
            code: "Kod",
            label: "Etykieta",
            currentVisitors: "Aktualni odwiedzający",
            isActive: "Aktywny",
            createdAt: "Utworzono",
            totalSignups: "Łączne rejestracje",
            totalRevenueCents: "Łączny przychód (Centy)",
            totalEarningsCents: "Łączne zarobki (Centy)",
          },
        },
      },
      success: {
        title: "Kody pobrane",
        description: "Pomyślnie pobrano Twoje kody polecające",
      },
      widget: {
        empty: "Nie masz jeszcze żadnych kodów polecających",
        emptyHint: "Utwórz swój pierwszy kod powyżej ↑",
        copied: "Skopiowano!",
        copy: "Kopiuj link",
        visitors: "Odwiedzający",
        signups: "Rejestracje",
        revenue: "Przychód",
        earnings: "Zarobki",
        inactive: "Ten kod polecający jest nieaktywny",
        conversionHint:
          "Każdy subskrybent za {{examplePrice}}/mies. przynosi Ci {{exampleEarning}}/mies. - cyklicznie",
        linkGen: "Własny link",
        linkGenPlaceholder: "Wklej dowolny URL strony...",
        linkGenHint:
          "Wklej dowolny URL strony unbottled, aby utworzyć śledzony link polecający",
        linkGenCopy: "Kopiuj",
        linkGenCopied: "Skopiowano!",
      },
    },
  },

  // Stats endpoint
  stats: {
    get: {
      title: "Statystyki poleceń",
      description: "Pobierz statystyki swojego programu poleceń",
      form: {
        title: "Twoje statystyki poleceń",
        description: "Wyświetl metryki wydajności swoich poleceń",
      },
    },
    success: {
      title: "Statystyki pobrane",
      description: "Pomyślnie pobrano Twoje statystyki poleceń",
    },
    widget: {
      emptyMessage:
        "Brak aktywności - udostępnij link polecający, aby zacząć zarabiać",
    },
    fields: {
      totalSignups: "Łączne rejestracje",
      totalSignupsDescription:
        "Liczba użytkowników, którzy zarejestrowali się za pomocą Twojego kodu polecającego",
      totalRevenue: "Łączny przychód",
      totalRevenueDescription:
        "Całkowity przychód wygenerowany z Twoich poleceń",
      totalEarned: "Łącznie zarobione",
      totalEarnedDescription: "Całkowita prowizja zarobiona z poleceń",
      availableBalance: "Dostępne saldo",
      availableBalanceDescription: "Dostępne saldo gotowe do wypłaty",
      availableBalanceDescriptionLow:
        "Wydawaj na czaty AI - inne kredyty używane są najpierw. Zarobić {{minPayout}}, aby odblokować wypłatę.",
      totalRevenueCredits: "Łączny przychód (Kredyty)",
      totalEarnedCredits: "Łącznie zarobione (Kredyty)",
      totalPaidOutCredits: "Łącznie wypłacone (Kredyty)",
      availableCredits: "Dostępne kredyty",
    },
  },

  // Earnings List endpoint
  earnings: {
    list: {
      get: {
        title: "Lista zarobków z poleceń",
        description: "Pobierz historię swoich zarobków z poleceń",
        form: {
          title: "Twoje zarobki z poleceń",
          description: "Wyświetl swoje zarobki z poleceń",
        },
        response: {
          earnings: {
            id: "ID",
            earnerUserId: "ID zarabiającego użytkownika",
            sourceUserId: "ID źródłowego użytkownika",
            transactionId: "ID transakcji",
            level: "Poziom",
            amountCents: "Kwota (Centy)",
            currency: "Waluta",
            status: "Status",
            createdAt: "Utworzono",
          },
        },
      },
      success: {
        title: "Zarobki pobrane",
        description: "Pomyślnie pobrano Twoje zarobki z poleceń",
      },
    },
  },

  // Form fields
  form: {
    fields: {
      code: {
        label: "Kod polecający",
        description: "Unikalny kod polecający",
        placeholder: "Wprowadź kod",
      },
      label: {
        label: "Etykieta",
        description: "Opcjonalna etykieta dla tego kodu",
        placeholder: "Mój kod polecający",
      },
      description: {
        label: "Opis",
        description: "Opcjonalny opis",
        placeholder: "Wprowadź opis",
      },
      maxUses: {
        label: "Maksymalna liczba użyć",
        description: "Maksymalna liczba razy, gdy ten kod może być użyty",
        placeholder: "Pozostaw puste dla nielimitowanych",
      },
      expiresAt: {
        label: "Data wygaśnięcia",
        description: "Kiedy ten kod wygasa",
        placeholder: "Wybierz datę",
      },
      isActive: {
        label: "Aktywny",
        description: "Czy ten kod jest obecnie aktywny",
      },
    },
  },

  // Response fields
  response: {
    id: "ID",
    code: "Kod",
    label: "Etykieta",
    description: "Opis",
    ownerUserId: "ID właściciela",
    maxUses: "Maksymalna liczba użyć",
    currentUses: "Aktualna liczba użyć",
    expiresAt: "Wygasa",
    isActive: "Aktywny",
    createdAt: "Utworzono",
    updatedAt: "Zaktualizowano",
    referralCode: "Kod polecający",
    success:
      "🎉 Twój kod polecający jest gotowy! Skopiuj poniższy link i zacznij zarabiać {{directPct}} prowizji od każdej subskrypcji - plus bonusowe zarobki z ich poleceń.",
    message: "Wiadomość",
  },

  // Admin payout management
  admin: {
    payouts: {
      get: {
        title: "Żądania wypłat",
        description: "Zarządzaj żądaniami wypłat poleceń",
      },
      post: {
        title: "Przetwórz wypłatę",
        description: "Zatwierdź, odrzuć lub zakończ żądanie wypłaty",
      },
      fields: {
        status: {
          label: "Filtr statusu",
          description: "Filtruj według statusu wypłaty",
        },
        requestId: {
          label: "ID żądania",
          description: "Identyfikator żądania wypłaty",
        },
        action: {
          label: "Akcja",
          description: "Akcja do wykonania na żądaniu wypłaty",
        },
        adminNotes: {
          label: "Notatki admina",
          description: "Opcjonalne notatki dla tej akcji",
        },
        rejectionReason: {
          label: "Powód odrzucenia",
          description: "Powód odrzucenia żądania wypłaty",
        },
      },
      widget: {
        empty: "Nie znaleziono żądań wypłat",
        approve: "Zatwierdź",
        reject: "Odrzuć",
        complete: "Zakończ",
        credits: "kredytów",
      },
    },
  },

  // Payout endpoint + errors
  payout: {
    get: {
      title: "Twoje zarobki",
      description: "Wyświetl zarobki z poleceń i historię wypłat",
    },
    post: {
      title: "Poproś o wypłatę",
      description: "Wypłać swoje zarobki z poleceń",
    },
    fields: {
      amountCents: {
        label: "Kwota (kredyty)",
        description: "Kwota do wypłaty w kredytach",
        placeholder: "np. 5000",
      },
      currency: {
        label: "Metoda wypłaty",
        description: "Jak chcesz otrzymać swoje zarobki",
      },
      walletAddress: {
        label: "Adres portfela",
        description: "Wymagany dla wypłat BTC lub USDC",
        placeholder: "Twój adres portfela",
      },
    },
    widget: {
      totalEarned: "Łącznie zarobione",
      available: "Dostępne",
      locked: "Zablokowane",
      credits: "kredytów",
      readyForPayout: "gotowe do wypłaty",
      moreToUnlock: "więcej potrzeba",
      pendingConfirmation: "oczekuje na potwierdzenie",
      requestPayout: "Poproś o wypłatę",
      payoutHistory: "Historia wypłat",
      noPayout: "Brak żądań wypłaty",
      howItWorksTitle: "Jak to działa",
      step1Title: "Utwórz kody polecające",
      step1Body:
        "Generuj unikalne kody dla różnych grup - znajomych, mediów społecznościowych lub kampanii.",
      step2Title: "Udostępnij swój link",
      step2Body:
        "Gdy ktoś zarejestruje się przez Twój link i zasubskrybuje, zarabiasz prowizję.",
      step3Title: "Otrzymaj płatność",
      step3Body:
        "Zarobki są natychmiastowe. Użyj ich jako kredytów do czatów lub wypłać w krypto.",
      withdrawTitle: "Wypłać zarobki",
      withdrawDescription: "Wiele sposobów na wykorzystanie zarobków z poleceń",
      useAsCredits: "Użyj jako kredyty czatu",
      useAsCreditsDesc: "Natychmiast zamień zarobki na kredyty do rozmów AI.",
      cryptoPayout: "Wypłata w krypto",
      cryptoPayoutDesc:
        "Poproś o wypłatę w BTC lub USDC na swój adres portfela.",
      minimumNote:
        "Minimalna wypłata: {{minPayout}}. Wypłaty krypto są przetwarzane w ciągu {{cryptoPayoutHours}} godzin po zatwierdzeniu.",
      progressLabel: "Postęp do wypłaty",
      unlockedOf: "odblokowano z",
      viewHistory: "Zobacz historię",
      historyEmpty: "Twoje wypłaty pojawią się tutaj",
    },
    email: {
      user: {
        subjectCrypto: "Żądanie wypłaty otrzymane",
        subjectCredits: "Kredyty przeliczone",
        titleCrypto: "Twoje żądanie wypłaty",
        titleCredits: "Kredyty przeliczone",
        previewCrypto: "Twoje żądanie wypłaty jest przetwarzane",
        previewCredits: "Twoje kredyty zostały przeliczone",
        bodyCrypto:
          "Otrzymaliśmy Twoje żądanie wypłaty. Wypłaty krypto są przetwarzane w ciągu {{cryptoPayoutHours}} godzin po zatwierdzeniu przez administratora.",
        bodyCredits:
          "Twoje zarobki z poleceń zostały natychmiast przeliczone na kredyty czatu i dodane do Twojego konta.",
        followUpCrypto:
          "Otrzymasz kolejny e-mail, gdy Twoja wypłata zostanie przetworzona.",
        labelAmount: "Kwota",
        labelMethod: "Metoda",
        labelWallet: "Portfel",
        credits: "kredytów",
      },
      admin: {
        subject: "Nowe żądanie wypłaty",
        title: "Nowe żądanie wypłaty",
        preview: "Złożono żądanie wypłaty",
        body: "Użytkownik złożył żądanie wypłaty.",
        footer: "Proszę przejrzeć i przetworzyć to żądanie w panelu admina.",
        labelUser: "Użytkownik",
        labelAmount: "Kwota",
        labelCurrency: "Waluta",
        labelWallet: "Portfel",
        credits: "kredytów",
      },
    },
    errors: {
      minimumAmount: "Minimalna kwota wypłaty to {{minPayout}}",
      walletRequired: "Adres portfela wymagany dla wypłat krypto",
      insufficientBalance: "Niewystarczające saldo do wypłaty",
      notFound: "Nie znaleziono żądania wypłaty",
      invalidStatus: "Nieprawidłowy status żądania wypłaty dla tej operacji",
    },
    success: {
      creditsConverted: "Kredyty zostały pomyślnie przeliczone",
      payoutRequested:
        "Żądanie wypłaty zostało złożone - przetwarzanie w ciągu {{hours}} godzin",
    },
  },

  // Error types
  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Nieprawidłowe parametry kodu polecającego",
    },
    network: {
      title: "Błąd sieci",
      description: "Błąd połączenia sieciowego",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Wymagana autoryzacja",
    },
    forbidden: {
      title: "Zabronione",
      description: "Dostęp zabroniony",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Kod polecający nie znaleziony",
    },
    not_found: "Kod polecający nie znaleziony",
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
      description: "Kod polecający już istnieje",
    },
    code_exists: "Ten kod polecający już istnieje",
    code_expired: "Ten kod polecający wygasł",
    code_inactive: "Ten kod polecający nie jest aktywny",
    max_uses_reached: "Ten kod polecający osiągnął maksymalną liczbę użyć",
    invalid_code: "Nieprawidłowy kod polecający",
  },

  // Success types
  success: {
    title: "Sukces",
    description: "Operacja zakończona pomyślnie",
    code_created: "Kod polecający utworzony pomyślnie",
    code_updated: "Kod polecający zaktualizowany pomyślnie",
    code_deactivated: "Kod polecający dezaktywowany pomyślnie",
  },

  // Enum translations
  enums: {
    sourceType: {
      subscription: "Subskrypcja",
      creditPack: "Pakiet kredytów",
    },
    earningStatus: {
      pending: "Oczekujące",
      confirmed: "Potwierdzone",
      canceled: "Anulowane",
    },
    payoutCurrency: {
      usdc: "USDC",
      btc: "Bitcoin",
      credits: "Kredyty",
    },
    payoutStatus: {
      pending: "Oczekujące",
      processing: "Przetwarzanie",
      completed: "Zakończone",
      failed: "Niepowodzenie",
      rejected: "Odrzucone",
      approved: "Zatwierdzone",
    },
  },
};
