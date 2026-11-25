import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "platba",
    bill: "prijatá faktúra",
    ap: "záväzky",
  },
  post: {
    title: "Nová prijatá faktúra",
    titleShort: "Nová prijatá faktúra",
    description: "Zadajte dodávateľa a položky. Potom uložte koncept.",
    form: {
      title: "Nová prijatá faktúra",
      description: "Zadajte údaje prijatej faktúry.",
    },
    errors: {
      vendor: "Vyberte aktívneho dodávateľa tejto firmy.",
      supplier: "Zadajte názov dodávateľa alebo ho vyberte z adresára.",
      dates: "Zadajte platný dátum faktúry a dátum splatnosti.",
      amounts:
        "Skontrolujte sumy položiek. Celková suma faktúry musí byť v podporovanom rozsahu.",
      expenseAccount: "Vyberte aktívny nákladový účet tejto firmy.",

      validation: {
        title: "Neplatné údaje",
        description: "Skontrolujte všetky polia a skúste to znova",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Prihláste sa a vytvorte prijatú faktúru.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Potrebujete rolu účtovníka alebo správcu.",
      },
      conflict: { title: "Konflikt", description: "Konflikt údajov" },
      server: {
        title: "Chyba servera",
        description: "Faktúru sa nepodarilo vytvoriť. Skúste to znova.",
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
      title: "Prijatá faktúra bola vytvorená",
      description: "Prijatá faktúra bola zaevidovaná.",
    },
    widget: {
      supplier: "Dodávateľ",
      dates: "Dátumy a mena",
      items: "Položky faktúry",
      itemsDescription:
        "Položky sú nepovinné. Sadzbu DPH zadajte ako desatinné číslo od 0 do 1.",
      itemsHint: "Pridajte tovar alebo služby uvedené na faktúre.",
      item: "Opis",
      quantity: "Množstvo",
      unitPrice: "Jednotková cena",
      manualTaxRate: "Iná sadzba",
      taxRate: "DPH (%)",
      lineTotal: "Suma položky",
      addItem: "Pridať položku",
      removeItem: "Odstrániť položku",
      itemError: "Skontrolujte opis, množstvo, cenu a sadzbu DPH.",
      summary: "Súhrn prijatej faktúry",
      net: "Základ dane",
      tax: "DPH",
      total: "Spolu",
      chooseVendor: "Vybrať dodávateľa",
      vendorSource: "Z adresára dodávateľov",
      terms: "Použiť platobné podmienky dodávateľa",
      manualVendor: "Zadať dodávateľa ručne",
      selectCompanyFirst: "Pred výberom dodávateľa z adresára vyberte firmu.",

      back: "Späť",
      submit: "Uložiť koncept",
      viewButton: "Zobraziť prijatú faktúru",
      addAnotherButton: "Pridať ďalšiu",
    },
    response: {
      id: "ID dodávateľskej faktúry",
      companyId: "ID firmy",
      supplierName: "Dodávateľ",
      billNumber: "Číslo dodávateľskej faktúry",
      billDate: "Dátum vystavenia",
      dueDate: "Dátum splatnosti",
      currency: "Mena",
      subtotal: "Medzisúčet",
      taxAmount: "DPH",
      total: "Spolu",
      status: "Stav",
      createdAt: "Vytvorené",
      updatedAt: "Aktualizované",
    },
  },
  enums: {
    billStatus: {
      DRAFT: "Koncept",
      RECEIVED: "Prijatá",
      APPROVED: "Schválená",
      PAID: "Zaplatené",
      DISPUTED: "Sporná",
    },
  },
  companyId: {
    label: "Firma",
    description: "Firma, ktorá faktúru prijala",
    placeholder: "UUID firmy",
  },
  vendorId: {
    label: "Vybrať dodávateľa",
    description: "Z adresára dodávateľov",
  },
  supplierName: {
    label: "Názov dodávateľa",
    description: "Názov dodávateľa, ktorý faktúru vystavil",
    placeholder: "Acme GmbH",
  },
  supplierVatNumber: {
    label: "IČ DPH dodávateľa",
    description: "IČ DPH alebo DIČ dodávateľa",
    placeholder: "DE123456789",
  },
  billNumber: {
    label: "Číslo dodávateľskej faktúry",
    description: "Číslo faktúry uvedené dodávateľom",
    placeholder: "INV-2024-001",
  },
  billDate: {
    label: "Dátum vystavenia",
    description: "Dátum vystavenia faktúry",
    placeholder: "Vyberte dátum vystavenia",
  },
  dueDate: {
    label: "Dátum splatnosti",
    description: "Dátum splatnosti",
    placeholder: "Vyberte dátum splatnosti",
  },
  currency: {
    code: "{{code}}",
    label: "Mena",
    description: "Mena faktúry",
    placeholder: "EUR",
  },
  notes: {
    label: "Poznámky",
    description: "Interné poznámky k prijatej faktúre",
    placeholder: "Nepovinné poznámky",
  },
};
