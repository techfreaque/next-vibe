import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Čet",
  tags: {
    threads: "Vlákna",
    permissions: "Oprávnenia",
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
  dialog: {
    title: "Oprávnenia vlákna: {{threadTitle}}",
  },
  get: {
    title: "Zobraziť oprávnenia vlákna",
    titleShort: "Prístup k vláknu",
    description: "Načíta zoznam moderátorov konkrétneho vlákna",
    container: {
      title: "Oprávnenia vlákna",
      description: "Zobrazte a spravujte oprávnenia na prístup k vláknu",
    },
    threadId: {
      label: "ID vlákna",
      description: "Jedinečný identifikátor vlákna",
    },
    response: {
      title: "Oprávnenia vlákna",
      rolesView: {
        label: "Roly na zobrazenie",
        description: "Roly, ktoré môžu zobraziť toto vlákno",
      },
      rolesEdit: {
        label: "Roly s právom úprav",
        description: "Roly, ktoré môžu upravovať nastavenia vlákna",
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
        description: "ID používateľov, ktorí môžu moderovať toto vlákno",
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
        description: "Pri načítavaní oprávnení vlákna nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chcete zobraziť oprávnenia vlákna, prihláste sa",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie zobraziť oprávnenia tohto vlákna",
      },
      notFound: {
        title: "Nenájdené",
        description: "Požadované vlákno sa nenašlo",
      },
      server: {
        title: "Chyba servera",
        description: "Pri načítavaní oprávnení vlákna nastala chyba",
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
    backButton: {
      label: "Späť",
    },
    success: {
      title: "Hotovo",
      description: "Oprávnenia vlákna sa úspešne načítali",
    },
  },
  patch: {
    title: "Upraviť oprávnenia vlákna",
    titleShort: "Prístup k vláknu",
    description: "Upraví zoznam moderátorov konkrétneho vlákna",
    container: {
      title: "Upraviť oprávnenia vlákna",
      description: "Upravte oprávnenia na prístup k vláknu",
    },
    threadId: {
      label: "ID vlákna",
      description: "Jedinečný identifikátor vlákna na úpravu",
    },
    rolesView: {
      label: "Roly na zobrazenie",
      description: "Roly, ktoré môžu zobraziť toto vlákno",
    },
    rolesEdit: {
      label: "Roly s právom úprav",
      description: "Roly, ktoré môžu upravovať nastavenia vlákna",
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
        description: "ID používateľov, ktorí môžu moderovať toto vlákno",
      },
    },
    response: {
      title: "Upravené oprávnenia",
      rolesView: {
        label: "Roly na zobrazenie",
        description: "Roly, ktoré môžu zobraziť toto vlákno",
      },
      rolesEdit: {
        label: "Roly s právom úprav",
        description: "Roly, ktoré môžu upravovať nastavenia vlákna",
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
        content: "Oprávnenia vlákna sa úspešne upravili",
      },
      moderatorIds: {
        title: "Aktuálni moderátori",
        description: "Upravený zoznam moderátorov vlákna",
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
        description: "Pri úprave oprávnení vlákna nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chcete upraviť oprávnenia vlákna, prihláste sa",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie upraviť oprávnenia tohto vlákna",
      },
      notFound: {
        title: "Nenájdené",
        description: "Požadované vlákno sa nenašlo",
      },
      server: {
        title: "Chyba servera",
        description: "Pri úprave oprávnení vlákna nastala chyba",
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
    backButton: {
      label: "Späť",
    },
    submitButton: {
      label: "Uložiť oprávnenia",
      loadingText: "Ukladá sa…",
    },
    success: {
      title: "Hotovo",
      description: "Oprávnenia vlákna sa úspešne upravili",
    },
  },
};
