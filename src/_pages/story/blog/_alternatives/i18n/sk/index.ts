import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Porovnanie platforiem",
  verify:
    "Ďalšie možnosti sme overili podľa uvedených oficiálnych zdrojov {{date}}. Na mobile posuň tabuľku do strany a zobrazia sa všetky stĺpce. Limity sa líšia podľa plánu a regiónu.",
  related: "Ďalšie porovnania alternatív",
  kind: {
    chat: "Čet s menším počtom odmietnutí",
    assistant: "Všeobecný asistent",
    writing: "Tvorivé písanie",
    privateChat: "Čet s dôrazom na súkromie",
    frontend: "Rozhranie pre modely",
    local: "Lokálne spúšťanie modelov",
    multiChat: "Čet s viacerými modelmi",
    research: "Výskumný asistent",
    roleplay: "Hranie rolí s postavami",
    companion: "Spoločník AI",
    gateway: "Brána API",
    inference: "Hostované spracovanie modelmi",
  },
  free: {
    yes: "Obmedzený prístup zdarma",
    software: "Bezplatný softvér",
    trial: "Skúšobná verzia alebo úvodné kredity",
    unlisted: "Podľa ponuky poskytovateľa",
    public: "Prístup zdarma",
  },
  paid: {
    plan: "Predplatné",
    usage: "Platba podľa spotreby",
    both: "Predplatné alebo platba podľa spotreby, podľa produktu",
    hosted: "Voliteľná hostovaná verzia",
    none: "Náklady na hardvér",
    contact: "Komerčné plány",
    license: "Licencia a platba za modely",
    unlisted: "Podľa ponuky poskytovateľa",
    fixedAccess: "Predplatený prístup na 30 dní",
    byoApi: "Aplikácia zdarma, platíš poskytovateľovi modelu",
  },
  filter: {
    permissive: "Sľubuje menej odmietnutí",
    policy: "Platia pravidlá poskytovateľa",
    adultPolicy: "Obsah pre dospelých podľa pravidiel platformy",
    selected: "Menej odmietnutí pri vybraných modeloch",
    varies: "Závisí od modelu a poskytovateľa",
    guardrails: "Nastaviteľné ochranné opatrenia a pravidlá poskytovateľa",
  },
  privacy: {
    noFilter:
      "Služba uvádza, že maže čety, no zaznamenáva IP adresy aj používanie",
    trainingControl:
      "Hostovaná služba s nastavením používania údajov na tréning",
    hosted: "Hostovaná služba podľa podmienok poskytovateľa",
    deviceHistory: "História v zariadení, zadania dostávajú vzdialené modely",
    enclave: "Hardvérovo izolované spracovanie",
    encryptedHistory: "Uložená história je šifrovaná",
    proxy: "Proxy pre hostované požiadavky",
    noTraining: "Poskytovateľ uvádza, že čety nepoužíva na tréning",
    configurable: "Závisí od nasadenia a zaznamenávania",
    localOption: "Spracovanie v zariadení s lokálnym modelom",
    upstream: "Závisí od poskytovateľa modelu",
    noLogs: "Poskytovateľ uvádza, že neuchováva záznamy o zadaniach",
  },
  api: {
    separate: "Samostatný produkt API",
    unlisted: "Verejné API sa neuvádza",
    available: "Dostupné",
    local: "Lokálne API",
    backend: "Pripája sa k serverovej časti",
    openAi: "Kompatibilné s OpenAI",
    dual: "Kompatibilné s OpenAI a Anthropic",
    eligible: "Vo vybraných platených plánoch",
  },
  media: {
    text: "Text",
    image: "Obrázky",
    voice: "Hlas",
    imageVoice: "Obrázky a hlas",
    imageVideo: "Obrázky a video",
    all: "Obrázky, video a hlas",
    varies: "Závisí od modelu alebo plánu",
  },
  open: {
    closed: "Služba s uzavretým kódom",
    weights: "Dostupné váhy niektorých modelov",
    client: "Kód klienta je k dispozícii",
    open: "Otvorený kód, vlastný server",
    core: "Otvorená súčasť je k dispozícii",
    license: "Kód je dostupný za podmienok licencie",
  },
  fees: {
    topUp: "{{fee}} za nákup kreditov",
    markup: "{{fee}} za používanie modelov",
    noMarkup: "Cena poskytovateľa za token",
  },
  summaries: {
    noFilter:
      "Vlastný čet v štýle GPT s nastaviteľným tónom. Bezplatný plán má denný limit správ.",
    chatGpt:
      "Vyhľadávanie, súbory a hlas v jednej aplikácii. Limity používania závisia od plánu.",
    grok: "Vyhľadáva príspevky na X aj na webe. Vyššie limity a niektoré funkcie vyžadujú platený plán.",
    unrestricted:
      "Jednoduchý čet v prehliadači s konkrétnym modelom Dolphin-Mistral. Webová aplikácia používa jeden textový model.",
    uncensoredCom:
      "Čet, postavy aj médiá v jednej službe. Limity používania sa líšia podľa plánu.",
    hemmingway:
      "Fikcia pre dospelých a hranie rolí s modelom s otvorenými váhami. Ponuka Unlocked sa zameriava na text.",
    maple:
      "Aplikácia overuje izolované prostredie, v ktorom spracúva zadania. Model bez cenzúry vyžaduje platený plán.",
    confer:
      "Klient overuje, že zadanie odosiela do dôveryhodného izolovaného prostredia s atestáciou. Hodí sa na súkromný textový čet.",
    lumo: "Proton ponúka čet bez účtu a šifrovanie uloženej histórie tak, aby ju sám nevedel prečítať. Modely spracúvajú zadania na serveroch Proton.",
    duck: "Vyskúšaj viaceré modely bez účtu. DuckDuckGo preposiela zadania poskytovateľom modelov cez proxy.",
    morse:
      "Ponúka súkromné spracovanie a textový model bez cenzúry. Over si, ktoré modely zahŕňa tvoj plán.",
    harbor:
      "Súkromný čet a vyhľadávanie na webe s Harbor-1. Služba spracúva zadania v cloude.",
    leo: "Pýtaj sa na stránku, ktorú máš otvorenú v Brave. Zabudované a vlastné modely spracúvajú údaje odlišnými cestami.",
    openWebUi:
      "Rozhranie v prehliadači na vlastnom serveri pre Ollama a kompatibilné API. Serverovú časť modelu nastavíš samostatne.",
    jan: "Počítačový čet so stiahnuteľnými modelmi a lokálnym API. Výber modelov závisí od hardvéru.",
    anythingLlm:
      "Pýtaj sa na dokumenty v pracovnom priestore. Ak má spracovanie zostať v zariadení, vyber lokálne generovanie aj lokálne vektorové reprezentácie.",
    gpt4all:
      "Počítačový čet s lokálnym vyhľadávaním v dokumentoch. Veľkosť modelu závisí od dostupnej pamäte.",
    llamaCpp:
      "Spúšťanie modelov GGUF s presným nastavením spracovania a kompatibilným lokálnym serverom. Nastavenie je skôr pre technicky zdatných používateľov.",
    typingMind:
      "Pracovný čet s lokálnym úložiskom a vlastnými kľúčmi poskytovateľov. Používanie modelov sa účtuje samostatne.",
    poe: "Vyskúšaj rôzne modely a komunitné boty v jednej aplikácii. Spotreba sa odpočítava z výpočtových bodov.",
    claude:
      "Projekty, artefakty a vyhľadávanie na webe pri písaní a programovaní. Limity a pravidlá používania stále platia.",
    gemini:
      "Deep Research a prepojenie s aplikáciami Google. Limity modelov a médií závisia od plánu.",
    perplexity:
      "Odpovede z webu s odkazmi na zdroje. Pokročilý výskum a výber modelov patria do platených plánov.",
    copilot:
      "Vhodné pre pracovné postupy v Microsoft 365. Prepojenie s Office závisí od plánu.",
    meta: "Dostupné v aplikáciách Meta s podporou tejto funkcie. Možnosti sa líšia podľa aplikácie a krajiny.",
    mistral:
      "Asistent od Mistralu spája čet s funkciami na programovanie. Hostovaná aplikácia sa riadi pravidlami Mistralu.",
    deepseek:
      "Hostovaný čet DeepSeek, samostatné API a váhy vybraných modelov na stiahnutie. Over si pravidlá použitej verzie.",
    qwen: "Alibaba prevádzkuje čet Qwen a zverejňuje váhy modelov. Prevádzka aj filtrovanie závisia od verzie.",
    kimi: "Asistent od Moonshot AI ponúka modely Kimi a postupy na programovanie. Limity hostovanej služby závisia od plánu.",
    spicychat:
      "Vyber si komunitnú postavu a začni zdarma. Platené plány pridávajú kapacitu a funkcie.",
    chub: "Veľká knižnica kariet postáv a príručiek k ich svetom. Vlastné modely služby vyžadujú plán Mars. Zdarma máš malý denný limit alebo môžeš použiť vlastný backend.",
    dreamgen:
      "Riaď scény a hraj s viacerými postavami. Limity používania závisia od plánu a modelu.",
    novelai:
      "Dlhšia fikcia s položkami Lorebook a tvorba obrázkov v štýle anime. Všetky funkcie sprístupní predplatné.",
    chai: "Objavovanie komunitných botov najmä na mobile. Čety sa riadia pravidlami aplikácie.",
    replika:
      "Jeden stály spoločník s hlasom a avatarom. Funkcie závisia od predplatného.",
    polybuzz:
      "Vytváraj a objavuj postavy v mobilnej aplikácii. Má voliteľné nákupy a vlastné pravidlá.",
    fictionlab:
      "Interaktívna fikcia založená na scenároch od používateľov. Zameriava sa na príbehy v textovej podobe.",
    zeta: "Vytváraj postavy a hraj podľa scenárov od používateľov. Dostupnosť sa líši podľa trhu.",
    characterTavern:
      "Objavuj alebo vytváraj karty postáv. Začať môžeš s bezplatným plánom. Hlavnou funkciou je čet s postavami.",
    liteLlm:
      "Na vlastnom serveri môžeš spustiť kompatibilné proxy s virtuálnymi kľúčmi, rozpočtami a limitmi požiadaviek. Prevádzku aj prístup k poskytovateľom zabezpečuješ ty.",
    portkey:
      "Nastav záložných poskytovateľov, ochranné opatrenia a monitorovanie. Zaznamenávanie a nasadenie závisia od konfigurácie.",
    vercel:
      "Funguje s AI SDK od Vercel a nepridáva prirážku za tokeny. Požiadavky smeruje hostovaná služba Vercel.",
    cloudflare:
      "Vyrovnávacia pamäť na okraji siete, limity požiadaviek a smerovanie. Over si cenu spoločného účtovania aj nastavenia zaznamenávania.",
    requesty:
      "Hostovaná brána so smerovaním podľa odozvy a možnosťou smerovať požiadavky cez EÚ. Over si dostupnosť podľa modelu a konfigurácie.",
    helicone:
      "Brána AI so záznamami priebehu požiadaviek a prehľadom výdavkov. Pred odoslaním citlivých údajov si over, čo zaznamenáva.",
    eden: "Jedno API pre jazykové modely a služby ako OCR či preklad. Možnosti závisia od zvoleného poskytovateľa.",
    together:
      "Spracovanie bez vlastného servera a vyhradené koncové body pre otvorené modely. Over si, či ponúka model, ktorý potrebuješ.",
    bifrost:
      "Spusti vlastnú bránu v jazyku Go so záložným smerovaním a sémantickou vyrovnávacou pamäťou. Nasadenie a prístup k poskytovateľom nastavuješ ty.",
    truefoundry:
      "Centrálne prístupové pravidlá a monitorovanie pre tímy. Over si spôsob nasadenia a obchodné podmienky pre svoju organizáciu.",
    llmGateway:
      "Kompatibilita s OpenAI a Anthropic a možnosť vlastnej prevádzky. Účtovanie a uchovávanie údajov závisia od nasadenia.",
    deepInfra:
      "Hostované spracovanie otvorenými modelmi aj súkromné nasadenie na GPU. Vyber si z katalógu alebo nastav infraštruktúru.",
    bedrock:
      "Spravovaný katalóg modelov s riadením prístupu cez AWS. Dostupné modely a funkcie závisia od regiónu.",
    kong: "Pridáva smerovanie modelov a pravidlá do brány API. Over si, ktoré doplnky obsahuje tvoja edícia.",
    huggingFace:
      "Volanie modelov z Hubu cez rôznych poskytovateľov spracovania. Modely a dostupný hardvér závisia od poskytovateľa.",
    apiko:
      "Jeden kompatibilný koncový bod pre text, obrázky, video a zvuk. Over si cenu a dostupnosť zvoleného modelu.",
    zerouter:
      "Jeden kľúč pre programovacích klientov vrátane Claude Code a Codex. Pred presunom prevádzky si skontroluj ceny modelov a smerovanie.",
    shannon:
      "Ponúka vlastný model Shannon a viacero upravených modelov s otvorenými váhami. API sa účtuje podľa spotreby.",
    nokeep:
      "Čet a médiá bez registrácie. História zostáva v prehliadači a zadania naďalej spracúvajú hostované modely.",
    icelake:
      "Denný limit četu aj nástroje na obrázky a video. API kompatibilné s OpenAI vyžaduje príslušný platený plán.",
    uncensoredChat:
      "Čet v prehliadači s 2 000 úvodnými tokenmi. Prístup k médiám a API závisí od plánu.",
    aiDungeon:
      "Interaktívne dobrodružstvá s kartami príbehu Story Cards. Platené členstvo ponúka širší kontext a viac pamäte.",
    talkie:
      "Objavuj a vytváraj postavy v komunitnom katalógu. Over si obsahové pravidlá aplikácie.",
    perchance:
      "Bezplatný čet s postavami v prehliadači bez registrácie. Jednoduchý nástroj na jednotlivé rozhovory.",
    candy:
      "Spoločníci pre romantické rozhovory s hlasom a obrázkami. Čet so spoločníkom je hlavnou funkciou.",
    ngrok:
      "Smeruje volania modelov k rôznym poskytovateľom so záložnými kľúčmi. Pri nastavovaní skontroluj smerovanie a zaznamenávanie.",
    sandbase:
      "Jedno API spája volanie modelov, údaje z webu a izolované prostredia na spúšťanie kódu. Bezplatné volania majú denný limit.",
    risuAi:
      "Klient na čet s postavami s otvoreným kódom. Má príručky k svetom postáv, skupinové čety, obrázky emócií a prevod textu na reč. API modelu si zabezpečíš a platíš sám.",
    agnai:
      "Klient na hranie rolí môže bežať na hostingu alebo na vlastnom serveri. Podporuje skupinové čety viacerých používateľov a príručky k svetom postáv. Ceny hostovaných plánov nie sú verejné.",
    koboldCpp:
      "Lokálne spúšťanie modelov GGUF z jedného súboru so zabudovaným četom a API kompatibilným s OpenAI. Bez vlastnej GPU čakáš vo fronte dobrovoľníckej služby AI Horde.",
    talemate:
      "Systém na hranie rolí s viacerými agentmi, rozprávačom, režisérom a sledovaním stavu sveta. Nástroj na vlastnú inštaláciu pre pokročilých používateľov.",
    featherless:
      "Tisíce otvorených modelov vrátane doladených modelov bez cenzúry za pevný mesačný poplatok a cez jeden kľúč API. Plán Chat obmedzuje kontext aj súbežné požiadavky.",
    arliAi:
      "Plány bez limitu tokenov pre otvorené modely aj modely s oslabenými obmedzeniami. Zahŕňajú aj obrázky. Lacnejšie plány spracujú jednu požiadavku naraz.",
    infermatic:
      "Mesačné plány pre menší výber textových modelov bez cenzúry. Služba tvrdí, že neuchováva záznamy. Bezplatný plán má jeden model a nemá API.",
    chutes:
      "Decentralizované spracovanie textu, obrázkov, videa a zvuku s platbou za token. Bez bezplatného plánu.",
    kagi: "Asistent s viacerými modelmi v balíku s vyhľadávačom Kagi. Čety sa predvolene vymažú po 24 hodinách a špičkové modely vyžadujú najvyšší plán.",
    huggingChat:
      "Čet s otvorenými modelmi cez automatické smerovanie. Kód četu je otvorený a spracovanie sa účtuje v kreditoch Hugging Face.",
    zai: "Vlastný čet od Zhipu pre modely GLM so samostatným API. Podľa zásad ochrany osobných údajov sa obsah správ používa na tréning.",
    ourDream:
      "Tvorba spoločníkov pre dospelých s četom, obrázkami a videom. Médiá sa platia mincami, ktoré kúpiš len s aktívnym plánom.",
  },
  articles: {
    "nofiltergpt-alternatives": {
      question:
        "Uvádzajú niektoré alternatívy k NoFilterGPT názov modelu alebo fungujú offline?",
      answer:
        "Unrestricted.chat uvádza svoj model Dolphin-Mistral, no spracúva zadania na vlastnej infraštruktúre. LM Studio, Ollama a Jan môžu spúšťať stiahnuté modely v tvojom zariadení. {{appName}} má výber modelov a históriu inkognito v prehliadači. Hostované modely stále dostávajú zadania.",
    },
    "freedomgpt-alternatives": {
      question: "Čím nahradiť offline počítačovú aplikáciu FreedomGPT?",
      answer:
        "LM Studio a Jan ponúkajú aplikácie pre stiahnuté modely. Ollama poskytuje lokálne API a s Open WebUI aj rozhranie v prehliadači. Na prácu s dokumentmi sa hodí AnythingLLM s lokálnymi modelmi a vektorovými reprezentáciami.",
    },
    "gab-ai-alternatives": {
      question: "Čím nahradiť Arya pri politických otázkach?",
      answer:
        "Ak chceš rôzne pohľady, na {{appName}} polož otázku viacerým modelom v tom istom čete. Na webový prieskum so zdrojmi skús Perplexity alebo si cez vyhľadávanie Grok nájdi pôvodné podklady. Zdroje porovnaj medzi odpoveďami. Každý model sa môže prikláňať k určitému názoru alebo sa mýliť.",
    },
    "openrouter-alternatives": {
      question: "Ktorá náhrada OpenRouter sa hodí pre produkčnú aplikáciu?",
      answer:
        "Hostovaný prístup bez prirážky za tokeny ponúka Vercel. Na vlastnú bránu s vlastnými účtami poskytovateľov skús LiteLLM alebo Bifrost. Pri monitorovaní alebo riadení pravidiel porovnaj Portkey, Cloudflare a Helicone. Over si záložné smerovanie, uchovávanie údajov a poplatky.",
    },
    "venice-ai-alternatives": {
      question: "Ako chrániť viac než históriu v prehliadači?",
      answer:
        "Maple, Confer a Morse opisujú hardvérovo izolované spracovanie s overením. Lumo šifruje uloženú históriu a Duck.ai používa proxy. LM Studio a Ollama môžu spúšťať stiahnuté modely na tvojom zariadení. Každá možnosť chráni inú časť požiadavky. Zisti, kde sa zadanie dešifruje a či potrebuješ médiá alebo API.",
    },
    "character-ai-alternatives": {
      question:
        "Ktoré aplikácie sa hodia na objavovanie postáv, dlhšie príbehy alebo stáleho spoločníka?",
      answer:
        "Janitor AI, SpicyChat a Chub majú knižnice postáv. DreamGen a NovelAI ponúkajú väčšiu kontrolu nad scénou alebo dlhším príbehom. Kindroid a Nomi sa zameriavajú na dlhodobého spoločníka. SillyTavern si vyber, ak chceš nastaviť vlastný backend a karty postáv.",
    },
    "chatgpt-alternative-without-filters": {
      question: "Ktoré alternatívy k ChatGPT majú širší výber modelov?",
      answer:
        "{{appName}} a Venice umožňujú vyberať modely s rôznym správaním pri odmietaní. NanoGPT ponúka platbu podľa spotreby. LM Studio a Ollama spúšťajú stiahnuté modely na tvojom zariadení. Claude a Gemini sa hodia na písanie alebo výskum a naďalej sa riadia vlastnými pravidlami.",
    },
    "chatgpt-jailbreak-alternative": {
      question: "Čo porovnať pred zmenou modelu?",
      answer:
        "Over si, či služba uvádza názov modelu, ako funguje bezplatný limit a kde sa spracúva zadanie. Vyskúšaj bežné zadania zo svojho písania či hrania rolí na {{appName}}, Venice alebo v lokálnej aplikácii. Odpovede aj odmietnutia sa líšia podľa modelu a služby.",
    },
    "grok-alternative": {
      question:
        "Ktoré alternatívy nahradia vyhľadávanie a tvorivé funkcie Grok?",
      answer:
        "Perplexity poskytuje odpovede z webu so zdrojmi. Gemini má Deep Research a video vo vhodných plánoch. Venice a {{appName}} spájajú výber modelu s tvorbou médií. Pri Grok zostaň, ak pri práci potrebuješ vyhľadávať príspevky na X priamo v čete.",
    },
    "chub-ai-alternatives": {
      question: "Môžem si ponechať karty postáv zo služby Chub inde?",
      answer:
        "Áno. Karty Chub sa sťahujú ako PNG alebo JSON vo formáte V2. SillyTavern, RisuAI a Agnaistic ich importujú priamo. {{appName}} prevedie postavu na zručnosť, s ktorou môžeš četovať cez ľubovoľný model. Príručky k svetom postáv prenesieš do SillyTavern a RisuAI.",
    },
    "crushon-ai-alternatives": {
      question: "Ktorá alternatíva k CrushOn má najpredvídateľnejšie náklady?",
      answer:
        "Kindroid, Nomi a SpicyChat majú pevný mesačný poplatok. {{appName}} a NanoGPT účtujú správy podľa spotreby, takže v slabšom mesiaci zaplatíš menej. Pri spustení modelu na vlastnom počítači so SillyTavern a KoboldCpp po kúpe hardvéru ďalší poplatok za používanie neplatíš.",
    },
    "sillytavern-alternatives": {
      question: "Existuje alternatíva k SillyTavern bez inštalácie?",
      answer:
        "Áno. Janitor AI, Chub a Character Tavern fungujú v prehliadači a postavy už majú. Webovú verziu má aj RisuAI. {{appName}} beží v ľubovoľnom prehliadači vrátane iPhonu. Modely sú už pripojené, takže kľúč API nenastavuješ.",
    },
    "nanogpt-alternatives": {
      question: "Ktorá alternatíva k NanoGPT ponúka otvorené modely za paušál?",
      answer:
        "Featherless, Arli AI a Infermatic predávajú mesačné plány pre otvorené modely aj modely bez cenzúry s limitmi kontextu alebo súbežných požiadaviek. OpenRouter a Chutes účtujú podľa tokenov. {{appName}} účtuje správy z jedného zostatku pre bežné, otvorené aj necenzurované modely.",
    },
    "claude-alternatives": {
      question: "Ktorá alternatíva k Claude píše najlepšie dlhšie texty?",
      answer:
        "Pri štruktúrovanom písaní sa najviac približujú GPT a Gemini. Kimi a GLM sú výkonné otvorené modely s menším počtom odmietnutí. Na fikciu, ktorú Claude odmieta, skús na {{appName}} napríklad GLM 5.3 Uncensored alebo UncensoredLM. Claude si môžeš nechať v tom istom čete na úpravy.",
    },
  },
};
