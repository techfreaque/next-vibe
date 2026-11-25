import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Účet",
  tags: {
    remoteConnection: "Vzdialené pripojenie",
  },
  get: {
    title: "ID tejto inštancie",
    titleShort: "ID inštancie",
    description: "Zobraziť identifikátor vlastnej inštancie na tomto zariadení",
    instanceId: {
      label: "ID inštancie",
      description: "Identifikátor tejto inštancie",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Neplatné parametre požiadavky",
      },
      network: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k serveru",
      },
      unauthorized: {
        title: "Neprihlásený používateľ",
        description: "Ak chceš zobraziť ID tejto inštancie, prihlás sa.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Na zobrazenie ID tejto inštancie nemáš oprávnenie.",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Identita inštancie sa nenašla.",
      },
      server: {
        title: "Chyba servera",
        description: "ID inštancie sa nepodarilo načítať.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máš neuložené zmeny.",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt",
      },
    },
    success: {
      title: "ID inštancie",
      description: "ID tejto inštancie sa zistilo.",
    },
  },
};
