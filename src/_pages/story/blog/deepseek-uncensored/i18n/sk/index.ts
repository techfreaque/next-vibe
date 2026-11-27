import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "DeepSeek bez cenzúry online | {{appName}}",
    description:
      "Kde DeepSeek filtruje odpovede, prečo zmena poskytovateľa rieši iba časť problému a ktoré verzie DeepSeek bez cenzúry fungujú bez GPU aj účtu.",
    category: "Sprievodca modelmi",
    imageAlt:
      "Necenzurovaný DeepSeek: pôvodný model a verzie s odstráneným odmietaním odpovedí",
    keywords:
      "necenzurovaný DeepSeek, DeepSeek bez cenzúry, upravený DeepSeek, DeepSeek V4.1 Flash Uncensored, cenzúra v DeepSeek, DeepSeek a námestie Tchien-an-men, necenzurovaný DeepSeek online, alternatíva k obchádzaniu filtrov v DeepSeek, {{appName}}",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Sprievodca modelmi",
    readTime: "7 min čítania",
    title: "DeepSeek bez cenzúry. Čo ovplyvňuje jeho filtre.",
    subtitle:
      "Porovnaj pôvodný DeepSeek s upravenými verziami bez cenzúry ({{count}}). Cena od {{buildPrice}} za správu, priamo v prehliadači.",
  },
  intro: {
    lead: "DeepSeek je rýchly, lacný a zvláda kód. Pri niektorých témach však stíchne, zmení tému alebo vymaže vlastnú odpoveď.",
    p2: "Toto správanie má dve príčiny. Väčšina riešení ovplyvní iba jednu. Ukážeme, kde vznikajú filtre, aké tri možnosti máš a ktoré necenzurované verzie DeepSeek sú aktuálne dostupné na {{appName}} aj s cenami.",
  },
  where: {
    title: "Kde vzniká cenzúra v DeepSeek",
    intro: "Obmedzenia majú dve vrstvy a každá funguje inak.",
    app: "Prvá vrstva je v aplikácii. Vlastný čet aj web DeepSeek používajú moderovanie navyše. Pri témach citlivých v Číne sa môže odpoveď prerušiť uprostred vety alebo ju nahradí pripravený text.",
    weights:
      "Druhá vrstva je v samotných váhach modelu. DeepSeek sa podobne ako iné bežné modely počas tréningu naučil niektoré témy obchádzať a niektoré požiadavky odmietať. Toto správanie si zachováva na každom serveri.",
    hosts:
      "Iní poskytovatelia. Keďže DeepSeek zverejňuje váhy, ďalšie firmy môžu prevádzkovať rovnaký model bez moderovania pôvodnej aplikácie. Živé mazanie odpovede zmizne. Naučené odmietanie zostane.",
    callout:
      "Na inom serveri sa zbavíš filtra aplikácie. Naučené odmietanie odpovedí však rieši až upravená verzia modelu.",
  },
  ways: {
    title: "Tri možnosti, ako používať DeepSeek bez filtra aplikácie",
    intro: "Od najprácnejšej po najjednoduchšiu.",
    localTitle: "1. Spusti otvorené váhy na vlastnom hardvéri",
    local:
      "Plné modely DeepSeek sú pre bežnú domácu grafickú kartu príliš veľké. Väčšina malých modelov na stiahnutie s menom DeepSeek je destilovaná: základom je Qwen či Llama dotrénovaná na výstupoch DeepSeek. Môžu byť užitočné, ale ide o iný model s inými odmietavými odpoveďami.",
    hostedTitle: "2. Použi pôvodný DeepSeek od iného poskytovateľa",
    hosted:
      "Aplikácia už nebude počas písania mazať výstup, no model sa naďalej môže vyhýbať témam, na ktoré ho tak naučili reagovať. Na programovanie a bežnú prácu to stačí. Ak ti prekážajú samotné odmietavé odpovede, zmena hostingu ich neodstráni.",
    buildTitle: "3. Vyber si necenzurovanú verziu",
    build:
      "Ide o úpravu pôvodných váh DeepSeek, ktorá obmedzuje odmietavé odpovede. Najčastejšie sa používa metóda nazývaná abliteration. Zachová sa model, rýchlosť aj veľkosť kontextového okna. Pri hostovanej verzii nič neinštaluješ.",
    noGpuLink:
      "Použiť necenzurovaný jazykový model online bez vlastnej grafickej karty",
  },
  models: {
    title: "Modely DeepSeek na tejto platforme",
    intro:
      "Najprv sú necenzurované verzie, potom pôvodné modely, z ktorých vychádzajú. Údaje sa načítavajú priamo z nášho katalógu.",
    colModel: "Model",
    colContext: "Kontext",
    colStrengths: "Silné stránky",
    colPrice: "Za správu",
    colChat: "Vyskúšať",
    chatLink: "Četovať s {{model}}",
    footnote:
      "Cena jednej referenčnej správy už zahŕňa našu prirážku {{markup}} %. Pod názvom modelu nájdeš označenie, ako jeho verzia vznikla.",
  },
  builds: {
    title: "Necenzurované verzie DeepSeek: {{count}}",
    intro: "Rovnaká rodina modelov, rôzni autori úprav.",
    venice:
      "Verziu prevádzkuje Venice.ai. Odmietanie odpovedí je odstránené a volanie nástrojov zostalo zachované. Silné stránky: {{strengths}}. Referenčná správa stojí {{price}}.",
    csf: "Verziu upravil nezávislý vývojár jcartu. Podporuje uvažovanie aj volanie nástrojov. Silné stránky: {{strengths}}. Referenčná správa stojí {{price}}.",
    chatLink: "Četovať s {{model}}",
    abliteration:
      "Pri metóde abliteration sa vo vnútorných aktiváciách modelu nájde smer spojený s odmietavou odpoveďou a odstráni sa jeho vplyv z váh. Ostatné naučené schopnosti sa majú zachovať. Preto aj upravený DeepSeek naďalej programuje podobne ako pôvodný.",
    explainerLink: "Ako sa líšia upravené a necenzurované modely",
  },
  compare: {
    title: "Pôvodný a necenzurovaný DeepSeek vedľa seba",
    intro:
      "Kontext, cena, silné stránky aj odmietanie odpovedí na jednej stránke. Potom pošli obom rovnakú otázku.",
    link: "{{a}} a {{b}}",
  },
  limits: {
    title: "Čo úprava modelu nezmení",
    intro:
      "Odstránením odmietania sa vyrieši jeden konkrétny problém. Ostatné vlastnosti zostávajú.",
    knowledge:
      "Znalosti. Model vychádza z údajov, na ktorých sa učil. Odstránenie odmietania mu nepridá fakty, s ktorými sa počas tréningu nestretol.",
    slant:
      "Názorové zameranie. Úprava odmietania nemení postoje zdedené z tréningových údajov. Iný prístup ponúka {{ownModel}}. Učil sa aj z kníh a dokumentov zakázaných na hlavných internetových platformách a vyjadruje odlišné politické postoje.",
    mistakes:
      "Chyby. Necenzurovaný model sa môže mýliť rovnako ako pôvodný. Dôležité fakty si over.",
    callout:
      "Necenzurované modely sa sprístupnia po jednorazovom potvrdení veku 18+. O tom, ako odpovede použiješ, rozhoduješ ty.",
  },
  faq: {
    title: "Časté otázky",
    censored: {
      q: "Je DeepSeek cenzurovaný?",
      a: "Áno, v dvoch vrstvách. Vlastná aplikácia DeepSeek moderuje odpovede na témy citlivé v Číne. Samotný model je navyše natrénovaný niektorým témam sa vyhnúť alebo požiadavku odmietnuť. Iný hosting odstráni prvú vrstvu. Druhú rieši až necenzurovaná verzia.",
    },
    exists: {
      q: "Existuje necenzurovaný DeepSeek?",
      a: "Áno. Na {{appName}} sú dostupné necenzurované verzie DeepSeek ({{count}}) vrátane {{buildName}}. Zachovávajú si schopnosti aj kontextové okno pôvodného modelu a odpovedajú priamejšie.",
    },
    local: {
      q: "Môžem si necenzurovaný DeepSeek spustiť doma?",
      a: "Iba s výkonným hardvérom. Plné modely potrebujú oveľa viac pamäte než bežný herný počítač. Menšie modely s menom DeepSeek sú väčšinou odvodené z iných základov. Pri hostovanej verzii vlastný hardvér neriešiš.",
    },
    china: {
      q: "Odpovie necenzurovaný DeepSeek na otázky o Číne?",
      a: "Práve naučené vyhýbanie sa týmto témam je jedným z prejavov, ktoré sa pri úprave potláčajú. Kvalita odpovede však stále závisí od toho, čo sa model naučil. Pošli rovnakú otázku modelu {{stockName}} aj necenzurovanej verzii a porovnaj výsledok.",
    },
    api: {
      q: "Môžem necenzurovaný DeepSeek používať cez API?",
      a: "Áno. Tie isté verzie fungujú cez koncové body kompatibilné s rozhraniami OpenAI aj Anthropic. Prvý nákup odomkne kľúče API. Predplatné sa začína od {{apiSubPrice}} mesačne.",
    },
    free: {
      q: "Môžem si ho vyskúšať zdarma?",
      a: "Áno. Bez účtu dostaneš mesačne {{guestCredits}} kred. zdarma a s bezplatným účtom {{freeCredits}}, {{maxCredits}} pri odbere noviniek. Na lacnejších modeloch to stačí na veľa správ.",
    },
    directoryLink: "Všetky abliterované modely, ich kontext a ceny",
    bestLink: "Ako vybrať necenzurovaný jazykový model podľa úlohy",
    refusalLink: "Index odmietnutí: ktoré modely odpovedajú",
  },
  cta: {
    title: "Schopnosti DeepSeek. Priame odpovede.",
    subtitle:
      "Každý mesiac môžeš bez účtu využiť {{guestCredits}} bezplatných kreditov. Začni s {{buildName}}.",
    start: "Začať čet s necenzurovaným DeepSeek",
    models: "Porovnať všetky modely",
  },
};
