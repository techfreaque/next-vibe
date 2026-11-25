import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Jeden kód, 13 platforiem | next-vibe",
    category: "Architektúra",
    description:
      "Ako z troch súborov automaticky vznikne web, príkaz CLI, nástroj MCP, natívna obrazovka aj úloha cron.",
    imageAlt: "Architektúra Unified Surface v next-vibe",
    keywords:
      "next-vibe, Unified Surface, návrh koncových bodov, MCP, CLI, TypeScript, SaaS rámec, full-stack",
  },
  readingTime: "12 min čítania",
  category: "Architektúra",
  backToBlog: "Späť na blog",

  hero: {
    eyebrow: "Princíp Unified Surface",
    title: "Jeden kód. 13 platforiem. Bez kompromisov.",
    subtitle:
      "Tri súbory sa naraz premenia na webový formulár, príkaz CLI, nástroj MCP, natívnu obrazovku aj automatickú úlohu.",
    fileBarLabel:
      "definition.ts → web · CLI · MCP · natívna aplikácia · cron · ďalších 10",
    theaCardTitle: "Kto je Thea?",
    fileTreePath: "~/src/explain-to-my-boss/",
    codeBlockLabel: "allowedRoles: [",
    closingBracket: "]",
    vibeCliCommand:
      "vibe analytics/indicators/ema --source=leads_created --period=7",
  },

  intro: {
    hook: "5 802 súborov TypeScript. Približne 2,1 milióna riadkov. Ani jedno `any`. Nula typových chýb za behu. Jeden vzor použitý 374-krát.",
    para1:
      "Na tomto kóde stojí {{appName}} aj rámec next-vibe, ktorý aplikáciu poháňa. Tá istá architektúra obsluhuje web, mobilnú aplikáciu, CLI, rozhranie pre agentov AI, server MCP, úlohy cron, udalosti cez WebSocket aj dátové toky v reálnom čase.",
    para2:
      "Tento vzor voláme Unified Surface. Keď uvidíš, ako funguje, ťažko sa ti bude vracať k starému prístupu.",
  },

  fileTreeSection: {
    title: "Jedna funkcia, jeden priečinok",
    intro:
      "Každá funkcia v next-vibe má vlastný priečinok. Tri súbory sú povinné. Ostatné sú voliteľné.",
    fileTree: {
      line1: "explain-to-my-boss/",
      line2: "  definition.ts    ← čo funkcia robí",
      line3: "  repository.ts    ← ako to robí",
      line4: "  route.ts         ← sprístupní ju na všetkých platformách",
      line5: "  widget.tsx       ← vlastné rozhranie React (voliteľné)",
      line6: "  widget.cli.tsx   ← vlastné rozhranie terminálu (voliteľné)",
    },
    explanation:
      "To je celé. Jeden priečinok a tri povinné súbory. Z nich sa funkcia sprístupní súčasne až na 13 platformách.",
  },

  platformsSection: {
    title: "13 platforiem z 3 súborov",
    subtitle:
      "Keď do next-vibe pridáš funkciu, naraz dostaneš koncový bod API aj všetky tieto spôsoby použitia.",
    platforms: {
      webApi: {
        label: "Webové API",
        description:
          "Plne typovaný koncový bod REST s automatickým overovaním vstupu",
      },
      reactUi: {
        label: "Rozhranie React",
        description: "Vznikne automaticky z definície. JSX písať nemusíš.",
      },
      cli: {
        label: "CLI",
        description:
          "Každý koncový bod je príkaz s automaticky vytvorenými prepínačmi.",
      },
      aiTool: {
        label: "Schéma nástroja AI",
        description: "Schéma volania funkcie vzniká automaticky.",
      },
      mcpServer: {
        label: "Server MCP",
        description:
          "Pripoj Claude Desktop, Cursor alebo ľubovoľného klienta MCP.",
      },
      reactNative: {
        label: "React Native",
        description: "Obrazovky pre iOS a Android z tej istej definície",
      },
      cron: {
        label: "Úloha cron",
        description: "Naplánuj koncový bod na pravidelné spúšťanie.",
      },
      websocket: {
        label: "Udalosti WebSocket",
        description: "Po dokončení pošle aktualizácie pripojeným klientom.",
      },
      electron: {
        label: "Desktopová aplikácia Electron",
        description:
          "Natívna desktopová aplikácia s rovnakými kontraktmi koncových bodov",
      },
      adminPanel: {
        label: "Rozhranie správcu",
        description: "Rozhranie vznikne automaticky, bez vlastného kódu.",
      },
      vibeFrame: {
        label: "Widget VibeFrame",
        description:
          "Widget vo formáte iframe, ktorý môžeš vložiť na ľubovoľný web",
      },
      remoteSkill: {
        label: "Zručnosť agenta",
        description: "Agenti AI ju môžu volať ako štruktúrovanú zručnosť.",
      },
      vibeBoard: {
        label: "Uzol Vibe Sense",
        description:
          "Uzol v živom grafe dátových tokov používa ten istý koncový bod.",
      },
    },
  },

  deleteFolderQuote:
    "Odstráň priečinok. Funkcia zmizne zo všetkých platforiem naraz.",

  platformMarkersSection: {
    title: "Prístup k platformám určuje jedno pole hodnôt enum",
    para1:
      "Prístup uvedieš priamo v definícii. Jedno pole hodnôt enum načíta za behu každá platforma. Samostatné vrstvy oprávnení netreba písať.",
    codeComment: "// Toto pole určuje, kde sa funkcia zobrazí",
    cliOff: "  CLI_OFF,         // zablokuje prístup z CLI",
    mcpVisible: "  MCP_VISIBLE,     // pridá nástroj do zoznamu MCP",
    remoteSkill:
      "  REMOTE_SKILL,    // pridá funkciu do súboru zručností agenta",
    productionOff: "  PRODUCTION_OFF,  // vypne funkciu v produkcii",
    para2:
      "Všetko je v jednej definícii na jednom mieste. Každá platforma používa tie isté pravidlá prístupu a konfiguračné súbory netreba synchronizovať.",
  },

  noApiSplitQuote: "Ľudia aj AI používajú ten istý nástroj cez jedno API.",

  demoSection: {
    title: "Živá ukážka: Thea vytvorí koncový bod",
    subtitle: "Ukážem ti, ako tento vzor vyzerá v praxi.",
    theaIntro:
      "Thea je správkyňa platformy s AI. Beží v produkcii nepretržite a používa tie isté kontrakty koncových bodov ako ostatní používatelia. Platí pre ňu rovnaká validácia aj oprávnenia, bez zadných vrátok. Prácu môže zveriť lokálnemu počítaču.",
    demoStory:
      "Požiadal som Theu, aby pomocou Claude Code na mojom počítači vytvorila koncový bod explain-to-my-boss. Zadáš technické rozhodnutie a dostaneš zdôvodnenie, ktorému uverí aj tvoj nadriadený. Každý vývojár už niečo také potreboval.",

    flow: {
      step1: {
        actor: "Ty",
        label: "Požiadaš Theu",
        description:
          "Zadaj úlohu do četu. Dve vstupné polia, jedna odpoveď od AI, všetky platformy, MCP_VISIBLE a vlastné widgety pre React a CLI.",
      },
      step2: {
        actor: "Thea",
        label: "Vytvorí úlohu",
        description:
          'Thea uvažuje nahlas, vytvorí úlohu s targetInstance="hermes" (tvoj lokálny počítač) a pozastaví sa.',
      },
      step3: {
        actor: "Lokálny Hermes",
        label: "Prevezme úlohu",
        description:
          "Lokálna inštancia sa synchronizuje každých 60 sekúnd. Nepotrebuješ otvorené porty. Spojenie iniciuje tvoj počítač.",
      },
      step4: {
        actor: "Claude Code",
        label: "Vytvorí koncový bod",
        description:
          "Interaktívna relácia. Najprv si prečíta existujúce vzory, potom vytvorí päť súborov a spustí vibe check. Nula chýb.",
      },
      step5: {
        actor: "Claude Code",
        label: "Nahlási dokončenie",
        description:
          "Zavolá complete-task s ID úlohy, stavom completed a priloženým zhrnutím.",
      },
      step6: {
        actor: "Thea",
        label: "Prebudí sa",
        description:
          "Spustí sa wakeUp. Thea cez WebSocket nadviaže na rozpracovaný rozhovor, priebežne posiela odpoveď a TTS ju číta nahlas.",
      },
      step7: {
        actor: "Výsledok",
        label: "Funguje všade",
        description:
          "Webový formulár, príkaz CLI, nástroj MCP a obrazovka React Native. Všetko funguje hneď. Z piatich súborov.",
      },
    },

    proofTitle: "Výsledok ukážky",
    proofPara:
      "Keď Claude Code zavolal complete-task, vznikli tri veci, ktoré pred piatimi minútami neexistovali.",
    proof1:
      "Vlastný widget React s dramatickým nadpisom, animovaným farebným prechodom na odpovedi AI a vymysleným skóre súladu s firemnou stratégiou.",
    proof2:
      "Widget CLI s ASCII bannerom a animáciou počas uvažovania AI. Zdôvodnenie sa vypisuje po riadkoch nazeleno.",
    proof3:
      "Nástroj explain-to-my-boss_POST sa objavil v MCP vďaka MCP_VISIBLE v definícii. Claude Desktop teraz môže zdôvodniť tvoje rozhodnutia šéfovi v tvojom mene.",
    proofClosing:
      "Jedna definícia, spolu päť súborov a tri úplne odlišné rozhrania. Kontrakt koncového bodu zostal rovnaký. Zmenila sa iba prezentačná vrstva.",
  },

  underTheHoodSection: {
    title: "Ako to funguje",
    definitionTitle: "definition.ts je kontrakt za behu",
    definitionPara:
      "Každá platforma číta definíciu za behu. Zmena sa prejaví všade. Ak priečinok odstrániš, závislé časti sa nepokazia. Netreba upratovať vygenerovaný kód.",
    repositoryTitle: "repository.ts: žiadny `throw`",
    repositoryPara:
      "Funkcie repozitára nikdy nevyhadzujú výnimky. Chyby sa vracajú ako explicitné typované údaje, ktoré vie volajúci spracovať. AI vie uvažovať aj o tom, čo sa stane pri zlyhaní. Žiadne nečakané výnimky.",
    repositoryCodeComment: "// Vracia ResponseType<T> a nevyhadzuje výnimky",
    routeTitle: "route.ts spája definíciu s obsluhou",
    routePara:
      "route.ts prepojí definíciu s obslužnou funkciou. endpointsHandler sa postará o validáciu, overenie prístupu, logovanie a sprístupnenie na všetkých 13 platformách. Samotná aplikačná logika má jeden riadok.",
    statsTitle: "V číslach",
    statEndpoints: "374 koncových bodov",
    statEndpointsDetail: "Jeden vzor použitý 374-krát",
    statAny: "Ani jedno `any`",
    statAnyDetail: "Vynútené pri zostavení",
    statLanguages: "Tri jazyky",
    statLanguagesDetail:
      'Kontrola pri kompilácii: t("typo.here") vyvolá chybu kompilátora',
    statsClosing: "Pravidlá sa vynucujú pri zostavení.",
  },

  onePatternQuote: "Jeden vzor. Použitý 374-krát.",

  vibeSenseTeaser: {
    eyebrow: "Ďalej",
    title: "Vibe Sense: platforma z koncových bodov",
    description:
      "Každý uzol grafu Vibe Sense je bežný koncový bod next-vibe. Rovnaké createEndpoint(), rovnaká štruktúra 3 súborov. Indikátor EMA aj vyhodnotenie prahu sú koncové body. Môžeš ich volať z CLI, cez AI aj z ostatných rozhraní.",
    calloutLine: "Dátový tok tvoria koncové body platformy.",
    teaser:
      "Vibe Sense pridáva ďalšie koncové body. Rovnaký prístup používa na časové rady, konverzné lieviky kontaktov, tok kreditov aj rast používateľskej základne. Platforma sleduje samu seba.",
    cta: "Späť na blog",
  },

  closing: {
    title: "Jedna definícia pre všetky platformy",
    para: "WordPress dal každému možnosť publikovať. S next-vibe môžeš vytvárať platformy pre web, mobil, CLI, agentov AI a automatizáciu. Sami sa monitorujú, vyhodnocujú svoje údaje a reagujú na zistenia.",
    cta: "Pridať hviezdičku next-vibe na GitHube",
    frameworkCta: "Preskúmať next-vibe",
  },
};
