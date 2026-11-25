import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",

  errors: {
    noRowReturned: "Databáza po vložení nevrátila žiadny riadok",
    notYourConnection: "Toto pripojenie vám nepatrí",
    mountNotFound: "Pripojený adresár sa nenašiel",
  },

  list: {
    title: "Pripojené adresáre",
    titleShort: "Pripojené adresáre",
    description:
      "Pomenované odkazy na adresáre tohto pripojenia. V Cortex sa každý z nich zobrazí pod cestou /ssh/<connection>/<name>/. Terminály sa otvárajú v predvolenom pripojenom adresári.",
    fields: {
      connectionId: {
        label: "Pripojenie",
        description: "Pripojenie SSH, ku ktorému patria tieto adresáre",
      },
    },
    response: {
      mounts: { title: "Pripojené adresáre" },
    },
    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "Skontrolujte zadané údaje a skúste to znova",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na pokračovanie sa prihláste",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Na túto operáciu nemáte oprávnenie",
      },
      server: {
        title: "Chyba servera",
        description: "Pripojené adresáre sa nepodarilo načítať",
      },
      notFound: { title: "Nenašlo sa", description: "Pripojenie sa nenašlo" },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Konflikt údajov",
        description: "V tomto pripojení už existuje adresár s rovnakým názvom",
      },
      network: {
        title: "Chyba siete",
        description: "So serverom sa nepodarilo spojiť",
      },
    },
    success: {
      title: "Pripojené adresáre sú načítané",
      description: "Adresáre dostupné cez toto pripojenie",
    },
  },

  create: {
    title: "Pripojiť adresár",
    titleShort: "Pripojiť adresár",
    description:
      "Pridajte pomenovaný odkaz na adresár. Názov sa stane súčasťou cesty /ssh/<connection>/<name>/.",
    fields: {
      connectionId: {
        label: "ID pripojenia",
        description: "Pripojenie SSH, ku ktorému chcete pridať adresár",
      },
      path: {
        label: "Cesta k adresáru",
        description:
          "Absolútna cesta na zariadení, napríklad /home/max/project. Cortex použije ako poslednú časť cesty názov adresára. Ak ide o predvolený pripojený adresár, terminál v ňom otvorí novú reláciu.",
        placeholder: "/home/user/project",
      },
      isDefault: {
        label: "Predvolený adresár",
        description:
          "Nové relácie terminálu sa otvoria v tomto adresári. Každé pripojenie môže mať len jeden predvolený adresár.",
      },
    },
    response: {
      id: { title: "ID pripojeného adresára" },
    },
    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "Skontrolujte údaje vo formulári a skúste to znova",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na pokračovanie sa prihláste",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Na túto operáciu nemáte oprávnenie",
      },
      server: {
        title: "Chyba servera",
        description: "Pripojený adresár sa nepodarilo uložiť",
      },
      notFound: { title: "Nenašlo sa", description: "Pripojenie sa nenašlo" },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Názov sa už používa",
        description: "V tomto pripojení už existuje adresár s týmto názvom",
      },
      network: {
        title: "Chyba siete",
        description: "So serverom sa nepodarilo spojiť",
      },
    },
    success: {
      title: "Adresár je pripojený",
      description: "Adresár sa podarilo pripojiť",
    },
  },

  detail: {
    titleGet: "Pripojený adresár",
    titleShortGet: "Pripojený adresár",
    descriptionGet: "Zobrazte odkaz na pripojený adresár.",
    titlePatch: "Upraviť pripojený adresár",
    titleShortPatch: "Upraviť pripojený adresár",
    descriptionPatch: "Premenujte alebo presuňte odkaz na pripojený adresár.",
    titleDelete: "Odobrať pripojený adresár",
    titleShortDelete: "Odobrať pripojený adresár",
    descriptionDelete: "Odoberte z tohto pripojenia odkaz na adresár.",
    fields: {
      mountId: {
        label: "ID pripojeného adresára",
        description: "Jedinečný identifikátor pripojeného adresára",
      },
      path: {
        label: "Cesta k adresáru",
        description:
          "Absolútna cesta na zariadení. Cortex použije ako poslednú časť cesty názov adresára.",
        placeholder: "/home/user/project",
      },
      isDefault: {
        label: "Predvolený adresár",
        description: "Nové relácie terminálu sa otvoria v tomto adresári",
      },
    },
    response: {
      id: { title: "ID pripojeného adresára" },
      name: { title: "Názov" },
      path: { title: "Cesta" },
      isDefault: { title: "Predvolené" },
      createdAt: { title: "Vytvorené" },
      updatedAt: { title: "Aktualizované" },
      deleted: { title: "Odstránené" },
    },
    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "Skontrolujte zadané údaje a skúste to znova",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na pokračovanie sa prihláste",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Na túto operáciu nemáte oprávnenie",
      },
      server: {
        title: "Chyba servera",
        description: "Pripojený adresár sa nepodarilo aktualizovať",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Pripojený adresár sa nenašiel",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Názov sa už používa",
        description: "V tomto pripojení už existuje adresár s týmto názvom",
      },
      network: {
        title: "Chyba siete",
        description: "So serverom sa nepodarilo spojiť",
      },
    },
    successGet: {
      title: "Pripojený adresár je načítaný",
      description: "Podrobnosti o pripojenom adresári",
    },
    successPatch: {
      title: "Pripojený adresár je aktualizovaný",
      description: "Pripojený adresár sa podarilo aktualizovať",
    },
    successDelete: {
      title: "Pripojený adresár je odobratý",
      description: "Pripojený adresár sa podarilo odobrať",
    },
    widget: {
      confirmDelete: "Odobrať tento pripojený adresár?",
    },
  },

  widget: {
    noMounts: "Zatiaľ tu nie sú žiadne pripojené adresáre",
    noMountsHint:
      "Pripojením adresára naň vytvoríte odkaz. Terminály sa budú otvárať v predvolenom pripojenom adresári.",
    addMount: "Pripojiť adresár",
    defaultBadge: "predvolený",
    cortexPath: "Cesta v Cortex",
    cortexPathPrefix: "/ssh/…/",
    pathArrow: "→",
  },
};
