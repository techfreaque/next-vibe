import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  executeTool: {
    post: {
      title: "Spustiť nástroj",
      titleShort: "Spustiť nástroj",
      dynamicTitle: "Spustiť {{toolName}}",
      description:
        "Spustí registrovaný koncový bod podľa názvu nástroja a jeho vstupných parametrov. Cieľový koncový bod overuje prístup podľa vlastných pravidiel. Tento koncový bod sprostredkuje volania z MCP, agentov AI a automatizácií.",
      container: {
        title: "Spustenie nástroja",
        description: "Názov trasy a vstupné parametre",
      },
      fields: {
        toolName: {
          label: "Názov nástroja",
          description:
            "Názov alebo alias registrovaného nástroja, napríklad vibe_agent_skills_GET. Dostupné nástroje zobrazíte pomocou tool-help.",
          placeholder: "vibe_agent_skills_GET",
        },
        input: {
          label: "Vstup",
          description:
            "Vstupné parametre nástroja ako objekt JSON. Parametre cesty URL, napríklad id, sa z objektu načítajú automaticky.",
        },
        instanceId: {
          label: "ID inštancie",
          description:
            'Nepovinné ID vzdialenej inštancie. Ak ho zadáte, na vzdialenej inštancii sa vytvorí asynchrónna úloha. Výsledok bude {taskId, status:"pending"}.',
        },
        callbackMode: {
          label: "Režim spätného volania",
          description:
            "'wait': vykoná nástroj synchrónne a vráti výsledok priamo (predvolené). 'detach': spustí nástroj na pozadí a hneď vráti {taskId}. Neskôr môžete použiť await-task. 'wakeUp': spustí nástroj na pozadí a keď je výsledok hotový, automaticky ho vloží do vlákna. Pri tomto režime nevolajte await-task. 'endLoop': vykoná nástroj a vráti výsledok, no po tejto dávke zastaví cyklus nástrojov. Ďalšie volania v tomto kroku nespustí, súbežné volania v rovnakej dávke však dobehnú. 'approve': pred vykonaním počká na potvrdenie používateľa.",
        },
      },
      response: {
        result:
          "Výsledok z cieľového koncového bodu. Pri zlyhaní pole chýba a odpoveď obsahuje chybu.",
        resultLabel: "Výsledok",
      },
      errors: {
        validation: {
          title: "Chyba overenia údajov",
          description: "Neplatný názov toolName alebo vstupné parametre",
        },
        unauthorized: {
          title: "Bez oprávnenia",
          description: "Volanie tohto koncového bodu vyžaduje prihlásenie",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Prístup zamietnutý",
        },
        toolDeniedHere: {
          title:
            "Nástroj {{toolName}} nie je v tomto vlákne dostupný. Dostupné nástroje zo svojho zoznamu volaj priamo.",
        },
        emptyInput: {
          title:
            '{{error}} Volanie neobsahovalo pole input. Argumenty pre {{toolName}} patria do input: {"toolName": "{{toolName}}", "input": { ... }}.',
        },
        notFound: {
          title: "Nástroj sa nenašiel",
          description:
            "Zadanému toolName nezodpovedá žiadny zaregistrovaný nástroj",
          // `title` is the definition's declared NOT_FOUND label and renders
          // param-free there, so the tool name gets its own key.
          detail:
            "Nástroj „{{toolName}}“ sa nenašiel. Volanie neopakujte. Dostupné nástroje zobrazíte pomocou tool-help.",
        },
        remoteFailed: {
          title: "Vzdialený nástroj zlyhal: {{message}}",
          description:
            "Vzdialená inštancia volanie odmietla alebo ho nedokázala vykonať",
          detail: "Vzdialený nástroj „{{toolName}}“ zlyhal: {{message}}",
        },
        resultChannelLost: {
          detail:
            "Na adrese {{hubUrl}} nebeží server, ktorý by prijal výsledok nástroja „{{toolName}}“ z inštancie {{instanceId}} ({{detail}}). Spustite ho príkazom `vibe dev` alebo pre Hermes `vibe --hermes dev` a skúste znova.",
        },
        server: {
          title: "Chyba pri vykonávaní",
          description: "Cieľový koncový bod vrátil chybu servera",
        },
        network: {
          title: "Chyba siete",
          description: "Chyba siete pri vykonávaní nástroja",
        },
        unknown: {
          // `title` is a declared errorTypes label and renders param-free, so
          // the cause lives in `detail` instead.
          title: "Neznáma chyba",
          description: "Počas realizácie došlo k neočakávanej chybe",
          detail: "Neznáma chyba počas realizácie: {{error}}",
        },
      },
      success: {
        title: "Nástroj bol vykonaný",
        description: "Nástroj bol úspešne spustený",
      },
      widget: {
        enterToolName: "Zadajte názov nástroja a načítajte jeho formulár.",
        resolving: "Vyhľadáva sa koncový bod…",
        unknownTool: "Neznámy nástroj: {{toolName}}",
      },
      actions: {
        confirm: "Potvrdiť",
        cancel: "Zrušiť",
      },
    },
  },
  dismissTask: {
    post: {
      title: "Prestať čakať na úlohu",
      titleShort: "Zavrieť",
      description:
        "Zruší čakajúce obnovenie wakeUp. Nástroj ďalej beží na pozadí a vlákno sa ihneď odblokuje. Po dokončení sa výsledok zahodí bez upozornenia.",
      errors: {
        validation: {
          title: "Chyba overenia údajov",
          description: "Pole callId je povinné",
        },
        unauthorized: {
          title: "Bez oprávnenia",
          description: "Vyžaduje sa prihlásenie",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Prístup zamietnutý",
        },
        notFound: {
          title: "Nenájdené",
          description: "Pre toto callId sa nenašlo čakajúce volanie",
        },
        server: {
          title: "Chyba servera",
          description: "Nepodarilo sa ukončiť čakanie na volanie",
        },
        network: {
          title: "Chyba siete",
          description: "Chyba siete pri ukončovaní čakania na úlohu",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
      },
      success: {
        title: "Čakanie na úlohu ukončené",
        description: "Vlákno je odblokované. Nástroj pokračuje na pozadí.",
      },
    },
  },
  cancelTool: {
    post: {
      title: "Zrušiť volanie nástroja",
      titleShort: "Zrušiť nástroj",
      description:
        "Preruší jedno prebiehajúce volanie nástroja podľa callId. Výsledkom volania bude chyba. Krok a ostatné súbežné volania pokračujú.",
      errors: {
        validation: {
          title: "Chyba overenia údajov",
          description: "Pole callId je povinné",
        },
        unauthorized: {
          title: "Bez oprávnenia",
          description: "Vyžaduje sa prihlásenie",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Prístup zamietnutý",
        },
        notFound: {
          title: "Nenájdené",
          description: "Pre toto callId sa nenašlo prebiehajúce volanie",
        },
        server: {
          title: "Chyba servera",
          description: "Nepodarilo sa zrušiť volanie nástroja",
        },
        network: {
          title: "Chyba siete",
          description: "Chyba siete pri zrušení",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
      },
      success: {
        title: "Volanie nástroja sa zrušilo",
        description: "Prebiehajúce volanie nástroja sa prerušilo.",
      },
    },
  },
  detachCall: {
    post: {
      title: "Odpojiť volanie nástroja",
      titleShort: "Odpojiť volanie",
      description:
        "Odpojí prebiehajúce volanie nástroja podľa callId. Volanie sa dokončí na pozadí, jeho výsledok sa zahodí a aktuálny krok môže hneď pokračovať. Ak potrebujete výsledok, použite resume-when-done.",
      errors: {
        validation: {
          title: "Chyba overenia údajov",
          description: "Pole callId je povinné",
        },
        unauthorized: {
          title: "Bez oprávnenia",
          description: "Vyžaduje sa prihlásenie",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Prístup zamietnutý",
        },
        notFound: {
          title: "Nenájdené",
          description: "Pre toto callId sa nenašlo prebiehajúce volanie",
        },
        server: {
          title: "Chyba servera",
          description: "Nepodarilo sa odpojiť volanie nástroja",
        },
        network: {
          title: "Chyba siete",
          description: "Chyba siete pri odpojení",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
      },
      success: {
        title: "Volanie nástroja pokračuje na pozadí",
        description: "Volanie pokračuje na pozadí a jeho výsledok sa zahodí.",
      },
    },
  },
  resumeWhenDone: {
    post: {
      title: "Presunúť volanie nástroja na pozadie",
      titleShort: "Spustiť na pozadí",
      description:
        "Podľa callId nechá prebiehajúce volanie dokončiť na pozadí. Aktuálny krok sa ukončí. Keď je výsledok pripravený, vlákno sa obnoví aj s výsledkom.",
      errors: {
        validation: {
          title: "Chyba overenia údajov",
          description: "Pole callId je povinné",
        },
        unauthorized: {
          title: "Bez oprávnenia",
          description: "Vyžaduje sa prihlásenie",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Prístup zamietnutý",
        },
        notFound: {
          title: "Nenájdené",
          description: "Pre toto callId sa nenašlo prebiehajúce volanie",
        },
        server: {
          title: "Chyba servera",
          description: "Nepodarilo sa presunúť volanie nástroja na pozadie",
        },
        network: {
          title: "Chyba siete",
          description: "Chyba siete pri presúvaní volania na pozadie",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
      },
      success: {
        title: "Volanie nástroja presunuté na pozadie",
        description: "Volanie nástroja pokračuje v pozadí.",
      },
    },
  },
  tools: {
    // Translations moved to system/help/get - see system/help/i18n/en/index.ts
    get: {
      title: "Pomocník pre dostupné nástroje",
      description:
        "Vyhľadajte dostupné nástroje AI. Parameter query vyhľadáva podľa názvu, opisu alebo aliasu. Parametrom category obmedzíte výsledky na kategóriu. Výstup obsahuje názvy, opisy, aliasy a metadáta nástrojov.",
      category: "Nástroje AI",
      tags: {
        tools: "nástroje",
      },
    },
  },
  executor: {
    errors: {
      toolNotFound: "Nástroj sa nenašiel: {{toolName}}",
      parameterValidationFailed: "Overenie parametrov zlyhalo: {{errors}}",
      executionFailed: "Spustenie nástroja zlyhalo",
    },
  },
  factory: {
    errors: {
      executionFailed: "Spustenie nástroja zlyhalo",
    },
    descriptions: {
      noParametersRequired: "Tento koncový bod nevyžaduje parametre",
    },
  },
  converter: {
    constants: {
      examplePrefix: "\n\nPríklad: ",
      underscore: "_",
      dollarOne: "$1",
      dollarTwo: "$2",
      space: "  ",
      endpointForPrefix: "Koncový bod pre ",
      hiddenPlaceholder: "[Skryté]",
    },
  },
  discovery: {
    constants: {
      underscore: "_",
      dollarOne: "$1",
      dollarTwo: "$2",
    },
  },
  registry: {
    errors: {
      initializationFailed: "Inicializácia registra nástrojov zlyhala",
    },
  },
};
