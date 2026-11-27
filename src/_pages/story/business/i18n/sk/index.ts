import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Účtovníctvo, CRM a AI na vlastnom serveri | {{appName}}",
    description:
      "Podvojné účtovníctvo, fakturácia, nákup, sklad, pokladnica, CRM a newslettery v jednej open-source aplikácii. Beží na tvojom serveri. Každá funkcia je nástroj, ktorý tvoja AI vie použiť.",
    category: "Firmy",
    imageAlt: "{{appName}} na vlastnom serveri: účtovníctvo, CRM a AI",
    keywords:
      "účtovný softvér na vlastnom serveri, open-source ERP, open-source účtovníctvo, podvojné účtovníctvo, fakturačný softvér, účtovníctvo s AI, CRM na vlastnom serveri, {{appName}}",
  },
  hero: {
    badge: "Open-source softvér pre firmy",
    title: "Tvoje účtovníctvo. Tvoj server.",
    titleHighlight: "AI je súčasťou.",
    subtitle:
      "Podvojné účtovníctvo, fakturácia, nákup, sklad, pokladnica, CRM a newslettery v jednej open-source aplikácii. Beží na tvojom serveri. Každá funkcia je nástroj, ktorý tvoja AI vie použiť.",
    ctaStart: "Spusti si to sám",
    ctaGithub: "Pozrieť na GitHube",
    shotAlt:
      "Obratová predvaha ukážkovej spoločnosti. Súčet strany Má dať sa rovná súčtu strany Dal.",
    stats: {
      actions: "akcií, ktoré spustí tvoja AI",
      reports: "zostáv priamo z hlavnej knihy",
      charts: "účtové rozvrhy: SKR03, ÖKR, SK, IFRS",
      languages: "vstavaných jazykov",
    },
  },
  trialBalance: {
    sample: "Ukážka účtov · {{date}} · EUR",
    account: "Účet",
    debit: "Má dať",
    credit: "Dal",
    bank: "Banka",
    sales: "Tržby",
    wages: "Mzdy",
    total: "Súčet výkazu",
    open: "Pozrieť celý výkaz",
  },
  ledger: {
    eyebrow: "Účtovníctvo",
    title: "Podvojne. Bez výnimiek.",
    intro:
      "Faktúry, dodávateľské faktúry, platby aj predaj z pokladnice sa zaúčtujú do hlavnej knihy samé, vrátane cudzích mien s dennými kurzami ECB, realizovaných kurzových rozdielov a závierkového precenenia. Má dať sa musí rovnať Dal, inak sa nezaúčtuje nič.",
    points: {
      balanced: {
        title: "Zaúčtujú sa len vyrovnané zápisy",
        body: "Každý zápis potrebuje aspoň dva riadky a presnú rovnováhu. Kontroluje sa pri vytvorení, zaúčtovaní aj storne.",
      },
      final: {
        title: "Zaúčtované je konečné",
        body: "Chyba sa opraví stornovacím zápisom s opačným účtovaním a odkazom na pôvodný zápis.",
      },
      periods: {
        title: "Obdobia, ktoré sa uzatvárajú",
        body: "Účtovať možno len v otvorenom období. Obdobie nemožno uzavrieť, kým obsahuje rozpracované zápisy. Systém zaznamená, kto ho uzavrel.",
      },
      templates: {
        title: "Začni podľa krajiny",
        body: "Nemecko (SKR03), Rakúsko (ÖKR) alebo Slovensko (SK): sadzby DPH, pokladnica a bankový účet hneď v balíku. Inde: všeobecný rozvrh IFRS, sadzby si doplníš.",
      },
    },
    reportsLabel: "Zostavy priamo z hlavnej knihy",
    reports: {
      balanceSheet: "Súvaha",
      profitLoss: "Výkaz ziskov a strát",
      trialBalance: "Obratová predvaha",
      aging: "Pohľadávky podľa splatnosti",
      vat: "Prehľad DPH",
      payablesAging: "Záväzky podľa splatnosti",
      journalExport: "Export denníka do CSV",
      taxFilings:
        "Daňové priznania podľa krajiny (SK DPH/KV, DE UStVA/EÜR, AT UVA, všeobecná DPH)",
    },
    shotAlt:
      "Dodávateľské faktúry so stavom a sumami v administrácii {{appName}}",
  },
  flows: {
    eyebrow: "Peniaze dnu, peniaze von",
    title: "Od ponuky po hlavnú knihu bez prepisovania.",
    intro:
      "Jednou akciou vytvoríš z dokladu ďalší doklad v poradí. Účtovné zápisy vznikajú priebežne.",
    posted: "Zaúčtované",
    sales: {
      title: "Predaj",
      steps: {
        estimate: "Cenová ponuka",
        invoice: "Faktúra",
        payment: "Platba zaevidovaná",
      },
      note: "Dobropisy, firemné PDF so ZUGFeRD a platobným QR kódom (PAY by square, EPC), odosielanie e-mailom s históriou doručenia, opakované faktúry a online platobné odkazy cez Stripe.",
    },
    purchasing: {
      title: "Nákup",
      steps: {
        order: "Objednávka",
        receipt: "Príjem tovaru",
        bill: "Dodávateľská faktúra",
        payment: "Uhradená",
      },
      note: "Dodávatelia s predvolenou sadzbou DPH. Čiastočné dodávky sa sledujú po riadkoch. Príjemka naskladní tovar.",
    },
    pos: {
      title: "Pokladnica",
      steps: {
        session: "Otvoriť pokladnicu",
        order: "Zaúčtovať nákup",
        payment: "Hotovosť, karta alebo prevod",
      },
      note: "Predaj a vrátenia odpisujú sklad pokladnice a účtujú náklady na predaný tovar (COGS) s nastaviteľným pravidlom pre záporný stav. Pri uzávierke porovnáš hotovosť.",
    },
    inventory: {
      title: "Sklad",
      body: "Sklady, príjmy, výdaje a úpravy, presuny medzi pobočkami. Každý pohyb ide do nemenného záznamu aj s tým, kto ho urobil.",
    },
  },
  suite: {
    eyebrow: "Okolo účtovníctva",
    title: "Zvyšok firmy v tej istej aplikácii.",
    intro:
      "Jedno prihlásenie, jedna databáza, jedna administrácia. Žiadne synchronizovanie piatich predplatných.",
    aiLabel: "Akýkoľvek model",
    toolCount: "Počet akcií: {{count}}",
    cards: {
      crm: {
        title: "CRM a potenciálni zákazníci",
        body: "Import kontaktov z CSV, obchodné príležitosti a oslovovanie, export kedykoľvek.",
      },
      newsletter: {
        title: "Newsletter a kampane",
        body: "Dvojité potvrdenie, odhlásenie jedným klikom, spracovanie nedoručených e-mailov, e-mailové sekvencie.",
      },
      messaging: {
        title: "Schránka a správy",
        body: "Tvoja pošta cez IMAP a SMTP, k tomu SMS, Telegram a WhatsApp Business.",
      },
      payments: {
        title: "Fakturácia predplatného",
        body: "Platby cez Stripe a kryptomeny, webhooky a vrátenie peňazí pre predplatné.",
      },
      team: {
        title: "Firmy a roly",
        body: "Viac firiem v jednej inštancii. Členov tímu pozvi ako vlastníka, správcu, účtovníka, člena alebo používateľa s prístupom len na čítanie.",
      },
      ai: {
        title: "Agenti podľa plánu",
        body: "Agenti spúšťajú zostavy a kontroly podľa plánu. S tvojím účtom {{appName}} alebo vlastným kľúčom poskytovateľa.",
      },
    },
  },
  ai: {
    eyebrow: "AI, ktorá pracuje",
    title: "Opýtaj sa svojho účtovníctva. Odpovede, nie grafy.",
    intro:
      "Každá účtovná akcia je typovaný nástroj. Tvoja AI volá ten istý kód ako tlačidlá v administrácii, s tými istými kontrolami.",
    points: {
      chat: "Pýtaj sa vlastnými slovami. Model spustí zostavu a vysvetlí ju.",
      cli: "Mesačnú uzávierku naskriptuješ v termináli. Každý nástroj je príkaz CLI.",
      mcp: "Claude Code, Cursor a Codex sa k rovnakým nástrojom dostanú cez MCP.",
      permissions:
        "Agent koná ako používateľ, ktorý ho spustil. Rovnaká rola vo firme, rovnaké kontroly.",
    },
    demo: {
      label: "Príklad",
      question: "Kto nám dlhuje peniaze a koľko mešká?",
      tool: "Pohľadávky podľa splatnosti",
      answer:
        "Traja zákazníci majú faktúry po splatnosti za 4 180 EUR. Najväčšia pohľadávka vo výške 2 380 EUR je 47 dní po splatnosti. Chceš aj čísla faktúr?",
    },
    tabs: {
      cli: "CLI",
      mcp: "MCP",
    },
  },
  compare: {
    eyebrow: "Rozdiel",
    title: "Bežný účtovný SaaS verzus tvoj vlastný server.",
    intro:
      "Hostované nástroje sú pohodlné. Toto za to dávaš, a tu ešte vyhrávajú.",
    colSaas: "Bežný účtovný SaaS",
    colUs: "{{appName}} na vlastnom serveri",
    colSaasShort: "SaaS",
    colUsShort: "Vlastný server",
    rows: {
      data: {
        label: "Kde je tvoje účtovníctvo",
        saas: "V ich cloude, za ich podmienok",
        us: "Na tvojom serveri, v tvojom Postgrese",
      },
      seats: {
        label: "Cena za používateľa",
        saas: "Mesačný poplatok za každého používateľa",
        us: "Bez poplatkov za používateľa. Platíš za hosting a použitú AI.",
      },
      ai: {
        label: "AI",
        saas: "Ako doplnok, alebo vôbec",
        us: "Každá funkcia je nástroj pre AI, s ľubovoľným modelom",
      },
      code: {
        label: "Zdrojový kód",
        saas: "Uzavretý",
        us: "Otvorený na GitHube",
      },
      missing: {
        label: "Chýba ti funkcia",
        saas: "Čakáš na roadmapu",
        us: "Postav si ju: jeden definičný súbor",
      },
      exit: {
        label: "Odchod",
        saas: "Export v rozsahu, ktorý dovolia",
        us: "Je to už tvoja databáza",
      },
      filings: {
        label: "Napojenie na banku a daňové hlásenia",
        saas: "Často v cene",
        us: "Vstavané: bankový feed Enable Banking, import výpisov (CAMT.053, MT940, CSV) a párovanie, plus exporty SK DPH/KV, DE UStVA/EÜR, AT UVA a všeobecná DPH.",
      },
      hosting: {
        label: "Prevádzka",
        saas: "Urobia ju za teba",
        us: "Prevádzkuješ sám. Ak treba, pomôžeme.",
      },
    },
  },
  start: {
    eyebrow: "Inštalácia",
    title: "Tri príkazy. Potom založ firmu.",
    intro:
      "Naklonuj, nainštaluj, spusti. Sprievodca nastaví prihlásenie admina a AI. Potom pridáš firmu v administrácii. Nemecko, Rakúsko alebo Slovensko: účtový rozvrh, sadzby DPH, pokladnica a bankový účet v jednom kroku. Inde: všeobecný rozvrh IFRS ako základ.",
    terminalTitle: "Spusti svoju inštanciu",
    guide: "Celý návod na vlastnú inštaláciu",
    developers: "Postav si vlastné moduly",
  },
  code: {
    copy: "Kopírovať",
    copied: "Skopírované",
    wrap: "Zalamovať riadky",
  },
  help: {
    title: "Presúvaš sem údaje spoločnosti?",
    description:
      "Pomoc s inštaláciou, migrácia dát, moduly na mieru. Každú správu číta človek.",
  },
};
