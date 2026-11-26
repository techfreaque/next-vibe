import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Fakturácia",
  tags: {
    payment: "platba",
    invoice: "faktúra",
  },
  get: {
    title: "Vydané faktúry",
    titleShort: "Vydané faktúry",
    description:
      "Vyhľadávajte podľa čísla dokladu, ID faktúry alebo ID zákazníka. Filtrujte podľa firmy alebo stavu.",
    form: {
      title: "Filtre faktúr",
      description: "Filtrovať zoznam faktúr",
    },
    response: {
      customerName: "Zákazník",
      total: "Spolu",
      invoices: "Faktúry",
      id: "ID faktúry",
      invoiceSequenceNumber: "Číslo faktúry",
      customerId: "ID zákazníka",
      currency: "Mena",
      status: "Stav",
      amount: "Suma",
      dueDate: "Dátum splatnosti",
      notes: "Poznámky",
      lineCount: "Počet položiek",
      amountPaid: "Uhradená suma",
      amountDue: "Suma na úhradu",
      isOverdue: "Po splatnosti",
      createdAt: "Čas vytvorenia",
      updatedAt: "Čas aktualizácie",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Prihláste sa.",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Neplatné nastavenie filtrov",
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
        description: "Musíte byť členom tejto firmy.",
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
      description: "Zoznam faktúr bol načítaný.",
    },
  },
  enums: {
    invoiceStatus: {
      draft: "Koncept",
      open: "Otvorená",
      paid: "Zaplatené",
      void: "Storno",
      uncollectible: "Nevymožiteľná",
    },
  },
  companyId: {
    label: "ID firmy",
    description: "Filtrovať faktúry tejto firmy",
    placeholder: "Zadajte ID firmy",
  },
  search: {
    label: "Hľadať doklady",
    description: "Vyhľadávajte podľa čísla faktúry, mena zákazníka alebo ID.",
    placeholder: "Číslo faktúry alebo zákazník",
  },
  status: {
    label: "Stav",
    description:
      "Filtrujte podľa stavu alebo zobrazte faktúry po splatnosti so zostatkom na úhradu.",
    placeholder: "Všetky stavy",
  },
  customerId: {
    label: "ID zákazníka",
    description: "Filtrovať podľa zákazníka",
    placeholder: "Zadajte ID zákazníka",
  },
  page: {
    label: "Strana",
    description: "Číslo strany",
  },
  pageSize: {
    label: "Počet položiek na strane",
    description: "Počet výsledkov na strane",
  },
  widget: {
    creditable: "Vyberte faktúru na dobropis",
    noCreditable: "Žiadna faktúra nemá sumu, ktorú možno dobropisovať.",
    filters: "Filtre",
    partlyPaid: "Čiastočne uhradená",
    pageCount: "Počet strán",
    title: "Vydané faktúry",
    newInvoice: "Nová faktúra",
    loading: "Načítavajú sa faktúry…",
    noInvoices: "Zatiaľ ste nevytvorili faktúru.",
    noInvoicesHint: "Vytvorte svoju prvú faktúru.",
    overdue: "Po splatnosti",
    due: "Splatné",
    lines: "položky",
    line: "položka",
    view: "Zobraziť",
    back: "Späť",
    empty: {
      title: "Zatiaľ ste nevytvorili faktúru.",
      hint: "Vytvorte svoju prvú faktúru.",
      cta: "Nová faktúra",
    },
    status: {
      draft: "Koncept",
      open: "Otvorená",
      paid: "Zaplatené",
      void: "Storno",
      uncollectible: "Nevymožiteľná",
    },
  },
};
