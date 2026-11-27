import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatívy k NoFilterGPT: čet bez cenzúry (2026)",
    description:
      "Porovnaj NoFilterGPT s Venice, Unrestricted.chat, {{appName}} a lokálnymi nástrojmi ako Ollama. Modely, bezplatné limity, súkromie a API.",
    category: "Porovnanie",
    imageAlt: "Porovnanie alternatív k NoFilterGPT",
    keywords:
      "alternatívy k NoFilterGPT, alternatíva k NoFilterGPT, služby ako NoFilterGPT, NoFilterGPT a Venice, čet s AI bez cenzúry, čet s AI bez filtrov, ChatGPT bez filtra, četbot bez cenzúry, {{appName}}",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Porovnanie",
    readTime: "8 min čítania",
    title: "Alternatívy k NoFilterGPT so širším výberom modelov",
    subtitle:
      "{{appName}} a ďalšie alternatívy ({{count}}) podľa cien, filtrov a zásad súkromia z ich vlastných stránok.",
  },
  intro: {
    lead: "NoFilterGPT ponúka četbota, ktorý ťa nepoučuje. Dostaneš jeden model, bezplatný plán má denný limit a sľub o súkromí musíš brať na slovo.",
    p2: "Alternatívy sme overili na stránkach jednotlivých služieb. Údaje o konkurencii platia k {{date}}, o NoFilterGPT k {{nfDate}}. Od niektorých kupujeme modely pre náš čet, len cez Venice ich sprístupňujeme {{veniceModels}}. Uvádzame aj ich výhody.",
  },
  nfg: {
    title: "Čo ponúka NoFilterGPT",
    intro:
      "Podľa vlastnej domovskej stránky a zásad ochrany súkromia, overených k {{nfDate}}.",
    model:
      "Model: Jeden vlastný model údajne používa architektúru GPT bez obvyklých obmedzení. Služba neuvádza základný model a iný si nevyberieš.",
    price:
      "Cena: Bezplatný Basic má denný limit správ. Professional stojí {{proPrice}} mesačne a dáva takmer neobmedzený čet, analýzu a tvorbu obrázkov aj prístup k API.",
    media:
      "Médiá: Tvorba a úpravy obrázkov, video z obrázka, hlasový vstup aj výstup.",
    privacy:
      "Súkromie: Domovská stránka uvádza, že konverzácie neuchováva a čety šifruje. Podľa zásad ochrany súkromia môže z bezpečnostných dôvodov zaznamenávať adresy IP, eviduje údaje o používaní a na webe používa Cloudflare Analytics.",
    payments: "Platby: Karty cez Stripe aj ETH, BTC a USDC.",
    why: "Prečo ľudia hľadajú alternatívu: Chcú si vybrať model, porovnať odpovede alebo overiť sľub o súkromí v konkrétnych zásadách.",
    sourceHome: "Domovská stránka NoFilterGPT",
    sourcePrivacy: "Zásady ochrany súkromia NoFilterGPT",
  },
  criteria: {
    title: "Čo porovnať pred prechodom",
    intro: "Rozhodni sa podľa piatich otázok.",
    models:
      "Modely: Jeden vlastný alebo viac na výber? Sú dostupné abliterované modely aj modely bez cenzúry? Nájdeš na tom istom mieste Claude, GPT a Gemini?",
    filter:
      "Filter: Čo povoľuje bezplatný plán? Kedy potrebuješ predplatné? Overuje sa vek?",
    privacy:
      "Súkromie: Kde sú čety uložené, čo sa zaznamenáva a používa ich niekto na trénovanie?",
    price:
      "Cena: Aký je bezplatný prídel? Platíš predplatné alebo podľa spotreby? Čo sa stane pri prekročení limitu?",
    api: "API: Môžeš rovnaké modely volať z kódu a v akom formáte?",
  },
  table: {
    title: "Všetky možnosti vedľa seba",
  },
  us: {
    title: "{{appName}}: všetky typy modelov v jednom čete",
    intro:
      "{{modelCount}} modelov v jednom čete so spoločným zostatkom. Úroveň filtrovania vyberáš pre každú správu.",
    models:
      "Modely: {{uncensored}} bez cenzúry, {{mainstream}} bežných a {{open}} otvorených. {{ownModel}} je trénovaný na knihách a dokumentoch zakázaných v hlavnom prúde internetu. Vyjadruje aj odlišné politické názory.",
    switch:
      "Model môžeš zmeniť uprostred četu. Opýtaj sa modelu bez cenzúry a potom si odpoveď porovnaj s bežným modelom.",
    privacy:
      "Súkromie: Anonymné čety zostávajú v lokálnom úložisku prehliadača a účet nepotrebuješ. Súkromné čety sa ukladajú len do tvojho účtu.",
    price:
      "Cena: Mesačne {{guestCredits}} kred. bez účtu alebo {{freeCredits}} s účtom, {{maxCredits}} pri odbere noviniek. Plány od {{subPrice}} mesačne. K aktívnemu plánu si dokúpiš kredity, ktoré nevypršia.",
    api: "API: Rovnaké modely ponúkame cez koncové body kompatibilné s OpenAI aj Anthropicom. Odomkne ich každý plán od {{apiSubPrice}} mesačne.",
    weak: "Kde máme slabinu: Neponúkame neobmedzený paušál. Každá správa stojí kredity podľa vybraného modelu.",
    hubLink: "Čet s AI bez cenzúry: všetky modely, ich kontext a ceny",
    ownLink: "Pozrieť si {{ownModel}}",
  },
  list: {
    title: "Alternatívy: {{count}} možností podrobne",
    intro:
      "Údaje zo stránok služieb overené k {{date}}. Pri každej uvádzame modely, pravidlá filtrovania aj to, ako nakladá s tvojimi četmi.",
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
    title: "Čo uvádzajú zásady ochrany súkromia",
    intro:
      "Sľub o nulovom zaznamenávaní je silný. Takto ho jednotlivé služby vysvetľujú.",
    nfg: "NoFilterGPT: Domovská stránka tvrdí, že čety sa neuchovávajú. Zásady súkromia pripúšťajú zaznamenávanie adries IP a používania. Cloudflare spracúva údaje požiadaviek.",
    us: "Na {{appName}} sa anonymné čety ukladajú do lokálneho úložiska prehliadača. Po vymazaní údajov prehliadača zmiznú.",
    transit:
      "Každý hostovaný model dostane tvoje zadanie. V NoFilterGPT, Venice aj u nás musí správa prejsť na server, kde model beží. Na zariadení zostane len pri lokálnom modeli.",
    callout:
      "História uložená v zariadení drží čety mimo firemných serverov. Model však zadanie potrebuje na vytvorenie odpovede.",
  },
  faq: {
    title: "Časté otázky",
    best: {
      q: "Ktorá alternatíva k NoFilterGPT je najlepšia?",
      a: "Záleží, čo ti chýba. Venice ponúka veľký katalóg a históriu v zariadení. uncensored.ai má jeden priamy model s vlastným svetonázorom. NanoGPT účtuje podľa spotreby. LM Studio na vlastnom počítači chráni súkromie najviac. {{appName}} spája modely bez cenzúry, otvorené aj bežné modely s médiami v jednom čete a so spoločným zostatkom.",
    },
    free: {
      q: "Existuje bezplatná alternatíva k NoFilterGPT?",
      a: "Áno. FreedomGPT funguje na začiatok aj zadarmo bez účtu. LM Studio je zadarmo na vlastnom zariadení. {{appName}} poskytuje {{guestCredits}} kred. mesačne bez účtu alebo {{freeCredits}} s účtom, {{maxCredits}} pri odbere noviniek. Modely bez cenzúry sa odomknú po jednorazovom potvrdení veku 18+.",
    },
    models: {
      q: "Aký model používa NoFilterGPT?",
      a: "Domovská stránka opisuje vlastný model postavený na architektúre GPT. Základný model nemenovala. Na {{appName}} má každý model stránku s laboratóriom, veľkosťou kontextu a cenou, aby si vedel, kto ti odpovedá.",
    },
    private: {
      q: "Ktorá alternatíva poskytuje najviac súkromia?",
      a: "Pri lokálnom nástroji ako LM Studio beží model na tvojom zariadení a zadania ho neopúšťajú. Z hostovaných možností ukladajú históriu v prehliadači Venice a anonymný režim {{appName}}. Každý hostovaný model vidí zadanie, na ktoré odpovedá.",
    },
    api: {
      q: "Ktorá alternatíva má API bez cenzúry?",
      a: "Venice, NanoGPT, uncensored.ai, Gab AI aj {{appName}} majú API kompatibilné s OpenAI. NoFilterGPT sprístupňuje API v pláne Professional. Na {{appName}} ho odomkne každý plán od {{apiSubPrice}} mesačne.",
    },
    account: {
      q: "Potrebujem účet na vyskúšanie?",
      a: "Na {{appName}} funguje anonymný čet bez účtu. Bezplatný účet sprístupní čety na viacerých zariadeniach a zvýši mesačný prídel na {{freeCredits}} kred.",
    },
    chatgptLink: "Alternatíva k ChatGPT bez filtrov",
    kindsLink: "Abliterácia, doladenie a vlastný svetonázor: tri druhy modelov",
  },
  cta: {
    title: "Vyber si model aj filter",
    subtitle:
      "{{guestCredits}} kred. zadarmo mesačne bez účtu. Otvor anonymný čet a vyskúšaj ľubovoľný model.",
    start: "Spustiť anonymný čet",
    models: "Pozrieť si modely bez cenzúry",
  },
};
