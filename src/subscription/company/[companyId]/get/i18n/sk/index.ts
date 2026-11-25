import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    subscription: "Predplatné",
    company: "Spoločnosť",
    get: "Načítať",
  },
  get: {
    title: "Predplatné spoločnosti",
    titleShort: "Predplatné spoločnosti",
    description: "Načíta aktívne predplatné spoločnosti",
    companyId: {
      label: "ID spoločnosti",
      description: "Spoločnosť, ktorej predplatné chcete načítať",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Neplatné ID spoločnosti",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chcete zobraziť predplatné spoločnosti, prihláste sa",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte prístup k predplatnému tejto spoločnosti",
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
        title: "Predplatné sa nenašlo",
        description: "Táto spoločnosť nemá predplatné",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Predplatné načítané",
      description: "Predplatné spoločnosti sa načítalo",
    },
  },
};
