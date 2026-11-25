import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
    titleShort: "História Pulse",
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
        description: "Počet výsledkov, ktoré sa majú pri stránkovaní preskočiť",
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
    taskNameUnavailable: "Názov úlohy nie je k dispozícii",
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
};
