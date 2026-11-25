import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatívy ku Groku s miernejšími filtrami | {{appName}}",
    description:
      "Porovnaj Grok s {{appName}}, Perplexity, Gemini, Venice a lokálnymi aplikáciami na vyhľadávanie, tvorbu médií a čet s menším počtom odmietnutí.",
    category: "Porovnanie",
    imageAlt: "Grok v porovnaní s modelmi bez cenzúry",
    keywords:
      "alternatíva ku Grok, alternatívy ku Grok, Grok bez cenzúry, je Grok bez cenzúry, Grok bez účtu X, Grok a AI bez cenzúry, služby ako Grok, alternatíva ku Grok Unhinged, Grok Imagine, {{appName}}",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Porovnanie",
    readTime: "7 min čítania",
    title: "Alternatívy ku Groku na vyhľadávanie, médiá a čet",
    subtitle:
      "Porovnaj Grok s výskumnými asistentmi, tvorivými aplikáciami a modelmi, ktoré menej často odmietajú odpovedať.",
  },
  intro: {
    lead: "Grok vyhľadáva na X aj na webe, rozpráva hlasom a vytvára obrázky aj videá. Zverejnené pravidlá určujú hranice. Vhodná alternatíva závisí od toho, ktorú jeho funkciu využívaš najviac.",
    p2: "Pozri si, čo Grok dokáže, kde má hranice a ktoré alternatívy sa hodia na tvoju úlohu. {{grokName}} si môžeš ponechať a do toho istého vlákna pridať aj modely s oslabeným odmietaním. Na {{appName}} beží {{grokName}} vedľa {{uncensored}} modelov bez cenzúry.",
  },
  honest: {
    title: "Funkcie a limity modelu Grok",
    intro: "Neformálny štýl s vlastnými pravidlami používania.",
    looser:
      "Štýl: Grok ponúka textový aj hlasový čet. Tón závisí od modelu a vybraného režimu.",
    filtered:
      "Filtre: xAI má pravidlá používania a bezpečnostný tréning. Niektoré zadania Grok odmietne, zjemní alebo obráti na inú tému.",
    shifts:
      "Aktualizácie pravidiel a modelu môžu zmeniť jeho správanie. Funkcie, na ktoré sa spoliehaš, otestuj na bežných vlastných zadaniach.",
    catalog:
      "{{grokName}} patrí do kategórie {{grokTier}}. Pravidlá poskytovateľa stále platia.",
    callout:
      "Porovnaj funkcie produktu, pravidlá poskytovateľa a správanie konkrétneho modelu, ktorý chceš používať.",
  },
  why: {
    title: "Prečo ľudia hľadajú alternatívy ku Grok",
    intro: "Tri dôvody sa opakujú najčastejšie.",
    policy:
      "Pravidlá: Priamosť modelu Grok závisí od aktuálnych nastavení xAI. Ak potrebuješ predvídateľnejšie správanie, hľadaj model s upravenými váhami, ktoré obmedzujú naučené odmietanie.",
    account:
      "Účet: Aplikácie Grok závisia od ekosystému X a xAI. Nie každý chce čety prepojiť s týmto účtom.",
    voice:
      "Jeden štýl: Osobnosť Grok sa hodí na slovné prestrelky. Na vecnú technickú odpoveď, hlas zloducha alebo pohľad mimo jeho tréningu sa môže hodiť iný model.",
  },
  alternatives: {
    title: "Alternatívy ku Grok podľa využitia: {{count}} možností",
    intro:
      "Všetky môžeš použiť v tom istom čete ako Grok. Cena za referenčnú správu pochádza z aktuálneho katalógu.",
    edge: {
      title: "Priamejší štýl a silné uvažovanie: {{model}}",
      body: "Abliterovaná verzia bežného modelu, ktorá odpovedá aj na niektoré otázky odmietané modelom Grok. Silná v uvažovaní a programovaní. {{price}} za správu.",
    },
    reasoning: {
      title: "Podrobné uvažovanie bez poučovania: {{model}}",
      body: "Abliterovaný vlajkový Kimi od Moonshot AI. Dáva dlhé, premyslené odpovede na ťažké otázky a menej často odmieta. {{price}} za správu.",
    },
    cheap: {
      title: "Rýchlo a lacno: {{model}}",
      body: "DeepSeek s oslabeným odmietaním. Rýchly, dobrý v kóde a analýze a veľmi lacný. {{price}} za správu.",
    },
    contrary: {
      title: "Zámerne odlišné názory: {{model}}",
      body: "{{model}} je trénovaný na knihách a dokumentoch zakázaných v hlavnom prúde internetu. Preto vyjadruje aj iné politické postoje. {{price}} za správu.",
    },
    roleplay: {
      title: "Postavy a temná beletria: {{model}}",
      body: "Doladený na hranie rolí. Drží sa postavy, zvláda temné scény a neprerušuje príbeh upozornením. {{price}} za správu.",
    },
    chatLink: "Četovať s {{model}}",
    directoryLink: "Všetky abliterované modely, ich kontext a ceny",
  },
  models: {
    title: "Grok a jeho alternatívy vedľa seba",
    intro:
      "Pod každým názvom je kategória obsahu alebo spôsob, akým model znižuje odmietanie.",
    colModel: "Model",
    colContext: "Kontext",
    colStrengths: "Silné stránky",
    colPrice: "Za správu",
    colChat: "Vyskúšať",
    chatLink: "Četovať s {{model}}",
    footnote:
      "Cena jednej referenčnej správy vrátane našej prirážky {{markup}} %.",
  },
  keep: {
    title: "Ponechaj si Grok a pridaj ďalšie modely",
    intro:
      "{{grokName}} aj modely bez cenzúry fungujú v jednom čete so spoločným zostatkom.",
    steps: {
      ask: {
        title: "Začni s Grok",
        body: "Otvor čet s {{grokName}}. Vyskúšaj žartovanie, názory na správy alebo rýchle odpovede.",
      },
      switch: {
        title: "Zmeň model, keď sa vyhýba odpovedi",
        body: "Na ďalšiu správu vyber model bez cenzúry. Preberie celý doterajší čet a odpovie v súvislostiach.",
      },
      compare: {
        title: "Porovnaj na rovnakom zadaní",
        body: "Pošli obom rovnaké zadanie a prečítaj si odpovede vedľa seba. Na stránkach s porovnaním nájdeš parametre.",
      },
    },
    compareLink: "{{a}} a {{b}}",
  },
  imagine: {
    title: "Funguje tu aj Grok Imagine",
    intro:
      "{{imagineNames}}: modely xAI na obrázky a video za rovnaké kredity. Účet X nepotrebuješ.",
    link: "Tvoriť s {{model}}",
  },
  faq: {
    title: "Časté otázky",
    uncensored: {
      q: "Je Grok bez cenzúry?",
      a: "Grok má voľnejší štýl ako ChatGPT alebo Claude. xAI však používa pravidlá aj bezpečnostný tréning a jeho správanie sa často mení. Abliterované modely majú upravené váhy, aby menej odmietali.",
    },
    best: {
      q: "Ktorá alternatíva ku Grok je najlepšia?",
      a: "Záleží na úlohe. Silný model s menším počtom odmietnutí je napríklad abliterovaný {{firstName}}. Na odlišné názory skús {{ownModel}}. Na hranie rolí vyber model doladený na príbehy. Všetky bežia vedľa Grok v jednom čete na {{appName}}.",
    },
    account: {
      q: "Môžem používať Grok bez účtu X?",
      a: "Áno. {{grokName}} beží v anonymnom čete na {{appName}} úplne bez účtu. Začneš s {{guestCredits}} kred. zadarmo mesačne.",
    },
    price: {
      q: "Koľko tu stojí Grok?",
      a: "Platíš za správy z jediného zostatku kreditov bez samostatného predplatného. Referenčná správa na {{grokName}} stojí {{grokPrice}}.",
    },
    api: {
      q: "Funguje Grok aj modely bez cenzúry cez jedno API?",
      a: "Áno. Koncové body sú kompatibilné s OpenAI aj Anthropicom. Jeden kľúč platí pre Grok, Claude, GPT aj modely bez cenzúry. Kľúče API odomkne prvý nákup a plány začínajú na {{apiSubPrice}} mesačne.",
    },
    imagine: {
      q: "Môžem tu s Grok Imagine vytvárať obrázky a videá?",
      a: "Áno. {{imagineNames}} fungujú na stránkach tvorby aj v ľubovoľnom čete. Spotreba sa odpočíta z toho istého zostatku.",
    },
    chatLink: "Čet s AI bez cenzúry: vyber model a začni",
    chatgptLink: "Alternatíva k ChatGPT bez filtrov",
    refusalLink: "Index odmietnutí: ktoré modely odpovedajú",
  },
  cta: {
    title: "Zachovaj si Grok a vyskúšaj priamejšie modely",
    subtitle:
      "{{guestCredits}} kred. zadarmo mesačne bez účtu. Začni s {{firstName}}.",
    start: "Začať čet bez cenzúry",
    models: "Porovnať všetky modely",
  },
};
