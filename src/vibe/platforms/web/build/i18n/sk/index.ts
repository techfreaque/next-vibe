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
    build: "Zostavenie",
  },
  post: {
    title: "Zostaviť aplikáciu",
    titleShort: "Zostaviť aplikáciu",
    description: "Zostaviť aplikáciu na produkčné nasadenie",
    form: {
      title: "Nastavenia zostavenia",
      description: "Nastaviť možnosti zostavenia",
    },
    fields: {
      package: {
        title: "Zostaviť balík",
        description: "Pred zostavením aplikácie zostaviť balík",
      },
      skipNextCommand: {
        title: "Preskočiť príkaz Next.js",
        description: "Preskočiť príkaz zostavenia Next.js",
      },
      target: {
        title: "Cieľ zostavenia",
        description:
          "Zadajte cieľ zostavenia, napríklad production alebo staging",
      },
      skipGeneration: {
        title: "Preskočiť generovanie kódu",
        description: "Pri zostavení preskočiť generovanie koncových bodov API",
      },
      generate: {
        title: "Generovať kód",
        description: "Pri zostavení vygenerovať kód",
      },
      generateEndpoints: {
        title: "Generovať koncové body",
        description: "Pri zostavení vygenerovať súbory koncových bodov API",
      },
      generateSeeds: {
        title: "Vygenerovať počiatočné dáta",
        description: "Pri zostavení vygenerovať súbory s počiatočnými dátami",
      },
      nextBuild: {
        title: "Zostavenie Next.js",
        description: "Spustiť zostavenie Next.js",
      },
      migrate: {
        title: "Spustiť migrácie",
        description: "Pri zostavení spustiť migrácie databázy",
      },
      seed: {
        title: "Vložiť počiatočné dáta",
        description: "Pri zostavení vložiť počiatočné dáta do databázy",
      },
      force: {
        title: "Vynútiť zostavenie",
        description: "Pokračovať v zostavení aj pri chybách",
      },
      framework: {
        title: "Rámec",
        description: "Frontendový framework a nástroj na zostavenie balíka",
      },
      webpack: {
        title: "Použiť webpack",
        description:
          "Použiť webpack namiesto Turbopacku. Spotrebuje približne 7,5 GB pamäte oproti približne 12 GB. Pri produkčnom zostavení cez Docker je táto voľba predvolene zapnutá.",
      },
      vibeMode: {
        title: "Režim inštancie",
        description:
          "Uloží režim inštancie do balíka Next.js. agent je osobná lokálna inštancia, cloud je nasadenie SaaS a dev je vývojová inštancia (predvolené). Prepíše hodnotu NEXT_PUBLIC_VIBE_MODE zo súboru .env.",
        options: {
          agent: "Agent (osobná miestna inštancia)",
          cloud: "Cloud (Nasadenie SaaS)",
          dev: "Dev (vývojová inštancia, predvolená)",
        },
      },
      skipEndpoints: {
        title: "Preskočiť generovanie koncových bodov",
        description: "Preskočiť generovanie súborov koncových bodov",
      },
      skipSeeds: {
        title: "Preskočiť generovanie počiatočných dát",
        description: "Preskočiť generovanie súborov s počiatočnými dátami",
      },
      skipProdMigrations: {
        title: "Preskočiť produkčné migrácie",
        description: "Preskočiť migrácie produkčnej databázy",
      },
      skipProdSeeding: {
        title: "Preskočiť vloženie počiatočných dát v produkcii",
        description:
          "Preskočiť vloženie počiatočných dát do produkčnej databázy",
      },
      runProdDatabase: {
        title: "Vykonať operácie v produkčnej databáze",
        description: "Po zostavení vykonať operácie v produkčnej databáze",
      },
      success: {
        title: "Zostavenie úspešné",
      },
      output: {
        title: "Výstup zostavenia",
      },
      duration: {
        title: "Trvanie zostavenia (ms)",
      },
      errors: {
        title: "Chyby zostavenia",
      },
      steps: {
        title: "Kroky zostavenia",
      },
      label: {
        title: "Krok",
      },
      ok: {
        title: "Úspech",
      },
      skipped: {
        title: "Preskočené",
      },
    },
    errors: {
      validation: {
        title: "Overenie vstupu zlyhalo",
        description: "Zadané parametre zostavenia sú neplatné.",
      },
      network: {
        title: "Chyba siete",
        description: "Počas zostavenia zlyhalo sieťové pripojenie",
      },
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Zostavenie aplikácie vyžaduje prihlásenie",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Na zostavenie aplikácie nemáte oprávnenie",
      },
      notFound: {
        title: "Nenájdené",
        description: "Zdroje potrebné na zostavenie sa nenašli",
      },
      server: {
        title: "Chyba servera",
        description: "Počas zostavenia nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Počas zostavenia nastala neznáma chyba",
      },
      conflict: {
        title: "Konflikt",
        description: "Zistil sa konflikt pri zostavení",
      },
      nextjs_build_failed: {
        title: "Zostavenie Next.js zlyhalo",
        description: "Zostavenie Next.js zlyhalo: {{error}}",
      },
    },
    success: {
      title: "Zostavenie dokončené",
      description: "Aplikácia bola úspešne zostavená",
    },
    repository: {
      messages: {
        buildStart: "🚀 Spúšťa sa zostavenie aplikácie…",
        packageBuildStart: "Zostavuje sa balík…",
        packageBuildSuccess: "✅ Balík bol úspešne zostavený",
        packageBuildFailed: "Zostavenie balíka zlyhalo: {{error}}",
        buildPrerequisites: "Vykonávajú sa kroky pred zostavením…",
        skipGeneration:
          "Preskakuje sa generovanie koncových bodov API (--skip-generation)",
        generatingEndpoints: "Generujú sa koncové body API…",
        generationSuccess: "✅ Generovanie kódu je dokončené",
        generationFailed: "Generovanie kódu zlyhalo",
        generationFailedDetail: "Generovanie kódov zlyhalo: {{error}}",
        tanstackBuildStart: "Zostavuje sa TanStack Start (SSR)…",
        tanstackBuildSuccess: "✅ TanStack Start (SSR) bol úspešne zostavený",
        tanstackBuildFailed: "Zostavenie TanStack Start zlyhalo",
        tanstackBuildFailedDetail:
          "Zostavenie TanStack Start zlyhalo: {{error}}",
        skipNextBuild:
          "Zostavenie Next.js sa preskakuje. Zabezpečí ho package.json.",
        buildingNextjs: "Zostavuje sa aplikácia Next.js…",
        nextjsBuildSuccess: "✅ Aplikácia Next.js bola úspešne zostavená",
        nextjsBuildFailed: "Zostavenie Next.js zlyhalo: {{error}}",
        nextjsBuildOom:
          "Operačný systém ukončil zostavenie Next.js, pravdepodobne pre nedostatok pamäte. Signál: {{signal}}",
        nextjsBuildExitCode: "Zostavenie Next.js sa skončilo s kódom {{code}}",
        skipProdDb:
          "Preskakujú sa operácie v produkčnej databáze (--run-prod-database=false)",
        buildFailed: "❌ Zostavenie zlyhalo: {{error}}",
        unknownError: "neznáma chyba",
        schemaGenerationStart: "Generuje sa schéma databázy…",
        schemaGenerationSuccess: "✅ Schéma databázy bola vygenerovaná",
        schemaGenerationFailed: "Generovanie schémy databázy zlyhalo",
        skipSchemaGeneration:
          "Preskakuje sa generovanie schémy databázy (--run-prod-database=false)",
        reportsGenerationStart: "Generujem všetky správy...",
        reportsGenerationSuccess: "✅ Všetky správy úspešne generované",
        reportsGenerationFailed: "Generovanie správ zlyhalo",
        prodDbStart: "🚀 Vykonávajú sa operácie v produkčnej databáze…",
        prodDbSuccess: "🎉 Operácie v produkčnej databáze sa úspešne dokončili",
        prodDbFailed:
          "❌ Produkčné zostavenie zlyhalo pri práci s databázou: {{error}}. Skúste databázu spustiť príkazom 'docker compose -f docker-compose-dev.yml up -d'.",
        prodDbConnectionFailed:
          "❌ Produkčné zostavenie zlyhalo pri práci s databázou. Databáza je nedostupná ({{error}}). Skontrolujte jej stav a spustite ju príkazom 'docker compose -f docker-compose-dev.yml up -d'.",
        prodDbNotReady:
          "💡 Toto zostavenie nie je pripravené na produkčné nasadenie",
        deploymentReady: "🚀 Aplikácia je pripravená na produkčné nasadenie!",
        nextBuildHandled: "✅ Zostavenie Next.js zabezpečí príkaz yarn build",
        failedProdMigrations:
          "Nepodarilo sa spustiť migrácie produkčnej databázy",
      },
    },
  },
};
