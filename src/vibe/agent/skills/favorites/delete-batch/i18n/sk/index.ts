import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Čet",
  tags: {
    favorites: "Obľúbené",
  },
  post: {
    title: "Odstrániť obľúbené",
    titleShort: "Odobrať",
    description: "Odstrániť viac obľúbených konfigurácií naraz",
    ids: {
      label: "ID obľúbených konfigurácií",
    },
    errors: {
      validation: {
        title: "Neplatná požiadavka",
        description: "Skontroluj výber na odstránenie a skús to znova.",
      },
      network: {
        title: "Chyba pripojenia",
        description:
          "Obľúbené konfigurácie sa nepodarilo odstrániť. Skús to znova.",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chceš odstrániť obľúbené konfigurácie, prihlás sa.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Tieto konfigurácie nemáš oprávnenie odstrániť.",
      },
      notFound: {
        title: "Nenašli sa žiadne obľúbené konfigurácie",
        description: "Konfigurácie vybrané na odstránenie sa nenašli.",
      },
      server: {
        title: "Niečo sa pokazilo",
        description:
          "Obľúbené konfigurácie sa nepodarilo odstrániť. Skús to znova.",
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
        title: "Konflikt pri odstraňovaní",
        description:
          "Tieto konfigurácie sa zmenili. Obnov stránku a skús to znova.",
      },
    },
    success: {
      title: "Obľúbené konfigurácie odstránené",
      description: "Vybrané konfigurácie sa odstránili.",
    },
  },
};
