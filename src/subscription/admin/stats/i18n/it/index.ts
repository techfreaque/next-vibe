import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Statistiche dell'abbonamento",
    titleShort: "Admin Stats",
    description: "Revenue, abbonamenti, metriche di credito e di riferimento",
    form: {
      title: "Statistiche Dashboard",
      description: "metriche aziendali aggregate",
    },
    timePeriodOptions: {
      title: "Periodo di tempo",
      description: "Configura l'intervallo di tempo",
    },
    timePeriod: {
      label: "Periodo",
      description: "Intervallo di gruppo",
    },
    dateRangePreset: {
      label: "Gamma di date",
      description: "intervallo di date predefinito",
    },
    response: {
      revenueStats: {
        title: "Entrate",
        description: "Misurazioni delle entrate",
        mrr: { label: "MRR" },
        arr: { label: "ARR" },
        totalRevenue: { label: "Totale delle entrate" },
        avgOrderValue: { label: "Ordine Avg" },
      },
      subscriptionStats: {
        title: "Abbonamenti",
        description: "Conti di abbonamento",
        activeCount: { label: "Attivo" },
        trialingCount: { label: "Trialing" },
        canceledCount: { label: "Annullamento" },
        churnRate: { label: "Tasso di cambio" },
      },
      intervalStats: {
        title: "Intervalli di fatturazione",
        description: "Mensile vs scissione annuale",
        monthlyCount: { label: "Mensile" },
        yearlyCount: { label: "Annuale" },
        yearlyRevenuePct: { label: "% Entrate annuali" },
      },
      creditStats: {
        title: "Crediti",
        description: "metriche del pacchetto di credito",
        totalPurchased: { label: "Acquistato" },
        totalSpent: { label: "Spettacolo" },
        packsSold: { label: "Pacchetti venduti" },
        avgPackSize: { label: "Dimensione del pacchetto di Avg" },
      },
      referralStats: {
        title: "Referrals",
        description: "metriche del programma di riferimento",
        totalReferrals: { label: "Referrali totali" },
        conversionRate: { label: "Conversione" },
        totalEarned: { label: "Totale accumulato" },
        pendingPayouts: { label: "Pagamenti in sospeso" },
      },
      growthMetrics: {
        title: "Crescita",
        description: "Tendenze delle entrate e dell'abbonamento",
        revenueChart: {
          label: "Entrate nel tempo",
          description: "Tendenza delle entrate",
        },
        subscriptionChart: {
          label: "Crescita dell'abbonamento",
          description: "Tendenza di abbonamento attiva",
        },
      },
      businessInsights: {
        title: "Insights",
        description: "metriche generate",
        generatedAt: { label: "Generato a" },
      },
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Login necessario per visualizzare le statistiche",
      },
      validation: {
        title: "Errore di convalida",
        description: "Parametri non validi",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso all'amministratore richiesto",
      },
      server: {
        title: "Errore del server",
        description: "Incapace di generare statistiche",
        detail: "Non è possibile costruire le statistiche: {{error}}",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Errore inaspettato si è verificato",
      },
      conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
      network: {
        title: "Errore di rete",
        description: "Incapace di connettersi",
      },
      notFound: {
        title: "Non trovato",
        description: "Statistiche non disponibili",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Statistiche generate",
    },
  },
  widget: {
    refresh: "Aggiorna",
    filters: "Filtri",
  },
  stats: {
    timePeriod: {
      day: "Giorno",
      week: "Rassegna",
      month: "Mese",
      quarter: "Quartiere",
      year: "Anno",
    },
    dateRange: {
      today: "Oggi",
      yesterday:
        "Ieri, ieri, ieri, ieri sera, ieri, ieri, ieri, ieri, ieri, ieri, ieri, ieri, ieri, ieri, ieri, ieri, ieri",
      last7Days: "Ultimi 7 giorni",
      last30Days: "Ultimi 30 giorni",
      last90Days: "Ultimi 90 giorni",
      thisWeek: "Rassegna",
      lastWeek: "Rassegna",
      thisMonth: "Questo mese",
      lastMonth: "Ultimo mese",
      thisQuarter: "Questo quartiere",
      lastQuarter: "Ultimo trimestre",
      thisYear: "Quest'anno",
      lastYear: "Ultimo anno",
      custom: "Personalizzato",
    },
  },
};
