import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Kontakty",
  tags: {
    leads: "Kontakty",
    skill: "Zručnosť",
  },

  patch: {
    title: "Priradiť zručnosť ku kontaktu",
    titleShort: "Zručnosť kontaktu",
    description:
      "Zaznamenať, ktorá zručnosť priviedla kontakt pri prvej návšteve",
    skillId: {
      label: "ID zručnosti",
      description: "UUID vlastnej zručnosti, ktorá sa priradí ku kontaktu",
    },
    errors: {
      validation: {
        title: "Neplatné ID zručnosti",
        description: "Zadajte platné UUID vlastnej zručnosti",
      },
      network: {
        title: "Chyba siete",
        description: "Server sa nepodarilo kontaktovať. Skúste to znova.",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chcete vykonať úpravu, prihláste sa.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie upraviť tento kontakt.",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Kontakt sa nenašiel.",
      },
      server: {
        title: "Chyba servera",
        description: "Nastala interná chyba. Skúste to znova.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny.",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt.",
      },
    },
    success: {
      title: "Zručnosť priradená",
      description: "Zručnosť sa zaznamenala pri tomto kontakte.",
    },
    skipped: {
      title: "Nezaznamenané",
      description:
        "Chýba relácia návštevníka na priradenie. Najprv otvorte stránku a skúste to znova.",
    },
    submit: "Priradiť zručnosť",
  },
};
