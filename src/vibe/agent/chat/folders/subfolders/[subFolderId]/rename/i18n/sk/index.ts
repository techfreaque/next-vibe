import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Čet",
  tags: {
    folders: "Priečinky",
  },

  patch: {
    title: "Premenovať priečinok",
    titleShort: "Premenovať priečinok",
    description: "Premenuj existujúci priečinok",
    id: {
      label: "ID priečinka",
      description: "Jedinečné ID priečinka, ktorý chceš premenovať",
    },
    name: {
      label: "Názov",
      description: "Nový názov priečinka",
    },
    icon: {
      label: "Ikona",
      description: "Názov ikony Lucide alebo Simple Icons",
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
        description: "Na premenovanie priečinkov sa musíš prihlásiť",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáš oprávnenie premenovať tento priečinok",
      },
      notFound: {
        title: "Nenájdené",
        description: "Požadovaný priečinok sa nenašiel",
      },
      server: {
        title: "Chyba servera",
        description: "Pri premenovaní priečinka došlo k chybe",
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
      description: "Priečinok sa premenoval",
    },
    backButton: {
      label: "Späť",
    },
    submitButton: {
      label: "Premenovať",
      loadingText: "Premenúva sa...",
    },
  },
};
