import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/it";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  title: "Prestazioni campagne",
  description:
    "Le email di campagna partono, cosa è bloccato in coda e come rende ogni percorso",
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
    emailJourneyVariant: {
      uncensoredConvert: "Conversione ai modelli senza censura",
      sideHustle: "Hustle laterali",
      quietRecommendation: "Raccomandazioni silenziose",
      signupNurture: "Nurture di iscrizione",
      retention: "Retenzione",
      winback: "Winback",
      newsletterMay2026: "Newsletter maggio 2026",
      newsletterNov2026: "Newsletter Novembre 2026",
    },
    emailCampaignStageFilter: {
      all: "Tutti",
    },
    emailCampaignStage: {
      notStarted: "Non iniziato",
      initial: "Contatto iniziale",
      followup1: "Seguito 1",
      followup2: "Seguito 2",
      followup3: "Seguito 3",
      nurture: "Nurture",
      reactivation: "Riattivazione",
    },
  },
  get: {
    title: "Prestazioni campagne",
    titleShort: "Campagne",
    description:
      "Stato del motore, salute della coda e rendimento delle email nel tempo: inviate, aperte, cliccate, disiscrizioni, rimbalzi ed errori per variante di percorso, fase e lingua. Ogni numero apre i lead corrispondenti.",
    fields: {
      journeyVariant: {
        label: "Variante di percorso",
        description: "Solo questo percorso email",
        placeholder: "Qualsiasi percorso",
      },
      stage: {
        label: "Fase",
        description: "Solo email di questa fase della campagna",
        placeholder: "Qualsiasi fase",
      },
      locale: {
        label: "Lingua",
        description: "Locale renderizzata (de-DE) o lingua (de)",
        placeholder: "Qualsiasi lingua",
      },
    },
    response: {
      variantTrend: "Inviate per percorso",
      window: "Periodo",
      engine: "Stato del motore",
      queue: "Salute della coda",
      kpis: "Indicatori",
      totals: "Totali",
      trend: "Inviate, aperte, cliccate",
      problems: "Errori, rimbalzi, disiscrizioni",
      funnel: "Funnel email",
      byVariant: "Per variante di percorso",
      byStage: "Per fase",
      byLocale: "Per lingua",
      topErrors: "Errori di invio principali",
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
    groups: {
      now: "Adesso",
      period: "Nel periodo scelto",
    },
    stuck: "Mai inviata",
    title: "Prestazioni campagne",
    loading: "Caricamento numeri campagne...",
    filters: "Filtri",
    openQueue: "Apri coda",
    empty: "Nessun invio in questo periodo.",
    emptySendingOff:
      "Nessun invio in questo periodo. L'invio è spento, vedi sopra.",
    noProblems: "Nessun errore, rimbalzo o disiscrizione in questo periodo.",
    noErrors: "Nessun errore di invio in questo periodo.",
    sentNoteOff: "Zero invii qui significa motore spento, non zero interesse.",
    errors: {
      duplicate: "Saltata: destinatario duplicato",
      statusChange: "Saltata: il lead ora è {{status}}",
    },
    engine: {
      starterOff:
        "Anche campaign-starter è spento: nessun nuovo lead entra nei percorsi.",
      otherPath:
        "Questi sono arrivati da un'altra via (invio massivo o esecuzione manuale), non dal dispatcher.",
      openDispatcher: "Apri impostazioni dispatcher",
      neverSent: "Nessuna email di campagna è mai stata inviata.",
      lastSend: "Ultimo invio {{when}}. Inviate nelle ultime 24 h: {{count}}.",
      offTitle: "Invio spento",
      failingTitle: "Il dispatcher fallisce ({{count}} esecuzioni di fila)",
      onTitle: "Invio attivo",
      missing:
        "Il dispatcher email-campaigns non ha una pianificazione cron. {{count}} email in scadenza restano in coda e non partiranno finché non viene pianificato.",
      disabled:
        "Il dispatcher email-campaigns è disattivato. {{count}} email in scadenza aspettano in coda.",
      on: "Ultima esecuzione {{last}}, prossima {{next}}.",
      noError: "Nessun messaggio di errore registrato.",
      openDue: "Mostra {{count}} lead",
      state: {
        missing: "non pianificato",
        disabled: "disattivato",
        failing: "in errore",
        running: "attivo",
      },
    },
    queue: {
      oldestBiggest:
        "{{emails}} lead. Arretrato maggiore: {{journey}} ({{count}} email)",
      stuckClaims: "Prenotazioni di invio bloccate",
      stuckClaimsHint: "Prenotate da oltre 1 h, mai confermate",
      stuckDaysHint: "In scadenza dal {{when}}",
      stuckDays: "Più vecchia in scadenza, giorni",
      nothingScheduled: "Niente pianificato",
      dueNow: "Email in scadenza",
      oldest: "{{emails}} lead in attesa",
      nothingDue: "Niente in attesa",
      scheduled: "Pianificate per dopo",
      scheduledHint: "{{count}} nelle prossime 24 h, prossima {{when}}",
    },
    kpi: {
      bouncedOff:
        "bounce-processor è spento: rimbalzi forse sottostimati. {{rate}} delle inviate",
      ofSentRate: "{{rate}} delle inviate",
      skippedHint: "Duplicati e cambi di stato non conteggiati: {{count}}",
      sent: "Inviate",
      openRate: "Tasso di apertura",
      clickRate: "Tasso di clic",
      ofSent: "{{count}} delle email inviate",
      unsubscribed: "Disiscritti",
      bounced: "Rimbalzate",
      failed: "Errori di invio nel periodo",
    },
    series: {
      sent: "Inviate",
      opened: "Aperte",
      clicked: "Cliccate",
      failed: "Errori di invio",
      bounced: "Rimbalzate",
      unsubscribed: "Disiscritti",
    },
    charts: {
      errorsHint:
        "Solo errori reali. Duplicati e cambi di stato nascosti: {{count}}",
      variantTrendHint:
        "Email inviate per intervallo, per variante di percorso",
      variantTrend: "Inviate per percorso",
      trend: "Inviate, aperte, cliccate",
      trendHint:
        "Per giorno di invio: email inviate e quante sono state poi aperte o cliccate. Clicca un giorno per quei lead.",
      problems: "Problemi",
      problemsHint: "Invii falliti, rimbalzi e disiscrizioni per intervallo",
      funnel: "Funnel email",
      funnelHint:
        "Email inviate nel periodo e cosa ne hanno fatto i destinatari",
      byVariant: "Per variante di percorso",
      byVariantHint: "Inviate nel periodo. In scadenza = in coda ora.",
      byStage: "Per fase",
      byLocale: "Per lingua",
      errors: "Errori di invio",
    },
    columns: {
      failed: "Errori di invio",
      sent: "Inviate",
      openRate: "Aper.",
      clickRate: "Clic",
      unsubscribed: "Disis.",
      bounced: "Rimb.",
      due: "Email in scadenza",
      variant: "Percorso",
      stage: "Fase",
      locale: "Lingua",
      error: "Errore",
      count: "Numero",
    },
    definitions:
      "Tassi di apertura e clic contano le email inviate nel periodo aperte o cliccate in qualsiasi momento. In scadenza = in attesa e pianificate nel passato: le invia solo il dispatcher email-campaigns. Lingua = locale renderizzata, altrimenti lingua e paese del lead.",
  },
};
