import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    find_failed:
      "Impossibile trovare i ruoli dell’utente {{userId}}: {{error}}",
    batch_find_failed:
      "Impossibile trovare i ruoli di {{count}} utenti in blocco: {{error}}",
    not_found: "Ruolo {{role}} non trovato per l’utente {{userId}}",
    lookup_failed:
      "Impossibile cercare il ruolo {{role}} per l’utente {{userId}}: {{error}}",
    add_failed:
      "Impossibile assegnare il ruolo {{role}} all’utente {{userId}}: {{error}}",
    no_data_returned: "Il database non ha restituito dati",
    remove_failed:
      "Impossibile rimuovere il ruolo {{role}} dall’utente {{userId}}: {{error}}",
    check_failed:
      "Impossibile verificare il ruolo {{role}} dell’utente {{userId}}: {{error}}",
    delete_failed:
      "Impossibile eliminare i ruoli dell’utente {{userId}}: {{error}}",
    endpoint_not_created:
      "L’endpoint per i ruoli utente non è ancora disponibile",
  },
  post: {
    title: "Ruoli utente",
    description: "Endpoint dei ruoli utente",
    form: {
      title: "Configurazione dei ruoli utente",
      description: "Imposta i parametri dei ruoli utente",
    },
    response: {
      title: "Risposta",
      description: "Dati restituiti per i ruoli utente",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore interno del server",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso non consentito",
      },
      notFound: {
        title: "Non trovato",
        description: "Risorsa non trovata",
      },
      conflict: {
        title: "Conflitto",
        description: "I dati sono in conflitto",
      },
      database_connection_failed: {
        title: "Connessione al database fallita",
        description: "Impossibile connettersi al database",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Operazione completata",
    },
  },
  enums: {
    userRole: {
      public: "Pubblico",
      customer: "Cliente",
      partnerAdmin: "Amministratore partner",
      partnerEmployee: "Collaboratore partner",
      admin: "Amministratore",
      cliOff: "CLI disattivata",
      cliAuthBypass: "CLI senza autenticazione",
      aiToolOff: "Strumento IA disattivato",
      webOff: "Web disattivato",
      mcpOff: "MCP disattivato",
      mcpVisible: "Visibile in MCP",
      cronAllowed: "Consentito in cron",
      productionOff: "Disattivato in produzione",
      skillOff: "Skill disattivata",
    },
  },
};
