import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    products: "Produkty",
    catalog: "Katalóg",
    get: "Načítať",
  },
  get: {
    title: "Načítať produkt z katalógu",
    titleShort: "Podrobnosti produktu",
    description: "Načítať produkt z katalógu podľa ID.",
    productId: {
      label: "ID produktu",
      description: "ID produktu na načítanie",
    },
    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "Skontrolujte ID produktu a skúste to znova",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na zobrazenie podrobností produktu sa prihláste",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie zobraziť tento produkt",
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
        description: "Produkt sa nenašiel",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Produkt načítaný",
      description: "Podrobnosti produktu sa načítali.",
    },
    response: {
      id: "ID produktu",
      companyId: "Firma",
      name: "Názov produktu",
      description: "Opis",
      sku: "SKU",
      type: "Typ",
      unit: "Merná jednotka",
      basePrice: "Základná cena",
      currency: "Mena",
      defaultTaxRate: "Predvolená sadzba dane",
      categoryId: "Kategória",
      imageUrl: "Adresa URL obrázka",
      isActive: "Aktívne",
      isSubscription: "Predplatné",
      billingInterval: "Interval fakturácie",
      createdAt: "Vytvorené",
      updatedAt: "Aktualizované",
    },
    widget: {
      unavailable: "Produkt nie je dostupný",
      prices: "Aktívne cenové úrovne",
      stock: "Sklad",
      viewStock: "Zobrazte stav zásob",
      offers: "Ponuky poskytovateľov platieb",
      noOffers: "S týmto produktom nie je prepojená žiadna aktívna ponuka.",
      configureOffer: "Nastavte platobnú ponuku",
      offerNeedsSku:
        "Aktivujte produkt a doplňte SKU, aby ste mohli nastaviť ponuku.",
      revenueAccount: "Výnosový účet",
      liabilityAccount: "Účet výnosov budúcich období",
      edit: "Upraviť",
      deactivate: "Deaktivovať",
      activate: "Aktivovať",
      active: "Aktívne",
      inactive: "Neaktívne",
      back: "Späť",
      loading: "Načítava sa produkt…",
      typeService: "Služba",
      typePhysical: "Fyzický tovar",
      typeDigital: "Digitálny produkt",
      recurring: "Opakované platby",
      billingMonthly: "Mesačne",
      billingYearly: "Ročne",
      addToInvoice: "Pridať na faktúru",
      details: "Podrobnosti",
      select: "Vyberte produkt",
    },
  },
};
