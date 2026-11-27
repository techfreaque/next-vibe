import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Riservatezza bancaria",
  description:
    "Controlla i movimenti dei conti misti prima di inviarli alla contabilità.",
  connection: "Connessione bancaria",
  empty: "Non ci sono movimenti da controllare per questa connessione.",
  selectConnection:
    "Scegli una connessione bancaria per vedere le impostazioni.",
  policy: "Impostazioni di riservatezza",
  policyDescription: "Decidi quali movimenti possono entrare in contabilità.",
  mode: "Modalità",
  retention: "Conservazione in giorni",
  rules: "Regole",
  suggestions: "Fornitori suggeriti",
  inbox: "Movimenti da controllare",
  decision: "Decisione sul movimento",
  decisionDescription:
    "Importa il movimento aziendale oppure cancella i dettagli di quello privato.",
  operation: "Azione sulla regola",
  ruleField: "Campo da confrontare",
  ruleMatch: "Tipo di corrispondenza",
  literal: "Testo da confrontare",
  outcome: "Esito",
  ruleSupplier: "Fornitore per i totali (facoltativo)",
  chooseSupplier: "Scegli fornitore",
  clearSupplier: "Rimuovi fornitore",
  identity: "Identificativo del movimento",
  always: "Applica sempre questa decisione a questa controparte precisa",
  apply: "Applica",
  saved: "Salvato",
  ruleSaved: "Regola salvata",
  ruleFailed: "Decisione salvata. Non è stato possibile salvare la regola.",
  addSuggestion: "Aggiungi come regola aziendale",
  editPolicy: "Modifica le impostazioni",
  editRule: "Aggiungi o modifica una regola",
  approving: "Importazione aziendale in attesa",
  privateAction: "Mantieni privato questo movimento",
  businessAction: "Invia alla contabilità",
  expires: "Scade il {{date}}",
  businessExplanation:
    "In modalità aziendale i nuovi movimenti senza regola entrano in contabilità.",
  modes: {
    mixed: "Conto misto",
    business: "Conto esclusivamente aziendale",
  },
  outcomes: {
    business: "Aziendale",
    private: "Privato",
  },
  ruleFields: {
    counterparty: "Controparte",
    iban: "IBAN",
    description: "Descrizione",
  },
  matches: {
    equals: "Esatta",
    contains: "Contiene",
    startsWith: "Inizia con",
  },
  operations: {
    policy: "Modifica le impostazioni",
    set: "Aggiungi o sostituisci la regola",
    remove: "Rimuovi la regola",
  },
  errors: {
    forbidden: "Questa connessione bancaria non ti appartiene.",
    invalid: "Controlla i campi e riprova.",
    conflict: "Il movimento è cambiato o la prova è scaduta.",
    unavailable: "Operazione di riservatezza non completata.",
    import: "Impossibile importare il movimento approvato.",
  },
  firstSetupHint:
    "Il filtro per la riservatezza è attivo. Nel libro mastro entrano solo le operazioni che corrispondono alle regole aziendali. Quelle private o sconosciute vengono scartate. Scegli quindi i fornitori da includere.",
};
