import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Správa kampaní",
  tag: "Spúšťanie kampaní",
  task: {
    description: "Spustí kampane pre nové kontakty zmenou ich stavu na PENDING",
  },
  errors: {
    server: {
      title: "Chyba servera",
      description:
        "Pri spracovaní požiadavky na spustenie kampaní nastala chyba",
    },
    invalidTransition: "Kampaň sa nedá spustiť pre neplatný prechod stavu",
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Vyžaduje sa prihlásenie",
    },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Prístup zamietnutý",
    },
    validation: {
      title: "Neplatné údaje",
      description: "Neplatné parametre požiadavky",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Vyskytla sa neznáma chyba",
    },
    network: {
      title: "Chyba siete",
      description: "Vyskytla sa chyba siete",
    },
    notFound: {
      title: "Nenašlo sa",
      description: "Zdroj sa nenašiel",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Máte neuložené zmeny",
    },
    conflict: {
      title: "Konflikt údajov",
      description: "Vyskytol sa konflikt údajov",
    },
  },
  post: {
    title: "Spúšťanie kampaní",
    titleShort: "Spustiť kampaň",
    description: "Spustí kampane pre nové kontakty",
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zamietnutý",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Neplatné parametre požiadavky",
      },
      server: {
        title: "Chyba servera",
        description: "Nastala chyba pri spustení kampaní",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neznáma chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Vyskytla sa chyba siete",
      },
      notFound: { title: "Nenašlo sa", description: "Zdroj sa nenašiel" },
      conflict: {
        title: "Konflikt údajov",
        description: "Vyskytol sa konflikt údajov",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    fields: {
      timezone: {
        label: "Časové pásmo",
        description: "Časové pásmo prehliadača na prepočet hodín",
      },
      dryRun: {
        label: "Skúšobný režim",
        description: "Spustiť bez vykonania zmien",
      },
      force: {
        label: "Spustiť mimo plánu",
        description: "Obíde obmedzenia plánovaných dní a hodín",
      },
    },
    response: {
      leadsProcessed: "Spracované kontakty",
      leadsStarted: "Kontakty so spustenou kampaňou",
      leadsSkipped: "Kontakty preskočené",
      executionTimeMs: "Čas vykonania (ms)",
      errors: "Chyby",
      quotaDetails: "Podrobnosti o kvóte",
    },
    success: {
      title: "Spustenie kampaní dokončené",
      description: "Kampane sa úspešne spustili",
    },
  },
  get: {
    title: "Získať nastavenia spúšťania kampaní",
    titleShort: "Nastavenia kampaní",
    description: "Načíta nastavenia spúšťania kampaní",
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zamietnutý",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Neplatné parametre požiadavky",
      },
      server: {
        title: "Chyba servera",
        description: "Vyskytla sa interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neznáma chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Vyskytla sa chyba siete",
      },
      notFound: { title: "Nenašlo sa", description: "Zdroj sa nenašiel" },
      conflict: {
        title: "Konflikt údajov",
        description: "Vyskytol sa konflikt údajov",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    fields: {
      timezone: {
        label: "Časové pásmo",
        description: "Časové pásmo prehliadača na prepočet hodín",
      },
    },
    response: {
      dryRun: "Skúšobný režim",
      minAgeHours: "Minimálny vek kontaktu (hodiny)",
      enabledDays: "Povolené dni",
      enabledHours: "Povolené hodiny",
      localeConfig: "Nastavenia podľa jazyka a regiónu",
      leadsPerWeek: "Kontakty za týždeň",
      schedule: "Harmonogram",
      enabled: "Zapnuté",
      priority: "Priorita",
      timeout: "Časový limit",
      retries: "Opakované pokusy",
      retryDelay: "Oneskorenie opakovania",
    },
    success: {
      title: "Nastavenia načítané",
      description: "Nastavenia spúšťania kampaní sa načítali",
    },
  },
  put: {
    title: "Nastavenia spúšťania kampaní",
    description: "Upraviť nastavenia spúšťania kampaní",
    dryRun: {
      label: "Skúšobný režim",
      description: "Zapnúť skúšobný režim",
    },
    minAgeHours: {
      label: "Minimálny vek kontaktu (hodiny)",
      description: "Minimálny vek kontaktu v hodinách pred spracovaním",
    },
    enabledDays: {
      label: "Povolené dni",
      description: "Dni v týždni, v ktorých môžu kampane prebiehať",
      monday: "Pondelok",
      tuesday: "Utorok",
      wednesday: "Streda",
      thursday: "Štvrtok",
      friday: "Piatok",
      saturday: "Sobota",
      sunday: "Nedeľa",
    },
    enabledHours: {
      label: "Povolené hodiny",
      description: "Hodiny, v ktorých môžu kampane prebiehať",
      start: {
        label: "Hodina začiatku",
        description: "Hodina spustenia kampaní (0 až 23)",
      },
      end: {
        label: "Hodina konca",
        description: "Hodina ukončenia kampaní (0 až 23)",
      },
    },
    localeConfig: {
      label: "Nastavenia podľa jazyka a regiónu",
      description:
        "Pre každé jazykové nastavenie: počet kontaktov za týždeň, aktívne dni a hodiny",
    },
    leadsPerWeek: {
      label: "Kontakty za týždeň",
      description: "Najvyšší počet kontaktov na spracovanie za týždeň",
    },
    schedule: {
      label: "Harmonogram",
      description: "Plán spúšťania kampaní",
    },
    enabled: {
      label: "Zapnuté",
      description: "Zapnúť alebo vypnúť automatické spúšťanie kampaní",
    },
    priority: {
      label: "Priorita",
      description: "Priorita spúšťania kampaní",
    },
    timeout: {
      label: "Časový limit",
      description: "Časový limit v milisekundách",
    },
    retries: {
      label: "Opakované pokusy",
      description: "Počet opakovaných pokusov",
    },
    retryDelay: {
      label: "Oneskorenie opakovania",
      description: "Čas medzi pokusmi v milisekundách",
    },
    success: {
      title: "Nastavenia uložené",
      description: "Nastavenia spúšťania kampaní sa uložili",
    },
  },
  priority: {
    critical: "Kritické",
    high: "Vysoká",
    medium: "Stredná",
    low: "Nízka",
    background: "Na pozadí",
    filter: {
      all: "Všetky priority",
      highAndAbove: "Vysoké a vyššie",
      mediumAndAbove: "Stredné a vyššie",
    },
  },
  widget: {
    on: "Zapnuté",
    off: "Vypnuté",
    title: "Spúšťanie kampaní",
    titleSaved: "Uložené nastavenie",
    description: "Spustite kampane pre nové kontakty pripravené na oslovenie.",
    saving: "Ukladajú sa nastavenia…",
    save: "Uložiť nastavenia",
    addLocale: "+ Pridať jazykové nastavenie",
    guidanceTitle: "Nastaviť spúšťanie kampaní",
    guidanceDescription:
      "Nastavte plán, aktívne dni a hodiny, cieľový počet kontaktov za týždeň a parametre úlohy cron.",
    runButton: "Spustiť kampane",
    running: "Prebieha…",
    done: "Hotovo",
    perRunBudget:
      "Kontakty na jedno spustenie: približne {{perRunBudget}} · Spustenia za týždeň: {{totalRunsPerWeek}}",
    perRunBudgetFractional:
      "Kontakty na jedno spustenie: {{exactBudget}} · Spustenia za týždeň: {{totalRunsPerWeek}} (desatinná časť sa prenáša medzi spusteniami)",
    perRunBudgetZeroHint:
      "Zvýšte počet kontaktov za týždeň alebo znížte frekvenciu spúšťania",
    sections: {
      general: "Všeobecné",
      generalDescription: "Zapnutie spúšťania kampaní a skúšobného režimu.",
      schedule: "Harmonogram",
      scheduleDescription:
        "Určte, kedy sa majú kampane spúšťať. Nastavte plán cron, aktívne dni a hodiny.",
      hoursTimezoneNote:
        "Hodiny v časovom pásme prehliadača ({{offset}}). Server ich ukladá v UTC.",
      quotas: "Kvóty",
      quotasDescription:
        "Počet kontaktov na spracovanie za týždeň podľa jazykového nastavenia.",
      advanced: "Pokročilé",
      advancedDescription:
        "Nastavte prioritu úlohy, časové limity a opakované pokusy.",
    },
    days: {
      mon: "Po",
      tue: "Ut",
      wed: "Str",
      thu: "Št",
      fri: "Pi",
      sat: "So",
      sun: "Ne",
    },
  },
};
