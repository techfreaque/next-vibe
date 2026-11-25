import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    tag: "lead-magnet-config",
    title: "Tvoj zoznam odberateľov",
    titleShort: "Nastavenia zberu kontaktov",
    description: "Zobraz aktuálne nastavenia zberu kontaktov",
    response: {
      exists: "Nastavenia existujú",
      config: "Nastavenia",
    },
    success: {
      title: "Nastavenia načítané",
      description: "Tvoje nastavenia zberu kontaktov sa načítali",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Údaje požiadavky sú neplatné",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáš potrebné oprávnenie",
      },
      notFound: { title: "Nenašlo sa", description: "Nastavenia sa nenašli" },
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
  },
  widget: {
    delete: "Odpojiť",
    confirmDelete: {
      title: "Odpojiť {{provider}}?",
      description:
        "Noví odberatelia už nebudú pribúdať. Získané kontakty ostanú tam, kde sú.",
      cancel: "Ponechať pripojenie",
      proceed: "Odpojiť",
    },
    back: "Späť",
    loading: "Načítava sa…",
    pitch: {
      headline: "Získaj odberateľov zo svojich návštevníkov",
      body: "Návštevníci stránky tvojej zručnosti alebo profilu tvorcu uvidia pole na odber. Po zadaní e-mailu sa pridajú priamo do tvojho zoznamu. Na základný zber nepotrebuješ ďalšiu aplikáciu, sprostredkovateľa ani mesačný poplatok.",
      step1: "Niekto otvorí stránku tvojej zručnosti alebo profil tvorcu",
      step2: "Odošle formulár na prihlásenie na odber",
      step3: "E-mail pribudne do zoznamu v službe, ktorú si vyberieš",
    },
    noConfig:
      "Pripoj e-mailovú službu a získavaj odberateľov zo stránok svojich zručností aj profilu tvorcu.",
    active: "Aktívne",
    inactive: "Neaktívne",
    choosePlatform: "Pripojiť e-mailovú službu",
    switchPlatform: "Zmeniť službu",
    selectPlaceholder: "Vyber službu…",
    providers: {
      GETRESPONSE: "GetResponse",
      KLAVIYO: "Klaviyo",
      EMARSYS: "Emarsys",
      ACUMBAMAIL: "Acumbamail",
      CLEVERREACH: "CleverReach",
      CONNECTIF: "Connectif",
      DATANEXT: "DataNext",
      EDRONE: "Edrone",
      EXPERTSENDER: "ExpertSender",
      FRESHMAIL: "FreshMail",
      MAILUP: "MailUp",
      MAPP: "Mapp",
      SAILTHRU: "Sailthru",
      SALESMANAGO: "SALESmanago",
      SHOPIFY: "Shopify",
      SPOTLER: "Spotler",
      YOULEAD: "YouLead",
      ADOBECAMPAIGN: "Adobe Campaign",
      GOOGLE_SHEETS: "Google Sheets",
      PLATFORM_EMAIL: "E-mail (cez platformu)",
    },
    capturedLeads: "Získané kontakty",
  },
  delete: {
    tag: "lead-magnet-config",
    title: "Odpojiť e-mailovú službu",
    titleShort: "Odpojiť",
    description: "Odstráň nastavenia zberu kontaktov a zastav ich získavanie",
    response: {
      deleted: "Odpojené",
    },
    success: {
      title: "Odpojené",
      description: "Tvoja e-mailová služba sa odpojila",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Údaje požiadavky sú neplatné",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáš potrebné oprávnenie",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Nenašli sa žiadne nastavenia na odstránenie",
      },
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
  },
};
