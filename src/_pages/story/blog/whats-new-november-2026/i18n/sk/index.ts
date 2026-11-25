import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Čo je nové: šesť mesiacov zmien | {{appName}}",
    description:
      "Okamžité zastavenie, hlas na iPhone, AI naprieč zariadeniami, vlastný hosting bez Dockeru a osem opravených bezpečnostných chýb.",
    category: "Novinky",
    imageAlt: "{{appName}}: novinky v novembri 2026",
    keywords:
      "{{appName}}, novinky v aplikácii, Hermes, Thea, PGlite, vlastný hosting, prepis reči, E2E testy, bezpečnosť",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Novinky",
    readTime: "6 min čítania",
    title:
      "Šesť mesiacov zmien: rýchlejšie a bezpečnejšie na viacerých zariadeniach",
    subtitle:
      "Zastavenie funguje okamžite. Hlas funguje na iPhone. AI pracuje naprieč počítačmi, vlastnú inštanciu spustíš bez Dockeru a testovací robot odhalil osem bezpečnostných chýb.",
  },
  intro: {
    lead: "Posledné novinky sme zverejnili v máji. Odvtedy sme prestavali kód od základov, zjednodušili štruktúru a celé mesiace opravovali chyby, na ktoré ľudia skutočne narážali.",
    p1: "Tu sú zmeny, ktoré pocítiš pri práci, zoradené podľa toho, kde ich využiješ.",
  },
  chat: {
    title: "Rýchlejší čet s lepším ovládaním",
    intro:
      "Opravili sme drobnosti, pre ktoré čet reagoval pomaly alebo nereagoval vôbec.",
    stop: {
      title: "Zastavenie je okamžité",
      body: "Stlač Zastaviť a tokeny hneď prestanú pribúdať, kým server ukončí spracovanie. Zastavenie už funguje aj v anonymných četoch a bez prihlásenia.",
    },
    input: {
      title: "Limit správy podľa modelu",
      body: "Pole správy zohľadňuje, koľko miesta má vybraný model ešte vo vlákne. Každý model tak môže využiť svoj kontext.",
    },
    reasoning: {
      title: "Modely nadväzujú na vlastné úvahy",
      body: "Bloky uvažovania posielame modelu aj pri ďalšej správe. Uvažujúce modely tak nadviažu na to, čo si už odvodili.",
    },
    queue: {
      title: "Píš, kým AI pracuje",
      body: "Správy môžeš odosielať počas odpovede AI. Zaradia sa za seba a spracujú v poradí. Pri dlhom behu nástrojov sa kontext priebežne zhrnie, aby nenarazil na limit.",
    },
  },
  voice: {
    title: "Hlas funguje na viacerých zariadeniach",
    intro: "Opravili sme prevod reči na text.",
    ios: {
      title: "Diktovanie na iPhone a iPade",
      body: "Safari v iOS pozastavoval spracovanie zvuku a diktovanie potichu prestalo fungovať. Teraz sa po prerušení obnoví.",
    },
    long: {
      title: "Nahrávaj, ako dlho potrebuješ",
      body: "Nahrávky sa delia na úseky. Diktovanie už neobmedzuje veľkosť jedného nahratia.",
    },
    windows: {
      title: "Diktovanie vo Windowse",
      body: "Po sérii opráv funguje prevod reči na text aj na počítačoch s Windowsom.",
    },
  },
  agents: {
    title: "Tvoja AI na viacerých počítačoch",
    intro:
      "Thea beží v cloude. Hermes beží na tvojom počítači. Teraz si môžu rozdeliť prácu.",
    twoWay: {
      title: "Vzdialené vlákna v oboch smeroch",
      body: "Vlákno môže prejsť z cloudu na tvoj počítač aj späť. Ak na druhej strane chýba kľúč API, spracovanie prevezme tvoja inštancia.",
      link: "Ako spolu komunikujú Hermes a Thea",
    },
    coding: {
      title: "Prácu programovacieho agenta vidíš naživo",
      body: "Thea môže na tvojom počítači otvoriť konzolu s interaktívnym programovacím agentom. Reláciu sleduje ako úlohu a po dokončení vráti výsledok.",
      link: "Pozrieť si programovacieho agenta",
    },
    tools: {
      title: "Lepšie nástroje",
      body: "Automatizácia prehliadača s emuláciou zariadení funguje lepšie. Vo Windowse pribudli nástroje pre pracovnú plochu. Nástroje SSH má teraz každý zákazník.",
    },
  },
  selfHost: {
    title: "Jednoduchší vlastný hosting",
    intro:
      "Vlastná inštancia už nepotrebuje Docker ani nástroje na kompiláciu C++.",
    pglite: {
      title: "Bez Dockeru",
      body: "Nasmeruj DATABASE_URL na súbor a server použije vstavaný Postgres (PGlite). Migrácie aj úvodné naplnenie databázy fungujú automaticky.",
    },
    windows: {
      title: "Plná podpora Windowsu",
      body: "Mesiace opráv ciest, zamykania súborov, tvorby úvodných používateľov a databázových funkcií. Stačí naklonovať repozitár, nainštalovať závislosti a spustiť.",
    },
    native: {
      title: "Bez kompilátora",
      body: "Hašovanie hesiel používa hotové binárne súbory. Nepotrebuješ node-gyp ani nástroje na zostavenie. Algoritmus sa nemení a uložené haše zostávajú platné.",
    },
    revive: {
      title: "Server sa obnoví sám",
      body: "Produkčný server sa po páde reštartuje. Samotný reštart databázy už aplikáciu nezhodí.",
    },
  },
  security: {
    title: "Vyššia bezpečnosť od začiatku",
    intro:
      "Tieto opravy pracujú na pozadí. Pri bežnej práci ich nemusíš riešiť.",
    e2e: {
      title: "Robot testuje každú stránku",
      body: "60 sád end-to-end testov prechádza skutočné stránky v prehliadači. Odhalili sme a opravili osem bezpečnostných chýb, od otvoreného presmerovania po súkromné súbory vo verejnej vyrovnávacej pamäti.",
      link: "Pozrieť si, čo testy odhalili",
    },
    patches: {
      title: "Opravy v základnom obraze",
      body: "Náš kontajner preberá najnovšie bezpečnostné opravy Alpine vrátane CVE-2026-111497.",
    },
    toolCalls: {
      title: "Menej chybných volaní nástrojov",
      body: "Keď model odošle neplatný JSON pri volaní nástroja, aplikácia ho opraví a spracovanie pokračuje.",
    },
  },
  cta: {
    title: "Vyskúšaj novinky",
    subtitle:
      "Všetky uvedené zmeny už fungujú na {{appName}} aj v otvorenom kóde pre vlastnú inštanciu.",
    chat: "Začať čet",
    selfHost: "Spustiť vlastnú inštanciu",
  },
};
