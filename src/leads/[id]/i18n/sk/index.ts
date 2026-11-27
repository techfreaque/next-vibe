import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  traffic: {
    burstNetwork: "Náhly nárast v jednej sieti. Kontakty za 30 dní: {{count}}",
    sharedAgent: "Spoločný identifikátor klienta. Počet kontaktov: {{count}}",
    title: "Návštevnosť a sieť",
    subtitle:
      "Typ klienta, prvá návšteva a počet kontaktov, ktoré používajú rovnakú sieť alebo identifikátor klienta.",
    agent: "Typ klienta",
    firstTouch: "Prvá návšteva",
    referrer: "Odkazujúci web",
    landingPath: "Vstupná stránka",
    refCode: "Kód odporúčania",
    freeCredits: "Minuté bezplatné kredity",
    network: "Sieť",
    sameAgent: "Rovnaký identifikátor klienta",
    agentLeadsIn30d: "Kontakty za 30 dní: {{count}}",
    openLeads: "Otvoriť kontakty",
  },
  category: "Kontakty",
  tags: {
    leads: "Kontakty",
    management: "Správa",
  },

  get: {
    title: "Načítať podrobnosti o kontakte",
    titleShort: "Podrobnosti o kontakte",
    description: "Získať podrobné informácie o konkrétnom kontakte",
    backButton: {
      label: "Späť ku kontaktom",
    },
    editButton: {
      label: "Upraviť kontakt",
    },
    deleteButton: {
      label: "Odstrániť kontakt",
    },
    id: {
      label: "ID kontaktu",
      description: "Jedinečný identifikátor kontaktu",
    },
    form: {
      title: "Požiadavka na podrobnosti o kontakte",
      description: "Parametre na načítanie údajov o kontakte",
    },
    response: {
      title: "Informácie o kontakte",
      description: "Všetky údaje o kontakte a jeho história",
      basicInfo: {
        title: "Základné informácie",
        description: "Základné identifikačné údaje a stav kontaktu",
      },
      id: {
        content: "ID kontaktu",
      },
      email: {
        content: "E-mailová adresa",
      },
      businessName: {
        content: "Názov firmy",
      },
      contactName: {
        content: "Meno kontaktnej osoby",
      },
      status: {
        content: "Stav kontaktu",
      },
      contactDetails: {
        title: "Kontaktné údaje",
        description: "Kontaktné informácie a preferencie",
      },
      phone: {
        content: "Telefónne číslo",
      },
      website: {
        content: "Adresa webovej stránky",
      },
      country: {
        content: "Krajina",
      },
      language: {
        content: "Jazyk",
      },
      campaignTracking: {
        title: "Sledovanie kampane",
        description: "Údaje o e-mailovej kampani a jej priebehu",
      },
      source: {
        content: "Zdroj kontaktu",
      },
      currentCampaignStage: {
        content: "Aktuálna fáza kampane",
      },
      emailJourneyVariant: {
        content: "Variant série e-mailov",
      },
      emailsSent: {
        content: "Odoslané e-maily",
      },
      lastEmailSentAt: {
        content: "Posledný odoslaný e-mail",
      },
      engagement: {
        title: "Ukazovatele interakcií",
        description:
          "Údaje o otvoreniach e-mailov, kliknutiach a ďalších reakciách",
      },
      emailsOpened: {
        content: "Otvorené e-maily",
      },
      emailsClicked: {
        content: "E-maily s kliknutím na odkaz",
      },
      lastEngagementAt: {
        content: "Posledná interakcia",
      },
      unsubscribedAt: {
        content: "Čas odhlásenia z odberu",
      },
      conversion: {
        title: "Sledovanie konverzie",
        description: "Dôležité kroky kontaktu na ceste ku konverzii",
      },
      convertedUserId: {
        content: "ID používateľa po konverzii",
      },
      convertedAt: {
        content: "Čas konverzie",
      },
      signedUpAt: {
        content: "Čas registrácie",
      },
      subscriptionConfirmedAt: {
        content: "Čas potvrdenia predplatného",
      },
      metadata: {
        title: "Ďalšie informácie",
        description: "Poznámky a metaúdaje",
        content: "Metadáta",
      },
      notes: {
        content: "Poznámky",
      },
      createdAt: {
        content: "Čas vytvorenia",
      },
      updatedAt: {
        content: "Čas poslednej aktualizácie",
      },
      identity: {
        title: "Zariadenie a identita",
        description:
          "Údaje o zariadení a identifikátory používané pri sledovaní návštev",
      },
      ipAddress: {
        content: "IP adresa",
      },
      userAgent: {
        content: "Identifikátor klienta",
      },
      deviceType: {
        content: "Typ zariadenia",
      },
      browser: {
        content: "Prehliadač",
      },
      os: {
        content: "Operačný systém",
      },
      referralCode: {
        content: "Kód odporúčania",
      },
      lifecycle: {
        title: "Životný cyklus",
        description: "Ďalšie dôležité dátumy v histórii kontaktu",
      },
      bouncedAt: {
        content: "Čas vrátenia nedoručeného e-mailu",
      },
      invalidAt: {
        content: "Označené ako neplatné",
      },
      campaignStartedAt: {
        content: "Začiatok kampane",
      },
      linkedLeads: {
        title: "Prepojené kontakty",
        description: "Kontakty priradené tej istej osobe",
        linkedLeadId: {
          content: "ID prepojeného kontaktu",
        },
        linkReason: {
          content: "Dôvod prepojenia",
        },
        linkedAt: {
          content: "Čas prepojenia",
        },
        email: {
          content: "E-mail",
        },
        businessName: {
          content: "Názov firmy",
        },
        status: {
          content: "Stav",
        },
        ipAddress: {
          content: "IP adresa",
        },
        userAgent: {
          content: "Identifikátor klienta",
        },
        createdAt: {
          content: "Čas vytvorenia",
        },
      },
      linkedUsers: {
        title: "Prepojené používateľské účty",
        description: "Používateľské účty prepojené s týmto kontaktom",
        userId: {
          content: "ID používateľa",
        },
        linkReason: {
          content: "Dôvod prepojenia",
        },
        linkedAt: {
          content: "Čas prepojenia",
        },
        email: {
          content: "E-mail",
        },
        publicName: {
          content: "Zobrazované meno",
        },
      },
      referralHistory: {
        title: "História odporúčaní",
        description:
          "Kódy odporúčaní, na ktoré kontakt klikol pred registráciou",
        code: {
          content: "Kód odporúčania",
        },
        ownerUserId: {
          content: "Vlastník kódu",
        },
        clickedAt: {
          content: "Čas kliknutia",
        },
      },
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Zadané ID kontaktu je neplatné.",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chcete zobraziť podrobnosti o kontakte, prihláste sa.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Na zobrazenie tohto kontaktu nemáte oprávnenie.",
      },
      notFound: {
        title: "Kontakt sa nenašiel",
        description: "Kontakt so zadaným ID sa nenašiel.",
      },
      server: {
        title: "Chyba servera",
        description: "Podrobnosti o kontakte sa nepodarilo načítať.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Nedá sa pripojiť k serveru",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny.",
      },
      conflict: {
        title: "Konflikt údajov",
        description: "Kontaktné údaje boli zmenené",
      },
    },
    success: {
      title: "Úspech",
      description: "Podrobnosti o kontakte sa načítali.",
    },
  },
  patch: {
    title: "Aktualizovať kontakt",
    titleShort: "Upraviť kontakt",
    description: "Upraviť údaje a stav kontaktu",
    backButton: {
      label: "Späť na kontakt",
    },
    deleteButton: {
      label: "Odstrániť kontakt",
    },
    submitButton: {
      label: "Aktualizovať kontakt",
      loadingText: "Aktualizuje sa kontakt…",
    },
    id: {
      label: "ID kontaktu",
      description: "Jedinečné ID kontaktu, ktorý chcete aktualizovať",
    },
    form: {
      title: "Aktualizovať kontakt",
      description: "Upraviť kontaktné informácie",
    },
    updates: {
      title: "Zmeny kontaktu",
      description: "Polia na aktualizáciu",
    },
    basicInfo: {
      title: "Základné informácie",
      description: "Aktualizovať základné údaje o kontakte",
    },
    email: {
      label: "E-mailová adresa",
      description: "E-mailová adresa kontaktnej osoby",
      placeholder: "email@example.com",
    },
    businessName: {
      label: "Názov firmy",
      description: "Názov firmy",
      placeholder: "Acme Corporation",
    },
    contactName: {
      label: "Meno kontaktnej osoby",
      description: "Hlavná kontaktná osoba",
      placeholder: "Ján Novák",
    },
    status: {
      label: "Stav kontaktu",
      description: "Aktuálny stav kontaktu",
      placeholder: "Vybrať stav",
    },
    contactDetails: {
      title: "Kontaktné údaje",
      description: "Aktualizovať kontaktné informácie",
    },
    phone: {
      label: "Telefónne číslo",
      description: "Kontaktné telefónne číslo",
      placeholder: "+421 900 123 456",
    },
    website: {
      label: "Webová stránka",
      description: "Adresa webovej stránky firmy",
      placeholder: "https://example.com",
    },
    country: {
      label: "Krajina",
      description: "Krajina sídla firmy",
      placeholder: "Vyberte krajinu",
    },
    language: {
      label: "Jazyk",
      description: "Preferovaný jazyk",
      placeholder: "Vybrať jazyk",
    },
    campaignManagement: {
      title: "Správa kampane",
      description: "Spravovať nastavenia kampane",
    },
    source: {
      label: "Zdroj kontaktu",
      description: "Pôvod kontaktu",
      placeholder: "Vybrať zdroj",
    },
    currentCampaignStage: {
      label: "Fáza kampane",
      description: "Aktuálna fáza e-mailovej kampane",
      placeholder: "Vybrať fázu",
    },
    additionalDetails: {
      title: "Ďalšie podrobnosti",
      description: "Poznámky a metaúdaje",
    },
    notes: {
      label: "Poznámky",
      description: "Interné poznámky o kontakte",
      placeholder: "Sem zadajte poznámky",
    },
    metadata: {
      label: "Metadáta",
      description: "Ďalšie metaúdaje (JSON)",
      placeholder: '{"key": "value"}',
    },
    convertedUserId: {
      label: "ID používateľa po konverzii",
      description: "ID používateľského účtu vytvoreného pri konverzii",
      placeholder: "ID používateľa",
    },
    subscriptionConfirmedAt: {
      label: "Čas potvrdenia predplatného",
      description: "Dátum potvrdenia predplatného",
      placeholder: "Vybrať dátum",
    },
    response: {
      title: "Aktualizovaný kontakt",
      description: "Aktualizované údaje o kontakte",
      basicInfo: {
        title: "Základné informácie",
        description: "Aktualizované základné údaje o kontakte",
      },
      id: {
        content: "ID kontaktu",
      },
      email: {
        content: "E-mailová adresa",
      },
      businessName: {
        content: "Názov firmy",
      },
      contactName: {
        content: "Meno kontaktnej osoby",
      },
      status: {
        content: "Stav kontaktu",
      },
      contactDetails: {
        title: "Kontaktné údaje",
        description: "Aktualizované kontaktné informácie",
      },
      phone: {
        content: "Telefónne číslo",
      },
      website: {
        content: "Adresa webovej stránky",
      },
      country: {
        content: "Krajina",
      },
      language: {
        content: "Jazyk",
      },
      campaignTracking: {
        title: "Sledovanie kampane",
        description: "Aktualizované informácie o kampani",
      },
      source: {
        content: "Zdroj kontaktu",
      },
      currentCampaignStage: {
        content: "Aktuálna fáza kampane",
      },
      emailJourneyVariant: {
        content: "Variant série e-mailov",
      },
      emailsSent: {
        content: "Odoslané e-maily",
      },
      lastEmailSentAt: {
        content: "Posledný odoslaný e-mail",
      },
      engagement: {
        title: "Ukazovatele interakcií",
        description: "Údaje o reakciách na e-maily",
      },
      emailsOpened: {
        content: "Otvorené e-maily",
      },
      emailsClicked: {
        content: "E-maily s kliknutím na odkaz",
      },
      lastEngagementAt: {
        content: "Posledná interakcia",
      },
      unsubscribedAt: {
        content: "Čas odhlásenia z odberu",
      },
      conversion: {
        title: "Sledovanie konverzie",
        description: "Prehľad krokov vedúcich ku konverzii",
      },
      convertedUserId: {
        content: "ID používateľa po konverzii",
      },
      convertedAt: {
        content: "Čas konverzie",
      },
      signedUpAt: {
        content: "Čas registrácie",
      },
      subscriptionConfirmedAt: {
        content: "Čas potvrdenia predplatného",
      },
      metadata: {
        title: "Ďalšie informácie",
        description: "Poznámky a metaúdaje",
        content: "Metadáta",
      },
      notes: {
        content: "Poznámky",
      },
      createdAt: {
        content: "Čas vytvorenia",
      },
      updatedAt: {
        content: "Čas poslednej aktualizácie",
      },
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Poskytnuté údaje sú neplatné",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chcete upravovať kontakty, prihláste sa.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Na úpravu tohto kontaktu nemáte oprávnenie.",
      },
      notFound: {
        title: "Kontakt sa nenašiel",
        description: "Kontakt so zadaným ID sa nenašiel.",
      },
      conflict: {
        title: "Konflikt pri aktualizácii",
        description: "Kontakt medzitým upravil iný používateľ.",
      },
      server: {
        title: "Chyba servera",
        description: "Pri úprave kontaktu nastala chyba",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Nedá sa pripojiť k serveru",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny.",
      },
    },
    success: {
      title: "Úspech",
      description: "Kontakt bol aktualizovaný",
    },
  },
  post: {
    title: "[id]",
    description: "Koncový bod [id]",
    form: {
      title: "Nastavenia [id]",
      description: "Nastaviť parametre [id]",
    },
    response: {
      title: "Odpoveď",
      description: "Údaje v odpovedi [id]",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      validation: {
        title: "Chyba overenia",
        description: "Neplatné parametre požiadavky",
      },
      server: {
        title: "Chyba servera",
        description: "Vyskytla sa interná chyba servera",
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
      conflict: {
        title: "Konflikt údajov",
        description: "Vyskytol sa konflikt údajov",
      },
    },
    success: {
      title: "Úspech",
      description: "Operácia prebehla úspešne",
    },
  },
  enums: {
    leadStatus: {
      new: "Nové",
      pending: "Čaká",
      campaignRunning: "Kampaň prebieha",
      websiteUser: "Používateľ webu",
      newsletterSubscriber: "Odberateľ newslettera",
      inContact: "Oslovený",
      signedUp: "Zaregistrovaný",
      subscriptionConfirmed: "Predplatné potvrdené",
      unsubscribed: "Odhlásené z odberu",
      bounced: "Nedoručené",
      invalid: "Neplatný",
    },
    leadSource: {
      website: "Webová stránka",
      referral: "Odporúčanie",
      socialMedia: "Sociálne médiá",
      emailCampaign: "E-mailová kampaň",
      csvImport: "Import CSV",
      api: "API",
      manual: "Ručne",
      other: "Iné",
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
    emailJourneyVariant: {
      uncensoredConvert: "Odporúčanie bez cenzúry",
      sideHustle: "Vedľajší príjem",
      quietRecommendation: "Nenápadné odporúčanie",
    },
  },
  journey: {
    reviewUnavailable:
      "Záznamy o peňaženkách, súhlasoch a histórii kontaktu sa nepodarilo načítať.",
    title: "História kontaktu",
    subtitle: "Od najstarších · nedávna aktivita a zaznamenané míľniky",
    unavailable: "Záznamy o histórii kontaktu sa nepodarilo načítať",
    campaign: "Rad správ kampane",
    emailScheduled: "Najbližší naplánovaný e-mail",
    campaignRunning: "Kampaň prebieha",
    noQueue: "Žiadny e-mail nie je naplánovaný",
    openQueue: "Otvoriť rad správ pre tento kontakt",
    openAccount: "Otvoriť účet",
    openLead: "Otvoriť kontakt",
    attributionOnly:
      "Prepojenia na základe atribúcie treba overiť. Spoločnú IP adresu alebo sledovanú návštevu môže zdieľať viac ľudí.",
    recordedAccountLink: "Evidované prepojenie s účtom",
    recordedConversion: "Účet evidovaný pri konverzii",
    attributedAccount: "Účet evidovaný pri priradení zdroja",
    previewIpMatches: "Zobraziť potenciálne zhody IP adries kontaktov",
    wallets: "Záznamy o peňaženkách",
    noWallets: "Nenašli sa žiadne záznamy o peňaženkách",
    thisLeadWallet: "Peňaženka tohto kontaktu",
    accountWallet: "Peňaženka účtu",
    relatedLeadWallet: "Peňaženka súvisiaceho kontaktu",
    newsletterConsent: "Záznamy o súhlase s odberom newslettera",
    noNewsletter: "Žiadne prepojené záznamy o odbere newslettera",
    consentRecorded: "Súhlas je zaznamenaný",
    consentAbsent: "Súhlas sa nezaznamenal",
    confirmedOn: "Potvrdené {{date}}",
    confirmationMissing: "Chýba dátum potvrdenia",
    guestConsent: "Súhlas hosťa s modelmi bez cenzúry",
    consentVersion: "Verzia súhlasu {{version}}",
    leadReference: "ID kontaktu {{id}}",
    accountReference: "ID účtu {{id}}",
    leadSource: "Zdroj kontaktu · {{source}}",
    guestConsentOn: "Súhlas s modelmi bez cenzúry je zaznamenaný od {{date}}",
    guestConsentMissing: "Súhlas s modelmi bez cenzúry sa nezaznamenal",
    consentVersionMissing: "Chýba verzia súhlasu",
    firstTouch: "Prvá návšteva · {{touch}}",
    lastTouch: "Posledná priradená návšteva · {{touch}}",
    attributionMissing: "Zdroj návštevnosti sa nezaznamenal",
    linkEvidenceUnavailable:
      "Podrobnosti o súhlase a priradení zdroja nie sú dostupné",
    optedOutOn: "Odhlásenie evidované {{date}}",
    optOutDateMissing: "Dátum odhlásenia sa nezaznamenal",
    events: {
      created: "Kontakt bol vytvorený",
      campaignStarted: "Kampaň bola spustená",
      emailSent: "E-mail kampane bol odoslaný",
      emailBounced: "E-mail kampane sa vrátil ako nedoručený",
      bounced: "Kontakt bol označený ako nedoručiteľný",
      unsubscribed: "Kontakt sa odhlásil z odberu",
      invalid: "Kontakt bol označený ako neplatný",
      signup: "Účet bol zaregistrovaný",
      converted: "Konverzia bola zaznamenaná",
      subscriptionConfirmed: "Predplatné bolo potvrdené",
      firstTouch: "Prvá zaznamenaná návšteva",
      lastTouch: "Posledná priradená návšteva",
      firstChat: "Prvý chat",
      firstPayment: "Prvá platená konverzia",
      leadLink: "Súvisiaci kontakt bol prepojený",
      accountLink: "Prepojenie s účtom bolo zaznamenané",
      referral: "Kód odporúčania bol použitý",
      interaction: "Interakcia bola zaznamenaná",
      newsletterSubscribed: "Prihlásenie na odber newslettera bolo zaznamenané",
      newsletterConfirmed: "E-mail pre odber newslettera bol potvrdený",
      newsletterUnsubscribed: "Odhlásenie z odberu newslettera",
    },
    evidence: {
      ipMatch: "Zhoda IP adresy",
      trackPage: "Sledovaná návšteva a súbor cookie návštevníka",
      referral: "Odkaz s odporúčaním",
      manual: "Ručné prepojenie",
      test: "Skúšobné prepojenie",
      login: "Prepojené pri prihlásení",
      signup: "Prepojené pri registrácii",
      merge: "Prepojenie zo staršieho zlúčenia",
    },
  },
  widget: {
    loading: "Načítava sa kontakt…",
    notFound: "Kontakt sa nenašiel.",
    loadFailed: "Kontakt sa nepodarilo načítať",
    retryLoad: "Skúste znova",
    back: "Späť",
    leadFallbackTitle: "Kontakt",
    edit: "Upraviť",
    delete: "Odstrániť",
    converted: "Po konverzii",
    quickActions: "Rýchle akcie",
    editLead: "Upraviť kontakt",
    sendTestEmail: "Poslať testovací e-mail",
    viewInSearch: "Otvoriť vo vyhľadávaní",
    userProfile: "Profil používateľa",
    userDetail: "Podrobnosti o používateľovi",
    creditHistory: "História kreditov",
    campaignFunnel: "Konverzný lievik kampane",
    sourceLabel: "Zdroj:",
    lastEmailLabel: "Posledný e-mail:",
    campaignPerformance: "Výkonnosť kampane",
    emailsSent: "Odoslané e-maily",
    opened: "Otvorené",
    clicked: "S kliknutím",
    openRate: "Miera otvorení",
    clickRate: "Miera kliknutí",
    clickToOpenRate: "Podiel otvorených e-mailov s kliknutím",
    contactDetails: "Kontaktné údaje",
    country: "Krajina",
    language: "Jazyk",
    engagement: "Interakcia",
    emailsOpened: "Otvorené e-maily",
    emailsClicked: "E-maily s kliknutím na odkaz",
    lastEngagement: "Posledná interakcia",
    unsubscribed: "Odhlásené z odberu",
    conversion: "Konverzia",
    signedUp: "Zaregistrovaný",
    convertedAt: "Čas konverzie",
    subscriptionConfirmed: "Predplatné potvrdené",
    convertedUserId: "ID používateľa po konverzii",
    activeSubscriberSince: "Aktívne predplatné od",
    viewUserProfile: "Zobraziť používateľský profil",
    viewUserDetail: "Zobraziť podrobnosti o používateľovi",
    notesAndMetadata: "Poznámky a metaúdaje",
    notes: "Poznámky",
    metadata: "Metadáta",
    created: "Vytvorené",
    lastUpdated: "Posledná aktualizácia",
    daysOld: "d od vytvorenia",
    lastEngaged: "Posledná interakcia",
    ago: "dozadu",
    variant: "Variant:",
    copyEmail: "e-mail",
    copyId: "ID",
    copyPhone: "telefón",
    copyUserId: "ID používateľa",
    stageNotStarted: "Nespustené",
    stageInitial: "Počiatočná",
    stageFollowup1: "Nadväzujúci e-mail 1",
    stageFollowup2: "Nadväzujúci e-mail 2",
    stageFollowup3: "Nadväzujúci e-mail 3",
    stageNurture: "Budovanie vzťahu",
    stageReactivation: "Obnovenie aktivity",
    tabOverview: "Prehľad",
    tabDetails: "Detaily",
    tabIdentity: "Identita",
    tabBasic: "Základné údaje",
    tabCampaign: "Kampaň",
    tabAdvanced: "Pokročilé",
    deviceIdentity: "Zariadenie a identita",
    ipAddress: "IP adresa",
    userAgent: "Identifikátor klienta",
    deviceType: "Typ zariadenia",
    browser: "Prehliadač",
    os: "Operačný systém",
    referralCode: "Kód odporúčania",
    lifecycleTimestamps: "Životný cyklus",
    bouncedAt: "Čas vrátenia nedoručeného e-mailu",
    invalidAt: "Označené ako neplatné",
    campaignStartedAt: "Začiatok kampane",
    linkedLeadsSection: "Prepojené kontakty",
    linkedLeadsEmpty: "Žiadne prepojené kontakty",
    linkedUsersSection: "Prepojené používateľské účty",
    linkedUsersEmpty: "Žiadne prepojené používateľské účty",
    linkReason: "Dôvod prepojenia:",
    linkedAt: "Prepojené:",
    copyIp: "IP",
    copyLinkedLeadId: "ID kontaktu",
    copyUserId2: "ID používateľa",
    more: "Viac",
    copyLeadId: "Kopírovať ID leadu",
    kpiFirstTouch: "Prvý kontakt",
    kpiStage: "Fáza kampane",
    kpiEmails: "Otvorené e-maily",
    kpiOpenRate: "{{percent}} % otvorení",
    kpiAge: "Vek leadu",
    kpiAgeValue: "{{count}} dní",
    kpiAgeHint: "Vytvorené {{date}}",
    kpiCredits: "Minuté bezplatné kredity",
    kpiCreditsHint: "Minuté v bezplatnom pláne",
    notTracked: "Nesledované",
    selectLead: "Vybrať kontakt",
  },
  delete: {
    title: "Odstrániť kontakt",
    titleShort: "Odstrániť kontakt",
    description:
      "Natrvalo odstráni kontakt aj jeho históriu. Nedá sa to vrátiť späť.",
    container: {
      title: "Odstrániť kontakt",
      description: "Naozaj chcete tento kontakt natrvalo odstrániť?",
    },
    backButton: {
      label: "Zrušiť",
    },
    submitButton: {
      label: "Odstrániť kontakt",
      loadingText: "Odstraňuje sa kontakt…",
    },
    actions: {
      delete: "Odstrániť kontakt",
      deleting: "Odstraňuje sa kontakt…",
    },
    id: {
      label: "ID kontaktu",
      description: "Jedinečný identifikátor kontaktu, ktorý sa má odstrániť",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Zadané ID kontaktu je neplatné.",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chcete odstrániť kontakty, prihláste sa.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Na odstránenie tohto kontaktu nemáte oprávnenie.",
      },
      notFound: {
        title: "Kontakt sa nenašiel",
        description: "Kontakt so zadaným ID sa nenašiel.",
      },
      conflict: {
        title: "Konflikt pri odstránení",
        description:
          "Kontakt nemožno odstrániť, pretože naň odkazujú iné záznamy",
      },
      server: {
        title: "Chyba servera",
        description: "Pri odstraňovaní kontaktu nastala chyba.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Nedá sa pripojiť k serveru",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny.",
      },
    },
    success: {
      title: "Kontakt odstránený",
      description: "Kontakt bol úspešne odstránený",
    },
  },
  countries: {
    ...regionalCountryNames("sk"),
    global: "Celosvetové",
    de: "Nemecko",
    pl: "Poľsko",
    fr: "Francúzsko",
    us: "Spojené štáty",
  },
  languages: {
    it: "Taliančina",
    es: "Španielčina",
    sk: "Slovenčina",
    hi: "Hindčina",
    en: "Angličtina",
    de: "Nemčina",
    pl: "Poľština",
    fr: "Francúzština",
  },
};
