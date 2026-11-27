import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    publicCap: "public-cap",
    admin: "admin",
  },
  get: {
    perDayUnit: "kreditov denne",
    lead: "Návštevník",
    ip: "IP adresa",
    globalCap: "Denný limit dosiahnutý",
    leadCap: "Limit návštevníka dosiahnutý",
    ipCap: "Limit IP dosiahnutý",
    singleRequest: "Požiadavka je príliš drahá",
    failClosed: "Zablokované, kontrola limitu zlyhala",
    poolReserved: "Kredity rezervované",
    threshold80: "Využitých 80 % limitu",
    threshold100: "Limit vyčerpaný",
    other: "Iné",
    changeCap: "Zmeniť limit",
    limits: "Limity",
    capHint: "Spoločný pre všetkých návštevníkov bez plateného plánu",
    usedOfCap: "Využité {{used}} z {{cap}}",
    exceededHint: "Bezplatní návštevníci sú zablokovaní do denného resetu.",
    resetAt: "Naposledy resetované {{time}}",
    title: "Načítať denný limit bezplatných kreditov",
    titleShort: "Limit bezplatných kreditov",
    description:
      "Zobraziť dnešnú celkovú spotrebu a limit bezplatných kreditov",
    container: {
      title: "Denný limit bezplatných kreditov",
      description: "Celkový denný limit spotreby pre neplatiacich používateľov",
    },
    spendToday: {
      content: "Minuté dnes",
    },
    capAmount: {
      content: "Denný limit",
    },
    remainingToday: {
      content: "Zostáva dnes",
    },
    percentUsed: {
      content: "Použité",
    },
    lastResetAt: {
      content: "Posledné obnovenie",
    },
    capExceeded: {
      content: "Prekročený limit",
    },
    perLeadCap: { content: "Limit na kontakt" },
    perIpCap: { content: "Limit na IP adresu" },
    topSpenders: { content: "Najvyššia spotreba bezplatných kreditov dnes" },
    recentEvents: { content: "Nedávne udalosti limitu" },
    noData: "Dnes zatiaľ bez udalostí.",
    success: {
      title: "Stav limitu načítaný",
      description: "Stav limitu bezplatných kreditov bol načítaný",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Neplatné parametre požiadavky",
      },
      network: {
        title: "Chyba siete",
        description: "Sieťové pripojenie zlyhalo",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Vyžadujú sa oprávnenia správcu",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Nastavenie limitu sa nenašlo",
      },
      server: {
        title: "Chyba servera",
        description: "Stav limitu sa nepodarilo načítať",
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
        title: "Konflikt údajov",
        description: "Nastal konflikt zdrojov",
      },
    },
  },
  post: {
    perDayUnit: "kreditov denne",
    back: "Späť",
    decrease: "Znížiť o 100",
    increase: "Zvýšiť o 100",
    title: "Zmeniť denný limit bezplatných kreditov",
    titleShort: "Zmeniť limit",
    description:
      "Zmeniť celkový denný limit kreditov pre neplatiacich používateľov",
    capAmount: {
      label: "Denný limit (kredity)",
      description:
        "Maximálny počet kreditov, ktoré môžu neplatiaci používatelia spolu minúť za deň",
      placeholder: "napr. 500",
    },
    perLeadCap: {
      label: "Denný limit na kontakt (kredity)",
      description:
        "Maximálny počet bezplatných kreditov, ktoré môže za deň minúť jeden návštevník alebo kontakt",
      placeholder: "napr. 20",
    },
    perIpCap: {
      label: "Denný limit na IP adresu (kredity)",
      description:
        "Maximálny počet bezplatných kreditov, ktoré možno za deň minúť z jednej IP adresy",
      placeholder: "napr. 40",
    },
    message: {
      content: "Výsledok",
    },
    success: {
      title: "Limit bol aktualizovaný",
      description: "Denný limit bol aktualizovaný",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Limit musí byť kladné číslo",
      },
      network: {
        title: "Chyba siete",
        description: "Sieťové pripojenie zlyhalo",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Vyžadujú sa oprávnenia správcu",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Nastavenie limitu sa nenašlo",
      },
      server: {
        title: "Chyba servera",
        description: "Limit sa nepodarilo aktualizovať",
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
        title: "Konflikt údajov",
        description: "Nastal konflikt zdrojov",
      },
    },
  },
  repository: {
    capUpdated: "Denný limit nastavený na {{capAmount}} kreditov",
    capExceeded:
      "Dnešný bezplatný limit na túto požiadavku nestačí. Skús to zajtra alebo použi platené kredity.",
    leadCapExceeded:
      "Denný bezplatný limit na tomto zariadení alebo v tejto sieti je vyčerpaný. Tvoje bezplatné kredity ti zostávajú a zajtra zase fungujú. Platené kredity fungujú hneď.",
    reservedByRunningReply:
      "Tvoje bezplatné kredity ešte pokrývajú rozpracovanú odpoveď. Počkaj, kým skončí, a potom pošli znova.",
    capUnavailable: "Bezplatné kredity sú dočasne nedostupné. Skús to neskôr.",
    getCapFailed:
      "Nepodarilo sa načítať nastavenie limitu bezplatných kreditov",
    updateCapFailed: "Limit bezplatných kreditov sa nepodarilo aktualizovať",
    incrementFailed: "Spotrebu bezplatných kreditov sa nepodarilo zaznamenať",
  },
};
