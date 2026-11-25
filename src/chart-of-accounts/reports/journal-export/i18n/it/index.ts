import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Esportazione CSV del giornale",
  description:
    "Esporta le righe contabilizzate e i relativi storni per un’azienda e una valuta.",
  company: "Azienda",
  currency: "Valuta",
  currencyHint: "Inserisci un codice valuta di tre lettere, per esempio EUR.",
  otherCurrency: "Altra valuta",
  debitCount: "Righe in dare",
  creditCount: "Righe in avere",
  invalidLine: "Una riga salvata ha un’indicazione dare o avere non valida.",
  from: "Dal",
  to: "Al",
  prepare: "Prepara CSV",
  preparing: "Preparazione del CSV…",
  download: "Scarica CSV",
  copy: "Copia CSV",
  copied: "CSV copiato",
  copyFailed: "Impossibile copiare il CSV. Riprova.",
  filename: "Nome file",
  rowCount: "Righe del giornale",
  invalidDates:
    "Seleziona un intervallo valido. La data finale non può precedere quella iniziale.",
  tooLarge:
    "L’esportazione supera 10.000 righe o 5 MiB. Seleziona un intervallo più breve.",
  ready: "CSV pronto",
  headerEntry: "Numero registrazione",
  headerDate: "Data contabile",
  headerPosted: "Registrato alle (UTC)",
  headerSource: "Origine",
  headerAccountCode: "Codice conto",
  headerAccountName: "Nome conto",
  headerDescription: "Descrizione registrazione",
  headerLineDescription: "Descrizione riga",
  headerCurrency: "Valuta",
  headerDebit: "Dare",
  headerCredit: "Avere",
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
      description: "Autorizzazioni insufficienti",
    },
    server: {
      title: "Errore del server",
      description: "Operazione fallita. si prega di riprovare",
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
    notFound: { title: "Non trovato", description: "Risorsa non trovata" },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Hai modifiche non salvate",
    },
  },
  tags: { journal: "journal", export: "export" },
};
