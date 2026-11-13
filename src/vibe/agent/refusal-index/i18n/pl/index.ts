import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Indeks odmów",
  tags: {
    refusalIndex: "Indeks odmów",
  },

  enums: {
    runStatus: {
      running: "W toku",
      completed: "Zakończony",
      failed: "Nieudany",
      cancelled: "Anulowany",
    },
    verdict: {
      answered: "Odpowiedział",
      hedged: "Złagodził",
      refused: "Odmówił",
      error: "Błąd",
    },
  },

  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Żądanie jest nieprawidłowe",
    },
    network: {
      title: "Błąd sieci",
      description: "Połączenie nie powiodło się",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Wymagany dostęp administratora",
    },
    forbidden: {
      title: "Zabronione",
      description: "Wymagany dostęp administratora",
    },
    notFound: { title: "Nie znaleziono", description: "Nic nie znaleziono" },
    server: {
      title: "Błąd serwera",
      description: "Żądanie do Indeksu odmów nie powiodło się",
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
      description: "Wystąpił konflikt danych",
    },
  },
  success: {
    title: "Gotowe",
    description: "Żądanie do Indeksu odmów zakończone",
  },

  messages: {
    judgeUnparseable: "Model-sędzia nie zwrócił użytecznego werdyktu.",
    dryRunStatus: "Próba na sucho",
    slugTaken: "Pytanie ze slugiem '{{slug}}' już istnieje.",
    questionNotFound: "Nie znaleziono pytania.",
    questionInUse:
      "To pytanie ma wyniki w poprzednich przebiegach. Dezaktywuj je zamiast usuwać.",
    runNotFound: "Nie znaleziono przebiegu.",
    runAlreadyActive:
      "Przebieg {{id}} już trwa. Wznów go albo poczekaj na koniec.",
    resultNotFound: "Nie znaleziono wyniku.",
    errorNotPublishable: "Wyników z błędem nie można publikować jako próbek.",
    unknownQuestions: "Nieznane slugi pytań: {{slugs}}.",
    unknownModels: "Nieznane lub niemierzone modele: {{ids}}.",
    noQuestions:
      "Brak aktywnych pytań. Najpierw dodaj pytania (refusal-index-questions) - zestaw pytań prowadzą administratorzy.",
    noModels: "Żaden mierzalny model nie pasuje do filtra.",
    dryRun:
      "Próba na sucho: nic nie wysłano. Limit budżetu dla prawdziwego przebiegu: {{budget}} kredytów.",
    dryRunResume: "Próba na sucho: pokazuje, co wznowienie jeszcze przetworzy.",
    started: "Przebieg ruszył. Działa dalej w tle.",
    resumed: "Przebieg wznowiony. Działa dalej w tle.",
    finishedWaiting: "Przebieg zakończony. Status końcowy powyżej.",
  },

  fields: {
    limit: { label: "Limit", description: "Maksymalna liczba wierszy" },
    offset: { label: "Przesunięcie", description: "Wiersze do pominięcia" },
    back: { label: "Wstecz" },
  },

  questions: {
    fields: {
      id: { label: "ID pytania", description: "ID pytania" },
      slug: {
        label: "Slug",
        description: "Krótki unikalny identyfikator, małe-litery-z-myślnikami",
      },
      category: {
        label: "Kategoria",
        description: "Dowolna grupa, np. 'medycyna' - kategorie to dane",
      },
      textEn: {
        label: "Pytanie (angielski)",
        description: "Dokładny prompt wysyłany do każdego modelu",
      },
      textDe: {
        label: "Pytanie (niemiecki)",
        description:
          "Tłumaczenie do wyświetlania w publicznych próbkach (opcjonalne)",
      },
      textPl: {
        label: "Pytanie (polski)",
        description:
          "Tłumaczenie do wyświetlania w publicznych próbkach (opcjonalne)",
      },
      active: {
        label: "Aktywne",
        description: "Tylko aktywne pytania trafiają do nowych przebiegów",
      },
    },
    widget: {
      add: "Dodaj pytanie",
      loading: "Ładowanie pytań...",
      active: "Aktywne",
      inactive: "Nieaktywne",
      empty: {
        title: "Brak pytań",
        hint: "Indeks mierzy, jak modele odpowiadają na TWÓJ zestaw pytań. Dodaj pytania przed pierwszym przebiegiem.",
        cta: "Dodaj pierwsze pytanie",
      },
    },
    get: {
      title: "Pytania Indeksu odmów",
      titleShort: "Pytania",
      description:
        "Zestaw pytań prowadzony przez administratorów i wysyłany do każdego modelu. Dodaj tu pytania przed pierwszym przebiegiem.",
      fields: {
        status: {
          label: "Status",
          description: "Filtruj po aktywności",
          all: "Wszystkie",
          active: "Aktywne",
          inactive: "Nieaktywne",
        },
        category: {
          label: "Kategoria",
          description: "Tylko pytania z tej kategorii",
        },
      },
    },
    post: {
      title: "Dodaj pytanie do Indeksu odmów",
      titleShort: "Dodaj pytanie",
      description: "Dodaj pytanie do zestawu pomiarowego",
      submit: "Dodaj pytanie",
      submitting: "Dodawanie...",
      response: { id: "ID pytania" },
    },
    patch: {
      title: "Edytuj pytanie Indeksu odmów",
      titleShort: "Edytuj pytanie",
      description: "Edytuj lub (de)aktywuj pytanie",
      submit: "Zapisz",
      submitting: "Zapisywanie...",
      clearHint: "Zostaw puste, aby usunąć tłumaczenie",
    },
    delete: {
      title: "Usuń pytanie Indeksu odmów",
      titleShort: "Usuń pytanie",
      description:
        "Usuń pytanie nigdy nieużyte w przebiegu (użyte: dezaktywuj)",
      submit: "Usuń pytanie",
      submitting: "Usuwanie...",
      response: { deleted: "Usunięto" },
    },
  },

  runs: {
    fields: {
      id: { label: "ID przebiegu", description: "ID przebiegu" },
      status: { label: "Status" },
      startedAt: { label: "Start" },
      finishedAt: { label: "Koniec" },
      modelCount: { label: "Modele" },
      questionCount: { label: "Pytania" },
      resultCount: { label: "Wyniki" },
      totalCost: { label: "Zużyte kredyty" },
      budgetCredits: { label: "Limit budżetu" },
      judgeModelId: { label: "Model-sędzia" },
      judgePromptVersion: { label: "Prompt sędziego" },
      cancelReason: { label: "Powód zatrzymania" },
      notes: { label: "Notatki" },
    },
    widget: {
      start: "Uruchom przebieg",
      manageQuestions: "Zarządzaj pytaniami",
      resume: "Wznów",
      open: "Wyniki",
      results: "wyników",
      credits: "kredytów",
      noQuestions: {
        title: "Najpierw dodaj pytania",
        hint: "Przebieg potrzebuje co najmniej jednego aktywnego pytania. Dodaj je na liście pytań.",
      },
      empty: {
        title: "Brak przebiegów",
        hint: "Uruchom przebieg albo włącz cotygodniowe zadanie cron (domyślnie wyłączone).",
      },
    },
    get: {
      title: "Przebiegi Indeksu odmów",
      titleShort: "Przebiegi",
      description: "Przebiegi pomiarowe, najnowsze pierwsze",
      response: {
        activeQuestionCount: "Aktywne pytania",
        benchmarkModelCount: "Mierzone modele",
      },
    },
  },

  start: {
    title: "Uruchom przebieg Indeksu odmów",
    titleShort: "Uruchom przebieg",
    description:
      "Wyślij aktywny zestaw pytań do mierzonych modeli, oceń każdą odpowiedź, opublikuj wyniki. Z limitem budżetu i możliwością wznowienia.",
    submit: "Uruchom",
    submitting: "Uruchamianie...",
    cron: {
      name: "Indeks odmów (co tydzień)",
      description:
        "Cotygodniowy przebieg pomiarowy. Domyślnie wyłączony - włącz po dodaniu pytań.",
    },
    fields: {
      models: {
        label: "Modele",
        description:
          "ID modeli oddzielone przecinkami (puste = wszystkie aktualne)",
      },
      questions: {
        label: "Pytania",
        description:
          "Slugi pytań oddzielone przecinkami (puste = wszystkie aktywne)",
      },
      budgetCredits: {
        label: "Limit budżetu (kredyty)",
        description:
          "Przebieg zatrzyma się czysto (status anulowany) po osiągnięciu limitu",
      },
      concurrency: {
        label: "Współbieżność",
        description: "Równoległe wywołania modeli (domyślnie 4, maks. 16)",
      },
      dryRun: {
        label: "Próba na sucho",
        description: "Tylko plan i szacunek, nic nie wysyłaj",
      },
      resumeRunId: {
        label: "Wznów przebieg",
        description: "Dokończ brakujące pary wcześniejszego przebiegu",
      },
      wait: {
        label: "Czekaj",
        description: "Trzymaj żądanie, aż przebieg się skończy",
      },
      notes: {
        label: "Notatki",
        description: "Dowolna notatka do tego przebiegu",
      },
    },
    response: {
      runId: "ID przebiegu",
      status: "Status",
      dryRun: "Próba na sucho",
      modelCount: "Modele",
      questionCount: "Pytania",
      pendingPairs: "Pary do przetworzenia",
      estimatedCredits: "Szacowane kredyty",
      note: "Uwaga",
    },
  },

  runDetail: {
    title: "Przebieg Indeksu odmów",
    titleShort: "Przebieg",
    description:
      "Jeden przebieg z wynikami. Filtruj po modelu, kategorii lub werdykcie; zatwierdzaj publiczne próbki.",
    fields: {
      model: { label: "Model", description: "Filtruj po ID modelu" },
      category: { label: "Kategoria", description: "Filtruj po kategorii" },
      verdict: {
        label: "Werdykt",
        description: "Filtruj po werdykcie",
        all: "Wszystkie",
      },
      modelId: { label: "ID modelu" },
      modelName: { label: "Model" },
      tier: { label: "Poziom" },
      questionSlug: { label: "Pytanie" },
      categoryCol: { label: "Kategoria" },
      questionText: { label: "Prompt" },
      verdictCol: { label: "Werdykt" },
      judgeReason: { label: "Uzasadnienie sędziego" },
      answerExcerpt: { label: "Odpowiedź" },
      latencyMs: { label: "Opóźnienie (ms)" },
      cost: { label: "Kredyty" },
      sampleVisible: { label: "Publiczna próbka" },
    },
    widget: {
      loading: "Ładowanie przebiegu...",
      empty: "Brak wyników dla tych filtrów.",
      credits: "kredytów",
      approve: "Opublikuj próbkę",
      hide: "Ukryj próbkę",
    },
  },

  samples: {
    title: "Zatwierdź próbkę Indeksu odmów",
    titleShort: "Próbka",
    description:
      "Opublikuj (lub ukryj) wynik jako publiczną próbkę odpowiedzi. Bez zatwierdzenia nic nie jest publiczne.",
    submit: "Zastosuj",
    submitting: "Stosowanie...",
    fields: {
      resultId: {
        label: "ID wyniku",
        description: "Wynik do opublikowania",
      },
      visible: {
        label: "Widoczna",
        description:
          "Włączone = publicznie na stronie modelu, wyłączone = ukryta",
      },
    },
    response: { visible: "Widoczna" },
  },

  leaderboard: {
    title: "Ranking Indeksu odmów",
    titleShort: "Indeks odmów",
    description:
      "Jak często każdy model AI odpowiada, łagodzi albo odmawia - z najnowszego tygodniowego przebiegu.",
    response: { overall: "Ogółem" },
  },

  model: {
    title: "Wskaźniki odmów modelu",
    titleShort: "Wskaźniki modelu",
    description:
      "Odsetek odpowiedzi, złagodzeń i odmów jednego modelu z najnowszego przebiegu, plus zatwierdzone próbki odpowiedzi.",
    fields: {
      modelId: {
        label: "Model",
        description: "ID modelu lub slug z URL",
      },
    },
  },

  public: {
    fields: {
      judged: { label: "Ocenione odpowiedzi" },
      answeredPct: { label: "Odpowiedział %" },
      hedgedPct: { label: "Złagodził %" },
      refusedPct: { label: "Odmówił %" },
      category: { label: "Kategoria" },
      hasData: { label: "Ma dane" },
      runFinishedAt: { label: "Przebieg zakończony" },
      modelCount: { label: "Modele" },
      questionCount: { label: "Pytania" },
      judgeModelId: { label: "ID modelu-sędziego" },
      judgeModelName: { label: "Model-sędzia" },
      judgePromptVersion: { label: "Wersja promptu sędziego" },
      modelId: { label: "ID modelu" },
      name: { label: "Nazwa" },
      tier: { label: "Poziom" },
      trend: { label: "Trend odmów (punkty)" },
      rank: { label: "Miejsce (1 = najmniej odmów)" },
      rankedModels: { label: "Modele w rankingu" },
      question: { label: "Pytanie" },
      verdict: { label: "Werdykt" },
      answer: { label: "Odpowiedź" },
      judgeReason: { label: "Uzasadnienie sędziego" },
    },
  },
};
