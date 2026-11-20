import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Promuovere il sistema",
    titleShort: "Promuovere il grafico",
    description:
      "Promuovere un grafico di amministrazione a proprietà del sistema (solo lettura, condiviso)",
    fields: {
      id: { label: "Grafico ID", description: "UUID del grafico" },
    },
    response: {
      promotedId: "Grafico ID",
    },
    widget: {
      confirmDescription:
        "Promuovere questo grafico lo renderà di proprietà del sistema e condiviso con tutti gli utenti. La versione di sistema corrente per questa slug sarà disattivata. Questo può essere invertito promuovendo una versione diversa.",
      promotedIdLabel: "ID:",
      viewButton: "Vista",
    },
    success: {
      title: "Grafio promosso",
      description: "Grafico promosso a sistema con successo",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso all'amministratore richiesto",
      },
      server: {
        title: "Errore del server",
        description: "Non è riuscito a promuovere il grafico",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      validation: {
        title: "Convalida fallita",
        description: "Parametri non validi",
      },
      notFound: {
        title: "Account o sessione non trovati",
        description: "Grafico non trovato",
      },
      conflict: { title: "Conflitto", description: "conflitto di risorse" },
      network: {
        title: "Errore di rete",
        description: "La richiesta di rete è fallita",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Salvare le modifiche prima",
      },
    },
  },
};
