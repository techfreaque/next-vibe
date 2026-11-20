import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  get: {
    title: "Storia della versione del grafico",
    titleShort: "Versioni del grafico",
    description:
      "Ottieni la catena della versione per un grafico (passeggiata del fusto tramite parentVersionId)",
    fields: {
      id: { label: "Grafico ID", description: "UUID del grafico" },
      versions: {
        label: "Versioni",
        description:
          "Elenco Ordinato delle versioni di antenato (primo più vecchio)",
        id: { label: "Versione ID", description: "UUID della versione" },
        name: { label: "Nome", description: "Nome grafico in questa versione" },
        createdAt: {
          label: "Creato a",
          description: "Quando questa versione è stata creata",
        },
        isActive: {
          label: "Attivo",
          description: "Che si tratti della versione attualmente attiva",
        },
      },
    },
    success: {
      title: "Storia della versione caricata",
      description: "Versione catena recuperata con successo",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non è possibile accedere a questo grafico",
      },
      server: {
        title: "Errore del server",
        description: "Non caricare la cronologia delle versioni",
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
