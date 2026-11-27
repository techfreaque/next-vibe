import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    publicCap: "public-cap",
    admin: "admin",
  },
  get: {
    perDayUnit: "kredytów/dzień",
    lead: "Odwiedzający",
    ip: "Adres IP",
    globalCap: "Dzienny limit osiągnięty",
    leadCap: "Limit odwiedzającego osiągnięty",
    ipCap: "Limit IP osiągnięty",
    singleRequest: "Zapytanie za drogie",
    failClosed: "Zablokowane, sprawdzenie limitu nie powiodło się",
    poolReserved: "Kredyty zarezerwowane",
    threshold80: "Zużyto 80% limitu",
    threshold100: "Limit wyczerpany",
    other: "Inne",
    changeCap: "Zmień limit",
    limits: "Limity",
    capHint: "Wspólny dla wszystkich odwiedzających bez płatnego planu",
    usedOfCap: "Zużyto {{used}} z {{cap}}",
    exceededHint: "Darmowi odwiedzający są zablokowani do dziennego resetu.",
    resetAt: "Ostatni reset {{time}}",
    title: "Pobierz publiczny dzienny limit",
    titleShort: "Dzienny limit",
    description:
      "Wyświetl dzisiejsze globalne wydatki i limit darmowych kredytów",
    container: {
      title: "Publiczny dzienny limit darmowych kredytów",
      description:
        "Globalny dzienny limit wydatków dla użytkowników niepłacących",
    },
    spendToday: {
      content: "Wydano dziś",
    },
    capAmount: {
      content: "Dzienny limit",
    },
    remainingToday: {
      content: "Pozostało dziś",
    },
    percentUsed: {
      content: "wykorzystania",
    },
    lastResetAt: {
      content: "Ostatni reset",
    },
    capExceeded: {
      content: "Limit przekroczony",
    },
    perLeadCap: { content: "Limit na leada" },
    perIpCap: { content: "Limit na IP" },
    topSpenders: { content: "Najwięksi darmowi użytkownicy dziś" },
    recentEvents: { content: "Ostatnie zdarzenia limitu" },
    noData: "Dziś jeszcze nic.",
    success: {
      title: "Status limitu pobrany",
      description:
        "Status dziennego limitu darmowych kredytów pobrany pomyślnie",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      network: {
        title: "Błąd sieci",
        description: "Połączenie sieciowe nie powiodło się",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: {
        title: "Zabronione",
        description: "Wymagany dostęp administratora",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Konfiguracja limitu nie została znaleziona",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się pobrać statusu limitu",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt zasobów",
      },
    },
  },
  post: {
    perDayUnit: "kredytów dziennie",
    back: "Wróć",
    decrease: "Zmniejsz o 100",
    increase: "Zwiększ o 100",
    title: "Zaktualizuj publiczny dzienny limit",
    titleShort: "Zmień limit",
    description:
      "Zaktualizuj globalny dzienny limit kredytów dla użytkowników niepłacących",
    capAmount: {
      label: "Dzienny limit (kredyty)",
      description:
        "Maksymalna liczba kredytów, które użytkownicy niepłacący mogą łącznie wydać dziennie",
      placeholder: "np. 500",
    },
    perLeadCap: {
      label: "Dzienny limit na leada (kredyty)",
      description: "Ile darmowych kredytów może zużyć jeden gość dziennie",
      placeholder: "np. 20",
    },
    perIpCap: {
      label: "Dzienny limit na IP (kredyty)",
      description: "Ile darmowych kredytów może zużyć jedno IP dziennie",
      placeholder: "np. 40",
    },
    message: {
      content: "Wynik",
    },
    success: {
      title: "Limit zaktualizowany",
      description: "Dzienny limit zaktualizowany pomyślnie",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Limit musi być liczbą dodatnią",
      },
      network: {
        title: "Błąd sieci",
        description: "Połączenie sieciowe nie powiodło się",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: {
        title: "Zabronione",
        description: "Wymagany dostęp administratora",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Konfiguracja limitu nie została znaleziona",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się zaktualizować limitu",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt zasobów",
      },
    },
  },
  repository: {
    capUpdated: "Dzienny limit ustawiony na {{capAmount}} kredytów",
    capExceeded:
      "Na to zapytanie nie wystarczy już darmowych kredytów z dzisiejszej puli. Spróbuj jutro lub skorzystaj z płatnych kredytów.",
    leadCapExceeded:
      "Dzienny darmowy limit na tym urządzeniu lub w tej sieci jest wyczerpany. Twoje darmowe kredyty zostają na koncie i znowu zadziałają jutro. Płatne kredyty działają od razu.",
    reservedByRunningReply:
      "Twoje darmowe kredyty pokrywają jeszcze trwającą odpowiedź. Poczekaj, aż się skończy, i wyślij ponownie.",
    capUnavailable:
      "Darmowe kredyty są chwilowo niedostępne. Spróbuj ponownie później.",
    getCapFailed: "Nie udało się pobrać konfiguracji limitu darmowych kredytów",
    updateCapFailed: "Nie udało się zaktualizować limitu darmowych kredytów",
    incrementFailed: "Nie udało się zarejestrować wydatków darmowych kredytów",
  },
};
