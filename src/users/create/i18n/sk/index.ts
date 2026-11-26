import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Používatelia",
  tags: {
    create: "Vytvoriť",
    admin: "Správca",
  },
  post: {
    title: "Vytvoriť používateľa",
    titleShort: "Vytvoriť používateľa",
    description: "Vytvoriť nový používateľský účet",
    form: {
      title: "Nový používateľ",
      description: "Vyplňte údaje nového používateľa",
    },
    email: {
      label: "E-mailová adresa",
      description: "E-mail na prihlasovanie a komunikáciu s používateľom",
    },
    password: {
      label: "Heslo",
      description: "Použite aspoň 8 znakov.",
    },
    privateName: {
      label: "Súkromné meno",
      description: "Celé úradné meno používateľa. Vidia ho iba správcovia.",
    },
    publicName: {
      label: "Verejné meno",
      description: "Meno, ktoré sa zobrazuje všetkým používateľom",
    },
    firstName: {
      label: "Krstné meno",
      description: "Krstné meno používateľa",
    },
    lastName: {
      label: "Priezvisko",
      description: "Priezvisko používateľa",
    },
    company: {
      label: "Firma",
      description: "Firma alebo organizácia používateľa",
    },
    phone: {
      label: "Telefónne číslo",
      description: "Kontaktné telefónne číslo používateľa",
    },
    preferredContactMethod: {
      label: "Uprednostňovaný spôsob kontaktu",
      description: "Ako si používateľ želá, aby ste ho kontaktovali",
    },
    roles: {
      label: "Používateľské roly",
      placeholder: "Priraďte roly",
      description: "Priraďte používateľovi roly",
    },
    imageUrl: {
      label: "URL profilovej fotografie",
      description: "Adresa profilovej fotografie používateľa",
    },
    bio: {
      label: "O používateľovi",
      description: "Stručné predstavenie používateľa",
    },
    website: {
      label: "Webová stránka",
      description: "Osobná alebo firemná webová stránka používateľa",
    },
    jobTitle: {
      label: "Pracovná pozícia",
      description: "Pracovná pozícia alebo funkcia používateľa",
    },
    emailVerified: {
      label: "Overený e-mail",
      description: "Či používateľ overil svoju e-mailovú adresu",
    },
    isActive: {
      label: "Aktívny účet",
      description: "Či je používateľský účet aktívny",
    },
    leadId: {
      label: "ID kontaktu",
      description: "Identifikátor priradeného kontaktu",
    },
    country: {
      label: "Krajina",
      placeholder: "Vyberte krajinu",
      description: "Krajina pobytu používateľa",
    },
    language: {
      label: "Jazyk",
      placeholder: "Vyberte jazyk",
      description: "Uprednostňovaný jazyk používateľa",
    },
    response: {
      title: "Používateľ sa vytvoril",
      description: "Údaje nového používateľa",
      id: {
        content: "ID používateľa",
      },
      leadId: {
        content: "ID priradeného kontaktu",
      },
      country: {
        label: "Krajina",
        description: "Krajina pobytu používateľa",
      },
      language: {
        label: "Jazyk",
        description: "Uprednostňovaný jazyk používateľa",
      },
      email: {
        content: "E-mailová adresa",
      },
      privateName: {
        content: "Súkromné meno",
      },
      publicName: {
        content: "Verejné meno",
      },
      firstName: {
        content: "Krstné meno",
      },
      lastName: {
        content: "Priezvisko",
      },
      company: {
        content: "Firma",
      },
      phone: {
        content: "Telefónne číslo",
      },
      preferredContactMethod: {
        content: "Uprednostňovaný spôsob kontaktu",
      },
      imageUrl: {
        content: "Profilová fotografia",
      },
      bio: {
        content: "O používateľovi",
      },
      website: {
        content: "Webová stránka",
      },
      jobTitle: {
        content: "Pracovná pozícia",
      },
      emailVerified: {
        content: "Overený e-mail",
      },
      isActive: {
        content: "Aktívny účet",
      },
      stripeCustomerId: {
        content: "ID zákazníka v Stripe",
      },
      userRoles: {
        content: "Používateľské roly",
        id: {
          content: "ID roly",
        },
        role: {
          content: "Rola",
        },
      },
      createdAt: {
        content: "Dátum vytvorenia",
      },
      updatedAt: {
        content: "Dátum poslednej úpravy",
      },
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chcete vytvárať používateľov, prihláste sa",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Skontrolujte údaje vo formulári a skúste to znova",
      },
      server: {
        title: "Chyba servera",
        description: "Pre chybu servera sa používateľa nepodarilo vytvoriť",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri vytváraní používateľa sa vyskytla neočakávaná chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Pri vytváraní používateľa zlyhalo sieťové pripojenie",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie vytvárať používateľov",
      },
      notFound: {
        title: "Zdroj sa nenašiel",
        description: "Na vytvorenie používateľa chýba potrebný zdroj",
      },
      conflict: {
        title: "Používateľ už existuje",
        description: "Účet s touto e-mailovou adresou už existuje",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Prídete o neuložené zmeny",
      },
      internal: {
        title: "Interná chyba: {{details}}",
        description: "Pri vytváraní používateľa sa vyskytla interná chyba",
      },
    },
    sms: {
      errors: {
        welcome_failed: {
          title: "Uvítaciu SMS sa nepodarilo odoslať",
          description: "Používateľovi sa nepodarilo odoslať uvítaciu SMS",
        },
        verification_failed: {
          title: "Overovaciu SMS sa nepodarilo odoslať",
          description: "Používateľovi sa nepodarilo odoslať overovaciu SMS",
        },
      },
    },
    success: {
      title: "Používateľ sa vytvoril",
      description: "Nový používateľský účet je pripravený",
      message: {
        content: "Používateľ sa vytvoril",
      },
      created: {
        content: "Vytvorené",
      },
    },
  },
  widget: {
    headerCreated: "Používateľ sa vytvoril",
    headerCreate: "Nový používateľ",
    headerSubtitle:
      "Pridajte účet admina alebo zákazníka. Prihlásiť sa môže hneď.",
    activeBadge: "Aktívny",
    verifiedBadge: "Overený",
    copiedTooltip: "Skopírované",
    copyUserIdTooltip: "Skopírovať ID používateľa",
    copyIdButton: "Skopírovať ID",
    copiedButton: "Skopírované",
    viewUserButton: "Zobraziť používateľa",
    fullProfileButton: "Celý profil",
    creditHistoryButton: "História kreditov",
    createAnotherButton: "Vytvoriť ďalšieho používateľa",
    createdPrefix: "Vytvorené",
    createButton: "Vytvoriť používateľa",
    sections: {
      signIn: "Prihlásenie",
      profile: "Profil",
      access: "Prístup",
    },
  },
  email: {
    users: {
      welcome: {
        greeting: "{{firstName}}, vitajte!",
        preview: "Váš účet je pripravený",
        subject: "{{companyName}}: váš účet je pripravený",
        introduction:
          "Dobrý deň, {{firstName}}, váš účet je pripravený. Po prihlásení môžete využívať všetky funkcie.",
        accountDetails: "Údaje účtu",
        email: "E-mail",
        name: "Meno",
        publicName: "Zobrazované meno",
        company: "Firma",
        phone: "Telefón",
        nextSteps: "Ďalšie kroky",
        loginButton: "Prihlásiť sa do účtu",
        support: "Ak máte otázky, kedykoľvek sa obráťte na našu podporu.",
      },
      admin: {
        newUser: "Nový používateľský účet",
        preview: "Nový účet používateľa {{firstName}} {{lastName}}",
        subject: "Nový používateľský účet: {{firstName}} {{lastName}}",
        notification:
          "V systéme pribudol nový používateľský účet. Nižšie nájdete jeho údaje.",
        userDetails: "Údaje používateľa",
        viewUser: "Zobraziť profil používateľa",
      },
      errors: {
        missing_data: "Pre e-mailovú šablónu chýbajú povinné údaje používateľa",
      },
      error: {
        general: {
          internal_server_error: "Vyskytla sa interná chyba servera",
        },
      },
      labels: {
        id: "ID:",
        email: "E-mail:",
        name: "Meno:",
        privateName: "Celé meno:",
        publicName: "Zobrazované meno:",
        company: "Firma:",
        created: "Dátum vytvorenia:",
        leadId: "ID kontaktu:",
      },
    },
  },
  sms: {
    welcome: {
      message:
        "{{firstName}}, vitajte! Váš účet je pripravený. Prihlásiť sa môžete na {{appUrl}}.",
    },
    verification: {
      message:
        "{{firstName}}, váš overovací kód je {{code}}. Zadajte ho do 10 minút.",
    },
    errors: {
      welcome_failed: {
        title: "Uvítaciu SMS sa nepodarilo odoslať",
        description: "Používateľovi sa nepodarilo odoslať uvítaciu SMS",
      },
      verification_failed: {
        title: "Overovaciu SMS sa nepodarilo odoslať",
        description: "Používateľovi sa nepodarilo odoslať overovaciu SMS",
      },
    },
  },
  countries: {
    ...regionalCountryNames("sk"),
    global: "Celý svet",
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
    userRole: {
      public: "Verejnosť",
      customer: "Zákazník",
      partnerAdmin: "Správca partnera",
      partnerEmployee: "Zamestnanec partnera",
      admin: "Správca",
      cliOff: "CLI vypnuté",
      cliAuthBypass: "Výnimka z overovania v CLI",
      aiToolOff: "Nástroje AI vypnuté",
      webOff: "Web vypnutý",
      mcpOff: "MCP vypnuté",
      mcpVisible: "Viditeľné v MCP",
      productionOff: "V produkcii vypnuté",
      skillOff: "Zručnosť vypnutá",
    },
  },
};
