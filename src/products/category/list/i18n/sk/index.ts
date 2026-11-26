import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    products: "Produkty",
    category: "Kategória",
    list: "Zoznam",
  },
  get: {
    title: "Kategórie",
    titleShort: "Kategórie",
    description: "Načítať kategórie produktov firmy alebo vlastníka.",
    companyId: {
      label: "ID firmy",
      description: "Filtrovať kategórie podľa tejto firmy",
    },
    page: {
      label: "Strana",
      description: "Číslo strany (od 1)",
    },
    pageSize: {
      label: "Na stranu",
      description: "Počet výsledkov na stranu (najviac 100)",
    },
    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "Skontrolujte nastavenie filtrov a skúste to znova",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na zobrazenie kategórií sa prihláste",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie zobraziť tieto kategórie",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt",
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
        description: "Nenašli sa žiadne kategórie",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Kategórie načítané",
      description: "Kategórie produktov sú uvedené nižšie.",
    },
    response: {
      id: "ID kategórie",
      name: "Názov kategórie",
      parentId: "Nadradená kategória",
      sortOrder: "Poradie zoradenia",
      isActive: "Aktívna",
      createdAt: "Vytvorené",
      total: "Spolu",
    },
    widget: {
      addCategory: "Pridať kategóriu",
      active: "Aktívna",
      inactive: "Neaktívna",
      emptyTitle: "Zatiaľ žiadne kategórie",
      empty:
        "Kategórie zoskupujú produkty, takže katalóg vyfiltrujete rýchlejšie.",
      back: "Späť",
      count: "Kategórie: {{count}}",
      columnName: "Kategória",
      columnOrder: "Poradie",
      columnStatus: "Stav",
      inParent: "V kategórii {{parent}}",
    },
  },
};
