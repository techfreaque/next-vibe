import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Pomoc a dokumentácia",
  tag: "Pomoc",
  uncategorized: "Ostatné",
  admin: {
    recordBackTo: "Späť na {{section}}",
    recordAccessDenied: "K tomuto záznamu nemáte prístup",
    overviewLoadError: "Prehľad sa nepodarilo načítať",
    accountMenu: "Nastavenia účtu",
    homeDescription:
      "Spravujte platformu a skontrolujte, čo si vyžaduje Vašu pozornosť.",
    new: "Nové",
    destinations: "Zoznamy a výkazy",
    noDestinations:
      "V tejto oblasti nie sú dostupné žiadne zoznamy ani výkazy.",
    automations: "Automatizácie",
    developer: "Nástroje pre vývojárov",
    openDeveloper: "Otvorte katalóg pre vývojárov",
    title: "Správa platformy",
    workspaces: "Pracovné oblasti",
    pinned: "Pripnuté nástroje",
    categoryTools: "Nástroje v tejto oblasti",
    results: "Výsledky vyhľadávania",
    resultsForOne: "1 výsledok pre „{{query}}“",
    resultsFor: "Výsledky pre „{{query}}“: {{count}}",
    jumpTo: "Alebo otvorte pracovnú oblasť",
    tool: "Nástroj",
  },
  erp: {
    navigation: {
      sales: "Predaj",
      purchases: "Nákup",
      invoices: "Vydané faktúry",
      estimates: "Cenové ponuky",
      bills: "Prijaté faktúry",
    },
    overview: {
      noCompany:
        "Vytvorte spoločnosť alebo sa pridajte k existujúcej a použite tento nástroj.",
      chooseCompany: "Vyberte spoločnosť, ktorej prehľad chcete zobraziť.",
      loading: "Načítava sa prehľad firmy",
      loadError: "Prehľad firmy sa nepodarilo načítať",
    },
    home: "Domov",
    title: "Účtovníctvo",
    description:
      "Nastavte firmu, spravujte faktúry a pripravte účtovníctvo na mesačnú uzávierku.",
    companies: "Spravovať firmy",
    activeDescription: "Skontrolujte účtovníctvo a pripravte ďalšiu faktúru.",
    newInvoice: "Nová faktúra",
    createCompany: "Nastaviť firmu",
    companySwitch: {
      label: "Účtovaná firma",
      select: "Vybrať firmu",
      current: "Aktuálna firma: {{name}}",
    },
    workflows: "Bežné úlohy",
    sales: {
      title: "Vystavte faktúru odberateľovi",
      description:
        "Pripravte návrh faktúry alebo otvorte existujúcu faktúru a zaevidujte úhradu.",
      primary: "Vytvoriť faktúru",
      secondary: "Zobraziť faktúry",
    },
    expenses: {
      title: "Zaevidujte dodávateľskú faktúru",
      description:
        "Zaúčtujte záväzok voči dodávateľovi a sledujte úhradu na faktúre.",
      primary: "Pridať dodávateľskú faktúru",
      secondary: "Zobraziť dodávateľské faktúry",
    },
    receivables: {
      title: "Zistite, kto vám dlhuje",
      description:
        "Pozrite si neuhradené pohľadávky podľa počtu dní po splatnosti.",
      primary: "Zobraziť pohľadávky",
    },
    payables: {
      title: "Skontrolujte záväzky voči dodávateľom",
      description:
        "Pozrite si neuhradené záväzky, faktúry na schválenie a sporné sumy.",
      primary: "Zobraziť záväzky",
    },
    bank: {
      title: "Importujte bankové pohyby",
      description:
        "Importujte výpis vo formáte CSV a skontrolujte nespárované transakcie.",
      primary: "Importovať bankový výpis",
      secondary: "Zobraziť nespárované transakcie",
    },
    stock: {
      title: "Skontrolujte zásoby",
      description: "Skontrolujte stav zásob a zistite, čo treba doplniť.",
      primary: "Otvoriť zásoby",
    },
    tax: {
      title: "Skontrolujte DPH",
      description:
        "Pred podaním priznania si overte sumy DPH za zdaňovacie obdobie.",
      primary: "Otvoriť prehľad DPH",
    },
    exports: {
      title: "Skontrolujte a exportujte účtovný denník",
      description:
        "Preverte nezrovnalosti alebo stiahnite zaúčtované zápisy vo formáte CSV.",
      primary: "Skontrolovať účtovné zápisy",
      secondary: "Otvoriť export denníka",
    },
    close: {
      title: "Uzavrite účtovné obdobie",
      description: "Pred uzavretím obdobia skontrolujte obratovú predvahu.",
      primary: "Zobraziť obdobia",
      secondary: "Otvoriť obratovú predvahu",
    },
  },
  catalog: {
    moreMatches: "Ďalšie výsledky ({{count}})",
    title: "Katalóg nástrojov",
    searchLabel: "Vyhľadať v katalógu nástrojov",
    searchAction: "Vyhľadať nástroje",
    clearSearch: "Vymazať vyhľadávanie",
    overview: "Prehľad firmy",
    allTools: "Všetky nástroje",
    selectRecord: "Vyberte záznam, ktorého podrobnosti chcete zobraziť.",
    openRecord: "Otvoriť záznam",
    findRecord: "Vyhľadať záznam",
    recordPlaceholder: "Názov, e-mail alebo referencia",
    loadError: "Katalóg sa nepodarilo načítať",
    retry: "Skúsiť znova",
    noTools: "V tomto zobrazení nie sú dostupné žiadne nástroje",
    noMatches:
      "Vyhľadávanie výrazu „{{query}}“ nenašlo žiadne nástroje. Skúste iný názov.",
    openPrimary: "Otvoriť: {{title}}",
    allInCategory: "Všetky nástroje",
    general: "Všeobecné",
    toolUnavailable: "Dostupné na inej platforme",
    previous: "Predchádzajúca",
    next: "Nasledujúca",
    page: "Strana {{page}} z {{total}}",
    openSidebar: "Otvoriť bočný panel nástrojov",
    browse: "Prehliadať nástroje",
    backHome: "Prejsť na úvod správy",
    toolUnavailableHint:
      "Odkaz už nemusí byť platný alebo vaša rola nemá prístup. Otvorte prehľad nástrojov, ktoré máte k dispozícii.",
    openError: "Nástroj sa nepodarilo otvoriť",
    toolNotFound: "Tento nástroj nie je dostupný",
    localInstance: "Miestna inštancia",
    allowTool: "Povoliť nástroj pre AI",
    blockTool: "Zakázať nástroj pre AI",
    pinWeb: "Pripnúť na bočný panel",
    unpinWeb: "Odopnúť z bočného panela",
    webSidebar: "Bočný panel",
    webSidebarHint: "Nástroje pripnuté na bočnom paneli.",
  },
  groups: {
    ai: "AI",
    analytics: "Rast",
    business: "Podnikanie",
    system: "Prevádzka",
    comms: "Komunikácia",
    platform: "Platforma",
    people: "Ľudia a CRM",
    billing: "Fakturácia a platby",
    content: "Obsah",
  },
  get: {
    title: "Pomocník pre nástroje",
    titleShort: "Pomocník",
    description:
      "Vyhľadajte dostupné nástroje. Volanie bez parametrov zobrazí všetky nástroje a kategórie. Parametrom query vyhľadáte podľa názvu, popisu alebo aliasu. Parametrom toolName získate úplnú schému parametrov. Parametrom category vyberiete kategóriu. Stránkovanie nastavíte pomocou page a pageSize. Predvolená veľkosť stránky pre AI a MCP je 100.",
    tags: {
      tools: "nástroje",
    },
    fields: {
      interactive: {
        label: "Interaktívne zobrazenie",
        description: "Otvorte úplný interaktívny katalóg nástrojov.",
      },
      query: {
        label: "Vyhľadávací výraz (voliteľný)",
        description:
          "Vyhľadajte nástroje podľa kľúčových slov. Výsledok musí obsahovať všetky slová oddelené medzerou. Vyhľadávanie nerozlišuje veľké a malé písmená a zahŕňa názvy, aliasy, popisy a značky. Presná zhoda názvu alebo aliasu má prednosť a zobrazí podrobnosti. Bez výrazu sa zobrazia všetky nástroje.",
        placeholder: "Napríklad načítanie adresy URL, tvorba obrázkov, pamäť…",
      },
      category: {
        label: "Filter kategórie",
        description:
          "Filtrujte podľa názvu kategórie alebo podkategórie. Zadajte kľúč nadradenej kategórie, napríklad ai, alebo názov podkategórie, napríklad Search. Na veľkosti písmen nezáleží. Bez filtra sa zobrazia všetky kategórie.",
      },
      toolName: {
        label: "Názov nástroja na zobrazenie podrobností",
        description:
          "Získajte úplnú schému parametrov podľa presného toolName, napríklad agent_search_brave_GET, alebo aliasu. Pred volaním neznámeho nástroja si schému skontrolujte.",
      },
      page: {
        label: "Strana",
        description: "Číslo strany výsledkov. Predvolená hodnota je 1.",
        title: "Číslo aktuálnej strany",
      },
      pageSize: {
        label: "Počet výsledkov na strane",
        description:
          "Počet výsledkov na strane. Predvolená hodnota je 100 v AI a MCP a 800 na webe a v CLI. Najviac 1 000.",
        title: "Použitý počet výsledkov na strane",
      },
      tools: {
        title: "Dostupné nástroje",
      },
      totalCount: {
        title: "Celkový počet nástrojov",
      },
      matchedCount: {
        title: "Počet zodpovedajúcich nástrojov",
      },
      categories: {
        title: "Kategórie nástrojov",
      },
      hint: {
        title: "Tip na použitie",
      },
      pinnedCount: {
        title: "Počet pripnutých nástrojov",
      },
      allowedCount: {
        title: "Počet povolených nástrojov",
      },
      webPinnedCount: {
        title: "Počet nástrojov pripnutých na webe",
      },
      currentPage: {
        title: "Aktuálna strana",
      },
      effectivePageSize: {
        title: "Použitý počet výsledkov na strane",
      },
      totalPages: {
        title: "Celkový počet strán",
      },
      parameters: {
        title: "Parametre",
      },
      aliases: {
        title: "Aliasy",
      },
      openTool: {
        label: "Otvoriť nástroj",
      },
      platform: {
        label: "Platforma",
        description:
          "Zobrazí nástroje dostupné na vybranej platforme. Filter môžu použiť iba správcovia. Hodnota all zobrazí všetky platformy.",
      },
      includeProdOnly: {
        label: "Zahrnúť nástroje určené iba pre produkciu",
        description:
          "Po zapnutí sa zobrazia aj nástroje označené ako dostupné iba v produkcii. Túto voľbu môžu použiť iba správcovia. Hodnota all vo filtri platformy zobrazí nástroje naprieč platformami.",
      },
      platforms: {
        title: "Dostupné platformy",
      },
      viewAsRole: {
        label: "Zobraziť ako používateľská rola",
        description:
          "Skontrolujte, ktoré nástroje môže zobraziť vybraná rola. Túto voľbu môžu použiť iba správcovia.",
        options: {
          admin: "Správca",
          customer: "Zákazník",
          public: "Verejnosť",
        },
      },
      instanceId: {
        label: "ID inštancie",
        description:
          "Voliteľne zobrazte iba nástroje určitej vzdialenej inštancie. Bez tejto hodnoty sa prehľadajú miestne nástroje.",
      },
      pinnedToolIds: {
        label: "ID pripnutých nástrojov",
        description:
          "Voliteľný zoznam ID nástrojov, ktoré si používateľ pripol. Výsledky obsahujú len tieto nástroje. Hodnota totalCount stále označuje celkový počet.",
      },
      statsFilter: {
        label: "Filter nástrojov",
        description:
          "Zobrazte všetky, iba pripnuté alebo iba povolené nástroje.",
      },
    },
    hints: {
      noCapabilitySnapshot:
        "Pre inštanciu „{{instanceId}}“ chýba zoznam dostupných funkcií. Pripojte ju a počkajte na ďalšiu synchronizáciu.",
      remoteFullSchema:
        'Úplná schéma nástrojov inštancie „{{instanceId}}“. Počet: {{count}}. Volanie: execute-tool toolName="{{instanceId}}__<name>" input={...}.',
      remoteList:
        "Zo vzdialenej inštancie „{{instanceId}}“ zodpovedá {{matched}} z {{total}} nástrojov. Ak chcete úplné schémy, zúžte výsledky na najviac {{detailThreshold}} položiek alebo zadajte toolName= pre konkrétny nástroj.{{pagination}}",
      toolNotFound:
        "Nástroj „{{name}}“ sa nenašiel. Vyhľadajte ho podľa kľúčového slova pomocou query.",
      detailMode:
        'Volanie: execute-tool toolName="{{name}}"{{aliases}}. V CLI: vibe {{name}} [--field=value].',
      detailModeAliases: " (aliasy: {{aliases}})",
      noToolsMatched:
        "Žiadny nástroj nevyhovuje vyhľadávaniu. Skúste všeobecnejší výraz alebo spustite volanie bez parametrov a zobrazte všetky kategórie.",
      compactFullSchema:
        'Úplná schéma nástrojov. Počet: {{count}}. Volanie: execute-tool toolName="<name>" input={...}.',
      compactCategoryOnly:
        'Počet nástrojov: {{matched}}. Počet kategórií: {{categories}}. Parametrom category="<name>" vyberte kategóriu alebo podkategóriu. Pod hranicou {{listThreshold}} sa zobrazia názvy nástrojov, pod hranicou {{detailThreshold}} úplné schémy.',
      compactList:
        'Počet nástrojov: {{matched}}. Pre úplné schémy zúžte výsledky na najviac {{detailThreshold}} položiek alebo zadajte toolName="<name>" pre konkrétny nástroj. Volanie: execute-tool toolName="<name>".{{pagination}}',
      cliFullDetail:
        "Zobrazené podrobnosti nástrojov. Počet: {{count}}. V CLI použite vibe <name> [--field=value].",
      cliList:
        "Strana {{page}} z {{total}}. Počet zodpovedajúcich nástrojov: {{matched}}. Podrobnosti zobrazíte príkazom vibe help <name>.",
      cliListSingle:
        "Počet zodpovedajúcich nástrojov: {{matched}}. Podrobnosti zobrazíte príkazom vibe help <name>.",
      pagination: " Strana {{page}} z {{total}}. Pokračujte s page={{next}}.",
      paginationCli: " · vibe help --page={{next}}",
    },
    success: {
      title: "Nástroje sú načítané",
      description: "Dostupné nástroje sú pripravené na zobrazenie.",
    },
    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "Parametre požiadavky sú neplatné.",
      },
      network: {
        title: "Chyba pripojenia",
        description: "Nepodarilo sa pripojiť k serveru.",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na zobrazenie nástrojov sa prihláste.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie na prístup k nástrojom.",
      },
      notFound: {
        title: "Nástroje sa nenašli",
        description: "Koncový bod pre nástroje sa nenašiel.",
      },
      server: {
        title: "Chyba servera",
        description: "Nástroje sa nepodarilo načítať.",
      },
      unknown: {
        title: "Neočakávaná chyba",
        description: "Nastala neočakávaná chyba.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny.",
      },
      conflict: {
        title: "Konflikt údajov",
        description: "Pri načítaní nástrojov nastal konflikt.",
      },
    },
  },
  interactive: {
    post: {
      title: "Interaktívny režim",
      description: "Prehliadajte API trasy v strome súborov a spúšťajte ich.",
      category: "Systémový pomocník",
      tags: {
        system: "systém",
        help: "pomoc",
      },
      summary: "Spustiť interaktívny režim",
    },
    ui: {
      title: "Interaktívny prehliadač API",
      description: "Prehliadajte a spúšťajte všetky",
      availableEndpoints: "dostupné koncové body",
      endpointsLabel: "Koncové body",
      aliasesLabel: "Aliasy:",
      selectEndpoint: "Začnite výberom koncového bodu zo zoznamu.",
    },
    response: {
      started: "Interaktívny režim sa spustil.",
    },
    errors: {
      cliOnly: {
        title: "Dostupné iba v CLI",
        description: "Interaktívny režim je dostupný iba cez CLI.",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Pred spustením interaktívneho režimu sa prihláste.",
      },
      server: {
        title: "Chyba servera",
        description: "Interaktívny režim sa nepodarilo spustiť.",
      },
    },
    success: {
      title: "Úspešne dokončené",
      description: "Interaktívny režim sa spustil.",
    },
    grouping: {
      category: "Kategória",
      tags: "Značky",
      path: "Cesta",
    },
  },
  post: {
    title: "Zobraziť pomocníka",
    description: "Zobrazte pomoc k príkazom CLI.",
    form: {
      title: "Možnosti pomocníka",
      description:
        "Získajte pomoc ku konkrétnemu príkazu alebo všeobecný návod.",
    },
    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "Parametre príkazu pomocníka sú neplatné.",
      },
      network: {
        title: "Chyba pripojenia",
        description: "Pomocníka sa nepodarilo načítať.",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na zobrazenie pomocníka sa prihláste.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie zobraziť pomocníka.",
      },
      notFound: {
        title: "Príkaz sa nenašiel",
        description: "Zadaný príkaz sa nenašiel.",
      },
      server: {
        title: "Chyba servera",
        description: "Pomocníka sa nepodarilo vytvoriť.",
      },
      unknown: {
        title: "Neočakávaná chyba",
        description: "Pri vytváraní pomocníka nastala neočakávaná chyba.",
      },
      conflict: {
        title: "Konflikt údajov",
        description: "Pri vytváraní pomocníka nastal konflikt.",
      },
    },
    success: {
      title: "Pomocník je pripravený",
      description: "Informácie pomocníka boli vytvorené.",
    },
  },
  fields: {
    command: {
      label: "Príkaz",
      description:
        "Zadajte príkaz, ku ktorému potrebujete pomoc. Pre všeobecnú pomoc nechajte pole prázdne.",
      placeholder: "Napríklad check, list, db:ping",
    },
    header: {
      title: "Hlavička",
      description: "Popis hlavičky",
    },
    title: {
      label: "Názov",
    },
    description: {
      label: "Popis",
    },
    usage: {
      title: "Použitie",
      patterns: {
        item: "Vzor",
      },
    },
    commonCommands: {
      title: "Bežné príkazy",
      items: "Príkazy",
      command: "Príkaz",
      description: "Popis",
    },
    options: {
      title: "Možnosti",
      items: "Možnosti",
      flag: "Prepínač",
      description: "Popis",
    },
    examples: {
      title: "Príklady",
      items: "Príklady",
      command: "Príkaz",
      description: "Popis",
    },
    details: {
      title: "Podrobnosti",
      category: {
        content: "Kategória",
      },
      path: {
        content: "Cesta",
      },
      method: {
        content: "Metóda",
      },
      aliases: {
        content: "Aliasy",
      },
    },
  },
  aiTools: {
    modal: {
      webPinnedLabel: "pripnuté na webe",
      webPinnedTooltip: "Nástroje pripnuté na bočný panel na rýchly prístup",
      pinnedLabel: "pripnuté",
      pinnedTooltip: "AI vidí pripnuté nástroje v každom kroku.",
      enabledLabel: "povolené pre AI",
      enabledTooltip:
        "Ak je pomocník povolený, AI môže tieto nástroje podľa potreby volať.",
      totalLabel: "spolu",
      totalTooltip: "Zrušte filter a zobrazte všetky nástroje.",
      searchPlaceholder: "Vyhľadať nástroje…",
      chipWeb: "Web",
      chipAiPins: "Pripnuté pre AI",
      chipAiAllowed: "Povolené pre AI",
      chipAll: "Všetky",
      chipCli: "CLI",
      chipMcpPinned: "Viditeľné v MCP",
      chipMcpAllowed: "Všetky v MCP",
      searchNoResults: "Žiadne výsledky",
      searchResultOne: "1 výsledok",
      searchResultMany: "Počet výsledkov: {{count}}",
      expandAll: "Rozbaliť všetko",
      collapseAll: "Zbaliť všetko",
      deselectAll: "Zrušiť celý výber",
      selectAll: "Vybrať všetko",
      resetToDefault: "Obnoviť predvolené nastavenie",
      loading: "Načítava sa…",
      noToolsFound: "Žiadny nástroj nezodpovedá vyhľadávaniu.",
      noToolsAvailable: "Žiadne nástroje AI nie sú dostupné.",
      legendActive: "Vždy v kontexte AI (pripnuté)",
      legendConfirm: "Vyžiada potvrdenie pred spustením",
      legendWebPin: "Pripnuté na bočný panel",
      stats: "Pripnuté nástroje: {{pinned}} z {{total}}",
      activeOn:
        "Nástroj je vždy v kontexte AI. Po odopnutí ho AI použije len podľa potreby.",
      activeOff:
        "Nástroj nie je v kontexte AI. Pripnite ho, aby ho AI videla v každom kroku.",
      confirmOn:
        "AI sa pred spustením opýta. Kliknutím povolíte automatické schvaľovanie.",
      confirmOff:
        "Nástroj sa spustí bez otázky. Kliknutím nastavíte povinné schválenie.",
      closeSidebar: "Zavrieť bočný panel nástrojov",
      selectTool: "Vyberte nástroj",
      selectToolHint: "Začnite výberom nástroja z bočného panela.",
      allPlatforms: "Všetky platformy",
      prodOnly: "Iba produkcia",
      adminFilters: "Filtre správcu",
      resetPins: "Obnoviť predvolené pripnutia",
      aiPinsTitle: "Pripnuté nástroje AI",
      aiPinsDescription:
        "AI má tieto nástroje k dispozícii v každej konverzácii. Môže ich volať automaticky bez osobitnej výzvy.",
      resetToDefaults: "Obnoviť predvolené nastavenia",
      noPinnedTools: "Zatiaľ nie sú pripnuté žiadne nástroje.",
      noPinnedToolsHint:
        "Prejdite si všetky nástroje a pripnite si tie, ktoré má AI používať.",
      webPinsDescription:
        "Skratky na rýchle spustenie nástrojov z bočného panela správcu.",
      aiAllowedDescription: "AI môže tieto nástroje spustiť podľa potreby.",
      noAllowedTools: "Žiadne povolené nástroje",
    },

    platformFilter: {
      all: "Všetky platformy",
      cli: "CLI",
      cliPackage: "Balík CLI",
      mcp: "MCP",
      ai: "AI",
      web: "Web",
      cron: "Cron",
      electron: "Počítačová aplikácia",
      frame: "Vložený rámec",
      skill: "Zručnosť",
      nextPage: "Stránka Next",
      nextApi: "Rozhranie Next API",
    },
    envFilter: {
      development: "Vývoj",
      production: "Produkcia",
    },
  },
  list: {
    post: {
      title: "Zobraziť dostupné príkazy",
      description:
        "Zobrazte všetky dostupné príkazy CLI s ich popismi a aliasmi.",
      form: {
        title: "Možnosti zoznamu príkazov",
        description: "Nastavte zobrazenie príkazov.",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Parametre príkazu na zobrazenie zoznamu sú neplatné.",
        },
        network: {
          title: "Chyba pripojenia",
          description: "Zoznam príkazov sa nepodarilo načítať.",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Ak chcete zobraziť zoznam príkazov, prihláste sa.",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Nemáte oprávnenie zobraziť zoznam príkazov.",
        },
        notFound: {
          title: "Zoznam sa nenašiel",
          description: "Zoznam príkazov sa nenašiel.",
        },
        server: {
          title: "Chyba servera",
          description: "Zoznam príkazov sa nepodarilo vytvoriť.",
          errorLoading: "Pri načítavaní príkazov nastala chyba: {{error}}",
        },
        unknown: {
          title: "Neočakávaná chyba",
          description:
            "Pri načítavaní zoznamu príkazov nastala neočakávaná chyba.",
        },
        conflict: {
          title: "Konflikt údajov",
          description: "Pri vytváraní zoznamu príkazov nastal konflikt.",
        },
      },
      success: {
        title: "Zoznam príkazov je pripravený",
        description: "Zoznam príkazov bol načítaný.",
      },
    },
    tag: "Pomoc",
    fields: {
      category: {
        label: "Filtrovať podľa kategórie",
        description: "Zobrazte iba príkazy vo vybranej kategórii.",
        placeholder: "Napríklad systém, databáza, používateľ",
      },
      format: {
        label: "Formát výstupu",
        description: "Vyberte formát zoznamu príkazov.",
        options: {
          tree: "Stromové zobrazenie (vnorené úrovne)",
          flat: "Jednoduchý zoznam",
          json: "Formát JSON (na spracovanie)",
        },
      },
      showAliases: {
        label: "Zobraziť aliasy",
        description: "Zobrazte všetky dostupné aliasy príkazov.",
      },
      showDescriptions: {
        label: "Zobraziť popisy",
        description: "Zahrňte popisy príkazov do výstupu.",
      },
      success: {
        label: "Úspešne dokončené",
      },
      totalCommands: {
        label: "Celkový počet príkazov",
        description: "Počet dostupných príkazov",
      },
      commandsText: {
        label: "Dostupné príkazy",
        description: "Formátovaný zoznam všetkých dostupných príkazov",
      },
      commands: {
        alias: "Alias príkazu",
        message: "Správa príkazu",
        description: "Popis príkazu",
        category: "Kategória príkazu",
        aliases: "Aliasy príkazu",
        rule: "Pravidlo príkazu",
      },
    },
    response: {
      commands: {
        title: "Dostupné príkazy",
        emptyState: {
          description: "Nenašli sa žiadne príkazy.",
        },
        alias: "Príkaz",
        path: "Cesta API",
        method: "Metóda HTTP",
        category: "Kategória",
        description: "Popis",
        aliases: "Aliasy",
      },
    },
  },
};
