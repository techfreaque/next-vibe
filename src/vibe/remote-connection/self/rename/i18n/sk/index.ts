import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Účet",
  tags: {
    remoteConnection: "Vzdialené pripojenie",
  },
  patch: {
    title: "Premenovať túto inštanciu",
    titleShort: "Premenovať inštanciu",
    description: "Zmeniť zobrazovaný názov vlastnej inštancie",
    newInstanceId: {
      label: "Nové ID inštancie",
      description: "Nový identifikátor tejto inštancie",
      placeholder: "hermes",
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
        description: "Ak chceš premenovať túto inštanciu, prihlás sa.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Na premenovanie tejto inštancie nemáš oprávnenie.",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Identita inštancie sa nenašla.",
      },
      server: {
        title: "Chyba servera",
        description: "Nastala chyba pri premenovaní",
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
      title: "Premenované",
      description: "Inštancia má nový názov.",
    },
  },
};
