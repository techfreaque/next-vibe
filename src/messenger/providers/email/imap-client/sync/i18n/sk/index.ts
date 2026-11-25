import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Klient IMAP",

  title: "Synchronizácia IMAP",
  titleShort: "Synchronizácia IMAP",
  description: "Služba synchronizácie IMAP",
  container: {
    title: "Nastavenie synchronizácie IMAP",
    description: "Nastaviť parametre synchronizácie IMAP",
  },
  accountIds: {
    label: "ID účtov",
    description: "ID účtov IMAP na synchronizáciu",
    placeholder: "Zadajte ID účtov oddelené čiarkami",
  },
  force: {
    label: "Vynútiť synchronizáciu",
    description: "Synchronizovať aj účty, ktoré sa nedávno synchronizovali",
  },
  dryRun: {
    label: "Skúšobné spustenie",
    description: "Spustiť skúšku bez zmeny údajov",
  },
  maxMessages: {
    label: "Maximálny počet správ",
    description: "Najvyšší počet správ na synchronizáciu v každom priečinku",
    placeholder: "Zadajte maximálny počet správ",
  },
  post: {
    title: "Synchronizácia",
    description: "Koncový bod synchronizácie",
    form: {
      title: "Nastavenia synchronizácie",
      description: "Nastaviť parametre synchronizácie",
    },
    response: {
      title: "Odpoveď",
      description: "Údaje v odpovedi synchronizácie",
      result: {
        title: "Výsledky synchronizácie",
        description: "Podrobné výsledky synchronizácie",
        accountsProcessed: "Spracované účty",
        foldersProcessed: "Spracované priečinky",
        messagesProcessed: "Spracované správy",
        messagesAdded: "Pridané správy",
        messagesUpdated: "Aktualizované správy",
        messagesDeleted: "Odstránené správy",
        duration: "Trvanie",
      },
      errors: {
        error: {
          title: "Chyba synchronizácie",
          description: "Podrobnosti o chybe",
          code: "Kód chyby",
          message: "Chybové hlásenie",
        },
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
      detail_sync: "Synchronizácia zlyhala: {{error}}",
      detail_status: "Stav synchronizácie sa nepodarilo načítať: {{error}}",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Vyskytla sa neznáma chyba",
    },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Prístup zamietnutý",
    },
  },
  success: {
    title: "Úspech",
    description: "Operácia prebehla úspešne",
  },
  widget: {
    title: "Úplná synchronizácia IMAP",
    options: "Možnosti synchronizácie",
    noAccounts: "Žiadne nastavené účty IMAP",
    result: "Výsledok synchronizácie",
    duration: "Trvanie",
    errors: "Chyby",
    accountsProcessed: "Spracované účty",
    foldersProcessed: "Spracované priečinky",
    messagesProcessed: "Spracované správy",
    messagesAdded: "Pridané správy",
    messagesUpdated: "Aktualizované správy",
    messagesDeleted: "Odstránené správy",
    submit: "Spustiť synchronizáciu",
    submitting: "Synchronizuje sa…",
  },
};
