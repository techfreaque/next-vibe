import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  acquisition: {
    title: "Získavanie kontaktov",
    fields: { currency: "Mena tržieb" },
  },
  get: {
    title: "Prehľad odporúčaní",
    titleShort: "Správa odporúčaní",
    description: "Kódy odporúčaní, provízie a výplaty",
    form: {
      title: "Správa odporúčaní",
      description: "Spravujte program odporúčaní",
    },
    searchFilters: {
      title: "Vyhľadávanie a filtre",
      description: "Filtrovať údaje o odporúčaniach",
    },
    search: {
      label: "Vyhľadať",
      description: "Hľadajte podľa e-mailu používateľa",
      placeholder: "Vyhľadať odporúčania…",
    },
    payoutStatus: {
      label: "Stav výplaty",
      description: "Filtrovať podľa stavu žiadosti o výplatu",
      placeholder: "Ľubovoľný stav",
    },
    dateFrom: {
      label: "Od",
      description: "Filter dátumu začiatku",
    },
    dateTo: {
      label: "Do",
      description: "Filter dátumu konca",
    },
    sortingOptions: {
      title: "Zoradenie",
      description: "Nastavte zoradenie výsledkov",
    },
    sortBy: {
      label: "Zoradiť podľa",
      description: "Pole zoradenia",
      placeholder: "Vyberte pole zoradenia…",
    },
    sortOrder: {
      label: "Poradie zoradenia",
      description: "Vzostupne alebo zostupne",
      placeholder: "Vyberte poradie…",
    },
    response: {
      title: "Odporúčania",
      description: "Údaje o programe odporúčaní",
      summary: {
        title: "Súhrn",
        description: "Súhrnné štatistiky odporúčaní",
        totalCodes: { label: "Kódy spolu" },
        totalSignups: { label: "Registrácie spolu" },
        totalEarned: { label: "Celkové provízie" },
        totalPaidOut: { label: "Vyplatené spolu" },
        pendingPayouts: { label: "Čakajúce výplaty" },
      },
      codes: {
        code: "Kód",
        ownerEmail: "Vlastník",
        ownerName: "Meno",
        currentUses: "Použitia kódu",
        totalSignups: "Registrácie",
        totalEarned: "Získané",
        isActive: "Aktívne",
        createdAt: "Vytvorené",
      },
      payoutRequests: {
        id: "ID",
        userEmail: "Používateľ",
        amountCents: "Suma",
        currency: "Mena",
        status: "Stav",
        walletAddress: "Peňaženka",
        adminNotes: "Poznámky",
        rejectionReason: "Dôvod zamietnutia",
        createdAt: "Podané",
        processedAt: "Spracované",
      },
      totalCount: "Spolu",
      pageCount: "Celkový počet strán",
    },
    page: { label: "Stránka" },
    limit: { label: "Na stranu" },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      validation: {
        title: "Chyba overenia údajov",
        description: "Neplatné parametre",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Vyžadujú sa oprávnenia správcu",
      },
      server: {
        title: "Chyba servera",
        description: "Odporúčania sa nepodarilo načítať",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Neočakávaná chyba",
      },
      conflict: { title: "Konflikt", description: "Nastal konflikt údajov" },
      network: {
        title: "Chyba siete",
        description: "Pripojenie sa nepodarilo",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Nenašli sa žiadne údaje o odporúčaniach",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Neuložené zmeny",
      },
    },
    success: { title: "Úspech", description: "Odporúčania načítané" },
  },
  post: {
    title: "Akcia pri výplate",
    titleShort: "Akcia pri výplate",
    description: "Schváľte, zamietnite alebo dokončite žiadosť o výplatu",
    form: {
      title: "Akcia pri výplate",
      description: "Spracujte žiadosť o výplatu",
    },
    requestId: {
      label: "ID žiadosti",
      description: "Žiadosť o výplatu na spracovanie",
      placeholder: "Zadať ID žiadosti…",
    },
    action: {
      label: "Akcia",
      description: "Akcia, ktorá sa má vykonať",
      placeholder: "Vybrať akciu…",
    },
    adminNotes: {
      label: "Poznámky správcu",
      description: "Voliteľné poznámky",
      placeholder: "Pridať poznámky…",
    },
    rejectionReason: {
      label: "Dôvod zamietnutia",
      description: "Povinné pri zamietnutí",
      placeholder: "Zadať dôvod…",
    },
    response: {
      title: "Výsledok",
      description: "Výsledok akcie",
      success: "Úspech",
      message: "Správa",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      validation: {
        title: "Chyba overenia údajov",
        description: "Neplatné parametre",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Vyžadujú sa oprávnenia správcu",
      },
      server: {
        title: "Chyba servera",
        description: "Výplatu sa nepodarilo spracovať",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Neočakávaná chyba",
      },
      conflict: {
        title: "Konflikt",
        description: "Výplata už bola spracovaná",
      },
      network: {
        title: "Chyba siete",
        description: "Pripojenie sa nepodarilo",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Žiadosť o výplatu sa nenašla",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Neuložené zmeny",
      },
    },
    success: { title: "Úspech", description: "Výplata spracovaná" },
  },
  widget: {
    noReferrals: "Nenašli sa žiadne kódy odporúčaní.",
    noPayouts: "Žiadne žiadosti o výplatu.",
    approve: "Schváliť",
    reject: "Zamietnuť",
    complete: "Dokončiť",
    sectionCodes: "Kódy odporúčaní",
    sectionPayouts: "Žiadosti o výplatu",
    refresh: "Obnoviť",
    codeActive: "Aktívne",
    codeInactive: "Neaktívne",
    clicks: "kliknutia",
    signups: "registrácie",
    earned: "získané",
    confirm: {
      title: "Potvrdiť akciu pri výplate",
      description:
        "Chceš vykonať túto akciu pri výplate? Po potvrdení ju nemožno vrátiť.",
      cancel: "Zrušiť",
      proceed: "Pokračovať",
    },
  },
  enums: {
    currency: { eur: "EUR", usd: "USD", pln: "PLN" },
    payoutStatusFilter: {
      all: "Všetky",
      pending: "Čaká",
      approved: "Schválené",
      rejected: "Zamietnuté",
      processing: "Spracúva sa",
      completed: "Dokončené",
      failed: "Zlyhalo",
    },
    referralSortField: {
      createdAt: "Vytvorené",
      earnings: "Celkové provízie",
      signups: "Registrácie",
    },
    sortOrder: {
      asc: "Vzostupne",
      desc: "Zostupne",
    },
    payoutAction: {
      approve: "Schváliť",
      reject: "Zamietnuť",
      complete: "Dokončiť",
    },
  },
};
