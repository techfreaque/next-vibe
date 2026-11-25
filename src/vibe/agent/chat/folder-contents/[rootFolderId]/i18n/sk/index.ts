import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Čet",
  tags: {
    folderContents: "Obsah priečinka",
  },
  config: {
    folders: {
      private: "Súkromné",
      shared: "Zdieľané",
      public: "Verejné",
      background: "Na pozadí",
      incognito: "Inkognito",
      remote: "Vzdialené",
    },
  },
  enums: {
    userRole: {
      public: "Verejné",
      customer: "Zákazník",
      partnerAdmin: "Správca partnera",
      partnerEmployee: "Zamestnanec partnera",
      admin: "Správca",
    },
    threadStatus: {
      active: "Aktívne",
      archived: "Archivované",
      deleted: "Odstránené",
    },
  },
  get: {
    title: "Načítať obsah priečinka",
    titleShort: "Obsah priečinka",
    description:
      "Načítajte spoločný zoznam priečinkov a konverzácií na danej úrovni",
    rootFolderId: {
      label: "Koreňový priečinok",
      description: "Koreňový priečinok (súkromný, zdieľaný, verejný a ďalšie)",
    },
    subFolderId: {
      label: "Podpriečinok",
      description: "ID podpriečinka (null pre koreňovú úroveň)",
    },
    threadIds: {
      label: "ID konverzácií",
      description:
        "Filtrovať podľa konkrétnych ID konverzácií (pre výsledky vyhľadávania)",
    },
    response: {
      items: {
        item: {
          type: { content: "Typ položky" },
          sortOrder: { content: "Poradie" },
          // Folder fields
          id: { content: "ID" },
          userId: { content: "ID používateľa" },
          rootFolderId: { content: "Koreňový priečinok" },
          name: { content: "Názov" },
          icon: { content: "Ikona" },
          color: { content: "Farba" },
          parentId: { content: "Nadradený priečinok" },
          expanded: { content: "Rozbalené" },
          canManage: { content: "Môže spravovať" },
          canCreateThread: { content: "Môže vytvárať konverzácie" },
          canModerate: { content: "Môže moderovať" },
          canDelete: { content: "Môže odstraňovať" },
          canManagePermissions: { content: "Môže spravovať oprávnenia" },
          // Thread fields
          title: { content: "Názov konverzácie" },
          folderId: { content: "Priečinok" },
          status: { content: "Stav" },
          preview: { content: "Náhľad" },
          pinned: { content: "Pripnuté" },
          archived: { content: "Archivované" },
          canEdit: { content: "Môže upravovať" },
          canPost: { content: "Môže pridávať správy" },
          streamingState: { content: "Stav priebežnej odpovede" },
          activeShareCount: { content: "Aktívne odkazy na zdieľanie" },
          lastSharedAt: { content: "Naposledy zdieľané" },
          createdAt: { content: "Vytvorené" },
          updatedAt: { content: "Aktualizované" },
        },
      },
      rootFolderPermissions: {
        title: "Oprávnenia koreňového priečinka",
        description: "Oprávnenia pre koreňový priečinok",
        canCreateThread: { content: "Môže vytvárať konverzácie" },
        canCreateFolder: { content: "Môže vytvárať priečinky" },
      },
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Zadané ID priečinka je neplatné",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na zobrazenie obsahu priečinka sa musíte prihlásiť",
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
        description: "Pri načítaní obsahu priečinka nastala chyba",
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
      description: "Obsah priečinka sa načítal",
    },
    backButton: {
      label: "Späť",
    },
  },
};
