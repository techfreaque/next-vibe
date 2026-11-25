import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Cenové ponuky",
  tags: { payment: "platba", estimate: "cenová ponuka", lines: "riadky" },
  post: {
    title: "Odstrániť položku cenovej ponuky",
    titleShort: "Odstrániť riadok",
    description: "Odstrániť položku z konceptu cenovej ponuky",
    form: {
      title: "Odstrániť položku cenovej ponuky",
      description: "Odstrániť túto položku z cenovej ponuky",
    },
    response: { success: "Úspech", message: "Stavová správa" },
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
      notFound: { title: "Nenašlo sa", description: "Položka sa nenašla." },
      conflict: {
        title: "Konflikt",
        description:
          "Položky možno odstraňovať iba z cenovej ponuky v stave DRAFT.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Položka odstránená",
      description: "Položka bola odstránená z cenovej ponuky",
    },
  },
  lineId: { label: "ID riadku", description: "Položka riadok odstrániť" },
  widget: {
    back: "Späť",
    submit: "Odstrániť riadok",
    removed: "Položka bola odstránená z cenovej ponuky.",
    confirmTitle: "Odstrániť túto položku?",
    confirmDescription:
      "Položka sa natrvalo odstráni z cenovej ponuky. Celkové sumy sa prepočítajú.",
    confirmButton: "Odobrať",
    cancelButton: "Zrušiť",
  },
};
