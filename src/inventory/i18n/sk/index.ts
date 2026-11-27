import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Skladové hospodárstvo",
  shared: {
    errors: {
      failedToRecordMovement: "Pohyb zásob sa nepodarilo zaznamenať",
      failedToApplyMovement: "Pohyb zásob sa nepodarilo vykonať",
    },
  },
  tags: {
    cancel: "Zrušiť",
    inventory: "Skladové hospodárstvo",
    warehouse: "Sklad",
    stock: "Zásoby",
    transfer: "Presun",
    create: "Vytvoriť",
    list: "Zoznam",
    get: "Načítať",
    update: "Aktualizovať",
    adjust: "Upraviť",
    receive: "Prijať",
    issue: "Vydať",
    dispatch: "Expedovať",
  },
  endpointCategories: {
    inventory: "Skladové hospodárstvo",
    warehouses: "Sklady",
    stock: "Stav zásob",
    transfers: "Presuny",
  },
  enums: {
    movementType: {
      receipt: "Príjem zásob",
      issue: "Výdaj zásob",
      transferIn: "Príjem z presunu",
      transferOut: "Výdaj na presun",
      adjustment: "Korekcia množstva",
      sale: "Predaj",
      return: "Vrátenie zásob",
    },
    transferStatus: {
      draft: "Koncept",
      inTransit: "Na ceste",
      received: "Prijaté",
      cancelled: "Zrušené",
    },
    negativeStockPolicy: {
      block: "Blokovať záporný stav",
      warn: "Povoliť s upozornením",
      allow: "Povoliť záporný stav",
    },
  },
  warehouseCreate: {
    post: {
      title: "Vytvoriť sklad",
      titleShort: "Nový sklad",
      description: "Zaregistrovať nový sklad pre firmu.",
      widget: {
        openWarehouse: "Otvoriť sklad",
        createAnother: "Vytvoriť ďalší",
        backToList: "Späť na zoznam skladov",
        active: "Aktívny",
        inactive: "Neaktívny",
        default: "Predvolený",
      },
      companyId: {
        label: "Firma",
        description: "Firma, ktorej sklad patrí",
      },
      name: {
        label: "Názov skladu",
        description: "Úplný názov skladu",
        placeholder: "Hlavný sklad",
      },
      code: {
        label: "Kód",
        description: "Krátky identifikátor (napr. WH-01)",
        placeholder: "WH-01",
      },
      address: {
        label: "Adresa",
        description: "Adresa skladu",
        placeholder: "Skladová 123",
      },
      isActive: {
        label: "Aktívny sklad",
        description: "Určuje, či je sklad v prevádzke",
      },
      isDefault: {
        label: "Predvolený sklad",
        description: "Nastaviť ako predvolený sklad firmy",
      },
      negativeStockPolicy: {
        label: "Pravidlo záporného stavu",
        description:
          "Správanie pri predaji na pokladnici a výdaji zo skladu pri nedostatku zásob",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte, či ste vyplnili povinné polia.",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na vytváranie skladov sa prihláste",
        },
        forbidden: {
          title: "Vyžaduje sa oprávnenie správcu",
          description: "Sklady môžu vytvárať iba správcovia",
        },
        conflict: {
          title: "Kód už existuje",
          description: "Sklad s týmto kódom už existuje",
        },
        server: {
          title: "Chyba servera",
          description: "Sklad sa nepodarilo vytvoriť. Skúste to znova.",
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
          title: "Firma sa nenašla",
          description: "Firma sa nenašla",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Sklad vytvorený",
        description: "Sklad bol úspešne zaregistrovaný",
      },
      response: {
        id: "ID skladu",
        name: "Názov skladu",
        code: "Kód",
        companyId: "ID firmy",
        isActive: "Aktívny",
        isDefault: "Predvolený",
        negativeStockPolicy: "Pravidlo záporného stavu",
      },
    },
  },
  warehouseList: {
    get: {
      title: "Sklady",
      titleShort: "Sklady",
      description: "Zobraziť všetky sklady firmy.",
      widget: {
        subtitle: "Tu sú vaše zásoby. Otvorte sklad a uvidíte stav a hodnotu.",
        status: "Stav",
        active: "Aktívny",
        inactive: "Neaktívny",
        default: "Predvolený",
        total: "celkom",
        createWarehouse: "Nový sklad",
        empty: "Zatiaľ žiadne sklady.",
        emptyHint: "Vytvorte prvý sklad a začnite evidovať zásoby.",
        emptyIcon: "🏭",
        back: "Späť",
        loading: "Načítavajú sa sklady…",
        load: "Načítať",
        viewStock: "Zobraziť zásoby",
        selectCompany: "Zadajte ID firmy, ktorej sklady chcete načítať.",
      },
      companyId: {
        label: "Firma",
        description: "Firma, ktorej sklady sa majú zobraziť",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte, či ste vyplnili povinné polia.",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na zobrazenie skladov sa prihláste",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tejto firme nemáte prístup",
        },
        conflict: {
          title: "Konflikt",
          description: "Konflikt údajov",
        },
        server: {
          title: "Chyba servera",
          description: "Sklady sa nepodarilo načítať",
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
          title: "Firma sa nenašla",
          description: "Firma sa nenašla",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Sklady načítané",
        description: "Načítal sa zoznam skladov",
      },
      response: {
        id: "ID skladu",
        name: "Názov",
        code: "Kód",
        address: "Adresa",
        isActive: "Aktívny",
        isDefault: "Predvolený",
        createdAt: "Čas vytvorenia",
      },
    },
  },
  warehouseGet: {
    get: {
      title: "Načítať sklad",
      titleShort: "Sklad",
      description: "Načítať podrobnosti konkrétneho skladu.",
      widget: {
        companyName: "Spoločnosť",
        stockedProducts: "Produkty na sklade",
        companyInventory: "Prehľad zásob spoločnosti",
        missingValuation: "Chýba obstarávacia cena",
        details: "Údaje o sklade",
        related: "Zásoby",
        backToList: "Späť na zoznam skladov",
        back: "Späť",
        edit: "Upraviť sklad",
        viewStock: "Zobraziť zásoby",
        select: "Vyberte sklad",
      },
      warehouseId: {
        label: "Sklad",
        description: "Sklad, ktorého podrobnosti chcete načítať",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Neplatné ID skladu",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na zobrazenie skladov sa prihláste",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tomuto skladu nemáte prístup",
        },
        conflict: {
          title: "Konflikt",
          description: "Konflikt údajov",
        },
        server: {
          title: "Chyba servera",
          description: "Sklad sa nepodarilo načítať",
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
          title: "Sklad sa nenašiel",
          description: "Sklad neexistuje",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Sklad načítaný",
        description: "Načítali sa podrobnosti skladu",
      },
      response: {
        id: "ID skladu",
        companyId: "ID firmy",
        name: "Názov",
        code: "Kód",
        address: "Adresa",
        isActive: "Aktívny",
        isDefault: "Predvolený",
        negativeStockPolicy: "Pravidlo záporného stavu",
        createdAt: "Čas vytvorenia",
        updatedAt: "Čas aktualizácie",
      },
    },
  },
  warehouseUpdate: {
    patch: {
      title: "Upraviť sklad",
      titleShort: "Upraviť sklad",
      description: "Upraviť podrobnosti skladu.",
      widget: {
        backToWarehouse: "Späť na podrobnosti skladu",
        active: "Aktívny",
        inactive: "Neaktívny",
      },
      warehouseId: {
        label: "Sklad",
        description: "Sklad, ktorý chcete upraviť",
      },
      name: {
        label: "Názov skladu",
        description: "Úplný názov skladu",
        placeholder: "Hlavný sklad",
      },
      code: {
        label: "Kód",
        description: "Krátky identifikátor",
        placeholder: "WH-01",
      },
      address: {
        label: "Adresa",
        description: "Adresa skladu",
        placeholder: "Skladová 123",
      },
      isActive: {
        label: "Aktívny sklad",
        description: "Určuje, či je sklad v prevádzke",
      },
      isDefault: {
        label: "Predvolený sklad",
        description: "Nastaviť ako predvolený sklad",
      },
      negativeStockPolicy: {
        label: "Pravidlo záporného stavu",
        description:
          "Správanie pri predaji na pokladnici a výdaji zo skladu pri nedostatku zásob",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte, či ste vyplnili povinné polia.",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na úpravu skladov sa prihláste",
        },
        forbidden: {
          title: "Vyžaduje sa oprávnenie správcu",
          description: "Sklady môžu upravovať iba správcovia",
        },
        conflict: {
          title: "Kód skladu už existuje",
          description: "Tento kód skladu sa už používa",
        },
        server: {
          title: "Chyba servera",
          description: "Sklad sa nepodarilo uložiť",
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
          title: "Sklad sa nenašiel",
          description: "Sklad neexistuje",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Sklad upravený",
        description: "Sklad bol uložený",
      },
      response: {
        id: "ID skladu",
        name: "Názov",
        code: "Kód",
        isActive: "Aktívny",
        isDefault: "Predvolený",
        negativeStockPolicy: "Pravidlo záporného stavu",
      },
    },
  },
  stockList: {
    get: {
      title: "Stav zásob",
      titleShort: "Stav zásob",
      description:
        "Zobraziť stav zásob v sklade vrátane dostupného množstva a upozornení na nízke zásoby.",
      widget: {
        unnamedProduct: "Produkt bez dostupného názvu",
        search: "Vyhľadať produkt alebo sklad",
        stockStatus: "Stav zásob",
        actions: "Akcie",
        noMatches: "Vyhľadávaniu nezodpovedá žiadna skladová položka.",
        loadMore: "Zobraziť viac",
        back: "Späť",
        defaultLowStockRule:
          "Nízky stav pri menej ako {{threshold}} dostupných jednotkách",
        reorderPointRule:
          "Nízky stav pri najviac {{threshold}} dostupných jednotkách",
        stockValuePrecision:
          "Hodnota zásob je množstvo na sklade × nezaokrúhlený jednotkový náklad. Zobrazené náklady sú zaokrúhlené na dve desatinné miesta.",
        lowStock: "Nízky stav zásob",
        available: "Dostupné množstvo",
        onHand: "Na sklade",
        reserved: "Rezervované",
        onOrder: "Objednané",
        reorderPoint: "Hranica doobjednania",
        empty: "Zatiaľ tu nie sú žiadne skladové položky.",
        emptyHint: "Po zaevidovaní príjmu do skladu tu uvidíte stav zásob.",
        emptyIcon: "📦",
        loading: "Načítava sa stav zásob…",
        filterProduct: "Filtrovať podľa produktu",
        load: "Načítať",
        selectWarehouse: "Ak chcete zobraziť stav zásob, zadajte ID skladu.",
        total: "celkom",
        adjust: "Upraviť množstvo",
        transfer: "Presun",
        outOfStock: "bez zásob",
        belowReorderPoint: "pod hranicou doobjednania",
        bulletSeparator: "·",
        stockValue: "Hodnota zásob",
        statusOk: "Na sklade",
      },
      warehouseId: {
        label: "Sklad",
        description: "Sklad, ktorého zásoby sa majú načítať",
      },
      productId: {
        label: "Produkt",
        description: "Zobraziť zásoby len pre vybraný produkt (nepovinné)",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte, či ste vyplnili povinné polia.",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na zobrazenie zásob sa prihláste",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tomuto skladu nemáte prístup",
        },
        conflict: {
          title: "Konflikt",
          description: "Konflikt údajov",
        },
        server: {
          title: "Chyba servera",
          description: "Stav zásob sa nepodarilo načítať",
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
          title: "Sklad sa nenašiel",
          description: "Sklad neexistuje",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Zásoby načítané",
        description: "Stav zásob sa načítal",
      },
      response: {
        currency: "Mena",
        id: "ID skladovej položky",
        warehouseId: "ID skladu",
        warehouseName: "Sklad",
        productId: "ID produktu",
        productName: "Produkt",
        quantityOnHand: "Na sklade",
        quantityReserved: "Rezervované",
        quantityOnOrder: "Objednané",
        quantityAvailable: "Disponibilné množstvo",
        reorderPoint: "Hranica doobjednania",
        reorderQuantity: "Objednávacie množstvo",
        unitCost: "Jednotková obstarávacia cena",
        isLowStock: "Nízky stav zásob",
        updatedAt: "Posledná aktualizácia",
      },
    },
  },
  stockWrite: {
    onHandNow: "Teraz na sklade:",
    viewStock: "Zobraziť zásoby",
    again: "Zapísať ďalší",
  },
  stockAdjust: {
    post: {
      title: "Upraviť stav zásob",
      titleShort: "Upraviť stav zásob",
      description:
        "Ručne upraviť množstvo zásob. Pri odpise zadajte záporné množstvo.",
      widget: {
        backToStock: "Späť na stav zásob",
        reserved: "Rezervované",
        preview: "Náhľad",
        quantityChange: "Zmena množstva",
        positiveHint: "Kladné množstvo zvýši stav zásob",
        negativeHint: "Záporné množstvo zníži stav zásob",
      },
      warehouseId: {
        label: "Sklad",
        description: "Sklad, v ktorom sa upraví množstvo zásob",
      },
      productId: {
        label: "Produkt",
        description: "Produkt, ktorého množstvo chcete upraviť",
      },
      quantity: {
        label: "Množstvo",
        description:
          "Zadajte kladné množstvo pri pridaní a záporné pri odobratí zásob.",
        placeholder: "10",
      },
      reason: {
        label: "Dôvod",
        description: "Dôvod korekcie množstva zásob",
        placeholder: "Korekcia podľa inventúry",
      },
      unitCost: {
        label: "Jednotková obstarávacia cena",
        description: "Obstarávacia cena za jednotku (nepovinná)",
        placeholder: "0.00",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte, či ste vyplnili povinné polia.",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na úpravu zásob sa prihláste",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tomuto skladu nemáte prístup",
        },
        conflict: {
          title: "Nedostatok zásob",
          description: "Na túto úpravu nie je k dispozícii dostatok zásob",
        },
        server: {
          title: "Chyba servera",
          description: "Stav zásob sa nepodarilo upraviť",
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
          title: "Sklad alebo produkt sa nenašiel",
          description: "Sklad alebo produkt sa nenašiel",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Stav zásob upravený",
        description: "Korekcia množstva zásob sa zaznamenala",
      },
      response: {
        movementId: "ID pohybu zásob",
        productId: "ID produktu",
        warehouseId: "ID skladu",
        quantityOnHand: "Nové množstvo na sklade",
        quantityAvailable: "Dostupné",
      },
    },
  },
  stockReceive: {
    post: {
      title: "Prijať zásoby",
      titleShort: "Prijať zásoby",
      description:
        "Zaznamenať príjem zásob. Prepočíta sa množstvo na sklade aj vážená priemerná obstarávacia cena.",
      widget: {
        backToStock: "Späť na stav zásob",
      },
      warehouseId: {
        label: "Sklad",
        description: "Sklad, ktorý zásoby prijíma",
      },
      productId: {
        label: "Produkt",
        description: "Produkt, ktorý prijímate na sklad",
      },
      quantity: {
        label: "Množstvo",
        description: "Počet prijatých jednotiek",
        placeholder: "100",
      },
      unitCost: {
        label: "Jednotková obstarávacia cena",
        description: "Obstarávacia cena za prijatú jednotku",
        placeholder: "0.00",
      },
      reference: {
        label: "Referenčné číslo",
        description: "Číslo nákupnej objednávky alebo dodacieho listu",
        placeholder: "PO-2024-001",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte, či ste vyplnili povinné polia.",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na príjem zásob sa prihláste",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tomuto skladu nemáte prístup",
        },
        conflict: {
          title: "Konflikt",
          description: "Konflikt údajov",
        },
        server: {
          title: "Chyba servera",
          description: "Príjem zásob sa nepodarilo zaznamenať",
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
          title: "Sklad alebo produkt sa nenašiel",
          description: "Sklad alebo produkt sa nenašiel",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Zásoby prijaté",
        description: "Príjem zásob bol zaznamenaný",
      },
      response: {
        movementId: "ID pohybu zásob",
        productId: "ID produktu",
        warehouseId: "ID skladu",
        quantityOnHand: "Nové množstvo na sklade",
        unitCost: "Nová jednotková obstarávacia cena",
      },
    },
  },
  stockIssue: {
    post: {
      title: "Vydať zásoby",
      titleShort: "Vydať zásoby",
      description:
        "Vydať zásoby zo skladu. Pred výdajom sa overí dostupné množstvo.",
      widget: {
        backToStock: "Späť na stav zásob",
      },
      warehouseId: {
        label: "Sklad",
        description: "Sklad, z ktorého sa vydávajú zásoby",
      },
      productId: {
        label: "Produkt",
        description: "Produkt, ktorý vydávate zo skladu",
      },
      quantity: {
        label: "Množstvo",
        description: "Počet jednotiek na výdaj",
        placeholder: "10",
      },
      reference: {
        label: "Referenčné číslo",
        description: "Číslo pracovného príkazu, zákazky alebo iného dokladu",
        placeholder: "WO-2024-001",
      },
      unitCost: {
        label: "Jednotková obstarávacia cena",
        description:
          "Obstarávacia cena za jednotku. Ak ju nezadáte, použije sa aktuálna vážená priemerná cena.",
        placeholder: "0.00",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte, či ste vyplnili povinné polia.",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na výdaj zásob sa prihláste",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tomuto skladu nemáte prístup",
        },
        conflict: {
          title: "Nedostatok zásob",
          description: "Na výdaj nie je k dispozícii dostatok zásob",
        },
        server: {
          title: "Chyba servera",
          description: "Zásoby sa nepodarilo vydať",
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
          title: "Sklad alebo produkt sa nenašiel",
          description: "Sklad alebo produkt sa nenašiel",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Zásoby vydané",
        description: "Výdaj zásob bol zaznamenaný",
      },
      response: {
        movementId: "ID pohybu zásob",
        productId: "ID produktu",
        warehouseId: "ID skladu",
        quantityOnHand: "Nové množstvo na sklade",
        quantityAvailable: "Dostupné",
      },
    },
  },
  transferCreate: {
    post: {
      title: "Vytvoriť presun zásob",
      titleShort: "Nový presun",
      description:
        "Vytvoriť požiadavku na presun medzi skladmi. Presun začína v stave Koncept.",
      widget: {
        itemsTitle: "Položky na presun",
        pickSource: "Vyberte zdrojový sklad a uvidíte jeho zásoby.",
        noStock: "Tento sklad nemá žiadne zásoby na presun.",
        available: "Dostupné: {{quantity}}",
        itemsRequired: "Zadajte množstvo aspoň pre jeden produkt.",
        backToList: "Späť na zoznam presunov",
        viewTransfer: "Zobraziť presun",
        browseWarehouses: "Zobraziť sklady",
      },
      companyId: {
        label: "Firma",
        description: "Firma, ktorej presun patrí",
      },
      fromWarehouseId: {
        label: "Zdrojový sklad",
        description: "Sklad, z ktorého sa zásoby presúvajú",
      },
      toWarehouseId: {
        label: "Cieľový sklad",
        description: "Sklad, do ktorého sa zásoby presúvajú",
      },
      reference: {
        label: "Referenčné číslo",
        description: "Referenčné číslo presunu",
        placeholder: "TR-2024-001",
      },
      notes: {
        label: "Poznámky",
        description: "Doplňujúce informácie o presune",
        placeholder: "Sezónne doplnenie zásob",
      },
      items: {
        label: "Položky",
        description: "Produkty a množstvá, ktoré chcete presunúť",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte, či ste vyplnili povinné polia.",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na vytváranie presunov sa prihláste",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Žiadny prístup k tejto spoločnosti",
        },
        conflict: {
          invalidWarehouses:
            "Oba sklady musia byť aktívne a patriť tejto firme.",
          invalidItems:
            "Každý produkt len raz, s množstvom nad nulou (najviac 4 desatinné miesta).",
          title: "Rovnaký sklad",
          description: "Zdrojový a cieľový sklad musia byť rôzne",
        },
        server: {
          title: "Chyba servera",
          description: "Presun sa nepodarilo vytvoriť",
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
          title: "Sklad sa nenašiel",
          description: "Sklad sa nenašiel",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Presun vytvorený",
        description: "Presun bol vytvorený ako koncept",
      },
      response: {
        id: "ID presunu",
        status: "Stav",
        reference: "Referenčné číslo",
        fromWarehouseId: "Zdrojový sklad",
        toWarehouseId: "Cieľový sklad",
      },
    },
  },
  transferList: {
    get: {
      title: "Presuny",
      titleShort: "Presuny",
      description: "Zobraziť presuny medzi skladmi firmy.",
      widget: {
        back: "Späť",
        newTransfer: "Nový presun",
        empty: "Zatiaľ žiadne presuny.",
        emptyHint: "Vytvorte presun zásob medzi skladmi.",
        emptyIcon: "🔄",
        loading: "Načítavajú sa presuny…",
        load: "Načítať",
        selectCompany: "Zadajte ID firmy, ktorej presuny chcete načítať.",
        total: "celkom",
        view: "Zobraziť",
        draft: "Koncept",
        inTransit: "Na ceste",
        viewTransfer: "Zobraziť presun",
        tabAll: "Všetky",
        tabDraft: "Rozpracované",
        tabInTransit: "Na ceste",
        tabReceived: "Dokončené",
        tabCancelled: "Zrušené",
        arrowSeparator: "→",
      },
      companyId: {
        label: "Firma",
        description: "Firma, ktorej presuny chcete zobraziť",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte, či ste vyplnili povinné polia.",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na zobrazenie zoznamu presunov sa prihláste",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tejto firme nemáte prístup",
        },
        conflict: {
          title: "Konflikt",
          description: "Konflikt údajov",
        },
        server: {
          title: "Chyba servera",
          description: "Presuny sa nepodarilo načítať",
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
          title: "Firma sa nenašla",
          description: "Firma sa nenašla",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Presuny načítané",
        description: "Načítal sa zoznam presunov medzi skladmi",
      },
      response: {
        id: "ID presunu",
        fromWarehouseId: "ID zdrojového skladu",
        fromWarehouseName: "Zdrojový sklad",
        toWarehouseId: "ID cieľového skladu",
        toWarehouseName: "Cieľový sklad",
        status: "Stav",
        reference: "Referenčné číslo",
        createdAt: "Čas vytvorenia",
        completedAt: "Čas dokončenia",
      },
    },
  },
  transferGet: {
    get: {
      title: "Načítať podrobnosti presunu",
      titleShort: "Presun",
      description: "Načítať podrobnosti presunu vrátane všetkých položiek.",
      widget: {
        cancel: "Zrušiť presun",
        retry: "Skúsiť znova",
        noItems: "Tento presun neobsahuje žiadne položky.",
        noItemsHint:
          "Produkty na presun pridáte pri vytváraní presunu. Presun bez položiek sa nedá odoslať.",
        receivedOf: "Prijaté {{received}} z {{requested}}",
        newTransfer: "Nový presun",
        back: "Späť",
        dispatch: "Expedovať presun",
        receive: "Označiť ako prijatý",
        status: "Stav",
        select: "Vyberte presun",
      },
      transferId: {
        label: "Presun",
        description: "Presun, ktorý chcete načítať",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Neplatné ID presunu",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na zobrazenie presunu sa prihláste",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tomuto presunu nemáte prístup",
        },
        conflict: {
          title: "Konflikt",
          description: "Konflikt údajov",
        },
        server: {
          title: "Chyba servera",
          description: "Presun sa nepodarilo načítať",
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
          title: "Presun sa nenašiel",
          description: "Presun neexistuje",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Presun načítaný",
        description: "Načítali sa podrobnosti presunu",
      },
      response: {
        id: "ID presunu",
        companyId: "ID firmy",
        fromWarehouseId: "Zdrojový sklad",
        fromWarehouseName: "Zdrojový sklad",
        toWarehouseId: "Cieľový sklad",
        toWarehouseName: "Cieľový sklad",
        status: "Stav",
        reference: "Referenčné číslo",
        notes: "Poznámky",
        createdAt: "Vytvorené",
        completedAt: "Dokončené",
        items: "Položky",
        itemId: "ID položky",
        productId: "ID produktu",
        productName: "Produkt",
        quantityRequested: "Požadované množstvo",
        quantityReceived: "Prijaté",
      },
    },
  },
  transferCancel: {
    post: {
      title: "Zrušiť presun",
      titleShort: "Zrušiť presun",
      description:
        "Zastaví tento presun. Odoslaný tovar sa vráti do zdrojového skladu.",
      widget: {
        backToTransfer: "Späť na presun",
      },
      transferId: {
        label: "Presun",
        description: "Presun na zrušenie",
      },
      errors: {
        validation: {
          title: "Chyba overenia",
          description: "Neplatný presun",
        },
        unauthorized: {
          title: "Nie ste prihlásený",
          description: "Prihláste sa, ak chcete rušiť presuny",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tomuto presunu nemáte prístup",
        },
        conflict: {
          title: "Nedá sa zrušiť",
          description: "Zrušiť sa dajú len koncepty a presuny na ceste",
        },
        server: {
          title: "Chyba servera",
          description: "Presun sa nepodarilo zrušiť",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
        network: {
          title: "Chyba siete",
          description: "Skontrolujte pripojenie a skúste to znova",
        },
        notFound: {
          title: "Presun sa nenašiel",
          description: "Tento presun neexistuje",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Presun zrušený",
        description: "Z tohto presunu už nič nie je na ceste.",
      },
      response: {
        id: "Presun",
        status: "Stav",
      },
    },
  },
  transferDispatch: {
    post: {
      title: "Expedovať presun",
      titleShort: "Expedovať",
      description:
        "Označiť presun ako Na ceste a vydať zásoby zo zdrojového skladu.",
      widget: {
        backToTransfer: "Späť na podrobnosti presunu",
      },
      transferId: {
        label: "Presun",
        description: "Presun, ktorý chcete expedovať",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Neplatné ID presunu",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na expedovanie presunov sa prihláste",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tomuto presunu nemáte prístup",
        },
        conflict: {
          insufficientStock:
            "Zdrojový sklad nemá dosť zásob pre všetky položky.",
          title: "Presun nie je v stave Koncept",
          description: "Expedovať možno iba presuny v stave Koncept",
        },
        server: {
          title: "Chyba servera",
          description: "Presun sa nepodarilo expedovať",
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
          title: "Presun sa nenašiel",
          description: "Presun neexistuje",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Presun expedovaný",
        description: "Presun je na ceste",
      },
      response: {
        id: "ID presunu",
        status: "Stav",
      },
    },
  },
  transferReceive: {
    post: {
      title: "Prijať presun",
      titleShort: "Prijať presun",
      description:
        "Označiť presun ako prijatý. Zaznamenajú sa skladové pohyby a aktualizuje sa stav zásob v oboch skladoch.",
      widget: {
        backToTransfer: "Späť na podrobnosti presunu",
      },
      transferId: {
        label: "Presun",
        description: "Presun, ktorý chcete prijať",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Neplatné ID presunu",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na príjem presunov sa prihláste",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tomuto presunu nemáte prístup",
        },
        conflict: {
          title: "Presun nie je na ceste",
          description: "Prijať možno iba presuny, ktoré sú na ceste",
        },
        server: {
          title: "Chyba servera",
          description: "Presun sa nepodarilo prijať",
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
          title: "Presun sa nenašiel",
          description: "Presun neexistuje",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Presun prijatý",
        description:
          "Skladové pohyby sa zaznamenali a stav zásob sa aktualizoval",
      },
      response: {
        id: "ID presunu",
        status: "Stav",
        completedAt: "Čas dokončenia",
      },
    },
  },
  dashboard: {
    get: {
      title: "Prehľad zásob",
      titleShort: "Prehľad",
      description:
        "Aktuálny prehľad zásob, nedokončených presunov a počtu skladov.",
      widget: {
        noWarehousesHint:
          "Vytvorte sklad a začnite prijímať a presúvať zásoby.",
        navStockLevelsHint: "Množstvá, hodnota a body objednania",
        navTransfersHint: "Na ceste: {{count}}",
        navWarehousesHint: "Lokality: {{count}}",
        noWarehouses: "Zatiaľ žiadne sklady",
        related: "Súvisiace",
        kpiInStock: "Na sklade",
        kpiOutOfStock: "Bez zásob",
        kpiLowStock: "Nízka zásoba",
        kpiWarehouses: "Sklady",
        attention: "Zásoby na doplnenie",
        noAttention: "Žiadna položka nie je pod hranicou doobjednania.",
        newPurchaseOrder: "Nová nákupná objednávka",
        kpiTransfersInTransit: "Presuny na ceste",
        alertOutOfStock: "{{count}} produkt bez zásob",
        alertOutOfStockPlural: "Počet produktov bez zásob: {{count}}",
        navStockLevels: "Stav zásob",
        navTransfers: "Presuny medzi skladmi",
        navWarehouses: "Sklady",
        loading: "Načítava sa…",
        pendingTransfers: "{{count}} presun na ceste",
        pendingTransfersPlural: "Počet presunov na ceste: {{count}}",
      },
      companyId: {
        label: "Firma",
        description: "Firma, ktorej stav zásob chcete zobraziť (nepovinné)",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Skontrolujte, či ste vyplnili povinné polia.",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na zobrazenie prehľadu zásob sa prihláste",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "K tejto firme nemáte prístup.",
        },
        conflict: {
          title: "Konflikt údajov",
          description:
            "Požadovaná operácia je v konflikte s existujúcimi údajmi.",
        },
        server: {
          title: "Chyba servera",
          description: "Prehľad zásob sa nepodarilo načítať",
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
        title: "Prehľad zásob načítaný",
        description: "Prehľad zásob sa načítal",
      },
      response: {
        inStockCount: "Na sklade",
        outOfStockCount: "Vypredané",
        lowStockCount: "Nízka zásoba",
        pendingTransferCount: "Nedokončené presuny",
        warehouseCount: "Sklady",
      },
    },
  },
};
