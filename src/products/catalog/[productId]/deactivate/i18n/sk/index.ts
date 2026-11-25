import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    products: "Produkty",
    catalog: "Katalóg",
    deactivate: "Deaktivovať",
  },
  post: {
    title: "Deaktivovať produkt",
    titleShort: "Deaktivovať",
    description:
      "Deaktivuje produkt v katalógu. Údaje produktu zostanú uložené.",
    productId: {
      label: "ID produktu",
      description: "ID produktu, ktorý chcete deaktivovať",
    },
    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "Skontrolujte ID produktu a skúste to znova",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na deaktiváciu produktu sa prihláste",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie deaktivovať tento produkt",
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
        description: "Produkt sa nenašiel",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Produkt deaktivovaný",
      description: "Produkt sa už nezobrazuje v aktívnom katalógu.",
    },
    response: {
      id: "ID produktu",
      isActive: "Stav aktivity",
    },
    widget: {
      backToList: "Späť na produkty",
      back: "Späť",
      warning:
        "Produkt sa deaktivuje a prestane sa zobrazovať v aktívnom katalógu. Jeho údaje zostanú uložené.",
    },
  },
};
