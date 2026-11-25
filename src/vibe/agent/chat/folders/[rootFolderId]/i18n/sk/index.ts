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
  widget: {
    config: {
      foldersShort: {
        private: "Súkromné",
        shared: "Zdieľané",
        public: "Verejné",
        incognito: "Inkognito",
        cron: "Na pozadí",
        support: "Podpora",
        remote: "Vzdialené",
      },
    },
    folderList: {
      menu: "Akcie priečinka",
      newChatInFolder: "Nový čet v priečinku",
      moveUp: "Posunúť nahor",
      moveDown: "Posunúť nadol",
      newSubfolder: "Nový podpriečinok",
      managePermissions: "Spravovať oprávnenia",
      projectSettings: "Nastavenia projektu",
      renameFolder: "Premenovať priečinok",
      moveToFolder: "Presunúť do priečinka",
      deleteFolder: "Odstrániť priečinok",
      deleteDialog: {
        title: "Odstrániť priečinok",
        description: "Chcete odstrániť priečinok „{{folderName}}“?",
      },
      pinned: "Pripnuté",
      pin: "Pripnúť",
      unpin: "Odopnúť",
      today: "Dnes",
      lastWeek: "Posledných 7 dní",
      lastMonth: "Posledných 30 dní",
      older: "Staršie",
      showMore: "Zobraziť viac",
    },
    renameFolder: {
      title: "Premenovať priečinok",
    },
    moveFolder: {
      title: "Presunúť priečinok",
    },
    newFolder: {
      title: "Vytvoriť priečinok",
    },
    project: {
      dialogTitle: "Nastavenia projektu",
    },
    permissions: {
      folderTitle: "Oprávnenia priečinka",
    },
    accessModal: {
      title: "Vyžaduje sa účet",
      privateTitle: "Súkromné konverzácie",
      sharedTitle: "Zdieľané konverzácie",
      publicTitle: "Verejné fórum",
      incognitoTitle: "Režim inkognito",
      privateExplanation:
        "Súkromné konverzácie sú váš priestor na rozhovory s AI. Bezpečne ich ukladáme na serveroch a automaticky ich synchronizujeme medzi vašimi zariadeniami.",
      sharedExplanation:
        "Zdieľané konverzácie môžete sprístupniť ostatným bezpečným odkazom. Môžete tak spolupracovať alebo zdieľať poznatky s tímom a priateľmi.",
      publicExplanation:
        "Verejné fórum je otvorený priestor na rozhovory ľudí aj AI. Sami rozhodujete, čo si prečítate. Odstraňujeme len obsah, ktorý porušuje zákon alebo naše podmienky. Podeľte sa o nápady, spochybnite zaužívané názory alebo sa zapojte do diskusie bez cenzúry.",
      incognitoExplanation:
        "V režime inkognito sa vaše konverzácie ukladajú len v prehliadači. Neposielajú sa na naše servery a nepriraďujú sa k účtu. Vygenerované médiá sa z technických dôvodov ukladajú dočasne.",
      requiresAccount:
        "Ak chcete otvoriť priečinok „{{folderName}}“, vytvorte si účet alebo sa prihláste.",
      loginButton: "Prihlásiť sa",
      signupButton: "Vytvoriť účet",
      close: "Zavrieť",
    },
    actions: {
      rename: "Premenovať",
      moveToFolder: "Presunúť do priečinka",
      pin: "Pripnúť",
      unpin: "Odopnúť",
    },
    threadList: {
      deleteDialog: {
        title: "Odstrániť konverzáciu",
        description: "Chcete odstrániť konverzáciu „{{title}}“?",
      },
    },
    sharedThread: {
      noLinks: "Zatiaľ bez zdieľania. Ťuknutím ju môžeš zdieľať.",
      linkCount: "Počet aktívnych odkazov: {{count}}",
      shareAction: "Zdieľať",
      moveToShared: "Presunúť do zdieľaných",
    },
    common: {
      cancel: "Zrušiť",
      delete: "Odstrániť",
      noChatsFound: "Nenašli sa žiadne konverzácie",
      noResults: "Žiadne konverzácie nezodpovedajú filtrom",
      searchPlaceholder: "Hľadať...",
      privateChats: "Súkromné konverzácie",
      sharedChats: "Zdieľané konverzácie",
      publicChats: "Verejné konverzácie",
      incognitoChats: "Konverzácie inkognito",
      newChat: "Nová konverzácia",
      newPrivateChat: "Súkromná konverzácia",
      newSharedChat: "Zdieľaná konverzácia",
      newPublicChat: "Verejná konverzácia",
      newIncognitoChat: "Konverzácia inkognito",
      newPrivateFolder: "Nový súkromný priečinok",
      newSharedFolder: "Nový zdieľaný priečinok",
      newPublicFolder: "Nový verejný priečinok",
      newIncognitoFolder: "Nový priečinok inkognito",
      newFolder: "Nový priečinok",
    },
  },
  errors: {
    not_implemented_on_native:
      "Funkcia {{method}} nie je v natívnej aplikácii dostupná. Použite webovú verziu.",
  },
  config: {
    folders: {
      private: "Súkromné",
      shared: "Zdieľané",
      public: "Verejné",
      background: "Na pozadí",
      incognito: "Inkognito",
      support: "Podpora",
      remote: "Vzdialené",
    },
  },
  get: {
    title: "Načítať priečinky",
    titleShort: "Priečinky",
    description: "Načítaj všetky priečinky v danom koreňovom priečinku",
    rootFolderId: {
      label: "Koreňový priečinok",
      description:
        "Koreňový priečinok na načítanie (private, shared, public, background, incognito)",
    },
    container: {
      title: "Podrobnosti priečinka",
      description: "Zobraz informácie o priečinku",
    },
    id: {
      label: "ID priečinka",
      description: "Jedinečné ID priečinka",
    },
    response: {
      title: "Priečinky",
      description: "Zoznam priečinkov s oprávneniami",
      rootFolderPermissions: {
        title: "Oprávnenia koreňového priečinka",
        description: "Oprávnenia pre koreňový priečinok",
        canCreateThread: {
          content: "Môže vytvárať konverzácie",
        },
        canCreateFolder: {
          content: "Môže vytvárať priečinky",
        },
      },
      folders: {
        folder: {
          id: { content: "ID" },
          userId: { content: "ID používateľa" },
          name: { content: "Názov" },
          icon: { content: "Ikona" },
          color: { content: "Farba" },
          parentId: { content: "Nadradený priečinok" },
          expanded: { content: "Rozbalené" },
          sortOrder: { content: "Poradie" },
          rootFolderId: {
            content: "Koreňový priečinok",
          },
          canManage: {
            content: "Môže spravovať",
          },
          canCreateThread: {
            content: "Môže vytvárať konverzácie",
          },
          canModerate: {
            content: "Môže moderovať",
          },
          canDelete: {
            content: "Môže odstraňovať",
          },
          canManagePermissions: {
            content: "Môže spravovať oprávnenia",
          },
          createdAt: {
            content: "Vytvorené",
          },
          updatedAt: {
            content: "Aktualizované",
          },
        },
      },
      folder: {
        title: "Priečinok",
        id: {
          content: "ID",
        },
        userId: {
          content: "ID používateľa",
        },
        name: {
          content: "Názov",
        },
        icon: {
          content: "Ikona",
        },
        color: {
          content: "Farba",
        },
        parentId: {
          content: "Nadradený priečinok",
        },
        expanded: {
          content: "Rozbalené",
        },
        sortOrder: {
          content: "Poradie",
        },
        metadata: {
          content: "Metadáta",
        },
        createdAt: {
          content: "Vytvorené",
        },
        updatedAt: {
          content: "Aktualizované",
        },
      },
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Zadané ID priečinka je neplatné",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na zobrazenie priečinkov sa musíš prihlásiť",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie zobraziť tento priečinok",
      },
      notFound: {
        title: "Nenájdené",
        description: "Požadovaný priečinok sa nenašiel",
      },
      server: {
        title: "Chyba servera",
        description: "Pri načítaní priečinka došlo k chybe",
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
        description: "Pri spracovaní požiadavky došlo ku konfliktu",
      },
    },
    success: {
      title: "Hotovo",
      description: "Priečinok sa načítal",
    },
  },
  patch: {
    title: "Upraviť priečinok",
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
    metadata: {
      label: "Metadáta",
      description: "Ďalšie metadáta priečinka",
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
      title: "Upravený priečinok",
      description: "Podrobnosti upraveného priečinka",
      folder: {
        title: "Priečinok",
        id: {
          content: "ID",
        },
        userId: {
          content: "ID používateľa",
        },
        name: {
          content: "Názov",
        },
        icon: {
          content: "Ikona",
        },
        color: {
          content: "Farba",
        },
        parentId: {
          content: "Nadradený priečinok",
        },
        expanded: {
          content: "Rozbalené",
        },
        sortOrder: {
          content: "Poradie",
        },
        metadata: {
          content: "Metadáta",
        },
        createdAt: {
          content: "Vytvorené",
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
  },
  delete: {
    title: "Odstrániť priečinok",
    description: "Odstráň priečinok aj celý jeho obsah",
    container: {
      title: "Odstrániť priečinok",
      description: "Natrvalo odstráň priečinok",
    },
    id: {
      label: "ID priečinka",
      description: "Jedinečné ID priečinka, ktorý chceš odstrániť",
    },
    response: {
      title: "Výsledok odstránenia",
      description: "Potvrdenie odstránenia priečinka",
      success: {
        content: "Hotovo",
      },
      deletedFolderId: {
        content: "ID odstráneného priečinka",
      },
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Zadané ID priečinka je neplatné",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na odstránenie priečinkov sa musíš prihlásiť",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáš oprávnenie odstrániť tento priečinok",
      },
      notFound: {
        title: "Nenájdené",
        description: "Požadovaný priečinok sa nenašiel",
      },
      server: {
        title: "Chyba servera",
        description: "Pri odstraňovaní priečinka došlo k chybe",
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
        description: "Priečinok s aktívnym obsahom nemožno odstrániť",
      },
    },
    success: {
      title: "Hotovo",
      description: "Priečinok sa odstránil",
    },
  },
  post: {
    errors: {
      forbidden: {
        title: "Prístup zamietnutý",
        incognitoNotAllowed: "Režim inkognito nepodporuje priečinky",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
      },
      server: {
        title: "Chyba servera",
      },
    },
  },
};
