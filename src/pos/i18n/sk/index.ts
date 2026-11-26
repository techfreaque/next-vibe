import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Pokladňa",
  tags: {
    pos: "POS",
    terminal: "Pokladničný terminál",
    session: "Pokladničná zmena",
    order: "Objednávka",
    payment: "Platba",
    create: "Vytvoriť",
    list: "Zoznam",
    get: "Načítať",
    open: "Otvoriť",
    close: "Zavrieť",
    complete: "Dokončiť",
    void: "Stornovať",
    addItem: "Pridať položku",
    removeItem: "Odstrániť položku",
    addPayment: "Pridať platbu",
  },
  endpointCategories: {
    pos: "Pokladňa",
    terminals: "Pokladničné terminály",
    sessions: "Pokladničné zmeny",
    orders: "Objednávky",
  },
  enums: {
    sessionStatus: {
      open: "Otvorené",
      closed: "Uzatvorené",
    },
    orderStatus: {
      open: "Otvorené",
      completed: "Dokončené",
      voided: "Stornované",
    },
    paymentMethod: {
      cash: "Hotovosť",
      card: "Platobná karta",
      transfer: "Bankový prevod",
      other: "Iný spôsob",
    },
  },
  workflow: {
    backToSessionOrders: "Späť na objednávky relácie",
    receiptTitle: "Účtenka",
    amountDue: "Suma na úhradu",
    ledgerCurrencyMismatch:
      "Objednávka používa inú menu než účtovníctvo. Pred prijatím platby použite pokladňu alebo objednávku v účtovnej mene.",
    postingUnavailable:
      "Predaj sa nepodarilo zaúčtovať. Skontrolujte menu spoločnosti, otvorené účtovné obdobie a účty.",
    cashCurrencyMismatch:
      "Hotovosť musí byť v mene pokladne. Pre túto objednávku vyberte iný spôsob platby.",
    tenderMinorUnits: "Zadajte sumu s presnosťou na celé centy.",
    legacyTenderReview:
      "Skoršia platba obsahuje zlomok centa. Pred prijatím ďalšej platby skontrolujte zaznamenanú sumu.",
    legacyTenderRecorded:
      "Objednávka zachováva pôvodné sumy so štyrmi desatinnými miestami.",
    legacyPostingReview:
      "Zaznamenané zlomky centa nemožno zaúčtovať. Pred uzavretím predaja skontrolujte pôvodnú platbu.",
    viewReceipt: "Zobraziť účtenku",
    openDrawer: "Otvoriť pokladňu",
    warehouse: "Predajný sklad",
    noWarehouse: "Bez priradeného skladu",
    chooseCompanyFirst: "Najprv vyberte spoločnosť.",
    warehouseInstruction: "Vyberte aktívny sklad zvolenej spoločnosti.",
    stockUnavailable:
      "V sklade tejto pokladne nie je dostatok dostupného tovaru. Pred dokončením predaja skontrolujte množstvá.",
  },
  dashboard: {
    get: {
      title: "Prehľad pokladníc",
      titleShort: "Prehľad pokladníc",
      description: "Skontrolujte pokladnice, otvorené zmeny a dnešné tržby.",
      widget: {
        title: "Predajné miesto",
        subtitle:
          "Otvorte pokladňu, predávajte, uzavrite zmenu s počítaním hotovosti.",
        salesHistory: "História predajov",
        newTill: "Nová pokladňa",
        kpiSalesToday: "Tržba dnes",
        kpiSalesCount: "Predaje: {{count}}",
        kpiOpenTills: "Otvorené pokladne",
        kpiTillsTotal: "Aktívne: {{active}} z {{total}}",
        kpiAverage: "Priemerný nákup",
        kpiRefunds: "Vrátenia dnes",
        kpiRefundsCount: "Vrátenia: {{count}}",
        tillsTitle: "Pokladne",
        manageTills: "Spravovať pokladne",
        emptyTitle: "Zatiaľ žiadna pokladňa",
        emptyMessage: "Pridajte pokladňu a predávajte pri pulte.",
        createTill: "Pridať pokladňu",
        tillSelling: "Predáva",
        tillReady: "Pripravená",
        tillInactive: "Neaktívna",
        openRegister: "Otvoriť pokladňu",
        openTill: "Otvoriť zmenu",
        closeTill: "Uzavrieť pokladňu",
        loading: "Načítava sa prehľad…",
        loadingHint: "Načítavajú sa údaje z pokladníc.",
        kpiTerminals: "Pokladnice (aktívne / spolu)",
        kpiOpenSessions: "Otvorené pokladničné zmeny",
        kpiTodayOrders: "Dnešné objednávky",
        kpiTodaySales: "Dnešné tržby",
        terminalsHeading: "Pokladnice",
        refresh: "Obnoviť",
        openSession: "Otvoriť zmenu",
        viewOrders: "Zobraziť objednávky",
        viewSession: "Zobraziť zmenu",
        allTerminals: "Všetky pokladnice",
        statusActive: "Aktívna",
        statusInactive: "Neaktívna",
        statusSessionOpen: "Otvorená zmena",
        emptyTerminals: "Zatiaľ nemáte nastavenú žiadnu pokladnicu.",
        emptyTerminalsHint: "O nastavenie pokladníc požiadajte správcu.",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte povinné polia",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na zobrazenie prehľadu pokladne sa prihláste",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K údajom pokladne nemáte prístup",
        },
        conflict: {
          title: "Konflikt údajov",
          description: "Údaje sa medzičasom zmenili.",
        },
        server: {
          title: "Chyba servera",
          description: "Prehľad sa nepodarilo načítať",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba.",
        },
        network: {
          title: "Chyba pripojenia",
          description: "Skontrolujte pripojenie a skúste to znova",
        },
        notFound: {
          title: "Záznam sa nenašiel",
          description: "Nenašli sa žiadne údaje pokladne",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny.",
        },
      },
      success: {
        title: "Prehľad načítaný",
        description: "Prehľad pokladne sa načítal",
      },
      response: {
        terminalsTotal: "Počet pokladníc",
        terminalsActive: "Aktívne pokladnice",
        openSessionsCount: "Otvorené zmeny",
        todayOrderCount: "Dnešné objednávky",
        todaySalesTotal: "Dnešné tržby",
        refundsToday: "Vrátenia dnes",
        currency: "Mena",
        terminalId: "ID pokladnice",
        terminalName: "Názov pokladnice",
        terminalLocation: "Umiestnenie",
        terminalCurrency: "Mena",
        terminalIsActive: "Aktívna",
        terminalHasOpenSession: "Otvorená zmena",
        terminalOpenSessionId: "ID otvorenej zmeny",
      },
    },
  },
  terminalCreate: {
    post: {
      title: "Nová pokladňa",
      titleShort: "Nová pokladňa",
      description:
        "Pridajte firme pokladňu: názov, menu, pokladničný účet a sklad.",
      widget: {
        title: "Nová pokladňa",
        subtitle:
          "Pokladňa predáva v jednej mene, účtuje hotovosť na jeden účet a vydáva tovar z jedného skladu.",
        subtitleCompany:
          "Nová pokladňa pre {{company}}. Predáva v jednej mene a účtuje hotovosť na jeden účet.",
        back: "Späť",
        backToList: "Všetky pokladne",
        openTill: "Otvoriť zmenu",
        cancel: "Zrušiť",
        submit: "Vytvoriť pokladňu",
        none: "Žiadny",
        sectionTill: "Pokladňa",
        sectionMoney: "Peniaze",
        sectionMoneyHint:
          "V akej mene pokladňa predáva a kam sa účtuje hotovosť.",
        sectionStock: "Sklad",
        sectionStockHint:
          "Dokončené predaje vydávajú tovar z tohto skladu. Ak predávate len služby, nechajte prázdne.",
        defaultCashAccount: "Predvolený pokladničný účet firmy",
        noWarehouse: "Bez skladovej evidencie",
        chooseCompanyFirst: "Najprv vyberte firmu.",
      },
      companyId: {
        label: "Firma",
        description: "Firma, ktorej pokladňa patrí",
      },
      name: {
        label: "Názov",
        description: "Zobrazí sa na karte pokladne a na bločkoch",
        placeholder: "Predný pult",
      },
      location: {
        label: "Umiestnenie",
        description: "Kde pokladňa stojí. Nepovinné.",
        placeholder: "Prízemie",
      },
      currency: {
        label: "Mena",
        description: "Každý predaj na tejto pokladni ide v tejto mene",
        placeholder: "Vyberte menu",
      },
      cashAccountNodeId: {
        label: "Pokladničný účet",
        description: "Hotovosť z tejto pokladne sa účtuje na tento účet.",
        invalid:
          "Vyberte účtovateľný pokladničný alebo bankový účet tejto firmy.",
      },
      warehouseId: {
        label: "Sklad",
        description: "Po dokončení predaja sa tovar vydá z tohto skladu.",
      },
      errors: {
        validation: {
          title: "Skontrolujte pokladňu",
          description: "Zadajte názov a vyberte menu.",
        },
        unauthorized: {
          title: "Prihláste sa",
          description: "Prihláste sa, aby ste mohli pridávať pokladne.",
        },
        forbidden: {
          title: "Len pre adminov",
          description: "Pokladne pridávajú len administrátori firmy.",
        },
        conflict: {
          title: "Názov je obsadený",
          description: "Pokladňa s týmto názvom už existuje.",
        },
        server: {
          title: "Pokladňa nevytvorená",
          description: "Niečo sa pokazilo. Skúste to znova.",
        },
        unknown: {
          title: "Pokladňa nevytvorená",
          description: "Niečo sa pokazilo. Skúste to znova.",
        },
        network: {
          title: "Bez pripojenia",
          description: "Skontrolujte pripojenie a skúste to znova.",
        },
        notFound: {
          title: "Nenájdené",
          description: "Firma alebo sklad neexistuje.",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Najprv dokončite alebo zahoďte zmeny.",
        },
      },
      success: {
        title: "Pokladňa vytvorená",
        description: "Spočítajte hotovosť v zásuvke a otvorte zmenu.",
      },
      response: {
        id: "Pokladňa",
        name: "Názov",
        companyId: "Firma",
        currency: "Mena",
        isActive: "Aktívna",
      },
    },
  },
  terminalList: {
    get: {
      title: "Pokladne",
      titleShort: "Pokladne",
      description: "Všetky pokladne vašich firiem a ktoré práve predávajú.",
      widget: {
        title: "Pokladne",
        pickTitle: "Vyberte pokladňu",
        subtitle: "Každá pokladňa pri vašom pulte a či práve predáva.",
        summary: "Pokladne: {{total}} · Práve predávajú: {{selling}}",
        newTill: "Nová pokladňa",
        createTill: "Pridať pokladňu",
        emptyTitle: "Zatiaľ žiadne pokladne",
        emptyMessage: "Pridajte pokladňu a začnite predávať pri pulte.",
        selling: "Predáva",
        ready: "Pripravená",
        inactive: "Neaktívna",
        openRegister: "Otvoriť pokladňu",
        openTill: "Otvoriť zmenu",
        loading: "Načítavajú sa pokladne",
        back: "Späť",
      },
      companyId: {
        label: "Firma",
        description: "Len pokladne tejto firmy",
      },
      terminalId: {
        label: "Pokladňa",
        description: "Len táto pokladňa",
      },
      errors: {
        validation: {
          title: "Skontrolujte filter",
          description: "Firma alebo pokladňa je neplatná.",
        },
        unauthorized: {
          title: "Prihláste sa",
          description: "Prihláste sa, aby ste videli pokladne.",
        },
        forbidden: {
          title: "Bez prístupu",
          description: "Nie ste členom tejto firmy.",
        },
        conflict: {
          title: "Konflikt",
          description: "Údaje sa zmenili. Obnovte stránku a skúste to znova.",
        },
        server: {
          title: "Pokladne sa nenačítali",
          description: "Niečo sa pokazilo. Skúste to znova.",
        },
        unknown: {
          title: "Pokladne sa nenačítali",
          description: "Niečo sa pokazilo. Skúste to znova.",
        },
        network: {
          title: "Bez pripojenia",
          description: "Skontrolujte pripojenie a skúste to znova.",
        },
        notFound: {
          title: "Nenájdené",
          description: "Táto firma neexistuje.",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Najprv dokončite alebo zahoďte zmeny.",
        },
      },
      success: {
        title: "Pokladne načítané",
        description: "Vaše pokladne sú aktuálne.",
      },
      response: {
        id: "Pokladňa",
        name: "Názov",
        location: "Umiestnenie",
        currency: "Mena",
        isActive: "Aktívna",
        companyName: "Firma",
        openSessionId: "Otvorená zmena",
        createdAt: "Vytvorená",
      },
    },
  },
  sessionOpen: {
    post: {
      title: "Otvoriť zmenu",
      titleShort: "Otvoriť zmenu",
      description:
        "Začnite zmenu na pokladni so spočítanou hotovosťou v zásuvke.",
      widget: {
        title: "Otvoriť zmenu",
        subtitle: "Spočítajte hotovosť v zásuvke a začnite zmenu.",
        back: "Späť",
        cancel: "Zrušiť",
        loadingTill: "Načítava sa pokladňa",
        selling: "Predáva",
        ready: "Pripravená",
        inactive: "Neaktívna",
        alreadyOpen: "Táto pokladňa je už otvorená. Pokračujte v predaji.",
        openRegister: "Otvoriť pokladňu",
        floatHint:
          "Počiatočný stav sú drobné na vydávanie. Pri uzávierke sa s ním porovná spočítaná hotovosť.",
      },
      terminalId: {
        label: "Pokladňa",
        description: "Pokladňa, ktorá sa otvára",
      },
      openingFloat: {
        label: "Počiatočný stav",
        description: "Hotovosť v zásuvke na začiatku zmeny",
        placeholder: "0,00",
      },
      errors: {
        validation: {
          title: "Skontrolujte počiatočný stav",
          description: "Zadajte hotovosť v zásuvke, nula alebo viac.",
        },
        unauthorized: {
          title: "Prihláste sa",
          description: "Prihláste sa, aby ste mohli otvoriť pokladňu.",
        },
        forbidden: {
          title: "Bez prístupu",
          description: "Nie ste členom firmy tejto pokladne.",
        },
        conflict: {
          title: "Pokladňa je už otvorená",
          description: "Táto pokladňa už má otvorenú zmenu.",
        },
        server: {
          title: "Pokladňa sa neotvorila",
          description: "Niečo sa pokazilo. Skúste to znova.",
        },
        unknown: {
          title: "Pokladňa sa neotvorila",
          description: "Niečo sa pokazilo. Skúste to znova.",
        },
        network: {
          title: "Bez pripojenia",
          description: "Skontrolujte pripojenie a skúste to znova.",
        },
        notFound: {
          title: "Pokladňa nenájdená",
          description: "Táto pokladňa neexistuje.",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Najprv dokončite alebo zahoďte zmeny.",
        },
      },
      success: {
        title: "Zmena otvorená",
        description: "Zmena beží. Nablokujte prvý predaj.",
      },
      response: {
        id: "Zmena",
        terminalId: "Pokladňa",
        openedAt: "Otvorená",
        status: "Stav",
        openingFloat: "Počiatočný stav",
      },
    },
  },
  sessionClose: {
    post: {
      mixedCash:
        "Pred uzavretím pokladnice odsúhlaste hotovostné platby v cudzej mene.",
      title: "Uzavrieť pokladničnú zmenu",
      titleShort: "Uzavrieť pokladničnú zmenu",
      description:
        "Uzavrieť pokladničnú zmenu a zaznamenať konečný stav hotovosti.",
      widget: {
        backToTerminals: "Späť",
        sessionSummary: "Súhrn pokladničnej zmeny",
        terminal: "Pokladničný terminál",
        openedAt: "Otvorené pri",
        orderCount: "Objednávky: {{count}}",
        sessionRevenue: "Tržby",
        floatHint: "Spočítajte všetky bankovky a mince v zásuvke.",
        reconciliation: "Koniec dňa",
        sessionReady: "Pokladničná zmena",
        active: "Aktívne",
        openingFloat: "Počiatočná hotovosť",
        cashSales: "Predaj v hotovosti",
        expectedClosingFloat: "Má byť v pokladni",
        actualClosingFloat: "Napočítaná hotovosť",
        variance: "Rozdiel",
        reconciliationTitle: "Počítanie hotovosti",
        title: "Uzavrieť pokladňu",
        subtitle: "{{terminal}} · otvorená od {{time}}",
        cashRefunds: "Vrátenia v hotovosti",
        balanced: "Pokladňa sedí",
        over: "Prebytok {{amount}}",
        short: "Chýba {{amount}}",
        openSaleBlocks:
          "Na tejto pokladni je ešte otvorený predaj. Dokončite ho alebo stornujte na obrazovke pokladne, potom pokladňu uzavrite.",
        backToPos: "Späť na POS",
      },
      sessionId: {
        label: "ID pokladničnej zmeny",
        description: "Pokladničná zmena na uzavretie",
      },
      closingFloat: {
        label: "Napočítaná hotovosť",
        description: "Hotovosť napočítaná pri uzavretí pokladnice",
        placeholder: "0.00",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte povinné polia",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na uzavretie pokladničnej zmeny sa prihláste",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Môžete uzavrieť iba vlastnú pokladničnú zmenu",
        },
        conflict: {
          title: "Pokladničná zmena je už uzavretá",
          description: "Táto pokladničná zmena je už uzavretá.",
        },
        server: {
          title: "Chyba servera",
          description: "Pokladničnú zmenu sa nepodarilo uzavrieť",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Nastala neočakávaná chyba",
        },
        network: {
          title: "Chyba siete",
          description: "Skontrolujte pripojenie a skúste to znova",
        },
        notFound: {
          title: "Pokladničná zmena sa nenašla",
          description: "Pokladničná zmena neexistuje",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Pokladničná zmena uzavretá",
        description: "Pokladničná zmena sa uzavrela",
      },
      response: {
        id: "ID pokladničnej zmeny",
        status: "Stav",
        closedAt: "Uzavreté",
        closingFloat: "Hotovosť pri uzavretí pokladnice",
        expectedFloat: "Očakávaný stav hotovosti",
        cashSalesTotal: "Predaj v hotovosti",
        cashRefundsTotal: "Hotovostné vrátenia",
        openingFloat: "Počiatočná hotovosť v pokladnici",
        variance: "Rozdiel",
        orderCount: "Počet objednávok",
      },
    },
  },
  sessionGet: {
    get: {
      title: "Prehľad zmeny",
      titleShort: "Zmena",
      description:
        "Jedna zmena na pokladni: kedy začala, kto predával a koľko má byť v zásuvke.",
      widget: {
        title: "Zmena",
        back: "Späť",
        loading: "Načítava sa zmena",
        selling: "Predáva",
        closed: "Uzavretá",
        subtitleOpen: "Otvorená od {{time}}",
        subtitleClosed: "Uzavretá {{time}}",
        sales: "Predaje",
        closeTill: "Uzavrieť pokladňu",
        openRegister: "Otvoriť pokladňu",
        drawerTitle: "Pokladničná zásuvka",
        variance: "Rozdiel",
        closeSession: "Uzavrieť pokladňu",
        newOrder: "Nová objednávka",
      },
      sessionId: {
        label: "Zmena",
        description: "Zmena na zobrazenie",
      },
      errors: {
        validation: {
          title: "Skontrolujte zmenu",
          description: "Tento odkaz na zmenu je neplatný.",
        },
        unauthorized: {
          title: "Prihláste sa",
          description: "Prihláste sa, aby ste videli zmeny.",
        },
        forbidden: {
          title: "Bez prístupu",
          description: "Nie ste členom firmy tejto pokladne.",
        },
        conflict: {
          title: "Konflikt",
          description: "Údaje sa zmenili. Obnovte stránku a skúste to znova.",
        },
        server: {
          title: "Zmena sa nenačítala",
          description: "Niečo sa pokazilo. Skúste to znova.",
        },
        unknown: {
          title: "Zmena sa nenačítala",
          description: "Niečo sa pokazilo. Skúste to znova.",
        },
        network: {
          title: "Bez pripojenia",
          description: "Skontrolujte pripojenie a skúste to znova.",
        },
        notFound: {
          title: "Zmena nenájdená",
          description: "Táto zmena neexistuje.",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Najprv dokončite alebo zahoďte zmeny.",
        },
      },
      success: {
        title: "Zmena načítaná",
        description: "Čísla zásuvky sú aktuálne.",
      },
      response: {
        id: "Zmena",
        terminalId: "Pokladňa",
        terminalName: "Pokladňa",
        companyName: "Firma",
        cashierUserId: "Pokladník",
        cashierName: "Pokladník",
        status: "Stav",
        openedAt: "Otvorená",
        closedAt: "Uzavretá",
        openingFloat: "Počiatočný stav",
        closingFloat: "Spočítané pri uzávierke",
        cashSalesTotal: "Predaje v hotovosti",
        cashRefundsTotal: "Vrátenia v hotovosti",
        expectedCash: "Očakávané v zásuvke",
      },
    },
  },
  orderCreate: {
    post: {
      title: "Vytvoriť objednávku",
      titleShort: "Vytvoriť objednávku",
      description:
        "Vytvoriť novú objednávku počas otvorenej pokladničnej zmeny.",
      widget: {
        addItem: "Pridať položku",
        viewOrder: "Zobraziť objednávku",
        creating: "Otvára sa objednávka…",
        back: "Späť",
      },
      sessionId: {
        label: "ID pokladničnej zmeny",
        description: "Pokladničná zmena na vytvorenie objednávky",
      },
      customerId: {
        label: "ID zákazníka",
        description: "Nepovinná referencia zákazníka",
      },
      currency: {
        label: "Mena",
        description: "Mena objednávky",
        placeholder: "EUR",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte povinné polia",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na vytváranie objednávok sa prihláste",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tejto pokladničnej zmene nemáte prístup",
        },
        conflict: {
          title: "Pokladničná zmena uzavretá",
          description:
            "V uzavretej pokladničnej zmene nemožno vytvárať objednávky",
        },
        server: {
          title: "Chyba servera",
          description: "Objednávku sa nepodarilo vytvoriť",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Nastala neočakávaná chyba",
        },
        network: {
          title: "Chyba siete",
          description: "Skontrolujte pripojenie a skúste to znova",
        },
        notFound: {
          title: "Pokladničná zmena sa nenašla",
          description: "Pokladničná zmena neexistuje",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Objednávka vytvorená",
        description: "Objednávka vytvorená úspešne",
      },
      response: {
        id: "ID objednávky",
        orderNumber: "Číslo objednávky",
        sessionId: "ID pokladničnej zmeny",
        status: "Stav",
        currency: "Mena",
        total: "Spolu",
      },
    },
  },
  orderAddItem: {
    post: {
      title: "Pridať položku",
      titleShort: "Pridať položku",
      description: "Pridať položku do otvorenej objednávky.",
      widget: {
        backToOrder: "Späť na objednávku",
        linePreview: "Celková suma položky",
        taxNote: "vrátane dane",
        multiplier: "×",
        addAnother: "Pridať ďalšiu položku",
        searchProduct: "Vyhľadať v katalógu produktov",
        searchPlaceholder: "Názov alebo SKU…",
        orManual: "Alebo zadať ručne",
        selectedProduct: "Vybraný produkt",
        clearProduct: "Zrušiť výber",
        searchButton: "Vyhľadať",
        noProductResults: "Nič sa nenašlo. Zadajte údaje položky nižšie.",
      },
      orderId: {
        label: "ID objednávky",
        description: "Objednávka, do ktorej sa pridá položka",
      },
      productId: {
        label: "ID produktu",
        description: "Nepovinná referencia produktu",
      },
      itemDescription: {
        label: "Opis",
        description: "Opis položky",
        placeholder: "Káva",
      },
      quantity: {
        label: "Množstvo",
        description: "Množstvo",
        placeholder: "1",
      },
      unitPrice: {
        label: "Jednotková cena",
        description: "Cena za jednotku",
        placeholder: "3.50",
      },
      mergeWithLine: {
        label: "Pridať k existujúcej položke",
        description: "Zvýši množstvo existujúcej položky tohto produktu",
      },
      taxRate: {
        label: "Sadzba dane",
        description: "Sadzba dane ako desatinné číslo (napr. 0.2 pre 20 %)",
        placeholder: "0.20",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte povinné polia",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na pridávanie položiek sa prihláste",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tejto objednávke nemáte prístup",
        },
        conflict: {
          title: "Objednávka nie je otvorená",
          description: "Položky možno pridávať iba do otvorenej objednávky",
        },
        server: {
          title: "Chyba servera",
          description: "Pridanie položky zlyhalo",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Nastala neočakávaná chyba",
        },
        network: {
          title: "Chyba siete",
          description: "Skontrolujte pripojenie a skúste to znova",
        },
        notFound: {
          title: "Objednávka sa nenašla",
          description: "Objednávka neexistuje",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Položka pridaná",
        description: "Položka pridaná do objednávky",
      },
      response: {
        id: "ID položky",
        description: "Opis",
        quantity: "Množstvo",
        unitPrice: "Jednotková cena",
        taxAmount: "Suma dane",
        lineTotal: "Celková suma položky",
        orderTotal: "Celková suma objednávky",
      },
    },
  },
  orderRemoveItem: {
    post: {
      title: "Odstrániť položku",
      titleShort: "Odstrániť položku",
      description: "Odstrániť položku z otvorenej objednávky.",
      widget: {
        chooseLine: "Vyberte položku",
        backToOrder: "Späť na objednávku",
      },
      orderId: {
        label: "Objednávka",
        description: "Objednávka, z ktorej sa odstráni položka",
      },
      quantity: {
        label: "Množstvo na odobratie",
        description: "Nechajte prázdne, ak chcete odobrať celú položku",
      },
      itemId: {
        label: "Položka",
        description: "Položka na odstránenie",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte povinné polia",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na odstraňovanie položiek sa prihláste",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tejto objednávke nemáte prístup",
        },
        conflict: {
          title: "Objednávka nie je otvorená",
          description: "Položky možno odstraňovať iba z otvorenej objednávky",
        },
        server: {
          title: "Chyba servera",
          description: "Nepodarilo sa odstrániť položku",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Nastala neočakávaná chyba",
        },
        network: {
          title: "Chyba siete",
          description: "Skontrolujte pripojenie a skúste to znova",
        },
        notFound: {
          title: "Nenašlo sa",
          description: "Objednávka alebo položka sa nenašla",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Odstránená položka",
        description: "Položka odstránená z objednávky",
      },
      response: {
        orderId: "ID objednávky",
        orderTotal: "Aktualizovaná celková suma",
      },
    },
  },
  orderComplete: {
    post: {
      title: "Dokončiť objednávku",
      titleShort: "Dokončiť objednávku",
      description: "Dokončí objednávku, overí úplnú úhradu a zaúčtuje predaj.",
      widget: {
        backToList: "Späť na zoznam objednávok",
        confirmTitle: "Dokončiť túto objednávku?",
        confirmHint:
          "Túto akciu nemožno vrátiť späť. Pred dokončením prijmite všetky platby.",
        orderNumber: "Objednávka",
        cancel: "Zrušiť",
      },
      orderId: {
        label: "ID objednávky",
        description: "Objednávka na dokončenie",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Neplatné ID objednávky",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Prihláste sa na dokončenie objednávok",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tejto objednávke nemáte prístup",
        },
        conflict: {
          title: "Neuhradený zostatok",
          description: "Súčet platieb nepokrýva celkovú sumu objednávky",
        },
        server: {
          title: "Chyba servera",
          description: "Nepodarilo sa dokončiť objednávku",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Nastala neočakávaná chyba",
        },
        network: {
          title: "Chyba siete",
          description: "Skontrolujte pripojenie a skúste to znova",
        },
        notFound: {
          title: "Objednávka sa nenašla",
          description: "Objednávka neexistuje",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Objednávka dokončená",
        description: "Objednávka bola dokončená a predaj zaúčtovaný",
      },
      response: {
        id: "ID objednávky",
        status: "Stav",
        total: "Spolu",
        journalEntryId: "ID účtovného zápisu",
      },
    },
  },
  orderVoid: {
    post: {
      title: "Stornovať objednávku",
      titleShort: "Stornovať objednávku",
      description:
        "Stornovať otvorenú objednávku. Túto akciu nemožno vrátiť späť.",
      widget: {
        tendered:
          "Platba už bola zaevidovaná. Objednávku ani jej položky už nemožno meniť.",
        closed: "Táto objednávka je uzavretá.",
        backToList: "Späť na objednávky",
      },
      orderId: {
        label: "Objednávka",
        description: "Objednávka na stornovanie",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Neplatné ID objednávky",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na stornovanie objednávok sa prihláste",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tejto objednávke nemáte prístup",
        },
        conflict: {
          title: "Objednávka nie je otvorená",
          description: "Stornovať možno iba otvorené objednávky",
        },
        server: {
          title: "Chyba servera",
          description: "Objednávku sa nepodarilo stornovať",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Nastala neočakávaná chyba",
        },
        network: {
          title: "Chyba siete",
          description: "Skontrolujte pripojenie a skúste to znova",
        },
        notFound: {
          title: "Objednávka sa nenašla",
          description: "Objednávka neexistuje",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Objednávka stornovaná",
        description: "Objednávka bola stornovaná",
      },
      response: {
        id: "ID objednávky",
        status: "Stav",
      },
    },
  },
  orderGet: {
    get: {
      title: "Načítať objednávku",
      titleShort: "Podrobnosti objednávky",
      description: "Načítať objednávku s položkami a platbami.",
      widget: {
        refund: "Vrátiť",
        addItem: "Pridať položku",
        addPayment: "Pridať platbu",
        complete: "Dokončiť objednávku",
        void: "Stornovať objednávku",
        back: "Späť",
        outstanding: "Neuhradené",
        fullyPaid: "Úplne uhradené",
        qtyTimesPrice: "×",
        loading: "Načítava sa objednávka…",
        noItems: "Zatiaľ žiadne položky. Pridajte prvú položku.",
        viewJournalEntry: "Zobraziť účtovný zápis",
        voidedStamp: "STORNOVANÝ",
        completedReadOnly: "Objednávka je dokončená a už ju nemožno upravovať.",
        select: "Vyberte objednávku",
      },
      orderId: {
        label: "ID objednávky",
        description: "Objednávka na načítanie",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Neplatné ID objednávky",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Prihláste sa na zobrazenie objednávok",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tejto objednávke nemáte prístup",
        },
        conflict: {
          title: "Konflikt",
          description: "Konflikt údajov",
        },
        server: {
          title: "Chyba servera",
          description: "Objednávku sa nepodarilo načítať",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Nastala neočakávaná chyba",
        },
        network: {
          title: "Chyba siete",
          description: "Skontrolujte pripojenie a skúste to znova",
        },
        notFound: {
          title: "Objednávka sa nenašla",
          description: "Objednávka neexistuje",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Objednávka načítaná",
        description: "Podrobnosti objednávky sa načítali",
      },
      response: {
        id: "ID objednávky",
        orderNumber: "Číslo objednávky",
        sessionId: "ID pokladničnej zmeny",
        customerId: "ID zákazníka",
        status: "Stav",
        currency: "Mena",
        subtotal: "Medzisúčet",
        taxAmount: "Dane",
        total: "Spolu",
        journalEntryId: "ID účtovného zápisu",
        createdAt: "Čas vytvorenia",
        items: "Položky",
        itemId: "ID položky",
        productId: "ID produktu",
        description: "Opis",
        quantity: "Množstvo",
        unitPrice: "Jednotková cena",
        taxRate: "Sadzba dane",
        taxAmountItem: "Dane",
        lineTotal: "Celková suma položky",
        payments: "Platby",
        paymentId: "ID platby",
        method: "Metóda",
        amount: "Suma",
        change: "Vydaná hotovosť",
        reference: "Referencia",
      },
    },
  },
  orderList: {
    get: {
      title: "Objednávky",
      titleShort: "Objednávky",
      description:
        "Zobraziť objednávky pokladničnej zmeny alebo terminálu. Filtrovať možno podľa stavu.",
      widget: {
        title: "Predaje",
        subtitleAll: "Všetky predaje z pokladne, od najnovších.",
        subtitleSession: "Predaje tejto zmeny, od najnovších.",
        openRegister: "Otvoriť pokladňu",
        colSale: "Predaj",
        colTime: "Čas",
        colStatus: "Stav",
        colTotal: "Spolu",
        count: "Predaje: {{count}}",
        newOrder: "Nová objednávka",
        empty: "Zatiaľ žiadne predaje",
        emptyHint: "Predaje z pokladne sa tu zobrazia aj s dokladom.",
        back: "Späť",
        backToTerminals: "Späť na terminály",
        selectSession: "Vyberte pokladničnú zmenu",
        selectSessionHint:
          "Zadajte ID pokladničnej zmeny, ktorej objednávky chcete zobraziť.",
        sessionTotal: "Suma za pokladničnú zmenu",
        filterAll: "Všetky",
        loading: "Načítavajú sa objednávky…",
        ordersTotal: "objednávky",
        tapToView: "ťuknite na položku",
      },
      companyId: {
        label: "Firma",
        description: "Firma, ktorej predaje z pokladne sa zobrazia",
      },
      sessionId: {
        label: "ID pokladničnej zmeny",
        description: "Pokladničná zmena, ktorej objednávky sa majú zobraziť",
      },
      status: {
        label: "Stav",
        description: "Filtrovať podľa stavu objednávky",
        placeholder: "Všetky stavy",
      },
      page: {
        label: "Strana",
        description: "Číslo strany (začína na 1)",
      },
      pageSize: {
        label: "Na stranu",
        description: "Výsledky na stranu (max. 100)",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte povinné polia",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na zobrazenie zoznamu objednávok sa prihláste",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tejto pokladničnej zmene nemáte prístup",
        },
        conflict: {
          title: "Konflikt",
          description: "Konflikt údajov",
        },
        server: {
          title: "Chyba servera",
          description: "Objednávky sa nepodarilo načítať",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Nastala neočakávaná chyba",
        },
        network: {
          title: "Chyba siete",
          description: "Skontrolujte pripojenie a skúste to znova",
        },
        notFound: {
          title: "Pokladničná zmena sa nenašla",
          description: "Pokladničná zmena neexistuje",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Objednávky načítané",
        description: "Zoznam objednávok sa načítal",
      },
      response: {
        terminalName: "Pokladňa",
        count: "Spolu",
        id: "ID objednávky",
        orderNumber: "Číslo objednávky",
        sessionId: "ID pokladničnej zmeny",
        status: "Stav",
        currency: "Mena",
        total: "Spolu",
        createdAt: "Čas vytvorenia",
      },
    },
  },
  productLookup: {
    get: {
      title: "Vyhľadávanie produktov",
      titleShort: "Produkty",
      description:
        "Nájdite produkty z katalógu podľa názvu alebo kódu, s cenou a DPH.",
      widget: {
        title: "Produkty",
        pickTitle: "Vyberte produkt",
        subtitle:
          "Hľadajte podľa názvu alebo kódu. Naskenovaný čiarový kód nájde presný produkt.",
        back: "Späť",
        loading: "Načítavajú sa produkty",
        emptyTitle: "Zatiaľ žiadne produkty",
        emptyMessage: "Produkty z vášho katalógu sa tu zobrazia aj s cenou.",
        noMatchTitle: "Pre „{{query}}“ sa nič nenašlo",
        noMatchMessage: "Skontrolujte preklepy alebo hľadajte podľa kódu.",
        vat: "DPH {{rate}}",
        noVat: "Bez DPH",
        perUnit: "za {{unit}}",
      },
      companyId: {
        label: "Firma",
        description: "Len produkty tejto firmy",
      },
      query: {
        label: "Hľadať produkty",
        description:
          "Názov produktu alebo kód. Nechajte prázdne a prehliadajte.",
        placeholder: "Názov alebo kód",
      },
      currency: {
        label: "Mena",
        description: "Len produkty s cenou v tejto mene",
      },
      page: {
        label: "Strana",
        description: "Číslo strany od 1",
      },
      pageSize: {
        label: "Na stranu",
        description: "Výsledkov na stranu, najviac 50",
      },
      errors: {
        validation: {
          title: "Skontrolujte hľadanie",
          description: "Najviac 120 znakov.",
        },
        unauthorized: {
          title: "Prihláste sa",
          description: "Prihláste sa, aby ste mohli hľadať produkty.",
        },
        forbidden: {
          title: "Bez prístupu",
          description: "Nie ste členom tejto firmy.",
        },
        conflict: {
          title: "Konflikt",
          description: "Údaje sa zmenili. Obnovte stránku a skúste to znova.",
        },
        server: {
          title: "Hľadanie zlyhalo",
          description: "Niečo sa pokazilo. Skúste to znova.",
        },
        unknown: {
          title: "Hľadanie zlyhalo",
          description: "Niečo sa pokazilo. Skúste to znova.",
        },
        network: {
          title: "Bez pripojenia",
          description: "Skontrolujte pripojenie a skúste to znova.",
        },
        notFound: {
          title: "Nenájdené",
          description: "Nenašli sa žiadne produkty.",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Najprv dokončite alebo zahoďte zmeny.",
        },
      },
      success: {
        title: "Produkty nájdené",
        description: "Výsledky sú aktuálne.",
      },
      response: {
        id: "Produkt",
        name: "Názov",
        sku: "Kód",
        type: "Typ",
        basePrice: "Cena",
        currency: "Mena",
        defaultTaxRate: "Sadzba DPH",
        unit: "Jednotka",
      },
    },
  },
  orderAddPayment: {
    post: {
      title: "Pridať platbu",
      titleShort: "Pridať platbu",
      description: "Zaevidovať platbu k otvorenej objednávke.",
      widget: {
        fullyPaid: "Uhradené v plnej výške",
        backToOrder: "Späť na objednávku",
        amountDue: "Na úhradu",
        changeLabel: "Vydaná hotovosť",
        changeHint: "Vydať zákazníkovi",
        addAnotherPayment: "Pridať ďalšiu platbu",
      },
      orderId: {
        label: "ID objednávky",
        description: "Objednávka na úhradu",
      },
      method: {
        label: "Spôsob platby",
        description: "Ako zákazník platí",
        placeholder: "Vyberte spôsob platby",
      },
      amount: {
        label: "Suma",
        description: "Prijatá suma",
        placeholder: "0.00",
      },
      change: {
        label: "Vydaná hotovosť",
        description: "Suma vydaná zákazníkovi",
        placeholder: "0.00",
      },
      reference: {
        label: "Referencia",
        description: "Autorizačný kód platby kartou alebo referencia prevodu",
      },
      accountNodeId: {
        label: "Účet na zaúčtovanie platby",
        description:
          "Prijímací účet (má prednosť pred predvoleným účtom terminálu)",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte povinné polia",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na pridávanie platieb sa prihláste",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tejto objednávke nemáte prístup",
        },
        conflict: {
          title: "Objednávka nie je otvorená",
          description: "Platby možno pridať iba k otvorenej objednávke",
        },
        server: {
          title: "Chyba servera",
          description: "Nepodarilo sa zaznamenať platbu",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Nastala neočakávaná chyba",
        },
        network: {
          title: "Chyba siete",
          description: "Skontrolujte pripojenie a skúste to znova",
        },
        notFound: {
          title: "Objednávka sa nenašla",
          description: "Objednávka neexistuje",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Platba zaevidovaná",
        description: "Platba k objednávke bola zaevidovaná",
      },
      response: {
        id: "ID platby",
        method: "Metóda",
        amount: "Suma",
        change: "Vydaná hotovosť",
        totalPaid: "Zaplatené spolu",
        outstanding: "Neuhradené",
      },
    },
  },
};
