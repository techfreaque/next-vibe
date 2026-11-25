import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Čet",
  tags: {
    folders: "Priečinky",
  },

  get: {
    title: "Načítať priečinok",
    titleShort: "Podpriečinok",
    description: "Načítaj priečinok podľa ID",
    container: {
      title: "Priečinok",
      description: "Podrobnosti priečinka",
    },
    id: {
      label: "ID priečinka",
      description: "Jedinečné ID priečinka",
    },
    response: {
      folder: {
        id: { content: "ID" },
        name: { content: "Názov" },
        icon: { content: "Ikona" },
        color: { content: "Farba" },
        parentId: { content: "ID nadradeného priečinka" },
        rootFolderId: { content: "Koreňový priečinok" },
        expanded: { content: "Rozbalené" },
        sortOrder: { content: "Poradie" },
        createdAt: { content: "Vytvorené" },
        updatedAt: { content: "Aktualizované" },
      },
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Zadané údaje sú neplatné",
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
        description: "Pri načítaní priečinka nastala chyba",
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
      conflict: { title: "Konflikt", description: "Nastal konflikt" },
    },
    success: { title: "Hotovo", description: "Priečinok sa načítal" },
  },

  delete: {
    title: "Odstrániť priečinok",
    titleShort: "Odstrániť priečinok",
    description: "Odstráň priečinok podľa ID",
    container: {
      title: "Odstrániť priečinok",
      description: "Potvrď odstránenie priečinka",
    },
    id: {
      label: "ID priečinka",
      description: "Jedinečné ID priečinka, ktorý chceš odstrániť",
    },
    response: {
      id: { content: "ID" },
      name: { content: "Názov" },
      updatedAt: { content: "Odstránené" },
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Zadané údaje sú neplatné",
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
        description:
          "Priečinok sa nedá odstrániť. Môže ešte obsahovať položky.",
      },
    },
    success: { title: "Hotovo", description: "Priečinok sa odstránil" },
    backButton: { label: "Späť" },
    submitButton: {
      label: "Odstrániť priečinok",
      loadingText: "Odstraňuje sa...",
    },
  },

  errors: {
    not_implemented_on_native:
      "Funkcia {{method}} nie je dostupná v natívnej aplikácii",
  },
};
