import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Claude bez filtrov | Prečo odmieta a čo funguje | {{appName}}",
    description:
      "Claude bez cenzúry neexistuje. Prečo odmieta, prečo jailbreaky a weby s falošným Claude bez cenzúry nepomáhajú a ako kombinovať Claude s modelmi bez cenzúry.",
    category: "Sprievodca modelmi",
    imageAlt: "Claude a modely bez cenzúry v jednom čete",
    keywords:
      "Claude bez filtrov, Claude bez cenzúry, Claude jailbreak, Claude bez obmedzení, Claude odmieta, alternatíva k Claude na fikciu, alternatíva k Claude bez filtra, alternatíva k Claude pre NSFW, {{appName}}",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Sprievodca modelmi",
    readTime: "Čítanie na 7 minút",
    title: "Claude bez filtrov neexistuje. Čo funguje?",
    subtitle:
      "Použi {{claudeName}} na to, v čom vyniká. Ďalšie úlohy v rovnakej konverzácii prenechaj niektorému z modelov bez vrstvy odmietania ({{count}}).",
  },
  intro: {
    lead: "Claude píše prózu na špičkovej úrovni. Občas však zastane uprostred scény, pridá nevyžiadané varovanie alebo z tvojho zloducha spraví terapeuta.",
    p2: "Prepínač, ktorý by to vypol, neexistuje. Ukážeme ti prečo, čo nepomáha a ako použiť {{claudeName}} s modelmi bez cenzúry. Na {{appName}} máš obe možnosti v jednom čete s jedným zostatkom.",
  },
  why: {
    title: "Prečo Claude odmieta",
    intro: "Tri dôvody. Žiadny sa nedá zmeniť v nastaveniach.",
    trained:
      "Súčasť tréningu. Anthropic prenáša svoje zásady do samotného modelu. Odmietanie je výsledkom tréningu a nedá sa vypnúť prepínačom.",
    policy:
      "Pravidlá platia všade. Podmienky používania Anthropic sa uplatňujú v každej aplikácii aj API, ktoré sprístupňujú Claude, vrátane nás. Zmenou rozhrania sa model nezmení.",
    closed:
      "Uzavreté váhy. Mimo Anthropicu nemá nikto prístup k úprave Claude. Otvorené modely možno upraviť metódou abliteration, aby menej často odmietali otázky. Pri Claude to možné nie je.",
  },
  tricks: {
    title: "Čo nepomáha",
    intro: "Každý týždeň sa objaví nový trik. Problémy sa opakujú.",
    jailbreak:
      "Jailbreakové zadania sa opravami prestávajú dať použiť a zhoršujú písanie. Obchádzanie ochranných opatrení porušuje podmienky Anthropic. Môže viesť k zablokovaniu účtu.",
    fiction:
      "„Je to len fikcia.“ Pri miernejšom obsahu to niekedy pomôže. Pri scénach, na ktorých záleží, často zlyhá.",
    fake: "Weby s „Claude bez cenzúry“. Buď používajú rozhranie s jailbreakovým zadaním, alebo vydávajú iný model za Claude. Zvonka si to neoveríš.",
    callout:
      "Ak web sľubuje Claude bez cenzúry, spýtaj sa, ktorý model odpovedá. Claude bez cenzúry to nebude.",
    jailbreakLink: "Prečo jailbreakové zadania prestávajú fungovať",
  },
  switch: {
    title: "Čo funguje: výber modelu pri každej správe",
    intro:
      "Použi {{claudeName}} aj modely bez cenzúry v jednom čete. Model sa zmení, príbeh pokračuje.",
    steps: {
      draft: {
        title: "Napíš návrh s Claude",
        body: "Osnova, štruktúra a dialóg. Časti, ktoré {{claudeName}} zvláda dobre.",
      },
      switch: {
        title: "Pri odmietnutí prepni model",
        body: "Pre ďalšiu správu vyber model bez cenzúry. Dostane históriu konverzácie a napíše scénu, ktorú Claude odmietol.",
      },
      back: {
        title: "Vráť sa k úpravám",
        body: "Ak to obsah umožňuje, pošli text späť Claude na jazykové úpravy. Môžeš aj pokračovať s modelom bez cenzúry.",
      },
      compare: {
        title: "Porovnaj rovnaké zadanie",
        body: "Nevieš, ktorý štýl sa hodí? Pošli zadanie dvom modelom a vyber lepší návrh.",
      },
    },
  },
  models: {
    title: "Claude a vybrané modely bez cenzúry vedľa seba",
    intro:
      "Pod každým názvom je kategória obsahu alebo spôsob úpravy proti odmietaniu. Údaje sú z aktuálneho katalógu.",
    colModel: "Model",
    colContext: "Kontext",
    colStrengths: "Silné stránky",
    colPrice: "Cena za správu",
    colChat: "Vyskúšať",
    chatLink: "Otvoriť čet s modelom {{model}}",
    footnote:
      "Cena jednej referenčnej správy zahŕňa našu prirážku {{markup}} %.",
  },
  picks: {
    title: "Ktorý model bez cenzúry sa hodí na ktorú úlohu",
    intro:
      "Všetky môžeš použiť v tom istom čete ako Claude. Vyberaj podľa úlohy.",
    long: {
      title: "Dlhé tvorivé projekty: {{model}}",
      body: "Vlajkový Kimi od Moonshot AI upravený metódou abliteration. Udrží dej dlhého príbehu a dokáže ho premyslieť. Cena za správu: {{price}}.",
    },
    fast: {
      title: "Rýchly všestranný model: {{model}}",
      body: "Bežný model upravený tak, aby menej odmietal. Je rýchly, pohotový a dobre zvláda prózu aj kód. Cena za správu: {{price}}.",
    },
    contrary: {
      title: "Názory, ktoré Claude nevysloví: {{model}}",
      body: "Model {{model}} trénoval na knihách a dokumentoch vylúčených z hlavného prúdu internetu. Preto má odlišné politické názory. Hodí sa na postavy a eseje, ktoré spochybňujú všeobecný konsenzus. Cena za správu: {{price}}.",
    },
    roleplay: {
      title: "Postavy a temné scény: {{model}}",
      body: "Doladený na hranie rolí. Drží sa postavy a neprerušuje príbeh varovaniami. Cena za správu: {{price}}.",
    },
    cheap: {
      title: "Lacné prvé návrhy: {{model}}",
      body: "DeepSeek s odstráneným odmietaním. Rýchly a lacný na veľa prvých návrhov. Cena za správu: {{price}}.",
    },
    compareLink: "{{a}} a {{b}}",
    writerLink: "AI autor bez cenzúry: kompletná príručka",
  },
  limits: {
    title: "Aké hranice zostávajú",
    intro: "Menej odmietania má aj svoje nevýhody.",
    style:
      "Rozdielny štýl. Každý model píše inak. Pred rozhodnutím vyskúšaj rovnakú scénu s dvoma modelmi.",
    mistakes:
      "Rovnaké chyby. Modely bez cenzúry sa vo faktoch mýlia rovnako často ako pôvodné verzie. Dôležité tvrdenia si over.",
    claude:
      "Claude zostáva Claude. Prepnutie modelu nemení to, čo napíše samotný Claude. Pri ďalšej správe si môžeš zvoliť inú možnosť.",
    callout:
      "Modely bez cenzúry sprístupní jednorazové potvrdenie veku aspoň 18 rokov. Čo budeš čítať, je na tebe.",
  },
  faq: {
    title: "Časté otázky",
    can: {
      q: "Dá sa používať Claude bez cenzúry?",
      a: "Nie. Odmietanie je súčasťou tréningu uzavretého modelu Claude a nemožno ho z neho odstrániť. Služby sľubujúce Claude bez cenzúry používajú upravené zadanie alebo iný model. Skutočnou alternatívou sú otvorené modely s odstráneným odmietaním.",
    },
    jailbreak: {
      q: "Dovoľuje Anthropic jailbreak modelu Claude?",
      a: "Obchádzanie ochranných opatrení porušuje pravidlá používania Anthropic a môže viesť k strate účtu. Zhoršuje aj odpovede. Model bez vrstvy odmietania je alternatíva k takýmto pokusom.",
    },
    best: {
      q: "Ktorá alternatíva k Claude je najlepšia na fikciu?",
      a: "Na dlhú, temnú alebo explicitnú fikciu skús model upravený metódou abliteration, napríklad {{firstName}}. Na postavy s názormi mimo hlavného prúdu skús {{ownModel}}. Na hranie rolí skús model doladený na tento účel. Na {{appName}} sú všetky vedľa Claude.",
    },
    same: {
      q: "Môžem používať Claude a model bez cenzúry v jednom čete?",
      a: "Áno. Model si vyberieš pri každej správe. História sa prenesie do ďalšieho volania, takže nový model môže nadviazať tam, kde Claude skončil.",
    },
    api: {
      q: "Môžem volať Claude aj modely bez cenzúry cez jedno API?",
      a: "Áno. Koncové body sú kompatibilné s OpenAI a Anthropic. Pre Claude aj modely bez cenzúry stačí jeden kľúč. Kľúče API sprístupní prvý nákup. Predplatné začína od {{apiSubPrice}} mesačne.",
    },
    free: {
      q: "Môžem si to vyskúšať zdarma?",
      a: "Áno. Mesačne {{guestCredits}} kr. zdarma bez účtu alebo {{freeCredits}} kr. s bezplatným účtom, {{maxCredits}} pri odbere noviniek. Modely bez cenzúry sú dostupné po jednorazovom potvrdení veku aspoň 18 rokov.",
    },
    chatLink: "Čet s AI bez cenzúry: vyber model a začni",
    roleplayLink: "Hranie rolí s AI bez filtra",
    refusalLink: "Index odmietania: ktoré modely odpovedajú a ktoré odmietajú",
  },
  cta: {
    title: "Píš s Claude. Pri odmietnutí zmeň model.",
    subtitle:
      "Mesačne {{guestCredits}} kr. zdarma bez účtu. Začni s modelom {{firstName}}.",
    start: "Začať čet bez cenzúry",
    models: "Porovnať všetky modely",
  },
};
