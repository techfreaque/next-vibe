import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "platba",
    dashboard: "prehľad",
  },
  get: {
    title: "Prehľad platieb",
    titleShort: "Prehľad",
    description: "Prehľad vydaných a prijatých faktúr a úhrad",
    form: {
      title: "Prehľad",
      description: "Prehľad platieb vašej firmy",
    },
    response: {
      estimates: "Cenové ponuky",
      byCurrency: "Súčty podľa meny",
      openInvoices: "Otvorené faktúry",
      overdueInvoices: "Po splatnosti",
      unpaidBills: "Neuhradené prijaté faktúry",
      draftInvoices: "Koncepty faktúr",
      currency: "Mena",
      recentInvoices: "Nedávne faktúry",
      openCount: "Počet otvorených faktúr",
      openTotal: "Suma otvorených faktúr",
      overdueCount: "Počet po splatnosti",
      overdueTotal: "Suma po splatnosti",
      unpaidCount: "Počet neuhradených faktúr",
      unpaidTotal: "Neuhradená suma",
      draftCount: "Počet konceptov",
    },
    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "Neplatné parametre požiadavky",
      },
      network: {
        title: "Chyba siete",
        description: "Chyba sieťového pripojenia",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Prihláste sa.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Musíte byť členom tejto firmy.",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Firma sa nenašla",
      },
      server: {
        title: "Chyba servera",
        description: "Nastala interná chyba servera.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny.",
      },
      conflict: {
        title: "Konflikt",
        description: "Údaje sa medzičasom zmenili.",
      },
    },
    success: {
      title: "Úspech",
      description: "Údaje prehľadu boli načítané.",
    },
  },
  companyId: {
    label: "ID firmy",
    description: "Firma, ktorej údaje sa zobrazia v prehľade",
    placeholder: "Zadajte ID firmy",
  },
  widget: {
    unnumberedInvoice: "Faktúra bez čísla",
    subtitle:
      "Faktúry, cenové ponuky a dodávateľské faktúry. Platby kartou a kryptomenami nájdete medzi transakciami spracovateľa platieb.",
    estimatesSent: "Odoslané cenové ponuky",
    estimateDrafts: "Počet konceptov: {{count}}",
    recentEstimates: "Nedávne cenové ponuky",
    noRecentEstimates: "Zatiaľ žiadne cenové ponuky",
    validUntil: "Platnosť do {{date}}",
    notInvoicesHint:
      "Platby kartou a kryptomenami nájdete medzi transakciami spracovateľa platieb. Tu sú faktúry, ktoré vystavujete sami.",
    openTransactions: "Zobraziť transakcie spracovateľa platieb",
    commercialDocuments: "Obchodné doklady",
    processorDiagnostics: "Transakcie spracovateľa platieb",
    loading: "Načítava sa prehľad…",
    noData: "Vyberte firmu.",
    noDataHint: "Vyberte firmu a zobrazte prehľad jej platieb.",
    openInvoices: "Otvorené faktúry",
    overdue: "Po splatnosti",
    unpaidBills: "Neuhradené prijaté faktúry",
    draftInvoices: "Koncepty faktúr",
    quickActions: "Rýchle akcie",
    newInvoice: "Nová faktúra",
    allInvoices: "Všetky faktúry",
    newEstimate: "Nová cenová ponuka",
    allEstimates: "Cenové ponuky",
    allBills: "Dodávateľské faktúry",
    recentInvoices: "Nedávne faktúry",
    noRecentInvoices: "Zatiaľ žiadne vystavené faktúry",
    view: "Zobraziť",
    due: "Splatné",
    status: {
      draft: "Koncept",
      open: "Otvorená",
      paid: "Zaplatené",
      void: "Storno",
      uncollectible: "Nevymožiteľná",
    },
  },
};
