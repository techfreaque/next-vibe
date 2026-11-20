import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestione contatti",
  tags: {
    leads: "Contatti",
    search: "Cerca"
  },
  get: {
    title: "Contatto di ricerca",
    titleShort: "Contatto di ricerca",
    description: "Ricerca con filtro e impaginazione",
    form: {
      title: "Modulo di ricerca contatti",
      description: "Inserisci i criteri di ricerca per trovare i lead"
    },
    search: {
      label: "Ricerca di Query",
      description: "Termine di ricerca per filtrare i cavi via e-mail, nome commerciale o note",
      placeholder: "Inserisci il termine di ricerca..."
    },
    status: {
      label: "Filtro di stato",
      description: "Filtro conduce per stato"
    },
    limit: {
      label: "Limiti di risultato",
      description: "Numero massimo di risultati da restituire (1-100)"
    },
    offset: {
      label: "Risultati Offset",
      description: "Numero di risultati per saltare per paginazione"
    },
    response: {
      title: "Risultati della ricerca",
      description: "Risultati di ricerca con i dati di contatto",
      leads: {
        title: "Contatti",
        item: "Contatto"
      },
      total: "Risultati totali",
      hasMore: "Ha più risultati"
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Autenticazione necessaria per la ricerca dei cavi"
      },
      validation: {
        title: "Errore di convalida",
        description: "Parametri di ricerca non validi forniti"
      },
      server: {
        title: "Errore del server",
        description: "Errore del server interno si è verificato durante la ricerca di cavi"
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Un errore sconosciuto si è verificato durante la ricerca conduce"
      },
      network: {
        title: "Errore di rete",
        description: "Errore di rete si è verificato durante la ricerca conduce"
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso vietato per la ricerca di contatto"
      },
      notFound: {
        title: "Nessun risultato",
        description: "Nessun indizi trovato corrispondenti ai criteri di ricerca"
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono modifiche non salvate nel modulo di ricerca"
      },
      conflict: {
        title: "Conflitto",
        description: "Il conflitto di dati si è verificato durante la ricerca conduce"
      }
    },
    success: {
      title: "Ricerca completa",
      description: "Ricerca di contatto completata con successo"
    }
  },
  widget: {
    title: "Contatto di ricerca",
    filterLabel: "Filtro:",
    clearFilter: "Azzera",
    noResultsTitle: "Nessun risultato",
    noResultsSubtitle: "Ricerca per e-mail, nome commerciale o telefono",
    createLead: "Crea contatto",
    noLeadsMatchFilter: "Nessun cavo corrisponde ai filtri selezionati.",
    clearFilters: "Cancella filtri",
    loadMore: "Caricare più",
    openRateSuffix: "% aperto",
    noEmails: "nessuna email",
    converted: "Convertito",
    emailsSentSuffix: "inviato",
    copyEmailTitle: "Copia e-mail",
    editLeadTitle: "Modificare il comando",
    deleteLeadTitle: "Elimina il contatto",
    statusNew: "Nuovo",
    statusPending: "Finanziamenti",
    statusCampaign: "Campagna",
    statusWebUser: "Utente web",
    statusNewsletter: "Newsletter",
    statusInContact: "In contatto",
    statusSignedUp: "Firmato",
    statusSubscribed: "Iscritto",
    statusUnsub: "Soggetto",
    statusBounced: "Bounce",
    statusInvalid: "Non valido"
  },
  enums: {
    leadStatus: {
      new: "Nuovo",
      pending: "Finanziamenti",
      campaignRunning: "Campagna in corso",
      websiteUser: "Utente del Sito",
      newsletterSubscriber: "Iscriviti alla newsletter",
      inContact: "In contatto",
      signedUp: "Firmato",
      subscriptionConfirmed: "Abbonamento Confermato",
      unsubscribed: "Iscrizione annullata",
      bounced: "Bounce",
      invalid: "Non valido"
    }
  }
};
