import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Spusti {{appName}} na vlastnom serveri | AI, účtovníctvo a CRM",
    description:
      "Spusti si {{appName}} na vlastnom zariadení. Príkazy git clone, bun i, vibe dev. Všetky modely AI ({{modelCount}}) cez účet {{appName}} spolu s účtovníctvom, CRM a odberom noviniek. Údaje zostanú v tvojej databáze.",
    category: "Vlastný server",
    imageAlt: "Služba {{appName}} na vlastnom zariadení",
    keywords:
      "vlastný server, vlastný AI čet, next-vibe, {{appName}}, otvorený zdrojový kód, súkromná AI, lokálna AI, AI bez cenzúry, účtovníctvo na vlastnom serveri, otvorené ERP, vlastné CRM",
  },
  hero: {
    badge: "Zadarmo a s otvoreným kódom",
    title: "Tvoj server.",
    titleHighlight: "Tvoja AI. Tvoja firma.",
    subtitle:
      "Spusti {{appName}} na vlastnom zariadení. Prihlás sa účtom {{appName}} a získaš prístup ku všetkým modelom ({{modelCount}}). Kľúče poskytovateľov nepotrebuješ. Súčasťou aplikácie je účtovníctvo, CRM, odber noviniek aj agenti.",
    ctaStart: "Spustiť aplikáciu",
    ctaGithub: "Zobraziť na GitHube",
  },
  diagram: {
    link: "Jedno prihlásenie",
    instance: {
      label: "Beží na tvojom zariadení",
      title: "Tvoja inštancia",
      points: {
        chats: "Čety, účtovníctvo a zákazníci vo vlastnej databáze Postgres",
        files: "Nahraté súbory a vygenerované médiá na tvojom disku",
        tools: "Thea, úlohy cron a všetky nástroje AI",
        admin: "Tvoja správa. Tvoje pravidlá.",
      },
    },
    account: {
      label: "Beží na {{appName}}",
      title: "Tvoj účet",
      points: {
        models:
          "Počet modelov: {{modelCount}}. Spotreba sa odpočítava z tvojich kreditov.",
        keys: "Bez kľúčov poskytovateľov",
      },
    },
  },
  suite: {
    eyebrow: "Čo nainštaluješ",
    title: "Viac než čet.",
    intro:
      "Jeden zdrojový kód, databáza aj rozhranie správy. Všetky moduly dostaneš v jednej inštalácii.",
    link: "Zobraziť všetky firemné moduly",
    cards: {
      ai: {
        title: "Čet s AI",
        body: "Počet modelov: {{modelCount}}. Pamäť, vyhľadávanie na webe, režim inkognito aj tvorba obrázkov, videa, hudby a reči.",
      },
      agents: {
        title: "Agent, ktorý plní úlohy",
        body: "Zabudovaný agent Thea plní úlohy podľa harmonogramu. Ako nástroje používa SSH, prehliadač a tvoj e-mail.",
      },
      books: {
        title: "Účtovníctvo a ERP",
        body: "Podvojné účtovníctvo, vystavené a prijaté faktúry, nákup, sklad a pokladničný predaj.",
      },
      customers: {
        title: "Zákazníci",
        body: "CRM s importom CSV, odber noviniek s dvojitým potvrdením a jedna schránka pre e-mail, SMS, Telegram a WhatsApp.",
      },
      payments: {
        title: "Platby",
        body: "Predplatné s platbami cez Stripe alebo v kryptomene, webhookmi a vrátením platieb.",
      },
      build: {
        title: "Tvoje vlastné funkcie",
        body: "Z jedného definičného súboru vznikne webová stránka, príkaz CLI, nástroj MCP aj nástroj pre AI.",
      },
    },
  },
  start: {
    eyebrow: "Nastavenie",
    title: "Naklonuj. Nainštaluj. Spusti.",
    intro:
      "Stačia tri príkazy v termináli. Zvyšok nastavíš v prehliadači bez úprav konfiguračných súborov.",
    terminal: {
      eyebrow: "V termináli",
      title: "Spusti vlastnú inštanciu",
      copyAll: "Kopírovať všetko",
      copy: "Kopírovať",
      copied: "Skopírované",
      rows: {
        clone: "Získaj zdrojový kód",
        cd: "Prejdi do priečinka",
        install: "Nainštaluj závislosti. Príkaz vibe sa pridá do PATH.",
        dev: "Spusti aplikáciu. Databáza aj počiatočné údaje sa pripravia automaticky.",
      },
      facts: {
        docker: "Bez Dockeru",
        postgres: "Bez inštalácie Postgresu",
        config: "Bez úprav súboru .env",
      },
      troubleshoot: {
        notFound: {
          problem: "vibe: command not found?",
          fix: "Otvor nový terminál alebo spusti",
        },
        port: {
          problem: "Je port 3000 obsadený?",
          fix: "Použi iný port:",
        },
      },
    },
    prereqs: {
      summary: "Na novom zariadení najprv nainštaluj git a Bun",
      body: "Stačí raz na každom zariadení. Potrebuješ git a Bun 1.3 alebo novší. Vyber svoj systém.",
      newTerminal:
        "Potom otvor nový terminál, aby boli git a bun dostupné v PATH.",
    },
    browser: {
      eyebrow: "V prehliadači",
      title: "Zvyšok nastaví sprievodca",
      recommended: "Odporúčané",
      steps: {
        open: {
          title: "Otvor {{url}}",
          body: "Po prvom spustení inštancie sa automaticky otvorí sprievodca. Klikni na Spustiť nastavenie.",
        },
        admin: {
          title: "Vytvor prihlásenie správcu",
          body: "Zadaj e-mailovú adresu a heslo. Nahradia zabudované predvolené údaje. Bezpečnostné kľúče sú už pripravené.",
        },
        ai: {
          title: "Pripoj účet {{appName}}",
          body: "Zadaj e-mailovú adresu a heslo účtu {{appName}}. Hotovo.",
        },
        extras: {
          title: "Ďalšie možnosti podľa potreby",
          body: "E-mail, platby Stripe a úložisko S3 sú voliteľné. Môžeš ich preskočiť a nastaviť neskôr.",
        },
      },
      done: "Dokonči nastavenie a začni četovať.",
    },
  },
  ai: {
    eyebrow: "Pripojenie AI",
    title: "Jedno prihlásenie ku všetkým modelom.",
    intro: "Aplikácia beží na tvojej inštancii. Modely bežia na {{appName}}.",
    account: {
      badge: "Odporúčané",
      title: "Tvoj účet {{appName}}",
      body: "Prihlás sa raz v sprievodcovi nastavením. Každý čet beží v tvojej inštancii. Volania modelov sa spracúvajú na {{appName}} a odpočítavajú z tvojich kreditov.",
      points: {
        models: {
          title: "Počet modelov: {{modelCount}}",
          body: "Bežné, otvorené aj necenzurované. Rovnaká ponuka ako na {{appName}}.",
        },
        local: {
          title: "História zostáva u teba",
          body: "Konverzácie sú uložené v tvojej databáze. Cez {{appName}} prechádzajú len volania modelov. Synchronizácia konverzácií je vypnutá, kým ju nezapneš.",
        },
        sync: {
          title: "Nastavenia máš aj inde",
          body: "Spomienky, dokumenty, zručnosti a obľúbené položky sa predvolene synchronizujú. Každú skupinu môžeš zapnúť alebo vypnúť zvlášť.",
        },
        paid: {
          title: "Stačí akýkoľvek nákup",
          body: "Predplatné alebo ľubovoľný balík kreditov. Jeden účet môžeš pripojiť najviac k trom inštanciám.",
        },
      },
      cta: "Vytvoriť účet {{appName}}",
      pricing: "Pozrieť si predplatné",
    },
    claude: {
      title: "Claude Code na tomto zariadení",
      body: "Si prihlásený cez claude CLI? Sprievodca to rozpozná. Modely Claude využijú tvoje predplatné Claude. Nič ďalšie zadávať nemusíš.",
    },
    keys: {
      title: "Vlastné kľúče poskytovateľov",
      body: "Účet {{appName}} nepotrebuješ. V rovnakom kroku vlož vlastný kľúč a plať priamo poskytovateľovi.",
      providers: {
        openrouter: "OpenRouter",
        venice: "Venice AI",
        nanogpt: "NanoGPT",
      },
      cta: "Získať kľúč OpenRouter",
    },
  },
  own: {
    eyebrow: "Tvoj server, tvoje pravidlá",
    title: "Ovládaj prevádzku aj filtre.",
    subtitle:
      "Tvoja databáza Postgres, tvoje súbory a tvoje denníky. Vyber si modely a rozsah filtrov.",
    cards: {
      api: {
        title: "Vlastné API",
        body: "Každý modul máš vo svojej inštancii ako príkaz CLI a nástroj MCP. Použi ho v skripte alebo ho sprístupni agentovi.",
      },
      filter: {
        title: "Tvoja úroveň filtrov",
        body: "Bežné, otvorené aj necenzurované modely. Pre každú zručnosť aj konverzáciu si vyberáš sám.",
      },
      code: {
        title: "Otvorený kód bez viazanosti na dodávateľa",
        body: "Ten istý zdrojový kód ako v {{appName}} je verejný na GitHube. Môžeš ho čítať, meniť a vytvoriť si vlastnú vetvu repozitára.",
      },
    },
  },
  server: {
    eyebrow: "Produkčná prevádzka",
    title: "Nasaď aplikáciu na server.",
    intro:
      "Repozitár naklonuj a závislosti nainštaluj rovnako. Potom namiesto vývojového servera vytvor produkčné zostavenie.",
    terminalTitle: "Na serveri",
    rows: {
      start: "Prvé spustenie: produkčné zostavenie",
      update: "Po stiahnutí zmien: aktualizácia bez výpadku",
    },
    points: {
      proxy: "Pre HTTPS nasmeruj Caddy alebo nginx na port 3000.",
      env: "Pri prvej návšteve sa otvorí rovnaký sprievodca. Ak uprednostňuješ premenné prostredia, nastav ich v nasadení a reštartuj aplikáciu.",
      connect: "Účet {{appName}} pripoj zo servera rovnako ako z počítača.",
      db: "Predvolene sa používa vstavaný Postgres (PGlite). V produkcii nasmeruj DATABASE_URL na vlastnú databázu Postgres.",
    },
  },
  developers: {
    title: "Chceš na tom ďalej stavať?",
    body: "Každý modul je napísaný v TypeScripte. Vytvor si vlastnú vetvu repozitára, rozšír modul alebo napíš vlastný.",
    cta: "Pozrieť sa, ako funguje next-vibe",
  },
  help: {
    title: "Zasekol si sa alebo aplikáciu nasadzuješ pre tím?",
    description:
      "Pomôžeme s nastavením, inštaláciou pre tím aj vlastnými prepojeniami. Každú správu číta človek.",
  },
};
