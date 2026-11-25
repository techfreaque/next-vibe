import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  delete: {
    title: "Odstrániť",
    titleShort: "Odstrániť súbor",
    description:
      "Natrvalo odstráni súbor alebo priečinok. Odstránenie sa nedá vrátiť.",
    dynamicTitle: "Odstránené: {{path}}",
    status: {
      loading: "Odstraňuje sa…",
      done: "Odstránené",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Cesta",
        description: "Položka na odstránenie",
      },
      recursive: {
        label: "Odstrániť aj obsah",
        description: "Odstráni aj všetok obsah priečinka.",
      },
    },
    submitButton: {
      label: "Odstrániť",
      loadingText: "Odstraňuje sa…",
    },
    response: {
      path: { content: "Cesta" },
      nodesDeleted: { text: "Odstránené" },
    },
    errors: {
      validation: { title: "Neplatný vstup", description: "Skontroluj cestu." },
      network: { title: "Offline", description: "So serverom sa nedá spojiť" },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Najprv sa prihlás",
      },
      forbidden: {
        title: "Bez prístupu",
        description: "Túto položku nemôžeš odstrániť.",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Na tejto ceste sa nič nenašlo.",
      },
      server: { title: "Chyba servera", description: "Niečo sa pokazilo." },
      unknown: { title: "Chyba", description: "Niečo sa pokazilo." },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Najprv ulož alebo zahoď zmeny.",
      },
      conflict: {
        title: "Priečinok nie je prázdny",
        description:
          "Priečinok obsahuje položky. Ak ich chceš tiež odstrániť, použi možnosť Odstrániť aj obsah.",
      },
    },
    success: {
      title: "Odstránené",
      description: "Položka bola odstránená.",
    },
  },
};
