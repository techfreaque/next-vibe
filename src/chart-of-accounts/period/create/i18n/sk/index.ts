import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Otvoriť účtovné obdobie",
    titleShort: "Nové obdobie",
    description: "Vytvorte účtovné obdobie pre spoločnosť.",
    companyId: {
      label: "Firma",
      description: "Firma, pre ktorú chcete otvoriť obdobie",
      placeholder: "Vyberte firmu",
    },
    name: {
      label: "Názov obdobia",
      description: "napríklad Január 2026",
      placeholder: "Január 2026",
    },
    startDate: {
      label: "Dátum začiatku",
      description: "Začiatok účtovného obdobia.",
      placeholder: "",
    },
    endDate: {
      label: "Dátum konca",
      description: "Koniec účtovného obdobia.",
      placeholder: "",
    },
    response: { id: "ID obdobia", name: "Názov" },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Skontrolujte počiatočný a koncový dátum",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nedostatočné oprávnenia",
      },
      server: {
        title: "Chyba servera",
        description: "Obdobie sa nepodarilo vytvoriť.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      conflict: {
        title: "Prekrývanie období",
        description: "Rozsah dátumov sa prekrýva s existujúcim obdobím.",
      },
      network: {
        title: "Chyba siete",
        description: "Server sa nepodarilo kontaktovať",
      },
      notFound: { title: "Nenašlo sa", description: "Firma sa nenašla" },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Obdobie je vytvorené",
      description: "Účtovné obdobie otvorené",
    },
    widget: {
      viewButton: "Zobraziť obdobie",
      back: "Späť",
    },
  },
  title: "Vytvoriť obdobie",
  description: "Otvorte nové účtovné obdobie.",
  category: "Účtový rozvrh",
  tag: "Obdobie",
};
