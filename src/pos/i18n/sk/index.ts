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
      open: "Otvoriť",
      closed: "Uzatvorené",
    },
    orderStatus: {
      open: "Otvoriť",
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

  // POS Dashboard
  dashboard: {
    get: {
      title: "Prehľad pokladníc",
      titleShort: "Prehľad pokladníc",
      description: "Skontrolujte pokladnice, otvorené zmeny a dnešné tržby.",
      widget: {
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
        emptyTerminalsHint:
          "O nastavenie pokladníc požiadajte správcu.",
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
        conflict: { title: "Konflikt údajov", description: "Údaje sa medzičasom zmenili." },
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
        notFound: { title: "Záznam sa nenašiel", description: "Nenašli sa žiadne údaje pokladne" },
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

  // Terminal create
  terminalCreate: {
    post: {
      title: "Vytvoriť pokladničný terminál",
      titleShort: "Vytvoriť pokladničný terminál",
      description: "Vytvoriť nový pokladničný terminál pre firmu.",
      widget: {
        backToList: "Späť na terminály",
        active: "Aktívne",
        inactive: "Neaktívne",
        openSession: "Otvoriť pokladničnú zmenu",
      },
      companyId: {
        label: "ID firmy",
        description: "Firma, ktorej terminál patrí",
      },
      name: {
        label: "Názov terminálu",
        description: "Názov tohto terminálu",
        placeholder: "Hlavná pokladnica",
      },
      location: {
        label: "Umiestnenie",
        description: "Fyzická poloha terminálu",
        placeholder: "Recepcia",
      },
      currency: {
        label: "Mena",
        description: "Štandardná mena (ISO 4217)",
        placeholder: "EUR",
      },
      cashAccountNodeId: {
        label: "Účet pokladničnej hotovosti",
        description: "Účet pokladničnej hotovosti",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte povinné polia",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na vytváranie terminálov sa prihláste",
        },
        forbidden: {
          title: "Vyžaduje sa oprávnenie správcu",
          description: "Terminály môžu vytvárať iba správcovia",
        },
        conflict: {
          title: "Konflikt",
          description: "Terminál s týmto názvom už existuje",
        },
        server: {
          title: "Chyba servera",
          description: "Terminál sa nepodarilo vytvoriť. Skúste to znova.",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Nastala neočakávaná chyba",
        },
        network: {
          title: "Chyba siete",
          description: "Skontrolujte pripojenie a skúste to znova",
        },
        notFound: { title: "Nenašlo sa", description: "Požadovaný zdroj sa nenašiel" },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Terminál vytvorený",
        description: "Terminál bol vytvorený",
      },
      response: {
        id: "ID terminálu",
        name: "Názov terminálu",
        companyId: "ID firmy",
        currency: "Mena",
        isActive: "Aktívne",
      },
    },
  },

  // Terminal list
  terminalList: {
    get: {
      title: "Pokladničné terminály",
      titleShort: "Pokladničné terminály",
      description: "Zobraziť všetky terminály firmy.",
      widget: {
        active: "Aktívne",
        inactive: "Neaktívne",
        total: "terminály",
        createTerminal: "Nový terminál",
        empty: "Nie sú nastavené žiadne terminály.",
        emptyHint:
          "Terminály sú pokladnice vo vašej predajni. S nastavením vám pomôže správca.",
        emptyContact: "Kontaktujte správcu",
        openSession: "Otvoriť pokladničnú zmenu",
        selectCompany: "Načítavajú sa terminály…",
        selectCompanyHint: "Načítavajú sa terminály.",
        loading: "Načítavajú sa terminály…",
        loadingHint: "Načítavajú sa terminály.",
        refresh: "Obnoviť",
        back: "Späť",
      },
      companyId: {
        label: "ID firmy",
        description: "Firma, ktorej terminály chcete zobraziť",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte povinné polia",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na zobrazenie terminálov sa prihláste",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Žiadny prístup k tejto spoločnosti",
        },
        conflict: { title: "Konflikt", description: "Konflikt údajov" },
        server: {
          title: "Chyba servera",
          description: "Terminály sa nepodarilo načítať",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Nastala neočakávaná chyba",
        },
        network: {
          title: "Chyba siete",
          description: "Skontrolujte pripojenie a skúste to znova",
        },
        notFound: { title: "Nenašlo sa", description: "Firma sa nenašla" },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Terminály načítané",
        description: "Zoznam terminálov sa načítal",
      },
      response: {
        id: "ID terminálu",
        name: "Názov terminálu",
        location: "Umiestnenie",
        currency: "Mena",
        isActive: "Aktívne",
        createdAt: "Čas vytvorenia",
      },
    },
  },

  // Session open
  sessionOpen: {
    post: {
      title: "Otvoriť pokladničnú zmenu",
      titleShort: "Otvoriť pokladničnú zmenu",
      description: "Otvoriť pokladničnú zmenu na termináli.",
      widget: {
        viewOrders: "Zobraziť objednávky",
        backToTerminals: "Späť na terminály",
        selectTerminal: "Terminál pripravený",
        selectTerminalHint: "Zadajte počiatočný stav hotovosti a otvorte pokladničnú zmenu.",
        terminal: "Pokladničný terminál",
        readyToOpen: "Pripravené",
        floatHint: "Počítajte hotovosť v zásuvke pred otvorením.",
        startOrders: "Začnite prijímať objednávky",
      },
      terminalId: {
        label: "ID terminálu",
        description: "Terminál, na ktorom chcete otvoriť zmenu",
      },
      openingFloat: {
        label: "Počiatočná hotovosť v pokladnici",
        description: "Hotovosť v pokladnici na začiatku zmeny",
        placeholder: "0.00",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte povinné polia",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na otvorenie pokladničnej zmeny sa prihláste",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Žiadny prístup k tomuto terminálu",
        },
        conflict: {
          title: "Pokladničná zmena je už otvorená",
          description: "Na tomto termináli už je otvorená pokladničná zmena",
        },
        server: {
          title: "Chyba servera",
          description: "Pokladničnú zmenu sa nepodarilo otvoriť",
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
          title: "Terminál sa nenašiel",
          description: "Terminál neexistuje",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Pokladničná zmena otvorená",
        description: "Pokladničná zmena sa otvorila",
      },
      response: {
        id: "ID pokladničnej zmeny",
        terminalId: "ID terminálu",
        openedAt: "Otvorené",
        status: "Stav",
        openingFloat: "Počiatočná hotovosť v pokladnici",
      },
    },
  },

  // Session close
  sessionClose: {
    post: {
      title: "Uzavrieť pokladničnú zmenu",
      titleShort: "Uzavrieť pokladničnú zmenu",
      description: "Uzavrieť pokladničnú zmenu a zaznamenať konečný stav hotovosti.",
      widget: {
        backToTerminals: "Späť na terminály",
        sessionSummary: "Súhrn pokladničnej zmeny",
        terminal: "Pokladničný terminál",
        openedAt: "Otvorené pri",
        orderCount: "Objednávky",
        sessionRevenue: "Tržby",
        floatHint: "Pred uzavretím spočítajte hotovosť v pokladnici.",
        reconciliation: "Koniec dňa",
        sessionReady: "Pokladničná zmena",
        active: "Aktívne",
        openingFloat: "Počiatočná hotovosť v pokladnici",
        cashSales: "Predaj v hotovosti",
        expectedClosingFloat: "Očakávaný stav hotovosti pri uzavretí",
        actualClosingFloat: "Skutočný stav hotovosti pri uzavretí",
        variance: "Rozdiel",
        reconciliationTitle: "Vyrovnanie hotovosti",
      },
      sessionId: { label: "ID pokladničnej zmeny", description: "Pokladničná zmena na uzavretie" },
      closingFloat: {
        label: "Hotovosť pri uzavretí pokladnice",
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
        variance: "Rozdiel",
        orderCount: "Počet objednávok",
      },
    },
  },

  // Session get
  sessionGet: {
    get: {
      title: "Načítať pokladničnú zmenu",
      titleShort: "Podrobnosti pokladničnej zmeny",
      description: "Načítať podrobnosti konkrétnej pokladničnej zmeny.",
      widget: {
        viewOrders: "Zobraziť objednávky",
        closeSession: "Uzavrieť pokladničnú zmenu",
        newOrder: "Nová objednávka",
        sessionDetails: "Podrobnosti pokladničnej zmeny",
        loading: "Načítava sa pokladničná zmena…",
        back: "Späť",
      },
      sessionId: { label: "ID pokladničnej zmeny", description: "Pokladničná zmena na načítanie" },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Neplatné ID pokladničnej zmeny",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na zobrazenie pokladničných zmien sa prihláste",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tejto pokladničnej zmene nemáte prístup",
        },
        conflict: { title: "Konflikt", description: "Konflikt údajov" },
        server: {
          title: "Chyba servera",
          description: "Pokladničnú zmenu sa nepodarilo načítať",
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
        title: "Pokladničná zmena načítaná",
        description: "Podrobnosti pokladničnej zmeny sa načítali",
      },
      response: {
        id: "ID pokladničnej zmeny",
        terminalId: "ID terminálu",
        cashierUserId: "Pokladník",
        status: "Stav",
        openedAt: "Otvorené",
        closedAt: "Uzavreté",
        openingFloat: "Počiatočná hotovosť v pokladnici",
        closingFloat: "Hotovosť pri uzavretí pokladnice",
      },
    },
  },

  // Order create
  orderCreate: {
    post: {
      title: "Vytvoriť objednávku",
      titleShort: "Vytvoriť objednávku",
      description: "Vytvoriť novú objednávku počas otvorenej pokladničnej zmeny.",
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
          description: "V uzavretej pokladničnej zmene nemožno vytvárať objednávky",
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

  // Order add item
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
        noProductResults: "Nenašli sa žiadne výsledky. Zadajte položku ručne nižšie.",
      },
      orderId: { label: "ID objednávky", description: "Objednávka, do ktorej sa pridá položka" },
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
        server: { title: "Chyba servera", description: "Pridanie položky zlyhalo" },
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
      success: { title: "Položka pridaná", description: "Položka pridaná do objednávky" },
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

  // Order remove item
  orderRemoveItem: {
    post: {
      title: "Odstrániť položku",
      titleShort: "Odstrániť položku",
      description: "Odstrániť položku z otvorenej objednávky.",
      widget: {
        backToOrder: "Späť na objednávku",
      },
      orderId: { label: "ID objednávky", description: "Objednávka, z ktorej sa odstráni položka" },
      itemId: { label: "ID položky", description: "Položka na odstránenie" },
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
        server: { title: "Chyba servera", description: "Nepodarilo sa odstrániť položku" },
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

  // Order complete
  orderComplete: {
    post: {
      title: "Dokončiť objednávku",
      titleShort: "Dokončiť objednávku",
      description:
        "Dokončí objednávku, overí úplnú úhradu a zaúčtuje predaj.",
      widget: {
        backToList: "Späť na zoznam objednávok",
        confirmTitle: "Dokončiť túto objednávku?",
        confirmHint: "Túto akciu nemožno vrátiť späť. Pred dokončením prijmite všetky platby.",
        orderNumber: "Objednávka",
        cancel: "Zrušiť",
      },
      orderId: { label: "ID objednávky", description: "Objednávka na dokončenie" },
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

  // Order void
  orderVoid: {
    post: {
      title: "Stornovať objednávku",
      titleShort: "Stornovať objednávku",
      description: "Stornovať otvorenú objednávku. Túto akciu nemožno vrátiť späť.",
      widget: {
        backToList: "Späť na objednávky",
      },
      orderId: { label: "ID objednávky", description: "Objednávka na stornovanie" },
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
        server: { title: "Chyba servera", description: "Objednávku sa nepodarilo stornovať" },
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
      success: { title: "Objednávka stornovaná", description: "Objednávka bola stornovaná" },
      response: {
        id: "ID objednávky",
        status: "Stav",
      },
    },
  },

  // Order get
  orderGet: {
    get: {
      title: "Načítať objednávku",
      titleShort: "Podrobnosti objednávky",
      description: "Načítať objednávku s položkami a platbami.",
      widget: {
        addItem: "Pridať položku",
        addPayment: "Pridať platbu",
        complete: "Dokončiť objednávku",
        void: "Stornovať objednávku",
        back: "Späť",
        outstanding: "Neuhradené",
        fullyPaid: "Úplne uhradené",
        qtyTimesPrice: "×",
        loading: "Načítava sa objednávka…",
        noItems: "Zatiaľ žiadne položky. Pridajte prvú.",
        viewJournalEntry: "Zobraziť účtovný zápis",
        voidedStamp: "VOIDED",
        completedReadOnly: "Objednávka je dokončená a už ju nemožno upravovať.",
        select: "Vyberte objednávku",
      },
      orderId: { label: "ID objednávky", description: "Objednávka na načítanie" },
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
        conflict: { title: "Konflikt", description: "Konflikt údajov" },
        server: { title: "Chyba servera", description: "Objednávku sa nepodarilo načítať" },
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

  // Order list
  orderList: {
    get: {
      title: "Objednávky",
      titleShort: "Objednávky",
      description:
        "Zobraziť objednávky pokladničnej zmeny alebo terminálu. Filtrovať možno podľa stavu.",
      widget: {
        newOrder: "Nová objednávka",
        empty: "V tejto pokladničnej zmene zatiaľ nie sú objednávky.",
        emptyHint: "Začnite predaj vytvorením objednávky.",
        back: "Späť",
        backToTerminals: "Späť na terminály",
        selectSession: "Vyberte pokladničnú zmenu",
        selectSessionHint: "Zadajte ID pokladničnej zmeny, ktorej objednávky chcete zobraziť.",
        sessionTotal: "Suma za pokladničnú zmenu",
        filterAll: "Všetky",
        loading: "Načítavajú sa objednávky…",
        ordersTotal: "objednávky",
        tapToView: "ťuknite na položku",
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
      page: { label: "Strana", description: "Číslo strany (začína na 1)" },
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
        conflict: { title: "Konflikt", description: "Konflikt údajov" },
        server: { title: "Chyba servera", description: "Objednávky sa nepodarilo načítať" },
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
      success: { title: "Objednávky načítané", description: "Zoznam objednávok sa načítal" },
      response: {
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

  // Product lookup (POS catalog search)
  productLookup: {
    get: {
      title: "Vyhľadávanie produktov",
      titleShort: "Vyhľadávanie produktov",
      description:
        "Vyhľadať produkty podľa názvu alebo SKU a rýchlo ich pridať na pokladni.",
      widget: {
        noResults: "Žiadne produkty sa nenašli. Skúste iný hľadaný výraz.",
        tax: "daň",
        back: "Späť",
      },
      companyId: {
        label: "ID firmy",
        description: "Obmedziť vyhľadávanie na konkrétnu spoločnosť",
      },
      query: {
        label: "Vyhľadať",
        description: "Vyhľadávanie podľa názvu produktu alebo SKU",
        placeholder: "Káva, BEV-001...",
      },
      page: { label: "Strana", description: "Číslo strany (začína na 1)" },
      pageSize: { label: "Na stranu", description: "Výsledky na stranu (max. 50)" },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Zadajte aspoň jeden znak na vyhľadávanie",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na vyhľadávanie produktov sa prihláste",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Žiadny prístup k tejto spoločnosti",
        },
        conflict: { title: "Konflikt", description: "Konflikt údajov" },
        server: {
          title: "Chyba servera",
          description: "Produkty sa nepodarilo vyhľadať",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Nastala neočakávaná chyba",
        },
        network: {
          title: "Chyba siete",
          description: "Skontrolujte pripojenie a skúste to znova",
        },
        notFound: { title: "Nenašlo sa", description: "Nenašli sa žiadne produkty" },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Nájdené produkty",
        description: "Načítali sa produkty zodpovedajúce vyhľadávaniu",
      },
      response: {
        id: "ID produktu",
        name: "Názov",
        sku: "SKU",
        type: "Typ",
        basePrice: "Cena",
        currency: "Mena",
        defaultTaxRate: "Sadzba dane",
        unit: "Merná jednotka",
      },
    },
  },

  // Order add payment
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
      orderId: { label: "ID objednávky", description: "Objednávka na úhradu" },
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
        description: "Prijímací účet (má prednosť pred predvoleným účtom terminálu)",
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
