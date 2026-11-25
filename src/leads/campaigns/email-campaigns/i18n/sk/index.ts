import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Správa kampaní",
  tag: "E-mailové kampane",
  task: {
    description:
      "Odosielať automatické e-mailové kampane kontaktom podľa fázy a plánu kampane",
  },
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
    notFound: {
      title: "Nenašlo sa",
      description: "Zdroj sa nenašiel",
    },
    conflict: {
      title: "Konflikt údajov",
      description: "Vyskytol sa konflikt údajov",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Máte neuložené zmeny",
    },
  },
  post: {
    title: "E-mailové kampane",
    titleShort: "Odoslať kampane",
    description: "Spracovať e-mailové kampane pre kontakty",
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
      batchSize: {
        label: "Veľkosť dávky",
        description: "Počet kontaktov na spracovanie v jednej dávke",
      },
      maxEmailsPerRun: {
        label: "Limit e-mailov na spustenie",
        description: "Najvyšší počet e-mailov na odoslanie pri jednom spustení",
      },
      dryRun: {
        label: "Skúšobný režim",
        description: "Spustí sa bez odoslania e-mailov",
      },
    },
    response: {
      emailsScheduled: "Naplánované e-maily",
      emailsSent: "Odoslané e-maily",
      emailsFailed: "E-maily, ktoré sa nepodarilo odoslať",
      leadsProcessed: "Spracované kontakty",
    },
    success: {
      title: "Úspech",
      description: "Operácia prebehla úspešne",
    },
  },
  get: {
    title: "Získať nastavenia e-mailových kampaní",
    titleShort: "Nastavenia e-mailových kampaní",
    description: "Načíta nastavenia úlohy e-mailových kampaní na pozadí",
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
    response: {
      enabled: "Zapnuté",
      dryRun: "Skúšobný režim",
      batchSize: "Veľkosť dávky",
      maxEmailsPerRun: "Limit e-mailov na spustenie",
      schedule: "Harmonogram",
      priority: "Priorita",
      timeout: "Časový limit",
      retries: "Opakované pokusy",
      retryDelay: "Oneskorenie opakovania",
    },
    success: {
      title: "Nastavenia načítané",
      description: "Nastavenia e-mailových kampaní sa načítali",
    },
  },
  put: {
    title: "Nastavenia e-mailových kampaní",
    description: "Upraviť nastavenia úlohy e-mailových kampaní na pozadí",
    enabled: {
      label: "Zapnuté",
      description: "Zapnúť alebo vypnúť úlohu e-mailových kampaní na pozadí",
    },
    dryRun: {
      label: "Skúšobný režim",
      description: "Spracuje e-maily bez ich odoslania",
    },
    batchSize: {
      label: "Veľkosť dávky",
      description: "Počet kontaktov v jednej dávke (1 až 100)",
    },
    maxEmailsPerRun: {
      label: "Limit e-mailov na spustenie",
      description:
        "Najvyšší počet e-mailov na odoslanie pri jednom spustení na pozadí (1 až 1000)",
    },
    schedule: {
      label: "Harmonogram",
      description: "Výraz cron určujúci spúšťanie e-mailových kampaní",
    },
    priority: {
      label: "Priorita",
      description: "Priorita vykonávania úlohy",
    },
    timeout: {
      label: "Časový limit (ms)",
      description: "Maximálny čas vykonávania v milisekundách",
    },
    retries: {
      label: "Opakované pokusy",
      description: "Počet opakovaných pokusov pri zlyhaní",
    },
    retryDelay: {
      label: "Oneskorenie opakovania (ms)",
      description: "Čas medzi pokusmi v milisekundách",
    },
    success: {
      title: "Nastavenia uložené",
      description: "Nastavenia e-mailových kampaní sa uložili",
    },
  },
  priority: {
    critical: "Kritické",
    high: "Vysoká",
    medium: "Stredná",
    low: "Nízka",
    background: "Na pozadí",
  },
  widget: {
    title: "Nastavenie e-mailových kampaní",
    titleSaved: "Uložené nastavenie",
    saving: "Ukladajú sa nastavenia…",
    save: "Uložiť nastavenia",
    guidanceTitle: "Nastaviť úlohu e-mailových kampaní na pozadí",
    guidanceDescription:
      "Zapnite alebo vypnite úlohu cron pre e-mailové kampane a nastavte jej plán, veľkosť dávky a parametre spúšťania.",
    runButton: "Spustiť teraz",
    running: "Prebieha…",
    done: "Hotovo",
    sections: {
      general: "Všeobecné",
      generalDescription:
        "Zapnutie úlohy e-mailových kampaní a skúšobného režimu.",
      schedule: "Harmonogram",
      scheduleDescription: "Nastavte plán cron na odosielanie e-mailov.",
      processing: "Spracovanie",
      processingDescription:
        "Nastavte počet kontaktov a e-mailov na spracovanie pri jednom spustení.",
      advanced: "Pokročilé",
      advancedDescription:
        "Nastavte prioritu úlohy, časové limity a opakované pokusy.",
    },
  },
};
