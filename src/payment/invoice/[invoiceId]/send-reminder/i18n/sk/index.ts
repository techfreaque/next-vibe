import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Fakturácia",
  tags: {
    payment: "platba",
    invoice: "faktúra",
    ar: "pohľadávky",
  },
  post: {
    title: "Pripraviť upomienku",
    titleShort: "Pripraviť upomienku",
    description:
      "Pripravte upomienku s aktuálnou dlžnou sumou. Môžete pridať vlastnú poznámku.",
    form: {
      title: "Pripraviť upomienku",
      description: "Pred odoslaním upomienky si skontrolujte dlžnú sumu.",
    },
    response: {
      success: "Upomienka je pripravená",
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
          "Upomienku môžete pripraviť len k neuhradenej faktúre po splatnosti.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny.",
      },
    },
    success: {
      title: "Upomienka je pripravená",
      description:
        "Upomienka sa uložila do histórie faktúry. Môžete ju poslať odberateľovi.",
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
    copy: "Kopírovať upomienku",
    copied: "Upomienka bola skopírovaná",
    copyFailed: "Kopírovanie zlyhalo. Skúste to znova.",
    download: "Stiahnuť upomienku",
    subject: "Upomienka k faktúre č. {{number}}",
    body: "Neuhradená suma je {{amount}}. Dátum splatnosti bol {{date}}.",
    back: "Späť",
    submit: "Pripraviť upomienku",
    reminderSent:
      "Upomienka sa uložila do histórie faktúry. Môžete ju poslať odberateľovi.",
    viewInvoice: "Zobraziť faktúru",
  },
};
