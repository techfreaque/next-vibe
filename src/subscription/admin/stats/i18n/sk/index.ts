import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Štatistiky predplatného",
    titleShort: "Metriky predplatného",
    description: "Ukazovatele tržieb, predplatného, kreditov a odporúčaní",
    form: {
      title: "Prehľad štatistík",
      description: "Súhrnné obchodné ukazovatele",
    },
    timePeriodOptions: {
      title: "Časové obdobie",
      description: "Nastavte časový rozsah",
    },
    timePeriod: {
      label: "Obdobie",
      description: "Interval zoskupovania",
    },
    dateRangePreset: {
      label: "Rozsah dátumov",
      description: "Prednastavený rozsah dátumov",
    },
    response: {
      revenueStats: {
        title: "Tržby",
        description: "Ukazovatele tržieb",
        mrr: { label: "MRR" },
        arr: { label: "ARR" },
        totalRevenue: { label: "Celkové tržby" },
        avgOrderValue: { label: "Priemerná hodnota objednávky" },
      },
      subscriptionStats: {
        title: "Predplatné",
        description: "Počty predplatných",
        activeCount: { label: "Aktívne" },
        trialingCount: { label: "V skúšobnom období" },
        pastDueCount: { label: "Po splatnosti" },
        canceledCount: { label: "Zrušené" },
        churnRate: { label: "Miera odchodu predplatiteľov" },
      },
      intervalStats: {
        title: "Fakturačné intervaly",
        description: "Rozdelenie na mesačné a ročné",
        monthlyCount: { label: "Mesačne" },
        yearlyCount: { label: "Ročne" },
        yearlyRevenuePct: { label: "Podiel tržieb z ročných plánov (%)" },
      },
      creditStats: {
        title: "Kredity",
        description: "Ukazovatele balíkov kreditov",
        totalPurchased: { label: "Zakúpené" },
        spentFromFree: { label: "Z bezplatného limitu" },
        totalSpent: { label: "Spotrebované" },
        packsSold: { label: "Predané balíky" },
        avgPackSize: { label: "Priemerná veľkosť balíka" },
      },
      referralStats: {
        title: "Odporúčania",
        description: "Ukazovatele programu odporúčaní",
        totalReferrals: { label: "Odporúčania" },
        conversionRate: { label: "Konverzia" },
        totalEarned: { label: "Provízie partnerov" },
        pendingPayouts: { label: "Čakajúce výplaty" },
      },
      growthMetrics: {
        title: "Rast",
        description: "Vývoj tržieb a predplatného",
        revenueChart: {
          label: "Vývoj tržieb v čase",
          description: "Trend tržieb",
        },
        subscriptionChart: {
          label: "Rast predplatného",
          description: "Vývoj počtu aktívnych predplatných",
        },
      },
      businessInsights: {
        title: "Prehľady",
        description: "Vypočítané ukazovatele",
        generatedAt: { label: "Čas vytvorenia" },
      },
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chcete zobraziť štatistiky, prihláste sa",
      },
      validation: {
        title: "Chyba overenia údajov",
        description: "Neplatné parametre",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Vyžadujú sa oprávnenia správcu",
      },
      server: {
        title: "Chyba servera",
        description: "Štatistiky sa nepodarilo vytvoriť",
        detail: "Štatistiky sa nepodarilo vytvoriť: {{error}}",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      conflict: { title: "Konflikt", description: "Nastal konflikt údajov" },
      network: {
        title: "Chyba siete",
        description: "Pripojenie sa nepodarilo",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Štatistiky nie sú dostupné",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: { title: "Úspech", description: "Štatistiky sú vytvorené" },
  },
  widget: {
    paidPacks: "Platené balíky: z predplatného a z nákupov",
    canceledShare: "Podiel zrušených za celé obdobie",
    spentSplit:
      "Vyčerpané z balíkov: {{packs}} (ako v prehľade Balíky kreditov) · Z bezplatných limitov: {{free}}",
    creditsSold: "Predané kredity",
    creditsSoldHint:
      "Kredity z predplatného a zakúpených balíkov. Pridelené kredity a provízie za odporúčania sa nezapočítavajú.",
    pastDueHint:
      "Platba zlyhala. Používateľ sa ešte počíta medzi predplatiteľov.",
    yearlyShare: "Ročné plány",
    yearlyShareHint:
      "Podiel ročnej fakturácie medzi aktívnymi, skúšobnými a predplatnými po splatnosti",
    showLegacy: "Zobraziť pôvodný prehľad tržieb",
    hideLegacy: "Skryť pôvodný prehľad tržieb",
    approxUsd: "približne v USD",
    openLabel: "Otvoriť:",
    linkSubscriptions: "Zoznam predplatných",
    linkPurchases: "Balíky kreditov",
    linkReferrals: "Odporúčania",
    apply: "Použiť",
    sectionSubscriptions: "Predplatné",
    sectionSubscriptionsHint: "Aktuálny stav za celé obdobie",
    activePaid: "Aktívne",
    activePaidHint:
      "Predplatné v aktívnom stave. Počet zodpovedá zoznamu predplatných.",
    churnHint:
      "Podiel zrušených predplatných zo súčtu aktívnych, skúšobných, po splatnosti a zrušených. Ide o podiel za celé obdobie.",
    sectionCredits: "Kredity",
    purchasedHint: "Kredity v balíkoch na účtoch",
    spentHint: "Spotrebované kredity",
    sectionReferrals: "Odporúčania",
    sectionLegacy: "Pôvodný prehľad tržieb",
    sectionLegacyHint:
      "Tieto štatistiky nahradil prehľad tržieb. Sumy sú približne prepočítané na USD.",
    revenueReportTitle:
      "Tržby, MRR a odchod predplatiteľov nájdete v prehľade tržieb",
    revenueReportHint:
      "Skutočne prijaté platby za deň podľa meny a typu. Z prehľadu môžete otvoriť každú platbu.",
    openRevenueReport: "Otvoriť prehľad tržieb",
    refresh: "Obnoviť",
    filters: "Filtre",
  },
  stats: {
    timePeriod: {
      day: "Deň",
      week: "Týždeň",
      month: "Mesiac",
      quarter: "Štvrťrok",
      year: "Rok",
    },
    dateRange: {
      today: "Dnes",
      yesterday: "Včera",
      last7Days: "Posledných 7 dní",
      last30Days: "Posledných 30 dní",
      last90Days: "Posledných 90 dní",
      thisWeek: "Tento týždeň",
      lastWeek: "Minulý týždeň",
      thisMonth: "Tento mesiac",
      lastMonth: "Minulý mesiac",
      thisQuarter: "Tento štvrťrok",
      lastQuarter: "Minulý štvrťrok",
      thisYear: "Tento rok",
      lastYear: "Minulý rok",
      custom: "Vlastné",
    },
  },
};
