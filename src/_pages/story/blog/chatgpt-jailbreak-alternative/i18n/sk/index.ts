import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Jailbreaky v ChatGPT prestávajú fungovať. Aké sú alternatívy? | {{appName}}",
    description:
      "Porovnaj alternatívy k jailbreakom v ChatGPT, od {{appName}} a Venice po LM Studio a Ollama. Pozri si výber modelov, súkromie a ceny.",
    category: "Sprievodca modelmi",
    imageAlt: "Porovnanie jailbreakov v ChatGPT s modelmi bez cenzúry",
    keywords:
      "ChatGPT jailbreak, jailbreak zadanie pre ChatGPT, DAN prompt, obídenie filtra ChatGPT, ChatGPT bez filtrov, ChatGPT bez obmedzení, funguje jailbreak ChatGPT, alternatíva k jailbreaku, alternatíva k ChatGPT bez cenzúry, abliterated model, {{appName}}",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Sprievodca modelmi",
    readTime: "Čítanie na 7 minút",
    title: "Porovnanie alternatív k jailbreakom v ChatGPT",
    subtitle:
      "Porovnaj hostovaný čet a lokálne modely podľa limitov, ceny a súkromia. Pridávame výber modelov na písanie a hranie rolí ({{count}}).",
  },
  intro: {
    lead: "Zadanie, ktoré dnes zmení odpoveď ChatGPT, sa po aktualizácii môže správať inak. Na písanie alebo hranie rolí si vyber model, ktorý sa na to hodí už sám osebe.",
    p2: "Najprv porovnaj hostované čety a lokálne aplikácie. Uvádzame aj výber {{count}} modelov na {{appName}} s kontextom a aktuálnymi cenami.",
  },
  why: {
    title: "Prečo jailbreaky v ChatGPT prestávajú fungovať",
    intro: "Medzi zadaním a priamou odpoveďou môžu byť tri prekážky.",
    weights:
      "Odmietanie je súčasťou váh. Modely GPT sa trénujú, aby odmietali celé kategórie požiadaviek. Jailbreak tento tréning nemení. Pokúša sa ho obísť v jednej konverzácii.",
    patched:
      "Pri ďalšom bezpečnostnom tréningu sa model učí odolávať známym jailbreakom. Keď sa konkrétne zadanie rozšíri, môže prestať fungovať pri najbližšej aktualizácii.",
    layer:
      "Kontrola môže prebehnúť aj mimo modelu. Bežné aplikácie moderujú vstupy aj výstupy, takže hotovú odpoveď môžu označiť alebo odstrániť.",
  },
  cost: {
    title: "Čo ťa jailbreak stojí",
    intro: "Aj keď zaberie, má svoju cenu.",
    quality:
      "Slabšie odpovede. Model hrá postavu namiesto sústredenia sa na otázku. Odpovede bývajú zbytočne dlhé, teatrálne a často menej presné.",
    unstable:
      "Nepredvídateľnosť. Rovnaké zadanie zaberie v jednom čete a zlyhá v druhom. Pracovný postup na tom nepostavíš.",
    account:
      "Riziko pre účet. Pravidlá používania ChatGPT platia pre každé zadanie. OpenAI môže pri porušení pravidiel účet obmedziť alebo pozastaviť. Pri jailbreaku sa o obídenie zámerne pokúšaš.",
    time: "Stratený čas. Hľadanie, skúšanie a prepisovanie zadaní trvá dlhšie ako položenie otázky.",
    callout:
      "Odmietanie vychádza z tréningu modelu. Namiesto skúšania jailbreakov si môžeš vybrať model trénovaný inak.",
  },
  instead: {
    title: "Modely, ktoré jailbreak nepotrebujú",
    intro: "Dva druhy modelov bez cenzúry, dva rôzne prístupy.",
    abliteratedTitle: "Abliterated: odmietanie odstránené z váh",
    abliterated:
      "Štúdia z roku 2024 zistila, že v skúmaných četovacích modeloch odmietanie do veľkej miery súvisí s jedným smerom v sieti. Metóda abliteration tento smer z váh odstráni. Model si ponechá znalosti aj štýl a na otázky, ktorým sa predtým vyhýbal, väčšinou odpovie priamo.",
    ownTitle: "{{ownModel}}: odlišný pohľad na svet",
    own: "Model {{ownModel}} trénoval na knihách a dokumentoch vylúčených z hlavného prúdu internetu. Preto má politické názory, ktoré sa od hlavného prúdu líšia. Tento rozdiel vychádza z odlišného tréningu.",
    sources: {
      paper:
        "Arditi a kol., Refusal in language models is mediated by a single direction (2024)",
      blog: "Maxime Labonne, Uncensor any LLM with abliteration",
    },
    link: "Modely abliterated, doladené modely a vlastný pohľad na svet",
  },
  models: {
    title: "Modely bez cenzúry na výber ({{count}}). Bez jailbreaku.",
    intro:
      "Všetky aktuálne modely bez cenzúry na platforme od najlacnejšieho. Kontext a ceny vychádzajú z registra modelov.",
    colModel: "Model",
    colContext: "Kontext",
    colPrice: "Cena za správu",
    colChat: "Vyskúšať",
    chatLink: "Otvoriť čet s modelom {{model}}",
    footnote:
      "Cena za správu vychádza z jednej referenčnej výmeny správ na najlacnejšej trase. Dlhšie čety a odpovede stoja viac.",
  },
  test: {
    title: "Vyskúšaj si to. Rovnaká otázka, dva modely.",
    intro: "Nemusíš nám veriť. Polož otázku, pre ktorú si hľadal jailbreak.",
    steps: {
      ask: {
        title: "Opýtaj sa bežného modelu",
        body: "Otvor čet a vyber GPT alebo iný bežný model. Polož otázku, ktorej sa zvyčajne vyhýba. Zapamätaj si odpoveď.",
      },
      switch: {
        title: "Prepni na model bez cenzúry",
        body: "Na ďalšiu správu v tom istom čete zmeň model. Keď sa zobrazí výzva, raz potvrď vek aspoň 18 rokov.",
      },
      compare: {
        title: "Opýtaj sa znova a porovnaj",
        body: "Polož rovnakú otázku bez nastavenej osobnosti a trikov. Porovnaj dĺžku, priamosť a presnosť.",
      },
      keep: {
        title: "Nechaj si model, ktorý odpovedá",
        body: "Kedykoľvek sa môžeš prepnúť späť. Na náročný kód použi bežné modely, na otázky, ktorým sa vyhýbajú, modely bez cenzúry.",
      },
    },
    compareLink: "{{a}} a {{b}} vedľa seba",
  },
  limits: {
    title: "Hranice zostávajú pri každom modeli",
    intro: "Aj modely bez cenzúry majú limity.",
    decline:
      "Model môže zadanie odmietnuť. Metóda abliteration odstraňuje väčšinu naučeného odmietania. Výsledky závisia od modelu a zadania.",
    wrong:
      "Model sa môže mýliť. Filter zlú odpoveď nezjemní, preto si dôležité tvrdenia overuj.",
    adult:
      "Len pre dospelých. Modely bez cenzúry sprístupní jednorazové potvrdenie veku aspoň 18 rokov a prijatie podmienok.",
    callout:
      "Za vytvorený a zverejnený obsah zodpovedáš ty. Platia zákony krajiny, v ktorej žiješ.",
  },
  faq: {
    title: "Časté otázky",
    work: {
      q: "Fungujú jailbreakové zadania v ChatGPT ešte aj dnes?",
      a: "Niekedy nakrátko. Modely sa pri tréningu učia odolávať rozšíreným zadaniam a moderovanie zachytí mnohé výstupy. Funkčné zadanie preto zriedka vydrží. Spoľahlivejší je model, ktorý sa neučil danú požiadavku odmietať.",
    },
    dan: {
      q: "Čo je zadanie DAN?",
      a: "DAN (Do Anything Now) je označenie jailbreaku založeného na hraní roly. Jeho varianty postupne prestávajú fungovať a odpovede v role bývajú slabšie než priame odpovede.",
    },
    ban: {
      q: "Môžu mi pre jailbreak zablokovať účet ChatGPT?",
      a: "Pravidlá OpenAI platia pre každé zadanie. Pri porušení môže OpenAI účet obmedziť alebo pozastaviť. Tento problém obídeš výberom modelu, ktorý je určený na priame odpovede.",
    },
    gpt: {
      q: "Môžem na {{appName}} používať GPT bez jeho filtrov?",
      a: "Nie. GPT používa ochranné opatrenia OpenAI všade, aj tu. Na nefiltrované odpovede si vyber z ponuky modelov bez cenzúry ({{count}}). V tom istom čete môžeš medzi nimi a GPT prepínať.",
    },
    legal: {
      q: "Je používanie modelu AI bez cenzúry legálne?",
      a: "Model je nástroj. Za vytvorený a zverejnený obsah zodpovedáš ty a platia zákony krajiny, v ktorej žiješ. Na {{appName}} modely bez cenzúry sprístupní jednorazové potvrdenie veku aspoň 18 rokov.",
    },
    free: {
      q: "Môžem si model bez cenzúry vyskúšať zdarma?",
      a: "Áno. Služba {{appName}} dáva mesačne {{guestCredits}} kr. zdarma bez účtu a {{freeCredits}} kr. s bezplatným účtom, {{maxCredits}} pri odbere noviniek. Počet správ závisí od modelu a dĺžky četu.",
    },
    alternativeLink: "Alternatíva k ChatGPT bez filtrov: výber modelov",
    refusalLink: "Ktorá AI naozaj odpovie? Index odmietania",
    chatLink: "Čet s AI bez cenzúry v prehliadači",
  },
  cta: {
    title: "Polož otázku priamo.",
    subtitle:
      "Mesačne {{guestCredits}} kr. zdarma bez účtu. Vyber si model bez cenzúry a opýtaj sa priamo.",
    start: "Začať čet bez cenzúry",
    models: "Porovnať všetky modely",
  },
};
