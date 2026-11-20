import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Logout utente",
  titleShort: "Esci",
  description:
    "Esegui il login dell'utente corrente e invalida la loro sessione",
  category: "Gestione utente",
  tag: "logout",
  logoutButton: "Esci",
  loggingOut: "- Ti stai chiedendo...",
  response: {
    title: "Risposta di logout",
    description: "Risposta che indica logout di successo",
    success: "Operazione riuscita",
    message: "Messaggio",
    sessionsCleaned: "Sessioni Pulite",
    nextSteps: "Consigliato i prossimi passi dopo la logout",
  },
  errors: {
    validation: {
      title: "Errore di convalida",
      description: "La richiesta logout contiene dati non validi",
    },
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Devi essere connesso a logout",
    },
    internal: {
      title: "Errore del server interno",
      description: "Si è verificato un errore interno durante l'esecuzione",
      detail: "Logout non riuscito: {{error}} (utente {{userId}})",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Un errore inaspettato si è verificato durante la logout",
    },
    session_deletion_failed: {
      title: "Cancellazione della sessione",
      description: "Non è stato possibile eliminare la sessione utente",
    },
    conflict: {
      title: "Conflitto di logout",
      description: "Un conflitto si è verificato durante la logout",
    },
    forbidden: {
      title: "Accesso negato",
      description: "L'azione di logout è vietata",
    },
    network_error: {
      title: "Errore di rete",
      description: "Errore di rete durante il logout",
    },
    not_found: {
      title: "Non trovato",
      description: "Sessione non trovata",
    },
    server_error: {
      title: "Errore del server",
      description: "Errore del server interno durante il logout",
    },
    unsaved_changes: {
      title: "Modifiche non salvate",
      description: "Ci sono cambiamenti non rilevati",
    },
    invalid_user: {
      title: "Utente non valido",
      description: "L'utente non è valido o non esiste",
    },
  },
  success: {
    title: "Logout Successivo",
    description: "Sei stato registrato con successo",
    message: "L'utente ha effettuato l'accesso con successo",
  },
};
