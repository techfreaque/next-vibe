import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Najlepšie LLM bez cenzúry v roku 2026 podľa úlohy | {{appName}}",
    description:
      "Najlepšie LLM bez cenzúry na uvažovanie, čet, kód, temnú prózu aj iné pohľady. GLM 5.3 Uncensored a DeepSeek V4.1 Flash Uncensored s aktuálnymi cenami.",
    category: "Sprievodca modelmi",
    imageAlt: "Najlepšie jazykové modely bez cenzúry podľa úlohy",
    keywords:
      "najlepší LLM bez cenzúry, najlepší model AI bez cenzúry, najlepší abliterovaný model, LLM bez cenzúry 2026, porovnanie GLM a DeepSeek bez cenzúry, GLM 5.3 Uncensored, DeepSeek V4.1 Flash Uncensored, model bez cenzúry na hranie rolí, model bez cenzúry na programovanie, rebríček LLM bez cenzúry, {{appName}}",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Sprievodca modelmi",
    readTime: "8 min čítania",
    title: "Najlepší jazykový model bez cenzúry podľa úlohy",
    subtitle:
      "Na každú úlohu vyberáme jeden model z aktuálnej ponuky ({{count}}). Porovnávame aj GLM s DeepSeek. Kontext a ceny čítame priamo z registra modelov.",
  },
  intro: {
    lead: "Rebríčky najlepších LLM bez cenzúry zvyknú vybrať jediného víťaza. Pri vlastnej práci však rýchlo zistíš, že každá úloha potrebuje iný model. Na temnú prózu sa hodí iný než na kód. Náročný argument si žiada viac než len nízku cenu.",
    p2: "Preto vyberáme jeden model na každú úlohu. Všetky sú dostupné na {{appName}} priamo v prehliadači. Každé číslo pochádza z nášho registra a modely môžeš striedať v tom istom čete.",
  },
  method: {
    title: "Ako sme vyberali",
    intro:
      "Pri každom modeli sme si položili štyri otázky. Žiadne vymyslené výsledky testov.",
    answers:
      "Odpovedá? Všetky modely v tomto výbere patria do kategórie bez cenzúry. Pustia sa do otázky bez poučovania.",
    base: "Aký silný je základný model? Abliterované špičkové modely si zachovávajú schopnosti pôvodnej verzie. Menšie doladené modely časť týchto schopností vymenia za špecifický štýl.",
    context:
      "Koľko si model pamätá? Dĺžka kontextu rozhoduje, či si pri dlhom dokumente ešte pamätá prvú stranu.",
    price:
      "Koľko stojí? Porovnávame cenu za štandardizovanú výmenu správ cez najlacnejšie verejne dostupné pripojenie vrátane prirážky.",
    callout:
      "Chceš vidieť, ktoré modely odpovedajú? V našom indexe odmietania kladieme každému modelu rovnaké otázky a počítame odmietnutia.",
    refusalLink: "Index odmietania otázok pri modeloch AI",
  },
  picks: {
    title: "Najlepšie modely podľa úlohy",
    intro:
      "Pre každú úlohu vyberáme jeden model a žiadny sa neopakuje. Ak prestane byť dostupný, nahradí ho ďalší model s rovnakou silnou stránkou.",
    facts:
      "Kontext {{context}}. Cena za správu {{price}}. Silné stránky: {{strengths}}.",
    reasoning: {
      title: "{{number}}. Uvažovanie a analýza: {{model}}",
      body: "Špičkový základný model s potlačeným odmietaním. Hodí sa, keď odpoveď potrebuje hĺbku. Rozoberie spornú otázku, zanalyzuje dlhý dokument alebo preverí slabé miesta plánu.",
    },
    everyday: {
      title: "{{number}}. Každodenné úlohy: {{model}}",
      body: "Rýchly, lacný a s veľmi dlhým kontextom. Nechaj ho vybraný na bežné otázky, rýchle návrhy aj dlhé čety, ktoré by na špičkovom modeli vyšli draho.",
    },
    coding: {
      title: "{{number}}. Programovanie: {{model}}",
      body: "V registri je označený na programovanie a uvažovanie. Dokáže odpovedať aj na otázky o bezpečnostnom výskume, získavaní údajov z webu či reverznom inžinierstve, ktoré bežní asistenti odmietajú.",
    },
    fiction: {
      title: "{{number}}. Hranie rolí a temná próza: {{model}}",
      body: "Doladený na hranie rolí vrátane temných príbehov. Drží sa postavy, napíše aj násilnú či explicitnú scénu a neprerušuje príbeh poučovaním.",
    },
    viewpoint: {
      title: "{{number}}. Názory mimo hlavného prúdu: {{model}}",
      body: "Jediný model z výberu, ktorý má vlastný tréning na knihách a dokumentoch zakázaných v hlavnom prúde internetu. Preto prináša aj neobvyklé politické názory. Opýtaj sa na to, čo iné modely vynechávajú, a jeho tvrdenia si overuj.",
    },
    vision: {
      title: "{{number}}. Práca s obrázkami: {{model}}",
      body: "Spracúva nahraté obrázky a odpovedá na otázky o nich bez obvyklých odmietnutí. Cena je dosť nízka aj na každodennú prácu so snímkami obrazovky.",
    },
  },
  versus: {
    title: "Porovnanie {{a}} a {{b}}",
    intro:
      "Dva špičkové abliterované modely, ktoré ľudia porovnávajú najčastejšie. Oba majú potlačené odmietanie a každý vyniká v iných úlohách.",
    glm: "{{model}} je abliterovaná verzia GLM-5.3. Vyber si ju, keď potrebuješ hĺbku pri uvažovaní, analýze alebo programovaní.",
    deepseek:
      "{{model}} je abliterovaná verzia DeepSeek V4.1 Flash. Odpovedá rýchlo, stojí menej za správu a v registri má aj hranie rolí. Hodí sa na veľký objem práce.",
    verdict:
      "GLM vyniká pri náročnom uvažovaní, DeepSeek pri veľkom objeme práce a hraní rolí. Oba odpovedajú priamo. Prepni medzi nimi počas četu a porovnaj ich na svojej otázke.",
    compareLink: "Úplné porovnanie {{a}} a {{b}}",
  },
  all: {
    title: "Modely bez cenzúry ({{count}}) od najlacnejšieho",
    intro:
      "Aktuálna ponuka modelov bez cenzúry na {{appName}}. Otvor stránku modelu alebo s ním rovno začni čet.",
    footnote:
      "Cena za správu vychádza z jednej štandardizovanej výmeny cez najlacnejšie pripojenie. Dlhé čety a dlhé odpovede stoja viac. Silné stránky vychádzajú zo štítkov v registri.",
  },
  table: {
    model: "Model",
    context: "Kontext",
    strengths: "Silné stránky",
    price: "Za správu",
    chat: "Vyskúšať",
    chatLink: "Začať čet s {{model}}",
  },
  kinds: {
    title: "Dva druhy modelov bez cenzúry",
    intro: "Pod rovnakým označením nájdeš dva rôzne prístupy.",
    abliterated:
      "Abliterované a doladené verzie vznikajú menšou úpravou bežného alebo otvoreného modelu. Úprava potláča odmietanie otázok. Pôvodný tréning a spôsob nazerania na svet zostávajú.",
    own: "{{ownModel}} trénovali na knihách a dokumentoch zakázaných v hlavnom prúde internetu, preto ponúka aj politické názory mimo neho.",
    explainerLink: "Čo je abliterácia a ako sa líši od iných metód",
    tourLink: "Modely bez cenzúry jeden po druhom",
  },
  local: {
    title: "Spúšťať model lokálne alebo online?",
    intro:
      "Väčšina rebríčkov vychádza z toho, že si model spustíš na vlastnom počítači. Máš však aj ďalšie možnosti.",
    local:
      "Lokálne spustenie ti dá plné súkromie a za jednotlivé správy neplatíš. Veľké modely však potrebujú viac pamäte GPU, než má bežný domáci počítač.",
    hosted:
      "V prehliadači môžeš spustiť každý model z tejto stránky vrátane najväčších. Poskytovateľ vidí tvoje zadanie.",
    api: "Cez API sú tie isté modely dostupné na koncových bodoch kompatibilných s OpenAI a Anthropic. Kľúče API sa sprístupnia po ľubovoľnom nákupe.",
    noGpuLink: "Spustiť LLM bez cenzúry online a bez GPU",
    apiLink: "API pre LLM bez cenzúry, ID modelov, ceny a kód",
  },
  pairs: {
    title: "Ďalšie priame porovnania",
    intro:
      "Porovnaj modely s vlastným svetonázorom s abliterovanými modelmi alebo základné verzie s ich úpravami bez cenzúry.",
    link: "{{a}} a {{b}}",
  },
  faq: {
    title: "Časté otázky",
    best: {
      q: "Ktorý LLM bez cenzúry je celkovo najlepší?",
      a: "Na väčšinu náročných otázok sa hodí {{topModel}}, špičkový základný model s potlačeným odmietaním. Na názory mimo hlavného prúdu skús {{ownModel}}. Na veľa úloh za málo peňazí zvoľ verziu Flash. Na {{appName}} môžeš v tom istom čete prepínať medzi všetkými modelmi ({{count}}).",
    },
    free: {
      q: "Ktorý LLM bez cenzúry si môžem vyskúšať zadarmo?",
      a: "Na {{appName}} máš každý mesiac bezplatné kredity. Bez účtu ich dostaneš {{guestCredits}}, s bezplatným účtom {{freeCredits}}, {{maxCredits}} pri odbere noviniek. Najlacnejší model bez cenzúry, {{cheapestModel}}, stojí {{cheapestPrice}} za správu. Pri modeloch bez cenzúry stačí raz potvrdiť vek 18+.",
    },
    roleplay: {
      q: "Ktorý model bez cenzúry je najlepší na hranie rolí?",
      a: "Hľadaj model doladený na temné hranie rolí. Drží sa postavy aj v náročných scénach. Pri politických alebo tabuizovaných postavách pridá {{ownModel}} pohľad, ktorý bežné modely neponúkajú.",
    },
    coding: {
      q: "Ktorý model bez cenzúry je najlepší na programovanie?",
      a: "Abliterovaná verzia silného modelu na programovanie. Zachová schopnosti základu a odpovie aj na otázky z bezpečnostného výskumu či iných oblastí, ktorým sa bežní asistenti vyhýbajú.",
    },
    quality: {
      q: "Strácajú abliterované modely na kvalite?",
      a: "Trochu, podľa spôsobu úpravy. Abliterácia odstraňuje z váh smer súvisiaci s odmietaním. Pri dobrej úprave si model zachová takmer všetky schopnosti. Menšie doladené modely môžu stratiť viac. Pred výberom porovnaj základný model a jeho verziu bez cenzúry na rovnakom zadaní.",
    },
    api: {
      q: "Môžem tieto modely bez cenzúry používať cez API?",
      a: "Áno. Každý textový model z tohto výberu funguje cez koncové body kompatibilné s OpenAI a Anthropic. Kľúče API sa sprístupnia po ľubovoľnom nákupe.",
    },
    writerLink: "Najlepšia AI bez cenzúry na písanie prózy",
    directoryLink: "Všetky abliterované modely dostupné online",
    platformsLink: "Porovnanie platforiem AI bez cenzúry",
  },
  cta: {
    title: "Polož modelu vlastnú otázku",
    subtitle:
      "Bezplatné kredity každý mesiac aj bez účtu ({{guestCredits}}). Začni s najlepším modelom pre svoju úlohu a kedykoľvek ho vymeň.",
    start: "Začať čet s {{topModel}}",
    models: "Porovnať všetky modely",
  },
};
