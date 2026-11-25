import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Cenové ponuky",
  tags: { payment: "platba", estimate: "cenová ponuka", lines: "položky" },
  post: {
    title: "Pridať položku cenovej ponuky",
    titleShort: "Pridať položku",
    description: "Pridať položku do cenovej ponuky",
    form: {
      title: "Pridať položku cenovej ponuky",
      description: "Pridať produkt alebo službu do tejto cenovej ponuky",
    },
    response: {
      success: "Úspech",
      message: "Stavová správa",
      line: {
        title: "Položka",
        subtitle: "Údaje pridanej položky",
        id: "ID položky",
        estimateId: "ID cenovej ponuky",
        lineDescription: "Opis",
        productId: "ID produktu",
        quantity: "Množstvo",
        unitPrice: "Jednotková cena",
        taxRate: "Sadzba DPH",
        taxAmount: "Suma dane",
        lineTotal: "Suma položky",
        sortOrder: "Poradie zoradenia",
        createdAt: "Čas vytvorenia",
        updatedAt: "Čas aktualizácie",
      },
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Prihláste sa.",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Skontrolujte údaje položky.",
      },
      server: { title: "Chyba servera", description: "Nastala interná chyba servera." },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba.",
      },
      network: {
        title: "Chyba siete",
        description: "Skontrolujte pripojenie.",
      },
      forbidden: { title: "Prístup zamietnutý", description: "Nemáte potrebné oprávnenie." },
      notFound: { title: "Nenašlo sa", description: "Cenová ponuka sa nenašla" },
      conflict: {
        title: "Konflikt",
        description: "Položky možno pridávať iba do cenovej ponuky v stave DRAFT.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny.",
      },
    },
    success: {
      title: "Položka bola pridaná",
      description: "Položka bola pridaná do cenovej ponuky",
    },
  },
  estimateId: {
    label: "ID cenovej ponuky",
    description: "Cenová ponuka, do ktorej chcete pridať položku",
    placeholder: "UUID cenovej ponuky",
  },
  description: {
    label: "Opis",
    description: "Popis produktu alebo služby",
    placeholder: "Napr. vývoj webu, 10 hodín",
  },
  productId: {
    label: "ID produktu",
    description: "Voliteľný odkaz na produkt",
    placeholder: "UUID produktu",
  },
  quantity: {
    label: "Množstvo",
    description: "Počet jednotiek",
    placeholder: "1",
  },
  unitPrice: {
    label: "Jednotková cena",
    description: "Jednotková cena bez DPH",
    placeholder: "0.00",
  },
  taxRate: {
    label: "Sadzba DPH",
    description: "Desatinná sadzba DPH (napr. 0,23 pre 23 %)",
    placeholder: "0.23",
  },
  widget: {
    searchProduct: "Vyhľadať produkt",
    searchPlaceholder: "Názov alebo SKU produktu…",
    searchButton: "Vyhľadať",
    clearProduct: "Vymazať",
    noProductResults: "Žiadne produkty sa nenašli.",
    orManual: "alebo zadajte údaje ručne",
    multiplier: "×",
    taxLabel: "daň",
    linePreview: "Suma položky",
    addAnotherLine: "Pridať ďalšiu položku",
    viewEstimate: "Späť na cenovú ponuku",
    submit: "Pridať položku",
  },
};
