import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    subscription: "Predplatné",
    company: "Spoločnosť",
    list: "Zoznam",
  },
  get: {
    title: "Predplatné spoločnosti",
    titleShort: "Predplatné spoločnosti",
    description: "Načíta všetky predplatné spoločnosti",
    companyId: {
      label: "ID spoločnosti",
      description: "Spoločnosť, ktorej predplatné chcete zobraziť",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Neplatné ID spoločnosti",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description:
          "Ak chcete zobraziť zoznam predplatných spoločnosti, prihláste sa",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte prístup k predplatným tejto spoločnosti",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt údajov",
      },
      server: {
        title: "Chyba servera",
        description: "Niečo sa pokazilo. Skúste znova.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Skontrolujte pripojenie a skúste znova",
      },
      notFound: {
        title: "Spoločnosť sa nenašla",
        description: "Táto spoločnosť neexistuje",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Predplatné načítané",
      description: "Predplatné spoločnosti sa načítali",
    },
  },
};
