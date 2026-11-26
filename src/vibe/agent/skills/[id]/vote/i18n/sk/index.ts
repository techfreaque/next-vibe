import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Nástroje AI",
  tags: {
    skills: "zručnosti",
  },
  post: {
    selectSkill: "Ak chcete hlasovať, otvorte zručnosť komunity.",
    browseSkills: "Prehľad zručností komunity",
    title: "Hlasovať za zručnosť",
    titleShort: "Ohodnotiť zručnosť",
    description:
      "Ohodnoť komunitnú zručnosť kladne alebo záporne. Rovnaký hlas znova zruší hodnotenie. Opačný hlas ho zmení.",
    dynamicTitle: "Hlasovanie: {{name}}",
    direction: {
      label: "Smer",
      description:
        "Na kladný hlas použi up (užitočná), na záporný down (neužitočná).",
      up: "Kladný hlas",
      down: "Záporný hlas",
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
        description: "Ak chceš hlasovať, prihlás sa.",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "O tejto zručnosti nemôžeš hlasovať.",
      },
      notFound: { title: "Nenájdené", description: "Zručnosť sa nenašla." },
      server: {
        title: "Chyba servera",
        description: "Hlas sa nepodarilo spracovať.",
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
      title: "Hlas zaznamenaný",
      description: "Tvoj hlas sa uložil.",
    },
    response: {
      userVote: { content: "Tvoj hlas" },
      voteCount: { content: "Skóre" },
      upCount: { content: "Kladné hlasy" },
      downCount: { content: "Záporné hlasy" },
      trustLevel: { content: "Úroveň dôvery" },
    },
    backButton: {
      label: "Späť",
    },
    button: {
      vote: "Kladný hlas",
      unvote: "Zrušiť hlas",
      loading: "Ukladá sa…",
    },
    badge: {
      verified: "Overené",
    },
  },
};
