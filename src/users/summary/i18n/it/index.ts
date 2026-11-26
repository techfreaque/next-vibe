import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    validation: {
      title: "Richiesta statistiche non valide",
      description: "Controllare la finestra e le date",
    },
    unauthorized: {
      title: "Accedi per continuare",
      description: "Accedi per visualizzare le statistiche",
    },
    forbidden: {
      title: "Admins solo",
      description:
        "Hai bisogno del ruolo di amministratore per visualizzare le statistiche",
    },
    notFound: {
      title: "Nessun dato",
      description: "Niente da segnalare per questa finestra",
    },
    server: {
      title: "Non poteva calcolare le statistiche",
      description:
        "Il server non è riuscito a calcolare le statistiche degli utenti",
    },
    network: {
      title: "Errore di rete",
      description: "Non è possibile raggiungere il server",
    },
    unknown: {
      title: "Errore inaspettato",
      description: "Qualcosa è andato storto calcolo statistiche",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Hai modifiche non salvate",
    },
    conflict: {
      title: "Conflitto",
      description: "La richiesta è in conflitto con i dati attuali",
    },
  },
  title: "Riepilogo account",
  description:
    "Controlli le nuove iscrizioni e la verifica degli indirizzi email dei clienti. Sono esclusi gli account del personale e di prova.",
  accounts: "Account clienti",
  signups: "Nuovi in 7 giorni",
  verified: "Email verificata",
  unverified: "Email da verificare",
  reviewUnverified: "Nuovi account da verificare ({{count}})",
  attention: "Da verificare",
  clear: "Tutti i nuovi account hanno un indirizzo email verificato.",
  unavailable: "Stato della verifica non disponibile.",
  recent: "Attività recente",
  loading: "Caricamento del riepilogo…",
};
