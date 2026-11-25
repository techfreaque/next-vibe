import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Presunúť",
    titleShort: "Presunúť súbor",
    description: "Presunie alebo premenuje súbor či priečinok.",
    dynamicTitle: "{{from}} → {{to}}",
    status: {
      loading: "Presúva sa…",
      done: "Presunuté",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      from: {
        label: "Od",
        description: "Aktuálna cesta",
      },
      to: {
        label: "Do",
        description: "Nová cesta",
      },
    },
    submitButton: {
      label: "Presunúť",
      loadingText: "Presúva sa…",
    },
    response: {
      from: { content: "Od" },
      to: { content: "Do" },
      nodesAffected: { text: "Presunuté" },
    },
    errors: {
      validation: {
        title: "Neplatný vstup",
        description: "Skontroluj obe cesty.",
      },
      network: { title: "Offline", description: "So serverom sa nedá spojiť" },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Najprv sa prihlás",
      },
      forbidden: {
        title: "Bez prístupu",
        description: "Túto položku nemôžeš presunúť",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Na zdrojovej ceste sa nič nenašlo.",
      },
      server: { title: "Chyba servera", description: "Niečo sa pokazilo." },
      unknown: { title: "Chyba", description: "Niečo sa pokazilo." },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Najprv ulož alebo zahoď zmeny.",
      },
      conflict: {
        title: "Presun zablokovaný",
        description: "Na cieľovej ceste už existuje položka.",
      },
    },
    success: {
      title: "Presunuté",
      description: "Hotovo",
    },
  },
};
