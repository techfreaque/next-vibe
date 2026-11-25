import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Tvoja AI odovzdá úlohu Claude Code | {{appName}}",
    description:
      "Nástroj coding-agent odovzdá skutočné úpravy kódu Claude Code alebo OpenCode. Bez rozhrania aj naživo v termináli, teraz aj medzi inštanciami.",
    category: "Programovací agent",
    imageAlt: "Interaktívny programovací agent Claude Code v okne terminálu",
    keywords:
      "programovací agent, Claude Code, OpenCode, terminál s AI, MCP complete-task, vlastný hosting AI, next-vibe, {{appName}}",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Programovací agent",
    readTime: "5 min čítania",
    title: "Tvoja AI otvorí terminál a odovzdá úlohu Claude Code.",
    subtitle:
      "Programovací agent vie meniť kód priamo. Nástroj coding-agent ho prepojí s četom. V interaktívnom režime môžeš jeho prácu sledovať v termináli.",
  },
  intro: {
    p1: "Požiadaš AI, aby opravila zlyhávajúci test. Bežný čet ti vysvetlí, ako na to. Claude Code a OpenCode dokážu upraviť kód, spustiť testy a pokračovať, kým všetky prejdú.",
    p2: "Nástroj coding-agent zadá úlohu jednému z nich na počítači, kde sa nachádza kód, a vráti výsledok do tvojho četu.",
  },
  modes: {
    title: "Dva režimy",
    intro: "Vyber si medzi spracovaním na pozadí a prácou naživo.",
    batch: {
      label: "Predvolený",
      title: "Dávkový",
      body: "Beží bez rozhrania. Zachytí celý výstup agenta a vráti ho do četu. Po 30 minútach sa zastaví.",
    },
    interactive: {
      label: "Sleduj a usmerňuj",
      title: "Interaktívny",
      body: "Otvorí terminál so živou reláciou. Môžeš sledovať prácu, odpovedať na otázky a meniť smer. Relácia nemá časový limit. Po ohlásení dokončenia sa výsledok vráti do tvojho vlákna.",
    },
  },
  handBack: {
    title: "Ako sa výsledok vráti do četu",
    intro:
      "Terminál beží v samostatnom procese. Aj tak sa odpoveď vráti do správneho vlákna.",
    step1Title: "AI zavolá nástroj",
    step1Body: "Odovzdá mu tvoje zadanie a zapne interaktívny režim.",
    step2Title: "Vznikne sledovaná úloha",
    step2Body: "Vlákno čaká na dokončenie úlohy nezávisle od terminálu.",
    step3Title: "Otvorí sa okno terminálu",
    step3Body:
      "Na macOS sa otvorí Terminal. Na Linuxe sa použije $TERMINAL alebo prvý dostupný emulátor. Vo Windowse sa otvorí nová konzola PowerShell.",
    step4Title: "Agent dostane pokyny",
    step4Body:
      "Zadanie dostane jeden riadok navyše. Po dokončení zavolaj complete-task na serveri MCP tejto inštancie s identifikátorom úlohy.",
    step5Title: "Výsledok sa vráti do vlákna",
    step5Body: "complete-task doručí výstup a čet pokračuje.",
    codeCaption:
      "Tento riadok sa pridá ku každému interaktívnemu zadaniu pre Claude Code:",
  },
  whatsNew: {
    title: "Nové: funguje aj medzi inštanciami",
    intro:
      "Thea v cloude teraz môže poveriť Hermesa na tvojom počítači spustením programovacej relácie.",
    item1:
      "Na vzdialenej inštancii relácia beží ako sledovaná úloha na pozadí, takže počas práce v termináli nič neblokuje.",
    item2:
      "Keď relácia ohlási dokončenie cez complete-task, skutočný výsledok dostane inštancia, ktorá o úlohu požiadala.",
    item3:
      "Vo Windowse sa otvorí skutočné okno konzoly. Príkaz sa najprv zapíše do skriptu PowerShell, aby sa v zadaní zachovali úvodzovky, zložené zátvorky a nové riadky.",
    item4:
      "Relácia spustená na lokálnom počítači môže ohlásiť výsledok ktorejkoľvek úlohy, ktorú vlastní jej vlastná inštancia.",
    item5:
      "Ak chýba aktívne spojenie na odovzdanie výsledku, interaktívny režim prejde na dávkový. Volajúci tak odpoveď dostane aj vtedy.",
  },
  tryIt: {
    title: "Vyskúšať",
    p1: "Nástroj je dostupný len správcom inštancií na vlastnom hostingu. Programovací nástroj CLI spúšťa s plnými oprávneniami v priečinku projektu. Na danom počítači musíš mať nainštalovaný Claude Code alebo OpenCode a byť v ňom prihlásený.",
    p2: "Potom sa opýtaj v čete alebo ho zavolaj priamo z terminálu:",
  },
  cta: {
    title: "Zadaj AI úpravu kódu priamo z četu",
    subtitle:
      "Spusti next-vibe na vlastnom počítači, raz sa prihlás do Claude Code a nechaj AI upravovať kód priamo tam.",
    selfHost: "Návod na vlastný hosting",
    framework: "Preskúmať next-vibe",
  },
};
