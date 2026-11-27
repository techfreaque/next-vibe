import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  compareHub: {
    title: "Porovnajte modely AI",
    description:
      "Porovnajte dostupné modely AI podľa ceny, kontextového okna, možností a filtrov obsahu.",
  },
  meta: {
    category: "Modely AI",
    index: {
      title: "Modely AI ({{count}}): ceny, kontext, filtre | {{appName}}",
      description:
        "Claude, GPT, Gemini, Grok, DeepSeek, otvorené aj necenzurované modely na {{appName}}. Čet, obrázky, hlas, hudba a video. Ceny, kontext a typy vstupov.",
      imageAlt: "Katalóg modelov AI na {{appName}}",
      keywords:
        "modely AI, porovnanie LLM, AI bez cenzúry, AI s otvoreným zdrojovým kódom, ceny AI, {{appName}}",
    },
    model: {
      title: "{{model}}: cena, API, kontext {{context}} | {{appName}}",
      titleShort: "{{model}}: cena, API, kontext {{context}}",
      titleMin: "{{model}}: cena a API",
      titleUncensored: "{{model}}: čet bez cenzúry, cena a API | {{appName}}",
      titleUncensoredShort: "{{model}}: čet bez cenzúry, cena a API",
      titleUncensoredMin: "{{model}}: čet bez cenzúry",
      titleLegacy: "{{model}}: cena a kontext (archív) | {{appName}}",
      titleLegacyShort: "{{model}}: cena a kontext (archív)",
      description:
        "{{model}} od {{lab}}: vstup {{input}}, výstup {{output}} za milión tokenov. Kontext {{context}}, asi {{credits}} kred. za správu. Kredity na štart zadarmo.",
      descriptionFlat:
        "{{model}} od {{lab}}: asi {{credits}} kred. ({{money}}) za správu, kontext {{context}}, kategória {{tier}}. Kredity na štart zadarmo.",
      descriptionUncensored:
        "{{model}} online bez inštalácie aj cez API. Vstup {{input}}, výstup {{output}} za milión tokenov. Kontext {{context}}. Kredity zadarmo aj bez účtu, potvrdenie veku 18+.",
      descriptionUncensoredFlat:
        "{{model}} online bez inštalácie aj cez API. Asi {{credits}} kred. ({{money}}) za správu. Kontext {{context}}. Kredity zadarmo aj bez účtu, potvrdenie veku 18+.",
      descriptionLegacy:
        "{{model}} od {{lab}} je v archíve. Nástupca: {{successor}}. Kontext {{context}}, asi {{credits}} kred. za správu. Parametre, cena a nástupca.",
      descriptionLegacyNoSuccessor:
        "{{model}} od {{lab}} je v archíve. Kontext {{context}}, asi {{credits}} kred. za správu. Parametre, cena a alternatívy.",
      imageAlt: "{{model}} na {{appName}}",
      keywords:
        "{{model}}, cena {{model}}, API {{model}}, kontextové okno {{model}}, AI {{lab}}, {{appName}}",
    },
    media: {
      title: "{{model}}: {{credits}} kred. za {{unit}} | {{appName}}",
      titleShort: "{{model}}: {{credits}} kred. za {{unit}}",
      titleMin: "{{model}}: cena za {{unit}}",
      titleNoPrice: "{{model}}: {{type}} s AI, cena a použitie | {{appName}}",
      titleNoPriceShort: "{{model}}: {{type}} s AI, cena a použitie",
      description:
        "{{model}} od {{lab}} ({{type}}). Za {{unit}}: {{credits}} kred. ({{money}}). Vstup: {{inputs}}. Vyskúšaj v nástroji alebo v čete s kreditmi zadarmo.",
      descriptionNoPrice:
        "{{model}} od {{lab}} ({{type}}), kategória {{tier}}. Cena za použitie v kreditoch. Vyskúšaj v nástroji alebo v čete s kreditmi zadarmo.",
      imageAlt: "{{model}} na {{appName}}",
      keywords:
        "{{model}}, cena {{model}}, AI {{lab}}, {{type}} model AI, {{appName}}",
    },
    compare: {
      title: "{{a}} vs. {{b}}: cena a kontext | {{appName}}",
      titleShort: "{{a}} vs. {{b}}: cena a kontext",
      titleMin: "{{a}} vs. {{b}}",
      description:
        "{{a}} ({{tierA}}) vs. {{b}} ({{tierB}}): cena za správu asi {{moneyA}} vs. {{moneyB}}, kontext {{contextA}} vs. {{contextB}}. Ktorý si vybrať?",
      descriptionShort:
        "{{a}} ({{tierA}}) vs. {{b}} ({{tierB}}): cena za správu asi {{moneyA}} vs. {{moneyB}}, kontext {{contextA}} vs. {{contextB}}.",
      imageAlt: "{{a}} vs. {{b}} na {{appName}}",
      keywords:
        "{{a}} vs. {{b}}, {{a}}, {{b}}, porovnanie modelov AI, {{appName}}",
    },
  },
  tiers: {
    mainstream: {
      name: "Bežné",
      line: "Modely veľkých laboratórií s vlastnými bezpečnostnými filtrami. Hodia sa na prácu, programovanie a výskum.",
    },
    open: {
      name: "Otvorené",
      line: "Modely s otvorenými váhami a miernejšími filtrami. Rozoberú viac tém a menej často odmietajú odpovedať.",
    },
    uncensored: {
      name: "Bez cenzúry",
      line: "Modely na voľnejšie rozhovory a tvorbu s menším množstvom obmedzení.",
    },
  },
  modality: {
    text: "Text",
    image: "Obrázky",
    audio: "Zvuk",
    video: "Video",
  },
  facts: {
    heading: "Parametre",
    type: "Typ modelu",
    lab: "Vývojár",
    tier: "Kategória filtrovania",
    intelligence: "Inteligencia",
    price: "Odhad ceny za správu",
    priceValue: "Približne {{credits}} kred. ({{money}})",
    priceFree: "Zadarmo",
    referenceTurn:
      "Referenčná správa so vstupom {{input}} tokenov a výstupom {{output}} tokenov.",
    referenceImageTurn:
      "Referenčná správa so vstupom {{input}} tokenov, textovým výstupom {{output}} tokenov a jedným vygenerovaným obrázkom.",
    priceProvider: "Zobrazené sú sadzby poskytovateľa {{provider}}.",
    conditionalPrice: "Podmienené ceny za milión tokenov",
    tierAt: "Od {{tokens}} vstupných tokenov: {{rates}}.",
    tierUtc: "Od {{start}} do {{end}} UTC: {{rates}}.",
    tierInput: "vstup {{price}}",
    tierOutput: "výstup {{price}}",
    tierRead: "čítanie z vyrovnávacej pamäte {{price}}",
    tierWrite: "zápis do vyrovnávacej pamäte {{price}}",
    tierHour: "zápis s platnosťou 1 h {{price}}",
    cacheReadSentence:
      "Vstup z vyrovnávacej pamäte stojí {{price}} za milión tokenov.",
    cacheWrite1hPrice:
      "Zápis do vyrovnávacej pamäte s platnosťou 1 h za milión tokenov",
    cacheWrite1hSentence:
      "Zápis do vyrovnávacej pamäte s platnosťou 1 h stojí {{price}} za milión tokenov.",
    cacheWriteSentence:
      "Zápis do vyrovnávacej pamäte stojí {{price}} za milión tokenov.",
    cacheReadPrice: "Vstup z vyrovnávacej pamäte za milión tokenov",
    cacheWritePrice: "Zápis do vyrovnávacej pamäte za milión tokenov",
    imageOutputPrice: "Obrazový výstup za milión tokenov",
    perMillionCredits: "Kredity: {{credits}}",
    priceFootnote:
      "Cena závisí od spotreby a poskytovateľa. Prepočet na menu používa sadzbu jednorazového balíka {{value}} za kredit.",
    context: "Kontextové okno",
    contextValue: "Počet tokenov: {{tokens}}",
    contextHint: "Rozsah textu v stranách: približne {{pages}}",
    inputs: "Typy vstupov",
    outputs: "Typy výstupov",
    providers: "Poskytovatelia",
    tools: "Volanie nástrojov",
    toolsYes: "Áno: vyhľadávanie, pamäť, kód a ďalšie",
    toolsNo: "Nie: iba chat",
    status: "Stav",
    statusCurrent: "Aktuálny",
    statusLegacy: "V archíve",
    tokenPrice: "Cena za milión tokenov",
    tokenPriceValue: "{{input}} za vstup, {{output}} za výstup",
    tokenPriceHint:
      "Kredity za vstup a výstup: {{inputCredits}} / {{outputCredits}}",
    parameters: "Veľkosť",
    parametersValue: "Počet parametrov: {{count}} mld.",
    strengths: "Silné stránky",
    uncensoredKind: "Typ modelu bez cenzúry",
    apiId: "ID modelu v API",
    apiIdHint:
      "API je kompatibilné s OpenAI aj Anthropic. Sprístupní ho platený plán alebo nákup kreditov.",
    apiIdLegacy: "Tento model už v API nie je. Použi {{successor}}.",
    apiIdLegacyNoSuccessor: "Tento model už v API nie je.",
    notListed: "Neuvedené",
    notUncensored: "S filtrami",
    fixedPrice: "Pevná cena za správu.",
    notPublished: "Nezverejnené",
    apiIdUnsupported: "Tento model nepatrí do API pre textový chat.",
  },
  strengths: {
    coding: "Programovanie",
    reasoning: "Uvažovanie",
    analysis: "Analýza",
    creative: "Tvorivé písanie",
    roleplay: "Hranie rolí",
    roleplayDark: "Temná fikcia",
    fast: "Rýchlosť",
    vision: "Práca s obrazom",
    imageGen: "Generovanie obrázkov",
  },
  uncensoredKind: {
    ownWorldview: {
      name: "Vlastný pohľad na svet",
      line: "Model sa učil z kníh a dokumentov, ktoré bežné internetové platformy zakazujú. Ponúka preto aj politické pohľady mimo hlavného prúdu.",
    },
    abliterated: {
      name: "Abliterovaný",
      line: "Váhy základného modelu boli upravené, aby model menej často odmietal odpovedať.",
    },
    fineTuned: {
      name: "Doladený",
      line: "Existujúci model bol doladený tak, aby jeho odpovede mali menej obmedzení.",
    },
    unlisted: {
      name: "Metóda neuvedená",
      line: "Model je v kategórii bez cenzúry. Spôsob trénovania ani filtrovania nie je uvedený.",
    },
  },
  units: {
    image: "obrázok",
    audio: "skladbu",
    video: "klip ({{seconds}} s)",
    videoClip: "klip",
    tts: "znaky ({{chars}})",
    stt: "zvuk ({{seconds}} s)",
  },
  bestFor: {
    heading: "Na čo sa {{model}} hodí",
    good: "Vyskúšaj ho na",
    skip: "Vyber iný model na",
    items: {
      coding: "Písanie, kontrolu a opravy kódu",
      reasoning:
        "Uvažovanie vo viacerých krokoch pri matematike, logike a plánovaní",
      analysis: "Výskum a analýzu rozsiahlych materiálov",
      creative: "Tvorivé písanie a hľadanie nápadov",
      roleplay: "Hranie rolí a interaktívnu fikciu",
      roleplayDark: "Temnú fikciu a tabuizované témy",
      fast: "Úlohy, pri ktorých záleží na rýchlej odpovedi",
      vision: "Čítanie snímok obrazovky, fotografií a skenov",
      videoInput: "Porozumenie videu",
      audioInput: "Spracovanie zvuku",
      imageGen: "Generovanie obrázkov v čete",
      longContext: "Prácu s celou knihou alebo repozitárom v jednom zadaní",
      budget: "Veľký objem práce pri malom rozpočte",
      tools: "Prácu agenta s nástrojmi na vyhľadávanie, pamäť a kód",
      uncensored: "Otázky, ktoré bežné modely odmietajú",
      ownWorldview: "Politické názory mimo hlavného prúdu",
    },
    skipItems: {
      noTools: "Prácu agenta, ktorá vyžaduje volanie nástrojov",
      noImages: "Úlohy s obrazovým vstupom",
      pricey: "Hromadné úlohy pri cene {{credits}} kred. za referenčnú správu",
      smallContext:
        "Veľmi dlhé dokumenty: kontextové okno pojme najviac {{tokens}} tokenov",
      filtered: "Témy, ktoré {{lab}} filtruje. Na ne použi model bez cenzúry",
      legacy: "Nové projekty. Tento model nahrádza {{successor}}",
      legacyNoSuccessor: "Nové projekty. Tento model je v archíve",
      coding: "Rozsiahle programovanie",
      analysis: "Podrobnú analýzu",
      reasoning: "Zložité uvažovanie",
      creative: "Tvorivé písanie",
      roleplay: "Hranie postáv",
    },
    media: {
      image: "Generovanie obrázkov",
      video: "Generovanie videoklipov",
      audio: "Generovanie hudby",
      tts: "Prevod textu na reč",
      stt: "Prepis nahratej reči",
      otherOutputs: "Úlohy, ktoré vyžadujú iný typ výstupu ako {{outputs}}",
    },
    picks: {
      claudeOpus:
        "Najvýkonnejší model Anthropic na náročnú prácu: veľké repozitáre, dôkladnú analýzu a písanie, pri ktorom záleží na úsudku. Správa stojí viac, preto ho vyber tam, kde rozhoduje kvalita.",
      claudeSonnet:
        "Claude na každý deň. Zvládne kód, analýzu aj písanie a stojí menej ako Opus. Pri bežnej práci ušetríš kredity.",
      claudeHaiku:
        "Rýchly a lacný Claude na krátke odpovede, súhrny a jednoduchý kód. Číta aj snímky obrazovky.",
      gptSol:
        "Použi Sol na každodenné programovanie, analýzu dokumentov a úlohy s nástrojmi. Prijíma text aj obrázky.",
      gptLuna:
        "Rýchly, cenovo dostupný model OpenAI na bežný chat a rýchle vyhľadávanie.",
      geminiArgon:
        "Špičkový model od Googlu, ktorý spracuje text, obrázky, video aj zvuk. Dobre uvažuje a programuje aj pri kombinovaní médií.",
      geminiFlash:
        "Rýchly Gemini spracuje aj obrázky, video a zvuk. Dobrý pomer ceny a výkonu pri analýze a programovaní.",
      grok: "Vlajkový model xAI s miernejšími filtrami než ostatné veľké laboratóriá. Dobre uvažuje, programuje a menej často odmieta odpovedať.",
      deepseekPro:
        "Veľký model DeepSeek zameraný na uvažovanie. Špičkový kód a analýza za zlomok ceny uzavretých vlajkových modelov.",
      deepseekFlash:
        "Jeden z najlacnejších výkonných modelov v ponuke. Rýchlo programuje a analyzuje, číta obrázky a je pripravený na veľký objem práce.",
      glm: "Otvorený model od Z.AI na programovanie a uvažovanie. Premyslené odpovede za nízku cenu.",
      kimi: "Vlajkový model Moonshot na uvažovanie, programovanie a tvorivé písanie. Spracuje aj obrázky a video.",
      qwenMax:
        "Vlajkový Qwen od Alibaba. Dobre uvažuje, programuje a analyzuje. Spracuje obrázky aj video.",
      mistralLarge:
        "Francúzsky vlajkový model Mistral. Zvládne kód aj analýzu a spracuje obrázky.",
      metaWonder:
        "Najvýkonnejší model od Meta. Spracuje text, obrázky, video aj zvuk a vyniká v uvažovaní, programovaní a tvorbe.",
      uncensoredLm:
        "Model bez cenzúry s vlastným pohľadom na svet. Učil sa z kníh a dokumentov, ktoré bežné internetové platformy zakazujú. Čakaj aj politické pohľady, ktoré ti veľké laboratóriá neponúknu.",
      glmUncensored:
        "Abliterovaný GLM 5.3 na uvažovanie, programovanie a analýzu. Podporuje volanie nástrojov.",
      glmFlashUncensored:
        "Abliterovaný GLM 5.3 Flash na rýchle odpovede a zadania s obrázkami.",
      deepseekFlashUncensored:
        "Abliterovaný DeepSeek V4.1 Flash na programovanie, analýzu a fikciu. Prijíma aj obrázky.",
      veniceUncensored:
        "Model od Venice doladený na rozhovory, tvorivé písanie a hranie rolí.",
    },
  },
  related: {
    heading: "Podobné modely",
    intro:
      "Od rovnakého vývojára, z rovnakej kategórie alebo za nižšiu cenu. Každý má vlastnú stránku.",
    reasons: {
      uncensored: "Verzia bez cenzúry",
      original: "Pôvodný model",
      cheaper: "Lacnejší v rovnakej kategórii",
      sameLab: "Tiež od {{lab}}",
      sameTier: "Rovnaká kategória",
      sameType: "Rovnaký typ",
    },
    perMessage: "Približne {{credits}} kred. za správu",
    perUse: "Cena za {{unit}} v kreditoch: {{credits}}",
  },
  plans: {
    heading: "Koľko stojí {{model}} pri jednotlivých plánoch",
    intro:
      "Model {{model}} stojí približne {{credits}} kred. ({{money}}) za referenčnú správu. Pozri si, koľko správ zvládneš mesačne s každým plánom.",
    mediaIntro:
      "Cena za {{unit}} pri modeli {{model}} v kreditoch: {{credits}} ({{money}}). Pozri si, koľko použití zvládneš mesačne s každým plánom.",
    messages: "Správy za mesiac",
    uses: "Použitia za mesiac",
    colPlan: "Plán",
    colPrice: "Cena za mesiac",
    colCredits: "Kredity za mesiac",
    guest: "Bez registrácie",
    account: "Bezplatný účet",
    free: "Zadarmo",
    about: "približne {{count}}",
    underOne: "menej ako 1",
    footnote:
      "Dlhé zadania, súbory a volania nástrojov zvyšujú spotrebu kreditov za správu. Rovnaké kredity platia pre všetky modely.",
    mediaFootnote:
      "Dĺžka, veľkosť alebo kvalita menia cenu za použitie. Rovnaké kredity platia pre všetky modely.",
  },
  nearest: {
    heading: "{{model}} a najbližšie alternatívy",
    intro:
      "Ceny, kontext a kategórie vedľa seba. Otvor porovnanie dvojice a pozri si podrobnosti.",
    colModel: "Model",
    colPrice: "Cena za správu",
    colCompare: "Priame porovnanie",
    thisModel: "Táto stránka",
  },
  faq: {
    heading: "{{model}}: otázky a odpovede",
    price: {
      q: "Koľko stojí {{model}}?",
      aTokens:
        "Referenčná správa cez {{provider}} stojí približne {{credits}} kred. ({{money}}). Cena za milión tokenov je {{input}} na vstupe a {{output}} na textovom výstupe.",
      aFlat:
        "Cena za správu cez {{provider}} v kreditoch: {{credits}} ({{money}}).",
      aFree: "Správy s modelom {{model}} nespotrebúvajú kredity.",
    },
    uncensored: {
      q: "Je {{model}} bez cenzúry?",
      mainstream:
        "Nie. Model {{model}} používa bezpečnostné filtre od {{lab}} a niektoré témy odmieta. Pri takých témach prepni v tom istom chate na model bez cenzúry.",
      open: "{{model}} patrí do kategórie otvorených modelov. Jeho odpovede môžu byť filtrované.",
      yes: "Áno.",
      consent:
        "Modely na chat bez cenzúry vyžadujú jednorazové potvrdenie veku 18+.",
    },
    api: {
      q: "Môžem používať {{model}} cez API?",
      a: "Áno. V API {{appName}} kompatibilnom s OpenAI aj Anthropic ho volaj ako {{id}}. Prístup získaš s plateným plánom alebo po nákupe kreditov.",
      legacy:
        "{{model}} je v archíve a v API sa už nezobrazuje. Použi {{successor}} ({{id}}). Prístup získaš s plateným plánom alebo po nákupe kreditov.",
      legacyNoSuccessor:
        "{{model}} je v archíve a už nie je dostupný cez API. Zoznam dostupných modelov vráti GET /v1/models.",
    },
    context: {
      q: "Aké veľké kontextové okno má {{model}}?",
      a: "Veľkosť kontextu v tokenoch: {{tokens}}. Rozsah textu v stranách: približne {{pages}}.",
    },
    providers: {
      q: "Kto na tejto platforme poskytuje {{model}}?",
      a: "Medzi dostupných poskytovateľov patria {{providers}}.",
    },
    inputs: {
      q: "Aké vstupy a výstupy podporuje {{model}}?",
      modalities: "Vstup: {{inputs}}. Výstup: {{outputs}}.",
      toolsYes: "Podporuje volanie nástrojov.",
      toolsNo: "Volanie nástrojov nie je dostupné.",
    },
    bestFor: {
      q: "Na čo sa {{model}} hodí?",
      a: "Vyskúšaj ho na tieto úlohy: {{items}}.",
    },
    cheaper: {
      q: "Existuje lacnejšia alternatíva k modelu {{model}}?",
      a: "{{other}} je v rovnakej kategórii a má rovnakú alebo vyššiu úroveň inteligencie. Pri referenčnej správe je cena v kreditoch približne {{otherCredits}} namiesto {{credits}}.",
    },
    free: {
      q: "Je {{model}} zadarmo?",
      a: "Model {{model}} môžeš vyskúšať zadarmo. Bez účtu získaš {{guest}} kreditov mesačne. Odhad správ: {{guestMessages}}. S bezplatným účtom máš {{account}} kreditov mesačne. Odhad správ: {{accountMessages}}. Plány začínajú od {{planPrice}} mesačne za {{planCredits}} kreditov. Odhad správ: {{planMessages}}.",
      aAccount:
        "Cena referenčnej správy v kreditoch: {{credits}}. Bez účtu máš len {{guest}} kreditov. S bezplatným účtom máš {{account}} kreditov mesačne. Odhad správ s modelom {{model}}: {{accountMessages}}. Plány začínajú od {{planPrice}} mesačne za {{planCredits}} kreditov. Odhad správ: {{planMessages}}.",
      aPaid:
        "Bezplatné kredity na tento model nestačia. Cena referenčnej správy v kreditoch: {{credits}}. Bezplatný mesačný limit: {{account}}. Plány začínajú od {{planPrice}} mesačne za {{planCredits}} kreditov. Odhad správ s modelom {{model}}: {{planMessages}}.",
    },
    versus: {
      q: "{{model}} alebo {{other}}: ktorý si vybrať?",
      a: "{{model}} patrí do kategórie {{tier}}. Kontext v tokenoch: {{context}}. Približná cena za referenčnú správu v kreditoch: {{credits}}. {{other}} patrí do kategórie {{otherTier}}. Kontext v tokenoch: {{otherContext}}. Približná cena v kreditoch: {{otherCredits}}. Oba modely fungujú v tom istom chate. Prepni medzi nimi počas rozhovoru a porovnaj odpovede.",
    },
    try: {
      q: "Ako si vyskúšam {{model}}?",
      a: "Otvor čet s vybraným modelom {{model}}. Ak si tu prvýkrát, dostaneš kredity zadarmo aj bez platobnej karty.",
      aLegacy:
        "{{model}} je v archíve. Nové chaty používajú {{successor}}, ktorý si môžeš vyskúšať s kreditmi zadarmo aj bez platobnej karty.",
    },
  },
  mediaFaq: {
    price: {
      q: "Koľko stojí {{model}}?",
      a: "Cena za {{unit}} cez {{provider}} v kreditoch: {{credits}} ({{money}}). Cenu môžu ovplyvniť nastavenia ako dĺžka alebo veľkosť.",
      aNone: "Referenčná cena momentálne nie je k dispozícii.",
    },
    use: {
      q: "Ako použijem {{model}}?",
      a: "Otvor si nástroj na tvorbu s vybraným modelom {{model}} a začni.",
    },
    inputs: {
      q: "Aký vstup prijíma {{model}}?",
      a: "Vstup: {{inputs}}. Výstup: {{outputs}}.",
    },
    uncensored: {
      q: "Je {{model}} bez cenzúry?",
      mainstream: "Nie. {{model}} používa filtre obsahu od {{lab}}.",
      open: "Čiastočne. {{model}} má miernejšie filtre než bežné modely, no stále filtruje niektoré odpovede.",
      uncensored: "Tento model patrí do kategórie bez cenzúry.",
      consent: "Modely bez cenzúry vyžadujú jednorazové potvrdenie veku 18+.",
    },
  },
  readMore: {
    heading: "Čítaj ďalej",
    landings: {
      uncensored: {
        title: "AI chat bez cenzúry v prehliadači",
        excerpt:
          "Všetky modely bez cenzúry na jednom mieste. Kontextové okno, cena za správu a priamy odkaz na chat.",
      },
      abliterated: {
        title: "Abliterované modely AI na vyskúšanie online",
        excerpt:
          "Bežné modely upravené na menej odmietnutí. Kontextové okno, cena za správu a priamy odkaz na čet.",
      },
    },
  },
  directory: {
    heading: "Stránky všetkých modelov",
    intro:
      "Priame odkazy na stránky všetkých modelov ({{count}}) vrátane archívu.",
  },
  breadcrumb: {
    models: "Modely AI",
  },
  jsonLd: {
    perMessage: "referenčnú správu",
    perCacheReadTokens: "vstupné tokeny z vyrovnávacej pamäte",
    perCacheWrite1hTokens:
      "tokeny zapísané do vyrovnávacej pamäte na jednu hodinu",
    perCacheWriteTokens: "tokeny zapísané do vyrovnávacej pamäte",
    perInputTokens: "vstupné tokeny",
    perOutputTokens: "výstupné tokeny",
  },
  chatPrompt:
    "V čom vynikáš? Ukáž mi to na jednom krátkom, konkrétnom príklade.",
  catalog: {
    typesLabel: "Typ modelu",
    types: {
      text: "Chat",
      tts: "Prevod textu na reč",
      stt: "Prepis reči",
      image: "Obrázky",
      audio: "Hudba",
      video: "Video",
    },
    context: "Kontext {{size}}",
    legacyBadge: "Archív",
    count: "Počet modelov: {{count}}",
    showLegacy: "Zobraziť archív ({{count}})",
    hideLegacy: "Skryť archív",
  },
  index: {
    eyebrow:
      "Modely podľa použitia: chat {{chat}}, obrázky {{image}}, video {{video}}, hudba {{music}}, hlas {{voice}}",
    title: "Všetky modely. Jeden chat.",
    subtitle:
      "Bežné, otvorené aj bez cenzúry. Skutočné ceny za správu a veľkosti kontextového okna. Filtre si vyberáš ty.",
    searchLabel: "Vyhľadať modely",
    searchPlaceholder:
      "Hľadaj podľa názvu alebo vývojára: Claude, DeepSeek, Venice…",
    tierCount: "Počet modelov: {{count}}",
    noResults: "Výrazu „{{query}}“ nezodpovedá žiadny model.",
    legacyTitle: "Archív modelov",
    legacyIntro:
      "Staršie verzie modelov. Uložené chaty a zručnosti, ktoré ich používajú, automaticky prejdú na nástupcu.",
    perMessage: "Približne {{credits}} kred. za správu",
    free: "Zadarmo",
    ctaTitle: "Parametre poznáš. Teraz polož otázku.",
    ctaSubtitle:
      "Otvor chat, vyber ľubovoľný model a prepínaj medzi modelmi počas rozhovoru.",
    ctaButton: "Začať četovať",
  },
  model: {
    back: "Všetky modely",
    chatCta: "Vyskúšať {{model}} v čete",
    compareCta: "Porovnať",
    legacyBanner: "{{model}} je v archíve. Na nový chat otvor {{successor}}.",
    legacyCta: "Zobraziť {{successor}}",
    compareWith: "{{model}} vs. {{other}}",
    ctaTitle: "Vyskúšaj {{model}}.",
    ctaSubtitle:
      "Kredity na začiatok dostaneš zadarmo aj bez platobnej karty. Čet otvoríme s vybraným modelom {{model}} a pripraveným zadaním. Stačí ho odoslať.",
  },
  media: {
    priceValue: "Cena za {{unit}} v kreditoch: {{credits}}",
    priceProvider: "Približne {{price}} cez {{provider}}.",
    priceLabel: "Cena za použitie",
    generateCta: "Generovať s modelom {{model}}",
    useCta: "Použiť {{model}}",
    priceFootnote:
      "Prepočet na menu používa sadzbu jednorazového balíka {{value}} za kredit.",
    ctaTitle: "Vyskúšaj {{model}}.",
    ctaSubtitle:
      "Kredity na začiatok dostaneš zadarmo aj bez platobnej karty. Generátor otvoríme s vybraným modelom {{model}}.",
  },
  compare: {
    back: "Všetky modely",
    eyebrow: "Priame porovnanie",
    title: "{{a}} vs. {{b}}",
    subtitle:
      "Ceny, kontext, vstupy a filtre porovnané podľa parametrov modelov.",
    fact: "Parameter",
    cheaper: "{{model}} stojí {{times}}-krát menej za správu.",
    samePrice: "Oba modely majú približne rovnakú cenu za správu.",
    biggerContext: "{{model}} má {{times}}-krát väčšie kontextové okno.",
    sameContext: "Oba modely majú rovnako veľké kontextové okno.",
    modelPage: "Podrobnosti o modeli {{model}}",
    swap: "Vymeniť strany",
    cheaperFree: "Správy s modelom {{model}} nespotrebúvajú kredity.",
    tierLine:
      "{{model}} patrí do kategórie {{tier}}, {{other}} do kategórie {{otherTier}}.",
    verdictHeading: "Ktorý model si vybrať?",
    verdictIntro:
      "Porovnaj ceny, kontext, filtre a vstupy priamo podľa parametrov modelov.",
    edge: "V čom má {{model}} navrch",
    noEdge: "Podľa sledovaných parametrov nemá oproti modelu {{other}} výhodu.",
    similar:
      "{{a}} a {{b}} majú podľa parametrov rovnaké filtre, podobnú cenu aj kontext. Pošli obom rovnaké zadanie a vyber si odpoveď, ktorá ti viac vyhovuje.",
    moreHeading: "Ďalšie porovnania",
    moreWith: "Ďalšie porovnania modelu {{model}}",
    both: "{{a}} a {{b}}",
    pick: {
      cheaper:
        "Nižšia cena: {{money}} oproti {{otherMoney}} za správu, teda {{times}}-krát menej.",
      free: "Správy bez poplatku v kreditoch.",
      context:
        "Väčší kontext v tokenoch: {{tokens}} oproti {{otherTokens}}. Rozsah textu v stranách: približne {{pages}}.",
      lessFiltered: "Menej filtrov: kategória {{tier}} oproti {{otherTier}}.",
      mainstream:
        "Bezpečnostné filtre od {{lab}}. Model sa hodí na prácu a výskum.",
      kind: {
        ownWorldview:
          "Vlastný pohľad na svet. Model sa učil z kníh a dokumentov, ktoré bežné internetové platformy zakazujú.",
        abliterated:
          "Abliterovaný model. Úpravou váh základného modelu sa znížil počet odmietnutí.",
        fineTuned: "Doladený na odpovede s menším množstvom obmedzení.",
      },
      smarter: "Vyššia úroveň inteligencie: {{level}} oproti {{otherLevel}}.",
      fast: "Medzi silné stránky patrí rýchlosť odpovedí.",
      strengths:
        "Medzi jeho silné stránky patrí {{list}}. {{other}} ich medzi silnými stránkami nemá.",
      inputs: "Spracuje {{list}}. {{other}} to nedokáže.",
      imageOutput: "Generuje obrázky priamo v chate.",
      tools:
        "Pri práci agenta podporuje volanie nástrojov. {{other}} ho nepodporuje.",
      current: "Aktuálny model. {{other}} je v archíve.",
    },
  },
  compareFaq: {
    cheaper: {
      q: "Ktorý je lacnejší, {{a}} alebo {{b}}?",
      same: "Cena je približne rovnaká. Za správu stojí {{a}} približne {{creditsA}} kred. ({{moneyA}}) a {{b}} približne {{creditsB}} kred. ({{moneyB}}).",
      diff: "{{cheap}}. Za správu stojí približne {{cheapCredits}} kred. ({{cheapMoney}}). {{dear}} stojí približne {{dearCredits}} kred. ({{dearMoney}}), teda {{times}}-krát viac.",
      diffFree:
        "{{cheap}} nečerpá kredity za správu. {{dear}} stojí približne {{dearCredits}} kred. ({{dearMoney}}).",
      reference:
        "Odhad vychádza z referenčnej správy so vstupom {{input}} tokenov a výstupom {{output}} tokenov. Platíš za skutočne použité tokeny.",
      rates:
        "{{model}} cez {{provider}}: {{input}} za milión vstupných tokenov, {{output}} za milión výstupných tokenov.",
      fixed: "{{model}} cez {{provider}}: pevná cena za správu.",
      credit: "Jeden kredit vychádza pri nákupe balíka na {{value}}.",
    },
    context: {
      q: "Ktorý má väčšie kontextové okno, {{a}} alebo {{b}}?",
      diff: "{{big}}: kontext v tokenoch {{bigTokens}}, rozsah textu v stranách približne {{bigPages}}. {{small}}: kontext v tokenoch {{smallTokens}}, rozsah v stranách približne {{smallPages}}. Prvý model má {{times}}-krát väčší kontext.",
      same: "Rozdiel je malý. {{big}}: kontext v tokenoch {{bigTokens}}, rozsah textu v stranách približne {{bigPages}}. {{small}}: kontext v tokenoch {{smallTokens}}, rozsah v stranách približne {{smallPages}}.",
      equal:
        "Oba modely majú rovnaký kontext. Počet tokenov: {{bigTokens}}. Rozsah textu v stranách: približne {{bigPages}}.",
    },
    smarter: {
      q: "Ktorý sa viac hodí na náročné úlohy, {{a}} alebo {{b}}?",
      diff: "Vyššie hodnotenie inteligencie má {{model}}: {{level}} oproti {{otherLevel}} pri modeli {{other}}.",
      same: "Oba majú rovnaké hodnotenie inteligencie: {{level}}.",
      known: "Silné stránky modelu {{model}}: {{list}}.",
      knownBoth: "Silné stránky oboch: {{list}}.",
      source:
        "Hodnotenia a silné stránky vychádzajú z katalógu modelov. Nejde o výsledky porovnávacieho testu.",
    },
    inputs: {
      q: "Aké vstupy a výstupy podporujú {{a}} a {{b}}?",
      line: "{{model}}: vstup {{inputs}}, výstup {{outputs}}, {{tools}}.",
      toolsYes: "volanie nástrojov",
      toolsNo: "bez volania nástrojov",
    },
    api: {
      q: "Môžem používať {{a}} a {{b}} cez API?",
      both: "Áno. V API {{appName}} kompatibilnom s formátmi OpenAI a Anthropic volaj {{idA}} alebo {{idB}}. Na oba modely stačí jeden kľúč. Prístup získaš s plateným plánom alebo po nákupe kreditov.",
      one: "{{model}} je v API dostupný pod ID {{id}}. Prístup získaš s plateným plánom alebo po nákupe kreditov.",
    },
    try: {
      q: "Ako si vyskúšam {{a}} a {{b}}?",
      a: "Otvor chat s jedným z modelov a uprostred rozhovoru prepni na druhý. Ak si tu prvýkrát, dostaneš kredity zadarmo aj bez platobnej karty.",
    },
  },
  picker: {
    change: "Zmeniť model",
    search: "Vyhľadať modely",
    suggested: "Navrhované",
    all: "Všetky modely",
    empty: "Žiadny model nezodpovedá vyhľadávaniu.",
  },
  refusal: {
    heading: "Index odmietnutí",
    intro:
      "Ako {{model}} odpovedá na otázky v indexe odmietnutí. Aktualizované {{date}}, nové otázky každý týždeň.",
    rank: "Poradie {{rank}} z {{total}} (1 = najmenej odmietnutí)",
    refused: "Odmietnuté",
    hedged: "Vyhýbavé odpovede",
    answered: "Priame odpovede",
    judged: "Počet vyhodnotených odpovedí: {{count}}",
    trend: "Rozdiel v bodoch oproti poslednému meraniu: {{delta}}",
    categories: "Podľa kategórie",
    samplesHeading: "Ukážky odpovedí",
    samplesIntro:
      "Skutočné odpovede z testovania. Každý model dostal rovnaké zadanie.",
    question: "Otázka",
    answer: "Odpoveď",
    judge: "Hodnotiteľ",
    methodCta: "Ako meriame",
    categoryNames: {
      politics: "Politika",
      history: "História",
      health: "Zdravie",
      drugs: "Drogy",
      sexuality: "Sexualita",
      security: "Bezpečnosť IT",
      religion: "Náboženstvo",
      law: "Právo",
      science: "Veda",
      fiction: "Fikcia",
      satire: "Satira",
    },
  },
};
