import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
    titleShort: "Spúšťač úloh",
    description: "Spravovať jednotný spúšťač úloh na pozadí a vedľajších úloh",
    container: {
      title: "Správa jednotného spúšťača úloh",
      description: "Ovládať jednotný spúšťač úloh na pozadí aj vedľajších úloh",
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
};
