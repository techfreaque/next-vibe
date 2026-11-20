import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Sistema",
  tags: {
    remoteSync: "Sincronizzazione remota",
  },
  remoteEventBridge: {
    post: {
      title: "Ponte degli eventi remoto",
      titleShort: "Ponte degli eventi",
      description:
        "Ricevi e invia eventi peer remoti al gestore onRemoteEvent della rotta di destinazione. Chiamato via HTTP tramite coetanei di collegamento diretto o tramite inverso WS onRemoteEvent.",
      eventName: {
        label: "Nome dell'evento",
        description: "Il tipo di evento del cavo per elaborare",
      },
      leadId: {
        label: "ID del contatto",
        description: "IdentitÃ di cross-instance del peer invio",
      },
      originInstanceId: {
        label: "Dinanzi al Tribunale",
        description:
          "che ha emesso questo evento (per la prevenzione dell'eco)",
      },
      payload: {
        label: "Carico di pagamento",
        description:
          "Il carico di pagamento dell'evento raw trasmesso dall'istanza remota",
      },
      received: {
        label: "Ricevuto.",
        description: "Sia che l'evento sia stato accettato e elaborato",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Carico di pagamento dell'evento non valido",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        internal: {
          title: "Errore di elaborazione",
          description:
            "Si è verificato un errore durante l'elaborazione dell'evento",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Non hai il permesso di inviare eventi",
        },
        notFound: {
          title: "Non trovato",
          description: "Obiettivo non trovato",
        },
        network: {
          title: "Errore di rete",
          description:
            "Non poteva raggiungere il punto finale del ponte dell'evento",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        unsaved: {
          title: "Modifiche non salvate",
          description: "Ci sono cambiamenti non rilevati",
        },
        conflict: {
          title: "Conflitto",
          description: "Rilevato conflitto di eventi",
        },
      },
      success: {
        title: "Evento ricevuto",
        description: "Evento remoto elaborato con successo",
      },
    },
  },
};
