import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Fakturácia",
  tags: {
    payment: "platba",
    invoice: "faktúra",
    lines: "položky",
  },
  post: {
    title: "Pridať položku faktúry",
    titleShort: "Pridať položku",
    description: "Pridajte položku do konceptu faktúry.",
    form: {
      title: "Položka",
      description: "Zadajte údaje fakturovanej položky.",
    },
    response: {
      success: "Položka bola pridaná",
      message: "Stavová správa",
      line: {
        currency: "Mena",
        title: "Údaje položky",
        subtitle: "Vytvorená položka faktúry",
        id: "ID položky",
        invoiceId: "ID faktúry",
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
        description: "Neplatné údaje položky",
      },
      server: {
        title: "Chyba servera",
        description: "Nastala interná chyba servera.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba.",
      },
      network: {
        title: "Chyba siete",
        description: "Skontrolujte pripojenie.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte potrebné oprávnenie.",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Faktúra sa nenašla.",
      },
      conflict: {
        title: "Konflikt",
        description: "Faktúra nie je v stave Koncept.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny.",
      },
    },
    success: {
      title: "Úspech",
      description: "Položka bola pridaná do faktúry.",
    },
  },
  invoiceId: {
    label: "ID faktúry",
    description: "Koncept faktúry, do ktorého sa pridá položka",
    placeholder: "Zadajte ID faktúry",
  },
  description: {
    label: "Opis",
    description: "Popis fakturovanej položky",
    placeholder: "Napr. vývoj webu, 10 hodín",
  },
  productId: {
    label: "ID produktu",
    description: "Voliteľný odkaz na produkt",
    placeholder: "Zadajte ID produktu",
  },
  quantity: {
    label: "Množstvo",
    description: "Počet jednotiek",
    placeholder: "1",
  },
  unitPrice: {
    label: "Jednotková cena",
    description: "Cena za jednotku",
    placeholder: "0.00",
  },
  taxRate: {
    label: "Sadzba DPH",
    description: "Sadzba dane ako desatinné číslo, napríklad 0.23 pre 23 %",
    placeholder: "0.00",
  },
  widget: {
    searchProduct: "Vyhľadajte produkt v katalógu",
    searchPlaceholder: "Názov alebo SKU…",
    searchButton: "Vyhľadať",
    clearProduct: "Vymazať",
    noProductResults: "Žiadne výsledky. Zadajte údaje ručne nižšie.",
    orManual: "Alebo zadajte údaje ručne",
    multiplier: "×",
    taxLabel: "daň",
    linePreview: "Suma položky",
    lineAdded: "Položka bola pridaná",
    addAnotherLine: "Pridať ďalšiu položku",
    viewInvoice: "Zobraziť faktúru",
    submit: "Pridať položku",
  },
};
