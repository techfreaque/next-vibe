import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatíva k OpenRouter: OpenAI a Anthropic | {{appName}}",
    description:
      "Porovnaj {{appName}} s OpenRouter. Existujúce SDK OpenAI pripojíš k API pre četové ({{modelCount}}) aj multimediálne modely ({{mediaModelCount}}).",
    category: "Pre vývojárov",
    imageAlt: "{{appName}}: rôzne modely cez jedno API",
    keywords:
      "{{appName}}, alternatíva k OpenRouter, jedno API pre GPT Claude a Gemini, API kompatibilné s OpenAI, viac modelov cez OpenAI API, koncový bod kompatibilný s Anthropic API, Anthropic Messages API, Responses API, Claude Code s inými modelmi, vlastný poskytovateľ pre Codex CLI, brána API pre jazykové modely, prístup k necenzurovaným modelom cez API, obrázkové API kompatibilné s OpenAI, API na prevod textu na reč, Whisper API, API na generovanie videa a hudby",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Pre vývojárov",
    readTime: "11 min čítania",
    title: "Jeden kľúč API. Modely: {{modelCount}}. Tri formáty.",
    subtitle:
      "Použi Chat Completions, Responses alebo Anthropic Messages s jedným kľúčom {{appName}}. V SDK zmeň základnú adresu URL a kľúč, potom over ID modelu. Rovnaký kľúč funguje aj pre multimediálne modely ({{mediaModelCount}}).",
  },
  intro: {
    lead: "GPT od OpenAI, Claude od Anthropicu a Gemini od Googlu. Tri SDK, tri kľúče, tri faktúry, tri ovládacie panely. Ak tvoj obľúbený nástroj podporuje jediný formát, ostanú ti modely jedného poskytovateľa.",
    p2: "Cez {{appName}} môžeš volať {{modelCount}} četových modelov od {{providerCount}} tímov s jedným kľúčom a spoločnými kreditmi. Použi formát OpenAI, Responses alebo Anthropic. Na každom koncovom bode máš rovnaký výber modelov. Tu nájdeš nastavenie, ceny aj prípady, keď sa viac oplatí priamy prístup alebo samostatný smerovač.",
    access:
      "API vyžaduje platený účet. Sprístupní ho každý plán od {{subPrice}} mesačne. Bezplatné a bežné bonusové kredity ho neodomknú.",
    accessLink: "Získať prístup k API",
  },
  endpoints: {
    title: "Jeden kľúč pre všetky koncové body",
    intro:
      "Každý koncový bod prijíma ten istý kľúč a čerpá z rovnakých kreditov. Vo všetkých troch četových formátoch sú dostupné rovnaké modely.",
    chat: "POST /v1/chat/completions je rozhranie OpenAI Chat Completions. Podporuje streamovanie cez SSE ukončené správou data: [DONE], voľbu stream_options.include_usage aj volanie nástrojov. Tento formát používa takmer každý klient kompatibilný s OpenAI.",
    responses:
      "POST /v1/responses používa OpenAI Responses API, formát pre Codex CLI. Podporuje streamovanie a nástroje. Stav sa neukladá. Hodnota store je false a previous_response_id vráti chybu 400, takže pri každom ťahu odošli celý vstup.",
    messages:
      "POST /v1/messages používa formát Anthropic Messages API. Podporuje priebežné odpovede aj nástroje. Sem sa pripájajú Claude Code a oficiálne SDK od Anthropic.",
    countTokens:
      "POST /v1/messages/count_tokens nespotrebuje kredity. Počet tokenov odhadne lokálne bez volania modelu a požiadavku nezaráta do ochrany proti zneužitiu. Claude Code ho často používa na odhad veľkosti kontextu.",
    models:
      "GET /v1/models zobrazí všetky modely dostupné pre tvoj kľúč, ich dĺžku kontextu, podporu nástrojov aj ceny. Rovnaké telo odpovede spracujú SDK od OpenAI aj od Anthropicu.",
    media:
      "Médiá vo formáte OpenAI, spolu {{mediaModelCount}} modelov. Obrázky: POST /v1/images/generations a /v1/images/edits. Zvuk: /v1/audio/speech, /v1/audio/transcriptions a /v1/audio/translations. Video (POST /v1/videos) a hudba (POST /v1/music) bežia ako asynchrónne úlohy: spusti úlohu, zisťuj stav a stiahni výsledok. GET /v1/models uvádza typ média každého modelu.",
    auth: "Každý koncový bod podporuje dva spôsoby overenia. Klienti OpenAI a Claude Code s ANTHROPIC_AUTH_TOKEN používajú Authorization: Bearer sk-unb-... SDK od Anthropic posielajú x-api-key: sk-unb-... Kľúč začína na sk-unb-, zobrazí sa iba raz a na serveri sa uloží len jeho odtlačok. Vytvoríš ho v Nastavenia > Kľúče API. Na účte môžeš mať najviac 20 aktívnych kľúčov.",
    baseUrlLabel: "Základná adresa URL",
    baseUrlNote:
      "Pre SDK od OpenAI a kompatibilné nástroje. Jazykové nastavenie je povinná súčasť cesty. Určuje jazyk chybových hlásení a môžeš použiť ktorúkoľvek podporovanú možnosť.",
    anthropicBaseUrlLabel: "Základná adresa URL pre Anthropic",
    anthropicBaseUrlNote:
      "Pre SDK od Anthropicu a Claude Code použi rovnakú adresu bez /v1. Klienti pridajú /v1/messages sami.",
  },
  switching: {
    title: "Prechod z OpenRouter na {{appName}}",
    intro:
      "Hľadáš alternatívu k OpenRouter? Obe služby prijímajú požiadavky vo formáte OpenAI Chat Completions. Existujúce SDK od OpenAI si môžeš ponechať a upraviť nastavenia.",
    key: "V účte {{appName}} si aktivuj prístup k API a v nastaveniach vytvor nový kľúč.",
    baseUrl:
      "V klientovi OpenAI nastav vyššie uvedenú základnú adresu s jazykovým nastavením a koncovkou /v1.",
    model:
      "Zavolaj GET /v1/models na novom API a do poľa model vlož niektorý z vrátených identifikátorov.",
    routing:
      "Pred prechodom skontroluj voľby smerovania špecifické pre OpenRouter. Na vybranom modeli si vyskúšaj funkcie, ktoré tvoja aplikácia používa, napríklad priebežné odpovede a volanie nástrojov.",
    openrouterDocs: "Dokumentácia API OpenRouter",
  },
  samples: {
    title: "Ukážky kódu: tvoje SDK, naša adresa",
    intro:
      "Novú knižnicu nepotrebuješ. Oficiálne SDK od OpenAI aj Anthropic fungujú bez úprav. Namiesto sk-unb-YOUR_KEY vlož svoj kľúč.",
    curl: {
      title: "curl",
      body: "Najrýchlejší spôsob, ako overiť kľúč. Stačí bežná četová požiadavka, nič netreba inštalovať.",
      caption: "Chat Completions pomocou curl",
    },
    openai: {
      title: "Python SDK od OpenAI",
      body: "V klientovi nastav base_url a api_key a zavolaj chat.completions.create ako zvyčajne. Do poľa model môžeš vložiť ktorýkoľvek model z GET /v1/models vrátane Claude a Gemini.",
      caption: "Chat Completions pomocou SDK od OpenAI",
      responses:
        "Ten istý klient podporuje aj Responses API. Zavolaj client.responses.create. API tu neuchováva stav, takže pri každej ďalšej správe pošli do vstupu celý doterajší rozhovor.",
      responsesCaption: "Responses API pomocou SDK od OpenAI",
    },
    anthropic: {
      title: "Python SDK od Anthropic",
      body: "Nastav base_url bez /v1, svoj kľúč zadaj ako api_key a zavolaj messages.create. Modely s uvažovaním najprv vracajú blok uvažovania. Ukážka preto vypíše textový blok odpovede.",
      caption: "Messages API pomocou SDK od Anthropic",
      countTokens:
        "Chceš pred odoslaním odhadnúť veľkosť vstupu? count_tokens odhadne počet tokenov bez volania modelu. Kredity nespotrebuješ.",
      countTokensCaption: "Odhad počtu tokenov cez curl",
    },
    models: {
      title: "Výpis modelov",
      body: "Aktuálny zoznam nájdeš v GET /v1/models. Obsahuje presné identifikátory, ktoré môže tvoj kľúč volať, dĺžku kontextu, podporu nástrojov a cenu za token.",
      caption: "Výpis modelov pomocou curl",
    },
    media: {
      title: "Obrázky, hlas, video a hudba",
      body: "Použi rovnaký kľúč, základnú adresu a dátové formáty OpenAI. Klienti na obrázky a zvuk z OpenAI SDK fungujú bez úprav. Z GET /v1/models vyber model pre požadovaný typ média.",
      imageCaption: "Vytvorenie obrázka cez curl",
      async:
        "Video a hudba vznikajú niekoľko minút, preto sa spracúvajú ako úlohy. POST ihneď vráti ID. Stav môžeš bezplatne kontrolovať a po dokončení stiahnuť súbor. Za neúspešnú úlohu neplatíš.",
      videoCaption: "Spustenie úlohy na vytvorenie videa",
      pollCaption: "Kontrola stavu a stiahnutie súboru MP4",
    },
  },
  ids: {
    title: "Identifikátory modelov: naše aj od poskytovateľov",
    intro:
      "Ak už máš v konfigurácii názov modelu, nemusíš ho ručne meniť. API rozumie bežne používaným zápisom.",
    ours: "Naše identifikátory podľa GET /v1/models: claude-sonnet-5.5, gpt-6.1-sol, glm-5.3. Pri novom nastavení použi tieto identifikátory.",
    vendor:
      "Podporujeme aj zápisy od poskytovateľov: identifikátory Anthropic s dátumom (claude-sonnet-4-5-20250929 sa preloží na claude-sonnet-4.5), verzie s pomlčkami, prípony -latest a [1m] pre kontext aj identifikátory s bodkami, napríklad gpt-5.5.",
    prefix:
      "Pri podporovaných modeloch API rozpozná aj bežné predpony poskytovateľov, napríklad anthropic/ a openai/.",
    claudeFallback:
      "Výhradne na /v1/messages platí náhrada modelu Claude, ku ktorému tvoj účet nemá prístup. Pri identifikátoroch, ktoré napríklad Claude Code posiela na pozadí, sa vyberie najnovší dostupný model rovnakej rodiny Opus, Sonnet alebo Haiku. Claude Code tak nepotrebuje ďalšie premenné prostredia. Iný neznámy identifikátor vráti 404 model_not_found.",
  },
  tools: {
    title: "Použi Claude Code a Codex CLI s ďalšími modelmi",
    intro:
      "Oba nástroje sa pripájajú priamo. Netreba inštalovať proxy ani prevodník formátov.",
    p1: "Vo všetkých ukážkach je predvolený model {{model}}. Overili sme ho priamo v Claude Code aj Codex CLI. Spoľahlivo volá nástroje a má nízku cenu za výstupný token. Keď pripojenie funguje, môžeš vyskúšať iný identifikátor.",
    claudeCode:
      "Takto v Claude Code použiješ aj iné modely. ANTHROPIC_BASE_URL nasmeruje klienta k nám, ANTHROPIC_AUTH_TOKEN obsahuje tvoj kľúč a premenné modelu určujú, ktorý model pobeží. Z GET /v1/models vyber identifikátor GPT, Gemini, Kimi, DeepSeek alebo modelu bez cenzúry. V CLAUDE_CODE_MAX_CONTEXT_TOKENS nastav skutočnú veľkosť jeho kontextového okna, aby Claude Code skrátil kontext v správnej chvíli.",
    codex:
      "Pre Codex CLI nastav vlastného poskytovateľa a wire_api na responses. Použije rovnaký formát Responses API ako pri spojení s OpenAI. Model zmeníš prepínačom -m.",
    others:
      "Overili sme aj OpenCode, Continue, Aider a Cline. Ich nastavenia, trvalú konfiguráciu aj riešenia problémov nájdeš v príručke pre programovacie nástroje.",
    guideLink: "Nastaviť programovacie nástroje",
  },
  picks: {
    title: "Ako vybrať model pre konkrétnu úlohu",
    intro:
      "Všetky uvedené modely môžu volať nástroje. Klikni na názov, pozri si cenu a parametre a skopíruj identifikátor do kódu.",
    frontier: {
      title: "Špičkové modely na náročné programovanie a uvažovanie",
      body: "Rozsiahle úpravy, neznámy kód a úlohy s mnohými krokmi. Za token zaplatíš viac, no model menej často zíde zo správnej cesty.",
    },
    cheap: {
      title: "Lacné a rýchle modely pre slučky, dávky a prácu na pozadí",
      body: "Pre agentov s dlhými zadaniami, dávkové spracovanie, triedenie a časté volania programovacích nástrojov na pozadí. Stoja len zlomok ceny špičkových modelov.",
    },
    uncensored: {
      title: "Necenzurované modely bez automatického odmietania",
      body: "GLM 5.3 Uncensored a Qwen 3.6 Plus Uncensored vychádzajú z bežných modelov s odstráneným odmietaním odpovedí. UncensoredLM v1.2 sa učil aj z kníh a dokumentov zakázaných na hlavných internetových platformách. Všetky používajú rovnaké API aj nástroje.",
    },
    compare:
      "Váhaš medzi dvoma modelmi? Na stránke s porovnaním uvidíš ich vlastnosti vedľa seba.",
    compareLink: "{{a}} a {{b}}",
    allModels: "Všetky modely ({{modelCount}})",
  },
  billing: {
    title: "Koľko to stojí",
    intro:
      "Platíš kreditmi podľa počtu tokenov. Za jednotlivých používateľov neúčtujeme poplatok.",
    price:
      "Pri väčšine modelov platí zverejnená cena za token s našou prirážkou. Vstupné tokeny z vyrovnávacej pamäte sa účtujú podľa príslušnej sadzby modelu. Pri modeloch cez OpenRouter účtujeme cenu, ktorú si za konkrétne volanie vyúčtoval OpenRouter, a rovnakú prirážku.",
    reported:
      "Každá odpoveď uvádza presnú spotrebu v usage.credits_charged. Cenu volania nemusíš odhadovať.",
    preflight:
      "Pred spustením porovnáme tvoj zostatok s odhadom najvyššej možnej spotreby. Ak kredity nestačia, dostaneš HTTP 402 insufficient_credits. Volanie sa nespustí a neplatíš nič.",
    abort:
      "Pri priebežnej odpovedi zatvorením spojenia zastavíš generovanie. Platíš iba za vykonanú časť. Rovnako sa postupuje, ak poskytovateľ preruší prenos chybou.",
    chat: "Čet aj API používajú rovnaký spôsob účtovania. OpenRouter smeruje požiadavky k viacerým poskytovateľom toho istého modelu. Niektorí sú drahší než najlacnejší v našom cenníku. Pri týchto modeloch je teda zverejnená cena odhadom. Skutočná suma je v usage.credits_charged. Ak OpenRouter cenu nenahlási, použije sa zverejnená sadzba.",
    media:
      "Pri médiách tiež účtujeme skutočnú cenu poskytovateľa s prirážkou, pokiaľ ju poskytovateľ nahlási. Inak použijeme zverejnenú cenu modelu. Obrázky sa účtujú za kus, hlas za znak, prepis za sekundu zvuku. Video a hudba až po dokončení súboru.",
    paid: "Čet aj API čerpajú z rovnakých kreditov. Samotné API vyžaduje platený prístup. Stačí ľubovoľné predplatné, samotné bezplatné kredity ho nesprístupnia.",
    sub: "Mesačné predplatné má štyri úrovne. Najnižšia zahŕňa {{subCredits}} kred. za {{subPrice}}.",
    pack: "Balíky pre predplatiteľov: {{packCredits}} kred. za {{packPrice}}. Kredity nevypršia. Zaplatíš kartou, cez PayPal alebo kryptomenou.",
    link: "Pozrieť si plány a ceny",
  },
  versus: {
    title: "Priamo k poskytovateľovi, cez smerovač alebo cez nás?",
    intro: "Sú tri možnosti. Každá má zmysel pri inom spôsobe používania.",
    direct: {
      title: "Priamo cez OpenAI, Anthropic alebo Google",
      body: "Nové vlastné funkcie dostaneš priamo u poskytovateľa ako prvý, bez prirážky sprostredkovateľa. Platia podmienky jedinej firmy. Ak používaš iba jej modely, priamy prístup je jednoduchšia voľba.",
    },
    router: {
      title: "Agregátor ako OpenRouter",
      body: "OpenRouter ponúka viac modelov cez jedno API, výber poskytovateľa aj náhradu pri výpadku. Spracúva tiež časť požiadaviek z našej platformy.",
    },
    here: {
      title: "{{appName}}",
      body: "Jeden kľúč funguje s troma formátmi: Chat Completions, Responses a Anthropic Messages vrátane count_tokens. Claude Code aj Codex CLI sa pripájajú bez proxy. Vedľa bežných modelov nájdeš necenzurované, na ktoré stačí raz potvrdiť vek 18+. Čet aj API čerpajú z rovnakého predplatného či balíka kreditov. {{appName}} má otvorený zdrojový kód a môžeš ho prevádzkovať aj sám.",
    },
    verdict:
      "Porovnaj výber modelov aj možnosti smerovania, ktoré používaš. Ak chceš necenzurované modely cez API a zároveň čet za spoločné kredity, pozri si, ku ktorým modelom má tvoj kľúč {{appName}} prístup.",
  },
  limits: {
    title: "Obmedzenia API",
    intro:
      "S týmito hranicami treba počítať už pri návrhu produkčnej aplikácie.",
    stateless:
      "API neuchováva stav. Pri Responses API sa používa store nastavené na false a previous_response_id sa odmieta. Pri každom volaní odošli celú históriu. Platí to pre všetky koncové body.",
    maxTokens: "Výstup má limit {{maxTokens}} tokenov na požiadavku.",
    rateLimit:
      "Bez pevného limitu požiadaviek. Platíš za každé volanie zo svojich kreditov a platí veľkorysá ochrana proti zneužitiu. Chyby 429 od poskytovateľov posielame ďalej s hlavičkou Retry-After.",
    countTokens:
      "count_tokens vracia odhad podľa miestneho výpočtu. Skutočný tokenizér poskytovateľa sa môže líšiť. Odhad slúži na plánovanie kontextu, nie na výpočet faktúry.",
    tools:
      "Nástroje môžeš volať len na modeloch, ktoré ich podporujú. V opačnom prípade dostaneš chybu 400 tools_not_supported. GET /v1/models pri každom modeli uvádza supports_tools.",
    consent:
      "Prístup k necenzurovaným modelom vyžaduje jednorazové potvrdenie veku 18+ na stránke kľúčov API. Inak sa vráti 403 uncensored_consent_required a nič sa neúčtuje.",
    localeUrl:
      "Dve časté chyby v nastavení vracajú 404. Adresa /api/v1 nemá jazykový kód. Použi /api/<locale>/v1. Ak v základnej adrese pre Anthropic ponecháš /v1, klient zavolá neexistujúcu cestu /v1/v1/messages.",
  },
  privacy: {
    title: "Čo sa deje s tvojimi zadaniami",
    intro:
      "Uchovávame údaje potrebné na vyúčtovanie. Rozhovor cez API neukladáme.",
    noStore:
      "API neukladá rozhovory ani nevytvára vlákna. Zostane iba záznam pre vyúčtovanie s názvom modelu a počtom účtovaných kreditov.",
    upstream:
      "Zadanie sa odošle poskytovateľovi, ktorý prevádzkuje vybraný model. Na prijaté údaje sa vzťahujú jeho podmienky.",
    incognito:
      "Čety v režime inkognito sa v aplikácii ukladajú iba v miestnom úložisku prehliadača.",
    selfHost:
      "Chceš riadiť celú inštanciu? {{appName}} má otvorený kód pod licenciami MIT a GPL v3. Môžeš použiť vlastné kľúče a platiť priamo poskytovateľom.",
    selfHostLink: "Prevádzkovať na vlastnom serveri",
  },
  faq: {
    title: "Časté otázky",
    openrouter: {
      q: "Môže {{appName}} nahradiť OpenRouter?",
      a: "V {{appName}} funguje jeden kľúč pre Chat Completions, Responses aj Anthropic Messages. Po potvrdení veku 18+ môžeš volať necenzurované modely a čerpať zo spoločných kreditov v čete aj API. Časť požiadaviek spracúva OpenRouter.",
    },
    openrouterModels: {
      q: "Môžem si pri prechode ponechať identifikátory modelov z OpenRouter?",
      a: "Niektoré identifikátory s predponou poskytovateľa fungujú, keď je príslušný model dostupný. Dostupnosť over cez GET /v1/models a skopíruj presný identifikátor z odpovede nového API.",
    },
    claudeCode: {
      q: "Môžem v Claude Code používať aj iné modely než Claude?",
      a: "Áno. ANTHROPIC_BASE_URL nastav na základnú adresu Anthropic na {{appName}}. Kľúč ulož do ANTHROPIC_AUTH_TOKEN a vyber si identifikátor z GET /v1/models. Takto v Claude Code fungujú GPT, Gemini, GLM, Kimi, DeepSeek aj necenzurované modely.",
    },
    sdk: {
      q: "Potrebujem nové SDK?",
      a: "Použi oficiálne SDK od OpenAI alebo Anthropic. Nastav príslušnú základnú adresu, vlož kľúč API a vyber dostupný identifikátor modelu.",
    },
    free: {
      q: "Má API bezplatnú úroveň?",
      a: "Bezplatné kredity sú určené na čet. API potrebuje platený plán, už od {{subCredits}} kred. mesačne za {{subPrice}}. Predplatitelia si môžu dokúpiť {{packCredits}} kred. za {{packPrice}}. Tieto kredity nevypršia.",
    },
    pricing: {
      q: "Zaplatím cenu uvedenú v cenníku?",
      a: "Pri väčšine modelov áno. Platí zverejnená cena za token s našou prirážkou. Pri modeloch cez OpenRouter sa v čete aj cez API účtuje skutočná cena volania s rovnakou prirážkou. Ich cena v cenníku je odhad. Presnú sumu nájdeš pri každej odpovedi v usage.credits_charged.",
    },
    models: {
      q: "Ktoré modely môžem zavolať?",
      a: "Aktuálne {{modelCount}} četovacích modelov: Claude, GPT, Gemini, DeepSeek, Kimi, GLM, Qwen a modely bez cenzúry. Ďalších {{mediaModelCount}} pokrýva obrázky, video, hudbu, hlas a prepis. GET /v1/models uvádza modely dostupné pre tvoj kľúč aj ich ceny.",
    },
    data: {
      q: "Ukladá {{appName}} moje zadania?",
      a: "Pri volaní cez API rozhovor neukladáme. Zostáva len záznam pre vyúčtovanie s modelom a počtom účtovaných kreditov. Zadanie dostane poskytovateľ modelu a spracuje ho podľa vlastných podmienok.",
    },
    docsLink: "Prečítať si úplnú dokumentáciu API",
    pricingLink: "Pozrieť si plány a ceny",
  },
  partners: {
    body: "Tvoríš nástroje alebo obsah pre vývojárov? V partnerskom programe {{appName}} dostávaš opakovanú províziu z každej platby ľudí, ktorých odporučíš.",
    link: "Zapojiť sa do partnerského programu",
  },
  cta: {
    title: "Jeden kľúč pre všetky modely. Začni teraz.",
    subtitle:
      "Vytvor kľúč, zmeň v SDK základnú adresu a môžeš začať. V dokumentácii nájdeš koncové body, polia aj chybové kódy.",
    key: "Vytvoriť kľúč API",
    docs: "Prečítať si dokumentáciu API",
  },
};
