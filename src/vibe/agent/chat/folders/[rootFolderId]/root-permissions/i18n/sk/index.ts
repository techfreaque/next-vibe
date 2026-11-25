import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Čet",
  tags: {
    folders: "Priečinky",
  },

  get: {
    title: "Zobraziť oprávnenia koreňového priečinka",
    titleShort: "Prístup k priečinku",
    description: "Vypočíta oprávnenia pre koreňový priečinok",
    container: {
      title: "Oprávnenia koreňového priečinka",
      description: "Zobrazte oprávnenia koreňových priečinkov",
    },
    rootFolderId: {
      label: "Koreňový priečinok",
      description: "ID koreňového priečinka na kontrolu oprávnení",
      options: {
        private: "Súkromné",
        shared: "Zdieľané",
        public: "Verejné",
        background: "Na pozadí",
        incognito: "Inkognito",
        remote: "Vzdialené",
      },
    },
    response: {
      canCreateThread: {
        content: "Môže vytvárať konverzácie",
      },
      canCreateFolder: {
        content: "Môže vytvárať priečinky",
      },
    },
    success: {
      title: "Hotovo",
      description: "Oprávnenia koreňového priečinka sa úspešne načítali",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Zadané ID koreňového priečinka je neplatné",
      },
      network: {
        title: "Chyba siete",
        description: "K serveru sa nepodarilo pripojiť",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chcete skontrolovať oprávnenia, prihláste sa",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie pristupovať k tomuto zdroju",
      },
      notFound: {
        title: "Nenájdené",
        description: "Koreňový priečinok sa nenašiel",
      },
      server: {
        title: "Chyba servera",
        description: "Vyskytla sa interná chyba servera",
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
        description: "Nastal konflikt",
      },
    },
  },
};
