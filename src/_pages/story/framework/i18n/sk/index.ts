import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Pre vývojárov | Framework next-vibe, API pre AI bez cenzúry a MCP",
    description:
      "Z jedného koncového bodu získate webové rozhranie, príkaz CLI, nástroj MCP, nástroj pre AI a ďalšie rozhrania. Otvorený kód stačí naklonovať, nainštalovať a spustiť. Jedno API kompatibilné s OpenAI a Anthropic sprístupňuje bežné modely aj modely bez cenzúry. Súčasťou sú účtovníctvo, fakturácia, CRM aj pokladničný predaj.",
    category: "Pre vývojárov",
    imageAlt:
      "unbottled.ai pre vývojárov: API, MCP a prevádzka na vlastnom serveri",
    keywords:
      "API pre AI bez cenzúry, API kompatibilné s OpenAI, API kompatibilné s Anthropic, API pre abliterated modely, UncensoredLM API, server MCP, AI na vlastnom serveri, next-vibe",
  },
  hero: {
    eyebrow: "Pre vývojárov",
    title: "Jeden súbor definition.ts.",
    titleAccent: "Všetky rozhrania.",
    subtitle:
      "next-vibe je otvorený framework v TypeScripte, na ktorom beží {{appName}}. Čet s AI, účtovníctvo, pokladničný predaj, sklad aj CRM. Jeden koncový bod slúži ako webové rozhranie, príkaz CLI, nástroj MCP aj nástroj pre AI. Ďalší prepojovací kód netreba.",
    ctaFramework: "Pozrieť zdrojový kód",
    ctaKeys: "Použiť API",
    stats: {
      endpoints: "typové koncové body v repozitári",
      surfaces: "rozhrania z jednej definície",
      languages: "dostupné jazyky",
      models: "četovacie modely na jeden kľúč API",
    },
  },
  paths: {
    api: {
      label: "Volanie API",
      title: "Jeden kľúč pre modely AI ({{modelCount}})",
      body: "Použi svoj kód pre OpenAI alebo Anthropic s našou základnou URL. Bežné modely aj modely bez cenzúry na jeden kľúč.",
      link: "Rýchly štart",
    },
    selfHost: {
      label: "Vlastný server",
      title: "Spusti celú platformu",
      body: "Čet, účtovníctvo, pokladňa, sklad a CRM. Naklonuj, nainštaluj, spusti.",
      link: "Nainštalovať",
    },
    framework: {
      label: "Vlastný vývoj",
      title: "Jedna definícia pre všetky rozhrania",
      body: "Koncový bod napíšeš raz. Získaš webové rozhranie, príkaz CLI, nástroj MCP, nástroj pre AI a ďalšie rozhrania.",
      link: "Pozrieť si postup",
    },
  },
  modules: {
    eyebrow: "V repozitári",
    title: "Celé produkty podľa rovnakého vzoru.",
    intro:
      "Účtovníctvo, fakturácia, CRM a správy fungujú rovnako ako kontaktný formulár vyššie. Každý koncový bod je dostupný ako príkaz CLI, nástroj MCP a nástroj pre AI, pokiaľ to jeho definícia výslovne nevypne. V priečinkoch nájdeš súbory definition, repository a route.",
    endpoints: "Počet koncových bodov: {{count}}",
    business: "Prevádzkuj na platforme svoju firmu",
    source: "Prehliadať moduly na GitHube",
    tryLine: "Rovnaký postup, skutočné príkazy",
    items: {
      accounting: "Podvojné účtovníctvo",
      documents: "Vystavené a prijaté faktúry, cenové ponuky",
      purchasing: "Nákup",
      pos: "Pokladničný predaj",
      inventory: "Sklad",
      crm: "CRM a potenciálni zákazníci",
      newsletter: "Odber noviniek",
      messaging: "Doručená pošta a správy",
    },
  },
  quickstart: {
    eyebrow: "Rýchly štart",
    title: "Prvá odpoveď v troch krokoch.",
    intro:
      "API podporuje OpenAI Chat Completions a Responses aj Anthropic Messages. V kóde zmeň tri veci: základnú URL, kľúč a ID modelu z `GET /v1/models`.",
    step1: {
      title: "Sprístupni API a vytvor kľúč",
      description:
        "API sprístupní ktorékoľvek predplatné od {{subPrice}} mesačne. Potom otvor stránku kľúčov API, kľúč pomenuj a skopíruj. Zobrazí sa len raz.",
      ctaPlans: "Pozrieť si predplatné",
      ctaKeys: "Otvoriť kľúče API",
    },
    step2: {
      title: "Nasmeruj klienta na naše API",
      description:
        "Klienti OpenAI používajú prvú URL. Claude Code a SDK Anthropic používajú druhú.",
      baseUrl: "Základná URL pre OpenAI",
      baseUrlNote:
        "V ceste funguje ktorýkoľvek podporovaný jazyk a región. Výber mení iba jazyk chybových hlásení.",
      anthropicBaseUrl: "Základná URL pre Anthropic",
      anthropicNote:
        "Na koniec nepridávaj `/v1`. Klienti Anthropic sami doplnia `/v1/messages`.",
    },
    step3: {
      title: "Odošli požiadavku",
      description:
        "Vlož kľúč a spusti príkaz. `{{model}}` je ID jedného modelu. `GET /v1/models` vráti všetky ID, ktoré môže kľúč volať.",
      response: "Ukážka odpovede",
    },
    agents: {
      title: "Programovací agenti fungujú hneď",
      body: "Overené nastavenia na skopírovanie:",
      link: "Nastavenia programovacích agentov",
    },
    reference: "Kompletná dokumentácia API",
  },
  pricing: {
    eyebrow: "Ceny",
    title: "Predplatné sprístupní API. Za každé volanie platíš kreditmi.",
    intro:
      "Rovnaké sadzby ako v čete. Bez príplatku za API a bez poplatku za používateľa. Jeden zostatok kreditov.",
    unlockTitle: "Čo sprístupní API",
    unlockPlan: "Ktorékoľvek predplatné od {{subPrice}} mesačne",
    unlockGrant: "Kredity pridelené naším tímom, napríklad testovacie kredity",
    neverTitle: "Čo API nesprístupní",
    never:
      "Bezplatný plán vrátane mesačných kreditov, bonusov za registráciu a odber noviniek aj zárobku z odporúčaní. Bez predplatného alebo pridelených kreditov každé volanie `/v1` vráti stav 402 `paid_plan_required`.",
    billTitle: "Ako sa účtuje volanie",
    bill: "Účtujeme náklady poskytovateľa s našou prirážkou v kreditoch. `GET /v1/models` uvádza pre každý model cenu v kreditoch za milión vstupných a výstupných tokenov. Každá odpoveď uvádza `usage.credits_charged`. Pri streamovaní použi `stream_options.include_usage`.",
    topup:
      "Potrebuješ viac kreditov? Predplatitelia si môžu dokúpiť balíky od {{packPrice}}. Kredity z balíkov nemajú obmedzenú platnosť.",
    facts: {
      credit: "1 kredit = 1 americký cent",
      rate: "Bez pevného limitu (účtovanie za požiadavku)",
      keys: "Maximum kľúčov na účet: {{maxKeys}}",
      preflight: "Pri nedostatku kreditov sa vráti 402 ešte pred vykonaním",
    },
    modelsTitle: "Všetky ceny poskytuje priamo API",
    modelsResponse: "Ukážka odpovede",
  },
  uncensored: {
    eyebrow: "Modely bez cenzúry",
    title: "Dva druhy modelov bez cenzúry. Oba cez API.",
    intro:
      "Väčšina modelov bez cenzúry vychádza z bežných modelov s odstráneným odmietaním odpovedí. Ponúkame tieto modely aj jeden, ktorý bol od začiatku trénovaný inak. V každej požiadavke si vyberieš podľa ID modelu.",
    abliterated: {
      label: "Upravené metódou abliteration a doladené",
      title: "Bežné modely, ktoré odpovedajú priamo",
      body: "Odmietanie sa odstránilo z váh alebo doladením. Znalosti zostali a odpovede sú priamejšie.",
    },
    worldview: {
      label: "Skutočne bez cenzúry",
      title: "Model s vlastným pohľadom na svet",
      body: "Model {{model}} trénoval na knihách a dokumentoch vylúčených z hlavného prúdu internetu, preto sa jeho politické názory od hlavného prúdu líšia.",
    },
    more: "Ďalšie modely: {{count}}",
    consent:
      "Na stránke kľúčov API raz potvrď, že máš aspoň 18 rokov. Dovtedy volania modelov bez cenzúry vrátia 403 `uncensored_consent_required` a kredity sa neodpočítajú.",
    allModels: "Všetky modely bez cenzúry",
    catalog: "Prehliadať katalóg modelov",
  },
  mcp: {
    eyebrow: "MCP a CLI",
    title: "Tvoj agent už pozná tvoju aplikáciu.",
    intro:
      "Príkaz `bun i` zapíše nastavenie MCP pre Claude Code, Cursor, VS Code, OpenCode a Codex. Keď v agentovi otvoríš repozitár, nástroje budú dostupné.",
    points: {
      stdio: "MCP cez stdio. Bez ďalšieho servera a bez portu.",
      roles:
        "Platia rovnaké roly a kontrola údajov ako vo webovom rozhraní. Model má prístup len k tomu, čo dovoľuje tvoja rola.",
      connect:
        "Prepoj inštaláciu s účtom {{appName}} a jej agenti budú používať naše modely.",
      help: "Pomoc pre každý príkaz zobrazíš cez `vibe <command> --help`.",
    },
    configNote:
      "Skrátený záznam `atlas`, ktorý zapisuje `bun i`. Úplný súbor obsahuje aj server `hermes` a používa cestu k tvojej kópii repozitára.",
  },
  selfHost: {
    eyebrow: "Vlastný server",
    title: "Spusti celú platformu u seba.",
    intro:
      "Kód, na ktorom beží {{appName}}, je otvorený. Naklonuj repozitár, nainštaluj závislosti a spusti aplikáciu. Zvyšok nastavíš v prehliadači. Bez Dockeru a konfiguračných súborov.",
    terminal: "Terminál",
    db: "Predvolene sa používa vstavaný Postgres (PGlite). Keď ti prestane stačiť, nastav `DATABASE_URL` na vlastnú databázu Postgres.",
    guide: "Návod na prevádzku na vlastnom serveri",
    github: "Zdrojový kód na GitHube",
  },
  framework: {
    eyebrow: "Framework",
    title: "Jeden koncový bod v praxi.",
    intro:
      "Skrátený kontaktný formulár priamo z repozitára. Jedna definícia slúži ako webové rozhranie, príkaz CLI, nástroj MCP, obrazovka natívnej aplikácie, nástroj pre AI aj úloha cron.",
    tabAdd: "Pridať vlastný",
    call: {
      title: "Volať koncový bod",
      cli: "CLI",
      mcp: "MCP",
      ai: "Nástroj pre AI",
      cron: "Cron",
    },
    becomes: "Kontaktný formulár slúži ako",
    more: "Ďalšie rozhrania: {{count}}",
    source: "Úplný zdrojový kód na GitHube",
    live: "Vyskúšaj na konci stránky",
    docs: "Dokumentácia postupov na GitHube",
    deleteLine:
      "Každá funkcia má vlastný priečinok. Po jeho odstránení a spustení `vibe gen` funkcia zmizne zo všetkých rozhraní naraz.",
    moreSurfaces: {
      webApi: "REST API",
      websocket: "Udalosti WebSocket",
      adminPanel: "Panel správcu",
      vibeFrame: "Vložiteľný widget",
    },
    surfaces: {
      web: {
        title: "Webové rozhranie",
        body: "Formulár na konci tejto stránky. Polia, kontrola údajov a hlásenie o úspechu vychádzajú z definície.",
      },
      cli: {
        title: "Príkaz CLI",
        body: "`vibe contact-form` má jeden prepínač pre každé pole a zabudovanú pomoc.",
      },
      mcp: {
        title: "Nástroj MCP",
        body: "Agenti ho volajú cez `vibe mcp` nástrojom `execute-tool`. Schéma vstupu vychádza priamo zo Zod.",
      },
      ai: {
        title: "Nástroj pre AI",
        body: "Modely ho môžu volať. Pri nastavení `requiresConfirmation` musí použitie najprv schváliť používateľ.",
      },
      native: {
        title: "Obrazovka natívnej aplikácie",
        body: "Aplikácia Expo vykreslí rovnaký widget s natívnymi vstupmi. Beta.",
      },
      cron: {
        title: "Úloha cron",
        body: "Každý koncový bod sa dá spustiť podľa harmonogramu. Používa rovnakú obsluhu bez druhého kódu.",
      },
    },
    maturity: {
      stable: {
        title: "V produkcii",
        body: "Na tomto kóde beží {{appName}} vrátane webu, CLI, MCP, nástrojov AI, úloh cron, aktualizácií v reálnom čase a platieb.",
      },
      beta: {
        title: "Beta",
        body: "Obrazovky React Native, synchronizácia medzi inštanciami a vzdialené zručnosti fungujú, hoci ešte majú nedostatky.",
      },
      churn: {
        title: "Počítaj so zmenami",
        body: "Jeden tím a rýchly vývoj. Sémantické verziovanie zatiaľ nepoužívame a dokumentácia za kódom zaostáva. Pripni si konkrétny commit alebo si vytvor vlastnú vetvu repozitára.",
      },
    },
  },
  faq: {
    title: "Časté otázky vývojárov",
    free: {
      q: "Existuje bezplatný prístup k API?",
      a: "API sprístupní ktorékoľvek predplatné od {{subPrice}} mesačne alebo kredity pridelené naším tímom. Bezplatné kredity na čet prístup k API nesprístupnia.",
    },
    sdks: {
      q: "Ktoré SDK a nástroje fungujú?",
      a: "Oficiálne SDK OpenAI a Anthropic, všetky knižnice kompatibilné s OpenAI a programovací agenti ako Claude Code, Codex CLI, OpenCode, Aider, Cline a Continue. Zmeň základnú URL a kľúč.",
    },
    uncensored: {
      q: "Môžem cez API používať modely bez cenzúry?",
      a: "Áno. Na stránke kľúčov API raz potvrď vek aspoň 18 rokov a potom ich volaj ako iné modely. Modely upravené metódou abliteration aj UncensoredLM používajú rovnaké koncové body.",
    },
    media: {
      q: "Podporuje API obrázky, hlas, video aj hudbu?",
      a: "Áno, stačí rovnaký kľúč. `/v1/images`, `/v1/audio`, `/v1/videos` a `/v1/music` sa riadia formátom OpenAI tam, kde existuje. V dokumentácii API nájdeš každý koncový bod.",
    },
    limits: {
      q: "Aké sú limity požiadaviek?",
      a: "Bez pevného limitu požiadaviek. Používanie sa účtuje za každé volanie z tvojich kreditov a platí veľkorysá ochrana proti zneužitiu (vysoké stropy pre špičky aj súbežné streamy). Chyby 429 od poskytovateľov posielame ďalej s hlavičkou `Retry-After`. Plánuješ veľmi vysoký objem? Použi kontaktný formulár nižšie.",
    },
    selfHost: {
      q: "Je prevádzka na vlastnom serveri bezplatná?",
      a: "Áno. Zdrojový kód je otvorený. Aplikácia má licenciu MIT a framework GPL v3. Použi vlastné kľúče poskytovateľov alebo spoj inštaláciu s účtom {{appName}} a plať za spotrebu.",
    },
  },
  contact: {
    eyebrow: "Funkčný koncový bod",
    title: "Máš otázky alebo staviaš niečo väčšie?",
    description:
      "Pomôžeme s nastavením, vlastnými integráciami aj posúdením architektúry. Odpovie tím, ktorý platformu postavil. Formulár používa kontaktný koncový bod z časti o frameworku.",
  },
  code: {
    copy: "Kopírovať",
    copied: "Skopírované",
    wrap: "Zalomiť riadky",
    anthropic: "Anthropic",
  },
};
