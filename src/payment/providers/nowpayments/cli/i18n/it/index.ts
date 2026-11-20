import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "NOWPayments CLI",
    titleShort: "NOWPayments",
    description: "Avviare il tunnel ngrok per NOWPayments webhook in avanti",
    category: "Pagamento",
    tags: {
      nowpayments: "NOWPayments",
      cli: "CLI",
      webhook: "Webhook",
    },
    form: {
      title: "Tunnel NOWPayments",
      description:
        "Avviare un tunnel ngrok per ricevere webhook NOWPayments localmente",
      fields: {
        port: {
          label: "Port",
          description: "Porto locale al tunnel (default: 3000)",
          placeholder: "3000",
        },
      },
    },
    errors: {
      notInstalled: {
        instructions:
          "Per installare ngrok:\n\n1. Visita https://ngrok.com/download\n2. Scarica ngrok per la tua piattaforma\n3. Estrarlo e spostarlo nel vostro PATH\n4. Esegui: ngrok authtoken YOUR_AUTH_TOKEN (prendi il tuo token a https://dashboard.ngrok.com/get-started/your-authtoken)\n\nOppure installarlo con un gestore di pacchetti:\n- macOS: installazione della birra ngrok/ngrok/ngrok\n- Linux: installazione rapida ngrok\n- Windows: choco install ngrok",
        title: "ngrok non installato",
        description:
          "ngrok è necessario per avviare il tunnel. Installarlo e riprovare.",
      },
      validationFailed: {
        title: "Errore di convalida",
        description: "Parametri non validi",
      },
      networkError: {
        title: "Errore di rete",
        description: "Collegamento di rete fallito",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso negato",
      },
      notFound: {
        title: "Non trovato",
        description: "Risorsa non trovata",
      },
      serverError: {
        noTunnelUrl: "Non poteva leggere il tunnel ngrok URL",
        title: "Errore del server",
        description: "Non ha avviato il tunnel",
      },
      unknownError: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
      conflict: {
        title: "Conflitto",
        description: "conflitto di risorse",
      },
    },
    success: {
      title: "Tunnel Iniziato",
      description: "Il tunnel di ngrok è in funzione",
    },
  },
};
