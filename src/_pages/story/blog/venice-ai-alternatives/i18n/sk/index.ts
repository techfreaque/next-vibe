import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatívy k Venice AI na súkromný čet (2026)",
    description:
      "Venice AI oproti {{appName}}, Maple, Proton Lumo, Duck.ai, NanoGPT a lokálnym aplikáciám. Kde sa spracúvajú zadania, aké majú filtre a ceny.",
    category: "Porovnanie",
    imageAlt: "Porovnanie alternatív k Venice AI",
    keywords:
      "alternatívy k Venice AI, stránky ako Venice AI, alternatíva k Venice.ai, súkromná AI bez cenzúry, alternatívy četu bez cenzúry, Venice AI a NanoGPT, Venice AI a FreedomGPT, AI bez cenzúry s API, súkromný čet s AI, {{appName}}",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Porovnanie",
    readTime: "9 min čítania",
    title: "Alternatívy k Venice AI na súkromný čet",
    subtitle:
      "{{appName}} a ďalšie alternatívy ({{count}}) podľa ich cenníkov, filtrov a zásad súkromia. Údaje overené {{date}}.",
  },
  intro: {
    lead: "Venice si vybudovalo meno na dvoch sľuboch: súkromie a čet bez cenzúry. Veľa z toho dodržiava. Bezplatný plán má však tesné limity, vypnutie filtra pre dospelých vyžaduje Pro a nie každý chce popri čete riešiť staking kryptomien.",
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
    weak: "Kde má Venice navrch: Má väčší katalóg a za token vlastných modelov si účtuje menej, lebo my k jeho cene pripočítavame maržu. Kryptomenový staking ako VVV alebo DIEM neponúkame.",
    directoryLink: "Všetky abliterované modely, ich kontext a ceny",
    ownLink: "Pozrieť si {{ownModel}}",
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
      "Vlastníš VVV alebo DIEM, prípadne chceš platiť za volania API bez účtu. Ostatné služby v zozname túto možnosť neposkytujú rovnakým spôsobom.",
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
      a: "Áno. FreedomGPT sa dá vyskúšať bezplatne a bez účtu. LM Studio je zadarmo na vlastnom zariadení. {{appName}} poskytuje {{guestCredits}} kred. mesačne bez účtu alebo {{freeCredits}} s účtom. Modely bez cenzúry sprístupní po jednorazovom potvrdení veku 18+.",
    },
    private: {
      q: "Ktorá alternatíva k Venice poskytuje najviac súkromia?",
      a: "Pri lokálnom riešení, ako je LM Studio, model beží v tvojom zariadení a zadania ho neopúšťajú. Z hostovaných služieb ukladajú históriu četu v prehliadači NanoGPT a anonymný režim {{appName}}. Hostovaný model stále dostane každé zadanie, na ktoré odpovedá.",
    },
    api: {
      q: "Ktorá alternatíva ponúka API bez cenzúry?",
      a: "NanoGPT, uncensored.ai, Gab AI, OpenRouter aj {{appName}} ponúkajú API kompatibilné s OpenAI. Ponuka modelov bez cenzúry sa výrazne líši. OpenRouter ich má málo, NanoGPT veľa. Na {{appName}} získaš prístup k API s plánom od {{apiSubPrice}} mesačne.",
    },
    same: {
      q: "Môžem modely od Venice používať aj inde?",
      a: "Niektoré áno. {{appName}} sprístupňuje cez Venice {{veniceModels}} modelov vrátane {{veniceExamples}} v tom istom čete ako Claude, GPT a ďalšie. OpenRouter aj NanoGPT ponúkajú tiež Venice Uncensored.",
    },
    account: {
      q: "Potrebujem účet, aby som si to vyskúšal?",
      a: "Na {{appName}} funguje anonymný čet bez účtu. S bezplatným účtom máš prístup k četom z rôznych zariadení a mesačný prídel sa zvýši na {{freeCredits}} kred.",
    },
    noGpuLink: "Spustiť LLM bez cenzúry online aj bez grafickej karty",
    apiLink: "API pre LLM bez cenzúry: identifikátory modelov, kód a limity",
  },
  cta: {
    title: "Súkromný čet aj modely bez cenzúry podľa potreby",
    subtitle:
      "{{guestCredits}} kred. zadarmo každý mesiac, aj bez účtu. Začni anonymný čet a vyber si model.",
    start: "Spustiť anonymný čet",
    models: "Porovnať všetky modely",
  },
};
