import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Zapísať súbor",
    titleShort: "Zapísať súbor",
    description: "Uloží súbor na zadanú cestu a zapíše jeho obsah.",
    dynamicTitle: "Uložené: {{path}}",
    status: {
      loading: "Zapisuje sa…",
      done: "Uložené",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Cesta",
        description:
          "Cesta k súboru. Použi koreňový priečinok svojho jazyka. V slovenčine napríklad /dokumenty/notes/ideas.md.",
      },
      content: {
        label: "Obsah",
        description: "Obsah súboru vo formáte Markdown",
      },
      createParents: {
        label: "Vytvoriť priečinky",
        description: "Vytvorí chýbajúce priečinky v zadanej ceste.",
      },
    },
    submitButton: {
      label: "Uložiť",
      loadingText: "Ukladá sa…",
    },
    response: {
      path: { content: "Cesta" },
      size: { text: "Veľkosť" },
      created: { text: "Nový súbor" },
      updated: { text: "Aktualizované" },
      updatedAt: { content: "Aktualizované" },
      content: { content: "Obsah" },
    },
    errors: {
      validation: {
        title: "Neplatný vstup",
        description: "Skontroluj cestu a obsah.",
      },
      network: { title: "Offline", description: "So serverom sa nedá spojiť" },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Najprv sa prihlás",
      },
      forbidden: {
        title: "Iba na čítanie",
        description: "Do tejto cesty sa nedá zapisovať",
      },
      notFound: {
        title: "Chýbajúci priečinok",
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
        description: "Niečo tam už je.",
      },
    },
    success: {
      title: "Uložené",
      description: "Súbor sa uložil.",
    },
  },
};
