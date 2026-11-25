/**
 * Contact API translations (Slovak)
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Napísať človeku",
  titleShort: "Kontaktujte nás",
  description:
    "Niečo nefunguje alebo sa chceš porozprávať s človekom? Napíš nám, čo potrebuješ. Správu si prečíta niekto z tímu a odpovie.",
  category: "Systém",
  summary: "Spracuje kontaktný formulár a zaznamená údaje kontaktu",
  tags: {
    contactForm: "Kontaktný formulár",
    contactUs: "Kontaktujte nás",
    contactSubmission: "Odoslať správu",
    helpSupport: "Pomoc a podpora",
  },

  form: {
    label: "Kontaktujte nás",
    description: "Správu si prečíta človek z nášho tímu a odpovie priamo.",
    fields: {
      name: {
        label: "Tvoje meno",
        description:
          "Celé meno odosielateľa kontaktného formulára. Aspoň 2 znaky.",
        placeholder: "John Doe",
      },
      email: {
        label: "E-mailová adresa",
        description:
          "Adresa, na ktorú ti máme odpovedať. Ak si prihlásený, pole môžeš nechať prázdne a použijeme e-mail z účtu.",
        placeholder: "john.doe@example.com",
      },
      company: {
        label: "Spoločnosť",
        description: "Tvoj názov firmy alebo organizácie (voliteľné).",
        placeholder: "Acme Corp",
      },
      subject: {
        label: "Predmet",
        description:
          "Kategória otázky nám pomôže doručiť správu správnemu tímu.",
        placeholder: "Všeobecná otázka o službách",
      },
      message: {
        label: "Správa",
        description:
          "Celý text otázky. Aspoň 10 znakov. Uveď konkrétne, čo potrebuješ.",
        placeholder: "Čo potrebuješ? Stačí pár viet.",
      },
      priority: {
        label: "Priorita",
        description:
          "Naliehavosť otázky. Na vysokú a naliehavú prioritu odpovedáme rýchlejšie.",
        placeholder: "Vyber prioritu",
      },
      leadId: {
        label: "ID kontaktu",
        description:
          "Interné ID na sledovanie kontaktu (vyplní sa automaticky)",
        placeholder: "lead_123",
      },
    },
    submitButton: {
      label: "Odoslať správu",
      loadingText: "Odosiela sa…",
    },
  },

  subject: {
    helpSupport: "Pomoc a podpora",
    generalInquiry: "Všeobecná otázka",
    technicalSupport: "Technická podpora",
    accountQuestion: "Otázka k účtu",
    billingQuestion: "Otázka k fakturácii",
    salesInquiry: "Obchodná otázka",
    featureRequest: "Návrh funkcie",
    bugReport: "Nahlásenie chyby",
    feedback: "Spätná väzba",
    complaint: "Sťažnosť",
    partnership: "Partnerstvo",
    other: "Iné",
  },

  priority: {
    low: "Nízka",
    medium: "Stredná",
    high: "Vysoká",
    urgent: "Naliehavá",
  },

  status: {
    new: "Nové",
    inProgress: "Spracúva sa",
    resolved: "Vyriešené",
    closed: "Uzatvorené",
  },

  response: {
    label: "Výsledok odoslania formulára",
    description: "Informácie o stave vašej správy",
    success:
      "Ďakujeme, že ste nám napísali. Správu sme dostali a čoskoro sa vám ozveme.",
    messageId: "ID správy na sledovanie",
    status: "Aktuálny stav správy",
  },

  examples: {
    requests: {
      general: {
        title: "Všeobecná otázka",
        description:
          "Príklad všeobecnej otázky odoslanej cez kontaktný formulár",
      },
    },
    responses: {
      success: {
        title: "Úspešné odoslanie",
        description: "Príklad úspešného odoslania kontaktného formulára",
      },
    },
  },

  errors: {
    createFailed: {
      title: "Kontaktný formulár sa nepodarilo odoslať",
      description: "Formulár momentálne nevieme spracovať. Skúste neskôr.",
    },
    repositoryCreateFailed:
      "Kontaktnú požiadavku sa nepodarilo vytvoriť: {{error}}",
    repositoryCreateFailedForEmail:
      "Kontaktnú požiadavku pre {{email}} sa nepodarilo vytvoriť",
    repositoryCreateFailedWithDetails:
      "Kontaktnú požiadavku sa nepodarilo vytvoriť: {{error}}. {{details}}",
    repositoryCreateDetails:
      "Formulár momentálne nevieme spracovať. Skúste neskôr.",
    noContactReturned: "Vytvorenie nevrátilo záznam kontaktu",
    validation: {
      messageEmpty: "Pred odoslaním napíšte správu.",
      title: "Chyba overenia údajov",
      description: "Skontrolujte údaje a skúste znova",
      nameMinLength: "Meno musí mať aspoň 2 znaky",
      emailInvalid: "Zadajte platnú e-mailovú adresu",
      emailRequired: "Zadajte e-mailovú adresu, aby sme vám mohli odpovedať",
      subjectRequired: "Predmet je povinný",
      messageMinLength: "Správa musí mať aspoň 10 znakov",
      priorityInvalid: "Vyberte platnú prioritu",
      statusInvalid: "Neplatná hodnota stavu",
    },
    network: {
      title: "Chyba siete",
      description: "Pri spracovaní požiadavky nastala chyba siete",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Na túto akciu nemáte oprávnenie",
    },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Táto akcia nie je povolená",
    },
    notFound: {
      title: "Nenašlo sa",
      description: "Požadovaný zdroj sa nenašiel",
    },
    serverError: {
      title: "Chyba servera",
      description: "Vyskytla sa interná chyba servera",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Vyskytla sa neznáma chyba",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Máte neuložené zmeny",
    },
    conflict: {
      title: "Konflikt",
      description: "Pri spracovaní požiadavky nastal konflikt",
    },
    email_generation_failed: "E-mail sa nepodarilo vytvoriť",
  },

  sms: {
    admin: {
      notification: "Nová kontaktná správa: {name} ({email}), {subject}",
      phone: {
        missing: "Nie je nastavené telefónne číslo správcu pre oznámenia",
      },
      send: {
        start: "Odosiela sa SMS oznámenie správcovi o kontaktnom formulári",
        error: "SMS oznámenie správcovi sa nepodarilo odoslať",
      },
    },
    confirmation: {
      message: "{name}, ďakujeme za správu. Čoskoro sa vám ozveme.",
      phone: {
        missing: "Chýba telefónne číslo používateľa pre potvrdzovaciu SMS",
      },
      send: {
        start: "Odosiela sa potvrdzovacia SMS odosielateľovi formulára",
        error: "Potvrdzovaciu SMS sa nepodarilo odoslať",
      },
    },
  },

  repository: {
    create: {
      start: "Začína sa spracovanie kontaktného formulára",
      success: "Kontaktný formulár bol úspešne odoslaný",
      error: "Nepodarilo sa vytvoriť záznam odoslaného formulára",
    },
    lead: {
      conversion: {
        start: "Začína sa konverzia kontaktu po odoslaní formulára",
        error: "Pri konverzii kontaktu po odoslaní formulára nastala chyba",
      },
      provided: "Pri odoslaní formulára bolo zadané ID kontaktu",
    },
    seed: {
      create: {
        start: "Začína sa vytváranie vzorových údajov kontaktu",
        error: "Vzorové údaje kontaktu sa nepodarilo vytvoriť",
      },
    },
  },

  route: {
    sms: {
      admin: {
        failed: "SMS oznámenie o odoslanom formulári sa správcovi neodoslalo",
      },
      confirmation: {
        failed: "Potvrdzovacia SMS o odoslanom formulári sa neodoslala",
      },
    },
  },

  seeds: {
    dev: {
      start:
        "Začína sa príprava vzorových kontaktných údajov pre vývojové prostredie",
      submission: {
        created:
          "Vzorový kontaktný formulár vo vývojovom prostredí bol vytvorený",
        failed:
          "Vzorový kontaktný formulár vo vývojovom prostredí sa nepodarilo vytvoriť",
        error:
          "Chyba pri vytváraní vzorového kontaktného formulára vo vývojovom prostredí",
      },
      complete: "Vzorové kontaktné údaje vo vývojovom prostredí sú pripravené",
      error:
        "Chyba pri príprave vzorových kontaktných údajov pre vývojové prostredie",
    },
    test: {
      start:
        "Začína sa príprava vzorových kontaktných údajov pre testovacie prostredie",
      submission: {
        created:
          "Vzorový kontaktný formulár v testovacom prostredí bol vytvorený",
        failed:
          "Vzorový kontaktný formulár v testovacom prostredí sa nepodarilo vytvoriť",
      },
      error:
        "Chyba pri príprave vzorových kontaktných údajov pre testovacie prostredie",
    },
    prod: {
      start:
        "Začína sa príprava vzorových kontaktných údajov pre produkčné prostredie",
      ready: "Produkčné prostredie pre kontakty je pripravené",
      error:
        "Chyba pri príprave vzorových kontaktných údajov pre produkčné prostredie",
    },
  },

  noEmail: {
    warning: {
      title: "Chýba adresa na odpoveď",
      description:
        "Bez e-mailu si správu môžeme prečítať, ale nemáme kam odpovedať. Ak vám to vyhovuje, odošlite ju aj tak.",
      addEmail: "Pridať e-mail",
      sendAnyway: "Odoslať aj tak",
    },
  },

  success: {
    title: "Správa odoslaná",
    description: "Vašu správu sme dostali. Odpovie vám človek z nášho tímu.",
  },

  aiPrompt: {
    confirmBeforeSend:
      "Pred odoslaním kontaktného formulára v mene používateľa si vždy vyžiadaj jeho potvrdenie.",
    humanHelp:
      "Ak je používateľ frustrovaný, rozrušený alebo nevie pokračovať, ponúkni mu spojenie s človekom z podpory cez kontaktný formulár.",
    emailFallback:
      "Ak je používateľ prihlásený, jeho e-mail už máme. Nemusí ho zadávať znova.",
  },

  email: {
    // Legacy keys for existing email template compatibility
    partner: {
      greeting: "Dobrý deň",
      thankYou: "Ďakujeme, že ste nám napísali",
      message: "Správa",
      additionalInfo: "Vašu otázku sme dostali a čoskoro odpovieme.",
      subject: "Odoslaný kontaktný formulár",
    },
    company: {
      contactDetails: "Kontaktné údaje",
      name: "Meno",
      email: "E-mail",
      company: "Spoločnosť",
      contactSubject: "Predmet",
      viewDetails: "Zobraziť v správe",
    },
    // User confirmation email
    user_confirmation: {
      title: "Vašu správu sme dostali",
      subject: "Ďakujeme, že ste kontaktovali {{appName}}",
      previewText: "Vašu správu sme dostali a čoskoro sa vám ozveme.",
      greeting: "Dobrý deň, {{name}},",
      thankYou: "ďakujeme, že ste napísali tímu {{appName}}.",
      confirmation:
        "Vaša správa je u nás. Každú správu číta človek a odpovieme hneď, ako budeme môcť.",
      yourMessage: "Vaša správa",
      subject_label: "Predmet",
      message_label: "Správa",
      whatHappensNext: "Čo bude nasledovať?",
      step1: "Vašu správu si prečíta niekto z tímu",
      step2: "Odpovieme hneď, ako budeme môcť",
      step3: "Spoločne sa pozrieme na to, čo potrebujete",
      needUrgentHelp: "Potrebujete pomoc hneď?",
      urgentHelpInfo: "V centre pomoci už nájdete odpovede na mnohé otázky.",
      helpCenterButton: "Otvoriť centrum pomoci",
      signoff:
        "Ďakujeme, že ste si vybrali {{appName}}.\nTím podpory {{appName}}",
      footer: "Automatické potvrdenie od {{appName}}",
    },
    // Admin notification email
    admin_notification: {
      title: "Nový kontaktný formulár",
      subject: "Nová kontaktná správa od {{name}}: {{subject}}",
      previewText: "Nová otázka od {{name}} ({{email}})",
      message: "Prišla nová správa z kontaktného formulára.",
      contactDetails: "Kontaktné údaje",
      name: "Meno",
      email: "E-mail",
      company: "Spoločnosť",
      subject_label: "Predmet",
      priority: "Priorita",
      message_label: "Správa",
      submittedAt: "Čas odoslania",
      leadInfo: "Údaje kontaktu",
      leadId: "ID kontaktu",
      status: "Stav",
      actionRequired: "Treba odpovedať",
      actionInfo: "Prečítajte si otázku a odpovedzte čo najskôr.",
      viewInAdmin: "Zobraziť v správcovskom rozhraní",
      replyToContact: "Odpovedať kontaktu",
      footer: "Automatické oznámenie od {{appName}}",
    },
  },

  error: {
    general: {
      internal_server_error: "Vyskytla sa interná chyba servera",
    },
  },

  emailTemplates: {
    contactForm: {
      meta: {
        name: "Oznámenie z kontaktného formulára",
        description:
          "E-mail pre kontakt alebo tím spoločnosti po odoslaní kontaktného formulára",
        category: "kontakt",
      },
      preview: {
        name: {
          label: "Meno odosielateľa",
          description: "Celé meno odosielateľa kontaktného formulára",
        },
        email: {
          label: "E-mail odosielateľa",
          description: "E-mailová adresa odosielateľa formulára",
        },
        company: {
          label: "Názov spoločnosti",
          description: "Voliteľný názov spoločnosti odosielateľa",
        },
        subject: {
          label: "Predmet správy",
          description: "Predmet kontaktnej správy",
        },
        priority: {
          label: "Priorita",
          description: "Naliehavosť otázky",
        },
        message: {
          label: "Text správy",
          description: "Hlavný text správy z kontaktného formulára",
        },
        isForCompany: {
          label: "Príznak firemného e-mailu",
          description:
            "Určuje, či ide o oznámenie spoločnosti (správcovi) alebo potvrdenie odosielateľovi",
        },
        userId: {
          label: "ID používateľa",
          description: "Voliteľné ID používateľa na sledovanie",
        },
        leadId: {
          label: "ID kontaktu",
          description: "Voliteľné ID kontaktu na sledovanie v CRM",
        },
      },
    },
    adminContact: {
      meta: {
        name: "Oznámenie správcovi o kontaktnej správe",
        description:
          "Interné e-mailové oznámenie pre správcov po odoslaní nového kontaktného formulára",
        category: "správca",
      },
      preview: {
        name: {
          label: "Meno odosielateľa",
        },
        email: {
          label: "E-mail odosielateľa",
        },
        subject: {
          label: "Predmet správy",
        },
        priority: {
          label: "Priorita",
        },
        message: {
          label: "Text správy",
        },
        company: {
          label: "Názov spoločnosti",
        },
        userId: {
          label: "ID používateľa",
        },
        leadId: {
          label: "ID kontaktu",
        },
      },
    },
  },
};
