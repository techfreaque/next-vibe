import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Čet",
  tags: {
    folders: "Priečinky",
  },
  get: {
    title: "Nastavenia projektu",
    titleShort: "Projekt",
    description: "Pokyny a súbory znalostí pre projekt priečinka",
    id: {
      label: "ID priečinka",
      description: "Priečinok, ktorého údaje sa majú načítať",
    },
    response: {
      folderName: "Priečinok",
      instructions: "Pokyny",
      canManage: "Môže spravovať",
      knowledgePath: "Cesta k súboru znalostí",
      files: {
        id: "ID",
        name: "Názov",
        path: "Cesta",
        size: "Veľkosť",
        updatedAt: "Aktualizované",
      },
    },
    heading: "Projekt",
    subheading:
      "Pokyny platia pre každý čet v tomto priečinku aj v podpriečinkoch. AI môže používať súbory znalostí.",
    instructionsTitle: "Pokyny",
    noInstructions:
      "Zatiaľ bez pokynov. Zadaj, ako sa má AI v tomto priečinku správať.",
    editInstructions: "Upraviť pokyny",
    addInstructions: "Pridať pokyny",
    knowledgeTitle: "Súbory znalostí",
    noFiles:
      "Zatiaľ bez súborov znalostí. Pridaj poznámky, zadania alebo dokumenty, ktoré má AI poznať.",
    addFile: "Pridať súbor",
    removeFile: "Odobrať",
    bytes: "znakov",
    noData: "Načítava sa projekt...",
    noAccess:
      "Nastavenia projektu môžu meniť len používatelia s oprávnením upraviť priečinok.",
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
  patch: {
    title: "Upraviť pokyny projektu",
    titleShort: "Pokyny",
    description:
      "Nastav pokyny, ktorými sa má AI riadiť v každom čete tohto priečinka",
    container: {
      title: "Pokyny projektu",
      description: "Platia pre každý čet v tomto priečinku aj v podpriečinkoch",
    },
    id: {
      label: "ID priečinka",
      description: "Priečinok, ktorý sa má upraviť",
    },
    instructions: {
      label: "Pokyny",
      description:
        "Správanie AI, potrebné znalosti, tón a formát. Vyprázdnením poľa sa pokyny odstránia.",
      placeholder:
        "Napríklad: Píšeš texty k uvedeniu môjho produktu. Píš stručne a úderne. Vždy odpovedaj v bodoch.",
    },
    response: { folderId: "Priečinok", hasInstructions: "Pokyny sú aktívne" },
    backButton: { label: "Späť" },
    submitButton: { label: "Uložiť pokyny", loadingText: "Ukladá sa..." },
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
