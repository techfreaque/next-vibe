import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  enums: {
    resolution: {
      "1m": "1 Minuta",
      "3m": "3 Minuty",
      "5m": "5 Minut",
      "15m": "15 Minut",
      "30m": "30 Minut",
      "1h": "1 Godzina",
      "4h": "4 Godziny",
      "1d": "1 Dzień",
      "1w": "1 Tydzień",
      "1M": "1 Miesiąc",
    },
    runStatus: {
      running: "W toku",
      completed: "Ukończono",
      failed: "Niepowodzenie",
    },
    backtestActionMode: {
      simulate: "Symulacja",
      execute: "Wykonanie",
    },
    graphOwnerType: {
      system: "System",
      admin: "Admin",
      user: "Użytkownik",
    },
    triggerType: {
      manual: "Ręczny",
      cron: "Zaplanowany",
    },
  },
  fields: {
    source: { label: "Źródło", description: "Wejściowa seria czasowa" },
    resolution: {
      label: "Rozdzielczość",
      description: "Przedział czasowy obliczeń",
    },
    range: { label: "Zakres", description: "Zakres czasu do obliczenia" },
    lookback: {
      label: "Wsteczny",
      description: "Dodatkowe słupki przed początkiem zakresu",
    },
    result: { label: "Wynik", description: "Wyjściowa seria czasowa" },
    meta: { label: "Meta", description: "Metadane wykonania węzła" },
  },
  tags: {
    vibeSense: "vibe-sense",
    analytics: "analityka",
    pipeline: "potok",
  },
  graphs: {
    list: {
      title: "Grafy potoków",
      description:
        "Lista wszystkich grafów widocznych dla bieżącego użytkownika",
      container: { title: "Grafy", description: "Wszystkie grafy potoków" },
      response: { graphs: "Grafy" },
      success: {
        title: "Grafy załadowane",
        description: "Grafy potoków pobrane pomyślnie",
      },
      errors: {
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: {
          title: "Zabroniony",
          description: "Wymagany dostęp administratora",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się załadować grafów",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe żądanie",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Nie znaleziono grafów",
        },
        conflict: { title: "Konflikt", description: "Konflikt zasobów" },
        network: {
          title: "Błąd sieci",
          description: "Żądanie sieciowe nie powiodło się",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Najpierw zapisz zmiany",
        },
      },
    },
    create: {
      title: "Utwórz graf",
      description: "Utwórz nowy graf potoku",
      fields: {
        name: {
          label: "Nazwa",
          description: "Nazwa wyświetlana grafu",
          placeholder: "Mój graf",
        },
        slug: {
          label: "Slug",
          description: "Unikalny identyfikator",
          placeholder: "moj-graf",
        },
        description: {
          label: "Opis",
          description: "Opcjonalny opis",
          placeholder: "",
        },
        config: {
          label: "Konfiguracja",
          description: "Konfiguracja DAG grafu",
        },
      },
      response: { id: "ID grafu" },
      success: {
        title: "Graf utworzony",
        description: "Graf potoku utworzony pomyślnie",
      },
      errors: {
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: {
          title: "Zabroniony",
          description: "Wymagany dostęp administratora",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się utworzyć grafu",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowa konfiguracja grafu",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Zasób nie znaleziony",
        },
        conflict: { title: "Konflikt", description: "Slug grafu już istnieje" },
        network: {
          title: "Błąd sieci",
          description: "Żądanie sieciowe nie powiodło się",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Najpierw zapisz zmiany",
        },
      },
    },
    get: {
      title: "Pobierz graf",
      description: "Pobierz określony graf według ID",
      fields: { id: { label: "ID grafu", description: "UUID wersji grafu" } },
      response: { graph: "Graf" },
      success: {
        title: "Graf załadowany",
        description: "Graf pobrany pomyślnie",
      },
      errors: {
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: { title: "Zabroniony", description: "Odmowa dostępu" },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się załadować grafu",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe ID",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Graf nie znaleziony",
        },
        conflict: { title: "Konflikt", description: "Konflikt zasobów" },
        network: {
          title: "Błąd sieci",
          description: "Żądanie sieciowe nie powiodło się",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Najpierw zapisz zmiany",
        },
      },
    },
    edit: {
      title: "Edytuj graf",
      description:
        "Rozgałęź i edytuj graf (tworzy nową wersję, nigdy nie mutuje)",
      fields: {
        id: { label: "ID grafu", description: "UUID wersji do rozgałęzienia" },
        config: {
          label: "Konfiguracja",
          description: "Zaktualizowana konfiguracja grafu",
        },
        name: { label: "Nazwa", description: "Zaktualizowana nazwa" },
        description: { label: "Opis", description: "Zaktualizowany opis" },
      },
      response: { id: "ID nowej wersji" },
      success: {
        title: "Graf rozgałęziony",
        description: "Nowa wersja grafu utworzona pomyślnie",
      },
      errors: {
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: { title: "Zabroniony", description: "Odmowa dostępu" },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się edytować grafu",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowa konfiguracja",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Graf nie znaleziony",
        },
        conflict: { title: "Konflikt", description: "Konflikt zasobów" },
        network: {
          title: "Błąd sieci",
          description: "Żądanie sieciowe nie powiodło się",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Najpierw zapisz zmiany",
        },
      },
    },
    promote: {
      title: "Awansuj do systemu",
      description: "Awansuj graf administratora do właściciela systemu",
      fields: {
        id: { label: "ID grafu", description: "UUID grafu do awansu" },
      },
      response: { id: "ID grafu" },
      success: {
        title: "Graf awansowany",
        description: "Graf pomyślnie awansowany do systemu",
      },
      errors: {
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: {
          title: "Zabroniony",
          description: "Wymagany dostęp administratora",
        },
        server: { title: "Błąd serwera", description: "Awans nie powiódł się" },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe ID",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Graf nie znaleziony",
        },
        conflict: { title: "Konflikt", description: "Konflikt zasobów" },
        network: {
          title: "Błąd sieci",
          description: "Żądanie sieciowe nie powiodło się",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Najpierw zapisz zmiany",
        },
      },
    },
    trigger: {
      title: "Uruchom graf",
      description: "Ręcznie uruchom wykonanie grafu na żądanie",
      fields: {
        id: { label: "ID grafu", description: "UUID grafu do uruchomienia" },
        rangeFrom: { label: "Od", description: "Początek zakresu (data ISO)" },
        rangeTo: { label: "Do", description: "Koniec zakresu (data ISO)" },
      },
      response: {
        nodeCount: "Wykonane węzły",
        errorCount: "Błędy",
        errors: "Błędy",
      },
      success: {
        title: "Graf wykonany",
        description: "Graf wykonany pomyślnie",
      },
      errors: {
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: {
          title: "Zabroniony",
          description: "Wymagany dostęp administratora",
        },
        server: {
          title: "Błąd serwera",
          description: "Wykonanie grafu nie powiodło się",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Graf nie znaleziony",
        },
        conflict: { title: "Konflikt", description: "Konflikt zasobów" },
        network: {
          title: "Błąd sieci",
          description: "Żądanie sieciowe nie powiodło się",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Najpierw zapisz zmiany",
        },
      },
    },
    backtest: {
      title: "Uruchom backtest",
      description:
        "Uruchom backtest na historycznym zakresie (akcje symulowane)",
      fields: {
        id: { label: "ID grafu", description: "UUID wersji grafu" },
        rangeFrom: {
          label: "Od",
          description: "Początek zakresu backtestowego",
        },
        rangeTo: { label: "Do", description: "Koniec zakresu backtestowego" },
        resolution: {
          label: "Rozdzielczość",
          description: "Ramy czasowe do oceny",
        },
      },
      response: {
        runId: "ID przebiegu",
        eligible: "Kwalifikuje się",
        ineligibleNodes: "Niekwalifikujące węzły",
      },
      success: {
        title: "Backtest zakończony",
        description: "Backtest przeprowadzony pomyślnie",
      },
      errors: {
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: {
          title: "Zabroniony",
          description: "Wymagany dostęp administratora",
        },
        server: {
          title: "Błąd serwera",
          description: "Backtest nie powiódł się",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Graf nie znaleziony",
        },
        conflict: { title: "Konflikt", description: "Konflikt zasobów" },
        network: {
          title: "Błąd sieci",
          description: "Żądanie sieciowe nie powiodło się",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Najpierw zapisz zmiany",
        },
      },
    },
    data: {
      title: "Dane grafu",
      description: "Pobierz dane szeregów czasowych dla grafu",
      fields: {
        id: { label: "ID grafu", description: "UUID grafu" },
        rangeFrom: { label: "Od", description: "Początek zakresu" },
        rangeTo: { label: "Do", description: "Koniec zakresu" },
      },
      response: { series: "Serie", signals: "Sygnały" },
      success: {
        title: "Dane załadowane",
        description: "Dane grafu pobrane pomyślnie",
      },
      errors: {
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: { title: "Zabroniony", description: "Odmowa dostępu" },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się pobrać danych",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Graf nie znaleziony",
        },
        conflict: { title: "Konflikt", description: "Konflikt zasobów" },
        network: {
          title: "Błąd sieci",
          description: "Żądanie sieciowe nie powiodło się",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Najpierw zapisz zmiany",
        },
      },
    },
  },
  indicators: {
    ema: {
      description: "Wykładnicza średnia krocząca",
      input: { source: { label: "Źródło" } },
      output: { value: { label: "EMA" } },
      params: {
        period: { label: "Okres", description: "Liczba okresów (1–500)" },
      },
    },
    rsi: {
      description: "Wskaźnik siły względnej - oscylator momentum (0–100)",
      input: { source: { label: "Źródło" } },
      output: { value: { label: "RSI" } },
      params: {
        period: { label: "Okres", description: "Okresy wsteczne (2–100)" },
      },
    },
    bollinger: {
      description:
        "Wstęgi Bollingera - obwiednia zmienności wokół średniej kroczącej",
      input: { source: { label: "Źródło" } },
      output: {
        upper: { label: "Górna wstęga" },
        middle: { label: "Środkowa wstęga" },
        lower: { label: "Dolna wstęga" },
      },
      params: {
        period: { label: "Okres", description: "Okres średniej kroczącej" },
        stdDev: {
          label: "Odch. std.",
          description: "Mnożnik odchylenia standardowego",
        },
      },
    },
    macd: {
      description: "MACD - wskaźnik momentum podążający za trendem",
      input: { source: { label: "Źródło" } },
      output: {
        macd: { label: "MACD" },
        signal: { label: "Sygnał" },
        histogram: { label: "Histogram" },
      },
      params: {
        fastPeriod: { label: "Szybki okres", description: "Szybki okres EMA" },
        slowPeriod: { label: "Wolny okres", description: "Wolny okres EMA" },
        signalPeriod: {
          label: "Okres sygnału",
          description: "Okres sygnału EMA",
        },
      },
    },
    ratio: {
      description: "Oblicz A / B na znacznik czasu",
      input: { a: { label: "Licznik" }, b: { label: "Mianownik" } },
      output: { value: { label: "Stosunek" } },
    },
    delta: {
      description: "Zmiana okresu do okresu",
      input: { source: { label: "Źródło" } },
      output: { value: { label: "Delta" } },
    },
    clamp: {
      description: "Ogranicz wartości do [min, max]",
      input: { source: { label: "Źródło" } },
      output: { value: { label: "Ograniczona" } },
      params: {
        min: { label: "Min", description: "Dolna granica" },
        max: { label: "Max", description: "Górna granica" },
      },
    },
    windowAvg: {
      description: "Krocząca średnia z N okresów",
      input: { source: { label: "Źródło" } },
      output: { value: { label: "Średnia" } },
      params: {
        size: { label: "Okno", description: "Liczba okresów (1–500)" },
      },
    },
    windowSum: {
      description: "Krocząca suma z N okresów",
      input: { source: { label: "Źródło" } },
      output: { value: { label: "Suma" } },
      params: {
        size: { label: "Okno", description: "Liczba okresów (1–500)" },
      },
    },
    windowMin: {
      description: "Kroczące minimum z N okresów",
      input: { source: { label: "Źródło" } },
      output: { value: { label: "Min" } },
      params: {
        size: { label: "Okno", description: "Liczba okresów (1–500)" },
      },
    },
    windowMax: {
      description: "Kroczące maksimum z N okresów",
      input: { source: { label: "Źródło" } },
      output: { value: { label: "Max" } },
      params: {
        size: { label: "Okno", description: "Liczba okresów (1–500)" },
      },
    },
  },

  dataSources: {
    leadsCreated: {
      description: "Liczba nowych leadów na minutę",
      output: { value: { label: "Nowe leady" } },
    },
    leadsConverted: {
      description: "Liczba skonwertowanych leadów na minutę",
      output: { value: { label: "Skonwertowane leady" } },
    },
    leadsActive: {
      description: "Całkowita liczba aktywnych leadów (migawka dzienna)",
      output: { value: { label: "Aktywne leady" } },
    },
    leadsBounced: {
      description: "Liczba odrzuconych e-maili na minutę",
      output: { value: { label: "Odrzucone leady" } },
    },
    leadsEngagements: {
      description:
        "Łączne zdarzenia zaangażowania (otwarcia + kliknięcia) na minutę",
      output: { value: { label: "Zaangażowanie leadów" } },
    },
    leadsEmailsSent: {
      description: "Liczba wysłanych e-maili kampanii na minutę",
      output: { value: { label: "Wysłane e-maile" } },
    },
    leadsUnsubscribed: {
      description: "Liczba wypisanych leadów na minutę",
      output: { value: { label: "Wypisane leady" } },
    },
    leadsEmailOpens: {
      description: "Liczba śledzonych otwarć e-maili na minutę",
      output: { value: { label: "Otwarcia e-maili" } },
    },
    leadsEmailClicks: {
      description: "Liczba śledzonych kliknięć linków w e-mailach na minutę",
      output: { value: { label: "Kliknięcia e-maili" } },
    },
    leadsNewsletterSubscribers: {
      description:
        "Łączna liczba leadów z potwierdzoną subskrypcją newslettera (migawka dzienna)",
      output: { value: { label: "Subskrybenci newslettera" } },
    },
    leadsWebsiteUsers: {
      description:
        "Łączna liczba leadów ze statusem użytkownika strony (migawka dzienna)",
      output: { value: { label: "Użytkownicy strony" } },
    },
    leadsCampaignRunning: {
      description:
        "Łączna liczba leadów w aktywnej kampanii e-mailowej (migawka dzienna)",
      output: { value: { label: "W kampanii" } },
    },
    leadsInContact: {
      description: "Łączna liczba leadów w statusie kontaktu (migawka dzienna)",
      output: { value: { label: "W kontakcie" } },
    },
    leadsWebsiteVisits: {
      description: "Liczba zdarzeń wizyty na stronie na minutę",
      output: { value: { label: "Wizyty na stronie" } },
    },
    leadsFormSubmits: {
      description: "Liczba zdarzeń wysłania formularza na minutę",
      output: { value: { label: "Wysłane formularze" } },
    },
    usersRegistered: {
      description: "Liczba nowych rejestracji użytkowników na minutę",
      output: { value: { label: "Zarejestrowani użytkownicy" } },
    },
    usersActiveTotal: {
      description:
        "Całkowita liczba aktywnych zweryfikowanych użytkowników (migawka dzienna)",
      output: { value: { label: "Aktywni użytkownicy" } },
    },
    usersBanned: {
      description: "Liczba zablokowanych użytkowników na minutę (przybliżona)",
      output: { value: { label: "Zablokowani użytkownicy" } },
    },
    usersEmailVerified: {
      description:
        "Łączna liczba użytkowników ze zweryfikowanym e-mailem (migawka dzienna)",
      output: { value: { label: "Zweryfikowany e-mail" } },
    },
    usersMarketingConsent: {
      description:
        "Łączna liczba użytkowników ze zgodą marketingową (migawka dzienna)",
      output: { value: { label: "Zgoda marketingowa" } },
    },
    usersWithStripe: {
      description:
        "Łączna liczba użytkowników z kontem Stripe (migawka dzienna)",
      output: { value: { label: "Użytkownicy Stripe" } },
    },
    usersTwoFaEnabled: {
      description:
        "Łączna liczba użytkowników z włączoną 2FA (migawka dzienna)",
      output: { value: { label: "2FA włączone" } },
    },
    usersLoginAttemptsTotal: {
      description: "Łączne próby logowania na minutę",
      output: { value: { label: "Próby logowania" } },
    },
    usersLoginAttemptsFailed: {
      description: "Nieudane próby logowania na minutę",
      output: { value: { label: "Nieudane logowania" } },
    },
    creditsSpentTotal: {
      description: "Łączne wydane kredyty na minutę",
      output: { value: { label: "Wydane kredyty" } },
    },
    creditsSpentByUsers: {
      description: "Kredyty wydane przez użytkowników na minutę",
      output: { value: { label: "Kredyty (użytkownicy)" } },
    },
    creditsSpentByLeads: {
      description: "Darmowe kredyty wydane przez leady na minutę",
      output: { value: { label: "Kredyty (leady)" } },
    },
    creditsPurchased: {
      description: "Kredyty zakupione lub dodane przez subskrypcję na minutę",
      output: { value: { label: "Zakupione kredyty" } },
    },
    creditsFreeGrants: {
      description: "Darmowe kredyty przyznane leadom na minutę",
      output: { value: { label: "Darmowe kredyty" } },
    },
    creditsEarned: {
      description: "Kredyty zarobione przez polecenia na minutę",
      output: { value: { label: "Zarobione kredyty" } },
    },
    creditsExpired: {
      description: "Wygasłe kredyty na minutę",
      output: { value: { label: "Wygasłe kredyty" } },
    },
    creditsRefunded: {
      description: "Zwrócone kredyty na minutę",
      output: { value: { label: "Zwrócone kredyty" } },
    },
    creditsBalanceTotal: {
      description:
        "Łączne saldo kredytów wszystkich portfeli użytkowników (migawka dzienna)",
      output: { value: { label: "Saldo kredytów" } },
    },
    creditsSubscriptionRevenue: {
      description: "Kredyty z pakietów subskrypcyjnych na minutę",
      output: { value: { label: "Przychód z subskrypcji" } },
    },
    creditsTransferVolume: {
      description: "Wolumen transferów kredytów między portfelami na minutę",
      output: { value: { label: "Wolumen transferów" } },
    },
    creditsFreePoolUtilization: {
      description:
        "Procentowe zużycie puli darmowych kredytów (migawka dzienna)",
      output: { value: { label: "Użycie puli darmowej" } },
    },
  },

  evaluators: {
    threshold: {
      description: "Wyzwala się, gdy wartość serii spełnia porównanie ze stałą",
      input: {
        series: { label: "Seria" },
      },
      output: {
        signal: { label: "Sygnał" },
      },
      params: {
        op: {
          label: "Operator",
          description: "Operator porównania",
        },
        value: {
          label: "Wartość",
          description: "Stała do porównania",
        },
      },
    },
    and: {
      description:
        "Wyzwala się, gdy wszystkie sygnały wejściowe strzelają w tym samym znaczniku czasu",
      input: { signals: { label: "Sygnały" } },
      output: { signal: { label: "Sygnał" } },
    },
    or: {
      description:
        "Wyzwala się, gdy dowolny sygnał wejściowy strzela w danym znaczniku czasu",
      input: { signals: { label: "Sygnały" } },
      output: { signal: { label: "Sygnał" } },
    },
    not: {
      description: "Odwraca strumień sygnałów",
      input: { signal: { label: "Sygnał" } },
      output: { signal: { label: "Odwrócony" } },
    },
    crossover: {
      description: "Wyzwala się, gdy seria A przekracza serię B od dołu",
      input: {
        seriesA: { label: "Seria A" },
        seriesB: { label: "Seria B" },
      },
      output: { signal: { label: "Sygnał" } },
    },
    script: {
      description:
        "Sandboxowany ewaluator skryptowy - otrzymuje serie wejściowe, zwraca zdarzenia sygnałów",
      input: { inputs: { label: "Wejścia" } },
      output: { signal: { label: "Sygnał" } },
      params: {
        fn: {
          label: "Funkcja",
          description:
            "Ciało funkcji JS przyjmujące tablice serii wejściowych, zwracające zdarzenia sygnałów",
        },
      },
    },
  },

  transformers: {
    merge: {
      description: "Zsumuj dwie serie dla pasujących znaczników czasu",
      input: {
        a: { label: "Seria A" },
        b: { label: "Seria B" },
      },
      output: { value: { label: "Scalona" } },
    },
    ratio: {
      description: "Oblicz A / B na znacznik czasu",
      input: {
        a: { label: "Licznik" },
        b: { label: "Mianownik" },
      },
      output: { value: { label: "Stosunek" } },
    },
    delta: {
      description: "Zmiana okresu do okresu",
      input: { source: { label: "Źródło" } },
      output: { value: { label: "Delta" } },
    },
    clamp: {
      description: "Ogranicz wartości do [min, max]",
      input: { source: { label: "Źródło" } },
      output: { value: { label: "Ograniczona" } },
      params: {
        min: { label: "Min", description: "Dolna granica" },
        max: { label: "Max", description: "Górna granica" },
      },
    },
    windowAvg: {
      description: "Krocząca średnia z N okresów",
      input: { source: { label: "Źródło" } },
      output: { value: { label: "Średnia" } },
      params: {
        size: { label: "Okno", description: "Liczba okresów (1–500)" },
      },
    },
    windowSum: {
      description: "Krocząca suma z N okresów",
      input: { source: { label: "Źródło" } },
      output: { value: { label: "Suma" } },
      params: {
        size: { label: "Okno", description: "Liczba okresów (1–500)" },
      },
    },
    windowMin: {
      description: "Kroczące minimum z N okresów",
      input: { source: { label: "Źródło" } },
      output: { value: { label: "Min" } },
      params: {
        size: { label: "Okno", description: "Liczba okresów (1–500)" },
      },
    },
    windowMax: {
      description: "Kroczące maksimum z N okresów",
      input: { source: { label: "Źródło" } },
      output: { value: { label: "Max" } },
      params: {
        size: { label: "Okno", description: "Liczba okresów (1–500)" },
      },
    },
    fieldPick: {
      description: "Wyodrębnij nazwane pole z wielowartościowej serii",
      input: { source: { label: "Wielowartościowa" } },
      output: { value: { label: "Pole" } },
      params: {
        field: {
          label: "Nazwa pola",
          description: "Nazwa pola do wyodrębnienia",
        },
      },
    },
    jsonPath: {
      description:
        "Wyodrębnij wartość przez ścieżkę z notacją kropkową z meta DataPoint",
      input: { source: { label: "Źródło" } },
      output: { value: { label: "Wartość" } },
      params: {
        path: {
          label: "Ścieżka",
          description: "Ścieżka z notacją kropkową, np. data.stats.total",
        },
      },
    },
    script: {
      description: "Niestandardowa transformacja skryptowa w piaskownicy",
      input: { inputs: { label: "Wejścia" } },
      output: { value: { label: "Wynik" } },
      params: {
        fn: {
          label: "Funkcja",
          description:
            "Funkcja strzałkowa JS przyjmująca tablice serii wejściowych, zwracająca DataPoint[]",
        },
      },
    },
  },

  cleanup: {
    post: {
      title: "Czyszczenie Vibe Sense",
      description: "Uruchom czyszczenie retencji dla punktów danych",
      success: {
        title: "Czyszczenie zakończone",
        description: "Czyszczenie retencji zakończone",
      },
      response: {
        nodesProcessed: "Przetworzone węzły",
        totalDeleted: "Usunięte wiersze",
        snapshotsDeleted: "Usunięte migawki",
      },
      errors: {
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: {
          title: "Zabroniony",
          description: "Wymagany dostęp administratora",
        },
        server: {
          title: "Błąd serwera",
          description: "Czyszczenie nie powiodło się",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe żądanie",
        },
        notFound: { title: "Nie znaleziono", description: "Nie znaleziono" },
        conflict: { title: "Konflikt", description: "Konflikt" },
        network: {
          title: "Błąd sieci",
          description: "Żądanie sieciowe nie powiodło się",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Najpierw zapisz zmiany",
        },
      },
    },
    name: "Czyszczenie Vibe Sense",
    description: "Usuwa stare punkty danych i wygasa pamięć podręczną migawek",
  },
};
