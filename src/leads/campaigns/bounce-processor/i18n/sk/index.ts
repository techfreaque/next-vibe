import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Správa kampaní",
  tag: "Spracovanie oznámení o nedoručení",
  task: {
    description:
      "Vyhľadať v doručenej pošte IMAP oznámenia o nedoručení a nastaviť dotknutým kontaktom stav BOUNCED",
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
    title: "Spracovanie oznámení o nedoručení",
    titleShort: "Spracovať oznámenia o nedoručení",
    description:
      "Spracovať oznámenia o nedoručení e-mailov z doručenej pošty IMAP",
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
        description: "Pri spracovaní oznámení o nedoručení nastala chyba",
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
      dryRun: {
        label: "Skúšobný režim",
        description: "Spustiť bez vykonania zmien",
      },
      batchSize: {
        label: "Veľkosť dávky",
        description: "Najvyšší počet oznámení o nedoručení na jedno spustenie",
      },
    },
    response: {
      bouncesFound: "Nájdené oznámenia o nedoručení",
      leadsUpdated: "Upravené kontakty",
      campaignsCancelled: "Kampane zrušené",
    },
    backButton: {
      label: "Späť",
    },
    submitButton: {
      label: "Uložiť nastavenia",
      loadingText: "Ukladajú sa nastavenia…",
    },
    success: {
      title: "Spracovanie oznámení o nedoručení dokončené",
      description: "Oznámenia o nedoručení sa úspešne spracovali",
    },
  },
  get: {
    title: "Získať nastavenia spracovania nedoručených e-mailov",
    titleShort: "Nastavenia spracovania oznámení o nedoručení",
    description:
      "Načíta nastavenia úlohy na pozadí, ktorá spracúva oznámenia o nedoručení",
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
      schedule: "Harmonogram",
      priority: "Priorita",
      timeout: "Časový limit",
      retries: "Opakované pokusy",
      retryDelay: "Oneskorenie opakovania",
    },
    backButton: {
      label: "Späť",
    },
    success: {
      title: "Nastavenia načítané",
      description:
        "Nastavenia spracovania nedoručených e-mailov sa úspešne načítali",
    },
  },
  put: {
    title: "Nastavenia spracovania oznámení o nedoručení",
    description:
      "Upraviť nastavenia úlohy na pozadí, ktorá spracúva oznámenia o nedoručení",
    enabled: {
      label: "Zapnuté",
      description:
        "Zapnúť alebo vypnúť úlohu na pozadí, ktorá spracúva oznámenia o nedoručení",
    },
    dryRun: {
      label: "Skúšobný režim",
      description: "Vyhľadá nedoručenia bez zmeny stavu kontaktov",
    },
    batchSize: {
      label: "Veľkosť dávky",
      description:
        "Najvyšší počet oznámení o nedoručení na jedno spustenie (1 až 500)",
    },
    schedule: {
      label: "Harmonogram",
      description:
        "Výraz cron určujúci, kedy sa spustí spracovanie oznámení o nedoručení",
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
      description:
        "Nastavenia spracovania nedoručených e-mailov sa úspešne uložili",
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
    title: "Nastavenia spracovania oznámení o nedoručení",
    titleSaved: "Uložené nastavenie",
    saving: "Ukladajú sa nastavenia…",
    save: "Uložiť nastavenia",
    guidanceTitle: "Nastaviť spracovanie oznámení o nedoručení na pozadí",
    guidanceDescription:
      "Zapnite alebo vypnite úlohu cron na spracovanie oznámení o nedoručení a nastavte jej plán a veľkosť dávky.",
    runButton: "Spustiť teraz",
    running: "Prebieha…",
    done: "Hotovo",
    sections: {
      general: "Všeobecné",
      generalDescription:
        "Zapnutie spracovania oznámení o nedoručení a skúšobného režimu.",
      schedule: "Harmonogram",
      scheduleDescription:
        "Nastavte plán cron na spracovanie oznámení o nedoručení.",
      processing: "Spracovanie",
      processingDescription:
        "Nastavte počet oznámení o nedoručení na jedno spustenie.",
      advanced: "Pokročilé",
      advancedDescription:
        "Nastavte prioritu úlohy, časové limity a opakované pokusy.",
    },
  },
};
