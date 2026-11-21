import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "La campagna Quese",
  description: "I risultati attualmente attivi nelle campagne di e-mail",
  enums: {
    delivery: {
      dueNow: "In scadenza ora",
      overdue: "In ritardo 24 h+",
      scheduled: "Pianificate",
      failed: "Fallite",
      sent: "Inviate",
      opened: "Inviate e aperte",
      clicked: "Inviate e cliccate",
      unsubscribed: "Disiscritti",
      bounced: "Rimbalzate",
    },
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
    campaignType: {
      leadCampaign: "Campagna di acquisizione contatti",
      newsletter: "Newsletter",
      signupNurture: "Nurture di iscrizione",
      retention: "Retenzione",
      winback: "Winback",
      transactional: "Transazione",
      notification: "Notifica",
      system: "Sistema",
    },
    campaignTypeFilter: {
      all: "Tutti",
    },
  },
  get: {
    title: "La campagna Quese",
    titleShort: "La campagna Quese",
    description:
      "Visualizza l'elenco delle piste attualmente in campagne e-mail",
    fields: {
      delivery: {
        label: "Stato email",
        description:
          "Lead con un'email in questo stato. Inviata, aperta, cliccata, disiscritta, rimbalzata e fallita usano la finestra di date",
        placeholder: "Qualsiasi stato",
      },
      journeyVariant: {
        label: "Variante di percorso",
        description: "Solo email di questo percorso",
        placeholder: "Qualsiasi percorso",
      },
      stage: {
        label: "Fase",
        description: "Solo email di questa fase",
        placeholder: "Qualsiasi fase",
      },
      locale: {
        label: "Lingua",
        description: "Locale renderizzata (de-DE) o lingua (de)",
        placeholder: "Qualsiasi lingua",
      },
      eventFrom: {
        label: "Dal",
        description: "Primo giorno della finestra eventi",
      },
      eventTo: {
        label: "Al",
        description: "Ultimo giorno della finestra eventi",
      },
      page: {
        label: "Pagina",
        description: "Numero di pagina",
      },
      pageSize: {
        label: "Dimensione della pagina",
        description: "Numero di record per pagina",
      },
      campaignType: {
        label: "Tipo di campagna",
        description: "Filtra per tipo di campagna",
      },
    },
    response: {
      daysOverdue: "Giorni di ritardo",
      nextSubject: "Argomento programmato",
      leadId: "ID del contatto",
      leadEmail: "Email",
      businessName: "Affari",
      campaignType: "Tipo di campagna",
      journeyVariant: "Variante di viaggio",
      currentStage: "Fase attuale",
      nextScheduledAt: "Prossimo email",
      emailsSent: "Inviato",
      emailsOpened: "Aperto",
      emailsClicked: "Cliccato",
      startedAt: "Iniziato a",
      total: "Totale",
      page: "Pagina",
      pageSize: "Dimensione della pagina",
      items: "Articoli di queue",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description:
          "Devi essere connesso per visualizzare la coda della campagna",
      },
      forbidden: {
        title: "Accesso negato",
        description:
          "Non hai il permesso di visualizzare la coda della campagna",
      },
      server: {
        title: "Errore del server",
        description:
          "Si è verificato un errore durante l'acquisizione della coda della campagna",
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
      title: "Rilevamento di queue",
      description: "La coda della campagna recuperata con successo",
    },
  },
  widget: {
    overdueDays: "In ritardo di {{days}} giorni, mai inviata",
    titleWithCount: "Coda campagne ({{count}})",
    eventWindow: "Eventi email dal {{from}} al {{to}}",
    title: "La campagna Quese",
    refresh: "Aggiorna",
    noData: "Nessuna coda di campagna",
    emptyDescription:
      "Qui vengono visualizzate e-mail di queued e la campagna attiva.",
    back: "Indietro",
    loading: "Caricamento della coda della campagna",
    selectedLead: "Guida selezionata",
    clearFilters: "Cancella filtri",
    leadEmpty: "Nessuna voce di coda per questo comando",
    firstPage: "Vai alla prima pagina",
    scheduledFor: "Programmato per {{date}}",
    noScheduledEmail: "Nessuna e-mail in programma",
    deliveryStats:
      "{{sent}} ha inviato · {{opened}} aperto · {{clicked}} cliccato",
    startedOn: "Iniziato {{date}}",
    openLead: "Apri la scheda del lead",
    openLeadNamed: "Open lead {{recipient}}",
    previous: "Precedente",
    next: "Avanti",
    pagination: "Pagina {{page}} di {{totalPages}} · {{total}} conduce",
  },
};
