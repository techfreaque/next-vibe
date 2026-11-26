import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Main referral domain
  category: "Odporúčania",

  // Tags
  tags: {
    referral: "odporúčania",
    codes: "kódy",
    earnings: "provízie",
    get: "získať",
    create: "vytvoriť",
    list: "zoznam",
  },

  // GET endpoint (get referral code)
  get: {
    title: "Získať kód odporúčania",
    titleShort: "Získať kód",
    description: "Načíta podrobnosti kódu odporúčania",
    form: {
      title: "Podrobnosti kódu odporúčania",
      description: "Zobraziť údaje o kóde odporúčania",
      limit: {
        label: "Limit",
        description: "Najvyšší počet výsledkov",
      },
      offset: {
        label: "Posun",
        description: "Počet výsledkov na preskočenie",
      },
    },
    response: {
      earnings: {
        id: "ID",
        earnerUserId: "ID príjemcu provízie",
        sourceUserId: "ID používateľa, z ktorého platby vznikla provízia",
        transactionId: "ID transakcie",
        level: "Úroveň",
        amountCents: "Suma (v centoch)",
        currency: "Mena",
        status: "Stav",
        createdAt: "Vytvorené",
      },
      totalCount: "Celkový počet",
    },
  },

  // POST endpoint (create referral code)
  post: {
    title: "Vytvoriť kód odporúčania",
    titleShort: "Vytvoriť kód",
    description: "Vytvorí nový kód odporúčania",
    form: {
      title: "Nový kód odporúčania",
      description:
        "Vytvorte jeden kód pre každé publikum. Napríklad Discord, blog a priatelia. Každý kód sa sleduje samostatne.",
    },
    submit: {
      label: "Vytvoriť kód",
      loading: "Vytvára sa kód…",
    },
  },

  // PUT endpoint (update referral code)
  put: {
    title: "Upraviť kód odporúčania",
    description: "Upravte nastavenia kódu odporúčania",
    form: {
      title: "Upraviť kód odporúčania",
      description: "Upravte vlastnosti kódu",
    },
  },

  // DELETE endpoint (deactivate referral code)
  delete: {
    title: "Deaktivovať kód odporúčania",
    description: "Deaktivuje kód odporúčania",
    form: {
      title: "Deaktivovať kód odporúčania",
      description: "Vypnite tento kód odporúčania",
    },
  },

  // Link to Lead endpoint
  linkToLead: {
    post: {
      title: "Priradiť odporúčanie ku kontaktu",
      titleShort: "Priradiť odporúčanie",
      description: "Priradí kód odporúčania ku kontaktu pred registráciou",
      form: {
        title: "Priradiť kód odporúčania",
        description: "Priraďte kód odporúčania k svojej relácii",
      },
    },
    success: {
      title: "Odporúčanie priradené",
      description: "Kód odporúčania sa priradil k vašej relácii",
    },
  },

  // Codes List endpoint
  codes: {
    list: {
      get: {
        title: "Zobraziť kódy odporúčaní",
        titleShort: "Moje kódy",
        description: "Načíta všetky vaše kódy odporúčaní so štatistikami",
        form: {
          title: "Vaše kódy odporúčaní",
          description: "Zobrazte a spravujte svoje kódy odporúčaní",
        },
        response: {
          codes: {
            id: "ID",
            code: "Kód",
            label: "Označenie",
            currentVisitors: "Aktuálni návštevníci",
            isActive: "Aktívne",
            createdAt: "Vytvorené",
            totalSignups: "Registrácie spolu",
            totalRevenueCents: "Celkové tržby (v centoch)",
            totalEarningsCents: "Celkové provízie (v centoch)",
          },
        },
      },
      success: {
        title: "Kódy načítané",
        description: "Vaše kódy odporúčaní sa úspešne načítali",
      },
      widget: {
        loading: "Načítavajú sa vaše kódy…",
        empty: "Zatiaľ nemáte žiadne kódy odporúčaní",
        emptyHint: "Vytvorte si prvý kód nižšie. Odkaz bude ihneď pripravený.",
        copied: "Skopírované",
        copy: "Kopírovať odkaz",
        visitors: "Návštevníci",
        signups: "Registrácie",
        revenue: "Tržby",
        earnings: "Provízie",
        inactive: "Tento kód odporúčania je neaktívny",
        conversionHint:
          "Každý predplatiteľ s platbou {{examplePrice}} mesačne vám prináša {{exampleEarning}} každý mesiac.",
        linkGen: "Vlastný odkaz",
        linkGenPlaceholder: "Vložte adresu URL stránky…",
        linkGenHint:
          "Vložte adresu URL ľubovoľnej stránky unbottled a vytvorte sledovaný odkaz s odporúčaním",
        linkGenCopy: "Kopírovať",
        linkGenCopied: "Skopírované",
      },
    },
  },

  // Stats endpoint
  stats: {
    get: {
      title: "Štatistiky odporúčaní",
      titleShort: "Štatistiky",
      description: "Načíta štatistiky vášho programu odporúčaní",
      form: {
        title: "Vaše štatistiky odporúčaní",
        description: "Zobrazte výsledky svojich odporúčaní",
      },
    },
    success: {
      title: "Štatistiky načítané",
      description: "Štatistiky odporúčaní sa úspešne načítali",
    },
    widget: {
      emptyAdminMessage:
        "Otvorte prehľad a pozrite si aktivitu v celom programe.",
      loading: "Načítavajú sa štatistiky odporúčaní",
      loadError: "Štatistiky odporúčaní sa nepodarilo načítať",
      retry: "Skúsiť znova",
      emptyTitle: "Zatiaľ žiadna aktivita odporúčaní",
      openCodes: "Otvoriť odporúčacie kódy",
      revenueCoverage:
        "Pôvodná suma zaznamenaná pri {{measured}} z {{total}} nákupov.",
      revenueUnavailable: "Nedostupné",
      walletUnits: "Kredity: {{amount}}",
      adminNotice:
        "Tieto údaje sa týkajú Vašich odporúčaní. Prehľad obsahuje výsledky celého programu.",
      openOverview: "Otvoriť prehľad odporúčaní",
      emptyMessage:
        "Zdieľajte odporúčací kód, aby ste mohli sledovať registrácie a provízie.",
    },
    fields: {
      totalSignups: "Registrácie spolu",
      totalSignupsDescription:
        "Počet používateľov, ktorí sa zaregistrovali s vaším kódom",
      totalRevenue: "Zaznamenaná hodnota nákupov",
      totalRevenueDescription:
        "Pôvodné sumy nákupov v USD, z ktorých boli vypočítané Vaše provízie.",
      totalEarned: "Celkové provízie",
      totalEarnedDescription:
        "Získané kredity vrátane kreditov, pri ktorých ešte plynie lehota na vrátenie platby.",
      availableBalance: "Dostupný zostatok",
      availableBalanceDescription:
        "Kredity dostupné po odpočítaní rezervovaných výplat.",
      availableBalanceDescriptionLow:
        "Kredity dostupné po odpočítaní rezervovaných výplat. Minimálna výplata: {{minPayout}} kreditov.",
      totalRevenueCredits: "Celkové tržby (v kreditoch)",
      totalEarnedCredits: "Celkové provízie (v kreditoch)",
      totalPaidOutCredits: "Celkom vyplatené (v kreditoch)",
      availableCredits: "Dostupné kredity",
    },
  },

  // Earnings List endpoint
  earnings: {
    confirm: {
      post: {
        title: "Potvrdiť provízie za odporúčania",
        titleShort: "Potvrdiť provízie",
        description:
          "Uvoľní provízie, pri ktorých uplynula lehota na vrátenie platby. Spúšťa sa denne.",
        container: {
          title: "Potvrdenie provízií",
          description:
            "Čakajúce provízie po uplynutí lehoty na vrátenie platby",
        },
        response: {
          confirmedCount: "Potvrdené",
          failedCount: "Zlyhalo",
        },
        success: {
          title: "Provízie potvrdené",
          description:
            "Provízie po uplynutí lehoty na vrátenie platby sa už dajú použiť",
        },
      },
      task: {
        description:
          "Prevedie provízie po uplynutí lehoty na vrátenie platby na získané kredity",
      },
    },
    list: {
      get: {
        title: "Zobraziť provízie za odporúčania",
        titleShort: "Provízie",
        description: "Načíta históriu vašich provízií za odporúčania",
        form: {
          title: "Vaše provízie za odporúčania",
          description: "Zobrazte si svoje provízie za odporúčania",
        },
        response: {
          earnings: {
            id: "ID",
            earnerUserId: "ID príjemcu provízie",
            sourceUserId: "ID používateľa, z ktorého platby vznikla provízia",
            transactionId: "ID transakcie",
            level: "Úroveň",
            amountCents: "Suma (v centoch)",
            currency: "Mena",
            status: "Stav",
            createdAt: "Vytvorené",
          },
        },
      },
      success: {
        title: "Provízie načítané",
        description: "Vaše provízie za odporúčania sa úspešne načítali",
      },
    },
  },

  // Form fields
  form: {
    fields: {
      code: {
        label: "Kód",
        description:
          "Text, ktorý ľudia zadajú alebo uvidia v odkaze. Od 3 do 50 znakov.",
        placeholder: "napríklad ALEX10",
      },
      label: {
        label: "Označenie (vidíte ho iba vy)",
        description: "Kde budete kód zdieľať.",
        placeholder: "napríklad profil na YouTube",
      },
      description: {
        label: "Popis",
        description: "Voliteľný popis",
        placeholder: "Zadajte popis",
      },
      maxUses: {
        label: "Najvyšší počet použití",
        description: "Koľkokrát sa tento kód môže použiť",
        placeholder: "Prázdne pole znamená bez obmedzenia",
      },
      expiresAt: {
        label: "Dátum skončenia platnosti",
        description: "Kedy sa skončí platnosť kódu",
        placeholder: "Vyberte dátum",
      },
      isActive: {
        label: "Aktívne",
        description: "Či je tento kód aktuálne aktívny",
      },
    },
  },

  // Response fields
  response: {
    id: "ID",
    code: "Kód",
    label: "Označenie",
    description: "Popis",
    ownerUserId: "ID vlastníka",
    maxUses: "Najvyšší počet použití",
    currentUses: "Doterajší počet použití",
    expiresAt: "Platí do",
    isActive: "Aktívne",
    createdAt: "Vytvorené",
    updatedAt: "Aktualizované",
    referralCode: "Kód odporúčania",
    success:
      "🎉 Kód odporúčania je pripravený! Skopírujte odkaz nižšie a získajte províziu {{directPct}} z každého predplatného aj dodatočné provízie z odporúčaní týchto používateľov.",
    message: "Správa",
  },

  // Admin payout management
  admin: {
    payouts: {
      get: {
        title: "Žiadosti o výplatu",
        titleShort: "Žiadosti",
        description: "Spravujte žiadosti o výplatu provízií",
      },
      post: {
        title: "Spracovať výplatu",
        titleShort: "Spracovať výplatu",
        description: "Schváľte, zamietnite alebo dokončite žiadosť o výplatu",
      },
      fields: {
        search: {
          label: "E-mail partnera",
          description:
            "Vyhľadajte podľa celej e-mailovej adresy alebo jej časti.",
        },
        userId: {
          label: "Účet partnera",
        },
        page: {
          label: "Stránka",
        },
        limit: {
          label: "Výsledky na stranu",
        },
        status: {
          all: "Všetky stavy",
          label: "Filter stavu",
          description: "Filtrovať podľa stavu výplaty",
        },
        currency: {
          label: "Spôsob výplaty",
          description: "Filtrovať podľa spôsobu výplaty",
          all: "Všetky spôsoby",
        },
        requestId: {
          label: "ID žiadosti",
          description: "Identifikátor žiadosti o výplatu",
        },
        action: {
          label: "Akcia",
          description: "Akcia, ktorá sa má vykonať so žiadosťou o výplatu",
        },
        adminNotes: {
          label: "Poznámky správcu",
          description: "Voliteľné poznámky k tejto akcii",
        },
        rejectionReason: {
          label: "Dôvod zamietnutia",
          description: "Dôvod zamietnutia žiadosti o výplatu",
        },
      },
      widget: {
        empty: "Nenašli sa žiadne žiadosti o výplatu",
        emptyHint: "Skúste iný e-mail alebo stav.",
        results: "Počet žiadostí o výplatu: {{count}}",
        apply: "Použiť filtre",
        clear: "Zrušiť filtre",
        refresh: "Obnoviť",
        loading: "Načítavajú sa žiadosti o výplatu…",
        amount: "Získané kredity: {{credits}} · Ekvivalent v USD: {{value}}",
        payoutSummary: "{{amount}} · Mena výplaty: {{currency}}",
        requestedAt: "Žiadosť podaná {{date}}",
        processedAt: "Aktualizované {{date}}",
        rejectionReason: "Dôvod: {{reason}}",
        adminNotes: "Poznámky: {{notes}}",
        openPartner: "Otvoriť účet partnera",
        openPartnerFor: "Otvoriť účet partnera {{email}}",
        actionFor: "{{action}}: výplata pre {{email}}",
        previous: "Predchádzajúca strana",
        next: "Ďalšia strana",
        page: "Stránka {{page}} z {{total}}",
        confirmAction: "Potvrdiť akciu",
        lookupFailed: "Žiadosť o výplatu sa nepodarilo načítať.",
        state: "Stav",
        valueLabel: "Požadovaná hodnota",
        destinationLabel: "Mena výplaty",
        actionSaved: "Zmena žiadosti o výplatu sa uložila.",
        approveDetail:
          "Po schválení zostanú získané kredity rezervované na túto výplatu.",
        rejectDetail:
          "Po zamietnutí sa kredity rezervované na túto výplatu uvoľnia.",
        completeDetail:
          "Po odoslaní prevodu označte výplatu za dokončenú. Tým sa odpočítajú príslušné získané kredity.",
        approve: "Schváliť",
        reject: "Zamietnuť",
        complete: "Dokončiť",
        credits: "kredity",
        partnerContext:
          "Potvrdené provízie: {{confirmed}} · Zadržané: {{pending}} · Vyplatené: {{paid}}",
        creditsLine: "Získané kredity: {{credits}}",
        freeLine: "Voľný zostatok po odpočítaní otvorených žiadostí: {{free}}",
        overBalanceSingle:
          "Žiadosť je na {{amount}}. Z potvrdeného zostatku zostáva nevyplatených iba {{available}}. Žiadosť neschvaľujte.",
        partnerCodes: "Kódy: {{codes}} · Odporučení používatelia: {{referred}}",
        partnerNoCodes:
          "Bez vlastného kódu · Odporučení používatelia: {{referred}}",
        overBalance:
          "Otvorené žiadosti ({{count}}) spolu žiadajú {{open}}. Z potvrdeného zostatku zostáva nevyplatených iba {{available}}. Neschvaľujte všetky.",
        possibleDuplicate:
          "Možná duplicita: ďalšie otvorené žiadosti s rovnakou sumou a peňaženkou ({{count}}).",
        headline: "{{value}} na výplatu v {{currency}}",
        overBalanceShort:
          "Nad potvrdeným zostatkom. Pozrite si prvú žiadosť tohto partnera.",
        approveOverBalance: "Napriek tomu schváliť",
        nextStep: {
          failed:
            "Prevod sa nepodarilo dokončiť. Kredity sme neodpočítali. Partner môže podať novú žiadosť.",
          processing:
            "Prevod prebieha. Systém ho dokončí alebo označí za neúspešný automaticky. Nemusíte nič robiť.",
          credits:
            "Pri žiadosti o výplatu v kreditoch prebehne prevod ihneď. Ak je žiadosť stále v stave Čaká, spracovanie uviazlo. Zamietnite ju, aby sa provízia uvoľnila a partner mohol podať novú žiadosť.",
        },
        prepareBill: "Pripraviť došlú faktúru",
        codeReport: "Prehľad kódu",
      },
    },
  },

  // Payout endpoint + errors
  payout: {
    get: {
      title: "Vaše provízie",
      titleShort: "Moje provízie",
      description: "Pozrite si svoje provízie za odporúčania a históriu výplat",
    },
    post: {
      title: "Požiadať o výplatu",
      titleShort: "Požiadať o výplatu",
      description: "Vyplaťte si provízie za odporúčania",
    },
    fields: {
      amountCents: {
        label: "Suma (v kreditoch)",
        description: "Suma na výplatu v kreditoch",
        placeholder: "napríklad 5000",
      },
      currency: {
        label: "Spôsob výplaty",
        description: "Ako chcete provízie dostať",
      },
      walletAddress: {
        label: "Adresa peňaženky",
        description: "Povinná pri výplate v BTC alebo USDC",
        placeholder: "Adresa vašej peňaženky",
      },
    },
    widget: {
      totalEarned: "Celkové provízie",
      available: "Dostupné",
      locked: "Zadržané",
      credits: "kredity",
      readyForPayout: "pripravené na výplatu",
      moreToUnlock: "chýba do minima",
      pendingConfirmation: "čaká na potvrdenie",
      requestPayout: "Požiadať o výplatu",
      payoutHistory: "História výplat",
      noPayout: "Zatiaľ bez žiadostí o výplatu",
      howItWorksTitle: "Ako to funguje",
      step1Title: "Vytvorte kódy odporúčaní",
      step1Body:
        "Vytvorte samostatný kód pre priateľov, sociálne siete alebo kampane.",
      step2Title: "Zdieľajte odkaz alebo odkaz na zručnosť",
      step2Body:
        "Odkaz s odporúčaním prináša {{directPct}} z každej platby odporučeného používateľa bez časového obmedzenia. Keď niekto zdieľa vašu zručnosť, získate {{skillBonusPct}} z každej platby používateľov, ktorých priviedol.",
      step3Title: "Získajte provízie",
      step3Body:
        "Provízie sa uvoľnia po uplynutí lehoty na vrátenie platby, teda po {{holdDays}} dňoch od každej platby. Potom ich použite ako kredity na chat alebo si ich nechajte vyplatiť v kryptomene.",
      withdrawTitle: "Vyplaťte si provízie",
      withdrawDescription:
        "Vyberte si, ako chcete použiť provízie za odporúčania",
      useAsCredits: "Použiť ako kredity na chat",
      useAsCreditsDesc: "Preveďte provízie ihneď na kredity na rozhovory s AI.",
      cryptoPayout: "Vyplatiť v kryptomene",
      cryptoPayoutDesc:
        "Požiadajte o výplatu v BTC alebo USDC na adresu svojej peňaženky.",
      minimumNote:
        "Najnižšia suma výplaty: {{minPayout}}. Výplaty v kryptomene spracujeme do {{cryptoPayoutHours}} hodín od schválenia.",
      progressLabel: "Postup k minimálnej výplate",
      unlockedOf: "uvoľnené z",
      viewHistory: "Zobraziť históriu",
      historyEmpty: "Tu sa zobrazia vaše výplaty",
      pendingTitle: "Čaká na uvoľnenie: {{amount}}",
      pendingNote:
        "Provízie sa uvoľnia po uplynutí lehoty na vrátenie platby, teda po {{holdDays}} dňoch od každej platby. Pri vrátení platby sa príslušná provízia zruší.",
    },
    email: {
      user: {
        subjectCrypto: "Žiadosť o výplatu prijatá",
        subjectCredits: "Provízie prevedené na kredity",
        titleCrypto: "Vaša žiadosť o výplatu",
        titleCredits: "Provízie prevedené na kredity",
        previewCrypto: "Vaša žiadosť o výplatu sa spracúva",
        previewCredits: "Vaše provízie sa previedli na kredity",
        bodyCrypto:
          "Dostali sme vašu žiadosť o výplatu. Výplaty v kryptomene spracujeme do {{cryptoPayoutHours}} hodín od schválenia správcom.",
        bodyCredits:
          "Vaše provízie za odporúčania sme ihneď previedli na kredity na chat a pripísali na váš účet.",
        followUpCrypto: "Po spracovaní výplaty dostanete ďalší e-mail.",
        labelAmount: "Suma",
        labelMethod: "Spôsob výplaty",
        labelWallet: "Peňaženka",
        credits: "kredity",
      },
      admin: {
        subject: "Nová žiadosť o výplatu",
        title: "Nová žiadosť o výplatu",
        preview: "Žiadosť o výplatu podaná",
        body: "Používateľ podal žiadosť o výplatu.",
        footer: "Skontrolujte a spracujte žiadosť v správcovskom rozhraní.",
        labelUser: "Používateľ",
        labelAmount: "Suma",
        labelCurrency: "Mena",
        labelWallet: "Peňaženka",
        credits: "kredity",
      },
    },
    errors: {
      minimumAmount: "Najnižšia suma výplaty je {{minPayout}}",
      walletRequired: "Na výplatu v kryptomene je potrebná adresa peňaženky",
      insufficientBalance: "Na výplatu nie je dostatočný zostatok",
      conversionFailed:
        "Prevod zlyhal. Provízie zostali bez zmeny. Skúste znova o minútu.",
      notFound: "Žiadosť o výplatu sa nenašla",
      invalidStatus: "Stav žiadosti o výplatu túto operáciu neumožňuje",
    },
    success: {
      creditsConverted: "Provízie sa úspešne previedli na kredity",
      payoutRequested:
        "Žiadosť o výplatu bola podaná. Lehota spracovania v hodinách: {{hours}}.",
    },
  },

  // Error types
  errors: {
    validation: {
      title: "Chyba overenia údajov",
      description: "Neplatné parametre kódu odporúčania",
    },
    network: {
      title: "Chyba siete",
      description: "Chyba sieťového pripojenia",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Vyžaduje sa prihlásenie",
    },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Nemáte oprávnenie na prístup",
    },
    notFound: {
      title: "Nenašlo sa",
      description: "Kód odporúčania sa nenašiel",
    },
    not_found: "Kód odporúčania sa nenašiel",
    server: {
      title: "Chyba servera",
      description: "Vyskytla sa interná chyba servera",
    },
    serverError: {
      title: "Chyba servera",
      description: "Vyskytla sa interná chyba servera",
      detail: "Na našej strane nastala chyba: {{error}}",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Vyskytla sa neznáma chyba",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Máte neuložené zmeny",
    },
    conflict: {
      title: "Konflikt",
      description: "Kód odporúčania už existuje",
    },
    code_exists: "Tento kód odporúčania už existuje",
    code_expired: "Platnosť tohto kódu odporúčania uplynula",
    code_inactive: "Tento kód odporúčania nie je aktívny",
    max_uses_reached: "Tento kód odporúčania dosiahol limit použití",
    invalid_code: "Neplatný kód odporúčania",
  },

  // Success types
  success: {
    title: "Úspech",
    description: "Operácia sa úspešne dokončila",
    code_created: "Kód odporúčania sa úspešne vytvoril",
    code_updated: "Kód odporúčania sa úspešne upravil",
    code_deactivated: "Kód odporúčania sa úspešne deaktivoval",
  },

  // Enum translations
  enums: {
    sourceType: {
      subscription: "Predplatné",
      creditPack: "Balík kreditov",
    },
    earningStatus: {
      pending: "Čaká",
      confirmed: "Potvrdené",
      canceled: "Zrušené",
    },
    payoutCurrency: {
      usdc: "USDC",
      btc: "Bitcoin",
      credits: "Kredity",
    },
    payoutStatus: {
      pending: "Čaká",
      processing: "Spracúva sa",
      completed: "Dokončené",
      failed: "Zlyhalo",
      rejected: "Zamietnuté",
      approved: "Schválené",
    },
  },
};
