import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Fakturácia",
  tags: {
    payment: "platba",
    invoice: "faktúra",
  },
  post: {
    title: "Zaevidovať úhradu manuálne",
    titleShort: "Zaevidovať úhradu",
    description:
      "Ručne zaevidovať platbu k faktúre. Po úplnej úhrade sa faktúra označí ako uhradená.",
    form: {
      title: "Zaevidovať úhradu",
      description: "Zadajte údaje úhrady priradenej k tejto faktúre.",
    },
    response: {
      success: "Úhrada bola zaevidovaná",
      message: "Stavová správa",
    },
    errors: {
      receiptKeyConflict: "Tento kľúč patrí inej úhrade.",
      paymentPrecision:
        "Zadajte kladnú sumu s najviac dvoma desatinnými miestami.",
      paymentStatus:
        "Úhradu možno priradiť k otvorenej faktúre s kladnou sumou.",
      overpayment: "Úhrada prevyšuje zostatok faktúry.",
      fullPayment: "Pri faktúre bez firmy zadajte celú zostávajúcu sumu.",
      issuancePosting:
        "Pred zaevidovaním platby musí byť zaúčtovaná pohľadávka v celkovej sume faktúry.",
      paymentAccount:
        "Vyberte aktívny bankový alebo pokladničný účet tejto firmy.",
      paymentPosting:
        "Skontrolujte dátum platby, menu firmy a účty na zaúčtovanie.",
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Prihláste sa.",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Skontrolujte údaje platby.",
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
        title: "Vyžaduje sa oprávnenie na platby",
        description:
          "Ak chcete zaznamenať platbu, potrebujete oprávnenie spravovať túto faktúru.",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Faktúra sa nenašla.",
      },
      conflict: {
        title: "Konflikt",
        description: "Faktúra je už uhradená alebo stornovaná",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny.",
      },
    },
    success: {
      title: "Úspech",
      description: "Manuálna úhrada bola zaevidovaná.",
    },
  },
  enums: {
    manualPaymentMethod: {
      cash: "Hotovosť",
      bankTransfer: "Bankový prevod",
      other: "Iné",
    },
  },
  invoiceId: {
    label: "ID faktúry",
    description: "ID faktúry, ku ktorej sa zaeviduje úhrada",
    placeholder: "Zadajte ID faktúry",
  },
  amount: {
    label: "Uhradená suma",
    description: "Prijatá suma",
    placeholder: "0.00",
  },
  method: {
    label: "Spôsob platby",
    description: "Spôsob prijatia platby",
    placeholder: "Vyberte spôsob úhrady",
  },
  paidAt: {
    label: "Dátum platby",
    description: "Dátum prijatia platby",
    placeholder: "Vyberte dátum",
  },
  receiptKey: {
    label: "Kľúč úhrady",
    description:
      "Pri opakovaní tejto úhrady použite rovnaký kľúč. Pre inú úhradu použite nový kľúč.",
  },
  accountNodeId: {
    label: "Účet úhrady",
    description:
      "Vyberte bankový účet alebo pokladnicu, na ktorú ste prijali úhradu.",
    placeholder: "Vyberte účet",
    automatic: "Použiť predvolený účet",
  },
  widget: {
    backToInvoices: "Späť na faktúry",
    retryInvoice: "Skúsiť znova",
    loadingInvoice: "Overuje sa prístup k faktúre…",
    details: "Podrobnosti úhrady",
    back: "Späť",
    submit: "Zaevidovať úhradu",
    paymentRecorded: "Úhrada bola zaevidovaná.",
    viewInvoice: "Zobraziť faktúru",
    amountDue: "{{amount}} na úhradu",
    notOpenTitle: "Táto faktúra nie je otvorená",
    notOpenMessage:
      "Platbu zapíšete len na vystavenú a neuhradenú faktúru. Najprv faktúru vystavte alebo otvorte správnu.",
  },
};
