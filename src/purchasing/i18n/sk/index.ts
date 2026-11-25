import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Nákup",
  tags: {
    purchasing: "Nákup",
    vendor: "Dodávateľ",
    order: "Nákupná objednávka",
    receipt: "Príjemka",
    create: "Vytvoriť",
    list: "Zoznam",
    get: "Načítať",
    update: "Aktualizovať",
    deactivate: "Deaktivovať",
    send: "Odoslať",
    confirm: "Potvrdiť",
    receive: "Prijať tovar",
    cancel: "Zrušiť",
    convertToBill: "Vytvoriť prijatú faktúru",
    addLine: "Pridať položku",
    removeLine: "Odstrániť položku",
  },
  endpointCategories: {
    purchasing: "Nákup",
    vendors: "Dodávatelia",
    purchaseOrders: "Nákupné objednávky",
    purchasingOrders: "Nákupné objednávky",
    purchasingVendors: "Dodávatelia",
  },
  enums: {
    poStatus: {
      draft: "Koncept",
      sent: "Odoslané",
      confirmed: "Potvrdené",
      partiallyReceived: "Čiastočne prijaté",
      received: "Prijaté",
      billed: "Vyfakturované",
      cancelled: "Zrušené",
    },
  },
  vendorCreate: {
    post: {
      title: "Vytvoriť dodávateľa",
      titleShort: "Vytvoriť dodávateľa",
      description: "Pridajte dodávateľa do evidencie firmy.",
      widget: {
        back: "Späť",
        viewVendor: "Otvoriť dodávateľa",
        createAnother: "Vytvoriť ďalšieho dodávateľa",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte všetky polia a skúste to znova",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Ak chcete pridávať dodávateľov, prihláste sa.",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Potrebujete rolu člena alebo vyššie oprávnenia.",
        },
        conflict: {
          title: "Kód už existuje",
          description: "Dodávateľ s týmto kódom už existuje",
        },
        server: {
          title: "Chyba servera",
          description: "Dodávateľa sa nepodarilo vytvoriť. Skúste to znova.",
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
          description: "Firma sa nenašla",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Dodávateľ bol vytvorený",
        description: "Dodávateľa sme pridali do evidencie.",
      },
      response: {
        id: "ID dodávateľa",
        name: "Názov",
        code: "Kód",
        email: "E-mail",
        isActive: "Aktívne",
        createdAt: "Vytvorené",
      },
    },
    companyId: {
      label: "Firma",
      description: "Firma, ku ktorej je dodávateľ priradený",
      placeholder: "UUID firmy",
    },
    name: {
      label: "Názov dodávateľa",
      description: "Obchodné meno dodávateľa",
      placeholder: "Acme GmbH",
    },
    code: {
      label: "Kód",
      description: "Krátky interný identifikátor (nepovinné)",
      placeholder: "ACM-001",
    },
    email: {
      label: "E-mail",
      description: "Kontaktný e-mail dodávateľa",
      placeholder: "orders@acme.com",
    },
    phone: {
      label: "Telefón",
      description: "Kontaktný telefón dodávateľa",
      placeholder: "+49 30 12345678",
    },
    website: {
      label: "Webová stránka",
      description: "Webová stránka dodávateľa",
      placeholder: "https://acme.com",
    },
    vatNumber: {
      label: "IČ DPH",
      description: "IČ DPH dodávateľa",
      placeholder: "DE123456789",
    },
    taxId: {
      label: "Daňové identifikačné číslo",
      description: "DIČ dodávateľa",
      placeholder: "12345678",
    },
    addressLine1: {
      label: "Adresa, riadok 1",
      description: "Ulica a číslo",
      placeholder: "123 Main Street",
    },
    addressLine2: {
      label: "Adresa, riadok 2",
      description: "Byt, kancelária, poschodie a podobne",
      placeholder: "2. poschodie",
    },
    city: {
      label: "Mesto",
      description: "Mesto",
      placeholder: "Berlín",
    },
    region: {
      label: "Región/štát",
      description: "Región alebo štát",
      placeholder: "Berlín",
    },
    postalCode: {
      label: "PSČ",
      description: "Poštové smerovacie číslo",
      placeholder: "10115",
    },
    country: {
      label: "Krajina",
      description: "Dvojpísmenový kód krajiny podľa ISO 3166-1 alpha-2",
      placeholder: "DE",
    },
    defaultCurrency: {
      label: "Predvolená mena",
      description: "Mena nákupných objednávok pre tohto dodávateľa",
      placeholder: "EUR",
    },
    defaultPaymentTermsDays: {
      label: "Lehota splatnosti v dňoch",
      description: "Predvolená lehota splatnosti v dňoch",
      placeholder: "30",
    },
    notes: {
      label: "Poznámky",
      description: "Interné poznámky k dodávateľovi",
      placeholder: "Preferovaný dodávateľ elektroniky",
    },
  },
  vendorList: {
    get: {
      title: "Dodávatelia",
      titleShort: "Dodávatelia",
      description: "Zobraziť všetkých dodávateľov firmy.",
      widget: {
        back: "Späť",
        active: "Aktívne",
        inactive: "Neaktívne",
        total: "spolu",
        createVendor: "Nový dodávateľ",
        empty: "Zatiaľ žiadni dodávatelia. Pridajte prvého dodávateľa.",
        vatLabel: "DPH",
        vatPrefix: "DPH:",
        paymentTerms: "Splatnosť v dňoch: {{days}}",
        paymentTermsPrefix: "Splatnosť:",
        paymentTermsSuffix: " d.",
        loading: "Načítava sa…",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte povinné polia",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Ak chcete zobraziť dodávateľov, prihláste sa.",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tejto firme nemáte prístup.",
        },
        conflict: {
          title: "Konflikt",
          description: "Konflikt údajov",
        },
        server: {
          title: "Chyba servera",
          description: "Dodávateľov sa nepodarilo načítať",
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
          description: "Firma sa nenašla",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Dodávatelia sa načítali",
        description: "Zoznam dodávateľov sa načítal",
      },
      response: {
        id: "ID dodávateľa",
        name: "Názov",
        code: "Kód",
        email: "E-mail",
        vatNumber: "DPH",
        defaultCurrency: "Mena",
        defaultPaymentTermsDays: "Platobné podmienky",
        isActive: "Aktívne",
        createdAt: "Vytvorené",
      },
    },
    companyId: {
      label: "Firma",
      description: "Firma, ktorej dodávateľov chcete zobraziť",
    },
  },
  vendorGet: {
    get: {
      title: "Načítať dodávateľa",
      titleShort: "Podrobnosti o dodávateľovi",
      description: "Zobrazte všetky údaje o dodávateľovi.",
      widget: {
        back: "Späť",
        edit: "Upraviť dodávateľa",
        createOrder: "Nová nákupná objednávka",
        viewOrders: "Zobraziť objednávky",
        deactivate: "Deaktivovať",
        select: "Vyberte dodávateľa",
      },
      vendorId: {
        label: "ID dodávateľa",
        description: "Dodávateľ, ktorého údaje chcete zobraziť",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Neplatné ID dodávateľa",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na zobrazenie dodávateľov sa prihláste",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tomuto dodávateľovi nemáte prístup",
        },
        conflict: {
          title: "Konflikt",
          description: "Konflikt údajov",
        },
        server: {
          title: "Chyba servera",
          description: "Dodávateľa sa nepodarilo načítať",
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
          title: "Dodávateľ sa nenašiel",
          description: "Dodávateľ neexistuje",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Dodávateľ sa načítal",
        description: "Údaje o dodávateľovi sa načítali",
      },
      response: {
        id: "ID dodávateľa",
        companyId: "ID firmy",
        name: "Názov",
        code: "Kód",
        email: "E-mail",
        phone: "Telefón",
        website: "Webová stránka",
        vatNumber: "IČ DPH",
        taxId: "Daňové identifikačné číslo",
        addressLine1: "Adresa",
        addressLine2: "Adresa, riadok 2",
        city: "Mesto",
        region: "Región",
        postalCode: "PSČ",
        country: "Krajina",
        defaultCurrency: "Predvolená mena",
        defaultPaymentTermsDays: "Lehota splatnosti v dňoch",
        isActive: "Aktívne",
        notes: "Poznámky",
        createdAt: "Vytvorené",
        updatedAt: "Aktualizované",
      },
    },
  },
  vendorUpdate: {
    patch: {
      title: "Upraviť dodávateľa",
      titleShort: "Upraviť dodávateľa",
      description: "Upravte údaje o dodávateľovi.",
      widget: {
        backToVendor: "Späť na dodávateľa",
        viewVendor: "Zobraziť dodávateľa",
      },
      vendorId: {
        label: "ID dodávateľa",
        description: "Dodávateľ, ktorého údaje chcete upraviť",
      },
      name: {
        label: "Názov dodávateľa",
        description: "Obchodné meno dodávateľa",
        placeholder: "Acme GmbH",
      },
      code: {
        label: "Kód",
        description: "Krátky interný identifikátor",
        placeholder: "ACM-001",
      },
      email: {
        label: "E-mail",
        description: "Kontaktný e-mail dodávateľa",
        placeholder: "orders@acme.com",
      },
      phone: {
        label: "Telefón",
        description: "Kontaktný telefón dodávateľa",
        placeholder: "+49 30 12345678",
      },
      website: {
        label: "Webová stránka",
        description: "Webová stránka dodávateľa",
        placeholder: "https://acme.com",
      },
      vatNumber: {
        label: "IČ DPH",
        description: "IČ DPH dodávateľa",
        placeholder: "DE123456789",
      },
      taxId: {
        label: "Daňové identifikačné číslo",
        description: "Daňové identifikačné číslo",
        placeholder: "12345678",
      },
      addressLine1: {
        label: "Adresa, riadok 1",
        description: "Ulica a číslo",
        placeholder: "123 Main Street",
      },
      addressLine2: {
        label: "Adresa, riadok 2",
        description: "Byt, kancelária, poschodie a podobne",
        placeholder: "2. poschodie",
      },
      city: {
        label: "Mesto",
        description: "Mesto",
        placeholder: "Berlín",
      },
      region: {
        label: "Región/štát",
        description: "Región alebo štát",
        placeholder: "Berlín",
      },
      postalCode: {
        label: "PSČ",
        description: "Poštové smerovacie číslo",
        placeholder: "10115",
      },
      country: {
        label: "Krajina",
        description: "Dvojpísmenový kód krajiny podľa ISO 3166-1 alpha-2",
        placeholder: "DE",
      },
      defaultCurrency: {
        label: "Predvolená mena",
        description: "Mena nákupných objednávok pre tohto dodávateľa",
        placeholder: "EUR",
      },
      defaultPaymentTermsDays: {
        label: "Lehota splatnosti v dňoch",
        description: "Predvolená lehota splatnosti v dňoch",
        placeholder: "30",
      },
      notes: {
        label: "Poznámky",
        description: "Interné poznámky k dodávateľovi",
        placeholder: "Preferovaný dodávateľ",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte povinné polia",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Ak chcete upraviť dodávateľa, prihláste sa.",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tomuto dodávateľovi nemáte prístup",
        },
        conflict: {
          title: "Kód sa už používa",
          description: "Kód dodávateľa sa už používa",
        },
        server: {
          title: "Chyba servera",
          description: "Nepodarilo sa aktualizovať dodávateľa",
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
          title: "Dodávateľ sa nenašiel",
          description: "Dodávateľ neexistuje",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Údaje o dodávateľovi boli upravené",
        description: "Zmeny údajov o dodávateľovi sa uložili.",
      },
      response: {
        id: "ID dodávateľa",
        name: "Názov",
        isActive: "Aktívne",
        updatedAt: "Aktualizované",
      },
    },
  },
  vendorDeactivate: {
    post: {
      title: "Deaktivovať dodávateľa",
      titleShort: "Deaktivovať",
      description:
        "Označte dodávateľa ako neaktívneho. Existujúce nákupné objednávky zostanú v evidencii.",
      vendorId: {
        label: "ID dodávateľa",
        description: "Dodávateľ, ktorého chcete deaktivovať",
      },
      widget: {
        warning:
          "Dodávateľ sa deaktivuje. Existujúce nákupné objednávky zostanú zachované.",
        backToList: "Späť na zoznam dodávateľov",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Neplatné ID dodávateľa",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Ak chcete deaktivovať dodávateľa, prihláste sa.",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tomuto dodávateľovi nemáte prístup",
        },
        conflict: {
          title: "Konflikt",
          description: "Konflikt údajov",
        },
        server: {
          title: "Chyba servera",
          description: "Nepodarilo sa deaktivovať dodávateľa",
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
          title: "Dodávateľ sa nenašiel",
          description: "Dodávateľ neexistuje",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Dodávateľ bol deaktivovaný",
        description: "Dodávateľ je teraz neaktívny.",
      },
      response: {
        id: "ID dodávateľa",
        isActive: "Aktívne",
      },
    },
  },
  orderCreate: {
    post: {
      title: "Vytvoriť nákupnú objednávku",
      titleShort: "Vytvoriť objednávku",
      description: "Vytvorte koncept nákupnej objednávky.",
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte všetky polia a skúste to znova",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Ak chcete vytvoriť nákupnú objednávku, prihláste sa.",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Potrebujete rolu člena alebo vyššie oprávnenia.",
        },
        conflict: {
          title: "Konflikt",
          description: "Konflikt údajov",
        },
        server: {
          title: "Chyba servera",
          description:
            "Nákupnú objednávku sa nepodarilo vytvoriť. Skúste to znova.",
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
          description: "Dodávateľ alebo firma sa nenašli",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Nákupná objednávka bola vytvorená",
        description: "Objednávka sa uložila ako koncept.",
      },
      widget: {
        browseVendors: "Zobraziť dodávateľov",
        browseWarehouses: "Zobraziť sklady",
        viewOrder: "Otvoriť nákupnú objednávku",
        backToList: "Späť na zoznam",
      },
      response: {
        id: "ID objednávky",
        poNumber: "Číslo objednávky",
        status: "Stav",
        subtotal: "Medzisúčet",
        taxAmount: "Daň",
        total: "Spolu",
        createdAt: "Vytvorené",
      },
    },
    companyId: {
      label: "Firma",
      description: "Firma, ktorá vystavuje nákupnú objednávku",
      placeholder: "UUID firmy",
    },
    vendorId: {
      label: "Dodávateľ",
      description: "Dodávateľ, ktorému je objednávka určená",
      placeholder: "UUID dodávateľa",
    },
    currency: {
      label: "Mena",
      description: "Mena objednávky",
      placeholder: "EUR",
    },
    expectedDeliveryDate: {
      label: "Očakávané dodanie",
      description: "Predpokladaný dátum dodania (nepovinné)",
      placeholder: "2024-03-01",
    },
    deliveryWarehouseId: {
      label: "Cieľový sklad",
      description: "Sklad na príjem tovaru (nepovinné)",
      placeholder: "UUID skladu",
    },
    notes: {
      label: "Poznámky",
      description: "Interné poznámky k objednávke",
      placeholder: "Naliehavá objednávka",
    },
    lines: {
      label: "Položky",
      description: "Produkty, ktoré chcete objednať, a ich množstvá",
    },
    lineDescription: {
      label: "Opis",
      description: "Opis položky",
      placeholder: "Kancelárske stoličky",
    },
    lineProductId: {
      label: "ID produktu",
      description: "Produkt z katalógu (nepovinné)",
      placeholder: "UUID produktu",
    },
    lineQuantity: {
      label: "Množstvo",
      description: "Počet jednotiek",
      placeholder: "10",
    },
    lineUnitPrice: {
      label: "Jednotková cena",
      description: "Cena za jednotku",
      placeholder: "99.00",
    },
    lineTaxRate: {
      label: "Sadzba dane",
      description: "Sadzba dane v desatinnom tvare (napr. 0,19 znamená 19 %)",
      placeholder: "0.19",
    },
    lineSortOrder: {
      label: "Poradie",
      description: "Poradie zobrazenia položky",
      placeholder: "0",
    },
  },
  orderList: {
    get: {
      title: "Nákupné objednávky",
      titleShort: "Objednávky",
      description:
        "Zobrazte nákupné objednávky firmy. Zoznam môžete filtrovať podľa stavu.",
      widget: {
        newOrder: "Nová nákupná objednávka",
        empty: "Nenašli sa žiadne nákupné objednávky.",
        statusAll: "Všetky",
        orders: "nákupné objednávky",
        order: "objednávka",
        colPoVendor: "Nákupná objednávka / dodávateľ",
        colDate: "Dátum",
        colAmount: "Suma",
        colStatus: "Stav",
        deliveryArrow: "→",
        overdue: "po termíne",
        actionNeeded: "na vybavenie",
        back: "Späť",
        loading: "Načítava sa…",
      },
      companyId: {
        label: "Firma",
        description: "Firma, ktorej nákupné objednávky chcete zobraziť",
      },
      status: {
        label: "Filter podľa stavu",
        description: "Zobraziť iba objednávky s vybraným stavom (nepovinné)",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte povinné polia",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Ak chcete zobraziť nákupné objednávky, prihláste sa.",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tejto firme nemáte prístup.",
        },
        conflict: {
          title: "Konflikt",
          description: "Konflikt údajov",
        },
        server: {
          title: "Chyba servera",
          description: "Nákupné objednávky sa nepodarilo načítať",
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
          description: "Firma sa nenašla",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Objednávky sa načítali",
        description: "Zoznam nákupných objednávok sa načítal.",
      },
      response: {
        id: "ID objednávky",
        poNumber: "Číslo objednávky",
        vendorId: "Dodávateľ",
        vendorName: "Dodávateľ",
        status: "Stav",
        currency: "Mena",
        total: "Spolu",
        expectedDeliveryDate: "Očakávané dodanie",
        createdAt: "Vytvorené",
      },
    },
  },
  orderGet: {
    get: {
      title: "Načítať nákupnú objednávku",
      titleShort: "Podrobnosti o objednávke",
      description:
        "Zobrazte nákupnú objednávku vrátane položiek a doterajších príjemiek.",
      widget: {
        back: "Späť",
        send: "Odoslať dodávateľovi",
        confirm: "Označiť ako potvrdenú",
        receive: "Prijať tovar",
        convertToBill: "Vytvoriť dodávateľskú faktúru",
        viewBill: "Zobraziť prijatú faktúru",
        addLine: "+ Pridať položku",
        cancel: "Zrušiť objednávku",
        edit: "Upraviť",
        select: "Vyberte objednávku",
        linesHeader: "Položky",
        receiptsHeader: "História príjmu tovaru",
        noLines: "Žiadne položky.",
        noReceipts: "Zatiaľ žiadne príjemky.",
        colDescription: "Opis",
        colQtyPrice: "Množstvo × cena",
        colLineTotal: "Spolu",
        delivery: "Očakávané dodanie:",
        overdue: "(po termíne)",
        received: "prijaté",
        billCreated: "K tejto nákupnej objednávke už existuje prijatá faktúra.",
        vendorLabel: "Dodávateľ:",
      },
      poId: {
        label: "ID objednávky",
        description: "Nákupná objednávka, ktorú chcete zobraziť",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Neplatné ID objednávky",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Ak chcete zobraziť nákupné objednávky, prihláste sa.",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tejto nákupnej objednávke nemáte prístup.",
        },
        conflict: {
          title: "Konflikt",
          description: "Konflikt údajov",
        },
        server: {
          title: "Chyba servera",
          description: "Nepodarilo sa načítať objednávku",
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
          title: "Nákupná objednávka sa nenašla",
          description: "Nákupná objednávka neexistuje",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Nákupná objednávka",
        description: "Údaje o nákupnej objednávke sa načítali.",
      },
      response: {
        id: "ID objednávky",
        companyId: "ID firmy",
        vendorId: "ID dodávateľa",
        poNumber: "Číslo objednávky",
        status: "Stav",
        currency: "Mena",
        expectedDeliveryDate: "Očakávané dodanie",
        deliveryWarehouseId: "Cieľový sklad",
        notes: "Poznámky",
        subtotal: "Medzisúčet",
        taxAmount: "Daň",
        total: "Spolu",
        billId: "ID prijatej faktúry",
        confirmedAt: "Potvrdené",
        receivedAt: "Prijaté",
        createdAt: "Vytvorené",
        updatedAt: "Aktualizované",
        lines: "Položky",
        lineId: "ID položky",
        lineProductId: "ID produktu",
        lineDescription: "Opis",
        lineQuantity: "Množstvo",
        lineUnitPrice: "Jednotková cena",
        lineTaxRate: "Sadzba dane",
        lineTaxAmount: "Daň",
        lineTotal: "Spolu",
        lineQuantityReceived: "Prijaté",
        receipts: "Príjemky",
        receiptId: "ID príjemky",
        receiptReceivedAt: "Dátum prijatia",
        receiptNotes: "Poznámky",
      },
    },
  },
  orderUpdate: {
    patch: {
      title: "Aktualizovať objednávku",
      titleShort: "Upraviť objednávku",
      description: "Upravte údaje a položky v koncepte nákupnej objednávky.",
      widget: {
        backToPO: "Späť na nákupnú objednávku",
      },
      poId: {
        label: "ID objednávky",
        description: "Nákupná objednávka, ktorú chcete upraviť",
      },
      vendorId: {
        label: "Dodávateľ",
        description: "Zmeniť dodávateľa (nepovinné)",
        placeholder: "UUID dodávateľa",
      },
      currency: {
        label: "Mena",
        description: "Mena objednávky",
        placeholder: "EUR",
      },
      expectedDeliveryDate: {
        label: "Očakávané dodanie",
        description: "Predpokladaný dátum dodania",
        placeholder: "2024-03-01",
      },
      deliveryWarehouseId: {
        label: "Cieľový sklad",
        description: "Sklad na príjem tovaru",
        placeholder: "UUID skladu",
      },
      notes: {
        label: "Poznámky",
        description: "Interné poznámky k objednávke",
        placeholder: "Naliehavá objednávka",
      },
      lines: {
        label: "Položky",
        description: "Nahradiť všetky položky (nepovinné)",
      },
      lineDescription: {
        label: "Opis",
        description: "Opis položky",
        placeholder: "Kancelárske stoličky",
      },
      lineProductId: {
        label: "ID produktu",
        description: "Produkt z katalógu (nepovinné)",
        placeholder: "UUID produktu",
      },
      lineQuantity: {
        label: "Množstvo",
        description: "Počet jednotiek",
        placeholder: "10",
      },
      lineUnitPrice: {
        label: "Jednotková cena",
        description: "Cena za jednotku",
        placeholder: "99.00",
      },
      lineTaxRate: {
        label: "Sadzba dane",
        description: "Sadzba dane v desatinnom tvare",
        placeholder: "0.19",
      },
      lineSortOrder: {
        label: "Poradie",
        description: "Poradie zobrazenia položky",
        placeholder: "0",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte povinné polia",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Ak chcete upraviť nákupnú objednávku, prihláste sa.",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tejto nákupnej objednávke nemáte prístup.",
        },
        conflict: {
          title: "Objednávka už nie je v stave konceptu",
          description: "Upravovať možno iba koncepty nákupných objednávok",
        },
        server: {
          title: "Chyba servera",
          description: "Nákupnú objednávku sa nepodarilo uložiť",
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
          title: "Nákupná objednávka sa nenašla",
          description: "Nákupná objednávka neexistuje",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Nákupná objednávka bola aktualizovaná",
        description: "Zmeny nákupnej objednávky sa uložili.",
      },
      response: {
        id: "ID objednávky",
        status: "Stav",
        subtotal: "Medzisúčet",
        taxAmount: "Daň",
        total: "Spolu",
        updatedAt: "Aktualizované",
      },
    },
  },
  orderSend: {
    post: {
      title: "Odoslať nákupnú objednávku",
      titleShort: "Odoslať objednávku",
      description: "Označte nákupnú objednávku ako odoslanú dodávateľovi.",
      poId: {
        label: "ID objednávky",
        description: "Nákupná objednávka, ktorú chcete odoslať",
      },
      widget: {
        back: "Späť",
        backToPO: "Späť na nákupnú objednávku",
        warning:
          "Objednávka sa označí ako odoslaná dodávateľovi. Už nebude v stave konceptu.",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Neplatné ID objednávky",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Ak chcete odoslať nákupnú objednávku, prihláste sa.",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tejto nákupnej objednávke nemáte prístup.",
        },
        conflict: {
          title: "Objednávka už nie je v stave konceptu",
          description: "Odoslať možno iba koncepty nákupných objednávok",
        },
        server: {
          title: "Chyba servera",
          description: "Nepodarilo sa poslať objednávku",
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
          title: "Nákupná objednávka sa nenašla",
          description: "Nákupná objednávka neexistuje",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Nákupná objednávka bola odoslaná",
        description: "Objednávka je označená ako odoslaná.",
      },
      response: {
        id: "ID objednávky",
        status: "Stav",
      },
    },
  },
  orderConfirm: {
    post: {
      title: "Potvrdiť nákupnú objednávku",
      titleShort: "Potvrdiť objednávku",
      description: "Zaznamenajte, že dodávateľ potvrdil nákupnú objednávku.",
      poId: {
        label: "ID objednávky",
        description: "Nákupná objednávka, ktorú chcete potvrdiť",
      },
      widget: {
        back: "Späť",
        backToPO: "Späť na nákupnú objednávku",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Neplatné ID objednávky",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Ak chcete potvrdiť nákupnú objednávku, prihláste sa.",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tejto nákupnej objednávke nemáte prístup.",
        },
        conflict: {
          title: "Neplatný stav",
          description: "Potvrdiť môžete iba odoslanú nákupnú objednávku.",
        },
        server: {
          title: "Chyba servera",
          description: "Nepodarilo sa potvrdiť objednávku",
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
          title: "Nákupná objednávka sa nenašla",
          description: "Nákupná objednávka neexistuje",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Nákupná objednávka bola potvrdená",
        description: "Objednávka je označená ako potvrdená.",
      },
      response: {
        id: "ID objednávky",
        status: "Stav",
        confirmedAt: "Dátum potvrdenia",
      },
    },
  },
  orderReceive: {
    post: {
      title: "Prijať tovar",
      titleShort: "Prijať tovar",
      description:
        "Zaevidujte príjem tovaru k nákupnej objednávke. Príjem sa zapíše do skladových pohybov.",
      widget: {
        backToPO: "Späť na nákupnú objednávku",
      },
      poId: {
        label: "ID objednávky",
        description: "Nákupná objednávka, ku ktorej prijímate tovar",
      },
      warehouseId: {
        label: "Sklad",
        description: "Sklad, ktorý prijíma tovar (nepovinné)",
        placeholder: "UUID skladu",
      },
      notes: {
        label: "Poznámky",
        description: "Poznámky k dodávke",
        placeholder: "Dodací list č. 12345",
      },
      lines: {
        label: "Prijaté položky",
        description: "Prijaté množstvá jednotlivých položiek",
      },
      linePoLineId: {
        label: "ID položky",
        description: "Položka nákupnej objednávky",
      },
      lineQuantityReceived: {
        label: "Prijaté množstvo",
        description: "Prijaté množstvo tejto položky",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte všetky polia a množstvá",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Ak chcete zaevidovať príjem tovaru, prihláste sa.",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tejto nákupnej objednávke nemáte prístup.",
        },
        conflict: {
          title: "Neplatný stav",
          description:
            "Tovar môžete prijať iba k odoslanej alebo potvrdenej nákupnej objednávke.",
        },
        server: {
          title: "Chyba servera",
          description: "Príjem tovaru sa nepodarilo zaznamenať",
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
          title: "Nákupná objednávka sa nenašla",
          description: "Nákupná objednávka alebo jej položka sa nenašla.",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Tovar bol prijatý",
        description:
          "Príjem tovaru sa zaevidoval a stav zásob sa aktualizoval.",
      },
      response: {
        receiptId: "ID príjemky",
        status: "Stav nákupnej objednávky",
        receivedAt: "Dátum prijatia",
      },
    },
  },
  orderConvertToBill: {
    post: {
      title: "Vytvoriť prijatú faktúru",
      titleShort: "Vytvoriť prijatú faktúru",
      description:
        "Vytvorte prijatú faktúru z úplne dodanej objednávky. Schválením faktúry zaúčtujete záväzok.",
      widget: {
        back: "Späť",
        viewBill: "Zobraziť prijatú faktúru",
      },
      poId: {
        label: "ID nákupnej objednávky",
        description: "Objednávka, z ktorej chcete vytvoriť faktúru",
      },
      errors: {
        validation: {
          title: "Skontrolujte menu a celkové sumy objednávky.",
          description:
            "Mena faktúry musí byť podporovaná a celkové sumy musia zodpovedať položkám objednávky.",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Ak chcete vytvoriť prijatú faktúru, prihláste sa.",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tejto nákupnej objednávke nemáte prístup.",
        },
        conflict: {
          title: "Z objednávky nemožno vytvoriť faktúru",
          description:
            "Faktúru možno vytvoriť len z úplne dodanej objednávky, ku ktorej ešte neexistuje faktúra.",
        },
        server: {
          title: "Chyba servera",
          description: "Prijatú faktúru sa nepodarilo vytvoriť.",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba.",
        },
        network: {
          title: "Chyba pripojenia",
          description: "Skontrolujte pripojenie a skúste to znova.",
        },
        notFound: {
          title: "Nákupná objednávka sa nenašla",
          description: "Nákupná objednávka neexistuje.",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny.",
        },
      },
      success: {
        title: "Prijatá faktúra bola vytvorená",
        description: "Z nákupnej objednávky bola vytvorená prijatá faktúra.",
      },
      response: {
        billId: "ID prijatej faktúry",
        billNumber: "Číslo prijatej faktúry",
        poId: "ID nákupnej objednávky",
      },
    },
  },
  orderLineAdd: {
    post: {
      widget: {
        backToOrder: "Späť na objednávku",
        lineAdded: "Položka bola pridaná",
      },
      title: "Pridať riadok",
      titleShort: "Pridať položku",
      description: "Pridajte položku do nákupnej objednávky.",
      poId: {
        label: "ID objednávky",
        description: "Nákupná objednávka, do ktorej chcete pridať položku",
      },
      productId: {
        label: "Produkt",
        description: "Produkt z katalógu (nepovinné)",
        placeholder: "UUID produktu",
      },
      itemDescription: {
        label: "Opis",
        description: "Opis položky",
        placeholder: "Kancelárske stoličky",
      },
      quantity: {
        label: "Množstvo",
        description: "Počet jednotiek",
        placeholder: "10",
      },
      unitPrice: {
        label: "Jednotková cena",
        description: "Cena za jednotku",
        placeholder: "99.00",
      },
      taxRate: {
        label: "Sadzba dane",
        description: "Sadzba dane v desatinnom tvare (napr. 0,19 znamená 19 %)",
        placeholder: "0.19",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte všetky polia a skúste to znova",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Ak chcete pridať položku, prihláste sa.",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tejto nákupnej objednávke nemáte prístup.",
        },
        conflict: {
          title: "Objednávka už nie je v stave konceptu",
          description: "Upravovať možno iba koncepty nákupných objednávok",
        },
        server: {
          title: "Chyba servera",
          description: "Položku sa nepodarilo pridať",
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
          title: "Nákupná objednávka sa nenašla",
          description: "Nákupná objednávka neexistuje",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Položka pridaná",
        description: "Položka bola pridaná do nákupnej objednávky.",
      },
      response: {
        lineId: "ID položky",
        subtotal: "Medzisúčet",
        taxAmount: "Daň",
        total: "Spolu",
      },
    },
  },
  orderLineRemove: {
    post: {
      title: "Odstrániť položku",
      titleShort: "Odstrániť položku",
      description: "Odstráňte položku z nákupnej objednávky.",
      poId: {
        label: "ID objednávky",
        description: "Nákupná objednávka, z ktorej chcete odstrániť položku",
      },
      lineId: {
        label: "ID položky",
        description: "Položka, ktorú chcete odstrániť",
      },
      widget: {
        backToOrder: "Späť na nákupnú objednávku",
        warning: "Položka sa natrvalo odstráni z nákupnej objednávky.",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Neplatné identifikátory",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Ak chcete odstrániť položku, prihláste sa.",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tejto nákupnej objednávke nemáte prístup.",
        },
        conflict: {
          title: "Objednávka už nie je v stave konceptu",
          description: "Upravovať možno iba koncepty nákupných objednávok",
        },
        server: {
          title: "Chyba servera",
          description: "Položku sa nepodarilo odstrániť",
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
          description: "Nákupná objednávka alebo položka sa nenašla",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Položka bola odstránená",
        description: "Položka bola odstránená z nákupnej objednávky.",
      },
      response: {
        subtotal: "Medzisúčet",
        taxAmount: "Daň",
        total: "Spolu",
      },
    },
  },
  dashboard: {
    get: {
      title: "Prehľad nákupu",
      titleShort: "Prehľad",
      description:
        "Sledujte nákupné objednávky, termíny dodávok a úhrady dodávateľom.",
      widget: {
        openValue: "Hodnota otvorených objednávok",
        settledBills: "Prijaté faktúry uhradené tento mesiac",
        deliveries: "Očakávané dodávky",
        order: "Objednávka",
        supplier: "Dodávateľ",
        expected: "Očakávané dodanie",
        orderTotal: "Celkom za objednávku",
        noDeliveries: "Všetky dodávky boli prijaté.",
        overdue: "Oneskorené dodávky",
        dueSeven: "S termínom do 7 dní",
        kpiDraft: "Koncepty",
        kpiConfirmed: "Potvrdené",
        kpiAwaitingReceipt: "Čaká na príjem",
        kpiActiveVendors: "Aktívni dodávatelia",
        warningDueThisWeek:
          "Jedna objednávka má termín dodania tento týždeň. Skontrolujte dátum dodania.",
        warningDueThisWeekPlural:
          "Skontrolujte termíny dodania objednávok na tento týždeň. Počet objednávok je {{count}}.",
        navNewPo: "Vytvoriť objednávku",
        navAllPos: "Všetky nákupné objednávky",
        navVendors: "Dodávatelia",
        navNewVendor: "Pridať dodávateľa",
        loading: "Načítava sa…",
      },
      companyId: {
        label: "Firma",
        description: "Firma, ktorej nákupy chcete zobraziť (voliteľné)",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte povinné polia",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Ak chcete zobraziť prehľad nákupu, prihláste sa.",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tejto firme nemáte prístup.",
        },
        conflict: {
          title: "Konflikt údajov",
          description: "Údaje sa medzičasom zmenili.",
        },
        server: {
          title: "Chyba servera",
          description: "Prehľad nákupu sa nepodarilo načítať.",
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
          description: "Firma sa nenašla.",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny.",
        },
      },
      success: {
        title: "Prehľad sa načítal",
        description: "Prehľad nákupu je pripravený.",
      },
      response: {
        draftCount: "Rozpracované objednávky",
        confirmedCount: "Potvrdené objednávky",
        awaitingReceiptCount: "Čaká na príjem",
        activeVendorCount: "Aktívni dodávatelia",
        dueThisWeekCount: "S termínom tento týždeň",
      },
    },
  },
  orderCancel: {
    post: {
      title: "Zrušiť nákupnú objednávku",
      titleShort: "Zrušiť objednávku",
      description: "Zrušiť koncept alebo odoslanú nákupnú objednávku.",
      poId: {
        label: "ID objednávky",
        description: "Nákupná objednávka, ktorú chcete zrušiť",
      },
      widget: {
        back: "Späť",
        warning:
          "Nákupná objednávka sa natrvalo zruší. Zrušiť možno iba koncepty alebo odoslané nákupné objednávky.",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Neplatné ID objednávky",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Ak chcete zrušiť nákupnú objednávku, prihláste sa.",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tejto nákupnej objednávke nemáte prístup.",
        },
        conflict: {
          title: "Objednávku nemožno zrušiť",
          description:
            "Zrušiť možno iba koncepty alebo odoslané nákupné objednávky",
        },
        server: {
          title: "Chyba servera",
          description: "Nákupnú objednávku sa nepodarilo zrušiť",
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
          title: "Nákupná objednávka sa nenašla",
          description: "Nákupná objednávka neexistuje",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Nákupná objednávka bola zrušená",
        description: "Objednávka je zrušená",
      },
      response: {
        id: "ID objednávky",
        status: "Stav",
      },
    },
  },
};
