import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Importazione dei dati",
  tags: {
    leads: "Contatti",
    management: "Gestione",
  },

  post: {
    title: "Stop Importa lavoro",
    titleShort: "Stop Importazione",
    description: "Smettere un lavoro di importazione in esecuzione",
    jobId: {
      label: "Lavoro ID",
      description:
        "Identificatore unico per il lavoro di importazione per arrestare",
    },
    form: {
      title: "Stop Importa lavoro",
      description: "Fermare il lavoro di importazione in esecuzione",
    },
    response: {
      title: "Stop Risultato",
      description: "Risultato dell'operazione di arresto",
      success: {
        content: "Stato di successo",
      },
      message: {
        content: "Stop al messaggio",
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Il lavoro fornito ID è invalido",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Autenticazione necessaria per fermare i lavori",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di fermare questo lavoro.",
      },
      notFound: {
        title: "Lavoro non trovato",
        description: "Nessun lavoro di importazione trovato con il fornito ID",
      },
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore durante l'arresto del lavoro",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile connettersi al server",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Smettere di Conflitto",
        description:
          "Non può fermare il lavoro che non è attualmente elaborazione",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Il lavoro di importazione si è fermato con successo",
    },
  },
  widget: {
    title: "Stop Importa lavoro",
    successMessage: "Lavoro interrotto con successo",
  },
};
