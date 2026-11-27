import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Pagamenti",
  tags: {
    payment: "payment",
    admin: "admin",
  },
  post: {
    title: "Sincronizza catalogo Whop",
    titleShort: "Catalogo Whop",
    description:
      "Crea ogni piano e pacchetto di crediti nell'account Whop collegato: un prodotto per piano, una variante per intervallo, valuta e prezzo, ritrovata tramite la nostra chiave nei metadati. Idempotente. La prova a vuoto elenca cosa esiste e cosa manca.",
    fields: {
      dryRun: {
        label: "Prova a vuoto",
        description: "Elenca le varianti senza creare nulla",
      },
    },
    response: {
      dryRun: "Prova a vuoto",
      environment: "Ambiente Whop",
      accountId: "Account Whop",
      existing: "Già presenti",
      created: "Create ora",
      missing: "Mancanti",
      variants: "Varianti",
      key: "Chiave",
      variantId: "ID variante",
      productId: "Prodotto Whop",
      amount: "Importo",
      status: "Stato",
      purchaseUrl: "Link di acquisto",
    },
    widget: {
      hint: "Eseguilo una volta per account Whop dopo un cambio di prezzi. Il checkout crea comunque la variante mancante al primo acquisto.",
      submit: "Sincronizza catalogo",
      summary:
        "Whop {{environment}} ({{accountId}}): {{existing}} presenti, {{created}} create, {{missing}} mancanti",
    },
  },
  errors: {
    validation: {
      title: "Dati non validi",
      description: "Controlla la richiesta",
    },
    unauthorized: {
      title: "Accesso non effettuato",
      description: "Accedi come admin",
    },
    forbidden: {
      title: "Solo admin",
      description: "Solo gli admin sincronizzano il catalogo Whop",
    },
    notFound: { title: "Non trovato", description: "Risorsa non trovata" },
    conflict: {
      title: "Conflitto",
      description: "Whop è cambiato nel frattempo. Riprova.",
    },
    server: {
      title: "Errore del server",
      description: "Impossibile sincronizzare il catalogo Whop",
    },
    network: {
      title: "Errore di rete",
      description: "La richiesta non ha raggiunto il server",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Qualcosa è andato storto",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Salva o annulla prima le modifiche",
    },
    notConfigured:
      "Whop non è configurato (manca la chiave API del WHOP_ENVIRONMENT attivo)",
    syncFailed: "Sincronizzazione del catalogo Whop non riuscita: {{error}}",
  },
  success: {
    title: "Fatto",
    description: "Catalogo Whop controllato",
  },
};
