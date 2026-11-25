import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    viewType: {
      calendar: "Kalendár",
      grid: "Mriežka",
      kanban: "Kanban",
      list: "Zoznam",
      wiki: "Wiki",
    },
  },
  post: {
    title: "Nový priečinok",
    titleShort: "Nový priečinok",
    description: "Vytvorí priečinok.",
    dynamicTitle: "Vytvorené: {{path}}",
    status: {
      loading: "Vytvára sa…",
      done: "Vytvorené",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Cesta",
        description:
          "Cesta k priečinku. Použi koreňový priečinok svojho jazyka. V slovenčine napríklad /dokumenty/projects/my-app.",
      },
      viewType: {
        label: "Zobraziť",
        description:
          "Spôsob zobrazenia (zoznam, kanban, kalendár alebo mriežka)",
      },
      createParents: {
        label: "Vytvoriť priečinky",
        description: "Vytvoriť aj chýbajúce nadradené priečinky",
      },
    },
    submitButton: {
      label: "Vytvoriť",
      loadingText: "Vytvára sa…",
    },
    response: {
      path: { content: "Cesta" },
      created: { text: "Vytvorené" },
      alreadyExists: { text: "Už existuje" },
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
        description: "Na tejto ceste nemôžeš vytvárať priečinky.",
      },
      notFound: {
        title: "Chýba nadradený priečinok",
        description: "Nadradený priečinok neexistuje",
      },
      server: { title: "Chyba servera", description: "Niečo sa pokazilo." },
      unknown: { title: "Chyba", description: "Niečo sa pokazilo." },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Najprv ulož alebo zahoď zmeny.",
      },
      conflict: {
        title: "Už existuje",
        description: "Priečinok už existuje.",
      },
    },
    success: {
      title: "Vytvorené",
      description: "Priečinok pripravený",
    },
  },
};
