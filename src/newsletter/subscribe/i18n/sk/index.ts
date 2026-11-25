import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Newsletter",
  enum: {
    preferences: {
      marketing: "Marketing",
      productNews: "Novinky o produkte",
      companyUpdates: "Aktualizácie spoločnosti",
      industryInsights: "Prehľad odvetvia",
      events: "Podujatia",
    },
    creditBonus: {
      active: "Bonus aktívny",
      pendingConfirmation: "Potvrdiť e-mail a získať bonus",
      claimedElsewhere: "Bonus už získal iný účet",
      accountRequired: "Vyžaduje sa bezplatný účet",
    },
  },
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
    creditBonus: "Bonusové bezplatné kredity",
    bonusCredits: "Bonusové kredity mesačne",
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
      detail: "Prihlásenie na odber zlyhalo: {{error}}",
    },
  },
  post: {
    title: "Odber newslettera",
    titleShort: "Prihlásiť sa na odber",
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
        description: "Pre túto e-mailovú adresu už evidujeme odber newslettera",
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
    lead_not_found: "Kontakt sa nenašiel alebo nespĺňa podmienky aktualizácie",
    lead_linking_error: "Chyba pri priraďovaní odberu newslettera ku kontaktu",
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
    sms_failed_continuing: "Oznámenia cez SMS zlyhali. Spracovanie pokračuje.",
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
      benefit_3: "Ponuky pre odberateľov a prednostný prístup k novým funkciám",
      benefit_4: "Novinky z komunity a príbehy jej členov",
      frequency:
        "Novinky ti pošleme raz za pár týždňov. Vyberáme len to, čo stojí za prečítanie. Bez spamu.",
      unsubscribe_text: "Nechceš dostávať tieto e-maily?",
      unsubscribe_link: "Zrušiť odber",
      confirm_title:
        "Potvrď e-mail a na bezplatnom účte získaš +{{bonusCredits}} kreditov každý mesiac",
      confirm_text:
        "Potvrď túto adresu. Na bezplatnom účte potom každý mesiac dostaneš {{bonusCredits}} kreditov navyše, kým newsletter odoberáš.",
      confirm_button: "Potvrdiť e-mail a získať +{{bonusCredits}} kreditov",
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
};
