import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Čet",
  tags: {
    moderation: "Moderovanie",
  },
  get: {
    title: "Nahlásený obsah",
    titleShort: "Nahlásené príspevky",
    description:
      "Nahlásené a skryté príspevky z verejného fóra a zdieľané vlákna, od najnaliehavejších",
    fields: {
      minReports: {
        label: "Najmenej hlásení",
        description:
          "Najnižší počet otvorených hlásení na zahrnutie (predvolene 1)",
      },
      limit: {
        label: "Limit",
        description: "Najvyšší počet vlákien vo výsledku",
      },
      offset: {
        label: "Posun",
        description: "Počet vlákien na preskočenie pri stránkovaní",
      },
    },
    response: {
      threads: {
        id: { content: "ID vlákna" },
        title: { content: "Názov" },
        rootFolderId: { content: "Priečinok" },
        authorId: { content: "ID autora" },
        authorName: { content: "Autor" },
        authorBanned: { content: "Autor má zákaz" },
        moderationStatus: { content: "Stav" },
        reportCount: { content: "Hlásenia" },
        reasons: { content: "Dôvody" },
        latestNote: { content: "Najnovšia poznámka" },
        updatedAt: { content: "Aktualizované" },
      },
      totalCount: { content: "Spolu" },
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Neplatná požiadavka",
      },
      network: { title: "Chyba siete", description: "Pripojenie zlyhalo" },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prístup správcu",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Vyžaduje sa prístup správcu",
      },
      notFound: { title: "Nenájdené", description: "Vlákno sa nenašlo" },
      server: {
        title: "Chyba servera",
        description: "Front moderovania sa nepodarilo načítať",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: { title: "Konflikt", description: "Nastal konflikt údajov" },
    },
    success: {
      title: "Front načítaný",
      description: "Nahlásený obsah sa úspešne načítal",
    },
    note: "„{{note}}“",
    empty: "Momentálne nemáme žiadne hlásenia.",
    status: {
      visible: "Viditeľné",
      underReview: "V kontrole",
      removed: "Odobraté",
      authorBanned: "Autor má zákaz",
    },
    reasons: {
      spam: "Nevyžiadaný obsah",
      illegal: "Nezákonný obsah",
      abuse: "Zneužívanie",
      csamFlag: "Bezpečnosť detí",
      other: "Iné",
    },
    action: {
      dismiss: "Zamietnuť hlásenia",
      remove: "Odobrať",
      banAuthor: "Odstrániť a zablokovať autora",
    },
    backButton: {
      label: "Späť",
    },
  },
  patch: {
    title: "Moderovať obsah",
    titleShort: "Moderovať",
    description:
      "Zamietne hlásenia a obnoví vlákno, skryje ho alebo ho skryje a zablokuje autora",
    fields: {
      id: {
        label: "ID vlákna",
        description: "ID vlákna na moderovanie",
      },
      action: {
        label: "Akcia",
        description:
          "dismiss obnoví vlákno a vymaže hlásenia. remove vlákno natrvalo skryje. ban ho odstráni a zablokuje autora.",
      },
    },
    actions: {
      dismiss: "Zamietnuť hlásenia a obnoviť obsah",
      remove: "Odstrániť obsah",
      banAuthor: "Odstrániť obsah a zablokovať autora",
    },
    response: {
      patchId: { content: "ID vlákna" },
      patchStatus: { content: "Nový stav" },
      patchReportCount: { content: "Počet hlásení" },
      authorBanned: { content: "Autor má zákaz" },
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Neplatná požiadavka",
      },
      network: { title: "Chyba siete", description: "Pripojenie zlyhalo" },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prístup správcu",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Vyžaduje sa prístup správcu",
      },
      notFound: { title: "Nenájdené", description: "Vlákno sa nenašlo" },
      server: {
        title: "Chyba servera",
        description: "Vlákno sa nepodarilo moderovať",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: { title: "Konflikt", description: "Nastal konflikt údajov" },
      noAuthor: {
        title: "Autor bez účtu",
        description:
          "Vlákno zverejnil hosť, takže nemá účet, ktorý by sa dal zablokovať",
      },
    },
    success: {
      title: "Obsah moderovaný",
      description: "Akcia sa úspešne vykonala",
    },
  },
};
