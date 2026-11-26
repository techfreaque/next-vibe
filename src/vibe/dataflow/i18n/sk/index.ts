import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  enums: {
    resolution: {
      "1m": "1 minúta",
      "3m": "3 minúty",
      "5m": "5 minút",
      "15m": "15 minút",
      "30m": "30 minút",
      "1h": "1 hodina",
      "4h": "4 hodiny",
      "1d": "1 deň",
      "1w": "1 týždeň",
      "1M": "1 mesiac",
    },
    runStatus: {
      running: "Prebieha",
      completed: "Dokončené",
      failed: "Zlyhalo",
    },
    backtestActionMode: {
      simulate: "Simulovať",
      execute: "Spustiť",
    },
    graphOwnerType: {
      system: "Systém",
      admin: "Správca",
      user: "Používateľ",
    },
    triggerType: {
      manual: "Ručne",
      cron: "Plánované",
    },
  },
  // Standard vibe-sense field labels (used by shared/fields.ts helpers)
  fields: {
    source: { label: "Zdroj", description: "Vstupný časový rad" },
    resolution: { label: "Rozlíšenie", description: "Časový rámec výpočtu" },
    range: { label: "Rozsah", description: "Časový rozsah výpočtu" },
    lookback: {
      label: "Rozsah histórie",
      description:
        "Dodatočné intervaly pred začiatkom rozsahu na inicializáciu výpočtu",
    },
    result: { label: "Výsledok", description: "Výstupný časový rad" },
    meta: { label: "Meta", description: "Metadáta vykonania uzla" },
  },
  tags: {
    vibeSense: "vibe-sense",
    analytics: "analytika",
    pipeline: "tok údajov",
  },

  // Graph list
  graphs: {
    list: {
      title: "Grafy toku údajov",
      description: "Zobraziť všetky grafy dostupné aktuálnemu používateľovi",
      container: {
        title: "Grafy",
        description: "Všetky grafy toku údajov",
      },
      response: {
        graphs: "Grafy",
      },
      success: {
        title: "Načítané grafy",
        description: "Grafy toku údajov sa načítali",
      },
      errors: {
        unauthorized: {
          title: "Bez oprávnenia",
          description: "Vyžaduje sa prihlásenie",
        },
        forbidden: {
          title: "Prístup zakázaný",
          description: "Vyžaduje sa oprávnenie správcu.",
        },
        server: {
          title: "Chyba servera",
          description: "Nepodarilo sa načítať grafy",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
        validation: {
          title: "Overenie vstupu zlyhalo",
          description: "Neplatná požiadavka",
        },
        notFound: {
          title: "Nenájdené",
          description: "Nenašli sa žiadne grafy",
        },
        conflict: { title: "Konflikt", description: "Konflikt zdrojov" },
        network: {
          title: "Chyba siete",
          description: "Sieťová požiadavka zlyhala",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Najprv ulož zmeny",
        },
      },
    },
    create: {
      title: "Vytvoriť graf",
      description: "Vytvoriť nový graf toku údajov",
      fields: {
        name: {
          label: "Názov",
          description: "Zobrazovaný názov grafu",
          placeholder: "Môj graf",
        },
        slug: {
          label: "Slug",
          description: "Jednoznačný identifikátor",
          placeholder: "my-graph",
        },
        description: {
          label: "Opis",
          description: "Nepovinný opis",
          placeholder: "",
        },
        config: { label: "Nastavenia", description: "Konfigurácia grafu DAG" },
      },
      response: {
        id: "ID grafu",
      },
      success: {
        title: "Vytvorený graf",
        description: "Graf toku údajov bol vytvorený",
      },
      errors: {
        unauthorized: {
          title: "Bez oprávnenia",
          description: "Vyžaduje sa prihlásenie",
        },
        forbidden: {
          title: "Prístup zakázaný",
          description: "Vyžaduje sa oprávnenie správcu.",
        },
        server: {
          title: "Chyba servera",
          description: "Nepodarilo sa vytvoriť graf",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
        validation: {
          title: "Overenie vstupu zlyhalo",
          description: "Neplatná konfigurácia grafu",
        },
        notFound: { title: "Nenájdené", description: "Zdroj sa nenašiel." },
        conflict: {
          title: "Konflikt",
          description: "Graf s týmto identifikátorom už existuje.",
        },
        network: {
          title: "Chyba siete",
          description: "Sieťová požiadavka zlyhala",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Najprv ulož zmeny",
        },
      },
    },
    get: {
      title: "Získať graf",
      description: "Načítať konkrétny graf podľa ID",
      fields: {
        id: { label: "ID grafu", description: "UUID verzie grafu" },
      },
      response: {
        graph: "Graf",
      },
      success: {
        title: "Graf načítaný",
        description: "Graf sa úspešne načítal",
      },
      errors: {
        unauthorized: {
          title: "Bez oprávnenia",
          description: "Vyžaduje sa prihlásenie",
        },
        forbidden: {
          title: "Prístup zakázaný",
          description: "Prístup zamietnutý",
        },
        server: {
          title: "Chyba servera",
          description: "Nepodarilo sa načítať graf",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
        validation: {
          title: "Overenie vstupu zlyhalo",
          description: "Neplatné ID",
        },
        notFound: { title: "Nenájdené", description: "Graf sa nenašiel." },
        conflict: { title: "Konflikt", description: "Konflikt zdrojov" },
        network: {
          title: "Chyba siete",
          description: "Sieťová požiadavka zlyhala",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Najprv ulož zmeny",
        },
      },
    },
    edit: {
      title: "Upraviť graf",
      description:
        "Vytvorí novú verziu grafu z vybranej vetvy. Pôvodná verzia sa zachová.",
      fields: {
        id: {
          label: "ID grafu",
          description: "UUID verzie, z ktorej sa má vytvoriť nová vetva",
        },
        config: {
          label: "Nastavenia",
          description: "Aktualizovaná konfigurácia grafu",
        },
        name: { label: "Názov", description: "Aktualizovaný názov" },
        description: {
          label: "Opis",
          description: "Aktualizovaný opis",
        },
      },
      response: {
        id: "ID novej verzie",
      },
      success: {
        title: "Vytvorená vetva grafu",
        description: "Vytvorila sa nová verzia grafu",
      },
      errors: {
        unauthorized: {
          title: "Bez oprávnenia",
          description: "Vyžaduje sa prihlásenie",
        },
        forbidden: {
          title: "Prístup zakázaný",
          description: "Prístup zamietnutý",
        },
        server: {
          title: "Chyba servera",
          description: "Nepodarilo sa upraviť graf",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
        validation: {
          title: "Overenie vstupu zlyhalo",
          description: "Neplatná konfigurácia",
        },
        notFound: { title: "Nenájdené", description: "Graf sa nenašiel." },
        conflict: { title: "Konflikt", description: "Konflikt zdrojov" },
        network: {
          title: "Chyba siete",
          description: "Sieťová požiadavka zlyhala",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Najprv ulož zmeny",
        },
      },
    },
    promote: {
      title: "Nastaviť ako systémový graf",
      description:
        "Zmení graf správcu na zdieľaný systémový graf iba na čítanie.",
      fields: {
        id: {
          label: "ID grafu",
          description: "UUID grafu, ktorý sa má nastaviť ako systémový",
        },
      },
      response: {
        id: "ID grafu",
      },
      success: {
        title: "Graf je systémový",
        description: "Graf bol nastavený ako systémový.",
      },
      errors: {
        unauthorized: {
          title: "Bez oprávnenia",
          description: "Vyžaduje sa prihlásenie",
        },
        forbidden: {
          title: "Prístup zakázaný",
          description: "Vyžaduje sa oprávnenie správcu.",
        },
        server: {
          title: "Chyba servera",
          description: "Nepodarilo sa nastaviť graf ako systémový",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
        validation: {
          title: "Overenie vstupu zlyhalo",
          description: "Neplatné ID",
        },
        notFound: { title: "Nenájdené", description: "Graf sa nenašiel." },
        conflict: { title: "Konflikt", description: "Konflikt zdrojov" },
        network: {
          title: "Chyba siete",
          description: "Sieťová požiadavka zlyhala",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Najprv ulož zmeny",
        },
      },
    },
    trigger: {
      title: "Spustiť graf",
      description: "Spustiť graf ručne na požiadanie",
      fields: {
        id: { label: "ID grafu", description: "UUID grafu na spustenie" },
        rangeFrom: {
          label: "Od",
          description: "Začiatok rozsahu (dátum vo formáte ISO)",
        },
        rangeTo: {
          label: "Do",
          description: "Koniec rozsahu (dátum vo formáte ISO)",
        },
      },
      response: {
        nodeCount: "Vykonané uzly",
        errorCount: "Chyby",
        errors: "Chyby",
      },
      success: {
        title: "Graf spustený",
        description: "Vykonávanie grafu sa úspešne dokončilo",
      },
      errors: {
        unauthorized: {
          title: "Bez oprávnenia",
          description: "Vyžaduje sa prihlásenie",
        },
        forbidden: {
          title: "Prístup zakázaný",
          description: "Vyžaduje sa oprávnenie správcu.",
        },
        server: {
          title: "Chyba servera",
          description: "Spustenie grafu zlyhalo",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
        validation: {
          title: "Overenie vstupu zlyhalo",
          description: "Neplatné parametre",
        },
        notFound: { title: "Nenájdené", description: "Graf sa nenašiel." },
        conflict: { title: "Konflikt", description: "Konflikt zdrojov" },
        network: {
          title: "Chyba siete",
          description: "Sieťová požiadavka zlyhala",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Najprv ulož zmeny",
        },
      },
    },
    backtest: {
      title: "Spustiť spätný test",
      description:
        "Spustiť spätný test na historických údajoch. Akcie sa simulujú.",
      fields: {
        id: { label: "ID grafu", description: "UUID verzie grafu" },
        rangeFrom: {
          label: "Od",
          description: "Začiatok obdobia spätného testu",
        },
        rangeTo: { label: "Do", description: "Koniec obdobia spätného testu" },
        resolution: {
          label: "Rozlíšenie",
          description: "Časový rámec hodnotenia",
        },
      },
      response: {
        runId: "ID spustenia",
        eligible: "Možno testovať",
        ineligibleNodes: "Uzly bez podpory spätného testu",
      },
      success: {
        title: "Spätný test dokončený",
        description: "Spätný test sa úspešne dokončil",
      },
      errors: {
        unauthorized: {
          title: "Bez oprávnenia",
          description: "Vyžaduje sa prihlásenie",
        },
        forbidden: {
          title: "Prístup zakázaný",
          description: "Vyžaduje sa oprávnenie správcu.",
        },
        server: { title: "Chyba servera", description: "Spätný test zlyhal" },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
        validation: {
          title: "Overenie vstupu zlyhalo",
          description: "Neplatné parametre",
        },
        notFound: { title: "Nenájdené", description: "Graf sa nenašiel." },
        conflict: { title: "Konflikt", description: "Konflikt zdrojov" },
        network: {
          title: "Chyba siete",
          description: "Sieťová požiadavka zlyhala",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Najprv ulož zmeny",
        },
      },
    },
    data: {
      title: "Údaje grafu",
      description: "Načítať časové rady grafu po spustení na požiadanie",
      fields: {
        id: { label: "ID grafu", description: "UUID grafu" },
        rangeFrom: { label: "Od", description: "Začiatok rozsahu" },
        rangeTo: { label: "Do", description: "Koniec rozsahu" },
      },
      response: {
        series: "Časové rady",
        signals: "Signály",
      },
      success: {
        title: "Údaje načítané",
        description: "Údaje grafu sa načítali",
      },
      errors: {
        unauthorized: {
          title: "Bez oprávnenia",
          description: "Vyžaduje sa prihlásenie",
        },
        forbidden: {
          title: "Prístup zakázaný",
          description: "Prístup zamietnutý",
        },
        server: {
          title: "Chyba servera",
          description: "Nepodarilo sa načítať údaje",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
        validation: {
          title: "Overenie vstupu zlyhalo",
          description: "Neplatné parametre",
        },
        notFound: { title: "Nenájdené", description: "Graf sa nenašiel." },
        conflict: { title: "Konflikt", description: "Konflikt zdrojov" },
        network: {
          title: "Chyba siete",
          description: "Sieťová požiadavka zlyhala",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Najprv ulož zmeny",
        },
      },
    },
  },

  // Indicator node definitions
  indicators: {
    ema: {
      description: "Exponenciálny kĺzavý priemer dáva novším cenám vyššiu váhu",
      input: { source: { label: "Zdroj" } },
      output: { value: { label: "EMA" } },
      params: {
        period: { label: "Obdobie", description: "Počet období (1 až 500)" },
      },
    },
    rsi: {
      description: "Index relatívnej sily. Oscilátor momenta (0 až 100).",
      input: { source: { label: "Zdroj" } },
      output: { value: { label: "RSI" } },
      params: {
        period: {
          label: "Obdobie",
          description: "Počet predchádzajúcich období (2 až 100)",
        },
      },
    },
    bollinger: {
      description:
        "Bollingerove pásma vyjadrujú volatilitu okolo kĺzavého priemeru",
      input: { source: { label: "Zdroj" } },
      output: {
        upper: { label: "Horné pásmo" },
        middle: { label: "Stredné pásmo" },
        lower: { label: "Dolné pásmo" },
      },
      params: {
        period: { label: "Obdobie", description: "Obdobie kĺzavého priemeru" },
        stdDev: {
          label: "Smerodajná odchýlka",
          description: "Násobiteľ smerodajnej odchýlky",
        },
      },
    },
    macd: {
      description: "MACD meria momentum a sleduje trend",
      input: { source: { label: "Zdroj" } },
      output: {
        macd: { label: "MACD" },
        signal: { label: "Signál" },
        histogram: { label: "Histogram" },
      },
      params: {
        fastPeriod: {
          label: "Rýchle obdobie",
          description: "Obdobie rýchleho EMA",
        },
        slowPeriod: {
          label: "Pomalé obdobie",
          description: "Obdobie pomalého EMA",
        },
        signalPeriod: {
          label: "Obdobie signálu",
          description: "Obdobie EMA signálu",
        },
      },
    },
    ratio: {
      description: "Vypočíta pomer A / B pre každý časový bod",
      input: { a: { label: "Čitateľ" }, b: { label: "Menovateľ" } },
      output: { value: { label: "Pomer" } },
    },
    delta: {
      description: "Zmena oproti predchádzajúcemu obdobiu",
      input: { source: { label: "Zdroj" } },
      output: { value: { label: "Rozdiel" } },
    },
    clamp: {
      description: "Ohraničí hodnoty na interval [min, max]",
      input: { source: { label: "Zdroj" } },
      output: { value: { label: "Ohraničené hodnoty" } },
      params: {
        min: { label: "Min.", description: "Dolná hranica" },
        max: { label: "Max.", description: "Horná hranica" },
      },
    },
    windowAvg: {
      description: "Kĺzavý priemer za N období",
      input: { source: { label: "Zdroj" } },
      output: { value: { label: "Priemer" } },
      params: {
        size: { label: "Okno", description: "Počet období (1 až 500)" },
      },
    },
    windowSum: {
      description: "Kĺzavý súčet za N období",
      input: { source: { label: "Zdroj" } },
      output: { value: { label: "Súčet" } },
      params: {
        size: { label: "Okno", description: "Počet období (1 až 500)" },
      },
    },
    windowMin: {
      description: "Kĺzavé minimum za N období",
      input: { source: { label: "Zdroj" } },
      output: { value: { label: "Min." } },
      params: {
        size: { label: "Okno", description: "Počet období (1 až 500)" },
      },
    },
    windowMax: {
      description: "Kĺzavé maximum za N období",
      input: { source: { label: "Zdroj" } },
      output: { value: { label: "Max." } },
      params: {
        size: { label: "Okno", description: "Počet období (1 až 500)" },
      },
    },
  },

  // Data source node definitions
  dataSources: {
    leadsCreated: {
      description: "Počet vytvorených nových kontaktov za minútu",
      output: { value: { label: "Vytvorené kontakty" } },
    },
    leadsConverted: {
      description: "Počet kontaktov konvertovaných na používateľov za minútu",
      output: { value: { label: "Konvertované kontakty" } },
    },
    leadsActive: {
      description: "Celkový počet aktívnych kontaktov (denný snímok stavu)",
      output: { value: { label: "Aktívne kontakty" } },
    },
    leadsBounced: {
      description: "Počet nedoručených e-mailov kontaktom za minútu",
      output: { value: { label: "Kontakty s nedoručeným e-mailom" } },
    },
    leadsEngagements: {
      description:
        "Celkový počet interakcií kontaktov za minútu (otvorenia a kliknutia)",
      output: { value: { label: "Interakcie kontaktov" } },
    },
    leadsEmailsSent: {
      description: "Počet zaslaných e-mailov kampane za minútu",
      output: { value: { label: "Odoslané e-maily" } },
    },
    leadsUnsubscribed: {
      description: "Počet kontaktov odhlásených z odberu za minútu",
      output: { value: { label: "Kontakty odhlásené z odberu" } },
    },
    leadsEmailOpens: {
      description: "Počet zaznamenaných otvorení e-mailov za minútu",
      output: { value: { label: "Otvorenia e-mailov" } },
    },
    leadsEmailClicks: {
      description:
        "Počet zaznamenaných kliknutí na odkazy v e-mailoch za minútu",
      output: { value: { label: "Kliknutia v e-mailoch" } },
    },
    leadsNewsletterSubscribers: {
      description:
        "Celkový počet kontaktov s potvrdeným odberom noviniek (denný snímok stavu)",
      output: { value: { label: "Odberatelia noviniek" } },
    },
    leadsWebsiteUsers: {
      description:
        "Celkový počet kontaktov v stave používateľ webu (denný snímok stavu)",
      output: { value: { label: "Používatelia webu" } },
    },
    leadsCampaignRunning: {
      description:
        "Celkový počet kontaktov v aktívnej e-mailovej kampani (denný snímok stavu)",
      output: { value: { label: "V kampani" } },
    },
    leadsInContact: {
      description:
        "Celkový počet kontaktov v stave oslovený (denný snímok stavu)",
      output: { value: { label: "Oslovené" } },
    },
    leadsWebsiteVisits: {
      description: "Počet zaznamenaných návštev webu za minútu",
      output: { value: { label: "Návštevy webu" } },
    },
    leadsFormSubmits: {
      description: "Počet zaznamenaných odoslaní formulárov za minútu",
      output: { value: { label: "Odoslané formuláre" } },
    },
    usersRegistered: {
      description: "Počet nových registrácií používateľov za minútu",
      output: { value: { label: "Registrovaní používatelia" } },
    },
    usersActiveTotal: {
      description:
        "Celkový počet aktívnych overených používateľov (denný snímok stavu)",
      output: { value: { label: "Aktívni používatelia" } },
    },
    usersBanned: {
      description: "Počet zablokovaných používateľov za minútu (približne)",
      output: { value: { label: "Zablokovaní používatelia" } },
    },
    usersEmailVerified: {
      description:
        "Celkový počet používateľov s overeným e-mailom (denný snímok stavu)",
      output: { value: { label: "Overený e-mail" } },
    },
    usersMarketingConsent: {
      description:
        "Celkový počet používateľov, ktorí udelili súhlas s marketingom (denný snímok stavu)",
      output: { value: { label: "Súhlas s marketingom" } },
    },
    usersWithStripe: {
      description:
        "Celkový počet používateľov s prepojeným zákazníckym účtom Stripe (denný snímok stavu)",
      output: { value: { label: "Používatelia Stripe" } },
    },
    usersTwoFaEnabled: {
      description:
        "Celkový počet používateľov so zapnutým dvojfaktorovým overením (denný snímok stavu)",
      output: { value: { label: "Zapnuté dvojfaktorové overenie" } },
    },
    usersLoginAttemptsTotal: {
      description: "Celkový počet prihlasovacích pokusov za minútu",
      output: { value: { label: "Pokusy o prihlásenie" } },
    },
    usersLoginAttemptsFailed: {
      description: "Počet neúspešných prihlásení za minútu",
      output: { value: { label: "Neúspešné prihlásenia" } },
    },
    creditsSpentTotal: {
      description:
        "Celkový počet kreditov spotrebovaných za minútu vo všetkých peňaženkách",
      output: { value: { label: "Použité kredity" } },
    },
    creditsSpentByUsers: {
      description: "Kredity spotrebované prihlásenými používateľmi za minútu",
      output: { value: { label: "Spotrebované kredity (používatelia)" } },
    },
    creditsSpentByLeads: {
      description: "Bezplatné kredity spotrebované kontaktmi za minútu",
      output: { value: { label: "Spotrebované kredity (kontakty)" } },
    },
    creditsPurchased: {
      description:
        "Kredity zakúpené alebo pridané prostredníctvom predplatného za minútu",
      output: { value: { label: "Nakúpené kredity" } },
    },
    creditsFreeGrants: {
      description: "Bezplatné kredity pridelené kontaktom za minútu",
      output: { value: { label: "Pridelené bezplatné kredity" } },
    },
    creditsEarned: {
      description: "Kredity získané za odporúčania za minútu",
      output: { value: { label: "Získané kredity" } },
    },
    creditsExpired: {
      description: "Počet kreditov, ktorým za minútu vypršala platnosť",
      output: { value: { label: "Kredity s vypršanou platnosťou" } },
    },
    creditsRefunded: {
      description: "Kredity vrátené za minútu",
      output: { value: { label: "Vrátené kredity" } },
    },
    creditsBalanceTotal: {
      description:
        "Celkový zostatok kreditov vo všetkých peňaženkách používateľov (denný snímok stavu)",
      output: { value: { label: "Zostatok kreditov" } },
    },
    creditsSubscriptionRevenue: {
      description: "Kredity z balíkov predplatného za minútu",
      output: { value: { label: "Kredity z predplatného" } },
    },
    creditsTransferVolume: {
      description: "Počet kreditov prevedených medzi peňaženkami za minútu",
      output: { value: { label: "Objem prevodov" } },
    },
    creditsFreePoolUtilization: {
      description:
        "Percento spotrebovaných bezplatných kreditov z celkového prideleného množstva (denný snímok stavu)",
      output: { value: { label: "Čerpanie bezplatných kreditov" } },
    },
  },

  // Evaluator node definitions
  evaluators: {
    threshold: {
      description:
        "Aktivuje sa, keď hodnota časového radu spĺňa podmienku porovnania s konštantou",
      input: {
        series: { label: "Časové rady" },
      },
      output: {
        signal: { label: "Signál" },
      },
      params: {
        op: {
          label: "Operátor",
          description: "Porovnávací operátor",
        },
        value: {
          label: "Hodnota",
          description: "Konštanta na porovnanie",
        },
      },
    },
    and: {
      description:
        "Aktivuje sa, keď sa všetky vstupné signály aktivujú v rovnakom čase",
      input: { signals: { label: "Signály" } },
      output: { signal: { label: "Signál" } },
    },
    or: {
      description:
        "Aktivuje sa, keď sa v danom čase aktivuje aspoň jeden vstupný signál",
      input: { signals: { label: "Signály" } },
      output: { signal: { label: "Signál" } },
    },
    not: {
      description: "Obráti stav vstupného signálu",
      input: { signal: { label: "Signál" } },
      output: { signal: { label: "Obrátený signál" } },
    },
    crossover: {
      description:
        "Aktivuje sa, keď časový rad A prejde zdola nad časový rad B",
      input: {
        seriesA: { label: "Časový rad A" },
        seriesB: { label: "Časový rad B" },
      },
      output: { signal: { label: "Signál" } },
    },
    script: {
      description:
        "Vlastný vyhodnocovací uzol v izolovanom prostredí, ktorý prijíma vstupné časové rady a vracia udalosti signálu",
      input: { inputs: { label: "Vstupy" } },
      output: { signal: { label: "Signál" } },
      params: {
        fn: {
          label: "Funkcia",
          description:
            "Telo funkcie JavaScript, ktorá prijíma polia vstupných časových radov a vracia udalosti signálu",
        },
      },
    },
  },

  // Transformer node definitions
  transformers: {
    merge: {
      description: "Sčíta hodnoty dvoch radov pre zhodné časové body",
      input: {
        a: { label: "Časový rad A" },
        b: { label: "Časový rad B" },
      },
      output: { value: { label: "Zlúčené hodnoty" } },
    },
    ratio: {
      description: "Vypočíta pomer A / B pre každý časový bod",
      input: {
        a: { label: "Čitateľ" },
        b: { label: "Menovateľ" },
      },
      output: { value: { label: "Pomer" } },
    },
    delta: {
      description: "Zmena oproti predchádzajúcemu obdobiu",
      input: { source: { label: "Zdroj" } },
      output: { value: { label: "Rozdiel" } },
    },
    clamp: {
      description: "Ohraničí hodnoty na interval [min, max]",
      input: { source: { label: "Zdroj" } },
      output: { value: { label: "Ohraničené hodnoty" } },
      params: {
        min: { label: "Min.", description: "Dolná hranica" },
        max: { label: "Max.", description: "Horná hranica" },
      },
    },
    windowAvg: {
      description: "Kĺzavý priemer za N období",
      input: { source: { label: "Zdroj" } },
      output: { value: { label: "Priemer" } },
      params: {
        size: { label: "Okno", description: "Počet období (1 až 500)" },
      },
    },
    windowSum: {
      description: "Kĺzavý súčet za N období",
      input: { source: { label: "Zdroj" } },
      output: { value: { label: "Súčet" } },
      params: {
        size: { label: "Okno", description: "Počet období (1 až 500)" },
      },
    },
    windowMin: {
      description: "Kĺzavé minimum za N období",
      input: { source: { label: "Zdroj" } },
      output: { value: { label: "Min." } },
      params: {
        size: { label: "Okno", description: "Počet období (1 až 500)" },
      },
    },
    windowMax: {
      description: "Kĺzavé maximum za N období",
      input: { source: { label: "Zdroj" } },
      output: { value: { label: "Max." } },
      params: {
        size: { label: "Okno", description: "Počet období (1 až 500)" },
      },
    },
    fieldPick: {
      description:
        "Vyberie pomenované pole z časového radu s viacerými hodnotami",
      input: { source: { label: "Viac hodnôt" } },
      output: { value: { label: "Pole" } },
      params: {
        field: {
          label: "Názov poľa",
          description: "Názov poľa, ktoré sa má vybrať",
        },
      },
    },
    jsonPath: {
      description:
        "Vyberie hodnotu z metadát DataPoint podľa cesty s bodkovým zápisom",
      input: { source: { label: "Zdroj" } },
      output: { value: { label: "Hodnota" } },
      params: {
        path: {
          label: "Cesta",
          description: "Cesta s bodkovým zápisom, napríklad data.stats.total",
        },
      },
    },
    script: {
      description: "Vlastná transformácia skriptom v izolovanom prostredí",
      input: { inputs: { label: "Vstupy" } },
      output: { value: { label: "Výsledok" } },
      params: {
        fn: {
          label: "Funkcia",
          description:
            "Šípková funkcia JavaScript, ktorá prijíma polia vstupných časových radov a vracia DataPoint[]",
        },
      },
    },
  },

  // Shared data-source chart widget UI
  dataSourceWidget: {
    latestValue: "Posledná hodnota",
    browseGraphs: "Zobraziť grafy",
    filters: "Filtre",
    applyFilters: "Použiť filtre",
    expandPeriod: "Zobraziť {{period}}",
    period: "Obdobie",
    interval: "Zoskupiť podľa",
    loadError: "Graf sa nepodarilo načítať.",
    addToGraph: "Pridať do grafu",
    newGraph: "Nový graf",
    loading: "Načítavajú sa údaje…",
    noData: "Žiadne údaje za toto obdobie",
  },

  // Cleanup task
  cleanup: {
    post: {
      title: "Čistenie údajov Vibe Sense",
      description:
        "Odstráni dátové body po uplynutí doby uchovávania a vyradí neplatné snímky",
      success: {
        title: "Čistenie dokončené",
        description: "Odstránenie starých údajov je dokončené",
      },
      response: {
        nodesProcessed: "Spracované uzly",
        totalDeleted: "Odstránené riadky",
        snapshotsDeleted: "Odstránené snímky",
      },
      errors: {
        unauthorized: {
          title: "Bez oprávnenia",
          description: "Vyžaduje sa prihlásenie",
        },
        forbidden: {
          title: "Prístup zakázaný",
          description: "Vyžaduje sa oprávnenie správcu.",
        },
        server: { title: "Chyba servera", description: "Vyčistenie zlyhalo" },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
        validation: {
          title: "Overenie vstupu zlyhalo",
          description: "Neplatná požiadavka",
        },
        notFound: { title: "Nenájdené", description: "Nenájdené" },
        conflict: { title: "Konflikt", description: "Konflikt" },
        network: {
          title: "Chyba siete",
          description: "Sieťová požiadavka zlyhala",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Najprv ulož zmeny",
        },
      },
    },
    name: "Čistenie údajov Vibe Sense",
    description:
      "Odstráni staré dátové body a snímky s vypršanou platnosťou z vyrovnávacej pamäte",
  },
};
