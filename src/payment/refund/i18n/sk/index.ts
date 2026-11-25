import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Vrátiť platbu",
  titleShort: "Vrátenie platby",
  description: "Spracovať vrátenie platby za transakciu",
  category: "Vrátenie platieb",

  tags: {
    refund: "vrátenie platby",
    transaction: "transakcia",
  },

  success: {
    created: "Platba bola úspešne vrátená.",
  },

  reason: {
    requestedByCustomer: "Na žiadosť zákazníka",
  },

  form: {
    title: "Formulár na vrátenie platby",
    description: "Zadajte údaje o vrátení platby.",
    fields: {
      transactionId: {
        label: "ID transakcie",
        description: "ID transakcie, za ktorú sa má vrátiť platba",
        placeholder: "Zadajte ID transakcie",
      },
      amount: {
        label: "Suma na vrátenie",
        description: "Nepovinná čiastočná náhrada v mene transakcie",
        placeholder: "Zadajte sumu",
      },
      reason: {
        label: "Dôvod vrátenia platby",
        description: "Dôvod náhrady",
        placeholder: "Zadajte dôvod",
      },
      metadata: {
        label: "Metadáta",
        description: "Doplňujúce metadáta o vrátení platby",
        placeholder: "Zadajte metadáta vo formáte JSON",
      },
    },
  },

  widget: {
    transactionDetails: "Uložená transakcia",
    customerEmail: "Zákaznícka pošta",
    customerId: "ID zákazníka",
    originalAmount: "Pôvodný náboj",
    enterTransaction: "Zadajte ID transakcie pre načítanie platobných údajov.",
    lookupLoading: "Načítavam uloženú transakciu",
    transactionMissing: "Transakcia nebola nájdená",
    lookupFailed: "Nepodarilo sa načítať transakciu",
    retryLookup: "Vyhľadávanie",
    amountExceedsCharge: "Zadajte sumu až do pôvodného poplatku.",
    confirmRemaining: "Stripe vráti zvyšok v {{currency}}.",
    confirmAmount: "Čiastočná náhrada: {{amount}} ({{currency}}).",
    title: "Preskúmanie vrátenia Stripe",
    amountHelp:
      "Zadajte čiastočnú sumu v {{currency}}. Nechajte ho prázdne, aby ste vrátili zvyšok.",
    review: "Suma na preskúmanie",
    confirmTitle: "Potvrdiť vrátenie platby cez Stripe",
    confirmDescription:
      "Stripe vráti peniaze z transakcie {{transactionId}} pre adresu {{email}}. Touto akciou sa prevedú peniaze.",
    confirm: "Vydané náhrady",
    cancel: "Zrušiť",
  },

  post: {
    title: "Vrátiť platbu",
    description: "Spracovať vrátenie platby",
    response: {
      success: "Platba bola úspešne vrátená.",
      message: "Stavová správa",
      refund: {
        title: "Podrobnosti o vrátení platby",
        description: "Údaje o spracovanom vrátení platby",
        id: "ID vrátenia platby",
        userId: "ID používateľa",
        transactionId: "ID transakcie",
        stripeRefundId: "ID vrátenia platby v Stripe",
        amount: "Suma na vrátenie",
        currency: "Mena",
        status: "Stav vrátenia platby",
        reason: "Dôvod vrátenia platby",
        createdAt: "Čas vytvorenia",
        updatedAt: "Čas aktualizácie",
      },
    },
    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "Neplatné parametre vrátenia platby",
        ineligible: "Táto transakcia nie je oprávnená na vrátenie Stripe.",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Požadované overenie",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zamietnutý",
      },
      notFound: {
        detail: "Nenájdená žiadna transakcia s id {{transactionId}}",
        title: "Nenašlo sa",
        description: "Transakcia nebola nájdená",
      },
      server: {
        detail: "Platbu sa nepodarilo vrátiť: {{error}}",
        noPaymentIntent:
          "Táto transakcia nemá žiadne prepojené platby Stripe, takže to nemôže byť vrátené",
        title: "Chyba servera",
        description: "Nastala chyba interného servera",
      },
      network: {
        title: "Chyba siete",
        description: "Chyba sieťového pripojenia",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt pri vrátení platby",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Úspech",
      description: "Platba bola úspešne vrátená.",
    },
  },
};
