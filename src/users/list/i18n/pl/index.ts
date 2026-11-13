import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Użytkownicy",
  get: {
    title: "Użytkownicy",
    titleShort: "Użytkownicy",
    description:
      "Każde konto: ile zapłaciło, ile wydaje i kiedy było ostatnio aktywne. Szukaj, filtruj po przychodzie, aktywności, dacie rejestracji lub źródle, sortuj po każdej kolumnie z pieniędzmi.",
    fields: {
      search: {
        label: "Szukaj",
        description: "E-mail, imię lub początek ID użytkownika",
        placeholder: "Szukaj e-maila, imienia lub ID...",
      },
      roles: {
        label: "Role",
        description: "Użytkownicy z dowolną z tych ról",
        placeholder: "Dowolna rola",
      },
      accountState: {
        label: "Stan konta",
        description:
          "Aktywne, nieaktywne, zablokowane, zweryfikowane lub niezweryfikowane",
        placeholder: "Dowolny stan",
      },
      payer: {
        label: "Płacący czy darmowy",
        description: "Płacący = co najmniej jedna udana płatność",
        placeholder: "Płacący lub darmowi",
      },
      subscription: {
        label: "Subskrypcja",
        description: "Aktywna teraz, kiedykolwiek lub nigdy",
        placeholder: "Dowolna subskrypcja",
      },
      lastActive: {
        label: "Ostatnio aktywny",
        description:
          "Aktywność = wydane kredyty (własny portfel lub powiązane portfele leadów) albo nowe logowanie",
        placeholder: "Kiedykolwiek",
      },
      signupFrom: {
        label: "Rejestracja od",
        description: "Pierwszy uwzględniony dzień rejestracji",
      },
      signupTo: {
        label: "Rejestracja do",
        description: "Ostatni uwzględniony dzień rejestracji",
      },
      creditsMin: {
        label: "Kredyty co najmniej",
        description: "Minimalne saldo portfela",
      },
      creditsMax: {
        label: "Kredyty najwyżej",
        description: "Maksymalne saldo portfela",
      },
      source: {
        label: "Źródło",
        description:
          "Kanał pierwszego kontaktu, UTM źródło/medium/kampania, host odsyłający lub kod polecający",
        placeholder: "google, ref:, newsletter...",
      },
      referralActivity: {
        label: "Jako polecający",
        description: "Użytkownicy z linkiem polecającym i jego efekty",
        placeholder: "Dowolnie",
      },
      sortBy: {
        label: "Sortuj według",
        description: "Kolumna sortowania",
      },
      sortOrder: {
        label: "Kolejność",
        description: "Rosnąco lub malejąco",
      },
      page: {
        label: "Strona",
        description: "Numer strony, od 1",
      },
      limit: {
        label: "Na stronę",
        description: "Użytkowników na stronę (maks. 200)",
      },
    },
    response: {
      users: "Użytkownicy",
      summary: "Podsumowanie",
    },
    errors: {
      unauthorized: {
        title: "Brak logowania",
        description: "Zaloguj się, aby zobaczyć użytkowników",
      },
      validation: {
        title: "Nieprawidłowe filtry",
        description: "Sprawdź wartości filtrów i spróbuj ponownie",
      },
      forbidden: {
        title: "Tylko dla adminów",
        description: "Potrzebujesz roli admina",
      },
      server: {
        title: "Nie udało się wczytać użytkowników",
        description: "Serwer nie wczytał listy użytkowników",
      },
      unknown: {
        title: "Nieoczekiwany błąd",
        description: "Coś poszło nie tak przy wczytywaniu użytkowników",
      },
      conflict: {
        title: "Konflikt",
        description: "Żądanie koliduje z bieżącymi danymi",
      },
      network: {
        title: "Błąd sieci",
        description: "Brak połączenia z serwerem",
      },
      notFound: {
        title: "Brak użytkowników",
        description: "Żaden użytkownik nie pasuje do filtrów",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Użytkownicy wczytani",
      description: "Lista użytkowników wczytana",
    },
  },
  enums: {
    sortOrder: {
      asc: "Rosnąco",
      desc: "Malejąco",
    },
    role: {
      admin: "Admin",
      customer: "Klient",
      partnerAdmin: "Admin partnera",
      partnerEmployee: "Pracownik partnera",
      public: "Publiczny",
    },
    subscription: {
      any: "Dowolna",
      hasActive: "Aktywna teraz",
      hadAny: "Kiedykolwiek",
      never: "Nigdy",
    },
    referrer: {
      any: "Dowolnie",
      hasCode: "Ma link polecający",
      hasClicks: "Link ma kliknięcia",
      hasSignups: "Link ma rejestracje",
      hasSubscribers: "Link ma płacących subskrybentów",
    },
    sortField: {
      createdAt: "Data rejestracji",
      lastActive: "Ostatnia aktywność",
      credits: "Saldo kredytów",
      totalPaid: "Łącznie zapłacono",
      creditsSpent: "Wydane kredyty",
      email: "E-mail",
      name: "Imię",
    },
    accountState: {
      active: "Aktywne",
      inactive: "Nieaktywne",
      banned: "Zablokowane",
      verified: "E-mail zweryfikowany",
      unverified: "E-mail niezweryfikowany",
    },
    payer: {
      any: "Płacący lub darmowi",
      paid: "Płacący",
      free: "Nigdy nie zapłacili",
    },
    lastActive: {
      any: "Kiedykolwiek",
      day: "Ostatnie 24 godziny",
      week: "Ostatnie 7 dni",
      month: "Ostatnie 30 dni",
      dormant: "Uśpieni 30+ dni",
      never: "Nigdy aktywni",
    },
  },
  widget: {
    creditsAny: "Dowolnie",
    titleWithCount: "Użytkownicy ({{count}})",
    loading: "Wczytywanie użytkowników...",
    never: "Nigdy",
    referredBy: "przez {{email}}",
    actions: {
      stats: "Statystyki",
      refresh: "Odśwież",
      newUser: "Nowy użytkownik",
      clearFilters: "Wyczyść filtry",
      moreFilters: "Filtry",
    },
    kpi: {
      matching: "Pasujący",
      paying: "Płacący",
      payingShare: "{{percent}}% pasujących",
      revenue: "Przychód łącznie",
      revenueHint: "Udane płatności, USD",
      credits: "Kredyty na kontach",
      creditsHint: "Suma sald portfeli",
    },
    quick: {
      paying: "Płacący",
      free: "Nigdy nie płacili",
      activeWeek: "Aktywni 7 dni",
      dormant: "Uśpieni 30+ dni",
      never: "Nigdy aktywni",
    },
    columns: {
      user: "Użytkownik",
      joined: "Od",
      lastActive: "Ostatnio",
      credits: "Kredyty",
      spent: "Wydane",
      paid: "Zapłacono",
      subscription: "Plan",
      source: "Źródło",
      id: "ID",
    },
    flags: {
      admin: "admin",
      banned: "Zablokowany",
      unverified: "Niezweryfikowany",
    },
    empty: {
      none: "Jeszcze brak użytkowników",
      filtered: "Nikt nie pasuje do tych filtrów",
      filteredHint: "Poluzuj filtr albo wyczyść wszystkie.",
    },
    pagination: {
      showing: "{{start}}-{{end}} z {{total}}",
    },
    text: {
      header:
        "{{total}} użytkowników | {{paying}} płacących | {{paid}} przychodu łącznie",
      pageHint: "Strona {{page}}/{{pages}}. Dalej: --page={{next}}",
      detailHint: "Szczegóły: vibe users-view --userId=<ID>",
    },
  },
};
