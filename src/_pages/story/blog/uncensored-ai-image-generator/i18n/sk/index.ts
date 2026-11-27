import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Generátory obrázkov bez cenzúry a ich ceny | {{appName}}",
    description:
      "Modely na obrázky ({{modelCount}}), z toho bez cenzúry ({{uncensoredCount}}), vedľa Flux, Seedream, GPT Image a Recraft. Ceny za obrázok aj úpravy vlastných fotiek.",
    category: "Porovnanie modelov",
    imageAlt:
      "{{appName}}: porovnanie necenzurovaných generátorov obrázkov s AI",
    keywords:
      "necenzurovaný generátor obrázkov AI, generovanie obrázkov bez obmedzení, AI obrázky bez filtra, obrázky pre dospelých vytvorené AI, necenzurovaná úprava obrázkov, Chroma, Lustify, Qwen Edit Uncensored, FLUX.3, Seedream 5.5, GPT Image, Recraft, cena AI za obrázok, najlacnejší generátor obrázkov AI, {{appName}}",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Porovnanie modelov",
    readTime: "8 min čítania",
    title: "Generátory obrázkov bez cenzúry. Ceny za obrázok.",
    subtitle:
      "Modely na obrázky ({{modelCount}}) od vývojárov ({{labCount}}). Z toho bez cenzúry ({{uncensoredCount}}). Jeden zostatok, prehľad možností, cien aj slabých stránok každého modelu.",
  },
  intro: {
    lead: "Napíšeš obyčajné zadanie. Príde rozmazaný či orezaný obrázok, alebo ho generátor rovno odmietne. Štúdia postavy, hororová obálka, výjav z tvojho románu. Bežné generátory filtrujú všetko podľa najopatrnejšieho používateľa a ešte si za to berú mesačný poplatok.",
    p2: "Na {{appName}} máš k dispozícii {{modelCount}} obrazových modelov od {{labCount}} tímov, z toho {{uncensoredCount}} bez cenzúry. Všetky čerpajú z rovnakých kreditov. Porovnaj ich úroveň filtrovania, skutočnú cenu za obrázok aj výber podľa úlohy. Ukážeme ti tiež, ako obrázok vytvoriť alebo upraviť priamo v čete.",
  },
  exists: {
    title: "Existuje necenzurovaný generátor obrázkov s AI?",
    intro:
      "Áno. Cez Venice.ai tu ponúkame {{uncensoredCount}} obrazových modelov bez rozmazávania či odmietania zadaní. Dva vytvárajú obrázky podľa textu a dva upravujú obrázok, ktorý im dáš.",
    models: {
      lustify:
        "Fotorealistická tvorba pre dospelých. Model je určený na zobrazenie ľudského tela a pokožky. Horšie zvláda nápisy a zložité scény.",
      chroma:
        "Model s otvorenými váhami dodatočne trénovaný bez obsahového filtrovania. Zvládne dlhé zadania aj širokú škálu výtvarných štýlov vrátane explicitného obsahu.",
      qwenEdit:
        "Úpravy bez cenzúry. Prilož obrázok a opíš, čo chceš zmeniť. Môžeš napríklad vymeniť oblečenie, prepracovať scénu alebo zmeniť jej štýl.",
      fireRed:
        "Presné zásahy do obrázka. Zmení opísané miesto a ostatok ponechá.",
      other:
        "Necenzurovaný obrazový model. Jeho silné stránky nájdeš na stránke modelu.",
    },
    consent:
      "Necenzurované modely sú určené dospelým. Pri prvom použití raz potvrdíš, že máš aspoň 18 rokov. Potom rozhoduješ o svojej tvorbe ty.",
  },
  levels: {
    title: "Čo pri obrázkoch znamenajú úrovne filtrovania",
    intro: "Každý obrazový model patrí do jednej z troch kategórií.",
    mainstream:
      "Bežné modely ({{mainstreamCount}}): OpenAI a Recraft. Majú prísne filtre. Výborne zvládajú text a dizajn, pri témach citlivých pre značky však často narazia na obmedzenia.",
    open: "Otvorené modely ({{openCount}}): FLUX, Seedream, Qwen, Grok Imagine, Wan a ďalšie. S miernejšími filtrami zvládajú ponurú výtvarnú tvorbu a témy pre dospelých, explicitný obsah však nepovoľujú.",
    uncensored:
      "Necenzurované modely ({{uncensoredCount}}): bez nášho filtra a bez odmietnutia zo strany poskytovateľa. Modely určené na explicitnú tvorbu ju aj vygenerujú.",
    p1: "Filter si vyberáš pri každom obrázku. Na čistý produktový záber sa hodí otvorený model. Na scénu, ktorá si žiada podanie bez cenzúry, môžeš zvoliť necenzurovaný. V tom istom čete a za rovnaké kredity.",
  },
  table: {
    title: "Porovnanie všetkých obrazových modelov ({{modelCount}})",
    intro:
      "Najprv sú necenzurované, potom otvorené a nakoniec bežné modely. V každej skupine sú zoradené od najlacnejšieho. Ceny zahŕňajú našu prirážku {{markup}} %. Jeden kredit má hodnotu {{creditValue}}.",
    colModel: "Model",
    colFilter: "Úroveň filtrovania",
    colInput: "Vstup",
    colCredits: "Kredity za obrázok",
    colPrice: "Cena za obrázok",
    inputText: "Text",
    inputEdit: "Text alebo obrázok",
    perUnit: "Za {{unit}}: {{perUnit}} obrázkov",
    footnote:
      "„Text alebo obrázok“ znamená, že model prijíma obrazovú predlohu na úpravy alebo na zachovanie vzhľadu postáv. Cena platí pre predvolenú veľkosť. Niektoré modely účtujú za väčší obrázok viac. Modely účtované za token nájdeš v úplnom katalógu.",
    allModels: "Pozrieť všetky modely a ich parametre",
  },
  picks: {
    title: "Ako vybrať generátor podľa typu obrázka",
    intro:
      "Jeden model nevyniká vo všetkom. Tu je šesť bežných úloh, modely, ktoré sa na ne hodia, a údaje na porovnanie.",
    factLine:
      "{{credits}} kred. ({{price}}) · {{perUnit}} za {{unit}} · {{tier}} · {{input}}",
    uncensored: {
      title: "Bez filtra: explicitné a tabuizované témy",
      body: "Obrázky z textu bez rozmazávania. Chroma má široký záber od ilustrácií a maľby po fantasy a podrobné zadania. Lustify sa sústreďuje na fotorealistické zobrazenie tela. Oba patria medzi najlacnejšie modely platformy.",
    },
    uncensoredEdit: {
      title: "Bez filtra: úprava vlastného obrázka",
      body: "Nahraj obrázok a opíš zmenu. Qwen Edit Uncensored je označený aj pre explicitný výstup. FireRed sa hodí na presné zásahy. Pri zložitej úprave môžeš porovnať oba.",
    },
    cheap: {
      title: "Najnižšia cena pre návrhy a väčšie série",
      body: "Miniatúry, koláže s nápadmi alebo skúška zadania pred finálnym obrázkom. Cena modelu {{cheapestName}} je {{cheapestCredits}} kred. za obrázok. Za {{unit}} vytvoríš {{cheapestPerUnit}} obrázkov.",
    },
    quality: {
      title: "Najviac detailov pre výsledný obrázok",
      body: "Ak obrázok rovno odovzdávaš, záleží na ostrosti detailov aj presnosti zadania. Na lacnom modeli priprav návrh a výsledok vytvor tu.",
    },
    text: {
      title: "Nápisy v obrázku: plagáty, logá a reklamy",
      body: "Veľa modelov písmená skomolí. Recraft je určený na dizajn a GPT Image zvládne aj husté rozloženie textu. Otvorenou možnosťou je Qwen Image 3 Pro. Všetky tieto modely používajú filtre.",
    },
    references: {
      title: "Obrazové predlohy a rovnaké postavy naprieč scénami",
      body: "Tá istá tvár či ten istý produkt na každom zábere. Tieto modely prijmú jednu alebo viac predlôh. Počet modelov s obrazovým vstupom: {{editCount}}.",
    },
  },
  chat: {
    title: "Vytvor obrázok priamo v čete",
    intro:
      "Stačí oň požiadať v ktoromkoľvek čete na {{appName}}. AI zavolá generátor za teba, samostatnú aplikáciu nepotrebuješ.",
    steps: {
      ask: {
        title: "Opíš obrázok",
        body: "Vlastnými slovami opíš námet, štýl, svetlo a kompozíciu. AI pripraví zadanie pre generátor.",
      },
      model: {
        title: "Ponechaj predvolený model alebo uveď iný",
        body: "Použije sa obrazový model z nastavení tvojej zručnosti, predvolene {{defaultModel}}. Iný vyberieš v zadaní, napríklad „použi FLUX.3“.",
      },
      edit: {
        title: "Prilož obrázok, ktorý chceš upraviť",
        body: "Pridaj obrázok a opíš zmenu. Na úpravu potrebuješ model s obrazovým vstupom, napríklad Qwen Edit Uncensored alebo Seedream. Model prijímajúci iba text obrázok neprečíta.",
      },
      result: {
        title: "Pozri si a ulož výsledok",
        body: "Obrázok sa po pár sekundách objaví priamo v čete a uloží sa do tvojho úložiska. Ďalšou správou ho môžeš doladiť.",
      },
    },
    toolPage:
      "Ak chceš nastaviť model, veľkosť, pomer strán či kvalitu priamo, otvor stránku generátora obrázkov.",
    toolLink: "Otvoriť generátor obrázkov",
    roleplayLink: "Podobizeň postavy: sprievodca hraním rolí bez filtrov",
  },
  pricing: {
    title: "Koľko stojí obrázok vytvorený AI",
    intro:
      "Platíš za jednotlivé obrázky. Modely čerpajú zo spoločných kreditov.",
    perImage:
      "K cene poskytovateľa za obrázok pripočítame našu prirážku {{markup}} % a sumu zaokrúhlime nahor na desatinu kreditu. Jeden kredit má hodnotu {{creditValue}}.",
    range:
      "Najlacnejší je teraz {{cheapestName}} za {{cheapestPrice}}. Z necenzurovaných je najlacnejší {{uncensoredName}} za {{uncensoredPrice}}. Najdrahší je {{priciestName}} za {{priciestPrice}}.",
    failed:
      "Kredity odpočítame až po doručení obrázka. Pri chybe či odmietnutí zadania poskytovateľom neplatíš.",
    free: "Zdarma máš mesačne {{guestCredits}} kred. bez účtu alebo {{freeCredits}} s bezplatným účtom, {{maxCredits}} pri odbere noviniek. Pri {{uncensoredName}} to stačí na {{freeUncensoredImages}} bezplatných obrázkov za mesiac.",
    sub: "Mesačné predplatné má štyri úrovne. Najnižšia zahŕňa {{subCredits}} kred. za {{subPrice}}.",
    pack: "Balíky pre predplatiteľov: {{packCredits}} kred. za {{packPrice}}. Kredity nevypršia. Zaplatíš kartou, cez PayPal alebo kryptomenou.",
    link: "Pozrieť si plány a balíky kreditov",
  },
  limits: {
    title: "Limity bez prikrášlenia",
    intro: "Čo si overiť pred prvým generovaním",
    textOnly:
      "Oba necenzurované generátory prijímajú len text. Ak chceš bez filtra meniť existujúci obrázok, vyber necenzurovaný model určený na úpravy.",
    specialists:
      "Necenzurované modely sú špecializované. Na typografiu, logá a čisté produktové snímky sa lepšie hodia bežné a otvorené modely.",
    upstream:
      "Otvorené aj bežné modely používajú filtre svojich poskytovateľov. Za odmietnuté zadanie neplatíš. Ak potrebuješ tvoriť bez obsahového filtra, môžeš si zvoliť necenzurovaný model.",
    video:
      "Pri videu platia iné podmienky. Všetky tunajšie modely na video pochádzajú zo zavedených tímov a majú filtre poskytovateľov. Necenzurované generovanie je dostupné iba pre statické obrázky.",
    law: "Bez filtra zodpovedáš za to, čo vytvoríš a zverejníš. Platia zákony krajiny, v ktorej žiješ. Sexuálne zobrazenia maloletých sú nezákonné. V mnohých krajinách je nezákonný aj sexuálny obraz skutočnej osoby vytvorený bez jej súhlasu.",
    callout:
      "O tom, čo sleduješ, rozhoduješ ako dospelý sám. Tu máš nástroje a údaje, podľa ktorých si môžeš vybrať.",
  },
  faq: {
    title: "Časté otázky",
    exists: {
      q: "Existuje generátor obrázkov s AI bez obmedzení obsahu?",
      a: "Áno. {{appName}} ponúka {{uncensoredCount}} necenzurovaných obrazových modelov. Chroma a Lustify tvoria podľa textu, Qwen Edit Uncensored a FireRed upravujú tvoje obrázky. Bez rozmazávania a odmietania zadaní. Prístup odomkne jednorazové potvrdenie veku 18+.",
    },
    free: {
      q: "Existuje bezplatný necenzurovaný generátor obrázkov?",
      a: "Začať môžeš zdarma. Mesačne dostaneš {{guestCredits}} kred. bez registrácie alebo {{freeCredits}} s bezplatným účtom, {{maxCredits}} pri odbere noviniek. Pri {{uncensoredName}} stojí obrázok {{uncensoredCredits}} kred. Ďalšie kredity ponúka predplatné od {{subPrice}} mesačne.",
    },
    cheapest: {
      q: "Ktorý generátor obrázkov s AI je najlacnejší?",
      a: "Momentálne {{cheapestName}}: jeden obrázok za {{cheapestCredits}} kred. ({{cheapestPrice}}). Ceny všetkých {{modelCount}} modelov v tabuľke sa načítavajú z aktuálneho katalógu.",
    },
    edit: {
      q: "Môžem upraviť fotografiu bez filtra?",
      a: "Áno. V čete prilož fotografiu, opíš zmenu a vyber Qwen Edit Uncensored alebo FireRed. Bežné aj otvorené modely na úpravy používajú filtre poskytovateľa.",
    },
    consent: {
      q: "Prečo musím potvrdiť vek 18 rokov?",
      a: "Necenzurované modely môžu vytvárať explicitný obsah. Stačí raz potvrdiť plnoletosť. Doklad totožnosti nenahrávaš a upozornenia sa neopakujú.",
    },
    watermark: {
      q: "Majú obrázky vodoznak?",
      a: "My vodoznak, logo ani inú vrstvu nepridávame. Niektorí poskytovatelia do obrázka vkladajú vlastné neviditeľné údaje o pôvode.",
    },
    api: {
      q: "Môžem vytvárať obrázky cez API?",
      a: "API {{appName}} sprístupňuje četové modely vo formátoch OpenAI a Anthropic. Obrázky môžeš vytvárať v čete aj na stránke generátora.",
    },
    videoLink: "Porovnať generátory videa s AI",
    chatLink: "Prečítať si sprievodcu necenzurovanými četovými modelmi",
  },
  partners: {
    body: "Vedieš kanál alebo komunitu o umení vytvorenom AI? V partnerskom programe {{appName}} dostávaš opakovanú províziu z každej platby ľudí, ktorých odporučíš.",
    link: "Pozrieť si partnerský program",
  },
  cta: {
    title: "Vyber model a vytvor obrázok.",
    subtitle:
      "Ako hosť máš každý mesiac {{guestCredits}} bezplatných kreditov. Pri každom obrázku si môžeš vybrať necenzurovaný, otvorený alebo bežný model.",
    generate: "Vytvoriť obrázok",
    models: "Prehľad všetkých modelov",
  },
};
