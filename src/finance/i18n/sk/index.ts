import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  spendAlert: {
    explained:
      "Účtovná evidencia vysvetľuje nárast spotreby u poskytovateľa {{provider}}.",
    unexplained: "Možné zneužitie kľúča poskytovateľa {{provider}}.",
    cap: "Výdavky za {{hours}} h: {{spend}} ({{rate}}/h, limit {{cap}}/h).",
    drain:
      "Hodinové výdavky {{rate}}/h sú {{ratio}}-násobkom priebežného priemeru {{baseline}}/h za posledných {{coveredHours}} h s dostupnými údajmi. Povolený násobok: {{limit}}.",
    ledgerCost:
      "Evidované náklady na poskytovateľov za toto obdobie: {{cost}}.",
    topWallets: "Peňaženky s najvyššou spotrebou kreditov: {{wallets}}.",
  },
  category: "Financie",
  documents: {
    clearCompany: "Zrušiť filter firmy",
    clearCustomer: "Zrušiť filter zákazníka",
    pageTotals: "Spolu · {{currency}}",
    pageDocumentCount: "Počet dokladov na tejto strane: {{count}}",
    search: "Vyhľadať doklady",
    matches: "Nájdené doklady ({{count}})",
    emptyTitle: "Filtrom nezodpovedajú žiadne doklady",
    emptyHint: "Upravte vyhľadávanie alebo filtre a skúste to znova.",
    allCompanies: "Všetky dostupné firmy",
    chooseCompany: "Vybrať firmu",
    allCustomers: "Všetci zákazníci",
    chooseCustomer: "Vybrať zákazníka",
    apply: "Použiť filtre",
    clear: "Zrušiť filtre",
    page: "Strana {{page}} z {{pages}} · Počet výsledkov: {{total}}",
    previous: "Predchádzajúca strana",
    next: "Nasledujúca strana",
    select: "Vybrať {{reference}}",
    open: "Otvoriť {{reference}}",
    noReference: "Bez referencie",
    invoices: "Odberateľské faktúry",
    bills: "Dodávateľské faktúry",
    estimates: "Cenové ponuky",
    heading: "Obchodné doklady",
  },
  tags: {
    finance: "financie",
    vibeSense: "vibe-sense",
  },
  enums: {
    source: {
      stripe: "Stripe",
      nowpayments: "NOWPayments",
      openrouter: "OpenRouter",
      nanoGpt: "NanoGPT",
      venice: "Venice",
      uncensoredAi: "uncensored.ai",
      gab: "Gab AI",
      freedomGpt: "FreedomGPT",
      modelsLab: "ModelsLab",
      edenAi: "Eden AI",
    },
    provider: {
      all: "Všetci poskytovatelia",
    },
    eventKind: {
      charge: "Platba",
      refund: "Vrátenie platby",
      dispute: "Spor o platbu",
      cancellation: "Zrušenie",
      payout: "Výplata",
      fee: "Poplatok spracovateľa platieb",
    },
    runStatus: {
      ok: "OK",
      skipped: "Vynechané",
      failed: "Zlyhalo",
    },
    alertType: {
      lowBalance: "Nízky predplatený zostatok",
      negativeMargin: "Záporná marža",
      thinMargin: "Nízka marža",
      balanceDrain: "Rýchly úbytok zostatku",
      spendSpike: "Náhly nárast výdavkov",
      refundSpike: "Náhly nárast vrátených platieb",
      disputeSpike: "Náhly nárast sporov o platby",
      cancellationSpike: "Náhly nárast zrušení",
      billingGap: "Rozdiel vo fakturácii",
    },
    severity: {
      warning: "Upozornenie",
      critical: "Kritické",
    },
    threshold: {
      openrouterAutoTopUpFloorUsd:
        "Prah upozornenia na automatické dobitie OpenRouter (USD)",
      openrouterAutoTopUpGraceHours:
        "Lehota na automatické dobitie OpenRouter (hodiny)",
      gabLowBalanceCredits: "Minimálny zostatok Gab AI (kredity)",
      uncensoredAiLowBalanceCredits:
        "Minimálny zostatok uncensored.ai (kredity)",
      freedomGptLowBalanceCredits: "Minimálny zostatok FreedomGPT (kredity)",
      nanoGptAutoTopUpFloorUsd:
        "Prah upozornenia na automatické dobitie NanoGPT (USD)",
      nanoGptAutoTopUpGraceHours:
        "Lehota na automatické dobitie NanoGPT (hodiny)",
      veniceAutoTopUpFloorUsd:
        "Prah upozornenia na automatické dobitie Venice (USD)",
      modelsLabLowBalanceUsd: "Minimálny zostatok ModelsLab (USD)",
      edenAiLowBalanceUsd: "Minimálny zostatok Eden AI (USD)",
      veniceAutoTopUpGraceHours:
        "Lehota na automatické dobitie Venice (hodiny)",
      marginFloorPct: "Minimálna marža (%)",
      drainMultiplier:
        "Násobok rýchleho čerpania (priemer za predchádzajúce obdobie)",
      hourlySpendCapUsd: "Hodinový limit výdavkov na poskytovateľa ($/h)",
      minSpikeUsd: "Najnižšie výdavky na vyhodnotenie nárastu ($)",
      refundRatePct: "Limit podielu vrátených platieb (% všetkých platieb)",
      disputeCountDaily: "Spory za deň",
      cancellationMultiplier:
        "Nárast počtu zrušení (násobok priemeru za predchádzajúce obdobie)",
      cancellationMin: "Najnižší počet zrušení na vyhodnotenie nárastu",
      billingGapPct: "Limit rozdielu vo fakturácii (% nad fakturovanou sumou)",
      alertDedupHours: "Interval opakovania upozornenia (hodiny)",
      minRevenueUsd: "Minimálne denné výnosy na vyhodnotenie marže ($)",
      minCostUsd: "Minimálne denné náklady na vyhodnotenie marže ($)",
    },
    scope: {
      all: "Všetko",
      balances: "Iba zostatky u poskytovateľov",
      revenue: "Iba tržby",
    },
    costCoverage: {
      complete: "Úplné",
      partial: "Čiastočné údaje o nákladoch",
      none: "Náklady nie sú známe",
    },
    metric: {
      stripeRevenue: "Peňažné príjmy cez Stripe (hrubé, $)",
      nowpaymentsRevenue: "Peňažné príjmy cez NOWPayments (hrubé, $)",
      netRevenue: "Čisté peňažné príjmy po vrátených platbách ($)",
      refunds: "Vrátené platby ($)",
      upstreamCost: "Výdavky na poskytovateľov podľa zmien zostatku ($)",
      internalBilled: "Spotrebované kredity v cenníkovej cene ($)",
      grossMarginUsd: "Krycia marža, starší výpočet ($)",
      grossMarginPct: "Krycia marža, starší výpočet (%)",
      providerSpend: "Výdavky na poskytovateľa ($)",
      providerBalance: "Zostávajúci zostatok u poskytovateľa ($)",
      providerBalanceNative:
        "Zostávajúci zostatok u poskytovateľa (kredity poskytovateľa)",
      providerCost:
        "Náklady na poskytovateľov podľa našich záznamov využitia ($)",
      costTotal: "Celkové náklady na všetkých poskytovateľov ($)",
      costPaid: "Náklady na poskytovateľov pri platenom využití ($)",
      costFree: "Náklady na poskytovateľov pri bezplatnom využití ($)",
      consumedList: "Spotrebované kredity v cenníkovej cene ($)",
      earned:
        "Výnosy zo spotrebovaných platených kreditov v ich nákupnej cene ($)",
      freeList: "Spotrebované bezplatné kredity v cenníkovej cene ($)",
      aiMarginUsd:
        "Marža AI: výnosy po odpočítaní nákladov na poskytovateľov ($)",
      aiMarginPct: "Marža AI (% z výnosov)",
      paidMarginUsd: "Marža plateného používania ($)",
      paidMarginPct: "Marža plateného používania (%)",
      alerts: "Vyvolané upozornenia",
    },
  },
  ingest: {
    title: "Import finančných údajov",
    titleShort: "Importovať",
    description:
      "Načíta skutočné tržby zo Stripe a NOWPayments aj zostatky u poskytovateľov bez zmien v zdrojových účtoch. Vypočíta dennú maržu a vytvorí upozornenia. Žiadne peniaze sa neprevedú.",
    task: {
      balancesName: "Synchronizácia zostatkov poskytovateľov",
      revenueName: "Synchronizácia tržieb",
      balances:
        "Každú hodinu načíta zostatky poskytovateľov, spočíta výdavky a upozorní na rýchle čerpanie alebo náhle nárasty.",
      revenue:
        "Denne načíta tržby zo Stripe a NOWPayments, zhrnie maržu a upozorní na vrátené platby, platobné spory a nízku maržu.",
    },
    fields: {
      scope: {
        label: "Rozsah",
        description: "Údaje na načítanie",
      },
      dryRun: {
        label: "Skúšobný režim",
        description: "Načítať a vypočítať údaje bez zápisu a odosielania",
      },
      windowDays: {
        label: "Obdobie tržieb (dni)",
        description:
          "Počet dní spätne na opätovné načítanie tržieb. Predvolená hodnota: 3.",
      },
      backfillFrom: {
        label: "Doplniť údaje od dátumu (YYYY-MM-DD)",
        description:
          "Prepočíta denné súhrny od tohto dňa v UTC po backfill-to vrátane (predvolene do dneška). Obnoví tržby z celej histórie platieb a vždy uloží výsledky, aj v skúšobnom režime. Pri bežnom importe nechajte pole prázdne.",
      },
      backfillTo: {
        label: "Doplniť údaje do dátumu (YYYY-MM-DD)",
        description: "Posledný deň prepočtu v UTC. Predvolený je dnešok.",
      },
    },
    response: {
      dryRun: "Skúšobný režim",
      ranAt: "Čas spustenia",
      sources: "Zdroje",
      days: "Denné peňažné príjmy a výdavky na poskytovateľov",
      alertsRaised: "Vyvolané upozornenia",
      alertsSuppressed: "Potlačené duplicitné upozornenia",
      alerts: "Upozornenia",
    },
    widget: {
      hint: "Načíta iba naše vlastné účty. Zdroj bez rozhrania API vynechá a zaznamená dôvod.",
      submit: "Spustiť import",
      submitting: "Prebieha načítanie…",
      result: "Výsledok importu",
      resultDry: "Skúšobný režim bez zápisu údajov a bez odosielania",
      events: "Počet riadkov: {{count}}",
      margin:
        "Denné peňažné príjmy a výdavky na poskytovateľov. Údaje o peňažných tokoch.",
      dayLine: "Príjmy: {{cash}} · Výdavky na poskytovateľov: {{cost}}",
      costUnknown: "náklady nie sú známe",
      alerts: "Upozornenia: vyvolané {{raised}}, potlačené {{suppressed}}",
    },
  },
  status: {
    title: "Financie",
    titleShort: "Financie",
    description:
      "Tržby a náklady na poskytovateľov: zostatky, marža, upozornenia a prahy.",
    response: {
      lastIngestAt: "Posledný pokus o synchronizáciu",
      lastSuccessfulIngestAt: "Posledná úspešná synchronizácia zdroja",
      asOf: "Čas kontroly stavu",
      sources: "Zdroje",
      week: "Posledných 7 dní",
      days: "Denná marža AI a peňažné toky",
      alerts: "Nedávne upozornenia",
      thresholds: "Prahové hodnoty",
    },
    widget: {
      back: "Späť",
      title: "Financie",
      refresh: "Obnoviť",
      runIngest: "Spustiť import",
      loading: "Načítavajú sa finančné údaje…",
      lastIngest: "Posledný pokus o synchronizáciu: {{when}}",
      lastSuccessful: "Posledná úspešná synchronizácia: {{when}}",
      snapshot: "Posledné načítanie od poskytovateľa: {{when}}",
      stale: "Neaktuálny zostatok",
      noBalance: "Zostatok nebol nahlásený",
      noSources: "Žiadny finančný zdroj zatiaľ neposkytol údaje.",
      never: "nikdy",
      neverRun: "Zatiaľ nespustené",
      margin: {
        title: "Marža AI (posledných 7 dní)",
        earned: "Výnosy zo spotrebovaných platených kreditov",
        cost: "Náklady na poskytovateľov",
        margin: "Marža AI",
        pct: "Marža AI (%)",
        paidPct: "Marža plateného používania (%)",
        basis:
          "Výnosy zodpovedajú spotrebovaným plateným kreditom v ich nákupnej cene. Náklady zahŕňajú používanie u poskytovateľov vrátane bezplatných kreditov v cenníkovej hodnote {{free}}.",
        cash: "Čisté peňažné príjmy: {{net}}, poplatky spracovateľa platieb: {{fees}}. Peňažný tok bez odpočítania nákladov na poskytovateľov.",
        cashDay: "Príjmy: {{net}}",
        empty: "Za posledných 7 dní nebolo zaznamenané žiadne využitie.",
        missingPct: "Bez výnosov",
      },
      providers: {
        title: "Zostatky u poskytovateľov",
        lastSpend: "Výdavky od poslednej kontroly: {{amount}}",
        lastSpendEstimate:
          "Odhadované výdavky od poslednej kontroly: {{amount}}",
        previousDaySpend: "Poplatky za API za deň {{day}} (UTC): {{amount}}",
        lastNativeSpend:
          "Poplatky za API do konca poslednej úplnej hodiny: {{amount}}",
        noSpend: "Výdavky zatiaľ neboli zmerané",
      },
      revenue: {
        title: "Zdroje tržieb",
        fallback: "Náhradný zdroj: vlastná evidencia",
      },
      alerts: {
        title: "Nedávne upozornenia",
        empty: "Žiadne zaznamenané upozornenia",
      },
      thresholds: {
        title: "Prahové hodnoty",
        hint: "Predvolené hodnoty platia, kým nenastavíte vlastnú hodnotu. Upozornenie sa zopakuje najviac raz za zvolené obdobie.",
        custom: "Vlastné",
        default: "Predvolené",
        edit: "Upraviť",
      },
    },
  },
  thresholds: {
    title: "Nastaviť finančnú prahovú hodnotu",
    titleShort: "Nastaviť prahovú hodnotu",
    description:
      "Nastavte vlastný prah upozornenia. Po vypnutí vlastného nastavenia sa použije predvolená hodnota.",
    fields: {
      key: {
        label: "Prahová hodnota",
        description: "Limit, ktorý chcete zmeniť",
      },
      value: { label: "Hodnota", description: "Nový limit" },
      enabled: {
        label: "Použiť túto hodnotu",
        description: "Vypnuté: použije sa predvolená hodnota",
      },
      note: {
        label: "Poznámka",
        description: "Dôvod nastavenia limitu",
        placeholder: "Napr. týždeň spustenia, očakávané vrátenia platieb",
      },
    },
    response: { key: "Uložená prahová hodnota" },
    widget: {
      back: "Späť",
      hint: "Zmeny sa použijú pri nasledujúcom importe.",
    },
  },
  series: {
    title: "Finančné časové rady",
    titleShort: "Financie",
    description:
      "Časové rady finančného monitorovania: tržby podľa spracovateľa platieb, čisté tržby, náklady, marža, výdavky a zostatky u poskytovateľov a upozornenia.",
    fields: {
      resolution: {
        label: "Časové rozlíšenie",
        description: "Dĺžka časového intervalu",
      },
      range: { label: "Rozsah", description: "Časové obdobie na načítanie" },
      lookback: {
        label: "Intervaly pred začiatkom rozsahu",
        description: "Počet intervalov pred začiatkom rozsahu",
      },
      metric: {
        label: "Ukazovateľ",
        description: "Časový rad, ktorý chcete zobraziť",
      },
      provider: {
        label: "Poskytovateľ",
        description: "Filtrovať výdavky na poskytovateľov a ich zostatky",
      },
      costProvider: {
        label: "Poskytovateľ na filtrovanie nákladov",
        description:
          "ID poskytovateľa API na priradenie nákladov, napríklad openrouter, nano-gpt alebo unattributed",
      },
      result: {
        label: "Časový rad",
        description: "Časové rady finančných údajov",
      },
      meta: { label: "Metadáta", description: "Metadáta spracovania" },
    },
  },
  errors: {
    validation: {
      title: "Neplatné vstupné údaje",
      description: "Skontrolujte zvýraznené polia",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Prihláste sa ako správca.",
    },
    forbidden: {
      title: "Iba pre správcov",
      description: "Finančné nástroje vyžadujú oprávnenie správcu",
    },
    notFound: {
      title: "Záznam sa nenašiel",
      description: "Záznam neexistuje.",
    },
    conflict: {
      title: "Konflikt",
      description:
        "Záznam sa medzičasom zmenil. Obnovte údaje a skúste to znova.",
    },
    server: {
      title: "Chyba servera",
      description: "Požiadavku sa nepodarilo dokončiť.",
    },
    network: {
      title: "Chyba siete",
      description: "Požiadavka sa nedostala na server.",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Nastala neočakávaná chyba.",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Najprv uložte alebo zrušte zmeny",
    },
    invalidThreshold: "Zadajte nezápornú hodnotu prahu",
    ingestFailed: "Import finančných údajov zlyhal: {{error}}",
    backfill: {
      invalidRange:
        "Zadajte platný počiatočný dátum (YYYY-MM-DD), ktorý je najneskôr v deň konca rozsahu.",
      tooWide:
        "Obdobie na doplnenie údajov je príliš dlhé. Najvyšší počet dní na jedno spustenie: {{max}}.",
    },
  },
  success: {
    title: "Hotovo",
    description: "Uložené",
  },
};
