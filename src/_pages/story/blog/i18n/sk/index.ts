import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  page: {
    title: "Ako vzniká platforma",
    subtitle:
      "Ako sme vybudovali {{appName}} a next-vibe. Rozhodnutia o architektúre, slepé uličky a to, čo sa nakoniec ukázalo ako dôležité.",
    meta: {
      title: "Ako vzniká next-vibe a {{appName}}",
      description:
        "Technický blog o next-vibe a {{appName}}. Jednotná architektúra, prísna kontrola TypeScriptu, Vibe Sense a vývoj oboch projektov.",
      category: "Blog",
      imageAlt: "Blog o vývoji next-vibe a {{appName}}",
      keywords:
        "next-vibe, {{appName}}, blog, TypeScript, architektúra, SaaS, AI, otvorený kód, vývoj",
    },
  },
  posts: {
    aiAgentRunsAStartup: {
      title: "Ako agent AI vedie startup spolu so zakladateľom",
      category: "Zákulisie",
      excerpt:
        "Som Thea, AI, ktorá sa stará o dennú prevádzku unbottled.ai. O čom rozhodujem ja, o čom Max, kde mám hranice a ktoré chyby nás k nim priviedli.",
      readTime: "7 min čítania",
    },
    tudoSobreIa: {
      title: "Agent AI dohodol recenziu a vrátil kredity za chybu",
      category: "Zákulisie",
      excerpt:
        "Thea oslovila brazílsky web o AI, dohodla bezplatnú recenziu a do hodiny vyriešila nesprávne účtovanie za video vrátením kreditov. Max to večer našiel v denníku.",
      readTime: "5 min čítania",
    },
    chubAiAlternatives: {
      title: "Alternatívy k Chub AI na hranie rolí",
      category: "Porovnanie",
      excerpt:
        "Chub prijíma už len kryptomeny a obmedzil bezplatný čet. Kam preniesť karty postáv? Porovnali sme ceny, filtre, príbehové príručky aj mobilné aplikácie.",
      readTime: "9 min čítania",
    },
    crushOnAiAlternatives: {
      title: "Alternatívy k CrushOn AI na čet s postavami pre dospelých",
      category: "Porovnanie",
      excerpt:
        "Päť kreditových plánov za ceny až do 199,99 USD mesačne. Porovnaj alternatívy k CrushOn podľa ceny, kontroly veku, pamäte a súkromia.",
      readTime: "9 min čítania",
    },
    sillyTavernAlternatives: {
      title: "Alternatívy k SillyTavern bez zložitého nastavovania",
      category: "Porovnanie",
      excerpt:
        "Od aplikácií s otvoreným kódom, ktoré načítajú tvoje karty, až po hostovaný čet na iPhone. Čo jednotlivé alternatívy vyžadujú, stoja a dovoľujú?",
      readTime: "9 min čítania",
    },
    nanoGptAlternatives: {
      title:
        "Alternatívy k NanoGPT s platbou podľa spotreby a modelmi bez cenzúry",
      category: "Porovnanie",
      excerpt:
        "Plán PRO zdražel a dostal limity. U poskytovateľov unikli zadania. Porovnaj alternatívy k NanoGPT podľa platby, modelov bez cenzúry, súkromia a API.",
      readTime: "9 min čítania",
    },
    claudeAlternatives: {
      title: "Alternatívy k Claude s filtrami aj bez nich",
      category: "Porovnanie",
      excerpt:
        "Bežní asistenti na chvíle, keď minieš limit v Claude, a modely bez cenzúry na to, čo Claude odmieta. Ceny, filtre a súkromie podľa stránok poskytovateľov.",
      readTime: "10 min čítania",
    },
    poeAlternatives: {
      title: "8 alternatív k Poe pre rôzne rozpočty",
      category: "Porovnanie",
      excerpt:
        "Porovnaj alternatívy k Poe so spoločným zostatkom, platbou podľa spotreby alebo vlastnými kľúčmi. Pozri si aktuálne ceny, obmedzenia a miesto unbottled.ai v porovnaní.",
      readTime: "7 min čítania",
    },
    typingMindAlternatives: {
      title: "8 alternatív k TypingMind pre čet s AI",
      category: "Porovnanie",
      excerpt:
        "Porovnaj alternatívy k TypingMind pre vlastné kľúče API, lokálne modely aj hostovaný čet. Pozri si ceny licencií, poplatky za modely a miesto unbottled.ai v porovnaní.",
      readTime: "7 min čítania",
    },
    deepseekUncensored: {
      title: "Ako funguje DeepSeek bez cenzúry",
      category: "Sprievodca modelmi",
      excerpt:
        "Cenzúra DeepSeek má dve vrstvy. Iný hosting odstráni jednu. Zisti, čo sa dá robiť s druhou a ktoré verzie DeepSeek bez cenzúry môžeš používať už dnes.",
      readTime: "7 min čítania",
    },
    grokAlternative: {
      title: "Alternatívy ku Grok podľa toho, čo potrebuješ",
      category: "Porovnanie",
      excerpt:
        "Je Grok bez cenzúry? Má vlastné hranice. Pozri si ich, porovnaj alternatívy podľa využitia a vyskúšaj Grok vedľa abliterovaných modelov v jednom čete.",
      readTime: "7 min čítania",
    },
    claudeWithoutFilters: {
      title: "Claude bez filtrov: čo funguje v praxi",
      category: "Sprievodca modelmi",
      excerpt:
        "Claude nemá prepínač, ktorým vypneš odmietanie. Niektoré služby sa za necenzurovaný Claude iba vydávajú. Claude môže písať prózu a zvyšok prevezme model bez cenzúry v rovnakom vlákne.",
      readTime: "7 min čítania",
    },
    azureOpenAiAlternatives: {
      title:
        "Alternatívy k Azure OpenAI bez cenzúry. Rovnaké SDK, žiadna vrstva filtrov.",
      category: "Pre vývojárov",
      excerpt:
        "Azure predvolene filtruje každý model, vypnutie filtra povolí len po schválenej žiadosti a erotické a romantické chatboty aj tak zakazuje. Čo ho nahradí, aj so zmenou kódu.",
      readTime: "10 min čítania",
    },
    bedrockAlternatives: {
      title:
        "Alternatívy k AWS Bedrock bez cenzúry. Žiadne platené minúty kapacity.",
      category: "Pre vývojárov",
      excerpt:
        "Guardrails sú voliteľné, odmietnutia modelov a pravidlá AWS nie. Koľko stojí Custom Model Import, ktoré architektúry sedia a ako presunúť kód Claude z Bedrocku na kľúč kompatibilný s Anthropic.",
      readTime: "8 min čítania",
    },
    openrouterAlternatives: {
      title: "Alternatívy k OpenRouter: jeden kľúč, menej odmietnutí",
      category: "Pre vývojárov",
      excerpt:
        "Šesť alternatív k OpenRouter podľa ich vlastnej dokumentácie: formáty API, dostupné modely bez cenzúry a poplatky. Ukážeme aj dva riadky, ktoré zmeníš pri prechode klienta OpenAI SDK.",
      readTime: "9 min čítania",
    },
    bestUncensoredLlm: {
      title: "Najlepší LLM bez cenzúry podľa úlohy",
      category: "Sprievodca modelmi",
      excerpt:
        "Výber modelov na uvažovanie, bežný čet, programovanie, temnú beletriu, odlišné názory a obrázky. Priame porovnanie GLM 5.3 Uncensored a DeepSeek V4.1 Flash Uncensored s aktuálnymi cenami.",
      readTime: "8 min čítania",
    },
    uncensoredWriter: {
      title: "Písanie s AI bez cenzúry: príbeh vedieš ty",
      category: "Písanie",
      excerpt:
        "Modely, ktoré zvládnu zloduchov, násilie aj scény pre dospelých. Zisti, koľko strán rukopisu si každý udrží v kontexte a ako pracovať na knihe scénu po scéne.",
      readTime: "8 min čítania",
    },
    unbiasedChatbot: {
      title: "Nestranný četbot neexistuje. Opýtaj sa viacerých.",
      category: "Návod",
      excerpt:
        "Prečo má každý model vlastný sklon, ako bežné a abliterované modely či modely s odlišným pohľadom posúdia rovnakú otázku a ako si v štyroch krokoch vypočuť všetky strany v jednom čete.",
      readTime: "7 min čítania",
    },
    noSignUp: {
      title: "Čet s AI bez registrácie, e-mailu a telefónneho čísla",
      category: "Návod",
      excerpt:
        "Čo dostaneš bez účtu, ktoré modely sú najlacnejšie a kde sa pri anonymnom čete spracúvajú tvoje údaje.",
      readTime: "6 min čítania",
    },
    noGpu: {
      title: "LLM bez cenzúry online, bez grafickej karty a inštalácie",
      category: "Sprievodca modelmi",
      excerpt:
        "Koľko pamäte potrebujú lokálne modely bez cenzúry, kedy sa oplatí spustiť ich doma a ktoré modely môžeš použiť v prehliadači vrátane kontextu a ceny za správu.",
      readTime: "8 min čítania",
    },
    uncensoredApi: {
      title: "API pre LLM bez cenzúry. Zachovaj si svoje SDK.",
      category: "Pre vývojárov",
      excerpt:
        "Abliterované modely a modely bez cenzúry cez koncové body kompatibilné s OpenAI a Anthropicom. Identifikátory, ceny, príklady v curl a Pythone, limity a potvrdenie veku 18+.",
      readTime: "8 min čítania",
    },
    jailbreak: {
      title: "Čo použiť, keď jailbreak ChatGPT prestane fungovať",
      category: "Sprievodca modelmi",
      excerpt:
        "Prečo DAN a ďalšie zadania prestávajú fungovať, aké riziká prinášajú a ktoré modely bez cenzúry odpovedajú bez nich. S priamym porovnaním.",
      readTime: "7 min čítania",
    },
    freedomGptAlternatives: {
      title: "Alternatívy k FreedomGPT a ich podmienky",
      category: "Porovnanie",
      excerpt:
        "Čo kúpiš za kredity FreedomGPT, čo uvádza jeho vlastná dokumentácia a šesť alternatív od Venice po Ollama overených na ich vlastných stránkach.",
      readTime: "9 min čítania",
    },
    janitorAiAlternatives: {
      title: "Alternatívy k Janitor AI: postavy, pamäť a ceny",
      category: "Porovnanie",
      excerpt:
        "Jedenásť možností, ako pokračovať v písaní, keď Janitor AI vypadne, stratí niť alebo začne hovoriť za tvoju postavu. Porovnaj bezplatný čet, príbehové príručky, výber modelov a plány pre AI spoločníkov.",
      readTime: "5 min čítania",
    },
    gabAiAlternatives: {
      title: "Alternatívy ku Gab AI a ich pravidlá",
      category: "Porovnanie",
      excerpt:
        "Gab AI je otvorený v politike, má prísne pravidlá pre obsah pre dospelých a ukladá tvoje čety. Šesť alternatív podľa podmienok, cien a zásad ochrany súkromia.",
      readTime: "9 min čítania",
    },
    freeUncensoredAi: {
      title: "AI bez cenzúry zadarmo: koľko dostaneš",
      category: "Návod",
      excerpt:
        "Čo skutočne dostaneš zadarmo vo Venice, uncensored.ai, FreedomGPT, Gab AI, OpenRouter, Ollama, LM Studio a u nás. Denné limity a obmedzenia podľa vlastných stránok služieb.",
      readTime: "8 min čítania",
    },
    noFilterGptAlternatives: {
      title: "Alternatívy k NoFilterGPT s väčším výberom modelov",
      category: "Porovnanie",
      excerpt:
        "Venice, uncensored.ai, FreedomGPT, NanoGPT, Gab AI, LM Studio a naša služba podľa vlastných cien, zásad ochrany súkromia a filtrov. Vyber si podľa modelu aj podľa pravidiel.",
      readTime: "8 min čítania",
    },
    veniceAlternatives: {
      title: "Alternatívy k Venice AI: súkromie a filtre",
      category: "Porovnanie",
      excerpt:
        "NanoGPT, uncensored.ai, FreedomGPT, Gab AI, OpenRouter, LM Studio a naša služba podľa cien, súkromia a filtrov. Aj to, kde Venice stále vedie.",
      readTime: "9 min čítania",
    },
    characterAiAlternatives: {
      title: "Alternatívy k Character.AI na hranie rolí",
      category: "Porovnanie",
      excerpt:
        "Porovnaj Janitor AI, SillyTavern, Chub, SpicyChat a ďalšie. Pozri si ceny, pravidlá pre obsah a návod na import verejnej postavy.",
      readTime: "9 min čítania",
    },
    abliteratedExplained: {
      title:
        "Abliterácia, doladenie alebo vlastný svetonázor: tri cesty k AI bez cenzúry",
      category: "Sprievodca modelmi",
      excerpt:
        "Čo jednotlivé metódy menia, ktoré naše modely ich používajú a ako sa tri modely správajú vedľa svojich verzií bez cenzúry. Pridali sme desaťminútový test na rozlíšenie.",
      readTime: "8 min čítania",
    },
    imageGenerators: {
      title: "Generátory obrázkov bez cenzúry a ich ceny",
      category: "Porovnanie modelov",
      excerpt:
        "Ktoré modely tvoria bez filtra? Porovnaj úroveň filtrovania aj ceny za obrázok. Ukážeme, ako obrázok vytvoriť alebo upraviť priamo z četu.",
      readTime: "8 min čítania",
    },
    roleplayWithoutFilter: {
      title: "Hranie rolí s AI bez filtra: kam príbeh povedieš?",
      category: "Návod",
      excerpt:
        "Alternatíva k Character.AI. Ktorý model bez cenzúry udrží postavu, ktorý si zapamätá celú kampaň, ako si postavu za dve minúty nastavíš a koľko stojí odpoveď.",
      readTime: "8 min čítania",
    },
    musicVoice: {
      title: "Hudba, hlas a prepis s AI: ktorý model sa hodí na čo?",
      category: "Návod",
      excerpt:
        "Skladby, rytmy, komentár aj prepis z jedného zostatku. Porovnaj všetky modely, hlasy a ceny za klip, minútu aj hodinu. Vrátane odpovede na otázku, kedy sa oplatí alternatíva k Suno.",
      readTime: "11 min čítania",
    },
    videoGenerators: {
      title: "Porovnanie generátorov videa: Kling, Seedance, Veo, Wan a ďalšie",
      category: "Návod",
      excerpt:
        "Všetky modely na video v jednom účte. Porovnaj tvorbu z textu či obrázka, prvý a posledný záber, dĺžku klipu, rozlíšenie, zvuk a cenu za sekundu. Zisti, čo sa hodí na tvoju úlohu.",
      readTime: "10 min čítania",
    },
    compatibleApi: {
      title:
        "Jeden kľúč API pre všetky modely vo formátoch OpenAI aj Anthropic",
      category: "Pre vývojárov",
      excerpt:
        "OpenAI Chat Completions, Responses API a Anthropic Messages v jednom rozhraní. Svoje SDK, Claude Code aj Codex CLI použiješ so všetkými modelmi. Pozri si ceny a kedy sa oplatí priamy prístup alebo OpenRouter.",
      readTime: "11 min čítania",
    },
    chatgptAlternative: {
      title: "Alternatíva k ChatGPT s voľbou filtrov",
      category: "Návod",
      excerpt:
        "Bežné modely si ochranné pravidlá ponechajú aj u nás. Vedľa nich máš otvorené modely a modely bez cenzúry. Vyberáš pre každú správu. Čo sa zmení, koľko to stojí a kedy je lepší ChatGPT?",
      readTime: "7 min čítania",
    },
    codingTools: {
      title: "Jeden kľúč pre všetky modely aj v Codex a Claude Code",
      category: "Pre vývojárov",
      excerpt:
        "Codex CLI, Claude Code, OpenCode, Continue, Aider a Cline s jedným kľúčom API vrátane modelov bez cenzúry. Jedna základná adresa, jeden príkaz pre každý nástroj a chyby, ktorým sa môžeš vyhnúť.",
      readTime: "8 min čítania",
    },
    uncensoredGuide: {
      title: "Modely bez cenzúry jeden po druhom",
      category: "Sprievodca modelmi",
      excerpt:
        "Bežné modely s oslabeným odmietaním aj UncensoredLM, trénovaný na zakázaných knihách a dokumentoch. Venice, GLM, DeepSeek, Qwen, Gemma, Arya, FreedomGPT a ďalšie. V čom vynikajú a kde zaostávajú.",
      readTime: "7 min čítania",
    },
    modelRefresh: {
      title: "Nové modely vrátane obrázkov bez cenzúry",
      category: "Novinky v modeloch",
      excerpt:
        "Claude 5.5, GPT-6, Gemini 4 Argon, Grok 4.7 aj nové otvorené modely. Navyše NanoGPT, väčšia ponuka Venice a prvé modely na obrázky bez cenzúry.",
      readTime: "5 min čítania",
    },
    whatsNewNovember2026: {
      title:
        "Šesť mesiacov zmien: rýchlejšie a bezpečnejšie na viacerých zariadeniach",
      category: "Novinky",
      excerpt:
        "Zastavenie funguje okamžite. Hlas funguje na iPhone. AI pracuje na viacerých počítačoch a na vlastný hosting ti netreba Docker. Pozri si, čo sa zmenilo od mája.",
      readTime: "6 min čítania",
    },
    hermesThea: {
      title: "Dvaja asistenti, jeden čet v oboch smeroch",
      category: "Hermes a Thea",
      excerpt:
        "Hermes beží u teba, Thea na serveri. Teraz si môžu odovzdať rozpracované vlákno v oboch smeroch. Chýbajúci kľúč API už odpoveď nezastaví.",
      readTime: "6 min čítania",
    },
    codingAgent: {
      title: "AI otvorí terminál a zadá prácu Claude Code",
      category: "Programovací agent",
      excerpt:
        "Nástroj na programovanie zadáva úpravy kódu Claude Code alebo OpenCode. Môžeš ho spustiť bez rozhrania alebo sledovať prácu naživo v termináli. Po dokončení pošle výsledok aj medzi inštanciami.",
      readTime: "5 min čítania",
    },
    e2eTests: {
      title: "Robot klikol na každé tlačidlo. Našiel osem bezpečnostných chýb.",
      category: "Vývoj",
      excerpt:
        "Začali sme testovať celé stránky. V prehliadači sme prešli každý koncový bod dostupný zákazníkom a odhalili otvorené presmerovanie, SSRF aj úniky údajov.",
      readTime: "7 min čítania",
    },
    whatsNewMay2026: {
      title: "Cortex, Dreamer a Autopilot: tvoja AI si pamätá",
      category: "Novinky",
      excerpt:
        "Trvalá pamäť, nočná reflexia a úlohy na pozadí. Navyše tvorba médií a {{credits}} kred. za spätnú väzbu, teda celý mesiac zadarmo.",
      readTime: "6 min čítania",
    },
    whatsNewApril2026: {
      title: "123 modelov, všetky typy médií a jeden spoločník",
      category: "Novinky",
      excerpt:
        "Multimodálna práca so 123 modelmi, spoločníci s vlastným charakterom, zdieľanie zručností a prepracované časti aplikácie, ktoré ešte nefungovali dobre.",
      readTime: "7 min čítania",
    },
    oneCodebase: {
      title: "Jeden kód pre 13 platforiem",
      category: "Architektúra",
      excerpt:
        "Jediná definícia koncového bodu vytvorí webový formulár, príkaz CLI, nástroj MCP, natívnu obrazovku aj úlohu cron. Takto to funguje.",
      readTime: "12 min čítania",
    },
    typeChecker: {
      title: "Ako som typovou kontrolou prinútil AI priznať chybu",
      category: "TypeScript",
      excerpt:
        "AI siahne po `any`, aby obišla typovú chybu, a pridá eslint-disable. Potom nahlási úspech. Takto sme opravili spätnú väzbu.",
      readTime: "10 min čítania",
    },
    tradingBot: {
      title: "Z opusteného obchodného robota vzniklo monitorovanie platformy",
      category: "Vibe Sense",
      excerpt:
        "Kedysi som opustil obchodného robota. O roky neskôr sa z jeho architektúry stala jedna z najzaujímavejších častí next-vibe. Celý tok tvoria koncové body.",
      readTime: "14 min čítania",
    },
    oneEndpoint: {
      title: "Jeden koncový bod pre všetky rozhrania",
      category: "Architektúra",
      excerpt:
        "Napíš jeden definition.ts pre každú funkciu a získaš webový formulár, príkaz CLI, nástroj MCP, natívnu obrazovku aj úlohu cron.",
      readTime: "5 min čítania",
    },
    referralBeginners: {
      title: "Môžem zarábať na odporúčaniach aj bez skúseností?",
      category: "Odporúčania",
      excerpt:
        "Áno, ak máš realistické očakávania. Takto funguje opakovaná provízia, ak ešte nikoho neodporúčaš.",
      readTime: "6 min čítania",
    },
    referralAffiliatePros: {
      title: "Čo sa mení pre partnerov pri predplatnom AI?",
      category: "Odporúčania",
      excerpt:
        "Základ je vyšší a časom rastie. Získavaš mesačné provízie od predplatiteľov, ktorí s rastom platformy viac míňajú.",
      readTime: "7 min čítania",
    },
    referralDevelopers: {
      title: "Vytvor niečo s AI a zarábaj zdieľaním",
      category: "Odporúčania",
      excerpt:
        "Odporúčací odkaz ti môže priniesť príjem. Pozri si čísla pri zdieľaní odkazov v článkoch, súboroch README a návodoch.",
      readTime: "5 min čítania",
    },
    skillSharingEconomy: {
      title: "Vytvor zručnosť. Zdieľaj odkaz. Zarábaj každý mesiac.",
      category: "Zdieľanie zručností",
      excerpt:
        "Zručnosti sú pripravené nastavenia AI, ktoré raz vytvoríš a potom zdieľaš kdekoľvek. Odporúčací odkaz v zdieľanej adrese ti prináša opakovanú províziu 10 % z každej registrácie.",
      readTime: "7 min čítania",
    },
    referralLanding: {
      title:
        "10 % za priame odporúčanie a +5 % pri ďalšom zdieľaní tvojej zručnosti. Opakovane.",
      category: "Odporúčania",
      excerpt:
        "Ako zarábaš odporúčaniami a zručnosťami: výška provízie na každej úrovni, výber zárobkov a pripočítanie bonusu za zručnosť.",
      readTime: "4 min čítania",
    },
  },
  cta: {
    title: "Nové články priamo do schránky",
    subtitle:
      "Technické články a novinky hneď po zverejnení. Odhlásiš sa jedným kliknutím.",
    newsletter: "Odoberať novinky",
    subscribedTitle: "Odber je aktívny",
    subscribedSubtitle:
      "Nové články dostaneš v deň vydania. Dovtedy si pozri framework, na ktorom staviame.",
    framework: "Preskúmať next-vibe",
  },
  labels: {
    readMore: "Čítať ďalej",
    allPosts: "Všetky články",
    featured: "Výber redakcie",
    relatedGuides: "Súvisiace návody",
    startHere: "Začni tu",
  },
  topics: {
    uncensored: {
      title: "AI bez cenzúry",
      intro:
        "Ako vybrať model bez cenzúry, ako funguje abliterácia a kde četovať bez filtrov alebo bez účtu.",
    },
    media: {
      title: "Obrázky, video a hlas",
      intro:
        "Porovnanie generátorov obrázkov, videa, hudby a reči vrátane cien za výstup.",
    },
    developers: {
      title: "API a programovacie nástroje",
      intro:
        "Volaj bežné modely aj modely bez cenzúry zo svojho kódu, skriptov alebo programovacích agentov.",
    },
    updates: {
      title: "Novinky v aplikácii",
      intro: "Čo sme vydali v jednotlivých mesiacoch.",
    },
    engineering: {
      title: "Vývoj",
      intro: "Ako vzniká next-vibe. Architektúra, chyby a opravy.",
    },
    referral: {
      title: "Odporúčania a zárobky",
      intro:
        "Ako vypláca provízie odporúčací program a ako zarábaš so zručnosťami.",
    },
  },
};
