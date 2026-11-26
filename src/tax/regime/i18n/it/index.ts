import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    validation: {
      title: "Errore di convalida",
      description:
        "Verifichi il paese dell’azienda, il regime IVA e la data di decorrenza.",
    },
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Devi essere connesso",
    },
    forbidden: {
      title: "Accesso negato",
      description:
        "Solo i titolari e gli amministratori dell’azienda possono cambiare il regime IVA.",
    },
    notFound: { title: "Non trovato", description: "Società non trovata" },
    conflict: {
      title: "Data di decorrenza già utilizzata",
      description: "Per questa data è già stato registrato un regime IVA.",
    },
    server: {
      title: "Errore del server",
      description: "Si è verificato un errore interno",
    },
    network: {
      title: "Errore di rete",
      description: "Si è verificato un errore di rete",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Si è verificato un errore imprevisto",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Hai modifiche non salvate",
    },
  },
  reviewDescription:
    "Verifica il regime IVA applicabile all’azienda alla data selezionata.",
  view: "Consulta il regime IVA",
  asOf: "Alla data del",
  change: "Modifica il regime fiscale",
  regimes: {
    standard: "Regime IVA ordinario",
    german: "Germania: esenzione per piccole imprese (§ 19 UStG)",
    austrian:
      "Austria: esenzione per piccole imprese (§ 6, comma 1, n. 27 UStG)",
    slovak: "Slovacchia: impresa non registrata ai fini IVA",
  },
  title: "Regime IVA aziendale",
  description:
    "Scegli il trattamento IVA dei documenti a partire dalla data indicata.",
  company: "Azienda",
  from: "In vigore dal",
  save: "Salva regime IVA",
  regime: "Trattamento IVA",
  saved: "Il regime si applica dalla data selezionata.",
  conflict: "Scegli un’altra data o verifica il regime già registrato.",
  foreign:
    "Consulta il commercialista per i servizi acquistati all’estero. L’inversione contabile può applicarsi anche alle piccole imprese esenti.",
  saleConflict:
    "L’IVA addebitata è incompatibile con l’esenzione. Verifica le voci prima di emettere la fattura.",
  choose: "Scegli il regime IVA",
  back: "Indietro",
  appliesOn: "Regime IVA al {{date}}",
  invoiceText: "Dicitura in fattura",
  savedTitle: "{{regime}} si applica dal {{date}}",
  pickCompany: {
    title: "Scegli un’azienda",
    message:
      "Scopri quali regole IVA valgono per le sue fatture in una data qualsiasi.",
  },
  hints: {
    standard:
      "Le fatture applicano l’IVA alle aliquote dell’azienda. L’IVA sugli acquisti è detraibile.",
    german: "Fatture senza IVA, con la dicitura di esenzione del § 19 UStG.",
    austrian:
      "Fatture senza IVA, con la dicitura del regime austriaco per piccole imprese.",
    slovak: "Fatture senza IVA, perché l’impresa non è registrata ai fini IVA.",
  },
};
