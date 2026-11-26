import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/it";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  get: {
    title: "Ricavi",
    titleShort: "Ricavi",
    description:
      "Ricavi da pacchetti di crediti, nuovi abbonamenti e rinnovi per gestore, piano e valuta, con rimborsi, contestazioni, MRR, abbonamenti attivi e disdette.",
    tags: {
      revenue: "ricavi",
      mrr: "MRR",
    },
    fields: {
      kind: {
        label: "Tipo",
        description: "Pacchetti di crediti, nuovi abbonamenti, rinnovi o tutto",
      },
      provider: {
        label: "Gestore",
        description: "Solo pagamenti tramite questo gestore",
      },
      currency: {
        label: "Valuta",
        description: "Solo pagamenti in questa valuta (USD, EUR, PLN)",
      },
      plan: {
        label: "Piano",
        description: "Solo pagamenti e abbonamenti di questo piano",
      },
      includeInternal: {
        label: "Includi account admin",
        description: "Conta anche i pagamenti degli account admin",
      },
    },
    response: {
      window: "Periodo",
      appliedFilters: "Filtri applicati",
      kpis: "Dati chiave",
      revenueByKind: "Ricavi per tipo",
      revenueByProcessor: "Ricavi per gestore",
      subscriptionFlow: "Abbonamenti nuovi vs disdetti",
      byPlan: "Per piano o prodotto",
      byCurrency: "Per valuta",
      byProcessor: "Per gestore",
      recentPayments: "Pagamenti recenti",
      fxRates: "Tassi di cambio in USD",
    },
    errors: {
      validation: {
        title: "Filtri non validi",
        description: "Controlla periodo e filtri, poi riprova.",
      },
      unauthorized: {
        title: "Accesso richiesto",
        description: "Accedi come admin per vedere i ricavi.",
      },
      forbidden: {
        title: "Solo admin",
        description: "Solo gli admin vedono i ricavi.",
      },
      notFound: {
        title: "Nessun risultato",
        description: "Nessun pagamento per questa richiesta.",
      },
      server: {
        title: "Report non riuscito",
        description: "Impossibile generare il report dei ricavi. Riprova.",
      },
      unknown: {
        title: "Errore imprevisto",
        description:
          "Qualcosa è andato storto durante il caricamento del report.",
      },
      network: {
        title: "Errore di connessione",
        description: "Il server non è raggiungibile.",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Prima applica o scarta le modifiche ai filtri.",
      },
      conflict: {
        title: "Conflitto di dati",
        description:
          "I dati sono cambiati durante il caricamento. Aggiorna il report.",
      },
    },
    success: {
      title: "Report pronto",
      description: "Ricavi caricati",
    },
  },
  widget: {
    loadingReport: "Caricamento del rapporto sui ricavi…",
    operatingTitle: "Ricavi operativi",
    currencyBasis: "Importi approssimativi in USD.",
    filterDisclosure: "Filtri",
    extra: {
      grossHint: "Abbonamenti {{subs}} · pacchetti {{packs}} · ca. USD",
      newSubsHint:
        "Abbonamenti avviati nel periodo · {{count}} primi pagamenti",
      churn30Hint: "Terminati nel periodo · abbandono 30 giorni {{rate}}",
      notLoaded: "Report non caricato. Aggiorna per riprovare.",
      firstPayments: "Primi pagamenti di abbonamento",
      openAll: "Apri tutti i pagamenti",
      churnChart: "Abbandono a 30 giorni",
      churnNote:
        "Abbonamenti terminati nei 30 giorni prima di ogni punto ÷ attivi all’inizio di quei 30 giorni",
      kindPack: "Pacchetto crediti",
      kindNew: "Primo pagamento di abbonamento",
      kindRenewal: "Rinnovo",
      paid: "Pagati",
      subscriptionNote:
        "I dati sugli abbonamenti ignorano i filtri tipo e valuta.",
      netHint:
        "Lordo meno rimborsi del periodo; contestazioni e commissioni non sottratte",
      mrrHint: "Abbonamenti attivi a fine periodo, piani annuali ÷ 12",
      mrrChart: "MRR nel tempo",
      mrrNote: "Ricavi ricorrenti degli abbonamenti attivi in ogni momento.",
      churnRate: "{{rate}} degli abbonamenti attivi a inizio periodo",
      seriesMrr: "MRR",
      seriesActive: "Abbonamenti attivi",
      packUnknown: "Pacchetto crediti, taglia non registrata",
      filterIgnored: "Non influenzato dai filtri tipo e valuta",
      processorAll: "Tutti i processori",
      currencyAll: "Tutte le valute",
    },
    group: {
      money: "Denaro",
      customers: "Clienti e abbonamenti",
      volume: "Volume pagamenti",
    },
    kpi: {
      grossRevenueUsd: "Ricavi lordi",
      netRevenueUsd: "Ricavi netti",
      refundsUsd: "Rimborsi",
      mrrUsd: "MRR",
      payingCustomers: "Clienti paganti",
      activeSubscriptions: "Abbonamenti attivi",
      newSubscriptions: "Nuovi abbonamenti",
      churnedSubscriptions: "Disdetti",
      renewals: "Rinnovi",
      packPurchases: "Acquisti pacchetti",
      disputes: "Contestazioni",
      failedPayments: "Pagamenti falliti",
    },
    hint: {
      grossRevenueUsd: "Pagamenti incassati, circa USD",
      netRevenueUsd: "Lordo meno rimborsi emessi nel periodo",
      refundsUsd: "Rimborsi emessi nel periodo",
      mrrUsd: "Abbonamenti attivi a fine periodo, annuali / 12",
      payingCustomers: "Account con almeno un pagamento incassato",
      activeSubscriptions: "Attivi a fine periodo",
      newSubscriptions: "Abbonamenti avviati nel periodo",
      churnedSubscriptions: "Abbonamenti terminati nel periodo",
      renewals: "Pagamenti di rinnovo incassati",
      packPurchases: "Pagamenti di pacchetti crediti incassati",
      disputes: "Chargeback aperti nel periodo",
      failedPayments: "Pagamenti falliti nel periodo",
    },
    chart: {
      kind: "Ricavi per tipo",
      processor: "Ricavi per gestore",
      flow: "Abbonamenti: nuovi vs disdetti",
    },
    series: {
      pack: "Pacchetti di crediti",
      newSubscription: "Nuovi abbonamenti",
      renewal: "Rinnovi",
      new: "Nuovi",
      churned: "Disdetti",
    },
    breakdown: {
      byPlan: "Per piano o prodotto",
      byCurrency: "Per valuta",
      byProcessor: "Per gestore",
      recent: "Pagamenti recenti",
      recentHint:
        "Clicca un pagamento per aprirlo nelle transazioni del processore.",
      drillHint: "Clicca una riga per filtrare il report.",
      plan: "Piano o prodotto",
      currency: "Valuta",
      processor: "Gestore",
      payment: "Pagamento",
    },
    column: {
      revenueUsd: "Ricavi",
      amount: "Importo originale",
      payments: "Pagamenti",
      customers: "Clienti",
      failed: "Falliti",
      refundsUsd: "Rimborsato",
      usd: "USD",
    },
    label: {
      creditPack: "Pacchetto crediti (500)",
      creditPackLarge: "Pacchetto crediti (2.500)",
      pack: "Pacchetto crediti",
      newSubscription: "Nuovo abbonamento, piano non registrato",
      renewal: "Rinnovo, piano non registrato",
      rate: "1 {{currency}} = {{rate}} USD",
    },
    fxNote: "Totali in USD circa a tassi fissi: {{rates}}.",
    subscriptionNote:
      "I dati sugli abbonamenti seguono solo i filtri gestore e piano.",
    filter: {
      kind: "Tipo",
      provider: "Gestore",
      currency: "Valuta",
      plan: "Piano",
      internal: "Admin inclusi",
    },
    empty: "Nessun pagamento in questo periodo.",
    includeInternal: "Includi admin",
  },
  enums: {
    kind: {
      all: "Tutto",
      pack: "Pacchetti",
      newSubscription: "Primi pagamenti",
      renewal: "Rinnovi",
    },
    paymentProvider: {
      stripe: "Stripe",
      nowpayments: "NOWPayments",
    },
    paymentStatus: {
      pending: "In attesa",
      processing: "In elaborazione",
      succeeded: "Riuscito",
      failed: "Fallito",
      canceled: "Annullato",
      refunded: "Rimborsato",
    },
    plan: {
      subscription: "Starter",
      plus: "Plus",
      pro: "Pro",
      ultra: "Ultra",
    },
  },
};
