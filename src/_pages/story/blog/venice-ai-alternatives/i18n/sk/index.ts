import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatívy k Venice AI na súkromný čet (2026)",
    description:
      "Venice AI oproti {{appName}}, OpenUncensored, NEAR AI Cloud, Maple, Proton Lumo, NanoGPT a lokálnym aplikáciám. Kde sa spracúvajú zadania, ktoré modely odmietajú menej, ktoré formáty API fungujú a čo stojí navyše.",
    category: "Porovnanie",
    imageAlt: "Porovnanie alternatív k Venice AI",
    keywords:
      "alternatívy k Venice AI, stránky ako Venice AI, alternatíva k Venice.ai, súkromná AI bez cenzúry, alternatívy četu bez cenzúry, Venice AI a NanoGPT, Venice AI a FreedomGPT, AI bez cenzúry s API, súkromný čet s AI, {{appName}}",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Porovnanie",
    readTime: "10 min čítania",
    title: "Alternatívy k Venice AI na súkromný čet",
    subtitle:
      "{{appName}} a ďalšie alternatívy ({{count}}) podľa ich cenníkov, filtrov a zásad súkromia. Údaje overené {{date}}.",
  },
  intro: {
    lead: "Venice si vybudovalo meno na dvoch sľuboch: súkromie a čet bez cenzúry. Veľa z toho dodržiava. Bezplatný plán však dáva 10 textových zadaní denne, filter pre dospelých vyžaduje Pro a jeho API nemá natívny endpoint Anthropic.",
    p2: "Alternatívy sme porovnali podľa cien, zásad súkromia a filtrov, ktoré zverejňovali k {{date}}. S Venice spolupracujeme ako zákazník. {{appName}} cez Venice sprístupňuje {{veniceModels}} modelov, z toho {{veniceUncensored}} bez cenzúry. Uvádzame aj to, kde má Venice navrch.",
  },
  criteria: {
    title: "Čo porovnať pred prechodom",
    intro: "Rozhodni sa podľa piatich otázok.",
    privacy:
      "Súkromie: Kde sa ukladajú čety a trénuje na nich niekto modely? Môžu zostať na zariadení, ukladať sa na serveri alebo slúžiť na zlepšovanie modelov.",
    models:
      "Modely: Koľko je ich bez cenzúry a akého typu? Sú na tom istom mieste dostupné aj Claude, GPT a Gemini?",
    filter:
      "Filter: Čo umožňuje bezplatný plán? Kedy potrebuješ predplatné? Overuje sa vek?",
    price:
      "Cena: Koľko dostaneš zadarmo? Platíš predplatné alebo podľa spotreby? Čo sa stane po dosiahnutí limitu?",
    api: "API: Môžeš rovnaké modely volať z kódu a v akom formáte?",
  },
  table: {
    title: "Všetky možnosti vedľa seba",
  },
  us: {
    title: "{{appName}}: jeden čet pre všetky typy modelov",
    intro:
      "{{modelCount}} modelov v jednom čete so spoločným zostatkom kreditov. Úroveň filtrovania si vyberáš pre každú správu.",
    models:
      "Modely: Bez cenzúry: {{uncensored}}. Bežné: {{mainstream}}. Otvorené: {{open}}. Model môžeš zmeniť aj uprostred četu. {{ownModel}} sme trénovali na knihách a dokumentoch zakázaných v hlavnom prúde internetu. Preto vyjadruje aj odlišné politické názory.",
    venice:
      "Modely od Venice: Cez Venice sprístupňujeme {{veniceModels}} modelov vrátane {{veniceExamples}}. Tie isté modely používaš spolu s ostatnými cez jeden účet.",
    privacy:
      "Súkromie: Anonymné čety zostávajú v lokálnom úložisku prehliadača a účet nepotrebuješ. Súkromné čety sa ukladajú len do tvojho účtu.",
    price:
      "Cena: Mesačne dostaneš {{guestCredits}} kred. bez účtu alebo {{freeCredits}} s účtom. Plány začínajú na {{subPrice}} mesačne. K aktívnemu plánu si môžeš dokúpiť kredity, ktoré nevypršia.",
    api: "API: Rovnaké modely sú dostupné cez rozhrania kompatibilné s OpenAI aj Anthropicom. Prístup získaš s ktorýmkoľvek plánom od {{apiSubPrice}} mesačne.",
    weak: "Kde sme slabší: katalóg Venice je väčší a na vlastných modeloch je Venice lacnejšie za token, lebo k cene, ktorú platíme my, pripočítavame prirážku {{markup}} %. Nemáme platbu za požiadavku cez x402 ani tokenovú vrstvu ako VVV či DIEM: naše API vyžaduje účet a nákup.",
    directoryLink: "Všetky abliterované modely, ich kontext a ceny",
    ownLink: "Pozrieť si {{ownModel}}",
  },
  veniceApi: {
    title: "API Venice, overené {{veniceDate}}",
    intro: "Čo dostanú vývojári, než sa poobzerajú inde.",
    formats:
      "Formáty: čet kompatibilný s OpenAI s endpointom Responses. Žiadne natívne API Anthropic Messages: jeho vlastný návod pre Claude Code používa lokálny prekladový proxy.",
    payment:
      "Platba: kľúč API vyžaduje účet, alebo cez x402 platíš za každú požiadavku z peňaženky USDC, úplne bez účtu.",
    models:
      "Vlastné modely: Venice Uncensored 1.2 a Venice Role Play Uncensored, jeho vlastné fine-tuny, popri abliterovaných verziách GLM, DeepSeek, Gemma a Qwen.",
    terms:
      "Podmienky: zákaz prepredaja prístupu a zákaz použitia API v rizikových oblastiach.",
    us: "Na {{appName}} hovorí jeden kľúč formátmi OpenAI chat completions, Responses aj Anthropic Messages. Claude Code sa pripojí priamo, vrátane modelov Venice.",
    apiLink: "API LLM bez cenzúry: ID modelov, kód a limity",
  },
  list: {
    title: "Alternatívy: {{count}} možností podrobne",
    intro:
      "Údaje zo stránok poskytovateľov overené k {{date}}. Pri každej službe uvádzame, čo ponúka, aké má modely, čo dovoľujú filtre a ako nakladá s četmi.",
    heading: "{{number}}. {{name}}: {{kind}}",
    models: "Modely:",
    filter: "Filter:",
    privacy: "Súkromie:",
    price: "Cena:",
    priceValue: "Bezplatný plán: {{free}}. Platené plány: {{plans}}.",
    pro: "Najväčšia výhoda:",
    con: "Háčik:",
    forWho: "Vyber si, ak:",
    versusLink: "{{appName}} a {{name}}: úplné porovnanie",
    visit: "Navštíviť {{name}}",
  },
  privacy: {
    title: "Súkromie je silná stránka Venice",
    intro:
      "Väčšina ľudí uvažuje o Venice kvôli súkromiu. Tu sú rozdiely medzi službami.",
    us: "Na {{appName}} sa anonymné čety ukladajú do lokálneho úložiska prehliadača. Keď vymažeš údaje prehliadača, čety zmiznú.",
    transit:
      "Každý hostovaný model dostane tvoje zadanie. Venice, NanoGPT aj my ho musíme odoslať na server, kde model beží. Na tvojom zariadení zostane iba pri lokálne spustenom modeli.",
    callout:
      "História uložená v zariadení drží tvoje čety mimo firemných serverov. Model však musí vidieť zadanie, aby naň odpovedal.",
  },
  stay: {
    title: "Kedy sa ešte oplatí vybrať Venice",
    intro: "Niekedy sa viac oplatí zostať pri pôvodnej službe.",
    crypto:
      "Držíš VVV alebo DIEM, alebo chceš platiť za každú požiadavku API z peňaženky USDC bez účtu. Nikto iný v tomto zozname to nerobí rovnako.",
    versusLink: "{{appName}} a Venice: úplné porovnanie",
  },
  faq: {
    title: "Časté otázky",
    best: {
      q: "Ktorá alternatíva k Venice AI je najlepšia?",
      a: "Záleží, prečo chceš prejsť inam. NanoGPT má veľa modelov a účtuje podľa spotreby. Najviac súkromia získaš s LM Studio na vlastnom zariadení. uncensored.ai ponúka jeden priamy model s vlastným svetonázorom. {{appName}} spája modely bez cenzúry, otvorené aj bežné modely s tvorbou médií v jednom čete a so spoločným zostatkom.",
    },
    free: {
      q: "Existuje bezplatná alternatíva k Venice AI?",
      a: "Áno. Bezplatný plán Venice dáva 10 textových a 15 obrazových zadaní denne. FreedomGPT začína zadarmo a bez účtu. LM Studio je zadarmo na tvojom hardvéri. {{appName}} dáva mesačne {{guestCredits}} kreditov zadarmo bez účtu a {{freeCredits}} s účtom, vrátane modelov bez cenzúry po jednorazovom potvrdení veku 18+.",
    },
    private: {
      q: "Ktorá alternatíva k Venice poskytuje najviac súkromia?",
      a: "Pri lokálnom riešení, ako je LM Studio, model beží v tvojom zariadení a zadania ho neopúšťajú. Z hostovaných služieb ukladajú históriu četu v prehliadači NanoGPT a anonymný režim {{appName}}. Hostovaný model stále dostane každé zadanie, na ktoré odpovedá.",
    },
    api: {
      q: "Ktorá alternatíva ponúka API bez cenzúry?",
      a: "NanoGPT, uncensored.ai, Gab AI, OpenRouter aj {{appName}} ponúkajú API kompatibilné s OpenAI. Na abliterované váhy len cez API ich za cenu poskytovateľa predávajú OpenUncensored a NEAR AI Cloud. Pokrytie sa veľmi líši: OpenRouter nemá abliterované modely, NanoGPT ich má desiatky. Na {{appName}} odomkne API ktorýkoľvek plán od {{apiSubPrice}} mesačne.",
    },
    same: {
      q: "Môžem modely od Venice používať aj inde?",
      a: "Niektoré. {{appName}} smeruje {{veniceModels}} modelov cez Venice, vrátane {{veniceExamples}}, v tom istom čete ako Claude, GPT a ostatné. Venice Uncensored uvádzajú aj OpenRouter, NanoGPT a OpenUncensored.",
    },
    account: {
      q: "Potrebujem účet, aby som si to vyskúšal?",
      a: "Na {{appName}} funguje anonymný čet bez účtu. S bezplatným účtom máš prístup k četom z rôznych zariadení a mesačný prídel sa zvýši na {{freeCredits}} kred.",
    },
    noGpuLink: "Spustiť LLM bez cenzúry online aj bez grafickej karty",
    apiLink: "API pre LLM bez cenzúry: identifikátory modelov, kód a limity",
    openRouterLink: "Alternatívy k OpenRouter bez cenzúry v porovnaní",
  },
  cta: {
    title: "Súkromný čet aj modely bez cenzúry podľa potreby",
    subtitle:
      "{{guestCredits}} kred. zadarmo každý mesiac, aj bez účtu. Začni anonymný čet a vyber si model.",
    start: "Spustiť anonymný čet",
    models: "Porovnať všetky modely",
  },
};
