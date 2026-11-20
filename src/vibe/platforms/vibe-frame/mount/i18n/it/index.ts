import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Sistema",
  tags: {
    vibeFrame: "Vibe Frame",
    embed: "Embed",
    widget: "Widget",
    config: "Configurazione",
  },
  post: {
    title: "Configurazione della cornice di Vibe",
    titleShort: "Vibe Frame",
    description:
      "Restituisce URL iframe per le integrazioni richieste. Il server legge i veri cookie auth (credentials: includere) e le mints token di scambio di breve durata in modo che non appaiono segreti negli URL.",
    container: {
      title: "Configurazione della cornice di Vibe",
      description: "Richiedi gli URL iframe per una o più integrazioni",
    },
    fields: {
      leadId: {
        label: "ID del contatto",
        description:
          "Il visitatore guida ID dalla pagina host (cross-origin - non può essere letto dai cookie)",
      },
      authToken: {
        label: "Auth Token",
        description:
          "Token auth JWT dalla sessione di pagina host (per widget autenticati)",
      },
      integrations: {
        label: "Integrazioni",
        description: "Elenco delle integrazioni da configurare",
      },
      integration: {
        label: "Integrazione",
        description: "Configurazione di integrazione singola",
      },
      id: {
        label: "Integrazione ID",
        description: "Unico identificatore per questa slot di integrazione",
        placeholder: "contact_POST",
      },
      endpoint: {
        label: "Punto di arrivo",
        description:
          "Override dell'identificatore di endpoint (defaults to id if not set)",
        placeholder: "contact_POST",
      },
      hasRendered: {
        label: "Ha reso",
        description:
          "Se questa integrazione è già montata, il server può saltarla",
      },
      theme: {
        label: "Tema",
        description: "Tema di colore per la cornice",
      },
      urlPathParams: {
        label: "Parametri per sentieri URL",
        description: "JSON - codificato parametri del percorso URL",
        placeholder: '{"id":"123"}',
      },
      data: {
        label: "Dati",
        description: "JSON - codificati dati pre-riempimento",
        placeholder: "{}",
      },
      widgets: {
        label: "Widgets",
        description: "Mappa dell'integrazione ID per widget config",
      },
      widget: {
        label: "Widget",
        description: "Widget config per un'integrazione",
      },
      frameId: {
        label: "Struttura ID",
        description: "Struttura unica ID per la comunicazione del ponte",
      },
      widgetUrl: {
        label: "Widget URL",
        description: "Iframe src URL con token di scambio",
      },
    },
    errors: {
      validation: {
        title: "Parametri non validi",
        description: "I parametri previsti sono invalidi",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso non consentito",
        description: "Non hai il permesso",
      },
      notFound: {
        title: "Endpoint non trovato",
        description: "Uno o più endpoint non esistono",
      },
      internal: {
        title: "Configenza fallita",
        description:
          "Si è verificato un errore durante la costruzione della risposta di configurazione",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      unsaved: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato un conflitto",
      },
    },
    repository: {
      invalidUrlPathParams: "Formato dei parametri del percorso URL non valido",
      invalidData: "Formato dei dati non valido",
      endpointNotFound: "Endpoint non trovato",
      configFailed: "Non riuscita a costruire frame config",
      tokenMintFailed: "Non riuscito a menta token di scambio",
    },
    success: {
      configured: {
        title: "Config pronto",
        description: "URL Iframe generati con successo",
      },
    },
  },
};
