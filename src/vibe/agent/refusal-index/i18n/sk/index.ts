import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Index odmietnutí",
  tags: {
    refusalIndex: "Index odmietnutí",
  },

  enums: {
    runStatus: {
      running: "Prebieha",
      completed: "Dokončené",
      failed: "Zlyhalo",
      cancelled: "Zrušené",
    },
    verdict: {
      answered: "Priama odpoveď",
      hedged: "Vyhýbavá odpoveď",
      refused: "Odmietnutie",
      error: "Chyba",
    },
  },

  errors: {
    validation: {
      title: "Chyba overenia",
      description: "Požiadavka je neplatná.",
    },
    network: { title: "Chyba siete", description: "Spojenie zlyhalo" },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Vyžadujú sa oprávnenia správcu.",
    },
    forbidden: {
      title: "Prístup zakázaný",
      description: "Vyžadujú sa oprávnenia správcu.",
    },
    notFound: { title: "Nenašlo sa", description: "Nič sa nenašlo." },
    server: {
      title: "Chyba servera",
      description: "Požiadavku na index odmietnutí sa nepodarilo spracovať.",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Vyskytla sa neočakávaná chyba",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Máte neuložené zmeny",
    },
    conflict: { title: "Konflikt", description: "Nastal konflikt údajov" },
  },
  success: {
    title: "Hotovo",
    description: "Požiadavka na index odmietnutí sa dokončila.",
  },

  messages: {
    judgeUnparseable: "Hodnotiaci model nevrátil použiteľné hodnotenie.",
    dryRunStatus: "Simulácia",
    slugTaken: "Otázka s identifikátorom „{{slug}}“ už existuje.",
    questionNotFound: "Otázka sa nenašla.",
    questionInUse:
      "Otázka má výsledky z predchádzajúcich meraní. Môžete ju deaktivovať.",
    runNotFound: "Meranie sa nenašlo.",
    runAlreadyActive:
      "Meranie {{id}} už prebieha. Pokračujte v ňom alebo počkajte na dokončenie.",
    resultNotFound: "Výsledok sa nenašiel.",
    errorNotPublishable: "Výsledok s chybou sa nedá zverejniť ako ukážka.",
    unknownQuestions: "Neznáme identifikátory otázok: {{slugs}}.",
    unknownModels:
      "Neznáme modely alebo modely nezaradené do merania: {{ids}}.",
    noQuestions:
      "Nie sú aktívne žiadne otázky. Správca musí najprv pridať otázky cez refusal-index-questions.",
    noModels:
      "Filtru nezodpovedá žiadny model, ktorý možno zaradiť do merania.",
    dryRun:
      "Simulácia je hotová. Modelom sa nič neposlalo. Rozpočet skutočného merania v kreditoch: {{budget}}.",
    dryRunResume:
      "Simulácia ukazuje, čo zostáva spracovať pri pokračovaní v meraní.",
    started: "Meranie sa spustilo a pokračuje na pozadí.",
    resumed: "Meranie sa obnovilo a pokračuje na pozadí.",
    finishedWaiting: "Meranie sa skončilo. Konečný stav je uvedený vyššie.",
    generationFailed: "Generátor otázok nevrátil nič použiteľné ({{error}}).",
    nothingPending: "Všetky dvojice už majú odpoveď.",
  },

  fields: {
    limit: {
      label: "Limit",
      description: "Najvyšší počet riadkov vo výsledku",
    },
    offset: {
      label: "Posun",
      description: "Počet riadkov, ktoré sa majú preskočiť",
    },
    back: { label: "Späť" },
  },

  questions: {
    fields: {
      id: { label: "ID otázky", description: "ID otázky" },
      slug: {
        label: "Textový identifikátor",
        description:
          "Krátky jedinečný identifikátor. Použite malé písmená a slová oddeľte spojovníkmi.",
      },
      category: {
        label: "Kategória",
        description:
          "Vlastný názov skupiny, napríklad „medicine“. Kategórie sa určujú podľa zadaných hodnôt.",
      },
      textEn: {
        label: "Otázka po anglicky",
        description: "Presné znenie zadania, ktoré dostane každý model",
      },
      textDe: {
        label: "Otázka po nemecky",
        description: "Nepovinný preklad otázky pre verejné ukážky",
      },
      textPl: {
        label: "Otázka po poľsky",
        description: "Nepovinný preklad otázky pre verejné ukážky",
      },
      textFr: {
        label: "Otázka po francúzsky",
        description: "Nepovinný preklad otázky pre verejné ukážky",
      },
      textIt: {
        label: "Otázka po taliansky",
        description: "Nepovinný preklad otázky pre verejné ukážky",
      },
      textEs: {
        label: "Otázka po španielsky",
        description: "Nepovinný preklad otázky pre verejné ukážky",
      },
      textSk: {
        label: "Otázka po slovensky",
        description: "Nepovinný preklad otázky pre verejné ukážky",
      },
      generatedBy: { label: "Autor návrhu" },
      active: {
        label: "Aktívna",
        description: "Do nových meraní sa zaraďujú iba aktívne otázky.",
      },
    },
    widget: {
      add: "Pridať otázku",
      loading: "Načítavajú sa otázky…",
      active: "Aktívna",
      inactive: "Neaktívna",
      generated: "Vygenerovaná",
      empty: {
        title: "Zatiaľ žiadne otázky.",
        hint: "Index meria, ako modely odpovedajú na otázky, ktoré vyberiete. Pred prvým meraním pridajte otázky.",
        cta: "Pridať prvú otázku",
      },
    },
    get: {
      title: "Otázky indexu odmietnutí",
      titleShort: "Otázky",
      description:
        "Všetky modely dostanú rovnaké otázky vybrané správcami. Pred prvým meraním sem pridajte otázky.",
      fields: {
        status: {
          label: "Stav",
          description: "Filtrovať podľa aktivity",
          all: "Všetky",
          active: "Aktívna",
          inactive: "Neaktívna",
        },
        category: {
          label: "Kategória",
          description: "Iba otázky v tejto kategórii",
        },
      },
    },
    post: {
      title: "Pridať otázku do indexu odmietnutí",
      titleShort: "Pridať otázku",
      description: "Pridať otázku do súboru otázok na porovnanie modelov",
      submit: "Pridať otázku",
      submitting: "Pridáva sa…",
      response: { id: "ID otázky" },
    },
    patch: {
      title: "Upraviť otázku indexu odmietnutí",
      titleShort: "Upraviť otázku",
      description: "Upraviť otázku, aktivovať ju alebo deaktivovať",
      submit: "Uložiť",
      submitting: "Ukladá sa…",
      clearHint: "Ak chcete preklad odstrániť, nechajte pole prázdne.",
    },
    delete: {
      title: "Odstrániť otázku z indexu odmietnutí",
      titleShort: "Odstrániť otázku",
      description:
        "Odstrániť možno iba otázku, ktorá ešte nebola súčasťou merania. Použitú otázku môžete deaktivovať.",
      submit: "Odstrániť otázku",
      submitting: "Odstraňuje sa…",
      response: { deleted: "Odstránené" },
    },
  },

  runs: {
    fields: {
      id: { label: "ID merania", description: "Identifikátor merania" },
      status: { label: "Stav" },
      startedAt: { label: "Začiatok" },
      finishedAt: { label: "Koniec" },
      modelCount: { label: "Modely" },
      questionCount: { label: "Otázky" },
      pairCount: { label: "Dvojice modelov a otázok čakajúce na odpoveď" },
      questionsRequested: { label: "Počet vyžiadaných nových otázok" },
      questionsGenerated: { label: "Počet pridaných otázok" },
      resultCount: { label: "Výsledky" },
      totalCost: { label: "Spotrebované kredity" },
      budgetCredits: { label: "Limit rozpočtu" },
      judgeModelId: { label: "Hodnotiaci model" },
      judgePromptVersion: { label: "Zadanie pre hodnotiaci model" },
      cancelReason: { label: "Dôvod zastavenia" },
      notes: { label: "Poznámky" },
    },
    widget: {
      start: "Spustiť meranie",
      manageQuestions: "Správa otázok",
      resume: "Pokračovať",
      newQuestions: "Nové otázky: {{generated}} z {{requested}}",
      open: "Výsledky",
      results: "výsledky",
      credits: "kredity",
      noQuestions: {
        title: "Najprv pridajte otázky",
        hint: "Meranie potrebuje aspoň jednu aktívnu otázku. Pridajte ju v zozname otázok.",
      },
      empty: {
        title: "Zatiaľ neprebehlo žiadne meranie",
        hint: "Spustite meranie alebo zapnite týždennú naplánovanú úlohu. Tá je predvolene vypnutá.",
      },
    },
    get: {
      title: "Merania indexu odmietnutí",
      titleShort: "Merania",
      description: "Merania zoradené od najnovších",
      response: {
        activeQuestionCount: "Aktívne otázky",
        benchmarkModelCount: "Porovnávané modely",
      },
    },
  },

  start: {
    title: "Spustiť meranie indexu odmietnutí",
    titleShort: "Spustiť meranie",
    description:
      "Generátor bez obsahových filtrov pridá nové otázky. Každý model potom dostane otázky, na ktoré ešte neodpovedal, a jeho odpovede posúdi hodnotiaci model. Odpovede sa ukladajú, takže sa otázky neopakujú. Meranie má stanovený rozpočet a môžete v ňom pokračovať neskôr.",
    submit: "Spustiť",
    submitting: "Spúšťa sa…",
    cron: {
      name: "Index odmietnutí (týždenne)",
      description:
        "Každý týždeň pridá 10 otázok a doplní chýbajúce odpovede aj za nové modely. Úloha je predvolene vypnutá.",
    },
    fields: {
      models: {
        label: "Modely",
        description:
          "ID modelov oddeľte čiarkami. Prázdne pole zahrnie všetky aktuálne modely.",
      },
      questions: {
        label: "Otázky",
        description:
          "Identifikátory otázok oddeľte čiarkami. Prázdne pole zahrnie všetky aktívne otázky.",
      },
      newQuestions: {
        label: "Nové otázky",
        description:
          "Koľko otázok má generátor bez obsahových filtrov pridať pred doplnením odpovedí (0 až 30)",
      },
      budgetCredits: {
        label: "Limit rozpočtu v kreditoch",
        description:
          "Po dosiahnutí limitu sa meranie ukončí so stavom cancelled.",
      },
      concurrency: {
        label: "Súbežné požiadavky",
        description:
          "Počet súbežných volaní modelov (predvolene 4, najviac 16)",
      },
      dryRun: {
        label: "Simulácia",
        description:
          "Iba zostaviť plán a odhad nákladov. Modelom sa nič neodošle.",
      },
      resumeRunId: {
        label: "Pokračovať v meraní",
        description:
          "Spracovať zostávajúce dvojice modelov a otázok z predchádzajúceho merania",
      },
      wait: {
        label: "Čakať na výsledok",
        description: "Požiadavku ukončiť až po skončení merania",
      },
      notes: {
        label: "Poznámky",
        description: "Ľubovoľná poznámka k tomuto meraniu",
      },
    },
    response: {
      runId: "ID merania",
      status: "Stav",
      dryRun: "Simulácia",
      modelCount: "Modely",
      questionCount: "Otázky",
      newQuestionCount: "Nové otázky",
      pendingPairs: "Dvojice na spracovanie",
      estimatedCredits: "Odhad spotreby kreditov",
      note: "Poznámka",
    },
  },

  runDetail: {
    title: "Meranie indexu odmietnutí",
    titleShort: "Meranie",
    description:
      "Výsledky jedného merania môžete filtrovať podľa modelu, kategórie alebo hodnotenia. Tu môžete schváliť aj verejné ukážky.",
    fields: {
      model: { label: "Model", description: "Filtrovať podľa ID modelu" },
      category: {
        label: "Kategória",
        description: "Filtrovať podľa kategórie",
      },
      verdict: {
        label: "Hodnotenie",
        description: "Filtrovať podľa hodnotenia",
        all: "Všetky",
      },
      modelId: { label: "ID modelu" },
      modelName: { label: "Model" },
      tier: { label: "Úroveň" },
      questionSlug: { label: "Otázka" },
      categoryCol: { label: "Kategória" },
      questionText: { label: "Zadanie" },
      verdictCol: { label: "Hodnotenie" },
      judgeReason: { label: "Zdôvodnenie hodnotenia" },
      answerExcerpt: { label: "Odpoveď" },
      latencyMs: { label: "Čas odozvy (ms)" },
      cost: { label: "Kredity" },
      sampleVisible: { label: "Verejná ukážka" },
    },
    widget: {
      loading: "Načítava sa meranie…",
      empty: "Žiadne výsledky nezodpovedajú týmto filtrom.",
      credits: "kredity",
      approve: "Zverejniť ukážku",
      hide: "Skryť ukážku",
    },
  },

  samples: {
    title: "Schváliť ukážku pre index odmietnutí",
    titleShort: "Ukážka",
    description:
      "Zverejnite vybranú odpoveď ako ukážku alebo ju skryte. Verejne sa zobrazia len schválené odpovede.",
    submit: "Použiť",
    submitting: "Používa sa…",
    fields: {
      resultId: {
        label: "ID výsledku",
        description: "Výsledok, ktorý chcete zverejniť",
      },
      visible: {
        label: "Viditeľné",
        description:
          "Pri zapnutej voľbe sa ukážka zobrazí na stránke modelu. Pri vypnutej zostane skrytá.",
      },
    },
    response: { visible: "Viditeľné" },
  },

  leaderboard: {
    title: "Rebríček indexu odmietnutí",
    titleShort: "Index odmietnutí",
    description:
      "Ako často jednotlivé modely odpovedia priamo, vyhnú sa odpovedi alebo ju odmietnu? Každý týždeň pribúdajú nové otázky aj výsledky.",
    response: { overall: "Celkovo" },
  },

  model: {
    title: "Štatistika odmietnutí modelu",
    titleShort: "Štatistika modelu",
    description:
      "Podiel priamych odpovedí, vyhýbavých odpovedí a odmietnutí pri všetkých aktuálnych otázkach pre jeden model. Súčasťou sú aj schválené ukážky odpovedí.",
    fields: {
      modelId: {
        label: "Model",
        description: "ID modelu alebo jeho identifikátor v adrese URL",
      },
    },
  },

  public: {
    fields: {
      judged: { label: "Vyhodnotené odpovede" },
      answeredPct: { label: "Priame odpovede (%)" },
      hedgedPct: { label: "Vyhýbavé odpovede (%)" },
      refusedPct: { label: "Odmietnutia (%)" },
      category: { label: "Kategória" },
      hasData: { label: "Má údaje" },
      runFinishedAt: { label: "Posledná aktualizácia" },
      modelCount: { label: "Modely" },
      questionCount: { label: "Otázky" },
      judgeModelId: { label: "ID hodnotiaceho modelu" },
      judgeModelName: { label: "Hodnotiaci model" },
      judgePromptVersion: { label: "Verzia zadania pre hodnotiaci model" },
      modelId: { label: "ID modelu" },
      name: { label: "Názov" },
      tier: { label: "Úroveň" },
      trend: { label: "Vývoj miery odmietnutí (body)" },
      rank: { label: "Poradie (1 = najnižší podiel odmietnutí)" },
      rankedModels: { label: "Modely v rebríčku" },
      question: { label: "Otázka" },
      verdict: { label: "Hodnotenie" },
      answer: { label: "Odpoveď" },
      judgeReason: { label: "Zdôvodnenie hodnotenia" },
    },
  },
};
