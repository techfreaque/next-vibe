import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Fakturácia",
  tags: {
    payment: "platba",
    invoice: "faktúra",
    ar: "ar",
  },
  post: {
    title: "Duplikátna faktúra",
    titleShort: "Duplikátna faktúra",
    description:
      "Pripojte existujúcu faktúru do nového návrhu. Kópie všetky riadkové položky, zákazník, spoločnosť, a mena. Získa nové číslo faktúry a dnešný dátum.",
    form: {
      title: "Duplikátna faktúra",
      description: "Vytvorí nový návrh faktúry z tohto",
    },
    response: {
      success: "Faktúra duplikovaná",
      message: "Stavová správa",
      invoice: {
        title: "Nová faktúra",
        subtitle: "Duplicitná predbežná faktúra",
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
        description: "Požadované overenie",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Neplatné parametre",
      },
      server: {
        title: "Chyba servera",
        description: "Nastala chyba interného servera",
      },
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
        description: "Prístup zakázaný",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Faktúra nebola nájdená",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Úspech",
      description: "Faktúra duplikovaná ako nový návrh",
    },
  },
  invoiceId: {
    label: "ID faktúry",
    description: "Identifikačné číslo faktúry na duplikáciu",
    placeholder: "Zadajte identifikačné číslo faktúry",
  },
  widget: {
    back: "Späť",
    submit: "Duplikátna faktúra",
    duplicated: "Faktúra duplikovaná",
    invoiceNumber: "Faktúra #",
    viewDuplicate: "Duplikovať zobrazenie",
  },
};
