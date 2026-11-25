import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Fakturácia",
  tags: {
    payment: "platba",
    invoice: "faktúra",
    ar: "pohľadávky",
  },
  post: {
    title: "Poslať upomienku k úhrade",
    titleShort: "Poslať upomienku",
    description:
      "Pošlite upomienku k faktúre po splatnosti. Faktúra musí byť v stave Otvorená a po dátume splatnosti. Upomienka sa uloží ako poznámka k odberateľovi.",
    form: {
      title: "Poslať upomienku",
      description: "Upozornite odberateľa na platbu po splatnosti.",
    },
    response: {
      success: "Upomienka bola odoslaná",
      message: "Informácia o stave",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Prihláste sa.",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Skontrolujte zadané údaje.",
      },
      server: {
        title: "Chyba servera",
        description: "Na serveri sa vyskytla chyba.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neznáma chyba.",
      },
      network: {
        title: "Chyba pripojenia",
        description: "Nepodarilo sa pripojiť k serveru.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Na túto operáciu nemáte oprávnenie.",
      },
      notFound: {
        title: "Záznam sa nenašiel",
        description: "Faktúra sa nenašla.",
      },
      conflict: {
        title: "Faktúru nemožno upomínať",
        description:
          "Upomienku môžete odoslať len k otvorenej faktúre po splatnosti.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny.",
      },
    },
    success: {
      title: "Úspech",
      description: "Upomienka bola odoslaná a zaznamenaná.",
    },
  },
  invoiceId: {
    label: "ID faktúry",
    description: "ID faktúry po splatnosti",
    placeholder: "Zadajte ID faktúry",
  },
  message: {
    label: "Vlastná správa",
    description: "Voliteľná správa, ktorá sa pripojí k upomienke",
    placeholder: "Doplňte vlastný text upomienky…",
  },
  widget: {
    back: "Späť",
    submit: "Poslať upomienku",
    reminderSent: "Upomienka bola odoslaná. Odberateľ dostal upozornenie.",
    viewInvoice: "Zobraziť faktúru",
  },
};
