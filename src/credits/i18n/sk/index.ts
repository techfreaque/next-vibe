/**
 * Slovak translations for credits endpoints
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Kredity",
  tags: {
    credits: "kredity",
    balance: "zostatok",
  },
  repository: {
    bonusCreditsAdded: "Pridané bonusové kredity: {{amount}}",
    tts: "Prevod textu na reč",
    stt: "Prepis reči",
    search: "Vyhľadávanie",
    sttHotkey: "Prepis reči (klávesová skratka)",
  },
  enums: {
    freeStatus: {
      active: "Bezplatné kredity sú aktívne",
      verifyEmail: "Over si e-mail a odomkni kredity na účte",
      subnetLimit: "Bezplatné kredity sú pre túto sieť pozastavené",
    },
    creditType: {
      userSubscription: "Kredity z predplatného používateľa",
      leadFree: "Bezplatné kredity kontaktu",
    },
    creditFeature: {
      textToSpeech: "Prevod textu na reč",
      speechToText: "Prepis reči",
      memoryWrite: "Zápis do pamäte",
      memoryEdit: "Úpravy pamäte",
      memorySearch: "Vyhľadávanie v pamäti",
      memoryEmbedding: "Vektorová reprezentácia pamäte",
    },
    transactionType: {
      purchase: "Nákup",
      subscription: "Predplatné",
      usage: "Spotreba",
      expiry: "Skončenie platnosti",
      freeTier: "Bezplatný plán",
      monthlyReset: "Mesačné obnovenie",
      freeGrant: "Bezplatné pridelenie kreditov",
      freeReset: "Obnovenie bezplatného limitu",
      refund: "Vrátenie platby",
      transfer: "Prevod",
      otherDevices: "Použité na inom zariadení",
      referralEarning: "Odmena za odporúčanie",
      referralPayout: "Výplata odmeny za odporúčanie",
    },
    fundingType: {
      freeAllowance: "Bezplatný mesačný limit",
      freeBonus: "Bonus za registráciu alebo newsletter",
      referral: "Kredity za odporúčania",
      purchased: "Zakúpený balík",
      subscription: "Kredity z predplatného",
      adminGrant: "Pridelené správcom",
      freeUnknown: "Bezplatné kredity bez evidovanej kategórie",
      packUnknown: "Balík bez evidovaného pôvodu",
    },
    packType: {
      subscription: "Predplatné",
      permanent: "Bez obmedzenia platnosti",
      bonus: "Bonusové",
      earned: "Získané za odporúčania",
    },
  },
  historyLabels: {
    signupCarryover: "Použité bez účtu pred registráciou",
    sharedLimit: "Prepojené zariadenia majú spoločný mesačný limit",
    monthly: "Bezplatné mesačné kredity",
    monthlyGuest: "Bezplatné mesačné kredity (bez účtu)",
    monthlyAccount: "Bezplatné mesačné kredity (bezplatný účet)",
    monthlyAccountNewsletter: "Bezplatné mesačné kredity (účet a newsletter)",
    freeGuest: "Bezplatné kredity (bez účtu)",
    accountUpgrade: "Bonus za bezplatný účet",
    newsletterBonus: "Bonus za newsletter",
    otherDevices: "Použité na inom zariadení",
    linkedAccount: "Použité prepojeným účtom",
  },
  expire: {
    post: {
      title: "Ukončiť platnosť kreditov",
      titleShort: "Ukončiť platnosť kreditov",
      description:
        "Ukončiť platnosť starých kreditov z predplatného (spúšťa cron)",
      tag: "skončenie platnosti",
      container: {
        title: "Ukončiť platnosť kreditov",
        description: "Výsledky ukončenia platnosti kreditov",
      },
      response: {
        expiredCount: "Počet kreditov po platnosti",
      },
      success: {
        title: "Platnosť kreditov skončila",
        description:
          "Platnosť starých kreditov z predplatného sa úspešne ukončila",
      },
      errors: {
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Vyžaduje sa prihlásenie",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Prístup zamietnutý",
        },
        server: {
          title: "Chyba servera",
          description: "Platnosť kreditov sa nepodarilo ukončiť",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
        validation: {
          title: "Chyba overenia údajov",
          description: "Neplatné parametre požiadavky",
        },
      },
    },
    task: {
      description:
        "Každý deň ukončuje platnosť starých kreditov z predplatného",
      error: "Platnosť kreditov sa nepodarilo ukončiť",
    },
  },
  cleanup: {
    task: {
      description: "Raz za týždeň čistí osirotené peňaženky kontaktov",
      error: "Osirotené peňaženky sa nepodarilo vyčistiť",
    },
  },
  errors: {
    purchasedModel:
      "Tento model vyžaduje zakúpené kredity. Dokúp ich na {{path}} alebo vyber bezplatný model.",
    clusterLimit:
      "Spoločný bezplatný limit je vyčerpaný. Použi zakúpené kredity alebo počkaj na obnovenie limitu.",
    getBalanceFailed: "Zostatok kreditov sa nepodarilo načítať",
    getLeadBalanceFailed: "Zostatok kreditov kontaktu sa nepodarilo načítať",
    getOrCreateLeadFailed: "Kontakt sa nepodarilo načítať ani vytvoriť",
    addCreditsFailed: "Kredity sa nepodarilo pridať",
    deductCreditsFailed: "Kredity sa nepodarilo odpočítať",
    insufficientCredits:
      "Nemáš dosť kreditov. Cena tejto funkcie v kreditoch: {{cost}}.",
    deductionFailed: "Kredity sa nepodarilo odpočítať ({{cost}}). Skús znova.",
    getTransactionsFailed: "Transakcie s kreditmi sa nepodarilo načítať",
    invalidIdentifier: "Neplatné ID používateľa alebo kontaktu",
    userNotFound: "Používateľ sa nenašiel",
    noLeadFound: "K používateľovi sa nenašiel žiadny kontakt",
    getCreditIdentifierFailed:
      "Identifikátor pre kredity sa nepodarilo načítať",
    noCreditSource: "Žiadny zdroj kreditov nie je k dispozícii",
    stripeCustomerFailed: "Zákazníka v Stripe sa nepodarilo vytvoriť",
    checkoutFailed: "Platobnú reláciu sa nepodarilo vytvoriť",
    mergeFailed: "Kredity kontaktov sa nepodarilo zlúčiť",
    mergeLeadWalletsFailed:
      "Peňaženky kontaktov sa nepodarilo zlúčiť s používateľským účtom",
    cleanupOrphanedFailed:
      "Osirotené peňaženky kontaktov sa nepodarilo vyčistiť",
    monthlyResetFailed: "Mesačné kredity sa nepodarilo obnoviť",
    noLeadsToMerge: "Chýbajú kontakty na zlúčenie",
    oldestLeadNotFound: "Najstarší kontakt v skupine sa nenašiel",
    transactionFailed: "Záznam transakcie sa nepodarilo vytvoriť",
    not_implemented_on_native:
      "Operácia {{method}} nie je dostupná v natívnej aplikácii. Použi webovú verziu.",
    expireCreditsFailed: "Platnosť kreditov sa nepodarilo ukončiť",
    invalidAmount: "Počet kreditov musí byť kladné číslo",
    walletNotFound: "Peňaženka sa nenašla",
    walletCreationFailed: "Peňaženku sa nepodarilo vytvoriť",
    addEarnedCreditsFailed: "Získané kredity sa nepodarilo pridať",
    getEarnedBalanceFailed: "Zostatok získaných kreditov sa nepodarilo načítať",
    insufficientEarnedCredits: "Na túto operáciu nemáš dosť získaných kreditov",
    deductEarnedCreditsFailed: "Získané kredity sa nepodarilo odpočítať",
    getReferralTransactionsFailed:
      "Transakcie za odporúčania sa nepodarilo načítať",
  },
  get: {
    title: "Získať zostatok kreditov",
    titleShort: "Zostatok",
    description: "Načíta aktuálny zostatok kreditov podľa zdrojov",
    response: {
      title: "Zostatok kreditov",
      description: "Tvoj aktuálny zostatok kreditov podľa zdrojov",
    },
    balance: {
      subscribe: "Zobraziť plány",
      freePlanHint:
        "Bezplatné kredity za mesiac: {{count}}, s newsletterom {{max}}. Plány začínajú od {{planPrice}} mesačne a najnižší plán zahŕňa {{subCredits}} kreditov mesačne.",
      lowBalance: {
        title: "Zostávajúce kredity: {{count}}",
        emptyTitle: "Minuli sa ti kredity",
        hint: "Nižšie si môžeš dokúpiť {{packCredits}} kreditov za {{packPrice}}. Platnosť sa nekončí.",
        hintPlans: "Vyber si plán nižšie. Kredity dostaneš hneď po zaplatení.",
        offersHint:
          "Dobi si kredity a za pár sekúnd môžeš pokračovať. Platnosť kreditov z balíka sa nekončí.",
        offersHintPlans: "Vyber si plán a za pár sekúnd môžeš pokračovať.",
      },
      freePlan: "Máš bezplatný plán",
      guestPlan: "Zostatok bez účtu",
      signUp: "Zaregistrovať sa zadarmo",
      loadFailed: "Zostatok sa nepodarilo načítať.",
      retry: "Skúsiť znova",
      title: "Tvoje kredity",
      adminTitle: "Limit výdavkov",
      description: "Jeden zostatok pre všetky modely ({{modelCount}}).",
      adminDescription:
        "Kredity určujú hornú hranicu výdavkov. Nastav, koľko môžu všetci používatelia minúť na AI.",
      credit: "{{count}} kredit",
      credits: "Počet kreditov: {{count}}",
      expiring: {
        title: "Kredity s obmedzenou platnosťou",
        description: "Kredity z plánu sa obnovujú v každom fakturačnom období",
        adminDescription: "Časovo obmedzené kredity (obdobie predplatného)",
      },
      permanent: {
        title: "Kredity bez obmedzenia platnosti",
        description: "Ich platnosť sa nekončí",
        adminDescription: "Kredity bez obmedzenia platnosti",
      },
      free: {
        title: "Bezplatné kredity",
        description:
          "Bezplatné kredity za mesiac: {{count}}, s newsletterom {{max}}",
        descriptionGuest:
          "Bezplatné kredity za mesiac: {{guest}}. Po registrácii dostaneš {{signedIn}}, s newsletterom {{max}}.",
        adminDescription:
          "Spoločný mesačný limit bezplatných kreditov pre prepojené zariadenia: {{guest}} bez účtu, {{signedIn}} s účtom, {{max}} s účtom a newsletterom",
      },
      earned: {
        title: "Získané kredity",
        description: "Kredity za odporúčania. Kliknutím pozvi priateľov",
      },
      spending: {
        title: "Tvoje získané kredity",
        adminDescription: "Tvoje osobné odmeny za odporúčania",
      },
    },
    total: {
      content: "Kredity spolu",
    },
    expiring: {
      content: "Kredity s obmedzenou platnosťou (predplatné)",
    },
    permanent: {
      content: "Kredity bez obmedzenia platnosti (balíky)",
    },
    free: {
      content: "Kredity z bezplatného plánu",
    },
    earned: {
      content: "Získané kredity (odporúčania)",
    },
    expiresAt: {
      content: "Platí do",
    },
    capacity: {
      content: "Celková kapacita",
    },
    freeStatus: {
      content: "Stav bezplatných kreditov",
      subnetLimit:
        "Z tvojej siete sa tento mesiac zaregistrovalo priveľa nových bezplatných účtov. Na tomto účte preto zatiaľ nemáš bezplatné kredity. Odomkneš ich nákupom kreditov alebo budúci mesiac, ak bude mať sieť voľný limit.",
    },
    success: {
      title: "Zostatok načítaný",
      description: "Zostatok kreditov sa úspešne načítal",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Neplatné parametre požiadavky",
      },
      network: {
        title: "Chyba siete",
        description: "Sieťové pripojenie zlyhalo",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak si chceš pozrieť zostatok kreditov, prihlás sa",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Na prístup k tomuto zdroju nemáš oprávnenie",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Zdroj sa nenašiel",
      },
      server: {
        title: "Chyba servera",
        description: "Zostatok kreditov sa nepodarilo načítať",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      noActiveSubscription: {
        title: "Vyžaduje sa aktívne predplatné",
        description: "Balíky kreditov si môžeš kúpiť s aktívnym predplatným",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máš neuložené zmeny",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt zdrojov",
      },
      no_active_subscription: {
        title: "Vyžaduje sa aktívne predplatné",
        description: "Balíky kreditov si môžeš kúpiť s aktívnym predplatným",
      },
    },
  },
  history: {
    get: {
      packId: "Balík kreditov",
      showFilters: "Zobraziť filtre",
      hideFilters: "Skryť filtre",
      guestGrantsHidden: "Bezplatné prídely hosťom sú skryté",
      recent: "Nedávna aktivita",
      payment: "Platba",
      recentTitle: "Posledné záznamy v účtovnej knihe",
      guestDevice: "Zariadenie hosťa",
      kindAccount: "Účet",
      kindLead: "Kontakt bez účtu",
      openPayment: "Otvoriť platbu",
      currentBalance: "Aktuálny zostatok",
      currentBalanceHint: "V balíkoch: {{paid}} · Bezplatné: {{free}}",
      showingRange: "Zobrazené záznamy {{from}} až {{to}} z {{total}}",
      from: "Od",
      to: "Do",
      totals: "Súhrn",
      allTypes: "Všetky typy",
      filteredBy: "Použité filtre",
      clearFilters: "Zrušiť všetky filtre",
      removeFilter: "Odstrániť filter",
      spent: "Odpočítané kredity",
      granted: "Pripísané kredity",
      entries: "Záznamy",
      periodHint: "Vo vybranom období",
      emptyFiltered: "Žiadne záznamy nezodpovedajú filtrom.",
      typeFilter: {
        label: "Typ",
      },
      target: {
        label: "Zákazník",
        description: "E-mail účtu, ID používateľa alebo ID kontaktu",
        placeholder: "customer@example.com alebo ID",
      },
      resolvedTarget: "Účtovná kniha účtu alebo kontaktu",
      detail: "Model alebo funkcia",
      targetNotFound: "Nenašiel sa účet ani kontakt zodpovedajúci {{target}}.",
      lookupTitle: "Účtovná kniha zákazníka",
      lookupHint:
        "Vyhľadaj účet alebo kontakt podľa e-mailu, ID používateľa alebo ID kontaktu. Zobrazia sa všetky pripísané aj odpočítané kredity.",
      openLedger: "Otvoriť účtovnú knihu",
      changeTarget: "Vyhľadať iného zákazníka",
      colDate: "Dátum",
      colType: "Typ",
      colDetail: "Model alebo funkcia",
      colAmount: "Suma",
      colBalance: "Zostatok po transakcii",
      showing: "Účtovná kniha: {{who}}",
      bonusGrant: "Pridelenie bonusových kreditov",
      relatedRecords: "Súvisiace záznamy",
      account: "Zákazník",
      lead: "Kontakt",
      openAccount: "Otvoriť zákazníka",
      openLead: "Otvoriť kontakt",
      openPayouts: "Zobraziť výplaty partnerom",
      loading: "Načítava sa história kreditov…",
      delta: "{{amount}} kred.",
      entryBalance: "Zostatok po transakcii: {{count}} kred.",
      emptyHint: "Tu vidíš všetky pripísané aj odpočítané kredity.",
      title: "Získať históriu kreditov",
      titleShort: "História kreditov",
      description: "Načíta históriu transakcií s kreditmi po stranách",
      container: {
        title: "História kreditov",
        description: "Zobraz históriu svojich transakcií s kreditmi",
      },
      emptyState: "Zatiaľ žiadne transakcie",
      balance: "Zostatok po transakcii: {{count}}",
      limit: {
        label: "Limit",
        description: "Najvyšší počet transakcií vo výsledku (1 až 100)",
      },
      offset: {
        label: "Posun",
        description:
          "Počet transakcií, ktoré sa majú pri stránkovaní preskočiť",
      },
      targetUserId: {
        label: "ID cieľového používateľa",
      },
      targetLeadId: {
        label: "ID cieľového kontaktu",
      },
      id: "ID transakcie",
      amount: "Suma",
      type: "Typ",
      modelId: "Model",
      messageId: "ID správy",
      createdAt: "Dátum",
      transactions: {
        title: "Transakcie",
        description: "Zoznam transakcií s kreditmi",
      },
      paginationInfo: {
        total: "Počet transakcií spolu",
        totalPages: "Počet strán spolu",
      },
      totalCount: {
        content: "Celkový počet",
      },
      transaction: {
        id: {
          content: "ID transakcie",
        },
        amount: {
          content: "Suma",
        },
        balanceAfter: {
          content: "Zostatok po transakcii",
        },
        type: {
          content: "Typ",
        },
        modelId: {
          content: "Model",
        },
        messageId: {
          content: "ID správy",
        },
        createdAt: {
          content: "Dátum",
        },
      },
      success: {
        title: "História načítaná",
        description: "História kreditov sa úspešne načítala",
      },
      errors: {
        validation: {
          title: "Chyba overenia údajov",
          description: "Neplatné parametre požiadavky",
        },
        network: {
          title: "Chyba siete",
          description: "Sieťové pripojenie zlyhalo",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Ak si chceš pozrieť históriu kreditov, prihlás sa",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Na prístup k tomuto zdroju nemáš oprávnenie",
        },
        notFound: {
          title: "Nenašlo sa",
          description: "Zdroj sa nenašiel",
        },
        server: {
          title: "Chyba servera",
          description: "Históriu kreditov sa nepodarilo načítať",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máš neuložené zmeny",
        },
        conflict: {
          title: "Konflikt",
          description: "Nastal konflikt zdrojov",
        },
      },
    },
  },
  purchase: {
    post: {
      title: "Kúpiť kredity",
      description: "Vytvorí platobnú reláciu v Stripe na nákup balíka kreditov",
      container: {
        title: "Kúpiť kredity",
        description: "Kúp si balíky kreditov na využívanie funkcií AI",
      },
      quantity: {
        label: "Množstvo",
        description: "Počet balíkov kreditov na nákup (1 až 10)",
        placeholder: "Zadaj počet balíkov (1 až 10)",
      },
      provider: {
        label: "Poskytovateľ platby",
        description: "Vyber si spôsob platby",
        placeholder: "Vybrať poskytovateľa platby",
      },
      checkoutUrl: {
        content: "Adresa platby",
      },
      sessionId: {
        content: "ID platobnej relácie",
      },
      totalAmount: {
        content: "Celková suma (v centoch)",
      },
      totalCredits: {
        content: "Kredity spolu",
      },
      success: {
        title: "Platobná relácia vytvorená",
        description: "Platobná relácia v Stripe sa úspešne vytvorila",
      },
      errors: {
        validation: {
          title: "Chyba overenia údajov",
          description: "Neplatný počet balíkov",
        },
        network: {
          title: "Chyba siete",
          description: "Sieťové pripojenie zlyhalo",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Ak chceš kúpiť kredity, prihlás sa",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Na nákup kreditov nemáš oprávnenie",
        },
        notFound: {
          title: "Nenašlo sa",
          description: "Zdroj sa nenašiel",
        },
        server: {
          title: "Chyba servera",
          description: "Platobnú reláciu sa nepodarilo vytvoriť",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máš neuložené zmeny",
        },
        conflict: {
          title: "Konflikt",
          description: "Nastal konflikt zdrojov",
        },
        noActiveSubscription: {
          title: "Vyžaduje sa aktívne predplatné",
          description: "Balíky kreditov si môžeš kúpiť s aktívnym predplatným",
        },
      },
    },
  },
  adminAdd: {
    recipient: {
      details: "Údaje o príjemcovi",
      lookup: "E-mail alebo ID účtu",
      lookupDescription:
        "Zadaj presnú e-mailovú adresu účtu alebo ID používateľa.",
      renewsOn: "Obnoví sa {{date}}",
      endsOn: "Skončí sa {{date}}",
      freeBalance: "Bezplatné kredity",
      balanceSplit:
        "Celkom: {{total}} · V balíkoch: {{paid}} · Bezplatné: {{free}}",
      stepHint: "V prvom kroku over príjemcu. V druhom zvoľ počet kreditov.",
      verified: "Overený príjemca",
      kind: "Typ príjemcu",
      kindAccount: "Účet · prepojené zariadenia: {{count}}",
      subscription: "Predplatné",
      noSubscription: "Bez predplatného",
      linkedDevices: "Prepojené zariadenia",
      recentGrants: "Nedávno pridelené bonusové kredity",
      noGrants: "Zatiaľ bez pridelených bonusových kreditov",
      grantLine: "Pridelené {{date}}: {{count}} kred.",
      nextStep: "Ďalší krok: prideliť kredity tomuto účtu",
      grant: "Prideliť kredity",
      openLedger: "Otvoriť účtovnú knihu",
      name: "Meno",
      balance: "Aktuálny zostatok",
      joinedAt: "Registrácia",
      noName: "Meno nie je nastavené",
      credits: "Počet kreditov: {{count}}",
      balanceLine: "Zostatok kreditov: {{count}}",
      joinedLine: "Dátum registrácie: {{date}}",
      title: "Overiť príjemcu kreditov",
      description: "Vyhľadaj účet, ktorý môže dostať bonusové kredity.",
      accountId: "ID účtu",
      email: "E-mail príjemcu",
      noLinkedDevice: "Tento účet nemá žiadne prepojené zariadenie.",
      loadFailed: "Príjemcu sa nepodarilo overiť.",
      loading: "Príjemca sa overuje…",
      retry: "Skús znova",
      openAccount: "Otvoriť zákazníka",
      change: "Vybrať iného príjemcu",
      verify: "Overiť",
    },
    post: {
      stepTwo: "Krok 2 z 2: počet kreditov",
      testerPreset: "3 000 (tester)",
      preview: "Zostatok {{before}} → {{after}} (+{{amount}})",
      title: "Pridať kredity",
      titleShort: "Pridať kredity",
      description:
        "Pridá balíky kreditov na používateľský účet (iba pre správcov)",
      tag: "správca",
      container: {
        title: "Prideliť bonusové kredity",
        description:
          "Vyber príjemcu a zadaj presný počet kreditov, ktoré pripíšeš do jeho peňaženky.",
        selfTitle: "Pridať kredity na vlastný účet",
        selfDescription: "Prideľ si bonusové kredity",
      },
      targetUserId: {
        label: "Príjemca",
        description: "Vyber zákazníka z adresára účtov.",
      },
      amount: {
        label: "Počet kreditov",
        description: "Zadaj počet bonusových kreditov ako celé číslo.",
        placeholder: "137",
      },
      packType: {
        label: "Typ balíka",
        description: "Typ pridávaného balíka kreditov",
      },
      response: {
        message: {
          content: "Výsledok",
        },
      },
      backButton: {
        label: "Späť",
      },
      submitButton: {
        label: "Prideliť bonusové kredity",
        loadingText: "Kredity sa prideľujú…",
      },
      success: {
        title: "Kredity pridané",
        description: "Kredity sa pripísali na používateľský účet",
      },
      errors: {
        validation: {
          title: "Chyba overenia údajov",
          description: "Neplatné parametre požiadavky",
        },
        network: {
          title: "Chyba siete",
          description: "Sieťové pripojenie zlyhalo",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Vyžaduje sa prihlásenie",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Vyžadujú sa oprávnenia správcu",
        },
        notFound: {
          title: "Nenašlo sa",
          description: "Používateľ sa nenašiel",
        },
        server: {
          title: "Chyba servera",
          description: "Kredity sa nepodarilo pridať",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máš neuložené zmeny",
        },
        conflict: {
          title: "Konflikt",
          description: "Nastal konflikt zdrojov",
        },
      },
    },
  },
  email: {
    creditPack: {
      user: {
        subject: "Tvoj balík kreditov na {{appName}} je pripravený",
        title: "Kredity sú na tvojom účte",
        previewText: "Kredity máš na účte. Pripísali sme ti {{credits}}.",
        greeting: "Ahoj, {{privateName}},",
        body: "Tvoj nákup prebehol úspešne. Počet pripísaných kreditov: {{credits}}. Platnosť kreditov nevyprší a môžeš ich použiť hneď.",
        cta: "Začať používať kredity",
        signoff: "Ďakujeme za nákup!\n\nTím {{appName}}",
      },
      admin: {
        subject: "[{{appName}}] Nákup kreditov v balíku ({{credits}})",
        title: "Nákup balíka kreditov",
        preview: "Používateľ kúpil balík kreditov",
        body: "Používateľ si kúpil balík kreditov.",
        labelUser: "Používateľ",
        labelCredits: "Kredity",
        footer: "Automatické oznámenie od {{appName}}",
      },
    },
  },
};
