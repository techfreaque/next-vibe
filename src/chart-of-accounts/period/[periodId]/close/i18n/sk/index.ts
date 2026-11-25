import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Uzavrieť obdobie",
    titleShort: "Uzavrieť obdobie",
    description:
      "Uzavrieť účtovné obdobie. V období nesmú zostať účtovné zápisy v stave DRAFT.",
    periodId: {
      label: "ID obdobia",
      description: "Vyberte obdobie, ktoré chcete uzavrieť.",
      placeholder: "UUID účtovného obdobia",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Identifikátor obdobia je neplatný.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Uzavretie období vyžaduje rolu účtovníka",
      },
      server: {
        title: "Chyba servera",
        description: "Obdobie sa nepodarilo uzavrieť.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      conflict: {
        title: "V období sú nezaúčtované návrhy",
        description: "Pred uzavretím zaúčtujte všetky účtovné zápisy",
      },
      network: {
        title: "Chyba siete",
        description: "Server sa nepodarilo kontaktovať",
      },
      notFound: { title: "Nenašlo sa", description: "Obdobie sa nenašlo." },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Obdobie je uzavreté",
      description: "Účtovné obdobie sa uzavrelo.",
    },
    widget: {
      closeNamed: "Uzavrieť obdobie {{name}}",
      draftCount: "Nezaúčtované návrhy",
      closedLabel: "Uzavreté",
      failedLabel: "Zlyhalo",
      confirmTitle: "Chcete uzavrieť účtovné obdobie?",
      confirmDescription:
        "Uzavretie obdobia je trvalé. Do uzavretého obdobia už nemožno účtovať nové zápisy.",
      confirmButton: "Áno, uzavrieť obdobie",
      cancelButton: "Zrušiť",
    },
  },
  title: "Uzavrieť obdobie",
  description: "Uzavrite účtovné obdobie.",
  category: "Účtový rozvrh",
  tag: "Obdobie",
};
