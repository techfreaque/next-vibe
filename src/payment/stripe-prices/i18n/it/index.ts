import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Pagamenti",
  tags: {
    payment: "payment",
    admin: "admin",
  },
  post: {
    title: "Assicurare i prezzi Stripe",
    titleShort: "Stripe Prezzi",
    description:
      "Crea nell’account Stripe collegato i prezzi dei piani e dei pacchetti di crediti per ogni valuta e lingua. Cerca i prezzi per chiave. Puoi ripetere l’operazione senza creare duplicati e lasciare gli ID prezzo fuori dal file .env. La simulazione elenca i prezzi esistenti e quelli mancanti.",
    fields: {
      dryRun: {
        label: "Simulazione",
        description: "Elenca i prezzi senza creare nulla",
      },
    },
    response: {
      dryRun: "Simulazione",
      stripeMode: "Modalità Stripe",
      existing: "Ci siamo gia'.",
      created: "Creato ora",
      missing: "Mancato",
      prices: "Prezzi",
      lookupKey: "chiave di ricerca",
      priceId: "Prezzo ID",
      productId: "Prodotto ID",
      amount: "Importo",
      status: "Stato",
    },
    widget: {
      hint: "Eseguire una volta per conto Stripe dopo il cambio dei prezzi. Checkout crea anche un prezzo mancante sul primo utilizzo.",
      submit: "Assicurare prezzi",
      summary:
        "Stripe {{mode}}: {{existing}} esistente, {{created}} creato, {{missing}} mancante",
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
      description: "Solo gli amministratori possono gestire i prezzi Stripe",
    },
    notFound: {
      title: "Account o sessione non trovati",
      description: "Risorsa non trovata",
    },
    conflict: {
      title: "Conflitto",
      description: "Stripe è cambiato nel frattempo, correre di nuovo",
    },
    server: {
      title: "Errore del server",
      description: "I prezzi Stripe non potrebbero essere garantiti",
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
    notConfigured: "Stripe non è configurato (STRIPE_SECRET_KEY mancante)",
  },
  success: {
    title: "Fatto",
    description: "Prezzi Stripe controllati",
  },
};
