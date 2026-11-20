import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Abbonamenti",
  tags: {
    subscription: "subscription",
    admin: "admin",
  },
  post: {
    title: "Piani annuali: Crediti mensili",
    titleShort: "Crediti annuali",
    description:
      "Assegna i crediti di questo mese a ogni piano annuale. L’operazione parte ogni giorno. I crediti vengono assegnati una sola volta e scadono a fine mese.",
    response: {
      scanned: "Piani annuali controllati",
      granted: "Mesi accordati ora",
      credits: "Crediti concessi",
    },
    widget: {
      hint: "Corri ogni giorno da solo. Sicuro da eseguire a mano: un mese non è mai concesso due volte.",
      submit: "Concedere questo mese",
      summary:
        "Piani annuali {{scanned}} controllati, mesi {{granted}} concessi, crediti {{credits}}",
    },
  },
  task: {
    description: "Assegna i crediti mensili ai piani annuali",
  },
  backfill: {
    title: "Piani annuali: Backfill Mesi mancati",
    titleShort: "Riempimento annuale",
    description:
      "Elenca i mesi del periodo annuale corrente in cui non sono stati assegnati crediti. Disattiva la simulazione per assegnarli una sola volta in un pacchetto che scade alla fine del periodo.",
    fields: {
      dryRun: {
        label: "Simulazione",
        description: "Elenco di ciò che sarebbe concesso senza concedere",
      },
    },
    response: {
      dryRun: "Simulazione",
      subscriptions: "Abbonamenti",
      months: "Mesi mancanti",
      credits: "Crediti",
      rows: "Abbonamenti",
      subscriptionId: "Abbonamento",
      userEmail: "Utente",
      plan: "Piano",
      periodStart: "Inizio periodo",
      periodEnd: "Periodo",
      currentMonth: "Mese attuale",
      missedMonths: "Mesi mancanti",
      status: "Stato",
    },
    widget: {
      hint: "Controlla prima la pista secca. La sovvenzione viene eseguita una volta per abbonamento e per periodo; ripetendo non aggiunge nulla.",
      submit: "Correre il backup",
      preview:
        "A secco: abbonamenti {{subscriptions}}, {{months}} mesi mancati, crediti {{credits}} sarebbe concesso.",
      done: "Concessa: abbonamenti {{subscriptions}}, mesi {{months}}, crediti {{credits}}.",
    },
  },
  errors: {
    validation: {
      title: "Input non valido",
      description: "Controllare la richiesta",
    },
    unauthorized: {
      title: "Non firmato",
      description: "Iscriviti come amministratore",
    },
    forbidden: {
      title: "Admins solo",
      description: "Solo gli amministratori possono concedere crediti di piano",
    },
    notFound: {
      title: "Account o sessione non trovati",
      description: "Risorsa non trovata",
    },
    conflict: {
      title: "Conflitto",
      description: "I dati sono cambiati nel frattempo, correte di nuovo",
    },
    server: {
      title: "Errore del server",
      description: "I crediti annuali non possono essere concessi",
      detail: "Crediti annuali falliti: {{error}}",
    },
    network: {
      title: "Errore di rete",
      description: "Richiesta non ha raggiunto il server",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Qualcosa di imprevisto è fallito",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Salvare o scartare le modifiche prima",
    },
  },
  success: {
    title: "Fatto",
    description: "Crediti annuali trattati",
  },
};
