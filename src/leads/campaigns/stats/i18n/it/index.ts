import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Statistiche campagne",
  description: "Statistiche delle prestazioni della campagna e-mail",
  enums: {
    emailJourneyVariantFilter: {
      all: "Tutti",
      uncensoredConvert: "Conversione ai modelli senza censura",
      sideHustle: "Hustle laterali",
      quietRecommendation: "Raccomandazioni silenziose",
      signupNurture: "Nurture di iscrizione",
      retention: "Retenzione",
      winback: "Winback",
      newsletterMay2026: "Newsletter maggio 2026",
      newsletterNov2026: "Newsletter Novembre 2026",
    },
  },
  get: {
    title: "Statistiche campagne",
    titleShort: "Statistiche campagne",
    description:
      "Recuperare le statistiche delle prestazioni della campagna email",
    container: {
      title: "Filtri",
      description: "Statistiche della campagna di filtrazione",
    },
    fields: {
      journeyVariant: {
        label: "Variante di viaggio",
        description: "Filtra per e-mail variante del viaggio",
      },
    },
    response: {
      total: "Totale campagne",
      pending: "Finanziamenti",
      sent: "Inviato",
      delivered: "Consegnato",
      opened: "Aperto",
      clicked: "Cliccato",
      failed: "Sfigato",
      openRate: "Tasso di apertura",
      clickRate: "Tasso di click-through",
      deliveryRate: "Tasso di consegna",
      failureRate: "Tasso di insolvenza",
      byStage: "Per tappa",
      byJourneyVariant: "Variante di viaggio",
      byStatus: "Per stato",
      totalLeads: "Totale dei cavi",
      linkedLeadsCount: "Supporti collegati",
      uniquePersonsEstimate: "Persone uniche (est.)",
      pendingLeadsCount: "Guida attiva nelle campagne",
      emailsScheduledToday: "E-mail programmate oggi",
      quotaProgress: "Progressi dei contingenti settimanali",
      campaignTasks: "Compiti della campagna",
      alerts: "Avvisi",
      taskStats: "Statistiche dell'impresa",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description:
          "Devi essere connesso per visualizzare le statistiche della campagna",
      },
      forbidden: {
        title: "Accesso negato",
        description:
          "Non hai il permesso di visualizzare le statistiche della campagna",
      },
      server: {
        title: "Errore del server",
        description:
          "Si è verificato un errore durante l'acquisizione di statistiche della campagna",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      validation: {
        title: "Errore di convalida",
        description: "Parametri di ingresso non validi",
      },
    },
    success: {
      title: "Stats recuperato",
      description: "Statistiche della campagna recuperate con successo",
    },
  },
  widget: {
    title: "Prestazioni della campagna",
    refresh: "Aggiorna",
    noData: "Nessun dato di campagna ancora",
    openRateSuffix: "% aperto",
    clickRateSuffix: "% CTR",
    stageLabel: "Imbuto di fase",
    statusLabel: "Invia lo stato",
    variantLabel: "In viaggio",
    emDash: ", ",
    leadOverview: "Panoramica dei lead",
    totalLeads: "Totale dei cavi",
    linkedLeadsCount: "Supporti collegati",
    uniquePersonsEstimate: "Persone uniche (est.)",
    uniquePersonsTooltip:
      "Contatto meno cavi collegati secondari (molti duplicati)",
    activeCampaigns: "Campagne attive",
    sendPerformance: "Inviare le prestazioni",
    perRunBudget:
      "~ {{perRunBudget}} /run · {{totalRunsPerWeek}} corre/settimana",
    perRunBudgetZero: "0/run - aumentare la quota o ridurre la frequenza",
    accumulator: "successivo vantaggio: {{pct}} %",
    cronHealth: {
      title: "Cron Salute",
      healthy: "Salute",
      warning: "Avvertenza",
      critical: "Critica",
      enabled: "abilitata",
      failed24h: "guasto (24h)",
      lastRun: "Ultimo giro",
      nextRun: "Prossima corsa",
      never: "Mai.",
      runNow: "Avvia ora",
      alerts: "Avvisi",
      alertFailures: "fallimenti consecutivi",
      empty: "Nessuna attività di campagna configurata",
      status: {
        running: "Esecuzione",
        completed: "Completo",
        failed: "Sfigato",
        error: "Errore",
        timeout: "Timeout",
        pending: "Finanziamenti",
        scheduled: "Programmato",
        cancelled: "Annullamento",
        unknown: "Sconosciuto",
      },
    },
  },
};
