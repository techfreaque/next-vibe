import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Kontakty",
  tags: {
    leads: "Kontakty",
    create: "Vytvoriť",
  },

  enums: {
    leadSource: {
      website: "Web",
      socialMedia: "Sociálne siete",
      emailCampaign: "E-mailová kampaň",
      referral: "Odporúčanie",
      csvImport: "Import CSV",
    },
  },
  widget: {
    headerLeadCreated: "Kontakt vytvorený",
    headerCreateLead: "Vytvoriť kontakt",
    subheaderFillDetails: "Vyplňte údaje nižšie",
    fallbackLeadName: "Kontakt",
    buttonCopyId: "Kopírovať ID",
    buttonViewLead: "Zobraziť kontakt",
    buttonEditLead: "Upraviť kontakt",
    buttonBackToList: "Späť na zoznam",
  },
  post: {
    title: "Vytvoriť kontakt",
    titleShort: "Nový kontakt",
    description: "Vytvoriť nový kontakt v systéme",
    backButton: {
      label: "Späť na kontakty",
    },
    submitButton: {
      label: "Vytvoriť kontakt",
      loadingText: "Vytvára sa kontakt…",
    },
    form: {
      title: "Formulár nového kontaktu",
      description: "Zadajte údaje nového kontaktu",
    },
    contactInfo: {
      title: "Kontaktné údaje",
      description: "Hlavné údaje na spojenie s kontaktom",
    },
    email: {
      label: "E-mailová adresa",
      description: "Hlavná e-mailová adresa na komunikáciu",
      placeholder: "john@example.com",
    },
    businessName: {
      label: "Názov firmy",
      description: "Názov spoločnosti alebo podniku",
      placeholder: "Example Corp",
    },
    phone: {
      label: "Telefónne číslo",
      description: "Kontaktné telefónne číslo s predvoľbou krajiny",
      placeholder: "+1234567890",
    },
    website: {
      label: "Web",
      description: "Adresa URL webu firmy",
      placeholder: "https://example.com",
    },
    locationPreferences: {
      title: "Poloha a preferencie",
      description: "Geografické a jazykové preferencie",
    },
    country: {
      label: "Krajina",
      description: "Sídlo firmy alebo cieľový trh",
      placeholder: "Vyberte krajinu",
    },
    language: {
      label: "Jazyk",
      description: "Preferovaný jazyk komunikácie",
      placeholder: "Vyberte jazyk",
    },
    leadDetails: {
      title: "Podrobnosti kontaktu",
      description: "Ďalšie informácie o kontakte",
    },
    source: {
      label: "Zdroj kontaktu",
      description: "Ako sme kontakt získali",
      placeholder: "Vyberte zdroj",
    },
    notes: {
      label: "Poznámky",
      description: "Ďalšie poznámky alebo komentáre",
      placeholder: "Zadajte doplňujúce informácie…",
    },
    response: {
      title: "Vytvorený kontakt",
      description: "Podrobnosti nového kontaktu",
      summary: {
        title: "Súhrn kontaktu",
        id: "ID kontaktu",
        businessName: "Názov firmy",
        email: "E-mailová adresa",
        status: "Stav kontaktu",
      },
      contactDetails: {
        title: "Kontaktné údaje",
        phone: "Telefónne číslo",
        website: "Adresa URL webu",
        country: "Krajina",
        language: "Jazyk",
      },
      trackingInfo: {
        title: "Údaje o sledovaní",
        source: "Zdroj kontaktu",
        emailsSent: "Počet e-mailov",
        currentCampaignStage: "Fáza kampane",
      },
      metadata: {
        title: "Metadáta",
        notes: "Poznámky",
        createdAt: "Dátum vytvorenia",
        updatedAt: "Posledná aktualizácia",
      },
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na vytvorenie kontaktu sa prihláste",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Zadané údaje kontaktu sú neplatné",
      },
      server: {
        title: "Chyba servera",
        description: "Pri vytváraní kontaktu nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri vytváraní kontaktu nastala neznáma chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Pri vytváraní kontaktu nastala chyba siete",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie vytvárať kontakty",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Zdroj potrebný na vytvorenie kontaktu sa nenašiel",
      },
      conflict: {
        title: "Konflikt",
        description: "Kontakt už existuje alebo nastal konflikt údajov",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Vo formulári kontaktu sú neuložené zmeny",
      },
    },
    success: {
      title: "Kontakt vytvorený",
      description: "Kontakt sa úspešne vytvoril",
    },
  },
  email: {
    welcome: {
      subject: "Vitaj na {{companyName}}",
      title: "Vitaj na {{companyName}}, {{businessName}}!",
      preview: "Vitaj. Takto môžeš začať.",
      greeting:
        "Vitaj na {{companyName}}, {{businessName}}! Teší nás, že si tu.",
      defaultName: "návštevník",
      introduction:
        "Ďakujeme za záujem. Tvoje údaje sme dostali a prečíta si ich človek z nášho tímu.",
      nextSteps: {
        title: "Čo bude nasledovať?",
        step1Number: "1.",
        step1: "Začni chatovať hneď. Bez nastavovania a bez platobnej karty.",
        step2Number: "2.",
        step2:
          "Máš otázku? Odpíš na tento e-mail. Prečíta si ho človek z tímu.",
        step3Number: "3.",
        step3: "Odpovieme hneď, ako budeme môcť.",
      },
      cta: {
        getStarted: "Začať chat",
      },
      support:
        "Máš otázku? Odpíš na tento e-mail alebo sa ozvi na {{supportEmail}}",
      error: {
        noEmail: "Uvítací e-mail sa nedá odoslať. Chýba e-mailová adresa.",
      },
    },
    admin: {
      newLead: {
        subject: "Nový kontakt: {{businessName}}",
        title: "Nový kontakt vytvorený",
        preview: "Nový kontakt {{businessName}} treba osloviť",
        message:
          "V systéme pribudol nový kontakt {{businessName}}, ktorému sa treba venovať.",
        leadDetails: "Podrobnosti kontaktu",
        businessName: "Názov firmy",
        email: "E-mail",
        phone: "Telefón",
        website: "Web",
        source: "Zdroj",
        status: "Stav",
        notes: "Poznámky",
        notProvided: "Neuvedené",
        viewLead: "Zobraziť podrobnosti kontaktu",
        viewAllLeads: "Zobraziť všetky kontakty",
        error: {
          noData:
            "Oznámenie správcovi sa nedá odoslať. Chýbajú údaje kontaktu.",
        },
        defaultName: "Nový kontakt",
      },
    },
    error: {
      general: {
        internal_server_error: "Vyskytla sa interná chyba servera",
      },
    },
  },
  countries: {
    ...regionalCountryNames("sk"),
    global: "Globálne",
    de: "Nemecko",
    pl: "Poľsko",
    fr: "Francúzsko",
    us: "Spojené štáty",
  },
  languages: {
    it: "Taliančina",
    es: "Španielčina",
    sk: "Slovenčina",
    en: "Angličtina",
    de: "Nemčina",
    pl: "Poľština",
    fr: "Francúzština",
  },
};
