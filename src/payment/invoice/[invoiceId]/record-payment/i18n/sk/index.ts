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
        title: "Prístup zamietnutý",
        description: "Nemáte potrebné oprávnenie.",
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
  accountNodeId: {
    label: "ID účtu",
    description: "Nepovinný účet, na ktorý bola pripísaná úhrada",
    placeholder: "Zadajte ID účtu",
  },
  widget: {
    back: "Späť",
    submit: "Zaevidovať úhradu",
    paymentRecorded: "Úhrada bola zaevidovaná.",
    viewInvoice: "Zobraziť faktúru",
  },
};
