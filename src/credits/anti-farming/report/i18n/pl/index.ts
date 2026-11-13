import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { antiFarming: "anty-farming", admin: "admin" },
  get: {
    title: "Raport farmingu darmowych kredytów",
    titleShort: "Raport farmingu",
    description:
      "Kto wyłudza darmowe kredyty. Najaktywniejsze podsieci według zablokowanych prób i pobranych darmowych pul, najczęstsze domeny e-mail przy powtórzonych i jednorazowych rejestracjach oraz aktywne limity.",
    fields: {
      days: {
        label: "Okres (dni)",
        description:
          "Ile dni wstecz liczyć zablokowane próby, pule gości i domeny e-mail. Pule kont zawsze liczą bieżący miesiąc UTC.",
      },
    },
    response: {
      window: "Okres",
      thresholds: "Aktywne limity",
      totals: "Zablokowane próby",
      subnetsByBlocked: "Podsieci z największą liczbą blokad",
      subnetsByClaims: "Podsieci z największą liczbą darmowych pul",
      emailDomains: "Najczęstsze domeny e-mail",
    },
    success: {
      title: "Raport farmingu gotowy",
      description: "Raport anty-farmingowy wygenerowany",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Najpierw się zaloguj",
      },
      forbidden: { title: "Brak dostępu", description: "Tylko dla adminów" },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się zbudować raportu farmingu",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Coś poszło nie tak",
      },
      validation: {
        title: "Błędne żądanie",
        description: "Liczba dni musi być między 1 a 365",
      },
      notFound: { title: "Nie znaleziono", description: "Nic nie znaleziono" },
      conflict: { title: "Konflikt", description: "Żądanie koliduje" },
      network: {
        title: "Błąd sieci",
        description: "Żądanie nie dotarło do serwera",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Najpierw zapisz zmiany",
      },
    },
  },
  widget: {
    refresh: "Odśwież",
    loading: "Ładowanie raportu farmingu...",
    windowLine:
      "Ostatnie {{days}} dni (od {{from}}). Pule kont: {{month}} (UTC).",
    kpi: {
      total: "Zablokowano łącznie",
      subnetAccountLimit: "Limit kont",
      subnetGuestLimit: "Limit gości",
      duplicateEmail: "Powtórzony e-mail",
      disposableEmail: "Jednorazowy e-mail",
    },
    col: {
      subnet: "Podsieć",
      blocked: "Blokady",
      accountGranted: "Konto tak",
      accountBlocked: "Konto nie",
      guestGranted: "Gość tak",
      guestBlocked: "Gość nie",
      lastSeen: "Ostatnio",
      domain: "Domena",
      duplicate: "Powtórzone",
      disposable: "Jednorazowe",
      total: "Razem",
    },
    colHint:
      "Konto = pule kont w tym miesiącu, Gość = pule gości w okresie. tak = dostał darmowe kredyty, nie = limit podsieci wyczerpany.",
    empty: {
      subnets: "Brak aktywności podsieci w tym okresie.",
      domains: "Brak powtórzonych ani jednorazowych rejestracji w tym okresie.",
    },
    limits: {
      accountPerSubnet: "Pule kont na podsieć miesięcznie",
      guestPerSubnet: "Pule gości na podsieć dziennie",
      guestIpWindow: "Goście z jednego IP dzielą pulę przez (godziny)",
      signupLookback: "Wydatki gościa wliczane przy rejestracji z (godzin)",
      subnetPrefix: "Rozmiar podsieci",
    },
  },
};
