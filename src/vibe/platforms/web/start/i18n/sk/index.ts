import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Správa serverov",
  enum: {
    framework: {
      next: "Next.js",
      tanstack: "TanStack/Vite",
    },
  },
  tags: {
    start: "Spustiť",
  },
  post: {
    title: "Spustiť produkčný server",
    titleShort: "Spustiť server",
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
      vibeMode: {
        title: "Režim inštancie",
        description:
          "Pri spustení zmení režim inštancie v zostavenom balíku. agent je osobná lokálna inštancia, cloud je SaaS a dev je vývojová inštancia.",
        options: {
          agent: "Agent (osobná miestna inštancia)",
          cloud: "Cloud (Nasadenie SaaS)",
          dev: "Dev (vývojová inštancia)",
        },
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
        startingTaskRunner: "Spúšťa sa systém na vykonávanie produkčných úloh…",
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
};
