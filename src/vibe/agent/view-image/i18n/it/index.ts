import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Visualizza immagine",
    titleShort: "Visualizza immagine",
    description:
      "Prenda e visualizza un'immagine precedentemente catturata dal suo storage URL. Utilizzare questo per riesaminare uno screenshot o un'immagine da una volta precedente.",
    dynamicTitle: "Visualizza: {{url}}",
    url: {
      label: "Immagine URL",
      description: "Archiviazione URL dell'immagine da visualizzare",
      placeholder: "https://...",
    },
    response: {
      url: "Immagine URL",
    },
    errors: {
      validation_failed: {
        title: "Errore di convalida",
        description: "La condizione URL è invalida",
      },
      network_error: {
        title: "Errore di rete",
        description: "Non è riuscito a catturare l'immagine",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato a visualizzare questa immagine",
      },
      forbidden: {
        title: "Accesso negato",
        description: "L'accesso a questa immagine è vietato",
      },
      not_found: {
        title: "Immagine non trovata",
        description: "Nessuna immagine è stata trovata al fornito URL",
      },
      server_error: {
        title: "Errore del server",
        description: "Si è verificato un errore del server interno",
      },
      unknown_error: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsaved_changes: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato un conflitto",
      },
    },
    success: {
      title: "Immagine caricata",
      description: "L'immagine è stata recuperata con successo",
    },
  },
  tags: {
    vision: "Visione",
    ai: "IA",
  },
};
