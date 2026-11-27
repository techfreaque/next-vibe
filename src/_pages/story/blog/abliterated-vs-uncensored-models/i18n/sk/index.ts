import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Abliterované a necenzurované modely AI",
    description:
      "Čo zmení abliterácia jazykového modelu, ako sa líši od doladenia bez cenzúry a ako porovnať upravený model s pôvodným.",
    category: "Sprievodca modelmi",
    imageAlt: "Vysvetlenie troch druhov modelov AI bez cenzúry",
    keywords:
      "abliterované a necenzurované modely, čo je abliterovaný model, vysvetlenie abliterácie, abliterovaný LLM, modely AI bez cenzúry, doladenie bez cenzúry, GLM 5.3 Uncensored, DeepSeek V4.1 Flash Uncensored, Kimi K3.1 Pro Uncensored, UncensoredLM, {{appName}}",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Sprievodca modelmi",
    readTime: "8 min čítania",
    title: "Ako sa abliterované modely líšia od iných modelov bez cenzúry",
    subtitle:
      "Čo zmena váh urobí s odmietaním odpovedí, štýlom písania a presnosťou? Porovnaj abliteráciu, doladenie a prístup modelu {{ownName}}.",
  },
  intro: {
    lead: "Abliterovaný LLM je jazykový model s upravenými váhami, ktoré znižujú počet naučených odmietnutí. Vychádza z existujúceho modelu, takže jeho znalosti aj štýl písania ti môžu byť povedomé.",
    p2: "„Bez cenzúry“ je širšie označenie. Zahŕňa abliterované modely, modely doladené na voľnejšie odpovede aj modely trénované na iný pohľad na svet, ako je {{ownName}}.",
  },
  online: {
    title: "Vyskúšaj abliterovaný model online",
    directoryLink: "Pozrieť si abliterované modely na čet v prehliadači",
    guideLink: "Pozrieť si čet a modely bez cenzúry",
    compare:
      "Na stránke modelu v {{appName}} nájdeš veľkosť kontextu, funkcie a odhad ceny ešte pred otvorením četu. Ak sú dostupné obe verzie, porovnaj abliterovanú so základnou.",
  },
  label: {
    title: "Čo ti samotné označenie „bez cenzúry“ povie",
    p1: "„Bez cenzúry“ opisuje správanie modelu. Hovorí, že odpovedá na otázky, ktoré by iné modely odmietli. Poskytovatelia tak označujú rôzne prístupy a v názvoch striedajú „abliterated“, „uncensored“, „heretic“ aj „unfiltered“.",
    p2: "Od použitej metódy závisí, čo ďalšie sa zmenilo. Mení sa aj štýl písania? Posunul sa pohľad modelu na svet? Alebo je model len ochotnejší vyjadriť názor, ktorý už mal? Podľa toho zistíš, ktorý model sa hodí na tvoju prácu.",
  },
  methods: {
    title: "Tri metódy",
    intro: "Od najmenšej zmeny po najväčšiu.",
    abliterated: {
      title: "1. Abliterácia: úprava váh, ktoré súvisia s odmietaním",
      how: "Abliterácia úpravou váh oslabuje naučené odmietanie. Štúdia z roku 2024 identifikovala v skúmaných četovacích modeloch smer spojený s odmietaním. Účinok jeho odstránenia závisí od modelu a zadania.",
      keeps:
        "Štýl a znalosti základného modelu často zostanú rozpoznateľné. Na konkrétnej verzii otestuj presnosť aj volanie nástrojov.",
      changes:
        "Abliterovaná verzia môže odpovedať na zadania, ktoré základný model odmieta. Závisí to od modelu aj zadania.",
    },
    fineTuned: {
      title: "2. Doladenie: ďalší tréning pre priame odpovede",
      how: "Pri doladení sa model ďalej trénuje na príkladoch, ktoré odmeňujú priame odpovede v beletrii, hraní rolí a otvorenom čete. Známy príklad je Dolphin, základ modelu Venice Uncensored. Modely na hranie rolí sa ďalej trénujú na príbehoch.",
      keeps:
        "Zostáva väčšina znalostí základného modelu. Pohľad na svet prevažne ďalej vychádza z pôvodného tréningu.",
      changes:
        "Mení sa odmietanie a často aj štýl. Doladené modely môžu písať voľnejšie, živšie a niekedy sa viac opakujú. Kvalita závisí od tréningových dát.",
    },
    ownWorldview: {
      title: "3. Vlastný svetonázor: odlišné tréningové dáta",
      how: "Prvé dve metódy vychádzajú z bežného modelu a oslabujú odmietanie. {{ownName}} je trénovaný na knihách a dokumentoch zakázaných v hlavnom prúde internetu. Výsledkom je model s odlišnými politickými názormi.",
      keeps:
        "Model nemusí preberať zavedený spôsob, akým iné modely o téme hovoria. Nemá predvolený konsenzus, ku ktorému sa musí vracať.",
      changes:
        "Menia sa samotné odpovede. Pri politických témach dostaneš aj názory, ktoré bežné modely neponúknu ani po abliterácii.",
    },
    callout:
      "Metóda hovorí, čo vývojár zmenil. V porovnaní nižšie zistíš, či sa to prejaví aj pri tvojich zadaniach.",
    sources: {
      paper:
        "Štúdia o smere spojenom s odmietaním v jazykových modeloch (arXiv)",
      blog: "Ako funguje abliterácia (blog Hugging Face)",
    },
  },
  ours: {
    title: "Ďalšie modely bez cenzúry",
    intro:
      "Zvyšné modely bez cenzúry na {{appName}} sme rozdelili podľa zdokumentovanej metódy. Keď ju poskytovateľ nezverejnil, nechávame ju neurčenú.",
    abliterated: {
      title: "Dostupné abliterované modely ({{count}})",
      body: "Pri programovaní a analýze si over podporu nástrojov. Pri dlhých četoch alebo beletrii porovnaj veľkosť kontextu.",
    },
    fineTuned: {
      title: "Doladené modely ({{count}})",
      body: "Dodatočne trénované na priame odpovede, najmä v beletrii a hraní rolí. Počítaj s odlišným štýlom od základného modelu.",
    },
    ownWorldview: {
      title: "Modely s vlastným svetonázorom ({{count}})",
      body: "Trénované na knihách a dokumentoch zakázaných v hlavnom prúde internetu. Vhodné na politiku, odlišné pohľady aj najtemnejšiu beletriu.",
    },
    unlisted: {
      title: "Nezverejnená metóda ({{count}})",
      body: "Poskytovateľ ich uvádza ako modely bez cenzúry, ale nevysvetľuje postup. Skôr, než sa na ne spoľahneš, otestuj ich podľa návodu nižšie.",
    },
  },
  pairs: {
    title: "Porovnanie základných verzií a verzií bez cenzúry",
    intro:
      "Pri každej dvojici porovnaj metódu, veľkosť kontextu a odhad ceny za správu.",
    colBase: "Základný model",
    colUncensored: "Verzia bez cenzúry",
    colMethod: "Metóda",
    colContext: "Kontext",
    colPrice: "Cena za správu",
    method: {
      abliterated: "Abliterácia",
      fineTuned: "Doladenie",
      ownWorldview: "Vlastný svetonázor",
      unlisted: "Nezverejnená",
    },
    price: "{{base}} a {{uncensored}}",
    ratio: "Cena verzie bez cenzúry: {{ratio}}-násobok",
    footnote: "Ak ti filter neprekáža, základný model vyjde lacnejšie.",
    compareLink: "Porovnať {{a}} a {{b}}",
  },
  test: {
    title: "Porovnaj ich za desať minút",
    intro:
      "Vyskúšaj rovnaké tri zadania v dvoch modeloch v jednom čete. Všímaj si skutočné odpovede.",
    steps: {
      refusal: {
        title: "Test odmietnutia",
        body: "Zadaj neškodnú požiadavku, pri ktorej základný model zvykne váhať, napríklad napísať temnú scénu. Porovnaj, ako priamo modely odpovedia. Jedna odpoveď veľa neprezradí o ich tréningu.",
      },
      voice: {
        title: "Test štýlu",
        body: "Požiadaj oba modely o ten istý krátky príbeh. Abliterovaná verzia znie ako základný model. Doladený model má často iný rytmus a výber slov.",
      },
      worldview: {
        title: "Test svetonázoru",
        body: "Polož spornú politickú otázku a žiadaj jasný postoj. Abliterované a doladené modely zvyknú odpovedať v rámci pohľadu pôvodného laboratória. {{ownName}} môže obhajovať postoj, ktorý bežné modely nezaujmú.",
      },
      switch: {
        title: "Zmeň model uprostred vlákna",
        body: "Vyber iný model a odošli ďalšiu správu. História vlákna zostane zachovaná a nový model ju prečíta celú. Porovnávaš tak pri rovnakom kontexte.",
      },
    },
    callout:
      "Fakty si over pri každom modeli. Slabšie odmietanie nezvyšuje presnosť a model s iným pohľadom môže podať sporné tvrdenie rovnako rozhodne ako overený fakt.",
  },
  tradeoffs: {
    title: "Obmedzenia jednotlivých metód",
    intro: "Každá metóda má svoje slabé stránky.",
    abliterated:
      "Abliterácia môže znížiť presnosť. Text, ktorý metódu spopularizoval, ukázal pokles v testoch. Ďalším kolom tréningu sa väčšinu straty podarilo vyrovnať. Schopnosti základného modelu vrátane nástrojov zostávajú.",
    fineTuned:
      "Doladený model je taký dobrý ako jeho tréningové dáta. Na príbehy môže písať výbornú prózu, v kóde a analýze je slabší. Modely doladené na hranie rolí sú v prvom rade rozprávači.",
    ownWorldview:
      "Model s vlastným svetonázorom je zámerne vyhranený. Overuj jeho tvrdenia. {{ownName}} má kontext {{ownContext}} tokenov a nehodí sa na programovanie.",
  },
  pick: {
    title: "Ktorý druh vybrať podľa úlohy",
    capability:
      "Na kód, analýzu a výskum s menším počtom odmietnutí vyber abliterovanú verziu silného modelu.",
    fiction:
      "Na beletriu a hranie rolí vyber doladený model s výrazným štýlom. Pri dlhej kampani pomôže abliterovaný model s veľkým kontextom.",
    viewpoint:
      "Na politiku, sporné témy a druhú stranu argumentu vyskúšaj {{ownName}}.",
    unsure:
      "Ak váhaš, daj rovnaké zadanie dvom modelom. Skutočné odpovede povedia viac než štítky.",
    consent:
      "Modely bez cenzúry sú pre dospelých. Pri prvom výbere potvrdíš, že máš aspoň 18 rokov. Potom si otázky volíš sám a platia zákony v mieste, kde žiješ.",
  },
  faq: {
    title: "Časté otázky",
    whatIs: {
      q: "Čo je abliterovaný model?",
      a: "Je to existujúci jazykový model s upravenými váhami, aby odmietal menej zadaní.",
    },
    difference: {
      q: "Aký je rozdiel medzi abliterovaným a necenzurovaným modelom?",
      a: "Označenie „bez cenzúry“ opisuje správanie. Abliterácia je jedna z metód. Ďalšími sú doladenie a tréning na odlišných materiáloch, ako pri {{ownName}}. Na {{appName}} je z modelov bez cenzúry {{abliteratedCount}} abliterovaných a {{fineTunedCount}} doladených.",
    },
    identify: {
      q: "Ako zistím, či je model abliterovaný?",
      a: "Spôsob úprav nájdeš na karte modelu alebo v poznámkach k vydaniu. V katalógu {{appName}} sa označenie riadi dokumentáciou poskytovateľa.",
    },
    worse: {
      q: "Môže abliterácia ovplyvniť kvalitu modelu?",
      a: "Áno. Zásah do váh môže zmeniť presnosť, štýl aj ďalšie schopnosti. Porovnaj konkrétnu verziu so základným modelom pri rovnakej úlohe.",
    },
    truly: {
      q: "Je {{ownName}} abliterovaný model?",
      a: "{{ownName}} uvádzame zvlášť. Podľa vývojára ho trénovali na iných materiáloch, aby vyjadroval odlišný pohľad. Abliterované modely v tomto prehľade vznikli úpravou existujúcich modelov, aby menej odmietali.",
    },
    free: {
      q: "Môžem modely bez cenzúry vyskúšať zadarmo?",
      a: "Áno. Mesačne máš {{guestCredits}} kred. zadarmo bez účtu alebo {{freeCredits}} s bezplatným účtom, {{maxCredits}} pri odbere noviniek. Na desaťminútové porovnanie lacnejších modelov to stačí. Prémiové modely stoja viac za správu.",
    },
    legal: {
      q: "Sú modely AI bez cenzúry legálne?",
      a: "Za vytvorený a zverejnený obsah zodpovedáš ty a vzťahujú sa naň miestne zákony. Na {{appName}} sa modely bez cenzúry odomknú po jednorazovom potvrdení veku 18+.",
    },
    ownLink: "Pozrieť si stránku modelu {{ownName}}",
    guideLink: "Prečítať si sprievodcu modelmi bez cenzúry",
  },
  cta: {
    title: "Porovnaj modely na vlastnom zadaní",
    subtitle:
      "{{guestCredits}} kred. zadarmo mesačne bez účtu. Abliterovaný model, doladený model alebo {{ownName}} vyberáš pri každej správe.",
    chat: "Spustiť anonymný čet",
    models: "Prehľad všetkých modelov",
  },
};
