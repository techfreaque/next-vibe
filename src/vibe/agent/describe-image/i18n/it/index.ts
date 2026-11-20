import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    image: "Immagine",
    vision: "Visione",
    ai: "IA",
  },
  post: {
    title: "Descrivere l'immagine",
    titleShort: "Descrivere l'immagine",
    dynamicTitle: "Descrivi: {{filename}}",
    description:
      "Descrivere il contenuto di un'immagine utilizzando un modello AI vision",
    fileUrl: {
      label: "Immagine URL",
      description: "URL dell'immagine per descrivere",
    },
    context: {
      label: "Contesto",
      description: "contesto opzionale per guidare la descrizione",
      placeholder: "Descrivi questa immagine concentrandosi su...",
    },
    submitButton: {
      label: "Descrivere l'immagine",
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
        description: "Si prega di fornire un'immagine valida URL",
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
        description: "L'immagine non è stata trovata",
      },
      server_error: {
        title: "Errore del server",
        description:
          "Un errore inaspettato si è verificato durante la descrizione dell'immagine",
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
      noVisionModel: "Nessun modello di visione dell'immagine è configurato",
      descriptionFailed: "Non descritto l'immagine: {{error}}",
      insufficientCredits:
        "Crediti insufficienti. Saldo: {{balance}}, minimo richiesto: {{minimum}}.",
      balanceCheckFailed: "Non è riuscito a controllare il saldo di credito",
      creditsFailed: "Non è riuscito a dedurre i crediti",
    },
    success: {
      title: "Immagine Descritto",
      description: "L'immagine è stata descritta con successo",
    },
  },
};
