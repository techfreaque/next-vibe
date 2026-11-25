import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Čet",
  tags: {
    folders: "Priečinky",
  },
  delete: {
    title: "Odobrať súbor znalostí",
    titleShort: "Odobrať súbor",
    description: "Odober súbor znalostí z projektu priečinka",
    container: {
      title: "Odobrať súbor znalostí",
      description: "AI už tento súbor v tomto priečinku neuvidí.",
    },
    id: {
      label: "ID priečinka",
      description: "Priečinok, do ktorého patrí súbor",
    },
    fileId: { label: "ID súboru", description: "Súbor, ktorý sa má odobrať" },
    response: { removedPath: "Odobraté" },
    backButton: { label: "Späť" },
    submitButton: { label: "Odobrať súbor", loadingText: "Odoberá sa..." },
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
