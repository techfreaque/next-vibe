import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Čet",
  tags: {
    folders: "Priečinky",
    permissions: "Oprávnenia",
  },
  get: {
    title: "Zobraziť oprávnenia priečinka",
    titleShort: "Prístup k priečinku",
    description: "Načíta zoznam moderátorov konkrétneho priečinka",
    noData: "Žiadne údaje nie sú dostupné",
    edit: "Upraviť",
    about: "O oprávneniach",
    inheritFromParent: "Preberá z nadradeného priečinka",
    container: {
      title: "Oprávnenia priečinka",
      description: "Zobrazte a spravujte oprávnenia na prístup k priečinku",
    },
    id: {
      label: "ID priečinka",
      description: "Jedinečné ID priečinka",
    },
    response: {
      title: "Oprávnenia priečinka",
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
      moderatorIds: {
        title: "ID moderátorov",
        description: "ID používateľov, ktorí môžu moderovať tento priečinok",
        content: "ID používateľa",
      },
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Zadané údaje sú neplatné",
      },
      network: {
        title: "Chyba siete",
        description: "Pri načítavaní oprávnení priečinka nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chcete zobraziť oprávnenia priečinka, prihláste sa",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie zobraziť oprávnenia tohto priečinka",
      },
      notFound: {
        title: "Nenájdené",
        description: "Požadovaný priečinok sa nenašiel",
      },
      server: {
        title: "Chyba servera",
        description: "Pri načítavaní oprávnení priečinka nastala chyba",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neznáma chyba",
      },
      unsaved: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt s aktuálnym stavom",
      },
    },
    success: {
      title: "Hotovo",
      description: "Oprávnenia priečinka sa úspešne načítali",
    },
    backButton: { label: "Späť" },
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
    title: "Upraviť oprávnenia priečinka",
    titleShort: "Prístup k priečinku",
    description: "Upraví zoznam moderátorov konkrétneho priečinka",
    container: {
      title: "Upraviť oprávnenia priečinka",
      description: "Upravte oprávnenia na prístup k priečinku",
    },
    id: {
      label: "ID priečinka",
      description: "Jedinečné ID priečinka, ktorý chceš upraviť",
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
    permissions: {
      title: "Úprava oprávnení",
      moderatorIds: {
        label: "ID moderátorov",
        description: "ID používateľov, ktorí môžu moderovať tento priečinok",
      },
    },
    response: {
      title: "Upravené oprávnenia",
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
      message: {
        content: "Oprávnenia priečinka sa úspešne upravili",
      },
      moderatorIds: {
        title: "Aktuálni moderátori",
        description: "Upravený zoznam moderátorov priečinka",
        content: "ID používateľa",
      },
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Zadané ID moderátorov nie sú platné",
      },
      network: {
        title: "Chyba siete",
        description: "Pri úprave oprávnení priečinka nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chcete upraviť oprávnenia priečinka, prihláste sa",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie upraviť oprávnenia tohto priečinka",
      },
      notFound: {
        title: "Nenájdené",
        description: "Požadovaný priečinok sa nenašiel",
      },
      server: {
        title: "Chyba servera",
        description: "Pri úprave oprávnení priečinka nastala chyba",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neznáma chyba",
      },
      unsaved: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt s aktuálnym stavom",
      },
    },
    success: {
      title: "Hotovo",
      description: "Oprávnenia priečinka sa úspešne upravili",
    },
    backButton: { label: "Späť" },
    submitButton: {
      label: "Upraviť oprávnenia",
      loadingText: "Upravujú sa oprávnenia…",
    },
  },
};
