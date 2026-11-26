import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    productType: {
      service: "Služba",
      physical: "Fyzický tovar",
      digital: "Digitálny produkt",
    },
  },
  tags: {
    products: "Produkty",
    catalog: "Katalóg",
    update: "Aktualizovať",
  },
  patch: {
    title: "Upraviť produkt",
    titleShort: "Upraviť produkt",
    description: "Upraviť údaje existujúceho produktu v katalógu.",
    productId: {
      label: "ID produktu",
      description: "ID produktu, ktorý chcete upraviť",
    },
    name: {
      label: "Názov produktu",
      description: "Nový názov produktu",
      placeholder: "Balík návrhu webu",
    },
    productDescription: {
      label: "Opis",
      description: "Nový opis produktu",
      placeholder: "Kompletný návrh webu s najviac 5 stránkami",
    },
    sku: {
      label: "SKU",
      description: "Nový interný kód produktu (SKU)",
      placeholder: "WD-001",
    },
    type: {
      label: "Typ produktu",
      description: "Nový typ produktu",
      placeholder: "Vyberte typ",
    },
    unit: {
      label: "Merná jednotka",
      description: "Nová fakturačná jednotka",
      placeholder: "hodina",
    },
    basePrice: {
      label: "Základná cena",
      description: "Nová základná cena",
      placeholder: "150.00",
    },
    currency: {
      label: "Mena",
      description: "Nový trojpísmenový kód meny podľa ISO",
      placeholder: "EUR",
    },
    defaultTaxRate: {
      label: "Predvolená sadzba dane",
      description: "Nová predvolená sadzba dane ako desatinné číslo",
      placeholder: "0.19",
    },
    categoryId: {
      label: "Kategória",
      description: "Nová kategória produktu",
    },
    imageUrl: {
      label: "Adresa URL obrázka",
      description: "Nová adresa URL obrázka produktu",
      placeholder: "https://example.com/product.jpg",
    },
    isActive: {
      label: "Aktívne",
      description: "Určuje, či je produkt dostupný v katalógu",
    },
    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "Skontrolujte polia a skúste to znova",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na úpravu produktu sa prihláste",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie upraviť tento produkt",
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
      title: "Produkt upravený",
      description: "Údaje produktu sa uložili.",
    },
    response: {
      id: "ID produktu",
      name: "Názov produktu",
    },
    widget: {
      catalogCompany: "Firma priradená ku katalógu",
      billingCadence: "Interval fakturácie",
      oneTime: "Jednorazový nákup",
      personalCatalog: "Osobný katalóg",
      companyUnavailable: "Názov firmy nie je dostupný",
      couldNotLoad: "Produkt sa nepodarilo načítať.",
      retry: "Skúsiť znova",
      backToList: "Späť na produkty",
      back: "Späť",
    },
  },
};
