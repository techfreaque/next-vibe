import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Systém",

  errors: {
    readFailed: "Nastavenia systému sa nepodarilo načítať",
    writeFailed: "Nastavenia sa nepodarilo zapísať do súboru .env",
    readOnly: "Nastavenia sú v tomto prostredí dostupné len na čítanie",
    defaultPasswordDetected: "Zistilo sa predvolené heslo správcu",
    passwordNotConfigured: "Heslo správcu nie je nastavené",
  },

  messages: {
    settingsUpdated: "Nastavenia aktualizované",
  },

  get: {
    title: "Nastavenia systému",
    titleShort: "Nastavenia systému",
    description: "Zobrazte a spravujte nastavenia prostredia podľa modulov",
    tags: {
      settings: "Nastavenia",
    },
    response: {
      modules: {
        title: "Konfiguračné moduly",
      },
      isWritable: {
        title: "Umožňuje zápis",
      },
      isDevMode: {
        title: "Vývojový režim",
      },
      needsOnboarding: {
        title: "Vyžaduje sa úvodné nastavenie",
      },
      onboardingIssues: {
        title: "Problémy s úvodným nastavením",
      },
      wizardSteps: {
        title: "Kroky sprievodcu nastavením",
      },
    },
    success: {
      title: "Nastavenia načítané",
      description: "Nastavenia prostredia sa načítali",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Neplatné parametre požiadavky",
      },
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Požaduje sa prístup pre administrátora",
      },
      notFound: {
        title: "Nenájdené",
        description: "Nastavenia sa nenašli.",
      },
      network: {
        title: "Chyba siete",
        description: "Nastala chyba siete",
      },
      server: {
        title: "Chyba servera",
        description: "Nepodarilo sa načítať nastavenia",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt",
      },
    },
  },

  patch: {
    title: "Aktualizovať nastavenia",
    titleShort: "Aktualizovať nastavenia",
    description: "Aktualizujte hodnoty nastavení prostredia v súbore .env",
    tags: {
      settings: "Nastavenia",
    },
    fields: {
      settings: {
        label: "Nastavenia",
        description: "Dvojice kľúčov a hodnôt, ktoré sa majú aktualizovať",
      },
    },
    response: {
      updated: {
        title: "Aktualizované kľúče",
      },
      needsRestart: {
        title: "Vyžaduje sa reštart",
      },
      resultMessage: {
        title: "Nastavenia aktualizované",
      },
    },
    success: {
      title: "Nastavenia uložené",
      description: "Nastavenia prostredia sa aktualizovali",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Hodnoty nastavení sú neplatné",
      },
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Požaduje sa prístup pre administrátora",
      },
      notFound: {
        title: "Nenájdené",
        description: "Nastavenia sa nenašli.",
      },
      network: {
        title: "Chyba siete",
        description: "Nastala chyba siete",
      },
      server: {
        title: "Chyba servera",
        description: "Nepodarilo sa uložiť nastavenia",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt",
      },
    },
  },

  widget: {
    title: "Konfigurácia systému",
    subtitle: "Premenné prostredia podľa modulov",
    readOnlyBanner:
      "Nastavenia sú len na čítanie. Upravte priamo súbor .env alebo použite CLI.",
    onboardingBanner:
      "Vyžaduje sa úvodné nastavenie. Vyplňte zvýraznené polia.",
    defaultPasswordWarning:
      "Zistilo sa predvolené heslo správcu. Okamžite ho zmeňte.",
    cancel: "Zrušiť",
    save: "Uložiť zmeny",
    saving: "Ukladá sa…",
    apply: "Použiť zmeny a reštartovať",
    applying: "Používajú sa zmeny…",
    saved: "Nastavenia sa uložili",
    restartRequired: "Nastavenia sa uložili. Zmeny sa prejavia po reštarte.",
    devRestartHint:
      "Zmeny sa prejavia po reštarte vývojového servera. Stlačte Ctrl+C a potom spustite vibe dev.",
    notSet: "nenastavené",
    configured: "Nastavené",
    partial: "Čiastočne nastavené",
    notConfigured: "Nenastavené",
    required: "Povinné",
    selectPlaceholder: "Vyberte…",
    boolTrue: "zapnuté",
    boolFalse: "vypnuté",
    logPathDisabled: "zapisovanie do súboru vypnuté",
    openSetup: "Otvoriť nastavenie",
    restartWizard: "Sprievodca nastavením",
    exportProd: "Exportovať pre produkciu",
    generate: "Vygenerovať",
    editConfirmHint: "[Enter] potvrdiť  [Esc] zrušiť",
    editSettings: "Upraviť nastavenia",
    exit: "Ukončiť",
    loading: "Načítavajú sa nastavenia…",
    moduleLabels: {
      env: "Jadro",
      agent: "Poskytovatelia AI",
      leadsCampaigns: "Kampane pre potenciálnych zákazníkov",
      messenger: "Messenger / SMTP",
      imap: "IMAP",
      payment: "Platby",
      sms: "SMS",
      serverSystem: "Server a platforma",
    },
  },

  wizard: {
    title: "Sprievodca nastavením Vibe",
    subtitle: "Po troch krátkych krokoch môžete začať četovať.",
    alreadyConfigured: "Už nastavené",
    stepOf: "Krok {{step}} z {{total}}",
    next: "Ďalej",
    continue: "Pokračovať",
    back: "Späť",
    skip: "Preskočiť tento krok",
    finish: "Dokončiť nastavenie",
    restart: "Znovu spustiť sprievodcu",
    done: "Nastavenie dokončené",
    doneSubtitle:
      "Vaša inštancia je pripravená. Nastavenia môžete neskôr upraviť cez možnosť Zobraziť všetky nastavenia.",
    goToSettings: "Prejsť na všetky nastavenia",
    startChatting: "Začať četovať",
    viewAllSettings: "Zobraziť všetky nastavenia",
    encryptionNote:
      "Tento údaj sa ukladá zašifrovaný a nedá sa spätne zobraziť v čitateľnej podobe.",
    autoGeneratedNote:
      "Hodnota bola vygenerovaná automaticky. Ponechajte ju alebo vložte vlastnú.",
    steps: {
      admin: "Účet správcu",
      database: "Databáza",
      security: "Bezpečnostné kľúče",
      ai: "Poskytovateľ AI",
    },
    ai: {
      claudeCodeTitle: "Claude Code (dostupný na tomto zariadení)",
      claudeCodeDescription:
        "Používa vašu miestnu reláciu Claude CLI. Kľúč API nepotrebujete.",
      claudeDetected:
        "Na tomto zariadení je Claude CLI. Skontrolujte, či ste sa prihlásili príkazom `claude login`.",
      claudeNotDetected:
        "Claude CLI sa nenašlo. Nainštalujte ho z claude.ai/code a spustite `claude login` alebo použite inú možnosť na tejto stránke.",
      claudeInstallHint:
        "Voliteľné. Rovnako dobre poslúži váš účet unbottled.ai alebo kľúč OpenRouter.",
      openRouterTitle: "Kľúč API pre OpenRouter",
      openRouterDescription:
        "Stovky modelov s jedným kľúčom. Funguje samostatne aj spolu s Claude Code.",
      openRouterHint:
        "Kľúč získate na openrouter.ai/keys. Bezplatné modely nevyžadujú platobnú kartu.",
      recommended: "Odporúčané",
      unbottledTitle: "Váš účet unbottled.ai",
      unbottledDescription:
        "Prihláste sa raz a táto inštancia získa prístup ku všetkým modelom unbottled.ai. Konverzácie zostanú vo vašej databáze a za používanie modelov sa odpočítajú vaše kredity. Vyžaduje sa platené predplatné alebo balík kreditov.",
      unbottledNoAccount:
        "Ešte nemáte účet? Vytvorte si ho na unbottled.ai a potom sa prihláste tu.",
      unbottledConnected: "Pripojené na {{url}}",
      unbottledDisconnected: "Nepripojené",
      unbottledSignIn: "Prihlásiť sa",
      unbottledSigningIn: "Prihlasuje sa…",
      unbottledDisconnect: "Odpojiť",
      unbottledEmail: "E-mail",
      unbottledPassword: "Heslo",
      unbottledRemoteUrl: "URL cloudovej inštancie",
      unbottledLoginFailed:
        "Prihlásenie zlyhalo. Skontrolujte e-mailovú adresu a heslo.",
      unbottledConnectionError:
        "Nepodarilo sa pripojiť k serveru. Skontrolujte URL.",
      orDivider: "Alebo pripojte vlastného poskytovateľa",
    },
  },

  post: {
    title: "Prihlásiť sa do unbottled.ai",
    titleShort: "Prihlásenie do unbottled.ai",
    description:
      "Prihlásenie cez proxy na serveri. Prihlasovacie údaje zostávajú na vašom serveri.",
    tags: { settings: "Prihlásenie do unbottled.ai" },
    fields: {
      email: {
        label: "E-mail",
        description: "E-mailová adresa účtu unbottled.ai",
        placeholder: "you@example.com",
      },
      password: {
        label: "Heslo",
        description: "Heslo účtu unbottled.ai",
        placeholder: "Heslo",
      },
      remoteUrl: {
        label: "URL vzdialenej inštancie",
        description: "URL inštancie unbottled.ai",
        placeholder: "https://unbottled.ai",
      },
      credential: {
        label: "Prihlasovací údaj",
        description: "Zakódovaný prihlasovací údaj",
      },
      syncScope: {
        label: "Rozsah synchronizácie",
        description: "Údaje, ktoré sa synchronizujú cez toto pripojenie.",
      },
    },
    success: {
      title: "Prihlásenie prebehlo",
      description: "Prihlasovací údaj sa načítal",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Skontrolujte e-mail, heslo a URL",
      },
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Požaduje sa prístup pre administrátora",
      },
      notFound: { title: "Nenájdené", description: "Nenájdené" },
      network: {
        title: "Spojenie zlyhalo",
        description: "Nepodarilo sa pripojiť k vzdialenej inštancii",
      },
      server: {
        title: "Prihlásenie zlyhalo",
        description: "Nesprávny e-mail alebo heslo",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: { title: "Konflikt", description: "Nastal konflikt" },
    },
  },

  export: {
    title: "Exportovať pre produkciu",
    subtitle:
      "Vytvorte súbor .env pripravený na nasadenie na serveri. Citlivé hodnoty sú v čitateľnej podobe. Súbor bezpečne uschovajte.",
    copyButton: "Kopírovať do schránky",
    copied: "Skopírované!",
    downloadButton: "Stiahnuť .env.prod",
    instructions:
      "Skopírujte tento súbor na server:\n  scp .env.prod user@yourserver:/app/.env\nAlebo ho vložte ručne:\n  ssh user@yourserver && nano /app/.env",
    checklist: "Kontrolný zoznam nasadenia",
    close: "Zavrieť",
  },
};
