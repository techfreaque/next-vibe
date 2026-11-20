import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    video: "Video",
    vision: "Visione",
    ai: "IA",
  },
  post: {
    title: "Descrivere il video",
    titleShort: "Descrivere il video",
    dynamicTitle: "Descrivi: {{filename}}",
    description:
      "Descrivere il contenuto di un video utilizzando un modello AI vision",
    fileUrl: {
      label: "Video di URL",
      description: "URL del video per descrivere",
    },
    context: {
      label: "Contesto",
      description: "contesto opzionale per guidare la descrizione",
      placeholder: "Descrivi questo video incentrato su...",
    },
    submitButton: {
      label: "Descrivere il video",
      loadingText: "Descrittura...",
    },
    response: {
      text: "Designazione",
      model: "Modello usato",
      creditCost: "Crediti utilizzati",
    },
    errors: {
      validation_failed: {
        title: "Errore di convalida",
        description: "Si prega di fornire un video valido URL",
      },
      network_error: {
        title: "Errore di rete",
        description: "Non è riuscito a connettersi al servizio di visione",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Si prega di firmare per utilizzare questa funzione",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di usare questa funzione",
      },
      not_found: {
        title: "Non trovato",
        description: "Il video non è stato trovato",
      },
      server_error: {
        title: "Errore del server",
        description:
          "Un errore inaspettato si è verificato durante la descrizione video",
      },
      unknown_error: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      unsaved_changes: {
        title: "Modifiche non salvate",
        description: "Si prega di salvare le modifiche prima di descrivere",
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato un conflitto",
      },
      noVisionModel: "Nessun modello di visione video è configurato",
      descriptionFailed: "Non descritto il video: {{error}}",
      insufficientCredits:
        "Crediti insufficienti. Saldo: {{balance}}, minimo richiesto: {{minimum}}.",
      balanceCheckFailed: "Non è riuscito a controllare il saldo di credito",
      creditsFailed: "Non è riuscito a dedurre i crediti",
    },
    success: {
      title: "Video Descritto",
      description: "Il video è stato descritto con successo",
    },
  },
};
