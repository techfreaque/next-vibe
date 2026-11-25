import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "LLM bez cenzúry online. Bez GPU a inštalácie | {{appName}}",
    description:
      "Koľko VRAM potrebujú lokálne modely, ktoré abliterované a necenzurované LLM fungujú v prehliadači a koľko stojí správa.",
    category: "Sprievodca modelmi",
    imageAlt:
      "Jazykový model bez cenzúry beží online bez vlastnej grafickej karty",
    keywords:
      "LLM bez cenzúry online, LLM bez GPU, online alternatíva k lokálnym LLM, AI bez cenzúry bez GPU, abliterovaný model online, model bez cenzúry v prehliadači, VRAM pre lokálne LLM, alternatíva k Ollama, alternatíva k LM Studio, {{appName}}",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Sprievodca modelmi",
    readTime: "8 min čítania",
    title: "Jazykový model bez cenzúry online. Bez GPU a inštalácie.",
    subtitle:
      "Čo od hardvéru vyžaduje lokálny model bez cenzúry a ktoré alternatívy ({{count}}) môžeš spustiť v prehliadači? Ceny a kontext berieme priamo z registra.",
  },
  intro: {
    lead: "Každý návod na necenzurované modely radí to isté: stiahni si model a spusti ho u seba. Potom pozrieš na grafickú kartu. Veľké modely potrebujú viac pamäte, než má herný počítač. Tie menšie sa zmestia, no najviac chvály zvyčajne zbierajú veľké.",
    p2: "Rovnaký typ modelov môže bežať aj na serveri. Tebe stačí karta v prehliadači. Vyhneš sa grafickej karte, ovládačom aj sťahovaniu 40 GB dát. Pozri sa, čo si vyžaduje lokálne spustenie, kedy má zmysel a ktoré modely bez cenzúry sú práve dostupné na {{appName}} ({{count}}).",
  },
  table: {
    model: "Model",
    context: "Kontext",
    price: "Za správu",
  },
  hardware: {
    title: "Čo potrebuješ na lokálne spustenie",
    intro:
      "Rozhoduje pamäť. Aby model bežal použiteľnou rýchlosťou, jeho váhy sa musia zmestiť do VRAM grafickej karty alebo do zjednotenej pamäte Macu. Tu sú modely bez cenzúry z nášho katalógu, pri ktorých poznáme počet parametrov.",
    colParams: "Parametre",
    colMemory: "Váhy pri 4 a 8 bitoch",
    paramsValue: "{{count}}B",
    memoryValue: "{{q4}} GB / {{q8}} GB",
    unknown: "Nezverejnené",
    footnote:
      "Tabuľka počíta iba váhy podľa počtu parametrov. Na miliardu parametrov pripadá približne 0,5 GB pri 4 bitoch a 1 GB pri 8 bitoch. Ďalšiu pamäť potrebuje kontext (KV cache) aj beh modelu. Pri dlhom čete môže byť spotreba oveľa vyššia.",
    small:
      "Približne do 12 GB váh: stačí 16 GB grafická karta a ostane miesto aj na kontext.",
    mid: "20 až 40 GB: pri 4 bitoch a krátkom kontexte môže stačiť 24 GB karta. Ďalšou možnosťou sú dve karty alebo Mac s veľkou zjednotenou pamäťou.",
    large:
      "Stovky GB: takéto modely sa do bežného počítača nezmestia. Pri najväčších modeloch je praktické použiť ich na serveri.",
    callout:
      "Kvantizácia zmenší súbor za cenu istej straty kvality. Od 4-bitovej verzie stredne veľkého modelu čakaj iné výsledky než od plného modelu v cloude.",
  },
  local: {
    title: "Kedy má zmysel spustiť model lokálne",
    intro:
      "Lokálne spustenie má svoje výhody aj nároky. Ak ti stačí hardvér, nástroje ako Ollama či LM Studio ti ho uľahčia.",
    winsTitle: "Výhody lokálneho spustenia",
    offline:
      "Funguje offline, bez internetu, účtu a poskytovateľa. Dáta ostávajú v počítači.",
    catchTitle: "S čím treba rátať",
    verdict:
      "Máš silnú grafickú kartu, chceš úplné súkromie a stačí ti stredne veľký model? Spusti ho lokálne. Ak chceš veľký model, dlhý kontext alebo odpoveď do minúty, použi ho online.",
  },
  online: {
    title: "Modely bez cenzúry dostupné v prehliadači ({{count}})",
    intro:
      "Všetky aktuálne modely bez cenzúry na {{appName}}, od najlacnejšieho. Kontext a cena za správu sú priamo z registra modelov. Kliknutím na model otvoríš čet.",
    colChat: "Vyskúšať",
    chatLink: "Četovať s modelom {{model}}",
    footnote:
      "Cena za správu vychádza z referenčnej výmeny u najlacnejšieho poskytovateľa. Dlhé čety aj odpovede stoja viac. Všetky modely bežia na serveroch, takže notebooku stačí prehliadač.",
    directoryLink: "Všetky abliterované modely, ich kontext a ceny",
  },
  steps: {
    title: "K prvej odpovedi za minútu",
    intro: "Začneš bez sťahovania aj bez účtu.",
    open: {
      title: "Otvor čet",
      body: "Klikni na ľubovoľný model vyššie alebo spusti inkognito čet. Aj bez účtu máš každý mesiac {{guestCredits}} kreditov zdarma.",
    },
    pick: {
      title: "Vyber model",
      body: "V ponuke vyber model z kategórie bez cenzúry. Vymeň ho kedykoľvek počas rozhovoru. História četu zostane zachovaná.",
    },
    confirm: {
      title: "Potvrď vek 18+",
      body: "Stačí raz potvrdiť vek 18+ a prijať podmienky. Modely bez cenzúry potom zostanú odomknuté.",
    },
    ask: {
      title: "Polož otázku priamo",
      body: "Spýtaj sa na to, čomu sa iní asistenti vyhýbajú. Nemusíš obchádzať filtre ani zadávať modelu fiktívnu rolu.",
    },
  },
  kinds: {
    title: "Dva typy modelov bez cenzúry. Oba nájdeš online.",
    intro: "Záleží na tom, ako model upravili alebo na čom ho trénovali.",
    abliterated:
      "Abliterované a doladené verzie vychádzajú z bežných alebo otvorených modelov. Úpravy im pomáhajú odpovedať aj na otázky, ktorým sa predtým vyhýbali. Základný tréning aj svetonázor si ponechávajú.",
    own: "{{ownModel}} sa trénoval na knihách a dokumentoch zakázaných na bežnom internete, preto zastáva odlišné politické názory. Online ho prevádzkuje uncensored.ai.",
    link: "Ako sa líšia abliterované modely, doladené modely a modely s vlastným svetonázorom",
  },
  privacy: {
    title: "Kto vidí tvoje zadania pri používaní online",
    intro:
      "Online model beží na cudzom serveri. Takto sa k nemu dostane tvoja správa.",
    transit:
      "Každá správa prechádza cez náš server k poskytovateľovi, ktorý model prevádzkuje. Poskytovateľ vidí zadanie a spracúva ho podľa vlastných podmienok. Takto fungujú všetky online služby s AI.",
    incognito:
      "Inkognito čety ostávajú len v lokálnom úložisku prehliadača. Po vymazaní údajov prehliadača zmiznú.",
    selfHost:
      "{{appName}} má otvorený zdrojový kód. Ak dáta nesmú opustiť tvoj počítač, prevádzkuj si aplikáciu sám a pripoj k nej vlastné lokálne modely.",
    selfHostLink: "Prevádzkuj {{appName}} na vlastnom zariadení",
    callout:
      "Ak zadanie nesmie opustiť tvoje zariadenie, spusti model lokálne. V ostatných prípadoch sa k odpovedi dostaneš rýchlejšie online.",
  },
  cost: {
    title: "Koľko stojí lokálne spustenie a používanie online",
    intro:
      "Pri lokálnom spustení platíš za hardvér. Jednotlivé správy cenu nemajú.",
    guest:
      "Online máš každý mesiac {{guestCredits}} kreditov zdarma bez účtu alebo {{freeCredits}} s bezplatným účtom.",
    plan: "Plány od {{subPrice}} mesačne. K aktívnemu plánu si môžeš dokúpiť kredity, ktoré nevypršia.",
    local:
      "Lokálne správy sú zdarma. Grafická karta, ktorá zvládne veľké modely, však stojí viac než roky četovania online. A spotrebúva elektrinu.",
  },
  pairs: {
    title: "Základný model a jeho verzia bez cenzúry",
    intro:
      "Rovnaký vývojár, rovnaká veľkosť, odstránené mechanizmy odmietania. Porovnaj kontext, cenu aj filtre.",
    link: "{{a}} a {{b}}",
  },
  faq: {
    title: "Časté otázky",
    gpu: {
      q: "Môžem používať LLM bez cenzúry aj bez GPU?",
      a: "Áno. Vyber si online model. Beží na serveroch poskytovateľa a tebe stačí prehliadač. Na {{appName}} tak máš prístup k modelom bez cenzúry ({{count}}) vrátane najväčších, ktoré sa do domáceho počítača nezmestia.",
    },
    free: {
      q: "Existuje LLM bez cenzúry, ktorý môžem používať online zadarmo?",
      a: "Na {{appName}} máš každý mesiac {{guestCredits}} kreditov zdarma bez účtu alebo {{freeCredits}} s bezplatným účtom. Počet správ závisí od modelu aj dĺžky četu. Pri modeloch bez cenzúry stačí raz potvrdiť vek 18+.",
    },
    vram: {
      q: "Koľko VRAM potrebujem na lokálne spustenie modelu bez cenzúry?",
      a: "Podľa orientačného pravidla na váhy potrebuješ asi 0,5 GB na miliardu parametrov pri 4 bitoch a 1 GB pri 8 bitoch. Pri 4 bitoch potrebuje model s 24 miliardami parametrov asi 12 GB a model so 70 miliardami asi 35 až 40 GB. Kontext a samotný beh modelu potrebujú ďalšiu pamäť.",
    },
    private: {
      q: "Aké súkromie mám pri používaní LLM bez cenzúry online?",
      a: "Menej než pri lokálnom modeli. Poskytovateľ modelu vidí tvoje zadanie. Na {{appName}} ostávajú inkognito čety len v úložisku prehliadača. Ak zadanie nesmie opustiť počítač, spusti si model lokálne.",
    },
    offline: {
      q: "Môžem používať model bez cenzúry offline?",
      a: "Áno, ak ho spustíš lokálne. Stiahni si model, ktorý sa zmestí do pamäte, a použi nástroj ako Ollama alebo LM Studio.",
    },
    truly: {
      q: "Sú abliterované modely naozaj bez cenzúry?",
      a: "Prestanú odmietať otázky, no ponechajú si tréning aj svetonázor pôvodného modelu. {{ownModel}} sa trénoval na knihách a dokumentoch zakázaných na bežnom internete, preto zastáva odlišné politické názory.",
    },
    chatLink: "Čet s AI bez cenzúry v prehliadači",
    platformsLink:
      "Porovnanie platforiem AI bez cenzúry vrátane nástrojov na lokálne spustenie",
  },
  cta: {
    title: "Nič nesťahuj. Spýtaj sa rovno.",
    subtitle:
      "Každý mesiac máš {{guestCredits}} kreditov zdarma aj bez účtu. Vyber si model bez cenzúry a kedykoľvek ho vymeň.",
    start: "Začať čet bez cenzúry",
    models: "Porovnať všetky modely",
  },
};
