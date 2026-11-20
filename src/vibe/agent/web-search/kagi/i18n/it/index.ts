import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Information",
  get: {
    title: "Cerca con Kagi",
    titleShort: "Ricerca di Kagi",
    dynamicTitle: "Kagi: {{query}}",
    description:
      "Cerca su internet o ottieni risposte AI -powered utilizzando Kagi. La modalità FastGPT fornisce risposte complete con le fonti, mentre la modalità di ricerca restituisce risultati diretti.",
    form: {
      title: "Parametri di ricerca",
      description: "Configura la tua richiesta di ricerca Kagi",
    },
    submitButton: {
      label: "Cerca",
      loadingText: "Cercando...",
    },
    backButton: {
      label: "Indietro",
    },
    fields: {
      query: {
        title: "Ricerca di Query",
        description: "Domanda o domanda chiara e specifica di ricerca.",
        placeholder: "Inserisci la tua richiesta di ricerca...",
      },
      mode: {
        title: "Modalità di ricerca",
        description:
          "Scegliere tra AI -powered risposte (FastGPT) o risultati di ricerca diretti",
        options: {
          fastgpt: "FastGPT (risposte AI -powered)",
          search: "Ricerca (Risultati diretti)",
        },
      },
    },
    response: {
      success: {
        title: "Operazione riuscita",
        description: "Se la ricerca è stata di successo",
      },
      message: {
        title: "Messaggio",
        description: "Messaggio di stato sulla ricerca",
      },
      output: {
        title: "Risposta",
        description: "AI - risposta generata da FastGPT",
      },
      query: {
        title: "Query",
        description: "La query di ricerca che è stata eseguita",
      },
      references: {
        title: "Riferimenti",
        description: "Riferimenti e citazioni",
        reference: "Riferimento",
        item: {
          title: "Riferimento",
          description: "Riferimento sorgente con citazione",
          url: "URL",
          snippet: "Snippet",
        },
      },
      cached: {
        title: "Cached",
        description: "Se i risultati sono stati serviti dalla cache",
      },
      timestamp: {
        title: "Timestamp",
        description: "Quando la ricerca è stata eseguita",
      },
    },
    errors: {
      queryEmpty: {
        title: "La richiesta di ricerca è necessaria",
        description: "Si prega di fornire una query di ricerca",
      },
      queryTooLong: {
        title:
          "La query di ricerca è troppo lunga (caratteri massimo {{maxLength}})",
        description: "La query deve essere 400 caratteri o meno",
      },
      timeout: {
        title: "Ricerca richiesta time out",
        description: "La ricerca ha richiesto troppo tempo per completare",
      },
      searchFailed: {
        title: "Ricerca fallita",
        description: "Si è verificato un errore durante la ricerca",
      },
      validation: {
        title: "Ricerca non valida",
        description:
          "Si prega di controllare i parametri di ricerca e riprovare",
      },
      internal: {
        title: "Qualcosa di strano",
        description:
          "Non siamo riusciti a completare la tua ricerca. Per favore prova di nuovo",
      },
      notConfigured: {
        title:
          "La chiave {{label}} API non è configurata. Aggiungi {{envKey}} = <your-key> al tuo file.env. Ottieni la tua chiave a {{url}}",
        description: "Impostare {{label}} per abilitare la ricerca Kagi",
      },
    },
    success: {
      title: "Ricerca di successo",
      description: "La ricerca Kagi completata con successo",
    },
  },
  tags: {
    search: "Cerca",
    web: "Web",
    ai: "IA",
  },
};
