import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Čet",
  tags: {
    folders: "Priečinky",
  },

  patch: {
    title: "Presunúť priečinok",
    titleShort: "Presunúť priečinok",
    description: "Presuň priečinok pod iný nadradený priečinok",
    id: {
      label: "ID priečinka",
      description: "Jedinečné ID priečinka, ktorý chceš presunúť",
    },
    parentId: {
      label: "Nadradený priečinok",
      description:
        "Presuň priečinok pod iný nadradený priečinok. Hodnota null znamená presun do koreňového priečinka.",
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
        description: "Na presun priečinkov sa musíš prihlásiť",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáš oprávnenie presunúť tento priečinok",
      },
      notFound: {
        title: "Nenájdené",
        description: "Požadovaný priečinok sa nenašiel",
      },
      server: {
        title: "Chyba servera",
        description: "Pri presúvaní priečinka došlo k chybe",
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
        description: "Priečinok sa na toto miesto nedá presunúť",
      },
    },
    success: {
      title: "Hotovo",
      description: "Priečinok sa presunul",
    },
    backButton: { label: "Späť" },
    submitButton: { label: "Presunúť priečinok", loadingText: "Presúva sa..." },
  },
  widget: {
    moveFolder: {
      description: "Vyber cieľový priečinok",
      rootLevel: "(najvyššia úroveň)",
    },
  },
};
