import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Stats di affari",
  titleShort: "Statistiche utenti",
  description:
    "Iscrizione, utenti attivi e paganti, MRR, entrate, spesa di credito, conversione di iscrizione a pagamento e ritenzione D7. Ogni numero contro la finestra precedente, più grafico di tendenza, canali e top spender.",
  category: "Utenti",
  tag: "Statistiche",
  fields: {
    range: {
      label: "Finestra",
      description:
        "finestra di segnalazione, rispetto alla finestra di uguale lunghezza prima di esso",
    },
    from: {
      label: "Da",
      description: "Primo giorno (UTC). Sovrascrive l'inizio della finestra",
    },
    to: {
      label: "A",
      description:
        "Ultimo giorno (UTC). Sovrascrive l'estremità della finestra",
    },
    granularity: {
      label: "Secchi di grafico",
      description:
        "Giorno, settimana o mese. Auto picks per lunghezza della finestra",
    },
    includeInternal: {
      label: "Includere gli amministratori",
      description: "Contare i conti interni e i loro pagamenti",
    },
  },
  response: {
    period: "Periodo",
    kpis: "KPI",
    series: "Serie temporale",
    channels: "Canali di iscrizione",
    revenueByCurrency: "Entrate in moneta",
    subscriptionsByStatus: "Abbonamenti per stato",
    topSpenders: "I migliori spenderli",
    generatedAt: "Generato a",
  },
  enums: {
    range: {
      last7Days: "Ultimi 7 giorni",
      last30Days: "Ultimi 30 giorni",
      last90Days: "Ultimi 90 giorni",
      last12Months: "Ultimi 12 mesi",
      thisMonth: "Questo mese",
      lastMonth: "Il mese scorso",
      allTime: "Tutto il tempo",
      custom: "Date personalizzate",
    },
    granularity: {
      auto: "Automatico",
      day: "Giorno",
      week: "Rassegna",
      month: "Mese",
    },
  },
  kpi: {
    revenue: "Ricavi",
    revenueHint: "Pagamento garantito, USD",
    refundsHint: "{{amount}} rimborsato",
    mrr: "MRR",
    mrrHint: "{{active}} sub attivi, {{pastDue}} passato dovuto",
    payingUsers: "Utenti che pagano",
    payingAllTimeHint: "{{count}} pagato mai",
    creditsSpent: "Crediti spesi",
    creditsHint: "circa {{usd}} di utilizzo",
    newUsers: "Registrazioni",
    totalUsersHint: "{{count}} utenti totali",
    activeUsers: "Utenti attivi",
    anonymousHint: "+ spese anonime di visitatori {{count}}",
    signupToPaid: "Registrazione a pagamento",
    ratioHint: "{{converted}} di {{cohort}} nuove iscrizioni pagate",
    retentionD7: "D7 ritenzione",
    retentionHint: "{{converted}} di {{cohort}} è tornato dopo il giorno 7",
    activeSubscribers: "Abbonati attivi",
    pastDue: "Passato a due",
    totalUsers: "Totale utenti",
    payingAllTime: "Pagato mai",
    revenueAllTime: "Entrate per tutto il tempo",
    refunds: "Rimborsi",
    anonymousActive: "Spettacoli anonimi",
  },
  series: {
    signups: "Registrazioni",
    activeUsers: "Attivo",
    payingUsers: "Pagamenti",
    revenueUsd: "Ricavi",
    creditsSpent: "Crediti",
  },
  sections: {
    trend: "Tendenza",
    channels: "Canali di iscrizione",
    subscriptions: "Abbonamenti ora",
    currencies: "Entrate in moneta",
    topSpenders: "I migliori spender in finestra",
  },
  table: {
    channel: "Canale",
    signups: "Registrazioni",
    paying: "Pagato",
    conversion: "Conv.",
    user: "Utente",
    creditsSpent: "Crediti spesi",
    lifetimePaid: "Durata della vita",
  },
  widget: {
    times: "{{count}}x",
    loading: "Numeri incrollanti...",
    users: "Utenti",
    refresh: "Aggiorna",
    new: "nuovo",
    noData: "Nessun dato in questa finestra.",
    chartTotal: "Totale {{total}}",
    period:
      "{{from}} a {{to}} (giorni {{days}}, UTC). Le modifiche si confrontano con i giorni {{days}} prima.",
    definitions:
      "Attivo = crediti spesi (portafoglio di contatto privato o collegato). Pagamento = pagamento riuscito in finestra. Entrate in USD a FX statico. MRR = abbonamenti in diretta valutati dal loro ultimo pagamento. Conti di amministrazione esclusi a meno che non inclusi sopra.",
    text: {
      header: "{{from}} a {{to}} (giorni {{days}}, UTC)",
      metric: "Metrico",
      current: "Ora.",
      previous: "Prima di prima",
      change: "Cambia",
      bucket: "Fibbia",
      paying: "{{count}} pagato",
      footer:
        "Windows: --range=enums.range.last7Days|last90Days|last12Months| allTime. Utenti: vibe user-list",
    },
  },
  errors: {
    validation: {
      title: "Richiesta statistiche non valide",
      description: "Controllare la finestra e le date",
    },
    unauthorized: {
      title: "Accedi per continuare",
      description: "Accedi per visualizzare le statistiche",
    },
    forbidden: {
      title: "Admins solo",
      description:
        "Hai bisogno del ruolo di amministratore per visualizzare le statistiche",
    },
    notFound: {
      title: "Nessun dato",
      description: "Niente da segnalare per questa finestra",
    },
    server: {
      title: "Non poteva calcolare le statistiche",
      description:
        "Il server non è riuscito a calcolare le statistiche degli utenti",
    },
    network: {
      title: "Errore di rete",
      description: "Non è possibile raggiungere il server",
    },
    unknown: {
      title: "Errore inaspettato",
      description: "Qualcosa è andato storto calcolo statistiche",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Hai modifiche non salvate",
    },
    conflict: {
      title: "Conflitto",
      description: "La richiesta è in conflitto con i dati attuali",
    },
  },
  success: {
    title: "Stats pronto",
    description: "Statistiche dell'utente calcolate",
  },
};
