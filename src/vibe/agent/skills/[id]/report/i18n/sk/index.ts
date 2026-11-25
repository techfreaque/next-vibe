import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Nástroje AI",
  tags: {
    skills: "zručnosti",
  },
  post: {
    title: "Nahlásiť zručnosť",
    titleShort: "Nahlásiť zručnosť",
    description:
      "Nahlási komunitnú zručnosť na moderovanie. Každý používateľ ju môže nahlásiť iba raz.",
    dynamicTitle: "Nahlásiť: {{name}}",
    reason: {
      label: "Dôvod",
      description: "Prečo chceš túto zručnosť nahlásiť?",
      placeholder: "Opíš problém…",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Uveď dôvod.",
      },
      network: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k serveru",
      },
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Ak chceš nahlásiť zručnosť, prihlás sa.",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Túto zručnosť nemôžeš nahlásiť.",
      },
      notFound: { title: "Nenájdené", description: "Zručnosť sa nenašla." },
      server: {
        title: "Chyba servera",
        description: "Hlásenie sa nepodarilo odoslať.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máš neuložené zmeny.",
      },
      conflict: {
        title: "Už nahlásené",
        description: "Túto zručnosť už máš nahlásenú.",
      },
    },
    success: {
      title: "Hlásenie odoslané",
      description: "Ďakujeme, že pomáhaš chrániť komunitu.",
    },
    response: {
      reported: { content: "Nahlásené" },
      reportCount: { content: "Počet hlásení" },
    },
    backButton: {
      label: "Späť",
    },
    button: {
      submit: "Odoslať hlásenie",
      loading: "Odosiela sa…",
    },
  },
};
