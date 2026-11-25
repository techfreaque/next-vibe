import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  dashboard: {
    title: "Prehľad účtovníctva",
    titleShort: "Prehľad",
    description:
      "Zobraziť neuhradené zostatky, hotovosť, zisk a aktuálne účtovné obdobie.",
    companyId: {
      label: "ID firmy",
      description: "Firma, ktorej prehľad sa má zobraziť",
      placeholder: "UUID firmy",
    },
    response: {
      currentPeriod: "Aktuálne obdobie",
      accountCount: "Účty",
      draftEntryCount: "Nezaúčtované návrhy",
      postedThisMonthCount: "Zaúčtované tento mesiac",
      hasSetup: "Nastavenie účtovníctva",
      currency: "Mena",
    },
    success: {
      title: "Prehľad sa načítal",
      description: "Prehľad účtovníctva je pripravený.",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Skontrolujte zadané údaje.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "K tejto spoločnosti nemáte prístup.",
      },
      server: {
        title: "Chyba servera",
        description: "Prehľad sa nepodarilo načítať.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      conflict: { title: "Konflikt", description: "Konflikt údajov" },
      network: {
        title: "Chyba siete",
        description: "Server sa nepodarilo kontaktovať",
      },
      notFound: { title: "Nenašlo sa", description: "Firma sa nenašla" },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    widget: {
      noPeriodHint: "Pred zaúčtovaním zápisov otvorte účtovné obdobie.",
      zeroMetricsHint:
        "Sumy sa aktualizujú po vystavení faktúr, schválení prijatých faktúr a zaúčtovaní transakcií.",
      financialOverview: "Finančný prehľad",
      openReceivables: "Neuhradené pohľadávky",
      approvedPayables: "Schválené dodávateľské faktúry na úhradu",
      cashBalance: "Pokladnica a bankové účty",
      monthToDateProfit: "Zisk za tento mesiac",
      needsAttention: "Na vybavenie",
      currentPeriod: "Aktuálne obdobie",
      noPeriod: "Nie je otvorené žiadne obdobie",
      createPeriod: "Vytvoriť obdobie",
      totalAccounts: "Účty",
      viewAccounts: "Zobraziť",
      draftEntries: "Nezaúčtované návrhy",
      viewDrafts: "Zobraziť",
      postedThisMonth: "Zaúčtované tento mesiac",
      configured: "Nastavené",
      notSetUp: "Účtovníctvo nie je nastavené",
      runSetup: "Nastaviť účtovníctvo",
      setupStatus: "Nastavenie účtovníctva",
      loading: "Načítava sa prehľad…",
      noData: "Nie sú k dispozícii žiadne účtovné údaje.",
      navTitle: "Účtovníctvo",
      chartOfAccounts: "Účtový rozvrh",
      journalEntries: "Účtovné zápisy",
      periods: "Účtovné obdobia",
      balanceSheet: "Súvaha",
      profitLoss: "Výkaz ziskov a strát",
      trialBalance: "Obratová predvaha",
      taxReport: "Daňový prehľad",
      companies: "Firmy",
      invoices: "Faktúry",
      bills: "Dodávateľské faktúry",
      selectCompany: "Vyberte spoločnosť, ktorej účtovníctvo chcete zobraziť.",
    },
  },
  category: "Účtovníctvo",
  tag: "prehľad",
};
