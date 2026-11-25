import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: {
    vibeSense: "vibe-sense",
  },

  list: {
    title: "Grafy toku údajov",
    titleShort: "Grafy",
    description: "Zobraziť všetky grafy dostupné aktuálnemu používateľovi",
    fields: {
      search: {
        label: "Hľadať",
        description: "Vyfiltruje grafy podľa názvu alebo identifikátora slug.",
        placeholder: "Hľadať grafy…",
      },
    },
    container: {
      title: "Grafy",
      description: "Všetky grafy toku údajov",
    },
    response: {
      graphs: "Grafy",
      graph: {
        id: "ID",
        slug: "Slug",
        name: "Názov",
        description: "Opis",
        ownerType: "Typ vlastníka",
        ownerId: "ID vlastníka",
        isActive: "Aktívny",
        createdAt: "Čas vytvorenia",
      },
    },
    success: {
      title: "Načítané grafy",
      description: "Grafy toku údajov sa načítali",
    },
    errors: {
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Zobrazenie zoznamu grafov vyžaduje prihlásenie",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Vyžaduje sa oprávnenie správcu.",
      },
      server: {
        title: "Chyba servera",
        description: "Nepodarilo sa načítať grafy",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba pri načítavaní grafov",
      },
      validation: {
        title: "Overenie vstupu zlyhalo",
        description: "Neplatné parametre požiadavky",
      },
      notFound: {
        title: "Nenájdené",
        description: "Nenašli sa žiadne grafy",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt zdrojov",
      },
      network: {
        title: "Chyba siete",
        description: "Pri načítavaní grafov zlyhala sieťová požiadavka",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Pred pokračovaním ulož zmeny",
      },
    },
  },

  widget: {
    refresh: "Obnoviť",
    createGraph: "Nový graf",
    active: "Aktívny",
    inactive: "Neaktívne",
    empty: "Zatiaľ nemáš graf. Vytvor prvý graf toku údajov.",
    error: "Grafy sa nepodarilo načítať. Skús znova.",
    archive: "Archivovať",
    delete: "Odstrániť",
    searchPlaceholder: "Hľadať podľa názvu, identifikátora slug alebo opisu…",
    noMatchTitle: "Žiadne grafy nezodpovedajú hľadaniu",
    noMatchHint: "Skús iný hľadaný výraz",
    clearSearch: "Zrušiť vyhľadávanie",
    searchResults: "výsledky vyhľadávania pre",
    stats: {
      total: "Celkový počet grafov",
      active: "Aktívny",
      system: "Systém",
      admin: "Správca",
    },
  },

  create: {
    title: "Vytvoriť graf",
    description: "Vytvoriť nový graf toku údajov",
    fields: {
      name: {
        label: "Názov",
        description: "Zobrazovaný názov grafu",
        placeholder: "Môj graf",
      },
      slug: {
        label: "Slug",
        description:
          "Jedinečný identifikátor. Použi iba malé písmená a spojovníky.",
        placeholder: "my-graph",
      },
      description: {
        label: "Opis",
        description: "Nepovinný opis",
        placeholder: "",
      },
      config: {
        label: "Nastavenia",
        description: "Konfigurácia grafu DAG",
      },
    },
    response: {
      id: "ID grafu",
    },
    success: {
      title: "Vytvorený graf",
      description: "Graf toku údajov bol vytvorený",
    },
    errors: {
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Vytváranie grafov vyžaduje prihlásenie",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Vyžaduje sa oprávnenie správcu.",
      },
      server: {
        title: "Chyba servera",
        description: "Nepodarilo sa vytvoriť graf",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri vytváraní grafu nastala neočakávaná chyba",
      },
      validation: {
        title: "Overenie vstupu zlyhalo",
        description: "Neplatná konfigurácia grafu",
      },
      notFound: {
        title: "Nenájdené",
        description: "Zdroj sa nenašiel.",
      },
      conflict: {
        title: "Konflikt",
        description: "Graf s týmto identifikátorom už existuje.",
      },
      network: {
        title: "Chyba siete",
        description: "Pri vytváraní grafu zlyhala sieťová požiadavka",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Pred pokračovaním ulož zmeny",
      },
    },
  },
};
