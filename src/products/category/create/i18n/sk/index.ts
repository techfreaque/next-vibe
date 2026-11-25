import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    products: "Produkty",
    category: "Kategória",
    create: "Vytvoriť",
  },
  post: {
    title: "Vytvoriť kategóriu produktov",
    titleShort: "Vytvoriť kategóriu",
    description: "Pridať kategóriu na usporiadanie produktov v katalógu.",
    name: {
      label: "Názov kategórie",
      description: "Názov kategórie produktov",
      placeholder: "Dizajnérske služby",
    },
    companyId: {
      label: "Firma",
      description: "Priradiť túto kategóriu k firme",
    },
    parentId: {
      label: "Nadradená kategória",
      description:
        "Nepovinná nadradená kategória na usporiadanie do hierarchie",
    },
    sortOrder: {
      label: "Poradie zoradenia",
      description: "Poradie zobrazenia od najnižšieho čísla",
      placeholder: "0",
    },
    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "Skontrolujte polia formulára a skúste to znova",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na vytvorenie kategórie sa prihláste",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie vytvoriť túto kategóriu",
      },
      conflict: {
        title: "Už existuje",
        description: "Kategória s týmto názvom už existuje",
      },
      server: {
        title: "Chyba servera",
        description: "Na našej strane nastala chyba. Skúste to znova.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Skontrolujte pripojenie a skúste to znova",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Kategória vytvorená",
      description: "Kategória produktov je pripravená.",
    },
    response: {
      id: "ID kategórie",
      name: "Názov kategórie",
    },
    widget: {
      backToList: "Späť na kategórie",
      back: "Späť",
    },
  },
};
