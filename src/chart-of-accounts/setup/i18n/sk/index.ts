import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    country: {
      AT: "AT (ÖKR)",
      DE: "DE (SKR03)",
      XX: "XX (všeobecná osnova IFRS)",
    },
  },
  post: {
    title: "Nastaviť účtový rozvrh",
    titleShort: "Nastavenie",
    description:
      "Nastavte účtový rozvrh firmy podľa šablóny pre vybranú krajinu. Nastavenie môžete bezpečne spustiť opakovane.",
    companyId: {
      label: "ID firmy",
      description: "Vyberte firmu, ktorej účtový rozvrh chcete nastaviť.",
      placeholder: "Zadajte UUID firmy",
    },
    country: {
      label: "Krajina",
      description:
        "Použitá národná osnova (AT = ÖKR, DE = SKR03, XX = všeobecná osnova IFRS)",
      placeholder: "Vyberte krajinu",
    },
    response: {
      created: "Vytvorené účty",
      skipped: "Preskočené účty (už existovali)",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na nastavenie účtového rozvrhu sa prihláste",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Neplatné údaje. Skontrolujte ID firmy a krajinu.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Účtovný rozvrh môžu nastaviť iba vlastníci a správcovia firmy.",
      },
      server: {
        title: "Chyba servera",
        description: "Nastavenie zlyhalo. Skúste to znova.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      conflict: {
        title: "Účtový rozvrh už je nastavený",
        description: "Firma už má účtový rozvrh.",
      },
      network: {
        title: "Chyba siete",
        description: "Server sa nepodarilo kontaktovať",
      },
      notFound: {
        title: "Šablóna sa nenašla",
        description: "Pre túto krajinu sa nenašla šablóna účtového rozvrhu.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Účtový rozvrh pripravený",
      description: "Všetky účty firmy boli vytvorené.",
    },
    widget: {
      viewAccounts: "Zobraziť zoznam účtov",
    },
  },
  title: "Nastavenie účtového rozvrhu",
  description: "Nastavte účtový rozvrh firmy zo šablóny.",
  category: "Účtový rozvrh",
  tag: "Nastavenie",
};
