import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Importazione dei dati",
  tags: {
    leads: "Contatti",
    management: "Gestione",
  },

  post: {
    title: "Retry Importa lavoro",
    titleShort: "Importazione di rifornimenti",
    description: "Recuperare un lavoro di importazione fallito",
    jobId: {
      label: "Lavoro ID",
      description:
        "Identificatore unico per il lavoro di importazione da riprovare",
    },
    form: {
      title: "Retry Importa lavoro",
      description: "Recuperare il lavoro di importazione fallito",
    },
    response: {
      title: "Risultato della ricerca",
      description: "Risultato dell'operazione di riprovazione",
      success: {
        content: "Stato di successo",
      },
      message: {
        content: "Messaggio di riprovazione",
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Il lavoro fornito ID è invalido",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Autenticazione richiesta per riprovare i lavori",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di riprovare questo lavoro.",
      },
      notFound: {
        title: "Lavoro non trovato",
        description: "Nessun lavoro di importazione trovato con il fornito ID",
      },
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore durante la riprova del lavoro",
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
        title: "Conflitto di riprovazione",
        description:
          "Non si può riprovare il lavoro che attualmente sta elaborando",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Importare il lavoro retribuito con successo",
    },
  },
  widget: {
    title: "Retry Importa lavoro",
    successMessage: "Ricerca di lavoro avviata con successo",
  },
};
