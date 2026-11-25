import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Zobraziť obsah priečinka",
    titleShort: "Zobraziť súbory",
    description: "Zobrazí obsah priečinka.",
    dynamicTitle: "Obsah priečinka {{path}}",
    status: {
      loading: "Načítava sa zoznam…",
      done: "Obsah načítaný",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Cesta",
        description:
          "Priečinok, ktorého obsah chceš zobraziť. /ssh zobrazí všetky počítače. /ssh/<name>/ zobrazí súbory alebo pripojené úložiská. /ssh/<name>/<mount>/ zobrazí obsah pripojeného úložiska.",
      },
    },
    submitButton: {
      label: "Prehliadať",
      loadingText: "Načítava sa…",
    },
    emptyState: "Tento priečinok je prázdny",
    folderNames: {
      memories: "Spomienky",
      documents: "Dokumenty",
      threads: "Vlákna",
      skills: "Zručnosti",
      tasks: "Úlohy",
      uploads: "Nahrané súbory",
      searches: "Vyhľadávania",
      gens: "Generované médiá",
      favorites: "Obľúbené",
      inbox: "Doručené",
      projects: "Projekty",
      knowledge: "Vedomosti",
      journal: "Denník",
      templates: "Šablóny",
      identity: "Identita",
      expertise: "Odborné znalosti",
      context: "Kontext",
    },
    response: {
      path: { content: "Cesta" },
      entries: {
        name: { content: "Názov" },
        path: { content: "Cesta" },
        nodeType: { text: "Typ" },
        size: { text: "Veľkosť" },
        updatedAt: { content: "Aktualizované" },
      },
      total: { text: "Spolu" },
      writable: { text: "Povolený zápis" },
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
        description: "Nemáš prístup k tomuto priečinku",
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
      title: "Obsah načítaný",
      description: "Obsah priečinka",
    },
  },
};
