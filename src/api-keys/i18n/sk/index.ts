import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Účet",

  widget: {
    upgradeTitle: "Prístup k API máš pri každom pláne od {{subPrice}} mesačne",
    upgradeBody:
      "Kľúče API odomkne každý plán. Bezplatné a bonusové kredity prístup neodomykajú.",
    upgradeCta: "Odomknúť API",
    createInactiveHint: "Vyber si plán a vytvor kľúče.",
    docsLink: "Prečítať dokumentáciu API",
    back: "Späť",
    loading: "Načítavajú sa kľúče API…",
    intro:
      "Volaj modely ({{modelCount}}) zo svojho kódu alebo programovacieho agenta. Použi formát OpenAI či Anthropic. Z kreditov sa odpočíta rovnaká cena ako v chate.",
    baseUrlTitle: "Základná adresa URL",
    baseUrlHint: "SDK od OpenAI, Codex, OpenCode, Continue, Aider a Cline.",
    anthropicBaseUrlTitle: "Základná adresa URL pre Anthropic",
    anthropicBaseUrlHint:
      "Pre Claude Code a SDK od Anthropic. Použi rovnakú adresu URL bez /v1. Klienti si /v1/messages doplnia sami.",
    setupTitle: "Pripojiť nástroj",
    setupKeyFilled:
      "Nový kľúč je už v každej ukážke. Skopíruj ju, vlož a spusti. Po zatvorení sa v ukážkach znova zobrazí zástupná hodnota.",
    setupKeyMissing:
      "V ukážkach je zatiaľ {{placeholder}}. Po vytvorení kľúča sa doplní automaticky.",
    copy: "Kopírovať",
    copied: "Skopírované",
    keysTitle: "Tvoje kľúče",
    empty: "Zatiaľ nemáš žiadne kľúče API",
    emptyHint: "Vytvor kľúč a začni volať API.",
    nameLabel: "Názov kľúča",
    namePlaceholder: "napríklad Claude Code na notebooku",
    create: "Vytvoriť kľúč",
    creating: "Vytvára sa kľúč…",
    createFailed: "Kľúč sa nepodarilo vytvoriť. Skús znova.",
    newKeyTitle: "Skopíruj si kľúč",
    newKeyHint:
      "Celý kľúč sa zobrazuje iba teraz. Ukladáme iba jeho odtlačok (hash). Ak ho stratíš, vytvor si nový.",
    dismiss: "Kľúč mám uložený",
    lastUsed: "Posledné použitie",
    neverUsed: "Nikdy nepoužitý",
    created: "Vytvorené",
    revoke: "Zrušiť platnosť",
    revoking: "Platnosť sa ruší…",
    revokeFailed: "Platnosť kľúča sa nepodarilo zrušiť. Skús znova.",
    maskedKey: "{{prefix}}…",
    meta: "{{lastUsed}} · Vytvorené {{created}} · {{rate}}",
    rateLimit: "{{n}} pož./min",
    uncensoredLabel: "Povoliť modely bez cenzúry pre moje kľúče",
    uncensoredHint:
      "Mám aspoň 18 rokov a beriem na vedomie, že modely bez cenzúry môžu vytvárať urážlivý, nepravdivý, nebezpečný, nezákonný alebo škodlivý obsah bez filtrovania. Zodpovedám za jeho použitie. Bez potvrdenia vrátia ID modelov bez cenzúry HTTP 403.",
    uncensoredFailed: "Uloženie zlyhalo. Skús znova.",
    billingNote:
      "Ak nemáš kredity, API vráti HTTP 402. Streamovanie funguje vo všetkých koncových bodoch.",
  },

  codingTools: {
    blocks: {
      oneCommand: "Jeden príkaz",
      config: "Trvalé nastavenie",
      run: "Potom ho spusti",
      fields: "Nastavenia",
      check: "Over kľúč",
      request: "Prvá požiadavka",
    },
    tested: "Otestované s {{name}} {{version}}",
    anyModel:
      "Nahraď {{model}} ľubovoľným ID z GET /v1/models, napríklad {{examples}}.",
    tools: {
      codex: {
        hint: "Vlož príkaz a Codex sa pripojí k unbottled.ai. Ak chceš nastavenie ponechať, pridaj blok na koniec ~/.codex/config.toml a spúšťaj Codex s --profile unbottled.",
      },
      claudeCode: {
        hint: "Vlož príkaz a Claude Code sa pripojí k unbottled.ai. Ak chceš nastavenie ponechať, pridaj tie isté hodnoty do existujúceho bloku env v ~/.claude/settings.json. Ak vynecháš riadky s modelmi, Claude Code použije naše modely Claude pod názvami, ktoré už pozná.",
      },
      opencode: {
        hint: "Ulož ako opencode.json v projekte alebo ako ~/.config/opencode/opencode.json pre všetky projekty. Do mapy models môžeš pridať ľubovoľné ID modelu.",
      },
      continue: {
        hint: "Príkaz spustí Continue CLI. Rozšírenie IDE číta ~/.continue/config.yaml. Pridaj doň rovnaký záznam modelu.",
      },
      aider: {
        hint: "Stačí jeden príkaz. Aider očakáva pred ID modelu openai/. Na koniec príkazu uveď súbory na úpravu ako zvyčajne.",
      },
      cline: {
        hint: "Dva príkazy pre Cline CLI. Raz ulož poskytovateľa a potom spusti cline.",
      },
      openaiCompatible: {
        hint: "Funguje každý nástroj alebo SDK s poľom pre základnú adresu URL. Nástroje vo formáte OpenAI používajú URL s /v1. Nástroje vo formáte Anthropic používajú URL bez /v1. Kľúč aj modely ostávajú rovnaké.",
      },
      curl: {
        hint: "Over, či kľúč funguje, a vypíš ID všetkých dostupných modelov. Potom pošli prvú požiadavku.",
      },
    },
  },

  list: {
    title: "Kľúče API",
    titleShort: "Kľúče API",
    description:
      "Vytváraj kľúče API a ruš ich platnosť. K dispozícii sú základné adresy URL, hotové nastavenia programovacích nástrojov aj zoznam tvojich kľúčov.",
    tag: "API",
    response: {
      baseUrl: "Základná adresa URL",
      isPaid: "Platený plán",
      keys: "Kľúče",
    },
    success: {
      title: "Kľúče API načítané",
      description: "Tvoje kľúče API sa načítali",
    },
  },

  create: {
    title: "Vytvoriť kľúč API",
    titleShort: "Nový kľúč",
    description:
      "Vytvor kľúč API pre klientov OpenAI a Anthropic. Celý kľúč dostaneš iba raz.",
    tag: "API",
    form: {
      name: "Názov kľúča",
      namePlaceholder: "Na čo budeš kľúč používať?",
    },
    response: {
      key: "Kľúč API (zobrazí sa iba raz)",
      id: "ID kľúča",
      keyPrefix: "Prefix kľúča",
    },
    success: {
      title: "Kľúč vytvorený",
      description: "Skopíruj si kľúč. Znova sa nezobrazí.",
    },
    errors: {
      limit:
        "Už máš maximálny počet aktívnych kľúčov ({{max}}). Najprv zruš platnosť jedného z nich.",
      paidRequired:
        "Kľúče API vyžadujú účet s ľubovoľným plateným plánom od {{subPrice}} mesačne. Plán si aktivuj na {{url}}.",
    },
  },

  revoke: {
    title: "Zrušiť platnosť kľúča API",
    titleShort: "Zrušiť platnosť",
    description:
      "Natrvalo vypne kľúč API. Požiadavky s týmto kľúčom ihneď zlyhajú.",
    tag: "API",
    response: {
      message:
        "Platnosť kľúča sa zrušila. Požiadavky s týmto kľúčom už zlyhajú.",
    },
    success: {
      title: "Platnosť kľúča zrušená",
      description: "Kľúč API sa už nedá použiť",
    },
    errors: {
      notFound: {
        detail: "Na tvojom účte sa nenašiel aktívny kľúč s týmto ID.",
      },
    },
  },

  errors: {
    validation: {
      title: "Chyba overenia údajov",
      description: "Neplatná požiadavka",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Vyžaduje sa prihlásenie",
    },
    server: {
      title: "Chyba servera",
      description: "Interná chyba servera",
      detail: "Požiadavka pre kľúč API zlyhala: {{error}}",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Vyskytla sa neznáma chyba",
    },
    network: { title: "Chyba siete", description: "Vyskytla sa chyba siete" },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Nemáš oprávnenie na prístup",
    },
    notFound: { title: "Nenašlo sa", description: "Kľúč API sa nenašiel" },
    conflict: {
      title: "Konflikt",
      description: "Požiadavka je v rozpore s aktuálnym stavom",
    },
  },
};
