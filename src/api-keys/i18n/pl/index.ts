import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Konto",

  widget: {
    upgradeTitle: "Dostęp do API jest funkcją płatną",
    upgradeBody:
      "Wykup subskrypcję albo kup pakiet kredytów, aby odblokować klucze API i endpoint /v1 zgodny z OpenAI. Dokumentację możesz czytać także na darmowym koncie.",
    upgradeCta: "Odblokuj",
    docsLink: "Czytaj dokumentację API",
    back: "Wstecz",
    loading: "Wczytywanie kluczy API…",
    intro:
      "{{modelCount}} modeli z własnego kodu. Zgodne z OpenAI. Rozliczane z Twoich kredytów, w tej samej cenie co czat.",
    baseUrlTitle: "Adres bazowy",
    baseUrlHint: "Wpisz go w dowolnym SDK OpenAI i użyj klucza poniżej.",
    exampleTitle: "Przykład",
    copy: "Kopiuj",
    copied: "Skopiowano",
    keysTitle: "Twoje klucze",
    empty: "Brak kluczy API",
    emptyHint: "Utwórz klucz i zacznij wywoływać API.",
    nameLabel: "Nazwa klucza",
    namePlaceholder: "np. Backend produkcyjny",
    create: "Utwórz klucz",
    creating: "Tworzenie…",
    createFailed: "Nie udało się utworzyć klucza. Spróbuj ponownie.",
    newKeyTitle: "Skopiuj klucz teraz",
    newKeyHint:
      "Pełny klucz widzisz tylko raz. Przechowujemy sam hash. Zgubisz go, utworzysz nowy.",
    dismiss: "Zapisałem",
    lastUsed: "Ostatnio użyty",
    neverUsed: "Nigdy nie użyty",
    created: "Utworzony",
    revoke: "Unieważnij",
    revoking: "Unieważnianie…",
    revokeFailed: "Nie udało się unieważnić klucza. Spróbuj ponownie.",
    maskedKey: "{{prefix}}…",
    meta: "{{lastUsed}} · Utworzony {{created}} · {{rate}}",
    keyPlaceholder: "sk-unb-TWOJ_KLUCZ",
    rateLimit: "{{n}} zapytań/min",
    billingNote:
      "Brak kredytów zwraca HTTP 402. Streaming działa (stream: true).",
  },

  list: {
    title: "Klucze API",
    titleShort: "Klucze API",
    description:
      "Twórz i unieważniaj klucze do API zgodnego z OpenAI. Pokazuje adres bazowy i Twoje klucze.",
    tag: "API",
    response: {
      baseUrl: "Adres bazowy",
      isPaid: "Plan płatny",
      keys: "Klucze",
    },
    success: {
      title: "Klucze API wczytane",
      description: "Pobrano Twoje klucze API",
    },
  },

  create: {
    title: "Utwórz klucz API",
    titleShort: "Nowy klucz",
    description:
      "Tworzy klucz do API zgodnego z OpenAI. Pełny klucz zwracany jest tylko raz.",
    tag: "API",
    form: {
      name: "Nazwa klucza",
      namePlaceholder: "Do czego służy ten klucz?",
    },
    response: {
      key: "Klucz API (widoczny raz)",
      id: "ID klucza",
      keyPrefix: "Prefiks klucza",
    },
    success: {
      title: "Klucz utworzony",
      description: "Skopiuj go teraz. Nie pokażemy go ponownie.",
    },
    errors: {
      paidRequired:
        "API jest dostępne w planach płatnych. Wykup subskrypcję lub kup kredyty, aby tworzyć klucze API.",
      limit: "Masz już {{max}} aktywnych kluczy. Najpierw unieważnij jeden.",
    },
  },

  revoke: {
    title: "Unieważnij klucz API",
    titleShort: "Unieważnij",
    description:
      "Trwale wyłącza klucz API. Wywołania z jego użyciem przestają działać od razu.",
    tag: "API",
    response: {
      message: "Klucz unieważniony. Wywołania z nim już nie działają.",
    },
    success: {
      title: "Klucz unieważniony",
      description: "Tego klucza API nie można już używać",
    },
    errors: {
      notFound: {
        detail: "Brak aktywnego klucza o tym ID na Twoim koncie.",
      },
    },
  },

  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Nieprawidłowe żądanie",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Wymagane logowanie",
    },
    server: {
      title: "Błąd serwera",
      description: "Wewnętrzny błąd serwera",
      detail: "Żądanie klucza API nie powiodło się: {{error}}",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd",
    },
    network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
    forbidden: { title: "Zabronione", description: "Odmowa dostępu" },
    notFound: {
      title: "Nie znaleziono",
      description: "Nie znaleziono klucza API",
    },
    conflict: {
      title: "Konflikt",
      description: "Żądanie koliduje ze stanem",
    },
  },
};
