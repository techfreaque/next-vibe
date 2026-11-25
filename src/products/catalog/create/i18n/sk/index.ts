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
    create: "Vytvoriť",
  },
  post: {
    title: "Vytvoriť produkt",
    titleShort: "Vytvoriť produkt",
    description: "Pridať produkt alebo službu do katalógu.",
    name: {
      label: "Názov produktu",
      description: "Názov produktu alebo služby",
      placeholder: "Balík návrhu webu",
    },
    productDescription: {
      label: "Opis",
      description: "Stručný opis toho, čo produkt alebo služba zahŕňa",
      placeholder: "Kompletný návrh webu s najviac 5 stránkami",
    },
    sku: {
      label: "SKU",
      description: "SKU, interný kód produktu",
      placeholder: "WD-001",
    },
    type: {
      label: "Typ produktu",
      description: "Vyberte službu, fyzický tovar alebo digitálny produkt",
      placeholder: "Vyberte typ",
    },
    unit: {
      label: "Merná jednotka",
      description: "Fakturačná jednotka (napr. hodina, kus, licencia)",
      placeholder: "hodina",
    },
    basePrice: {
      label: "Základná cena",
      description: "Predvolená cena vo vybranej mene",
      placeholder: "150.00",
    },
    currency: {
      label: "Mena",
      description: "Trojpísmenový kód meny podľa ISO",
      placeholder: "EUR",
    },
    defaultTaxRate: {
      label: "Predvolená sadzba dane",
      description:
        "Predvolená sadzba DPH alebo inej dane ako desatinné číslo (napr. 0.19 pre 19 %)",
      placeholder: "0.19",
    },
    companyId: {
      label: "Firma",
      description: "Priradiť tento produkt k firme",
    },
    categoryId: {
      label: "Kategória",
      description: "Kategória produktu",
    },
    imageUrl: {
      label: "Adresa URL obrázka",
      description: "Adresa URL obrázka produktu",
      placeholder: "https://example.com/product.jpg",
    },
    isSubscription: {
      label: "Produkt na predplatné",
      description: "Účtovať zákazníkom opakované platby",
    },
    billingInterval: {
      label: "Interval fakturácie",
      description: "Ako často sa zákazníkom účtuje platba",
      placeholder: "Vyberte interval",
      monthly: "Mesačne",
      yearly: "Ročne",
    },
    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "Skontrolujte polia formulára a skúste to znova",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na vytvorenie produktu sa prihláste",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie vytvoriť tento produkt",
      },
      conflict: {
        title: "Už existuje",
        description: "Produkt s týmto SKU už existuje",
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
        description: "Požadovaný zdroj sa nenašiel",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Produkt vytvorený",
      description: "Produkt je teraz v katalógu.",
    },
    response: {
      id: "ID produktu",
      name: "Názov produktu",
    },
    widget: {
      viewProduct: "Zobraziť produkt",
      backToList: "Späť na produkty",
      back: "Späť",
    },
  },
};
