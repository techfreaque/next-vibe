import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    source: {
      public: "Pubblico (ospiti)",
      usersFree: "Utenti gratis",
      paid: "A pagamento",
      gifted: "Regalati",
      internal: "Interni (admin)",
      unattributed: "Non attribuiti (storico)",
    },
  },
  post: {
    titleShort: "Utilizzo per fonte",
    title: "Crediti spesi per fonte",
    description:
      "Crediti spesi, divisi per chi li ha spesi e quali crediti hanno pagato: pubblico (ospiti), utenti gratis, a pagamento, regalati, interni, non attribuiti. La somma delle fonti dà la spesa totale.",
    fields: {
      resolution: {
        label: "Risoluzione",
        description: "Intervallo di calcolo",
      },
      range: { label: "Intervallo", description: "Periodo da interrogare" },
      lookback: {
        label: "Storico",
        description: "Barre extra prima dell'inizio dell'intervallo",
      },
      source: {
        label: "Fonte",
        description:
          "Quali crediti contare: ospiti pubblici, crediti gratis degli account registrati, a pagamento (abbonamento + pacchetti), regalati (assegnati da admin), interni (account admin) o storico non attribuito",
      },
      result: {
        label: "Crediti spesi",
        description: "Serie temporale in uscita",
      },
      meta: { label: "Meta", description: "Metadati di esecuzione del nodo" },
    },
    success: {
      title: "Crediti per fonte calcolati",
      description: "Serie dei crediti per fonte restituita",
    },
    errors: {
      unauthorized: {
        title: "Non autorizzato",
        description: "Autenticazione richiesta",
      },
      forbidden: { title: "Vietato", description: "Accesso admin richiesto" },
      server: { title: "Errore del server", description: "Query non riuscita" },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      validation: {
        title: "Validazione non riuscita",
        description: "Parametri della richiesta non validi",
      },
      notFound: { title: "Non trovato", description: "Non trovato" },
      conflict: { title: "Conflitto", description: "Conflitto" },
      network: {
        title: "Errore di rete",
        description: "Richiesta di rete non riuscita",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Salva prima le modifiche",
      },
    },
  },
};
