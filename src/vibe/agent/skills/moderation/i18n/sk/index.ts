import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Zručnosti AI",
  tags: {
    moderation: "Moderovanie",
  },
  get: {
    title: "Nahlásené zručnosti",
    titleShort: "Nahlásené zručnosti",
    description: "Zobrazí nahlásené zručnosti zoradené podľa počtu hlásení.",
    fields: {
      minReports: {
        label: "Minimálny počet hlásení",
        description:
          "Najnižší počet hlásení, pri ktorom sa zručnosť zobrazí (predvolene 1)",
      },
      limit: {
        label: "Limit",
        description: "Maximálny počet zručností, ktoré sa majú vrátiť",
      },
      offset: {
        label: "Posun",
        description: "Počet zručností, ktoré sa pri stránkovaní preskočia",
      },
    },
    response: {
      skills: {
        id: { content: "ID zručnosti" },
        name: { content: "Názov" },
        ownerAuthorId: { content: "ID vlastníka" },
        status: { content: "Stav" },
        reportCount: { content: "Hlásenia" },
        voteCount: { content: "Počet hlasov" },
        trustLevel: { content: "Úroveň dôvery" },
        publishedAt: { content: "Dátum zverejnenia" },
        updatedAt: { content: "Aktualizované" },
      },
      totalCount: { content: "Spolu" },
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Neplatná požiadavka",
      },
      network: { title: "Chyba siete", description: "Spojenie zlyhalo" },
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Vyžaduje sa oprávnenie správcu",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Vyžaduje sa oprávnenie správcu",
      },
      notFound: {
        title: "Nenájdené",
        description: "Nenašli sa žiadne zručnosti.",
      },
      server: {
        title: "Chyba servera",
        description: "Nepodarilo sa načítať nahlásené zručnosti.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máš neuložené zmeny.",
      },
      conflict: { title: "Konflikt", description: "Nastal konflikt údajov" },
    },
    success: {
      title: "Zručnosti sa načítali",
      description: "Nahlásené zručnosti sa načítali.",
    },
    empty: "Žiadne nahlásené zručnosti.",
    action: {
      moderate: "Moderovať",
    },
    backButton: {
      label: "Späť",
    },
  },
  patch: {
    title: "Moderovať zručnosť",
    titleShort: "Moderovať zručnosť",
    description: "Skryť nahlásenú zručnosť alebo vynulovať počet jej hlásení",
    fields: {
      id: {
        label: "ID zručnosti",
        description: "ID zručnosti, ktorú chceš moderovať",
      },
      action: {
        label: "Akcia",
        description:
          "hide nastaví stav UNLISTED, clear vynuluje počet hlásení.",
      },
    },
    response: {
      id: { content: "ID zručnosti" },
      status: { content: "Nový stav" },
      reportCount: { content: "Počet hlásení" },
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Neplatná požiadavka",
      },
      network: { title: "Chyba siete", description: "Spojenie zlyhalo" },
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Vyžaduje sa oprávnenie správcu",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Vyžaduje sa oprávnenie správcu",
      },
      notFound: { title: "Nenájdené", description: "Zručnosť sa nenašla." },
      server: {
        title: "Chyba servera",
        description: "Zmenu pri moderovaní zručnosti sa nepodarilo uložiť.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máš neuložené zmeny.",
      },
      conflict: { title: "Konflikt", description: "Nastal konflikt údajov" },
    },
    success: {
      title: "Moderovanie zručnosti dokončené",
      description: "Akcia sa vykonala.",
    },
  },
};
