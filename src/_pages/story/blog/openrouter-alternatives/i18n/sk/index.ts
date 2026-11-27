import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatívy k OpenRouter bez cenzúry v porovnaní | {{appName}}",
    description:
      "OpenRouter neuvádza žiadne abliterované modely. Porovnaj OpenUncensored, Refuseless, NEAR AI Cloud, NanoGPT, Venice, Featherless a {{appName}} podľa modelov bez cenzúry, poplatkov, súkromia a formátov API.",
    category: "Pre vývojárov",
    imageAlt: "Alternatívy k OpenRouter bez cenzúry pre vývojárov v porovnaní",
    keywords:
      "alternatíva k OpenRouter bez cenzúry, alternatíva k OpenRouter, alternatívy k OpenRouter, necenzurované modely OpenRouter, API abliterovaných modelov, API LLM bez cenzúry, OpenUncensored, Refuseless, NEAR AI Cloud, UncensoredLLM.ai, abliteration.ai, Featherless, OpenRouter a NanoGPT, stránky ako OpenRouter, brána API pre LLM, API kompatibilné s OpenAI, API kompatibilné s Anthropic, {{appName}}",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Pre vývojárov",
    readTime: "11 min čítania",
    title: "Alternatívy k OpenRouter bez cenzúry",
    subtitle:
      "{{count}} alternatív a {{appName}} v porovnaní podľa pokrytia modelov bez cenzúry, formátov API a poplatkov. Overené {{date}}.",
  },
  intro: {
    lead: "OpenRouter dáva 477 modelov na jeden kľúč. Na prácu bez cenzúry je ponuka chudobná: 17 roleplayových alebo necenzurovaných tunov a ani jeden abliterovaný model.",
    p2: "Preto sme podľa ich vlastnej dokumentácie, cenníkov a zoznamov modelov preverili API hostiteľov bez cenzúry, paušálnych hostiteľov na roleplay, brány a aplikácie. Aj my kupujeme prístup k modelom od OpenRouter: {{openRouterModels}} našich modelov ide cez neho.",
  },
  shelf: {
    title: "Čo ponúka OpenRouter na prácu bez cenzúry",
    intro:
      "Z jeho verejného zoznamu modelov a podmienok, prečítaných {{orDate}}.",
    tunes:
      "17 zo 477 modelov sa názvom alebo popisom hlási k roleplayu alebo necenzúre: Venice Uncensored (tune Dolphin Mistral 24B), Hermes 4 405B, Cydonia, Skyfall, Magnum v4 72B, Euryale, MythoMax a hŕstka modelov Aion RP.",
    abliterated:
      "Žiadne ID modelu neobsahuje abliterated ani uncensored. Abliterované verzie GLM 5.3, DeepSeek V4.1 Flash a Kimi K3.1 Pro, ktoré predávajú necenzurované routery, tu nenájdeš.",
    rules:
      "Pravidlá: 18+, automatická kontrola CSAM a inak platia podmienky každého modelu. Bežné modely naďalej odmietajú to, čo odmietajú ich výrobcovia.",
    callout:
      "Potrebuješ abliterované váhy? OpenRouter je zlý router. Potrebuješ roleplayové fine-tuny? Má slušný výber.",
  },
  apis: {
    title: "Alternatívy API bez cenzúry, jedna po druhej",
    intro:
      "Služby, ktoré sú postavené na API a predávajú abliterované alebo necenzurované váhy. Z ich vlastných stránok, prečítaných {{marketDate}}.",
    visit: "Navštíviť {{name}}",
    openUncensored: {
      heading: "OpenUncensored: router len pre modely bez cenzúry",
      body: "58 textových, 20 obrazových a 3 video modely, takmer všetky abliterované, smerované na Venice, NanoGPT, Refuseless a ďalších. Žiadna provízia z cien poskytovateľov, dobitie od 5 USD s neobmedzenou platnosťou a žiadny účet: tvoj kľúč API je účet. OpenAI, Responses a Anthropic Messages na jednej základnej URL.",
      catch:
        "Háčik: žiadny bezplatný plán, žiadny webový čet (len desktopová aplikácia) a metadáta požiadaviek sa uchovávajú až dva roky.",
    },
    refuseless: {
      heading: "Refuseless: najlacnejšie abliterované verzie, aké sme našli",
      body: "Abliterované GLM 5.3, GLM 5.3 Flash, DeepSeek V4.1 Flash a Kimi K3.1 Pro s kontextom 1M. Abliterovaný DeepSeek V4.1 Flash stojí 0,12 USD za vstup a 0,45 USD za výstup na milión tokenov. Chat completions, Responses a Anthropic Messages, vrátane Claude Code.",
      catch:
        "Háčik: len API, vyžaduje overený e-mail a jeho stránky s cenníkom, súkromím a podmienkami zablokovali náš čítač.",
    },
    nearAi: {
      heading: "NEAR AI Cloud: abliterované modely v dôvernom výpočte",
      body: "Hardvérová atestácia, takže tvoje prompty nemôže čítať ani NEAR, ani hostiteľ cloudu, tvrdí služba. Dva abliterované modely: Qwen 3.8 27B za 0,04 USD za vstup a 1,35 USD za výstup na milión tokenov a DeepSeek V4.1 Flash 1017. Bez žiadosti o prístup, bez overovania identity, platí sa za token.",
      catch: "Háčik: len formát OpenAI a maličký výber modelov bez cenzúry.",
    },
    uncensoredLlmAi: {
      heading: "UncensoredLLM.ai: najväčší katalóg bez cenzúry",
      body: "332 četových modelov plus 13 obrazových a video modelov s každodennou kontrolou odmietnutí. Formáty OpenAI, Anthropic a Gemini na jeden predplatený kľúč. Karta alebo krypto od 3 USD a zostatok nikdy nevyprší.",
      catch:
        "Háčik: prepredaj alebo prefakturované API bez písomného povolenia je zakázaný. Podmienky ochrany súkromia sme na prečítaných stránkach nenašli.",
    },
    abliterationAi: {
      heading: "abliteration.ai: vlastné abliterované modely, súkromie písomne",
      body: "Vlastné abliterované modely vo formátoch OpenAI a Anthropic. Tvrdí, že prompty a výstupy sa spracúvajú v pamäti, štandardne sa neukladajú a nikdy sa nepoužívajú na trénovanie. Možnosť regiónu EÚ a brána pravidiel pre tvoje vlastné zásady.",
      catch:
        "Háčik: drahšie než Refuseless alebo NEAR AI pri podobných váhach a základné modely nemenuje.",
    },
    flatRate: {
      heading:
        "Featherless, Infermatic, Arli AI: paušál na intenzívny roleplay",
      body: "Featherless uvádza viac než 50 000 modelov z Hugging Face, 1 398 označených ako abliterated, s paušálnym plánom Chat za 25 USD. Infermatic predáva vybrané roleplayové tuny 70B od 9 USD mesačne. Arli AI má plány s neobmedzenými tokenmi od 15 USD s derestricted fine-tunmi. Všetci traja tvrdia, že neukladajú logy promptov.",
      catch:
        "Háčik: osobné plány nesmú poháňať aplikácie a dostaneš 1 až 6 paralelných požiadaviek.",
    },
    deepInfra: {
      heading: "DeepInfra: lacné bežné modely, žiadne bez cenzúry",
      body: "Za token patrí medzi najlacnejšie pri bežných otvorených modeloch: DeepSeek V4.1 Flash za 0,14 USD za vstup a 0,42 USD za výstup na milión tokenov, 200 súbežných požiadaviek na model. Tvrdí, že vstupy API sa nikdy neukladajú na disk.",
      catch: "Háčik: v katalógu nemá modely bez cenzúry ani na roleplay.",
    },
  },
  gateways: {
    title: "Ak potrebuješ len router",
    intro:
      "Brány smerujú k poskytovateľom, ktorých nakonfiguruješ ty. Žiadna z nich nepridáva modely bez cenzúry.",
    vercel:
      "Vercel AI Gateway: hostovaná, cena tokenov poskytovateľa bez prirážky, postavená pre AI SDK.",
    selfHost:
      "LiteLLM alebo Bifrost: open source, vo vlastnej réžii, s tvojimi kľúčmi poskytovateľov, rozpočtami a fallbackmi.",
    control:
      "Portkey, Cloudflare AI Gateway, Helicone: ochranné pravidlá, cache, logy požiadaviek a kontrola výdavkov navyše.",
  },
  criteria: {
    title: "Čo porovnať pred prechodom",
    intro: "Pri výbere pomôže šesť otázok.",
    catalog:
      "Katalóg: Koľko modelov a laboratórií pokrýva? Nájdeš tam modely, ktoré používaš dnes?",
    uncensored:
      "Modely bez cenzúry: Koľko ich služba ponúka, akým spôsobom a na čo sa hodia?",
    formats:
      "Formáty: Podporuje služba iba OpenAI Chat Completions alebo aj Responses API a Anthropic Messages API pre programovacích agentov?",
    billing:
      "Účtovanie: Platíš cenníkovú cenu s poplatkom, cenu s prirážkou alebo predplatné? Čo sa stane pri nulovom zostatku?",
    data: "Údaje: Ukladá či protokoluje služba zadania? Trénuje na nich modely len so súhlasom?",
    chat: "Čet: Môžu ľudia bez znalosti kódu použiť rovnaké modely v prehliadači?",
  },
  table: {
    title: "Všetky možnosti vedľa seba",
  },
  us: {
    title: "{{appName}}: jeden kľúč pre všetky typy modelov",
    intro:
      "Jeden kľúč pre {{modelCount}} četovacích modelov, z toho {{uncensored}} bez cenzúry.",
    models:
      "Modely: Claude, GPT, Gemini, Grok, DeepSeek, Kimi, GLM a Qwen spolu s {{uncensored}} modelmi bez cenzúry. {{ownModel}} je trénovaný na knihách a dokumentoch zakázaných v hlavnom prúde internetu. Preto vyjadruje aj odlišné politické názory.",
    formats:
      "Formáty: OpenAI Chat Completions, OpenAI Responses API aj Anthropic Messages API. Svoje SDK alebo agenta nasmeruj na jednu základnú adresu.",
    billing:
      "Účtovanie: Jeden zostatok kreditov. K cene poskytovateľa pripočítavame {{markup}} %. Kľúče API odomkne prvý nákup. Plány začínajú na {{apiSubPrice}} mesačne.",
    chat: "Čet: Rovnaké modely aj pre členov tímu bez kódu. Webový čet má priečinky, nástroje a tvorbu obrázkov, videa aj hudby.",
    openRouter:
      "Modely od OpenRouter: Cez jeho bránu sprístupňujeme {{openRouterModels}} modelov. Používaš ich na rovnakom účte ako modely bez cenzúry.",
    weak: "Kde sme slabší: OpenRouter si na inferencii neúčtuje žiadnu prirážku, len 5,5 % poplatok pri nákupe kreditov. My pripočítavame {{markup}} % k tomu, čo platíme. Dovolí ti priniesť vlastné kľúče poskytovateľov, smerovať len na endpointy s nulovým uchovávaním dát a vyberať poskytovateľov pre každú požiadavku. My nemáme nič z toho. A abliterované routery vyššie nás pri každom spoločnom modeli podliezajú cenou.",
    codeLabel: "Prechod klienta OpenAI SDK: zmeň základnú adresu a kľúč",
    docsLink: "Dokumentácia API: koncové body, overenie a limity",
    formatsLink: "Ako funguje API kompatibilné s OpenAI a Anthropicom",
    toolsLink: "Jeden kľúč pre Claude Code, Codex CLI, Aider a ďalšie",
  },
  models: {
    title: "Modely bez cenzúry dostupné cez API: {{apiUncensored}}",
    intro:
      "Všetky modely bez cenzúry od najlacnejších. Identifikátor pri modeli vlož do poľa model.",
    colModel: "Model",
    colId: "Identifikátor API",
    colContext: "Kontext",
    colPrice: "Za správu",
    footnote:
      "Cena jednej referenčnej správy zahŕňa našu prirážku {{markup}} %. Pod názvom modelu nájdeš spôsob jeho úpravy alebo tréningu.",
  },
  list: {
    title: "Aplikácie s API bez cenzúry, jedna po druhej",
    intro:
      "Údaje z vlastných stránok služieb sme overili k {{date}}. Pri každej uvádzame, čo ponúka, ako funguje jej API, aké má modely a koľko stojí.",
    heading: "{{number}}. {{name}}: {{kind}}",
    api: "API:",
    models: "Modely:",
    price: "Cena:",
    priceValue: "Bezplatný plán: {{free}}. Platené plány: {{plans}}.",
    pro: "Najväčšia výhoda:",
    con: "Háčik:",
    forWho: "Vyber si, ak:",
    versusLink: "{{appName}} a {{name}}: úplné porovnanie",
    visit: "Navštíviť {{name}}",
  },
  stay: {
    title: "Kedy sa ešte oplatí OpenRouter",
    intro:
      "Ak potrebuješ nasledujúce funkcie, OpenRouter môže byť lepšia voľba.",
    rare: "Potrebuješ okrajový model alebo konkrétneho poskytovateľa, ktorého nemá žiadna iná porovnaná služba.",
    callout:
      "Mnohé tímy používajú dve brány. OpenRouter na menej bežné modely, druhý kľúč na modely bez cenzúry a čet pre celý tím.",
  },
  faq: {
    title: "Časté otázky",
    best: {
      q: "Ktorá alternatíva k OpenRouter je najlepšia?",
      a: "Závisí od toho, čo ti na OpenRouter chýba. Abliterované váhy za cenu poskytovateľa: OpenUncensored, Refuseless alebo NEAR AI Cloud. Najväčší necenzurovaný katalóg: UncensoredLLM.ai alebo Featherless. Platba podľa spotreby v kryptomenách: NanoGPT. Vlastné modely Venice a jeho režimy súkromia: Venice. Lokálne a zadarmo: Ollama. Modely bez cenzúry, otvorené aj bežné, plus médiá a tímový čet na jednom kľúči: {{appName}}.",
    },
    cheaper: {
      q: "Existuje lacnejšia alternatíva k OpenRouter?",
      a: "Porovnávaj cenu za model, nie poplatok. OpenRouter k inferencii nepridáva prirážku, OpenUncensored neberie províziu a Refuseless a NEAR AI Cloud uvádzajú najlacnejšie abliterované verzie, aké sme našli. Na {{appName}} platíš to, čo platíme my, plus prirážku {{markup}} %, a každá stránka modelu ukazuje cenu za správu.",
    },
    uncensored: {
      q: "Ktorá alternatíva k OpenRouter má modely bez cenzúry?",
      a: "OpenUncensored, Refuseless, NEAR AI Cloud, UncensoredLLM.ai, abliteration.ai, NanoGPT, Venice, uncensored.ai, Gab AI a {{appName}} poskytujú modely bez cenzúry cez API. V API {{appName}} ich je aktuálne {{apiUncensored}}: abliterované, doladené aj {{ownModel}}.",
    },
    sdk: {
      q: "Môžem si ponechať kód pre OpenAI SDK?",
      a: "Áno. Zmeň základnú adresu a kľúč API. Identifikátory modelov sa medzi bránami líšia, preto ich tiež uprav. Príklad: {{example}}.",
    },
    anthropic: {
      q: "Funguje to so súpravami SDK od Anthropicu a s programovacími agentmi?",
      a: "Na {{appName}} áno: API Anthropic Messages beží popri formátoch OpenAI, takže sa Claude Code a ďalší agenti pripoja jedným kľúčom, vrátane modelov bez cenzúry. Anthropic Messages hovoria aj OpenUncensored, Refuseless, NanoGPT a UncensoredLLM.ai. Venice natívny endpoint nemá a Claude Code posiela na lokálny proxy.",
    },
    free: {
      q: "Existuje bezplatná alternatíva k OpenRouter?",
      a: "Ollama je zadarmo, ak model zvládne tvoj hardvér. OpenRouter má 11 bezplatných modelov s denným limitom a Infermatic má bezplatný webový plán. {{appName}} dáva každý mesiac kredity na čet zadarmo, API sa odomkne prvým nákupom.",
    },
    apiLink: "API pre LLM bez cenzúry: identifikátory, kód a limity",
    veniceLink: "Porovnanie alternatív k Venice AI",
    nanoGptLink: "Alternatívy k NanoGPT v porovnaní",
    keysLink: "Spravovať kľúče API",
  },
  cta: {
    title: "Jeden kľúč pre všetky modely. Menej odmietnutí.",
    subtitle:
      "Najskôr vyskúšaj modely v čete. Dostaneš {{guestCredits}} kred. zadarmo mesačne aj bez účtu.",
    start: "Vyskúšať model bez cenzúry",
    docs: "Prečítať si dokumentáciu API",
  },
};
