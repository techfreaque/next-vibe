import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Čet",
  tags: {
    folders: "Priečinky",
  },
  title: "Vytvoriť priečinok",
  titleShort: "Nový priečinok",
  description: "Vytvor nový priečinok",
  config: {
    folders: {
      private: "Súkromné čety",
      shared: "Zdieľané čety",
      public: "Verejné čety",
      incognito: "Čety inkognito",
    },
  },
  sections: {
    folder: {
      title: "Podrobnosti priečinka",
      description: "Základné údaje priečinka",
      rootFolderId: {
        label: "Koreňový priečinok",
        description: "Koreňový priečinok (private, shared, public, incognito)",
      },
      name: {
        label: "Názov priečinka",
        description: "Názov priečinka",
      },
      icon: {
        label: "Ikona",
        description: "Názov ikony priečinka (lucide alebo si)",
      },
      color: {
        label: "Farba",
        description: "Hexadecimálny kód farby na odlíšenie",
      },
      parentId: {
        label: "Nadradený priečinok",
        description: "ID nadradeného priečinka pri vnorení",
      },
    },
  },
  response: {
    title: "Vytvorený priečinok",
    description: "Podrobnosti nového priečinka",
    folder: {
      title: "Priečinok",
      id: { content: "ID priečinka" },
      userId: { content: "ID používateľa" },
      rootFolderId: { content: "Koreňový priečinok" },
      name: { content: "Názov priečinka" },
      icon: { content: "Ikona" },
      color: { content: "Farba" },
      parentId: { content: "ID nadradeného priečinka" },
      expanded: { content: "Stav rozbalenia" },
      sortOrder: { content: "Poradie" },
      createdAt: { content: "Vytvorené" },
      updatedAt: { content: "Aktualizované" },
    },
  },
  errors: {
    validation: {
      title: "Chyba overenia",
      description: "Údaje priečinka sú neplatné",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Na vytváranie priečinkov sa musíš prihlásiť",
    },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Nemáš oprávnenie vytvárať priečinky",
      incognitoNotAllowed: "Priečinky inkognito nemožno vytvoriť na serveri",
    },
    notFound: {
      title: "Nenájdené",
      description: "Požadovaný zdroj sa nenašiel",
    },
    server: {
      title: "Chyba servera",
      description: "Pri vytváraní priečinka došlo k chybe",
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
  backButton: {
    label: "Späť",
  },
  submitButton: {
    label: "Vytvoriť priečinok",
    loadingText: "Vytvára sa...",
  },
  success: {
    title: "Hotovo",
    description: "Priečinok sa vytvoril",
  },
};
