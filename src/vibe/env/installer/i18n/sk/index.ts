import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Inštalácia {{appName}}",
    description:
      "Priebeh lokálnej inštalácie a voliteľné nastavenie súkromného GitHub repozitára.",
  },
  enums: {
    stepStatus: {
      done: "Pripravené",
      inProgress: "Prebieha",
      pending: "Čaká",
      skipped: "Preskočené",
      error: "Vyžaduje pozornosť",
    },
    action: {
      refresh: "Znova skontrolovať",
      githubAuthStart: "Prihlásiť sa cez GitHub",
      githubAuthCheck: "Skontrolovať prihlásenie GitHub",
      githubCreatePrivateRepo: "Vytvoriť súkromný repozitár",
      githubSkip: "Preskočiť GitHub",
      githubReset: "Nastaviť GitHub",
    },
    checkoutMode: {
      cloned: "Čerstvý klon",
      existing: "Existujúci priečinok zachovaný",
      unknown: "Lokálna kópia",
    },
  },
  get: {
    title: "Stav inštalátora",
    titleShort: "Inštalátor",
    description:
      "Prehľad priebehu lokálnej inštalácie, priečinka projektu a voliteľného prepojenia s GitHubom.",
    tags: {
      installer: "Inštalátor",
    },
    success: {
      title: "Stav načítaný",
      description: "Lokálny stav inštalácie bol načítaný.",
    },
    response: {
      installDir: { title: "Priečinok inštalácie" },
      os: { title: "Operačný systém" },
      arch: { title: "Architektúra" },
      checkoutMode: { title: "Režim kópie" },
      branch: { title: "Git vetva" },
      originUrl: { title: "Remote origin" },
      upstreamUrl: { title: "Remote upstream" },
      port: { title: "Lokálny port" },
      stateFilePath: { title: "Súbor stavu" },
      updatedAt: { title: "Naposledy aktualizované" },
      lastError: { title: "Posledná chyba" },
      steps: { title: "Kroky inštalácie" },
      github: { title: "Stav GitHub" },
      setup: { title: "Stav nastavenia" },
    },
    errors: {
      validation: {
        title: "Chyba validácie",
        description: "Neplatná požiadavka na stav inštalátora.",
      },
      unauthorized: {
        title: "Neautorizované",
        description: "Vyžaduje sa prihlásenie.",
      },
      forbidden: {
        title: "Len lokálne",
        description:
          "Inštalátor je dostupný len na lokálnej inštancii pri prvom spustení.",
      },
      notFound: {
        title: "Nenájdené",
        description: "Stav inštalátora nebol nájdený.",
      },
      network: {
        title: "Chyba siete",
        description: "Sieťová požiadavka zlyhala.",
      },
      server: {
        title: "Chyba servera",
        description: "Nepodarilo sa načítať lokálny stav inštalácie.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba.",
      },
      unsavedChanges: {
        title: "Konflikt",
        description: "Stav sa počas čítania zmenil.",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt stavu inštalátora.",
      },
    },
  },
  post: {
    title: "Spustiť akciu inštalátora",
    titleShort: "Akcia inštalátora",
    description:
      "Obnoviť lokálne kontroly alebo spravovať súkromný GitHub repozitár.",
    tags: {
      installer: "Inštalátor",
    },
    request: {
      action: {
        label: "Akcia",
        description: "Akcia inštalátora na vykonanie.",
      },
      repoName: {
        label: "Názov súkromného repozitára",
        description: "Názov repozitára vo vašom účte GitHub.",
        placeholder: "next-vibe-private",
      },
    },
    response: {
      actionMessage: { title: "Výsledok akcie" },
    },
    success: {
      title: "Akcia dokončená",
      description: "Akcia inštalátora úspešne prebehla.",
    },
    errors: {
      validation: {
        title: "Chyba validácie",
        description: "Neplatná akcia alebo názov repozitára.",
      },
      unauthorized: {
        title: "Neautorizované",
        description: "Vyžaduje sa prihlásenie.",
      },
      forbidden: {
        title: "Len lokálne",
        description: "Akcie inštalátora sú dostupné len na lokálnej inštancii.",
      },
      notFound: {
        title: "Nenájdené",
        description: "Požadovaný lokálny nástroj nebol nájdený.",
      },
      network: {
        title: "Chyba siete",
        description:
          "Nepodarilo sa spojiť s GitHubom. Skontrolujte pripojenie a skúste to znova.",
      },
      server: {
        title: "Chyba servera",
        description: "Akcia inštalátora zlyhala.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba.",
      },
      unsavedChanges: {
        title: "Konflikt",
        description: "Stav sa počas akcie zmenil.",
      },
      conflict: {
        title: "Repozitár už existuje",
        description: "Konflikt s existujúcim GitHub repozitárom.",
      },
    },
  },
  errors: {
    localOnly:
      "Inštalátor je dostupný len na lokálnej inštancii pri prvom spustení.",
    invalidRepoName:
      "Použite písmená, čísla, bodky, pomlčky alebo podčiarkovníky (max. 100 znakov).",
    ghNotInstalled:
      "GitHub CLI (gh) nie je na tomto počítači nainštalované. Použite manuálny postup nižšie alebo tento krok preskočte.",
    ghAuthStartFailed:
      "Nepodarilo sa spustiť prihlásenie zariadenia GitHub. Spustite 'gh auth login --web' v termináli alebo použite manuálny postup.",
    ghNotSignedIn: "Najprv sa prihláste do GitHubu a potom to skúste znova.",
    ghCreateFailed:
      "Nepodarilo sa vytvoriť súkromný GitHub repozitár alebo odoslať kód. Skontrolujte oprávnenia účtu GitHub a skúste to znova.",
  },
  actions: {
    refreshed: "Kontroly prostredia boli obnovené.",
    githubAuthPending:
      "Zadajte jednorazový kód na GitHube a potom kliknite na Skontrolovať prihlásenie.",
    githubAuthReady: "Prihlásený v GitHube ako {{username}}.",
    githubAuthWaiting:
      "Čaká sa na dokončenie prihlásenia GitHub v prehliadači.",
    githubRepoCreated: "Súkromný repozitár je pripojený a zosynchronizovaný.",
    githubSkipped:
      "Nastavenie GitHubu bolo preskočené. Repozitár môžete pripojiť kedykoľvek neskôr.",
    githubReset: "Nastavenie GitHubu bolo znova otvorené.",
  },
  widget: {
    progressOf: "{{done}} z {{total}} krokov pripravených",
    title: "Lokálna inštalácia je pripravená.",
    titleIncomplete: "Dokončite lokálnu inštaláciu",
    subtitle:
      "next-vibe už beží na vašom počítači. Voliteľne pripojte vlastný súkromný GitHub repozitár a pokračujte do sprievodcu nastavením.",
    subtitleIncomplete:
      "Skontrolujte kroky nižšie, opravte označené položky a pokračujte do sprievodcu nastavením.",
    checkoutLabel: "Priečinok",
    stateFileLabel: "Súbor stavu",
    recheck: "Znova skontrolovať",
    rechecking: "Kontrolujem...",
    copy: "Kopírovať",
    copied: "Skopírované",
    steps: {
      git: {
        title: "Git",
        missingDetail: "Git sa nenašiel v PATH.",
        missingRecovery:
          "Nainštalujte git, otvorte nový terminál a spustite inštalátor znova.",
      },
      bun: {
        title: "Bun runtime",
        missingDetail: "Bun sa nenašiel v PATH.",
        missingRecovery:
          "Nainštalujte Bun z https://bun.sh a spustite inštalátor znova.",
      },
      clone: {
        title: "Kópia next-vibe",
        clonedDetail: "Naklonované do {{dir}}",
        existingDetail: "Existujúca kópia zachovaná v {{dir}}",
        unknownDetail: "Beží z priečinka {{dir}}",
      },
      dependencies: {
        title: "Závislosti a CLI",
        readyDetail: "Balíky nainštalované a vibe CLI pripravené.",
        missingDetail: "node_modules nie je kompletné.",
        missingRecovery: "Spustite 'bun install' v priečinku projektu.",
      },
      github: {
        title: "Súkromný GitHub repozitár",
        optionalTag: "Voliteľné",
        connectedDetail: "Origin smeruje na {{url}}",
        skippedDetail:
          "Zatiaľ preskočené. Aktualizácie sa stále sťahujú z next-vibe.",
        pendingDetail:
          "Voliteľné. Uchovajte si vlastnú súkromnú kópiu na GitHube.",
      },
      server: {
        title: "Lokálny server",
        readyDetail: "Beží na http://localhost:{{port}}",
      },
    },
    githubCard: {
      title: "Súkromný GitHub repozitár",
      badge: "Voliteľné",
      body: "Vytvorte si vlastný súkromný repozitár, aby vaše úpravy zostali na GitHube súkromné, pričom upstream zostane prepojený s next-vibe.",
      connectedTitle: "Súkromný repozitár pripojený",
      connectedOpen: "Otvoriť na GitHube",
      skippedNotice:
        "Nastavenie GitHubu bolo preskočené. Súkromný repozitár môžete pripojiť kedykoľvek neskôr.",
      reopenButton: "Nastaviť GitHub",
      skipButton: "Preskočiť zatiaľ",
      signedInAs: "Prihlásený v GitHube ako {{username}}",
      repoNameLabel: "Názov súkromného repozitára",
      repoNameHelp:
        "Vytvorí sa ako súkromný repozitár pod vaším GitHub účtom. Upstream ostáva prepojený s next-vibe.",
      createButton: "Vytvoriť súkromný repozitár",
      creatingButton: "Vytváram a odosielam...",
      signInButton: "Prihlásiť sa cez GitHub",
      startingSignIn: "Spúšťam prihlásenie...",
      deviceTitle: "Schváľte prihlásenie na GitHube",
      deviceBody:
        "Skopírujte jednorazový kód nižšie, otvorte stránku zariadenia na GitHube a potvrďte prístup. Táto stránka neukladá žiadne tokeny.",
      deviceOpenLink: "Otvoriť stránku zariadenia GitHub",
      deviceCheckButton: "Prihlásil som sa, skontrolovať znova",
      manualTitle: "Manuálne nastavenie (bez GitHub CLI)",
      manualBody:
        "GitHub CLI (gh) nie je nainštalované. Vytvorte prázdny súkromný repozitár na GitHube a spustite tieto tri príkazy v priečinku projektu.",
      manualNewRepoLink: "Vytvoriť súkromný repozitár na GitHube",
      manualShowCommands: "Zobraziť git príkazy",
      manualHideCommands: "Skryť git príkazy",
    },
    handover: {
      continueToSetup: "Pokračovať do sprievodcu nastavením",
      openApp: "Otvoriť aplikáciu",
      hint: "Ďalej: nastavte administrátorské prihlásenie a pripojte svoj účet unbottled.ai alebo vlastné API kľúče.",
      completeHint: "Úvodné nastavenie je na tejto inštancii už dokončené.",
    },
  },
};
