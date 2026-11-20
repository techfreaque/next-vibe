import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  patch: {
    title: "Modifica account",
    titleShort: "Modifica account",
    description:
      "Aggiorna il nome dell'account, la descrizione o l'ordine ordinario. Il tipo e il sottotipo non possono essere modificati sui conti di sistema.",
    accountId: {
      label: "Account",
      description: "L'account per modificare",
      placeholder: "Account UUID",
    },
    code: {
      label: "Codice",
      description: "Codice dell'account",
    },
    type: {
      label: "Tipologia",
      description: "Tipo di conto",
    },
    subtype: {
      label: "Sottotitoli",
      description: "Sottotipo di conto",
    },
    isSystem: {
      label: "Account di sistema",
      description: "Che si tratti di un account di sistema",
    },
    isActive: {
      label: "Attivo",
      description: "Se questo account è attivo",
    },
    name: {
      label: "Nome del conto",
      description: "Visualizza nome per questo account",
      placeholder: "ad es. Conti crediti",
    },
    accountDescription: {
      label: "Designazione",
      description: "Note opzionali sullo scopo di questo account",
      placeholder: "ad es. Tracce importi dovuti da parte dei clienti",
    },
    sortOrder: {
      label: "Ordinare",
      description:
        "Ordine di visualizzazione all'interno del gruppo genitore. i numeri più bassi appaiono prima",
      placeholder: "ad esempio 10",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Login richiesto",
      },
      validation: {
        title: "Errore di convalida",
        description: "Controlla tutti i campi",
      },
      forbidden: {
        title: "Accesso negato",
        description:
          "Non è possibile modificare i campi dell'account di sistema",
      },
      server: {
        title: "Errore del server",
        description: "Non è possibile aggiornare l'account",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
      network: {
        title: "Errore di rete",
        description: "Non è possibile raggiungere il server",
      },
      notFound: { title: "Non trovato", description: "Account non trovato" },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Aggiornamento del conto",
      description: "Modifiche salvate",
    },
    widget: {
      savedLabel: "Salvataggio",
      failedLabel: "Sfigato",
      back: "Indietro",
      submit: "Salvare le modifiche",
      viewAccount: "Visualizza Account",
      successTitle: "Modifiche salvate",
      successDesc: "L'account è stato aggiornato.",
      systemNotice: "Conto di sistema. tipo e sottotipo sono bloccati.",
      inactiveNotice: "Questo account è inattivo.",
      selectPrompt: "Scegli un account per modificare",
    },
  },
  title: "Modifica account",
  description: "Modifica dei dettagli dell'account",
  category: "Grafico dei conti",
  tag: "Account",
};
