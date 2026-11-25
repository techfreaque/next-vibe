import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  emailPlaceholder: "Zadaj e-mailovú adresu",
  page: {
    eyebrow: "Novinky od {{appName}}",
    title: "Jeden e-mail mesačne. Len to, čo sa zmenilo.",
    description:
      "Nové modely, nové funkcie a zadania, ktoré fungujú. Raz mesačne.",
    subtitle: "Nové modely, nové funkcie a zadania, ktoré fungujú.",
    heroDescription:
      "Nové modely hneď po vydaní, dôležité funkcie a nastavenia, ktoré prinášajú výsledky. Raz mesačne. Odber zrušíš jedným kliknutím.",
    invalidEmail: {
      title: "Neplatná e-mailová adresa",
      description:
        "Táto adresa nevyzerá správne. Skontroluj ju a skús to znova.",
    },
    emailProvided: {
      title: "Spravuj svoj odber",
      description:
        "Nastavenia odberu môžeš kedykoľvek zmeniť alebo odber zrušiť.",
    },
    unsubscribeText: "Chceš zrušiť odber?",
    unsubscribeLink: "Zrušiť odber",
    privacyNote: "Žiadny spam. Tvoju e-mailovú adresu nikdy nezdieľame.",
    cta: {
      title: "Dostávaj ďalšie vydania.",
      description: "Jeden e-mail mesačne. Iba to podstatné.",
      subscribeButton: "Prihlásiť sa na odber",
    },
    benefits: {
      title: "Čo ti príde do schránky",
      subtitle: "Štyri veci. To je všetko.",
      benefit1: {
        title: "Nové modely medzi prvými",
        description:
          "Každý model, ktorý pridáme. V čom vyniká, koľko stojí a kedy ho použiť.",
      },
      benefit2: {
        title: "Funkcie, ktoré sú už dostupné",
        description:
          "Čo sa zmenilo, prečo na tom záleží a ako to môžeš použiť už dnes.",
      },
      benefit3: {
        title: "Zadania, ktoré fungujú",
        description:
          "Nastavenia a zručnosti, ktoré prinášajú výsledky. Skopíruj si ich, prispôsob a použi.",
      },
      benefit4: {
        title: "Ponuky pre odberateľov",
        description: "Zľavy a prístup k novinkám skôr ako ostatní.",
      },
    },
    frequency: {
      title: "Raz mesačne. To je všetko.",
      description:
        "Jeden e-mail za mesiac. Odber kedykoľvek zrušíš jedným kliknutím.",
    },
  },
  subscription: {
    unsubscribe: {
      title: "Zrušiť odber",
      confirmButton: "Potvrdiť zrušenie odberu",
      success: "Odber bol zrušený",
      error: "Odber sa nepodarilo zrušiť",
    },
  },
  unsubscribe: {
    page: {
      title: "Zrušenie odberu noviniek",
      description: "Mrzí nás, že odchádzaš",
      subtitle: "Spravuj svoj odber noviniek",
      emailProvided: {
        title: "Potvrď zrušenie odberu",
        description: "Chceš zrušiť odber našich noviniek?",
      },
      unsubscribeButton: "Zrušiť odber",
      subscribeText: "Rozmyslel si si to?",
      subscribeLink: "Prihlásiť sa znova",
      info: {
        title: "Čo sa stane ďalej",
        description: "Čo potrebuješ vedieť o zrušení odberu",
        immediate: {
          title: "Platí okamžite",
          description: "E-maily s novinkami ti hneď prestanú chodiť.",
        },
        resubscribe: {
          title: "Odber môžeš obnoviť",
          description:
            "Ak si to rozmyslíš, kedykoľvek sa môžeš znova prihlásiť.",
        },
      },
      alternatives: {
        title: "Pred odchodom",
        description: "Môžeš skúsiť aj tieto možnosti:",
        subscribe: "Upraviť frekvenciu e-mailov",
        contact: "Poslať nám spätnú väzbu",
      },
    },
  },
};
