import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Hľadať",
    titleShort: "Hľadať súbory",
    description: "Vyhľadáva vo všetkých súboroch podľa názvu alebo obsahu.",
    dynamicTitle: "Hľadať: {{query}}",
    status: {
      loading: "Vyhľadáva sa…",
      done: "Nájdené",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      query: {
        label: "Hľadať",
        description: "Čo hľadať",
      },
      path: {
        label: "V priečinku",
        description:
          "Obmedzí vyhľadávanie na tento priečinok. Predvolene sa hľadá všade.",
      },
      maxResults: {
        label: "Limit",
        description: "Počet výsledkov (predvolene 20)",
      },
    },
    submitButton: {
      label: "Hľadať",
      loadingText: "Vyhľadáva sa…",
    },
    noResults: "Nenašli sa žiadne výsledky",
    response: {
      query: { content: "Vyhľadané" },
      results: {
        path: { content: "Cesta" },
        name: { content: "Názov" },
        nodeType: { text: "Typ" },
        excerpt: { content: "Zhoda" },
        score: { text: "Skóre" },
        updatedAt: { content: "Aktualizované" },
      },
      total: { text: "Nájdené" },
      searchMode: { text: "Režim" },
    },
    errors: {
      validation: {
        title: "Neplatný vstup",
        description: "Skontroluj hľadaný text",
      },
      network: { title: "Offline", description: "So serverom sa nedá spojiť" },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Najprv sa prihlás",
      },
      forbidden: {
        title: "Bez prístupu",
        description: "V tomto priečinku nemáš oprávnenie vyhľadávať",
      },
      notFound: { title: "Nenašlo sa", description: "Priečinok neexistuje" },
      server: { title: "Chyba servera", description: "Niečo sa pokazilo." },
      unknown: { title: "Chyba", description: "Niečo sa pokazilo." },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Najprv ulož alebo zahoď zmeny.",
      },
      conflict: { title: "Konflikt", description: "Skús to znova." },
    },
    success: {
      title: "Hotovo",
      description: "Vyhľadávanie sa dokončilo",
    },
  },
};
