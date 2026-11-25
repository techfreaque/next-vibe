import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Nové modely a poskytovatelia bez cenzúry | {{appName}}",
    description:
      "Claude 5.5, GPT-6, Gemini 4 Argon, Grok 4.7 a nové otvorené modely. Pribudol NanoGPT, viac modelov Venice a prvé generátory obrázkov bez cenzúry.",
    category: "Aktualizácia modelov",
    imageAlt: "Aktualizácia modelov na {{appName}} v novembri 2026",
    keywords:
      "{{appName}}, Claude Opus 5.5, GPT-6, Gemini 4 Argon, Grok 4.7, AI bez cenzúry, Venice, NanoGPT, Lustify, Chroma",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Aktualizácia modelov",
    readTime: "5 min čítania",
    title: "Dorazila nová generácia modelov. Aj bez cenzúry.",
    subtitle:
      "Každá hlavná rodina modelov prešla na novšiu generáciu. Pribudol druhý poskytovateľ bez cenzúry a prvýkrát môžeš bez cenzúry tvoriť aj obrázky.",
  },
  intro: {
    lead: "Katalóg je opäť aktuálny. Dostupné modely: {{modelCount}}, z toho bez cenzúry: {{uncensoredCount}}.",
    p2: "Nemusíš nič nastavovať. Ak máš pripnutý starší model, tvoje čety automaticky prejdú na jeho nástupcu.",
  },
  filter: {
    title: "Čo u nás znamená „bez cenzúry“",
    intro: "Na výber máš tri úrovne.",
    p1: "Každý model má úroveň filtrovania obsahu. Bežné modely si ponechávajú filtre poskytovateľov. Otvorené modely filtrujú menej. Modely bez cenzúry odpovedajú bez poučovania. Väčšinou ide o existujúce modely s odstránenými mechanizmami odmietania. Tréning aj svetonázor im ostali, otázkam sa však prestali vyhýbať. UncensoredLM sa trénoval na knihách a dokumentoch zakázaných na bežnom internete a má vlastný svetonázor.",
    p2: "Úroveň vyberáš ty. Na prácu zvoľ bežný model. Na otázku, ktorej sa ostatní vyhýbajú, vyskúšaj model bez cenzúry. Stačí ten istý účet aj čet.",
    mainstream: "Bežné",
    open: "Otvorené",
    uncensored: "Bez cenzúry",
    mainstreamBody:
      "Filtre poskytovateľov ostávajú. Bezpečná predvolená voľba na prácu.",
    openBody: "Menej odmietnutí. Časť obmedzení zostáva.",
    uncensoredBody:
      "Priame odpovede bez poučovania. Ty rozhoduješ, čo sa opýtaš.",
    countLabel: "Dostupné modely: {{count}}",
  },
  lineup: {
    title: "Nové modely",
    intro:
      "Modely sme zoskupili podľa rodín. Staršie voľby v týchto rodinách teraz odkazujú na nové verzie.",
    claude: "Claude",
    claudeNote:
      "Nová generácia od Anthropic, od dôkladného uvažovania až po rýchle odpovede.",
    gpt: "GPT",
    gptNote: "Rodina GPT-6 od OpenAI. Každá úroveň má aj variant Pro.",
    gemini: "Gemini",
    geminiNote:
      "Špičkový model od Googlu a rýchla, lacná voľba na bežné úlohy.",
    grok: "Grok",
    grokNote: "Najnovší model od xAI sme zaradili medzi otvorené modely.",
    openModels: "Otvorené modely",
    openModelsNote:
      "Kimi, DeepSeek, GLM a MiniMax. Výkonné modely s miernejšími filtrami.",
  },
  uncensored: {
    title: "Rozšírili sme ponuku bez cenzúry",
    intro: "Viac modelov, dvaja poskytovatelia a generovanie obrázkov.",
    veniceTitle: "Venice rozširuje ponuku",
    veniceBody:
      "Venice prevádzkuje väčšinu našich modelov bez cenzúry. Jeho najvýkonnejším modelom je po novom {{veniceModel}} a pribudli aj ďalšie:",
    nanoTitle: "NanoGPT ako druhý poskytovateľ",
    nanoBody:
      "NanoGPT ponúka {{glm}} a {{glmFlash}} s kontextom milión tokenov. Model {{deepseek}} tak môžeš použiť cez NanoGPT aj Venice. Pribudol aj vlastný model NanoGPT, {{mimoAbliterated}}. Pri výpadku jedného poskytovateľa môže jeho úlohu prevziať druhý.",
    imagesTitle: "Prvé modely na obrázky bez cenzúry",
    imagesBody:
      "{{lustify}} a {{chroma}} prevádzkuje Venice. Jeden obrázok stojí jeden kredit. Všetky predošlé obrazové modely patrili medzi bežné alebo otvorené.",
    warning:
      "Model {{model}} má najmenej obmedzení spomedzi všetkých modelov, ktoré sme doteraz ponúkali. Patrí do kategórie bez cenzúry a použiješ ho, až keď si ho sám vyberieš.",
  },
  underTheHood: {
    title: "Ako zmeny fungujú",
    intro: "Takto prebieha výmena modelov a aktualizácia ich údajov.",
    successorsTitle: "Starším modelom priradíme nástupcov",
    successorsBody:
      "ID starších modelov ostávajú funkčné, hoci samotné modely už v ponuke nevidíš. Pripnuté modely a uložené zručnosti prejdú podľa mapy nástupcov na aktuálny model, pokiaľ je pre teba dostupný. Inak ti ostane pôvodná voľba. Nesúvisiaci model ti potichu nepodsuneme.",
    pricesTitle: "Ceny, ktoré zostávajú aktuálne",
    pricesBody:
      "Pre Venice a NanoGPT teraz získavame ceny, veľkosti kontextových okien aj podporované modality bez kľúča API. Práve pre chýbajúce ceny sa starší model od Venice automaticky vypol. Odteraz sa to už nestane bez upozornenia.",
    toolsTitle: "Ako modely volajú nástroje",
    toolsBody:
      "Modely NanoGPT volajú nástroje natívne. Venice Uncensored v našich testoch natívne nástroje ignoroval, preto pri ňom používame fungujúce riešenie s pokynmi v zadaní.",
  },
  cta: {
    title: "Vyber model. Nastav si filter.",
    subtitle:
      "Všetky uvedené modely nájdeš v čete. Porovnaj ich alebo rovno začni rozhovor.",
    chat: "Začať čet",
    models: "Prehľad všetkých modelov",
  },
};
