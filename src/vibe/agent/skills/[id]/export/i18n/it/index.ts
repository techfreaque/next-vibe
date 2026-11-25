import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Strumenti AI",
  tags: {
    skills: "competenze",
  },
  get: {
    title: "Esporta scheda personaggio",
    titleShort: "Esporta scheda",
    description:
      "Esporta una skill come scheda personaggio V2 in formato JSON. Importala in SillyTavern, RisuAI, Chub o qualsiasi app in formato Tavern, oppure tienila come backup. Funziona per le tue skill, le skill pubbliche della community e le skill integrate pubbliche. La scheda cita l'autore e rimanda alla pagina della skill.",
    dynamicTitle: "Esporta: {{name}}",
    id: {
      label: "Skill",
      description: "La skill da esportare",
    },
    widget: {
      intro:
        "Il tuo personaggio, in un file che è tuo. Scheda personaggio V2, il formato che SillyTavern, RisuAI e Chub importano.",
      included:
        "Contiene: nome, prompt completo del personaggio, tagline, descrizione, autore e un link a questa pagina.",
      download: "Scarica scheda",
      copy: "Copia JSON",
      copied: "Copiato",
    },
    card: {
      skillPage: "Pagina della skill: {{url}}",
    },
    response: {
      name: { content: "Nome" },
      fileName: { content: "Nome file" },
      card: { content: "JSON della scheda" },
    },
    errors: {
      validation: {
        title: "Richiesta non valida",
        description: "Controlla l'ID della skill.",
      },
      network: {
        title: "Errore di rete",
        description: "Impossibile raggiungere il server.",
      },
      unauthorized: {
        title: "Accesso richiesto",
        description: "Accedi per esportare questa skill.",
      },
      forbidden: {
        title: "Non consentito",
        description: "Non puoi esportare questa skill.",
      },
      notFound: {
        title: "Skill non trovata",
        description: "Questa skill non esiste o non è visibile per te.",
      },
      server: {
        title: "Esportazione non riuscita",
        description: "Qualcosa è andato storto nel creare la scheda. Riprova.",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto.",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate.",
      },
      conflict: {
        title: "Conflitto",
        description: "La skill è cambiata durante l'esportazione. Riprova.",
      },
    },
    success: {
      title: "Scheda pronta",
      description: "Scaricala o copia il JSON.",
    },
  },
};
