import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Fakturácia",
  tags: {
    payment: "platba",
    invoice: "faktúra",
  },
  post: {
    title: "Odoslať faktúru",
    titleShort: "Odoslať faktúru",
    description: "Označte koncept faktúry ako odoslaný. Faktúra prejde do stavu Otvorená.",
    form: {
      title: "Odoslať faktúru",
      description: "Odošle faktúru odberateľovi.",
    },
    response: {
      success: "Faktúra bola odoslaná.",
      message: "Stavová správa",
      viewUrl: "Adresa faktúry pre zákazníka",
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
        description: "Faktúra nie je v stave Koncept.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny.",
      },
    },
    success: {
      title: "Úspech",
      description: "Faktúra bola označená ako odoslaná.",
    },
  },
  invoiceId: {
    label: "ID faktúry",
    description: "ID faktúry na odoslanie",
    placeholder: "Zadajte ID faktúry",
  },
  widget: {
    back: "Späť",
    submit: "Odoslať faktúru",
    sent: "Faktúra bola odoslaná",
    viewUrl: "Odkaz na faktúru pre zákazníka",
  },
};
