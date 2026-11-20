import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Information",
  get: {
    title: "Contenuto di Fetch URL",
    titleShort: "Tasso di carico URL",
    description:
      "Ottieni ed estrae il contenuto da qualsiasi URL, convertendolo in formato di markdown leggibile. Utilizzare questo quando è necessario leggere o analizzare il contenuto della pagina web.",
    form: {
      title: "Parametri di fetch URL",
      description: "Configurare URL per recuperare il contenuto da",
    },
    fields: {
      url: {
        title: "URL",
        description:
          "La URL completa per l'acquisizione (deve includere http:// o https://)",
        placeholder: "https://example.com",
      },
      query: {
        title: "Ricerca Query (opzionale)",
        description:
          "Filtro Regex applicato dopo l'ottenimento. Solo i paragrafi corrispondenti al modello vengono restituiti, ordinati per conteggio match, fino al limite del carattere. Omit per ottenere la pagina completa (sotto-verniciato se grande). Sintassi: qualsiasi regex JS - 'authentication', '(login|signup)', 'class\\s+\\w+'. Invalid regex rientra in corrispondenza letterale.",
        placeholder: "autenticazione",
      },
    },
    response: {
      message: {
        title: "Messaggio",
        description: "Messaggio di stato sull'operazione fetch",
      },
      content: {
        title: "Contenuti",
        description: "Il contenuto estratto in formato markdown",
      },
      truncated: {
        title: "Truncated",
        description:
          "Se il contenuto è stato troncato a causa della dimensione",
      },
      truncatedNote: {
        title: "Nota di Trucco",
        description: "Dettagli sulla tronca e come ottenere più contenuti",
      },
      url: {
        title: "Visualizza l'originale",
        description: "La URL che è stata catturata",
      },
      statusCode: {
        title: "Codice di stato",
        description: "Codice di stato HTTP della risposta",
      },
      timeElapsed: {
        title: "Tempo trascorso (ms)",
        description:
          "Il tempo necessario per recuperare il contenuto in millisecondi",
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "La URL non è valida o manca",
      },
      internal: {
        title: "Errore di arresto",
        description:
          "Si è verificato un errore durante l'acquisizione della URL",
        // Dedicated key: `title` doubles as the generic errorTypes label, so the
        // detail placeholder lives here instead of leaking into those labels.
        detail: "Errore di arresto: {{message}}",
      },
      notConfigured: {
        title:
          "La chiave {{label}} API non è configurata. Aggiungi {{envKey}} = <your-key> al tuo file.env. Ottieni la tua chiave a {{url}}",
        description: "Impostare {{label}} per recuperare le pagine web",
      },
      timeout: {
        title: "Tempo libero",
        description: "Il fetch URL è in tempo",
        detail:
          "E' stato arrestato {{url}}. La pagina può essere troppo lenta o non disponibile.",
      },
    },
    success: {
      title: "Risparmio di successo",
      description: "Il contenuto di URL è stato recuperato con successo",
      detail: "Preso {{url}}",
    },
  },
  tags: {
    scraping: "Scraping",
    web: "Web",
    content: "Contenuti",
  },
  cleanup: {
    post: {
      title: "URL Pulizie di Cache",
      titleShort: "URL Pulizie di Cache",
      description: "Eliminare i file di cache URL stale più vecchi di 7 giorni",
      container: {
        title: "Risultati di pulizia",
        description: "Riepilogo dei file cancellati della cache",
      },
      response: {
        deletedCount: "File eliminati",
        totalScanned: "Totale scannerizzato",
        retentionDays: "Giorni di detenzione",
      },
      success: {
        title: "Cache Cleaned",
        description: "I file di cache Stale URL sono stati rimossi",
      },
    },
    errors: {
      server: {
        title: "Errore di pulizia",
        description:
          "Si è verificato un errore durante la pulizia della cache URL",
      },
    },
    name: "URL Pulizie di Cache",
    description: "Pulizia settimanale dei file di cache fetch stale URL",
  },
};
