import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Čet",
  tags: {
    folders: "Priečinky",
  },
  enums: {
    userRole: {
      public: "Verejné",
      customer: "Zákazník",
      partnerAdmin: "Správca partnera",
      partnerEmployee: "Zamestnanec partnera",
      admin: "Správca",
    },
  },

  patch: {
    title: "Upraviť priečinok",
    titleShort: "Upraviť priečinok",
    description: "Uprav existujúci priečinok",
    container: {
      title: "Upraviť priečinok",
      description: "Zmeň vlastnosti priečinka",
    },
    id: {
      label: "ID priečinka",
      description: "Jedinečné ID priečinka, ktorý chceš upraviť",
    },
    sections: {
      updates: {
        title: "Zmeny priečinka",
        description: "Polia na úpravu",
      },
    },
    name: {
      label: "Názov",
      description: "Názov priečinka",
    },
    icon: {
      label: "Ikona",
      description: "Názov ikony Lucide alebo Simple Icons",
    },
    color: {
      label: "Farba",
      description: "Hexadecimálny kód farby na odlíšenie",
    },
    parentId: {
      label: "Nadradený priečinok",
      description:
        "Presuň priečinok pod iný nadradený priečinok. Hodnota null znamená presun do koreňového priečinka.",
    },
    expanded: {
      label: "Rozbalené",
      description: "Určuje, či sa priečinok v rozhraní zobrazí rozbalený",
    },
    sortOrder: {
      label: "Poradie",
      description: "Poradie priečinkov",
    },
    pinned: {
      label: "Pripnuté",
      description: "Pripni tento priečinok navrch bočného panela",
    },
    rolesView: {
      label: "Roly na zobrazenie",
      description: "Roly, ktoré môžu zobraziť tento priečinok",
    },
    rolesManage: {
      label: "Roly na správu",
      description: "Roly, ktoré môžu spravovať nastavenia priečinka",
    },
    rolesCreateThread: {
      label: "Roly na vytváranie konverzácií",
      description: "Roly, ktoré môžu v tomto priečinku vytvárať konverzácie",
    },
    rolesPost: {
      label: "Roly na pridávanie správ",
      description: "Roly, ktoré môžu pridávať správy",
    },
    rolesModerate: {
      label: "Roly na moderovanie",
      description: "Roly, ktoré môžu moderovať obsah",
    },
    rolesAdmin: {
      label: "Správcovské roly",
      description: "Roly s úplným správcovským prístupom",
    },
    response: {
      folder: {
        id: {
          content: "ID",
        },
        updatedAt: {
          content: "Aktualizované",
        },
      },
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Zadané údaje sú neplatné",
        circularReference: "Priečinok nemôže byť nadradený sám sebe",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na úpravu priečinkov sa musíš prihlásiť",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáš oprávnenie upraviť tento priečinok",
      },
      notFound: {
        title: "Nenájdené",
        description: "Požadovaný priečinok sa nenašiel",
      },
      server: {
        title: "Chyba servera",
        description: "Pri úprave priečinka došlo k chybe",
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
        description: "Priečinok s týmto názvom už existuje",
      },
    },
    success: {
      title: "Hotovo",
      description: "Priečinok sa upravil",
    },
    backButton: {
      label: "Späť",
    },
    submitButton: {
      label: "Aktualizovať",
      loadingText: "Upravujú sa oprávnenia…",
    },
  },
};
