import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  setup: {
    install: {
      post: {
        title: "Inštalovať",
        description: "Koncový bod na inštaláciu",
        form: {
          title: "Nastavenia inštalácie",
          description: "Nastaviť parametre inštalácie",
        },
        response: {
          title: "Odpoveď",
          description: "Výsledok inštalácie",
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
    status: {
      post: {
        title: "Stav inštalácie CLI",
        description: "Skontrolujte aktuálny stav inštalácie Vibe CLI",
        form: {
          title: "Nastavenie stavu",
          description: "Nastaviť parametre stavu",
        },
        response: {
          title: "Stav inštalácie",
          description: "Aktuálne údaje o inštalácii CLI",
          fields: {
            success: "Stav operácie",
            installed: "Inštalované",
            version: "Verzia CLI",
            path: "Cesta inštalácie",
            message: "Správa o stave",
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
    uninstall: {
      post: {
        title: "Odinštalovať",
        description: "Koncový bod na odinštalovanie",
        form: {
          title: "Nastavenia odinštalovania",
          description: "Nastaviť parametre odinštalovania",
        },
        response: {
          title: "Odpoveď",
          description: "Výsledok odinštalovania",
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
    update: {
      post: {
        title: "Aktualizovať",
        description: "Koncový bod na aktualizáciu",
        form: {
          title: "Nastavenia aktualizácie",
          description: "Nastaviť parametre aktualizácie",
        },
        response: {
          title: "Odpoveď",
          description: "Výsledok aktualizácie",
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
  },
  request: "Požiadavka",
  response: {
    success: "Odpoveď",
    error: "Chyba",
  },
  auth: {
    errors: {
      userNotFound:
        "Používateľ CLI s e-mailovou adresou {{email}} sa v databáze nenašiel. Najprv spustite vibe seed.",
      databaseError: "Chyba databázy pri načítavaní používateľa CLI: {{error}}",
      authNotAvailable: "Overenie nie je k dispozícii",
    },
  },
  vibe: {
    noFields: "Žiadne polia na zobrazenie",
    startingUp: "Spúšťa sa Vibe CLI…",
    executeCommand: "Spustenie príkazu",
    executing: "Vykonávanie",
    listCommands: "Zoznam všetkých dostupných príkazov",
    output: "Formát výstupu",
    utils: {
      debug: {
        executionSummary:
          "Vykonanie: {{executionSeconds}} s | Réžia: {{overheadSeconds}} s | Spolu: {{totalSeconds}} s",
      },
    },
    help: {
      title: "Pomocník Vibe CLI",
      description: "Vibe CLI na spúšťanie operácií API",
      usage: "Použitie: vibe <command> [možnosti]",
      commands: "Dostupné príkazy",
      options: "Možnosti",
      examples: "Príklady",
      locale:
        "Zadajte kód jazyka a regiónu (napr. en-GLOBAL, de-DE, pl-PL, sk-SK)",
      verbose: "Zapnúť podrobný výstup",
      target:
        "Cieľ vykonania: dev (predvolené) alebo local (databáza náhľadu s --hermes)",
      thea: "Skratka pre --remote, ktorá cieli na inštanciu thea",
      remote:
        "Spustiť na vzdialenej inštancii podľa ID (predvolené: thea). Pripojenie sa vyhľadá v aktívnej databáze.",
      interactive: "Prejsť do interaktívneho režimu",
    },
    errors: {
      routeNotFound: "Nástroj sa nenašiel: {{toolName}}",
      executionFailed: "Vykonanie zlyhalo",
      executionFailedDetail: "Vykonanie zlyhalo: {{error}}",
      unknownError: "Nastala neznáma chyba",
      publicPayloadNotSupported:
        "Obsah tokenu pre neprihláseného používateľa nie je podporovaný",
      invalidTokenPayload: "Dáta tokenu sú neplatné.",
      invalidToken: "Neplatný token",
      signingFailed: "Podpisovanie tokenu zlyhalo",
      userNotFound: "Používateľ sa nenašiel.",
      authenticationFailed: "Overenie zlyhalo",
      invalidFormat: "Neplatný formát relácie",
      sessionExpired: "Platnosť relácie vypršala",
      notFound: "Relácia sa nenašla.",
      readFailed: "Nepodarilo sa načítať reláciu",
      invalidData: "Neplatné údaje relácie",
      writeFailed: "Nepodarilo sa zapísať reláciu: {{error}}",
      deleteFailed: "Nepodarilo sa odstrániť reláciu: {{error}}",
      storeFailed: "Nepodarilo sa uložiť reláciu: {{error}}",
      clearFailed: "Nepodarilo sa vymazať údaje relácie: {{error}}",
      setLeadIdCookieFailed:
        "Nepodarilo sa nastaviť súbor cookie s ID kontaktu",
      remoteNoToken: "Vzdialená relácia nemá aktívny token",
      remoteExpired: "Platnosť vzdialenej relácie vypršala",
      remoteNotFound:
        "Vzdialená relácia sa nenašla. Spustite vibe login --target remote.",
      remoteReadFailed: "Nepodarilo sa načítať vzdialenú reláciu",
      remoteWriteFailed: "Nepodarilo sa zapísať vzdialenú reláciu",
      remoteClearFailed: "Nepodarilo sa vymazať vzdialenú reláciu",
      remoteNoConnection:
        "Inštancia {{instanceId}} nemá aktívne pripojenie. Spustite vibe connect <url>.",
      remoteNotLoggedIn:
        "Nie ste prihlásení na vzdialenom hostiteľovi. Spustite vibe --remote login.",
      remoteNoLeadId: "Nepodarilo sa získať identitu od vzdialeného hostiteľa",
      remoteServerError: "Chyba vzdialeného servera",
      remoteNotAvailable: "Toto zostavenie nepodporuje vzdialené vykonávanie",
    },
    endpoints: {
      endpointHandler: {
        error: {
          form_validation_failed: "Overenie údajov formulára zlyhalo",
          unauthorized: "Neautorizovaný prístup",
          errors: {
            unknown_validation_error: "Neznáma chyba overenia údajov",
            invalid_request_data: "Neplatné údaje požiadavky",
            invalid_url_parameters: "Neplatné parametre URL",
          },
          general: {
            internal_server_error: "Interná chyba servera",
          },
        },
      },
      renderers: {
        cliUi: {
          helpHandler: {
            noDescription: "Opis nie je k dispozícii",
            flagDataDesc: "Zadať údaje požiadavky vo formáte JSON",
            flagUserTypeDesc: "Zadať typ používateľa (admin, customer, public)",
            flagLocaleDesc:
              "Zadajte kód jazyka a regiónu (napr. en-GLOBAL, de-DE, pl-PL, sk-SK)",
            flagOutputDesc: "Formát výstupu (pretty, json)",
            flagVerboseDesc: "Zapnúť podrobný výstup",
            flagDryRunDesc: "Vykonať skúšobné spustenie bez vykonania príkazu",
            usageLabel: "Použitie",
            availableCommandsLabel: "Dostupné príkazy",
            globalOptionsLabel: "Globálne možnosti",
            examplesLabel: "Príklady",
          },
          noEndpoint:
            "Táto funkcia ešte nie je k dispozícii. Prosím, skúste to neskôr",
          widgets: {
            common: {
              noDataAvailable: "Nie sú dostupné žiadne údaje",
              noIssuesFound: "Nenašli sa žiadne problémy",
              invalidDataFormat: "Neplatný formát údajov",
              invalidFormType:
                "Kontext neobsahuje stav formulára Ink. Interaktívny vstup sa nedá zobraziť.",
              info: "Info",
              items: "položky",
              andMoreItems: "Ďalšie položky: {{count}}",
              affectedFiles: "Dotknuté súbory",
              summary: "Zhrnutie",
              files: "Súbory",
              issues: "Problémy",
              other: "Iné",
              error: "Chyba",
              errors: "Chyby",
              warning: "Upozornenie",
              warnings: "Upozornenia",
              hints: {
                spaceToToggle: "(medzerníkom prepnete)",
                arrowsToChange: "(šípkami ←/→ zmeníte hodnotu)",
                dollarPrompt: "$ ",
                executing: "Vykonáva sa…",
                tabNextField:
                  "Tab: ďalšie pole | Enter: odoslať | q/Esc: ukončiť",
                ctrlCExitHint: "Stlačte Ctrl+C znovu na ukončenie",
                escExitHint: "Stlačte Esc znovu pre ukončenie",
              },
            },
            pagination: {
              notImplemented:
                "CLI nepodporuje stránkovanie. Výsledky môžete zúžiť filtrami.",
            },
          },
        },
      },
    },
    interactive: {
      welcome: "Vitajte v interaktívnom režime Vibe",
      goodbye: "Dovidenia!",
      help: {
        selectCategory: "Vyberte kategóriu pre prehľadávanie nástrojov",
        selectTool: "Vyberte nástroj na zobrazenie detailov",
        category: "Kategória  ",
        method: "Metóda  ",
        credits: "Kredity  ",
        callAs: "Volajte ako   ",
        fields: "Polia",
        hintsNavSelect: "Šípky: pohyb | Enter: vybrať | q: ukončiť",
        hintsNavSelectBack:
          "Šípky: pohyb | Enter: vybrať | Esc: späť | q: ukončiť",
        hintsExecuteBack: "Enter: spustiť | Esc: späť | q: ukončiť",
        hintsBack: "Enter/Esc: späť | q: ukončiť",
        success: "Úspech",
        error: "Chyba",
        result: "Výsledok",
      },
      navigation: {
        rootName: "Koreň",
        directoryIcon: "📁",
        upIcon: "⬆️",
        goUp: "Hore",
        routeIcon: "🔗",
        routes: "Trasy",
        settingsIcon: "⚙️",
        settings: "Nastavenia",
        exitIcon: "🚪",
        exit: "Ukončiť",
        navigate: "Navigovať",
        route: "Cesta",
        method: "Metóda",
        description: "Opis",
        noDefinition: "Definícia sa nenašla",
        executionFailed: "Vykonanie zlyhalo",
        executeAnother: "Spustiť ďalšie",
        selectLocale: "Vyberte jazyk a región",
        englishGlobal: "Angličtina (globálne)",
        requestData: "Údaje požiadavky",
        urlParameters: "Parametre URL",
        preview: "Náhľad",
        executeWithParams: "Spustiť s parametrami",
        navigationError: "Chyba navigácie",
        chooseSettingToModify: "Zvoliť nastavenie pre úpravu",
        outputFormatCurrent: "Formát výstupu (aktuálny",
        verboseModeCurrent: "Podrobný výstup (aktuálne",
        localeCurrent: "Jazyk a región (aktuálne",
        backToMainMenu: "Späť do hlavnej ponuky",
        chooseOutputFormat: "Vyberte výstupný formát",
        prettyFormatted: "Čitateľný formát",
        jsonRaw: "Nespracovaný JSON",
        enableVerboseOutput: "Zapnúť podrobný výstup",
        chooseLocale: "Vyberte jazyk a región",
        german: "Nemčina",
        polish: "Poľština",
        settingUpdated: "Nastavenie bolo uložené",
        viewAllRoutes: "Zobraziť všetky trasy",
        selectRoute: "Vyberte trasu, ktorú chcete spustiť",
        backToNavigation: "Späť do navigácie",
      },
    },
  },
};
