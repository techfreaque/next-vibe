import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Fakturácia",
  tags: {
    payment: "platba",
    invoice: "faktúra",
    transactions: "transakcie",
  },
  defaultItem: "Fakturovaná položka",
  success: {
    created: "Faktúra bola vytvorená.",
  },
  post: {
    title: "Vytvoriť Stripe faktúru",
    titleShort: "Stripe faktúra",
    description: "Vytvorte Stripe faktúru pre zákazníka",
    form: {
      title: "Údaje faktúry",
      description: "Zadajte sumu, menu a dátum splatnosti.",
    },
    response: {
      success: "Faktúra bola vytvorená.",
      message: "Stavová správa",
      invoice: {
        title: "Detail faktúry",
        description: "Údaje vytvorenej faktúry",
        id: "ID faktúry",
        userId: "ID používateľa",
        stripeInvoiceId: "ID faktúry v Stripe",
        invoiceNumber: "Číslo faktúry",
        amount: "Suma",
        currency: "Mena",
        status: "Stav",
        invoiceUrl: "Adresa faktúry",
        invoicePdf: "Faktúra vo formáte PDF",
        dueDate: "Dátum splatnosti",
        paidAt: "Dátum úhrady",
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
        description: "Neplatné parametre požiadavky",
      },
      server: {
        detail: "Faktúru sa nepodarilo vytvoriť: {{error}}",
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
        noStripeCustomer: "K tvojmu účtu sa v Stripe nenašiel záznam zákazníka",
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
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
      description: "Operácia bola úspešná.",
    },
    widget: {
      back: "Späť",
    },
  },
  customerId: {
    label: "Zákazník",
    description: "Vyber účet prepojený so zákazníkom v Stripe.",
    placeholder: "Vyhľadať zákazníka",
  },
  amount: {
    label: "Suma",
    description: "Suma faktúry",
    placeholder: "Zadajte sumu",
  },
  currency: {
    label: "Mena",
    description: "Kód meny",
    placeholder: "Vyberte menu",
    usd: "Americký dolár (USD)",
    eur: "Euro (EUR)",
    pln: "Poľský zlotý (PLN)",
  },
  description: {
    label: "Opis",
    description: "Popis faktúry",
    placeholder: "Zadajte popis",
  },
  dueDate: {
    label: "Dátum splatnosti",
    description: "Dátum splatnosti",
    placeholder: "Vyberte dátum splatnosti",
  },
  metadata: {
    label: "Metadáta",
    description: "Doplňujúce metadáta",
    placeholder: "Zadajte metadáta vo formáte JSON",
  },
};
