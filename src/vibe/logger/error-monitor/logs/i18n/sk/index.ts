import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/sk";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  category: "Systém",

  errors: {
    repositoryInternalError: "Nastala interná chyba.",
    fetchErrorLogs: "Chybové záznamy sa nepodarilo načítať: {{error}}",
    updateErrorLog:
      "Nepodarilo sa aktualizovať stav chybového záznamu: {{error}}",
    missingTarget: "Zadajte odtlačok chyby alebo ID záznamu.",
    idNotUnique:
      "Predpone ID {{id}} zodpovedá viacero záznamov ({{count}}). Zadajte odtlačok chyby alebo celé ID.",
  },

  statusFilter: {
    all: "Všetky",
    active: "Nevyriešené",
    resolved: "Vyriešené",
  },
  levelFilter: {
    all: "Všetky úrovne",
    error: "Chyby",
    warn: "Upozornenia",
  },
  sourceFilter: {
    all: "Všetky zdroje",
    client: "Prehliadač",
    server: "Server",
  },
  trendSplit: {
    newVsRecurring: "Nové a opakované chyby",
    level: "Úroveň",
    source: "Zdroj",
  },
  sort: {
    windowOccurrences: "Najviac výskytov za obdobie",
    lastSeen: "Posledný výskyt",
    firstSeen: "Od najnovších",
    totalOccurrences: "Najviac výskytov celkovo",
  },

  get: {
    title: "Chybové záznamy",
    titleShort: "Chybové záznamy",
    description:
      "Prehľad tried chýb ukazuje presný počet nevyriešených tried, vývoj výskytov v čase, najčastejšie chyby aj dotknutých používateľov. Filtrujte podľa obdobia, stavu, úrovne, zdroja, koncového bodu alebo textu. Chybu označíte ako vyriešenú jedným kliknutím.",
    tags: {
      monitoring: "Monitorovanie",
    },
    fields: {
      group: {
        label: "Zoskupiť podobné",
        description:
          "Jeden riadok na správu. Varianty na rôznych trasách sa započítajú spolu.",
      },
      status: {
        label: "Stav",
        description: "Filtrovať podľa stavu riešenia",
      },
      search: {
        label: "Hľadať chyby",
        description: "Vyhľadáva v správach, odtlačkoch chýb alebo ID záznamov.",
        placeholder: "Vyhľadáva v správach, odtlačkoch chýb alebo ID záznamov.",
      },
      errorType: {
        label: "Typ chyby",
        description: "Filtrovať podľa typu chyby",
        placeholder: "napr. INTERNAL_ERROR",
      },
      level: {
        label: "Úroveň",
        description: "Chyby alebo varovania",
      },
      source: {
        label: "Zdroj",
        description: "Záznam z prehliadača alebo zo servera",
      },
      endpoint: {
        label: "Koncový bod alebo trasa",
        description:
          "Cesta ku koncovému bodu, jeho alias alebo trasa stránky obsahuje tento text.",
        placeholder: "napr. payment/providers",
      },
      fingerprint: {
        label: "Odtlačok chyby",
        description: "Zobraziť iba jednu chybovú triedu",
        placeholder: "Odtlačok chyby",
      },
      split: {
        label: "Rozdelenie grafu",
        description: "Podľa čoho sa zoskupujú výskyty v grafe",
      },
      sort: {
        label: "Zoradenie",
        description: "Poradie zoznamu",
      },
      limit: {
        label: "Limit",
        description: "Počet výsledkov vo výstupe",
        placeholder: "50",
      },
      offset: {
        label: "Posun",
        description: "Počet výsledkov, ktoré sa majú preskočiť",
        placeholder: "0",
      },
    },
    response: {
      logs: {
        title: "Záznamy v protokole chýb",
      },
      totalCount: {
        title: "Celkový počet",
      },
      hasMore: {
        title: "K dispozícii sú ďalšie výsledky",
      },
      unresolvedCount: {
        title: "Počet nevyriešených",
      },
      window: {
        title: "Obdobie",
      },
      kpis: {
        title: "Hlavné ukazovatele",
      },
      trend: {
        title: "Výskyty v priebehu času",
      },
      byEndpoint: {
        title: "Podľa koncového bodu",
      },
      historySince: {
        title: "História od",
      },
    },
    success: {
      title: "Záznamy sa načítali",
      description: "Chybové záznamy sa načítali.",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Neplatné parametre požiadavky",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Prístup zamietnutý",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Nenašli sa žiadne záznamy",
      },
      network: {
        title: "Chyba siete",
        description: "Nastala chyba siete",
      },
      server: {
        title: "Chyba servera",
        description: "Nepodarilo sa získať chybové protokoly",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba",
      },
      unsavedChanges: {
        titleChanges: "Neuložené zmeny",
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt údajov",
      },
    },
  },

  patch: {
    title: "Aktualizovať záznam o chybe",
    titleShort: "Aktualizovať záznam",
    description:
      "Označiť chybu ako vyriešenú alebo ju znova otvoriť podľa odtlačku",
    tags: {
      monitoring: "Monitorovanie",
    },
    fields: {
      similarTo: {
        label: "Rovnaká správa ako",
        description:
          "Vyriešiť alebo znova otvoriť všetky triedy s rovnakým hlásením, aké patrí zadanému odtlačku",
      },
      fingerprints: {
        label: "Odtlačky chýb",
        description:
          "Hromadne vyriešiť alebo znova otvoriť viacero chýb naraz. Zadajte najviac 200 odtlačkov.",
      },
      fingerprint: {
        label: "Odtlačok chyby",
        description:
          "Odtlačok chybového záznamu zo stĺpca `fingerprint`. Zadajte ho alebo použite id.",
        placeholder: "Zadajte odtlačok chyby",
      },
      id: {
        label: "ID záznamu",
        description:
          "ID riadka zo zoznamu. Zadajte celé UUID alebo aspoň jeho prvých 8 znakov. Použite namiesto fingerprint.",
        placeholder: "napr. c21bd4c7",
      },
      resolved: {
        label: "Vyriešené",
        description:
          "Hodnota true označí chybu ako vyriešenú. Hodnota false ju znova otvorí.",
      },
    },
    response: {
      fingerprint: {
        title: "Odtlačok chyby",
      },
      resolved: {
        title: "Vyriešené",
      },
      affectedRows: {
        title: "Dotknuté riadky",
      },
    },
    success: {
      title: "Záznam sa aktualizoval",
      description: "Stav chybového záznamu sa aktualizoval.",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Neplatné parametre požiadavky",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Prístup zamietnutý",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Chybový záznam sa nenašiel",
      },
      network: {
        title: "Chyba siete",
        description: "Nastala chyba siete",
      },
      server: {
        title: "Chyba servera",
        description: "Chybový záznam sa nepodarilo aktualizovať.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba",
      },
      unsavedChanges: {
        titleChanges: "Neuložené zmeny",
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt údajov",
      },
    },
  },

  post: {
    title: "Spustiť kontrolu chýb",
    description:
      "Vyhľadať opakujúce sa chyby v správach z chatu a v serverových záznamoch",
    tags: {
      monitoring: "Monitorovanie",
    },
    response: {
      errorsFound: "Nájdené chyby",
      threadsScanned: "Skontrolované vlákna",
      scanWindowFrom: "Začiatok kontrolovaného obdobia",
      scanWindowTo: "Koniec kontrolovaného obdobia",
      patterns: "Vzory chýb",
    },
    success: {
      title: "Kontrola je hotová",
      description: "Kontrola chýb sa dokončila.",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Neplatná požiadavka",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Prístup zamietnutý",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Zdroj sa nenašiel.",
      },
      network: {
        title: "Chyba siete",
        description: "Nastala chyba siete",
      },
      server: {
        title: "Chyba servera",
        description: "Kontrolu chýb sa nepodarilo spustiť.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt údajov",
      },
    },
  },

  errorMonitor: {
    name: "Monitor chýb",
    description: "Každé tri hodiny vyhľadá opakujúce sa chyby.",
  },

  widget: {
    kpi: {
      unresolvedMessages: "Správy: {{messages}} · výskyty: {{occurrences}}",
      unresolvedMatching: "Nevyriešené podľa filtrov: {{count}}",
      unresolved: "Nevyriešené triedy za celý čas",
      unresolvedHint: "Celkový počet výskytov: {{occurrences}}",
      unresolvedOutside: "Bez výskytu v tomto období: {{count}}",
      occurrences: "Výskyty",
      newClasses: "Nové triedy",
      activeClasses: "Triedy zaznamenané v období",
      affectedUsers: "Dotknutí používatelia",
      affectedLeads: "Dotknutí návštevníci",
    },
    chart: {
      noEndpoint: "Koncový bod nebol zaznamenaný",
      emptyFiltered: "V tomto období filtrom nezodpovedá žiadny výskyt.",
      trendTitle: "Výskyty",
      trendSubtitle: "Výberom stĺpca zúžite obdobie.",
      endpointTitle: "Kde nastávajú chyby",
      endpointSubtitle:
        "Koncové body a trasy podľa počtu výskytov. Výberom riadka nastavíte filter.",
      endpoint: "Koncový bod alebo trasa",
      occurrences: "Výskyty",
      classes: "Triedy",
      unresolved: "Otvorené",
      historyNote:
        "Denná história sa vedie od {{date}}. Staršie výskyty sú započítané iba v celkových súčtoch.",
      historyNone:
        "Denná história sa zatiaľ nezaznamenala. Celkové počty podľa tried sú presné.",
    },
    series: {
      new: "Nové",
      recurring: "Opakované",
      error: "Chyby",
      warn: "Upozornenia",
      client: "Prehliadač",
      server: "Server",
    },
    list: {
      viewGroup: "Zobraziť {{count}}",
      noSession: "Bez kontextu relácie",
      cliAct:
        "vykonať: vibe update-error-log --fingerprint={{fingerprint}} --resolved={{resolved}}",
      cliStatus: "Stav: {{status}}",
      groupSize: "Počet tried: {{count}}",
      resolveGroup: "Označiť všetky ako vyriešené ({{count}})",
      reopenGroup: "Znova otvoriť všetky ({{count}})",
      groupHint: "Zoskupené podľa správy",
      subtitleGrouped: "Správy v tomto období: {{count}}",
      bulkResolveOf:
        "Označiť ako vyriešené {{shown}} z {{total}} zodpovedajúcich",
      cliGroup:
        'Počet tried v skupine: {{count}}. Zoznam: vibe error-logs --group=false --search="{{search}}". Vyriešiť všetky: vibe update-error-log --similarTo={{fingerprint}} --resolved=true',
      allClear: "Filtrom nezodpovedá žiadna otvorená trieda.",
      allClearHint: "Zrušte filtre a zobrazia sa aj ostatné triedy.",
      similar: "Podobné navyše: {{count}}",
      cliFilters:
        "Hodnotami filtrov sú uvedené kľúče: --range=analytics.range.last7Days --status=statusFilter.all --level=levelFilter.error --source=sourceFilter.server --endpoint=<text> --search=<text>. Hromadná zmena: vibe update-error-log --fingerprints=<a>,<b> --resolved=true",
      more: "Ďalšie ({{count}})",
      doneResolved: "Vyriešené: {{label}}",
      doneReopened: "Znovu otvorené: {{label}}",
      doneResolvedMany: "Označené ako vyriešené: {{count}}",
      doneReopenedMany: "Znova otvorené: {{count}}",
      undo: "Vrátiť zmenu",
      dismiss: "Zavrieť",
      bulkResolve: "Označiť ako vyriešené všetky zobrazené ({{count}})",
      bulkConfirm: "Potvrdiť vyriešenie ({{count}})",
      cliHits: "{{period}} v období / {{total}} spolu",
      resolveFailed: "Zmeny sa neuložili. Skúste to znova.",
      cliResolve:
        "Vykonať: vibe update-error-log --fingerprint={{fingerprint}} --resolved={{resolved}}",
      cliHint:
        "Označiť ako vyriešené: vibe update-error-log --fingerprint=<fingerprint> --resolved=true. Podrobnosti: --fingerprint=<fingerprint>. Ďalšia strana: --offset={{next}}",
      title: "Triedy chýb",
      subtitle: "Výskyty v tomto období: {{count}}",
      hitsPeriod: "{{count}} v období",
      hitsTotal: "Spolu {{count}}",
      users: "Používatelia {{count}}",
      leads: "Návštevníci {{count}}",
      firstSeen: "prvý výskyt {{date}}",
      lastSeen: "posledný výskyt {{date}}",
      open: "Podrobnosti",
      close: "Skryť",
      focus: "Iba táto trieda",
      affected: "Dotknutí používatelia",
      affectedLeads: "Dotknutí návštevníci",
      resolving: "Ukladá sa…",
    },
    filter: {
      fingerprint: "Trieda",
      endpoint: "Koncový bod",
      search: "Hľadať",
      errorType: "Typ",
      status: "Stav",
      level: "Úroveň",
      source: "Zdroj",
    },
    emptyFiltered:
      "Žiadna skupina nezodpovedá filtrom. Zrušte niektorý filter a skúste to znova.",
    emptyActive:
      "Žiadna skupina chýb nie je aktívna. Vyriešené chyby zobrazíte výberom možnosti Všetky.",
    severity: {
      error: "Chyba",
      warning: "Upozornenie",
    },
    title: "Chybové záznamy",
    loading: "Načítavajú sa záznamy…",
    empty: "Nenašli sa žiadne chybové záznamy",
    header: {
      refresh: "Obnoviť",
      runScan: "Spustiť kontrolu",
      back: "Späť",
      activeCount: "Celkovo otvorené: {{count}}",
    },
    col: {
      message: "Správa",
      errorType: "Typ chyby",
      occurrences: "Výskyty",
      firstSeen: "Prvý výskyt",
      createdAt: "Posledný výskyt",
    },
    status: {
      active: "Nevyriešené",
      resolved: "Vyriešené",
    },
    action: {
      confirm: "Uložiť stav",
      clear: "Zrušiť filtre",
      resolve: "Vyriešiť",
      reopen: "Znovu otvoriť",
    },
    detail: {
      context: "Kontext chyby",
      stackTrace: "Výpis zásobníka",
      metadata: "Metadáta",
      collapse: "Zbaliť",
      resolved: "Vyriešené",
    },
    source: {
      client: "Prehliadač",
      server: "Server",
    },
    pagination: {
      matches: "Zodpovedajúce skupiny: {{count}}",
      info: "Strana {{page}} z {{totalPages}} (celkovo {{total}})",
      prev: "Predchádzajúce",
      next: "Ďalej",
    },
  },
};
