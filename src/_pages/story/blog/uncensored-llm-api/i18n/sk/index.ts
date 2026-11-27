import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "API pre LLM bez cenzúry a SDK OpenAI | {{appName}}",
    description:
      "Necenzurované a abliterované modely cez API kompatibilné s OpenAI a Anthropic. ID modelov, kontext, ceny, limity a príklady v curl a Pythone.",
    category: "Pre vývojárov",
    imageAlt:
      "API pre LLM bez cenzúry s koncovými bodmi kompatibilnými s OpenAI",
    keywords:
      "API pre LLM bez cenzúry, API pre AI bez cenzúry, API pre abliterované modely, API pre abliterované LLM, API bez cenzúry kompatibilné s OpenAI, NSFW LLM API, API bez filtrov obsahu, Chat Completions bez cenzúry, hostované abliterované modely, alternatíva k Venice API, {{appName}}",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Pre vývojárov",
    readTime: "8 min čítania",
    title: "API pre jazykové modely bez cenzúry. S tvojím SDK.",
    subtitle:
      "Modely bez cenzúry ({{count}}) s jedným kľúčom kompatibilným s OpenAI aj Anthropic. Aktuálne ID modelov, kontext a ceny z nášho registra.",
  },
  intro: {
    lead: "Tvoja aplikácia potrebuje model, ktorý odpovie bez poučovania a bez toho, aby odmietal polovicu testovacích zadaní. Bežné API obsahujú filtre. Ak si chceš abliterovaný model spustiť sám, potrebuješ výkonné grafické karty.",
    p2: "{{appName}} ponúka {{count}} modelov bez cenzúry cez tie isté koncové body /v1 ako bežné modely. Zmeň základnú adresu, ponechaj si SDK OpenAI alebo Anthropic a vyber identifikátor modelu bez cenzúry. Tu je zoznam, kód, limity a podmienky.",
    access:
      "API vyžaduje platený účet. Sprístupní ho každý plán od {{subPrice}} mesačne. Bezplatné a bežné bonusové kredity ho neodomknú.",
    accessLink: "Odomknúť API",
  },
  models: {
    title: "Modely dostupné cez API bez cenzúry: {{count}}",
    intro:
      "Všetky aktuálne textové modely bez cenzúry, od najlacnejších. Identifikátor skopíruj do poľa model presne tak, ako je uvedený.",
    colModel: "Model",
    colId: "Identifikátor modelu",
    colContext: "Kontext",
    colTools: "Nástroje",
    colPrice: "Za správu",
    yes: "Áno",
    no: "Nie",
    footnote:
      "Cena za správu vychádza z jednej referenčnej výmeny cez najlacnejšiu trasu. API účtuje podľa tokenov a v každej odpovedi uvádza presnú sumu v usage.credits_charged. GET /v1/models vráti rovnaký zoznam s cenami za token.",
  },
  code: {
    title: "Jedna požiadavka",
    intro:
      "Aktuálne najlacnejší model bez cenzúry je {{example}}. Môžeš ho nahradiť ľubovoľným identifikátorom z tabuľky.",
    prompt:
      "Uveď najsilnejšie argumenty za jadrovú energiu aj proti nej. Bez všeobecných upozornení.",
    curl: "curl",
    python: "OpenAI SDK pre Python",
    anthropic:
      "Používaš Anthropic SDK alebo Claude Code? Zadaj tú istú základnú adresu bez /v1. Klient zavolá /v1/messages s rovnakými modelmi a tým istým kľúčom.",
  },
  consent: {
    title: "Jednorazové potvrdenie veku 18+",
    intro:
      "Modely bez cenzúry sú len pre dospelých. API si vyžiada jedno potvrdenie.",
    where: "Na stránke Kľúče API raz potvrď, že máš aspoň 18 rokov.",
    link: "Otvoriť kľúče API",
    error:
      "Bez potvrdenia vráti požiadavka na model bez cenzúry chybu 403 uncensored_consent_required. Nič sa neúčtuje.",
    once: "Po potvrdení môžu tvoje kľúče volať aj modely bez cenzúry.",
  },
  kinds: {
    title: "Ktorý model bez cenzúry sa hodí na čo",
    intro: "V tabuľke sú tri skupiny s rozdielnym správaním.",
    abliterated:
      "Abliterovaný model: Bežný alebo otvorený model s váhami upravenými tak, aby menej odmietal. Základný tréning, znalosti a pohľad na svet sa nemenia. Dobrá predvolená voľba pre väčšinu aplikácií.",
    fineTuned:
      "Doladený model: Otvorený model dodatočne trénovaný na nefiltrovaných dátach. Často má voľnejší štýl a používa sa na beletriu či hranie rolí.",
    own: "{{ownModel}}: Trénovaný na knihách a dokumentoch zakázaných v hlavnom prúde internetu. Vyjadruje aj odlišné politické názory, ktoré bežné modely neponúkajú.",
    link: "Abliterácia, doladenie či vlastný svetonázor: podrobné vysvetlenie",
  },
  limits: {
    title: "Limity, ktoré treba poznať",
    intro: "Over si ich pred nasadením.",
    stateless:
      "API je bezstavové. Konverzácie u nás nezostávajú. Pri každej správe pošli celú históriu.",
    maxTokens: "Jedna požiadavka môže vrátiť najviac {{maxTokens}} tokenov.",
    rateLimit:
      "Bez pevného limitu požiadaviek. Platíš za každé volanie zo svojich kreditov a platí veľkorysá ochrana proti zneužitiu. Chyby 429 od poskytovateľov posielame ďalej s hlavičkou Retry-After.",
    tools:
      "Nástroje fungujú len na modeloch, ktoré ich podporujú. Nájdeš ich v tabuľke. Ostatné vrátia chybu 400 tools_not_supported.",
    refusals:
      "Model bez cenzúry môže požiadavku odmietnuť alebo uviesť nesprávne fakty. Pred nasadením vyskúšaj svoje zadania v dvoch modeloch.",
  },
  privacy: {
    title: "Čo sa deje s tvojimi zadaniami",
    intro: "Na účtovanie uchovávame údaje o spotrebe.",
    noStore:
      "API neukladá konverzácie ani nevytvára vlákna. Na našej strane ostáva doklad o spotrebe s názvom modelu a počtom účtovaných kreditov.",
    upstream:
      "Zadanie odošleme poskytovateľovi, ktorý model prevádzkuje. So zadaním nakladá podľa vlastných podmienok.",
    callout:
      "Ak zadania nesmú opustiť tvoju infraštruktúru, spusti abliterovaný model na vlastnom hardvéri. V ostatných prípadoch sa API nasadzuje rýchlejšie.",
  },
  others: {
    title: "Ďalšie možnosti API bez cenzúry",
    intro:
      "Niektoré využívame aj my. Údaje sme prevzali z dokumentácie a cenníkov poskytovateľov.",
    versusLink: "{{appName}} a {{name}}: úplné porovnanie",
    routerLink:
      "Prechod z OpenRouter: jeden kľúč pre všetky modely a tri formáty",
  },
  faq: {
    title: "Časté otázky",
    free: {
      q: "Existuje bezplatné API pre LLM bez cenzúry?",
      a: "Bezplatné kredity u nás slúžia na čet. Kľúče API odomkne každý platený plán od {{subPrice}} mesačne. Nástroj ako Ollama poskytne bezplatné API na vlastnom zariadení, ak máš dostatok pamäte pre model.",
    },
    ids: {
      q: "Ktoré identifikátory patria modelom bez cenzúry?",
      a: "Aktuálny počet je {{count}}. Presné identifikátory nájdeš v tabuľke vyššie. GET /v1/models vráti všetky modely dostupné pre tvoj kľúč, ich ceny a podporu nástrojov.",
    },
    sdk: {
      q: "Funguje API bez cenzúry s OpenAI SDK?",
      a: "Áno. V base_url nastav základnú adresu {{appName}}, použi svoj kľúč a do poľa model vlož identifikátor modelu bez cenzúry. Anthropic SDK funguje s rovnakou základnou adresou bez /v1.",
    },
    refuse: {
      q: "Môže model bez cenzúry niečo odmietnuť?",
      a: "Áno, ale zriedkavejšie. Abliterácia oslabuje naučené odmietanie. Model ešte môže odmietnuť alebo sa pomýliť, preto ho testuj na svojich skutočných zadaniach.",
    },
    logs: {
      q: "Ukladá {{appName}} moje zadania z API?",
      a: "Z API uchovávame len údaje o spotrebe: model a počet účtovaných kreditov. Poskytovateľ modelu vidí zadanie a nakladá s ním podľa svojich podmienok.",
    },
    local: {
      q: "Oplatí sa mi hostovať abliterované modely?",
      a: "Áno, ak máš grafické karty a prísne pravidlá pre údaje. Lokálny nástroj sprístupní API kompatibilné s OpenAI priamo na tvojom počítači. Ak chceš veľké modely bez prenájmu hardvéru, s hostovaným API začneš lacnejšie.",
    },
    docsLink: "Prečítať si úplnú dokumentáciu API",
    directoryLink: "Pozrieť si abliterované modely v čete",
  },
  cta: {
    title: "Vyskúšaj modely pred zapojením do kódu",
    subtitle:
      "Všetky modely v tabuľke fungujú aj v čete. Vyskúšaj na nich zadania a potom skopíruj identifikátor do kódu.",
    chat: "Vyskúšať model bez cenzúry v čete",
    docs: "Prečítať si dokumentáciu API",
  },
};
