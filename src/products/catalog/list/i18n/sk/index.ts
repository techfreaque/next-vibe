import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    products: "Produkty",
    catalog: "Katalóg",
    list: "Zoznam",
  },
  enums: {
    productType: {
      service: "Služba",
      physical: "Fyzický tovar",
      digital: "Digitálny produkt",
    },
  },
  get: {
    title: "Produkty",
    titleShort: "Produkty",
    description:
      "Načítať všetky produkty z katalógu. Filtrovať možno podľa firmy, kategórie, typu alebo stavu aktivity.",
    companyId: {
      label: "ID firmy",
      description: "Filtrovať produkty podľa tejto firmy",
    },
    categoryId: {
      label: "ID kategórie",
      description: "Filtrovať produkty podľa tejto kategórie",
    },
    type: {
      label: "Typ produktu",
      description:
        "Filtrovať podľa služby, fyzického tovaru alebo digitálneho produktu",
      placeholder: "Všetky typy",
    },
    isActive: {
      label: "Iba aktívne",
      description: "Zobraziť iba aktívne produkty",
    },
    page: {
      label: "Strana",
      description: "Číslo strany (od 1)",
    },
    pageSize: {
      label: "Na stranu",
      description: "Počet výsledkov na stranu (najviac 100)",
    },
    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "Skontrolujte nastavenie filtrov a skúste to znova",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na zobrazenie katalógu sa prihláste",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie zobraziť tento katalóg",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt",
      },
      server: {
        title: "Chyba servera",
        description: "Na našej strane nastala chyba. Skúste to znova.",
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
        description: "Nenašli sa žiadne produkty",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Produkty načítané",
      description: "Produkty z katalógu sú uvedené nižšie.",
    },
    response: {
      id: "ID produktu",
      name: "Názov produktu",
      type: "Typ",
      sku: "SKU",
      basePrice: "Základná cena",
      currency: "Mena",
      unit: "Merná jednotka",
      isActive: "Aktívny",
      isSubscription: "Predplatné",
      billingInterval: "Interval fakturácie",
      categoryId: "Kategória",
      createdAt: "Vytvorené",
      total: "Spolu",
    },
    widget: {
      checkout: "Ponuky predávané platformou",
      checkoutHint:
        "Skontrolujte programy a balíky s cenami pre tento trh. Ak chcete prepojiť predaj s účtovníctvom, vyberte nižšie firemný produkt a nastavte jeho platobnú ponuku.",
      checkoutReference: "Identifikátor ponuky",
      checkoutCredits: "Kredity v cene",
      oneTime: "Jednorazová cena",
      searchPage: "Hľadajte na tejto strane podľa názvu alebo SKU",
      noMatches: "Na tejto strane sa nenašli žiadne zodpovedajúce produkty",
      retry: "Skúste znova",
      previous: "Predchádzajúca",
      next: "Nasledujúca",
      status: "Stav",
      addProduct: "Pridať produkt",
      active: "Aktívny",
      inactive: "Neaktívny",
      empty:
        "Nenašli sa žiadne produkty. Upravte filtre alebo pridajte nový produkt.",
      columnProduct: "Produkt",
      columnTypePrice: "Typ, cena a stav",
      filterLoad: "Načítať",
      filterAllTypes: "Všetky typy",
      filterActiveOnly: "Iba aktívne",
      filterAllStatus: "Všetky stavy",
      recurring: "Opakovaná fakturácia",
      billingMonthly: "Mesačne",
      billingYearly: "Ročne",
      navCategories: "Kategórie",
      navTaxRates: "Sadzby dane",
      back: "Späť",
    },
  },
};
