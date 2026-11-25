import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatívy k Claude s filtrami aj bez nich (2026)",
    description:
      "Claude má limity a niektoré zadania odmieta. Porovnaj ceny a filtre {{appName}}, ChatGPT, Gemini, Grok, DeepSeek, Kimi, Venice, NanoGPT a OpenRouter.",
    category: "Porovnanie",
    imageAlt: "Porovnanie alternatív k Claude s filtrami aj bez nich",
    keywords:
      "alternatívy k Claude, služby ako Claude, Claude bez limitov, alternatíva k Claude bez filtra, modely bez cenzúry, Claude a ChatGPT, Claude a Gemini, alternatíva k Claude Pro, {{appName}}",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Porovnanie",
    readTime: "10 min čítania",
    title: "Alternatívy k Claude s filtrami aj bez nich",
    subtitle:
      "{{appName}} a ďalšie alternatívy ({{count}}), od bežných asistentov po modely bez cenzúry. Údaje sme overili na ich stránkach {{date}}.",
  },
  intro: {
    lead: "Claude patrí medzi najlepšie modely na písanie a programovanie. Limit správ však vie vyčerpať v najhoršej chvíli a pravidlá zakazujú erotický čet v každom pláne.",
    p2: "Keď narazíš na limit, pomôžu iní bežní asistenti. Na zadania, ktoré Claude odmieta, sú tu modely bez cenzúry. Obe skupiny sme overili {{date}}. Claude ponúkame aj my, preto uvádzame, kde má stále navrch.",
  },
  subject: {
    title: "Čo ponúka Claude",
    intro:
      "Vychádzame z cenníka, pravidiel používania a zásad ochrany súkromia spoločnosti Anthropic.",
    plans:
      "Cena: bezplatný plán má limity, ktoré sa obnovujú každých 5 hodín a každý týždeň. Platené plány: {{plans}}. Anthropic presné počty správ nezverejňuje a potvrdil sprísnenie limitov v špičke počas pracovných dní.",
    filter:
      "Filter: pravidlá zakazujú sexuálne explicitný obsah, erotický čet a obsah oslavujúci názorné násilie. Plán pre dospelých neexistuje.",
    privacy:
      "Súkromie: môžeš si vybrať, či sa čety použijú na tréning. Ak tréning povolíš, čety zbavené identifikačných údajov sa uchovávajú až päť rokov. Ak ho vypneš, uchovávajú sa 30 dní.",
    extra:
      "Médiá: Claude negeneruje obrázky ani videá. Z kódu vie vytvárať grafy a diagramy a má hlasový režim.",
  },
  why: {
    title: "Prečo ľudia hľadajú alternatívy",
    intro: "Štyri dôvody doložené verejnými zdrojmi.",
    limits:
      "Limity používania. Anthropic v marci 2026 potvrdil, že počas špičky sprísňuje limity v 5-hodinových intervaloch.",
    refusals:
      "Odmietnutia. Novšie modely Claude spochybňujú východiská fiktívnych príbehov a niekedy zle pochopia zámer.",
    adult:
      "Obsah pre dospelých. Erotický čet je zakázaný vo všetkých plánoch aj aplikáciách.",
    price:
      "Cena. Na intenzívnejšie používanie potrebuješ Max za 100 USD alebo Ultra za 200 USD mesačne.",
  },
  criteria: {
    title: "Čo porovnať pred prechodom",
    intro: "Pomôže ti päť otázok.",
    one: "Kvalita: ako model píše, programuje a uvažuje pri tvojich vlastných úlohách?",
    two: "Limity: je počet správ obmedzený? Kedy sa limit obnoví? Dá sa platiť podľa spotreby bez limitu?",
    three: "Filter: čo model odmieta a môžeš si vybrať iný?",
    four: "Súkromie: ako nastavíš tréning, ako dlho sa uchovávajú dáta a čo ostáva na tvojom zariadení?",
    five: "Doplnky: obrázky, video, vyhľadávanie na webe a API. Koľko jednotlivé funkcie stoja?",
  },
  table: {
    title: "Porovnanie všetkých možností",
  },
  us: {
    title: "{{appName}}: Claude aj modely s inými pravidlami",
    intro:
      "V jednom čete máš modely ({{modelCount}}) vrátane Claude. Pri každej správe môžeš zmeniť model a pokračovať v rovnakom vlákne.",
    models:
      "Modely: {{uncensored}} bez cenzúry, {{mainstream}} bežných a {{open}} otvorených. {{ownModel}} sa trénoval na knihách a dokumentoch zakázaných na bežnom internete, preto zastáva odlišné politické názory.",
    fit: "Bez 5-hodinového limitu. Za každú správu platíš z jedného zostatku a môžeš pokračovať, kým máš kredity. Tie isté kredity platia aj na obrázky, video a hudbu.",
    privacy:
      "Súkromie: inkognito čety ostávajú v lokálnom úložisku tvojho prehliadača aj bez účtu.",
    price:
      "Cena: každý mesiac {{guestCredits}} kreditov zdarma bez účtu alebo {{freeCredits}} s bezplatným účtom. Plány: {{planList}}.",
    api: "API: rozhrania kompatibilné s OpenAI a Anthropic vrátane modelov Claude. Prístup odomkne každý nákup.",
    weak: "V čom má Claude navrch: Claude Code, Projects a Cowork sú vlastné aplikácie Anthropic. Ak Claude intenzívne používaš každý deň, predplatné Claude vyjde lacnejšie než platba za správu s našou prirážkou {{markup}} %. Aj Claude na {{appName}} sa riadi pravidlami Anthropic.",
    ownLink: "Pozrieť model {{ownModel}}",
    directoryLink: "Všetky abliterované modely, ich kontext a ceny",
  },
  list: {
    title: "Podrobné porovnanie alternatív",
    intro:
      "Podrobné profily platforiem sme overili na ich vlastných stránkach. ChatGPT, Gemini, Grok aj ďalších asistentov nájdeš v tabuľke vyššie.",
    heading: "{{number}}. {{name}}: {{kind}}",
    models: "Modely:",
    filter: "Filter:",
    price: "Cena:",
    priceValue: "Bezplatný plán: {{free}}. Platené plány: {{plans}}.",
    pro: "Hlavná výhoda:",
    con: "Na čo si dať pozor:",
    forWho: "Hodí sa ti, ak:",
    versusLink: "{{appName}} a {{name}}: úplné porovnanie",
    visit: "Navštíviť {{name}}",
  },
  stay: {
    title: "Kedy sa oplatí zostať pri Claude",
    intro: "Pri mnohých úlohách je Claude stále dobrá voľba.",
    one: "Celý deň programuješ v Claude Code a si v medziach svojho plánu.",
    two: "Pracuješ v Projects a chceš vlastné aplikácie Anthropic na každom zariadení.",
    three: "Pri písaní sa nedostávaš k obsahu, ktorý jeho pravidlá zakazujú.",
  },
  faq: {
    title: "Časté otázky",
    best: {
      q: "Ktorá alternatíva k Claude je najlepšia?",
      a: "Na bežnú asistenciu ChatGPT alebo Gemini. Na rešerš s odkazmi Perplexity. Na otvorené modely, ktoré menej odmietajú, Kimi, GLM alebo DeepSeek. Claude aj modely bez cenzúry v jednom vlákne nájdeš na {{appName}}.",
    },
    free: {
      q: "Existuje bezplatná alternatíva k Claude?",
      a: "ChatGPT, Gemini, Grok, DeepSeek aj Mistral majú bezplatné plány s limitmi. LM Studio a Ollama sú zdarma na vlastnom hardvéri. Na {{appName}} máš každý mesiac {{guestCredits}} kreditov zdarma bez účtu alebo {{freeCredits}} s bezplatným účtom a môžeš ich minúť aj na Claude.",
    },
    filter: {
      q: "Existuje Claude bez cenzúry?",
      a: "Nie. Váhy modelu Claude nie sú verejné a pravidlá platia všade. Na scény, ktoré Claude odmieta, môžeš použiť iný model. Na {{appName}} po jednorazovom potvrdení veku 18+ odomkneš modely bez cenzúry ({{uncensored}}) v tom istom vlákne ako Claude.",
    },
    privacy: {
      q: "Ktorá alternatíva k Claude poskytuje najviac súkromia?",
      a: "Pri lokálnom modeli v LM Studio alebo Ollama ostáva zadanie v počítači. Pri online službe si over možnosť vypnúť tréning a dĺžku uchovávania dát. V inkognito režime na {{appName}} ostáva história v prehliadači.",
    },
    move: {
      q: "Môžem Claude používať aj po prechode?",
      a: "Áno. Modely Claude ponúkajú {{appName}}, OpenRouter, NanoGPT aj Poe. Pri úlohách, ktoré Claude zvláda najlepšie, môžeš ostať pri ňom. Pri ostatných vymeň model.",
    },
  },
  cta: {
    title: "Claude si ponechaj. Podľa potreby vymeň model.",
    subtitle:
      "Každý mesiac máš {{guestCredits}} kreditov zdarma aj bez účtu. Claude aj modely bez cenzúry v jednom čete.",
    start: "Spustiť inkognito čet",
    models: "Porovnať všetky modely",
  },
};
