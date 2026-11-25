import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Načítať súbor",
    titleShort: "Načítať súbor",
    description:
      "Otvorí ľubovoľný súbor vrátane poznámok, vlákien, spomienok, zručností alebo úloh.",
    dynamicTitle: "Načítať {{path}}",
    status: {
      loading: "Číta sa…",
      done: "Načítané",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Cesta",
        description:
          "Cesta k súboru. Použi koreňový priečinok svojho jazyka. V slovenčine napríklad /pamäte/ alebo /dokumenty/. Príklad: /dokumenty/notes/ideas.md.",
      },
      maxLines: {
        label: "Maximálny počet riadkov",
        description: "Zobrazí najviac tento počet riadkov.",
      },
    },
    submitButton: {
      label: "Načítať",
      loadingText: "Číta sa…",
    },
    emptyFile: "Tento súbor je prázdny.",
    response: {
      path: { content: "Cesta" },
      content: { content: "Obsah" },
      size: { text: "Veľkosť" },
      truncated: { text: "Skrátené" },
      readonly: { text: "Iba na čítanie" },
      nodeType: { text: "Typ" },
      updatedAt: { content: "Aktualizované" },
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
        description: "Nemáš oprávnenie na čítanie.",
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
      conflict: { title: "Konflikt", description: "Verzie sa nezhodujú" },
    },
    success: {
      title: "Načítané",
      description: "Súbor načítaný",
    },
  },
};
