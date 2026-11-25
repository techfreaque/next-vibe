import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Fakturácia",
  tags: {
    payment: "platba",
    invoice: "faktúra",
    ar: "pohľadávky",
  },
  post: {
    title: "Vytvoriť odberateľskú faktúru",
    titleShort: "Vytvoriť faktúru",
    description: "Vytvorte novú odberateľskú faktúru.",
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
        description: "Potrebujete oprávnenie správcu alebo účtovníka tejto firmy.",
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
      back: "Späť",
      submit: "Vytvoriť faktúru",
      viewButton: "Zobraziť faktúru",
    },
  },
  companyId: {
    label: "ID firmy",
    description: "Firma, ktorá faktúru vystavuje",
    placeholder: "Zadajte ID firmy",
  },
  customerId: {
    label: "ID odberateľa",
    description: "Nepovinné UUID odberateľa (voľná väzba na používateľa)",
    placeholder: "Zadajte ID zákazníka",
  },
  dueDate: {
    label: "Dátum splatnosti",
    description: "Dátum splatnosti tejto faktúry",
    placeholder: "Vyberte dátum splatnosti",
  },
  currency: {
    label: "Mena",
    description: "Mena faktúry",
    placeholder: "EUR",
  },
  notes: {
    label: "Poznámky",
    description: "Nepovinné poznámky zobrazené na faktúre",
    placeholder: "Napr. splatnosť 30 dní",
  },
};
