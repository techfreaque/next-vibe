import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Account",
  get: {
    title: "Esportare i miei dati",
    titleShort: "Esportazione dei dati",
    description:
      "Scarica tutto quello che abbiamo su di te: profilo, chat, ricordi, competenze, crediti, rinvii, newsletter, indirizzi. JSON più un riepilogo leggibile.",
    tags: { export: "Esportazione dei dati" },
    response: {
      json: { title: "Dati completi (JSON)" },
      jsonFilename: { title: "Nome file JSON" },
      markdown: { title: "Riepilogo (Markdown)" },
      markdownFilename: { title: "Riepilogo nome del file" },
    },
    success: {
      title: "Esportazione pronta",
      description: "Il tuo archivio dati è stato generato",
    },
    md: {
      heading: "Esportazione dei dati",
      generated: "Generazione",
      account: "Account",
      email: "Email",
      name: "Nome",
      memberSince: "Membro dal",
      contents: "Contenuto",
      records: "record",
      note: "I dettagli completi sono nel file JSON. Questa esportazione contiene solo i dati legati al tuo account.",
    },
    widget: {
      intro:
        "Ottieni una copia dei tuoi dati. Ricevete un file JSON completo e un riepilogo Markdown leggibile. Solo i tuoi dati sono inclusi.",
      downloadJson: "Scarica JSON",
      downloadMarkdown: "Riepilogo del download",
      generate: "Preparare l'esportazione",
      preparing: "Preparare...",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Richiesta non valida",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per esportare i tuoi dati",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non è possibile esportare questi dati",
      },
      notFound: {
        title: "Non trovato",
        description: "Account non trovato",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      server: {
        title: "Esportazione fallita",
        description:
          "Non potevamo generare la vostra esportazione. Riprova più tardi.",
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
        description: "Si è verificato un conflitto",
      },
    },
  },
};
