import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Hranie rolí s AI bez filtrov: alternatíva k Character.AI",
    description:
      "Hraj roly s AI bez filtrov. Postavy držia rolu aj v temných scénach. Porovnaj pamäť, súkromie a cenu za odpoveď. Začni zadarmo aj bez účtu.",
    category: "Návod",
    imageAlt: "{{appName}}: hranie rolí s AI bez filtra",
    keywords:
      "hranie rolí s AI bez filtra, alternatíva k Character.AI, alternatíva k Character.AI bez filtrov, necenzurované hranie rolí, nefiltrovaný AI čet, hranie rolí pre dospelých, temné príbehy s AI, hranie postáv s AI bez obmedzení, necenzurovaný čet s postavami, UncensoredLM, Venice Role Play, Artemis 31B, {{appName}}",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Návod",
    readTime: "8 min čítania",
    title: "Hranie rolí s AI bez filtrov. Príbeh vedieš ty.",
    subtitle:
      "Na {{appName}} môžeš z jedného zostatku používať bežné modely aj modely bez cenzúry na hranie rolí ({{uncensoredCount}}). Ktorý udrží postavu, zapamätá si celý príbeh a koľko stojí odpoveď?",
  },
  intro: {
    lead: "Scéna sa rozbiehala. Zrazu tvoja postava vystúpi z príbehu, aby ti povedala, že nemôže pokračovať. Zloduch sa odrazu ospravedlňuje. Horor sa zmení na bezpečnostné upozornenie. Romantická scéna sa zakaždým skončí v tme. Na Character.AI a vo väčšine četbotov má posledné slovo filter.",
    p2: "Ako vyzerá hranie rolí bez filtrov na {{appName}}? Porovnáme {{modelCount}} modelov a ukážeme, ktoré sa hodia na temnú fikciu, dlhé kampane či hranie s malým rozpočtom. Dozvieš sa aj to, ako funguje pamäť, ako si za dve minúty vytvoríš postavu a koľko zaplatíš za odpoveď.",
  },
  exists: {
    title: "Existuje verzia Character.AI bez filtra?",
    p1: "Priamo od Character.AI nie. Pre všetkých používateľov platí rovnaký filter. Nevypneš ho v nastaveniach ani v platenom programe. Pokusy prekabátiť ho zadaním fungujú nespoľahlivo.",
    p2: "Inou možnosťou je zvoliť si iný model. Na {{appName}} nájdeš necenzurované modely určené na písanie fikcie. Zostávajú v role a príbeh neprerušujú odmietaním či poučovaním. Model si môžeš vybrať pre každú správu, aj uprostred scény.",
    consent:
      "Necenzurované modely sú pre dospelých. Pri prvom použití jednorazovo potvrdíš, že máš aspoň 18 rokov. Potom o obsahu príbehu rozhoduješ ty.",
  },
  levels: {
    title: "Čo znamená hranie rolí bez filtra",
    intro: "Každý model patrí do jednej z troch kategórií filtrovania.",
    mainstream:
      "Bežné modely ako Claude, GPT a Gemini píšu dobre, ale majú prísne filtre. Násilie zmiernia, intímnu scénu preskočia a pri temných témach pridajú upozornenie.",
    open: "Otvorené modely ako Kimi, MiniMax, DeepSeek a GLM majú miernejšie filtre. Väčšinu scén pre dospelých zvládnu a tie najtemnejšie zjemnia.",
    uncensored:
      "Necenzurované modely pracujú bez obsahového filtra. Explicitné, násilné aj tabuizované scény rozvíjajú podľa zadania.",
    twoKinds:
      "Necenzurované modely sú dvojaké. Väčšina vychádza z bežných modelov, ktorým vývojári upravili mechanizmus odmietania odpovedí alebo ich dodatočne natrénovali na necenzurované odpovede. Prestávajú odmietať, no zachovávajú si pohľad pôvodného modelu. Aj temnú scénu tak môžu nečakane zmierniť. {{ownName}} vznikol inak. Učil sa aj z kníh a dokumentov zakázaných na hlavných internetových platformách a príbeh automaticky nevracia k umiernenejšiemu podaniu.",
  },
  table: {
    title: "Porovnanie modelov na hranie rolí",
    intro:
      "Údaje sa načítavajú z nášho katalógu modelov. Pamäťou sa tu myslí kontextové okno, teda časť príbehu, ktorú model číta pred každou odpoveďou. Jeden kredit má hodnotu {{creditValue}}.",
    colModel: "Model",
    colFilter: "Úroveň filtrovania",
    colMemory: "Pamäť",
    colImages: "Rozumie obrázkom",
    colPrice: "Cena za odpoveď",
    memory: "{{context}} tokenov, približne {{pages}} strán",
    yes: "Áno",
    no: "Nie",
    credits: "{{credits}} kred.",
    footnote:
      "Cena za odpoveď vychádza z dlhej scény: model dostane rozsiahlu časť príbehu a napíše celú odpoveď. Krátky dialóg vyjde lacnejšie. Uvedená cena počíta s najlacnejším poskytovateľom daného modelu a zahŕňa našu prirážku.",
  },
  models: {
    uncensoredLm: "Temné a tabuizované témy, vlastný pohľad na svet",
    artemis: "Vyladený na hranie rolí, dlhá pamäť a nízka cena",
    veniceRoleplay: "Drží sa spôsobu reči postavy",
    deepseekFlash: "Premyslené zápletky a veľká pamäť",
    glmFlash: "Rýchly, lacný a rozumie obrázkom",
    venice: "Cenovo dostupný všestranný model",
    minimaxFlash: "Najnižšia cena a mierny filter",
    kimi: "Prepracované postavy a mierny filter",
    sonnet: "Výborná próza a prísnejší filter",
  },
  picks: {
    title: "Ktorý model sa hodí k tvojmu príbehu?",
    intro: "Začni scénou, ktorú chceš napísať.",
    dark: {
      title: "Temné, tabuizované a explicitné scény",
      body: "{{ownName}} necháva temné scény vyznieť naplno bez moralizovania. Jeho slabinou je pamäť: {{ownContext}} tokenov, približne {{ownPages}} strán. Pri dlhej kampani tak stratí zo zreteľa prvé kapitoly. Artemis je vyladený na hranie rolí. Píše ponurú fantasy aj explicitné scény priamo a má podstatne dlhšiu pamäť.",
    },
    long: {
      title: "Dlhé kampane",
      body: "Ak príbeh trvá celé týždne, tieto modely udržia staršie scény dlhšie v kontexte. DeepSeek V4.1 Flash Uncensored vie uvažovať o zložitých zápletkách. {{roleplayName}} zachová prejav postavy aj pri kontexte s {{roleplayContext}} tokenmi.",
    },
    cheap: {
      title: "Keď píšeš často a chceš ušetriť",
      body: "Každodenný čet s postavou, krátke scény či veľa nových verzií odpovede. {{cheapestName}} tu ponúka najlacnejšiu odpoveď a mierny filter. Ďalšie dva modely sú necenzurované.",
    },
    filtered: {
      title: "Prepracované postavy, keď filter neprekáža",
      body: "Dráma s pomalým tempom, politické intrigy alebo záhada, ktorej stopy do seba zapadnú. Najlepší rozprávači majú filtre, a preto najtemnejšie momenty zjemnia. Vyber si ich tam, kde to príbehu neprekáža.",
    },
    compareLink: "Porovnať {{a}} a {{b}}",
  },
  memory: {
    title: "Zapamätá si AI moju postavu?",
    intro: "Pri hraní rolí sú dôležité dva druhy pamäti.",
    p1: "Krátkodobou pamäťou je kontextové okno. Obsahuje všetko, čo si model pred odpoveďou znovu prečíta. {{longestName}} zvládne {{longestContext}} tokenov, približne {{longestPages}} strán príbehu. {{ownName}} zvládne {{ownContext}} tokenov, teda asi {{ownPages}} strán. Keď vlákno okno prerastie, najstaršie scény z neho vypadnú. Mená, vzťahy a pravidlá sveta ulož do opisu postavy, aby mal model podstatné fakty stále poruke.",
    p2: "Dlhodobá pamäť si osobitne ukladá fakty o tebe a vybaví si ich aj v novom vlákne. Potrebuješ na to bezplatný účet a súkromný priečinok. Čety v režime inkognito spomienky neukladajú.",
  },
  setup: {
    title: "Ako si za dve minúty pripraviť postavu",
    intro:
      "Začni komunitnou zručnosťou, importuj verejnú postavu odkazom z Character.AI alebo Talkie alebo si podľa ďalších krokov vytvor vlastnú.",
    steps: {
      skill: {
        title: "Otvoriť zručnosť Hranie rolí",
        body: "Model dostane pokyn zostať v role, držať sa spôsobu reči postavy, nerozhodovať za tvoju postavu a vynechať upozornenia na obsah.",
      },
      variant: {
        title: "Vyber variant",
        body: "Necenzurovaný variant používa {{uncensored}} na temné a tabuizované scény. Tvorivý používa najlacnejší model {{creative}}. Hĺbkový variant používa {{deep}} na vykreslenie vnútorného života postáv v dlhých kampaniach.",
      },
      character: {
        title: "Opíš postavu a úvodnú scénu",
        body: "Ako sa volá, akú má povahu, ako hovorí, po čom túži a kde sa príbeh začína? Uveď, či píšeš v prvej alebo tretej osobe. Potom urob prvý ťah.",
      },
      switch: {
        title: "Zmeň model uprostred scény",
        body: "Model odmietol odpovedať alebo stráca výraz? Vyber iný a pošli ďalšiu správu. História zostáva vo vlákne a nový model z nej môže vychádzať.",
      },
      art: {
        title: "Pridaj podobizeň postavy",
        body: "V tom istom čete požiadaj o portrét. Obrázky čerpajú z rovnakých kreditov. K dispozícii sú aj necenzurované obrazové modely.",
      },
    },
    skillLink: "Otvoriť zručnosť Hranie rolí",
    imageLink: "Porovnať necenzurované generátory obrázkov",
  },
  privacy: {
    title: "Je môj príbeh súkromný?",
    intro: "Záleží na tom, v ktorom priečinku píšeš.",
    incognito:
      "Čety v režime inkognito sa uchovávajú v miestnom úložisku prehliadača. Na našich serveroch sa neukladajú. Keď vymažeš údaje prehliadača, zmiznú aj čety.",
    transit:
      "Každá správa však pri generovaní prechádza cez náš server k poskytovateľovi modelu, ktorý píše odpoveď. Tak fungujú hostované služby AI. Na účely fakturácie sa zaznamenáva spotreba kreditov.",
    private:
      "Súkromné čety sú uložené na serveri a vidíš ich len vo svojom účte na zariadeniach, na ktorých si sa prihlásil.",
    callout:
      "Inkognito neukladá tvoj príbeh na naše servery. Model, ktorý generuje odpoveď, však obsah správy dostane.",
  },
  pricing: {
    title: "Koľko stojí hranie rolí bez filtrov",
    intro:
      "Platíš za jednotlivé odpovede. Všetky modely čerpajú z rovnakých kreditov.",
    perReply:
      "Cena odpovede závisí od modelu a dĺžky scény. Tabuľka počíta s dlhou scénou. Jeden kredit má hodnotu {{creditValue}}.",
    cheapest:
      "Najlacnejšiu odpoveď ponúka {{cheapestName}} za {{cheapestPrice}}. Za {{unit}} dostaneš asi {{cheapestPerUnit}} odpovedí. Z necenzurovaných je najlacnejší {{uncensoredName}} za {{uncensoredPrice}}, teda približne {{uncensoredPerUnit}} odpovedí za {{unit}}.",
    free: "Zdarma každý mesiac: {{guestCredits}} kred. bez účtu alebo {{freeCredits}} s bezplatným účtom. Pri lacnom modeli to stačí aj na dlhšiu prvú kampaň.",
    sub: "Na výber sú štyri mesačné predplatné. Najnižšie zahŕňa {{subCredits}} kred. za {{subPrice}}.",
    pack: "Balíky pre predplatiteľov: {{packCredits}} kred. za {{packPrice}}. Kredity nevypršia. Zaplatíš kartou, cez PayPal alebo kryptomenou.",
    link: "Pozrieť si plány a balíky kreditov",
  },
  characterAi: {
    title: "Kedy sa viac oplatí Character.AI",
    intro: "Sú aj situácie, keď ti bude viac vyhovovať.",
    library:
      "Na Character.AI už sleduješ tvorcov alebo máš rozbehnuté príbehy a chceš v nich pokračovať.",
    flatRate:
      "Uprednostňuješ paušál bez premýšľania nad cenou odpovede. Pri kreditnom účtovaní sa dlhé scény na drahších modeloch môžu predražiť.",
    wantFilter:
      "Chceš mať filter stále zapnutý. Pre mladšieho používateľa alebo spoločné rodinné zariadenie sa viac hodí aplikácia s pevnými obmedzeniami.",
    callout:
      "Bez filtra nesieš zodpovednosť za to, čo napíšeš a zverejníš. Naďalej platia zákony krajiny, v ktorej žiješ.",
  },
  faq: {
    title: "Časté otázky",
    exists: {
      q: "Existuje AI čet na hranie rolí bez filtra?",
      a: "Áno. Na {{appName}} nájdeš necenzurované modely určené na fikciu vrátane {{ownName}}, Artemis a Venice Role Play. Scénu neprerušujú odmietaním či poučovaním a nevystupujú z roly. Stačí raz potvrdiť vek 18+.",
    },
    free: {
      q: "Dá sa hrať bez filtrov aj zdarma?",
      a: "Začať môžeš zdarma. Mesačne dostaneš {{guestCredits}} kred. bez účtu a {{freeCredits}} s bezplatným účtom. Pri dlhej scéne stojí odpoveď modelu {{uncensoredName}} približne {{uncensoredCredits}} kred. Ďalšie kredity ponúka predplatné od {{subPrice}} mesačne.",
    },
    nsfw: {
      q: "Môžem hrať aj scény pre dospelých?",
      a: "Áno, na necenzurovaných modeloch po jednorazovom potvrdení plnoletosti. Fikcia medzi dospelými je tvoja vec. Zákaz sexuálneho obsahu zahŕňajúceho maloletých platí aj tu.",
    },
    memory: {
      q: "Ako dlho si model pamätá príbeh?",
      a: "Model {{longestName}} zvládne {{longestContext}} tokenov, približne {{longestPages}} strán. Pri {{ownName}} je to asi {{ownPages}} strán. Podstatné údaje ulož do opisu postavy, aby boli stále súčasťou kontextu.",
    },
    private: {
      q: "Môže môj príbeh čítať niekto iný?",
      a: "Čety v režime inkognito zostávajú uložené v tvojom prehliadači. Súkromné čety sú dostupné len v tvojom účte. Správy však pri odpovedi prechádzajú k poskytovateľovi modelu.",
    },
    account: {
      q: "Potrebujem účet?",
      a: "Na hranie v režime inkognito nie. Bezplatný účet potrebuješ na dlhodobú pamäť a na čety, ktoré chceš otvárať z viacerých zariadení.",
    },
    guideLink: "Prečítať si sprievodcu necenzurovanými modelmi",
    chatgptLink: "Alternatíva k ChatGPT bez filtrov",
  },
  partners: {
    body: "Vedieš komunitu hráčov, server na Discorde alebo kanál o AI postavách? V partnerskom programe {{appName}} dostávaš opakovanú províziu z každej platby ľudí, ktorých odporučíš.",
    link: "Pozrieť si partnerský program",
  },
  cta: {
    title: "Vyber si postavu a napíš prvú scénu.",
    subtitle:
      "Každý mesiac máš {{guestCredits}} kreditov zdarma aj bez účtu. Medzi necenzurovanými, otvorenými a bežnými modelmi môžeš kedykoľvek prepnúť.",
    start: "Začať hrať rolu",
    models: "Porovnať všetky modely",
  },
};
