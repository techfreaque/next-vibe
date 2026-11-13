import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Konto",

  widget: {
    upgradeTitle: "Dostęp do API jest funkcją płatną",
    upgradeBody:
      "Wykup subskrypcję albo kup pakiet kredytów, aby odblokować klucze API. Jeden klucz do twojego kodu, Codex CLI, Claude Code i każdego narzędzia zgodnego z OpenAI. Dokumentację możesz czytać także na darmowym koncie.",
    upgradeCta: "Odblokuj",
    docsLink: "Czytaj dokumentację API",
    back: "Wstecz",
    loading: "Wczytywanie kluczy API…",
    intro:
      "{{modelCount}} modeli w twoim kodzie i w twoim agencie kodującym. Format OpenAI i Anthropic. Rozliczane z twoich kredytów, w tej samej cenie co czat.",
    baseUrlTitle: "Adres bazowy",
    baseUrlHint: "SDK OpenAI, Codex, OpenCode, Continue, Aider, Cline.",
    anthropicBaseUrlTitle: "Adres bazowy Anthropic",
    anthropicBaseUrlHint:
      "Claude Code i SDK Anthropic. Ten sam adres bez /v1: /v1/messages dopisują same.",
    setupTitle: "Podłącz narzędzie",
    setupKeyFilled:
      "Twój nowy klucz jest już w każdym bloku. Kopiujesz, wklejasz, odpalasz. Gdy zamkniesz klucz, bloki wrócą do symbolu zastępczego.",
    setupKeyMissing:
      "Bloki pokazują {{placeholder}}. Utwórz klucz, a pojawi się tutaj.",
    copy: "Kopiuj",
    copied: "Skopiowano",
    keysTitle: "Twoje klucze",
    empty: "Brak kluczy API",
    emptyHint: "Utwórz klucz i zacznij wywoływać API.",
    nameLabel: "Nazwa klucza",
    namePlaceholder: "np. Claude Code na laptopie",
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
    rateLimit: "{{n}} zapytań/min",
    billingNote:
      "Brak kredytów zwraca HTTP 402. Streaming działa na każdym endpoincie.",
  },

  codingTools: {
    blocks: {
      oneCommand: "Jedno polecenie",
      config: "Na stałe",
      run: "Potem uruchom",
      fields: "Ustawienia",
      check: "Sprawdź klucz",
      request: "Pierwsze żądanie",
    },
    tested: "Testowane na {{name}} {{version}}",
    anyModel:
      "Zamiast {{model}} wpisz dowolne ID z GET /v1/models, na przykład {{examples}}.",
    tools: {
      codex: {
        hint: "Wklej polecenie i Codex działa na unbottled.ai. Na stałe: dopisz blok do ~/.codex/config.toml i uruchamiaj Codex z --profile unbottled.",
      },
      claudeCode: {
        hint: "Wklej polecenie i Claude Code działa na unbottled.ai. Na stałe: wpisz te same wartości do bloku env w ~/.claude/settings.json, obok tego, co już tam jest. Bez linii z modelami Claude Code używa naszych modeli Claude pod nazwami, które już zna.",
      },
      opencode: {
        hint: "Zapisz jako opencode.json w projekcie albo jako ~/.config/opencode/opencode.json dla wszystkich projektów. Do mapy models dodasz dowolne ID modelu.",
      },
      continue: {
        hint: "Uruchamia Continue CLI. Rozszerzenie IDE czyta ~/.continue/config.yaml: dodaj tam ten sam wpis modelu.",
      },
      aider: {
        hint: "Jedno polecenie. Aider chce openai/ przed ID modelu. Pliki do edycji dopisz na końcu, jak zwykle.",
      },
      cline: {
        hint: "Dwa polecenia w Cline CLI: raz zapisujesz dostawcę, potem uruchamiasz cline.",
      },
      openaiCompatible: {
        hint: "Każde narzędzie i SDK z polem na adres bazowy. Narzędzia w stylu OpenAI dostają adres z /v1, narzędzia w stylu Anthropic adres bez /v1. Ten sam klucz, te same modele.",
      },
      curl: {
        hint: "Sprawdza klucz i wypisuje każde ID modelu, które możesz wywołać. Potem pierwsze żądanie.",
      },
    },
  },

  list: {
    title: "Klucze API",
    titleShort: "Klucze API",
    description:
      "Twórz i unieważniaj klucze API. Pokazuje adresy bazowe, gotowe konfiguracje narzędzi do kodowania i twoje klucze.",
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
      "Tworzy klucz API. Działa z klientami OpenAI i Anthropic. Pełny klucz zwracany jest tylko raz.",
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
