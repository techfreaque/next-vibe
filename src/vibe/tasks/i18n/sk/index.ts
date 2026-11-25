import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Správa úloh",
  tags: {
    tasks: "Úlohy",
  },
  type: {
    cron: "Naplánovaná úloha",
    side: "Vedľajšia úloha",
    task_runner: "Spúšťač úloh",
  },
  priority: {
    critical: "Kritická",
    high: "Vysoká",
    medium: "Stredná",
    low: "Nízka",
    background: "Na pozadí",
    filter: {
      all: "Všetky priority",
      highAndAbove: "Vysoká priorita a vyššia",
      mediumAndAbove: "Stredná priorita a vyššia",
    },
  },
  status: {
    pending: "Čaká",
    running: "Prebieha",
    completed: "Dokončené",
    failed: "Zlyhalo",
    timeout: "Časový limit",
    cancelled: "Zrušené",
    skipped: "Preskočené",
    blocked: "Blokované",
    scheduled: "Plánované",
    stopped: "Zastavené",
    error: "Chyba",
    filter: {
      all: "Všetky stavy",
      active: "Aktívny",
      error: "Chybové stavy",
    },
  },
  taskCategory: {
    development: "Vývoj",
    build: "Zostavenie",
    watch: "Sledovanie zmien",
    generator: "Generátor",
    test: "Test",
    maintenance: "Údržba",
    database: "Databáza",
    system: "Systém",
    monitoring: "Monitorovanie",
    leadManagement: "Správa potenciálnych zákazníkov",
  },
  enabledFilter: {
    all: "Všetky",
    enabled: "Zapnuté",
    disabled: "Vypnuté",
  },
  hiddenFilter: {
    visible: "Viditeľné",
    hidden: "Skryté",
    all: "Všetky",
  },
  sort: {
    asc: "Vzostupne",
    desc: "Zostupne",
  },
  pulse: {
    health: {
      healthy: "V poriadku",
      warning: "Upozornenie",
      critical: "Kritická",
      unknown: "Neznáme",
    },
    execution: {
      success: "Úspech",
      failure: "Zlyhanie",
      timeout: "Časový limit",
      cancelled: "Zrušené",
      pending: "Čaká",
    },
  },
  cron: {
    frequency: {
      everyMinute: "každú minútu",
      everyHour: "každú hodinu",
      everyDays: "každý deň",
      hourly: "každú hodinu",
    },
    days: {
      sunday: "Nedeľa",
      monday: "Pondelok",
      tuesday: "Utorok",
      wednesday: "Streda",
      thursday: "Štvrtok",
      friday: "Piatok",
      saturday: "Sobota",
    },
    common: {
      dailyAtMidnight: "denne o polnoci",
      dailyAtNoon: "denne na poludnie",
      weeklyOnSunday: "každú nedeľu",
      monthlyOnFirst: "v prvý deň každého mesiaca",
      everyFiveMinutes: "každých 5 minút",
      everyThreeMinutes: "každé 3 minúty",
      everyOneMinutes: "každú minútu",
      everyTenMinutes: "každých 10 minút",
      everyFifteenMinutes: "každých 15 minút",
      everyThirtyMinutes: "každých 30 minút",
    },
    patterns: {
      everyIntervalMinutes: "v intervaloch po {{interval}} min",
      everyIntervalMinutesStarting:
        "v intervaloch po {{interval}} min od minúty {{start}}",
      atMinutes: "v minútach {{minutes}}",
      fromMinuteToMinute: "od {{from}}. do {{to}}. minúty",
      atMinute: "v {{minute}}. minúte",
      everyIntervalHours: "v intervaloch po {{interval}} h",
      everyIntervalHoursStarting:
        "v intervaloch po {{interval}} h od {{start}}",
      atHours: "v časoch {{hours}}",
      fromHourToHour: "od {{from}} do {{to}}",
      atHour: "o {{hour}}",
    },
    calendar: {
      onDays: "v týchto dňoch mesiaca: {{days}}",
      onDay: "v {{day}}. deň mesiaca",
      inMonths: "v mesiacoch: {{months}}",
      inMonth: "v mesiaci {{month}}",
      onWeekdays: "v dňoch: {{days}}",
      fromWeekdayToWeekday: "v dňoch {{start}} až {{end}}",
      onWeekday: "v deň: {{day}}",
    },
    timezone: "v časovom pásme {{timezone}}",
    time: {
      midnight: "polnoc",
      noon: "poludnie",
      hourAm: "{{hour}}.00 dopoludnia",
      hourPm: "{{hour}}.00 popoludní",
      hourMinuteAm: "{{hour}}.{{minute}} dopoludnia",
      hourMinutePm: "{{hour}}.{{minute}} popoludní",
    },
    weekdays: {
      sunday: "Nedeľa",
      monday: "Pondelok",
      tuesday: "Utorok",
      wednesday: "Streda",
      thursday: "Štvrtok",
      friday: "Piatok",
      saturday: "Sobota",
    },
    months: {
      january: "január",
      february: "február",
      march: "marec",
      april: "apríl",
      may: "máj",
      june: "jún",
      july: "júl",
      august: "august",
      september: "september",
      october: "október",
      november: "november",
      december: "december",
    },
  },
  errors: {
    // Cron Tasks errors
    fetchCronTasks: "Naplánované úlohy sa nepodarilo načítať: {{error}}",
    createCronTask: "Naplánovanú úlohu sa nepodarilo vytvoriť.",
    updateCronTask: "Naplánovanú úlohu sa nepodarilo aktualizovať.",
    deleteCronTask: "Naplánovanú úlohu sa nepodarilo odstrániť.",
    fetchCronTaskHistory: "Históriu naplánovanej úlohy sa nepodarilo načítať.",
    fetchCronTaskStats: "Štatistiku naplánovaných úloh sa nepodarilo načítať.",
    fetchCronStatus: "Stav plánovača úloh sa nepodarilo načítať.",
    cronTaskNotFound: "Naplánovaná úloha sa nenašla.",

    // Unified Runner errors
    startTaskRunner: "Spúšťač úloh sa nepodarilo zapnúť: {{error}}",
    stopTaskRunner: "Spúšťač úloh sa nepodarilo zastaviť.",
    getTaskRunnerStatus:
      "Stav spúšťača úloh sa nepodarilo zistiť. Neznáma akcia: {{action}}.",
    executeCronTask: "Naplánovanú úlohu sa nepodarilo spustiť.",

    // Pulse errors
    executePulse: "Kontrolný cyklus sa nepodarilo spustiť.",
    fetchPulseStatus: "Stav kontrolného cyklu sa nepodarilo načítať.",
    pulseExecutionFailed: "Kontrolný cyklus zlyhal.",
    pulseInternalError: "Interná chyba kontrolného cyklu",

    // Validation errors
    invalidTaskInput:
      "Vstup úlohy nezodpovedá schéme požiadavky koncového bodu.",
    endpointNotFound: "Pre dané ID trasy sa nenašiel koncový bod.",

    // Repository errors
    repositoryNotFound: "Zdroj sa nenašiel.",
    repositoryNotFoundDetail: "Úloha s ID {{taskId}} sa nenašla.",
    repositoryInternalError: "Nastala interná chyba.",
    repositoryInternalErrorDetail: "Nastala interná chyba: {{error}}",
    repositoryGetTaskForbidden:
      "Nemáte povolenie na zobrazenie úlohy {{taskId}}",
    repositoryUpdateTaskForbidden: "Nemáte povolenie aktualizovať túto úlohu",
    repositoryUpdateTaskForbiddenDetail:
      "Nemáte povolenie aktualizovať úlohu {{taskId}}",
    repositoryDeleteTaskForbidden:
      "Nemáte oprávnenie odstrániť úlohu {{taskId}}",
  },
  common: {
    cronRepositoryTaskUpdateFailed:
      "Naplánovanú úlohu {{taskId}} sa nepodarilo aktualizovať: {{error}}",
    cronRepositoryTaskDeleteFailed:
      "Naplánovanú úlohu {{taskId}} sa nepodarilo odstrániť: {{error}}",
    cronRepositoryExecutionCreateFailed:
      "Záznam o spustení naplánovanej úlohy {{taskId}} sa nepodarilo vytvoriť: {{error}}",
    cronRepositoryExecutionUpdateFailed:
      "Záznam o spustení naplánovanej úlohy sa nepodarilo aktualizovať.",
    cronRepositoryExecutionsFetchFailed:
      "Záznamy o spusteniach naplánovanej úlohy sa nepodarilo načítať.",
    cronRepositoryRecentExecutionsFetchFailed:
      "Posledné spustenia naplánovanej úlohy sa nepodarilo načítať.",
    cronRepositorySchedulesFetchFailed:
      "Časové plány úloh sa nepodarilo načítať.",
    cronRepositoryScheduleUpdateFailed:
      "Časový plán úlohy sa nepodarilo aktualizovať.",
    cronRepositoryStatisticsFetchFailed:
      "Štatistiku naplánovaných úloh sa nepodarilo načítať.",
  },
  outputMode: {
    storeOnly: "Iba uložiť",
    notifyOnFailure: "Upozorniť na zlyhanie",
    notifyAlways: "Upozorniť vždy",
  },
  dbHealthCheck: {
    name: "Kontrola stavu databázy",
    description: "Každú minútu overí, či pripojenie k databáze funguje.",
  },
  pulseRunner: {
    name: "pulse-runner",
    description:
      "Raz za minútu vykoná kontrolný cyklus a spustí naplánované úlohy.",
  },
  devWatcher: {
    name: "dev-file-watcher",
    description:
      "Sleduje zmeny súborov a spúšťa generátory vo vývojovom režime",
  },
  dbHealth: {
    tag: "Databáza",
    post: {
      title: "Kontrola stavu systému",
      titleShort: "Stav databázy",
      description: "Skontrolovať databázu, pamäť a disk",
      container: {
        title: "Stav systému",
        description: "Pripojenie k databáze, využitie pamäte a miesto na disku",
      },
      response: {
        healthy: "V poriadku",
        status: "Stav",
        dbResponseMs: "Čas odozvy databázy (ms)",
        memoryUsedPct: "Využitie pamäte (%)",
        heapUsedMb: "Využitie pamäte na halde (MB)",
        rssMb: "RSS (MB)",
        diskUsedPct: "Využitie disku (%)",
        uptimeHours: "Čas prevádzky (hodiny)",
        warnings: "Upozornenia",
      },
      errors: {
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Vyžaduje sa prihlásenie",
        },
        forbidden: {
          title: "Prístup zakázaný",
          description: "Prístup zamietnutý",
        },
        server: {
          title: "Chyba servera",
          description: "Kontrola stavu databázy zlyhala.",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
        validation: {
          title: "Chyba overenia",
          description: "Neplatné parametre požiadavky",
        },
        systemAlert: "Systém {{status}}: {{warnings}}",
      },
      success: {
        title: "Databáza je v poriadku",
        description: "Pripojenie k databáze funguje.",
      },
    },
  },
  completeTask: {
    post: {
      title: "Dokončiť úlohu",
      titleShort: "Dokončiť úlohu",
      description:
        "Označí úlohu na pozadí ako dokončenú. Programátorský agent ju zavolá po dokončení asynchrónnej práce. Vykonávanie čakajúcej konverzácie s AI potom pokračuje s doručeným výsledkom.",
      fields: {
        taskId: {
          title: "ID úlohy",
          description:
            "Databázové ID úlohy cron, ktorá sa má označiť za dokončenú.",
        },
        status: {
          title: "Stav",
          description:
            "Konečný stav: completed pri úspechu, failed pri zlyhaní alebo cancelled pri zrušení.",
        },
        summary: {
          title: "Zhrnutie",
          description: "Stručný opis výsledku alebo dôvodu zlyhania.",
        },
        output: {
          title: "Výstupné údaje",
          description:
            "Voliteľné štruktúrované údaje priložené k výsledku ako dvojice kľúč a hodnota.",
        },
        completed: {
          title: "Dokončené",
          description: "Či sa úloha úspešne označila za dokončenú.",
        },
        updatedAt: {
          title: "Čas poslednej aktualizácie",
          description: "Čas zmeny stavu úlohy.",
        },
      },
      errors: {
        validation: {
          title: "Chyba overenia",
          description: "Neplatné ID úlohy alebo hodnota stavu",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Vyžaduje sa prihlásenie",
        },
        internal: {
          title: "Dokončenie zlyhalo",
          description: "Nepodarilo sa označiť úlohu za dokončenú",
        },
        forbidden: {
          title: "Prístup zakázaný",
          description: "Prístup zamietnutý",
        },
        notFound: {
          title: "Úloha sa nenašla",
          description: "Úloha so zadaným ID sa nenašla",
        },
        network: {
          title: "Chyba siete",
          description:
            "Nepodarilo sa odoslať výsledok dokončenia vzdialenej inštancii",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
        unsaved: {
          title: "Neuložené zmeny",
          description: "Zistili sa neuložené zmeny",
        },
        conflict: {
          title: "Konflikt",
          description: "Úlohu v aktuálnom stave nemožno označiť za dokončenú",
        },
      },
      success: {
        title: "Úloha dokončená",
        description:
          "Úloha sa označila za dokončenú a odpoveď AI pokračuje s výsledkom",
      },
    },
  },
  waitForTask: {
    post: {
      title: "Počkať na úlohu",
      titleShort: "Počkať na úlohu",
      description:
        "Počká na nedokončenú úlohu na pozadí. Ak už skončila, vráti výsledok ihneď. Inak pozastaví odpoveď AI až do dokončenia úlohy pomocou wakeUp.",
      fields: {
        taskId: {
          title: "ID úlohy",
          description: "ID úlohy, na ktorej dokončenie sa čaká.",
        },
        status: {
          title: "Stav",
          description: "Aktuálny stav úlohy.",
        },
        result: {
          title: "Výsledok",
          description: "Výsledok úlohy, dostupný po dokončení.",
        },
        waiting: {
          title: "Čakanie",
          description:
            "Hodnota true znamená, že odpoveď AI čaká na dokončenie úlohy.",
        },
        originalToolName: {
          title: "Nástroj",
          description: "Nástroj, ktorý sa pôvodne spustil.",
        },
        originalArgs: {
          title: "Argumenty",
          description: "Vstupné argumenty pôvodného nástroja.",
        },
      },
      widget: {
        noToolName: "Názov nástroja nie je k dispozícii.",
        resolving: "Vyhľadáva sa nástroj…",
        unknownTool: "Neznámy nástroj: {{toolName}}",
      },
      errors: {
        validation: {
          title: "Chyba overenia",
          description: "Neplatná hodnota taskId",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Vyžaduje sa prihlásenie",
        },
        internal: {
          title: "Interná chyba",
          description:
            "Nepodarilo sa zaregistrovať čakanie na dokončenie úlohy",
        },
        forbidden: {
          title: "Prístup zakázaný",
          description: "Prístup zamietnutý",
        },
        notFound: {
          title: "Úloha sa nenašla",
          description: "Úloha so zadaným ID sa nenašla",
        },
        network: {
          title: "Chyba siete",
          description: "Nastala chyba siete",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
        unsaved: {
          title: "Neuložené zmeny",
          description: "Zistili sa neuložené zmeny",
        },
        conflict: {
          title: "Konflikt",
          description: "Nastal konflikt",
        },
      },
      success: {
        title: "Výsledok úlohy je pripravený",
        description: "Úloha je hotová alebo sa úspešne zaregistrovalo čakanie",
      },
      status: {
        waiting: "Čaká sa na úlohu…",
        complete: "Úloha dokončená",
      },
    },
  },
  errorMonitor: {
    name: "error-monitor",
    description: "Každé 3 hodiny vyhľadáva vo vláknach četu opakujúce sa chyby",
    tag: "Monitorovanie",
    post: {
      title: "Monitor chýb",
      description:
        "Sledovanie chýb s ochranou súkromia. Vyhľadáva vzory chýb bez čítania obsahu správ.",
      container: {
        title: "Výsledky kontroly chýb",
        description: "Súhrn vzorov chýb v správach četu",
      },
      response: {
        errorsFound: "Nájdené chyby",
        threadsScanned: "Skontrolované vlákna",
        scanWindowFrom: "Začiatok sledovaného obdobia",
        scanWindowTo: "Koniec sledovaného obdobia",
        patternType: "Typ chyby",
        patternCount: "Počet",
        patternThreadIds: "ID vlákien",
        patternModel: "Model",
        patternTool: "Nástroj",
        patternFirstSeen: "Prvý výskyt",
        patternLastSeen: "Posledný výskyt",
      },
      errors: {
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Vyžaduje sa prihlásenie",
        },
        forbidden: {
          title: "Prístup zakázaný",
          description: "Prístup zamietnutý",
        },
        server: {
          title: "Chyba servera",
          description: "Kontrola chýb zlyhala",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
        validation: {
          title: "Chyba overenia",
          description: "Neplatné parametre požiadavky",
        },
      },
      success: {
        title: "Kontrola dokončená",
        description: "Kontrola chýb sa úspešne dokončila",
      },
    },
    cleanup: {
      name: "Čistenie chybových záznamov",
      description:
        "Odstráni chybové záznamy staršie ako 6 mesiacov a obmedzí ich počet na 100 000",
      post: {
        title: "Čistenie chybových záznamov",
        titleShort: "Čistenie záznamov",
        description:
          "Odstráni staré chybové záznamy podľa veku a počtu, aby databáza zbytočne nerástla.",
        container: {
          title: "Výsledky čistenia",
          description: "Počet odstránených chybových záznamov",
        },
        response: {
          deletedCount: "Počet odstránených záznamov",
          deletedByTime: "Odstránené podľa veku",
          deletedByCount: "Odstránené nad limit počtu záznamov",
          retentionDays: "Doba uchovávania v dňoch",
          maxRows: "Najviac riadkov",
        },
        success: {
          title: "Čistenie dokončené",
          description: "Staré chybové záznamy sa odstránili",
        },
      },
    },
  },
  csvProcessor: {
    description: "Spracúva úlohy importu CSV po dávkach.",
  },
  imapSync: {
    description: "Automaticky synchronizuje účty, priečinky a správy IMAP",
  },
  newsletterUnsubscribeSync: {
    description: "Synchronizuje stavy kontaktov po odhlásení z odberu noviniek",
  },
  cronSystem: {
    history: {
      category: "Správa úloh",

      errors: {
        cronTaskNotFound: "Naplánovaná úloha sa nenašla.",
        repositoryInternalError: "Nastala interná chyba.",
        fetchCronTaskHistory:
          "Históriu naplánovanej úlohy sa nepodarilo načítať.",
      },

      get: {
        tags: {
          tasks: "Úlohy",
          monitoring: "Monitorovanie",
        },
        title: "História spustení úloh",
        description: "Zobraziť históriu spustení naplánovaných úloh",
        fields: {
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
            description:
              "Počet výsledkov, ktoré sa majú pri stránkovaní preskočiť",
            placeholder: "0",
          },
        },
        response: {
          title: "Výsledky vyhľadávania v histórii úloh",
          description:
            "Údaje o predchádzajúcich spusteniach naplánovaných úloh",
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
        title: "História spustení úloh",
        loading: "Načítava sa história…",
        header: {
          tasks: "Úlohy",
          stats: "Štatistiky",
          pulse: "Pulz",
          refresh: "Obnoviť",
        },
        summary: {
          total: "Spolu",
          successful: "Úspešné",
          failed: "Zlyhalo",
          successRate: "Miera úspešnosti",
          avgDuration: "Priemerné trvanie",
        },
        search: {
          placeholder: "Hľadať úlohy…",
        },
        filter: {
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
    },
    stats: {
      category: "Správa úloh",

      errors: {
        fetchCronTaskStats:
          "Štatistiku naplánovaných úloh sa nepodarilo načítať.",
      },

      get: {
        title: "Zobraziť štatistiky úloh cron",
        description: "Zobraziť podrobné štatistiky a metriky úloh cron",
        tag: "Štatistiky úloh cron",
        form: {
          title: "Požiadavka na štatistiky úloh cron",
          description: "Nastaviť parametre štatistík úloh cron",
        },
        fields: {
          period: {
            title: "Obdobie",
            description: "Obdobie použité na súhrn štatistík",
          },
          type: {
            title: "Typ štatistiky",
            description: "Typ štatistík, ktoré sa majú zobraziť",
          },
          taskId: {
            title: "ID úlohy",
            description: "Nepovinné ID úlohy na filtrovanie štatistík",
          },
          limit: {
            title: "Najviac výsledkov",
            description: "Najvyšší počet výsledkov",
          },
          timePeriod: {
            title: "Obdobie",
          },
          dateRangePreset: {
            title: "Predvolený rozsah dátumov",
          },
          taskName: {
            title: "Názov úlohy",
          },
          taskStatus: {
            title: "Stav úlohy",
          },
          taskPriority: {
            title: "Priorita",
          },
          healthStatus: {
            title: "Prevádzkový stav",
          },
          minDuration: {
            title: "Minimálne trvanie",
          },
          maxDuration: {
            title: "Maximálne trvanie",
          },
          includeDisabled: {
            title: "Zahrnúť vypnuté",
          },
          includeSystemTasks: {
            title: "Zahrnúť systémové úlohy",
          },
          hasRecentFailures: {
            title: "S nedávnymi zlyhaniami",
          },
          hasTimeout: {
            title: "S prekročením časového limitu",
          },
          search: {
            title: "Hľadať",
          },
        },
        period: {
          hour: "Každú hodinu",
          day: "Denne",
          week: "Týždenne",
          month: "Mesačne",
        },
        type: {
          overview: "Prehľad",
          performance: "Výkonnosť",
          errors: "Analýza chýb",
          trends: "Analýza trendov",
        },
        response: {
          totalTasks: { title: "Úlohy spolu" },
          executedTasks: { title: "Spustené úlohy" },
          successfulTasks: { title: "Úspešné úlohy" },
          failedTasks: { title: "Zlyhané úlohy" },
          averageExecutionTime: { title: "Priemerný čas vykonania (ms)" },
          totalExecutions: { title: "Celkový počet spustení" },
          executionsLast24h: { title: "Spustenia za posledných 24 h" },
          successRate: { title: "Miera úspešnosti (%)" },
          successfulExecutions: { title: "Úspešné spustenia" },
          failedExecutions: { title: "Neúspešné spustenia" },
          failureRate: { title: "Miera zlyhania (%)" },
          avgExecutionTime: { title: "Priemerný čas vykonania (ms)" },
          minExecutionTime: { title: "Minimálny čas vykonania (ms)" },
          maxExecutionTime: { title: "Maximálny čas vykonania (ms)" },
          medianExecutionTime: { title: "Medián času vykonania (ms)" },
          pendingExecutions: { title: "Čakajúce spustenia" },
          runningExecutions: { title: "Prebiehajúce spustenia" },
          activeTasks: { title: "Aktívne úlohy" },
          systemStatus: { title: "Stav systému" },
          uptime: { title: "Čas prevádzky" },
          healthyTasks: { title: "Úlohy v poriadku" },
          degradedTasks: { title: "Úlohy s problémami" },
          systemLoad: { title: "Systémové zaťaženie (%)" },
          queueSize: { title: "Dĺžka frontu" },
        },
        errors: {
          server: {
            title: "Chyba servera",
            description:
              "Pri načítavaní štatistík nastala interná chyba servera",
          },
          validation: {
            title: "Chyba overenia",
            description: "Zadané parametre sú neplatné",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Prístup k štatistikám vyžaduje prihlásenie",
          },
          forbidden: {
            title: "Prístup zakázaný",
            description: "Na zobrazenie štatistík nemáte oprávnenie",
          },
          notFound: {
            title: "Nenájdené",
            description: "Požadované štatistiky sa nenašli",
          },
          conflict: {
            title: "Konflikt",
            description: "Pri spracovaní žiadosti nastal konflikt",
          },
          network: {
            title: "Chyba siete",
            description: "Pri načítavaní štatistík nastala chyba siete",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Nastala neznáma chyba",
          },
          unsavedChanges: {
            title: "Neuložené zmeny",
            description: "Najprv vyriešte neuložené zmeny.",
          },
        },
        success: {
          title: "Štatistiky načítané",
          description: "Štatistiky úloh cron sa načítali",
        },
      },
      priority: {
        critical: "Kritická",
        high: "Vysoká",
        medium: "Stredná",
        low: "Nízka",
        background: "Na pozadí",
      },
      widget: {
        title: "Štatistiky úloh cron",
        loading: "Načítavajú sa štatistiky…",
        viewTasks: "Úlohy",
        viewHistory: "História",
        viewPulse: "Pulz",
        refresh: "Obnoviť",
        totalTasks: "Úlohy spolu",
        executedTasks: "Spustené úlohy",
        successfulTasks: "Úspešné",
        failedTasks: "Zlyhalo",
        successRate: "Miera úspešnosti",
        avgDuration: "Priemerné trvanie",
        overallSuccessRate: "Celková miera úspešnosti",
        activeTasks: "Aktívne úlohy",
        runningExecutions: "Prebieha",
        pendingExecutions: "Čaká",
        healthyTasks: "Úlohy v poriadku",
        degradedTasks: "Úlohy s problémami",
        systemLoad: "Systémové zaťaženie",
        queueSize: "Dĺžka frontu",
        executionsLast24h: "Posledných 24 hodín",
        tasksByStatus: "Úlohy podľa stavu",
        tasksByPriority: "Úlohy podľa priority",
        topPerforming: "Najúspešnejšie úlohy",
        problemTasks: "Problémové úlohy",
        recentActivity: "Nedávna aktivita",
        dailyStats: "Denné štatistiky",
        systemStatus: {
          healthy: "V poriadku",
          warning: "Upozornenie",
          critical: "Kritická",
          unknown: "Neznáme",
        },
        uptime: "Čas prevádzky",
        col: {
          rank: "#",
          taskName: "Názov úlohy",
          executions: "Spustenia",
          avgDuration: "Priemerné trvanie",
          failures: "Zlyhania",
          failureRate: "Miera zlyhania",
          date: "Dátum",
          successes: "Úspešné spustenia",
          uniqueTasks: "Počet rôznych úloh",
        },
      },
    },
    task: {
      category: "Systém",
      tags: {
        cron: "Cron",
        scheduling: "Plánovanie",
      },
      get: {
        title: "Načítať naplánovanú úlohu",
        description: "Načítať naplánovanú úlohu podľa ID",
        container: {
          title: "Podrobnosti naplánovanej úlohy",
          description: "Zobraziť podrobnosti vybranej naplánovanej úlohy",
        },
        fields: {
          id: {
            label: "ID úlohy",
            description: "Jedinečný identifikátor úlohy",
          },
        },
        response: {
          task: {
            title: "Úloha",
          },
        },
        errors: {
          validation: {
            title: "Chyba overenia",
            description: "Zadané ID úlohy je neplatné.",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Na zobrazenie tejto úlohy nemáte oprávnenie.",
          },
          notFound: {
            title: "Úloha sa nenašla",
            description: "Požadovaná úloha sa nenašla.",
          },
          internal: {
            title: "Interná chyba servera",
            description: "Úlohu sa nepodarilo načítať.",
          },
          forbidden: {
            title: "Prístup zakázaný",
            description: "Nemáte povolenie na prístup k tejto úlohe",
          },
          network: {
            title: "Chyba siete",
            description: "Nastala chyba siete",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Nastala neznáma chyba",
          },
          unsaved: {
            title: "Neuložené zmeny",
            description: "Máte neuložené zmeny",
          },
          conflict: {
            title: "Konflikt",
            description: "Nastal konflikt",
          },
        },
        success: {
          retrieved: {
            title: "Úloha sa načítala",
            description: "Úloha sa načítala.",
          },
        },
      },
      put: {
        title: "Aktualizovať naplánovanú úlohu",
        description: "Aktualizovať existujúcu naplánovanú úlohu",
        container: {
          title: "Aktualizovať naplánovanú úlohu",
          description: "Upraviť nastavenia úlohy",
        },
        fields: {
          id: {
            label: "ID úlohy",
            description: "Jedinečný identifikátor úlohy",
          },
          displayName: {
            label: "Zobrazovaný názov",
            description: "Názov úlohy, ktorý sa zobrazí používateľom",
            placeholder: "Zadajte zobrazovaný názov",
          },
          outputMode: {
            label: "Režim výstupu",
            description: "Kedy odoslať oznámenia po dokončení úlohy",
            placeholder: "Vyberte výstupný režim",
          },
          description: {
            label: "Opis",
            description: "Opis úlohy",
            placeholder: "Zadajte opis úlohy",
          },
          schedule: {
            label: "Plán",
            description: "Výraz cron určujúci čas spustenia",
            placeholder: "*/5 * * * *",
          },
          enabled: {
            label: "Zapnuté",
            description: "Či je úloha povolená",
          },
          priority: {
            label: "Priorita",
            description: "Úroveň priority úlohy",
            placeholder: "Vybrať prioritu",
          },
          category: {
            label: "Kategória",
            description: "Kategória úlohy",
            placeholder: "Vybrať kategóriu",
          },
          timeout: {
            label: "Časový limit (ms)",
            description:
              "Maximálny čas vykonávania v milisekundách. Napríklad 300000 znamená 5 minút.",
            placeholder: "300000",
          },
          retries: {
            label: "Počet opakovaní",
            description: "Počet ďalších pokusov po zlyhaní",
            placeholder: "3",
          },
          retryAttempts: {
            label: "Počet opakovaných pokusov",
            description: "Počet ďalších pokusov po zlyhaní",
          },
          retryDelay: {
            label: "Odstup medzi pokusmi (ms)",
            description:
              "Odstup medzi pokusmi v milisekundách. Napríklad 5000 znamená 5 sekúnd.",
            placeholder: "5000",
          },
          taskInput: {
            label: "Vstup úlohy",
            description: "Vstupné údaje JSON pre úlohu",
          },
          hidden: {
            label: "Skryté",
            description:
              "Skryť úlohu v systémových pokynoch pre AI aj v predvolených zoznamoch úloh",
          },
          runOnce: {
            label: "Spustiť raz",
            description: "Úloha sa spustí iba raz a potom sa vypne.",
          },
          targetInstance: {
            label: "Cieľová inštancia",
            description:
              "ID inštancie, na ktorej má úloha bežať. Ak pole necháte prázdne, spustí sa len na hostiteľskej inštancii.",
            placeholder: "napr. hermes, thea-prod",
          },
          lastExecutionStatus: {
            label: "Stav spustenia",
            description:
              "Prepíše stav posledného spustenia. Použite, ak úloha zostala v stave running.",
            placeholder: "Vybrať stav",
          },
        },
        response: {
          task: {
            title: "Aktualizovaná úloha",
          },
          success: {
            title: "Úspech",
          },
        },
        errors: {
          validation: {
            title: "Chyba overenia",
            description: "Poskytnuté údaje sú neplatné",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Na úpravu tejto úlohy nemáte oprávnenie.",
          },
          notFound: {
            title: "Úloha sa nenašla",
            description: "Úloha na aktualizáciu sa nenašla.",
          },
          internal: {
            title: "Interná chyba servera",
            description: "Nastala chyba pri aktualizácii úlohy",
          },
          forbidden: {
            title: "Prístup zakázaný",
            description: "Nemáte povolenie aktualizovať túto úlohu",
          },
          network: {
            title: "Chyba siete",
            description: "Nastala chyba siete",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Nastala neznáma chyba",
          },
          unsaved: {
            title: "Neuložené zmeny",
            description: "Máte neuložené zmeny",
          },
          conflict: {
            title: "Konflikt",
            description: "Pri aktualizácii úlohy nastal konflikt.",
          },
        },
        submitButton: {
          label: "Uložiť úlohu",
          loadingText: "Ukladá sa…",
        },
        success: {
          updated: {
            title: "Úloha sa aktualizovala",
            description: "Úloha sa aktualizovala.",
          },
        },
      },
      delete: {
        title: "Odstrániť naplánovanú úlohu",
        description: "Odstrániť naplánovanú úlohu",
        container: {
          title: "Odstrániť naplánovanú úlohu",
          description: "Odstrániť úlohu zo systému",
        },
        fields: {
          id: {
            label: "ID úlohy",
            description: "Jedinečné ID úlohy na odstránenie",
          },
        },
        response: {
          success: {
            title: "Úspech",
          },
          message: {
            title: "Správa",
          },
        },
        errors: {
          validation: {
            title: "Chyba overenia",
            description: "Zadané ID úlohy je neplatné.",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Nie ste oprávnení túto úlohu odstrániť",
          },
          notFound: {
            title: "Úloha sa nenašla",
            description: "Úloha na odstránenie sa nenašla.",
          },
          internal: {
            title: "Interná chyba servera",
            description: "Pri odstraňovaní úlohy nastala chyba.",
          },
          forbidden: {
            title: "Prístup zakázaný",
            description: "Na odstránenie tejto úlohy nemáte oprávnenie.",
          },
          network: {
            title: "Chyba siete",
            description: "Nastala chyba siete",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Nastala neznáma chyba",
          },
          unsaved: {
            title: "Neuložené zmeny",
            description: "Máte neuložené zmeny",
          },
          conflict: {
            title: "Konflikt",
            description: "Konflikt údajov bráni odstráneniu úlohy.",
          },
        },
        success: {
          deleted: {
            title: "Úloha bola odstránená",
            description: "Úloha bola odstránená.",
          },
        },
      },
      priority: {
        critical: "Kritická",
        high: "Vysoká",
        medium: "Stredná",
        low: "Nízka",
        background: "Cron",
      },
      status: {
        pending: "Čaká",
        running: "Prebieha",
        completed: "Dokončené",
        failed: "Zlyhalo",
        timeout: "Časový limit",
        cancelled: "Zrušené",
        skipped: "Preskočené",
        blocked: "Blokované",
        scheduled: "Plánované",
        stopped: "Zastavené",
        error: "Chyba",
      },
      taskCategory: {
        development: "Vývoj",
        build: "Zostavenie",
        watch: "Sledovanie zmien",
        generator: "Generátor",
        test: "Test",
        maintenance: "Údržba",
        database: "Databáza",
        system: "Systém",
        monitoring: "Monitorovanie",
      },
      outputMode: {
        storeOnly: "Iba uložiť",
        notifyOnFailure: "Upozorniť na zlyhanie",
        notifyAlways: "Upozorniť vždy",
      },
      widget: {
        notFound: "Úloha sa nenašla.",
        never: "Nikdy",
        history: "História",
        edit: "Upraviť",
        delete: "Odstrániť",
        enabled: "Zapnuté",
        disabled: "Vypnuté",
        identity: "Identita",
        id: "ID úlohy",
        routeId: "ID trasy",
        displayName: "Zobrazovaný názov",
        version: "Verzia",
        category: "Kategória",
        priority: "Priorita",
        schedule: "Plán",
        timezone: "Časové pásmo",
        createdAt: "Vytvorené",
        updatedAt: "Aktualizované",
        owner: "Vlastník",
        ownerSystem: "Systém",
        ownerUser: "Používateľ",
        outputMode: "Režim výstupu",
        outputModes: {
          storeOnly: "Iba uložiť",
          notifyOnFailure: "Upozorniť na zlyhanie",
          notifyAlways: "Upozorniť vždy",
        },
        stats: {
          totalExecutions: "Celkový počet spustení",
          successful: "Úspešné",
          errors: "Chyby",
          successRate: "Miera úspešnosti",
        },
        timingSection: "Načasovanie",
        timing: {
          avgDuration: "Priemerné trvanie",
          lastDuration: "Trvanie posledného spustenia",
          lastRun: "Posledné spustenie",
          nextRun: "Ďalšie spustenie",
          timeout: "Časový limit",
          retries: "Počet opakovaní",
          retryDelay: "Odstup medzi pokusmi",
        },
        lastExecutionError: "Posledná chyba",
        run: "Spustiť teraz",
        runSuccess: "Úloha sa úspešne vykonala.",
        running: "Prebieha…",
        refresh: "Obnoviť",
        taskInput: {
          title: "Vstup úlohy",
          loading: "Načítava sa definícia koncového bodu…",
          notFound: "Pre túto úlohu sa nenašla definícia koncového bodu.",
          empty: "Nie sú nastavené žiadne vstupné parametre.",
          editTitle: "Vstupné parametre úlohy",
          editDescription:
            "Nastavte vstupné parametre koncového bodu tejto úlohy.",
        },
        scheduleAutocomplete: {
          customBadge: "Vlastné",
          noSchedulesFound: "Nenašli sa žiadne časové plány",
          useCustomSchedule: "Použiť vlastný časový plán",
          commonSchedules: "Bežné časové plány",
        },
        schedulePicker: {
          selectPlaceholder: "Vybrať časový plán…",
          customOption: "Vlastný plán…",
          presets: {
            title: "Rýchle prednastavenia",
            everyMinute: "Každú minútu",
            every5m: "Každých 5 minút",
            every15m: "Každých 15 minút",
            every30m: "Každých 30 minút",
            everyHour: "Každú hodinu",
            every2h: "Každé 2 hodiny",
            every4h: "Každé 4 hodiny",
            every6h: "Každých 6 hodín",
            every12h: "Každých 12 hodín",
            dailyMidnight: "Denne o polnoci",
            daily6am: "Denne o 6.00",
            dailyNoon: "Denne na poludnie",
            daily6pm: "Denne o 18.00",
            weeklyMon: "Každý pondelok",
            weeklySun: "Každú nedeľu",
            monthlyFirst: "Prvý deň každého mesiaca",
          },
          custom: {
            title: "Vlastný plán",
            repeatEvery: "Interval spúšťania",
            at: "Čas",
            onDays: "Deň",
            preview: "→ {{description}}",
            nextRun: "Najbližšie: {{time}}",
            nextRunMultiple: "Najbližšie: {{first}}, potom {{second}}",
            unit: {
              minutes: "minúty",
              hours: "hodiny",
              days: "Dni",
              weeks: "Týždne",
              months: "mesiace",
            },
            days: {
              mon: "Po",
              tue: "Ut",
              wed: "St",
              thu: "Št",
              fri: "Pi",
              sat: "So",
              sun: "Ne",
            },
            advanced: "Pokročilý výraz",
            advancedPlaceholder: "napr. 0 9 * * 1-5",
            advancedInvalid: "Neplatný výraz cron",
          },
        },
      },
    },
    tasks: {
      category: "Koncový bod API",
      tags: {
        tasks: "Úlohy",
        cron: "Cron",
        scheduling: "Plánovanie",
      },
      errors: {
        fetchCronTasks: "Naplánované úlohy sa nepodarilo načítať.",
        createCronTask: "Naplánovanú úlohu sa nepodarilo vytvoriť.",
        invalidTaskInput:
          "Vstup úlohy nezodpovedá schéme požiadavky koncového bodu.",
        endpointNotFound: "Pre dané ID trasy sa nenašiel koncový bod.",
        targetInstanceForbidden:
          "Cieľovú inštanciu úlohy môže nastaviť iba správca.",
      },
      list: {
        columns: {
          createdAt: "Čas vytvorenia",
          updatedAt: "Čas poslednej aktualizácie",
        },
      },
      get: {
        title: "Zobraziť naplánované úlohy",
        description:
          "Načítať zoznam naplánovaných úloh s voliteľným filtrovaním",
        container: {
          title: "Zoznam naplánovaných úloh",
          description: "Zobraziť a filtrovať naplánované úlohy",
        },
        fields: {
          status: {
            label: "Stav",
            description: "Filtrovať podľa stavu úlohy",
            placeholder: "Vyberte stav…",
          },
          priority: {
            label: "Priorita",
            description: "Filter podľa priority úlohy",
            placeholder: "Vyberte prioritu…",
          },
          category: {
            label: "Kategória",
            description: "Filter podľa kategórie úloh",
            placeholder: "Vyberte kategóriu…",
          },
          enabled: {
            label: "Stav",
            description: "Filtrovať podľa toho, či je úloha zapnutá",
            placeholder: "Všetky úlohy",
          },
          hidden: {
            label: "Viditeľnosť",
            description:
              "Filtrovať podľa viditeľnosti. Predvolene sa zobrazia iba viditeľné úlohy.",
            placeholder: "Viditeľné úlohy",
          },
          search: {
            label: "Hľadať",
            description:
              "Filtrovať úlohy podľa názvu, trasy, popisu alebo kategórie",
            placeholder: "Hľadať úlohy…",
          },
          sort: {
            label: "Zoradenie",
            description: "Poradie úloh v zozname",
          },
          limit: {
            label: "Limit",
            description: "Najvyšší počet úloh vo výsledku",
          },
          offset: {
            label: "Posun",
            description: "Počet úloh, ktoré sa majú preskočiť",
          },
        },
        response: {
          tasks: {
            title: "Úlohy",
          },
          task: {
            title: "Úloha",
            description: "Údaje o jednotlivých úlohách",
            id: "ID úlohy",
            name: "Názov úlohy",
            taskDescription: "Opis",
            schedule: "Plán",
            enabled: "Zapnuté",
            hidden: "Skryté",
            priority: "Priorita",
            status: "Stav",
            category: "Kategória",
            lastRun: "Posledné spustenie",
            nextRun: "Ďalšie spustenie",
            version: "Verzia",
            timezone: "Časové pásmo",
            timeout: "Časový limit (ms)",
            retries: "Počet opakovaní",
            retryDelay: "Odstup medzi pokusmi (ms)",
            lastExecutedAt: "Čas posledného spustenia",
            lastExecutionStatus: "Stav posledného spustenia",
            lastExecutionError: "Chyba pri poslednom spustení",
            lastExecutionDuration: "Trvanie posledného spustenia (ms)",
            nextExecutionAt: "Čas ďalšieho spustenia",
            executionCount: "Počet spustení",
            successCount: "Počet úspešných spustení",
            errorCount: "Počet chýb",
            averageExecutionTime: "Priemerné trvanie (ms)",
            createdAt: "Čas vytvorenia",
            updatedAt: "Čas poslednej aktualizácie",
          },
          totalTasks: "Úlohy spolu",
        },
        errors: {
          internal: {
            title: "Pri načítaní úloh nastala interná chyba servera.",
            description: "Pri sťahovaní zoznamu úloh nastala neočakávaná chyba",
          },
          unauthorized: {
            title: "Neautorizovaný prístup do zoznamu úloh",
            description: "Nemáte povolenie na zobrazenie zoznamu úloh",
          },
          validation: {
            title: "Neplatné parametre požiadavky",
            description: "Zadané parametre požiadavky sú neplatné.",
          },
          forbidden: {
            title: "Prístup zakázaný",
            description: "Prístup k tomuto zdroju je zakázaný",
          },
          notFound: {
            title: "Úlohy sa nenašli",
            description: "Nezistili sa žiadne úlohy, ktoré by spĺňali kritériá",
          },
          network: {
            title: "Chyba siete",
            description: "Nastala chyba siete pri získavaní úloh",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Nastala neznáma chyba",
          },
          unsaved: {
            title: "Neuložené zmeny",
            description: "Najprv vyriešte neuložené zmeny.",
          },
          conflict: {
            title: "Chyba konfliktu",
            description: "Pri spracovaní žiadosti nastal konflikt",
          },
        },
        success: {
          retrieved: {
            title: "Úlohy sa načítali",
            description: "Zoznam úloh sa načítal.",
          },
        },
      },
      post: {
        title: "Vytvoriť naplánovanú úlohu",
        description: "Vytvoriť novú naplánovanú úlohu",
        container: {
          title: "Vytvoriť úlohu",
          description: "Nastaviť novú naplánovanú úlohu",
        },
        fields: {
          id: {
            label: "ID úlohy",
            description:
              'Jedinečný, stabilný identifikátor pre túto úlohu (napr. "db-health")',
            placeholder: "Zadajte ID úlohy…",
          },
          routeId: {
            label: "ID trasy",
            description:
              "Identifikátor obslužnej funkcie: názov úlohy, alias koncového bodu alebo cron-steps.",
            placeholder: "Zadajte ID trasy…",
          },
          displayName: {
            label: "Zobrazovaný názov",
            description: "Názov úlohy, ktorý sa zobrazí používateľom",
            placeholder: "Zadajte zobrazovaný názov…",
          },
          outputMode: {
            label: "Režim výstupu",
            description: "Kedy odoslať oznámenia po dokončení úlohy",
            placeholder: "Vyberte režim výstupu…",
          },
          description: {
            label: "Opis",
            description: "Opis úlohy",
            placeholder: "Zadajte opis…",
          },
          schedule: {
            label: "Plán",
            description: "Výraz cron určujúci čas spustenia",
            placeholder: "*/5 * * * *",
          },
          priority: {
            label: "Priorita",
            description: "Úroveň priority úlohy",
          },
          category: {
            label: "Kategória",
            description: "Kategória úlohy",
          },
          enabled: {
            label: "Zapnuté",
            description: "Zapne alebo vypne úlohu.",
          },
          hidden: {
            label: "Skryté",
            description:
              "Skryť úlohu v systémových pokynoch pre AI aj v predvolených zoznamoch úloh",
          },
          timeout: {
            label: "Časový limit (ms)",
            description: "Maximálny čas vykonávania v milisekundách",
          },
          retries: {
            label: "Počet opakovaní",
            description: "Počet opakovaných pokusov",
          },
          retryDelay: {
            label: "Odstup medzi pokusmi (ms)",
            description: "Odstup medzi pokusmi v milisekundách",
          },
          taskInput: {
            label: "Vstup úlohy",
            description: "Vstupné údaje JSON pre úlohu",
          },
          runOnce: {
            label: "Spustiť raz",
            description: "Úloha sa spustí iba raz a potom sa vypne.",
          },
          targetInstance: {
            label: "Cieľová inštancia",
            description:
              "ID inštancie, na ktorej má úloha bežať, napríklad hermes alebo thea-prod. Ak pole necháte prázdne, spustí sa len na hostiteľskej inštancii.",
            placeholder:
              "Pre spustenie iba na hostiteľskej inštancii nechajte pole prázdne.",
          },
        },
        response: {
          task: {
            title: "Vytvorená úloha",
          },
        },
        errors: {
          validation: {
            title: "Overenie vstupu zlyhalo",
            description: "Údaje o úlohe sú neplatné.",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Nemáte povolenie na vytváranie úloh",
          },
          internal: {
            title: "Interná chyba",
            description: "Nastala chyba pri vytváraní úlohy",
          },
          forbidden: {
            title: "Prístup zakázaný",
            description: "Prístup k tomuto zdroju je zakázaný",
          },
          conflict: {
            title: "Konflikt",
            description: "Úloha s týmto názvom už existuje",
          },
          network: {
            title: "Chyba siete",
            description: "Nastala chyba siete",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Nastala neznáma chyba",
          },
          notFound: {
            title: "Nenašlo sa",
            description: "Požadovaný zdroj sa nenašiel.",
          },
          unsaved: {
            title: "Neuložené zmeny",
            description: "Sú tu neuložené zmeny.",
          },
        },
        success: {
          created: {
            title: "Úloha vytvorená",
            description: "Úloha bola úspešne vytvorená",
          },
        },
      },
      widget: {
        title: "Naplánované úlohy",
        loading: "Načítavajú sa úlohy…",
        header: {
          stats: "Štatistiky",
          graphs: "Grafy",
          history: "História",
          queue: "Rad",
          refresh: "Obnoviť",
          create: "Nová úloha",
        },
        filter: {
          all: "Všetky",
          running: "Prebieha",
          completed: "Dokončené",
          failed: "Zlyhalo",
          pending: "Čaká",
          disabled: "Vypnuté",
          allPriorities: "Všetky priority",
          allCategories: "Všetky kategórie",
          visible: "Viditeľné",
          hiddenOnly: "Skryté",
          allTasks: "Všetky úlohy",
        },
        search: {
          placeholder: "Hľadať úlohy…",
        },
        sort: {
          nameAsc: "Podľa názvu od A po Z",
          nameDesc: "Podľa názvu od Z po A",
          schedule: "Plán",
          lastRunNewest: "Posledné spustenie (od najnovších)",
          executionsMost: "Najviac spustení",
        },
        task: {
          executions: "Spustenia:",
          lastRun: "Posledné spustenie:",
          never: "Nikdy",
          nextRun: "Ďalšie spustenie:",
          notScheduled: "Neplánované",
          routeId: "ID trasy",
          hiddenBadge: "Skryté",
          owner: {
            system: "Systém",
            user: "Používateľ",
          },
          outputMode: {
            storeOnly: "Iba uložiť",
            notifyOnFailure: "Upozorniť na zlyhanie",
            notifyAlways: "Upozorniť vždy",
          },
        },
        action: {
          view: "Zobraziť podrobnosti",
          history: "Zobraziť históriu",
          edit: "Upraviť úlohu",
          delete: "Odstrániť úlohu",
          runNow: "Spustiť teraz",
        },
        bulk: {
          selected: "Vybraté: {count}",
          selectAll: "Vybrať všetko",
          clearSelection: "Zrušiť výber",
          enable: "Zapnúť",
          disable: "Vypnúť",
          runNow: "Spustiť teraz",
          delete: "Odstrániť",
          confirmDeleteTitle: "Odstrániť úlohy?",
          confirmDelete:
            "Natrvalo odstrániť vybraté úlohy ({count})? Odstránenie sa nedá vrátiť.",
          cancel: "Zrušiť",
          success: "Úspešné: {succeeded}. Neúspešné: {failed}.",
        },
        empty: {
          noTasks: "Žiadne naplánované úlohy",
          noTasksDesc: "Začnite vytvorením prvej naplánovanej úlohy.",
          noMatches: "Vašim filtrom nezodpovedá žiadna úloha.",
          noMatchesDesc:
            "Skúste upraviť kritériá vyhľadávania alebo filtrovania",
          clearFilters: "Zrušiť filtre",
        },
      },
    },
    errors: {
      fetch_all_failed: "Naplánované úlohy sa nepodarilo načítať.",
      fetch_by_id_failed: "Nepodarilo sa načítať úlohu cron podľa ID",
      fetch_by_name_failed: "Nepodarilo sa načítať úlohu cron podľa názvu",
      create_failed: "Naplánovanú úlohu sa nepodarilo vytvoriť.",
      update_failed: "Naplánovanú úlohu sa nepodarilo aktualizovať.",
      delete_failed: "Naplánovanú úlohu sa nepodarilo odstrániť.",
      not_found: "Naplánovaná úloha sa nenašla.",
      execution_create_failed:
        "Nepodarilo sa vytvoriť záznam o spustení úlohy cron",
      execution_update_failed:
        "Záznam o spustení naplánovanej úlohy sa nepodarilo aktualizovať.",
      execution_not_found: "Záznam o spustení úlohy cron sa nenašiel",
      executions_fetch_failed:
        "Záznamy o spusteniach naplánovanej úlohy sa nepodarilo načítať.",
      recent_executions_fetch_failed:
        "Nepodarilo sa načítať posledné spustenia úloh cron.",
      schedules_fetch_failed: "Časové plány úloh sa nepodarilo načítať.",
      schedule_update_failed: "Časový plán úlohy sa nepodarilo aktualizovať.",
      schedule_not_found: "Harmonogram úlohy cron sa nenašiel",
      statistics_fetch_failed:
        "Štatistiku naplánovaných úloh sa nepodarilo načítať.",
    },
  },
  pulseSystem: {
    execute: {
      category: "Spustenie Pulse",
      tags: {
        execute: "Spustiť",
      },
      post: {
        title: "Spustiť Pulse",
        description: "Spustí kontrolu stavu v Pulse a vykoná úlohy.",
        container: {
          title: "Spustenie Pulse",
          description: "Spustí monitorovanie Pulse a vykoná naplánované úlohy.",
        },
        fields: {
          dryRun: {
            label: "Skúšobné spustenie",
            description: "Skúšobné spustenie bez vykonania zmien",
          },
          taskNames: {
            label: "Názvy úloh",
            description:
              "Konkrétne názvy úloh, ktoré sa majú vykonať (nepovinné)",
          },
          force: {
            label: "Vynútiť spustenie",
            description: "Spustí úlohy aj pred naplánovaným termínom.",
          },
          success: {
            title: "Úspech",
          },
          message: {
            title: "Správa",
          },
        },
        response: {
          pulseId: "ID spustenia Pulse",
          executedAt: "Čas spustenia",
          totalTasksDiscovered: "Počet nájdených úloh",
          tasksDue: "Úlohy na spustenie",
          tasksExecuted: "Spustené úlohy",
          tasksSucceeded: "Úspešné úlohy",
          tasksFailed: "Neúspešné úlohy",
          tasksSkipped: "Preskočené úlohy",
          totalExecutionTimeMs: "Celkový čas vykonania (ms)",
          errors: "Chyby",
          summary: "Súhrn spustení",
          results: "Výsledky",
          resultsDescription: "Výsledky vykonávania úloh",
          taskName: "Názov úlohy",
          success: "Úspech",
          duration: "Trvanie",
          message: "Správa",
          executionFailed: "Vykonanie zlyhalo",
          dryRunSuccess: "Skúšobné spustenie sa dokončilo",
          executionSuccess: "Vykonanie sa úspešne dokončilo",
        },
        examples: {
          basic: {
            title: "Základné spustenie Pulse",
          },
          dryRun: {
            title: "Skúšobné spustenie",
          },
          success: {
            title: "Úspešné spustenie",
          },
        },
        errors: {
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Vyžaduje sa prihlásenie",
          },
          internal: {
            title: "Interná chyba",
            description: "Nastala interná chyba servera.",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Nastala neznáma chyba",
          },
          network: {
            title: "Chyba siete",
            description: "Nastala chyba siete",
          },
          forbidden: {
            title: "Prístup zakázaný",
            description: "Prístup zakázaný",
          },
          notFound: {
            title: "Nenájdené",
            description: "Zdroj sa nenašiel.",
          },
          conflict: {
            title: "Konflikt",
            description: "Nastal konflikt údajov",
          },
          unsaved: {
            title: "Neuložené zmeny",
            description: "Sú tu neuložené zmeny.",
          },
          validation: {
            title: "Chyba overenia",
            description: "Neplatné parametre požiadavky",
          },
        },
        success: {
          title: "Úspech",
          description: "Operácia sa úspešne dokončila",
        },
      },
    },
    status: {
      category: "Stav Pulse",
      tags: {
        status: "Stav",
      },
      get: {
        title: "Stav Pulse",
        description: "Zobraziť stav monitorovania Pulse",
        container: {
          title: "Prevádzkový stav Pulse",
          description: "Sleduje stav a štatistiky spustení Pulse.",
        },
        fields: {
          status: {
            title: "Stav",
            label: "Stav Pulse",
            description: "Aktuálny stav Pulse",
          },
          lastPulseAt: {
            title: "Čas posledného spustenia Pulse",
            label: "Posledné spustenie Pulse",
            description: "Čas posledného spustenia Pulse",
          },
          successRate: {
            title: "Miera úspešnosti",
            label: "Miera úspešnosti",
            description: "Podiel úspešných spustení Pulse v percentách",
          },
          totalExecutions: {
            title: "Celkový počet spustení",
            label: "Celkový počet spustení",
            description: "Celkový počet spustení Pulse",
          },
        },
        examples: {
          basic: {
            title: "Základná požiadavka na stav",
          },
          success: {
            title: "Úspešná odpoveď na požiadavku o stav",
          },
        },
        errors: {
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Vyžaduje sa prihlásenie",
          },
          internal: {
            title: "Interná chyba",
            description: "Nastala interná chyba servera.",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Nastala neznáma chyba",
          },
          network: {
            title: "Chyba siete",
            description: "Nastala chyba siete",
          },
          forbidden: {
            title: "Prístup zakázaný",
            description: "Prístup zakázaný",
          },
          notFound: {
            title: "Nenájdené",
            description: "Zdroj sa nenašiel.",
          },
          conflict: {
            title: "Konflikt",
            description: "Nastal konflikt údajov",
          },
          unsaved: {
            title: "Neuložené zmeny",
            description: "Sú tu neuložené zmeny.",
          },
          validation: {
            title: "Chyba overenia",
            description: "Neplatné parametre požiadavky",
          },
        },
        success: {
          title: "Úspech",
          description: "Operácia sa úspešne dokončila",
        },
      },
    },
    history: {
      category: "Správa úloh",

      tags: {
        pulse: "Pulz",
        monitoring: "Monitorovanie",
      },

      errors: {
        fetchCronTaskHistory: "Nepodarilo sa načítať históriu spustení Pulse",
      },

      get: {
        title: "História spustení Pulse",
        description: "Zobrazí minulé spustenia Pulse.",
        fields: {
          startDate: {
            label: "Dátum začiatku",
            description: "Zobraziť spustenia Pulse po tomto dátume",
          },
          endDate: {
            label: "Dátum ukončenia",
            description: "Zobraziť spustenia Pulse pred týmto dátumom",
          },
          status: {
            label: "Stav",
            description: "Zobrazí spustenia podľa stavu.",
            placeholder: "Všetky stavy",
          },
          limit: {
            label: "Limit výsledkov",
            description: "Najvyšší počet výsledkov",
            placeholder: "50",
          },
          offset: {
            label: "Posun výsledkov",
            description:
              "Počet výsledkov, ktoré sa majú pri stránkovaní preskočiť",
            placeholder: "0",
          },
        },
        response: {
          executions: { title: "Spustenia Pulse" },
          totalCount: { title: "Celkový počet" },
          hasMore: { title: "K dispozícii sú ďalšie výsledky" },
          summary: { title: "Súhrn spustení" },
        },
        errors: {
          validation: {
            title: "Chyba overenia",
            description: "Parametre požiadavky sú neplatné.",
          },
          network: {
            title: "Chyba siete",
            description: "Pri načítavaní histórie Pulse nastala chyba siete",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Na zobrazenie histórie Pulse nemáte oprávnenie",
          },
          forbidden: {
            title: "Prístup zakázaný",
            description: "Prístup k histórii Pulse je zakázaný",
          },
          notFound: {
            title: "Nenájdené",
            description: "Záznam o spustení Pulse sa nenašiel",
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
            title: "Neuložené zmeny",
          },
          conflict: {
            title: "Konflikt",
            description: "Nastal konflikt údajov",
          },
        },
        success: {
          title: "História sa načítala",
          description: "História spustení Pulse sa načítala.",
        },
      },
      pulse: {
        execution: {
          success: "Úspech",
          failure: "Zlyhanie",
          timeout: "Časový limit",
          cancelled: "Zrušené",
          pending: "Čaká",
        },
      },
      widget: {
        title: "História Pulse",
        empty: "Nenašli sa žiadne spustenia Pulse.",
        details: "Detaily",
        discovered: "Nájdené: {{count}}",
        due: "Na spustenie: {{count}}",
        succeeded: "Úspešné: {{count}}",
        failed: "Počet zlyhaní: {{count}}",
        tasksExecuted: "Spustené",
        tasksSucceeded: "Úspešné",
        tasksFailed: "Zlyhalo",
        tasksSkipped: "Preskočené",
        header: {
          cronHistory: "História úloh cron",
          stats: "Štatistiky",
          refresh: "Obnoviť",
        },
        summary: {
          total: "Spolu",
          successful: "Úspešné",
          failed: "Zlyhalo",
          successRate: "Miera úspešnosti",
          avgDuration: "Priemerné trvanie",
        },
        filter: {
          all: "Všetky",
          success: "Úspech",
          failure: "Zlyhalo",
          timeout: "Časový limit",
        },
        pagination: {
          info: "Strana {{page}} z {{totalPages}} (celkovo {{total}})",
          prev: "Predchádzajúce",
          next: "Ďalej",
        },
      },
    },
    success: {
      title: "Úspech",
      description: "Pulse sa úspešne vykonal.",
      content: "Úspech",
    },
    container: {
      title: "Nastavenia Pulse",
      description: "Nastavenia spustenia Pulse",
    },
  },
  unifiedRunner: {
    category: "Správa úloh",

    description: "Vykonáva úlohy na pozadí a spravuje vedľajšie úlohy.",
    common: {
      taskName: "Názov úlohy",
      taskNamesDescription: "Názvy úloh na filtrovanie",
      detailed: "Podrobné",
      detailedDescription: "Zahrnúť podrobné informácie",
      active: "Aktívny",
      total: "Spolu",
      uptime: "Čas prevádzky",
      id: "ID",
      status: "Stav",
      lastRun: "Posledné spustenie",
      nextRun: "Ďalšie spustenie",
      schedule: "Plán",
    },
    post: {
      title: "Jednotný spúšťač úloh",
      description:
        "Spravovať jednotný spúšťač úloh na pozadí a vedľajších úloh",
      container: {
        title: "Správa jednotného spúšťača úloh",
        description:
          "Ovládať jednotný spúšťač úloh na pozadí aj vedľajších úloh",
      },
      fields: {
        action: {
          label: "Akcia",
          description: "Akcia, ktorá sa má vykonať so spúšťačom úloh",
          options: {
            start: "Spustiť spúšťač úloh",
            stop: "Zastaviť spúšťač úloh",
            status: "Zobraziť stav",
            restart: "Reštartovať spúšťač úloh",
          },
        },
        taskFilter: {
          label: "Filter úloh",
          description: "Filtrovať úlohy podľa typu",
          options: {
            all: "Všetky úlohy",
            cron: "Iba úlohy cron",
            side: "Iba vedľajšie úlohy",
          },
        },
        dryRun: {
          label: "Skúšobné spustenie",
          description: "Skúšobné spustenie bez vykonania zmien",
        },
      },
      response: {
        success: "Úspech operácie",
        actionResult: "Výsledok akcie",
        message: "Správa vo výsledku",
        timestamp: "Časová pečiatka",
      },
      reasons: {
        previousInstanceRunning: "Predchádzajúca inštancia stále beží",
      },
      messages: {
        taskSkipped: "Úloha bola vynechaná",
        taskCompleted: "Úloha sa úspešne dokončila",
      },
      errors: {
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Vyžaduje sa prihlásenie",
        },
        validation: {
          title: "Chyba overenia",
          description: "Neplatné parametre požiadavky",
        },
        internal: {
          title: "Interná chyba",
          description: "Nastala interná chyba servera.",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Nastala neznáma chyba",
        },
        network: {
          title: "Chyba siete",
          description: "Nastala chyba siete",
        },
        forbidden: {
          title: "Prístup zakázaný",
          description: "Prístup zakázaný",
        },
        notFound: {
          title: "Nenájdené",
          description: "Zdroj sa nenašiel.",
        },
        conflict: {
          title: "Konflikt",
          description: "Nastal konflikt údajov",
        },
        unsaved: {
          title: "Neuložené zmeny",
          description: "Sú tu neuložené zmeny.",
        },
        execution: {
          title: "Chyba pri vykonávaní úlohy",
          description: "Nepodarilo sa spustiť úlohu",
        },
        taskAlreadyRunning: {
          title: "Úloha už beží",
          description: "Zadaná úloha už beží",
        },
        sideTaskExecution: {
          title: "Chyba pri vykonávaní vedľajšej úlohy",
          description: "Vedľajšiu úlohu sa nepodarilo vykonať",
        },
      },
      success: {
        title: "Úspech",
        description: "Operácia sa úspešne dokončila",
      },
    },
  },
};
