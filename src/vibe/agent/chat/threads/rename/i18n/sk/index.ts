import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Čet",
  tags: {
    threads: "Vlákna",
  },
  patch: {
    title: "Premenovať konverzáciu",
    titleShort: "Premenovať konverzáciu",
    description: "Uprav názov a náhľad konverzácie",
    container: {
      title: "Premenovať konverzáciu",
      description: "Zadaj nový názov alebo náhľad konverzácie",
    },
    threadId: {
      label: "ID vlákna",
      description: "ID konverzácie, ktorú chceš premenovať",
    },
    threadTitle: {
      label: "Názov",
      description: "Nový názov konverzácie",
      placeholder: "Zadaj názov konverzácie...",
    },
    preview: {
      label: "Náhľad",
      description: "Krátky opis alebo text náhľadu konverzácie",
      placeholder: "Zadaj text náhľadu...",
    },
    response: {
      threadId: {
        content: "ID vlákna",
      },
      title: {
        content: "Názov",
      },
      preview: {
        content: "Náhľad",
      },
      updatedAt: {
        content: "Aktualizované",
      },
    },
    errors: {
      validation: {
        title: "Neplatný vstup",
        description:
          "Skontroluj, či je threadId platné UUID a či je vyplnené aspoň jedno pole",
        noActiveThread:
          "V kontexte priebežnej odpovede nie je aktívna konverzácia",
        folderUnresolved: "Nepodarilo sa určiť priečinok konverzácie",
      },
      unauthorized: {
        title: "Neprihlásený používateľ",
        description: "Ak chcete premenovať konverzáciu, prihláste sa",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáš oprávnenie premenovať túto konverzáciu",
      },
      notFound: {
        title: "Vlákno sa nenašlo",
        description: "Konverzácia s týmto ID neexistuje",
        detail: "Konverzácia sa nenašla: {{threadId}}",
      },
      server: {
        title: "Chyba servera",
        description: "Konverzáciu sa nepodarilo premenovať",
        detail: "Chyba servera: {{error}}",
      },
      network: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k serveru",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Niečo sa pokazilo",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Niektoré zmeny nie sú uložené",
      },
      conflict: {
        title: "Konflikt",
        description: "Konverzáciu medzitým upravil niekto iný",
      },
    },
    success: {
      title: "Konverzácia premenovaná",
      description: "Názov a náhľad konverzácie boli upravené",
    },
    backButton: {
      label: "Zrušiť",
    },
    submitButton: {
      label: "Uložiť",
      loadingText: "Ukladá sa...",
    },
    dynamicTitle: "Premenovať konverzáciu: {{title}}",
  },
};
