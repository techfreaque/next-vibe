import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Spustenie Pulse",
  tags: {
    execute: "Spustiť",
  },
  errors: {
    executePulse: "Kontrolný cyklus sa nepodarilo spustiť.",
  },
  post: {
    title: "Spustiť Pulse",
    titleShort: "Spustiť Pulse",
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
        label: "Aliasy úloh",
        description:
          "Zadajte alias koncového bodu a stlačte Enter. Prázdne pole zahrnie všetky príslušné úlohy.",
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
};
