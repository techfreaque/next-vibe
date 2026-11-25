import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    country: {
      AT: "Rakúsko (ÖKR)",
      DE: "Nemecko (SKR03)",
      XX: "Všeobecná osnova IFRS",
    },
  },
  post: {
    title: "Nastaviť účtový rozvrh",
    titleShort: "Nastaviť účtový rozvrh",
    description: "Doplňte firme potrebné účty zo štandardnej šablóny.",
    companyId: {
      label: "Firma",
      description: "Vyberte firmu, ktorej účtový rozvrh chcete nastaviť.",
      placeholder: "Vyberte firmu",
    },
    country: {
      label: "Účtovná šablóna",
      description: "Vyberte štruktúru účtov, ktorú chcete pridať.",
      placeholder: "Vyberte šablónu",
    },
    response: {
      created: "Vytvorené účty",
      skipped: "Zachované existujúce účty",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na nastavenie účtového rozvrhu sa prihláste",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Skontrolujte firmu a účtovnú šablónu.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description:
          "Účtovný rozvrh môžu nastaviť iba vlastníci a správcovia firmy.",
      },
      server: {
        title: "Chyba servera",
        description: "Skúste šablónu použiť znova.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      conflict: {
        title: "Skontrolujte nastavenie",
        description:
          "Pred použitím šablóny načítajte aktuálne účty firmy znova.",
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
      description:
        "Šablóna bola použitá. Nižšie si môžete zobraziť nové aj existujúce účty.",
    },
    widget: {
      review: "Skontrolujte nastavenie účtov",
      previewLoading: "Načítavajú sa existujúce účty…",
      previewFailed: "Aktuálny počet účtov nie je dostupný.",
      existing: "Existujúce účty: {{count}}.",
      empty: "Táto firma ešte nemá žiadne účty.",
      consequences:
        "Nastavenie doplní chýbajúce čísla účtov zo šablóny a zachová existujúce záznamy.",
      submit: "Pridať účty zo šablóny",
      back: "Späť",
      viewAccounts: "Otvoriť účtový rozvrh",
      viewPeriods: "Zobraziť účtovné obdobia",
    },
  },
  title: "Nastavenie účtového rozvrhu",
  description: "Nastavte účtový rozvrh firmy zo šablóny.",
  category: "Účtový rozvrh",
  tag: "Nastavenie",
};
