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
            currentUses: "Aktualna liczba użyć",
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
    fields: {
      totalSignups: "Łączne rejestracje",
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
      "🎉 Twój kod polecający jest gotowy! Skopiuj poniższy link i zacznij zarabiać 20% prowizji od każdej subskrypcji.",
    message: "Wiadomość",
  },

  // Payout errors
  payout: {
    errors: {
      minimumAmount: "Minimalna kwota wypłaty to $40",
      walletRequired: "Adres portfela wymagany dla wypłat krypto",
      insufficientBalance: "Niewystarczające saldo do wypłaty",
      notFound: "Nie znaleziono żądania wypłaty",
      invalidStatus: "Nieprawidłowy status żądania wypłaty dla tej operacji",
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
