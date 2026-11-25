import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Oznámenia",

  tags: {
    notifications: "oznámenia",
    list: "zoznam",
    unread: "neprečítané",
    read: "prečítané",
  },

  enums: {
    type: {
      taskComplete: "Úloha sa dokončila",
      taskFailed: "Úloha zlyhala",
      earning: "Odmena",
      dreamerResult: "Výsledok úlohy Dreamer",
      creditLow: "Nízky zostatok kreditov",
      system: "Systém",
    },
  },

  // Copy per type. Rendered in the recipient's own locale when the
  // notification is created. {{params}} come from the event source.
  templates: {
    taskComplete: {
      title: "Úloha {{name}} je hotová",
      body: "Tvoja úloha na pozadí sa dokončila. Otvor si výsledok.",
    },
    taskFailed: {
      title: "Úloha {{name}} zlyhala",
      body: "Pri úlohe na pozadí sa vyskytla chyba. Otvor úlohu a pozri si podrobnosti.",
    },
    earning: {
      title: "Pripísané kredity: {{amount}}",
      body: "Uplynula čakacia lehota na vyplatenie provízie za odporúčanie. Kredity už môžeš použiť.",
    },
    dreamerResult: {
      title: "Úloha {{name}} má výsledok",
      body: "Tvoja úloha Dreamer sa dokončila.",
    },
    creditLow: {
      title: "Míňajú sa ti kredity",
      body: "Zostávajúce kredity: {{amount}}. Doplň si ich, aby sa ďalšia úloha nezastavila.",
    },
    system: {
      title: "{{name}}",
      body: "",
    },
    fallbackTaskName: "Úloha na pozadí",
  },

  list: {
    get: {
      title: "Oznámenia",
      titleShort: "Oznámenia",
      description:
        "Čo sa dokončilo počas tvojej neprítomnosti. Neprečítané oznámenia sú navrchu.",
      emptyTitle: "Nič nové",
      emptyHint: "Tu nájdeš dokončené úlohy a pripísané odmeny.",
      markAllRead: "Označiť všetky ako prečítané",
      unread: "Neprečítané",
      response: {
        notifications: {
          id: "ID",
          type: "Typ",
          title: "Názov",
          body: "Správa",
          link: "Odkaz",
          read: "Prečítané",
          createdAt: "Prijaté",
        },
        unreadCount: "Neprečítané",
      },
      paginationInfo: {
        label: "Stránkovanie",
      },
    },
  },

  unreadCount: {
    get: {
      title: "Počet neprečítaných oznámení",
      titleShort: "Počet neprečítaných",
      description: "Počet oznámení, ktoré ešte čakajú na otvorenie.",
      response: {
        unreadCount: "Neprečítané oznámenia",
      },
    },
  },

  read: {
    post: {
      title: "Označiť oznámenia ako prečítané",
      titleShort: "Označiť ako prečítané",
      description:
        "Označí jedno alebo všetky oznámenia ako prečítané. Zadaj id alebo all=true.",
      id: {
        label: "ID oznámenia",
        description: "Oznámenie, ktoré chceš označiť ako prečítané",
      },
      all: {
        label: "Označiť všetky ako prečítané",
        description: "Označí všetky neprečítané oznámenia ako prečítané",
      },
      response: {
        updatedCount: "Označené ako prečítané",
      },
      submit: {
        label: "Označiť ako prečítané",
        loading: "Aktualizuje sa…",
      },
    },
  },

  bell: {
    label: "Oznámenia",
    empty: "Všetky oznámenia máš prečítané.",
    markAllRead: "Označiť všetky ako prečítané",
    viewAll: "Zobraziť všetky",
    loading: "Načítava sa…",
    unreadBadge: "Neprečítané oznámenia: {{count}}",
  },

  errors: {
    validation: {
      title: "Neplatné údaje",
      description: "Zadaj ID oznámenia alebo all=true",
    },
    network: {
      title: "Chyba siete",
      description: "Spojenie so sieťou zlyhalo",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Ak si chceš pozrieť oznámenia, prihlás sa",
    },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Nemáš potrebné oprávnenie",
    },
    notFound: {
      title: "Nenašlo sa",
      description: "Oznámenie sa nenašlo",
    },
    server: {
      title: "Chyba servera",
      description: "Vyskytla sa interná chyba servera",
    },
    serverError: {
      title: "Chyba servera",
      description: "Vyskytla sa interná chyba servera",
      detail: "Na našej strane sa vyskytla chyba: {{error}}",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Vyskytla sa neznáma chyba",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Máš neuložené zmeny",
    },
    conflict: {
      title: "Konflikt údajov",
      description: "Stav oznámenia sa medzitým zmenil",
    },
    idOrAllRequired: "Zadaj ID oznámenia alebo all=true.",
  },

  success: {
    title: "Hotovo",
    description: "Operácia sa dokončila",
  },
};
