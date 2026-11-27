import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Codex CLI a Claude Code s API {{appName}}",
    description:
      "Codex CLI, Claude Code, OpenCode, Continue, Aider a Cline s jedným kľúčom {{appName}}. Claude, GPT, DeepSeek, GLM aj modely bez cenzúry.",
    category: "Pre vývojárov",
    imageAlt: "API služby {{appName}} v programovacích nástrojoch",
    keywords:
      "{{appName}}, Codex CLI, Claude Code, OpenCode, Continue, Aider, Cline, API kompatibilné s OpenAI, Responses API, Anthropic Messages API, programovací agent, modely bez cenzúry, vlastný poskytovateľ",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Pre vývojárov",
    readTime: "8 min čítania",
    title: "Jeden kľúč pre všetky modely. Aj pre Codex a Claude Code.",
    subtitle:
      "Codex CLI a Claude Code sa priamo pripájajú k {{appName}}, rovnako ako OpenCode, Continue, Aider a Cline. Jedna základná adresa URL, jeden kľúč, jeden príkaz na nástroj.",
  },
  intro: {
    lead: "Tvoj programovací agent pracuje s modelmi jedného dodávateľa. Ak chceš druhý názor z iného laboratória, lacnejší model na rutinnú prácu alebo model s menším počtom odmietnutí, pribudne ti ďalší účet, kľúč aj faktúra.",
    p2: "{{appName}} podporuje tri formáty programovacích agentov: OpenAI Chat Completions, OpenAI Responses API a Anthropic Messages API. Nič navyše neinštaluješ. Raz nastav adresu nástroja a potom zmenou identifikátora prepínaj medzi Claude, GPT, DeepSeek, GLM, Kimi, Qwen a modelmi bez cenzúry.",
    access:
      "API vyžaduje platený účet. Odomkne ho každý plán od {{subPrice}} mesačne. Bezplatné a bežné bonusové kredity ho nesprístupnia.",
    accessLink: "Odomknúť API",
  },
  why: {
    title: "Čo získaš",
    oneKey:
      "Jeden kľúč a jeden zostatok. Samostatné účty v Anthropic, OpenAI, DeepSeek, Moonshot ani Z.ai nepotrebuješ.",
    uncensored:
      "V editore si môžeš vybrať aj modely bez cenzúry. Využiješ ich pri obrannej bezpečnostnej analýze alebo pri práci s fikciou a citlivými údajmi. Úroveň filtrovania si určuješ ty.",
    switch:
      "Model podľa úlohy. Na náročný refaktoring špičkový model, na premenovania a kostry testov rýchly model Flash. Nastavenie zostáva rovnaké, zmení sa identifikátor.",
    billing:
      "Rovnaké kredity aj ceny ako v čete. V každej odpovedi nájdeš presnú cenu.",
  },
  setup: {
    title: "Získaj kľúč a základnú adresu",
    intro: "Každému z nasledujúcich nástrojov stačia tieto dve hodnoty.",
    p1: "V sekcii Nastavenia > Kľúče API vytvor kľúč. Začína sa na sk-unb- a pri vytvorení ho uvidíš iba raz.",
    shortcut:
      "Po vytvorení kľúča sa na stránke kľúčov API zobrazia všetky konfiguračné bloky s vyplneným kľúčom. Vyber svoj nástroj, skopíruj blok a spusti ho.",
    baseUrlLabel: "Základná adresa URL",
    baseUrlNote:
      "Pre nástroje vo formáte OpenAI: Codex, OpenCode, Continue, Aider a Cline. Jazykový kód v adrese mení iba jazyk chybových správ.",
    anthropicBaseUrlLabel: "Základná adresa URL pre Anthropic",
    anthropicBaseUrlNote:
      "Pre Claude Code a SDK od Anthropicu použi tú istú adresu bez /v1. Klienti si sami pridajú /v1/messages.",
    p2: "Kľúč ulož do premennej prostredia a nepridávaj ho do súborov v repozitári. Volaním cez curl overíš kľúč a získaš zoznam identifikátorov dostupných modelov, veľkosť kontextu, podporu nástrojov a ceny v kreditoch.",
  },
  compat: {
    title: "Každý nástroj sa pripája priamo",
    intro:
      "Programovací agenti používajú tri formáty požiadaviek. Všetky tri u nás fungujú s rovnakým kľúčom a rovnakými modelmi.",
    codex: "Codex CLI: OpenAI Responses API.",
    claudeCode: "Claude Code: Anthropic Messages API.",
    chat: "OpenCode, Continue, Aider a Cline: OpenAI Chat Completions.",
    other:
      "Ostatné nástroje s poľom pre základnú adresu fungujú rovnako. Nastav adresu, kľúč a identifikátor modelu.",
  },
  wire: {
    responses: "Responses API",
    messages: "Messages API",
    chat: "Chat Completions",
  },
  codex: {
    intro:
      "Terminálový agent od OpenAI. Číta repozitár, spúšťa príkazy a upravuje súbory.",
    p1: "Codex komunikuje cez Responses API, ktoré podporujeme aj my. Jediný príkaz nastaví poskytovateľa priamo. Netreba nič upravovať ani inštalovať. Pri pravidelnom používaní pridaj nastavenie raz a potom Codex spúšťaj s profilom.",
    p2: 'Model zmeníš voľbou -m alebo riadkom model v profile. Ponechaj wire_api = "responses", pretože aktuálny Codex iný formát neprijíma.',
  },
  claudeCode: {
    intro:
      "Terminálový agent od Anthropicu. Plánuje, upravuje, spúšťa testy a zadáva prácu podriadeným agentom.",
    p1: "Claude Code načíta adresu brány z premenných prostredia. ANTHROPIC_BASE_URL obsahuje základnú adresu bez /v1. ANTHROPIC_MODEL určuje hlavný model. Predvolené modely OPUS a SONNET pokrývajú výber modelu a plánovací režim. HAIKU presúva úlohy na pozadí, napríklad tvorbu názvu relácie, na lacnejší model. CLAUDE_CODE_SUBAGENT_MODEL nastavuje model podriadených agentov. CLAUDE_CODE_MAX_CONTEXT_TOKENS určuje skutočnú veľkosť kontextu pri inom modeli ako Claude, aby klient skrátil kontext v správnej chvíli.",
    p2: "Ak chceš používať priamo Claude, vynechaj riadky s modelmi. Claude Code si vyžiada obvyklé identifikátory a my požiadavku nasmerujeme na zodpovedajúci Claude. Platíš kreditmi.",
    p3: "Claude Code posiela veľké systémové zadanie. Aj pri jednoduchej úlohe ide o vyše 30 000 vstupných tokenov. S lacnejším predvoleným modelom si udržíš náklady pod kontrolou.",
  },
  opencode: {
    intro:
      "Terminálový agent s otvoreným kódom. Má textové rozhranie a režim bez rozhrania.",
    p1: "Nastavenie ulož ako opencode.json v projekte alebo ako ~/.config/opencode/opencode.json, ak ho chceš použiť pre všetky projekty. Kľúč zostáva v premennej prostredia. Do mapy models zapíš identifikátor z GET /v1/models a v terminálovom rozhraní ho vyber príkazom /models.",
    gotcha:
      "Najprv aktualizuj OpenCode. Staršie verzie 1.0.x načítajú najnovší balík @ai-sdk/openai-compatible a po prvom volaní nástroja zlyhajú s chybou DecimalError: Invalid argument. Vo verzii 1.19.5 rovnaké nastavenie funguje.",
  },
  continue: {
    intro:
      "Asistent pre VS Code a JetBrains s nástrojom príkazového riadka cn.",
    p1: "secrets.UNBOTTLED_API_KEY sa načíta z prostredia. Ak chceš spustiť nástroj bez rozhrania, pridaj -p a zadanie. Rozšírenie IDE číta ~/.continue/config.yaml. Pridaj tam rovnaký záznam modelu.",
  },
  aider: {
    intro: "Párové programovanie priamo v termináli vrátane commitov.",
    p1: "Stačí jeden príkaz, konfiguráciu netreba. Aider vyžaduje predponu openai/ pred identifikátorom modelu a pred volaním API ju odstráni. --edit-format diff udrží úpravy malé. Bez tejto voľby posiela Aider pri neznámom identifikátore celé súbory. Súbory na úpravu uveď na príkazovom riadku ako zvyčajne.",
  },
  cline: {
    intro: "Autonómny programovací agent vo VS Code aj na príkazovom riadku.",
    p1: "V Cline CLI stačia dva príkazy. Najprv ulož poskytovateľa a potom spusti cline. Základná adresa, kľúč a identifikátor modelu zostávajú rovnaké ako v ostatných nástrojoch.",
  },
  models: {
    title: "Ktorý model sa hodí na tvoju úlohu",
    intro:
      "Všetky tieto modely podporujú volanie nástrojov, ktoré agenti potrebujú. Do nastavenia vlož identifikátor modelu.",
    strong: {
      title: "Náročné úlohy",
      body: "Rozsiahly refaktoring, neznámy kód, ladenie vo viacerých krokoch. Zaplatíš viac kreditov, ale model robí menej chybných krokov.",
    },
    cheap: {
      title: "Rýchlo a lacno",
      body: "Premenovania, testy, opakujúci sa kód a úlohy na pozadí. Stoja zlomok ceny špičkového modelu. Dobrá predvolená voľba pre agentov, ktorí posielajú veľké zadania.",
    },
    uncensored: {
      title: "Bez cenzúry",
      body: "Rovnaký spôsob práce s agentom aj pri citlivých témach. Hodí sa na obrannú analýzu, tvorivé písanie a spracovanie dát. Za výsledok svojej práce zodpovedáš ty.",
    },
    listNote:
      "Pri obmene modelov sa menia aj identifikátory. Aktuálny zoznam nájdeš cez GET /v1/models. Ak identifikátor nie je dostupný pre tvoj kľúč, API vráti 404 model_not_found. V Claude Code smerujú vstavané identifikátory Claude na náš najnovší Claude z rovnakej rodiny.",
  },
  gotchas: {
    title: "Chyby, na ktoré sme narazili",
    intro: "Vyhni sa im pri vlastnom nastavení.",
    localeUrl:
      "Skopíruj celú základnú adresu vrátane /api/<locale>/v1. Bez jazykového kódu vznikne presmerovanie, ktoré niektorí klienti nespracujú. Bez /api dostaneš HTML stránku namiesto JSON.",
    anthropicUrl:
      "V Claude Code nastav základnú adresu bez /v1. Inak klient zavolá /v1/v1/messages a dostane chybu 404.",
    modelId:
      "Použi presný identifikátor z GET /v1/models, napríklad {{model}}. Aider potrebuje predponu openai/. Vstavané identifikátory Claude Code smerujú na najnovší Claude z rovnakej rodiny v našom katalógu. Iný neznámy identifikátor vráti 404 model_not_found.",
    paid: "HTTP 402 s kódom paid_plan_required znamená, že účet ešte nemá plán ani zakúpené kredity. Prístup odomkne ktorýkoľvek platený plán.",
    tools:
      "Ak model nepodporuje nástroje, požiadavka s nástrojmi vráti chybu 400 tools_not_supported. Pole supports_tools overíš cez GET /v1/models.",
    rateLimit:
      "Bez pevného limitu požiadaviek. Platíš za každé volanie z kreditov, s veľkorysou ochranou proti zneužitiu pri zaseknutých slučkách. Chyby 429 od poskytovateľov posielame ďalej s hlavičkou Retry-After, aby agent počkal a zopakoval volanie.",
  },
  cta: {
    title: "Pripoj nástroj jediným príkazom",
    subtitle:
      "Vytvor kľúč, skopíruj nastavenie pre svoj nástroj a vyber model. V dokumentácii API nájdeš všetky koncové body, polia, chybové kódy aj podrobnosti o streamovaní.",
    key: "Vytvoriť kľúč API",
    docs: "Prečítať si dokumentáciu API",
  },
};
