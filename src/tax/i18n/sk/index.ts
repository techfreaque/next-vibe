import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Dane",
  endpointCategories: {
    tax: "Dane",
    taxRates: "Sadzby dane",
    taxReports: "Daňové prehľady",
  },

  rate: {
    details: "Údaje o sadzbe",
    create: {
      title: "Vytvoriť sadzbu dane",
      titleShort: "Pridať sadzbu",
      description: "Pridať sadzbu dane pre firmu",
      widget: {
        save: "Vytvoriť sadzbu dane",
        backToList: "Späť na sadzby dane",
      },
      companyId: {
        label: "Firma",
        description: "Vyberte spoločnosť, pre ktorú sadzba platí.",
        placeholder: "ID firmy",
      },
      name: {
        label: "Názov",
        description: "Zadajte názov sadzby dane.",
        placeholder: "napr. DPH 20 %",
      },
      code: {
        label: "Kód",
        description: "Zadajte krátky kód sadzby.",
        placeholder: "napr. AT-VAT20",
      },
      type: {
        label: "Druh dane",
        description: "Kategória dane",
        placeholder: "Vyberte druh dane",
      },
      rate: {
        label: "Sadzba",
        description: "Sadzba dane ako desatinné číslo (0.2 = 20 %)",
        placeholder: "0.2000",
      },
      country: {
        label: "Krajina",
        description: "Krajina, v ktorej sadzba platí (nepovinné)",
        placeholder: "napr. AT",
      },
      region: {
        label: "Región",
        description: "Región alebo štát, v ktorom sadzba platí (nepovinné).",
        placeholder: "napr. Viedeň",
      },
      isDefault: {
        label: "Predvolená sadzba",
        description: "Použite túto sadzbu predvolene pri nových položkách.",
      },
      response: {
        id: "ID sadzby dane",
        code: "Kód sadzby dane",
        name: "Názov sadzby dane",
      },
      success: {
        title: "Sadzba dane vytvorená",
        description: "Sadzba dane sa pridala k vašej firme",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte zadané údaje a skúste to znova.",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Prihláste sa.",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Nemáte oprávnenie spravovať sadzby dane.",
        },
        notFound: { title: "Nenašlo sa", description: "Firma sa nenašla" },
        conflict: {
          title: "Duplicitný kód",
          description: "Sadzba s týmto kódom už existuje.",
        },
        server: {
          title: "Chyba servera",
          description: "Vyskytla sa interná chyba.",
        },
        network: {
          title: "Chyba siete",
          description: "Skontrolujte pripojenie a skúste to znova.",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Nastala neočakávaná chyba",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
    },
    list: {
      title: "Sadzby dane",
      titleShort: "Sadzby dane",
      description: "Prehľad sadzieb dane nastavených pre vašu spoločnosť.",
      widget: {
        actions: "Akcie",
        retry: "Skúsiť znova",
        previous: "Predchádzajúca",
        next: "Nasledujúca",
        addRate: "Pridať sadzbu",
        labelDefault: "Predvolená",
        labelActive: "Aktívna",
        labelInactive: "Neaktívna",
        labelEdit: "Upraviť",
        labelDelete: "Deaktivovať",
        labelCompound: "Zložená",
        empty: "Zatiaľ nemáte nastavené sadzby dane. Pridajte prvú sadzbu.",
        emptySetup: "Nastavte sadzby dane, ktoré firma používa na faktúrach.",
        columnRate: "Sadzba dane",
        columnTypeRateActions: "Druh, sadzba a stav",
        backToCatalog: "← Produkty",
      },
      companyId: {
        label: "Firma",
        description: "Vyberte spoločnosť, ktorej sadzby dane chcete zobraziť.",
        placeholder: "ID firmy",
      },
      country: {
        label: "Krajina",
        description: "Filtrujte podľa kódu krajiny (nepovinné).",
        placeholder: "napr. AT",
      },
      type: {
        label: "Druh dane",
        description: "Filtrujte podľa druhu dane (nepovinné).",
        placeholder: "Vyberte druh dane",
      },
      page: {
        label: "Strana",
        description: "Číslo strany, počnúc jednotkou.",
      },
      pageSize: {
        label: "Na stranu",
        description: "Počet výsledkov na stranu, najviac 100.",
      },
      response: {
        total: "Spolu",
        rates: "Sadzby dane",
        rate: {
          id: "Identifikátor",
          company: "Spoločnosť",
          name: "Názov",
          code: "Kód",
          type: "Druh",
          rate: "Sadzba",
          country: "Krajina",
          region: "Región",
          isDefault: "Predvolená",
          isActive: "Aktívna",
          isCompound: "Zložená",
          createdAt: "Vytvorené",
          updatedAt: "Aktualizované",
        },
      },
      success: {
        title: "Sadzby sa načítali",
        description: "Prehľad sadzieb dane je pripravený.",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte zadané údaje a skúste to znova.",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Prihláste sa.",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Nemáte oprávnenie zobraziť sadzby dane.",
        },
        notFound: { title: "Nenašlo sa", description: "Firma sa nenašla" },
        conflict: { title: "Konflikt", description: "Údaje sú v rozpore." },
        server: {
          title: "Chyba servera",
          description: "Vyskytla sa interná chyba.",
        },
        network: {
          title: "Chyba siete",
          description: "Skontrolujte pripojenie a skúste to znova.",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Nastala neočakávaná chyba",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
    },
    update: {
      title: "Upraviť sadzbu dane",
      titleShort: "Upraviť sadzbu",
      description: "Upravte existujúcu sadzbu dane.",
      widget: {
        save: "Uložiť sadzbu dane",
        backToList: "Späť na sadzby dane",
        failed: "Sadzba sa neuložila",
        subtitle: "{{company}} · {{code}}",
        notFoundTitle: "Táto sadzba už neexistuje",
        notFoundMessage:
          "Bola odstránená alebo patrí spoločnosti, ku ktorej nemáte prístup. Vyberte sadzbu zo zoznamu.",
        loadErrorTitle: "Sadzbu sa nepodarilo načítať",
      },
      rateId: {
        label: "ID sadzby dane",
        description: "Vyberte sadzbu, ktorú chcete upraviť.",
        placeholder: "UUID sadzby dane",
      },
      name: {
        label: "Názov",
        description: "Zadajte nový názov sadzby.",
        placeholder: "napr. DPH 20 %",
      },
      rate: {
        label: "Sadzba",
        description: "Nová sadzba dane ako desatinné číslo (0.2 = 20 %)",
        placeholder: "0.2000",
      },
      isDefault: {
        label: "Predvolená sadzba",
        description: "Použite túto sadzbu predvolene pri nových položkách.",
      },
      isActive: {
        label: "Aktívna",
        description: "Určte, či je sadzba aktívna.",
      },
      response: {
        updated: "Aktualizované",
      },
      success: {
        title: "Sadzba sa upravila",
        description: "Zmeny sadzby sa uložili.",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte zadané údaje a skúste to znova.",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Prihláste sa.",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Nemáte oprávnenie spravovať sadzby dane.",
        },
        notFound: {
          title: "Nenašlo sa",
          description: "Sadzba dane sa nenašla.",
        },
        conflict: { title: "Konflikt", description: "Údaje sú v rozpore." },
        server: {
          title: "Chyba servera",
          description: "Vyskytla sa interná chyba.",
        },
        network: {
          title: "Chyba siete",
          description: "Skontrolujte pripojenie a skúste to znova.",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Nastala neočakávaná chyba",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
    },
    delete: {
      title: "Deaktivovať sadzbu dane",
      titleShort: "Deaktivovať sadzbu",
      description: "Deaktivujte sadzbu dane.",
      widget: {
        backToList: "Späť na sadzby dane",
        warning: "Sadzba dane sa deaktivuje. Túto akciu nemožno vrátiť späť.",
        confirmTitle: "Chcete deaktivovať túto sadzbu?",
        confirmDescription:
          "Deaktivované sadzby sa už nedajú použiť na nové položky faktúr. Existujúce položky sa nezmenia.",
        confirmButton: "Áno, deaktivovať",
        cancelButton: "Zrušiť",
      },
      rateId: {
        label: "ID sadzby dane",
        description: "Vyberte sadzbu, ktorú chcete deaktivovať.",
        placeholder: "UUID sadzby dane",
      },
      response: {
        deleted: "Deaktivovaná",
      },
      success: {
        title: "Sadzba je deaktivovaná",
        description: "Sadzba dane sa deaktivovala.",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte zadané údaje a skúste to znova.",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Prihláste sa.",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Nemáte oprávnenie spravovať sadzby dane.",
        },
        notFound: {
          title: "Nenašlo sa",
          description: "Sadzba dane sa nenašla.",
        },
        conflict: { title: "Konflikt", description: "Údaje sú v rozpore." },
        server: {
          title: "Chyba servera",
          description: "Vyskytla sa interná chyba.",
        },
        network: {
          title: "Chyba siete",
          description: "Skontrolujte pripojenie a skúste to znova.",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Nastala neočakávaná chyba",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
    },
  },

  report: {
    title: "Daň podľa sadzby",
    titleShort: "Daň podľa sadzby",
    description:
      "Skontrolujte zaevidované dane z odberateľských faktúr, dobropisov, dodávateľských faktúr a pokladničných predajov.",
    widget: {
      retry: "Znova načítať výkaz",
      scope:
        "Odberateľské faktúry sa vykazujú ku dňu účtovného zápisu alebo vytvorenia faktúry. Pri nákupoch sa používa dátum dodávateľskej faktúry. Pokladničné predaje sa vykazujú ku dňu dokončenia v UTC a zahŕňajú položky s kladnou sadzbou alebo zaevidovanou daňou. Ak vystavená faktúra a pokladničný predaj odkazujú na ten istý účtovný zápis, predaj sa vykáže podľa faktúry.",
      empty:
        "Tu sa zobrazia vystavené faktúry, dobropisy, dodávateľské faktúry a pokladničné predaje s daňou, zoskupené podľa sadzby.",
      range: "od {{from}} do {{to}}",
      total: "Spolu",
      previousMonth: "Zobraziť predchádzajúci mesiac",
      unknownRate: "Sadzba nie je k dispozícii",
      run: "Zobraziť prehľad",
      running: "Načítava sa prehľad…",
      scopeHint:
        "Porovnajte DPH z predaja a nákupu podľa sadzby za vybranú firmu a obdobie.",
      selectCompany: "Vyberte spoločnosť pre tento prehľad.",
      subtitle: "{{company}} · od {{from}} do {{to}}",
      errorTitle: "Prehľad daní sa nepodarilo načítať",
      emptyTitle: "V tomto období nie sú žiadne zdanené doklady",
      period: {
        label: "Obdobie",
        thisMonth: "Tento mesiac",
        lastMonth: "Minulý mesiac",
        thisQuarter: "Tento štvrťrok",
        thisYear: "Tento rok",
        custom: "Vlastné",
      },
      kpi: {
        salesTax: "DPH z predaja",
        salesBase: "Zdaniteľné predaje",
        purchaseTax: "DPH z nákupov",
        purchaseBase: "Zdaniteľné nákupy",
      },
    },
    currency: {
      label: "Mena",
      placeholder: "Mena spoločnosti",
      description: "Predvolene sa použije mena spoločnosti.",
    },
    currencies: { EUR: "EUR", PLN: "PLN", USD: "USD" },
    companyId: {
      label: "Firma",
      description:
        "Vyberte spoločnosť, za ktorú chcete zobraziť daňový prehľad.",
      placeholder: "ID firmy",
    },
    dateFrom: {
      label: "Od",
      description: "Začiatok obdobia prehľadu.",
      placeholder: "Začiatok tohto mesiaca",
    },
    dateTo: {
      label: "Do",
      description: "Koniec obdobia prehľadu.",
      placeholder: "Dnes",
    },
    response: {
      rows: "Riadky prehľadu",
      row: {
        direction: "Druh dokladu",
        rate: "Sadzba dane",
        taxableAmount: "Základ dane",
        taxAmount: "Suma dane",
      },
    },
    success: {
      title: "Daňový prehľad je pripravený",
      description: "Daňový prehľad sa načítal.",
    },
    errors: {
      validation: {
        title: "Neplatné údaje",
        description:
          "Zvoľte dátum ukončenia, ktorý nepredchádza dátumu začiatku.",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Prihláste sa.",
      },
      forbidden: {
        title: "Vyžaduje sa prístup k daňovému výkazu",
        description: "Nemáte oprávnenie zobraziť daňový výkaz tejto firmy.",
      },
      notFound: { title: "Nenašlo sa", description: "Firma sa nenašla" },
      conflict: { title: "Konflikt", description: "Údaje sú v rozpore." },
      server: {
        title: "Chyba servera",
        description: "Vyskytla sa interná chyba.",
      },
      network: {
        title: "Chyba siete",
        description: "Skontrolujte pripojenie a skúste to znova.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
  },

  enums: {
    reportDirection: {
      nonDeductible: "Neodpočítateľná DPH z nákupov",
      reverseCharge: "Splatná DPH pri prenesení daňovej povinnosti",
      posSales: "Pokladničné predaje",
      sales: "Vystavené faktúry",
      creditNotes: "Vystavené dobropisy",
      purchases: "Prijaté faktúry",
    },
    taxType: {
      vat: "DPH",
      gst: "Daň z tovarov a služieb (GST)",
      sales: "Daň z predaja",
      withholding: "Zrážková daň",
      none: "Bez dane alebo oslobodené od dane",
    },
  },

  tags: {
    tax: "daň",
    rate: "sadzba",
    create: "vytvoriť",
    list: "zoznam",
    update: "upraviť",
    delete: "deaktivovať",
    report: "prehľad",
  },
};
