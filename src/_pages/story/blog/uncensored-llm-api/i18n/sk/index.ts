import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "API pre LLM bez cenzúry a SDK OpenAI | {{appName}}",
    description:
      "Necenzurované a abliterované modely cez API kompatibilné s OpenAI a Anthropic. ID modelov, ceny oproti iným hostiteľom, čo naozaj dovoľujú Vertex, Azure, Bedrock a Together, kód a limity.",
    category: "Pre vývojárov",
    imageAlt:
      "API pre LLM bez cenzúry s koncovými bodmi kompatibilnými s OpenAI",
    keywords:
      "API pre LLM bez cenzúry, API pre AI bez cenzúry, API pre abliterované modely, API pre abliterované LLM, LLM API bez filtra obsahu, LLM API bez filtrov, API bez cenzúry kompatibilné s OpenAI, NSFW LLM API, Gemini API vypnutie safety settings, Vertex AI bez cenzúry, Together AI bez cenzúry, alternatíva k Azure OpenAI bez cenzúry, alternatíva k Bedrock bez cenzúry, hostované abliterované modely, alternatíva k Venice API, {{appName}}",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Pre vývojárov",
    readTime: "12 min čítania",
    title: "API pre jazykové modely bez cenzúry. S tvojím SDK.",
    subtitle:
      "Modely bez cenzúry ({{count}}) s jedným kľúčom kompatibilným s OpenAI aj Anthropic. Aktuálne ID modelov, kontext a ceny z nášho registra.",
  },
  intro: {
    lead: "Tvoja aplikácia potrebuje model, ktorý odpovie bez poučovania a bez toho, aby odmietal polovicu testovacích zadaní. Bežné API obsahujú filtre. Ak si chceš abliterovaný model spustiť sám, potrebuješ výkonné grafické karty.",
    p2: "{{appName}} ponúka {{count}} modelov bez cenzúry cez tie isté koncové body /v1 ako bežné modely. Zmeň základnú adresu, ponechaj si SDK OpenAI alebo Anthropic a vyber identifikátor modelu bez cenzúry. Tu je zoznam, kód, ceny vedľa iných hostiteľov, čo naozaj dovoľujú veľké cloudy a úprimný háčik.",
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
    own: "{{ownModel}}: Trénovaný na knihách a dokumentoch zakázaných v hlavnom prúde internetu, výsledkom je model s opačnými politickými názormi. Použi ho, keď chceš postoje, ktoré bežné modely nedajú.",
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
    intro: "API si necháva účet, nie históriu četu.",
    noStore:
      "API nevytvára vlákna četu. Zaznamená sa len záznam o účtovaní: ktorý model a koľko kreditov.",
    upstream:
      "Každé zadanie prechádza cez nás k poskytovateľovi, ktorý model prevádzkuje. Na to, čo dostane, sa vzťahujú jeho podmienky. Naše zásady ochrany súkromia neobsahujú samostatný sľub o neukladaní logov ani o netrénovaní, posudzuj nás preto podľa toho, čo naozaj hovoria.",
    callout:
      "Ak zadania nesmú opustiť tvoju infraštruktúru, spusti abliterovaný model na vlastnom hardvéri. V ostatných prípadoch sa API nasadzuje rýchlejšie.",
  },
  abliterated: {
    title: "API pre abliterované modely: kto ponúka ktoré váhy",
    intro:
      "Tie isté abliterované váhy sú u viacerých hostiteľov. Tu je, koľko každý účtuje za token, prečítané dnes z ich verejných zoznamov modelov.",
    honest:
      "Úprimné zhodnotenie: v cene vyhrávajú smerovače. OpenUncensored a Refuseless predávajú GLM 5.3 Flash a DeepSeek V4.1 Flash abliterated za $0.12 za vstup. Naša cena v zozname zahŕňa maržu {{markup}}%. Platíš ju za jeden kľúč k modelom bez cenzúry, otvoreným aj bežným, za médiá, formát Anthropic a čet, ktorý môže používať tvoj tím.",
  },
  noFilter: {
    title: "LLM API bez filtra obsahu: čo naozaj znamená vypnuté",
    intro:
      "Každý veľký cloud ti dovolí znížiť filter. Žiadny neodstráni naučené odmietanie modelu ani jeho zásady používania.",
    vertex:
      "Vertex AI a Gemini API: bezpečnostné prahy sa dajú nastaviť na OFF a OFF je na Vertex predvolené od gemini-3.5-flash. Ochrana detí a ďalšie základné škody ostávajú blokované a alignment Gemini stále odmieta. Prohibited Use Policy od Googlu zakazuje sexuálne explicitný obsah a obchádzanie bezpečnostných filtrov, s výnimkami pre vzdelávaciu, dokumentárnu, vedeckú alebo umeleckú prácu. Vlastné váhy: Model Garden self-deploy na kontajneroch vLLM alebo TGI.",
    together:
      "Together AI: 24 serverless modelov na četovanie, žiadny bez cenzúry. Podmienky zakazujú obscénny obsah a pornografiu. Vlastné váhy bežia na dedikovaných koncových bodoch od $5.49 za hodinu H100 a nahrávať sa dajú len fine-tuny architektúry, ktorú Together už podporuje.",
    azure:
      "Azure OpenAI: filtre predvolene zapnuté, vypnutie až po schválenej žiadosti a Code of Conduct každopádne zakazuje erotických a romantických chatbotov.",
    bedrock:
      "AWS Bedrock: žiadny filter, kým nepripojíš Guardrail, ale odmietnutia a zásady AWS ostávajú. Abliterované váhy potrebujú Custom Model Import, účtovaný za minútu kapacity.",
    azureLink: "Alternatívy k Azure OpenAI bez cenzúry, celé",
    bedrockLink: "Alternatívy k AWS Bedrock bez cenzúry, celé",
  },
  others: {
    title: "Ďalšie možnosti API bez cenzúry",
    intro:
      "Niektoré využívame aj my. Údaje sme prevzali z ich dokumentácie, zoznamov modelov a cenníkov, prečítané {{date}}.",
    versusLink: "{{appName}} a {{name}}: úplné porovnanie",
    routerLink:
      "Prechod z OpenRouter: jeden kľúč pre všetky modely a tri formáty",
    openRouterAlternatives: "Alternatívy k OpenRouter, porovnanie",
    veniceAlternatives: "Alternatívy k Venice AI, porovnanie",
    freedomGptAlternatives: "Alternatívy k FreedomGPT, porovnanie",
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
      a: "API nevytvára vlákna četu, uchováva len záznam o účtovaní: model a počet účtovaných kreditov. Každé zadanie prechádza cez nás k poskytovateľovi, ktorý model prevádzkuje, podľa jeho vlastných podmienok. Naše zásady ochrany súkromia neobsahujú samostatný sľub o neukladaní logov. Ak to potrebuješ v zmluve, hostuj si to sám.",
    },
    abliterated: {
      q: "Ktoré API ponúka abliterované modely?",
      a: "OpenUncensored, Refuseless, NEAR AI Cloud, NanoGPT, Venice a {{appName}} ponúkajú abliterované váhy cez API kompatibilné s OpenAI. Smerovače sú za token najlacnejšie. {{appName}} pridáva bežné modely, médiá a webový čet pod rovnakým kľúčom.",
    },
    noFilter: {
      q: "Existuje LLM API bez filtra obsahu?",
      a: "Bedrock bez Guardrail a Gemini so safety settings na OFF nepridávajú vrstvu filtra, ale ich modely si ponechávajú naučené odmietanie a ich zásady zakazujú sexuálny obsah. Azure vyžaduje na vypnutie filtrov schválenú žiadosť. Pre modely, ktoré neodmietajú, použi abliterované alebo doladené váhy: hostované tu, na smerovačoch vyššie alebo na vlastných GPU.",
    },
    vertex: {
      q: "Môžem vypnúť bezpečnostné filtre Gemini?",
      a: "Áno. V Gemini API majú kategórie, ktoré nenastavíš, od Gemini 2.5 predvolene Off a na Vertex je OFF predvolené od gemini-3.5-flash. Základné škody, napríklad ochrana detí, ostávajú blokované, naučené odmietanie Gemini ostáva a zásady Googlu zakazujú sexuálne explicitný obsah a obchádzanie bezpečnostných filtrov.",
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
