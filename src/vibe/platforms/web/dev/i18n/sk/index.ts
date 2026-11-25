import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Správa serverov",
  enum: {
    framework: {
      next: "Next.js",
      tanstack: "TanStack/Vite",
    },
  },
  post: {
    title: "Vývoj",
    titleShort: "Vývojový server",
    description: "Koncový bod vývojového servera",
    form: {
      title: "Nastavenia vývojového servera",
      description: "Nastaviť parametre vývojového servera",
    },
    response: {
      title: "Odpoveď",
      description: "Výsledok spustenia vývojového servera",
    },
    fields: {
      debug: {
        title: "Ladiaci režim",
        description: "Zapnúť ladiaci režim s podrobným výstupom",
      },
      skipDbSetup: {
        title: "Preskočiť nastavenie databázy",
        description: "Preskočiť kroky nastavenia databázy",
      },
      skipNextCommand: {
        title: "Preskočiť príkaz Next.js",
        description: "Preskočiť spustenie vývojového servera Next.js",
      },
      skipDbReset: {
        title: "Preskočiť reset databázy",
        description: "Preskočiť obnovenie databázy do východiskového stavu",
      },

      port: {
        title: "Port",
        description: "Číslo portu pre vývojový server",
      },
      skipGeneratorWatcher: {
        title: "Nespúšťať sledovanie zmien pre generátor",
        description:
          "Preskočiť sledovanie zmien pre automatické generovanie kódu",
      },
      generatorWatcherInterval: {
        title: "Interval generátora",
        description: "Interval kontroly zmien pre generátor v milisekundách",
      },
      skipTaskRunner: {
        title: "Nespúšťať spúšťač úloh",
        description: "Nespúšťať systém na vykonávanie úloh",
      },
      skipMigrations: {
        title: "Preskočiť migrácie",
        description: "Preskočiť migrácie databázy",
      },
      skipMigrationGeneration: {
        title: "Preskočiť generovanie migrácií",
        description: "Preskočiť automatické generovanie migrácií",
      },
      skipSeeding: {
        title: "Preskočiť vloženie počiatočných dát",
        description: "Preskočiť vloženie počiatočných dát do databázy",
      },
      framework: {
        title: "Rámec",
        description: "Frontendový framework a nástroj na zostavenie balíka",
      },
      profile: {
        title: "Profil",
        description:
          "Zapne profilovanie nastavením NEXT_TURBOPACK_TRACING=1 (trasovanie v .next/dev/trace-turbopack) a NEXT_CPU_PROF=1 (pri ukončení zapíše .cpuprofile).",
      },
      success: {
        title: "Úspech",
      },
      output: {
        title: "Výstup",
      },
      duration: {
        title: "Trvanie",
      },
      serverUrl: {
        title: "Adresa URL servera",
      },
      databaseStatus: {
        title: "Stav databázy",
      },
      processes: {
        title: "Procesy",
      },
      errors: {
        title: "Chyby",
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
};
