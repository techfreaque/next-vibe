import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Operácie s databázou",

  tag: "migrácia",
  post: {
    title: "Migrácia databázy",
    titleShort: "Migrovať databázu",
    description: "Spustí migrácie databázy.",
    form: {
      title: "Nastavenie migrácie",
      description: "Nastavenie možností migrácie databázy",
    },
    response: {
      title: "Výsledok migrácie",
      description: "Výsledky migrácie databázy",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Neplatné parametre migrácie",
      },
      internal: {
        title: "Interná chyba",
        description: "Migrácia zlyhala.",
      },
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Ak chceš vykonať migrácie, prihlás sa.",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Nemáš oprávnenie spúšťať migrácie.",
      },
      notFound: {
        title: "Nenájdené",
        description: "Zdroje potrebné na migráciu sa nenašli.",
      },
      server: {
        title: "Chyba servera",
        description: "Pri migrácii sa vyskytla interná chyba servera.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri migrácii nastala neznáma chyba",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri migrácii nastal konflikt.",
      },
      network: {
        title: "Chyba siete",
        description: "Pri migrácii nastala chyba siete.",
        detail: "Migrácia zlyhala: {{error}}",
        exitCode: "Príkaz drizzle-kit migrate skončil s kódom {{code}}.",
      },
    },
    success: {
      title: "Úspešná migrácia",
      description: "Migrácia databázy sa dokončila.",
    },
  },
  fields: {
    generate: {
      title: "Vygenerovať migrácie",
      description: "Vygeneruje nové migračné súbory podľa zmien schémy.",
    },
    redo: {
      title: "Zopakovať poslednú migráciu",
      description: "Vráti zmeny poslednej migrácie a potom ju vykoná znova.",
    },
    schema: {
      title: "Schéma databázy",
      description: "Cieľová schéma databázy (predvolene public)",
    },
    success: {
      title: "Výsledok",
    },
    migrationsRun: {
      title: "Vykonané migrácie",
    },
    migrationsGenerated: {
      title: "Vygenerované migrácie",
    },
    output: {
      title: "Výstup",
    },
    duration: {
      title: "Trvanie (ms)",
    },
  },
  errors: {
    validation: {
      title: "Chyba overenia",
      description: "Neplatné parametre migrácie",
    },
    internal: {
      title: "Interná chyba",
      description: "Migrácia zlyhala.",
    },
    unauthorized: {
      title: "Bez oprávnenia",
      description: "Ak chceš vykonať migrácie, prihlás sa.",
    },
    forbidden: {
      title: "Prístup zakázaný",
      description: "Nemáš oprávnenie spúšťať migrácie.",
    },
    notFound: {
      title: "Nenájdené",
      description: "Zdroje potrebné na migráciu sa nenašli.",
    },
    server: {
      title: "Chyba servera",
      description: "Pri migrácii sa vyskytla interná chyba servera.",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Pri migrácii nastala neznáma chyba",
    },
    conflict: {
      title: "Konflikt",
      description: "Pri migrácii nastal konflikt.",
    },
    generationFailed: "Nepodarilo sa vygenerovať migrácie: {{message}}",
    generationFailedWithCode:
      "Generovanie migrácií skončilo s kódom {{code}}: {{output}}",
    migrationFailed: "Nepodarilo sa vykonať migrácie: {{message}}",
  },
  success: {
    title: "Úspešná migrácia",
    description: "Migrácia databázy sa dokončila.",
  },
  status: {
    pending: "Čaká",
    running: "Prebieha",
    success: "Úspech",
    failed: "Zlyhalo",
    rolledBack: "Zmeny boli vrátené",
  },
  direction: {
    up: "Aplikovať migráciu",
    down: "Vrátiť migráciu",
  },
  environment: {
    development: "Vývoj",
    staging: "Predprodukcia",
    production: "Produkcia",
  },
  messages: {
    dryRun: "Skúšobné spustenie. Migrácie by sa vykonali.",
    generatingMigrations: "Generovanie migrácií:\n{{output}}\n",
    noMigrationsFolder: "Priečinok s migráciami sa nenašiel.",
    noMigrationFiles: "Migračné súbory sa nenašli.",
    executedMigrations: "Úspešne vykonané migrácie: {{count}}",
    redoNotImplemented: "Tu by sa vykonalo zopakovanie migrácie.",
    repairCompleted: "Oprava migrácií sa dokončila.",
    repairDryRun: "Skúšobné spustenie. Oprava migrácií by sa vykonala.",
    trackingReset: "Evidencia migrácií bola vynulovaná.",
    productionCompleted: "Migrácie v produkcii sa dokončili.",
    productionWithBackup: " (so zálohou)",
    syncCompleted: "Synchronizácia migrácií sa dokončila ({{direction}}).",
    failedToGenerate: "Nepodarilo sa vygenerovať migrácie: {{error}}",
    failedToExecute: "Nepodarilo sa vykonať migrácie: {{error}}",
    failedToRedo: "Nepodarilo sa zopakovať migráciu: {{error}}",
  },
};
