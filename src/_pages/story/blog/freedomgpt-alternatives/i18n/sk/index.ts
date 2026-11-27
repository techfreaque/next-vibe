import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatívy k FreedomGPT: AI bez cenzúry (2026)",
    description:
      "Porovnaj FreedomGPT s {{appName}}, Venice a Poe na webový čet alebo s LM Studio, Ollama a Jan na offline použitie. Ceny, filtre a súkromie.",
    category: "Porovnanie",
    imageAlt: "Porovnanie alternatív k FreedomGPT",
    keywords:
      "alternatívy k FreedomGPT, aplikácie ako FreedomGPT, FreedomGPT a Venice, FreedomGPT Liberty, alternatívy k desktopovej aplikácii FreedomGPT, AI bez cenzúry, čet bez cenzúry, {{appName}}",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Porovnanie",
    readTime: "9 min čítania",
    title: "Alternatívy k FreedomGPT na web aj offline",
    subtitle:
      "{{appName}} a ďalšie alternatívy ({{count}}) podľa údajov na ich stránkach o cenách, filtroch a súkromí.",
  },
  intro: {
    lead: "FreedomGPT ponúka jedno predplatné na stovky modelov, aj bez cenzúry. Dobrý nápad. Háčiky: tie necenzurované modely nikdy nemenuje, jeho zásady ochrany súkromia súkromie nesľubujú a desktopová aplikácia sa roky neaktualizovala.",
    p2: "Pozri sa, čo FreedomGPT skutočne sľubuje, na čo ti vystačia jeho kredity a čo ponúkajú alternatívy ({{count}}). Údaje o FreedomGPT sú k {{fgDate}}, o ostatných k {{date}}. Uvádzame aj to, v čom sú lepší než my.",
    relation:
      "Sme zákazníkom FreedomGPT. {{freedomGptExamples}} na {{appName}} prevádzkujeme cez API od FreedomGPT.",
  },
  fg: {
    title: "Čo ponúka FreedomGPT",
    intro:
      "Z jeho domovskej stránky, cenníka, podmienok, zásad ochrany súkromia a dokumentácie API, prečítaných {{fgDate}}.",
    models:
      "Modely: domovská stránka sľubuje viac než 400 modelov v jednom predplatnom a uvádza ChatGPT, Claude, Gemini, Grok, Kimi, GLM, DeepSeek, Qwen, Llama a ďalšie. Necenzurované možnosti sľubuje, ale žiadny necenzurovaný model nemenuje. Jeho API štandardne používa model Liberty a nehovorí, čo to je.",
    filter:
      "Filter: jeho podmienky dovoľujú používanie len na zákonné a etické účely a nič konkrétnejšie neuvádzajú. Minimálny vek nie je uvedený.",
    price:
      "Cena: vyskúšaš zdarma, bez karty aj bez účtu. Pro stojí {{proPrice}} mesačne za {{proCredits}} kreditov. Podľa vlastných odhadov vyjde prémiová odpoveď približne na {{replyCost}} kreditov, obrázok na {{imageCost}} a päťsekundové video na {{videoCost}}.",
    bonus:
      "Registračný bonus: 100 kreditov iba pre oprávnené nové registrácie cez Google, Apple alebo X. Za registráciu e-mailom a heslom bonus nezískaš.",
    privacy:
      "Súkromie: domovská stránka ti radí nepredpokladať anonymitu ani nulové uchovávanie. Zásady ochrany súkromia hovoria, že FreedomGPT môže zbierať a ukladať akékoľvek informácie, ktoré mu poskytneš, že používatelia nemajú nárok na očakávanie súkromia a že správy idú poskytovateľom AI na generovanie odpovedí. Dobu uchovávania neuvádza.",
    apps: "Aplikácie a API: web, iPhone a Android. API má endpointy pre čet, obrázky, telefonické hovory a video, ale odpovede prichádzajú vo vlastnom formáte FreedomGPT, nie v schéme OpenAI, a dokumentácia neuvádza ceny za token. Posledný commit open source desktopovej aplikácie je z {{desktopDate}}.",
    why: "Alternatívu hľadajú ľudia, ktorí chcú vedieť, čo dostanú za mesačný poplatok, potrebujú udržiavanú offline aplikáciu alebo nechcú mať čety uložené na serveri.",
    sourceHome: "Domovská stránka FreedomGPT",
    sourcePricing: "Cenník FreedomGPT",
    sourcePrivacy: "Zásady ochrany súkromia FreedomGPT",
    sourceTerms: "Podmienky používania FreedomGPT",
    sourceApi: "Dokumentácia API FreedomGPT",
    sourceRepo: "Repozitár desktopovej aplikácie FreedomGPT",
  },
  credits: {
    title: "Čo dostaneš vo FreedomGPT za {{proPrice}} mesačne",
    intro:
      "Mesačných {{proCredits}} kreditov sme vydelili odhadmi FreedomGPT. Môžeš si vybrať jeden typ výstupu alebo ich kombinovať.",
    replies:
      "Prémiové odpovede: približne {{replies}} za cenu {{replyCost}} kreditov za odpoveď.",
    images:
      "Obrázky: približne {{images}} za cenu {{imageCost}} kreditov za obrázok.",
    videos:
      "Päťsekundové videá: {{videos}} za cenu {{videoCost}} kreditov za video.",
    us: "Na stránke každého modelu na {{appName}} vidíš aktuálnu cenu za správu ešte pred odoslaním. Plány začínajú na {{subPrice}} mesačne za {{subCredits}} kreditov. Pri lacných modeloch ti kredity vydržia dlhšie než pri najväčších. Cenu vidíš vopred.",
  },
  criteria: {
    title: "Čo porovnať pred prechodom",
    intro: "Pomôže ti päť otázok.",
    models:
      "Modely: koľko ich je bez cenzúry a o aký typ ide? Je v tej istej ponuke aj Claude, GPT a Gemini?",
    filter:
      "Filter: čo podmienky skutočne zakazujú a čo pri zadaní znamená označenie „bez cenzúry“?",
    privacy:
      "Súkromie: kde sa čety ukladajú, kto k nim má prístup a ako dlho ich uchováva?",
    price:
      "Cena: koľko odpovedí, obrázkov a videí dostaneš za mesačný poplatok?",
    offline:
      "Offline: existuje udržiavaná lokálna aplikácia alebo je na výber len cloud?",
  },
  table: {
    title: "Porovnanie všetkých možností",
  },
  us: {
    title: "{{appName}}: modely bez cenzúry s uvedenými cenami",
    intro:
      "Modely ({{modelCount}}) máš v jednom čete s jedným zostatkom kreditov. Pri každej správe si môžeš vybrať model a každý má vlastnú stránku.",
    models:
      "Modely: {{uncensored}} bez cenzúry, {{mainstream}} bežných a {{open}} otvorených. {{ownModel}} sa trénoval na knihách a dokumentoch zakázaných na bežnom internete, preto zastáva odlišné politické názory.",
    liberty:
      "Nájdeš tu aj vlastný model Liberty od FreedomGPT ({{freedomGptExamples}}) vedľa abliterovaných verzií GLM, DeepSeek a Kimi. Porovnaj ich odpovede v tom istom čete.",
    libertyOff:
      "Abliterované verzie GLM, DeepSeek a Kimi nájdeš vedľa Claude, GPT a Gemini. Ich odpovede porovnáš v tom istom čete.",
    privacy:
      "Súkromie: inkognito čety ostávajú v lokálnom úložisku prehliadača aj bez účtu. Súkromné čety sa ukladajú iba do tvojho účtu.",
    price:
      "Cena: každý mesiac {{guestCredits}} kreditov zdarma bez účtu alebo {{freeCredits}} s bezplatným účtom, {{maxCredits}} pri odbere noviniek. Predplatné od {{subPrice}} mesačne. Stačí raz potvrdiť vek 18+ a modely bez cenzúry sa odomknú.",
    open: "Otvorený kód: celú platformu nájdeš na GitHube a ďalej ju aktívne vyvíjame. Môžeš si spustiť vlastnú inštanciu.",
    weak: "V čom máme obmedzenia: neponúkame paušál na všetko a aj u nás video stojí kredity. FreedomGPT si môžeš vyskúšať bezplatne a bez účtu rovnako ľahko ako našu službu.",
    hubLink: "Čet s AI bez cenzúry: všetky modely, kontext a ceny",
    abliteratedLink: "Abliterované modely dostupné v prehliadači",
    libertyLink: "Pozrieť FreedomGPT Liberty na {{appName}}",
    ownLink: "Pozrieť model {{ownModel}}",
  },
  list: {
    title: "Podrobné porovnanie alternatív ({{count}})",
    intro:
      "Údaje sme overili na stránkach poskytovateľov {{date}}. Pri každej možnosti nájdeš modely, pravidlá filtrovania aj informácie o tom, čo sa deje s četmi.",
    heading: "{{number}}. {{name}}: {{kind}}",
    models: "Modely:",
    filter: "Filter:",
    privacy: "Súkromie:",
    price: "Cena:",
    priceValue: "Bezplatný plán: {{free}}. Platené plány: {{plans}}.",
    pro: "Hlavná výhoda:",
    con: "Na čo si dať pozor:",
    forWho: "Hodí sa ti, ak:",
    versusLink: "{{appName}} a {{name}}: úplné porovnanie",
    visit: "Navštíviť {{name}}",
  },
  privacy: {
    title: "Čo sa deje s tvojimi četmi",
    intro: "Takto to jednotlivé služby uvádzajú vo svojich podmienkach.",
    fg: "FreedomGPT: jeho zásady hovoria, že používatelia nemajú nárok na očakávanie súkromia a že môže ukladať všetko, čo mu poskytneš. Správy idú poskytovateľom AI. Doba uchovávania nie je uvedená. Jeho vlastná domovská stránka radí nepredpokladať anonymitu.",
    us: "V režime inkognito na {{appName}} ostávajú čety len v lokálnom úložisku prehliadača. Keď vymažeš údaje prehliadača, zmiznú aj čety.",
    local:
      "V LM Studio a Ollama beží model na tvojom počítači a zadanie z neho neodchádza. Potrebuješ vlastný hardvér.",
    callout:
      "Každý model na serveri poskytovateľa vidí zadanie, na ktoré odpovedá. Uloženie histórie na zariadení zabráni tomu, aby samotná história ostala na serveri.",
  },
  faq: {
    title: "Časté otázky",
    best: {
      q: "Ktorá alternatíva k FreedomGPT je najlepšia?",
      a: "Záleží na tom, čo ti chýba. Venice má veľký katalóg a históriu na tvojom zariadení. NanoGPT účtuje podľa spotreby bez predplatného. uncensored.ai ponúka jeden priamy model s vlastným svetonázorom. Úplne offline fungujú LM Studio a Ollama. Modely bez cenzúry, otvorené aj bežné modely so zverejnenou cenou za správu nájdeš v jednom čete na {{appName}}.",
    },
    free: {
      q: "Existuje bezplatná alternatíva k FreedomGPT?",
      a: "Áno. Ollama má otvorený kód a rovnako ako LM Studio ju môžeš používať bezplatne na vlastnom hardvéri. Na {{appName}} máš každý mesiac {{guestCredits}} kreditov zdarma bez účtu alebo {{freeCredits}} s bezplatným účtom, {{maxCredits}} pri odbere noviniek. Modely bez cenzúry sprístupní jednorazové potvrdenie veku 18+.",
    },
    liberty: {
      q: "Môžem FreedomGPT Liberty používať aj inde?",
      a: "Áno. Na {{appName}} sprístupňujeme {{freedomGptExamples}} cez API od FreedomGPT. Odpovede Liberty tak môžeš porovnať s ďalšími modelmi bez cenzúry ({{uncensored}}).",
      aOff: "Liberty je vlastný model FreedomGPT. Na {{appName}} nájdeš v jednom čete ďalšie modely bez cenzúry ({{uncensored}}) vrátane abliterovaných modelov.",
    },
    desktop: {
      q: "Vyvíja sa ešte desktopová aplikácia FreedomGPT?",
      a: "Podľa otvoreného repozitára na GitHube je posledná zmena z {{desktopDate}}. Z udržiavaných nástrojov na používanie offline sú na výber Ollama a LM Studio.",
    },
    private: {
      q: "Ktorá alternatíva poskytuje najviac súkromia?",
      a: "Pri lokálnom spustení v Ollama alebo LM Studio ostávajú zadania na tvojom zariadení. Z online služieb ukladá Venice a inkognito režim na {{appName}} históriu do prehliadača. Podľa zásad FreedomGPT sprístupňuje správy externým poskytovateľom AI.",
    },
    api: {
      q: "Ktorá alternatíva má API bez cenzúry?",
      a: "Venice, NanoGPT, uncensored.ai, Gab AI aj {{appName}} ponúkajú API kompatibilné s OpenAI. Má ho aj FreedomGPT, ale vo vlastnom formáte odpovedí a bez cien v dokumentácii. Na abliterované váhy len cez API ich za cenu poskytovateľa predávajú OpenUncensored, Refuseless a NEAR AI Cloud. Na {{appName}} odomkne API ktorýkoľvek plán od {{apiSubPrice}} mesačne.",
    },
    gabLink: "Porovnanie alternatív k Gab AI",
    nofilterLink: "Porovnanie alternatív k NoFilterGPT",
    noGpuLink: "Ako používať modely bez cenzúry bez GPU",
    openRouterLink: "Alternatívy k OpenRouter bez cenzúry v porovnaní",
    apiLink: "API LLM bez cenzúry: ID modelov, kód a limity",
  },
  cta: {
    title: "Pozri si cenu. Potom sa spýtaj na čokoľvek.",
    subtitle:
      "Každý mesiac máš {{guestCredits}} kreditov zdarma aj bez účtu. Otvor inkognito čet a vyskúšaj ktorýkoľvek model.",
    start: "Spustiť inkognito čet",
    models: "Pozrieť modely bez cenzúry",
  },
};
