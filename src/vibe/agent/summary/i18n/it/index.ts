import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      network: {
        title: "Errore di rete",
        description: "Impossibile connettersi al server",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description:
          "Devi essere connesso per accedere alle competenze personalizzate",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di accedere a questa risorsa",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      server: {
        title: "Errore del server",
        description:
          "Si è verificato un errore durante il recupero delle competenze",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description: "Un conflitto si è verificato con lo stato attuale",
      },
    },
  },
  title: "Attività IA",
  description:
    "Consulti il catalogo modelli e le conversazioni avviate negli ultimi sette giorni.",
  models: "Modelli a catalogo",
  providers: "Fornitori di modelli",
  skills: "Competenze della community pubblicate",
  conversations: "Nuove conversazioni",
  reported: "Competenze segnalate",
  attention: "Da verificare",
  clear: "Nessuna competenza segnalata.",
  unavailable: "Stato della moderazione non disponibile.",
  recent: "Attività recente",
  loading: "Caricamento attività IA…",
  failed: "Impossibile caricare l’attività IA.",
};
