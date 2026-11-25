import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Čet",
  tags: {
    favorites: "Obľúbené",
  },
  post: {
    title: "Zmeniť poradie obľúbených",
    titleShort: "Zmena poradia",
    description: "Aktualizovať poradie vašich obľúbených konfigurácií",
    positions: {
      label: "Pozície",
    },
    errors: {
      validation: {
        title: "Neplatné poradie",
        description: "Skontroluj poradie a skús to znova.",
      },
      network: {
        title: "Chyba pripojenia",
        description: "Nové poradie sa nepodarilo uložiť. Skús to znova.",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description:
          "Ak chceš zmeniť poradie obľúbených konfigurácií, prihlás sa.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáš oprávnenie meniť poradie obľúbených konfigurácií.",
      },
      notFound: {
        title: "Nenašli sa žiadne obľúbené konfigurácie",
        description:
          "Nenašli sa obľúbené konfigurácie, ktorých poradie chceš zmeniť.",
      },
      server: {
        title: "Niečo sa pokazilo",
        description: "Nové poradie sa nepodarilo uložiť. Skús to znova.",
      },
      unknown: {
        title: "Neočakávaná chyba",
        description: "Nastala neočakávaná chyba. Skús to znova.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Tvoje zmeny sa ešte neuložili.",
      },
      conflict: {
        title: "Konflikt pri zmene poradia",
        description: "Poradie sa zmenilo. Obnov stránku a skús to znova.",
      },
    },
    success: {
      title: "Poradie uložené",
      description: "Nové poradie obľúbených konfigurácií sa uložilo.",
    },
  },
};
