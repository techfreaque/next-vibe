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
    rebuild: "Zostaviť znova",
  },
  post: {
    title: "Zostaviť znova a reštartovať",
    titleShort: "Zostaviť znova",
    description:
      "Znova zostaví aplikáciu a za chodu reštartuje server Next.js. Postup má šesť krokov: 1. vygeneruje kód, 2. spustí vibe check, 3. vytvorí produkčné zostavenie Next.js, 4. spustí migrácie databázy, 5. vloží počiatočné dáta, 6. reštartuje server signálom SIGUSR1. Ak vibe check nájde chyby, zostavenie sa zastaví. Podrobnosti zobrazí vibe check alebo nástroj check cez MCP. Upozornenie: Reštart môže prerušiť odpoveď HTTP skôr, než sa odošle celá.",
    form: {
      title: "Zostaviť znova a reštartovať",
      description: "Znova zostaviť aplikáciu a reštartovať server",
    },
    fields: {
      framework: {
        title: "Rámec",
        description: "Framework na zostavenie a reštart",
      },
      webpack: {
        title: "Webpack",
        description:
          "Použiť webpack namiesto Turbopacku (predvolená hodnota: true)",
      },
      success: {
        title: "Výsledok",
      },
      errors: {
        title: "Chyby",
      },
      duration: {
        title: "Trvanie",
      },
      steps: {
        title: "Kroky",
      },
    },
    steps: {
      codegen: "Generovanie kódu",
      vibeCheck: "Kontrola Vibe",
      nextBuild: "Zostavenie Next.js",
      migrate: "Migrácia",
      seed: "Vloženie počiatočných dát",
      restart: "Reštart",
      codegenFailed: "Generovanie kódov zlyhalo: {{error}}",
      vibeCheckFailed:
        "vibe check (chyby: {{errors}}, upozornenia: {{warnings}}). Podrobnosti zobrazí vibe check alebo nástroj check cez MCP.",
      vibeCheckError: "Kontrola Vibe zlyhala: {{error}}",
      buildFailed: "Zostavenie Next.js zlyhalo: {{error}}",
      buildOom:
        "Operačný systém ukončil zostavenie Next.js, pravdepodobne pre nedostatok pamäte. Signál: {{signal}}",
      buildExitCode: "Zostavenie Next.js sa skončilo s kódom {{code}}",
      migrationFailed: "Migrácia zlyhala: {{error}}",
      seedingFailed: "Vloženie počiatočných dát zlyhalo: {{error}}",
      restartFailed: "Reštart servera zlyhal: {{error}}",
      unknownError: "neznáma chyba",
      noPidFile: "Súbor .vibe-pid sa nenašiel. Beží proces vibe start?",
      invalidPid: "Neplatné PID v súbore .vibe-pid: {{pid}}",
      processNotRunning: "Proces {{pid}} nebeží",
      signalFailed: "Signál SIGUSR1 sa nepodarilo odoslať: {{error}}",
    },
    errors: {
      validation: {
        title: "Overenie vstupu zlyhalo",
        description: "Zadané parametre opätovného zostavenia sú neplatné.",
      },
      network: {
        title: "Chyba siete",
        description: "Pri opätovnom zostavení zlyhalo sieťové pripojenie",
      },
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Opätovné zostavenie aplikácie vyžaduje prihlásenie",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Na opätovné zostavenie aplikácie nemáte oprávnenie",
      },
      notFound: {
        title: "Nenájdené",
        description: "Zdroje na opätovné zostavenie sa nenašli",
      },
      server: {
        title: "Chyba servera",
        description: "Pri opätovnom zostavení nastala interná chyba servera",
        buildFailed: "Zostavenie zlyhalo: {{error}}",
        migrationsFailed: "Migrácia zlyhala: {{error}}",
        rebuildFailed: "Opätovné zostavenie zlyhalo: {{error}}",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri opätovnom zostavení nastala neznáma chyba",
      },
      conflict: {
        title: "Konflikt",
        description: "Opätovné zostavenie už prebieha",
      },
    },
    success: {
      title: "Opätovné zostavenie dokončené",
      description: "Aplikácia bola znova zostavená a server reštartovaný",
    },
    widget: {
      rebuildComplete: "Opätovné zostavenie dokončené",
      rebuildFailed: "Opätovné zostavenie zlyhalo",
      errors: "Chyby:",
      runRebuild: "Spustiť opätovné zostavenie",
      runAgain: "Spustiť znova",
      skipped: "vynechaný",
    },
  },
};
