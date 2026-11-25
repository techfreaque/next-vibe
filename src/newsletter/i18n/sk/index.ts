import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Newsletter",
  status: {
    title: "Stav odberu newslettera",
    description: "Overiť stav odberu newslettera pre e-mailovú adresu",
    category: "Newsletter",
    tags: {
      status: "Stav",
    },
    form: {
      title: "Overiť stav odberu newslettera",
      description: "Zadajte e-mailovú adresu, ktorej stav odberu chcete overiť",
    },
    email: {
      label: "E-mailová adresa",
      description: "E-mailová adresa na overenie stavu odberu",
      placeholder: "user@example.com",
      helpText: "Zadajte e-mailovú adresu, ktorej odber chcete overiť",
    },
    response: {
      subscribed: "Stav odberu",
      status: "Aktuálny stav",
    },
    errors: {
      validation: {
        title: "Neplatný e-mail",
        description: "Zadajte platnú e-mailovú adresu",
      },
      internal: {
        title: "Interná chyba",
        description: "Pri overovaní stavu odberu nastala chyba",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie overiť stav tohto odberu",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Pre túto e-mailovú adresu sa nenašli údaje o odbere",
      },
    },
    success: {
      title: "Stav načítaný",
      description: "Stav odberu newslettera bol načítaný",
    },
  },
  subscribe: {
    category: "Newsletter",
    tags: {
      newsletter: "Newsletter",
      subscription: "Odber",
    },
    email: {
      label: "E-mailová adresa",
      description: "Tvoj e-mail na odber newslettera",
      placeholder: "user@example.com",
      helpText: "Na túto adresu ti budeme posielať newsletter",
    },
    name: {
      label: "Meno",
      description: "Tvoje meno (nepovinné)",
      placeholder: "John Doe",
      helpText: "Podľa mena ťa môžeme v newsletteri osloviť.",
    },
    preferences: {
      label: "Nastavenia newslettera",
      description: "Vyber typy newsletterov, ktoré chceš dostávať",
      placeholder: "Vyber nastavenia",
      helpText: "Tieto nastavenia môžeš kedykoľvek zmeniť",
    },
    leadId: {
      label: "ID kontaktu",
      description: "Nepovinné ID kontaktu",
      placeholder: "123e4567-e89b-12d3-a456-426614174000",
      helpText: "Iba na interné použitie",
    },
    response: {
      success: "Žiadosť o odber newslettera prijatá",
      message: "Potvrdenie úspechu",
      leadId: "Identifikátor kontaktu",
      subscriptionId: "ID odberu",
      userId: "ID používateľa",
      alreadySubscribed:
        "Pre túto e-mailovú adresu už evidujeme odber newslettera",
    },
    errors: {
      email_generation_failed: "E-mail sa nepodarilo vytvoriť",
      badRequest: {
        title: "Neplatná požiadavka",
        description: "Zadané parametre požiadavky sú neplatné",
      },
      internal: {
        title: "Interná chyba",
        description: "Pri spracovaní odberu nastala chyba",
      },
    },
    post: {
      title: "Odber newslettera",
      description: "Prihlásiť sa na odber noviniek a oznámení",
      form: {
        title: "Odber newslettera",
        description: "Nastavenia odberu newslettera",
      },
      response: {
        title: "Výsledok prihlásenia na odber",
        description: "Údaje o žiadosti o odber newslettera",
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
        internal: {
          title: "Interná chyba",
          description: "Pri spracovaní odberu nastala chyba",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Prístup zamietnutý",
        },
        conflict: {
          title: "Odber už evidujeme",
          description:
            "Pre túto e-mailovú adresu už evidujeme odber newslettera",
        },
        badRequest: {
          title: "Neplatná požiadavka",
          description: "Zadané parametre požiadavky sú neplatné",
        },
      },
      success: {
        title: "Žiadosť o odber prijatá",
        description:
          "Žiadosť o odber newslettera sme prijali. Ak e-mailovú adresu ešte nemáš potvrdenú, otvor potvrdzovací odkaz v e-maile.",
      },
    },
    repository: {
      starting: "Spúšťa sa prihlásenie na odber newslettera",
      linking_to_lead: "Priraďuje sa odber newslettera ku kontaktu",
      lead_found: "Kontakt pre odber newslettera sa našiel",
      lead_updated: "Kontakt bol aktualizovaný údajmi o odbere newslettera",
      lead_update_failed:
        "Kontakt sa nepodarilo aktualizovať údajmi o odbere newslettera",
      lead_not_found:
        "Kontakt sa nenašiel alebo nespĺňa podmienky aktualizácie",
      lead_linking_error:
        "Chyba pri priraďovaní odberu newslettera ku kontaktu",
      missing_lead_id: "Pokus o prihlásenie na odber newslettera bez leadId",
      already_subscribed: "Používateľ už odoberá newsletter",
      reactivating: "Obnovuje sa odber newslettera",
      creating_new: "Vytvára sa nový odber newslettera",
      created_successfully: "Odber newslettera bol vytvorený",
      subscription_failed: "Prihlásenie na odber newslettera zlyhalo",
    },
    sms: {
      no_phone_number: "Pre uvítaciu SMS k newsletteru chýba telefónne číslo",
      sending_welcome: "Odosiela sa uvítacia SMS odberateľovi newslettera",
      welcome_error: "Uvítaciu SMS k newsletteru sa nepodarilo odoslať",
      no_admin_phone:
        "Chýba telefónne číslo správcu. Oznámenie cez SMS sa preskočí.",
      sending_admin_notification:
        "Odosiela sa SMS správcovi o novom odbere newslettera",
      admin_notification_error:
        "Oznámenie správcovi sa nepodarilo odoslať cez SMS",
      welcome: {
        message:
          "Ahoj, {{name}}! Ďakujeme za záujem o náš newsletter. Pokyny na potvrdenie odberu nájdeš v e-maile.",
      },
      admin_notification: {
        message: "Nový odber newslettera: {{displayName}} ({{email}})",
      },
    },
    route: {
      sms_failed_continuing:
        "Oznámenia cez SMS zlyhali. Spracovanie pokračuje.",
    },
    emailTemplates: {
      welcome: {
        name: "Uvítací e-mail k newsletteru",
        description: "Uvítací e-mail pre nových odberateľov newslettera",
        category: "newsletter",
        preview: {
          email: {
            label: "E-mailová adresa",
            description: "E-mailová adresa odberateľa",
          },
          name: {
            label: "Meno odberateľa",
            description: "Meno odberateľa (nepovinné)",
          },
          leadId: {
            label: "ID kontaktu",
            description: "ID kontaktu na sledovanie v analytike",
          },
          userId: {
            label: "ID používateľa",
            description: "Identifikátor používateľského účtu (nepovinné)",
          },
        },
      },
    },
    emailTemplate: {
      welcome: {
        title: "Vitaj v newsletteri {{appName}}!",
        subject: "Vitaj v {{appName}}. Novinky o AI bez cenzúry.",
        preview:
          "Novinky o AI bez cenzúry, nové modely a tipy pre odberateľov. Ak adresu ešte nemáš potvrdenú, použi odkaz v e-maile.",
        greeting_with_name: "Ahoj, {{name}}!",
        greeting: "Ahoj!",
        message:
          "Ďakujeme za záujem o newsletter {{appName}}. V našej komunite si ceníme otvorené rozhovory s AI bez cenzúry.",
        what_to_expect: "Čo ti bude chodiť",
        benefit_1: "Nové modely AI a ich aktualizácie",
        benefit_2: "Tipy, ako využiť AI bez cenzúry",
        benefit_3:
          "Ponuky pre odberateľov a prednostný prístup k novým funkciám",
        benefit_4: "Novinky z komunity a príbehy jej členov",
        frequency:
          "Novinky ti pošleme raz za pár týždňov. Vyberáme len to, čo stojí za prečítanie. Bez spamu.",
        unsubscribe_text: "Nechceš dostávať tieto e-maily?",
        unsubscribe_link: "Zrušiť odber",
      },
      admin_notification: {
        title: "Nový odber newslettera",
        subject: "Nový odber newslettera",
        preview: "Nový používateľ sa prihlásil na odber newslettera",
        message: "Nový používateľ sa prihlásil na odber newslettera.",
        subscriber_details: "Údaje o odberateľovi",
        email: "E-mail",
        name: "Meno",
        preferences: "Predvoľby",
        view_in_admin: "Zobraziť v správe newslettera",
      },
    },
  },
  unsubscribe: {
    category: "Newsletter",
    tags: {
      newsletter: "Newsletter",
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
      },
    },
    post: {
      title: "Zrušenie odberu newslettera",
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
    sync: {
      failed: "Synchronizácia zrušených odberov newslettera zlyhala",
      error: "Chyba synchronizácie zrušených odberov newslettera",
      tag: "Synchronizácia newslettera",
      post: {
        title: "Synchronizácia zrušených odberov newslettera",
        titleShort: "Synchronizovať zrušené odbery",
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
  },
  email: {
    welcome: {
      title: "Vitaj v našom newsletteri",
      preview: "Vitaj v našom newsletteri! Ďakujeme za odber.",
      greeting: "Ahoj",
      greeting_with_name: "Ahoj, {{name}}",
      message: "Vitaj v newsletteri {{appName}}! Ďakujeme za odber.",
      what_to_expect: "Čo nájdeš v newsletteri",
      benefit_1: "Najnovšie zmeny a funkcie aplikácie",
      benefit_2: "Prehľad trendov z odvetvia",
      benefit_3: "Obsah a tipy pre odberateľov",
      benefit_4: "Špeciálne ponuky a akcie",
      frequency: "Každý týždeň ti pošleme prehľad noviniek.",
      unsubscribe_text: "Odber môžeš kedykoľvek zrušiť kliknutím",
      unsubscribe_link: "sem",
      subject: "Vitaj v našom newsletteri!",
    },
    admin_notification: {
      title: "Nový odber newslettera",
      preview: "Nový používateľ sa prihlásil na odber newslettera",
      message: "Nový používateľ sa prihlásil na odber newslettera.",
      subscriber_details: "Údaje o odberateľovi",
      email: "E-mail",
      name: "Meno",
      preferences: "Predvoľby",
      view_in_admin: "Zobraziť v správe newslettera",
      subject: "Nový odber newslettera: oznámenie správcovi",
    },
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
  enum: {
    preferences: {
      marketing: "Marketing",
      productNews: "Novinky o produkte",
      companyUpdates: "Aktualizácie spoločnosti",
      industryInsights: "Prehľad odvetvia",
      events: "Podujatia",
    },
    status: {
      subscribed: "Odber aktívny",
      unsubscribed: "Odhlásené z odberu",
      pending: "Čaká sa",
      bounced: "Nedoručené",
      complained: "Nahlásené ako spam",
    },
    creditBonus: {
      active: "Bonus aktívny",
      pendingConfirmation: "Potvrdiť e-mail a získať bonus",
      claimedElsewhere: "Bonus už získal iný účet",
      accountRequired: "Vyžaduje sa bezplatný účet",
    },
  },
  hooks: {
    errors: {
      missing_lead_id: "Odber newslettera: chýba leadId",
    },
  },
  errors: {
    email_generation_failed: "E-mail sa nepodarilo vytvoriť",
  },
  error: {
    general: {
      internal_server_error: "Interná chyba servera",
    },
    default: "Nastala chyba",
  },
  subscription: {
    error: {
      description: "Prihlásenie na odber newslettera zlyhalo",
    },
    unsubscribe: {
      error: "Zrušenie odberu newslettera zlyhalo",
      confirmQuestion: "Chceš zrušiť odber?",
    },
  },
};
