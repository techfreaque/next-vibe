import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Zber kontaktov",
  tags: {
    leadMagnet: "lead-magnet",
    config: "config",
    capture: "capture",
  },
  enums: {
    captureStatus: {
      success: "Úspech",
      failed: "Zlyhalo",
    },
    provider: {
      getresponse: "GetResponse",
      klaviyo: "Klaviyo",
      emarsys: "Emarsys",
      acumbamail: "Acumbamail",
      cleverreach: "CleverReach",
      connectif: "Connectif",
      datanext: "DataNext",
      edrone: "Edrone",
      expertsender: "ExpertSender",
      freshmail: "FreshMail",
      mailup: "MailUp",
      mapp: "Mapp",
      sailthru: "Sailthru",
      salesmanago: "SALESmanago",
      shopify: "Shopify",
      spotler: "Spotler",
      youlead: "YouLead",
      adobecampaign: "Adobe Campaign",
      googleSheets: "Google Sheets",
      platformEmail: "E-mail (cez platformu)",
    },
  },
  config: {
    title: "Nastavenia zberu kontaktov",
    description: "Nastav prepojenie e-mailovej služby na zber kontaktov",
    form: {
      title: "Nastavenia zberu kontaktov",
      description:
        "Pripoj e-mailovú službu a zbieraj kontakty zo stránky svojej zručnosti",
      provider: {
        label: "E-mailová služba",
        description: "Ktorú službu na e-mailový marketing používaš?",
      },
      listId: {
        label: "ID zoznamu alebo skupiny",
        description:
          "ID zoznamu alebo segmentu, do ktorého sa majú pridávať kontakty (voliteľné)",
      },
      headline: {
        label: "Nadpis formulára",
        description: "Nadpis nad formulárom na získavanie kontaktov",
        placeholder: "Získaj môj balík promptov pre AI zadarmo",
      },
      buttonText: {
        label: "Text tlačidla",
        description: "Text na tlačidle na odoslanie",
        placeholder: "Získať prístup →",
      },
      isActive: {
        label: "Aktívne",
        description:
          "Zapni alebo vypni formulár na zber kontaktov na stránke svojej zručnosti",
      },
      credentials: {
        label: "Prihlasovacie údaje API",
        description:
          "Údaje na prístup k API e-mailovej služby (ukladajú sa šifrovane)",
      },
    },
    success: {
      saved: "Nastavenia zberu kontaktov sa uložili",
      deleted: "Nastavenia zberu kontaktov sa odstránili",
    },
  },
  capture: {
    title: "Pridať sa do zoznamu",
    description: "Prihlás sa na odber a získaj prístup",
    form: {
      title: "Získať prístup",
      description: "Zadaj údaje a získaj prístup",
      firstName: {
        label: "Krstné meno",
        description: "Tvoje krstné meno",
      },
      email: {
        label: "E-mailová adresa",
        description: "Tvoja e-mailová adresa",
      },
      skillId: {
        label: "ID zručnosti",
        description: "Interná referencia na zručnosť",
      },
    },
    success: {
      submitted: "Si v zozname. Skontroluj e-mail.",
    },
  },
  errors: {
    providerError: "Chyba poskytovateľa e-mailu",
  },
  providers: {
    shared: {
      connectionSettings: "Nastavenia pripojenia",
      listId: {
        label: "ID zoznamu alebo skupiny",
        description:
          "ID zoznamu alebo segmentu, do ktorého sa majú pridávať kontakty",
        placeholder: "napríklad abc123",
      },
      headline: {
        label: "Nadpis formulára",
        description:
          "Nadpis nad formulárom na zber kontaktov na stránke tvojej zručnosti",
        placeholder: "Získaj môj balík promptov pre AI zadarmo",
      },
      buttonText: {
        label: "Text tlačidla",
        description: "Text na tlačidle na odoslanie",
        placeholder: "Získať prístup →",
      },
      isActive: {
        label: "Aktívne",
        description:
          "Zapni formulár na zber kontaktov na stránke svojej zručnosti",
      },
      secretKeepExisting:
        "Ak chceš ponechať aktuálny kľúč, nechaj pole prázdne",
      saveTitle: "Uložiť nastavenia",
      saveDescription: "Pripoj e-mailovú službu a zbieraj kontakty",
      saveTag: "lead-magnet-provider",
      saveSuccess: {
        title: "Nastavenia uložené",
        description:
          "Tvoja e-mailová služba je pripojená. Nové kontakty sa budú pridávať automaticky.",
      },
      errors: {
        validation: {
          title: "Chyba overenia údajov",
          description: "Skontroluj zadané údaje",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Vyžaduje sa prihlásenie",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Nemáš potrebné oprávnenie",
        },
        notFound: { title: "Nenašlo sa", description: "Zdroj sa nenašiel" },
        conflict: {
          title: "Konflikt",
          description: "Nastal konflikt",
        },
        network: {
          title: "Chyba siete",
          description: "Vyskytla sa chyba siete",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máš neuložené zmeny",
        },
        internal: {
          title: "Chyba servera",
          description: "Vyskytla sa interná chyba",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neznáma chyba",
        },
      },
      response: {
        provider: "Poskytovateľ",
        isActive: "Aktívne",
        headline: "Nadpis",
        buttonText: "Text tlačidla",
        listId: "ID zoznamu",
      },
    },
    klaviyo: {
      title: "Pripojiť Klaviyo",
      titleShort: "Klaviyo",
      description:
        "Pripoj účet Klaviyo a zbieraj kontakty zo stránky svojej zručnosti",
      klaviyoApiKey: {
        label: "Kľúč API Klaviyo",
        description: "Tvoj súkromný kľúč API pre Klaviyo",
        placeholder: "pk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    getresponse: {
      title: "Pripojiť GetResponse",
      titleShort: "GetResponse",
      description:
        "Pripoj účet GetResponse a zbieraj kontakty zo stránky svojej zručnosti",
      getresponseApiKey: {
        label: "Kľúč API GetResponse",
        description: "Tvoj kľúč API z nastavení účtu GetResponse",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    emarsys: {
      title: "Pripojiť Emarsys",
      titleShort: "Emarsys",
      description:
        "Pripoj účet Emarsys a zbieraj kontakty zo stránky svojej zručnosti",
      emarsysUserName: {
        label: "Používateľské meno",
        description: "Tvoje používateľské meno pre API Emarsys",
        placeholder: "account123",
      },
      emarsysApiKey: {
        label: "Kľúč API",
        description: "Tvoj tajný kľúč API pre Emarsys",
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      },
      emarsysSubDomain: {
        label: "Subdoména",
        description:
          "Tvoja subdoména API Emarsys (napríklad suite.emarsys.net)",
        placeholder: "suite.emarsys.net",
      },
    },
    acumbamail: {
      title: "Pripojiť Acumbamail",
      titleShort: "Acumbamail",
      description:
        "Pripoj účet Acumbamail a zbieraj kontakty zo stránky svojej zručnosti",
      acumbamailApiKey: {
        label: "Kľúč API",
        description: "Tvoj kľúč API pre Acumbamail",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    cleverreach: {
      title: "Pripojiť CleverReach",
      titleShort: "CleverReach",
      description:
        "Pripoj účet CleverReach a zbieraj kontakty zo stránky svojej zručnosti",
      cleverreachClientId: {
        label: "ID klienta",
        description: "Tvoje ID klienta OAuth pre CleverReach",
        placeholder: "xxxxxxxx",
      },
      cleverreachClientSecret: {
        label: "Tajný kľúč klienta",
        description: "Tvoj tajný kľúč klienta OAuth pre CleverReach",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      cleverreachListId: {
        label: "ID skupiny alebo zoznamu",
        description:
          "ID skupiny CleverReach, do ktorej sa majú pridávať kontakty",
        placeholder: "123456",
      },
      cleverreachFormId: {
        label: "ID formulára DOI (voliteľné)",
        description:
          "ID formulára na potvrdenie odberu v dvoch krokoch. Ak DOI nechceš použiť, nechaj pole prázdne.",
        placeholder: "123456",
      },
      cleverreachSource: {
        label: "Zdroj (voliteľné)",
        description: "Označenie zdroja kontaktu na sledovanie",
        placeholder: "unbottled.ai",
      },
    },
    connectif: {
      title: "Pripojiť Connectif",
      titleShort: "Connectif",
      description:
        "Pripoj účet Connectif a zbieraj kontakty zo stránky svojej zručnosti",
      connectifApiKey: {
        label: "Kľúč API",
        description: "Tvoj kľúč API pre Connectif",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    datanext: {
      title: "Pripojiť DataNext",
      titleShort: "DataNext",
      description:
        "Pripoj účet DataNext a zbieraj kontakty zo stránky svojej zručnosti",
      datanextApiKey: {
        label: "Kľúč API",
        description: "Tvoj kľúč API pre DataNext",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      datanextApiSecret: {
        label: "Tajný kľúč API",
        description: "Tvoj tajný kľúč API pre DataNext",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      datanextFormId: {
        label: "ID formulára",
        description: "ID prihlasovacieho formulára v DataNext",
        placeholder: "123456",
      },
      datanextCampaignId: {
        label: "ID kampane",
        description: "ID kampane, ku ktorej sa majú priradiť kontakty",
        placeholder: "123456",
      },
    },
    edrone: {
      title: "Pripojiť Edrone",
      titleShort: "Edrone",
      description:
        "Pripoj účet Edrone a zbieraj kontakty zo stránky svojej zručnosti",
      edroneAppId: {
        label: "ID aplikácie",
        description: "Tvoje ID aplikácie Edrone",
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      },
    },
    expertsender: {
      title: "Pripojiť ExpertSender",
      titleShort: "ExpertSender",
      description:
        "Pripoj účet ExpertSender a zbieraj kontakty zo stránky svojej zručnosti",
      expertSenderApiDomain: {
        label: "Doména API",
        description: "Tvoja doména API ExpertSender",
        placeholder: "api3.esv2.com",
      },
      expertSenderApiKey: {
        label: "Kľúč API",
        description: "Tvoj kľúč API pre ExpertSender",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    freshmail: {
      title: "Pripojiť FreshMail",
      titleShort: "FreshMail",
      description:
        "Pripoj účet FreshMail a zbieraj kontakty zo stránky svojej zručnosti",
      freshmailApiKey: {
        label: "Kľúč API",
        description: "Tvoj kľúč API pre FreshMail",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      freshmailApiSecret: {
        label: "Tajný kľúč API",
        description: "Tvoj tajný kľúč API pre FreshMail",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      listHash: {
        label: "Hash zoznamu",
        description:
          "Hash zoznamu odberateľov, do ktorého sa majú pridávať kontakty",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    mailup: {
      title: "Pripojiť MailUp",
      titleShort: "MailUp",
      description:
        "Pripoj účet MailUp a zbieraj kontakty zo stránky svojej zručnosti",
      mailupClientId: {
        label: "ID klienta",
        description: "Tvoje ID klienta OAuth pre MailUp",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      mailupClientSecret: {
        label: "Tajný kľúč klienta",
        description: "Tvoj tajný kľúč klienta OAuth pre MailUp",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      mailupUsername: {
        label: "Používateľské meno",
        description: "Tvoje používateľské meno účtu MailUp",
        placeholder: "m12345",
      },
      mailupPassword: {
        label: "Heslo",
        description: "Heslo tvojho účtu MailUp",
        placeholder: "••••••••",
      },
      mailupListId: {
        label: "ID zoznamu",
        description:
          "Číselné ID zoznamu, do ktorého sa majú pridať odberatelia",
        placeholder: "1",
      },
    },
    mapp: {
      title: "Pripojiť Mapp",
      titleShort: "Mapp",
      description:
        "Pripoj účet Mapp a zbieraj kontakty zo stránky svojej zručnosti",
      mappUsername: {
        label: "Používateľské meno",
        description: "Tvoje používateľské meno pre API Mapp",
        placeholder: "username",
      },
      mappPassword: {
        label: "Heslo",
        description: "Tvoje heslo pre API Mapp",
        placeholder: "••••••••",
      },
      mappDomain: {
        label: "Doména",
        description: "Tvoja doména API Mapp",
        placeholder: "api.mapp.com",
      },
    },
    sailthru: {
      title: "Pripojiť Sailthru",
      titleShort: "Sailthru",
      description:
        "Pripoj účet Sailthru a zbieraj kontakty zo stránky svojej zručnosti",
      sailthruApiKey: {
        label: "Kľúč API",
        description: "Tvoj kľúč API pre Sailthru",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      sailthruSecret: {
        label: "Tajný kľúč API",
        description: "Tvoj tajný kľúč API pre Sailthru",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      listName: {
        label: "Názov zoznamu",
        description:
          "Názov zoznamu Sailthru, do ktorého sa majú pridať odberatelia",
        placeholder: "My Subscribers",
      },
    },
    salesmanago: {
      title: "Pripojiť SALESmanago",
      titleShort: "SALESmanago",
      description:
        "Pripoj účet SALESmanago a zbieraj kontakty zo stránky svojej zručnosti",
      salesManagoClientId: {
        label: "ID klienta",
        description: "Tvoje ID klienta SALESmanago",
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      },
      salesManagoApiKey: {
        label: "Kľúč API",
        description: "Tvoj kľúč API pre SALESmanago",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      salesManagoSha: {
        label: "SHA",
        description: "Tvoj hash SHA na overenie v SALESmanago",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      salesManagoDomain: {
        label: "Doména",
        description: "Tvoja doména API SALESmanago",
        placeholder: "app3.salesmanago.pl",
      },
      salesManagoOwner: {
        label: "E-mail vlastníka",
        description: "E-mail vlastníka tvojho účtu SALESmanago",
        placeholder: "owner@example.com",
      },
    },
    shopify: {
      title: "Pripojiť Shopify",
      titleShort: "Shopify",
      description:
        "Pripoj obchod Shopify a zbieraj kontakty zo stránky svojej zručnosti",
      shopifyDomain: {
        label: "Doména obchodu",
        description: "Doména tvojho obchodu v Shopify",
        placeholder: "mystore.myshopify.com",
      },
      shopifyAccessToken: {
        label: "Prístupový token",
        description: "Tvoj prístupový token pre Shopify Admin API",
        placeholder: "shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    spotler: {
      title: "Pripojiť Spotler",
      titleShort: "Spotler",
      description:
        "Pripoj účet Spotler a zbieraj kontakty zo stránky svojej zručnosti",
      spotlerConsumerKey: {
        label: "Kľúč klienta",
        description: "Tvoj kľúč klienta pre API Spotler",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      spotlerConsumerSecret: {
        label: "Tajný kľúč klienta",
        description: "Tvoj tajný kľúč klienta pre API Spotler",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    youlead: {
      title: "Pripojiť YouLead",
      titleShort: "YouLead",
      description:
        "Pripoj účet YouLead a zbieraj kontakty zo stránky svojej zručnosti",
      youLeadAppId: {
        label: "ID aplikácie",
        description: "Tvoje ID aplikácie YouLead",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      youLeadClientId: {
        label: "ID klienta",
        description: "Tvoje ID klienta YouLead",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      youLeadAppSecretKey: {
        label: "Tajný kľúč aplikácie",
        description: "Tvoj tajný kľúč aplikácie YouLead",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    adobecampaign: {
      title: "Pripojiť Adobe Campaign",
      titleShort: "Adobe Campaign",
      description:
        "Pripoj účet Adobe Campaign a zbieraj kontakty zo stránky svojej zručnosti",
      adobeCampaignOrganizationId: {
        label: "ID organizácie",
        description: "Tvoje ID organizácie v Adobe IMS",
        placeholder: "XXXXXXXXXXXXXXXXXXXXXXXX@AdobeOrg",
      },
      adobeCampaignClientId: {
        label: "ID klienta",
        description: "Tvoje ID klienta API Adobe Campaign",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      adobeCampaignClientSecret: {
        label: "Tajný kľúč klienta",
        description: "Tvoj tajný kľúč klienta API Adobe Campaign",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      adobeCampaignApiKey: {
        label: "Kľúč API",
        description: "Tvoj kľúč API pre Adobe Campaign",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      adobeCampaignListId: {
        label: "ID zoznamu",
        description:
          "ID zoznamu profilov v Adobe Campaign, do ktorého sa majú pridávať kontakty",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    platformEmail: {
      title: "Oznamovať e-mailom cez platformu",
      titleShort: "E-mail platformy",
      description:
        "Dostaneš e-mail vždy, keď sa niekto prihlási na odber cez tvoj formulár",
      notifyEmail: {
        label: "E-mail na oznámenia",
        description: "Adresa na zasielanie oznámení o nových kontaktoch",
        placeholder: "you@example.com",
      },
      notifyEmailName: {
        label: "Tvoje meno",
        description: "Meno zobrazené v oznamovacom e-maile",
        placeholder: "Jane",
      },
    },
    googleSheets: {
      title: "Pripojiť Google Sheets",
      titleShort: "Google Sheets",
      description:
        "Pri každom prihlásení na odber pridá nový riadok do tvojej tabuľky Google",
      saveTitle: "Uložiť nastavenia Google Sheets",
      connect: {
        label: "Pripojiť účet Google",
      },
      connected: {
        description: "Tvoj účet Google je pripojený",
      },
      spreadsheetId: {
        label: "Tabuľka",
        description: "Vyber tabuľku na pridávanie kontaktov",
        placeholder: "Vyber tabuľku…",
      },
      sheetTab: {
        label: "Hárok (voliteľné)",
        description:
          "Názov hárka v tabuľke. Ak pole necháš prázdne, použije sa prvý hárok.",
        placeholder: "napríklad Kontakty",
      },
      widget: {
        connectTitle: "Pripojiť Google Sheets",
        connectDescription:
          "Prihlás sa cez Google a každý nový kontakt automaticky pribudne do tabuľky ako nový riadok.",
        redirectNote: "Na Googli povolíš prístup k tabuľke.",
        reconnect: "Pripojiť znova",
        loading: "Načítavajú sa tabuľky…",
        noSheets: "Nenašli sa žiadne tabuľky",
        refresh: "Obnoviť zoznam",
        selectRequired: "Vyber tabuľku",
        saveFailed: "Uloženie zlyhalo. Skús znova.",
        saving: "Ukladá sa…",
      },
    },
  },
};
