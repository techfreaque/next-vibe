import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Správa úloh",

  errors: {
    cronTaskNotFound: "Naplánovaná úloha sa nenašla.",
    repositoryInternalError: "Nastala interná chyba.",
    fetchCronTaskHistoryDetail:
      "Nepodarilo sa načítať históriu úlohy {{taskId}} (limit {{limit}}): {{error}}",
    fetchCronTaskHistoryAllDetail:
      "Nepodarilo sa načítať históriu úloh (limit {{limit}}): {{error}}",
  },

  enums: {
    taskScope: {
      enabled: "Iba zapnuté úlohy",
      all: "Všetky úlohy vrátane skrytých a vypnutých",
    },
  },

  get: {
    tags: {
      tasks: "Úlohy",
      monitoring: "Monitorovanie",
    },
    title: "História spustení úloh",
    titleShort: "História úlohy",
    description: "Zobraziť históriu spustení naplánovaných úloh",
    fields: {
      taskScope: {
        label: "Rozsah úloh",
        description: "Použiť rovnaký rozsah ako v prehľade stavu úloh.",
      },
      taskId: {
        label: "ID úlohy",
        description: "Filtrovať podľa ID konkrétnej úlohy",
        placeholder: "Zadajte ID úlohy",
      },
      taskName: {
        label: "Názov úlohy",
        description: "Filtrovať podľa časti názvu úlohy",
        placeholder: "Zadajte názov úlohy",
      },
      status: {
        label: "Stav spustenia",
        description: "Zobrazí spustenia podľa stavu.",
        placeholder: "Vybrať stavy",
        options: {
          PENDING: "Čaká",
          SCHEDULED: "Plánované",
          RUNNING: "Prebieha",
          COMPLETED: "Dokončené",
          FAILED: "Zlyhalo",
          ERROR: "Chyba",
          TIMEOUT: "Časový limit",
          SKIPPED: "Preskočené",
          CANCELLED: "Zrušené",
          STOPPED: "Zastavené",
          BLOCKED: "Blokované",
        },
      },
      priority: {
        label: "Priorita",
        description: "Filtrovať podľa priority úlohy",
        placeholder: "Vybrať priority",
        options: {
          LOW: "Nízka",
          MEDIUM: "Stredná",
          HIGH: "Vysoká",
          CRITICAL: "Kritická",
        },
      },
      startDate: {
        label: "Dátum začiatku",
        description: "Zobrazí spustenia po tomto dátume.",
      },
      endDate: {
        label: "Dátum ukončenia",
        description: "Zobrazí spustenia pred týmto dátumom.",
      },
      limit: {
        label: "Limit výsledkov",
        description: "Najvyšší počet výsledkov",
        placeholder: "50",
      },
      offset: {
        label: "Posun výsledkov",
        description: "Počet výsledkov, ktoré sa majú pri stránkovaní preskočiť",
        placeholder: "0",
      },
    },
    response: {
      title: "Výsledky vyhľadávania v histórii úloh",
      description: "Údaje o predchádzajúcich spusteniach naplánovaných úloh",
      executions: {
        title: "Záznamy spustení",
      },
      totalCount: {
        title: "Celkový počet",
      },
      hasMore: {
        title: "K dispozícii sú ďalšie výsledky",
      },
      statusCounts: {
        title: "Počty podľa stavu",
      },
      summary: {
        title: "Súhrn spustení",
      },
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Parametre požiadavky sú neplatné.",
      },
      internal: {
        title: "Interná chyba servera",
        description: "Zlyhalo načítanie histórie úlohy",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte povolenie na zobrazenie histórie úloh",
      },
      notFound: {
        title: "Nenájdené",
        description: "Úloha alebo záznam o jej spustení sa nenašiel.",
      },
      network: {
        title: "Chyba siete",
        description: "Nastala chyba siete pri sťahovaní histórie úloh",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Prístup k histórii úloh je zakázaný",
      },
      server: {
        title: "Chyba servera",
        description: "Nastala interná chyba servera.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba",
      },
      unsavedChanges: {
        titleChanges: "Neuložené zmeny",
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt údajov",
      },
    },
    success: {
      title: "História sa načítala",
      description: "História spustení úloh sa načítala.",
    },
    log: {
      fetchSuccess: "Počet načítaných záznamov o spustení: {{count}}",
      fetchError: "Históriu spustení úlohy sa nepodarilo načítať.",
    },
    request: {
      title: "Parametre požiadavky",
      description: "Vyfiltruje históriu spustení úloh.",
    },
    unknownTask: "Neznáma úloha",
  },
  widget: {
    runDetails: "Podrobnosti spustenia",
    runId: "ID spustenia",
    emptyFiltered:
      "Žiadne spustenie nezodpovedá výberu. Upravte úlohu, stav, prioritu alebo rozsah dátumov.",
    emptyUnfiltered: "Spustenia úloh sa tu zobrazia po ich začatí.",
    title: "História spustení úloh",
    loading: "Načítava sa história…",
    header: {
      tasks: "Úlohy",
      stats: "Štatistiky",
      pulse: "Pulz",
      refresh: "Obnoviť",
    },
    summary: {
      total: "Spustenia zodpovedajúce výberu",
      successful: "Úspešné",
      failed: "Zlyhalo",
      successRate: "Miera úspešnosti",
      avgDuration: "Priemerné trvanie",
    },
    search: {
      placeholder: "Hľadať úlohy…",
    },
    filter: {
      clearTaskScope: "Zrušiť obmedzenie na vybrané úlohy",
      clear: "Zrušiť filtre",
      allTasks: "Všetky úlohy",
      allPriorities: "Všetky priority",
      taskHistory: "História tejto úlohy",
      all: "Všetky",
      running: "Prebieha",
      completed: "Dokončené",
      failed: "Zlyhalo",
      timeout: "Časový limit",
      cancelled: "Zrušené",
    },
    col: {
      taskName: "Názov úlohy",
      status: "Stav",
      duration: "Trvanie",
      started: "Čas spustenia",
      completed: "Dokončené",
      environment: "Prostredie",
      error: "Chyba",
    },
    empty: "Nenašla sa žiadna história spustení",
    result: "Výsledok",
    error: {
      collapse: "Zbaliť podrobnosti chyby",
      label: "Chyba",
    },
    pagination: {
      info: "Strana {{page}} z {{totalPages}} (celkovo {{total}})",
      prev: "Predchádzajúce",
      next: "Ďalej",
    },
  },
};
