import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Cenové ponuky",
  tags: { payment: "platba", estimate: "cenová ponuka" },
  post: {
    title: "Duplikát",
    titleShort: "Duplikát",
    description: "Skopírovať cenovú ponuku do nového konceptu",
    form: {
      title: "Duplikát",
      description: "Skopírovať cenovú ponuku do nového konceptu",
    },
    response: {
      success: "Úspech",
      message: "Stavová správa",
      newEstimateId: "ID novej cenovej ponuky",
      estimateNumber: "Číslo novej cenovej ponuky",
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
      server: { title: "Chyba servera", description: "Interná chyba servera" },
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
        description: "Prístup zamietnutý",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Cenová ponuka sa nenašla",
      },
      conflict: {
        title: "Konflikt",
        description: "Nie je možné vykonať akciu v aktuálnom stave",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Cenová ponuka skopírovaná",
      description: "Vytvoril sa nový koncept cenovej ponuky",
    },
  },
  estimateId: {
    label: "ID cenovej ponuky",
    description: "Cenová ponuka na skopírovanie",
  },
  widget: {
    cancel: "Zrušiť",
    loading: "Načítava sa cenová ponuka",
    total: "Spolu",
    created: "Koncept {{number}} vytvorený s rovnakými položkami.",
    back: "Späť",
    submit: "Duplikát",
    viewDuplicate: "Duplikovať zobrazenie",
    duplicateNote:
      "Vytvorí sa nový koncept cenovej ponuky s rovnakými položkami a údajmi.",
  },
};
