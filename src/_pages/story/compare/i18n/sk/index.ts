import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  common: {
    category: "Porovnanie",
    breadcrumb: "Porovnanie platforiem AI bez cenzúry",
    backToBlog: "Späť na blog",
    backToHub: "Všetky platformy AI bez cenzúry",
    updated: "Aktualizované {{date}}",
    versusImageAlt: "{{appName}} a {{name}} vedľa seba",
    kinds: {
      uncensoredChat: "Aplikácia na čet bez cenzúry",
      aggregator: "Aplikácia s viacerými modelmi a API",
      router: "Smerovač API",
      roleplay: "Hranie rolí s postavami",
      frontend: "Rozhranie na hranie rolí na vlastnom serveri",
      companion: "Aplikácia so spoločníkom AI",
      filteredChat: "Čet s postavami a obsahovým filtrom",
      local: "Lokálne spúšťanie modelov",
    },
    period: {
      month: "{{plan}} {{price}} mesačne",
      quarter: "{{plan}} {{price}} za 3 mesiace",
      year: "{{plan}} {{price}} ročne",
      once: "{{plan}} {{price}} jednorazovo",
    },
    free: {
      yes: "Áno",
      no: "Nie",
      local: "Zdarma na vlastnom zariadení",
    },
    paid: {
      from: "Od {{price}}",
      payg: "Platba podľa spotreby",
      none: "Bez plateného plánu",
    },
    availability: {
      yes: "Áno",
      no: "Nie",
      partial: "Obmedzené",
    },
    media: {
      image: "Obrázky",
      video: "Video",
      voice: "Hlas",
      partial: "{{name}} (doplnky)",
      none: "Len text",
    },
    openSource: {
      yes: "Otvorený zdrojový kód",
      yesSelfHost: "Otvorený kód, vlastný server",
      closedLocal: "Uzavretá aplikácia, beží lokálne",
      partial: "Len staršia počítačová aplikácia",
      no: "Nie",
    },
    sourceKinds: {
      home: "Úvodná stránka služby {{name}}",
      pricing: "Cenník služby {{name}}",
      features: "Funkcie služby {{name}}",
      models: "Zoznam modelov služby {{name}}",
      privacy: "Zásady ochrany osobných údajov služby {{name}}",
      terms: "Podmienky používania služby {{name}}",
      guidelines: "Pravidlá komunity služby {{name}}",
      api: "Dokumentácia API služby {{name}}",
      docs: "Dokumentácia služby {{name}}",
      help: "Centrum pomoci služby {{name}}",
      repo: "Zdrojový kód služby {{name}}",
      blog: "Článok na blogu služby {{name}}",
      appStore: "Služba {{name}} v obchode s aplikáciami",
      paper: "Výskumná práca služby {{name}}",
    },
    table: {
      platform: "Platforma",
      kind: "Typ",
      free: "Bezplatný plán",
      paid: "Platený plán",
      filter: "Filter a súhlas",
      privacy: "Súkromie",
      api: "API",
      media: "Médiá",
      open: "Otvorený zdrojový kód",
      usLink: "Pozrieť si plány",
      versusLink: "Podrobné porovnanie",
    },
    versus: {
      shortTitle: "Stručná odpoveď",
      tableTitle: "{{appName}} a {{name}} vedľa seba",
      tableIntro:
        "Údaje o službe {{name}} pochádzajú z jej vlastných stránok. Overené {{date}}. Údaje o {{appName}} sa načítavajú priamo z aktuálnej konfigurácie.",
      tableFootnote:
        "Ceny služby {{name}} sú cenníkové ceny v USD z jej webu. Naše ceny sú tie, ktoré zaplatíš pri nákupe tu. Plány sa menia, preto si pred nákupom pozri zdroje nižšie.",
      colAspect: "",
      rows: {
        price: "Cena",
        free: "Bezplatný plán",
        models: "Modely",
        filter: "Filter a súhlas",
        privacy: "Súkromie",
        api: "API",
        media: "Obrázky, video, hlas",
        open: "Otvorený zdrojový kód",
        forWho: "Pre koho je určený",
      },
      priceCell: "{{plans}}. {{note}}",
      apiCell: "{{short}}. {{text}}",
      themTitle: "{{name}}: výhody a nevýhody",
      usTitle: "{{appName}}: výhody a nevýhody",
      wins: "V čom má {{name}} navrch",
      short: "Kde má {{name}} slabiny",
      chooseTitle: "Ktorú platformu si vybrať?",
      chooseThem: "Vyber si službu {{name}}, ak",
      chooseUs: "Vyber si službu {{appName}}, ak",
      faqTitle: "Časté otázky",
      sourcesTitle: "Zdroje",
      sourcesIntro:
        "Všetky údaje o službe {{name}} na tejto stránke pochádzajú z týchto zdrojov. Overené {{date}}. Ak nájdeš zastaraný údaj, napíš nám a opravíme ho.",
      ourSources:
        "Naše čísla vychádzajú z rovnakej konfigurácie ako účtovanie. Overiť si ich môžeš tu:",
      modelsLink: "Všetky modely na {{appName}} s aktuálnymi cenami",
      pricingLink: "Predplatné a balíky kreditov",
      privacyLink: "Naše zásady ochrany osobných údajov",
      modelTitle: "{{model}} na {{appName}}",
      modelIntro:
        "Model od {{name}} je dostupný v našom výbere. Na jeho stránke nájdeš aktuálnu cenu za správu, kontextové okno a ID pre API.",
      modelPageLink: "{{model}}: cena, kontext a API",
      modelCompareLink: "Priame porovnanie: {{model}} a {{other}}",
      moreTitle: "Ďalšie porovnania",
      ctaSubtitle:
        "Mesačne {{guestCredits}} kr. zdarma. Bez účtu a bez karty. Bežný, otvorený alebo necenzurovaný model si vyberáš pri každej správe.",
      ctaTry: "Začať čet v režime inkognito",
      ctaModels: "Prehliadať všetky modely",
    },
  },
  us: {
    kind: "Čet s bežnými, otvorenými aj necenzurovanými modelmi",
    free: "Áno. Bez účtu {{guestCredits}} kr. mesačne, s účtom {{freeCredits}} kr.",
    paid: "Od {{subPrice}} mesačne",
    filterShort:
      "Úroveň si vyberieš pre každý čet. Modely bez cenzúry sprístupní jednorazové potvrdenie veku aspoň 18 rokov.",
    privacyShort:
      "Čety inkognito zostávajú v prehliadači. Súkromné čety sa ukladajú do účtu.",
    apiShort: "Áno, kompatibilné s OpenAI a Anthropic po nákupe",
    mediaShort: "Obrázky, video, hudba, hlas",
    openShort: "Otvorený kód, vlastný server",
    price:
      "Predplatné mesačne: {{planList}}. Balíkom {{packCredits}} kr. za {{packPrice}} doplníš kredity pri aktívnom predplatnom. Kredity z balíka neprepadnú. Platba kartou, cez PayPal alebo v kryptomene.",
    models:
      "Počet četovacích modelov: {{modelCount}}. Počet laboratórií: {{labCount}}. Bežné modely: {{mainstream}}, otvorené: {{open}}, bez cenzúry: {{uncensored}}. Z modelov bez cenzúry je {{refusalsRemoved}} odvodených z bežných alebo otvorených modelov s odstráneným odmietaním. Model {{ownModel}} má vlastný pohľad na svet. Trénoval na knihách a dokumentoch vylúčených z hlavného prúdu internetu.",
    filter:
      "Tri úrovne: bežné, otvorené a necenzurované modely. Model si vyberáš pri každej správe. Modely bez cenzúry sprístupní jednorazové potvrdenie veku aspoň 18 rokov. Nepridávame vlastnú vrstvu odmietania. Bežné modely si zachovávajú filtre poskytovateľov.",
    privacy:
      "Čety inkognito zostávajú v miestnom úložisku prehliadača, neukladajú sa na naše servery a fungujú bez účtu. Súkromné čety sa ukladajú do tvojho účtu. Vygenerované médiá ukladáme na našich serveroch. Každá správa prejde cez nás k poskytovateľovi modelu, ktorý na ňu odpovie.",
    api: "API /v1 kompatibilné s OpenAI a Anthropic podporuje čet, obrázky, video a reč. Prístup získavaš s ktorýmkoľvek predplatným od {{apiSubPrice}} mesačne alebo nákupom kreditov. Bezplatný účet dostane HTTP 402.",
    media:
      "Modely podľa typu: obrázky {{imageModels}}, video {{videoModels}}, hudba {{musicModels}} a hlas {{voiceModels}}. Používaš ich z ľubovoľného četu a čerpajú z rovnakého zostatku kreditov.",
    open: "Celá platforma má otvorený zdrojový kód na GitHube. Môžeš ju spustiť na vlastnom zariadení.",
    forWho:
      "Pre ľudí, ktorí chcú bežné, otvorené a necenzurované modely aj médiá v jednom čete, s jedným zostatkom kreditov a vlastnou voľbou filtrov.",
  },
  links: {
    hub: "Najlepšie platformy AI bez cenzúry v porovnaní",
    hubDesc:
      "Venice, NanoGPT, Gab AI, uncensored.ai, OpenRouter, Janitor AI, Character.AI, FreedomGPT, lokálne modely a ďalšie. Ceny, filtre, súkromie a API so zdrojmi.",
    versus: "{{appName}} a {{name}}",
    sectionTitle: "Porovnanie platforiem AI bez cenzúry",
    sectionIntro:
      "Venice, NanoGPT, Gab AI, uncensored.ai, OpenRouter, Janitor AI, Character.AI, FreedomGPT a ďalšie. Ceny, filtre a súkromie podľa oficiálnych stránok.",
  },
  platforms: {
    venice: {
      what: "Aplikácia AI zameraná na súkromie. Má veľký katalóg vrátane mnohých textových modelov bez cenzúry, tvorbu obrázkov, videa a hudby, API kompatibilné s OpenAI a staking kryptomien VVV a DIEM.",
      pricingNote:
        "Zdarma 10 textových a 15 obrazových zadaní denne, len so základnými modelmi. 100 kreditov stojí 1 USD. Za video, hudbu a najvýkonnejšie modely sa účtujú ďalšie kredity.",
      models:
        "Katalóg API uvádza 303 modelov vrátane 143 textových. V textovom katalógu je 17 označených ako modely bez cenzúry. V ponuke sú aj Claude, GPT, Gemini a Grok.",
      filterShort:
        "Filter obsahu pre dospelých je predvolene zapnutý. Pro ho môže vypnúť.",
      filter:
        "Filter obsahu pre dospelých (Mature Filter) je predvolene zapnutý. Používatelia s plánom Pro ho môžu vypnúť v nastaveniach. Podľa podmienok potrebujú používatelia vo veku od 13 do 17 rokov súhlas rodiča a filter musia nechať zapnutý.",
      privacyShort: "História predvolene zostáva v tvojom zariadení",
      privacy:
        "Venice predvolene uchováva históriu četu v tvojom zariadení. Platené plány poskytujú šifrované zálohovanie a obnovu. V režime Anonymous podľa Venice počítaj s tým, že poskytovateľ modelu uchováva tvoj obsah. Pro pri vybraných modeloch ponúka aj hardvérovo izolované spracovanie a koncové šifrovanie.",
      apiShort: "",
      api: "API kompatibilné s OpenAI sa účtuje za token v kreditoch v USD. Vložený DIEM prináša kredit API vo výške 1 USD denne. Bez účtu môžeš platiť za jednotlivé požiadavky v USDC cez x402.",
      forWho:
        "Pre používateľov, ktorí dbajú na súkromie a chcú čet bez cenzúry aj médiá v jednej aplikácii. Aj pre vývojárov a držiteľov kryptomien.",
      pro1: "Veľký katalóg textových modelov bez cenzúry a nízke ceny týchto modelov cez API.",
      pro2: "História predvolene zostáva v tvojom zariadení.",
      con1: "Bezplatný plán má limit 10 textových zadaní denne so základnými modelmi.",
      con2: "Na vypnutie filtra obsahu pre dospelých potrebuješ Pro. Video, hudba aj prémiové modely sa účtujú v kreditoch.",
    },
    uncensoredAi: {
      what: "Aplikácia na čet bez cenzúry s jedným modelom, komunitným fórom a archívom dokumentov. Web, iOS aj Android.",
      pricingNote:
        "Zdarma 3 odpovede denne. Ceny plánu Pro sú fixné doživotne. Platby kartou, cez Cash App, Apple Pay alebo Bitcoin. Kredity API sa predávajú samostatne za 0,05 USD za volanie.",
      models:
        "Jeden model, UncensoredAI v1.2, s kontextom 32 000 tokenov. Trénoval na knihách a dokumentoch vylúčených z hlavného prúdu internetu. Jeho politické názory sa od hlavného prúdu líšia.",
      filterShort: "Filter sa neuvádza, podmienky vyžadujú vek aspoň 18 rokov",
      filter:
        "Platforma sa označuje za AI bez obmedzení. Podmienky vyžadujú vek aspoň 18 rokov a zakazujú obsah určený na ublíženie, obťažovanie či ohrozovanie iných.",
      privacyShort: "Podľa zásad sa údaje nepoužívajú na tréning",
      privacy:
        "Podľa zásad sa tvoje údaje nepoužívajú na tréning ani zlepšovanie modelov AI. Správy spracúva Parasail AI. Plán Pro uchováva históriu četu a umožňuje v nej vyhľadávať alebo ju exportovať.",
      apiShort: "",
      api: "API kompatibilné s OpenAI je priamo zameniteľné. Spracovanie jednej požiadavky stojí 0,05 USD.",
      forWho:
        "Pre ľudí, ktorí nedôverujú výkladu hlavného prúdu a chcú priame odpovede na sporné témy.",
      pro1: "Najlacnejší platený plán v tomto zozname, cena je fixná doživotne.",
      pro2: "Podľa zásad ochrany osobných údajov sa údaje nepoužívajú na tréning.",
      con1: "Jeden model s kontextom 32 000 tokenov. Bez tvorby obrázkov, videa alebo hudby.",
      con2: "Zdarma 3 odpovede denne. Hlas, priečinky a archívy vyžadujú Pro.",
    },
    nanoGpt: {
      what: "Webová aplikácia a API pre textové, obrazové, video a zvukové modely s platbou podľa spotreby. Predplatné netreba. Pre otvorené modely je k dispozícii voliteľný plán.",
      pricingNote:
        "Prvý vklad je 0,10 USD v kryptomene alebo 1 USD pri platbe kartou. Ďalšie vklady kartou sú od 5 USD. Na dobitie zostatku sa treba prihlásiť. Web ponúka jeden bezplatný model. PRO (do mája 2026 stál 8 USD) zahŕňa 60 miliónov vstupných tokenov týždenne na vybraných otvorených textových modeloch a 100 obrázkov denne na osobné použitie. Claude, GPT, Gemini a Grok čerpajú zo zostatku.",
      models:
        "Verejné API textových modelov vrátilo 596 položiek. V 38 ID sa nachádzalo uncensored, abliterated alebo Dolphin. Patria sem napríklad Venice Uncensored, GLM 5.3 Uncensored, DeepSeek V4.1 Flash Uncensored a upravený variant Kimi K3.1 Pro.",
      filterShort: "Bez plošného zákazu obsahu NSFW, vek aspoň 18 rokov",
      filter:
        "Musíš mať aspoň 18 rokov a spĺňať vekovú hranicu na uzatváranie zmlúv vo svojej krajine. Podmienky zakazujú materiál zobrazujúci sexuálne zneužívanie detí aj intímny alebo sexuálne explicitný obsah identifikovateľných osôb bez ich súhlasu vrátane deepfake obsahu. Poskytovatelia môžu uplatňovať vlastné obmedzenia.",
      privacyShort: "História predvolene zostáva v prehliadači",
      privacy:
        "História predvolene zostáva v prehliadači. Synchronizácia do cloudu je voliteľná. NanoGPT tvrdí, že pri bežnom spracovaní nezaznamenáva zadania ani odpovede. Zaznamenávanie obsahu API aj pamäť četu sú voliteľné. Niektoré trasy poskytovateľov môžu zadania uchovávať alebo používať na tréning. V novembri 2026 NanoGPT oznámil, že u niekoľkých poskytovateľov došlo k sprístupneniu zadaní, a príslušné trasy vyradil.",
      apiShort: "",
      api: "API kompatibilné s OpenAI podporuje Anthropic Messages aj platby bez účtu cez x402. Niektoré odpovede neuvádzajú cenu alebo zobrazujú odhad, kým sa platba nezaúčtuje.",
      forWho:
        "Pre používateľov a vývojárov, ktorí chcú široký výber modelov, platby v kryptomene a účtovanie podľa spotreby bez predplatného.",
      pro1: "Obrovský výber modelov prevažne za cenníkové ceny, vstup od 0,10 USD.",
      pro2: "Bezplatný webový model funguje bez účtu. História predvolene zostáva v prehliadači.",
      con1: "Bezplatná ponuka na webe zahŕňa jeden model.",
      con2: "Ochrana súkromia závisí od zvolenej trasy poskytovateľa.",
    },
    openRouter: {
      what: "Vývojárske API sprístupňuje jedným kľúčom stovky modelov od mnohých poskytovateľov. Tokeny sa účtujú z predplatených kreditov.",
      pricingNote:
        "Bez predplatného. Cenníkové ceny poskytovateľov a poplatok 5,5 % za nákup kreditov. Pri bezplatných modeloch máš 50 požiadaviek denne, po nákupe kreditov za 10 USD až 1 000.",
      models:
        "474 modelov, z toho 15 bezplatných. Modelov bez cenzúry je málo. Patria sem Venice Uncensored (Dolphin Mistral 24B od Venice) a modely doladené na hranie rolí, napríklad Hermes 4 a Magnum. Ako moderovaných je označených 142 modelov.",
      filterShort:
        "Platia pravidlá poskytovateľov. Mnohé trasy majú moderovanie.",
      filter:
        "Podmienky vyžadujú vek aspoň 18 rokov. OpenRouter kontroluje vstupy na prítomnosť známeho materiálu zobrazujúceho sexuálne zneužívanie detí. Každý poskytovateľ riadi svoj model a na moderovaných trasách sa požiadavky odmietajú podľa jeho pravidiel.",
      privacyShort: "Zadania sa ukladajú len s tvojím súhlasom",
      privacy:
        "OpenRouter uvádza, že zadania ani odpovede neukladá, kým na to nedáš súhlas. Metadáta ukladá vždy. Pravidlá zaznamenávania sa medzi poskytovateľmi líšia.",
      apiShort: "",
      api: "Hlavným produktom je API kompatibilné s OpenAI.",
      forWho:
        "Pre vývojárov, ktorí chcú jeden kľúč k mnohým modelom a záložného poskytovateľa.",
      pro1: "Veľký katalóg za cenníkové ceny bez predplatného.",
      pro2: "Zaznamenávanie a tréning len s výslovným súhlasom.",
      con1: "Málo modelov bez cenzúry.",
      con2: "Služba sa nezameriava na bežné četovanie. Rozhranie si zabezpečíš sám.",
    },
    freedomGpt: {
      what: "Aplikácia AI s bežnými modelmi aj vlastným modelom Liberty bez cenzúry. Vytvára obrázky aj videá. K dispozícii je aj staršia otvorená počítačová aplikácia pre modely bez internetu.",
      pricingNote:
        "Začni bez karty a účtu. Pro zahŕňa 2 200 mesačných kreditov a ponúka ich jednorazové dokúpenie. FreedomGPT odhaduje 10 kreditov za prémiovú odpoveď, 25 za obrázok a 400 za päťsekundové video.",
      models:
        "ChatGPT, Claude, Gemini, Grok, DeepSeek, Qwen, Llama, Mistral a ďalšie. V tom istom zozname sú Liberty aj iné modely bez cenzúry. Celkový počet nezverejňujú.",
      filterShort:
        "Modely bez cenzúry, zákony USA a pravidlá etického používania",
      filter:
        "FreedomGPT uvádza, že všetci používatelia aj všetky hostované modely musia dodržiavať zákony USA. Používanie modelov na neetické účely nepovoľuje. Označenie bez cenzúry nezaručuje odpoveď na každé zadanie.",
      privacyShort: "Správy dostávajú poskytovatelia AI",
      privacy:
        "FreedomGPT posiela správy a prílohy poskytovateľovi, ktorý má pripraviť odpoveď. Podľa zásad pre mobilnú aplikáciu môžu poskytovatelia dostať správy, nahrávky a obrázky len na vytvorenie odpovede a nesmú ich používať na vlastné účely. Pevná lehota uchovávania sa neuvádza.",
      apiShort: "",
      api: "API na chat.freedomgpt.com/api/v1 s kľúčom z ovládacieho panela. Ceny nie sú zdokumentované.",
      forWho:
        "Pre používateľov, ktorí chcú jedno predplatné s množstvom modelov vrátane modelov bez cenzúry.",
      pro1: "Začiatok zdarma bez účtu a karty.",
      pro2: "Obrázky aj video v jednej aplikácii.",
      con1: "Stále platia zákony USA a zákaz neetického používania.",
      con2: "Počítačová aplikácia s otvoreným kódom nemala aktualizáciu od júna 2024.",
    },
    gabAi: {
      what: "Platforma od Gab s 214 modelmi, vlastným modelom Arya, režimom agenta, tvorbou obrázkov, videa a hudby aj počítačovými aplikáciami. Otvorene sa hlási k pravicovým a kresťanským hodnotám.",
      pricingNote:
        "Po overení e-mailu je 250 kreditov zdarma. Jednorazové balíky od 10 USD za 700 kreditov, bez obmedzenia platnosti.",
      models:
        "214 modelov na jeden účet: GPT, Claude, Gemini, DeepSeek, Qwen, Kimi a ďalšie. Vlastný model Arya je založený na kresťanských hodnotách a konzervatívnych zásadách.",
      filterShort: "Voľný prejav, zákaz sexuálneho obsahu",
      filter:
        "Podmienky vyžadujú vek aspoň 18 rokov a zakazujú obscénny, sexuálne explicitný aj pornografický obsah. Súlad môžu kontrolovať automatizované systémy. Politické témy majú voľnosť, obsah pre dospelých je obmedzený.",
      privacyShort: "Čety sa ukladajú a používajú na zlepšovanie modelov",
      privacy:
        "Gab uchováva zadania, odpovede a históriu na serveroch a medzi účelmi uvádza zlepšovanie modelov. Požiadavky posiela poskytovateľom modelov cez vlastné účty. Podľa jeho zásad tým požiadavka nezískava anonymitu.",
      apiShort: "",
      api: "API kompatibilné s OpenAI a Anthropic. Vyžaduje plán Plus.",
      forWho:
        "Pre konzervatívnych a kresťanských používateľov, ktorí chcú AI mimo veľkých technologických firiem.",
      pro1: "Veľký katalóg, režim agenta aj počítačové aplikácie.",
      pro2: "Balíkom kreditov nevyprší platnosť.",
      con1: "Zakazuje sexuálne explicitný obsah vrátane fikcie pre dospelých.",
      con2: "Zadania sa ukladajú a používajú na zlepšovanie modelov.",
    },
    janitorAi: {
      what: "Komunitný web s miliónmi botov od používateľov, vlastným bezplatným modelom JLLM a možnosťou pripojiť vlastný model cez sprostredkovanie API.",
      pricingNote:
        "Americký App Store uvádza cenu janitor+ 12,99 USD mesačne a 99 USD ročne. Podľa centra pomoci sú čety so štandardnými modelmi bezplatné a neobmedzené s kontextom približne 9 000 tokenov. janitor+ pridáva päťnásobný kontext, prednostné odpovede a mesačný limit alternatívnych odpovedí na prémiových modeloch.",
      models:
        "Vlastný bezplatný model JLLM. Základný model nezverejňujú. Môžeš pripojiť aj ľubovoľný model cez proxy. Oficiálny návod používa OpenRouter.",
      filterShort:
        "Označené boty môžu obsahovať NSFW. Vek aspoň 18 rokov sa potvrdzuje vyhlásením.",
      filter:
        "Len pre dospelých po vyhlásení veku aspoň 18 rokov. Boti sa označujú Limited (bez sexuálneho obsahu) alebo Limitless (obsah NSFW povolený). Mobilná aplikácia sa spustí v režime Safe Mode, kým na webe nepovolíš NSFW. Zakázaný je sexuálny obsah s neplnoletými, sexuálne násilie, drastické násilie, sexuálny obsah so zvieratami a nenávistné prejavy.",
      privacyShort: "Čety sa ukladajú a používajú na výskum a vývoj",
      privacy:
        "Čety sa ukladajú ako používateľský obsah. Zásady uvádzajú aj výskum a vývoj na zlepšovanie systémov AI. Pri použití proxy správy dostane aj daný poskytovateľ podľa vlastných zásad.",
      apiShort: "Vlastný kľúč",
      api: "Bez vývojárskeho API. Aplikácia používa cudzie API a cez proxy môžeš pripojiť vlastný kľúč.",
      forWho:
        "Pre hráčov rolí, ktorí chcú rozsiahlu bezplatnú zbierku komunitných postáv.",
      pro1: "Neobmedzený čet zdarma s miliónmi komunitných botov.",
      pro2: "Vlastný model môžeš pripojiť cez proxy.",
      con1: "Bezplatný kontext má asi 9 000 tokenov. Pri dlhých príbehoch sa skoršie scény strácajú z kontextu.",
      con2: "Len text. Bez tvorby obrázkov, videa alebo hlasu.",
    },
    sillyTavern: {
      what: "Bezplatné četovacie rozhranie s otvoreným kódom (AGPL-3.0) na vlastnú inštaláciu. Karty postáv, príručky k svetu a rozšírenia. Model si pripojíš sám.",
      pricingNote:
        "Aplikácia je trvalo bezplatná. Platíš za pripojené API. Pri lokálnom modeli za používanie aplikácie neplatíš.",
      models:
        "SillyTavern sa dodáva bez modelu. Pripojí sa k lokálnym nástrojom KoboldCpp, llama.cpp, Ollama a Oobabooga TextGeneration WebUI alebo ku cloudovým API OpenAI, Anthropic a OpenRouter.",
      filterShort: "Bez vlastného filtra. Rozhoduje model.",
      filter:
        "Rozhranie nemá vlastný filter. Hranice určuje pripojený model alebo poskytovateľ.",
      privacyShort: "Čety uložené vo vlastnom zariadení",
      privacy:
        "SillyTavern ukladá čety do dátového priečinka lokálnej inštalácie. Ak pripojíš cloudové API alebo rozšírenie, dostane údaje, ktoré mu pošleš, a uplatnia sa jeho pravidlá.",
      apiShort: "Pripája sa k API",
      api: "Klient používa API, ktoré nastavíš. Vlastné modely neposkytuje.",
      forWho:
        "Pre pokročilých používateľov, ktorým náročnejšie nastavenie stojí za úplnú kontrolu nad zadaniami a postavami.",
      pro1: "Veľká voľnosť pri výbere serverovej časti, zadaní a rozšírení.",
      pro2: "Zdarma a s otvoreným kódom. Zo zariadenia odchádza len to, čo pošleš do API.",
      con1: "Inštaláciu aj údržbu si zabezpečíš sám (Node.js 20 alebo novší) a musíš pripojiť vlastný model. Na iPhone sa nedá nainštalovať.",
      con2: "Podľa autorov projektu sa s aplikáciou učí pracovať náročnejšie.",
    },
    characterAi: {
      what: "Najväčšia bežná platforma na čet s postavami. Má viac ako 10 miliónov postáv, vlastné modely a prísne obsahové pravidlá. Uvádzame ju ako príklad filtrovanej platformy.",
      pricingNote:
        "Zdarma neobmedzené správy s reklamami. c.ai lite má menej reklám a denný limit prémiových četov. c.ai+ odstraňuje reklamy, umožňuje neobmedzené prémiové čety a sprístupňuje všetky funkcie pamäte. Ceny sa líšia podľa krajiny.",
      models:
        "Character.AI ponúka vlastné štýly četu. PipSqueak 3 a ShortSqueak sú bezplatné. DeepSqueak a LongSqueak sú prémiové. Kľúč k externému modelu nepripojíš.",
      filterShort: "Obsah sa filtruje a pornografia nie je povolená",
      filter:
        "Pornografický obsah je proti podmienkam a podľa služby ho nebude podporovať ani v budúcnosti. Vek každého používateľa sa posudzuje cez službu Persona. Overení používatelia mladší ako 18 rokov môžu iba čítať, četovať nemôžu.",
      privacyShort: "Čety môžu slúžiť na tréning a zacielenie reklám",
      privacy:
        "Character.AI môže používať obsah četov na tréning modelov. Centrum pomoci uvádza, ako môžu používatelia v EHP a Spojenom kráľovstve odmietnuť používanie obsahu nových četov.",
      apiShort: "",
      api: "Bez verejného vývojárskeho API.",
      forWho:
        "Pre ľudí, ktorí chcú zábavný čet bez obsahu pre dospelých s veľkým výberom postáv.",
      pro1: "Rozsiahla zbierka postáv a neobmedzené správy zdarma.",
      pro2: "Lacný vstup cez plán lite, hlasové hovory s postavami.",
      con1: "Obsah pre dospelých nie je povolený. Temné scény sa zjemňujú alebo odmietajú.",
      con2: "Čety sa môžu používať na tréning a reklamu. Model si nevyberieš.",
    },
    kindroid: {
      what: "Aplikácia so spoločníkom AI. Stály priateľ alebo partner s dlhou pamäťou, hlasovými hovormi, videohovormi, selfie a skupinovými četmi.",
      pricingNote:
        "Jednorazová ukážka zahŕňa 50 správ, v niektorých krajinách 15. Potom je účet len na čítanie. Samostatné trojdňové skúšobné obdobie vyžaduje spôsob platby a predĺži sa, ak ho nezrušíš. Ultra a MAX sú mesačné doplnky. Ceny sú z amerického App Store.",
      models:
        "Bezplatnú ukážku a skúšobné obdobie poháňa Ember. Platiaci používatelia si môžu vybrať Polaris a ďalšie vlastné modely vrátane Reverie. Kindroid má aj vlastné modely na selfie.",
      filterShort: "Model bez filtrov, hranice na úrovni účtu",
      filter:
        "Kindroid sa označuje za službu bez filtrov a nefiltruje samotný model. Správy však kontroluje na niekoľko závažných situácií, napríklad bezprostredné sebapoškodenie alebo ohrozenie iných. Vyžaduje vek aspoň 18 rokov. Na overenie sa počíta platené predplatné alebo služba Yoti.",
      privacyShort: "Šifrované pri uložení, bez koncového šifrovania",
      privacy:
        "Čety sú šifrované pri uložení aj prenose. Služba neposkytuje koncové šifrovanie, jej systémy spracúvajú obsah a automatizované bezpečnostné systémy ho preverujú. Kindroid uvádza, že údaje nikdy nepredáva.",
      apiShort: "Osobné API pre vlastných spoločníkov",
      api: "Osobné kľúče API slúžia na rozhovory s vlastnými Kindroidmi. Všeobecné API modelov služba neponúka.",
      forWho:
        "Pre dospelých, ktorí chcú dlhodobého spoločníka AI s hlasom, videom a fotkami.",
      pro1: "Pamäť, selfie, hlasové hovory aj videohovory v reálnom čase.",
      pro2: "Prístup bez filtrov určený pre dospelých.",
      con1: "Po vyčerpaní bezplatnej ukážky potrebuješ skúšobné obdobie alebo predplatné.",
      con2: "Vyššie úrovne pamäte Ultra a MAX sa dokupujú k základnému plánu.",
    },
    nomi: {
      what: "Spoločník AI s dlhodobou pamäťou, selfie, hlasom, skupinovými četmi a klipmi vytvorenými z obrázkov.",
      pricingNote:
        "Zdarma 50 správ denne. Standard sprístupní neobmedzené správy a hlas. Ceny sú z amerického App Store. Starší plán Launch bol jednorazovou ponukou počas bety.",
      models:
        "Vlastné modely pre spoločníkov vrátane Cambrian 6 a Solstice. Kľúče k externým modelom sa nedajú pripojiť.",
      filterShort: "Text bez filtrov, filter nahoty na obrázkoch",
      filter:
        "Podľa webu služba neobmedzuje rozhovory svojvoľnými filtrami obsahu. Na obrázky sa uplatňuje filter nahoty pre požiadavky obchodov s aplikáciami a poskytovateľov platieb. Služba je určená len pre osoby od 18 rokov.",
      privacyShort: "Údaje sa nepredávajú. Pri odstránení účtu platia výnimky.",
      privacy:
        "Nomi uvádza, že osobné údaje nepredáva ani neprenajíma. Odstránením účtu sa osobné údaje zvyčajne vymažú približne do 28 dní. Výnimky sa týkajú tréningu, komunikácie a právnych archívov. Uchované tréningové údaje už po odstránení nie sú prepojené s tebou.",
      apiShort: "Osobné API pre vlastných spoločníkov",
      api: "REST API na rozhovory s vlastnými postavami Nomi. Všeobecné API modelov služba neponúka.",
      forWho:
        "Pre ľudí, ktorí chcú dlhodobé citové spojenie so spoločníkom, ktorý si ich pamätá.",
      pro1: "Pamäť určená na dlhodobé vzťahy.",
      pro2: "Bezplatný plán a jasné pravidlá proti predaju údajov.",
      con1: "Filter nahoty na obrázkoch.",
      con2: "Hlas vyžaduje predplatné. Bezplatný plán má limit 50 správ denne.",
    },
    crushOn: {
      what: "Web na čet s postavami pre dospelých s prepínačom Unfiltered a prístupom k modelom tretích strán plateným v kreditoch.",
      pricingNote:
        "Bezplatný plán ponúka neobmedzené čety s čakaním na bezplatné modely a 100 mesačných kreditov na modely Pro. Modely Ultra neobsahuje. Platené úrovne zahŕňajú od 2 000 do 125 000 kreditov mesačne. Ročná platba je lacnejšia. Neobmedzený čet s modelmi Pro sa predáva samostatne ako Chat Package.",
      models:
        "Ponuka modelov a dĺžka kontextu závisia od plánu. Verejný zoznam CrushOn.AI uvádza medzi možnosťami Ultra modely Claude Opus 4.7 a 5.5, Claude Sonnet 4.6 a GLM 5.1 až 5.3.",
      filterShort: "Prepínač Unfiltered po overení veku",
      filter:
        "Prepínač Unfiltered sprístupní text pre dospelých po overení veku: selfie alebo doklad cez Didit či AgeGo, prípadne platba 0,99 USD. Pravidlá ďalej zakazujú sexuálne explicitné obrázky, realistické obrázky skutočných osôb, neplnoleté postavy a postavy zobrazené ako staršie, než sú v pôvodnom diele.",
      privacyShort: "Čety sa môžu používať na tréning modelov",
      privacy:
        "Podľa zásad sa obsah četov môže používať na tréning modelov bez prepojenia s konkrétnymi používateľmi. Web pre bezpečný obsah tvrdí opak. Súbory cookie sa používajú na opätovné zacielenie reklám.",
      apiShort: "",
      api: "Bez verejného vývojárskeho API.",
      forWho:
        "Pre dospelých, ktorí chcú odvážnejší čet s postavami v hotovej aplikácii.",
      pro1: "Hranie rolí pre dospelých v prepracovanej aplikácii, začiatok zdarma.",
      pro2: "Podľa CrushOn sa pri overení veku služba k tvojej fotke ani dokladu nedostane.",
      con1: "Šesť kreditových úrovní do 199,99 USD mesačne. Výdavky sa ťažšie odhadujú.",
      con2: "Bezplatná história sa vymaže po siedmich dňoch nečinnosti. Čety môžu slúžiť na tréning modelov.",
    },
    ollama: {
      what: "Nástroj s licenciou MIT spúšťa otvorené modely na tvojom počítači. Má lokálne API a oficiálnu aplikáciu na čet pre macOS a Windows. Ponúka aj platené cloudové modely.",
      pricingNote:
        "Modely na vlastnom zariadení môžeš spúšťať zdarma a bez limitu. Platené plány sa týkajú len cloudových modelov.",
      models:
        "Ľubovoľný otvorený model v knižnici vrátane Dolphin 3 alebo komunitných variantov ako Qwen 3.8 abliterated. Ollama tieto komunitné modely nepreveruje.",
      filterShort: "Závisí od zvoleného modelu",
      filter:
        "Lokálne spracovanie používa model, ktorý načítaš. Komunitné varianty upravené metódou abliteration majú znížiť počet odmietnutí. Cloudová služba má vlastné podmienky.",
      privacyShort: "Plne lokálne. Zadania zostávajú v zariadení.",
      privacy:
        "Ollama uvádza, že pri lokálnom spustení nemá prístup k zadaniam ani odpovediam. Cloudové funkcie môžeš vypnúť. Podľa zásad sa cloudové zadania a odpovede spracúvajú dočasne a nepoužívajú sa na tréning. Zhromažďuje sa obmedzený rozsah metadát.",
      apiShort: "",
      api: "Server kompatibilný s OpenAI na localhost:11434. Hostované modely majú aj cloudové API.",
      forWho:
        "Pre vývojárov a technicky zdatných používateľov s výkonným počítačom, často v spojení s četovacím rozhraním.",
      pro1: "Pri lokálnom spustení úplné súkromie a nulová cena za správu.",
      pro2: "Veľká knižnica a lokálne API kompatibilné s OpenAI.",
      con1: "Kvalitu obmedzuje hardvér. Model so 70 miliardami parametrov má 43 GB aj bez kontextu.",
      con2: "Oficiálna aplikácia na čet je pre macOS a Windows. Na Linuxe použi CLI, API alebo iné rozhranie.",
    },
    lmStudio: {
      what: "Počítačová aplikácia s prehľadným rozhraním na sťahovanie a spúšťanie lokálnych modelov GGUF a MLX. Zahŕňa lokálny server API.",
      pricingNote:
        "Lokálne modely sú bezplatné na osobné aj pracovné využitie. Bionic+ a Pro pridávajú cloudové spracovanie, vyhľadávanie na webe a vyššie limity zariadení. Bezplatný plán zahŕňa offline prepis reči a LM Link až pre päť zariadení.",
      models:
        "Spúšťa lokálne modely GGUF alebo MLX z Hugging Face vrátane Dolphin a komunitných variantov s menším počtom odmietnutí. Cloudový katalóg LM Studio zahŕňa Kimi K3.1 Pro, DeepSeek V4 Pro a GLM-5.3.",
      filterShort: "Závisí od zvoleného modelu",
      filter:
        "Na lokálne modely aplikácia nepridáva vlastný filter. O odmietnutí rozhoduje zvolený model.",
      privacyShort: "Lokálne spracovanie prebieha v tvojom zariadení",
      privacy:
        "Lokálne modely bežia v tvojom zariadení. Pri hostovaných službách poskytovateľ deklaruje nulové uchovávanie údajov.",
      apiShort: "",
      api: "Server kompatibilný s OpenAI na localhost:1234.",
      forWho:
        "Pre ľudí, ktorí chcú lokálne modely bez príkazového riadka na Macu s Apple Silicon, vo Windowse alebo na Linuxe.",
      pro1: "Jednoduchá cesta k lokálnym modelom bez cenzúry.",
      pro2: "Bezplatné aj na komerčné použitie.",
      con1: "Aplikácia má uzavretý kód a nepodporuje Macy s procesormi Intel.",
      con2: "Kvalitu obmedzuje hardvér rovnako ako pri iných lokálnych riešeniach.",
    },
  },
  hub: {
    meta: {
      title: "Najlepšie platformy AI bez cenzúry 2026 | Porovnanie",
      category: "Porovnanie",
      description:
        "Porovnanie {{count}} platforiem AI bez cenzúry. Venice, NanoGPT, Janitor AI, FreedomGPT, Kindroid, lokálne modely a ďalšie. Ceny, filtre, súkromie, API a zdroje.",
      imageAlt: "Porovnanie platforiem AI bez cenzúry vedľa seba",
      keywords:
        "najlepšia AI bez cenzúry, platformy AI bez cenzúry, čet s AI bez filtrov, alternatíva k Venice AI, recenzia Venice.ai, NanoGPT, alternatíva k Janitor AI, alternatíva k Character.AI, FreedomGPT, Gab AI, uncensored.ai, Kindroid, Nomi, CrushOn AI, SillyTavern, Ollama bez cenzúry, LM Studio bez cenzúry, abliterated modely, NSFW AI čet, {{appName}}",
    },
    hero: {
      category: "Porovnanie",
      readTime: "Čítanie na 14 minút",
      title: "Najlepšie platformy AI bez cenzúry v roku 2026",
      subtitle:
        "Počet porovnávaných platforiem: {{count}}, plus naša. Ceny z ich cenníkov, pravidlá filtrov, čo sa deje s četmi a pre koho je každá platforma. Pri každom údaji nájdeš zdroj.",
    },
    intro: {
      lead: "Každá platforma AI bez cenzúry sa označuje za najsúkromnejšiu, najslobodnejšiu a najmenej filtrovanú. Polovica stále zakazuje obsah pre dospelých. Niektoré trénujú na tvojich četoch. Jedna ti predáva token. Z reklamy nezistíš, ktorá čo robí.",
      p2: "Prešli sme oficiálne cenníky, zásady a dokumentáciu. Posledné overenie: {{date}}. Pri každej platforme nájdeš vlastný dátum a zdroje.",
      disclosure:
        "Naša služba {{appName}} patrí medzi porovnávané platformy. Od viacerých ďalších nakupujeme služby. Venice, uncensored.ai, NanoGPT, FreedomGPT, Gab AI a OpenRouter poskytujú cez API niektoré naše modely. Ukazujeme ktoré, s aktuálnymi číslami. Uvádzame údaje a zdroje bez bodov či hviezdičiek. Posúdenie je na tebe.",
    },
    picks: {
      title: "Rýchly výber AI bez cenzúry podľa úlohy",
      intro:
        "Každá platforma vyniká v niečom inom. Rozhodni sa podľa toho, čo potrebuješ.",
      oneApp: {
        title: "Všetko v jednom čete: {{appName}}",
        body: "Počet modelov: {{modelCount}}, z toho {{uncensored}} bez cenzúry, popri Claude, GPT a Gemini. Obrázky, video, hudba aj hlas čerpajú z jedného zostatku. Model si meníš pri každej správe.",
      },
      ownWorldview: {
        title: "Odlišný pohľad na svet: model od uncensored.ai",
        body: "Väčšina modelov bez cenzúry vychádza z bežných modelov s odstráneným odmietaním. uncensored.ai ponúka jeden model s vlastnými názormi. Na {{appName}} ho nájdeš pod názvom {{ownModel}} vedľa ostatných modelov.",
      },
      privacy: {
        title: "História četu v prehliadači: Venice alebo NanoGPT",
        body: "Obe služby predvolene uchovávajú históriu v tvojom zariadení. Bezplatný webový model NanoGPT funguje bez účtu. Na {{appName}} zostáva história v prehliadači v režime inkognito.",
      },
      roleplay: {
        title:
          "Hranie rolí s komunitnými postavami: Janitor AI alebo SillyTavern",
        body: "Janitor AI ponúka rozsiahlu bezplatnú zbierku botov. SillyTavern si nastavíš sám a máš nad ním plnú kontrolu.",
      },
      companions: {
        title: "Jeden dlhodobý spoločník AI: Kindroid alebo Nomi",
        body: "Pamäť, selfie aj hlasové hovory. Kindroid nemá trvalý bezplatný plán. Nomi ho má a na obrázkoch filtruje nahotu.",
      },
      developers: {
        title: "API pre modely bez cenzúry: NanoGPT, Venice alebo OpenRouter",
        body: "NanoGPT a Venice ponúkajú veľa modelov bez cenzúry s nízkou cenou za token. OpenRouter má najširší katalóg a len málo modelov bez cenzúry.",
      },
      local: {
        title: "Úplné súkromie a nulová cena za správu: Ollama alebo LM Studio",
        body: "Spusti modely upravené metódou abliteration na vlastnom zariadení. Údaje z neho neodchádzajú. Kvalitu určuje hardvér.",
      },
      filtered: {
        title: "Čet s obsahovým filtrom: Character.AI",
        body: "Filtrovaný čet s postavami a overením veku. Účty osôb mladších ako 18 rokov majú len režim čítania.",
      },
    },
    table: {
      title:
        "Všetky porovnávané platformy ({{count}}) a {{appName}} vedľa seba",
      intro:
        "Na mobile posuň tabuľku do strany. Posledné overenie: {{date}}. Každá platforma má vlastný dátum overenia. Naše údaje vychádzajú z aktuálnej konfigurácie.",
      footnote:
        "Uvádzame americké cenníkové ceny. Pri Kindroid, Nomi a janitor+ vychádzame z amerického App Store. Dane, regionálne ceny a akcie sa líšia. Obmedzené môže znamenať osobné API, vlastný externý kľúč alebo doplnok.",
    },
    kinds: {
      title: "Štyri spôsoby filtrovania modelov a aplikácií",
      intro:
        "Pred porovnaním platforiem si over, čo označenie znamená. Model má väčší vplyv ako aplikácia.",
      abliterated:
        "Abliterated označuje bežný alebo otvorený model, ktorého váhy boli upravené tak, aby sa oslabilo odmietanie. Podľa výskumu súvisí odmietanie s jedným smerom vnútri modelu. Po jeho odstránení model častejšie odpovedá a zachováva si pôvodné znalosti aj pohľad na svet.",
      finetuned:
        "Modely doladené bez odmietania, napríklad Dolphin a Venice Uncensored, sa dodatočne trénujú na údajoch bez odmietavých odpovedí. Cieľ je rovnaký, postup odlišný.",
      ownWorldview:
        "Vlastný pohľad na svet má napríklad {{ownModel}} trénovaný na knihách a dokumentoch vylúčených z hlavného prúdu internetu. Okrem menšieho počtu odmietnutí ponúka aj názory, ktoré od bežných modelov nedostaneš.",
      filtered:
        "Filtrované sú bežné modely a aplikácie ako Character.AI. Majú vlastnú bezpečnostnú vrstvu. Na väčšine platforiem bez cenzúry si bežné modely zachovávajú filtre poskytovateľa.",
      tradeoff:
        "Podľa práce o metóde abliteration kvalita klesla pri každom teste a dodatočné trénovanie ju obnovilo len sčasti. Modely bez cenzúry bývajú menšie než špičkové modely. Hodia sa na témy, ktoré filter blokuje. Najťažšie uvažovanie zver výkonnejšiemu modelu.",
      sourceName: "Abliteration",
    },
    platforms: {
      title: "Podrobnosti o každej platforme",
      intro:
        "Ponuka, ceny a filtre každej platformy. Posledné overenie: {{date}}. Dátum a zdroje nájdeš pri každej karte.",
      price: "Cena: {{plans}}. {{note}}",
      models: "Modely: {{text}}",
      filter: "Filter a súhlas: {{text}}",
      privacy: "Súkromie: {{text}}",
      api: "API: {{short}}. {{text}}",
      media: "Médiá: {{text}}",
      open: "Otvorený zdrojový kód: {{text}}",
      forWho: "Pre koho: {{text}}",
      strengths: "Silné stránky",
      limits: "Obmedzenia",
      sources: "Zdroje overené {{date}}",
    },
    upstream:
      "Počet modelov, ktoré {{appName}} sprístupňuje cez API služby {{name}}: {{models}} (bez cenzúry: {{uncensored}}). Patria sem {{examples}}. Modely sú rovnaké, čet a účtovanie sú naše.",
    us: {
      title: "Čo ponúka {{appName}}",
      intro:
        "V čete spájame rôzne typy modelov na jednom mieste a voľbu filtrov nechávame na tebe. Modelové laboratórium nemáme.",
      models:
        "Počet četovacích modelov: {{modelCount}}. Počet laboratórií: {{labCount}}. Bežné: {{mainstream}}, otvorené: {{open}}, bez cenzúry: {{uncensored}}. Model si vyberáš pri každej správe, takže v jednom čete môžeš striedať Claude a model upravený metódou abliteration.",
      upstream:
        "Naše modely bez cenzúry pochádzajú od poskytovateľov na tejto stránke. Počty modelov podľa poskytovateľa: Venice {{veniceModels}}, NanoGPT {{nanoGptModels}}, uncensored.ai {{uncensoredAiModels}}, FreedomGPT {{freedomGptModels}}, Gab AI {{gabAiModels}}. Modely sprístupňujeme na jednom mieste a sami ich netrénujeme.",
      consent:
        "Modely bez cenzúry sprístupní jednorazové potvrdenie veku aspoň 18 rokov. Nepridávame vlastnú vrstvu odmietania. Čo budú čítať, si vyberajú ľudia sami.",
      privacy:
        "Čety inkognito zostávajú v prehliadači bez uloženia na serveroch a fungujú bez účtu. Súkromné čety sa synchronizujú s účtom. Každá správa stále prejde cez nás k poskytovateľovi, ktorý na ňu odpovie.",
      pricing:
        "Mesačne zdarma {{guestCredits}} kr. bez účtu alebo {{freeCredits}} kr. s účtom. Cena predplatného mesačne: {{planList}}. Balíky dopĺňajú kredity pri aktívnom predplatnom a ich platnosť nekončí. Platba kartou, cez PayPal alebo v kryptomene.",
      api: "API kompatibilné s OpenAI a Anthropic na čet, obrázky, video a reč sprístupní ktorékoľvek predplatné (od {{apiSubPrice}}) alebo nákup kreditov.",
      media:
        "Spoločný zostatok pre všetky modely podľa typu: obrázky {{imageModels}}, video {{videoModels}}, hudba {{musicModels}} a hlas {{voiceModels}}.",
      open: "Celá platforma má otvorený zdrojový kód. Ak chceš fungovať bez sprostredkovateľa, môžeš si ju spustiť sám.",
      weakTitle: "Kedy sa viac oplatí iná služba",
      weak1:
        "Cena za token. K nákladom poskytovateľov pridávame {{markup}} %. Ak chceš používať modely jedného poskytovateľa, priame používanie Venice alebo NanoGPT je lacnejšie.",
      weak2:
        "Knižnica postáv. Janitor AI a Character.AI majú milióny komunitných botov. U nás je ponuka menšia, ale postavy si môžeš importovať z odkazov Character.AI a Talkie.",
      weak3:
        "Funkcie spoločníka. Selfie ani živé videohovory ako v Kindroid alebo Nomi neponúkame. Aplikácia slúži ako pracovný čet.",
      weak4:
        "Úplné súkromie. Lokálny model na vlastnom počítači poskytne viac súkromia ako ktorákoľvek hostovaná služba vrátane našej.",
      modelsLink:
        "Pozrieť celý katalóg modelov ({{modelCount}}) s aktuálnymi cenami",
      pricingLink: "Predplatné a bezplatné kredity",
      guideLink: "Príručka ku všetkým modelom bez cenzúry a ich využitiu",
    },
    versus: {
      title: "Priame porovnania",
      intro:
        "Platformy, s ktorými nás ľudia porovnávajú najčastejšie ({{versusCount}}). Každá má vlastnú stránku s výhodami, nevýhodami a odporúčaním podľa potreby.",
    },
    method: {
      title: "Ako sme porovnávali",
      intro: "Ako sme overovali údaje. Posledná kontrola zdrojov: {{date}}.",
      sources:
        "Použili sme len oficiálne stránky. Cenník, podmienky, zásady ochrany osobných údajov, centrum pomoci, dokumentáciu API alebo zoznam modelov. Recenzné weby sme nepoužili.",
      prices:
        "Ceny uvádzame v USD podľa cenníka platného v deň overenia. Kde je cena viditeľná až po prihlásení, vychádzame z oficiálneho záznamu v obchode s aplikáciami a uvádzame to.",
      noScores:
        "Bez bodov, hodnotení a univerzálneho víťaza. Rôzne úlohy potrebujú rôzne platformy.",
      us: "Naše údaje o modeloch, cenách a bezplatných kreditoch sa načítavajú priamo z konfigurácie, podľa ktorej účtujeme, takže sa zhodujú so skutočnými cenami.",
      bias: "S viacerými uvedenými platformami súťažíme a zároveň sme ich zákazníkmi. Uvádzame, kedy k nim smerujeme požiadavky a v ktorých prípadoch sa oplatí vybrať inú službu.",
      changes:
        "Plány a podmienky sa menia. Každá karta odkazuje na zdroje, ktoré si môžeš pozrieť pred nákupom. Údaje, ktoré zdroje neuvádzajú, neodhadujeme.",
      corrections:
        "Našiel si zastaranú cenu alebo nesprávne tvrdenie? Napíš nám s odkazom na zdroj a opravíme ho.",
      correctionsLink: "Kontaktovať nás",
    },
    faq: {
      title: "Časté otázky",
      best: {
        q: "Ktorá AI bez cenzúry je najlepšia?",
        a: "Záleží na úlohe. Viac modelov a médiá v jednom čete ponúka {{appName}}. Čet s dôrazom na súkromie ponúkajú Venice a NanoGPT. Na komunitné hranie rolí sa hodí Janitor AI alebo SillyTavern. Spoločníka ponúka Kindroid alebo Nomi. Na úplné súkromie použi lokálny model cez Ollama alebo LM Studio.",
      },
      free: {
        q: "Dá sa AI bez cenzúry používať zdarma?",
        a: "Áno, s limitmi. Venice ponúka 10 textových zadaní denne, uncensored.ai 3 odpovede, Janitor AI neobmedzený čet s vlastným modelom, CrushOn 100 kreditov mesačne a {{appName}} {{guestCredits}} kr. mesačne bez účtu. Lokálne modely v Ollama alebo LM Studio sa za správu neúčtujú.",
      },
      private: {
        q: "Ktorá AI bez cenzúry najlepšie chráni súkromie?",
        a: "Pri lokálnom spracovaní obsah četu zostáva v zariadení. Venice a NanoGPT predvolene uchovávajú históriu v tvojom zariadení. Bezplatný webový model NanoGPT funguje bez účtu. Na {{appName}} zostáva história v prehliadači v režime inkognito. Hostované služby stále posielajú zadania modelu, ktorý odpovedá.",
      },
      difference: {
        q: "Aký je rozdiel medzi modelmi abliterated a modelmi bez cenzúry?",
        a: "Modely typu abliterated vychádzajú z bežných alebo otvorených modelov, ktorým z váh odstránili smer spájaný s odmietaním. Znalosti aj pohľad na svet zostávajú, odmietanie sa odstraňuje. Modely ako Dolphin sa na tento účel dodatočne trénujú. Model {{ownModel}} trénoval na knihách a dokumentoch vylúčených z hlavného prúdu internetu a má vlastné názory.",
      },
      veniceVs: {
        q: "Je Venice AI naozaj bez cenzúry?",
        a: "Modely v kategórii bez cenzúry áno. Filter obsahu pre dospelých je však predvolene zapnutý a môže ho vypnúť až predplatiteľ Pro. Bežné modely Claude, GPT a Gemini si zachovávajú filtre poskytovateľov.",
      },
      characterAi: {
        q: "Existuje Character.AI bez filtra?",
        a: "Character.AI uvádza, že pornografický obsah nebude podporovať. Hranie rolí pre dospelých ponúkajú napríklad Janitor AI s botmi Limitless, CrushOn s prepínačom Unfiltered, Kindroid, SillyTavern s modelom bez cenzúry alebo {{appName}} s necenzurovanými modelmi na hranie rolí.",
      },
      gabAi: {
        q: "Je Gab AI bez cenzúry?",
        a: "Pri politike, kultúre a viere áno. Práve na to slúži jeho vlastný model Arya. Podmienky však zakazujú sexuálne explicitný obsah. {{appName}} ponúka Arya aj ďalšie modely bez cenzúry, ktoré umožňujú fikciu pre dospelých.",
      },
      uncensoredAi: {
        q: "Čím sa uncensored.ai líši od ostatnej AI bez cenzúry?",
        a: "Väčšina modelov bez cenzúry vychádza z bežných modelov s odstráneným odmietaním. Model od uncensored.ai trénoval na knihách a dokumentoch vylúčených z hlavného prúdu internetu, preto sa jeho politické názory od hlavného prúdu líšia. Na {{appName}} beží pod názvom {{ownModel}}.",
      },
      openRouter: {
        q: "Má OpenRouter modely bez cenzúry?",
        a: "Niekoľko, napríklad Venice Uncensored a modely na hranie rolí Hermes 4 a Magnum. Zo 474 modelov má 142 označenie moderované. Oveľa väčší výber modelov bez cenzúry v jednom API ponúkajú NanoGPT, Venice a {{appName}}.",
      },
      local: {
        q: "Môžem spustiť AI bez cenzúry na svojom počítači?",
        a: "Áno. Použi Ollama alebo LM Studio a model Dolphin alebo variant upravený metódou abliteration. Model s 8 miliardami parametrov má 5 GB na stiahnutie a pobeží na bežnom notebooku. Model so 70 miliardami parametrov potrebuje viac ako 40 GB pamäte. Kvalitu obmedzuje hardvér.",
      },
      legal: {
        q: "Je používanie AI bez cenzúry legálne?",
        a: "Vo väčšine krajín je používanie takého modelu legálne. Tvorba a zverejňovanie obsahu podliehajú zákonom krajiny, v ktorej žiješ. Všetky uvedené platformy zakazujú obsah týkajúci sa neplnoletých a väčšina aj zobrazenia skutočných osôb bez ich súhlasu.",
      },
    },
    cta: {
      title: "Vyskúšaj vlastné zadania",
      subtitle:
        "Mesačne {{guestCredits}} kr. zdarma bez účtu. Polož otázku, ktorú inde odmietli, a porovnaj výsledok.",
      try: "Začať čet v režime inkognito",
      models: "Prehliadať všetky modely",
    },
  },
  versus: {
    venice: {
      meta: {
        title: "{{appName}} a Venice AI | Porovnanie 2026",
        description:
          "{{appName}} a Venice.ai vedľa seba. Ceny, modely bez cenzúry, filter obsahu pre dospelých, súkromie a API. Od Venice nakupujeme služby a uvádzame, v čom ktorá platforma vyniká.",
        keywords:
          "alternatíva k Venice AI, porovnanie Venice.ai, recenzia Venice AI, ceny Venice AI, Venice Pro, Venice bez cenzúry, filter obsahu Venice AI, Venice AI API, VVV DIEM, AI čet bez cenzúry, {{appName}} a Venice",
      },
      hero: {
        title: "{{appName}} a Venice AI",
        subtitle:
          "Dve platformy AI bez cenzúry. Jedna nakupuje od druhej. Ceny, filtre, súkromie a API vedľa seba.",
        readTime: "Čítanie na 7 minút",
      },
      intro: {
        lead: "Venice je najznámejšia značka v oblasti súkromnej AI bez cenzúry. Mnohé naše modely bez cenzúry bežia cez jej API. Preto sa sústredíme na jednu otázku: oplatí sa používať Venice priamo alebo cez {{appName}}?",
        p2: "Údaje o Venice pochádzajú z jej cenníka, zásad ochrany osobných údajov a dokumentácie. Overené {{date}}. Naše údaje sa načítavajú priamo z konfigurácie.",
      },
      relation:
        "Sme zákazníkom Venice. Počet našich modelov cez jej API: {{veniceModels}}, z toho bez cenzúry {{veniceUncensored}}. Príklady: {{veniceExamples}}. Modely sú rovnaké, aplikácia je iná.",
      verdict:
        "Vyber si Venice, ak chceš celý jej katalóg, lokálnu históriu a najnižšiu cenu za token pri jej vlastných modeloch a vyhovuje ti platiť za Pro na vypnutie filtra pre dospelých. Vyber si {{appName}}, ak chceš modely Venice bez cenzúry, Claude, GPT, model od uncensored.ai a upravené modely GLM a DeepSeek od iných poskytovateľov v jednom čete. Stačí jednorazové potvrdenie veku aspoň 18 rokov.",
      themPros: {
        a: "V katalógu API je 303 modelov vrátane videa, hudby a hlasu.",
        b: "História predvolene zostáva v zariadení. Silná ochrana súkromia.",
        c: "Najlacnejší spôsob volania vlastných modelov Venice. Bez prirážky sprostredkovateľa a so stakingom DIEM pre denné kredity API.",
      },
      themCons: {
        a: "Bezplatný plán má 10 textových zadaní denne len so základnými modelmi.",
        b: "Filter obsahu pre dospelých je predvolene zapnutý. Na vypnutie potrebuješ Pro.",
        c: "Len ponuka Venice. Bez modelu od uncensored.ai alebo poskytovateľov, ktorých Venice nehostuje.",
      },
      usPros: {
        a: "Modely bez cenzúry od Venice, NanoGPT, uncensored.ai, FreedomGPT a Gab AI v jednom výbere.",
        b: "Modely bez cenzúry sprístupní jednorazové potvrdenie veku aspoň 18 rokov aj v bezplatnom pláne. Za vypnutie filtra neplatíš.",
        c: "Mesačne {{guestCredits}} kr. zdarma bez účtu a celá platforma má otvorený zdrojový kód.",
      },
      usCons: {
        a: "Vlastné modely Venice u nás stoja viac. K cene Venice pridávame prirážku {{markup}} %.",
        b: "Celkovo menší katalóg ako Venice.",
        c: "Súkromné čety ukladáme kvôli synchronizácii. V režime inkognito história zostáva v prehliadači. Venice predvolene uchováva históriu lokálne a pri platených plánoch ponúka šifrované zálohy.",
      },
      chooseThem: {
        a: "Chceš najväčší katalóg bez cenzúry od jedného poskytovateľa.",
        b: "Držíš VVV alebo ho chceš vložiť do stakingu kvôli kreditom API.",
        c: "Voláš modely Venice cez API a záleží ti na každom cente.",
      },
      chooseUs: {
        a: "Chceš v jednom čete aj modely, ktoré Venice nemá, napríklad {{ownModel}}.",
        b: "Chceš modely bez cenzúry bez platenia za vypnutie filtra.",
        c: "Chceš otvorený zdrojový kód, vlastný server a jeden zostatok pre čet, obrázky, video aj hudbu.",
      },
      both: "Pokojne používaj obe služby. Venice pre jej katalóg. {{appName}} vtedy, keď chceš v jednom čete porovnať odpoveď Venice s modelom bez cenzúry od iného poskytovateľa.",
      switch: {
        title: "Prechod z Venice",
        body: "Modely nemusíš prenášať. Model Venice Uncensored aj ďalšie modely Venice sú v našom výbere pod rovnakými názvami. Otvor čet inkognito, vyber model Venice a nadviaž na predošlú konverzáciu. Podľa potreby vlož do prvej správy starší kontext.",
      },
      faq: {
        q1: {
          q: "Je {{appName}} to isté ako Venice?",
          a: "Ide o samostatnú platformu s otvoreným zdrojovým kódom. Niektoré naše modely bežia cez API Venice, ďalšie pochádzajú od NanoGPT, uncensored.ai, FreedomGPT, Gab AI, OpenRouter a veľkých laboratórií.",
        },
        q2: {
          q: "Je Venice AI zadarmo?",
          a: "Bezplatný účet má 10 textových a 15 obrazových zadaní denne na základných modeloch. Pro zahŕňa neobmedzené textové zadania, až 1 000 obrázkov denne na modeloch Pro a pre dospelých možnosť vypnúť filter Mature Filter.",
        },
        q3: {
          q: "Je Venice lacnejšia ako {{appName}}?",
          a: "Pri vlastných modeloch Venice áno. K nákladom poskytovateľa pridávame {{markup}} %. Ak chceš kombinovať modely viacerých poskytovateľov, jedna aplikácia ti ušetrí samostatné predplatné.",
        },
        q4: {
          q: "Ktorá platforma ponúka viac súkromia, Venice alebo {{appName}}?",
          a: "Venice predvolene uchováva históriu v zariadení a pri platených plánoch poskytuje šifrované zálohy. Na {{appName}} história inkognito zostáva v prehliadači a súkromné čety sa ukladajú kvôli synchronizácii. V oboch prípadoch správy stále dostáva model, ktorý na ne odpovedá.",
        },
      },
      cta: { title: "Vyskúšaj modely Venice vedľa ostatných" },
    },
    characterAi: {
      meta: {
        title: "Alternatíva k Character.AI bez filtra | {{appName}} a C.AI",
        description:
          "{{appName}} a Character.AI vedľa seba. Filtre, overenie veku, modely, súkromie a cena. Kedy sa hodí Character.AI a kedy alternatíva bez cenzúry.",
        keywords:
          "alternatíva k Character.AI, Character.AI bez filtra, filter Character.AI, cena c.ai+, Character.AI NSFW, overenie veku Character.AI, postavy AI bez cenzúry, hranie rolí s AI bez filtra, {{appName}} a Character.AI",
      },
      hero: {
        title: "{{appName}} a Character.AI | Alternatíva bez filtra",
        subtitle:
          "Najväčšia platforma na čet s postavami vedľa otvorenej platformy bez cenzúry. Čo umožňujú, koľko stoja a kam sa dostanú tvoje čety.",
        readTime: "Čítanie na 7 minút",
      },
      intro: {
        lead: "Character.AI má najväčšiu knižnicu postáv na internete a pevný filter. Podľa vlastného centra pomoci nebude podporovať pornografický obsah. Ak ti to prekáža, vyber si inú platformu.",
        p2: "Údaje o Character.AI pochádzajú zo stránok predplatného, centra pomoci a ochrany osobných údajov. Overené {{date}}. Naše údaje sa načítavajú priamo z konfigurácie.",
      },
      relation:
        "S Character.AI nemáme obchodný vzťah. Postavu môžeš preniesť aj tak. Vlož odkaz z Character.AI a {{appName}} ju importuje ako zručnosť.",
      verdict:
        "Character.AI si vyber na zábavu bez obsahu pre dospelých s miliónmi pripravených postáv, zdarma a bez limitu, alebo na čítanie pre ľudí mladších ako 18 rokov. {{appName}} si vyber, ak filter prerušuje príbeh. Po jednorazovom potvrdení veku aspoň 18 rokov môžeš hrať roly bez cenzúry, zvoliť model pri každej správe a tvoje čety neslúžia na tréning modelov.",
      themPros: {
        a: "Milióny komunitných postáv pripravených na čet.",
        b: "Neobmedzené správy zdarma a lacné platené plány.",
        c: "Hlasové hovory s postavami.",
      },
      themCons: {
        a: "Bez obsahu pre dospelých. Temné scény sa zjemňujú.",
        b: "Obsah četov sa môže používať na tréning. Centrum pomoci opisuje možnosť odmietnuť používanie nového obsahu v EHP a Spojenom kráľovstve.",
        c: "Len vlastné modely. Bez voľby modelu a vlastného kľúča.",
      },
      usPros: {
        a: "Počet modelov bez cenzúry: {{uncensored}}. Viaceré sú určené na hranie rolí a umožnia pokračovať v scéne podľa príbehu.",
        b: "Vyber si model pri každej správe. Model bez cenzúry na scénu, špičkový model na plánovanie.",
        c: "Čety inkognito zostávajú v prehliadači. Na tvojich četoch modely netrénujeme.",
      },
      usCons: {
        a: "Oveľa menej pripravených postáv. Vlastné môžeš importovať alebo vytvoriť.",
        b: "Spotreba sa účtuje v kreditoch, takže správy zdarma majú limit.",
        c: "Bez hlasových hovorov s postavami.",
      },
      chooseThem: {
        a: "Chceš čet bez obsahu pre dospelých a veľkú knižnicu postáv.",
        b: "Čitateľovi mladšiemu ako 18 rokov stačí režim čítania.",
        c: "Chceš neobmedzené správy zdarma bez sledovania spotreby.",
      },
      chooseUs: {
        a: "Filter ti opakovane prerušuje hranie rolí.",
        b: "Chceš si zvoliť model sám.",
        c: "Chceš, aby sa tvoje čety nepoužívali na tréning ani zacielenie reklám.",
      },
      both: "Mnohí si nechajú Character.AI na jednoduché rozhovory a príbehy, ktoré potrebujú model pre dospelých, presunú sem. Postavu môžu importovať.",
      switch: {
        title: "Prenos postavy z Character.AI",
        body: "Skopíruj odkaz postavy z Character.AI a vlož ho do importu zručností v {{appName}}. Prenesie sa meno, pozdrav a definícia v rozsahu, v ktorom ich autor zverejnil. Potom vyber model na hranie rolí bez cenzúry a pokračuj v príbehu.",
      },
      faq: {
        q1: {
          q: "Povoľuje Character.AI obsah NSFW?",
          a: "Nie. Podľa centra pomoci je pornografia proti podmienkam a nebude podporovaná ani v budúcnosti.",
        },
        q2: {
          q: "Vyžaduje Character.AI overenie veku?",
          a: "Áno. Používatelia prechádzajú overením veku cez službu Persona. Overení používatelia mladší ako 18 rokov môžu iba čítať.",
        },
        q3: {
          q: "Je {{appName}} alternatíva k Character.AI bez filtra?",
          a: "Áno, pre dospelých. Modely bez cenzúry sprístupní jednorazové potvrdenie veku aspoň 18 rokov. Viaceré sú určené na hranie rolí. Bežné modely si zachovávajú filtre poskytovateľov. Na scény pre dospelých si vyber model bez cenzúry.",
        },
        q4: {
          q: "Môžem importovať postavy z Character.AI?",
          a: "Áno. Vlož odkaz postavy do importu zručností. Prenesie sa len to, čo autor zverejnil na Character.AI.",
        },
      },
      cta: { title: "Pokračuj v príbehu bez filtra" },
    },
    janitorAi: {
      meta: {
        title: "Alternatíva k Janitor AI | {{appName}} a Janitor AI (2026)",
        description:
          "{{appName}} a Janitor AI vedľa seba. JLLM a ponuka modelov ({{modelCount}}), limity kontextu, pravidlá NSFW, proxy, súkromie a cena. Výhody a nevýhody pri hraní rolí.",
        keywords:
          "alternatíva k Janitor AI, porovnanie Janitor AI, JanitorAI, cena janitor+, JLLM, Janitor AI proxy, Janitor AI OpenRouter, kontext Janitor AI, hranie rolí s AI pre dospelých, AI na hranie rolí bez cenzúry, {{appName}} a Janitor AI",
      },
      hero: {
        title: "{{appName}} a Janitor AI",
        subtitle:
          "Najväčšia bezplatná komunita na hranie rolí a čet bez cenzúry s viacerými modelmi. Modely, pamäť, pravidlá a cena.",
        readTime: "Čítanie na 6 minút",
      },
      intro: {
        lead: "Janitor AI sa pri hraní rolí presadil miliónmi komunitných botov a bezplatným modelom. Pri dlhých príbehoch však narazíš na kontext približne 9 000 tokenov. Lepšie modely vyžadujú nastaviť proxy a vlastný kľúč.",
        p2: "Údaje o Janitor AI pochádzajú zo stránky janitor+, centra pomoci a zásad. Overené {{date}}. Naše údaje sa načítavajú priamo z konfigurácie.",
      },
      relation:
        "S Janitor AI nemáme obchodný vzťah. Janitor je knižnica postáv s jedným bezplatným modelom. My ponúkame knižnicu modelov aj postavy.",
      verdict:
        "Janitor AI si vyber pre knižnicu botov a neobmedzený čet zdarma cez JLLM. {{appName}} si vyber, ak chceš výkonné modely bez cenzúry s dlhým kontextom pripravené na použitie bez nastavenia proxy, aj obrázky, video a hlas v tom istom čete.",
      themPros: {
        a: "Milióny komunitných botov s označením Limitless pre obsah NSFW.",
        b: "Bezplatný neobmedzený čet s vlastným modelom služby.",
        c: "Pripoj vlastný model cez proxy, napríklad OpenRouter.",
      },
      themCons: {
        a: "Bezplatný kontext má približne 9 000 tokenov. Pri dlhých príbehoch sa skoršie udalosti strácajú.",
        b: "janitor+ zahŕňa mesačný limit pre prémiové modely. Na vlastný model potrebuješ kľúč API a proxy.",
        c: "Len text. Mobilná aplikácia začína v režime Safe Mode.",
      },
      usPros: {
        a: "Počet modelov na výber: {{modelCount}}, z toho {{uncensored}} bez cenzúry. Proxy ani kľúč nastavovať nemusíš.",
        b: "Modely bez cenzúry s dlhým kontextom na príbehy, ktoré trvajú týždne.",
        c: "Obrázky, video, hudba a hlas v jednom čete s jedným zostatkom.",
      },
      usCons: {
        a: "Oveľa menšia knižnica postáv ako na Janitor AI.",
        b: "Bezplatný plán má limit {{guestCredits}} kr. mesačne. Potom potrebuješ predplatné.",
        c: "Menšia komunita bez verejného prehľadu botov.",
      },
      chooseThem: {
        a: "Chceš si prehliadať tisíce pripravených botov.",
        b: "Chceš neobmedzený čet zdarma a bezplatný model ti stačí.",
        c: "Už používaš vlastný kľúč cez proxy a vyhovuje ti to.",
      },
      chooseUs: {
        a: "Pri dlhých príbehoch potrebuješ výkonný model bez cenzúry a dlhý kontext.",
        b: "Chceš meniť model uprostred scény bez úprav nastavení proxy.",
        c: "Chceš obrázky alebo hlas pre postavy v tom istom čete.",
      },
      both: "Bežný postup je objavovať postavy na Janitor AI a dlhé príbehy rozvíjať na {{appName}}.",
      switch: {
        title: "Prechod z Janitor AI",
        body: "Vytvor v {{appName}} zručnosť s osobnosťou, scenárom a pozdravom pre svoju postavu. Potom vyber model na hranie rolí bez cenzúry. Čet inkognito funguje bez účtu, takže scénu môžeš vyskúšať ešte pred registráciou.",
      },
      faq: {
        q1: {
          q: "Je Janitor AI zadarmo?",
          a: "Áno. Čet s vlastným modelom služby je neobmedzený a má kontext približne 9 000 tokenov. janitor+ pridáva pamäť, rýchlosť a modely.",
        },
        q2: {
          q: "Povoľuje Janitor AI obsah NSFW?",
          a: "Áno. Na webe je dostupný dospelým pri botoch označených Limitless. Mobilná aplikácia sa spustí v režime Safe Mode, kým v nastaveniach webu nepovolíš NSFW.",
        },
        q3: {
          q: "Potrebujem v {{appName}} proxy?",
          a: "Nie. Všetky modely sú vo výbere. Za správy platíš kreditmi a nepotrebuješ kľúč API.",
        },
        q4: {
          q: "Ktorá platforma má lepšiu pamäť pri dlhom hraní rolí?",
          a: "Janitor AI uvádza približne 9 000 tokenov zdarma a päťnásobok s janitor+. Na {{appName}} závisí veľkosť kontextu od modelu.",
        },
      },
      cta: { title: "Rozohraj ďalší príbeh s modelom s dlhým kontextom" },
    },
    nanoGpt: {
      meta: {
        title: "{{appName}} a NanoGPT | Porovnanie 2026",
        description:
          "{{appName}} a NanoGPT vedľa seba. Platba podľa spotreby a predplatné, modely bez cenzúry a varianty abliterated, súkromie, API a médiá. Od NanoGPT nakupujeme služby a uvádzame, kde má navrch.",
        keywords:
          "alternatíva k NanoGPT, porovnanie NanoGPT, recenzia nano-gpt, ceny NanoGPT, NanoGPT PRO, NanoGPT bez cenzúry, API pre modely abliterated, platby za AI podľa spotreby, API pre AI bez cenzúry, {{appName}} a NanoGPT",
      },
      hero: {
        title: "{{appName}} a NanoGPT",
        subtitle:
          "Dve platformy s viacerými modelmi, modelmi bez cenzúry a API. Jedna účtuje podľa spotreby, druhá ponúka predplatné. Jedna predáva služby druhej.",
        readTime: "Čítanie na 6 minút",
      },
      intro: {
        lead: "NanoGPT účtuje podľa spotreby a má bezplatný model, ktorý vyskúšaš bez registrácie. Viaceré naše modely bez cenzúry bežia cez jeho API. Tu sú prípady, keď sa oplatí ktorá platforma.",
        p2: "Údaje o NanoGPT pochádzajú z jeho cenníka, zásad ochrany osobných údajov, podmienok a verejného zoznamu modelov. Overené {{date}}. Naše údaje sa načítavajú priamo z konfigurácie.",
      },
      relation:
        "Sme zákazníkom NanoGPT. Počet našich modelov cez jeho API: {{nanoGptModels}}, z toho bez cenzúry {{nanoGptUncensored}}. Patria sem {{nanoGptExamples}}.",
      verdict:
        "NanoGPT si vyber pre široký katalóg a platbu podľa spotreby vrátane volania API bez účtu cez x402. {{appName}} si vyber pre vyskúšaný výber modelov od viacerých poskytovateľov, bezplatné mesačné kredity, zručnosti, pamäť a otvorený čet na vlastný server.",
      themPros: {
        a: "596 položiek textových modelov. V 38 ID sa nachádza uncensored, abliterated alebo Dolphin.",
        b: "Bez predplatného. Prvý vklad po prihlásení od 0,10 USD v kryptomene.",
        c: "Cenníkové ceny pri automatickom smerovaní, nižšie ako u sprostredkovateľov.",
      },
      themCons: {
        a: "Bezplatná ponuka na webe zahŕňa jeden model.",
        b: "Súkromie závisí od trasy poskytovateľa. Niektoré trasy umožňujú tréning.",
        c: "V takom veľkom katalógu si modely musíš vyskúšať sám.",
      },
      usPros: {
        a: "Vyberáme modely a každý označujeme ako bežný, otvorený alebo bez cenzúry. Na stránke modelu je aktuálna cena.",
        b: "Mesačne {{guestCredits}} kr. zdarma na vyskúšanie modelov bez cenzúry na vlastných zadaniach.",
        c: "Zručnosti, pamäť, priečinky a čet na dlhú prácu. Otvorený kód, ktorý môžeš spustiť na vlastnom serveri.",
      },
      usCons: {
        a: "Menej modelov ako NanoGPT.",
        b: "K nákladom poskytovateľov pridávame {{markup}} %, takže ten istý model u nás stojí viac.",
        c: "Najprv predplatné. Balíky kreditov dopĺňajú aktívny plán.",
      },
      chooseThem: {
        a: "Chceš platiť podľa spotreby bez predplatného alebo volať API cez x402 bez účtu.",
        b: "Potrebuješ menej známy model dostupný len vo veľkom katalógu.",
        c: "Staviaš na API a chceš cenníkové ceny.",
      },
      chooseUs: {
        a: "Chceš vyskúšaný výber modelov.",
        b: "Chceš bezplatné mesačné kredity a prepracovaný čet so zručnosťami a pamäťou.",
        c: "Chceš mať model od uncensored.ai a modely Venice vedľa modelov NanoGPT v jednom čete.",
      },
      both: "Vývojári často používajú API NanoGPT na dávkové úlohy a {{appName}} na každodenné rozhovory.",
      switch: {
        title: "Prechod z NanoGPT",
        body: "Modely od NanoGPT v našom výbere, napríklad {{nanoGptExamples}}, sú rovnaké. Otvor čet inkognito, vyber jeden a v tej istej konverzácii porovnaj jeho odpoveď s modelom iného poskytovateľa.",
      },
      faq: {
        q1: {
          q: "Je NanoGPT lacnejšie ako {{appName}}?",
          a: "Za token zvyčajne áno. NanoGPT účtuje cenníkové ceny, my pridávame {{markup}} %. Ponúkame {{guestCredits}} kr. zdarma mesačne a jednu aplikáciu pre všetkých poskytovateľov.",
        },
        q2: {
          q: "Potrebujem na NanoGPT účet?",
          a: "Bezplatný webový model funguje bez účtu. Na dobitie zostatku na webe sa musíš prihlásiť. API podporuje platbu bez účtu cez x402.",
        },
        q3: {
          q: "Majú obe služby API?",
          a: "Áno. API NanoGPT je kompatibilné s OpenAI a Anthropic a podporuje platby bez účtu. Naše API je tiež kompatibilné s OpenAI a Anthropic a sprístupní ho predplatné alebo nákup kreditov.",
        },
        q4: {
          q: "Ktorá služba má viac modelov bez cenzúry?",
          a: "NanoGPT uvádza celkovo viac. {{appName}} ponúka {{uncensored}} vybraných a vyskúšaných modelov bez cenzúry od NanoGPT, Venice, uncensored.ai, FreedomGPT a Gab AI.",
        },
      },
      cta: { title: "Porovnaj modely NanoGPT s ostatnými" },
    },
    freedomGpt: {
      meta: {
        title: "Alternatíva k FreedomGPT | {{appName}} a FreedomGPT (2026)",
        description:
          "{{appName}} a FreedomGPT vedľa seba. Liberty, modely bez cenzúry, pravidlá obsahu, súkromie, kredity, API a otvorený kód. Údaje pre obe služby so zdrojmi.",
        keywords:
          "alternatíva k FreedomGPT, porovnanie FreedomGPT, recenzia FreedomGPT, ceny FreedomGPT, FreedomGPT Pro, model Liberty, FreedomGPT bez cenzúry, AI bez cenzúry, alternatíva k ChatGPT bez cenzúry, {{appName}} a FreedomGPT",
      },
      hero: {
        title: "{{appName}} a FreedomGPT",
        subtitle:
          "Dve aplikácie s modelmi bez cenzúry vedľa ChatGPT, Claude a Gemini. Pravidlá, súkromie, kredity a otvorený kód.",
        readTime: "Čítanie na 6 minút",
      },
      intro: {
        lead: "FreedomGPT a {{appName}} spája rovnaká myšlienka: bežné aj necenzurované modely v jednom zozname. Rozdiely sú v pravidlách, kreditoch a v spracúvaní tvojich správ.",
        p2: "Údaje o FreedomGPT pochádzajú z domovskej stránky, cenníka, zásad ochrany osobných údajov, dokumentácie a GitHubu. Overené {{date}}. Naše údaje sa načítavajú priamo z konfigurácie.",
      },
      relation:
        "Sme zákazníkom FreedomGPT. {{freedomGptExamples}} beží na {{appName}} cez vlastné API FreedomGPT.",
      verdict:
        "FreedomGPT si vyber, ak chceš jeden plán za 20 USD na čet, obrázky a video, s bezplatným začiatkom bez účtu. {{appName}} si vyber, ak chceš viac modelov bez cenzúry od viacerých poskytovateľov, pravidlá bez nadstavby o neetickom používaní, zverejnené ceny jednotlivých modelov a aktívne vyvíjanú platformu s otvoreným kódom.",
      themPros: {
        a: "Zdarma bez karty a účtu.",
        b: "Liberty a ďalšie modely bez cenzúry vedľa ChatGPT, Claude a Gemini.",
        c: "Tvorba obrázkov a videa v jednom pláne.",
      },
      themCons: {
        a: "Podľa pravidiel musia modely rešpektovať zákony USA a nesmú sa používať na neetické účely.",
        b: "Správy, hlas a obrázky dostávajú poskytovatelia tretích strán. Lehota uchovávania sa neuvádza.",
        c: "Počítačová aplikácia s otvoreným kódom nemala aktualizáciu od júna 2024.",
      },
      usPros: {
        a: "Počet modelov bez cenzúry: {{uncensored}} od piatich poskytovateľov vrátane Liberty.",
        b: "Každý model má verejnú stránku s aktuálnou cenou za správu.",
        c: "Celá platforma má otvorený kód a aktívne sa vyvíja. Môžeš ju spustiť na vlastnom serveri.",
      },
      usCons: {
        a: "Spotreba sa účtuje v kreditoch podľa modelu. Jeden paušál na všetko neponúkame.",
        b: "Pamäť a synchronizácia četov vyžadujú účet.",
        c: "Prirážka {{markup}} % sa vzťahuje aj na modely od FreedomGPT.",
      },
      chooseThem: {
        a: "Chceš jeden jednoduchý plán za 20 USD na čet, obrázky a video.",
        b: "Stačí ti Liberty a bežné modely.",
        c: "Chceš počítačovú aplikáciu bez internetu a verzia z roku 2024 ti vyhovuje.",
      },
      chooseUs: {
        a: "Chceš viac možností bez cenzúry vrátane modelov Venice, NanoGPT, uncensored.ai a Gab.",
        b: "Chceš vidieť cenu za správu ešte pred jej odoslaním.",
        c: "Chceš aktuálny otvorený softvér na vlastný server.",
      },
      both: "Model Liberty od FreedomGPT je v našom výbere. Môžeš ho porovnať s inými modelmi bez cenzúry bez druhého predplatného.",
      switch: {
        title: "Prechod z FreedomGPT",
        body: "Vo výbere zvoľ Liberty a pokračuj. Rovnaké zadanie potom vyskúšaj na modeli {{ownModel}} alebo modeli upravenom metódou abliteration. Vyber si podľa odpovede.",
      },
      faq: {
        q1: {
          q: "Je FreedomGPT naozaj bez cenzúry?",
          a: "Jeho modely bez cenzúry vynechávajú väčšinu odmietnutí. FreedomGPT však uvádza, že všetky hostované modely musia rešpektovať zákony USA a nesmú sa používať na neetické účely. Označenie bez cenzúry nezaručuje odpoveď na každé zadanie.",
        },
        q2: {
          q: "Koľko stojí FreedomGPT?",
          a: "Začať môžeš zdarma. Pro zahŕňa 2 200 kreditov mesačne. Prémiová odpoveď stojí asi 10, obrázok asi 25 a päťsekundové video asi 400 kreditov.",
        },
        q3: {
          q: "Má FreedomGPT otvorený zdrojový kód?",
          a: "Staršia počítačová aplikácia pre lokálne modely je na GitHube pod licenciou GPL-3.0. Posledná aktualizácia bola v júni 2024. Cloudová aplikácia má uzavretý kód. Služba {{appName}} má otvorený zdrojový kód ako celok.",
        },
        q4: {
          q: "Môžem používať model Liberty od FreedomGPT na {{appName}}?",
          a: "Áno. Beží cez API FreedomGPT a nájdeš ho vo výbere vedľa ďalších modelov bez cenzúry.",
        },
      },
      cta: { title: "Porovnaj Liberty s ostatnými modelmi bez cenzúry" },
    },
    gabAi: {
      meta: {
        title: "Alternatíva k Gab AI | {{appName}} a Gab AI (2026)",
        description:
          "{{appName}} a Gab AI vedľa seba. Arya, 214 modelov, zákaz sexuálneho obsahu, súkromie, kredity a API. Od Gab nakupujeme služby a uvádzame, kde ktorá platforma vyniká.",
        keywords:
          "alternatíva k Gab AI, porovnanie Gab AI, recenzia Gab AI, ceny Gab AI, Gab AI Plus, Arya AI, Gab Arya, Gab AI bez cenzúry, Gab AI NSFW, Gab AI API, konzervatívny četbot AI, pravicová AI, AI čet bez cenzúry, {{appName}} a Gab AI",
      },
      hero: {
        title: "{{appName}} a Gab AI",
        subtitle:
          "Dve aplikácie s viacerými modelmi, ktoré necenzurujú politiku. Jedna zakazuje obsah pre dospelých. Ceny, pravidlá, súkromie a API vedľa seba.",
        readTime: "Čítanie na 7 minút",
      },
      intro: {
        lead: "Gab AI vytvoril model Arya pre ľudí, ktorých unavuje poučovanie četbotov o politike, kultúre a viere. Arya používame aj my cez vlastné API Gab. Rozhoduje, aké pravidlá chceš okolo modelu.",
        p2: "Údaje o Gab AI pochádzajú z jeho domovskej stránky, cenníka, stránky API, podmienok a zásad ochrany osobných údajov. Overené {{date}}. Naše údaje sa načítavajú priamo z konfigurácie.",
      },
      relation:
        "Sme zákazníkom Gab AI. {{gabAiExamples}} beží na {{appName}} cez vlastné API Gab. Model je rovnaký, aplikácia a pravidlá sa líšia.",
      verdict:
        "Gab AI si vyber, ak chceš Arya spolu s režimom agenta, počítačovými aplikáciami a katalógom 214 modelov pod jednou konzervatívnou značkou a nepotrebuješ obsah pre dospelých. {{appName}} si vyber, ak chceš v jednom čete Arya, {{ownModel}} aj upravené modely GLM a DeepSeek, možnosť písať fikciu pre dospelých s modelmi, ktoré to umožňujú, a čety, ktoré môžu zostať v prehliadači.",
      themPros: {
        a: "214 modelov na jeden účet vrátane Arya, vlastného modelu pre politiku, kultúru a vieru.",
        b: "Režim agenta Work, hlas v reálnom čase, obrázky, video a hudba. Aplikácie pre Mac, Windows, iPhone aj Android.",
        c: "Zakúpené balíky kreditov sa prenášajú a neprepadnú.",
      },
      themCons: {
        a: "Podmienky zakazujú obscénny, sexuálne explicitný aj pornografický obsah. Obsah môžu kontrolovať automatizované systémy.",
        b: "Zadania, odpovede a históriu uchovávajú na vlastných serveroch. Medzi účelmi uvádzajú aj zlepšovanie modelov.",
        c: "Po overení e-mailu dostaneš 250 kreditov zdarma jednorazovo. API vyžaduje Plus alebo Plus Premium.",
      },
      usPros: {
        a: "Počet modelov bez cenzúry: {{uncensored}} od viacerých poskytovateľov vrátane Arya v jednom výbere.",
        b: "Bez plošného zákazu obsahu pre dospelých. Všetky modely bez cenzúry sprístupní jednorazové potvrdenie veku aspoň 18 rokov.",
        c: "Mesačne {{guestCredits}} kr. zdarma bez účtu. Čety v režime inkognito zostávajú v prehliadači.",
      },
      usCons: {
        a: "Bez režimu agenta či počítačovej aplikácie, akú má Gab Work.",
        b: "Menší katalóg. Máme {{modelCount}} četovacích modelov, Gab má 214.",
        c: "Prirážka {{markup}} % sa vzťahuje aj na model Arya.",
      },
      chooseThem: {
        a: "Chceš Arya spolu s režimom agenta a počítačovými aplikáciami Gab.",
        b: "Zdieľaš hodnoty Gab a chceš podporiť firmu AI mimo veľkých technologických spoločností.",
        c: "Nepíšeš fikciu pre dospelých a chceš čo najväčší katalóg na jednej faktúre.",
      },
      chooseUs: {
        a: "Chceš v jednom čete porovnať Arya, {{ownModel}} a modely upravené metódou abliteration.",
        b: "Píšeš fikciu pre dospelých alebo temné príbehy a potrebuješ modely, ktoré to umožňujú.",
        c: "Chceš začať bez účtu a uchovať čety inkognito v prehliadači.",
      },
      both: "Arya je v našom výbere. Polož rovnakú otázku modelom Arya, {{ownModel}} a jednému modelu typu abliterated. Odpovede posúdiš sám a nepotrebuješ druhé predplatné.",
      switch: {
        title: "Prechod z Gab AI",
        body: "Vo výbere zvoľ Arya a pokračuj v čete. Rovnaké zadanie potom pošli modelu {{ownModel}}. Oba odpovedajú aj na politické otázky. Vznikli však inak, čo vidno aj na odpovediach. Ak potrebuješ starší kontext, vlož ho do prvej správy.",
      },
      faq: {
        q1: {
          q: "Je Gab AI naozaj bez cenzúry?",
          a: "Pri politike, kultúre a viere áno. Práve na to slúži Arya. Sexuálny obsah sa obmedzuje. Podmienky Gab zakazujú obscénny, sexuálne explicitný aj pornografický obsah a uvádzajú, že súlad môžu preverovať automatizované systémy.",
        },
        q2: {
          q: "Koľko stojí Gab AI?",
          a: "Bezplatný účet dostane po overení e-mailu 250 kreditov za registráciu. Plus stojí 20 USD mesačne alebo 200 USD ročne a zahŕňa 2 000 kreditov mesačne. Plus Premium stojí 999 USD ročne a zahŕňa 12 000 kreditov. Balíky začínajú na 10 USD za 700 kreditov.",
        },
        q3: {
          q: "Môžem používať Arya na {{appName}}?",
          a: "Áno. Arya beží cez API Gab a nájdeš ho vo výbere vedľa {{ownModel}} a ďalších modelov bez cenzúry. Pre odpovede modelu Arya stále platia obsahové pravidlá Gab.",
        },
        q4: {
          q: "Uchováva Gab AI moje čety?",
          a: "Áno. Podľa zásad uchováva zadania, odpovede a históriu konverzácií. Medzi účelmi uvádza aj zlepšovanie modelov a upozorňuje, že odoslanie požiadaviek poskytovateľom modelov ich neanonymizuje. Na {{appName}} zostávajú čety inkognito v prehliadači.",
        },
      },
      cta: { title: "Porovnaj Arya s ostatnými modelmi bez cenzúry" },
    },
    uncensoredAi: {
      meta: {
        title: "Alternatíva k uncensored.ai | {{appName}} a uncensored.ai",
        description:
          "{{appName}} a uncensored.ai vedľa seba. Rovnaký model UncensoredLM, iná aplikácia. Limity zdarma, cena Pro, API, súkromie a médiá so zdrojmi.",
        keywords:
          "alternatíva k uncensored.ai, porovnanie uncensored.ai, recenzia uncensored.ai, ceny uncensored.ai, uncensored.ai Pro, UncensoredLM, UncensoredAI v1.2, uncensored.ai API, uncensored.ai zdarma, AI čet bez cenzúry, {{appName}} a uncensored.ai",
      },
      hero: {
        title: "{{appName}} a uncensored.ai",
        subtitle:
          "Jeden model s vlastným pohľadom na svet, dva spôsoby použitia. Limity zdarma, cena, API a ďalšie funkcie.",
        readTime: "Čítanie na 6 minút",
      },
      intro: {
        lead: "uncensored.ai vytvoril výrazne odlišný model bez cenzúry: {{ownModel}}. Trénoval na knihách a dokumentoch vylúčených z hlavného prúdu internetu a jeho politické názory sa od hlavného prúdu líšia. Sprístupňujeme ho cez vlastné API uncensored.ai. Kedy sa ho teda oplatí používať priamo cez uncensored.ai a kedy tu?",
        p2: "Údaje o uncensored.ai pochádzajú z cenníka, stránky API, stránky o službe a zásad ochrany osobných údajov. Overené {{date}}. Naše údaje sa načítavajú priamo z konfigurácie.",
      },
      relation:
        "Sme zákazníkom uncensored.ai. {{uncensoredAiExamples}} beží na {{appName}} cez API uncensored.ai. Model je rovnaký, čet a účtovanie sú naše.",
      verdict:
        "uncensored.ai si vyber, ak chceš neobmedzené čety s jediným modelom za doživotne fixnú cenu Pro, fórum a hlasový režim. {{appName}} si vyber, ak chceš model {{ownModel}} vedľa ďalších modelov ({{modelCount}}), aby si v jednom čete porovnal jeho názor s Claude, GPT alebo modelom upraveným metódou abliteration. Obrázky, video a hudba sa účtujú z rovnakého zostatku.",
      themPros: {
        a: "Pevná cena Pro je 9,99 USD mesačne alebo 99,99 USD ročne. Cena sa nemení, kým zostávaš predplatiteľom.",
        b: "Za túto cenu máš neobmedzené čety s modelom, hlasový režim, priečinky a archívy.",
        c: "Podľa zásad ochrany osobných údajov sa tvoje údaje nepoužívajú na tréning ani zlepšovanie modelov AI.",
      },
      themCons: {
        a: "Zdarma 3 odpovede denne.",
        b: "Jeden model s kontextom 32 768 tokenov. Bez tvorby obrázkov, videa a hudby.",
        c: "Volanie API stojí 0,05 USD a kupuje sa oddelene od Pro.",
      },
      usPros: {
        a: "Model {{ownModel}} a ďalšie modely ({{modelCount}}) v jednom čete. Porovnaj jeho odpoveď s bežnými aj upravenými modelmi bez zmeny konverzácie.",
        b: "Mesačne zdarma {{guestCredits}} kr. bez účtu alebo {{freeCredits}} kr. s účtom.",
        c: "Obrázky, video, hudba a hlas z jedného zostatku. Celá platforma má otvorený kód.",
      },
      usCons: {
        a: "Kredity sa účtujú podľa spotreby. Intenzívne denné používanie tohto jediného modelu tu stojí viac ako paušál.",
        b: "Model nemá samostatné fórum ani archívy.",
        c: "Prirážka {{markup}} % sa vzťahuje aj na model od uncensored.ai.",
      },
      chooseThem: {
        a: "Stačí ti tento jediný model a používaš ho denne.",
        b: "Chceš doživotne fixnú cenu.",
        c: "Chceš fórum a hlasový režim tejto služby.",
      },
      chooseUs: {
        a: "Chceš porovnať jeho názor s bežnými a upravenými modelmi.",
        b: "Používaš ho len občas a nechceš ďalšie predplatné.",
        c: "Potrebuješ aj obrázky, video alebo hudbu.",
      },
      both: "Ľudia často používajú obe služby. uncensored.ai na každodenný neobmedzený čet s týmto modelom a {{appName}} na porovnanie jeho odpovede s iným modelom v rovnakej konverzácii.",
      switch: {
        title: "Prechod z uncensored.ai",
        body: "Vo výbere zvoľ {{ownModel}} a otvor čet inkognito. Netreba nič migrovať. Ak potrebuješ starší kontext, vlož ho do prvej správy. Potom polož rovnakú otázku modelu upravenému metódou abliteration a porovnaj odpovede.",
      },
      faq: {
        q1: {
          q: "Je {{appName}} to isté ako uncensored.ai?",
          a: "Ide o samostatnú platformu s otvoreným zdrojovým kódom. Model uncensored.ai sprístupňujeme cez jeho API vedľa modelov Venice, NanoGPT, FreedomGPT, Gab AI, OpenRouter a veľkých laboratórií.",
        },
        q2: {
          q: "Je uncensored.ai zadarmo?",
          a: "Bezplatný plán má tri odpovede denne. Pro stojí 9,99 USD mesačne alebo 99,99 USD ročne a limit odstraňuje. Na {{appName}} máš mesačne {{guestCredits}} kr. zdarma aj bez účtu.",
        },
        q3: {
          q: "Čím sa líši model od uncensored.ai?",
          a: "Väčšina modelov bez cenzúry vychádza z bežných modelov s odstráneným odmietaním. Tréning aj pohľad na svet zostali rovnaké. Model {{ownModel}} trénoval na knihách a dokumentoch vylúčených z hlavného prúdu internetu, preto sa jeho politické názory od hlavného prúdu líšia.",
        },
        q4: {
          q: "Má uncensored.ai API?",
          a: "Áno. API kompatibilné s OpenAI stojí 0,05 USD za spracovanie požiadavky a kredity sa kupujú samostatne. Na {{appName}} môžeš rovnaký model volať cez API kompatibilné s OpenAI aj Anthropic po aktivácii predplatného alebo kúpe kreditov.",
        },
      },
      cta: { title: "Porovnaj jeho názory s ostatnými modelmi" },
    },
    openRouter: {
      meta: {
        title: "Alternatíva k OpenRouter na čet | {{appName}} a OpenRouter",
        description:
          "{{appName}} a OpenRouter vedľa seba. Hotová aplikácia na čet a smerovač API pre vývojárov. Modely bez cenzúry, poplatky, súkromie a API so zdrojmi.",
        keywords:
          "alternatíva k OpenRouter, porovnanie OpenRouter, recenzia OpenRouter, ceny OpenRouter, poplatky OpenRouter, OpenRouter bez cenzúry, modely bez cenzúry na OpenRouter, čet OpenRouter, bezplatné modely OpenRouter, API kompatibilné s OpenAI, API pre modely bez cenzúry, {{appName}} a OpenRouter",
      },
      hero: {
        title: "{{appName}} a OpenRouter",
        subtitle:
          "Smerovač pre vývojárov so 474 modelmi a čet s modelmi bez cenzúry. Poplatky, filtre, súkromie a API.",
        readTime: "Čítanie na 6 minút",
      },
      intro: {
        lead: "OpenRouter je bežná voľba, ak chceš jeden kľúč API a stovky modelov. Používame ho aj my. Je to však smerovač pre vývojárov a modelov bez cenzúry má málo. Ak hľadáš alternatívu na četovanie, tu nájdeš priame porovnanie.",
        p2: "Údaje o OpenRouter pochádzajú z cenníka, príručky o zbere údajov, podmienok a zoznamu modelov. Overené {{date}}. Naše údaje sa načítavajú priamo z konfigurácie.",
      },
      relation:
        "Sme zákazníkom OpenRouter. Počet našich modelov cez jeho API: {{openRouterModels}}. Patria sem napríklad {{openRouterExamples}}. Pridávame čet, médiá a poskytovateľov modelov bez cenzúry, ktorých OpenRouter nemá.",
      verdict:
        "OpenRouter si vyber, ak chceš jeden kľúč pre 474 modelov za ceny poskytovateľov so záložným smerovaním a máš vlastné rozhranie. {{appName}} si vyber, ak chceš hotový čet s modelmi bez cenzúry ({{uncensored}}), vrátane {{ownModel}} a upravených modelov, ktoré OpenRouter nemá. Získaš aj obrázky, video, hudbu a API, keď ho potrebuješ.",
      themPros: {
        a: "474 modelov vo verejnom zozname za ceny poskytovateľov.",
        b: "Bez predplatného. Na bezplatných modeloch 50 požiadaviek denne, po nákupe kreditov za 10 USD až 1 000.",
        c: "Zaznamenávanie zadaní aj používanie tvojich údajov vyžaduje tvoj súhlas.",
      },
      themCons: {
        a: "Pri štandardnom pláne poplatok 5,5 % za nákup kreditov.",
        b: "Málo modelov bez cenzúry. Venice Uncensored a modely na hranie rolí ako Hermes 4 a Magnum. Zo 474 modelov má 142 označenie moderované.",
        c: "Nezameriava sa na bežné četovanie. Rozhranie si dodáš sám.",
      },
      usPros: {
        a: "Hotový čet v prehliadači bez kľúča a nastavovania. Mesačne {{guestCredits}} kr. zdarma bez účtu.",
        b: "Počet modelov bez cenzúry: {{uncensored}} od Venice, NanoGPT, uncensored.ai, FreedomGPT a Gab AI. Stačí jednorazovo potvrdiť vek aspoň 18 rokov.",
        c: "API kompatibilné s OpenAI a Anthropic na čet, obrázky, video a reč s jedným zostatkom.",
      },
      usCons: {
        a: "Menší katalóg. Máme {{modelCount}} četovacích modelov, OpenRouter má 474.",
        b: "Naša prirážka {{markup}} % k nákladom poskytovateľov je vyššia než poplatok OpenRouter vo výške 5,5 %.",
        c: "Ide predovšetkým o čet. Ponúka menej možností smerovania než špecializovaný smerovač.",
      },
      chooseThem: {
        a: "Vytváraš aplikáciu a chceš jeden kľúč pre stovky modelov.",
        b: "Potrebuješ záložných poskytovateľov a možnosti smerovania.",
        c: "Záleží ti na každom cente za token a máš vlastné rozhranie.",
      },
      chooseUs: {
        a: "Chceš četovať hneď. Stačí otvoriť stránku a napísať správu.",
        b: "Chceš modely bez cenzúry, ktoré OpenRouter neuvádza, napríklad {{ownModel}}.",
        c: "Chceš čet, obrázky, video a hudbu s jedným zostatkom a možnosťou používať API.",
      },
      both: "Pokojne používaj obe služby. OpenRouter vo svojom kóde a {{appName}} na priame porovnanie modelov bez cenzúry, kým si jeden vyberieš do aplikácie.",
      switch: {
        title: "Prechod z OpenRouter",
        body: "V aplikácii otvor čet inkognito a vyber model. Kľúč nepotrebuješ. V kóde stačí zmeniť základnú URL a kľúč, keďže naše API je kompatibilné s OpenAI. ID modelu nájdeš na jeho stránke.",
      },
      faq: {
        q1: {
          q: "Existuje alternatíva k OpenRouter s modelmi bez cenzúry?",
          a: "Áno. {{appName}} ponúka modely bez cenzúry ({{uncensored}}) od Venice, NanoGPT, uncensored.ai, FreedomGPT a Gab AI v jednom čete a cez jedno API. Modely bez cenzúry cez API ponúkajú aj NanoGPT a Venice. OpenRouter uvádza len niekoľko.",
        },
        q2: {
          q: "Povoľuje OpenRouter obsah NSFW?",
          a: "Podmienky vyžadujú vek aspoň 18 rokov a služba kontroluje vstupy na prítomnosť známeho materiálu zobrazujúceho sexuálne zneužívanie detí. Každý poskytovateľ má vlastné pravidlá. Zo 474 modelov má 142 označenie moderované, takže prijatie požiadavky závisí od modelu a poskytovateľa.",
        },
        q3: {
          q: "Koľko stojí OpenRouter?",
          a: "Účtujú sa cenníkové ceny poskytovateľov za token a pri štandardnom pláne poplatok 5,5 % za nákup kreditov. Predplatné nie je potrebné. Bezplatné modely umožňujú 50 požiadaviek denne, po kúpe kreditov za 10 USD až 1 000.",
        },
        q4: {
          q: "Môžem použiť kód pre OpenRouter s {{appName}}?",
          a: "Áno, ak používa formát OpenAI. Nastav našu základnú URL, kľúč {{appName}} a ID našich modelov. API sprístupní ktorékoľvek predplatné od {{apiSubPrice}} mesačne alebo nákup kreditov.",
        },
      },
      cta: { title: "Četuj s modelmi, ktoré OpenRouter neponúka" },
    },
  },
};
