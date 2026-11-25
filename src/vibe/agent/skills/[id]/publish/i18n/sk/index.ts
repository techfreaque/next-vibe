import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Nástroje AI",
  tags: {
    skills: "zručnosti",
  },
  enums: {
    skillStatus: {
      draft: "Návrh",
      published: "Zverejnené",
      unlisted: "Prístup cez odkaz",
    },
  },
  patch: {
    title: "Zverejniť zručnosť",
    titleShort: "Zverejniť zručnosť",
    description:
      "Zmeň viditeľnosť vlastnej zručnosti. Stav PUBLISHED ju zobrazí v komunitnom katalógu.",
    dynamicTitle: "Zverejniť: {{name}}",
    status: {
      label: "Stav",
      description:
        "PUBLISHED zobrazí zručnosť v katalógu, DRAFT ju skryje a UNLISTED ju sprístupní iba cez odkaz.",
    },
    changeNote: {
      label: "Poznámka k zmene",
      description:
        "Nepovinná poznámka, ktorá opisuje, čo sa zmenilo v tejto verzii.",
      placeholder: "napr. Spresnené systémové zadanie",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Neplatná požiadavka",
      },
      network: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k serveru",
      },
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Ak chceš zverejniť zručnosť, prihlás sa.",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Zverejniť môžeš iba vlastné zručnosti.",
      },
      notFound: { title: "Nenájdené", description: "Zručnosť sa nenašla." },
      server: {
        title: "Chyba servera",
        description: "Zručnosť sa nepodarilo zverejniť.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máš neuložené zmeny.",
      },
      conflict: { title: "Konflikt", description: "Nastal konflikt" },
    },
    success: {
      title: "Zručnosť zverejnená",
      description: "Tvoja zručnosť je teraz v komunitnom katalógu.",
    },
    response: {
      status: { content: "Stav" },
      publishedAt: { content: "Dátum zverejnenia" },
    },
    backButton: {
      label: "Späť",
    },
    button: {
      submit: "Uložiť stav",
      loading: "Ukladá sa…",
    },
  },
};
