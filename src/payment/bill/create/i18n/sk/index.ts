import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "platba",
    bill: "prijatá faktúra",
    ap: "záväzky",
  },
  post: {
    title: "Vytvoriť prijatú dodávateľskú faktúru",
    titleShort: "Vytvoriť prijatú faktúru",
    description: "Zaevidujte faktúru prijatú od dodávateľa.",
    form: {
      title: "Nová prijatá faktúra",
      description: "Zadajte údaje prijatej faktúry.",
    },
    errors: {
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
      notFound: { title: "Nenašlo sa", description: "Požadovaný zdroj sa nenašiel" },
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
      back: "Späť",
      submit: "Evidovať prijatú faktúru",
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
    placeholder: "2024-01-01",
  },
  dueDate: {
    label: "Dátum splatnosti",
    description: "Dátum splatnosti",
    placeholder: "2024-01-31",
  },
  currency: {
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
