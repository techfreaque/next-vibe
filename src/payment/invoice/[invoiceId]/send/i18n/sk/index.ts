import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Fakturácia",
  tags: {
    payment: "platba",
    invoice: "faktúra",
  },
  post: {
    title: "Vystaviť faktúru",
    titleShort: "Vystaviť faktúru",
    description: "Vystaviť faktúru z konceptu a vytvoriť účtovný zápis.",
    form: {
      title: "Vystaviť faktúru",
      description: "Po vystavení vytvorte odkaz na faktúru pre zákazníka.",
    },
    response: {
      success: "Faktúra bola odoslaná.",
      message: "Stavová správa",
      viewUrl: "Adresa faktúry pre zákazníka",
    },
    errors: {
      invoiceLines:
        "Pred vystavením pridajte položky s kladnou celkovou sumou.",
      posting:
        "Skontrolujte celkovú sumu faktúry, menu firmy, účtovné obdobie a účty na zaúčtovanie.",
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
    submit: "Vystaviť faktúru",
    sent: "Faktúra bola vystavená",
    viewUrl: "Odkaz na faktúru pre zákazníka",
  },
};
