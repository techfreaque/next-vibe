import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Cenové ponuky",
  tags: { payment: "platba", estimate: "cenová ponuka", invoice: "faktúra" },
  post: {
    title: "Vytvoriť faktúru z cenovej ponuky",
    titleShort: "Vytvoriť faktúru",
    description: "Vytvoriť koncept faktúry z prijatej cenovej ponuky",
    form: {
      title: "Vytvoriť faktúru",
      description: "Vytvoriť faktúru z tejto cenovej ponuky",
    },
    response: {
      success: "Faktúra bola vytvorená z ponuky",
      message: "Stavová správa",
      invoiceId: "ID vytvorenej faktúry",
    },
    errors: {
      reconcile:
        "Uložené položky sa nezhodujú s celkovou sumou ponuky. Skopírujte ponuku a údaje v koncepte skontrolujte a opravte.",
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
        description: "Cenová ponuka sa nenašla",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Faktúru možno vytvoriť iba z cenovej ponuky v stave SENT alebo ACCEPTED.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny.",
      },
    },
    success: {
      title: "Úspech",
      description: "Z cenovej ponuky sa vytvorila faktúra",
    },
  },
  estimateId: {
    label: "ID cenovej ponuky",
    description: "Cenová ponuka, z ktorej chcete vystaviť faktúru",
  },
  widget: {
    back: "Späť",
    submit: "Vytvoriť faktúru",
    converted: "Z tejto cenovej ponuky sa vytvorila faktúra.",
    savedDraftNumber: "Koncept faktúry č. {{number}} bol vytvorený",
    savedDraft: "Koncept faktúry bol vytvorený",
    convertedNumber: "Vytvorené z cenovej ponuky {{number}}.",
    viewInvoice: "Otvoriť koncept faktúry",
    convertNote:
      "Vytvorí sa koncept faktúry s rovnakými položkami. Cenová ponuka sa označí ako prevedená na faktúru.",
  },
};
