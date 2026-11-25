import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Čet",
  tags: {
    files: "Súbory",
  },
  get: {
    title: "Načítať súbor",
    titleShort: "Súbor konverzácie",
    description: "Načítajte nahratý súbor",
    success: {
      title: "Súbor načítaný",
      description: "Súbor sa načítal",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Parametre požiadavky na súbor sú neplatné",
      },
      network: {
        title: "Chyba siete",
        description: "Súbor sa nepodarilo načítať pre chybu siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na prístup k tomuto súboru sa musíte prihlásiť",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie na prístup k tomuto súboru",
      },
      notFound: {
        title: "Súbor sa nenašiel",
        description: "Požadovaný súbor sa nenašiel alebo k nemu nemáte prístup",
      },
      server: {
        title: "Chyba servera",
        description: "Súbor sa nepodarilo načítať pre chybu servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Niektoré zmeny nie sú uložené",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt",
      },
    },
  },
  errors: {
    fileNotFound: "Súbor sa nenašiel alebo k nemu nemáte prístup",
  },
};
