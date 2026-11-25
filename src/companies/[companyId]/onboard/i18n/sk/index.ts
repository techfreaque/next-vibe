import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    country: {
      AT: "Rakúsko (AT)",
      DE: "Nemecko (DE)",
      XX: "Všeobecné nastavenie (XX)",
    },
  },
  tags: { companies: "firmy", onboard: "spustenie", setup: "nastavenie" },
  post: {
    title: "Nastaviť firmu",
    titleShort: "Nastaviť",
    description:
      "Nastavte novej firme účtový rozvrh, sadzby dane a predvolený bankový účet.",
    companyId: { label: "ID firmy", description: "Firma, ktorú chcete nastaviť" },
    country: {
      label: "Krajina",
      description:
        "Podľa krajiny sa vyberú sadzby dane a šablóna účtového rozvrhu.",
      placeholder: "DE",
    },
    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "Skontrolujte všetky polia",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chcete nastaviť účtovníctvo firmy, prihláste sa.",
      },
      forbidden: { title: "Prístup zamietnutý", description: "Na nastavenie potrebujete oprávnenia správcu." },
      conflict: {
        title: "Firma už je nastavená",
        description: "Táto firma už bola nastavená.",
      },
      server: {
        title: "Chyba servera",
        description: "Účtovníctvo sa nepodarilo nastaviť.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      network: { title: "Chyba siete", description: "Skontrolujte pripojenie a skúste to znova." },
      notFound: {
        title: "Firma sa nenašla",
        description: "Táto firma neexistuje.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Firma pripravená",
      description: "Firma je pripravená na používanie.",
    },
    response: {
      accountsCreated: "Vytvorené účty",
      accountsSkipped: "Vynechané účty",
      taxRatesCreated: "Vytvorené sadzby dane",
      cashAccountId: "ID účtu pokladnice",
      bankAccountId: "ID bankového účtu",
      success: "Úspech",
    },
  },
};
