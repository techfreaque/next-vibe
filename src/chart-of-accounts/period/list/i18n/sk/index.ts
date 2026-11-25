import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Účtovné obdobia",
    titleShort: "Obdobia",
    description: "Zobrazte účtovné obdobia spoločnosti.",
    companyId: {
      label: "ID firmy",
      description: "Firma, ktorej účtovné obdobia chcete zobraziť",
      placeholder: "Zadajte UUID spoločnosti.",
    },
    response: {
      periods: "Obdobia",
      id: "Identifikátor",
      name: "Názov",
      startDate: "Začiatok",
      endDate: "Koniec",
      status: "Stav",
      closedAt: "Dátum uzavretia",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Identifikátor spoločnosti je neplatný.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nedostatočné oprávnenia",
      },
      server: {
        title: "Chyba servera",
        description: "Obdobia sa nepodarilo načítať.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      conflict: { title: "Konflikt", description: "Konflikt údajov" },
      network: {
        title: "Chyba siete",
        description: "Server sa nepodarilo kontaktovať",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Nenašli sa žiadne obdobia.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Obdobia sa načítali",
      description: "Prehľad období je pripravený.",
    },
    widget: {
      loading: "Načítavajú sa obdobia…",
      empty: "Zatiaľ nie sú k dispozícii žiadne účtovné obdobia.",
      createButton: "Vytvoriť obdobie",
    },
  },
  enums: {
    periodStatus: {
      OPEN: "Otvorené",
      CLOSED: "Uzavreté",
      LOCKED: "Zamknuté",
    },
  },
  title: "Zoznam období",
  description: "Zobrazte účtovné obdobia.",
  category: "Účtový rozvrh",
  tag: "Obdobie",
};
