import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Správa serverov",
  enum: {
    processStatus: {
      running: "Prebieha",
      stopped: "Zastavené",
      error: "Chyba",
    },
    environment: {
      development: "Vývoj",
      production: "Produkcia",
      testing: "Testovanie",
      staging: "Predprodukcia",
    },
    mode: {
      development: "Vývoj",
      production: "Produkcia",
    },
    framework: {
      next: "Next.js",
      tanstack: "TanStack/Vite",
    },
  },
  build: {
    category: "Správa serverov",
    tags: {
      build: "Zostavenie",
    },
    post: {
      title: "Zostaviť aplikáciu",
      description: "Zostaviť aplikáciu na produkčné nasadenie",
      form: {
        title: "Nastavenia zostavenia",
        description: "Nastaviť možnosti zostavenia",
      },
      fields: {
        package: {
          title: "Zostaviť balík",
          description: "Pred zostavením aplikácie zostaviť balík",
        },
        skipNextCommand: {
          title: "Preskočiť príkaz Next.js",
          description: "Preskočiť príkaz zostavenia Next.js",
        },
        target: {
          title: "Cieľ zostavenia",
          description:
            "Zadajte cieľ zostavenia, napríklad production alebo staging",
        },
        skipGeneration: {
          title: "Preskočiť generovanie kódu",
          description:
            "Pri zostavení preskočiť generovanie koncových bodov API",
        },
        generate: {
          title: "Generovať kód",
          description: "Pri zostavení vygenerovať kód",
        },
        generateEndpoints: {
          title: "Generovať koncové body",
          description: "Pri zostavení vygenerovať súbory koncových bodov API",
        },
        generateSeeds: {
          title: "Vygenerovať počiatočné dáta",
          description: "Pri zostavení vygenerovať súbory s počiatočnými dátami",
        },
        nextBuild: {
          title: "Zostavenie Next.js",
          description: "Spustiť zostavenie Next.js",
        },
        migrate: {
          title: "Spustiť migrácie",
          description: "Pri zostavení spustiť migrácie databázy",
        },
        seed: {
          title: "Vložiť počiatočné dáta",
          description: "Pri zostavení vložiť počiatočné dáta do databázy",
        },
        force: {
          title: "Vynútiť zostavenie",
          description: "Pokračovať v zostavení aj pri chybách",
        },
        framework: {
          title: "Rámec",
          description: "Frontendový framework a nástroj na zostavenie balíka",
        },
        webpack: {
          title: "Použiť webpack",
          description:
            "Použiť webpack namiesto Turbopacku. Spotrebuje približne 7,5 GB pamäte oproti približne 12 GB. Pri produkčnom zostavení cez Docker je táto voľba predvolene zapnutá.",
        },
        skipEndpoints: {
          title: "Preskočiť generovanie koncových bodov",
          description: "Preskočiť generovanie súborov koncových bodov",
        },
        skipSeeds: {
          title: "Preskočiť generovanie počiatočných dát",
          description: "Preskočiť generovanie súborov s počiatočnými dátami",
        },
        skipProdMigrations: {
          title: "Preskočiť produkčné migrácie",
          description: "Preskočiť migrácie produkčnej databázy",
        },
        skipProdSeeding: {
          title: "Preskočiť vloženie počiatočných dát v produkcii",
          description:
            "Preskočiť vloženie počiatočných dát do produkčnej databázy",
        },
        runProdDatabase: {
          title: "Vykonať operácie v produkčnej databáze",
          description: "Po zostavení vykonať operácie v produkčnej databáze",
        },
        success: {
          title: "Zostavenie úspešné",
        },
        output: {
          title: "Výstup zostavenia",
        },
        duration: {
          title: "Trvanie zostavenia (ms)",
        },
        errors: {
          title: "Chyby zostavenia",
        },
        steps: {
          title: "Kroky zostavenia",
        },
        label: {
          title: "Krok",
        },
        ok: {
          title: "Úspech",
        },
        skipped: {
          title: "Preskočené",
        },
      },
      errors: {
        validation: {
          title: "Overenie vstupu zlyhalo",
          description: "Zadané parametre zostavenia sú neplatné.",
        },
        network: {
          title: "Chyba siete",
          description: "Počas zostavenia zlyhalo sieťové pripojenie",
        },
        unauthorized: {
          title: "Bez oprávnenia",
          description: "Zostavenie aplikácie vyžaduje prihlásenie",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Na zostavenie aplikácie nemáte oprávnenie",
        },
        notFound: {
          title: "Nenájdené",
          description: "Zdroje potrebné na zostavenie sa nenašli",
        },
        server: {
          title: "Chyba servera",
          description: "Počas zostavenia nastala interná chyba servera",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Počas zostavenia nastala neznáma chyba",
        },
        conflict: {
          title: "Konflikt",
          description: "Zistil sa konflikt pri zostavení",
        },
        nextjs_build_failed: {
          title: "Zostavenie Next.js zlyhalo",
          description: "Zostavenie Next.js zlyhalo: {{error}}",
        },
      },
      success: {
        title: "Zostavenie dokončené",
        description: "Aplikácia bola úspešne zostavená",
      },
      repository: {
        messages: {
          buildStart: "🚀 Spúšťa sa zostavenie aplikácie…",
          packageBuildStart: "Zostavuje sa balík…",
          packageBuildSuccess: "✅ Balík bol úspešne zostavený",
          packageBuildFailed: "Zostavenie balíka zlyhalo",
          buildPrerequisites: "Vykonávajú sa kroky pred zostavením…",
          skipGeneration:
            "Preskakuje sa generovanie koncových bodov API (--skip-generation)",
          generatingEndpoints: "Generujú sa koncové body API…",
          generationSuccess: "✅ Generovanie kódu je dokončené",
          generationFailed: "Generovanie kódu zlyhalo",
          skipNextBuild:
            "Zostavenie Next.js sa preskakuje. Zabezpečí ho package.json.",
          buildingNextjs: "Zostavuje sa aplikácia Next.js…",
          nextjsBuildSuccess: "✅ Aplikácia Next.js bola úspešne zostavená",
          nextjsBuildFailed: "Zostavenie Next.js zlyhalo",
          skipProdDb:
            "Preskakujú sa operácie v produkčnej databáze (--run-prod-database=false)",
          buildFailed: "❌ Zostavenie zlyhalo",
          schemaGenerationStart: "Generuje sa schéma databázy…",
          schemaGenerationSuccess: "✅ Schéma databázy bola vygenerovaná",
          schemaGenerationFailed: "Generovanie schémy databázy zlyhalo",
          skipSchemaGeneration:
            "Preskakuje sa generovanie schémy databázy (--run-prod-database=false)",
          reportsGenerationStart: "Generujem všetky správy...",
          reportsGenerationSuccess: "✅ Všetky správy úspešne generované",
          reportsGenerationFailed: "Generovanie správ zlyhalo",
          prodDbStart: "🚀 Vykonávajú sa operácie v produkčnej databáze…",
          prodDbSuccess:
            "🎉 Operácie v produkčnej databáze sa úspešne dokončili",
          prodDbFailed: "❌ Produkčné zostavenie zlyhalo pri práci s databázou",
          prodDbNotReady:
            "💡 Toto zostavenie nie je pripravené na produkčné nasadenie",
          deploymentReady: "🚀 Aplikácia je pripravená na produkčné nasadenie!",
          dbConnectionError:
            "Databázové pripojenie zlyhalo. Prosím, uistite sa, že databáza je spustená a prístupná.",
          dbStartSuggestion:
            "Skúste spustiť 'docker compose -f docker-compose-dev.yml up -d' pre spustenie databázy",
          nextBuildHandled: "✅ Zostavenie Next.js zabezpečí príkaz yarn build",
          failedProdMigrations:
            "Nepodarilo sa spustiť migrácie produkčnej databázy",
        },
      },
    },
  },
  dev: {
    category: "Správa serverov",

    post: {
      title: "Vývoj",
      description: "Koncový bod vývojového servera",
      form: {
        title: "Nastavenia vývojového servera",
        description: "Nastaviť parametre vývojového servera",
      },
      response: {
        title: "Odpoveď",
        description: "Výsledok spustenia vývojového servera",
      },
      fields: {
        debug: {
          title: "Ladiaci režim",
          description: "Zapnúť ladiaci režim s podrobným výstupom",
        },
        skipDbSetup: {
          title: "Preskočiť nastavenie databázy",
          description: "Preskočiť kroky nastavenia databázy",
        },
        skipNextCommand: {
          title: "Preskočiť príkaz Next.js",
          description: "Preskočiť spustenie vývojového servera Next.js",
        },
        skipDbReset: {
          title: "Preskočiť reset databázy",
          description: "Preskočiť obnovenie databázy do východiskového stavu",
        },

        port: {
          title: "Port",
          description: "Číslo portu pre vývojový server",
        },
        skipGeneratorWatcher: {
          title: "Nespúšťať sledovanie zmien pre generátor",
          description:
            "Preskočiť sledovanie zmien pre automatické generovanie kódu",
        },
        generatorWatcherInterval: {
          title: "Interval generátora",
          description: "Interval kontroly zmien pre generátor v milisekundách",
        },
        skipTaskRunner: {
          title: "Nespúšťať spúšťač úloh",
          description: "Nespúšťať systém na vykonávanie úloh",
        },
        skipMigrations: {
          title: "Preskočiť migrácie",
          description: "Preskočiť migrácie databázy",
        },
        skipMigrationGeneration: {
          title: "Preskočiť generovanie migrácií",
          description: "Preskočiť automatické generovanie migrácií",
        },
        skipSeeding: {
          title: "Preskočiť vloženie počiatočných dát",
          description: "Preskočiť vloženie počiatočných dát do databázy",
        },
        framework: {
          title: "Rámec",
          description: "Frontendový framework a nástroj na zostavenie balíka",
        },
        profile: {
          title: "Profil",
          description:
            "Zapne profilovanie nastavením NEXT_TURBOPACK_TRACING=1 (trasovanie v .next/dev/trace-turbopack) a NEXT_CPU_PROF=1 (pri ukončení zapíše .cpuprofile).",
        },
        success: {
          title: "Úspech",
        },
        output: {
          title: "Výstup",
        },
        duration: {
          title: "Trvanie",
        },
        serverUrl: {
          title: "Adresa URL servera",
        },
        databaseStatus: {
          title: "Stav databázy",
        },
        processes: {
          title: "Procesy",
        },
        errors: {
          title: "Chyby",
        },
      },
      errors: {
        unauthorized: {
          title: "Bez oprávnenia",
          description: "Vyžaduje sa prihlásenie",
        },
        validation: {
          title: "Chyba overenia údajov",
          description: "Neplatné parametre požiadavky",
        },
        server: {
          title: "Chyba servera",
          description: "Nastala interná chyba servera",
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
          title: "Prístup zamietnutý",
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
      },
      success: {
        title: "Úspech",
        description: "Operácia úspešne dokončená",
      },
    },
  },
  health: {
    category: "Správa serverov",

    tag: "Stav",
    get: {
      title: "Kontrola stavu",
      description: "Zobraziť stav servera a diagnostiku",
      form: {
        title: "Možnosti kontroly stavu",
        description: "Nastaviť parametre kontroly stavu",
      },
      fields: {
        detailed: {
          title: "Podrobná správa",
          description: "Zahrnúť podrobné systémové informácie",
        },
        includeDatabase: {
          title: "Zahrnúť databázu",
          description: "Zahrnúť kontroly stavu databázy",
        },
        includeTasks: {
          title: "Zahrnúť úlohy",
          description: "Zahrnúť kontrolu spúšťača úloh",
        },
        includeSystem: {
          title: "Zahrnúť systém",
          description: "Zahrnúť informácie o systémových zdrojoch",
        },
      },
      response: {
        status: {
          title: "Stav",
          description: "Celkový stav",
        },
        timestamp: {
          title: "Časová pečiatka",
          description: "Čas kontroly stavu",
        },
        uptime: {
          title: "Čas prevádzky",
          description: "Čas prevádzky servera v sekundách",
        },
        environment: {
          title: "Prostredie",
          description: "Informácie o prostredí servera",
          name: {
            title: "Názov prostredia",
          },
          nodeEnv: {
            title: "Prostredie Node.js",
          },
          platform: {
            title: "Platforma",
          },
          supportsTaskRunners: {
            title: "Podpora spúšťačov úloh",
          },
        },
        database: {
          title: "Stav databázy",
          description: "Stav pripojenia k databáze",
          status: {
            title: "Stav pripojenia",
          },
          responseTime: {
            title: "Čas odozvy (ms)",
          },
          error: {
            title: "Chybové hlásenie",
          },
        },
        tasks: {
          title: "Stav úlohy",
          description: "Stav spúšťača úloh",
          runnerStatus: {
            title: "Stav spúšťača",
          },
          activeTasks: {
            title: "Aktívne úlohy",
          },
          totalTasks: {
            title: "Celkový počet úloh",
          },
          errors: {
            title: "Počet chýb",
          },
          lastError: {
            title: "Posledná chyba",
          },
        },
        system: {
          title: "Systémové informácie",
          description: "Informácie o systémových zdrojoch",
          memory: {
            title: "Využitie pamäte",
            description: "Informácie o systémovej pamäti",
            used: {
              title: "Použitá pamäť",
            },
            total: {
              title: "Celková pamäť",
            },
            percentage: {
              title: "Využitie pamäte (%)",
            },
          },
          cpu: {
            title: "Využitie procesora",
            description: "Informácie o procesore",
            usage: {
              title: "Využitie procesora (%)",
            },
            loadAverage: {
              title: "Priemerné zaťaženie",
            },
          },
          disk: {
            title: "Využitie disku",
            description: "Informácie o systémovom disku",
            available: {
              title: "Dostupný priestor",
            },
            total: {
              title: "Celkový priestor",
            },
            percentage: {
              title: "Využitie disku (%)",
            },
          },
        },
        checks: {
          title: "Kontroly stavu",
          description: "Kontroly stavu jednotlivých komponentov",
          item: {
            title: "Kontrola stavu",
            description: "Výsledok kontroly jedného komponentu",
            name: {
              title: "Názov kontroly",
            },
            status: {
              title: "Stav kontroly",
            },
            message: {
              title: "Hlásenie kontroly",
            },
            duration: {
              title: "Trvanie (ms)",
            },
          },
        },
      },
      errors: {
        unauthorized: {
          title: "Bez oprávnenia",
          description: "Vyžaduje sa prihlásenie",
        },
        validation: {
          title: "Chyba overenia údajov",
          description: "Neplatné parametre požiadavky",
        },
        server: {
          title: "Chyba servera",
          description: "Nastala interná chyba servera",
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
          title: "Prístup zamietnutý",
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
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Zostali neuložené zmeny.",
        },
      },
      success: {
        title: "Úspech",
        description: "úspešne dokončená kontrola stavu",
      },
    },
  },
  start: {
    category: "Správa serverov",
    tags: {
      start: "Spustiť",
    },
    post: {
      title: "Spustiť produkčný server",
      description: "Spustiť prípravné úlohy a produkčný server Next.js",
      form: {
        title: "Nastavenia spustenia",
        description: "Nastaviť parametre spustenia servera",
      },
      response: {
        title: "Odpoveď",
        description: "Výsledok spustenia",
      },
      fields: {
        skipPre: {
          title: "Preskočiť prípravné úlohy",
          description: "Pred spustením servera nevykonávať prípravné úlohy",
        },
        skipNextCommand: {
          title: "Preskočiť príkaz Next.js",
          description: "Preskočiť príkaz na spustenie Next.js",
        },
        mode: {
          title: "Režim servera",
          description:
            "Čo spustiť: all (predvolené), web (iba Next.js a WebSocket) alebo tasks (iba spúšťač úloh)",
          options: {
            all: "Všetko (predvolené)",
            web: "Iba web (Next.js a WebSocket)",
            tasks: "Iba úlohy (spúšťač cron)",
          },
        },
        seed: {
          title: "Vložiť počiatočné dáta",
          description: "Pri štarte vložiť počiatočné dáta do databázy",
        },
        dbSetup: {
          title: "Nastavenie databázy",
          description: "Spustiť nastavenie databázy a migrácie pri štarte",
        },
        taskRunner: {
          title: "Spúšťač úloh",
          description: "Spustiť systém na vykonávanie úloh",
        },
        nextServer: {
          title: "Server Next.js",
          description: "Spustiť server Next.js",
        },
        port: {
          title: "Port",
          description: "Číslo portu servera",
        },
        profile: {
          title: "Profil",
          description:
            "Zapne profilovanie produkčného servera Next.js nastavením NEXT_CPU_PROF=1. Pri ukončení zapíše .cpuprofile.",
        },
        framework: {
          title: "Rámec",
          description: "Frontendový framework a nástroj, ktorý sa má spustiť",
        },
        skipTaskRunner: {
          title: "Nespúšťať spúšťač úloh",
          description: "Nespúšťať spúšťač úloh",
        },
        success: {
          title: "Úspech",
        },
        serverStarted: {
          title: "Server spustený",
        },
        output: {
          title: "Výstup",
        },
        serverInfo: {
          title: "Informácie o serveri",
        },
      },
      errors: {
        unauthorized: {
          title: "Bez oprávnenia",
          description: "Vyžaduje sa prihlásenie",
        },
        validation: {
          title: "Chyba overenia údajov",
          description: "Neplatné parametre požiadavky",
        },
        server: {
          title: "Chyba servera",
          description: "Nastala interná chyba servera",
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
          title: "Prístup zamietnutý",
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
        tanstackBuildNotFound:
          "Zostavenie TanStack Start sa nenašlo. Bol spustený príkaz vibe build --tanstack?",
        tanstackServerExited: "Server TanStack Start sa hneď ukončil",
        nextBuildNotFound:
          "Zostavenie .next-prod sa nenašlo. Bol spustený príkaz vibe build?",
        startFailed: "Zlyhalo spustenie servera",
      },
      success: {
        title: "Úspech",
        description: "Operácia úspešne dokončená",
      },
      repository: {
        messages: {
          startingServer: "🚀 Spúšťa sa produkčný server…",
          environment: "✅ Prostredie: ",
          runningPreTasks: "Vykonávajú sa prípravné úlohy…",
          runningMigrations: "Spúšťajú sa migrácie databázy…",
          migrationsCompleted: "✅ Migrácie databázy sú dokončené",
          failedMigrations: "Nepodarilo sa spustiť migrácie",
          seedingDatabase: "Vkladajú sa počiatočné dáta do databázy…",
          seedingCompleted: "✅ Počiatočné dáta boli vložené do databázy",
          failedSeeding: "Nepodarilo sa vložiť počiatočné dáta do databázy",
          startingTaskRunner:
            "Spúšťa sa systém na vykonávanie produkčných úloh…",
          failedTaskRunner: "Nepodarilo sa spustiť spúšťač produkčných úloh",
          taskRunnerStarted: "✅ Spúšťač produkčných úloh je aktívny. Počet: ",
          taskRunnerStartedSuffix: " (úlohy)",
          taskRunnerSkipped:
            "Spúšťač produkčných úloh sa preskočil (parameter --skip-task-runner)",
          skipNextStart:
            "Spustenie Next.js sa preskakuje. Zabezpečí ho package.json.",
          serverWillStart: "Produkčný server spustí package.json",
          serverAvailable: "Server bude k dispozícii na http://localhost:",
          startupPrepared: "✅ Produkčný server je pripravený na spustenie",
          failedStart: "❌ Nepodarilo sa spustiť produkčný server: ",
          gracefulShutdown:
            "Vyžiadalo sa riadne ukončenie spúšťača produkčných úloh",
        },
      },
    },
  },
};
