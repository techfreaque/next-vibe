import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Čet",
  tags: {
    folders: "Priečinky",
  },
  post: {
    title: "Pridať súbor znalostí",
    titleShort: "Pridať súbor",
    description:
      "Pridaj dokument, ktorý môže AI používať v každom čete v tomto priečinku",
    container: {
      title: "Pridať súbor znalostí",
      description:
        "Uloží sa ako dokument v Cortexe. AI ho číta pomocou cortex-read a cortex-search.",
    },
    id: {
      label: "ID priečinka",
      description: "Priečinok, do ktorého sa súbor pridá",
    },
    name: {
      label: "Názov súboru",
      description: "Krátky názov. Ak chýba prípona .md, doplní sa automaticky.",
      placeholder: "launch-brief",
    },
    content: {
      label: "Obsah",
      description: "Vlož text dokumentu. Najlepšie funguje Markdown.",
    },
    response: { fileId: "ID súboru", path: "Cesta v Cortexe" },
    backButton: { label: "Späť" },
    submitButton: { label: "Pridať súbor", loadingText: "Pridáva sa..." },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Zadané údaje sú neplatné",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Musíš sa prihlásiť",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáš oprávnenie upraviť tento projekt",
      },
      notFound: {
        title: "Nenájdené",
        description: "Priečinok alebo súbor sa nenašiel",
      },
      server: {
        title: "Chyba servera",
        description: "Niečo sa pokazilo. Skús to znova.",
      },
      network: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k serveru",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Konflikt",
        description: "Projekt bol medzitým zmenený inde",
      },
      notSupported: {
        title: "Nepodporované",
        description:
          "Projekty fungujú len v súkromných a zdieľaných priečinkoch",
      },
    },
    success: {
      title: "Uložené",
      description: "Hotovo",
    },
  },
};
