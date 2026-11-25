import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Predplatné",
  tags: {
    admin: "Správa",
    stats: "Štatistiky",
    list: "Zoznam",
    purchases: "Nákupy",
    referrals: "Odporúčania",
  },
  // Stats endpoint translations
  stats: {
    get: {
      title: "Štatistiky predplatného",
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
          totalSpent: { label: "Spotrebované" },
          packsSold: { label: "Predané balíky" },
          avgPackSize: { label: "Priemerná veľkosť balíka" },
        },
        referralStats: {
          title: "Odporúčania",
          description: "Ukazovatele programu odporúčaní",
          totalReferrals: { label: "Odporúčania spolu" },
          conversionRate: { label: "Konverzia" },
          totalEarned: { label: "Celkové provízie" },
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
      refresh: "Obnoviť",
      filters: "Filtre",
    },
  },
  // List endpoint translations
  list: {
    get: {
      title: "Zoznam predplatných",
      description: "Prezrite si všetky predplatné",
      form: {
        title: "Správa predplatného",
        description: "Filtrujte a prezerajte predplatné",
      },
      searchFilters: {
        title: "Vyhľadávanie a filtre",
        description: "Filtrovať predplatné",
      },
      search: {
        label: "Vyhľadať",
        description: "Hľadajte podľa e-mailu alebo mena používateľa",
        placeholder: "Vyhľadať predplatné…",
      },
      status: {
        label: "Stav",
        description: "Filtrovať podľa stavu predplatného",
        placeholder: "Vyberte stav…",
      },
      interval: {
        label: "Fakturačný interval",
        description: "Filtrovať podľa fakturačného intervalu",
        placeholder: "Ľubovoľný interval",
      },
      provider: {
        label: "Poskytovateľ",
        description: "Filtrovať podľa poskytovateľa platby",
        placeholder: "Ľubovoľný poskytovateľ",
      },
      dateFrom: {
        label: "Od",
        description: "Filter dátumu začiatku",
      },
      dateTo: {
        label: "Do",
        description: "Filter dátumu konca",
      },
      sortingOptions: {
        title: "Zoradenie",
        description: "Nastavte zoradenie výsledkov",
      },
      sortBy: {
        label: "Zoradiť podľa",
        description: "Pole zoradenia",
        placeholder: "Vyberte pole zoradenia…",
      },
      sortOrder: {
        label: "Poradie zoradenia",
        description: "Vzostupne alebo zostupne",
        placeholder: "Vyberte poradie…",
      },
      response: {
        title: "Predplatné",
        description: "Predplatné zodpovedajúce filtrom",
        subscriptions: {
          id: "ID",
          userEmail: "E-mail",
          userName: "Meno",
          planId: "Plán",
          billingInterval: "Interval",
          status: "Stav",
          createdAt: "Začiatok",
          currentPeriodEnd: "Koniec obdobia",
          cancelAtPeriodEnd: "Zrušenie na konci obdobia",
          canceledAt: "Zrušené",
          cancellationReason: "Dôvod zrušenia",
          provider: "Poskytovateľ",
          providerSubscriptionId: "ID u poskytovateľa",
        },
        totalCount: "Počet predplatných spolu",
        pageCount: "Celkový počet strán",
      },
      page: { label: "Stránka" },
      limit: { label: "Na stranu" },
      errors: {
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Vyžaduje sa prihlásenie",
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
          description: "Predplatné sa nepodarilo načítať",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Neočakávaná chyba",
        },
        conflict: { title: "Konflikt", description: "Nastal konflikt údajov" },
        network: {
          title: "Chyba siete",
          description: "Pripojenie sa nepodarilo",
        },
        notFound: {
          title: "Nenašlo sa",
          description: "Nenašli sa žiadne predplatné",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Neuložené zmeny",
        },
      },
      success: { title: "Úspech", description: "Predplatné načítané" },
    },
    widget: {
      noSubscriptions: "Nenašli sa žiadne predplatné.",
      noMatchingSubscriptions: "Žiadne predplatné nezodpovedá filtrom.",
      searchPlaceholder: "Hľadať podľa e-mailu alebo mena…",
      refresh: "Obnoviť",
      viewStats: "Štatistiky",
    },
  },
  // Purchases endpoint translations
  purchases: {
    get: {
      title: "Nákupy kreditov",
      description: "História nákupov balíkov kreditov",
      form: {
        title: "História nákupov",
        description: "Prezrite si nákupy balíkov kreditov",
      },
      searchFilters: {
        title: "Vyhľadávanie a filtre",
        description: "Filtrovať nákupy",
      },
      search: {
        label: "Vyhľadať",
        description: "Hľadajte podľa e-mailu používateľa",
        placeholder: "Vyhľadať nákupy…",
      },
      packType: {
        label: "Typ balíka",
        description: "Filtrovať podľa typu balíka kreditov",
        placeholder: "Ľubovoľný typ",
      },
      source: {
        label: "Zdroj",
        description: "Filtrovať podľa zdroja nákupu",
        placeholder: "Ľubovoľný zdroj",
      },
      dateFrom: {
        label: "Od",
        description: "Filter dátumu začiatku",
      },
      dateTo: {
        label: "Do",
        description: "Filter dátumu konca",
      },
      sortingOptions: {
        title: "Zoradenie",
        description: "Nastavte zoradenie výsledkov",
      },
      sortBy: {
        label: "Zoradiť podľa",
        description: "Pole zoradenia",
        placeholder: "Vyberte pole zoradenia…",
      },
      sortOrder: {
        label: "Poradie zoradenia",
        description: "Vzostupne alebo zostupne",
        placeholder: "Vyberte poradie…",
      },
      response: {
        title: "Nákupy",
        description: "História nákupov balíkov kreditov",
        purchases: {
          id: "ID",
          userEmail: "E-mail",
          userName: "Meno",
          packType: "Typ",
          source: "Zdroj",
          originalAmount: "Suma",
          remaining: "Zostáva",
          expiresAt: "Platí do",
          createdAt: "Zakúpené",
        },
        totalCount: "Nákupy spolu",
        pageCount: "Celkový počet strán",
      },
      page: { label: "Stránka" },
      limit: { label: "Na stranu" },
      errors: {
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Vyžaduje sa prihlásenie",
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
          description: "Nákupy sa nepodarilo načítať",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Neočakávaná chyba",
        },
        conflict: { title: "Konflikt", description: "Nastal konflikt údajov" },
        network: {
          title: "Chyba siete",
          description: "Pripojenie sa nepodarilo",
        },
        notFound: {
          title: "Nenašlo sa",
          description: "Nenašli sa žiadne nákupy",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Neuložené zmeny",
        },
      },
      success: { title: "Úspech", description: "Nákupy načítané" },
    },
    widget: {
      noPurchases: "Nenašli sa žiadne nákupy balíkov kreditov.",
      noMatchingPurchases: "Žiadny nákup nezodpovedá filtrom.",
      searchPlaceholder: "Hľadať podľa e-mailu…",
      refresh: "Obnoviť",
      expired: "Platnosť uplynula",
      neverExpires: "Nikdy",
    },
  },
  // Referrals endpoint translations
  referrals: {
    get: {
      title: "Prehľad odporúčaní",
      description: "Kódy odporúčaní, provízie a výplaty",
      form: {
        title: "Správa odporúčaní",
        description: "Spravujte program odporúčaní",
      },
      searchFilters: {
        title: "Vyhľadávanie a filtre",
        description: "Filtrovať údaje o odporúčaniach",
      },
      search: {
        label: "Vyhľadať",
        description: "Hľadajte podľa e-mailu používateľa",
        placeholder: "Vyhľadať odporúčania…",
      },
      payoutStatus: {
        label: "Stav výplaty",
        description: "Filtrovať podľa stavu žiadosti o výplatu",
        placeholder: "Ľubovoľný stav",
      },
      dateFrom: {
        label: "Od",
        description: "Filter dátumu začiatku",
      },
      dateTo: {
        label: "Do",
        description: "Filter dátumu konca",
      },
      sortingOptions: {
        title: "Zoradenie",
        description: "Nastavte zoradenie výsledkov",
      },
      sortBy: {
        label: "Zoradiť podľa",
        description: "Pole zoradenia",
        placeholder: "Vyberte pole zoradenia…",
      },
      sortOrder: {
        label: "Poradie zoradenia",
        description: "Vzostupne alebo zostupne",
        placeholder: "Vyberte poradie…",
      },
      response: {
        title: "Odporúčania",
        description: "Údaje o programe odporúčaní",
        summary: {
          title: "Súhrn",
          description: "Súhrnné štatistiky odporúčaní",
          totalCodes: { label: "Kódy spolu" },
          totalSignups: { label: "Registrácie spolu" },
          totalEarned: { label: "Celkové provízie" },
          totalPaidOut: { label: "Vyplatené spolu" },
          pendingPayouts: { label: "Čakajúce výplaty" },
        },
        codes: {
          code: "Kód",
          ownerEmail: "Vlastník",
          ownerName: "Meno",
          currentUses: "Kliknutia",
          totalSignups: "Registrácie",
          totalEarned: "Získané",
          isActive: "Aktívne",
          createdAt: "Vytvorené",
        },
        payoutRequests: {
          id: "ID",
          userEmail: "Používateľ",
          amountCents: "Suma",
          currency: "Mena",
          status: "Stav",
          walletAddress: "Peňaženka",
          adminNotes: "Poznámky",
          rejectionReason: "Dôvod zamietnutia",
          createdAt: "Podané",
          processedAt: "Spracované",
        },
        totalCount: "Spolu",
        pageCount: "Celkový počet strán",
      },
      page: { label: "Stránka" },
      limit: { label: "Na stranu" },
      errors: {
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Vyžaduje sa prihlásenie",
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
          description: "Odporúčania sa nepodarilo načítať",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Neočakávaná chyba",
        },
        conflict: { title: "Konflikt", description: "Nastal konflikt údajov" },
        network: {
          title: "Chyba siete",
          description: "Pripojenie sa nepodarilo",
        },
        notFound: {
          title: "Nenašlo sa",
          description: "Nenašli sa žiadne údaje o odporúčaniach",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Neuložené zmeny",
        },
      },
      success: { title: "Úspech", description: "Odporúčania načítané" },
    },
    post: {
      title: "Akcia pri výplate",
      description: "Schváľte, zamietnite alebo dokončite žiadosť o výplatu",
      form: {
        title: "Akcia pri výplate",
        description: "Spracujte žiadosť o výplatu",
      },
      requestId: {
        label: "ID žiadosti",
        description: "Žiadosť o výplatu na spracovanie",
        placeholder: "Zadať ID žiadosti…",
      },
      action: {
        label: "Akcia",
        description: "Akcia, ktorá sa má vykonať",
        placeholder: "Vybrať akciu…",
      },
      adminNotes: {
        label: "Poznámky správcu",
        description: "Voliteľné poznámky",
        placeholder: "Pridať poznámky…",
      },
      rejectionReason: {
        label: "Dôvod zamietnutia",
        description: "Povinné pri zamietnutí",
        placeholder: "Zadať dôvod…",
      },
      response: {
        title: "Výsledok",
        description: "Výsledok akcie",
        success: "Úspech",
        message: "Správa",
      },
      errors: {
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Vyžaduje sa prihlásenie",
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
          description: "Výplatu sa nepodarilo spracovať",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Neočakávaná chyba",
        },
        conflict: {
          title: "Konflikt",
          description: "Výplata už bola spracovaná",
        },
        network: {
          title: "Chyba siete",
          description: "Pripojenie sa nepodarilo",
        },
        notFound: {
          title: "Nenašlo sa",
          description: "Žiadosť o výplatu sa nenašla",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Neuložené zmeny",
        },
      },
      success: { title: "Úspech", description: "Výplata spracovaná" },
    },
    widget: {
      noReferrals: "Nenašli sa žiadne kódy odporúčaní.",
      noPayouts: "Žiadne žiadosti o výplatu.",
      approve: "Schváliť",
      reject: "Zamietnuť",
      complete: "Dokončiť",
      sectionCodes: "Kódy odporúčaní",
      sectionPayouts: "Žiadosti o výplatu",
      refresh: "Obnoviť",
      codeActive: "Aktívne",
      codeInactive: "Neaktívne",
      clicks: "kliknutia",
      signups: "registrácie",
      earned: "získané",
      confirm: {
        title: "Potvrdiť akciu pri výplate",
        description:
          "Chceš vykonať túto akciu pri výplate? Po potvrdení ju nemožno vrátiť.",
        cancel: "Zrušiť",
        proceed: "Pokračovať",
      },
    },
  },
  // Enum translations
  enums: {
    subscriptionStatusFilter: {
      incomplete: "Nedokončené",
      incompleteExpired: "Nedokončené, platnosť uplynula",
      all: "Všetky",
      active: "Aktívne",
      trialing: "V skúšobnom období",
      pastDue: "Po splatnosti",
      canceled: "Zrušené",
      unpaid: "Nezaplatené",
      paused: "Pozastavené",
    },
    billingIntervalFilter: {
      any: "Ľubovoľné",
      monthly: "Mesačne",
      yearly: "Ročne",
    },
    providerFilter: {
      any: "Ľubovoľné",
      stripe: "Stripe",
      nowpayments: "NowPayments",
    },
    subscriptionSortField: {
      periodEnd: "Koniec obdobia",
      createdAt: "Vytvorené",
      status: "Stav",
      interval: "Interval",
      userEmail: "E-mail používateľa",
    },
    sortOrder: {
      asc: "Vzostupne",
      desc: "Zostupne",
    },
    creditPackTypeFilter: {
      any: "Ľubovoľné",
      subscription: "Predplatné",
      permanent: "Bez obmedzenia platnosti",
      bonus: "Bonusové",
      earned: "Získané",
    },
    creditPackSourceFilter: {
      any: "Ľubovoľné",
      stripePurchase: "Nákup cez Stripe",
      stripeSubscription: "Kredity z predplatného",
      adminGrant: "Pridelené správcom",
      referralEarning: "Provízia za odporúčanie",
    },
    purchaseSortField: {
      createdAt: "Vytvorené",
      amount: "Suma",
      type: "Typ",
      userEmail: "E-mail používateľa",
    },
    payoutStatusFilter: {
      all: "Všetky",
      pending: "Čaká",
      approved: "Schválené",
      rejected: "Zamietnuté",
      processing: "Spracúva sa",
      completed: "Dokončené",
      failed: "Zlyhalo",
    },
    referralSortField: {
      createdAt: "Vytvorené",
      earnings: "Celkové provízie",
      signups: "Registrácie",
    },
    payoutAction: {
      approve: "Schváliť",
      reject: "Zamietnuť",
      complete: "Dokončiť",
    },
  },
};
