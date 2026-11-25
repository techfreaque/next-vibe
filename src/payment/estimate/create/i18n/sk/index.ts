import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Cenové ponuky",
  tags: {
    payment: "platba",
    estimate: "cenová ponuka",
    ar: "pohľadávky",
  },
  post: {
    title: "Vytvoriť cenovú ponuku",
    titleShort: "Vytvoriť cenovú ponuku",
    description: "Vytvoriť nový koncept cenovej ponuky",
    form: {
      title: "Nová cenová ponuka",
      description: "Vyplňte údaje cenovej ponuky",
    },
    response: {
      success: "Cenová ponuka vytvorená",
      message: "Stavová správa",
      estimate: {
        title: "Cenová ponuka",
        subtitle: "Vytvorená cenová ponuka",
        id: "ID cenovej ponuky",
        companyId: "ID firmy",
        estimateNumber: "Číslo cenovej ponuky",
        status: "Stav",
        customerId: "ID zákazníka",
        customerEmail: "E-mail zákazníka",
        customerName: "Meno zákazníka",
        currency: "Mena",
        validUntil: "Platnosť do",
        title_field: "Názov",
        notes: "Poznámky",
        terms: "Podmienky",
        subtotal: "Medzisúčet",
        taxAmount: "Suma dane",
        total: "Spolu",
        invoiceId: "ID faktúry",
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
        description: "Neplatné parametre cenovej ponuky",
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
      title: "Úspech",
      description: "Cenová ponuka bola vytvorená ako koncept",
    },
    widget: {
      otherRate: "Iná sadzba",
      item: "Opis",
      quantity: "Množstvo",
      price: "Jednotková cena",
      vatRate: "DPH (%)",
      add: "Pridať položku",
      remove: "Odstrániť položku",
      empty: "Pridajte tovar alebo služby, ktoré ponúkate.",
      summary: "Súhrn",

      back: "Späť",
      submit: "Vytvoriť cenovú ponuku",
      viewButton: "Zobraziť cenovú ponuku",
    },
  },
  companyId: {
    label: "ID firmy",
    description: "Firma, ktorá vystavuje cenovú ponuku",
    placeholder: "Zadajte ID firmy",
  },
  customerId: {
    label: "ID zákazníka",
    description: "Nepovinné UUID zákazníka",
    placeholder: "Zadajte ID zákazníka",
  },
  customerEmail: {
    label: "E-mail zákazníka",
    description: "E-mailová adresa zákazníka",
    placeholder: "customer@example.com",
  },
  customerName: {
    label: "Meno zákazníka",
    description: "Meno zákazníka",
    placeholder: "Zadajte meno zákazníka",
  },
  currency: {
    code: "{{code}}",
    label: "Mena",
    description: "Mena cenovej ponuky",
    placeholder: "Mena firmy",
  },
  validUntil: {
    label: "Platnosť do",
    description: "Dátum skončenia platnosti cenovej ponuky",
    placeholder: "Vyberte koniec platnosti",
  },
  title: {
    label: "Názov",
    description: "Krátky názov cenovej ponuky",
    placeholder: "napr. Cenová ponuka na úpravu webu",
  },
  notes: {
    label: "Poznámky",
    description: "Nepovinné poznámky zobrazené na cenovej ponuke",
    placeholder: "Napr. ceny platia 30 dní",
  },
  terms: {
    label: "Podmienky",
    description: "Platobné alebo dodacie podmienky",
    placeholder: "Napr. 50 % vopred, 50 % pri dodaní",
  },
  lines: {
    label: "Položky",
    description: "Položky zahrnuté v cenovej ponuke",
  },
};
