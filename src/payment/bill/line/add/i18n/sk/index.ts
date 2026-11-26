import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { payment: "platba", bill: "prijatá faktúra", ap: "záväzky" },
  post: {
    title: "Pridať položku prijatej faktúry",
    titleShort: "Pridať položku",
    description: "Pridajte nákladovú položku do konceptu prijatej faktúry.",
    form: {
      title: "Nová položka prijatej faktúry",
      description: "Zadajte údaje nákladovej položky.",
    },
    errors: {
      evidenceReview:
        "Pred zmenou zaúčtovania skontrolujte pôvodnú dodávateľskú faktúru.",
      validation: {
        title: "Neplatné údaje",
        description: "Skontrolujte všetky polia",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Prihláste sa a pridajte položky faktúry.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Vyžaduje sa rola účtovníka alebo správcu.",
      },
      conflict: {
        title: "Faktúru nemožno upraviť",
        description: "Položky možno pridať len do konceptu prijatej faktúry.",
      },
      server: {
        title: "Chyba servera",
        description: "Položku sa nepodarilo pridať.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Skontrolujte pripojenie.",
      },
      notFound: {
        title: "Faktúra sa nenašla",
        description: "Faktúra neexistuje.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Položka bola pridaná",
      description: "Nákladová položka bola pridaná do faktúry.",
    },
    response: {
      success: "Úspech",
      message: "Správa",
      line: {
        currency: "Mena",
        title: "Údaje položky",
        subtitle: "Pridaná položka",
        id: "ID položky",
        billId: "ID dodávateľskej faktúry",
        lineDescription: "Opis",
        productId: "ID produktu",
        quantity: "Množstvo",
        unitPrice: "Jednotková cena",
        taxRate: "Sadzba DPH",
        taxAmount: "Suma dane",
        lineTotal: "Suma položky",
        expenseAccountId: "Nákladový účet",
        sortOrder: "Poradie zoradenia",
        createdAt: "Vytvorené",
        updatedAt: "Aktualizované",
      },
    },
  },
  billId: {
    label: "ID dodávateľskej faktúry",
    description: "Faktúra, do ktorej sa pridá položka",
    placeholder: "UUID prijatej faktúry",
  },
  description: {
    label: "Opis",
    description: "Popis nákupu",
    placeholder: "Kancelárske potreby",
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
    description: "Cena za jednotku",
    placeholder: "100.00",
  },
  taxRate: {
    label: "Sadzba DPH",
    description: "Sadzba DPH alebo inej dane (0 až 1, napríklad 0.19 pre 19 %)",
    placeholder: "0.19",
  },
  expenseAccountId: {
    label: "Nákladový účet",
    description: "Nákladový účet, na ktorý sa položka zaúčtuje",
    placeholder: "Vybrať nákladový účet",
  },
  widget: {
    submit: "Pridať položku",
    searchProduct: "Vyhľadať produkt",
    searchPlaceholder: "Názov alebo SKU produktu…",
    searchButton: "Vyhľadať",
    clearProduct: "Vymazať",
    noProductResults: "Žiadne produkty sa nenašli.",
    orManual: "alebo zadajte údaje ručne",
    multiplier: "×",
    taxLabel: "daň",
    linePreview: "Suma položky (náhľad)",
    addAnotherLine: "Pridať ďalšiu položku",
    viewBill: "Zobraziť prijatú faktúru",
  },
};
