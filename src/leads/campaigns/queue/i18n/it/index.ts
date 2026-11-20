import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "La campagna Quese",
  description: "I risultati attualmente attivi nelle campagne di e-mail",
  enums: {
    campaignType: {
      leadCampaign: "Campagna di acquisizione contatti",
      newsletter: "Newsletter",
      signupNurture: "Nurture di iscrizione",
      retention: "Retenzione",
      winback: "Winback",
      transactional: "Transazione",
      notification: "Notifica",
      system: "Sistema"
    },
    campaignTypeFilter: {
      all: "Tutti"
    }
  },
  get: {
    title: "La campagna Quese",
    titleShort: "La campagna Quese",
    description: "Visualizza l'elenco delle piste attualmente in campagne e-mail",
    fields: {
      page: {
        label: "Pagina",
        description: "Numero di pagina"
      },
      pageSize: {
        label: "Dimensione della pagina",
        description: "Numero di record per pagina"
      },
      campaignType: {
        label: "Tipo di campagna",
        description: "Filtra per tipo di campagna"
      }
    },
    response: {
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
      items: "Articoli di queue"
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Devi essere connesso per visualizzare la coda della campagna"
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di visualizzare la coda della campagna"
      },
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore durante l'acquisizione della coda della campagna"
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto"
      },
      validation: {
        title: "Errore di convalida",
        description: "Parametri di ingresso non validi"
      }
    },
    success: {
      title: "Rilevamento di queue",
      description: "La coda della campagna recuperata con successo"
    }
  },
  widget: {
    title: "La campagna Quese",
    refresh: "Aggiorna",
    noData: "Nessuna coda di campagna",
    emptyDescription: "Qui vengono visualizzate e-mail di queued e la campagna attiva.",
    empty: "Nessun contatto trovato",
    columnEmail: "Email",
    columnBusiness: "Attività",
    columnType: "Tipo",
    columnStage: "Fase",
    columnVariant: "Variante",
    columnNext: "Prossima email",
    columnSent: "Inviata",
    columnOpen: "Aperta",
    columnClick: "Clic sul link",
    columnStarted: "Inizio",
    never: "Mai",
    pagination: "Pagina {{page}} di {{totalPages}} · {{total}} conduce"
  }
};
