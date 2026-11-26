import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Użytkownicy",
  get: {
    title: "Użytkownicy",
    titleShort: "Użytkownicy",
    description:
      "Każde konto: ile zapłaciło, ile wydaje i kiedy było ostatnio aktywne. Szukaj, filtruj po przychodzie, aktywności, dacie rejestracji lub źródle, sortuj po każdej kolumnie z pieniędzmi.",
    fields: {
      hasSpentCredits: "Użyto kredytów",
      requiredState: {
        label: "Wymagany stan",
        description: "Konto musi spełniać także ten warunek",
      },
      accountLocale: {
        label: "Język konta",
        description: "Dokładny kod języka konta, np. pl-PL",
      },
      attributedRefCode: {
        label: "Przypisany kod polecenia",
        description: "Kod z przypisanego polecenia lub z pierwszej wizyty",
      },
      search: {
        label: "Szukaj kont",
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
        description: "Aktywność = wydatki kredytów, logowanie lub płatność",
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
      audience: {
        label: "Odbiorcy",
        description:
          "Tylko ludzie pomija adminów i adresy testowe (example.com, .invalid, fixtures .test)",
        placeholder: "Wszyscy",
      },
      channel: {
        label: "Kanał",
        description:
          "Kanał pierwszego kontaktu, dokładnie (google, youtube, direct). none = konta bez ścieżki",
        placeholder: "youtube",
      },
      channelType: {
        label: "Typ kanału",
        description: "Jak dotarł pierwszy kontakt",
        placeholder: "Dowolny typ",
      },
      refCode: {
        label: "Kod polecenia",
        description:
          "Kod z pierwszej wizyty lub zaliczonego polecenia, dokładnie",
        placeholder: "FRIEND2024",
      },
      plan: {
        label: "Plan",
        description: "Aktywna lub próbna subskrypcja w tym planie",
        placeholder: "Dowolny plan",
      },
      activeFrom: {
        label: "Wydawał kredyty od",
        description: "Zużycie kredytów w tym dniu lub później",
      },
      activeTo: {
        label: "Wydawał kredyty do",
        description: "Zużycie kredytów w tym dniu lub wcześniej",
      },
      spentMin: {
        label: "Wydał co najmniej",
        description:
          "Łącznie wydane kredyty. Połącz z Nigdy nie płacił, by znaleźć darmowych spalaczy",
      },
      paidFrom: {
        label: "Zapłacił od",
        description: "Udana płatność w tym dniu lub później",
      },
      paidTo: {
        label: "Zapłacił do",
        description: "Udana płatność w tym dniu lub wcześniej",
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
    audience: {
      all: "Wszyscy",
      humans: "Tylko ludzie",
    },
    channelType: {
      campaign: "Kampania",
      referral: "Polecenie",
      organic: "Organiczny",
      direct: "Bezpośredni",
    },
    plan: {
      subscription: "Starter",
      plus: "Plus",
      pro: "Pro",
      ultra: "Ultra",
    },
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
    planStatus: "Plan",
    accountActive: "Aktywne",
    accountInactive: "Nieaktywne",
    none: "Brak",
    creditAmount: "{{count}} kred.",
    spent30d: "{{count}} w 30 dni",
    notTracked: "nieśledzone",
    oneOff: "Tylko kredyty",
    refCode: "ref:{{code}}",
    chips: {
      paid: "Zapłacił",
      signedUp: "Rejestracja",
      spentCredits: "Wydawał kredyty",
      remove: "Usuń filtr {{label}}",
    },
    creditsAny: "Dowolnie",
    titleWithCount: "Użytkownicy ({{count}})",
    loading: "Wczytywanie użytkowników...",
    never: "Nigdy",
    referredBy: "przez {{email}}",
    actions: {
      open: "Otwórz",
      select: "Wybierz",
      openUser: "Otwórz konto {{email}}",
      selectUser: "Wybierz {{email}}",
      stats: "Raport rejestracji",
      refresh: "Odśwież",
      newUser: "Nowy użytkownik",
      clearFilters: "Wyczyść filtry",
      moreFilters: "Filtry",
    },
    kpi: {
      activeSpentHint: "{{credits}} kredytów wydanych w 30 dni",
      matchingHint:
        "Rejestracje tygodniowo, ostatnie 12 pełnych tygodni. Zeszły tydzień: {{last}}, ten do teraz: {{count}}",
      verified: "E-mail potwierdzony",
      verifiedHint: "Zweryfikowane: {{count}}",
      active: "Aktywni 30 dni",
      matching: "Pasujący",
      paying: "Płacący",
      payingShare: "{{percent}}% pasujących",
      revenue: "Przychód łącznie",
      revenueHint: "Udane płatności, USD",
      credits: "Kredyty na kontach",
      creditsHint: "Suma sald portfeli",
    },
    quick: {
      freeBurn: "Darmowe spalanie {{min}}+ ({{count}})",
      banned: "Zablokowani ({{count}})",
      humans: "Tylko ludzie",
      paying: "Płacący ({{count}})",
      free: "Nigdy nie płacili",
      activeWeek: "Aktywni 7 dni",
      dormant: "Uśpieni 30+ dni",
      never: "Nigdy aktywni",
    },
    columns: {
      flags: "Flagi",
      user: "Użytkownik",
      joined: "Od",
      lastActive: "Ostatnio",
      credits: "Saldo",
      spent: "Wydane (łącznie)",
      paid: "Zapłacono",
      subscription: "Plan",
      source: "Źródło",
      id: "ID",
    },
    compact: {
      joined: "od {{date}}",
      active: "aktywny {{when}}",
      neverActive: "nigdy aktywny",
      paid: "zapłacił {{amount}}",
      free: "nigdy nie płacił",
      spent: "{{count}} kredytów wydanych",
    },
    flags: {
      freeBurn: "Darmowe spalanie",
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
      previous: "Poprzednia strona",
      next: "Następna strona",
      showing: "{{start}}-{{end}} z {{total}}",
    },
    text: {
      subheader:
        "{{verified}} potwierdzonych | {{active}} aktywnych 30 dni | {{banned}} zablokowanych | rejestracje/tydzień (12 tyg.): {{weekly}}",
      header:
        "{{total}} użytkowników | {{paying}} płacących | {{paid}} przychodu łącznie",
      pageHint: "Strona {{page}}/{{pages}}. Dalej: --page={{next}}",
      detailHint: "Szczegóły: vibe users-view --userId=<ID>",
    },
    planFree: "Darmowy",
  },
};
