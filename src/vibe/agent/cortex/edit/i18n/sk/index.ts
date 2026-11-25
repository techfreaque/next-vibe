import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  patch: {
    title: "Upraviť súbor",
    titleShort: "Upraviť súbor",
    description:
      "Upraví časť súboru. Môžeš nahradiť vyhľadaný text alebo upraviť konkrétne riadky.",
    dynamicTitle: "Upravené: {{path}}",
    status: {
      loading: "Upravuje sa…",
      done: "Upravené",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Cesta",
        description: "Cesta k súboru, ktorý chceš upraviť",
      },
      find: {
        label: "Nájsť",
        description: "Text, ktorý sa má nájsť",
      },
      replace: {
        label: "Nahradiť",
        description: "Nový text, ktorý nahradí pôvodný",
      },
      startLine: {
        label: "Od riadka",
        description: "Číslo prvého riadka",
      },
      endLine: {
        label: "Po riadok",
        description: "Číslo posledného riadka",
      },
      newContent: {
        label: "Nový obsah",
        description: "Nový obsah, ktorý nahradí vybraté riadky",
      },
    },
    submitButton: {
      label: "Použiť",
      loadingText: "Zmeny sa ukladajú…",
    },
    response: {
      path: { content: "Cesta" },
      size: { text: "Veľkosť" },
      replacements: { text: "Zmeny" },
      updatedAt: { content: "Aktualizované" },
    },
    errors: {
      validation: {
        title: "Neplatný vstup",
        description: "Skontroluj cestu, hľadaný text a náhradu.",
      },
      network: { title: "Offline", description: "So serverom sa nedá spojiť" },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Najprv sa prihlás",
      },
      forbidden: {
        title: "Bez prístupu",
        description: "Túto položku nemôžeš upraviť",
      },
      notFound: { title: "Nenašlo sa", description: "Súbor neexistuje" },
      findNotFound:
        "Text „{{snippet}}“ sa v {{path}} nenašiel. Načítaj súbor cez cortex-read a skús znova s presným textom.",
      lineRangeOutOfBounds:
        "Rozsah od riadka {{startLine}} po {{endLine}} je mimo súboru. Počet riadkov v súbore: {{lineCount}}.",
      missingEditStrategy:
        "Zadaj find a replace alebo startLine, endLine a newContent. Prijaté polia: {{provided}}.",
      noParamsProvided: "nič",
      server: { title: "Chyba servera", description: "Niečo sa pokazilo." },
      unknown: { title: "Chyba", description: "Niečo sa pokazilo." },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Najprv ulož alebo zahoď zmeny.",
      },
      conflict: {
        title: "Konflikt",
        description: "Súbor sa počas úpravy zmenil.",
      },
    },
    success: {
      title: "Upravené",
      description: "Zmeny uložené",
    },
  },
};
