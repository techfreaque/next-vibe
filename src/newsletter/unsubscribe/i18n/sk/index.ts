import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Newsletter",
  tags: {
    newsletter: "Newsletter",
  },
  emailPlaceholder: "Zadaj e-mail",
  subscription: {
    unsubscribe: {
      title: "Zrušiť odber",
      confirmButton: "Potvrdiť zrušenie odberu",
      success: "Odber je zrušený",
      error: "Odber sa nepodarilo zrušiť",
    },
  },
  unsubscribe: {
    page: {
      title: "Zrušiť odber",
      description: "Zadaj adresu, stlač tlačidlo a hotovo.",
      subtitle: "Spravovať odber newslettera",
      emailProvided: {
        title: "Potvrdiť zrušenie odberu",
        description:
          "Stačí jedno kliknutie a na túto adresu už newsletter nepríde.",
      },
      unsubscribeButton: "Zrušiť odber",
      unsubscribing: "Ruší sa odber…",
      status: {
        subscribed: "Na túto adresu posielame newsletter.",
        notSubscribed: "Pre túto adresu odber neevidujeme.",
      },
      subscribeText: "Zmenil si názor?",
      subscribeLink: "Znova sa prihlásiť na odber",
      info: {
        title: "Čo sa stane potom",
        description: "Čo sa stane po zrušení odberu",
        immediate: {
          title: "Okamžite.",
          description: "Newsletter ti okamžite prestane chodiť.",
        },
        resubscribe: {
          title: "Kedykoľvek sa môžeš vrátiť.",
          description: "Ak zmeníš názor, môžeš sa prihlásiť na odber znova.",
        },
      },
      alternatives: {
        title: "Než odídeš",
        description: "Čo môžeš skúsiť",
        subscribe: "Upraviť frekvenciu e-mailov",
        contact: "Povedz nám, čo máme napraviť",
      },
    },
  },
  email: {
    label: "E-mailová adresa",
    description: "E-mailová adresa, pre ktorú sa má zrušiť odber newslettera",
    placeholder: "user@example.com",
    unsubscribe: {
      title: "Zrušiť odber newslettera",
      preview: "Odber nášho newslettera je zrušený",
      greeting: "Ahoj",
      confirmation: "Zrušili sme odber newslettera pre {{email}}",
      resubscribe_info:
        "Ak zmeníš názor, na našom webe sa môžeš znova prihlásiť na odber",
      resubscribe_button: "Obnoviť odber",
      support_message: "Ak máš otázky, napíš nášmu tímu podpory",
      subject: "Potvrdenie zrušenia odberu newslettera",
      admin_unsubscribe_notification: {
        title: "Oznámenie o zrušení odberu newslettera",
        preview: "Používateľ zrušil odber newslettera",
        message: "Používateľ zrušil odber newslettera",
        email: "E-mail",
        date: "Dátum",
        view_dashboard: "Zobraziť prehľad",
        subject: "Zrušenie odberu newslettera: oznámenie správcovi",
      },
    },
  },
  response: {
    success: "Odber newslettera je zrušený",
    message: "Potvrdenie úspechu",
  },
  errors: {
    email_generation_failed: "E-mail sa nepodarilo vytvoriť",
    internal: {
      title: "Interná chyba",
      description: "Žiadosť o zrušenie odberu sa nepodarilo spracovať",
      detail: "Odber sa nepodarilo zrušiť: {{error}}",
    },
  },
  post: {
    title: "Zrušenie odberu newslettera",
    titleShort: "Zrušiť odber",
    description: "Zrušiť odber newslettera",
    form: {
      title: "Zrušiť odber newslettera",
      description: "Zadaj e-mailovú adresu, pre ktorú chceš zrušiť odber",
    },
    response: {
      title: "Výsledok zrušenia odberu",
      description: "Potvrdenie zrušenia odberu newslettera",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      validation: {
        title: "Chyba overenia",
        description: "Zadaná e-mailová adresa je neplatná",
      },
      internal: {
        title: "Interná chyba",
        description: "Žiadosť o zrušenie odberu sa nepodarilo spracovať",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zamietnutý",
      },
    },
    success: {
      title: "Odber zrušený",
      description: "Odber nášho newslettera je zrušený",
    },
  },
  oneClick: {
    tag: "Zrušenie odberu jedným kliknutím",
    post: {
      title: "Zrušenie odberu jedným kliknutím",
      titleShort: "Zrušiť odber",
      description:
        "Zrušenie odberu cez podpísaný odkaz v hlavičke e-mailu podľa RFC 8058",
      container: {
        title: "Zrušenie odberu jedným kliknutím",
        description:
          "Volajú ho poskytovatelia e-mailových schránok. Podpísaný token oprávňuje zrušiť odber.",
      },
      token: {
        label: "Token",
        description: "Podpísaný token na zrušenie odberu z e-mailu",
      },
      errors: {
        invalidToken: {
          title: "Neplatný odkaz",
          description: "Odkaz na zrušenie odberu je neplatný.",
        },
        server: {
          title: "Chyba servera",
          description: "Odber sa nepodarilo zrušiť. Skús znova.",
        },
        validation: {
          title: "Chyba overenia",
          description: "Neplatný formát tokenu",
        },
      },
      success: {
        title: "Odhlásené z odberu",
        description: "Odber je zrušený.",
      },
    },
  },
  sync: {
    failed: "Synchronizácia zrušených odberov newslettera zlyhala",
    error: "Chyba synchronizácie zrušených odberov newslettera",
    tag: "Synchronizácia newslettera",
    post: {
      title: "Synchronizácia zrušených odberov newslettera",
      description:
        "Synchronizovať stav kontaktov po zrušení odberu newslettera",
      container: {
        title: "Nastavenia synchronizácie zrušených odberov",
        description: "Nastaviť parametre synchronizácie zrušených odberov",
      },
      fields: {
        batchSize: {
          label: "Veľkosť dávky",
          description: "Počet záznamov na každú dávku",
        },
        dryRun: {
          label: "Skúšobný beh",
          description: "Spustiť bez vykonania zmien",
        },
      },
      response: {
        leadsProcessed: "Spracované kontakty",
        leadsUpdated: "Aktualizované kontakty",
        executionTimeMs: "Čas vykonania (ms)",
      },
      errors: {
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Vyžaduje sa prihlásenie",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Prístup zamietnutý",
        },
        server: {
          title: "Chyba servera",
          description: "Pri synchronizácii zrušených odberov nastala chyba",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neznáma chyba",
        },
        validation: {
          title: "Chyba overenia",
          description: "Neplatné parametre požiadavky",
        },
      },
      success: {
        title: "Synchronizácia dokončená",
        description: "Zrušené odbery newslettera boli synchronizované",
      },
    },
  },
  emailTemplates: {
    unsubscribe: {
      name: "E-mail o zrušení odberu newslettera",
      description:
        "Potvrdzovací e-mail používateľovi, ktorý zruší odber newslettera",
      category: "newsletter",
      preview: {
        email: {
          label: "E-mailová adresa",
          description: "E-mailová adresa, pre ktorú sa ruší odber",
        },
      },
    },
  },
  sms: {
    confirmation: {
      message:
        "Odber newslettera {{appName}} je zrušený. Ak to bol omyl, na našom webe si odber znova zapneš.",
    },
    admin_notification: {
      message: "Adresa {{email}} sa odhlásila z odberu newslettera.",
    },
    errors: {
      confirmation_failed: {
        title: "Potvrdenie sa nepodarilo odoslať cez SMS",
        description: "Nepodarilo sa odoslať SMS s potvrdením zrušenia odberu",
      },
      admin_notification_failed: {
        title: "Oznámenie správcovi cez SMS zlyhalo",
        description: "Oznámenie správcovi sa nepodarilo odoslať cez SMS",
      },
    },
  },
};
