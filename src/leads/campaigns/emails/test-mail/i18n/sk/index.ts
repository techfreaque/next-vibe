import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Kontakty",
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
  enums: {
    campaignType: {
      leadCampaign: "Kampaň pre kontakty",
      newsletter: "Newsletter",
      signupNurture: "Začíname po registrácii",
      retention: "Udržanie predplatiteľov",
      winback: "Návrat používateľov",
      transactional: "Transakčný e-mail",
      notification: "Oznámenie",
      system: "Systémový e-mail",
    },
    emailJourneyVariant: {
      uncensoredConvert: "Odporúčanie bez cenzúry",
      sideHustle: "Vedľajší príjem",
      quietRecommendation: "Nenápadné odporúčanie",
      signupNurture: "Začíname po registrácii",
      retention: "Udržanie predplatiteľov",
      winback: "Návrat používateľov",
      newsletterMay2026: "Newsletter máj 2026",
      newsletterNov2026: "Newsletter november 2026",
    },
    emailCampaignStage: {
      notStarted: "Nespustené",
      initial: "Prvé oslovenie",
      followup1: "Nadväzujúci e-mail 1",
      followup2: "Nadväzujúci e-mail 2",
      followup3: "Nadväzujúci e-mail 3",
      nurture: "Budovanie vzťahu",
      reactivation: "Obnovenie aktivity",
    },
    leadStatus: {
      new: "Nový",
      pending: "Čaká",
      campaignRunning: "Kampaň prebieha",
      websiteUser: "Používateľ webu",
      newsletterSubscriber: "Odberateľ newslettera",
      inContact: "Oslovený",
      signedUp: "Zaregistrovaný",
      subscriptionConfirmed: "Predplatné potvrdené",
      unsubscribed: "Odhlásený z odberu",
      bounced: "Vrátené",
      invalid: "Neplatný",
    },
    leadSource: {
      website: "Web",
      socialMedia: "Sociálne siete",
      emailCampaign: "E-mailová kampaň",
      referral: "Odporúčanie",
      csvImport: "Import CSV",
    },
  },
  tags: {
    campaigns: "Kampane",
    leads: "Kontakty",
  },
  post: {
    title: "Testovací e-mail",
    titleShort: "Testovací e-mail",
    description: "Odoslať testovací e-mail s vlastnými údajmi kontaktu",
    form: {
      title: "Nastavenie testovacieho e-mailu",
      description: "Nastavte parametre testovacieho e-mailu a údaje kontaktu",
    },
    campaignType: {
      label: "Typ kampane",
      description: "Typ e-mailovej kampane",
      placeholder: "Zadajte typ kampane",
    },
    emailJourneyVariant: {
      label: "Variant e-mailovej série",
      description: "Variant e-mailovej série pre A/B test",
      placeholder: "Vyberte variant e-mailovej série",
    },
    emailCampaignStage: {
      label: "Fáza e-mailovej kampane",
      description: "Aktuálna fáza e-mailovej kampane",
      placeholder: "Vyberte fázu kampane",
    },
    testEmail: {
      label: "Testovacia e-mailová adresa",
      description: "Adresa, na ktorú sa odošle testovací e-mail",
      placeholder: "test@example.com",
    },
    leadData: {
      title: "Údaje kontaktu",
      description: "Údaje kontaktu na vytvorenie správy zo šablóny",
      businessName: {
        label: "Názov firmy",
        description: "Názov firmy",
        placeholder: "Acme Corporation",
      },
      contactName: {
        label: "Meno kontaktu",
        description: "Meno kontaktnej osoby",
        placeholder: "John Doe",
      },
      website: {
        label: "Web",
        description: "Adresa URL webu firmy",
        placeholder: "https://example.com",
      },
      country: {
        label: "Krajina",
        description: "Kód krajiny",
        placeholder: "GLOBAL",
      },
      language: {
        label: "Jazyk",
        description: "Kód preferovaného jazyka",
        placeholder: "en",
      },
      status: {
        label: "Stav",
        description: "Stav kontaktu",
        placeholder: "NEW",
      },
      source: {
        label: "Zdroj",
        description: "Zdroj kontaktu",
        placeholder: "WEBSITE",
      },
      notes: {
        label: "Poznámky",
        description: "Ďalšie poznámky o kontakte",
        placeholder: "Zadajte doplňujúce poznámky",
      },
    },
    response: {
      title: "Výsledok odoslania",
      description: "Výsledok odoslania testovacieho e-mailu",
      success: {
        content: "Úspech",
      },
      messageId: {
        content: "ID správy",
      },
      testEmail: {
        content: "Testovací e-mail",
      },
      subject: {
        content: "Predmet e-mailu",
      },
      sentAt: {
        content: "Čas odoslania",
      },
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Neplatné parametre požiadavky",
      },
      server: {
        title: "Chyba servera",
        description: "Vyskytla sa interná chyba servera",
        detail: "Odoslanie testovacieho e-mailu zlyhalo: {{error}}",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neznáma chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Vyskytla sa chyba siete",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zamietnutý",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Zdroj sa nenašiel",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt údajov",
      },
      templateNotFound: {
        title:
          "Chýba šablóna pre {{emailJourneyVariant}} / {{emailCampaignStage}}",
        description: "Pre zadané parametre sa nenašla e-mailová šablóna",
      },
      sendingFailed: {
        title: "Odoslanie na {{recipient}} zlyhalo ({{subject}}): {{error}}",
        description: "Testovací e-mail sa nepodarilo odoslať",
      },
    },
    success: {
      title: "Úspech",
      description: "Testovací e-mail bol odoslaný",
    },
    selectionCriteria: "Kritériá výberu SMTP",
    widget: {
      title: "Odoslať testovací e-mail",
      send: "Odoslať testovací e-mail",
      sending: "Odosiela sa…",
      successMessage: "Testovací e-mail bol odoslaný",
      sentTo: "Odoslané na: ",
      subject: "Predmet: ",
      sentAt: "Čas odoslania: ",
      campaignConfig: "Nastavenie kampane",
      sendAnother: "Odoslať ďalší",
    },
  },
};
