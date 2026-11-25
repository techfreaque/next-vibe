import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Dohľad nad úlohami",
  tags: {
    taskWatchdog: "task-watchdog",
    vibeSense: "vibe-sense",
    budget: "rozpočet",
  },
  enums: {
    incidentType: {
      all: "Všetky incidenty",
      timeout: "Časový limit",
      loop: "Slučka",
      budget: "Rozpočet",
      transientRetryExhausted: "Vyčerpali sa opakované pokusy",
      watchdogCancel: "Zrušené dohľadom",
    },
    budgetScope: {
      task: "Na jedno spustenie úlohy",
      day: "Denne (všetky úlohy)",
      goal: "Na jeden cieľ za deň",
    },
    spendKind: {
      model: "Krok modelu",
      tool: "Volanie nástroja",
    },
    healthMetric: {
      started: "Spustené úlohy",
      completed: "Dokončené úlohy",
      failed: "Neúspešné úlohy",
      watchdogCancelled: "Úlohy zrušené dohľadom",
      avgDuration: "Priemerná doba trvania (sekundy)",
      p95Duration: "95. percentil trvania (sekundy)",
      creditSpend: "Kredity spotrebované úlohami",
      incidents: "Incidenty",
    },
  },
  sweep: {
    post: {
      title: "Kontrola úloh na pozadí",
      titleShort: "Kontrola úloh",
      description:
        "Každú minútu vyhľadá zaseknuté, opakujúce sa a osirotené úlohy na pozadí. Zastaví ich, zaznamená dôvod a otvorí incident.",
      container: {
        title: "Výsledok kontroly",
        description: "Čo kontrola zistila a aké kroky vykonala",
      },
      response: {
        checked: "Skontrolované prebiehajúce úlohy",
        cancelled: "Zrušené pre prekročenie limitu",
        orphaned: "Obnovené spustenia bez aktívneho procesu",
        loops: "Vypnuté úlohy uviaznuté v slučke",
        incidents: "Otvorené incidenty",
      },
    },
    task: {
      description:
        "Zastaví úlohy, ktoré prekročili časový limit, uviazli v slučke alebo stratili svoj proces. Pri každom zastavení sa otvorí incident.",
    },
  },
  health: {
    get: {
      title: "Stav úloh",
      titleShort: "Stav úloh",
      description:
        "Prebiehajúce úlohy s časom od spustenia, počtom krokov a spotrebou kreditov. Zobrazia sa aj nedávne zlyhania a otvorené incidenty. Úlohu tu môžete zrušiť.",
      response: {
        running: "Prebiehajúce úlohy",
        failures: "Nedávne zlyhania",
        incidents: "Otvorené incidenty",
        daySpent: "Dnes spotrebované kredity",
        dayCap: "Denný limit",
      },
      widget: {
        title: "Stav úloh",
        subtitle: "Sleduje každé spustenie. Zaseknuté úlohy zastaví.",
        refresh: "Obnoviť",
        loading: "Načítava sa stav úloh…",
        spendToday: "Dnešná spotreba kreditov úlohami: {{spent}} z {{cap}}",
        running: {
          title: "Beží teraz",
          empty: "Žiadna úloha práve neprebieha.",
        },
        failures: {
          title: "Nedávne zlyhania",
          empty: "Za posledných 24 hodín žiadne zlyhania.",
        },
        incidents: {
          title: "Otvorené incidenty",
          empty: "Žiadne otvorené incidenty.",
        },
        age: "Čas od spustenia",
        turns: "Kroky",
        toolCalls: "Volania nástrojov",
        spend: "Spotrebované",
        goal: "Cieľ {{goal}}",
        limit: "limit {{limit}}",
        lastError: "Posledná chyba",
        noError: "Chyba nebola zaznamenaná",
        cancel: "Zrušiť",
        cancelling: "Ruší sa…",
        resolve: "Vyriešiť",
        credits: "{{amount}} kred.",
      },
    },
  },
  cancel: {
    post: {
      title: "Zrušiť úlohu",
      titleShort: "Zrušiť úlohu",
      description:
        "Zastaví úlohu aj jej cyklus AI a zaznamená zrušenie. Prípadne označí incident za vyriešený.",
      fields: {
        taskId: {
          label: "ID úlohy",
          description: "Prebiehajúca úloha, ktorá sa má zastaviť",
          placeholder: "ID úlohy",
        },
        incidentId: {
          label: "ID incidentu",
          description: "Incident, ktorý sa má označiť za vyriešený",
        },
      },
      response: {
        cancelled: "Úloha zrušená",
        resolved: "Incident vyriešený",
      },
    },
  },
  budgetCaps: {
    get: {
      title: "Limity rozpočtu úloh",
      titleShort: "Limity rozpočtu",
      description:
        "Limity spotreby kreditov pre úlohy na pozadí. Platia na jedno spustenie úlohy, na deň alebo na cieľ.",
      response: {
        rows: "Limity",
        daySpent: "Dnes spotrebované kredity",
      },
      widget: {
        title: "Limity rozpočtu úloh",
        subtitle:
          "Úloha sa riadne zastaví, keď dosiahne limit. Denný limit je pevný strop pre všetky spustenia bez dohľadu.",
        refresh: "Obnoviť",
        add: "Nastaviť limit",
        loading: "Načítavajú sa limity…",
        empty: {
          title: "Žiadne vlastné limity",
          hint: "Platia predvolené limity. 100 kreditov na jedno spustenie úlohy, 1 000 za deň a 500 na jeden cieľ.",
          cta: "Nastaviť prvý limit",
        },
        spentToday: "Dnešná spotreba kreditov: {{spent}}",
        enabled: "Aktívny",
        disabled: "Vypnuté",
        credits: "Kredity: {{amount}}",
        none: "žiadny",
      },
    },
    post: {
      title: "Nastaviť limit rozpočtu úlohy",
      titleShort: "Nastaviť limit",
      description:
        "Vytvorí alebo upraví limit kreditov. Pre každú kombináciu rozsahu a kľúča môže existovať jeden limit. Kľúč * určuje predvolený limit pre všetky úlohy.",
      fields: {
        scope: {
          label: "Rozsah",
          description: "Na čo sa limit vzťahuje",
        },
        key: {
          label: "Kľúč",
          description:
            "Pre úlohu zadaj jej ID alebo *. Pre denný limit použi global. Pre cieľ zadaj názov cieľa alebo * podľa štítka úlohy goal:<name>.",
          placeholder: "*",
        },
        maxCredits: {
          label: "Limit kreditov",
          description:
            "Úloha sa zastaví po dosiahnutí alebo prekročení limitu. Hodnota 0 spustenie zablokuje.",
        },
        enabled: {
          label: "Aktívny",
          description: "Po vypnutí záznam zostane, ale limit sa neuplatní.",
        },
        note: {
          label: "Poznámka",
          description: "Dôvod nastavenia limitu",
          placeholder: "Noční výskumní agenti",
        },
      },
      response: {
        id: "ID limitu",
      },
      widget: {
        back: "Späť",
        hint: "Po dosiahnutí limitu spotreby sa úloha zastaví. Denný limit platí vždy.",
      },
    },
  },
  dataSources: {
    fields: {
      resolution: {
        label: "Rozlíšenie",
        description: "Dĺžka časového intervalu",
      },
      range: { label: "Rozsah", description: "Časový rozsah dotazu" },
      lookback: {
        label: "Rozsah histórie",
        description:
          "Počet intervalov, ktoré sa majú zahrnúť pred začiatkom rozsahu",
      },
      meta: { label: "Metadáta", description: "Metadáta o spustení uzla" },
      metric: {
        label: "Metrika",
        description:
          "Počet spustených, dokončených, neúspešných alebo dohľadom zrušených úloh, trvanie, spotreba kreditov alebo incidenty",
      },
      incidentType: {
        label: "Typ incidentu",
        description:
          "Platí iba pre metriku incidentov. Predvolene sa zahrnú všetky typy.",
      },
    },
    taskHealth: {
      post: {
        title: "Stav úloh",
        titleShort: "Stav úloh",
        description:
          "Spustenia úloh na pozadí, trvanie, spotreba kreditov a incidenty dohľadu za každý časový interval",
        fields: {
          result: {
            label: "Hodnota",
            description: "Hodnota metriky za každý časový interval",
          },
        },
      },
    },
  },
  errors: {
    validation: {
      title: "Neplatný vstup",
      description: "Skontrolujte zvýraznené polia",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Prihláste sa ako správca",
    },
    forbidden: {
      title: "Iba pre správcov",
      description: "Nástroje na dohľad nad úlohami vyžadujú rolu správcu.",
    },
    notFound: {
      title: "Nenašlo sa",
      description: "Táto úloha alebo incident neexistuje",
    },
    conflict: {
      title: "Konflikt",
      description:
        "Záznam sa medzitým zmenil. Načítajte ho znova a zopakujte akciu.",
    },
    server: {
      title: "Chyba servera",
      description: "Požiadavku sa nepodarilo dokončiť",
    },
    network: {
      title: "Chyba siete",
      description: "Požiadavka sa nedostala na server",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Nastala neočakávaná chyba",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Najprv zmeny uložte alebo zahoďte.",
    },
    nothingToDo:
      "Zadajte ID úlohy na zrušenie alebo ID incidentu na označenie za vyriešený",
    taskNotRunning: "Úloha {{taskId}} nebeží",
    incidentNotFound: "Incident {{incidentId}} neexistuje",
    invalidCap: "Limit vyžaduje nezápornú hodnotu a kľúč.",
  },
  success: {
    title: "Hotovo",
    description: "Uložené",
  },
};
