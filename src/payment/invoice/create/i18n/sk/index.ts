import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Fakturácia",
  tags: {
    payment: "platba",
    invoice: "faktúra",
    ar: "pohľadávky",
  },
  post: {
    title: "Nová faktúra",
    titleShort: "Nová faktúra",
    description: "Pripravte faktúru pre zákazníka.",
    form: {
      title: "Nová faktúra",
      description: "Vyplňte údaje faktúry.",
    },
    response: {
      success: "Faktúra bola vytvorená",
      message: "Stavová správa",
      invoice: {
        title: "Faktúra",
        subtitle: "Vytvorená faktúra",
        id: "ID faktúry",
        companyId: "ID firmy",
        customerId: "ID zákazníka",
        invoiceSequenceNumber: "Číslo faktúry",
        currency: "Mena",
        status: "Stav",
        dueDate: "Dátum splatnosti",
        notes: "Poznámky",
        amount: "Suma",
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
        description: "Skontrolujte údaje faktúry.",
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
        description:
          "Potrebujete oprávnenie správcu alebo účtovníka tejto firmy.",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Firma sa nenašla",
      },
      conflict: {
        title: "Konflikt",
        description: "Údaje sa medzičasom zmenili.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny.",
      },
    },
    success: {
      title: "Faktúra bola vytvorená",
      description: "Faktúra bola uložená ako koncept.",
    },
    widget: {
      draftSaved: "Koncept faktúry bol uložený",
      draftSavedNumber: "Koncept faktúry č. {{number}} bol uložený",
      details: "Údaje faktúry",
      draftHint: "Uložte koncept a skontrolujte ho pred vystavením.",
      items: "Položky",
      itemsDescription:
        "Nepovinné položky konceptu. Sadzbu DPH zadajte ako desatinné číslo od 0 do 1.",
      itemsHint:
        "Pridajte tovar alebo služby a vypočítajte celkovú sumu faktúry.",
      item: "Opis",
      quantity: "Množstvo",
      unitPrice: "Jednotková cena",
      manualTaxRate: "Iná sadzba",
      taxRate: "DPH (%)",
      addItem: "Pridať položku",
      removeItem: "Odstrániť položku",
      itemError:
        "Zadajte opis, kladné množstvo, cenu a sadzbu DPH od 0 do 100 %.",
      itemsTotalError: "Celková suma prekračuje limit jednej faktúry.",
      summary: "Súhrn",
      net: "Základ dane",
      tax: "DPH",
      total: "Spolu",
      customerSelected: "Zákazník je vybratý",
      clearCustomer: "Zrušiť výber zákazníka",
      lineTotal: "Suma položky",
      companyCurrencyValue: "Mena firmy: {{currency}}",
      companyCurrency: "Ak nevyberiete inú menu, použije sa mena firmy.",
      back: "Späť",
      submit: "Uložiť koncept",
      saving: "Ukladá sa koncept…",
      retrySave: "Uložiť koncept znova",
      saveFailed: "Koncept faktúry sa nepodarilo uložiť",
      saveFailedHint:
        "Zadané údaje sú stále vo formulári. Skontrolujte ich a uložte koncept znova.",
      viewButton: "Zobraziť faktúru",
    },
  },
  companyId: {
    label: "Firma",
    description: "Firma, ktorá faktúru vystavuje",
    placeholder: "Zadajte ID firmy",
  },
  customerId: {
    label: "Zákazník",
    description: "Vyhľadajte zákazníka podľa mena.",
    placeholder: "Zadajte ID zákazníka",
  },
  dueDate: {
    label: "Dátum splatnosti",
    description: "Dátum splatnosti tejto faktúry",
    placeholder: "Vyberte dátum splatnosti",
  },
  currency: {
    code: "{{code}}",
    label: "Mena",
    description: "Mena faktúry",
    placeholder: "Mena firmy",
  },
  notes: {
    label: "Poznámky",
    description: "Nepovinné poznámky zobrazené na faktúre",
    placeholder: "Napr. splatnosť 30 dní",
  },
};
