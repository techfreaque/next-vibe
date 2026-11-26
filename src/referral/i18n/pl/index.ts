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
    titleShort: "Pobierz kod",
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
    titleShort: "Utwórz kod",
    description: "Utwórz nowy kod polecający",
    form: {
      title: "Nowy kod polecający",
      description:
        "Jeden kod na jedną grupę odbiorców. Discord, blog, znajomi. Każdy liczony osobno.",
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
      titleShort: "Połącz polecenie",
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
        titleShort: "Moje kody",
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
        loading: "Ładujemy Twoje kody...",
        empty: "Nie masz jeszcze żadnych kodów polecających",
        emptyHint: "Utwórz pierwszy kod poniżej. Link gotowy od razu.",
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
      titleShort: "Statystyki",
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
      emptyAdminMessage:
        "Otwórz przegląd, aby zobaczyć aktywność w całym programie.",
      loading: "Wczytywanie statystyk poleceń",
      loadError: "Nie udało się wczytać statystyk poleceń",
      retry: "Spróbuj ponownie",
      emptyTitle: "Brak aktywności w poleceniach",
      openCodes: "Otwórz kody polecające",
      revenueCoverage:
        "Pierwotna kwota zapisana dla {{measured}} z {{total}} zakupów.",
      revenueUnavailable: "Brak danych",
      walletUnits: "Kredyty: {{amount}}",
      adminNotice:
        "Te dane dotyczą Twoich poleceń. Przegląd zawiera wyniki całego programu.",
      openOverview: "Otwórz przegląd poleceń",
      emptyMessage: "Udostępnij kod, aby śledzić rejestracje i prowizje.",
    },
    fields: {
      totalSignups: "Łączne rejestracje",
      totalSignupsDescription:
        "Liczba użytkowników, którzy zarejestrowali się za pomocą Twojego kodu polecającego",
      totalRevenue: "Zarejestrowana wartość zakupów",
      totalRevenueDescription:
        "Pierwotne kwoty w USD, od których naliczono prowizje.",
      totalEarned: "Łącznie zarobione",
      totalEarnedDescription: "Zdobyte kredyty, w tym objęte okresem zwrotu.",
      availableBalance: "Dostępne saldo",
      availableBalanceDescription:
        "Kredyty dostępne po odjęciu zarezerwowanych wypłat.",
      availableBalanceDescriptionLow:
        "Kredyty dostępne po odjęciu zarezerwowanych wypłat. Minimalna wypłata: {{minPayout}} kredytów.",
      totalRevenueCredits: "Łączny przychód (Kredyty)",
      totalEarnedCredits: "Łącznie zarobione (Kredyty)",
      totalPaidOutCredits: "Łącznie wypłacone (Kredyty)",
      availableCredits: "Dostępne kredyty",
    },
  },

  // Earnings List endpoint
  earnings: {
    confirm: {
      post: {
        title: "Potwierdź zarobki z poleceń",
        titleShort: "Potwierdź zarobki",
        description:
          "Odblokowuje zarobki z poleceń po upływie okresu na zwroty. Działa codziennie.",
        container: {
          title: "Potwierdzanie zarobków",
          description: "Oczekujące zarobki po okresie na zwroty",
        },
        response: {
          confirmedCount: "Potwierdzone",
          failedCount: "Nieudane",
        },
        success: {
          title: "Zarobki potwierdzone",
          description: "Dojrzałe zarobki z poleceń są już do wykorzystania",
        },
      },
      task: {
        description:
          "Po upływie terminu na zwrot zamienia zarobki z poleceń na kredyty.",
      },
    },
    list: {
      get: {
        title: "Lista zarobków z poleceń",
        titleShort: "Zarobki",
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
        label: "Kod",
        description: "Widoczny w Twoim linku. 3-50 znaków.",
        placeholder: "np. OLA10",
      },
      label: {
        label: "Notatka (widzisz tylko Ty)",
        description: "Gdzie go udostępnisz.",
        placeholder: "np. bio na YouTube",
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
        titleShort: "Wypłaty",
        description: "Zarządzaj żądaniami wypłat poleceń",
      },
      post: {
        title: "Przetwórz wypłatę",
        titleShort: "Przetwórz wypłatę",
        description: "Zatwierdź, odrzuć lub zakończ żądanie wypłaty",
      },
      fields: {
        search: {
          label: "E-mail partnera",
          description: "Wpisz cały adres e-mail lub jego fragment.",
        },
        userId: {
          label: "Konto partnera",
        },
        page: {
          label: "Strona",
        },
        limit: {
          label: "Wyniki na stronę",
        },
        status: {
          all: "Wszystkie statusy",
          label: "Filtr statusu",
          description: "Filtruj według statusu wypłaty",
        },
        currency: {
          label: "Metoda wypłaty",
          description: "Filtruj według metody wypłaty",
          all: "Wszystkie metody",
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
        empty: "Brak wniosków o wypłatę",
        emptyHint: "Sprawdź inny adres e-mail lub status.",
        results: "Wnioski o wypłatę: {{count}}",
        apply: "Zastosuj filtry",
        clear: "Wyczyść filtry",
        refresh: "Odśwież",
        loading: "Wczytywanie wniosków o wypłatę…",
        amount: "Zarobione kredyty: {{credits}} · równowartość {{value}} USD",
        payoutSummary: "{{amount}} · Metoda wypłaty: {{currency}}",
        requestedAt: "Złożono {{date}}",
        processedAt: "Zaktualizowano {{date}}",
        rejectionReason: "Powód: {{reason}}",
        adminNotes: "Notatki: {{notes}}",
        openPartner: "Otwórz konto partnera",
        openPartnerFor: "Otwórz konto partnera {{email}}",
        actionFor: "{{action}} wypłatę dla {{email}}",
        previous: "Poprzednia strona",
        next: "Następna strona",
        page: "Strona {{page}} z {{total}}",
        confirmAction: "Potwierdź akcję",
        lookupFailed: "Nie udało się wczytać wniosku o wypłatę.",
        state: "Status",
        valueLabel: "Wnioskowana kwota",
        destinationLabel: "Metoda wypłaty",
        actionSaved: "Zapisano akcję dotyczącą wypłaty.",
        approveDetail:
          "Po zatwierdzeniu zarobione kredyty pozostaną zarezerwowane na tę wypłatę.",
        rejectDetail:
          "Po odrzuceniu wniosku zarezerwowane kredyty wrócą do dostępnego salda.",
        completeDetail:
          "Po wykonaniu przelewu oznacz wypłatę jako zakończoną. Odpowiednia liczba zarobionych kredytów zostanie odjęta.",
        approve: "Zatwierdź",
        reject: "Odrzuć",
        complete: "Zakończ",
        credits: "kredytów",
        partnerContext:
          "Zarobione {{confirmed}} potwierdzone, {{pending}} w okresie karencji · wypłacone {{paid}}",
        creditsLine: "{{credits}} zarobionych kredytów",
        freeLine: "Wolne po otwartych wnioskach: {{free}}",
        overBalanceSingle:
          "Ten wniosek to {{amount}}, a potwierdzone i niewypłacone jest tylko {{available}}. Nie zatwierdzaj go.",
        partnerCodes: "Kody: {{codes}} · poleceni użytkownicy: {{referred}}",
        partnerNoCodes:
          "Brak własnego kodu · {{referred}} poleconych użytkowników",
        overBalance:
          "{{count}} otwartych wniosków na {{open}}, a potwierdzone i niewypłacone jest tylko {{available}}. Nie zatwierdzaj wszystkich.",
        possibleDuplicate:
          "Możliwy duplikat: {{count}} kolejnych otwartych wniosków z tą samą kwotą i portfelem.",
        headline: "{{value}} na {{currency}}",
        overBalanceShort:
          "Ponad potwierdzone saldo (zobacz pierwszy wniosek tego partnera).",
        approveOverBalance: "Zatwierdź mimo to",
        nextStep: {
          failed:
            "Przelew się nie udał, nie pobrano żadnych kredytów. Partner może złożyć nowy wniosek.",
          processing:
            "Przelew w toku. Zakończy się lub nie powiedzie sam, nic nie trzeba robić.",
          credits:
            "Wypłaty w kredytach są przeliczane automatycznie. Nic nie trzeba robić.",
        },
        prepareBill: "Przygotuj fakturę zakupu",
        codeReport: "Raport kodu",
      },
    },
  },

  // Payout endpoint + errors
  payout: {
    get: {
      title: "Twoje zarobki",
      titleShort: "Moje zarobki",
      description: "Wyświetl zarobki z poleceń i historię wypłat",
    },
    post: {
      title: "Poproś o wypłatę",
      titleShort: "Poproś o wypłatę",
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
      credits:
        "Wypłaty w kredytach są przeliczane przy złożeniu wniosku, więc oczekujący wniosek utknął. Odrzuć go, by zwolnić środki; partner może złożyć nowy.",
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
      step2Title: "Udostępnij link - lub link do skilla",
      step2Body:
        "Link polecający: {{directPct}} każdej płatności od tego użytkownika, wiecznie. Twój skill udostępniany przez innych: {{skillBonusPct}} każdej płatności tych użytkowników - dochód z linków, których nigdy nie wrzuciłeś/aś.",
      step3Title: "Otrzymaj płatność",
      step3Body:
        "Zarobki odblokowują się {{holdDays}} dni po każdej płatności - to okres na zwroty. Potem użyj ich jako kredytów do czatów lub wypłać w krypto.",
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
      pendingTitle: "{{amount}} w oczekiwaniu",
      pendingNote:
        "Odblokowanie {{holdDays}} dni po każdej płatności - to okres na zwroty. Zwrócona płatność anuluje swoje zarobki.",
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
      conversionFailed:
        "Zamiana nie powiodła się. Twoje zarobki są nietknięte - spróbuj ponownie za chwilę.",
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
      detail: "Coś poszło nie tak po naszej stronie: {{error}}",
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
