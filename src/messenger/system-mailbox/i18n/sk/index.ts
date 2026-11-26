import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Poštová schránka platformy",
  tag: "Poštová schránka platformy",

  task: {
    description:
      "Zostaviť denný interný prehľad a odoslať ho zo schránky platformy",
  },

  send: {
    title: "Odoslať e-mail z platformy",
    titleShort: "Odoslať e-mail",
    description:
      "Odoslať jeden transakčný e-mail zo schránky platformy a uložiť ho do priečinka Odoslané",
    container: {
      title: "Odoslať e-mail z platformy",
      description:
        "Jeden príjemca, jedna správa. Keď ju prijme poštový server, uloží sa kópia do priečinka Odoslané.",
    },
    fields: {
      to: {
        label: "Príjemca",
        description: "Jedna e-mailová adresa",
        placeholder: "name@example.com",
      },
      subject: {
        label: "Predmet",
        description: "Predmet",
        placeholder: "O čom je správa?",
      },
      body: {
        label: "Správa",
        description: "Text správy",
        placeholder: "Napíš správu...",
      },
      html: {
        label: "Obsah HTML",
        description: "Nepovinná jednoduchá HTML verzia",
        placeholder: "<p>Nepovinný obsah HTML</p>",
      },
    },
    response: {
      messageId: "ID správy",
      from: "Od",
      to: "Komu",
      storedInSent: "Uložené v priečinku Odoslané",
      sentFolder: "Priečinok Odoslané",
      sentLastHour: "Odoslané za poslednú hodinu",
      rateLimitPerHour: "Hodinový limit",
    },
    widget: {
      submit: "Odoslať e-mail",
      submitting: "Odosiela sa…",
      sent: "E-mail odoslaný",
      filed: "Uložené v priečinku Odoslané",
      notFiled:
        "Poštový server správu prijal. Kópiu sa nepodarilo uložiť do priečinka Odoslané.",
      yes: "Áno",
      no: "Nie",
    },
    success: {
      title: "E-mail odoslaný",
      description: "Správu prijal poštový server",
    },
  },

  inbox: {
    title: "Doručená pošta platformy",
    titleShort: "Schránka platformy",
    description:
      "Zobraziť najnovšie správy v priečinku INBOX schránky platformy",
    container: {
      title: "Doručená pošta platformy",
      description:
        "Najnovšie správy sú prvé. Otvorením sa správa neoznačí ako prečítaná.",
    },
    fields: {
      limit: {
        label: "Limit",
        description: "Počet správ na načítanie (1 až 50)",
        placeholder: "20",
      },
      unreadOnly: {
        label: "Iba neprečítané",
        description: "Načítať iba neprečítané správy",
      },
    },
    response: {
      address: "Poštová schránka",
      messages: {
        title: "Správy",
        uid: "UID",
        from: "Od",
        subject: "Predmet",
        date: "Dátum",
        snippet: "Úryvok",
        unread: "Neprečítané",
      },
    },
    widget: {
      submit: "Obnoviť schránku",
      submitting: "Načítava sa...",
      empty: "Žiadne správy",
      emptyDescription: "Týmto filtrom nezodpovedá žiadna správa.",
      unread: "Neprečítané",
      noSubject: "(bez predmetu)",
      open: "Otvoriť",
    },
    success: {
      title: "Doručená pošta načítaná",
      description: "Správy zo schránky platformy boli načítané",
    },
  },

  message: {
    title: "Prečítať správu zo schránky platformy",
    titleShort: "Prečítať e-mail",
    description:
      "Načíta jednu správu podľa UID z priečinka INBOX schránky platformy",
    container: {
      title: "Prečítať správu zo schránky platformy",
      description:
        "Úplný obsah jednej správy. Správa sa neoznačí ako prečítaná.",
    },
    fields: {
      uid: {
        label: "UID",
        description: "UID správy zo zoznamu doručenej pošty",
        placeholder: "42",
      },
    },
    response: {
      uid: "UID",
      from: "Od",
      to: "Komu",
      subject: "Predmet",
      date: "Dátum",
      messageId: "ID správy",
      unread: "Neprečítané",
      bodyText: "Obsah správy",
    },
    widget: {
      submit: "Prečítať správu",
      submitting: "Načítava sa...",
      unread: "Neprečítané",
      noSubject: "(bez predmetu)",
    },
    success: {
      title: "Načítaná správa",
      description: "Správa zo schránky platformy bola načítaná",
    },
  },

  report: {
    title: "Denná správa o stave",
    titleShort: "Denná správa",
    description:
      "Zostaviť prehľad platformy za posledných 24 hodín a odoslať ho zo schránky platformy",
    container: {
      title: "Denná správa o stave",
      description:
        "Registrácie, predplatné, spotreba kreditov, kroky ku konverzii, incidenty pri úlohách a chyby. Vo formáte obyčajného textu.",
    },
    fields: {
      to: {
        label: "Príjemca",
        description:
          "Ak pole necháte prázdne, použije sa nastavená adresa pre prehľady",
        placeholder: "name@example.com",
      },
      dryRun: {
        label: "Iba náhľad",
        description: "Zostaviť prehľad bez odoslania",
      },
    },
    response: {
      subject: "Predmet",
      body: "Správa",
      recipient: "Príjemca",
      sent: "Odoslané",
      sections: "Zahrnuté časti",
      skippedSections: "Vynechané časti",
    },
    widget: {
      submit: "Odoslať prehľad",
      submitting: "Zostavuje sa…",
      sent: "Prehľad odoslaný",
      preview: "Náhľad",
    },
    success: {
      title: "Prehľad je pripravený",
      description: "Denný prehľad bol zostavený",
    },
  },

  errors: {
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Vyžaduje sa prihlásenie",
    },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Schránku platformy môžu používať iba správcovia",
    },
    server: {
      title: "Chyba servera",
      description: "Požiadavku pre schránku platformy sa nepodarilo spracovať",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Vyskytla sa neznáma chyba",
    },
    validation: {
      title: "Neplatné údaje",
      description: "Neplatné parametre požiadavky",
    },
    notConfigured:
      "Schránka platformy nie je nastavená. Nastavte THEA_MAIL_ADDRESS, THEA_MAIL_HOST a THEA_MAIL_PASSWORD.",
    invalidRecipient: "Zadajte jednu platnú e-mailovú adresu príjemcu",
    noRecipient:
      "Chýba príjemca. Zadajte adresu alebo nastavte THEA_MAIL_REPORT_TO.",
    rateLimited:
      "Dosiahol sa hodinový limit odosielania ({{sent}} z {{limit}}). Skúste to neskôr.",
    smtpFailed: "Poštový server odmietol správu: {{error}}",
    imapFailed: "Nepodarilo sa pripojiť k schránke: {{error}}",
    messageNotFound: "V doručenej pošte sa nenašla správa s týmto UID",
    reportFailed: "Prehľad sa nepodarilo zostaviť: {{error}}",
  },
};
