import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Periodo di contabilità aperto",
    titleShort: "Nuovo periodo",
    description: "Creare un nuovo periodo contabile per una società",
    companyId: {
      label: "Società",
      description: "Società di aprire il periodo per",
      placeholder: "Scegli una società",
    },
    name: {
      label: "Nome del periodo",
      description: "ad esempio. Gennaio 2026",
      placeholder: "Gennaio 2026",
    },
    startDate: {
      label: "Data di inizio",
      description: "Data di inizio periodo",
      placeholder: "",
    },
    endDate: {
      label: "Data di fine",
      description: "Data di fine periodo",
      placeholder: "",
    },
    response: { id: "Periodo ID", name: "Nome" },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Login richiesto",
      },
      validation: {
        title: "Errore di convalida",
        description: "Controllare le date di inizio/fine",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Autorizzazioni insufficienti",
      },
      server: {
        title: "Errore del server",
        description: "Non è possibile creare il periodo",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      conflict: {
        title: "Overlap",
        description: "La data range si sovrappone con il periodo esistente",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile raggiungere il server",
      },
      notFound: { title: "Non trovato", description: "Società non trovata" },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Periodo Creato",
      description: "Periodo di contabilità aperto",
    },
    widget: {
      viewButton: "Periodo di visita",
      back: "Indietro",
    },
  },
  title: "Creare un periodo",
  description: "Aprire un nuovo periodo contabile",
  category: "Grafico dei conti",
  tag: "Periodo",
};
