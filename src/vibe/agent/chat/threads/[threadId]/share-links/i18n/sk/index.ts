import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Čet",
  tags: {
    sharing: "Zdieľanie",
  },
  // Top-level keys used across methods
  empty: "", // For hidden/internal fields
  linkId: {
    label: "ID odkazu",
  },
  label: {
    label: "Označenie",
    description: "Voliteľné označenie na rozpoznanie odkazu",
    placeholder: "Zadajte označenie odkazu na zdieľanie",
  },
  allowPosting: {
    label: "Povoliť pridávanie správ",
    description: "Príjemcovia môžu pridávať správy v tomto vlákne",
  },
  requireAuth: {
    label: "Vyžadovať prihlásenie",
    description: "Používatelia sa musia prihlásiť, aby otvorili tento odkaz",
  },
  shareLink: {
    label: "Označenie",
    shareUrl: "Adresa URL na zdieľanie",
    active: "Aktívne",
    allowPosting: "Povoliť pridávanie správ",
    requireAuth: "Vyžadovať prihlásenie",
    accessCount: "Počet otvorení",
    lastAccessedAt: "Posledné otvorenie",
    createdAt: "Vytvorené",
    editAction: "Upraviť",
    deleteAction: "Zrušiť platnosť",
  },
  shareLinks: {
    emptyTitle: "Žiadne odkazy na zdieľanie",
    emptyDescription: "Vytvorte odkaz na zdieľanie vlákna s ostatnými",
  },
  get: {
    title: "Zobraziť odkazy na zdieľanie",
    titleShort: "Odkazy na zdieľanie",
    description: "Načíta všetky odkazy na zdieľanie vlákna",
    container: {
      title: "Odkazy na zdieľanie",
      description: "Všetky odkazy na zdieľanie tohto vlákna",
    },
    response: {
      shareLink: {
        title: "Odkaz na zdieľanie",
        id: {
          content: "ID odkazu",
        },
        token: {
          content: "Token odkazu na zdieľanie",
        },
        label: {
          content: "Označenie",
        },
        allowPosting: {
          content: "Povoliť pridávanie správ",
        },
        requireAuth: {
          content: "Vyžadovať prihlásenie",
        },
        active: {
          content: "Aktívne",
        },
        accessCount: {
          content: "Počet otvorení",
        },
        lastAccessedAt: {
          content: "Posledné otvorenie",
        },
        createdAt: {
          content: "Vytvorené",
        },
        editAction: {
          text: "Upraviť",
        },
        deleteAction: {
          text: "Zrušiť platnosť",
        },
      },
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Parametre požiadavky sú neplatné",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chcete zobraziť odkazy na zdieľanie, prihláste sa",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie zobraziť tieto odkazy na zdieľanie",
      },
      removed: {
        title: "Odstránené alebo v kontrole",
        description:
          "Toto zdieľané vlákno bolo nahlásené a už nie je dostupné.",
      },
      notFound: {
        title: "Nenájdené",
        description: "Vlákno alebo odkaz na zdieľanie sa nenašiel",
      },
      server: {
        title: "Chyba servera",
        description: "Odkazy na zdieľanie sa nepodarilo načítať",
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
        description: "Zdroj sa medzičasom zmenil",
      },
    },
    backButton: {
      label: "Späť",
    },
    success: {
      title: "Hotovo",
      description: "Odkazy na zdieľanie sa úspešne načítali",
    },
  },
  post: {
    title: "Vytvoriť odkaz na zdieľanie",
    titleShort: "Odkaz na zdieľanie",
    description: "Vytvorí nový odkaz na zdieľanie vlákna",
    container: {
      title: "Nový odkaz na zdieľanie",
      description: "Nastavte nový odkaz na zdieľanie",
    },
    label: {
      label: "Označenie",
      description: "Voliteľné označenie na rozpoznanie odkazu",
      placeholder: "Zadajte označenie odkazu na zdieľanie",
    },
    allowPosting: {
      label: "Povoliť pridávanie správ",
      description: "Príjemcovia môžu pridávať správy v tomto vlákne",
    },
    requireAuth: {
      label: "Vyžadovať prihlásenie",
      description: "Používatelia sa musia prihlásiť, aby otvorili tento odkaz",
    },
    response: {
      id: {
        content: "ID odkazu",
      },
      token: {
        content: "Token odkazu na zdieľanie",
      },
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Neplatné parametre odkazu na zdieľanie",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chcete vytvárať odkazy na zdieľanie, prihláste sa",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Cez odkaz možno zdieľať iba vlákna v zdieľanom priečinku",
      },
      notFound: {
        title: "Nenájdené",
        description: "Vlákno sa nenašlo",
      },
      server: {
        title: "Chyba servera",
        description: "Odkaz na zdieľanie sa nepodarilo vytvoriť",
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
        description: "Zdroj sa medzičasom zmenil",
      },
    },
    backButton: {
      label: "Späť",
    },
    submitButton: {
      label: "Vytvoriť odkaz",
      loadingText: "Vytvára sa odkaz…",
    },
    success: {
      title: "Hotovo",
      description: "Odkaz na zdieľanie sa úspešne vytvoril",
    },
  },
  patch: {
    title: "Upraviť odkaz na zdieľanie",
    titleShort: "Upraviť odkaz",
    description: "Upraví existujúci odkaz na zdieľanie",
    container: {
      title: "Upraviť odkaz na zdieľanie",
      description: "Upravte nastavenia odkazu na zdieľanie",
    },
    linkId: {
      label: "ID odkazu",
      description: "ID odkazu na úpravu",
    },
    label: {
      label: "Označenie",
      description: "Voliteľné označenie na rozpoznanie odkazu",
      placeholder: "Zadajte označenie odkazu na zdieľanie",
    },
    allowPosting: {
      label: "Povoliť pridávanie správ",
      description: "Príjemcovia môžu pridávať správy v tomto vlákne",
    },
    requireAuth: {
      label: "Vyžadovať prihlásenie",
      description: "Používatelia sa musia prihlásiť, aby otvorili tento odkaz",
    },
    deleteAction: {
      text: "Zrušiť platnosť odkazu",
    },
    response: {
      id: {
        content: "ID odkazu",
      },
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Neplatné parametre úpravy",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chcete upravovať odkazy na zdieľanie, prihláste sa",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie upraviť tento odkaz",
      },
      notFound: {
        title: "Nenájdené",
        description: "Odkaz na zdieľanie sa nenašiel",
      },
      server: {
        title: "Chyba servera",
        description: "Odkaz na zdieľanie sa nepodarilo upraviť",
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
        description: "Zdroj sa medzičasom zmenil",
      },
    },
    backButton: {
      label: "Späť",
    },
    submitButton: {
      label: "Uložiť zmeny",
      loadingText: "Ukladá sa…",
    },
    success: {
      title: "Hotovo",
      description: "Odkaz na zdieľanie sa úspešne upravil",
    },
  },
  delete: {
    title: "Zrušiť platnosť odkazu na zdieľanie",
    titleShort: "Zrušiť platnosť odkazu",
    description: "Zruší platnosť aktívneho odkazu na zdieľanie",
    container: {
      title: "Zrušiť platnosť odkazu na zdieľanie",
      description: "Odkaz sa tým natrvalo vypne",
    },
    linkId: {
      label: "ID odkazu",
      description: "ID odkazu, ktorého platnosť sa má zrušiť",
    },
    response: {
      id: {
        content: "ID odkazu",
      },
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Neplatné ID odkazu",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description:
          "Ak chcete zrušiť platnosť odkazov na zdieľanie, prihláste sa",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie zrušiť platnosť tohto odkazu",
      },
      notFound: {
        title: "Nenájdené",
        description: "Odkaz na zdieľanie sa nenašiel",
      },
      server: {
        title: "Chyba servera",
        description: "Platnosť odkazu na zdieľanie sa nepodarilo zrušiť",
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
        description: "Zdroj sa medzičasom zmenil",
      },
    },
    backButton: {
      label: "Späť",
    },
    submitButton: {
      label: "Zrušiť platnosť odkazu",
      loadingText: "Ruší sa platnosť odkazu…",
    },
    success: {
      title: "Hotovo",
      description: "Platnosť odkazu na zdieľanie sa úspešne zrušila",
    },
  },
  widget: {
    shareDialog: {
      title: "Zdieľať",
      copyLink: "Kopírovať odkaz",
    },
    visibility: {
      publicTitle: "Zobraziť môže každý s odkazom",
      publicDescription: "Vlákno je v zdieľanom priečinku. Odkaz je aktívny.",
      privateTitle: "Súkromné",
      privateDescription: "K tomuto vláknu máte prístup iba vy.",
      makePublic: "Zverejniť",
      makePrivate: "Nastaviť ako súkromné",
      toggling: "Ukladá sa...",
    },
    emailShare: {
      placeholder: "Pozvať e-mailom",
      send: "Odoslať",
    },
    common: {
      close: "Hotovo",
    },
  },
};
