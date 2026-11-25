import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Platby",
  tags: { payment: "platba", invoice: "faktúra" },
  get: {
    title: "Zobraziť faktúru",
    titleShort: "Zobraziť faktúru",
    description: "Zobraziť faktúru cez zabezpečený odkaz s prístupovým tokenom",
    form: {
      title: "Faktúra",
      description: "Zobraziť podrobnosti faktúry",
    },
    response: {
      id: "ID faktúry",
      invoiceNumber: "Číslo faktúry",
      currency: "Mena",
      status: "Stav",
      amount: "Suma",
      dueDate: "Dátum splatnosti",
      notes: "Poznámky",
      createdAt: "Dátum vystavenia",
      companyName: "Firma",
      companyEmail: "E-mail spoločnosti",
      lineId: "ID riadku",
      lineDescription: "Opis",
      productId: "Produkt",
      quantity: "Množstvo",
      unitPrice: "Jednotková cena",
      taxRate: "Sadzba dane",
      taxAmount: "Dane",
      lineTotal: "Celkový riadok",
      sortOrder: "Poradie",
      lineCreatedAt: "Vytvorené",
      lineUpdatedAt: "Aktualizované",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      validation: {
        title: "Neplatný odkaz",
        description: "Odkaz na faktúru je neplatný alebo má nesprávny formát",
      },
      server: { title: "Chyba servera", description: "Interná chyba servera" },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Nastala chyba siete",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description:
          "Odkaz na faktúru je neplatný alebo jeho platnosť uplynula",
      },
      notFound: { title: "Nenašlo sa", description: "Faktúra nebola nájdená" },
      conflict: {
        title: "Konflikt",
        description: "Konflikt vo fakturačnom štáte",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Existujú neuložené zmeny",
      },
    },
    success: { title: "Faktúra", description: "Údaje o vašej faktúre" },
  },
  invoiceId: {
    label: "ID faktúry",
    description: "Faktúra, ktorá sa má predložiť",
  },
  token: {
    label: "Prístupový token",
    description: "Zabezpečený prístupový token z e-mailu s faktúrou",
  },
  widget: {
    submit: "Zobraziť faktúru",
  },
};
