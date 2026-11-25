import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    companyType: {
      b2b: "B2B",
      b2c: "B2C",
      individual: "Fyzická osoba",
    },
    companyMemberRole: {
      owner: "Vlastník",
      admin: "Správca",
      member: "Člen",
      accountant: "Účtovník",
      viewer: "Čitateľ",
    },
  },
  tags: {
    companies: "Firmy",
    create: "Vytvoriť",
  },
  post: {
    title: "Vytvoriť firmu",
    titleShort: "Nová firma",
    description: "Zaregistrujte novú firmu. Automaticky získate oprávnenia vlastníka.",
    name: {
      label: "Názov firmy",
      description: "Obchodné meno firmy",
      placeholder: "Príklad, s. r. o.",
    },
    type: {
      label: "Typ firmy",
      description: "Obchodný model (B2B, B2C alebo jednotlivec)",
      placeholder: "Vyberte typ",
    },
    vatNumber: {
      label: "IČ DPH",
      description: "Identifikačné číslo pre DPH na daňové účely",
      placeholder: "DE123456789",
    },
    country: {
      label: "Krajina",
      description: "Krajina, v ktorej je firma registrovaná",
      placeholder: "Vyberte krajinu",
    },
    currency: {
      label: "Predvolená mena",
      description: "Hlavná mena na fakturáciu",
      placeholder: "EUR",
    },
    email: {
      label: "E-mail firmy",
      description: "Hlavná e-mailová adresa firmy",
      placeholder: "kontakt@firma.sk",
    },
    phone: {
      label: "Telefón firmy",
      description: "Hlavné telefónne číslo firmy",
      placeholder: "+421 2 1234 5678",
    },
    website: {
      label: "Webové sídlo",
      description: "Webová adresa firmy",
      placeholder: "https://company.com",
    },
    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "Skontrolujte polia a skúste to znova.",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chcete vytvoriť firmu, prihláste sa.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie vytvoriť firmu.",
      },
      conflict: {
        title: "Firma už existuje",
        description: "Firma s týmto názvom už existuje.",
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
      title: "Firma je vytvorená",
      description: "Firma je pripravená. Môžete pridať prvých členov.",
    },
    response: {
      id: "ID firmy",
      name: "Názov firmy",
    },
    widget: {
      viewCompany: "Zobraziť firmu",
      back: "Späť na zoznam",
    },
  },
};
