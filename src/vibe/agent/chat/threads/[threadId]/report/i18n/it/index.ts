import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    moderation: "Moderazione",
  },
  post: {
    title: "Contenuto della relazione",
    titleShort: "Relazione",
    description:
      "Segnala un post pubblico o un thread condiviso. Rapporti da abbastanza persone lo nascondono fino a quando un amministratore lo valuta.",
    reason: {
      label: "Motivazione",
      description: "Cosa c'è di sbagliato in questo contenuto?",
    },
    note: {
      label: "Dettagli",
      description: "Facoltativo. Aggiungi contesto per il recensore.",
      placeholder: "Cosa dovrebbe sapere il recensore?",
    },
    reasons: {
      spam: "Spam",
      illegal: "Contenuto illegale",
      abuse: "Abuso o molestie",
      csamFlag: "Sicurezza dei bambini",
      other: "Altro",
    },
    messageId: {
      label: "Messaggio ID",
      description: "Messaggio specifico da segnalare (facoltativo)",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Scegli un motivo",
      },
      network: {
        title: "Errore di rete",
        description: "Impossibile connettersi al server",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non puoi segnalare questo contenuto",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non puoi segnalare i tuoi contenuti",
      },
      notFound: {
        title: "Non trovato",
        description: "Questo contenuto è andato o non disponibile",
      },
      server: {
        title: "Errore del server",
        description: "Il tuo rapporto non potrebbe essere presentato",
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
        title: "Già segnalato",
        description: "Hai già segnalato questo contenuto",
      },
      rateLimited: {
        title: "Troppi rapporti",
        description: "Stai segnalando troppo in fretta. Riprova più tardi.",
      },
    },
    success: {
      title: "Relazione inserita",
      description: "Grazie. Rivediamo ogni rapporto.",
    },
    response: {
      reported: { content: "Relazione" },
      reportCount: { content: "Relazione" },
      hidden: { content: "Nascosto" },
    },
    backButton: {
      label: "Indietro",
    },
    button: {
      submit: "Invia la relazione",
      loading: "Invio in corso...",
    },
  },
};
