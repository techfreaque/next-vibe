import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/it";

import { translations as leadAnalyticsTranslations } from "@/leads/analytics/i18n/it";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  ...leadAnalyticsTranslations,
  platformSummary: {
    reviewPayouts: "Esamina le richieste di pagamento",
    creditsPurchased: "Crediti acquistati in 30 giorni",
    creditsUsed: "Crediti usati in 30 giorni",
    creditsUnused: "Crediti pagati inutilizzati",
    activeSubscriptions: "Abbonamenti attivi",
    renewalsSoon: "Rinnovi entro 7 giorni",
    pastDueSubscriptions: "Abbonamenti in arretrato",
    pendingPayouts: "Richieste di pagamento in attesa",
    pendingPayoutValue: "Pagamenti in attesa",
    messagesSent: "Email inviate",
    messagesBounced: "Email respinte",
    messagesFailed: "Invii non riusciti",
    activeCompanies: "Aziende attive",
    inactiveCompanies: "Aziende inattive",
    totalConnections: "Connessioni",
    grossReceipts: "Incassi lordi",
    refunds: "Rimborsi",
    netReceipts: "Incassi al netto dei rimborsi",

    valuationBasis:
      "Il margine è il valore dei crediti a listino meno il costo del fornitore. Include solo gli utilizzi con un costo registrato.",
    valuationCost: "Costo IA stimato",
    valuationMargin: "Margine stimato sull’uso dell’IA",
    newAccount: "Account registrato",
    receivedPayment: "Pagamento ricevuto",
    completedTask: "Attività pianificata completata",
    operations: "Operazioni",
    emptyActivity: "Nessuna attività nel periodo.",
    period: "Ultimi 30 giorni rispetto ai 30 precedenti",
    retry: "Riprova",
    title: "Panoramica della piattaforma",
    description:
      "Consulti acquisizione, ricavi e stato dei servizi negli ultimi 30 giorni.",
    unavailable: "Non disponibile",
    recent: "Attività recente",
    recentPayments: "Pagamenti recenti",
    emptyPayments: "Nessun pagamento negli ultimi 30 giorni.",
  },
  category: "Analisi",
  tags: {
    analytics: "Analisi",
    overview: "Panoramica",
  },
  get: {
    title: "Panoramica aziendale",
    titleShort: "Panoramica",
    description:
      "Traffico, lead, registrazioni, clienti paganti, ricavi, costo AI e avvisi di un periodo, confrontati con il periodo precedente. Ogni numero apre il report che c'è dietro.",
    response: {
      window: "Periodo",
      generatedAt: "Dati delle",
      acquisition: "Acquisizione",
      referral: "Referral",
      money: "Finanze",
      ops: "Operazioni",
    },
    widget: {
      kpi: {
        visits: "Visite umane",
        humanLeads: "Nuovi lead",
        botLeadsHint: "{{count}} lead di bot esclusi",
        botVisitsHint: "{{count}} visite di bot escluse",
        excludedLeadsHint:
          "{{bots}} lead bot e {{unknown}} sconosciuti esclusi",
        excludedVisitsHint:
          "{{bots}} visite bot e {{unknown}} sconosciute escluse",
        creditSpendHintNoPrevCost:
          "Costo fornitore {{cost}} (non registrato nel periodo precedente). {{guests}} da ospiti.",
        creditSpendHintNoCompare:
          "Costo fornitore {{cost}}. {{guests}} da ospiti.",
        payersHint: "Paganti distinti nel periodo",
        signups: "Registrazioni",
        signupRateHint: "{{rate}} dei nuovi lead",
        payers: "Clienti che hanno pagato",
        revenue: "Ricavi",
        revenueHint: "Incassato, circa USD",
        revenueNetHint:
          "Incassato, circa USD. {{net}} dopo i costi dei fornitori AI.",
        creditSpend: "Uso AI (crediti consumati)",
        guestSpendHint: "{{amount}} da ospiti",
        creditSpendHint:
          "Costo fornitori {{cost}} (vs {{previous}}). {{guests}} da ospiti.",
        margin: "Margine sull'uso AI",
        marginPartial: "Margine AI (parziale)",
        marginHint:
          "Costo fornitori {{cost}}. Fatturato meno costo, dove il costo è noto.",
        marginBaseHint:
          "{{rate}} di {{base}} di uso fatturato con dati di costo. Costo fornitori {{cost}}.",
        marginRateHint:
          "{{margin}} su {{base}} con dati di costo ({{coverage}} dell'uso).",
        errors: "Errori aperti",
        errorsHint: "{{count}} occorrenze nel periodo",
        botShare: "Quota di bot nei lead",
        botShareHint:
          "{{count}} lead di bot, fonte principale in Da controllare",
        botShareTopHint: "{{count}} lead di bot. Picco maggiore {{prefix}}.",
      },
      trafficChart: "Lead umani e registrazioni",
      trafficChartHint: "Bot esclusi",
      moneyChart: "Ricavi",
      moneyChartHint: "Incassi per intervallo",
      series: {
        visits: "Visite",
        leads: "Nuovi lead",
        signups: "Registrazioni",
        revenueUsd: "Ricavi",
        spendUsd: "Uso AI fatturato",
        upstreamCostUsd: "Costo fornitori",
      },
      sources: "Da dove arrivano i lead (primo contatto)",
      sourcesDimension: "Canale",
      sourcesHint:
        "Attività del periodo per canale di primo contatto di ogni persona",
      referralsHint:
        "Clic, registrazioni e pagamenti attribuiti al codice in questo periodo",
      leadShare: "Quota lead",
      revenueShare: "Quota ricavi",
      footerSources:
        "Ricavi in queste righe: {{rows}} su {{total}} incassati nel periodo",
      footerReferrals:
        "Attribuito ai codici (base commissioni): {{rows}} su {{total}} incassati nel periodo",
      referrals: "Codici referral migliori",
      referralsDimension: "Codice",
      columns: {
        leads: "Lead",
        signups: "Registrazioni",
        payers: "Paganti",
        clicks: "Clic",
        revenueUsd: "Ricavi",
        conversion: "Da lead a registrazione",
        clickToSignup: "Da clic a registrazione",
      },
      alerts: {
        severity: { high: "Alta", medium: "Media", low: "Bassa" },
        title: "Da controllare",
        none: "Niente da segnalare in questo periodo.",
        abuse:
          "{{count}} intervalli IP con picchi di lead, in testa {{prefix}} ({{leads}} lead)",
        payouts: "{{count}} richieste di pagamento in attesa ({{amount}})",
        tasks: "{{count}} attività pianificate in errore",
        connections: "{{count}} connessioni remote con problemi",
        failedPayments:
          "Pagamenti non riusciti negli ultimi 30 giorni: {{count}}",
        disputes: "Contestazioni di pagamento aperte: {{count}}",
        costCoverage:
          "Costo fornitori noto solo per {{coverage}} dell'uso AI, margine parziale",
        unattributed: "{{share}} dei ricavi senza fonte nota ({{amount}})",
        errors:
          "{{count}} errori aperti, {{occurrences}} occorrenze nel periodo",
        errorsSince:
          "{{count}} errori irrisolti, {{occurrences}} occorrenze dal {{date}} (conteggio giornaliero da allora)",
      },
      open: {
        acquisition: "Report acquisizione",
        funnel: "Funnel",
        referrals: "Panoramica referral",
        revenue: "Report ricavi",
        usage: "Report uso AI",
        errors: "Log errori",
      },
      unavailable: "Impossibile caricare questa sezione.",
      asOf: "Dati delle {{time}}. In cache per un minuto.",
      loading: "Caricamento panoramica",
    },
    errors: {
      unauthorized: {
        title: "Accesso non effettuato",
        description: "Accedi come admin per vedere la panoramica.",
      },
      validation: {
        title: "Periodo non valido",
        description: "Controlla periodo e date.",
      },
      server: {
        title: "Panoramica non riuscita",
        description: "Impossibile calcolare la panoramica. Riprova.",
      },
      unknown: {
        title: "Errore imprevisto",
        description: "Qualcosa è andato storto durante il caricamento.",
      },
      network: {
        title: "Errore di rete",
        description: "Il server non è raggiungibile.",
      },
      forbidden: {
        title: "Solo admin",
        description: "Solo gli admin vedono la panoramica aziendale.",
      },
      notFound: {
        title: "Non trovato",
        description: "La panoramica non è disponibile.",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Salva o annulla prima le modifiche.",
      },
      conflict: {
        title: "Conflitto",
        description: "I dati sono cambiati durante il caricamento. Riprova.",
      },
    },
    success: {
      title: "Panoramica caricata",
      description: "Panoramica aziendale per il periodo scelto.",
    },
  },
};
