import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Zobraziť strom",
    titleShort: "Strom súborov",
    description:
      "Zobrazí štruktúru priečinkov. Pod /ssh/ ukáže počítače a prehľad pripojených úložísk. Do ďalších úrovní prejdeš cez cortex-list alebo cortex-exec.",
    dynamicTitle: "Strom {{path}}",
    status: {
      loading: "Prehľadáva sa…",
      done: "Prehľadané",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Cesta",
        description: "Začiatočný priečinok (predvolene koreňový)",
      },
      depth: {
        label: "Hĺbka",
        description: "Počet úrovní priečinkov, ktoré sa majú zobraziť",
      },
    },
    submitButton: {
      label: "Zobraziť strom",
      loadingText: "Načítava sa…",
    },
    response: {
      tree: { content: "Strom" },
      totalFiles: { text: "Súbory" },
      totalDirs: { text: "Priečinky" },
    },
    errors: {
      validation: {
        title: "Neplatný vstup",
        description: "Skontroluj cestu a hĺbku.",
      },
      network: { title: "Offline", description: "So serverom sa nedá spojiť" },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Najprv sa prihlás",
      },
      forbidden: {
        title: "Bez prístupu",
        description: "K tejto položke nemáš prístup",
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
      title: "Strom",
      description: "Štruktúra priečinkov",
    },
  },
};
