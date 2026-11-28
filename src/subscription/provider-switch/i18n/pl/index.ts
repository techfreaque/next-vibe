import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Płatności",
  tags: {
    subscription: "Subskrypcja",
    billing: "Rozliczenia",
  },

  get: {
    title: "Przenieś swój plan",
    titleShort: "Przenieś plan",
    description:
      "Pokazuje, czy Twój plan kartowy można przenieść do nowego operatora płatności i kiedy zaczyna się tam rozliczanie.",
  },
  post: {
    title: "Rozpocznij przeniesienie planu",
    titleShort: "Przenieś plan",
    description:
      "Otwiera płatność u nowego operatora dla Twojego obecnego planu. Stary plan kartowy kończy się po opłaceniu nowego. Bez podwójnej opłaty.",
  },

  form: {
    fields: {
      provider: {
        label: "Metoda płatności",
        description:
          "Karta (Whop) lub krypto (NOWPayments). Domyślnie główna metoda.",
      },
    },
  },

  response: {
    offer: "Oferta",
    targetProvider: "Nowy operator",
    providers: "Metody płatności",
    nowPaymentsAcceptsCards: "Płatności kartą przez NOWPayments",
    cryptoMinUsd: "Najniższa kwota krypto (USD)",
    plan: "Plan",
    billingInterval: "Okres rozliczeniowy",
    pastDue: "Zaległość",
    deadline: "Plan działa do",
    billingStartAt: "Nowe rozliczanie od",
    firstPeriodEnd: "Koniec pierwszego nowego okresu",
    carryOver: "Przeniesienie opłaconego czasu",
    checkoutUrl: "Link do płatności",
    sessionId: "Sesja płatności",
  },

  widget: {
    badge: "Wymagane działanie",
    title: "Za dużo wolności dla operatora kart",
    description:
      "Uznali, że AI, która odpowiada swobodnie, nie pasuje do ich zasad. Nie zmienimy ani jednej odpowiedzi. Twój plan i kredyty są bezpieczne.",
    deadline:
      "Twój plan działa do {{date}}. Przenieś go wcześniej, żeby działał dalej.",
    carryExtend:
      "Płacisz teraz, a pierwszy nowy okres trwa do {{date}}. Opłacone dni przechodzą razem z Tobą.",
    carryDeferred:
      "Dziś nic nie pobieramy. Rozliczanie u nowego operatora zaczyna się {{date}}, gdy kończy się opłacony czas.",
    pastDue:
      "Ostatnie odnowienie nie przeszło. Przenieś plan teraz, żeby go zachować.",
    unsupportedPlan:
      "Nowa płatność kartą nie obsługuje jeszcze tego planu w rozliczeniu miesięcznym. Wybierz rozliczenie roczne albo zapłać krypto.",
    cta: "Przenieś mój plan",
    ctaLoading: "Otwieranie płatności...",
    noDoubleCharge:
      "Stary plan kartowy kończy się, gdy tylko opłacisz nowy. Nigdy nie płacisz podwójnie.",
    checkoutReady: "Płatność gotowa.",
    openCheckout: "Otwórz płatność",
    notEligible: "Brak planu kartowego do przeniesienia.",
  },

  manage: {
    cancelOld: "Anuluj stary plan kartowy",
    moveFirst:
      "Chcesz zachować plan? Przenieś go powyżej. Anulowanie tutaj go kończy.",
  },

  enums: {
    paymentProvider: {
      nowpayments: "NowPayments",
      stripe: "Stripe",
      whop: "Whop",
    },
    carryOver: {
      extendFirstPeriod: "Opłata teraz, opłacony czas wydłuża pierwszy okres",
      deferredStart: "Rozliczanie zaczyna się po końcu opłaconego czasu",
    },
    status: {
      pending: "Płatność rozpoczęta",
      completed: "Przeniesiony",
      cancelFailed: "Przeniesiony, anulowanie starego planu nieudane",
    },
    cancelMode: {
      atPeriodEnd: "Z końcem okresu",
      immediate: "Natychmiast",
    },
    offer: {
      available: "Dostępne",
      planNotSupported: "Plan nieobsługiwany",
      notEligible: "Nie kwalifikuje się",
    },
    notice: {
      sending: "Wysyłanie",
      sent: "Wysłane",
      failed: "Nieudane",
    },
  },

  errors: {
    validation: {
      title: "Nieprawidłowe żądanie",
      description: "Sprawdź żądanie i spróbuj ponownie.",
    },
    unauthorized: {
      title: "Wymagane logowanie",
      description: "Zaloguj się, żeby przenieść plan.",
    },
    forbidden: {
      title: "Brak dostępu",
      description: "To konto nie może przenieść planu.",
    },
    notFound: {
      title: "Brak planu kartowego",
      description: "Na tym koncie nie ma planu kartowego do przeniesienia.",
    },
    conflict: {
      title: "Nie ma czego przenieść",
      description:
        "Przenoszenie planów jest teraz zamknięte albo tego planu nie da się przenieść. Twój plan działa dalej.",
    },
    unsupportedPlan: {
      title: "Plan nieobsługiwany",
      description:
        "Nowy operator nie obsługuje tego planu w tym okresie rozliczeniowym.",
    },
    server: {
      title: "Coś się zepsuło",
      description: "Nie udało się otworzyć płatności. Spróbuj za minutę.",
    },
    network: {
      title: "Błąd sieci",
      description: "Brak połączenia z serwerem. Sprawdź internet.",
    },
    unknown: {
      title: "Nieoczekiwany błąd",
      description: "Stało się coś nieoczekiwanego. Spróbuj ponownie.",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Najpierw zapisz albo odrzuć zmiany.",
    },
  },

  success: {
    title: "Płatność gotowa",
    description: "Dokończ płatność, żeby przenieść plan.",
  },
};
