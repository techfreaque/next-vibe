import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Jeden koncový bod pre každú platformu | next-vibe",
    description:
      "Jeden definition.ts na funkciu vytvorí webový formulár, príkaz CLI, nástroj MCP, natívnu obrazovku aj úlohu cron. Bez duplicít a s kontrolou typov.",
    category: "Architektúra",
    imageAlt:
      "Jednotná architektúra next-vibe: jeden koncový bod pre každú platformu",
    keywords:
      "next-vibe, TypeScript, jednotné rozhranie, MCP, CLI, definition.ts, otvorený kód, SaaS framework",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Architektúra",
    readTime: "5 min čítania",
    title: "Jeden koncový bod pre každú platformu.",
    subtitle:
      "Jedna definícia na funkciu. Webový formulár, príkaz CLI, nástroj MCP, natívna obrazovka aj úloha cron vzniknú naraz bez duplicít.",
  },
  intro: {
    paragraph1:
      "Každá funkcia potrebovala webový formulár, príkaz CLI, nástroj MCP pre agentov AI a niekedy aj mobilnú obrazovku. Overovanie cez Zod, lokalizácia (i18n) a spracovanie chýb pritom zostávali rovnaké. Preto som vytvoril next-vibe. Pre každú funkciu napíšeš jeden definition.ts a ten sa zobrazí vo všetkých rozhraniach.",
    paragraph2:
      "Na rovnakom kóde beží {{appName}} s {{modelCount}} modelmi AI a filtrami pod kontrolou používateľa. Kód poskytuje web v Next.js, vývojový server TanStack/Vite, mobilnú aplikáciu React Native, CLI, server MCP, cron aj zbernicu udalostí WebSocket. Stačí jediná definícia koncového bodu.",
  },
  typeRules: {
    title: "Typy musia presne sedieť",
    subtitle:
      "Framework tieto architektonické pravidlá presadzuje automaticky.",
    intro:
      "Typy musia sedieť do posledného detailu. Chybný typ odhaľuje problém v architektúre. Preto existuje vibe check. Súbežne spustí Oxlint, ESLint a TypeScript aj vlastné doplnky s pravidlami projektu.",
    any: {
      name: "Bez any",
      description:
        "Napíš rozhranie so skutočnými typmi. Ak siahaš po any, niečo v tvojej architektúre chýba.",
    },
    unknown: {
      name: "Bez unknown",
      description:
        "Platí rovnaké pravidlo. unknown len odkladá problém s typom. Definuj skutočný typ.",
    },
    object: {
      name: "Bez samotného object",
      description:
        "Samotné object neurčuje tvar údajov. Definuj štruktúru, ktorú očakávaš.",
    },
    asX: {
      name: "Bez as X",
      description:
        "Typové tvrdenie môže skryť chybu pred kompilátorom. Oprav typ tam, kde vzniká.",
    },
    throwStatements: {
      name: "Bez throw",
      description:
        "Použi ResponseType<T> so success(data) alebo fail({message, errorType}). Chyby prenášaj ako údaje.",
    },
    hardcodedStrings: {
      name: "Bez textov natvrdo v JSX",
      description:
        "Kontrola odhalí nepreložené textové reťazce. Každý text potrebuje prekladový kľúč.",
    },
  },
  vibeSense: {
    title: "Ako vzniklo spracovanie grafov",
    subtitle: "Obchodný robot, ktorý neobchoduje",
    description:
      "Vibe Sense začal ako obchodný robot. Žiadne príkazy na nákup ani predaj nevykonal. Sledoval ceny a vysielal signály. Keď som robota opustil, architektúra zostala. Zdroje posielajú údaje do indikátorov, indikátory do vyhodnocovačov a tie vytvárajú signály, ktoré spúšťajú akcie. Každý uzol je koncový bod HTTP.",
    quote:
      "Každý uzol grafu je koncový bod HTTP. Ľubovoľný krok môžeš zavolať cez curl, testovať samostatne alebo sprístupniť agentovi AI. Graf plánuje volania koncových bodov.",
    whyItMatters:
      "Každý uzol je štandardný koncový bod. Môžeš ho zvlášť testovať cez CLI, volať agentom cez MCP a ukladať do vyrovnávacej pamäte rovnakou infraštruktúrou ako ostatné funkcie. Graf používa existujúce koncové body a plánuje ich spúšťanie.",
  },
  cta: {
    title: "Pozri si kód a spusti ho u seba",
    subtitle:
      "next-vibe má otvorený kód. Naklonuj repozitár, spusti vibe dev a za jedno popoludnie sprístupni svoj prvý koncový bod vo všetkých rozhraniach.",
    github: "Zobraziť na GitHube",
    clone: "git clone https://github.com/techfreaque/next-vibe",
    framework: "Preskúmať next-vibe",
  },
};
